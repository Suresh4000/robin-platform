'use client';

import React from 'react';
import styles from '@/features/portfolio/components/PortfolioList.module.css';

export default function CalendarPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Master Calendar</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Synchronized operations schedule (Google Workspace Integrated)
                    </p>
                </div>
            </header>

            <div style={{
                backgroundColor: 'var(--surface-default)',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--surface-border)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                {/* Google Calendar Iframe */}
                <iframe
                    src="https://calendar.google.com/calendar/embed?src=suresh6374000%40gmail.com&ctz=UTC&showTitle=0"
                    style={{ border: 0, width: '100%', height: '700px', borderRadius: '8px' }}
                    frameBorder="0"
                    scrolling="no">
                </iframe>
            </div>
        </div>
    );
}
