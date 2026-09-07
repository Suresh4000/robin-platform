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
        <div className="hero" data-bg-text="SERVICES">
          <div className="container">
            <div className="reveal" style={{ "maxWidth": "90%" }}>
              <div className="eyebrow">Services</div>
              <h1 style={{ "marginBottom": "20px" }}>Strategic support built around <em>your challenge</em></h1>
              <p className="lead">You don&apos;t always need a permanent executive or a large consulting team. Sometimes you need experienced leadership, an outside view, and focused support to move something important forward.</p>
              <p className="lead">Every engagement starts by understanding the challenge -then finding the fastest path to real progress.</p>
              <div className="hero-actions"><a className="btn btn-brass" href="/contact">Discuss Your Challenge</a></div>
            </div>
          </div>
        </div>
        {/*  ===================== ENGAGEMENT OPTIONS =====================  */}
        <section className="section section-alt" data-bg-text="ENGAGE">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">Engagement Options</div>
              <h2 className="section-title">The right level of support for the job</h2>
            </div>
            <div className="grid grid-3">
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg></div>
                <h4>Fractional Executive Leadership</h4>
                <p>Sustained senior-level leadership without a permanent hire -for a defined phase around clear strategic priorities. Ideal for organizations navigating growth, transformation, or a new strategic function.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg></div>
                <h4>Strategic Project</h4>
                <p>Focused support to solve a defined business challenge -from growth strategy and new business development to partnerships, transformation, or enterprise value. Clear scope, practical output, real momentum.</p>
              </div>
              <div className="card reveal">
                <div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
                <h4>Executive Advisory</h4>
                <p>Experienced perspective on a specific challenge or decision, without a full project. For leaders who need a trusted outside view or support on a high-stakes decision.</p>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== WORKING TOGETHER BANNER =====================  */}
        <section className="section no-border" data-bg-text="COLLAB" style={{ "paddingBottom": "0" }}>
          <div className="container">
            <div className="featured-insight reveal">
              <div className="fi-img">
                <Image width={800} height={800} alt="A team collaborating around a laptop in a modern office" src="https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?q=80&w=1200&auto=format&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="fi-body">
                <span className="tag">How I Work</span>
                <h2 className="section-title" style={{ "marginBottom": "14px" }}>Embedded, not siloed</h2>
                <p style={{ "color": "var(--ink-soft)", "fontSize": "15.5px", "lineHeight": "1.65", "marginBottom": "0" }}>I work alongside your team rather than at a distance -close enough to understand the constraints, the politics, and the day-to-day reality, while still bringing the outside perspective you brought me in for.</p>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== WHAT I WORK ON -6 SERVICES =====================  */}
        <section className="section" data-bg-text="VALUE">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">What I Work On</div>
              <h2 className="section-title">Services</h2>
            </div>
            <div className="grid grid-3 reveal" style={{ gap: "24px", marginTop: "32px" }}>
              {/* ADVISE */}
              <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ marginBottom: "16px", marginTop: 0 }}>Advise</h3>
                <p>Experienced judgment when the next decision matters. For CEOs, founders, and leadership teams facing an important strategic or operating question and looking for an experienced outside perspective.</p>
                <ul className="check-list check-list-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", margin: "16px 0 24px" }}>
                  <li>Outside Perspective</li>
                  <li>Strategic Judgment</li>
                  <li>Executive Challenge</li>
                  <li>Decision Support</li>
                </ul>
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <a className="btn btn-sm btn-primary" href="/advise" style={{ width: "100%", justifyContent: "center" }}>View Details</a>
                </div>
              </div>

              {/* OPERATE */}
              <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ marginBottom: "16px", marginTop: 0 }}>Operate</h3>
                <p>Embedded executive leadership to turn strategy into execution. For organizations that know what needs to happen but need experienced senior leadership to make it happen without a full-time hire.</p>
                <ul className="check-list check-list-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", margin: "16px 0 24px" }}>
                  <li>Embedded Leadership</li>
                  <li>Operating Cadence</li>
                  <li>Cross-Functional Alignment</li>
                  <li>Accountability &amp; Execution</li>
                </ul>
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <a className="btn btn-sm btn-primary" href="/operate" style={{ width: "100%", justifyContent: "center" }}>View Details</a>
                </div>
              </div>

              {/* NAVIGATE */}
              <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ marginBottom: "16px", marginTop: 0 }}>Navigate</h3>
                <p>Intensive executive leadership when the stakes are high. For consequential situations (turnarounds, transactions) where normal capacity is not enough and experienced leadership is needed.</p>
                <ul className="check-list check-list-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", margin: "16px 0 24px" }}>
                  <li>More Intensive</li>
                  <li>Time-Bound Leadership</li>
                  <li>Situation-Specific</li>
                  <li>Focused on Outcomes</li>
                </ul>
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <a className="btn btn-sm btn-primary" href="/navigate" style={{ width: "100%", justifyContent: "center" }}>View Details</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== HOW IT WORKS =====================  */}
        <section className="section section-alt ">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">How It Works</div>
              <h2 className="section-title">A flexible model built around your challenge</h2>
            </div>
            <div className="process steps-5 reveal">
              <div className="step"><div className="dot">01</div><h4>Understand</h4><p>Clarify the challenge, objectives, and desired outcomes.</p></div>
              <div className="step"><div className="dot">02</div><h4>Assess</h4><p>Examine the situation and find where the leverage is.</p></div>
              <div className="step"><div className="dot">03</div><h4>Prioritize</h4><p>Separate what matters most from what can wait.</p></div>
              <div className="step"><div className="dot">04</div><h4>Act</h4><p>Build the strategy, roadmap, or transformation plan.</p></div>
              <div className="step"><div className="dot">05</div><h4>Support</h4><p>Work alongside leadership to turn strategy into progress.</p></div>
            </div>
            <div className="reveal" style={{ "marginTop": "44px", "position": "relative", "borderRadius": "20px", "overflow": "hidden", "aspectRatio": "21/8", "boxShadow": "0 30px 60px -20px rgba(20,15,5,.28)" }}>
              <Image width={800} height={800} alt="Team meeting around a table in a modern conference room" src="https://images.unsplash.com/photo-1769739576456-0aefcff3f4b9?q=80&w=1600&auto=format&fit=crop" style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
            </div>
          </div>
        </section>
        {/*  ===================== READY =====================  */}
        <section className="section no-border" data-bg-text="START">
          <div className="container">
            <div className="cta-band reveal">
              <div>
                <h2 style={{ "color": "#fff" }}>Have a strategic challenge that needs experienced leadership?</h2>
                <p>You probably already know something needs to change. The harder question is what to do next. I help leaders clarify the opportunity, challenge assumptions, and build momentum around the decisions that matter.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-brass" href="/contact">Start a Conversation</a>
                <a className="btn btn-ghost-invert" href="/portfolio">Explore My Experience</a>
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
