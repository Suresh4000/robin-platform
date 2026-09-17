'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Shield, Bell, Calendar as CalIcon, Loader2, Info } from 'lucide-react';
import formStyles from '@/shared/components/forms/forms.module.css';
import styles from '@/features/portfolio/components/PortfolioList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';

export default function SettingsPage() {
    const [googleClientId, setGoogleClientId] = useState('');
    const [googleClientSecret, setGoogleClientSecret] = useState('');
    const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);

    const [activeHelp, setActiveHelp] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetch('/api/ops/settings')
            .then(res => res.json())
            .then(data => {
                if (data.googleClientId) setGoogleClientId(data.googleClientId);
                if (data.googleClientSecret) setGoogleClientSecret(data.googleClientSecret);
                if (data.googleAccounts) setGoogleAccounts(data.googleAccounts);
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/ops/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ googleClientId, googleClientSecret })
            });
            setToast('Settings saved successfully');
            setTimeout(() => setToast(''), 3000);
        } catch (e) {
            setToast('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDisconnect = async (id: string) => {
        if (!confirm('Are you sure you want to disconnect this calendar?')) return;
        try {
            const res = await fetch(`/api/ops/gcal/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setGoogleAccounts(googleAccounts.filter(acc => acc.id !== id));
                setToast('Account disconnected');
                setTimeout(() => setToast(''), 3000);
            }
        } catch (e) { }
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

                {/* Google Calendar OAuth Integrations */}
                <div style={{ background: 'var(--surface-default)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <CalIcon size={20} style={{ color: '#4f46e5' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Google Calendar Integration (OAuth)</h2>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Configure your Google Cloud OAuth application credentials, then connect your personal or team Google Calendar accounts.
                    </p>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Google Client ID
                            <button onClick={() => setActiveHelp('oauth')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-primary)' }}>
                                <Info size={16} />
                            </button>
                        </label>
                        <input
                            className={formStyles.input}
                            placeholder='e.g. 123456789-xxxx.apps.googleusercontent.com'
                            value={googleClientId}
                            onChange={(e) => setGoogleClientId(e.target.value)}
                        />
                    </div>

                    <div className={formStyles.formGroup} style={{ marginTop: '16px' }}>
                        <label className={formStyles.label}>
                            Google Client Secret
                        </label>
                        <input
                            type="password"
                            className={formStyles.input}
                            placeholder='e.g. GOCSPX-xxxx'
                            value={googleClientSecret}
                            onChange={(e) => setGoogleClientSecret(e.target.value)}
                        />
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Connected Accounts</h3>
                        {googleAccounts.length === 0 ? (
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>No calendar accounts connected yet.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {googleAccounts.map(acc => (
                                    <li key={acc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                            <span style={{ fontWeight: 500 }}>{acc.email}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDisconnect(acc.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                                        >
                                            Disconnect
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            disabled={!googleClientId || !googleClientSecret}
                            onClick={() => window.location.href = '/api/ops/gcal/auth'}
                            style={{ background: (!googleClientId || !googleClientSecret) ? '#e2e8f0' : '#4f46e5', color: (!googleClientId || !googleClientSecret) ? '#94a3b8' : '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: (!googleClientId || !googleClientSecret) ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            + Connect Google Account
                        </button>
                        {(!googleClientId || !googleClientSecret) && (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Please save your Client ID and Secret above before connecting an account.</p>
                        )}
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

            <SlideDrawer isOpen={activeHelp !== null} onClose={() => setActiveHelp(null)} title="Configuration Instructions">
                <div style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                    {activeHelp === 'oauth' && (
                        <div>
                            <h3 style={{ marginBottom: '12px' }}>Setting up Google OAuth</h3>
                            <p style={{ marginBottom: '16px' }}>To enable the "Sign in with Google" flow, you must register your app in Google Cloud.</p>
                            <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li>Go to <b>console.cloud.google.com</b> and create a New Project.</li>
                                <li>Navigate to <b>APIs & Services &gt; OAuth consent screen</b>.</li>
                                <li>Choose <b>External</b> (or Internal if using Workspace). Fill in your app name and email.</li>
                                <li>Under Scopes, click Add Scopes and add <code>https://www.googleapis.com/auth/calendar.events</code>.</li>
                                <li>Navigate to <b>Credentials</b> on the left sidebar.</li>
                                <li>Click <b>+ CREATE CREDENTIALS &gt; OAuth client ID</b>.</li>
                                <li>Application type: <b>Web application</b>.</li>
                                <li>Authorized redirect URIs: exactly <code>{typeof window !== 'undefined' ? window.location.origin : ''}/api/ops/gcal/callback</code></li>
                                <li>Click Create. Copy the <b>Client ID</b> and <b>Client Secret</b> into these fields and Save!</li>
                            </ol>
                        </div>
                    )}
                </div>
            </SlideDrawer>
        </div>
    );
}
