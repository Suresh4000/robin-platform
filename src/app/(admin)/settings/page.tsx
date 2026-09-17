'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Shield, Bell, Calendar as CalIcon, Loader2 } from 'lucide-react';
import formStyles from '@/shared/components/forms/forms.module.css';
import styles from '@/features/portfolio/components/PortfolioList.module.css';

export default function SettingsPage() {
    const [schedulingUrl, setSchedulingUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetch('/api/ops/settings')
            .then(res => res.json())
            .then(data => {
                if (data.schedulingUrl) setSchedulingUrl(data.schedulingUrl);
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/ops/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schedulingUrl })
            });
            setToast('Settings saved successfully');
            setTimeout(() => setToast(''), 3000);
        } catch (e) {
            setToast('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }` }} />

            {/* Global Toast */}
            {toast && (
                <div style={{ position: 'fixed', top: '32px', right: '32px', background: '#10b981', color: '#fff', padding: '16px 24px', borderRadius: '8px', zIndex: 9999 }}>
                    {toast}
                </div>
            )}

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>System Settings</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage platform configuration and access control
                    </p>
                </div>
                <button className={styles.btnPrimary} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </header>

            <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: '1fr', maxWidth: '800px' }}>

                {/* Integration Settings */}
                <div style={{ background: 'var(--surface-default)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <CalIcon size={20} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Calendar Integrations</h2>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Set your global scheduling link (Calendly, SavvyCal, etc). This will automatically be appended to relevant Email Templates when leads need to reschedule.
                    </p>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Scheduling Link (URL)</label>
                        <input
                            className={formStyles.input}
                            placeholder="e.g. https://calendly.com/robin-jones"
                            value={schedulingUrl}
                            onChange={(e) => setSchedulingUrl(e.target.value)}
                        />
                    </div>
                </div>

                {/* Profile Settings */}
                <div style={{ background: 'var(--surface-default)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <User size={20} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Administrator Profile</h2>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Display Name</label>
                        <input className={formStyles.input} defaultValue="Robin Jones" />
                    </div>

                    <div className={formStyles.formGroup} style={{ marginTop: '16px' }}>
                        <label className={formStyles.label}>Master Email Address</label>
                        <input className={formStyles.input} type="email" defaultValue="admin@rbos.com" />
                    </div>
                </div>

                {/* Security / Password */}
                <div style={{ background: 'var(--surface-default)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Shield size={20} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Security & Authentication</h2>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Current Password</label>
                        <input className={formStyles.input} type="password" placeholder="••••••••" />
                    </div>

                    <div className={formStyles.formGroup} style={{ marginTop: '16px' }}>
                        <label className={formStyles.label}>New Password</label>
                        <input className={formStyles.input} type="password" placeholder="Enter new password" />
                    </div>
                </div>

                {/* Notifications */}
                <div style={{ background: 'var(--surface-default)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Bell size={20} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Notification Preferences</h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--surface-border)' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Lead Inbox Alerts</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive email when public enquiry is submitted.</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ scale: '1.2' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Client Activity</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Digest of updates to CRM pipeline.</div>
                        </div>
                        <input type="checkbox" style={{ scale: '1.2' }} />
                    </div>
                </div>

            </div>
        </div>
    );
}
