'use client';

import React from 'react';
import { Save, User, Shield, Bell } from 'lucide-react';
import formStyles from '@/shared/components/forms/forms.module.css';
import styles from '@/features/portfolio/components/PortfolioList.module.css';

export default function SettingsPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>System Settings</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage platform configuration and access control
                    </p>
                </div>
                <button className={styles.btnPrimary}>
                    <Save size={16} />
                    Save Changes
                </button>
            </header>

            <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: '1fr', maxWidth: '800px' }}>

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
