'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/shared/components/forms/forms.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const body = await res.json();
                setErrorMsg(body.error || 'Authentication failed');
            }
        } catch (err) {
            setErrorMsg('Network error occurred.');
        }

        setLoading(false);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-hover)' }}>
            <form onSubmit={handleLogin} style={{ background: 'var(--surface-default)', padding: '40px', borderRadius: '8px', boxShadow: 'var(--shadow-md)', width: '400px' }}>
                <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>Robin Platform</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Secure System Access</p>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin@rbos.com"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {errorMsg && (
                    <div className={styles.errorText} style={{ marginBottom: '16px', fontWeight: 600 }}>
                        {errorMsg}
                    </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading} style={{ marginTop: '24px' }}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
