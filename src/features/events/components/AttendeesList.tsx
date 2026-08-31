'use client';
import React, { useEffect, useState } from 'react';
import styles from './EventList.module.css'; // Reuse existing table/card styles if possible or standard styles

type Attendee = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    createdAt: string;
};

export function AttendeesList({ eventId }: { eventId: string }) {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/ops/events/${eventId}/attendees`)
            .then(res => res.json())
            .then(data => {
                if (data.data) setAttendees(data.data);
                setIsLoading(false);
            });
    }, [eventId]);

    if (isLoading) return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading attendees...</div>;

    if (attendees.length === 0) return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
            No one has registered for this event yet.
        </div>
    );

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600 }}>Email</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600 }}>Phone</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600 }}>Company</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600 }}>Registered</th>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid var(--surface-sunken)' }}>
                            <td style={{ padding: '12px 8px', fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</td>
                            <td style={{ padding: '12px 8px' }}>{a.email}</td>
                            <td style={{ padding: '12px 8px' }}>{a.phone || '-'}</td>
                            <td style={{ padding: '12px 8px' }}>{a.company || '-'}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
