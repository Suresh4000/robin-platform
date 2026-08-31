import React from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialEvents = await prisma.event.findMany({
    where: {
      status: { in: ["Published", "Completed"] },
      type: { not: 'Discovery Call' }
    },
    orderBy: { date: "asc" }
  });

  return (<><PublicNav />
    <div>
      {/*  ===================== HERO =====================  */}
      <div className="hero">
        <div className="container">
          <div className="reveal" style={{ "maxWidth": "760px" }}>
            <div className="eyebrow">Events</div>
            <h1 style={{ "marginBottom": "20px" }}>Talks, workshops &amp; <em>conversations that move rooms</em></h1>
            <p className="lead">Upcoming appearances, panels, and workshops -plus a look at where I've spoken before. Available for leadership events, executive education, and podcasts.</p>
            <div className="hero-actions">
              <a className="btn btn-brass" href="#upcoming-events">See Upcoming Events</a>
              <a className="btn btn-ghost" href="/contact">Invite Me to Speak</a>
            </div>
          </div>
        </div>
      </div>
      {/*  ===================== BANNER =====================  */}
      <section className="section no-border" style={{ "paddingTop": "0" }}>
        <div className="container">
          <div className="reveal" style={{ "borderRadius": "20px", "overflow": "hidden", "aspectRatio": "21/8", "boxShadow": "0 30px 60px -20px rgba(20,15,5,.28)" }}>
            <Image width={800} height={800} alt="Speaker presenting on stage to a conference audience" src="https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?q=80&w=1600&auto=format&fit=crop" style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
          </div>
        </div>
      </section>
      {/*  ===================== UPCOMING EVENTS =====================  */}
      <section className="section section-alt" id="upcoming">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">Upcoming</div>
            <h2 className="section-title">Where to find me next</h2>
          </div>
          <div className="events-list reveal">
            {(initialEvents?.filter(e => new Date(e.date) >= new Date()) || []).length > 0 ? (
              initialEvents!.filter(e => new Date(e.date) >= new Date()).map(event => {
                const dateObj = new Date(event.date);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const mon = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                return (
                  <div key={event.id} className="event-card">
                    <div className="event-date">
                      <div className="day">{day}</div>
                      <div className="mon">{mon}</div>
                    </div>
                    <div className="event-body">
                      <div className="event-meta" style={{ marginBottom: '8px' }}>
                        <span><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>{time} ({event.duration} min)</span>
                        <span className="tag" style={{ margin: 0, scale: 0.9 }}>{event.type}</span>
                      </div>
                      <h4 style={{ marginBottom: '8px' }}>{event.title}</h4>
                      <div className="event-meta" style={{ marginTop: 'auto' }}>
                        <span><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>{event.location}</span>
                      </div>
                    </div>
                    <div className="event-actions"><a className="btn btn-ghost btn-sm" href={`/events/${event.id}`}>View more</a></div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-soft)' }}>No upcoming events currently scheduled. Check back soon.</div>
            )}
          </div>
        </div>
      </section>
      {/*  ===================== PAST EVENTS =====================  */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">Past Events</div>
            <h2 className="section-title">Where I've spoken before</h2>
          </div>
          <div className="events-list reveal">
            {(initialEvents?.filter(e => new Date(e.date) < new Date()) || []).length > 0 ? (
              initialEvents!.filter(e => new Date(e.date) < new Date()).map(event => {
                const dateObj = new Date(event.date);
                const day = dateObj.getDate().toString().padStart(2, '0');
                const mon = dateObj.toLocaleDateString('en-US', { month: 'short' });
                return (
                  <div key={event.id} className="event-card is-past">
                    <div className="event-date">
                      <div className="day">{day}</div>
                      <div className="mon">{mon}</div>
                    </div>
                    <div className="event-body">
                      <div className="event-meta" style={{ marginBottom: '8px' }}>
                        <span className="tag" style={{ margin: 0, scale: 0.9 }}>{event.type}</span>
                      </div>
                      <h4 style={{ marginBottom: '8px' }}>{event.title}</h4>
                      <div className="event-meta" style={{ marginTop: 'auto' }}>
                        <span><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>{event.location}</span>
                      </div>
                    </div>
                    <div className="event-actions"><a className="btn btn-ghost btn-sm" href={`/events/${event.id}`}>View more</a></div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-soft)' }}>No past events tracked.</div>
            )}
          </div>
        </div>
      </section>
      {/*  ===================== INVITE CTA =====================  */}
      <section className="section no-border">
        <div className="container">
          <div className="cta-band reveal">
            <div >
              <h2 style={{ color: "#fff" }}>Have an event in mind?</h2>
              <p>I speak on growth, transformation, strategic partnerships, and enterprise value -for leadership events, executive education, podcasts, and panels.</p>
            </div>
            <div className="cta-band-actions">
              <a className="btn btn-brass" href="/contact">Invite Me to Speak</a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <PublicFooter /><RevealHook /></>);
};
