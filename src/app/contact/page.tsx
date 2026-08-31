"use client";
import React, { useState } from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";

export default function Page() {

  const [formData, setFormData] = useState({ name: '', lname: '', email: '', phone: '', company: '', role: '', topics: [] as string[], timing: '', notes: '', bookingDate: '', bookingTime: '' });
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

  return (
    <>
      <PublicNav />
      <div>
        {/*  ===================== HERO =====================  */}
        <div className="hero" style={{ "paddingBottom": "60px" }}>
          <div className="container">
            <div className="reveal" style={{ "maxWidth": "720px" }}>
              <div className="eyebrow">Contact</div>
              <h1 style={{ "marginBottom": "20px" }}>Let's talk about what's <em>next</em></h1>
              <p className="lead">A new growth opportunity, a business line, transformation, partnerships, or just an experienced outside view -it starts with a conversation. You don&apos;t need a fully defined project to reach out.</p>
            </div>
          </div>
        </div>
        {/*  ===================== FORM + INFO =====================  */}
        <section className="section no-border" style={{ "paddingTop": "80px" }}>
          <div className="container">
            <div className="grid grid-2" style={{ "gap": "48px", "alignItems": "flex-start" }}>
              <div className="form-wrap reveal">
                <h2 className="section-title" style={{ "fontSize": "24px", "marginBottom": "6px" }}>Tell me what you&apos;re working on</h2>
                <p style={{ "fontSize": "14.5px", "color": "var(--ink-soft)", "margin": "0 0 28px" }}>Fields marked are used to route your enquiry to the right conversation.</p>
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
                    <div className={`multiselect ${msOpen ? 'open' : ''}`} id="topicSelect">
                      <button aria-expanded={msOpen} aria-haspopup="listbox" className="multiselect-toggle" id="topicToggle" type="button" onClick={() => setMsOpen(!msOpen)}>
                        <span id="topicToggleText">{formData.topics.length > 0 ? formData.topics.join(', ') : 'Select one or more topics'}</span>
                        <svg className="ms-caret" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                      </button>
                      <div aria-labelledby="topicLabel" aria-multiselectable="true" className="multiselect-panel" role="listbox" style={{ display: msOpen ? 'block' : 'none' }}>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Growth Strategy" checked={formData.topics.includes("Growth Strategy")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Growth Strategy"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Growth Strategy") });
                        }} /><span>Growth Strategy</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="New Business Development" checked={formData.topics.includes("New Business Development")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "New Business Development"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "New Business Development") });
                        }} /><span>New Business Development</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Strategic Partnerships" checked={formData.topics.includes("Strategic Partnerships")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Strategic Partnerships"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Strategic Partnerships") });
                        }} /><span>Strategic Partnerships</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Transformation" checked={formData.topics.includes("Transformation")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Transformation"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Transformation") });
                        }} /><span>Transformation</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Enterprise Value" checked={formData.topics.includes("Enterprise Value")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Enterprise Value"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Enterprise Value") });
                        }} /><span>Enterprise Value</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Executive Advisory" checked={formData.topics.includes("Executive Advisory")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Executive Advisory"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Executive Advisory") });
                        }} /><span>Executive Advisory</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Fractional Executive Support" checked={formData.topics.includes("Fractional Executive Support")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Fractional Executive Support"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Fractional Executive Support") });
                        }} /><span>Fractional Executive Support</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Speaking / Events" checked={formData.topics.includes("Speaking / Events")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Speaking / Events"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Speaking / Events") });
                        }} /><span>Speaking / Events</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Media / Interview" checked={formData.topics.includes("Media / Interview")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Media / Interview"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Media / Interview") });
                        }} /><span>Media / Interview</span></label>
                        <label className="ms-option"><input name="topic" type="checkbox" value="Other" checked={formData.topics.includes("Other")} onChange={(e) => {
                          if (e.target.checked) setFormData({ ...formData, topics: [...formData.topics, "Other"] });
                          else setFormData({ ...formData, topics: formData.topics.filter(t => t !== "Other") });
                        }} /><span>Other</span></label>
                      </div>
                    </div>
                    <span className="field-hint">Select as many as apply -this list opens and closes like a normal dropdown.</span>
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

                  {/* Discovery Call Booking Calendar */}
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

                  <button className="btn btn-brass" style={{ "width": "100%", "marginTop": "8px" }} type="submit">Send Enquiry</button>
                  {formStatus && <p>{formStatus}</p>}
                </form>
              </div>
              <div className="reveal">
                <div className="eyebrow">What Happens Next</div>
                <h2 className="section-title" style={{ "fontSize": "22px" }}>After you reach out</h2>
                <div className="process" style={{ "gridTemplateColumns": "1fr", "gap": "0" }}>
                  <div className="numbered"><div className="idx">01</div><div className="body"><p style={{ "margin": "0" }}>You share a short note on your organisation, challenge, or question.</p></div></div>
                  <div className="numbered"><div className="idx">02</div><div className="body"><p style={{ "margin": "0" }}>I review your message personally and respond if there's a fit.</p></div></div>
                  <div className="numbered"><div className="idx">03</div><div className="body"><p style={{ "margin": "0" }}>If there's alignment, we schedule a call to explore in more detail.</p></div></div>
                  <div className="numbered"><div className="idx">04</div><div className="body"><p style={{ "margin": "0" }}>Together, we decide on the right engagement scope and structure.</p></div></div>
                </div>
                <div className="eyebrow" style={{ "marginTop": "40px" }}>Direct Contact &amp; Enquiries</div>
                <h2 className="section-title" style={{ "fontSize": "22px" }}>Other ways to connect</h2>
                <div className="contact-list">
                  <div className="row">
                    <div className="ic"><svg aria-hidden="true" className="icon-linkedin" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"></path></svg></div>
                    <div><h5>LinkedIn</h5><p>Connect with Robin directly for updates and conversation.</p></div>
                  </div>
                  <div className="row">
                    <div className="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg></div>
                    <div><h5>Speaking &amp; Events</h5><p>Available for executive conversations, leadership events, workshops, and panels.</p></div>
                  </div>
                  <div className="row">
                    <div className="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg></div>
                    <div><h5>Partnership Enquiries</h5><p>For organisations exploring a strategic partnership or collaboration.</p></div>
                  </div>
                  <div className="row">
                    <div className="ic"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></div>
                    <div><h5>Email</h5><p><a href="mailto:robinjones@gmail.com" style={{ "color": "var(--brass-deep)", "fontWeight": "600" }}>robinjones@gmail.com</a></p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      <PublicFooter />
      <RevealHook />
    </>
  );
}
