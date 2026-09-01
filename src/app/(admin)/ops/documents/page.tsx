'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileDown, UploadCloud, Folder, Search, Trash2, RefreshCcw, Archive, Filter } from 'lucide-react';
import styles from '@/features/portfolio/components/PortfolioList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';

type DocumentItem = {
    id: string;
    clientName: string;
    name: string;
    type: string;
    date: string;
    size: string;
    isDeleted: boolean;
    projectName?: string;
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
                { id: '1', clientName: 'Admin', projectName: 'Internal', name: 'Brand Positioning Plan V2.pdf', type: 'PDF', date: 'Oct 12, 2026', size: '2.4 MB', isDeleted: false },
                { id: '2', clientName: 'Acme Corp', projectName: 'Website Redesign', name: 'Q3 Financial Matrix.xlsx', type: 'Spreadsheet', date: 'Oct 05, 2026', size: '150 KB', isDeleted: false },
            ]);
        }
        fetchProjects();
        fetchClients();
    }, []);

    const [projects, setProjects] = useState<{ id: string, title: string }[]>([]);
    const [clients, setClients] = useState<{ id: string, name: string }[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadClientName, setUploadClientName] = useState('');
    const [uploadProjectName, setUploadProjectName] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [activeFilterName, setActiveFilterName] = useState('');
    const [activeFilterProject, setActiveFilterProject] = useState('');

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/ops/projects');
            const data = await res.json();
            if (data.data) {
                setProjects(data.data.map((p: any) => ({ id: p.id, title: p.title })));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/crm/clients');
            const data = await res.json();
            if (data.data) {
                setClients(data.data.map((c: any) => ({ id: c.id, name: c.name })));
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Save to local storage on change
    useEffect(() => {
        if (documents.length > 0) {
            localStorage.setItem('rbos_documents', JSON.stringify(documents));
        }
    }, [documents]);

    const handleUploadClick = () => {
        setIsUploadModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!uploadClientName) {
                alert("Please enter a client name.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                const newDoc: DocumentItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    clientName: uploadClientName,
                    projectName: uploadProjectName,
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
                setIsUploadModalOpen(false);
                setUploadClientName('');
                setUploadProjectName('');
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

    const applyFilters = () => {
        setActiveFilterName(filterName.toLowerCase());
        setActiveFilterProject(filterProject);
    };

    const displayedDocs = documents.filter(doc => {
        if (viewMode === 'active' && doc.isDeleted) return false;
        if (viewMode === 'recycle' && !doc.isDeleted) return false;

        if (activeFilterName && !doc.name.toLowerCase().includes(activeFilterName) && !doc.clientName.toLowerCase().includes(activeFilterName)) return false;
        if (activeFilterProject && doc.projectName !== activeFilterProject) return false;

        return true;
    });

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
                <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', padding: '8px 12px', borderRadius: '8px' }}>
                        <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                        <input type="text" placeholder="Search by name or client..." value={filterName} onChange={e => setFilterName(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
                    </div>
                    <select
                        value={filterProject}
                        onChange={e => setFilterProject(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface-default)' }}
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.title}>{p.title}</option>
                        ))}
                    </select>
                    <button
                        onClick={applyFilters}
                        style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Filter size={16} /> Filter
                    </button>
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
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className={styles.tagBadge}>{doc.clientName}</span>
                                            {doc.projectName && <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{doc.projectName}</span>}
                                        </div>
                                    </td>
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

            <SlideDrawer isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Client Name *</label>
                        <input
                            type="text"
                            list="client-list"
                            value={uploadClientName}
                            onChange={e => setUploadClientName(e.target.value)}
                            placeholder="Select or type a Client"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}
                        />
                        <datalist id="client-list">
                            {clients.map(c => (
                                <option key={c.id} value={c.name} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Project (Optional)</label>
                        <select
                            value={uploadProjectName}
                            onChange={e => setUploadProjectName(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}
                        >
                            <option value="">None</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.title}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Select File</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ padding: '8px 0' }}
                        />
                    </div>
                </div>
            </SlideDrawer>
        </div>
    );
}
