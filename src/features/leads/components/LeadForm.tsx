'use client';

import React, { useState } from 'react';
import { useForm as rhmUseForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema, LEAD_STAGES } from '../schema';
import { z } from 'zod';
import styles from '@/shared/components/forms/forms.module.css';

type LeadFormData = z.infer<typeof createLeadSchema>;

export function LeadForm({ onSuccess }: { onSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError } = rhmUseForm<any>({
        resolver: zodResolver(createLeadSchema),
        defaultValues: {
            status: 'New Inquiry',
            source: 'Website',
            expectedValue: 0,
        }
    });

    const onSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to create lead');
            }

            onSuccess();
        } catch (err: any) {
            setError('root', { message: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input className={styles.input} {...register('name')} placeholder="e.g. Acme Corp Contact" />
                {errors.name && <span className={styles.errorText}>{errors.name.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Company (Optional)</label>
                <input className={styles.input} {...register('company')} placeholder="e.g. Acme Corp" />
                {errors.company && <span className={styles.errorText}>{errors.company.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input type="email" className={styles.input} {...register('email')} placeholder="contact@example.com" />
                {errors.email && <span className={styles.errorText}>{errors.email.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Source</label>
                <select className={styles.select} {...register('source')}>
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Event">Event</option>
                </select>
                {errors.source && <span className={styles.errorText}>{errors.source.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Pipeline Stage</label>
                <select className={styles.select} {...register('status')}>
                    {LEAD_STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                    ))}
                </select>
                {errors.status && <span className={styles.errorText}>{errors.status.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Expected Value (USD)</label>
                <input type="number" step="0.01" className={styles.input} {...register('expectedValue', { valueAsNumber: true })} />
                {errors.expectedValue && <span className={styles.errorText}>{errors.expectedValue.message as string}</span>}
            </div>

            {errors.root && (
                <div className={styles.errorText} style={{ marginBottom: '16px', fontWeight: 600 }}>
                    {errors.root.message}
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Lead Record'}
            </button>
        </form>
    );
}
