'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/shared/components/forms/forms.module.css';

export function InvoiceGenerator({ onSuccess }: { onSuccess: () => void }) {
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [unbilledEntries, setUnbilledEntries] = useState<any[]>([]);
    const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());

    const [hourlyRate, setHourlyRate] = useState<number>(150);
    const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)); // Default Net 30
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch clients
    useEffect(() => {
        fetch('/api/crm/clients')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setClients(data.data.filter((c: any) => c.status !== 'Completed'));
                }
            });
    }, []);

    // Fetch unbilled logs whenever a client is selected
    useEffect(() => {
        if (!selectedClient) {
            setUnbilledEntries([]);
            setSelectedEntries(new Set());
            return;
        }

        fetch(`/api/ops/invoices/unbilled?clientId=${selectedClient}`)
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setUnbilledEntries(data.data);
                    // Select all by default
                    setSelectedEntries(new Set(data.data.map((e: any) => e.id)));
                }
            });
    }, [selectedClient]);

    const handleToggleEntry = (id: string) => {
        const newSet = new Set(selectedEntries);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedEntries(newSet);
    };

    const handleGenerate = async () => {
        if (!selectedClient) return alert("Select a client");
        if (selectedEntries.size === 0) return alert("Select at least one time entry to bill.");

        setIsSubmitting(true);
        try {
            const payload = {
                clientId: selectedClient,
                timeEntryIds: Array.from(selectedEntries),
                hourlyRate: hourlyRate,
                dueDate: new Date(dueDate).toISOString()
            };

            const res = await fetch('/api/ops/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
            } else {
                const err = await res.json();
                alert('Error generating invoice: ' + err.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalHours = unbilledEntries.filter(e => selectedEntries.has(e.id)).reduce((sum, e) => sum + e.hours, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Select Client</label>
                <select className={styles.select} value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                    <option value="">-- Choose Client --</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                </select>
            </div>

            {selectedClient && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Hourly Rate (USD)</label>
                            <input type="number" className={styles.input} value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Due Date</label>
                            <input type="date" className={styles.input} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Unbilled Time Entries</label>
                        {unbilledEntries.length === 0 ? (
                            <div style={{ padding: '16px', background: 'var(--surface-sunken)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                No unbilled time available for this client.
                            </div>
                        ) : (
                            <div style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                                {unbilledEntries.map(entry => (
                                    <div key={entry.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--surface-border)', gap: '12px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedEntries.has(entry.id)}
                                            onChange={() => handleToggleEntry(entry.id)}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500 }}>{entry.description}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                {entry.project.title} • {new Date(entry.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600 }}>{entry.hours}h</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'var(--surface-default)', padding: '16px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Total Billed Hours</span>
                            <span style={{ fontWeight: 600 }}>{totalHours}h</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total Amount</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                ${(totalHours * hourlyRate).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <button
                        className={styles.submitBtn}
                        style={{ marginTop: '10px' }}
                        onClick={handleGenerate}
                        disabled={isSubmitting || selectedEntries.size === 0}
                    >
                        {isSubmitting ? 'Generating...' : 'Finalize & Generate Invoice'}
                    </button>
                </>
            )}
        </div>
    );
}
