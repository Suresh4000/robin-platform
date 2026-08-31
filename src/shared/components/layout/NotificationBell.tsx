'use client';
import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import Link from 'next/link';

type Notification = {
    id: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = () => {
        fetch('/api/notifications')
            .then(res => res.json())
            .then(data => {
                if (data.data) setNotifications(data.data);
            })
            .catch(err => console.error("Could not fetch notifications"));
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleRead = async (id: string, link: string | null) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        await fetch(`/api/notifications/${id}`, { method: 'PATCH' });

        if (link) {
            setIsOpen(false);
            window.location.href = link;
        }
    };

    const markAllRead = async () => {
        // Optimistic UI
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        // Mark all visually, could do a bulk API update but individual patches are fine for small sets
        for (const n of notifications.filter(n => !n.isRead)) {
            await fetch(`/api/notifications/${n.id}`, { method: 'PATCH' });
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center',
                    gap: '12px', width: '100%', borderRadius: '8px', position: 'relative'
                }}
            >
                <div style={{ position: 'relative' }}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <div style={{
                            position: 'absolute', top: -2, right: -2,
                            background: 'var(--error, #e11d48)', color: 'white',
                            fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%', border: '2px solid var(--sidebar-bg, #0F121C)'
                        }}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Notifications</span>
            </button>

            <SlideDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Notifications"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                    <span>{unreadCount > 0 ? <span style={{ background: 'var(--error, #e11d48)', color: 'white', fontSize: '12px', padding: '2px 8px', borderRadius: '10px' }}>{unreadCount} New</span> : ''}</span>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={14} /> Mark All Read
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                            No notifications yet. You're all caught up!
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => handleRead(n.id, n.link)}
                                style={{
                                    padding: '16px',
                                    background: n.isRead ? 'transparent' : 'var(--surface-sunken)',
                                    border: '1px solid var(--surface-border)',
                                    borderRadius: '8px',
                                    borderLeft: n.isRead ? '1px solid var(--surface-border)' : '3px solid var(--accent)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    opacity: n.isRead ? 0.7 : 1
                                }}
                            >
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                    {n.title}
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    {n.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SlideDrawer>
        </>
    );
}
