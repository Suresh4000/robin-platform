import React from 'react';
import { notFound } from 'next/navigation';
import { PublicNav, PublicFooter } from '@/app/PublicLayout';
import '@/app/public-contour.css';
import { prisma } from '@/shared/lib/prisma';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug: resolvedParams.slug, status: 'Published' }
    });

    if (!post) {
        notFound();
    }

    const backHref = post.category === 'Case Studies' ? '/insights' : '/blog';
    const backText = post.category === 'Case Studies' ? '← Back to Insights' : '← Back to Blog';

    return (
        <div style={{ backgroundColor: 'var(--sand)' }}>
            {/* <PublicNav /> */}
            <main className="container" style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '800px', minHeight: '80vh' }}>
                <a href={backHref} className="btn btn-ghost" style={{ marginBottom: '32px' }}>{backText}</a>

                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="tag" style={{ backgroundColor: 'var(--brass-light)', color: 'var(--brass-deep)', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>{post.category}</span>
                        {post.publishedAt && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>• {new Date(post.publishedAt).toLocaleDateString()}</span>}
                    </div>

                    <h1 style={{ fontSize: '3rem', lineHeight: '1.1', color: 'var(--ink)' }}>{post.title}</h1>
                </div>

                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px', marginBottom: '56px' }}
                    />
                )}

                <div className="section" style={{ border: 'none', padding: 0 }}>
                    <div
                        className="prose"
                        style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--ink)' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </main>
            {/* <PublicFooter /> */}
        </div>
    );
}
