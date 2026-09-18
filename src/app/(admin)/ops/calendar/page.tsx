'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/features/portfolio/components/PortfolioList.module.css';
import { Calendar, Clock, Video, Info, LayoutGrid, List, PhoneCall } from 'lucide-react';

type CalendarItem = {
    id: string;
    type: 'Event' | 'Task' | 'Call';
    title: string;
    date: Date;
    status: string;
    details?: string;
};

export default function CalendarPage() {
    const [items, setItems] = useState<CalendarItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Events' | 'Tasks' | 'Calls'>('All');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const [eventsRes, tasksRes, leadsRes, settingsRes] = await Promise.all([
                    fetch('/api/ops/events'),
                    fetch('/api/ops/tasks'),
                    fetch('/api/crm/leads'),
                    fetch('/api/ops/settings')
                ]);

                const eventsData = await eventsRes.json();
                const tasksData = await tasksRes.json();
                const leadsData = await leadsRes.json();
                const settingsData = await settingsRes.json();

                if (settingsData.googleAccounts) {
                    setConnectedAccounts(settingsData.googleAccounts);
                }

                const combined: CalendarItem[] = [];

                if (eventsData.data) {
                    eventsData.data.forEach((e: any) => {
                        combined.push({
                            id: `evt_${e.id}`,
                            type: 'Event',
                            title: e.title,
                            date: new Date(e.date),
                            status: e.status,
                            details: `Type: ${e.type} | Duration: ${e.duration} mins`
                        });
                    });
                }

                if (tasksData.data) {
                    tasksData.data.forEach((t: any) => {
                        if (t.dueDate) {
                            combined.push({
                                id: `tsk_${t.id}`,
                                type: 'Task',
                                title: t.title,
                                date: new Date(t.dueDate),
                                status: t.status,
                                details: `Task ID: ${t.id.slice(-6)}`
                            });
                        }
                    });
                }

                if (leadsData.data) {
                    leadsData.data.forEach((l: any) => {
                        // Only show leads that are actively scheduled in pipeline
                        const activeStatuses = ['Qualified', 'Meeting Scheduled', 'Rescheduled'];
                        if (!activeStatuses.includes(l.status)) return;

                        let dateToUse = null;

                        if (l.meetingDate) {
                            dateToUse = new Date(l.meetingDate);
                        } else {
                            // Extract booking date / time from notes if it exists (legacy)
                            const notes = l.notes || '';
                            const dateMatch = notes.match(/Booking Date:\s*([^\n\r]+)/);
                            const timeMatch = notes.match(/Booking Time:\s*([^\n\r]+)/);
                            if (dateMatch && timeMatch) {
                                const dateStr = dateMatch[1].trim();
                                const timeStr = timeMatch[1].trim();
                                if (dateStr && timeStr) {
                                    dateToUse = new Date(`${dateStr}T${timeStr}:00`);
                                }
                            }
                        }

                        if (dateToUse) {
                            combined.push({
                                id: `call_${l.id}`,
                                type: 'Call',
                                title: `Discovery Call: ${l.name}`,
                                date: dateToUse,
                                status: l.status === 'Rescheduled' ? 'Rescheduled' : (l.status === 'Meeting Scheduled' ? 'Scheduled' : l.status),
                                details: `Company: ${l.company || 'N/A'} | Contact: ${l.email || l.phone}`
                            });
                        }
                    });
                }

                // Filter out past entries (before start of today)
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const upcomingCombined = combined.filter(item => item.date.getTime() >= now.getTime());

                // Sort by date ascending
                upcomingCombined.sort((a, b) => a.date.getTime() - b.date.getTime());
                setItems(upcomingCombined);
            } catch (error) {
                console.error("Failed to load operations schedule");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCalendarData();
    }, []);

    const filteredItems = items.filter(item => activeFilter === 'All' ? true : item.type === activeFilter.slice(0, -1));

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'Event': return { bg: '#eef2ff', text: '#6366f1', icon: <Video size={24} /> };
            case 'Call': return { bg: '#fff7ed', text: '#f97316', icon: <PhoneCall size={24} /> };
            case 'Task':
            default: return { bg: '#ecfdf5', text: '#10b981', icon: <Calendar size={24} /> };
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Master Calendar</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Synchronized operations schedule (Google Workspace Integrated)
                    </p>
                </div>
                <button
                    onClick={() => window.location.href = '/api/ops/gcal/auth'}
                    className={styles.btnPrimary}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', padding: '10px 16px', borderRadius: '8px', fontWeight: 500 }}
                >
                    <Calendar size={16} />
                    + Connect Calendar
                </button>
            </header>

            {connectedAccounts.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Integrations:</span>
                    {connectedAccounts.map(acc => (
                        <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, border: '1px solid #bbf7d0' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></div>
                            {acc.email}
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                backgroundColor: 'var(--surface-default)',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--surface-border)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '40px'
            }}>
                {/* Google Calendar Iframe */}
                <iframe
                    src="https://calendar.google.com/calendar/embed?src=suresh6374000%40gmail.com&ctz=UTC&showTitle=0"
                    style={{ border: 0, width: '100%', height: '700px', borderRadius: '8px' }}
                    frameBorder="0"
                    scrolling="no">
                </iframe>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 className={styles.title} style={{ fontSize: '20px', margin: 0 }}>Calendar Saved Data</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* View Toggles */}
                    <div style={{ display: 'flex', background: 'var(--surface-sunken)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{ background: viewMode === 'list' ? 'var(--surface-hover)' : 'transparent', color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{ background: viewMode === 'grid' ? 'var(--surface-hover)' : 'transparent', color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveFilter('All')}
                    style={{ background: activeFilter === 'All' ? 'var(--color-primary)' : 'var(--surface-sunken)', color: activeFilter === 'All' ? '#fff' : 'inherit', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                    All Entries
                </button>
                <button
                    onClick={() => setActiveFilter('Events')}
                    style={{ background: activeFilter === 'Events' ? 'var(--color-primary)' : 'var(--surface-sunken)', color: activeFilter === 'Events' ? '#fff' : 'inherit', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                    Events Only
                </button>
                <button
                    onClick={() => setActiveFilter('Tasks')}
                    style={{ background: activeFilter === 'Tasks' ? 'var(--color-primary)' : 'var(--surface-sunken)', color: activeFilter === 'Tasks' ? '#fff' : 'inherit', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                    Tasks Only
                </button>
                <button
                    onClick={() => setActiveFilter('Calls')}
                    style={{ background: activeFilter === 'Calls' ? 'var(--color-primary)' : 'var(--surface-sunken)', color: activeFilter === 'Calls' ? '#fff' : 'inherit', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                    Meetings / Calls
                </button>
            </div>

            <div style={{ paddingBottom: '40px' }}>
                {isLoading ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px' }}>Loading saved data...</div>
                ) : filteredItems.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px' }}>No saved calendar data found for this filter.</div>
                ) : viewMode === 'list' ? (
                    /* LIST VIEW */
                    <div style={{ background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px', overflow: 'hidden' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {filteredItems.map(item => {
                                const ui = getIconInfo(item.type);
                                return (
                                    <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-default)' }}>
                                        <div style={{ background: ui.bg, color: ui.text, padding: '12px', borderRadius: '8px' }}>
                                            {ui.icon}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
                                                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px', background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={14} />
                                                    {item.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Info size={14} />
                                                    {item.type} &bull; {item.details}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    /* GRID VIEW */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {filteredItems.map(item => {
                            const ui = getIconInfo(item.type);
                            return (
                                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: '1px solid var(--surface-border)', borderRadius: '12px', background: 'var(--surface-default)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ background: ui.bg, color: ui.text, padding: '10px', borderRadius: '8px' }}>
                                            {ui.icon}
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px', background: 'var(--surface-hover)', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.title}</h3>

                                    <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                            <Clock size={14} style={{ flexShrink: 0 }} />
                                            <span>{item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <Info size={14} style={{ flexShrink: 0 }} />
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.type} &bull; {item.details}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
