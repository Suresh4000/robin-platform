'use client';

import React, { useState, useEffect } from 'react';
import { useForm as rhmUseForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPortfolioItemSchema, updatePortfolioItemSchema } from '../schema';
import styles from '@/shared/components/forms/forms.module.css';

export function PortfolioForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError, reset } = rhmUseForm<any>({
        resolver: zodResolver(initialData ? updatePortfolioItemSchema : createPortfolioItemSchema),
        defaultValues: initialData || {
            status: 'Draft',
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/content/portfolio/${initialData.id}` : '/api/content/portfolio';
            const method = initialData ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to create item');
            }

            onSuccess();
        } catch (err: any) {
            setError('root', { message: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Title *</label>
                <input className={styles.input} {...register('title')} placeholder="e.g. Acme Redesign" />
                {errors.title && <span className={styles.errorText}>{errors.title.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>URL Slug *</label>
                <input className={styles.input} {...register('slug')} placeholder="acme-redesign" />
                {errors.slug && <span className={styles.errorText}>{errors.slug.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Summary *</label>
                <textarea className={styles.textarea} rows={2} {...register('summary')} placeholder="A brief overview..." />
                {errors.summary && <span className={styles.errorText}>{errors.summary.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Full Content (Markdown or HTML) *</label>
                <textarea className={styles.textarea} rows={8} {...register('content')} placeholder="Deep dive into the project..." />
                {errors.content && <span className={styles.errorText}>{errors.content.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image URL (Optional)</label>
                <input className={styles.input} {...register('coverImage')} placeholder="https://..." />
                {errors.coverImage && <span className={styles.errorText}>{errors.coverImage.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Tags (comma separated) *</label>
                <input className={styles.input} {...register('tags')} placeholder="Strategy, Web Design, Figma" />
                {errors.tags && <span className={styles.errorText}>{errors.tags.message as string}</span>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} {...register('status')}>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Published">Published (Live)</option>
                </select>
                {errors.status && <span className={styles.errorText}>{errors.status.message as string}</span>}
            </div>

            {errors.root && (
                <div className={styles.errorText} style={{ marginBottom: '16px', fontWeight: 600 }}>
                    {errors.root.message as string}
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Entry' : 'Create Portfolio Entry')}
            </button>
        </form>
    );
}
