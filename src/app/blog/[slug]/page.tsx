import React from 'react';
import { notFound } from 'next/navigation';
import { PublicNav, PublicFooter } from '@/app/PublicLayout';
import '@/app/public-contour.css';
import { prisma } from '@/shared/lib/prisma';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!post) {
        notFound();
    }

    const isCaseStudy = post.category === 'Case Studies';
    const parentName = isCaseStudy ? 'Insights' : 'Blog';
    const parentHref = isCaseStudy ? '/insights' : '/blog';

    return (
        <div style={{ backgroundColor: 'var(--sand)' }}>
            <PublicNav activeOverride={isCaseStudy ? 'insights' : 'blog'} />
            <main className="container" style={{ paddingTop: '50px', paddingBottom: '100px', maxWidth: '1000px', minHeight: '80vh' }}>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--ink-soft)', fontWeight: 500, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        Home
                    </a>
                    <span style={{ color: 'var(--line-strong)' }}>/</span>
                    <a href={parentHref} style={{ textDecoration: 'none', color: 'inherit' }}>{parentName}</a>
                </div>

                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px' }}
                    />
                )}

                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="tag" style={{ backgroundColor: 'var(--brass-light)', color: 'var(--brass-deep)', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>{post.category}</span>
                        {post.publishedAt && <span suppressHydrationWarning style={{ color: 'var(--text-muted)', fontSize: '14px' }}>• {new Date(post.publishedAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>}
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: '1.2', color: 'var(--ink)', marginTop: 0 }}>{post.title}</h1>
                </div>

                <div className="section" style={{ border: 'none', padding: 0 }}>
                    <div
                        className="prose"
                        suppressHydrationWarning
                        style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--ink)' }}
                        dangerouslySetInnerHTML={{
                            __html: post.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                        }}
                    />
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
