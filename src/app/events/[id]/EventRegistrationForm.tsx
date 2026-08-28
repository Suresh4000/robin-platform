'use client';

import React, { useState } from 'react';
import styles from '@/app/PublicStyles.module.css';

export function EventRegistrationForm({ eventTitle }: { eventTitle: string }) {
    const [formData, setFormData] = useState({ name: '', lname: '', email: '', phone: '', company: '' });
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('');

        try {
            const res = await fetch('/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.name} ${formData.lname}`.trim(),
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    source: `Event Registration: ${eventTitle}`,
                    status: 'New Inquiry',
                    notes: `User registered for event: ${eventTitle}`
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to register');

            setStatus('success');
            setFormData({ name: '', lname: '', email: '', phone: '', company: '' });
        } catch (err: any) {
            setStatus(err.message || 'Error submitting registration.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <div style={{ padding: '32px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', textAlign: 'center' }}>
                <h4 style={{ color: '#166534', margin: '0 0 8px', fontSize: '20px' }}>Registration Complete!</h4>
                <p style={{ color: '#166534', margin: 0 }}>Your seat has been reserved. Keep an eye on your inbox for upcoming details.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--surface-border)', textAlign: 'left' }}>
            <h4 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 600 }}>Reserve Your Spot</h4>

            {status && typeof status === 'string' && status !== 'success' && (
                <div style={{ padding: '12px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                    {status}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>First Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Last Name</label>
                    <input type="text" value={formData.lname} onChange={e => setFormData({ ...formData, lname: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Work Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Phone Number *</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Company / Organization *</label>
                    <input required type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
            </div>

            <button disabled={isSubmitting} type="submit" style={{ width: '100%', cursor: isSubmitting ? 'not-allowed' : 'pointer', background: 'var(--accent)', color: '#fff', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </button>
        </form>
    );
}
