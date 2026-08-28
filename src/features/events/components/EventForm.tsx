'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm as rhmUseForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema, updateEventSchema } from '../schema';
import styles from '@/shared/components/forms/forms.module.css';
import { RichEditor } from '@/shared/components/RichEditor/RichEditor';

export function EventForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bannerPreview, setBannerPreview] = useState<string>(initialData?.bannerImage || '');
    const [isUploading, setIsUploading] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, control, watch, formState: { errors }, setError, reset } = rhmUseForm<any>({
        resolver: zodResolver(initialData ? updateEventSchema : createEventSchema),
        defaultValues: initialData ? {
            ...initialData,
            date: new Date(initialData.date).toISOString().slice(0, 16)
        } : {
            status: 'Draft',
            type: 'Workshop',
            capacity: 100,
            duration: 60,
            description: '',
            bannerImage: '',
        }
    });

    const watchBanner = watch('bannerImage');
    useEffect(() => { setBannerPreview(watchBanner || ''); }, [watchBanner]);

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            setBannerPreview(dataUrl);
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set;
            const hiddenInput = document.getElementById('bannerImageHidden') as HTMLInputElement;
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
            const formattedData = {
                ...data,
                date: new Date(data.date).toISOString(),
                duration: parseInt(data.duration, 10),
                capacity: parseInt(data.capacity, 10),
            };
            const url = initialData ? `/api/ops/events/${initialData.id}` : '/api/ops/events';
            const method = initialData ? 'PATCH' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData),
            });
            const responseData = await res.json();
            if (!res.ok) throw new Error(responseData.error || 'Failed to save event');
            onSuccess();
        } catch (err: any) {
            setError('root', { message: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            reset({ ...initialData, date: new Date(initialData.date).toISOString().slice(0, 16) });
        } else {
            reset({
                status: 'Draft',
                type: 'Workshop',
                capacity: 100,
                duration: 60,
                description: '',
                bannerImage: '',
                title: '',
                location: '',
                date: ''
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Banner preview */}
            {bannerPreview && (
                <div style={{ borderRadius: 12, overflow: 'hidden', height: 180, marginBottom: 4 }}>
                    <img src={bannerPreview} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            {/* Banner image upload */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label}>Banner Image</label>
                <input id="bannerImageHidden" type="text" style={{ display: 'none' }} {...register('bannerImage')} />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleBannerUpload}
                    />
                    <button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        style={{
                            padding: '8px 16px', border: '1.5px dashed var(--color-primary)',
                            borderRadius: 8, background: 'transparent', cursor: 'pointer',
                            color: 'var(--color-primary)', fontWeight: 600, fontSize: 13
                        }}
                    >
                        {isUploading ? 'Processing...' : bannerPreview ? '🔄 Change Image' : '📁 Upload Banner Image'}
                    </button>
                    {bannerPreview && (
                        <button
                            type="button"
                            onClick={() => { setBannerPreview(''); (document.getElementById('bannerImageHidden') as HTMLInputElement).value = ''; }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}
                        >
                            ✕ Remove
                        </button>
                    )}
                </div>
                <span style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'block' }}>Upload JPG, PNG, WebP, or GIF</span>
            </div>

            {/* Title */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label}>Event Title *</label>
                <input className={styles.input} {...register('title')} placeholder="e.g. Growth Masterclass 2026" />
                {errors.title && <span className={styles.errorText}>{errors.title.message as string}</span>}
            </div>

            {/* Type + Status row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Event Type</label>
                    <select className={styles.select} {...register('type')}>
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Conference">Conference</option>
                        <option value="Academy Program">Academy Program</option>
                        <option value="Networking">Networking</option>
                        <option value="Keynote">Keynote</option>
                    </select>
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Status</label>
                    <select className={styles.select} {...register('status')}>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published (Live)</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Date + Duration row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Date & Time *</label>
                    <input type="datetime-local" className={styles.input} {...register('date')} />
                    {errors.date && <span className={styles.errorText}>{errors.date.message as string}</span>}
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Duration (mins) *</label>
                    <input type="number" className={styles.input} {...register('duration')} />
                    {errors.duration && <span className={styles.errorText}>{errors.duration.message as string}</span>}
                </div>
            </div>

            {/* Location + Capacity row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Location / Join Link *</label>
                    <input className={styles.input} {...register('location')} placeholder="Zoom link or Venue address" />
                    {errors.location && <span className={styles.errorText}>{errors.location.message as string}</span>}
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label className={styles.label}>Capacity *</label>
                    <input type="number" className={styles.input} {...register('capacity')} />
                    {errors.capacity && <span className={styles.errorText}>{errors.capacity.message as string}</span>}
                </div>
            </div>

            {/* Rich description editor */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label} style={{ marginBottom: 8, display: 'block' }}>
                    Event Description
                    <span style={{ fontWeight: 400, color: '#888', marginLeft: 8 }}>Rich text editor</span>
                </label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichEditor value={field.value} onChange={field.onChange} placeholder="Describe the event, agenda, speakers..." />
                    )}
                />
            </div>

            {/* Error */}
            {errors.root && (
                <div className={styles.errorText} style={{ fontWeight: 600 }}>
                    {errors.root.message as string}
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (initialData ? '✓ Update Event' : '🚀 Create Event')}
            </button>
        </form>
    );
}
