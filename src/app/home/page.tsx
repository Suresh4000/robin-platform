import React from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";

export default function Page() {
    return (
        <>
            <PublicNav />
            <div>
        {/*  ===================== HERO =====================  */}
        <header className="hero">
          <div className="container hero-grid">
            <div>
              <div className="hero-eyebrow-chips">
                <span className="chip">Fractional Executive</span>
                <span className="chip">Strategic Growth Advisor</span>
                <span className="chip">Speaker</span>
              </div>
              <h1>Build new business value through <em>strategic leadership</em></h1>
              <p className="lead">The best opportunity in your organization is probably already inside it -waiting to be seen, aligned, and acted on.</p>
              <p className="lead">I partner with founders, CEOs, and boards to build that value into growth: through strategic partnerships, new business lines, and organizational transformation.</p>
              <p className="italic-line">26+ years driving growth, partnerships, and transformation across business, government, and mission-driven organizations.</p>
              <div className="hero-actions">
                <a className="btn btn-brass" href="/">Book a Discovery Conversation <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
                <a className="btn btn-ghost" href="/portfolio">View Experience &amp; Impact</a>
              </div>
            </div>
            <div className="hero-visual">
              {/*  <svg className="rings" fill="none" viewBox="0 0 440 440">
<circle cx="220" cy="220" r="218" stroke="#CDC4AE" strokeWidth="1"></circle>
<circle cx="220" cy="220" r="184" stroke="#D7A85F" strokeDasharray="2 7" strokeWidth="1"></circle>
<circle cx="220" cy="220" r="150" stroke="#CDC4AE" strokeWidth="1"></circle>
<circle cx="220" cy="220" r="150" stroke="#1F3D34" strokeDasharray="180 800" strokeWidth="1.5"></circle>
<circle cx="36" cy="220" fill="#A8732B" r="4"></circle>
<circle cx="404" cy="220" fill="#1F3D34" r="4"></circle>
<circle cx="220" cy="10" fill="#CDC4AE" r="3"></circle>
</svg>  */}
              <div className="hero-photo">
                <Image width={800} height={800} alt="Robin Jones, fractional executive and strategic growth advisor" priority src="https://svaantech.com/wp-content/uploads/2026/08/1780964714422.png"  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="float-card float-1"><div className="n">26+</div><div className="l">Years Experience</div></div>
              <div className="float-card float-2"><div className="n">3</div><div className="l">Ways to Engage</div></div>
            </div>
          </div>
        </header>
        {/*  ===================== WHO I HELP =====================  */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">Who I Help</div>
              <h2 className="section-title">Strategic support for the leaders building what&apos;s next</h2>
            </div>
            <div className="grid grid-4">
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" /></svg></div>
                <h4>CEOs &amp; Founders</h4>
                <p>When growth stops being about new customers and starts being about business model, positioning, and partnerships -I help you build for enterprise value, not just revenue.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                <h4>Executive Teams &amp; Boards</h4>
                <p>Transformation, operational pressure, innovation, stakeholders pulling in different directions -I bring an independent view and align your team around outcomes that matter.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 19.9A2 2 0 0 0 6.575 22h10.85a2 2 0 0 0 1.854-2.1l-5.07-9.477A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></svg></div>
                <h4>Research &amp; Innovation Orgs</h4>
                <p>Good science doesn't sell itself. I connect technical capability to market opportunity, partnerships, and a growth path that actually gets funded.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" /><path d="m18 15-2-2" /><path d="m15 18-2-2" /></svg></div>
                <h4>Mission-Driven Organizations</h4>
                <p>Purpose needs a commercial engine too. I help NGOs and mission-led organizations diversify revenue and build partnerships without diluting the mission.</p>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== FRACTIONAL MODEL =====================  */}
        <section className="section section-alt">
          <div className="container">
            <div className="grid grid-2" style={{ "alignItems": "center", "gap": "56px" }}>
              <div className="reveal">
                <div className="eyebrow">The Fractional Executive Model</div>
                <h2 className="section-title">Executive capability without a permanent hire</h2>
                <p className="lead">Most organizations need senior leadership for a specific phase -a growth push, a transformation, a partnership strategy -not a permanent seat at the table. The fractional model gives you that capability exactly where it creates the most value, without the long-term commitment.</p>
                <p className="lead">I work with a deliberately small number of organizations at a time -enough for real involvement, never so many that it becomes superficial.</p>
              </div>
              <div className="reveal compare-wrap">
                <table className="compare"><tbody>
                  <tr><th>Traditional Consulting</th><th>My Fractional Model</th></tr>
                  <tr><td>Recommendations and reports</td><td className="win">Executive partnership and implementation</td></tr>
                  <tr><td>External advisor</td><td className="win">Embedded strategic leader</td></tr>
                  <tr><td>Project completion</td><td className="win">Ongoing organisational capability</td></tr>
                  <tr><td>Limited executive involvement</td><td className="win">Direct leadership collaboration</td></tr>
                </tbody></table>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== SERVICES OVERVIEW =====================  */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">Services</div>
              <h2 className="section-title">Three ways to engage</h2>
            </div>
            <div className="grid grid-3">
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg></div>
                <h4>Fractional Executive Leadership</h4>
                <p>Ongoing senior leadership embedded in your team -for a growth push, transformation, or new strategic function.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg></div>
                <h4>Strategic Growth &amp; Partnerships</h4>
                <p>From opportunity assessment to a partnership ecosystem and roadmap you can actually execute.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg></div>
                <h4>Executive Advisory</h4>
                <p>Experienced perspective on a specific challenge or decision -without a full project engagement.</p>
              </div>
            </div>
            <div style={{ "marginTop": "28px" }}>
              <a className="btn btn-ghost" href="/">Explore All Services <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
            </div>
          </div>
        </section>
        {/*  ===================== CTA BAND =====================  */}
        <section className="section section-alt">
          <div className="container">
            <div className="cta-band reveal">
              <div>
                <h2 style={{ "color": "#fff" }} >Let's talk about what&apos;s next</h2>
                <p>Every meaningful shift starts with one conversation. Discovery calls are confidential, practical, and about understanding your business -not selling you a pre-packaged solution.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-brass" href="/">Book a Discovery Conversation</a>
                <a className="btn btn-ghost-invert" href="/portfolio">View Experience &amp; Impact</a>
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
