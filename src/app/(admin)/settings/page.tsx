'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Shield, Bell, Calendar as CalIcon, Loader2, Info } from 'lucide-react';
import formStyles from '@/shared/components/forms/forms.module.css';
import styles from '@/features/portfolio/components/PortfolioList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';

export default function SettingsPage() {
    const [gcalClientEmail, setGcalClientEmail] = useState('');
    const [gcalPrivateKey, setGcalPrivateKey] = useState('');
    const [gcalCalendarId, setGcalCalendarId] = useState('');
    const [activeHelp, setActiveHelp] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetch('/api/ops/settings')
            .then(res => res.json())
            .then(data => {
                if (data.gcalClientEmail) setGcalClientEmail(data.gcalClientEmail);
                if (data.gcalPrivateKey) setGcalPrivateKey(data.gcalPrivateKey);
                if (data.gcalCalendarId) setGcalCalendarId(data.gcalCalendarId);
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/ops/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gcalClientEmail, gcalPrivateKey, gcalCalendarId })
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

                {/* Master Calendar Auto-Sync */}
                <div style={{ background: 'var(--surface-default)', padding: '24px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <CalIcon size={20} style={{ color: '#10b981' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Google Calendar Automation API (Backend)</h2>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Connect a Google Service Account to enable automated background calendar invites without manually confirming them in new browser tabs.
                    </p>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Target Calendar ID (Email)
                            <button onClick={() => setActiveHelp('calendar_id')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-primary)' }}>
                                <Info size={16} />
                            </button>
                        </label>
                        <input
                            className={formStyles.input}
                            placeholder="e.g. robinjones@gmail.com"
                            value={gcalCalendarId}
                            onChange={(e) => setGcalCalendarId(e.target.value)}
                        />
                    </div>

                    <div className={formStyles.formGroup} style={{ marginTop: '16px' }}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Google Cloud Server Email (Client Email)
                            <button onClick={() => setActiveHelp('client_email')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-primary)' }}>
                                <Info size={16} />
                            </button>
                        </label>
                        <input
                            className={formStyles.input}
                            placeholder="e.g. your-app-name@your-project-id.iam.gserviceaccount.com"
                            value={gcalClientEmail}
                            onChange={(e) => setGcalClientEmail(e.target.value)}
                        />
                    </div>

                    <div className={formStyles.formGroup} style={{ marginTop: '16px' }}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            RSA Private Key
                            <button onClick={() => setActiveHelp('private_key')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-primary)' }}>
                                <Info size={16} />
                            </button>
                        </label>
                        <textarea
                            className={formStyles.textarea}
                            rows={3}
                            placeholder="-----BEGIN PRIVATE KEY-----\n..."
                            value={gcalPrivateKey}
                            onChange={(e) => setGcalPrivateKey(e.target.value)}
                        />
                        <span style={{ fontSize: '12px', color: '#888', marginTop: '4px', display: 'block' }}>Store this key safely! It operates with absolute server authority.</span>
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
                    {activeHelp === 'calendar_id' && (
                        <div>
                            <h3 style={{ marginBottom: '12px' }}>Locating your Calendar ID</h3>
                            <p style={{ marginBottom: '16px' }}>The Target Calendar ID defines exactly which Google Calendar receives the automated bookings.</p>
                            <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li>Open <b>Google Calendar</b> in your browser.</li>
                                <li>On the left panel, hover over the specific calendar you want to use (often your main name/email).</li>
                                <li>Click the three vertical dots (Options) and select <b>Settings and sharing</b>.</li>
                                <li>Scroll down to the <b>Integrate calendar</b> section.</li>
                                <li>Copy the <b>Calendar ID</b>. If it is your primary account, it is typically just your email address (e.g. <i>admin@robinjones.com</i>).</li>
                            </ol>
                        </div>
                    )}

                    {activeHelp === 'client_email' && (
                        <div>
                            <h3 style={{ marginBottom: '12px' }}>Getting your Service Account Email</h3>
                            <p style={{ marginBottom: '16px' }}>The Server Email allows your CRM backend to securely proxy requests to Google without login prompts.</p>
                            <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li>Log into the <b>Google Cloud Console</b> (console.cloud.google.com).</li>
                                <li>Ensure your Project is selected in the top left dropdown.</li>
                                <li>Search for <b>Service Accounts</b> in the top search bar.</li>
                                <li>If you haven't created one, click <b>+ CREATE SERVICE ACCOUNT</b> at the top.</li>
                                <li>Once created, look at the table. Copy the long email address under the <b>Email</b> column. It will end in <i>.iam.gserviceaccount.com</i>.</li>
                            </ol>
                            <div style={{ marginTop: '24px', background: '#eef2ff', padding: '16px', borderRadius: '8px', border: '1px solid #c7d2fe', fontSize: '14px' }}>
                                <b>Important Step:</b> You must go back to your actual Google Calendar Settings, click "Share with specific people", and add this Service Account Email with the permission level <b>"Make changes to events"</b>.
                            </div>
                        </div>
                    )}

                    {activeHelp === 'private_key' && (
                        <div>
                            <h3 style={{ marginBottom: '12px' }}>Generating your RSA Private Key</h3>
                            <p style={{ marginBottom: '16px' }}>This cryptographic key allows your server to prove its identity to Google automatically.</p>
                            <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li>In the Google Cloud Console, navigate to your <b>Service Accounts</b> page.</li>
                                <li>Click on the email address of the service account you created.</li>
                                <li>Go to the <b>KEYS</b> tab at the top.</li>
                                <li>Click <b>ADD KEY</b> &gt; <b>Create new key</b>.</li>
                                <li>Select <b>JSON</b> and click Create. A file will download to your computer.</li>
                                <li>Open that downloaded JSON file in Notepad or VSCode.</li>
                                <li>Find the property named <code>"private_key"</code>.</li>
                                <li>Copy the entire string value, including <code>-----BEGIN PRIVATE KEY-----</code> and <code>-----END PRIVATE KEY-----</code>.</li>
                                <li>Paste it directly into the settings field here.</li>
                            </ol>
                        </div>
                    )}
                </div>
            </SlideDrawer>
        </div>
    );
}
