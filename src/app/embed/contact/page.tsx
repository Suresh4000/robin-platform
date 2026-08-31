"use client";
import React, { useState } from "react";
import '@/app/public-contour.css'; // Use public styling

export default function EmbedContactForm() {
    const [formData, setFormData] = useState({
        name: '', lname: '', email: '', phone: '', company: '',
        role: '', topics: [] as string[], timing: '', notes: '',
        bookingDate: '', bookingTime: ''
    });
    const [formStatus, setFormStatus] = useState('');
    const [msOpen, setMsOpen] = useState(false);

    const todayDateString = new Date().toISOString().split('T')[0];

    const handleContactSubmit = async (e: any) => {
        e.preventDefault();
        setFormStatus('Submitting...');
        try {
            const formattedNotes = `Role: ${formData.role}
Timing: ${formData.timing}
Topics: ${formData.topics.join(', ')}
Booking Date: ${formData.bookingDate}
Booking Time: ${formData.bookingTime}
Message: ${formData.notes}`;

            const res = await fetch('/api/crm/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name + (formData.lname ? ' ' + formData.lname : ''),
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    source: 'Website',
                    status: 'New Inquiry',
                    expectedValue: 0,
                    notes: formattedNotes
                })
            });
            const responseData = await res.json();
            if (res.ok) {
                setFormStatus('Success! We will be in touch soon.');
                setFormData({ name: '', lname: '', email: '', phone: '', company: '', role: '', topics: [], timing: '', notes: '', bookingDate: '', bookingTime: '' });
            } else {
                setFormStatus("Error: " + (responseData.error || 'Failed to submit.'));
            }
        } catch (err: any) {
            setFormStatus('Error submitting form.');
        }
    };

    if (formStatus.startsWith('Success')) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'inherit' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', color: '#166534', marginBottom: '24px' }}>
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="32" height="32"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-dark)', marginBottom: '12px' }}>Request Sent Successfully</h3>
                <p style={{ color: 'var(--ink-soft)' }}>Thank you for reaching out. We will review your message and get back to you shortly.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', background: 'transparent' }}>
            <form id="enquiry-form" onSubmit={handleContactSubmit}>
                <div className="form-grid">
                    <div className="field"><label htmlFor="fname">First Name</label><input id="fname" name="name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jordan" required={true} type="text" /></div>
                    <div className="field"><label htmlFor="lname">Last Name</label><input id="lname" name="lname" type="text" placeholder="Doe" value={formData.lname} onChange={e => setFormData({ ...formData, lname: e.target.value })} /></div>
                    <div className="field"><label htmlFor="email">Work Email</label><input id="email" name="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="jordan@company.com" required={true} type="email" /></div>
                    <div className="field"><label htmlFor="org">Organization</label><input id="org" name="company" value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Company name" type="text" /></div>
                    <div className="field" style={{ "gridColumn": "1 / -1" }}><label htmlFor="role">Role / Title</label><input id="role" name="role" type="text" placeholder="CEO, Founder, VP..." value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} /></div>
                </div>

                <div className="field">
                    <label id="topicLabel">What would you like to discuss?</label>
                    <div className={`multiselect ${msOpen ? 'open' : ''}`} id="topicSelect" style={{ position: 'relative' }}>
                        <button aria-expanded={msOpen} aria-haspopup="listbox" className="multiselect-toggle" id="topicToggle" type="button" onClick={() => setMsOpen(!msOpen)}>
                            <span id="topicToggleText">{formData.topics.length > 0 ? formData.topics.join(', ') : 'Select one or more topics'}</span>
                            <svg className="ms-caret" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                        </button>
                        <div aria-labelledby="topicLabel" aria-multiselectable="true" className="multiselect-panel" role="listbox" style={{ display: msOpen ? 'block' : 'none', position: 'absolute', width: '100%', zIndex: 100 }}>
                            {["Growth Strategy", "New Business Development", "Strategic Partnerships", "Transformation", "Enterprise Value", "Executive Advisory", "Fractional Executive Support", "Speaking / Events", "Media / Interview", "Other"].map(opt => (
                                <label key={opt} className="ms-option">
                                    <input name="topic" type="checkbox" value={opt} checked={formData.topics.includes(opt)} onChange={(e) => {
                                        if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, opt] });
                                        else setFormData({ ...formData, topics: formData.topics.filter(t => t !== opt) });
                                    }} /><span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="msg">What challenge, opportunity, or question are you currently exploring?</label>
                    <textarea id="msg" name="notes" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="A few sentences is plenty to start."></textarea>
                </div>

                <div className="field">
                    <label htmlFor="timing">Preferred engagement timing</label>
                    <select id="timing" name="timing" value={formData.timing} onChange={e => setFormData({ ...formData, timing: e.target.value })}>
                        <option value="">Select an option</option>
                        <option>Exploring</option>
                        <option>Within the next month</option>
                        <option>Within the next 3 months</option>
                        <option>Currently looking for support</option>
                    </select>
                </div>

                <div className="field" style={{ gridColumn: '1 / -1', padding: '16px', background: 'var(--surface-sunken)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Book a Discovery Call</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label htmlFor="bookingDate" style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Select Date</label>
                            <input id="bookingDate" type="date" min={todayDateString} value={formData.bookingDate} onChange={e => setFormData({ ...formData, bookingDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }} required />
                        </div>
                        <div>
                            <label htmlFor="bookingTime" style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Select Time</label>
                            <input id="bookingTime" type="time" value={formData.bookingTime} onChange={e => setFormData({ ...formData, bookingTime: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--surface-border)' }} required />
                        </div>
                    </div>
                </div>

                <button className="btn btn-brass" style={{ "width": "100%", "marginTop": "8px" }} type="submit" disabled={formStatus === 'Submitting...'}>
                    {formStatus === 'Submitting...' ? 'Sending...' : 'Send Enquiry'}
                </button>
                {formStatus && !formStatus.startsWith('Success') && (
                    <p style={{ marginTop: '12px', color: 'var(--error, #e11d48)' }}>{formStatus}</p>
                )}
            </form>
        </div>
    );
}
