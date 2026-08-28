'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Printer, LayoutDashboard, Briefcase, Users, FileText, Calendar, HardHat, FileBox, Building, Clock, DollarSign, Settings, FolderOpen, PenTool } from 'lucide-react';
import styles from './Sidebar.module.css';

const ROUTES = [
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard, num: '01' },
    { path: '/crm/leads', label: 'Lead Management', Icon: Briefcase, num: '02' },
    { path: '/crm/clients', label: 'Client Workspace', Icon: Users, num: '03' },
    { path: '/ops/projects', label: 'Projects', Icon: HardHat, num: '04' },
    { path: '/ops/calendar', label: 'Calendar', Icon: Calendar, num: '05' },
    { path: '/ops/events', label: 'Events', Icon: Building, num: '06' },
    { path: '/ops/documents', label: 'Documents', Icon: FolderOpen, num: '07' },
    { path: '/content/blog', label: 'Blog CMS', Icon: FileText, num: '08' },
    { path: '/settings', label: 'Settings', Icon: Settings, num: '09' },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    const handlePrint = () => {
        window.print();
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
                <div className={styles.brand}>
                    <div className={styles.brandDot} />
                    <div className={styles.brandText}>Robin Platform</div>
                </div>

                <nav className={styles.nav}>
                    {ROUTES.map((route) => {
                        const isActive = pathname.startsWith(route.path);
                        return (
                            <Link
                                key={route.path}
                                href={route.path}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                onClick={() => { if (window.innerWidth <= 900) onClose(); }}
                            >
                                <span className={styles.navNumber}>{route.num}</span>
                                <route.Icon size={18} />
                                {route.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <button className={styles.printBtn} onClick={handlePrint}>
                        <Printer size={16} />
                        Export as PDF
                    </button>
                    <div className={styles.printHint}>Opens print dialog – choose Save as PDF</div>
                </div>
            </aside>
        </>
    );
}
