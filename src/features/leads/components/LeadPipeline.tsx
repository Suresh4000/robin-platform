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
const IcoMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;

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

function TemplateButton({ title, desc, lead, subject, body, onSent }: { title: string, desc: string, lead: Lead, subject: string, body: string, onSent: () => void }) {
    const handleMailClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Optimistic open mail client
        window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;

        // Log this action securely in the database
        const logDate = new Date().toLocaleString();
        const divider = `\n\n--- System Log: Sent template '${title}' on ${logDate} ---\n`;
        const updatedNotes = (lead.notes || '') + divider;

        try {
            await fetch(`/api/crm/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: updatedNotes })
            });
            onSent();
        } catch (e) { }
    };

    const hasBeenSent = lead.notes?.includes(`Sent template '${title}'`);

    return (
        <a
            href={`mailto:${lead.email}?subject=${subject}&body=${body}`}
            onClick={handleMailClick}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--surface-sunken)', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', cursor: 'pointer' }}
        >
            <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {title}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
            {hasBeenSent && (
                <div style={{ background: '#ecfdf5', color: '#10b981', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                    Sent ✓
                </div>
            )}
        </a>
    );
}

export function LeadPipeline() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [activeMailLead, setActiveMailLead] = useState<Lead | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

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
        const leadToUpdate = leads.find(l => l.id === id);
        const oldStatus = leadToUpdate?.status;

        // Optimistic UI update
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

        try {
            await fetch(`/api/crm/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            showToast(`Moved to ${newStatus}`);

            if (newStatus === 'Meeting Scheduled' && oldStatus !== 'Meeting Scheduled' && leadToUpdate) {
                const notes = leadToUpdate.notes || '';
                const dateMatch = notes.match(/Booking Date:\s*([^\n\r]+)/);
                const timeMatch = notes.match(/Booking Time:\s*([^\n\r]+)/);

                const bookingDate = dateMatch ? dateMatch[1].trim() : null;
                const bookingTime = timeMatch ? timeMatch[1].trim() : null;

                if (bookingDate && bookingTime) {
                    const startDt = new Date(`${bookingDate}T${bookingTime}:00`);
                    const endDt = new Date(startDt.getTime() + 30 * 60000); // 30 minutes later

                    // Format dates to YYYYMMDDTHHMMSSZ (UTC)
                    const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
                    const startStr = formatGoogleDate(startDt);
                    const endStr = formatGoogleDate(endDt);

                    const title = encodeURIComponent(`Discovery Call: ${leadToUpdate.name}`);
                    const details = encodeURIComponent(`Lead Details:\nCompany: ${leadToUpdate.company || 'N/A'}\nPhone: ${leadToUpdate.phone || 'N/A'}\nEmail: ${leadToUpdate.email || 'N/A'}\n\nEnquiry Notes:\n${notes}`);
                    const location = encodeURIComponent('Virtual Google Meet');
                    const addEmail = leadToUpdate.email ? `&add=${encodeURIComponent(leadToUpdate.email)}` : '';

                    const gcalUrl = `https://calendar.google.com/calendar/r/eventedit?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}${addEmail}`;

                    window.open(gcalUrl, '_blank');
                }
            }
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
                                                {lead.email && (
                                                    <button
                                                        onClick={() => setActiveMailLead(lead)}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '4px' }}
                                                        title="Send Email Template"
                                                    >
                                                        <IcoMail />
                                                    </button>
                                                )}
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
                title="Lead Details"
            >
                {selectedLead && (
                    <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        <div style={{ background: 'var(--surface-sunken)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Name</div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>{selectedLead.name}</div>

                            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Company</div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>{selectedLead.company || '-'}</div>

                            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Contact</div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {selectedLead.email && <div>Email: {selectedLead.email}</div>}
                                {selectedLead.phone && <div>Phone: {selectedLead.phone}</div>}
                                {!selectedLead.email && !selectedLead.phone && <span>-</span>}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Notes / Inquiry Details</div>
                            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', background: 'var(--surface-default)', padding: '16px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                {selectedLead.notes || 'No notes available.'}
                            </div>
                        </div>
                    </div>
                )}
            </SlideDrawer>

            {/* Email Templates Modal */}
            <SlideDrawer
                isOpen={!!activeMailLead}
                onClose={() => setActiveMailLead(null)}
                title="Email Templates"
            >
                {activeMailLead?.email && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Sending to: <b>{activeMailLead.email}</b>
                        </p>

                        <TemplateButton
                            title="1. New Lead (Intro)"
                            desc="Comprehensive welcome and discovery setup."
                            lead={activeMailLead}
                            onSent={fetchLeads}
                            subject={`Exploring growth opportunities for ${activeMailLead.company || 'your team'} - Robin Jones`}
                            body={`Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AThank you for reaching out to the Robin Business Hub. I've reviewed your initial inquiry regarding ${activeMailLead.company || 'your organization'} and there is a clear opportunity for us to drive impact together.%0D%0A%0D%0AMy focus is on building robust growth engines and scalable operations for high-performing teams, and I'd love to learn more about the specific friction points you are experiencing right now.%0D%0A%0D%0AWhen would be a good time for a brief 15-minute alignment call next week to see if we are a fit to work together?%0D%0A%0D%0ALooking forward to speaking,%0D%0ARobin Jones`}
                        />

                        <TemplateButton
                            title="2. Meeting Scheduled"
                            desc="Extensive logistics and pre-meeting context."
                            lead={activeMailLead}
                            onSent={fetchLeads}
                            subject={`Confirmed: Initial Alignment Call - Robin Jones`}
                            body={`Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AI'm looking forward to our upcoming conversation. Our meeting is confirmed, and you can join at the scheduled time using the following link:%0D%0A[INSERT_MEETING_LINK]%0D%0A%0D%0ATo ensure we make the most of our time, our agenda will focus on:%0D%0A1. Your primary growth or operational challenge%0D%0A2. Current bottlenecks and systems in place%0D%0A3. How my advisory framework might be applied to your specific scenario%0D%0A%0D%0AIf you have any context or materials you'd like me to review beforehand, feel free to drop them here.%0D%0A%0D%0ABest regards,%0D%0ARobin Jones`}
                        />

                        <TemplateButton
                            title="3. Proposal Sent"
                            desc="Detailed proposal handoff."
                            lead={activeMailLead}
                            onSent={fetchLeads}
                            subject={`Partnership Proposal: ${activeMailLead.company || 'Strategic Growth'} - Robin Jones`}
                            body={`Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AIt was a pleasure speaking with you and learning more about the vision for ${activeMailLead.company || 'your team'}.%0D%0A%0D%0AI have synthesized our discussion into a formal engagement proposal, attached here. This document outlines the proposed scope of work, timeline, and the specific strategic milestones we will target in Phase 1.%0D%0A%0D%0AAttachment: [INSERT_PROPOSAL_LINK]%0D%0A%0D%0APlease review the details, and let me know if you would like to schedule a brief follow-up call to walk through the deliverables and address any questions.%0D%0A%0D%0AThank you,%0D%0ARobin Jones`}
                        />

                        <TemplateButton
                            title="4. Contract / Formalities"
                            desc="Closing documents or gracious wrap-up."
                            lead={activeMailLead}
                            onSent={fetchLeads}
                            subject={`Next Steps & Engagement Formalities - Robin Jones`}
                            body={`Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AI am thrilled that we are moving forward.%0D%0A%0D%0AAttached are the finalized engagement agreements and terms of service. Please review and sign where indicated so we can officially kick off our work together.%0D%0A%0D%0A[ATTACH_DOCUMENTS_HERE]%0D%0A%0D%0AOnce these are executed, I will send over the onboarding packet and our first set of action items.%0D%0A%0D%0ALet me know if anything requires clarification.%0D%0A%0D%0ABest,%0D%0ARobin Jones`}
                        />

                        <TemplateButton
                            title="5. Response Delay (Bump)"
                            desc="Professional follow-up when communications stall."
                            lead={activeMailLead}
                            onSent={fetchLeads}
                            subject={`Checking in on our previous conversation`}
                            body={`Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AI am just bringing this thread back to the top of your inbox.%0D%0A%0D%0AI know things can get remarkably busy, but I wanted to check if you had any outstanding questions regarding the materials I previously sent over.%0D%0A%0D%0AIf priorities have shifted on your end or if the timing is no longer ideal, just let me know. Otherwise, I look forward to hearing your thoughts.%0D%0A%0D%0ABest regards,%0D%0ARobin`}
                        />

                    </div>
                )}
            </SlideDrawer>

            {/* Global Toast */}
            {toastMsg && (
                <div style={{
                    position: 'fixed', top: '32px', right: '32px',
                    background: '#10b981', color: '#fff',
                    padding: '16px 24px', borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                    fontWeight: 500, fontSize: '14px', zIndex: 9999,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <style>{`@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '8px' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    {toastMsg}
                </div>
            )}
        </div>
    );
}
