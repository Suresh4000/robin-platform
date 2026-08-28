"use client";
import React, { useState } from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";

export default function Page() {

    const handleAccordionClick = (e: any) => {
        const target = e.target.closest('.tl-toggle');
        if (!target) return;
        const entry = target.closest('.tl-entry');
        if (entry) {
            const isO = entry.classList.contains('is-open');
            const accordion = entry.closest('.tl-accordion');
            if (accordion) {
                accordion.querySelectorAll('.tl-entry').forEach((el: { classList: { remove: (arg0: string) => void; }; querySelector: (arg0: string) => any; }) => {
                    el.classList.remove('is-open');
                    const toggle = el.querySelector('.tl-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                });
            }
            if (!isO) {
                entry.classList.add('is-open');
                target.setAttribute('aria-expanded', 'true');
            }
        }
    };

    return (
        <>
            <PublicNav />
            <div>
                {/*  ===================== HERO =====================  */}
                <div className="hero">
                    <div className="container">
                        <div className="reveal" style={{ "maxWidth": "80%" }}>
                            <div className="eyebrow">Experience &amp; Impact</div>
                            <h1 style={{ "marginBottom": "20px" }}>Turning strategic challenges into <em>growth opportunities</em></h1>
                            <p className="lead" style={{ "maxWidth": "680px" }}>My experience spans growth strategy, transformation, business development, partnerships, and enterprise value -helping organizations find the opportunity, make the call, build the capability, and move from intention to execution.</p>
                            <div className="hero-actions"><a className="btn btn-brass" href="/contact">Start a Conversation</a></div>
                        </div>
                    </div>
                </div>
                {/*  ===================== EXPERIENCE BANNER =====================  */}
                <section className="section no-border" style={{ "paddingTop": "0" }}>
                    <div className="container">
                        <div className="reveal" style={{ "borderRadius": "20px", "overflow": "hidden", "aspectRatio": "21/8", "boxShadow": "0 30px 60px -20px rgba(20,15,5,.28)" }}>
                            <Image width={800} height={800} alt="A group of colleagues seated around a table discussing strategy" src="https://images.unsplash.com/photo-1739298061740-5ed03045b280?q=80&w=1600&auto=format&fit=crop" style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                        </div>
                    </div>
                </section>
                {/*  ===================== EXECUTIVE EXPERIENCE =====================  */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="grid grid-2" style={{ "gap": "56px" }}>
                            <div className="reveal">
                                <div className="eyebrow">Executive Experience</div>
                                <h2 className="section-title">Leadership across the growth &amp; transformation lifecycle</h2>
                                <p className="lead">Working at the intersection of strategy, commercial development, partnerships, innovation, and leadership gives me a wide-angle view of how growth actually gets built.</p>
                            </div>
                            <ul className="check-list reveal" style={{ "alignSelf": "center" }}>
                                <li>Developing and launching new business opportunities</li>
                                <li>Building growth strategies and market approaches</li>
                                <li>Creating and structuring strategic partnerships</li>
                                <li>Finding new sources of enterprise value</li>
                                <li>Leading transformation initiatives</li>
                                <li>Advising senior leaders on complex decisions</li>
                                <li>Aligning teams, stakeholders, and execution</li>
                            </ul>
                        </div>
                    </div>
                </section>
                {/*  ===================== CAREER TIMELINE =====================  */}
                <section className="section">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">Career Timeline</div>
                            <h2 className="section-title">26+ years across conservation, technology, and growth</h2>
                            <p className="lead">A detailed look at the organizations, roles, and outcomes behind that experience -from Fortune 500 corporate development to founder-led startups to mission-driven nonprofits.</p>
                        </div>
                        <div className="tl-group-label reveal">Executive &amp; Operating Leadership</div>
                        <div className="timeline reveal tl-accordion" onClick={handleAccordionClick}>
                            <div className="tl-entry is-open">
                                <div aria-expanded="true" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Executive Director</h3><span className="tl-company">Conservation Biology Institute</span></div>
                                        <div className="tl-meta"><span>Sep 2023 – Dec 2025 · 2 yrs 4 mos</span><span>·</span><span>Corvallis, Oregon · Remote</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">CBI is a non-partisan, science-based nonprofit working to support the conservation of biological diversity toward a healthier, more ecologically sustainable planet.</p>
                                        <ul className="check-list">
                                            <li>Directed organizational strategy, program development, fiscal management, and operational execution for national and international conservation initiatives</li>
                                            <li>Founded and launched the Global Wildfire Collective, recruiting 42 wildfire experts and 14 institutional partners from more than 26 nations in less than one year</li>
                                            <li>Obtained accredited observer status for CBI to the United Nations Convention to Combat Desertification and the United Nations Convention on Biological Diversity, with status pending for the United Nations Framework Convention on Climate Change</li>
                                            <li>Navigated the organization through major changes to Federal government funding</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Director and Co-Founder</h3><span className="tl-company">Global Wildfire Collective</span></div>
                                        <div className="tl-meta"><span>Oct 2024 – Present · 1 yr 11 mos</span><span>·</span><span>Part-time</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">An initiative of Conservation Biology Institute, the Global Wildfire Collective (GWC) facilitates scientific and strategic collaboration among research scientists, national policymakers, local communities, and firefighting agencies to enable wildfire resilience and recovery for ecological and social systems. As of July 2026, GWC consists of 42 charter members and 14 partner institutions from 26 countries.</p>
                                        <ul className="check-list">
                                            <li>Conceived, built, and launched the Global Wildfire Collective, growing to 42 charter members, 14 institutional partners, and participants from 26 countries</li>
                                            <li>Secured $30,000 in first significant philanthropic support before leading efforts that resulted in a $1.5M US National Science Foundation &amp; Gordon and Betty Moore Foundation award</li>
                                            <li>Developed and launched the Global Wildfire Collective Academy, creating a recurring earned-revenue model through professional education</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 1 1.1 7.15c-1.1-1.2-2-2.6-2.1-4.15" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Fractional COO</h3><span className="tl-company">FOREST FLOOR</span></div>
                                        <div className="tl-meta"><span>Feb 2026 – Aug 2026 · 7 mos</span><span>·</span><span>Denver, Colorado · Remote</span><span>·</span><span>Contract</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">The FOREST FLOOR™ Model 101 is the world&apos;s first fully-automatic mushroom growing platform. Partnered directly with two founders to transform an innovative product concept into an investor-ready, commercially viable business.</p>
                                        <ul className="check-list">
                                            <li>Guided founders through strategic prioritization, operational planning, and business model development</li>
                                            <li>Developed investor presentation materials and financial forecasting supporting angel fundraising</li>
                                            <li>Built integrated cash flow forecasting to guide capital allocation during early-stage operations</li>
                                            <li>Designed a beta customer strategy emphasizing influencer-led market validation and pre-sales</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Chief Executive Officer</h3><span className="tl-company">Monsoon Inc.</span></div>
                                        <div className="tl-meta"><span>Apr 2019 – Aug 2024 · 5 yrs 5 mos</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">Led a strategic turnaround and transformation of an established e-commerce SaaS platform serving thousands of online retailers globally across Amazon, eBay, Walmart, and multi-channel marketplaces.</p>
                                        <ul className="check-list">
                                            <li>Directed all aspects of company operations, including product strategy, sales, marketing, customer success, engineering, and finance</li>
                                            <li>Drove product innovation and platform optimization, enabling merchants to improve pricing strategy, inventory management, and order fulfillment</li>
                                            <li>Strengthened strategic partnerships with major marketplace platforms and developed go-to-market initiatives</li>
                                            <li>Created competitive acquisition dynamics among multiple prospective buyers, leading to a successful acquisition</li>
                                        </ul>
                                        <div className="tl-sub">
                                            <p className="tl-desc" style={{ "margin": "0" }}><strong style={{ "color": "var(--ink)" }}>Consultant, Product and Go-To-Market Strategy</strong> · Jan 2019 – Mar 2019 · 3 mos · Portland, OR</p>
                                        </div>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Senior VP, Marketing and Strategic Alliances</h3><span className="tl-company">Socrata</span></div>
                                        <div className="tl-meta"><span>Jul 2016 – Nov 2017 · 1 yr 5 mos</span><span>·</span><span>Seattle, Washington</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">Socrata is a global leader in cloud software designed exclusively for democratizing data for government. As a trusted advisor to the CEO during a period of organizational transformation, led executive alignment on go-to-market strategy while rebuilding marketing operations -leaving a 16-month tenure with the sales team enjoying 6X+ qualified pipeline coverage.</p>
                                        <ul className="check-list">
                                            <li>Asked by the CEO to turn around the marketing function after a reorg in which the CMO departed the company</li>
                                            <li>Cut 20% from the inherited budget, down to 12.4% of revenue</li>
                                            <li>Rebuilt target and customer databases, decreasing the bounce rate to less than 2%</li>
                                            <li>Strategically pruned the number of events and cut events budget by 28%, yet delivered an average of 4 on-target sales qualified opportunities per event (up from &lt;1)</li>
                                            <li>Re-established the product marketing function, developed sales enablement materials, and implemented Highspot</li>
                                            <li>Revamped demand generation, migrating to Pardot and achieving 100% marketing-influenced and 20% marketing-sourced revenue by end of tenure</li>
                                        </ul>
                                        <div className="tl-sub">
                                            <div className="tl-head"><h4 style={{ "fontFamily": "var(--display)", "fontWeight": "600", "fontSize": "15.5px", "margin": "0", "color": "var(--ink)" }}>VP, Strategic Growth and Acting GM, Socrata for Public Safety</h4></div>
                                            <div className="tl-meta" style={{ "margin": "6px 0 10px" }}><span>Oct 2015 – Jul 2016 · 10 mos</span></div>
                                            <ul className="check-list">
                                                <li>Negotiated and closed a multi-million dollar partnership with Motorola Solutions to revive their CrimeReports.com application within the first quarter</li>
                                                <li>Managed a cross-functional team of 9 to build, launch, and manage the CrimeReports business</li>
                                                <li>Grew CrimeReports revenue by more than 50% and increased site traffic by &gt;150% over 18 months</li>
                                                <li>Established a joint practice with Grant Thornton to sell Socrata-based solutions to US State DOTs</li>
                                            </ul>
                                        </div>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Director, Tech Sector (OEM and Developer Line of Business)</h3><span className="tl-company">Esri</span></div>
                                        <div className="tl-meta"><span>Oct 2012 – Sep 2015 · 3 yrs</span><span>·</span><span>Portland, OR</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">Upon Esri's acquisition of Geoloqi, proposed and established a new line of business OEM-licensing Esri's mapping capabilities into popular business software platforms (BI, CRM, etc.) as a "Trojan Horse" for deeper GIS adoption. Led the developer and OEM sector at the world&apos;s leading location and GIS platform.</p>
                                        <ul className="check-list">
                                            <li>Led a cross-functional team of 17 across the startup program, developer evangelism, industry marketing, and strategic partnerships</li>
                                            <li>Built the tech sector from $0 to $2.9M in revenue in less than two years</li>
                                            <li>Landed deals with 4 of the top 6 business intelligence platform companies</li>
                                            <li>Led alliances with MicroStrategy and Information Builders, resulting in Esri maps as the default map in Analytics Desktop and WebFOCUS respectively</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Chief Operating Officer</h3><span className="tl-company">Geoloqi.com</span></div>
                                        <div className="tl-meta"><span>Oct 2011 – Oct 2012 · 1 yr 1 mo</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">Geoloqi's platform enabled application developers to add location-awareness and geo-triggered actions to their mobile apps. Acquired by Esri in October 2012.</p>
                                        <ul className="check-list">
                                            <li>Conducted angel and venture-backed financing rounds, totaling $1M+</li>
                                            <li>Managed all Marketing, Sales, HR, Finance, and Operations activities</li>
                                            <li>Engaged in paid pilots with marquee brands such as AT&amp;T, American Express, and PepsiCo</li>
                                            <li>Led the strategy and execution of a competitive bid acquisition, resulting in a profitable exit for employees, founders, and investors</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Principal</h3><span className="tl-company">The Point Consulting</span></div>
                                        <div className="tl-meta"><span>Jan 2006 – Apr 2012 · 6 yrs 4 mos</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">Business development, strategic marketing, and startup advisory services -for both established companies and early-stage founders, including customer/investor presentation development, business modeling, partnership negotiation, and venture capital introductions.</p>
                                        <ul className="check-list">
                                            <li>Advised on strategic partnerships, joint development structures, market entry strategies, and budget prioritization</li>
                                            <li>Prepared founders for investor diligence and venture investment negotiation</li>
                                            <li>Clients included Ashoka, Avnera, Geoloqi, Intellectual Ventures, Astro Studios, Loctronix, and UPEK</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">General Manager, Audio Business Unit</h3><span className="tl-company">Avnera Corporation</span></div>
                                        <div className="tl-meta"><span>Nov 2009 – Jan 2012 · 2 yrs 3 mos</span><span>·</span><span>Acting / Consultant</span><span>·</span><span>Beaverton, OR</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">CEO &amp; Founder</h3><span className="tl-company">88, Inc.</span></div>
                                        <div className="tl-meta"><span>Nov 2007 – Sep 2011 · 3 yrs 11 mos</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">88, Inc. created collections of jewelry and accessories that seamlessly integrated technology and fashion design -products built by women, with a woman's reality in mind.</p>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">VP Marketing and Business Development, Co-Founder</h3><span className="tl-company">FonJax</span></div>
                                        <div className="tl-meta"><span>Jan 2006 – Jan 2008 · 2 yrs 1 mo</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">FonJax provided remote access and control of physical handsets on live carrier networks over the internet -streamlining deployment, monitoring, and QA/automation testing of mobile applications and content for developers.</p>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Acting Mobile Product Marketing Manager</h3><span className="tl-company">UPEK</span></div>
                                        <div className="tl-meta"><span>Jan 2006 – Jan 2008 · 2 yrs 1 mo</span><span>·</span><span>Consultant</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <ul className="check-list">
                                            <li>Prepared and obtained board/executive approval for a mobile market-entry strategy</li>
                                            <li>Launched a mobile-ready product at 3GSM, including messaging, partner/customer meetings, and tradeshow presence</li>
                                            <li>Drove business development with mobile operators, device OEMs, and application developers</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Director, Wireless Partnerships and Acquisitions</h3><span className="tl-company">Freescale Semiconductor</span></div>
                                        <div className="tl-meta"><span>Mar 2004 – Dec 2005 · 1 yr 10 mos</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <ul className="check-list">
                                            <li>Led global strategic alliance, IP licensing, M&amp;A, joint venture, and equity investment activity for the Wireless and Mobile Systems Group, a $1.6B business</li>
                                            <li>Managed a five-person, geographically dispersed business development team</li>
                                            <li>Led the acquisition of PrairieComm, including diligence, negotiation, and integration of the 120-person wireless platforms company</li>
                                            <li>Led and supervised negotiation of ~40 third-party IP licensing agreements, enabling Freescale's first 3G platform sales to non-Motorola customers</li>
                                            <li>Ranked in the top 10% of 2004 Freescale employee performance assessments</li>
                                        </ul>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Investment Manager</h3><span className="tl-company">Motorola Ventures</span></div>
                                        <div className="tl-meta"><span>Jun 2000 – Mar 2004 · 3 yrs 10 mos</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <ul className="check-list">
                                            <li>Managed west-coast operations, including due diligence, valuation, investment, and board observation for early- and mid-stage equity investments ranging from $1M–5M</li>
                                            <li>Responsible for portfolio companies including Entropic Communications, Dilithium Networks, Rosum, Aligo, EndForce, Identix, and Iconix Pharmaceuticals; served as observer on four boards; over $23M under management</li>
                                            <li>Reviewed the financial viability and strategic relevance of hundreds of west-coast startups against Motorola's product and strategy roadmaps</li>
                                            <li>Helped extract over $12.5M in strategic value from portfolio company relationships</li>
                                        </ul>
                                        <div className="tl-sub">
                                            <div className="tl-head"><h4 style={{ "fontFamily": "var(--display)", "fontWeight": "600", "fontSize": "15.5px", "margin": "0", "color": "var(--ink)" }}>Project Manager / Business Development Manager</h4></div>
                                            <div className="tl-meta" style={{ "margin": "6px 0 10px" }}><span>May 1996 – Jun 2000 · 4 yrs 2 mos</span></div>
                                            <ul className="check-list">
                                                <li>Managed implementation of a $3.6M contract to design application-layer software for Motorola's first smartphone and smartpager for Greater China</li>
                                                <li>Responsible for a fifteen-engineer team's schedule, budget, tasks, and resources</li>
                                                <li>Negotiated and secured a $900K software development/licensing agreement</li>
                                            </ul>
                                        </div>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Chief Operating Officer</h3><span className="tl-company">Public Market</span></div>
                                        <div className="tl-meta"><span>Jan 2018 – Dec 2018 · 1 yr</span><span>·</span><span>Portland, OR</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc">Public Market built an architectural layer for peer-to-peer commerce -an e-commerce database, universal catalogue, and trust protocol designed to replace the essential functions of monopoly marketplaces with a decentralized, lower-cost alternative.</p>
                                        <p className="tl-desc" style={{ "margin": "0" }}>As COO, wore many hats depending on the needs of the business -spanning product management, financial projections, strategic partnerships, marketing, fundraising, recruitment, and HR.</p>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-3.408 0l-1.569-1.568c-.23-.23-.556-.338-.878-.29-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02.048-.322-.059-.648-.289-.878L2.61 12.09a2.404 2.404 0 0 1 0-3.408l1.568-1.568c.23-.23.338-.556.29-.879-.074-.493-.504-.84-.968-1.02a2.5 2.5 0 1 1 3.237-3.237c.18.464.527.894 1.02.967.322.048.648-.059.878-.289l1.568-1.568a2.404 2.404 0 0 1 3.408 0l1.611 1.567c.23.23.556.338.878.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Founder &amp; CEO</h3><span className="tl-company">Moica, Inc.</span></div>
                                        <div className="tl-meta"><span>Jan 2020 – Jan 2022 · 2 yrs 1 mo</span><span>·</span><span>Portland, Oregon</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc" style={{ "margin": "0" }}>Built the next generation of group-scheduling productivity tools.</p>
                                    </div></div></div>
                            <div className="tl-entry">
                                <div aria-expanded="false" className="tl-head-row tl-toggle" role="button" tabIndex={0}>
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Principal Consultant and Founder</h3><span className="tl-company">Bizmaven.me</span></div>
                                        <div className="tl-meta"><span>Jan 2019 – Jan 2020 · 1 yr 1 mo</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                    <span className="tl-chevron"><svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span></div><div className="tl-body"><div className="tl-body-inner">
                                        <p className="tl-desc" style={{ "margin": "0" }}>Strategic guidance across every facet of startup and small business operations -from viability assessment and fundraising prep to product roadmap, team building, partnerships, and exit. Clients included Conservation Biology Institute, Phylos Bioscience, MicroMentor, Tokeativity, and TiE Oregon.</p>
                                    </div></div></div>
                        </div>
                        <div className="tl-group-label reveal">Board, Advisory &amp; Investment Roles</div>
                        <div className="timeline reveal">
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Board Member and Treasurer</h3><span className="tl-company">Conservation Biology Institute</span></div>
                                        <div className="tl-meta"><span>May 2022 – Present · 4 yrs 4 mos</span><span>·</span><span>Part-time</span><span>·</span><span>Portland, Oregon</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Board Member and Treasurer</h3><span className="tl-company">TiE Oregon &amp; TiE Oregon Foundation</span></div>
                                        <div className="tl-meta"><span>Feb 2015 – Present · 11 yrs 7 mos</span><span>·</span><span>Part-time</span><span>·</span><span>Portland, Oregon</span></div>
                                    </div>
                                </div>
                                <p className="tl-desc">TiE Oregon (501(c)6) and TiE Oregon Foundation (501(c)3) foster entrepreneurship through mentoring, networking, education, funding, and incubation -nurturing the next generation of entrepreneurs.</p>
                                <div className="tl-sub">
                                    <p className="tl-desc" style={{ "margin": "0" }}><strong style={{ "color": "var(--ink)" }}>TiE Oregon Foundation President</strong> · Mar 2023 – Jun 2024 · 1 yr 4 mos</p>
                                </div>
                            </div>
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Board Member</h3><span className="tl-company">Handful</span></div>
                                        <div className="tl-meta"><span>Jan 2019 – Present · 7 yrs 8 mos</span><span>·</span><span>Part-time</span><span>·</span><span>Portland, Oregon</span></div>
                                    </div>
                                </div>
                                <p className="tl-desc" style={{ "margin": "0" }}>Activewear that supports grabbing life by the handful -sports bras that flatter, not flatten.</p>
                            </div>
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Member of the Board of Advisors</h3><span className="tl-company">MicroMentor</span></div>
                                        <div className="tl-meta"><span>Sep 2018 – Sep 2023 · 5 yrs 1 mo</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                </div>
                                <p className="tl-desc" style={{ "margin": "0" }}>Strategic advisor to the Executive Director of MicroMentor (a Mercy Corps program) through the redesign and launch of an updated mentoring platform.</p>
                            </div>
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Executive Partner</h3><span className="tl-company">Elevate Capital Fund</span></div>
                                        <div className="tl-meta"><span>Jan 2016 – Jan 2021 · 5 yrs 1 mo</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                </div>
                                <p className="tl-desc" style={{ "margin": "0" }}>Screened investment opportunities, mentored portfolio company founders, and served as Nitin Rai's proxy on several boards of directors -a pro-bono role in support of Elevate's mission for the Portland entrepreneurial community.</p>
                            </div>
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="15" r="4" /><circle cx="18" cy="15" r="4" /><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" /><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Advisor – Partnerships &amp; Marketplace</h3><span className="tl-company">Morpheus XR</span></div>
                                        <div className="tl-meta"><span>Jul 2021 – Sep 2023 · 2 yrs 3 mos</span><span>·</span><span>Part-time</span><span>·</span><span>Portland, Oregon</span></div>
                                    </div>
                                </div>
                                <p className="tl-desc" style={{ "margin": "0" }}>Advised an enterprise-grade metaverse platform and marketplace for immersive corporate experiences supporting culture and connection for distributed teams.</p>
                            </div>
                            <div className="tl-entry is-advisory">
                                <div className="tl-head-row">
                                    <div className="tl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 19-9-9 19-2-8-8-2z" /></svg></div>
                                    <div>
                                        <div className="tl-head"><h3 className="tl-role">Advisor and Mentor</h3><span className="tl-company">The Initiative</span></div>
                                        <div className="tl-meta"><span>Jan 2019 – Apr 2019 · 4 mos</span><span>·</span><span>Portland, Oregon Metro</span></div>
                                    </div>
                                </div>
                                <p className="tl-desc" style={{ "margin": "0" }}>An accelerator, business bootcamp, and funding resource for female-founded cannabis businesses. Cohort #1 included Alta Social/Tokeativity, Barbari, Hana Medicinals, Hurban Society, Leif Goods, Make+Mary, Mendi, Orevape, and Verte Essentials.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/*  ===================== HOW I CREATE IMPACT =====================  */}
                <section className="section">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">How I Create Impact</div>
                            <h2 className="section-title">A practical approach -from opportunity to outcome</h2>
                        </div>
                        <div className="process reveal">
                            <div className="step"><div className="dot">01</div><h4>Discover</h4><p>Understand the organization, market, and opportunity.</p></div>
                            <div className="step"><div className="dot">02</div><h4>Define</h4><p>Get clear on the strategic opportunity and desired outcome.</p></div>
                            <div className="step"><div className="dot">03</div><h4>Develop</h4><p>Build the strategy, partnerships, or roadmap needed.</p></div>
                            <div className="step"><div className="dot">04</div><h4>Deliver</h4><p>Turn strategy into action, measurement, and momentum.</p></div>
                        </div>
                        <p className="italic-line" style={{ "marginTop": "36px" }}>A continuous line between thinking, deciding, and doing.</p>
                    </div>
                </section>
                {/*  ===================== AREAS OF IMPACT =====================  */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">Areas of Impact</div>
                            <h2 className="section-title">Where I've created the most value</h2>
                        </div>
                        <div className="grid grid-2">
                            <div className="card reveal">
                                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg></div>
                                <h4>Strategic Partnerships</h4>
                                <p>The right partnership opens markets and capability you couldn't build alone. I start with the business objective -not the relationship itself -and build from partner identification through to a structured collaboration model and roadmap.</p>
                            </div>
                            <div className="card reveal">
                                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg></div>
                                <h4>New Business Line Development</h4>
                                <p>An idea isn't a business line. Getting there means understanding the market need, commercial model, required capability, and path to scale. I turn the initial opportunity into a structured proposition leadership can evaluate, fund, and execute.</p>
                            </div>
                            <div className="card reveal">
                                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg></div>
                                <h4>Transformation Leadership</h4>
                                <p>Transformation fails when strategy and execution drift apart. I help organizations understand what needs to change, why it matters, and how to get there -factoring in leadership alignment, operating model, capability, and accountability.</p>
                            </div>
                            <div className="card reveal">
                                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg></div>
                                <h4>Enterprise Value Creation</h4>
                                <p>Enterprise value is often already inside the business -in relationships, capabilities, assets, and market position most leaders overlook. I identify where that value sits and build a roadmap to unlock it.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/*  ===================== NEXT STEP =====================  */}
                <section className="section no-border">
                    <div className="container">
                        <div className="cta-band reveal">
                            <div>
                                <h2 style={{ "color": "#fff" }}>Growth opportunity is often hiding inside the challenge you already have</h2>
                                <p>A new business line, a stronger partnership, or an overlooked capability could be your next source of value.</p>
                            </div>
                            <div className="cta-band-actions">
                                <a className="btn btn-brass" href="/contact">Talk to Me</a>
                                <a className="btn btn-ghost-invert" href="/services">Explore Services</a>
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
