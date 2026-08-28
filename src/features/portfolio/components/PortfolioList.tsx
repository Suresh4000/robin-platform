'use client';

import React, { useEffect, useState } from 'react';
import { Plus, CheckSquare, Edit, Globe } from 'lucide-react';
import styles from './PortfolioList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { PortfolioForm } from './PortfolioForm';

type PortfolioItem = {
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
    tags: string;
};

export function PortfolioList() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

    const openEditModal = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const fetchItems = () => {
        setIsLoading(true);
        fetch('/api/content/portfolio')
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
                    <h1 className={styles.title}>Portfolio CMS</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage public case studies and success records
                    </p>
                </div>
                <button className={styles.btnPrimary} onClick={openCreateModal}>
                    <Plus size={16} />
                    New Entry
                </button>
            </header>

            {isLoading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading items...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title & Slug</th>
                                <th>Tags</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                        No portfolio entries created yet.
                                    </td>
                                </tr>
                            ) : items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/{item.slug}</div>
                                    </td>
                                    <td>
                                        <div className={styles.tagList}>
                                            {item.tags.split(',').map(tag => (
                                                <span key={tag} className={styles.tagBadge}>{tag.trim()}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${item.status === 'Published' ? styles.statusActive : ''}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} title="Edit Item" onClick={() => openEditModal(item)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className={styles.actionBtn} title="View public URL">
                                                <Globe size={16} />
                                            </button>
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
                title={editingItem ? "Edit Portfolio Entry" : "Create Portfolio Entry"}
            >
                <PortfolioForm
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
