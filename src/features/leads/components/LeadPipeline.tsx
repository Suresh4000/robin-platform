'use client';

import React, { useEffect, useState } from 'react';
import styles from './LeadPipeline.module.css';
import { LEAD_STAGES } from '../schema';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { LeadForm } from './LeadForm';
import { Trash2, Folder } from 'lucide-react';

// --- Lucide Icons ---
const IcoPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><path d="M5 12h14M12 5v14" /></svg>;
const IcoTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
const IcoEye = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const IcoMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const IcoCalendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;

type Lead = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    source: string;
    status: string;
    notes: string | null;
    meetingDate: string | null;
    createdAt: string;
};

function TemplateButton({ title, desc, isSent, disabled, onClick }: { title: string, desc: string, isSent: boolean, disabled?: boolean, onClick: () => void }) {
    return (
        <div
            onClick={disabled ? undefined : onClick}
            style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px',
                background: disabled ? 'var(--surface-default)' : 'var(--surface-sunken)',
                border: '1px solid var(--surface-border)', borderRadius: '8px',
                color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.2s ease'
            }}
        >
            <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: disabled ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {title} {disabled && <span style={{ fontSize: '11px', fontWeight: 500, background: 'var(--surface-border)', padding: '2px 6px', borderRadius: '4px' }}>Locked</span>}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
            {isSent && !disabled && (
                <div style={{ background: '#ecfdf5', color: '#10b981', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                    Sent ✓
                </div>
            )}
        </div>
    );
}

