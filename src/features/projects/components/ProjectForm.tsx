'use client';

import React, { useState, useEffect } from 'react';
import { useForm as rhmUseForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, updateProjectSchema } from '../schema';
import styles from '@/shared/components/forms/forms.module.css';

export function ProjectForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        fetch('/api/crm/clients')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setClients(data.data.map((c: any) => ({ id: c.id, name: c.name })));
                }
            });
    }, []);

    const { register, handleSubmit, formState: { errors }, setError, reset } = rhmUseForm<any>({
        resolver: zodResolver(initialData ? updateProjectSchema : createProjectSchema),
        defaultValues: initialData || {
            status: 'Planning',
        }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/ops/projects/${initialData.id}` : '/api/ops/projects';
            const method = initialData ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to create project');
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
                <label className={styles.label}>Project Title *</label>
                <input className={styles.input} {...register('title')} placeholder="e.g. Website Redesign" />
                {errors.title && <span className={styles.errorText}>{errors.title.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Assign to Client *</label>
                <select className={styles.select} {...register('clientId')}>
                    <option value="">Select a Client...</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.clientId && <span className={styles.errorText}>{errors.clientId.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} {...register('status')}>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                {errors.status && <span className={styles.errorText}>{errors.status.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} {...register('category')}>
                    <option value="">Select a Category...</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                </select>
                {errors.category && <span className={styles.errorText}>{errors.category.message as string}</span>}
            </div>

            {errors.root && (
                <div className={styles.errorText} style={{ marginBottom: '16px', fontWeight: 600 }}>
                    {errors.root.message as string}
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || clients.length === 0}>
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project Hub')}
            </button>
        </form>
    );
}
