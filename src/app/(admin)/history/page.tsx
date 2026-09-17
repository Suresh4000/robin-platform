'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/features/portfolio/components/PortfolioList.module.css';
import { Trash2, History, RefreshCcw, CheckSquare, Square, Loader2 } from 'lucide-react';

type HistoryItem = {
    id: string;
    type: string;
    title: string;
    date: Date;
};

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const fetchHistory = async (skip = 0, isLoadMore = false) => {
        if (isLoadMore) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }

        try {
            const res = await fetch(`/api/ops/history?take=30&skip=${skip}`);
            const data = await res.json();
            if (data.data) {
                const newItems = data.data.map((item: any) => ({
                    ...item,
                    date: new Date(item.date)
                }));

                if (isLoadMore) {
                    setItems(prev => [...prev, ...newItems]);
                } else {
                    setItems(newItems);
                }
                setHasMore(data.hasMore);
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredItems = items.filter(item => activeFilter === 'All' ? true : item.type === activeFilter);
    const filterOptions = ['All', ...Array.from(new Set(items.map(item => item.type)))];

    return (
        <div className={styles.container}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
            `}} />
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
                        onClick={() => { setActiveFilter(filter); }}
                        style={{ background: activeFilter === filter ? 'var(--color-primary)' : 'var(--surface-sunken)', color: activeFilter === filter ? '#fff' : 'inherit', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                    >
                        {filter === 'All' ? 'All Modules' : `${filter}s`}
                    </button>
                ))}
            </div>

            <div style={{ background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-hover)', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    System Audit Trail (Latest Updates)
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {isLoading ? (
                        <li style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <Loader2 className="spinner" size={32} style={{ color: 'var(--color-primary)' }} />
                            <span>Analyzing system history...</span>
                        </li>
                    ) : filteredItems.length === 0 ? (
                        <li style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found. Modifying items will trigger logs here.</li>
                    ) : (
                        filteredItems.map(item => (
                            <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-default)' }}>
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
                                        Logged on {item.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                {hasMore && (
                    <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--surface-border)' }}>
                        <button
                            onClick={() => fetchHistory(items.length, true)}
                            disabled={isLoadingMore}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--surface-border)',
                                color: 'var(--text-primary)',
                                padding: '8px 24px',
                                borderRadius: '20px',
                                cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {isLoadingMore && <Loader2 className="spinner" size={16} />}
                            {isLoadingMore ? 'Loading History...' : 'Load More History'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
