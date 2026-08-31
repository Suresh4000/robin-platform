import React from 'react';
import { prisma } from '@/shared/lib/prisma';
import { Users, HardHat, Target, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import styles from '@/features/portfolio/components/PortfolioList.module.css';

export const dynamic = 'force-dynamic';

// Awaited type for Next 15 searchParams behavior if necessary, or just standard type
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ filter?: string, view?: string }> }) {
    const resolvedParams = await searchParams;
    const filter = resolvedParams.filter || 'all';
    const view = resolvedParams.view || 'all';

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

    // Fetch upcoming schedule (Calendar Events & Tasks)
    const upcomingEvents = await prisma.event.findMany({
        where: { date: { gte: new Date() }, type: { not: 'Discovery Call' } },
        orderBy: { date: 'asc' },
        take: 10
    });

    const pendingTasks = await prisma.task.findMany({ where: { status: { not: 'Done' } }, orderBy: { dueDate: 'asc' }, take: 10, include: { project: { include: { client: true } } } });

    const latestBlogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });

    const TabLink = ({ value, label }: { value: string, label: string }) => {
        const isActive = filter === value;
        return (
            <Link
                href={`/dashboard?filter=${value}&view=${view}`}
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

    const ViewFilterLink = ({ value, label }: { value: string, label: string }) => {
        const isActive = view === value;
        return (
            <Link
                href={`/dashboard?filter=${filter}&view=${value}`}
                style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    backgroundColor: isActive ? 'var(--surface-sunken)' : 'transparent',
                    color: isActive ? 'var(--text-title)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--surface-border)' : '1px solid transparent',
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

            {/* Calendar & Tasks List View */}
            <div style={{ marginTop: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', color: 'var(--text-title)' }}>
                        Action Items & Recent Activity
                    </h2>
                    <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-default)', padding: '4px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                        <ViewFilterLink value="all" label="All" />
                        <ViewFilterLink value="events" label="Events" />
                        <ViewFilterLink value="blog" label="Blog" />
                        <ViewFilterLink value="schedules" label="Schedules" />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Events View */}
                    {(view === 'all' || view === 'events') && (
                        <>
                            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
                                    <div style={{ padding: '10px', background: 'var(--surface-sunken)', borderRadius: '8px' }}>
                                        <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-title)' }}>{event.title}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{event.type} • {event.location}</div>
                                    </div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-title)' }}>
                                        {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                    </div>
                                </div>
                            )) : view === 'events' && (
                                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
                                    No upcoming events.
                                </div>
                            )}

                            {view === 'events' && (
                                <Link href="/ops/events" style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'var(--surface-sunken)', color: 'var(--color-primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, marginTop: '8px' }}>
                                    View More Events
                                </Link>
                            )}
                        </>
                    )}

                    {/* Blog View */}
                    {(view === 'all' || view === 'blog') && (
                        <>
                            {latestBlogs.length > 0 ? latestBlogs.map(post => (
                                <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
                                    <div style={{ padding: '10px', background: 'var(--surface-sunken)', borderRadius: '8px' }}>
                                        <Activity size={18} style={{ color: 'var(--brand-deep)', opacity: 0.8 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-title)' }}>{post.title}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {post.category} • {post.status}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            )) : view === 'blog' && (
                                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
                                    No blog posts available.
                                </div>
                            )}

                            {view === 'blog' && (
                                <Link href="/content/blog" style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'var(--surface-sunken)', color: 'var(--brand-deep)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, marginTop: '8px' }}>
                                    View More Blog Posts
                                </Link>
                            )}
                        </>
                    )}
                    
                    {/* Schedules View */}
                    {(view === 'all' || view === 'schedules') && (
                        <>
                            {pendingTasks.length > 0 ? pendingTasks.map(task => (
                                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
                                    <div style={{ padding: '10px', background: 'var(--surface-sunken)', borderRadius: '8px' }}>
                                        <Activity size={18} style={{ color: 'var(--color-secondary)' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-title)' }}>{task.title}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {task.project.client.name} • {task.project.title}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}
                                    </div>
                                </div>
                            )) : view === 'schedules' && (
                                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
                                    No pending tasks or schedules.
                                </div>
                            )}

                            {view === 'schedules' && (
                                <Link href="/ops/calendar" style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'var(--surface-sunken)', color: 'var(--color-primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, marginTop: '8px' }}>
                                    View Master Calendar
                                </Link>
                            )}
                        </>
                    )}

                    {view === 'all' && upcomingEvents.length === 0 && pendingTasks.length === 0 && latestBlogs.length === 0 && (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
                            Your board is clear. No upcoming items.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
