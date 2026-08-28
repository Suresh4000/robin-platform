import React from "react";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialPosts = await prisma.blogPost.findMany({
    where: {
      status: "Published",
      NOT: { category: "Case Studies" }
    },
    orderBy: { publishedAt: "desc" }
  });

  return (<><PublicNav />
    <div>
      {/*  ===================== HERO =====================  */}
      <div className="hero">
        <div className="container">
          <div className="reveal" style={{}}>
            <div className="eyebrow">Blog</div>
            <h1 style={{ "marginBottom": "20px" }}>Field notes on <em>growth, strategy &amp; leadership</em></h1>
            <p className="lead">Practical thinking from the front lines of fractional executive work -what's actually driving growth, what's slowing it down, and how leadership teams are working through it.</p>
            <div className="hero-actions"><a className="btn btn-brass" href="#blog-list">Browse Articles</a></div>
          </div>
        </div>
      </div>
      {/*  ===================== TOPICS =====================  */}
      <section className="section tight">
        <div className="container">
          <div className="eyebrow reveal">Browse by Topic</div>
          <div className="field-row reveal" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <span className="field-chip">All Posts</span>
            <span className="field-chip">Growth &amp; Strategy</span>
            <span className="field-chip">Transformation</span>
            <span className="field-chip">Strategic Partnerships</span>
            <span className="field-chip">Enterprise Value</span>
            <span className="field-chip">Leadership</span>
            <span className="field-chip">Execution</span>
            <span className="field-chip">Thoughts</span>
          </div>
        </div>
      </section>
      {/*  ===================== ARTICLE GRID =====================  */}
      <section className="section section-alt" id="blog-list">
        <div className="container">
          <div className="grid grid-3">
            {initialPosts && initialPosts.length > 0 ? (
              initialPosts.map((post: any) => (
                <div className="article-card reveal in" key={post.id}>
                  {post.coverImage && <div className="thumb"><Image width={800} height={800} alt={post.title} src={post.coverImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                  <div className="abody">
                    <span className="tag">{post.category}</span>
                    <h4>{post.title}</h4>
                    <p>{post.excerpt}</p>
                    <a href={`/blog/${post.slug}`} className="btn btn-ghost btn-sm" style={{ marginTop: '12px' }}>View more</a>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </section>
      {/*  ===================== STAY CONNECTED =====================  */}
      <section className="section no-border">
        <div className="container">
          <div className="cta-band reveal">
            <div>
              <h2 style={{ "color": "#fff" }}>Get new posts in your inbox</h2>
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
     EVENTS PAGE
     =====================================================  */}

    <PublicFooter /><RevealHook /></>);
};
