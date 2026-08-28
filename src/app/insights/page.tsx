import React from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";

import { prisma } from "@/shared/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialPosts = await prisma.blogPost.findMany({ where: { status: "Published" }, orderBy: { publishedAt: "desc" } });
  const caseStudies = await prisma.blogPost.findMany({
    where: { status: "Published", category: "Case Studies" },
    orderBy: { publishedAt: "desc" }
  });
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
              <div className="hero-actions"><a className="btn btn-brass" href="/blog">Explore Insights</a></div>
            </div>
          </div>
        </div>
        {/*  ===================== CASE STUDIES =====================  */}
        <section className="section section-alt">
          <div className="container">
            <div className="section-head reveal">
              <div className="eyebrow">Case Studies</div>
              <h2 className="section-title">Real results from real engagements</h2>
              <p className="lead" style={{ marginTop: 8 }}>A selection of strategic outcomes delivered across growth, transformation, and partnerships.</p>
            </div>
            {caseStudies && caseStudies.length > 0 ? (
              <div className="grid grid-3">
                {caseStudies.map((post: any) => (
                  <a key={post.id} href={`/blog/${post.slug}`} className="article-card reveal" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {post.coverImage ? (
                      <div className="thumb">
                        <Image width={800} height={800} alt={post.title} src={post.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div className="thumb" style={{ background: 'var(--brass-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--brass-deep)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Case Study</span>
                      </div>
                    )}
                    <div className="abody">
                      <span className="tag">Case Study</span>
                      <h4 style={{ margin: '12px 0 8px' }}>{post.title}</h4>
                      <p>{post.excerpt}</p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 13, fontWeight: 600, color: 'var(--brass-deep)' }}>
                        Read Case Study
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" style={{ width: 13, height: 13 }} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-soft)', border: '2px dashed var(--line)', borderRadius: 16 }}>
                No case studies published yet. Add a blog post with category <strong>"Case Studies"</strong> to populate this section.
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
                  <a className="btn btn-brass" href="/contact">Invite Me to Speak</a>
                  <a className="btn btn-ghost" href="/contact">Media &amp; Press Enquiries</a>
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
                <a className="btn btn-brass" href="/contact">Subscribe</a>
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
