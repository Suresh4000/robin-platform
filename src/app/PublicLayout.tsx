"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './public-contour.css';

export function PublicNav() {
    const pathname = usePathname();
    const [navOpen, setNavOpen] = useState(false);
    const navClass = "nav-links" + (navOpen ? " open" : "");
    const scrimClass = "nav-scrim" + (navOpen ? " open" : "");

    return (
        <>
            <nav className="nav">
        <div className="nav-row">
          <Link className="brand" href="/">
            <span className="mark"><svg fill="none" stroke="#F6F3EC" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5.4"></circle><circle cx="12" cy="12" r="1.8"></circle></svg></span>
            <span>Robin Jones
              {/*  <small>Growth · Partnerships · Transformation</small>  */}
            </span>
          </Link>
          <div className={navClass}>
            <Link className={pathname === '/' ? 'active' : ''} href="/" onClick={() => setNavOpen(false)}>Home</Link>
            <Link className={pathname.startsWith('/about') ? 'active' : ''} href="/about" onClick={() => setNavOpen(false)}>About</Link>
            <Link className={pathname.startsWith('/portfolio') ? 'active' : ''} href="/portfolio" onClick={() => setNavOpen(false)}>Experience &amp; Impact</Link>
            <Link className={pathname.startsWith('/services') ? 'active' : ''} href="/services" onClick={() => setNavOpen(false)}>Services</Link>
            <Link className={pathname.startsWith('/insights') ? 'active' : ''} href="/insights" onClick={() => setNavOpen(false)}>Insights &amp; Media</Link>
            <Link className={pathname.startsWith('/blog') ? 'active' : ''} href="/blog" onClick={() => setNavOpen(false)}>Blog</Link>
            <Link className={pathname.startsWith('/events') ? 'active' : ''} href="/events" onClick={() => setNavOpen(false)}>Events</Link>
          </div>
          <div className="nav-cta">
            <Link className="btn btn-primary btn-sm" href="/contact">Book a Conversation</Link>
            <button aria-label="Open menu" className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}><svg className="icon-open" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"></path></svg><svg className="icon-close" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
          </div>
        </div>
      </nav>
            
        <div className={scrimClass} onClick={() => setNavOpen(false)}></div>
        </>
    );
}

export function PublicFooter() {
    return (
        <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link className="brand" href="/">
                <span className="mark"><svg fill="none" stroke="#F6F3EC" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5.4"></circle><circle cx="12" cy="12" r="1.8"></circle></svg></span>
                <span>Robin Jones</span>
              </Link>
              <p>Fractional executive leadership for organizations building new business value -through growth strategy, strategic partnerships, and transformation.</p>
            </div>
            <div className="footer-col">
              <h5>Quick Links</h5>
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/portfolio">Experience &amp; Impact</Link>
              <Link href="/services">Services</Link>
            </div>
            <div className="footer-col">
              <h5>More</h5>
              <Link href="/insights">Insights &amp; Media</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/events">Events</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h5>Get in Touch</h5>
              <Link href="mailto:robinjones@gmail.com">robinjones@gmail.com</Link>
              <Link href="https://www.linkedin.com/in/robintjones/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</Link>
              <Link href="https://www.facebook.com/wubledoo" target="_blank" rel="noopener noreferrer">Follow on Facebook</Link>
              {/* <span style={{ "display": "block", "padding": "6px 0", "color": "#9AA0AC", "fontSize": "14.5px" }}>Working globally</span> */}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© <span className="year"></span> Robin Jones. All rights reserved.</span>
            <div className="socials">
              <Link aria-label="LinkedIn" href="https://www.linkedin.com/in/robintjones/" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" className="icon-linkedin" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"></path></svg></Link>
              <Link aria-label="Facebook" href="https://www.facebook.com/wubledoo" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></Link>
              <Link aria-label="Email" href="mailto:robinjones@gmail.com"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></Link>
            </div>
          </div>
        </div>
      </footer>
    );
}
