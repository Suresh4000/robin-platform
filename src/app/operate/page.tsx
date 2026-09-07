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
                            <div className="eyebrow" style={{ color: "var(--brass-deep)" }}>Operate · Primary Engagement</div>
                            <h1 style={{ marginBottom: "20px" }}>Embedded executive leadership to turn strategy into <em>execution</em>.</h1>
                            <p className="lead">For organizations that know what needs to happen but need experienced senior leadership to make it happen.</p>

                            <div className="hero-eyebrow-chips" style={{ marginTop: "32px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <span className="field-chip">Embedded Leadership</span>
                                <span className="field-chip">Fractional COO</span>
                                <span className="field-chip">Cross-Functional Alignment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SITUATION */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">The Situation</div>
                            <h2 className="section-title">When strategy needs someone to lead it forward.</h2>
                            <p className="lead" style={{ marginTop: 8 }}>OPERATE fits when the direction is largely set, but the organization needs a senior operator to own it — not another slide deck, an executive who takes responsibility for moving it.</p>
                        </div>
                        <div className="grid grid-2 reveal" style={{ gap: "32px", marginTop: "40px" }}>
                            <div className="card">
                                <h4>Growth Initiatives</h4>
                                <p>Leading a growth initiative that needs a senior owner, not a committee.</p>
                            </div>
                            <div className="card">
                                <h4>New Business Lines</h4>
                                <p>Building a new business line from an early concept into something executable.</p>
                            </div>
                            <div className="card">
                                <h4>Strategic Functions</h4>
                                <p>Establishing a strategic function the organization needs but doesn&apos;t yet have.</p>
                            </div>
                            <div className="card">
                                <h4>Transformations</h4>
                                <p>Driving a transformation that&apos;s been agreed on but hasn&apos;t actually started moving.</p>
                            </div>
                            <div className="card">
                                <h4>Strategic Partnerships</h4>
                                <p>Building strategic partnerships and turning them into operating mechanisms, not just relationships.</p>
                            </div>
                            <div className="card">
                                <h4>Aligning Leadership</h4>
                                <p>Aligning a leadership team that&apos;s pulling in different directions or moving a stalled priority into real, visible execution.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHAT IT IS */}
                <section className="section">
                    <div className="container">
                        <div className="section-head reveal">
                            <div className="eyebrow">What OPERATE Is</div>
                            <h2 className="section-title">A fractional COO partnership built around a defined phase of work.</h2>
                        </div>
                        <div className="reveal">
                            <p className="lead" style={{ color: "var(--ink-soft)" }}>Robin works alongside the CEO and leadership team and takes meaningful responsibility for moving strategic priorities forward — sustained senior leadership without the cost or permanence of a full-time hire.</p>
                            <div className="check-list" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <li>Embedded Executive Leadership</li>
                                <li>Cross-Functional Alignment</li>
                                <li>Operating Cadence</li>
                                <li>Decision-Making</li>
                                <li>Accountability</li>
                                <li>Execution</li>
                                <li>Leadership Support</li>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROCESS AND OUTCOMES */}
                <section className="section section-alt">
                    <div className="container">
                        <div className="grid grid-2" style={{ gap: "56px" }}>
                            <div className="reveal">
                                <div className="eyebrow">How It Works</div>
                                <h2 className="section-title">Embedded, not siloed.</h2>
                                <p>Close enough to understand the constraints, the politics, and the day-to-day reality — while still bringing the outside perspective that made the engagement worth starting.</p>
                                <div className="process steps-5" style={{ marginTop: "24px", gridTemplateColumns: "1fr" }}>
                                    <div className="step" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}><div className="dot" style={{ position: "relative" }}>01</div><h4 style={{ margin: 0 }}>Understand</h4></div>
                                    <div className="step" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}><div className="dot" style={{ position: "relative" }}>02</div><h4 style={{ margin: 0 }}>Assess</h4></div>
                                    <div className="step" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}><div className="dot" style={{ position: "relative" }}>03</div><h4 style={{ margin: 0 }}>Prioritize</h4></div>
                                    <div className="step" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}><div className="dot" style={{ position: "relative" }}>04</div><h4 style={{ margin: 0 }}>Build</h4></div>
                                    <div className="step" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}><div className="dot" style={{ position: "relative" }}>05</div><h4 style={{ margin: 0 }}>Lead &amp; Measure</h4></div>
                                </div>
                            </div>

                            <div className="reveal">
                                <div className="eyebrow">What Changes</div>
                                <h2 className="section-title">From strategic priority to measurable progress.</h2>
                                <ul className="check-list" style={{ marginTop: "24px" }}>
                                    <li>Leadership alignment around what actually matters</li>
                                    <li>Clear ownership of the priority, not a shared responsibility</li>
                                    <li>Operating discipline — a cadence the team actually keeps</li>
                                    <li>Faster decisions, with someone accountable for them</li>
                                    <li>Coordinated execution across functions, not in silos</li>
                                    <li>Visible progress against the strategic priorities that mattered on day one</li>
                                    <li>Greater organizational capacity to carry it forward after the engagement ends</li>
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
                                <h2 style={{ color: "#fff" }}>Is OPERATE Right for You?</h2>
                                <p><strong>Likely Right When:</strong> &quot;We need someone to make this happen.&quot;</p>
                            </div>
                            <div className="cta-band-actions">
                                <a className="btn btn-brass" href="/contact">Discuss an Operating Partnership</a>
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "12px", textAlign: "center" }}>Start with your challenge</p>
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
