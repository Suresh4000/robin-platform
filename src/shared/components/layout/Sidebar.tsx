'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Briefcase, Users, FileText, Calendar, HardHat, FileBox, Building, Clock, DollarSign, Settings, FolderOpen, PenTool, Image as ImageIcon, History } from 'lucide-react';
import styles from './Sidebar.module.css';
import { NotificationBell } from './NotificationBell';

const ROUTES = [
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { path: '/crm/leads', label: 'Lead Management', Icon: Briefcase },
    { path: '/crm/clients', label: 'Client Workspace', Icon: Users },
    { path: '/ops/projects', label: 'Projects', Icon: HardHat },
    { path: '/ops/calendar', label: 'Calendar', Icon: Calendar },
    { path: '/ops/documents', label: 'Documents', Icon: FolderOpen },
    { path: '/ops/invoices', label: 'Billing/Invoices', Icon: DollarSign },
    { path: '/content/blog', label: 'Blog CMS', Icon: FileText },
    { path: '/content/media', label: 'Media', Icon: ImageIcon },
    { path: '/settings', label: 'Settings', Icon: Settings },
    { path: '/history', label: 'History / Bin', Icon: History },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(15,18,28,0.45)', zIndex: 90
                    }}
                    onClick={onClose}
                />
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                {/* <div className={styles.brand}>
                    <div className={styles.brandDot} />
                    <div className={styles.brandText}>Robin Platform</div>
                </div> */}

                <nav className={styles.nav}>
                    <NotificationBell />

                    {ROUTES.map((route) => {
                        const isActive = pathname.startsWith(route.path);
                        return (
                            <Link
                                key={route.path}
                                href={route.path}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                onClick={() => { if (window.innerWidth <= 900) onClose(); }}
                            >
                                <route.Icon size={18} />
                                {route.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <button className={styles.printBtn} onClick={handleLogout}>
                        <LogOut size={16} />
                        Log out
                    </button>
                </div>
            </aside>
        </>
    );
}
