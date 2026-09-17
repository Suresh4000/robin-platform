'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/features/portfolio/components/PortfolioList.module.css';
import { Trash2, History, RefreshCcw, CheckSquare, Square } from 'lucide-react';

type HistoryItem = {
    id: string;
    type: string;
    title: string;
    date: Date;
};

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/ops/history');
            const data = await res.json();
            if (data.data) {
                setItems(data.data.map((item: any) => ({
                    ...item,
                    date: new Date(item.date)
                })));
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredItems = items.filter(item => activeFilter === 'All' ? true : item.type === activeFilter);
    const filterOptions = ['All', 'Lead', 'Project', 'Task', 'Invoice', 'Event'];

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredItems.length && filteredItems.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredItems.map(i => i.id)));
        }
    };

    const handleBulkAction = async (action: 'restore' | 'delete') => {
        if (selectedIds.size === 0) return;
        const msg = action === 'restore'
            ? `Restore ${selectedIds.size} selected items?`
            : `Permanently delete ${selectedIds.size} items? This cannot be undone.`;
        if (!confirm(msg)) return;

        const itemsToProcess = Array.from(selectedIds).map(id => {
            const item = items.find(i => i.id === id);
            return { id, type: item?.type };
        });

        try {
            const res = await fetch('/api/ops/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: itemsToProcess, action })
            });
            if (res.ok) {
                setSelectedIds(new Set());
                fetchHistory();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>System History & Recycle Bin</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        View recent updates and recover deleted items across all modules
                    </p>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {filterOptions.map(filter => (
                    <button
                        key={filter}
                        onClick={() => { setActiveFilter(filter); setSelectedIds(new Set()); }}
                        style={{ background: activeFilter === filter ? 'var(--color-primary)' : 'var(--surface-sunken)', color: activeFilter === filter ? '#fff' : 'inherit', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                    >
                        {filter === 'All' ? 'All Modules' : `${filter}s`}
                    </button>
                ))}
            </div>

            <div style={{ background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-hover)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={toggleSelectAll} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>
                            {selectedIds.size} selected
                        </span>
                    </div>
                    {selectedIds.size > 0 && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleBulkAction('restore')} style={{ padding: '6px 16px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', gap: '6px' }}>
                                <RefreshCcw size={14} /> Restore Selected
                            </button>
                            <button onClick={() => handleBulkAction('delete')} style={{ padding: '6px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', gap: '6px' }}>
                                <Trash2 size={14} /> Delete Selected
                            </button>
                        </div>
                    )}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {isLoading ? (
                        <li style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing system history...</li>
                    ) : filteredItems.length === 0 ? (
                        <li style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No deleted items found for this module.</li>
                    ) : (
                        filteredItems.map(item => (
                            <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--surface-border)', background: selectedIds.has(item.id) ? 'var(--surface-hover)' : 'var(--surface-default)' }}>
                                <button onClick={() => toggleSelect(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: selectedIds.has(item.id) ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                    {selectedIds.has(item.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>

                                <div style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)', padding: '8px', borderRadius: '8px' }}>
                                    <History size={20} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
                                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px', background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        Deleted on {item.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
