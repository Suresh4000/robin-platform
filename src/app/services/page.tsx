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
        <div className="hero">
          <div className="container">
            <div className="reveal" style={{ "maxWidth": "90%" }}>
              <div className="eyebrow">Services</div>
              <h1 style={{ "marginBottom": "20px" }}>Strategic support built around <em>your challenge</em></h1>
              <p className="lead">You don&apos;t always need a permanent executive or a large consulting team. Sometimes you need experienced leadership, an outside view, and focused support to move something important forward.</p>
              <p className="lead">Every engagement starts by understanding the challenge -then finding the fastest path to real progress.</p>
              <div className="hero-actions"><a className="btn btn-brass" href="/">Discuss Your Challenge</a></div>
            </div>
          </div>
        </div>
        {/*  ===================== ENGAGEMENT OPTIONS =====================  */}
        <section className="section section-alt">
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
        <section className="section no-border" style={{ "paddingBottom": "0" }}>
          <div className="container">
            <div className="featured-insight reveal">
              <div className="fi-img">
                <Image width={800} height={800} alt="A team collaborating around a laptop in a modern office"  src="https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?q=80&w=1200&auto=format&fit=crop"  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">What I Work On</div>
              <h2 className="section-title">Services</h2>
            </div>
            <div className="reveal">
              <div className="service">
                <div className="num-badge">01</div>
                <div className="body">
                  <h3>Fractional Executive Leadership</h3>
                  <p>Embedded senior leadership for a defined phase -without a full-time hire. I work alongside leadership teams on growth, transformation, partnerships, or a new strategic function.</p>
                  <ul className="check-list">
                    <li>Leading a growth initiative or new business line</li>
                    <li>Building and structuring strategic partnerships</li>
                    <li>Guiding a transformation</li>
                    <li>Establishing a new strategic function</li>
                    <li>Supporting an executive team through a period of transition</li>
                  </ul>
                  <div className="outcome"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg> <b>Outcome:</b> Experienced executive leadership focused on a clearly defined challenge.</div>
                </div>
              </div>
              <div className="service">
                <div className="num-badge">02</div>
                <div className="body">
                  <h3>Growth Strategy &amp; Opportunity Development</h3>
                  <p>Growth gets more sustainable once you know exactly where your strongest opportunities are. I assess your position, explore what's possible, prioritize it, and build a practical path forward.</p>
                  <ul className="check-list">
                    <li>Growth opportunity assessment and prioritization</li>
                    <li>Market and competitive analysis</li>
                    <li>New market and customer opportunities</li>
                    <li>Business case development</li>
                    <li>Growth roadmap creation</li>
                  </ul>
                  <div className="outcome"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg> <b>Outcome:</b> A clearer growth direction, prioritized opportunities, and a roadmap you can move on.</div>
                </div>
              </div>
              <div className="service">
                <div className="num-badge">03</div>
                <div className="body">
                  <h3>Strategic Partnerships</h3>
                  <p>The right partnership accelerates growth and opens capability you can't build alone. I focus past relationship-building -to the strategic value the partnership actually creates.</p>
                  <ul className="check-list">
                    <li>Partnership strategy and partner identification</li>
                    <li>Mutual value analysis and proposition development</li>
                    <li>Collaboration model design and stakeholder alignment</li>
                    <li>Partnership roadmap and growth through existing relationships</li>
                  </ul>
                  <div className="outcome"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg> <b>Outcome:</b> A sharper partnership strategy and clarity on which relationships actually create value.</div>
                </div>
              </div>
              <div className="service">
                <div className="num-badge">04</div>
                <div className="body">
                  <h3>Transformation &amp; Change Leadership</h3>
                  <p>Transformation creates opportunity -and also uncertainty and friction. I bring clarity to priorities and build a practical path from where you are to where you need to be.</p>
                  <ul className="check-list">
                    <li>Current-state assessment and future-state definition</li>
                    <li>Operating model design and organizational alignment</li>
                    <li>Transformation roadmap and initiative prioritization</li>
                    <li>Leadership support through execution</li>
                  </ul>
                  <div className="outcome"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg> <b>Outcome:</b> A clear transformation direction, aligned priorities, and an actionable plan.</div>
                </div>
              </div>
              <div className="service">
                <div className="num-badge">05</div>
                <div className="body">
                  <h3>New Business Line Development</h3>
                  <p>A new business line needs more than a good idea -strategic alignment, commercial logic, real capability, and a clear path to execution.</p>
                  <ul className="check-list">
                    <li>Opportunity identification and concept development</li>
                    <li>Market assessment and value proposition design</li>
                    <li>Business model and commercial opportunity assessment</li>
                    <li>Go-to-market planning and launch roadmap</li>
                  </ul>
                  <div className="outcome"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg> <b>Outcome:</b> A clearly defined opportunity leadership can evaluate, fund, and execute.</div>
                </div>
              </div>
              <div className="service">
                <div className="num-badge">06</div>
                <div className="body">
                  <h3>Enterprise Value Creation</h3>
                  <p>Not every growth opportunity means entering a new market. Often the biggest opportunity is already inside -in your capabilities, relationships, customers, IP, or business model.</p>
                  <ul className="check-list">
                    <li>Enterprise value assessment and capability analysis</li>
                    <li>Revenue, portfolio, and business model opportunities</li>
                    <li>Strategic asset evaluation and partnership opportunities</li>
                    <li>Value creation roadmap</li>
                  </ul>
                  <div className="outcome"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg> <b>Outcome:</b> Clarity on where additional value exists and which opportunities deserve investment.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== HOW IT WORKS =====================  */}
        <section className="section section-alt">
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
              <Image width={800} height={800} alt="Team meeting around a table in a modern conference room"  src="https://images.unsplash.com/photo-1769739576456-0aefcff3f4b9?q=80&w=1600&auto=format&fit=crop" style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
            </div>
          </div>
        </section>
        {/*  ===================== READY =====================  */}
        <section className="section no-border">
          <div className="container">
            <div className="cta-band reveal">
              <div>
                <h2 style={{ "color": "#fff" }}>Have a strategic challenge that needs experienced leadership?</h2>
                <p>You probably already know something needs to change. The harder question is what to do next. I help leaders clarify the opportunity, challenge assumptions, and build momentum around the decisions that matter.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-brass" href="/">Start a Conversation</a>
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
