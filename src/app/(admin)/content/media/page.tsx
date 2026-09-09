'use client';
import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Trash2, RefreshCcw, Eye, Copy, Filter, FileText, Image as ImageIcon } from 'lucide-react';
import styles from './Media.module.css';

interface MediaItem {
    id: string;
    filename: string;
    type: string;
    size: number;
    url: string;
    isDeleted: boolean;
    createdAt: string;
    isUsedOnWebsite: boolean;
}

export default function MediaPage() {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [viewDeleted, setViewDeleted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
        try {
            const res = await fetch(`/api/content/media?viewDeleted=${viewDeleted}`);
            if (res.ok) {
                const data = await res.json();
                setMediaList(data);
            }
        } catch (e) {
            console.error('Failed to load media');
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [viewDeleted]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit size to ~5MB for Base64 (Neon/Vercel Postgres text limits)
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Please keep it under 5MB.");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                const res = await fetch('/api/content/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: file.name,
                        type: file.type,
                        size: file.size,
                        data: base64String,
                    })
                });

                if (res.ok) {
                    fetchMedia();
                } else {
                    alert("Upload failed.");
                }
            } catch (error) {
                alert("Upload error.");
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSoftDelete = async (id: string) => {
        if (!confirm('Move this item to trash?')) return;
        await fetch(`/api/content/media/${id}`, { method: 'DELETE' });
        fetchMedia();
    };

    const handleRestore = async (id: string) => {
        await fetch(`/api/content/media/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'restore' })
        });
        fetchMedia();
    };

    const handleHardDelete = async (id: string) => {
        if (!confirm('Permanently delete this item? This cannot be undone.')) return;
        await fetch(`/api/content/media/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'hard_delete' })
        });
        fetchMedia();
    };

    const copyToClipboard = (text: string) => {
        const fullUrl = `${window.location.origin}${text}`;
        navigator.clipboard.writeText(fullUrl);
        alert('Copied URL to clipboard: ' + fullUrl);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Media Library</h1>
                    <p className={styles.subtitle}>Upload images and documents to use across the platform.</p>
                </div>
                <div className={styles.actions}>
                    <button
                        className={viewDeleted ? styles.btnOutlineActive : styles.btnOutline}
                        onClick={() => setViewDeleted(!viewDeleted)}
                    >
                        <Filter size={16} />
                        {viewDeleted ? 'Viewing Trash' : 'View Trash'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                    />
                    <button
                        className={styles.btnPrimary}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <UploadCloud size={16} />
                        {uploading ? 'Uploading...' : 'Upload Media'}
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {mediaList.map((media) => (
                    <div key={media.id} className={styles.card}>
                        <div className={styles.preview}>
                            <div className={`${styles.badge} ${media.isUsedOnWebsite ? styles.badgeWebsite : styles.badgeAdmin}`}>
                                {media.isUsedOnWebsite ? 'Website' : 'Admin'}
                            </div>
                            {media.type.startsWith('image/') ? (
                                <img src={media.url} alt={media.filename} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                            ) : (
                                <FileText size={48} className={styles.placeholderIcon} />
                            )}
                        </div>
                        <div className={styles.details}>
                            <h3 className={styles.filename} title={media.filename}>{media.filename}</h3>
                            <div className={styles.meta}>
                                {formatBytes(media.size)} • {new Date(media.createdAt).toLocaleDateString()}
                            </div>
                            <div className={styles.cardActions}>
                                {!media.isDeleted ? (
                                    <>
                                        <button className={styles.iconBtn} title="Copy URL" onClick={() => copyToClipboard(media.url)}>
                                            <Copy size={14} />
                                        </button>
                                        <button className={styles.iconBtn} title="View" onClick={() => window.open(media.url, '_blank')}>
                                            <Eye size={14} />
                                        </button>
                                        <button className={styles.iconBtnDanger} title="Trash" onClick={() => handleSoftDelete(media.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className={styles.iconBtn} title="Restore" onClick={() => handleRestore(media.id)}>
                                            <RefreshCcw size={14} /> Restore
                                        </button>
                                        <button className={styles.iconBtnDanger} title="Delete Permanently" onClick={() => handleHardDelete(media.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {mediaList.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#6A707E', background: '#fff', borderRadius: '12px', border: '1px solid #E2E4E9' }}>
                        <ImageIcon size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <h3>{viewDeleted ? 'Trash is empty' : 'No media uploaded'}</h3>
                        <p style={{ fontSize: '14px', marginTop: '6px' }}>
                            {viewDeleted ? 'No deleted items found.' : 'Upload images or documents to get started.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
