'use client';

import React, { useEffect, useState } from 'react';
import styles from './LeadPipeline.module.css';
import { LEAD_STAGES } from '../schema';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { LeadForm } from './LeadForm';

/* ── Inline SVGs ── */
const IcoPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><path d="M5 12h14M12 5v14" /></svg>;
const IcoTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const IcoEye = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

type Lead = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    source: string;
    status: string;
    notes: string | null;
    createdAt: string;
};

export function LeadPipeline() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const fetchLeads = () => {
        setIsLoading(true);
        fetch('/api/crm/leads')
            .then(res => res.json())
            .then(data => {
                if (data.data) setLeads(data.data);
                setIsLoading(false);
            });
    };

    const updateLeadStatus = async (id: string, newStatus: string) => {
        // Optimistic UI update
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        try {
            await fetch(`/api/crm/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch {
            fetchLeads(); // Revert on failure
        }
    };

    const deleteLead = async (id: string, name: string) => {
        if (!window.confirm(`Permanently delete lead "${name}"?`)) return;
        setLeads(prev => prev.filter(l => l.id !== id));
        await fetch(`/api/crm/leads/${id}`, { method: 'DELETE' });
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Lead Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Track incoming enquiries and engagements
                    </p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.btnPrimary} onClick={() => setIsAddModalOpen(true)}>
                        <IcoPlus />
                        New Lead
                    </button>
                </div>
            </header>

            <div className={styles.board}>
                {LEAD_STAGES.map(stage => {
                    const columnLeads = leads.filter(l => l.status === stage);
                    return (
                        <div key={stage} className={styles.column}>
                            <div className={styles.columnHeader}>
                                <span className={styles.columnTitle}>{stage}</span>
                                <span className={styles.cardCount}>{columnLeads.length}</span>
                            </div>

                            {isLoading ? (
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>
                            ) : (
                                columnLeads.map(lead => (
                                    <div key={lead.id} className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <div className={styles.cardName}>{lead.name}</div>
                                                {lead.company && <div className={styles.cardCompany}>{lead.company}</div>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    onClick={() => setSelectedLead(lead)}
                                                    style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', padding: '4px' }}
                                                    title="View Full Details"
                                                >
                                                    <IcoEye />
                                                </button>
                                                <button
                                                    onClick={() => deleteLead(lead.id, lead.name)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                    title="Delete Lead"
                                                >
                                                    <IcoTrash />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.cardSource}>{lead.source}</div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid var(--surface-border)', paddingTop: '12px' }}>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                style={{ fontSize: '11px', padding: '4px', borderRadius: '4px', border: '1px solid var(--surface-border)', background: 'var(--surface-default)', color: 'var(--text-secondary)' }}
                                            >
                                                {LEAD_STAGES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Lead Modal */}
            <SlideDrawer
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Create New Lead"
            >
                <LeadForm onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchLeads();
                }} />
            </SlideDrawer>

            {/* View Lead Details Modal */}
            <SlideDrawer
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Enquiry Details"
            >
                {selectedLead && (
                    <div style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>{selectedLead.name}</h2>
                            {selectedLead.company && <p style={{ margin: '0 0 8px', fontSize: '15px', color: '#666' }}>Organization: {selectedLead.company}</p>}
                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#888' }}>
                                {selectedLead.email && <span>Email: <a href={`mailto:${selectedLead.email}`} style={{ color: '#7c5c2e', textDecoration: 'none' }}>{selectedLead.email}</a></span>}
                                {selectedLead.phone && <span>Phone: <a href={`tel:${selectedLead.phone}`} style={{ color: '#7c5c2e', textDecoration: 'none' }}>{selectedLead.phone}</a></span>}
                            </div>
                        </div>

                        <div style={{ padding: '16px', background: '#f9f7f4', borderRadius: '8px', border: '1px solid #e2ddd4' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#999', letterSpacing: '0.05em' }}>Form Submission Data</h4>

                            <p style={{ margin: '0 0 8px', fontSize: '13px' }}><strong>Source:</strong> {selectedLead.source}</p>
                            <p style={{ margin: '0 0 16px', fontSize: '13px' }}><strong>Received:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</p>

                            <hr style={{ border: 'none', borderTop: '1px solid #e2ddd4', margin: '16px 0' }} />

                            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#333' }}>Message & Enquiry Content:</h4>
                            <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: '13.5px', lineHeight: 1.6, color: '#222', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                {selectedLead.notes || 'No additional notes provided.'}
                            </pre>
                        </div>
                    </div>
                )}
            </SlideDrawer>
        </div>
    );
}