export function LeadPipeline() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [activeMailLead, setActiveMailLead] = useState<Lead | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [showDeleted, setShowDeleted] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Meet Scheduling & Email Flow
    const [meetFlowState, setMeetFlowState] = useState<{
        lead: Lead;
        intent: 'schedule' | 'reschedule' | 'not-connected' | 'general-email';
        templateTitle?: string;
    } | null>(null);
    const [meetLinkInput, setMeetLinkInput] = useState('');
    const [meetSubjectInput, setMeetSubjectInput] = useState('');
    const [meetMessageInput, setMeetMessageInput] = useState('');
    const [meetDateInput, setMeetDateInput] = useState('');
    const [meetTimeInput, setMeetTimeInput] = useState('');
    const [isSendingMeet, setIsSendingMeet] = useState(false);

    const confirmMeetingDate = async () => {
        if (!meetFlowState?.lead) return;
        setIsSendingMeet(true);
        try {
            const isoDate = meetDateInput && meetTimeInput ? new Date(`${meetDateInput}T${meetTimeInput}:00`).toISOString() : null;
            await fetch(`/api/crm/leads/${meetFlowState.lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meetingDate: isoDate })
            });
            showToast('Meeting Date Confirmed & Synced');
            fetchLeads();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSendingMeet(false);
        }
    };

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const fetchLeads = (deleted = false) => {
        setIsLoading(true);
        fetch(`/api/crm/leads?isDeleted=${deleted}`)
            .then(res => res.json())
            .then(data => {
                if (data.data) setLeads(data.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchLeads(showDeleted);
    }, [showDeleted]);

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

            // Trigger automated specific workflows for scheduling based on the status change
            // Automatically generate a valid Google Meet formatted link constraint
            const generateMeetLink = () => `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

            // Parse existing date/time from explicit mapping (with fallback to old notes format for legacy)
            let initialDate = new Date().toISOString().split('T')[0];
            let initialTime = "10:00";
            if (leadToUpdate?.meetingDate) {
                const dateObj = new Date(leadToUpdate.meetingDate);
                initialDate = dateObj.toISOString().split('T')[0];
                initialTime = dateObj.toISOString().split('T')[1].substring(0, 5);
            } else {
                const notesStr = leadToUpdate?.notes || '';
                const dtMatch = notesStr.match(/Booking Date:\s*([^\n\r]+)/);
                const tmMatch = notesStr.match(/Booking Time:\s*([^\n\r]+)/);
                if (dtMatch) initialDate = dtMatch[1].trim();
                if (tmMatch) initialTime = tmMatch[1].trim();
            }

            if ((newStatus === 'Qualified' || newStatus === 'Meeting Scheduled') && oldStatus !== newStatus && leadToUpdate) {
                setMeetFlowState({ lead: leadToUpdate, intent: 'schedule' });
                setMeetLinkInput(generateMeetLink());
                setMeetDateInput(initialDate);
                setMeetTimeInput(initialTime);
                setMeetSubjectInput(`Confirmed: Alignment Call - Robin Jones`);
                setMeetMessageInput(`Hi ${leadToUpdate.name.split(' ')[0]},\n\nI'm looking forward to our upcoming conversation. \n\nOur meeting is confirmed, and you can join at the scheduled time using the Google Meet link below. To ensure we make the most of our time, please have any relevant context regarding your team's friction points prepared in advance.\n\nBest regards,\nRobin Jones`);
            } else if (newStatus === 'Postponed' && oldStatus !== newStatus && leadToUpdate) {
                setMeetFlowState({ lead: leadToUpdate, intent: 'general-email', templateTitle: 'Automated Postponed' });
                setMeetLinkInput('');
                setMeetSubjectInput(`Rescheduling our Alignment Call - Robin Jones`);
                setMeetMessageInput(`Hi ${leadToUpdate.name.split(' ')[0]},\n\nIt looks like we'll need to reschedule our upcoming conversation. I know how remarkably busy things can get.\n\nTo make this as seamless as possible, you can select a new time that works best for you directly from my calendar here:\n[INSERT_CALENDLY_OR_SCHEDULING_LINK]\n\nAlternatively, if none of those times align, please let me know and we will manually find a slot that works.\n\nLooking forward to speaking soon,\nRobin Jones`);
            } else if (newStatus === 'Not Connected' && oldStatus !== newStatus && leadToUpdate) {
                setMeetFlowState({ lead: leadToUpdate, intent: 'not-connected' });
                setMeetLinkInput(''); // No meeting link sent on not connected
                setMeetSubjectInput(`Missed you - Reschedule our call`);
                setMeetMessageInput(`Hi ${leadToUpdate.name.split(' ')[0]},\n\nI just jumped onto our scheduled Google Meet but it looks like we missed each other.\n\nI know things can get remarkably busy! If you're still interested in aligning on your growth systems, please let me know when you might be free to reschedule our conversation.\n\nBest regards,\nRobin Jones`);
            } else if (newStatus === 'Rescheduled' && oldStatus !== newStatus && leadToUpdate) {
                setMeetFlowState({ lead: leadToUpdate, intent: 'reschedule' });
                setMeetLinkInput(generateMeetLink());
                setMeetDateInput(initialDate);
                setMeetTimeInput(initialTime);
                setMeetSubjectInput(`Updated: Rescheduled Alignment Call`);
                setMeetMessageInput(`Hi ${leadToUpdate.name.split(' ')[0]},\n\nOur originally scheduled meeting has been successfully rescheduled.\n\nYou can find the updated date and time in the newly sent calendar invitation. Please use the Google Meet link below at the updated time.\n\nLooking forward to speaking!\n\nBest regards,\nRobin Jones`);
            }
        } catch {
            fetchLeads(); // Revert on failure
        }
    };

    const openGCalTemplate = (lead: Lead, explicitDate?: string | null, explicitTime?: string | null) => {
        let bookingDate = explicitDate;
        let bookingTime = explicitTime;

        if (!bookingDate && lead.meetingDate) {
            const dateObj = new Date(lead.meetingDate);
            bookingDate = dateObj.toISOString().split('T')[0];
            bookingTime = dateObj.toISOString().split('T')[1].substring(0, 5);
        } else if (!bookingDate) {
            const notes = lead.notes || '';
            const dateMatch = notes.match(/Booking Date:\s*([^\n\r]+)/);
            const timeMatch = notes.match(/Booking Time:\s*([^\n\r]+)/);
            bookingDate = dateMatch ? dateMatch[1].trim() : null;
            bookingTime = timeMatch ? timeMatch[1].trim() : null;
        }

        let startStr, endStr;

        if (bookingDate && bookingTime) {
            const startDt = new Date(`${bookingDate}T${bookingTime}:00`);
            const endDt = new Date(startDt.getTime() + 30 * 60000); // 30 mins later
            const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
            startStr = formatGoogleDate(startDt);
            endStr = formatGoogleDate(endDt);
        } else {
            // Default 30 min meeting starting soon 
            const now = new Date();
            const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
            startStr = formatGoogleDate(now);
            endStr = formatGoogleDate(new Date(now.getTime() + 30 * 60000));
        }

        const title = encodeURIComponent(`Discovery Call: ${lead.name}`);
        const details = encodeURIComponent(`Lead Details:\nCompany: ${lead.company || 'N/A'}\nPhone: ${lead.phone || 'N/A'}\nEmail: ${lead.email || 'N/A'}`);
        const location = encodeURIComponent('Virtual Google Meet');
        const addEmail = lead.email ? `&add=${encodeURIComponent(lead.email)}` : '';

        const gcalUrl = `https://calendar.google.com/calendar/r/eventedit?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}${addEmail}`;
        window.open(gcalUrl, '_blank');
    };

    const loadDraftFromTemplate = (title: string, subject: string, body: string) => {
        if (!activeMailLead) return;
        setMeetFlowState({ lead: activeMailLead, intent: 'general-email', templateTitle: title });
        setMeetSubjectInput(subject);
        setMeetMessageInput(body.replace(/%0D%0A/g, '\n'));
        setMeetLinkInput('');
        setActiveMailLead(null); // Close templates drawer
    };

    const sendMeetingEmail = async () => {
        if (!meetFlowState) return;
        setIsSendingMeet(true);
        try {
            // Explicitly sync the meeting date to database instead of text manipulation
            if (meetFlowState.intent === 'schedule' || meetFlowState.intent === 'reschedule') {
                const isoDate = meetDateInput && meetTimeInput ? new Date(`${meetDateInput}T${meetTimeInput}:00`).toISOString() : null;
                await fetch(`/api/crm/leads/${meetFlowState.lead.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ meetingDate: isoDate })
                });
            }

            const res = await fetch(`/api/crm/leads/${meetFlowState.lead.id}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: meetSubjectInput,
                    message: meetMessageInput,
                    meetLink: meetLinkInput
                })
            });
            if (res.ok) {
                // If it was a generic template, manually append the "Sent template..." marker to notes so the UI shows 'Sent ✓'
                if (meetFlowState.intent === 'general-email' && meetFlowState.templateTitle) {
                    const logDate = new Date().toLocaleString();
                    const divider = `\n\n--- System Log: Sent template '${meetFlowState.templateTitle}' on ${logDate} ---\n`;
                    const updatedNotes = (meetFlowState.lead.notes || '') + divider;
                    await fetch(`/api/crm/leads/${meetFlowState.lead.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes: updatedNotes })
                    });
                }

                showToast(`Email successfully sent to ${meetFlowState.lead.email}`);
                setMeetFlowState(null);
                fetchLeads(); // refresh notes to show the audit history
            } else {
                showToast('Failed to send email. Check SMTP settings.');
            }
        } catch (e) {
            showToast('Error connecting to CRM API.');
        } finally {
            setIsSendingMeet(false);
        }
    };

    const deleteLead = async (id: string, name: string, hardDelete = false) => {
        if (!window.confirm(hardDelete ? `Permanently delete lead "${name}"?` : `Move lead "${name}" to trash?`)) return;
        setLeads(prev => prev.filter(l => l.id !== id));
        await fetch(`/api/crm/leads/${id}${hardDelete ? '?hardDelete=true' : ''}`, { method: 'DELETE' });
        showToast(hardDelete ? 'Lead deleted permanently' : 'Lead moved to trash');
    };

    const restoreLead = async (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id));
        setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        await fetch(`/api/crm/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        });
        showToast('Lead restored');
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === leads.length && leads.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads.map(l => l.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const bulkDelete = async () => {
        if (!window.confirm(`Permanently delete ${selectedIds.size} leads?`)) return;
        const ids = Array.from(selectedIds);
        setLeads(prev => prev.filter(l => !ids.includes(l.id)));
        setSelectedIds(new Set());
        await Promise.all(ids.map(id => fetch(`/api/crm/leads/${id}?hardDelete=true`, { method: 'DELETE' })));
        showToast(`Permanently deleted ${ids.length} leads`);
    };

    const bulkRestore = async () => {
        const ids = Array.from(selectedIds);
        setLeads(prev => prev.filter(l => !ids.includes(l.id)));
        setSelectedIds(new Set());
        await Promise.all(ids.map(id => fetch(`/api/crm/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        })));
        showToast(`Restored ${ids.length} leads`);
    };


    // Reset selection when switching views
    useEffect(() => {
        setSelectedIds(new Set());
    }, [showDeleted]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Lead Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {!showDeleted ? 'Track incoming enquiries and engagements' : 'Recycle Bin - Deleted Leads'}
                    </p>
                </div>
                <div className={styles.actions}>
                    <button
                        onClick={() => setShowDeleted(!showDeleted)}
                        style={{
                            background: 'transparent', border: '1px solid var(--surface-border)',
                            color: 'var(--text-primary)', padding: '10px 16px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}
                    >
                        {!showDeleted ? <Trash2 size={16} /> : <Folder size={16} />}
                        {!showDeleted ? 'View Recycle Bin' : 'Back to Active Leads'}
                    </button>
                    {showDeleted && selectedIds.size > 0 && (
                        <>
                            <button onClick={bulkRestore} style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                Restore Selected ({selectedIds.size})
                            </button>
                            <button onClick={bulkDelete} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                <IcoTrash /> Delete Forever ({selectedIds.size})
                            </button>
                        </>
                    )}
                    {!showDeleted && (
                        <button className={styles.btnPrimary} onClick={() => setIsAddModalOpen(true)}>
                            <IcoPlus />
                            New Lead
                        </button>
                    )}
                </div>
            </header>

            <div style={{ overflowX: 'auto', background: 'var(--surface-default)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--surface-border)' }}>
                        <tr>
                            {showDeleted && (
                                <th style={{ padding: '12px 16px', width: '48px' }}>
                                    <input
                                        type="checkbox"
                                        checked={leads.length > 0 && selectedIds.size === leads.length}
                                        onChange={toggleSelectAll}
                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </th>
                            )}
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Lead Name</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Company</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Source</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={showDeleted ? 6 : 5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td colSpan={showDeleted ? 6 : 5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No leads found.</td>
                            </tr>
                        ) : (
                            leads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid var(--surface-border)', background: selectedIds.has(lead.id) ? 'var(--surface-sunken)' : 'transparent' }}>
                                    {showDeleted && (
                                        <td style={{ padding: '16px', width: '48px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(lead.id)}
                                                onChange={() => toggleSelect(lead.id)}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                        </td>
                                    )}
                                    <td style={{ padding: '16px', fontWeight: 500 }}>{lead.name}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{lead.company || '-'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '11px', background: 'var(--surface-hover)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                            style={{ fontSize: '13px', padding: '6px', borderRadius: '4px', border: '1px solid var(--surface-border)', background: 'var(--surface-default)', color: 'var(--text-primary)' }}
                                            disabled={showDeleted}
                                        >
                                            {LEAD_STAGES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
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
                                            {showDeleted ? (
                                                <>
                                                    <button
                                                        onClick={() => restoreLead(lead.id)}
                                                        style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px', fontSize: '13px', fontWeight: 'bold' }}
                                                        title="Restore Lead"
                                                    >
                                                        Restore
                                                    </button>
                                                    <button
                                                        onClick={() => deleteLead(lead.id, lead.name, true)}
                                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                        title="Delete Forever"
                                                    >
                                                        <IcoTrash />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => deleteLead(lead.id, lead.name)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                    title="Delete Lead"
                                                >
                                                    <IcoTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
                            isSent={!!activeMailLead.notes?.includes("Sent template '1. New Lead (Intro)'")}
                            disabled={activeMailLead.status !== 'New Lead'}
                            onClick={() => loadDraftFromTemplate(
                                "1. New Lead (Intro)",
                                `Exploring growth opportunities for ${activeMailLead.company || 'your team'} - Robin Jones`,
                                `Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AThank you for reaching out to the Robin Business Hub. I've reviewed your initial inquiry regarding ${activeMailLead.company || 'your organization'} and there is a clear opportunity for us to drive impact together.%0D%0A%0D%0AMy focus is on building robust growth engines and scalable operations for high-performing teams, and I'd love to learn more about the specific friction points you are experiencing right now.%0D%0A%0D%0AWhen would be a good time for a brief 30-minute alignment call next week to see if we are a fit to work together?%0D%0A%0D%0ALooking forward to speaking,%0D%0ARobin Jones`
                            )}
                        />

                        <TemplateButton
                            title="2. Meeting Scheduled (Custom)"
                            desc="Extensive logistics and pre-meeting context without Auto-Schedule."
                            isSent={!!activeMailLead.notes?.includes("Sent template '2. Meeting Scheduled (Custom)'")}
                            disabled={activeMailLead.status !== 'Qualified' && activeMailLead.status !== 'Meeting Scheduled'}
                            onClick={() => loadDraftFromTemplate(
                                "2. Meeting Scheduled (Custom)",
                                `Confirmed: Initial Alignment Call - Robin Jones`,
                                `Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AI'm looking forward to our upcoming conversation. Our meeting is confirmed for ${activeMailLead.meetingDate ? new Date(activeMailLead.meetingDate).toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '[INSERT_SCHEDULED_TIME]'}, and you can join at the scheduled time using the following link:%0D%0A[INSERT_MEETING_LINK]%0D%0A%0D%0ATo ensure we make the most of our time, our agenda will focus on:%0D%0A1. Your primary growth or operational challenge%0D%0A2. Current bottlenecks and systems in place%0D%0A3. How my advisory framework might be applied to your specific scenario%0D%0A%0D%0AIf you have any context or materials you'd like me to review beforehand, feel free to drop them here.%0D%0A%0D%0ABest regards,%0D%0ARobin Jones`
                            )}
                        />

                        <TemplateButton
                            title="3. Meeting Postponed"
                            desc="Admin availability picker for user selection."
                            isSent={!!activeMailLead.notes?.includes("Sent template '3. Meeting Postponed'")}
                            disabled={activeMailLead.status !== 'Postponed'}
                            onClick={() => loadDraftFromTemplate(
                                "3. Meeting Postponed",
                                `Rescheduling our Alignment Call - Robin Jones`,
                                `Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AIt looks like we'll need to reschedule our upcoming conversation. I know how remarkably busy things can get.%0D%0A%0D%0ATo make this as seamless as possible, you can select a new time that works best for you directly from my calendar here:%0D%0A[INSERT_CALENDLY_OR_SCHEDULING_LINK]%0D%0A%0D%0AAlternatively, if none of those times align, please let me know and we will manually find a slot that works.%0D%0A%0D%0ALooking forward to speaking soon,%0D%0ARobin Jones`
                            )}
                        />

                        <TemplateButton
                            title="4. Proposal Sent"
                            desc="Detailed proposal handoff."
                            isSent={!!activeMailLead.notes?.includes("Sent template '4. Proposal Sent'") || !!activeMailLead.notes?.includes("Sent template '3. Proposal Sent'")}
                            disabled={activeMailLead.status !== 'Proposal Sent'}
                            onClick={() => loadDraftFromTemplate(
                                "4. Proposal Sent",
                                `Strategic Partnership Proposal: ${activeMailLead.company || 'Growth Systems'} - Robin Jones`,
                                `Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AIt was a pleasure speaking with you and diving deeper into the vision for ${activeMailLead.company || 'your team'}.%0D%0A%0D%0AI have synthesized our discussion into a formal engagement proposal, attached below. This document outlines the proposed scope of work, timeline, and the specific strategic milestones we will target moving forward.%0D%0A%0D%0AAttachment: [INSERT_PROPOSAL_LINK_HERE]%0D%0A%0D%0APlease review the details, and let me know if you would like to schedule a brief follow-up call across the coming days to walk through the deliverables and address any immediate questions.%0D%0A%0D%0AThank you,%0D%0ARobin Jones`
                            )}
                        />

                        <TemplateButton
                            title="5. Contract / Formalities"
                            desc="Closing documents or gracious wrap-up."
                            isSent={!!activeMailLead.notes?.includes("Sent template '5. Contract / Formalities'") || !!activeMailLead.notes?.includes("Sent template '4. Contract / Formalities'")}
                            disabled={activeMailLead.status !== 'Negotiation' && activeMailLead.status !== 'Closed Won'}
                            onClick={() => loadDraftFromTemplate(
                                "5. Contract / Formalities",
                                `Next Steps & Engagement Formalities - Robin Jones`,
                                `Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AI am thrilled that we are officially moving forward.%0D%0A%0D%0AAttached are the finalized engagement agreements and terms of service. Please review and sign where indicated so we can officially kick off our work together.%0D%0A%0D%0A[ATTACH_DOCUMENTS_HERE]%0D%0A%0D%0AOnce these are executed, I will send over the onboarding packet and our first core set of action items.%0D%0A%0D%0ALet me know if anything requires clarification.%0D%0A%0D%0ABest,%0D%0ARobin Jones`
                            )}
                        />

                        <TemplateButton
                            title="6. Response Delay (Bump)"
                            desc="Professional follow-up when communications stall."
                            isSent={!!activeMailLead.notes?.includes("Sent template '6. Response Delay (Bump)'") || !!activeMailLead.notes?.includes("Sent template '5. Response Delay (Bump)'")}
                            disabled={activeMailLead.status !== 'Not Connected' && activeMailLead.status !== 'Rescheduled'}
                            onClick={() => loadDraftFromTemplate(
                                "6. Response Delay (Bump)",
                                `Checking in on our previous conversation`,
                                `Hi ${activeMailLead.name.split(' ')[0]},%0D%0A%0D%0AI am just bringing this thread back to the top of your inbox.%0D%0A%0D%0AI know things can get remarkably busy, but I wanted to check if you had any outstanding questions or if you needed further clarification regarding the materials I previously sent over.%0D%0A%0D%0AIf priorities have shifted on your end or if the timing is no longer ideal, just let me know—otherwise, I look forward to hearing your thoughts soon.%0D%0A%0D%0ABest regards,%0D%0ARobin Jones`
                            )}
                        />

                    </div>
                )}
            </SlideDrawer>

            {/* Meeting & Lifecycle Mail Flows */}
            <SlideDrawer
                isOpen={!!meetFlowState}
                onClose={() => !isSendingMeet && setMeetFlowState(null)}
                title={meetFlowState?.intent === 'not-connected' ? "Draft Reschedule Request" : (meetFlowState?.intent === 'general-email' ? `Send: ${meetFlowState.templateTitle}` : "Send Meeting Details")}
            >
                {meetFlowState?.lead && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {meetFlowState.intent !== 'not-connected' && meetFlowState.intent !== 'general-email' && (
                            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '16px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IcoCalendar /> {meetFlowState.intent === 'reschedule' ? 'Step 1: Set Reschedule Date/Time' : 'Step 1: Confirm Date/Time'}
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#4f46e5', marginBottom: '4px' }}>Date</label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().slice(0, 10)}
                                            value={meetDateInput}
                                            onChange={e => setMeetDateInput(e.target.value)}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #c7d2fe', borderRadius: '4px', color: '#312e81', fontSize: '13px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#4f46e5', marginBottom: '4px' }}>Time</label>
                                        <input
                                            type="time"
                                            value={meetTimeInput}
                                            onChange={e => setMeetTimeInput(e.target.value)}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #c7d2fe', borderRadius: '4px', color: '#312e81', fontSize: '13px', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#4f46e5' }}>
                                    {meetFlowState.intent === 'reschedule'
                                        ? "Selecting the new date updates your Master Calendar locally. Next, open Google Calendar to update the existing event."
                                        : "Create the Google Calendar event and securely lock the date into your CRM Master Calendar."}
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => openGCalTemplate(meetFlowState.lead, meetDateInput, meetTimeInput)}
                                        style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, flex: 1 }}
                                    >
                                        Open Google Calendar
                                    </button>
                                    <button
                                        onClick={confirmMeetingDate}
                                        disabled={isSendingMeet}
                                        style={{ background: '#fff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, flex: 1 }}
                                    >
                                        {isSendingMeet ? 'Saving...' : 'Only Confirm Date'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {meetFlowState.intent !== 'not-connected' && meetFlowState.intent !== 'general-email' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    Step 2: Paste Google Meet Link
                                </label>
                                <input
                                    type="url"
                                    value={meetLinkInput}
                                    onChange={(e) => setMeetLinkInput(e.target.value)}
                                    placeholder="https://meet.google.com/xxx-xxxx-xxx (Optional)"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                Email Subject
                            </label>
                            <input
                                type="text"
                                value={meetSubjectInput}
                                onChange={(e) => setMeetSubjectInput(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '6px', fontSize: '14px', outline: 'none', marginBottom: '16px' }}
                            />

                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                Email Draft Message
                            </label>
                            <textarea
                                value={meetMessageInput}
                                onChange={(e) => setMeetMessageInput(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '6px', fontSize: '14px', outline: 'none', minHeight: '160px', resize: 'vertical' }}
                            />
                            <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                All history and notes will be preserved. This action will be logged chronologically to prevent duplication.
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                            <button onClick={() => setMeetFlowState(null)} style={{ padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }} disabled={isSendingMeet}>
                                Keep as Draft (Cancel)
                            </button>
                            <button
                                onClick={sendMeetingEmail}
                                disabled={isSendingMeet || !meetFlowState.lead.email}
                                style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: (isSendingMeet || !meetFlowState.lead.email) ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {isSendingMeet ? 'Sending...' : 'Send Email to Lead'}
                            </button>
                        </div>
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
