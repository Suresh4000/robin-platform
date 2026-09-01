'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Globe, Trash2, RefreshCw } from 'lucide-react';
import styles from '@/features/portfolio/components/PortfolioList.module.css'; // Reusing layout
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { BlogForm } from './BlogForm';

type BlogPost = {
    id: string;
    title: string;
    slug: string;
    status: string;
    category: string;
    publishedAt: string | null;
};

export function BlogList() {
    const [items, setItems] = useState<BlogPost[]>([]);
    const [view, setView] = useState<'Active' | 'Trash'>('Active');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BlogPost | null>(null);

    const openEditModal = (item: BlogPost) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const fetchItems = () => {
        setIsLoading(true);
        fetch('/api/content/blog')
            .then(res => res.json())
            .then(data => {
                if (data.data) setItems(data.data);
                setIsLoading(false);
            });
    };

    const handleMoveToTrash = async (id: string, title: string) => {
        if (!confirm(`Move "${title}" to Trash?`)) return;
        try {
            const res = await fetch(`/api/content/blog/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Trash' })
            });
            if (res.ok) fetchItems();
        } catch (e) {
            console.error(e);
        }
    };

    const handleRestore = async (id: string, title: string) => {
        try {
            const res = await fetch(`/api/content/blog/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Draft' })
            });
            if (res.ok) fetchItems();
        } catch (e) {
            console.error(e);
        }
    };

    const handleHardDelete = async (id: string, title: string) => {
        if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/content/blog/${id}`, { method: 'DELETE' });
            if (res.ok) fetchItems();
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Blog CMS</h1>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                        <button
                            onClick={() => setView('Active')}
                            style={{ background: 'none', border: 'none', color: view === 'Active' ? 'var(--brass-deep)' : 'var(--text-secondary)', fontWeight: view === 'Active' ? 600 : 400, cursor: 'pointer', padding: 0 }}
                        >Active ({items.filter(i => i.status !== 'Trash').length})</button>
                        <button
                            onClick={() => setView('Trash')}
                            style={{ background: 'none', border: 'none', color: view === 'Trash' ? 'var(--brass-deep)' : 'var(--text-secondary)', fontWeight: view === 'Trash' ? 600 : 400, cursor: 'pointer', padding: 0 }}
                        >Trash ({items.filter(i => i.status === 'Trash').length})</button>
                    </div>
                </div>
                <button className={styles.btnPrimary} onClick={openCreateModal}>
                    <Plus size={16} />
                    New Post
                </button>
            </header>

            {isLoading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading posts...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title & Slug</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                        No blog posts published yet.
                                    </td>
                                </tr>
                            ) : (view === 'Active' ? items.filter(i => i.status !== 'Trash') : items.filter(i => i.status === 'Trash')).map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/{item.slug}</div>
                                    </td>
                                    <td>
                                        <span className={styles.tagBadge}>{item.category}</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${item.status === 'Published' ? styles.statusActive : ''}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            {view === 'Active' ? (
                                                <>
                                                    <button className={styles.actionBtn} title="Edit Post" onClick={() => openEditModal(item)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className={styles.actionBtn} title="Move to Trash" onClick={() => handleMoveToTrash(item.id, item.title)} style={{ color: '#ef4444' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <a
                                                        href={`/blog/${item.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.actionBtn}
                                                        title="View Live Post"
                                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <Globe size={16} />
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={styles.actionBtn} title="Restore" onClick={() => handleRestore(item.id, item.title)}>
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button className={styles.actionBtn} title="Delete Forever" onClick={() => handleHardDelete(item.id, item.title)} style={{ color: '#ef4444' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <SlideDrawer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Blog Post" : "Draft New Post"}
            >
                <BlogForm
                    initialData={editingItem}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchItems();
                    }}
                />
            </SlideDrawer>
        </div>
    );
}
