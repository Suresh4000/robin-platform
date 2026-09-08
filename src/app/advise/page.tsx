import React from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";

export default function Page() {
    return (
        <>
            <PublicNav />
            <div>
                {/* HERO */}
                <div className="hero">
                    <div className="container">
                        <div className="reveal" style={{ maxWidth: "90%" }}>
                            <div className="eyebrow" style={{ color: "var(--brass-deep)" }}>Advise · Executive Advisory</div>
                            <h1 style={{ marginBottom: "20px" }}>Experienced judgment when the next decision <em>matters</em>.</h1>
                            <p className="lead">For CEOs, founders, and leadership teams facing an important strategic or operating question and looking for an experienced outside perspective.</p>

                            <div className="hero-eyebrow-chips" style={{ marginTop: "32px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <span className="field-chip">Outside Perspective</span>
                                <span className="field-chip">Executive Challenge</span>
                                <span className="field-chip">Decision Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SITUATION */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">The Situation</div>
                            <h2 className="section-title">When you need perspective, not another executive.</h2>
                            <p className="lead" style={{ marginTop: 8 }}>ADVISE fits when the work is a decision, not a project - you don&apos;t need someone added to the org chart, you need someone who has made calls like this before.</p>
                        </div>
                        <div className="grid grid-2 reveal" style={{ gap: "32px", marginTop: "40px" }}>
                            <div className="card">
                                <h4>High-Stakes Decision</h4>
                                <p>A high-stakes decision needs an outside view before it&apos;s made.</p>
                            </div>
                            <div className="card">
                                <h4>Testing Assumptions</h4>
                                <p>Leadership needs to test its assumptions against someone who isn&apos;t inside the room every day.</p>
                            </div>
                            <div className="card">
                                <h4>Growth Evaluation</h4>
                                <p>A growth opportunity has surfaced and needs honest assessment before resources move toward it.</p>
                            </div>
                            <div className="card">
                                <h4>Strategic Direction</h4>
                                <p>A strategic direction needs pressure-testing before the team commits to it publicly.</p>
                            </div>
                            <div className="card" style={{ gridColumn: "1 / -1" }}>
                                <h4>Operating Judgment</h4>
                                <p>The team needs experienced operating judgment before committing budget, headcount, or reputation.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHAT IT IS */}
                <section className="section">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">What ADVISE Is</div>
                            <h2 className="section-title">Senior operating judgment without the full-time commitment.</h2>
                        </div>
                        <div className="reveal">
                            <p className="lead" style={{ color: "var(--ink-soft)" }}>Robin works with the leadership team at the level of the decision or challenge itself - not as an embedded operator, and not as a report-writing consultant. The engagement is scoped around a question, not a headcount.</p>
                            <ul className="check-list check-list-grid" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                                <li>Outside Perspective</li>
                                <li>Executive Challenge</li>
                                <li>Strategic Judgment</li>
                                <li>Decision Support</li>
                                <li>Focused Operating Insight</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* HELP AREAS */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">What Robin Can Help With</div>
                            <h2 className="section-title">The kinds of questions ADVISE is built for.</h2>
                            <p className="lead" style={{ marginTop: 8 }}>These are situations, not separate services - ADVISE is the same engagement model applied wherever the leadership team needs a sharper outside view.</p>
                        </div>
                        <div className="grid grid-2 reveal" style={{ gap: "32px", marginTop: "40px" }}>
                            <div className="service">
                                <div className="body">
                                    <h3>Growth &amp; Opportunity</h3>
                                    <p>Assessing whether a growth opportunity is worth pursuing, and what it would actually take.</p>
                                </div>
                            </div>
                            <div className="service">
                                <div className="body">
                                    <h3>Strategic Partnerships</h3>
                                    <p>Testing whether a partnership under discussion creates real strategic value, before it&apos;s negotiated.</p>
                                </div>
                            </div>
                            <div className="service">
                                <div className="body">
                                    <h3>Enterprise Value Creation</h3>
                                    <p>Pressure-testing where value already sits inside the business and whether it&apos;s being seen clearly.</p>
                                </div>
                            </div>
                            <div className="service">
                                <div className="body">
                                    <h3>Business Model Questions</h3>
                                    <p>An outside read on a model or pricing question the team is too close to see clearly.</p>
                                </div>
                            </div>
                            <div className="service">
                                <div className="body">
                                    <h3>Operating Priorities</h3>
                                    <p>Helping leadership decide what actually matters most right now, and what can wait.</p>
                                </div>
                            </div>
                            <div className="service">
                                <div className="body">
                                    <h3>Leadership &amp; Org Questions</h3>
                                    <p>An experienced view on a structural or leadership question before it becomes a bigger problem.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROCESS AND OUTCOMES */}
                <section className="section">
                    <div className="container">
                        <div className="grid grid-2" style={{ gap: "56px" }}>
                            <div className="reveal">
                                <div className="eyebrow">How It Works</div>
                                <h2 className="section-title">A short, deliberate arc - not an open-ended retainer.</h2>
                                <div className="process" style={{ marginTop: "24px", gridTemplateColumns: "1fr" }}>
                                    <div className="numbered"><div className="idx">01</div><div className="body"><h4 style={{ margin: 0 }}>Understand</h4></div></div>
                                    <div className="numbered"><div className="idx">02</div><div className="body"><h4 style={{ margin: 0 }}>Assess</h4></div></div>
                                    <div className="numbered"><div className="idx">03</div><div className="body"><h4 style={{ margin: 0 }}>Challenge</h4></div></div>
                                    <div className="numbered"><div className="idx">04</div><div className="body"><h4 style={{ margin: 0 }}>Clarify</h4></div></div>
                                    <div className="numbered"><div className="idx">05</div><div className="body"><h4 style={{ margin: 0 }}>Decide</h4></div></div>
                                </div>
                            </div>

                            <div className="reveal">
                                <div className="eyebrow">What You Get</div>
                                <h2 className="section-title">From uncertainty to a clearer decision.</h2>
                                <ul className="check-list" style={{ marginTop: "24px" }}>
                                    <li>Greater clarity on the actual decision in front of you</li>
                                    <li>Better-informed decisions, made faster</li>
                                    <li>Prioritized opportunities, not just a longer list</li>
                                    <li>A clearer strategic direction the team can act on</li>
                                    <li>Practical next steps, not just an opinion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DECISION MATRIX CTA */}
                <section className="section no-border">
                    <div className="container">
                        <div className="cta-band reveal">
                            <div>
                                <h2 style={{ color: "#fff" }}>Is ADVISE Right for You?</h2>
                                <p><strong>Likely Right When:</strong> &quot;We have an important question and need experienced judgment.&quot;</p>
                                <p><strong>May Not Be Right When:</strong> &quot;We need someone embedded in the business to lead execution.&quot; (That sounds like OPERATE)</p>
                            </div>
                            <div className="cta-band-actions" style={{ flexDirection: "column" }}>
                                <a className="btn btn-brass" href="/contact">Discuss the Decision</a>
                                {/* <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "12px", textAlign: "center" }}>Start with your challenge</p> */}
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
