const fs = require('fs');

let jsx = fs.readFileSync('src/app/public-dump.jsx', 'utf-8');

// 1. Remove the trailing script tag and its contents if present
jsx = jsx.replace(/<script>[\s\S]*?<\/script>/g, '');

// 2. Prepare the Page Component wrapper
const top = `
import React, { useState, useEffect } from 'react';
import './public-contour.css';
import { PrismaClient } from '@prisma/client';

export default async function Page() {
  const prisma = new PrismaClient();
  const posts = await prisma.blogPost.findMany({
    where: { status: 'Published' },
    orderBy: { publishedAt: 'desc' },
  });

  return <ClientPage initialPosts={posts} />;
}
`;

const clientTop = `
'use client';
import React, { useState, useEffect } from 'react';
import './public-contour.css';

export function ClientPage({ initialPosts }) {
  const [activeNav, setActiveNav] = useState('home');
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActiveNav(hash);
      setNavOpen(false);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavClick = (e, val) => {
    e.preventDefault();
    window.location.hash = '#' + val;
  };

  const navClass = "nav-links" + (navOpen ? " open" : "");
  const scrimClass = "nav-scrim" + (navOpen ? " open" : "");

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [formStatus, setFormStatus] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Submitting...');
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'Website' })
      });
      if (res.ok) {
        setFormStatus('Success! We will be in touch soon.');
        setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
      } else {
        setFormStatus('Error submitting form.');
      }
    } catch {
      setFormStatus('Error submitting form.');
    }
  };

  return (
    <>
`;

// Replace navLinks dynamically
jsx = jsx.replace('className="nav-links" id="navLinks"', 'className={navClass}');
jsx = jsx.replace(/<a data-nav="([^"]+)" href="#[^"]+">([^<]+)<\/a>/g, (match, p1, p2) => {
    return `<a className={activeNav === '${p1}' ? 'active' : ''} href="#${p1}" onClick={(e) => handleNavClick(e, '${p1}')}>${p2}</a>`;
});

// Replace active states of page-blocks
jsx = jsx.replace(/<div className="page-block(?: active)?" id="([^"]+)">/g, (match, p1) => {
    return `<div className={"page-block" + (activeNav === '${p1}' ? ' active' : '')} id="${p1}">`;
});

// Update the nav toggle button
jsx = jsx.replace('id="navToggle"', 'onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}');
jsx = jsx.replace('id="navScrim"', 'className={scrimClass} onClick={() => setNavOpen(false)}');

// Contact Form Integration
// Look for `<form class="form-grid">` or something similar inside public-dump.jsx
// It looks like there isn't a strict <form> tag, but typically inputs.
// I'll wrap the grid containing inputs in a <form> tag with onSubmit={handleContactSubmit}.
jsx = jsx.replace('<div className="form-grid">', '<form className="form-grid" onSubmit={handleContactSubmit}>');

// Now add values and onChange to inputs in the form
const mapInput = (str, type, nameField, fieldName) => {
    return str.replace(new RegExp(`<${type} (.*?)name="${nameField}"(.*?)>`), `<${type} $1name="${nameField}" value={formData.${fieldName}} onChange={e => setFormData({...formData, ${fieldName}: e.target.value})} $2>`);
}
jsx = mapInput(jsx, 'input', 'name', 'name');
jsx = mapInput(jsx, 'input', 'email', 'email');
jsx = mapInput(jsx, 'input', 'phone', 'phone');
jsx = mapInput(jsx, 'input', 'company', 'company');
jsx = mapInput(jsx, 'textarea', 'message', 'notes'); // Assuming 'notes' goes to 'message'
jsx = jsx.replace('<a className="btn btn-primary" href="#">Send Message</a>', '<button className="btn btn-primary" type="submit">Send Message</button>{formStatus && <div style={{marginTop: 10}}>{formStatus}</div>}');
// sometimes it's `<button ...>Submit</button>`. Let's just do a generic replace for the button:
jsx = jsx.replace(/<a[^>]*href="#"[^>]*>Send Message<\/a>/, '<button className="btn btn-primary" type="submit" style={{gridColumn: "1 / -1", height: 50}}>Send Message</button><p style={{gridColumn: "1 / -1"}}>{formStatus}</p></form>');

const bottom = `
    </>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', top + clientTop + jsx + bottom);
