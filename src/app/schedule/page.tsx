import React from 'react';
import { prisma } from '@/shared/lib/prisma';
import { PublicNav, PublicFooter } from '@/app/PublicLayout';

export const metadata = {
    title: 'Schedule a Call | Robin Jones',
    description: 'Book an appointment with Robin Jones.',
};

export default async function SchedulePage() {
    let bookingIframe = null;
    try {
        const admin = await prisma.admin.findFirst();
        if (admin && admin.schedulingUrl) {
            bookingIframe = admin.schedulingUrl;
        }
    } catch (e) {
        console.error("Failed to fetch calendar iframe", e);
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            <PublicNav />

            <main style={{ flex: 1, padding: '120px 24px 64px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Schedule a Conversation</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Find a time that works best for you below.
                    </p>
                </div>

                <div style={{
                    background: 'var(--surface-default)',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    border: '1px solid var(--surface-border)',
                    minHeight: '600px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {bookingIframe ? (
                        <div
                            style={{ width: '100%', height: '700px' }}
                            dangerouslySetInnerHTML={{ __html: bookingIframe }}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Calendar is temporarily unavailable.</p>
                            <p style={{ fontSize: '0.9rem' }}>Please contact us directly to schedule.</p>
                        </div>
                    )}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
