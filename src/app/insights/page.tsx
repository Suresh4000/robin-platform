import React from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";

import { prisma } from "@/shared/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialPosts = await prisma.blogPost.findMany({ where: { status: "Published" }, orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PublicNav />
      <div>
        {/*  ===================== HERO =====================  */}
        <div className="hero">
          <div className="container">
            <div className="reveal" style={{ "maxWidth": "90%" }}>
              <div className="eyebrow">Insights &amp; Media</div>
              <h1 style={{ "marginBottom": "20px" }}>Ideas for leaders navigating <em>growth, change &amp; opportunity</em></h1>
              <p className="lead">I write and speak on the questions shaping modern organizations -new sources of growth, navigating transformation, how partnerships create value, and turning uncertainty into opportunity.</p>
              <div className="hero-actions"><a className="btn btn-brass" href="/">Explore Insights</a></div>
            </div>
          </div>
        </div>
        {/*  ===================== FEATURED INSIGHT =====================  */}
        <section className="section section-alt">
          <div className="container">
            <div className="eyebrow reveal">Featured Insight</div>
            {initialPosts && initialPosts.length > 0 ? (
              <div className="featured-insight reveal">
                <div className="fi-img">
                  {initialPosts[0].coverImage ? (
                    <Image width={800} height={800} alt={initialPosts[0].title} src={initialPosts[0].coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--brass-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--brass-deep)', fontWeight: 600 }}>{initialPosts[0].category}</span>
                    </div>
                  )}
                </div>
                <div className="fi-body">
                  <span className="tag" style={{ border: '1px solid var(--surface-border)' }}>{initialPosts[0].category}</span>
                  <h2 className="section-title" style={{ marginBottom: '14px', fontSize: '2.5rem', lineHeight: 1.1 }}>{initialPosts[0].title}</h2>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '15.5px', lineHeight: '1.65', marginBottom: '22px' }}>{initialPosts[0].excerpt}</p>
                  <a className="btn btn-ghost btn-sm" href={`/blog/${initialPosts[0].slug}`}>
                    Read the Full Insight
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" style={{ width: '15px', height: '15px', marginLeft: '6px' }} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-soft)' }}>
                Featured insight will appear here shortly.
              </div>
            )}
          </div>
        </section>

        {/*  ===================== SPEAKING & MEDIA =====================  */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2" style={{ "gap": "56px", "alignItems": "center" }}>
              <div className="reveal">
                <div className="eyebrow">Speaking &amp; Media</div>
                <h2 className="section-title">Available for interviews, events &amp; panels</h2>
                <p className="lead">I speak on growth, transformation, strategic partnerships, and enterprise value -for leadership events, executive education, podcasts, and panels.</p>
                <p style={{ "fontSize": "14.5px", "color": "var(--ink-soft)", "margin": "18px 0 0" }}><strong style={{ "color": "var(--ink)" }}>Speaking topics include:</strong> Finding New Sources of Enterprise Value · Building New Business Lines · Strategic Partnerships as a Growth Engine · Leading Transformation · Navigating Growth in Uncertain Markets</p>
                <div className="hero-actions">
                  <a className="btn btn-brass" href="/">Invite Me to Speak</a>
                  <a className="btn btn-ghost" href="/">Media &amp; Press Enquiries</a>
                </div>
              </div>
              <div className="reveal" style={{ "borderRadius": "20px", "overflow": "hidden", "aspectRatio": "4/3", "boxShadow": "0 30px 60px -20px rgba(20,15,5,.3)" }}>
                <Image width={800} height={800} alt="Speaker presenting at a leadership event" src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop" style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
              </div>
            </div>
          </div>
        </section>
        {/*  ===================== STAY CONNECTED =====================  */}
        <section className="section no-border">
          <div className="container">
            <div className="cta-band reveal">
              <div>
                <h2 style={{ "color": "#fff" }}>Get my latest perspectives</h2>
                <p>Practical ideas on growth, transformation, partnerships, and leadership -no unnecessary noise.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-brass" href="/">Subscribe</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/*  =====================================================
     BLOG PAGE
     =====================================================  */}

      <PublicFooter />
      <RevealHook />
    </>
  );
}
