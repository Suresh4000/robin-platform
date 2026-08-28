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
        <div className="hero" style={{ "paddingBottom": "76px" }}>
          <div className="container">
            <div className="reveal" style={{ "maxWidth": "90%" }}>
              <div className="eyebrow">About</div>
              <h1 style={{ "marginBottom": "20px" }}>Building growth where others see <em>complexity</em></h1>
              <p className="lead">One question has shaped my career: where is the opportunity no one else is seeing yet?</p>
              <p className="lead">Across growth, transformation, business development, and partnerships, I've worked with organizations at the exact moment things are shifting. My approach pairs strategic thinking with practical execution -not just identifying problems, but deciding what to change, where to invest, and how to turn priorities into action.</p>
              <p className="lead">Today, I bring that perspective to leaders who need experienced, independent thinking -without adding another layer of complexity.</p>
              <div className="hero-actions">
                <a className="btn btn-brass" href="/contact">Work With Me</a>
                <a className="btn btn-ghost" href="/portfolio">Explore My Experience</a>
              </div>
            </div>
          </div>
        </div>
        {/*  ===================== SNAPSHOT BANNER =====================  */}
        <section className="section no-border" style={{ "paddingTop": "80px" }}>
          <div className="container">
            <div className="featured-insight reveal">
              <div className="fi-img">
                <Image width={800} height={800} alt="Leaders gathered around a whiteboard mapping out a strategic plan" src="https://images.unsplash.com/photo-1774842391684-b819ec9bd409?q=80&w=1200&auto=format&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="fi-body">
                <span className="tag">Snapshot</span>
                <h2 className="section-title" style={{ "marginBottom": "14px" }}>26+ years finding the opportunity others miss</h2>
                <p style={{ "color": "var(--ink-soft)", "fontSize": "15.5px", "lineHeight": "1.65", "marginBottom": "0" }}>From Fortune 500 corporate development to founder-led startups to mission-driven nonprofits, my path has stayed close to one question: where is the leverage that changes everything else? That question has taken me across growth strategy, transformation, partnerships, and enterprise value -always in service of turning a real opportunity into real progress.</p>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== LEADERSHIP PHILOSOPHY =====================  */}
        <section className="section section-alt">
          <div className="container">
            <div className="grid grid-1" style={{ "gap": "56px", "alignItems": "start" }}>
              <div>
                <div className="section-head reveal" style={{ "marginBottom": "0" }}>
                  <div className="eyebrow">Leadership Philosophy</div>
                  <h2 className="section-title">Strategy is only valuable when it creates movement</h2>
                  <p className="lead" style={{ "marginBottom": "20px" }}>Good leadership isn't just a strong strategy -it's clarity on what matters, why, and what happens next. Five principles run through my work.</p>
                </div>
                <div className="reveal">
                  <div className="numbered"><div className="idx">01</div><div className="body"><h4>Clarity before activity</h4><p>Define the opportunity and the decisions that actually need making before getting busy.</p></div></div>
                  <div className="numbered"><div className="idx">02</div><div className="body"><h4>Value before vanity</h4><p>Every initiative, partnership, and investment needs a real strategic reason to exist.</p></div></div>
                  <div className="numbered"><div className="idx">03</div><div className="body"><h4>Connection over silos</h4><p>Growth rarely belongs to one department. I look across functions, customers, and markets for opportunities others miss.</p></div></div>
                  <div className="numbered"><div className="idx">04</div><div className="body"><h4>Action alongside strategy</h4><p>A strategy on paper changes nothing. I turn thinking into priorities, ownership, and measurable progress.</p></div></div>
                  <div className="numbered"><div className="idx">05</div><div className="body"><h4>Curiosity as discipline</h4><p>The best opportunities aren't obvious. Better questions surface possibilities everyone else walked past.</p></div></div>
                </div>
              </div>
              {/*  <div className="reveal" style={{"position":"sticky","top":"104px","borderRadius":"20px","overflow":"hidden","aspectRatio":"4/5","boxShadow":"0 30px 60px -20px rgba(20,15,5,.28)"}}>
<Image width={800} height={800} alt="Colleagues studying a strategic mind map together on a laptop"  src="https://images.unsplash.com/photo-1745847768382-816bfc32e1bb?q=80&w=900&auto=format&fit=crop" style={{"width":"100%","height":"100%","objectFit":"cover"}}/>
</div>  */}
            </div>
          </div>
        </section>
        {/*  ===================== CORE EXPERTISE =====================  */}
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">Core Expertise</div>
              <h2 className="section-title">Experience across growth, transformation &amp; enterprise value</h2>
            </div>
            <div className="grid grid-3">
              <div className="card reveal"><div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg></div><h4>Fractional Executive Leadership</h4><p>Embedded senior leadership for a defined phase.</p></div>
              <div className="card reveal"><div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg></div><h4>Growth Strategy</h4><p>Identifying and prioritizing sustainable growth.</p></div>
              <div className="card reveal"><div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg></div><h4>Strategic Partnerships</h4><p>Relationships that expand capability and reach.</p></div>
              <div className="card reveal"><div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg></div><h4>Transformation</h4><p>Navigating strategic and operational change.</p></div>
              <div className="card reveal"><div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg></div><h4>New Business Line Development</h4><p>Shaping new business opportunities.</p></div>
              <div className="card reveal"><div className="icon-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg></div><h4>Enterprise Value Creation</h4><p>Finding where organizational value can grow.</p></div>
            </div>
            <div className="card reveal" style={{ "marginTop": "26px", "display": "flex", "alignItems": "center", "gap": "18px" }}>
              <div className="icon-badge" style={{ "margin": "0" }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg></div>
              <div><h4 style={{ "marginBottom": "4px" }}>Executive Advisory</h4><p>Senior perspective on complex decisions.</p></div>
            </div>
          </div>
        </section>
        {/*  ===================== START HERE =====================  */}
        <section className="section section-alt no-border">
          <div className="container">
            <div className="cta-band reveal">
              <div>
                <h2 style={{ "color": "#fff" }}>The best work starts with the right question</h2>
                <p>No two organizations face the same growth problem -so there's no universal playbook. I start by understanding your reality: ambitions, constraints, people, opportunities. From there, I bring clarity to what matters most and build a practical path forward.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-brass" href="/contact">Start a Conversation</a>
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
