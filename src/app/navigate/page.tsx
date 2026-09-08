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
                            <div className="eyebrow" style={{ color: "var(--brass-deep)" }}>Navigate · Special Situations</div>
                            <h1 style={{ marginBottom: "20px" }}>Intensive executive leadership when the stakes are <em>high</em>.</h1>
                            <p className="lead">For consequential situations where normal operating capacity is not enough and experienced leadership is needed through a defined transition.</p>

                            <div className="hero-eyebrow-chips" style={{ marginTop: "32px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <span className="field-chip">High-Stakes Situations</span>
                                <span className="field-chip">Time-Bound Leadership</span>
                                <span className="field-chip">Defined Outcomes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SITUATION */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">The Situation</div>
                            <h2 className="section-title">When something consequential is underway.</h2>
                            <p className="lead" style={{ marginTop: 8 }}>NAVIGATE fits when the situation itself is the reason to bring someone in -not a general growth phase, but a specific, high-stakes moment with a beginning and an end.</p>
                        </div>
                        <div className="grid grid-2 reveal" style={{ gap: "32px", marginTop: "40px" }}>
                            <div className="card">
                                <h4>Turnarounds</h4>
                                <p>Restore clarity, priorities, accountability, and momentum when things have stalled or drifted.</p>
                            </div>
                            <div className="card">
                                <h4>Transactions</h4>
                                <p>Support leadership through preparation, decision-making, and execution of a deal.</p>
                            </div>
                            <div className="card">
                                <h4>Major Partnerships</h4>
                                <p>Provide senior leadership where a strategic relationship carries significant organizational consequences.</p>
                            </div>
                            <div className="card">
                                <h4>Fundraising / Investor Readiness</h4>
                                <p>Strengthen operating plans, commercial logic, forecasting, and leadership readiness before capital conversations.</p>
                            </div>
                            <div className="card">
                                <h4>Organizational Transitions</h4>
                                <p>Help leadership navigate significant changes in structure, strategy, or operating model.</p>
                            </div>
                            <div className="card">
                                <h4>New Strategic Ventures</h4>
                                <p>Provide intensive leadership while a new business or strategic initiative is being established under pressure.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHAT IT IS */}
                <section className="section">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">What NAVIGATE Is</div>
                            <h2 className="section-title">Deep executive involvement for a defined, high-stakes situation.</h2>
                        </div>
                        <div className="reveal">
                            <p className="lead" style={{ color: "var(--ink-soft)" }}>NAVIGATE is more intensive than an OPERATE partnership, and more situation-specific -leadership brought in for the length of a critical transition, focused on reaching a defined outcome rather than sustaining an open-ended function.</p>
                            <ul className="check-list check-list-grid" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                                <li>More Intensive</li>
                                <li>Situation-Specific</li>
                                <li>Time-Bound</li>
                                <li>Tied to a Critical Transition</li>
                                <li>Focused on a Defined Outcome</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* OUTCOMES */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="grid grid-2" style={{ gap: "56px" }}>
                            <div className="reveal">
                                <div className="eyebrow">What Changes</div>
                                <h2 className="section-title">Reach the other side stronger.</h2>
                                <ul className="check-list" style={{ marginTop: "24px" }}>
                                    <li>Critical decisions made, not deferred</li>
                                    <li>Leadership aligned on the path through the situation</li>
                                    <li>Operating issues addressed before they compound</li>
                                    <li>Strategic priorities stabilized under pressure</li>
                                    <li>Execution accelerated through the critical window</li>
                                    <li>New operating mechanisms established where none existed</li>
                                </ul>
                            </div>

                            <div className="reveal">
                                <div className="card" style={{ background: "var(--paper)", border: "none" }}>
                                    <h4 style={{ marginBottom: 16 }}>ADVISE vs NAVIGATE</h4>
                                    <p>ADVISE may be better when you need perspective before deciding what to do.</p>
                                    <p style={{ marginTop: 12 }}>NAVIGATE may be better when you&apos;re facing a consequential situation that requires intensive leadership to execute and reach the other side securely.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DECISION MATRIX CTA */}
                <section className="section no-border">
                    <div className="container">
                        <div className="cta-band reveal">
                            <div>
                                <h2 style={{ color: "#fff" }}>Have a situation that needs intensive leadership?</h2>
                                <p>You don&apos;t need to diagnose the engagement before we talk. Start with the challenge, and we&apos;ll determine the right level of involvement together.</p>
                            </div>
                            <div className="cta-band-actions" style={{ flexDirection: "column" }}>
                                <a className="btn btn-brass" href="/contact">Start a Conversation</a>
                                {/* <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "12px", textAlign: "center" }}>Confidential and practical.</p> */}
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
