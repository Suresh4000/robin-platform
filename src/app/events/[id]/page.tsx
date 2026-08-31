import React from 'react';
import { prisma } from '@/shared/lib/prisma';
import '@/app/public-contour.css';
import { notFound } from 'next/navigation';
import { EventRegistrationForm } from './EventRegistrationForm';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;


    const event: any = await prisma.event.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!event || (event.status !== 'Published' && event.status !== 'Completed')) return notFound();

    const dateObj = new Date(event.date);
    const day = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const isPast = dateObj < new Date();

    return (
        <div className="layout-body" style={{ background: '#F6F3EC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <main style={{ flex: 1, padding: '40px 0 80px' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

                    <a href="/events" className="btn btn-ghost" style={{ display: 'inline-flex', marginBottom: '32px' }}>
                        &larr; Back to events
                    </a>

                    {event.bannerImage && (
                        <div style={{ width: '100%', height: '350px', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 20px 40px -15px rgba(20,15,5,.15)' }}>
                            <img src={event.bannerImage} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                            <span className="tag" style={{ border: '1.5px solid var(--surface-border)', background: 'transparent' }}>{event.type}</span>
                            {isPast && <span className="tag" style={{ background: '#e2ddd4', color: '#666' }}>Past Event</span>}
                        </div>

                        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--ink-dark)', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                            {event.title}
                        </h1>

                        <div style={{ display: 'flex', gap: '32px', padding: '24px', background: '#fff', borderRadius: '16px', border: '1.5px solid var(--surface-border)', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width={20} height={20}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Date & Time</div>
                                    <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-dark)' }}>{day} at {time} ({event.duration} min)</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width={20} height={20}><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Location</div>
                                    {event.location.startsWith('http') ? (
                                        <a href={event.location} target="_blank" rel="noreferrer" style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Join Virtual Link</a>
                                    ) : (
                                        <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-dark)' }}>{event.location}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="prose"
                        style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--ink-soft)' }}
                        dangerouslySetInnerHTML={{ __html: event.description || '<p>No additional details provided.</p>' }}
                    />

                    {!isPast && (
                        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--surface-border)' }}>
                            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--ink-dark)' }}>Save Your Seat</h3>
                                    <p style={{ color: 'var(--ink-soft)', marginBottom: '32px' }}>Register to receive updates and exclusive pre-event materials.</p>
                                </div>
                                <EventRegistrationForm eventTitle={event.title} eventId={event.id} />
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
