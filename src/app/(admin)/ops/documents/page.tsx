'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileDown, UploadCloud, Folder, Search, Trash2, RefreshCcw, Archive } from 'lucide-react';
import styles from '@/features/portfolio/components/PortfolioList.module.css';

type DocumentItem = {
    id: string;
    clientName: string;
    name: string;
    type: string;
    date: string;
    size: string;
    isDeleted: boolean;
    fileData?: string; // base64 data URL
};

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [viewMode, setViewMode] = useState<'active' | 'recycle'>('active');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('rbos_documents');
        if (saved) {
            setDocuments(JSON.parse(saved));
        } else {
            setDocuments([
                { id: '1', clientName: 'Admin', name: 'Brand Positioning Plan V2.pdf', type: 'PDF', date: 'Oct 12, 2026', size: '2.4 MB', isDeleted: false },
                { id: '2', clientName: 'Acme Corp', name: 'Q3 Financial Matrix.xlsx', type: 'Spreadsheet', date: 'Oct 05, 2026', size: '150 KB', isDeleted: false },
            ]);
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (documents.length > 0) {
            localStorage.setItem('rbos_documents', JSON.stringify(documents));
        }
    }, [documents]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const clientName = window.prompt("Enter Client Name for this document:");
            if (!clientName) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                const newDoc: DocumentItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    clientName: clientName,
                    name: file.name,
                    type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    size: file.size < 1024 * 1024
                        ? (file.size / 1024).toFixed(1) + ' KB'
                        : (file.size / 1024 / 1024).toFixed(2) + ' MB',
                    isDeleted: false,
                    fileData: ev.target?.result as string,
                };
                setDocuments(prev => [newDoc, ...prev]);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to move "${name}" to the Recycle Bin?`)) {
            setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isDeleted: true } : doc));
        }
    };

    const handleRestore = (id: string) => {
        setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isDeleted: false } : doc));
    };

    const handlePermanentDelete = (id: string, name: string) => {
        if (window.confirm(`PERMANENTLY delete "${name}"? This cannot be undone.`)) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        }
    };

    const handleDownload = (doc: DocumentItem) => {
        if (!doc.fileData) {
            alert('No file data available for download. Please re-upload this document.');
            return;
        }
        const a = document.createElement('a');
        a.href = doc.fileData;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const displayedDocs = documents.filter(doc => viewMode === 'active' ? !doc.isDeleted : doc.isDeleted);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Documents Hub</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {viewMode === 'active' ? 'Internal knowledge base and client files' : 'Recycle Bin - Deleted Files'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setViewMode(viewMode === 'active' ? 'recycle' : 'active')}
                        style={{
                            background: 'transparent', border: '1px solid var(--surface-border)',
                            color: 'var(--text-primary)', padding: '10px 16px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}
                    >
                        {viewMode === 'active' ? <Trash2 size={16} /> : <Folder size={16} />}
                        {viewMode === 'active' ? 'View Recycle Bin' : 'Back to Active Files'}
                    </button>

                    {viewMode === 'active' && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <button className={styles.btnPrimary} onClick={handleUploadClick}>
                                <UploadCloud size={16} />
                                Upload File
                            </button>
                        </>
                    )}
                </div>
            </header>

            {viewMode === 'active' && (
                <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', padding: '8px 12px', borderRadius: '8px' }}>
                        <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                        <input type="text" placeholder="Search active documents..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Client / Association</th>
                            <th>Date Modified</th>
                            <th>Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedDocs.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                    {viewMode === 'active' ? 'No active documents.' : 'Recycle bin is empty.'}
                                </td>
                            </tr>
                        ) : (
                            displayedDocs.map(doc => (
                                <tr key={doc.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {viewMode === 'recycle' ? <Archive size={18} style={{ color: '#ef4444' }} /> : <Folder size={18} style={{ color: 'var(--color-primary)' }} />}
                                            <div style={{ fontWeight: 600, color: viewMode === 'recycle' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                                {doc.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={styles.tagBadge}>{doc.clientName}</span></td>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{doc.date}</span></td>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{doc.size}</span></td>
                                    <td>
                                        <div className={styles.actions}>
                                            {viewMode === 'active' ? (
                                                <>
                                                    <button className={styles.actionBtn} title="Download" onClick={() => handleDownload(doc)}>
                                                        <FileDown size={16} />
                                                    </button>
                                                    <button className={styles.actionBtn} title="Move to Recycle Bin" onClick={() => handleDelete(doc.id, doc.name)}>
                                                        <Trash2 size={16} style={{ color: '#ef4444' }} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={styles.actionBtn} title="Restore File" onClick={() => handleRestore(doc.id)}>
                                                        <RefreshCcw size={16} style={{ color: '#10b981' }} />
                                                    </button>
                                                    <button className={styles.actionBtn} title="Permanently Delete" onClick={() => handlePermanentDelete(doc.id, doc.name)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
