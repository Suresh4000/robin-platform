'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Globe } from 'lucide-react';
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

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Blog CMS</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage thought leadership and execution logs
                    </p>
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
                            ) : items.map(item => (
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
                                            <button className={styles.actionBtn} title="Edit Post" onClick={() => openEditModal(item)}>
                                                <Edit size={16} />
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
