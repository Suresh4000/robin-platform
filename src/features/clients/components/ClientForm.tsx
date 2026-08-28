'use client';

import React, { useState, useEffect } from 'react';
import { useForm as rhmUseForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientSchema, updateClientSchema } from '../schema';
import styles from '@/shared/components/forms/forms.module.css';

export function ClientForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError, reset } = rhmUseForm<any>({
        resolver: zodResolver(initialData ? updateClientSchema : createClientSchema),
        defaultValues: initialData || {
            status: 'Active',
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/crm/clients/${initialData.id}` : '/api/crm/clients';
            const method = initialData ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to create client');
            }

            onSuccess();
        } catch (err: any) {
            setError('root', { message: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Company/Brand Name *</label>
                <input className={styles.input} {...register('company')} placeholder="e.g. Acme Corp" />
                {errors.company && <span className={styles.errorText}>{errors.company.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Primary Contact Name *</label>
                <input className={styles.input} {...register('name')} placeholder="e.g. John Doe" />
                {errors.name && <span className={styles.errorText}>{errors.name.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Contact Email</label>
                <input type="email" className={styles.input} {...register('email')} placeholder="john@example.com" />
                {errors.email && <span className={styles.errorText}>{errors.email.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input className={styles.input} {...register('phone')} placeholder="+1 (555) 000-0000" />
                {errors.phone && <span className={styles.errorText}>{errors.phone.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} {...register('status')}>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Churned">Churned</option>
                </select>
                {errors.status && <span className={styles.errorText}>{errors.status.message as string}</span>}
            </div>

            {errors.root && (
                <div className={styles.errorText} style={{ marginBottom: '16px', fontWeight: 600 }}>
                    {errors.root.message as string}
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Client' : 'Create Client Profile')}
            </button>
        </form>
    );
}
