'use client';

import React, { useEffect, useState } from 'react';
import { Plus, DollarSign, Edit, Trash2, Calendar, HardHat } from 'lucide-react';
import styles from '@/features/clients/components/ClientList.module.css'; // Reuse table list styles
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { InvoiceGenerator } from './InvoiceGenerator';
import { InvoicePrintView } from './InvoicePrintView';

export function InvoiceList() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/ops/invoices');
            const data = await res.json();
            if (data.data) setInvoices(data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const deleteInvoice = async (id: string) => {
        if (!confirm('Are you sure you want to void and delete this invoice? The time entries will be unlinked.')) return;
        try {
            await fetch(`/api/ops/invoices/${id}`, { method: 'DELETE' });
            fetchInvoices();
        } catch (e) {
            console.error(e);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/ops/invoices/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchInvoices();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Invoices</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage and generate client billing
                    </p>
                </div>
                <button className={styles.btnPrimary} onClick={() => setIsGeneratorOpen(true)}>
                    <Plus size={16} />
                    Generate Invoice
                </button>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Invoice Details</th>
                            <th>Total Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        ) : invoices.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No invoices found.</td></tr>
                        ) : (
                            invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>INV-{inv.id.substring(0, 6).toUpperCase()}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            {inv.client.name} - {inv._count.timeEntries} logs
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>
                                        ${inv.totalAmount.toLocaleString()}
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>
                                        {new Date(inv.dueDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <select
                                            value={inv.status}
                                            onChange={(e) => updateStatus(inv.id, e.target.value)}
                                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--surface-border)', background: 'var(--surface-default)' }}
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Sent">Sent</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Overdue">Overdue</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => setViewingInvoice(inv)}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                                title="View / Download PDF"
                                            >
                                                <DollarSign size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteInvoice(inv.id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                title="Void Invoice"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <SlideDrawer
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
                title="Generate Invoice"
            >
                <InvoiceGenerator
                    onSuccess={() => {
                        setIsGeneratorOpen(false);
                        fetchInvoices();
                    }}
                />
            </SlideDrawer>

            <SlideDrawer
                isOpen={!!viewingInvoice}
                onClose={() => setViewingInvoice(null)}
                title="Invoice Details"
            >
                {viewingInvoice && (
                    <InvoicePrintView
                        invoice={viewingInvoice}
                        onClose={() => setViewingInvoice(null)}
                    />
                )}
            </SlideDrawer>
        </div>
    );
}
