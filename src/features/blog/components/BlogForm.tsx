'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    const [isUploading, setIsUploading] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);

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

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            setCoverPreview(dataUrl);
            // inject into react-hook-form
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set;
            const hiddenInput = document.getElementById('coverImageHidden') as HTMLInputElement;
            if (hiddenInput && nativeInputValueSetter) {
                nativeInputValueSetter.call(hiddenInput, dataUrl);
                hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

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

            {/* Cover image upload */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image</label>
                {/* Hidden field that react-hook-form reads */}
                <input id="coverImageHidden" type="text" style={{ display: 'none' }} {...register('coverImage')} />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleCoverUpload}
                    />
                    <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        style={{
                            padding: '8px 16px', border: '1.5px dashed var(--color-primary)',
                            borderRadius: 8, background: 'transparent', cursor: 'pointer',
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: 13
                        }}
                    >
                        {isUploading ? 'Processing...' : coverPreview ? '🔄 Change Image' : '📁 Upload Cover Image'}
                    </button>
                    {coverPreview && (
                        <button
                            type="button"
                            onClick={() => { setCoverPreview(''); (document.getElementById('coverImageHidden') as HTMLInputElement).value = ''; }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}
                        >
                            ✕ Remove
                        </button>
                    )}
                </div>
                <span style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'block' }}>Upload JPG, PNG, WebP, or GIF</span>
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
