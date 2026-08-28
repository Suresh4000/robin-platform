'use client';

import React, { useState, useEffect } from 'react';
import { useForm as rhmUseForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBlogSchema, updateBlogSchema } from '../schema';
import styles from '@/shared/components/forms/forms.module.css';
import { RichEditor } from '@/shared/components/RichEditor/RichEditor';

const CATEGORIES = [
    'Growth Strategy',
    'Leadership',
    'Execution',
    'Partnerships',
    'Transformation',
    'Enterprise Value',
    'Case Studies',
    'Thoughts',
];

export function BlogForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string>(initialData?.coverImage || '');

    const { register, handleSubmit, control, watch, formState: { errors }, setError, reset } = rhmUseForm<any>({
        resolver: zodResolver(initialData ? updateBlogSchema : createBlogSchema),
        defaultValues: initialData || {
            status: 'Draft',
            category: 'Thoughts',
            content: '',
            coverImage: '',
        }
    });

    const watchCover = watch('coverImage');
    useEffect(() => { setCoverPreview(watchCover || ''); }, [watchCover]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/content/blog/${initialData.id}` : '/api/content/blog';
            const method = initialData ? 'PATCH' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const responseData = await res.json();
            if (!res.ok) throw new Error(responseData.error || 'Failed to save post');
            onSuccess();
        } catch (err: any) {
            setError('root', { message: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => { if (initialData) reset(initialData); }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Cover preview banner ── */}
            {coverPreview && (
                <div style={{ borderRadius: 12, overflow: 'hidden', height: 200, marginBottom: 4 }}>
                    <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            {/* Cover image URL */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image URL</label>
                <input className={styles.input} {...register('coverImage')} placeholder="https://images.unsplash.com/..." />
                <span style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'block' }}>Paste any image URL — a preview appears above</span>
            </div>

            {/* Title + Slug row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Post Title *</label>
                    <input className={styles.input} {...register('title')} placeholder="How to Scale Operations..." />
                    {errors.title && <span className={styles.errorText}>{errors.title.message as string}</span>}
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>URL Slug *</label>
                    <input className={styles.input} {...register('slug')} placeholder="how-to-scale-operations" />
                    {errors.slug && <span className={styles.errorText}>{errors.slug.message as string}</span>}
                </div>
            </div>

            {/* Category + Status row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Category</label>
                    <select className={styles.select} {...register('category')}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Status</label>
                    <select className={styles.select} {...register('status')}>
                        <option value="Draft">Draft (Hidden)</option>
                        <option value="Published">Published (Live)</option>
                    </select>
                </div>
            </div>

            {/* Excerpt */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label}>Excerpt * <span style={{ fontWeight: 400, color: '#888' }}>(shown on card)</span></label>
                <textarea className={styles.textarea} rows={2} {...register('excerpt')} placeholder="Short summary shown on the blog listing..." />
                {errors.excerpt && <span className={styles.errorText}>{errors.excerpt.message as string}</span>}
            </div>

            {/* Rich content editor */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label} style={{ marginBottom: 8, display: 'block' }}>
                    Full Content *
                    <span style={{ fontWeight: 400, color: '#888', marginLeft: 8 }}>Rich text editor</span>
                </label>
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <RichEditor value={field.value} onChange={field.onChange} placeholder="Write your post here..." />
                    )}
                />
                {errors.content && <span className={styles.errorText}>{errors.content.message as string}</span>}
            </div>

            {/* Error banner */}
            {errors.root && (
                <div className={styles.errorText} style={{ fontWeight: 600 }}>
                    {errors.root.message as string}
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (initialData ? '✓ Update Post' : '🚀 Publish Blog Post')}
            </button>
        </form>
    );
}
