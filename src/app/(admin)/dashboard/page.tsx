import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Users, HardHat, Target, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import styles from '@/features/portfolio/components/PortfolioList.module.css';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Awaited type for Next 15 searchParams behavior if necessary, or just standard type
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
    const resolvedParams = await searchParams;
    const filter = resolvedParams.filter || 'all';

    let startDate: Date | undefined = undefined;
    let labelSuffix = "All Time";

    if (filter === 'daily') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        labelSuffix = "Today";
    } else if (filter === 'weekly') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        labelSuffix = "Last 7 Days";
    } else if (filter === 'monthly') {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        labelSuffix = "Last 30 Days";
    } else if (filter === 'yearly') {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        labelSuffix = "This Year";
    }

    const dateQuery = startDate ? { createdAt: { gte: startDate } } : {};

    // Fetch counts based on the date filter
    const [clientCount, projectCount, leadCount] = await Promise.all([
        prisma.client.count({ where: dateQuery }),
        prisma.project.count({ where: dateQuery }),
        prisma.lead.count({ where: dateQuery }),
    ]);

    const TabLink = ({ value, label }: { value: string, label: string }) => {
        const isActive = filter === value;
        return (
            <Link
                href={`/dashboard?filter=${value}`}
                style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--surface-border)',
                    transition: 'all 0.2s ease'
                }}
            >
                {label}
            </Link>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Welcome back, Robin</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Here is your Platform overview and analytics.
                    </p>
                </div>
            </header>

            {/* Analytics Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <TabLink value="all" label="All Time" />
                <TabLink value="yearly" label="Yearly" />
                <TabLink value="monthly" label="Monthly" />
                <TabLink value="weekly" label="Weekly" />
                <TabLink value="daily" label="Today" />
            </div>

            {/* Analytics Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>

                {/* Metric 1: Leads */}
                <div style={{ background: 'var(--brand-gradient)', padding: '24px', borderRadius: '12px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                            <Target size={24} color="white" />
                        </div>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>{leadCount}</div>
                    <div style={{ fontSize: '15px', marginTop: '8px', opacity: 0.9 }}>Leads ({labelSuffix})</div>
                </div>

                {/* Metric 2: Clients */}
                <div style={{ background: 'var(--surface-default)', border: '1px solid var(--surface-border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                            <Users size={24} style={{ color: 'var(--color-primary)' }} />
                        </div>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-title)', lineHeight: 1 }}>{clientCount}</div>
                    <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px' }}>Clients ({labelSuffix})</div>
                </div>

                {/* Metric 3: Projects */}
                <div style={{ background: 'var(--surface-default)', border: '1px solid var(--surface-border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                            <HardHat size={24} style={{ color: 'var(--color-secondary)' }} />
                        </div>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-title)', lineHeight: 1 }}>{projectCount}</div>
                    <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px' }}>Projects ({labelSuffix})</div>
                </div>
            </div>

            {/* Quick Launch Board */}
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', color: 'var(--text-title)', marginBottom: '16px' }}>
                Quick Navigation
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <Link href="/crm/leads" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Activity style={{ color: 'var(--color-primary)' }} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Lead Pipeline</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Review new public enquiries</div>
                        </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </Link>

                <Link href="/ops/calendar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '12px', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Calendar style={{ color: 'var(--color-secondary)' }} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Master Calendar</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>View today's schedule</div>
                        </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </Link>
            </div>

        </div>
    );
}
