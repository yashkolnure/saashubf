import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import SEO from '../../components/common/SEO';
import api from '../../utils/api';
import { FiClock, FiEye, FiArrowLeft, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { format } from 'date-fns';

const SITE_URL = 'https://onlinesaasmarketplace.com';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blog/${slug}`).then(r => {
      setPost(r.data.post);
      setRelated(r.data.related || []);
      setLoading(false);
    }).catch(err => {
      if (err.response?.status === 404) navigate('/blog', { replace: true });
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />
      <div style={{ height: 88 }} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '120px 0' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </div>
  );

  if (!post) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage || `${SITE_URL}/og-image.png`,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'SaaSHub Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SaaSHub',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    keywords: (post.keywords || post.tags || []).join(', '),
    articleSection: post.category,
    wordCount: post.content?.replace(/<[^>]+>/g, '').split(/\s+/).length,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
      ],
    },
  };

  return (
    <>
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={(post.keywords || post.tags || []).join(', ')}
        image={post.coverImage || `${SITE_URL}/og-image.png`}
        url={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedAt: post.publishedAt,
          modifiedAt: post.updatedAt,
          author: post.author?.name || 'SaaSHub Team',
          tags: post.tags,
        }}
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-[var(--cream)]">
        <Navbar />
        <div style={{ height: 88 }} />

        {/* ── Cover image hero ── */}
        <div style={{
          height: post.coverImage ? 420 : 200,
          background: post.coverImage
            ? `linear-gradient(to bottom, rgba(10,14,32,0.2), rgba(10,14,32,0.7)), url(${post.coverImage}) center/cover`
            : 'linear-gradient(135deg, #0f2443 0%, #1a3a6a 100%)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', padding: '0 24px 36px' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 16 }}>
              <FiArrowLeft size={14} /> Back to Blog
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ background: 'rgba(240,192,96,0.25)', color: '#f0c060', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{post.category}</span>
              {post.tags?.slice(0, 2).map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.55)', fontSize: 11 }}><FiTag size={10}/>{t}</span>
              ))}
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: 0 }}>{post.title}</h1>
          </div>
        </div>

        {/* ── Meta bar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiUser size={13}/>{post.author?.name || 'SaaSHub Team'}</span>
            {post.publishedAt && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiCalendar size={13}/>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiClock size={13}/>{post.readTime || 1} min read</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiEye size={13}/>{post.views} views</span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          {post.excerpt && (
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)', fontStyle: 'italic' }}>
              {post.excerpt}
            </p>
          )}

          <div
            className="blog-content"
            style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── Tags ── */}
          {post.tags?.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {post.tags.map(t => (
                <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 99, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  <FiTag size={11}/>{t}
                </Link>
              ))}
            </div>
          )}

          {/* ── CTA ── */}
          <div style={{ marginTop: 48, background: 'linear-gradient(135deg, #0f2443, #1a3a6a)', borderRadius: 20, padding: '36px 32px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Ready to list your SaaS product?</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 24 }}>Join 1,000+ verified vendors on India's fastest-growing software marketplace.</p>
            <Link to="/register/seller" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c89327, #f0c060)', color: '#0a0e20', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, textDecoration: 'none' }}>
              List Your Product Free →
            </Link>
          </div>

          {/* ── Related posts ── */}
          {related.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--navy)', marginBottom: 20 }}>Related Articles</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                {related.map(r => (
                  <Link key={r._id} to={`/blog/${r.slug}`}
                    style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 120, background: r.coverImage ? `url(${r.coverImage}) center/cover` : 'linear-gradient(135deg,#0f2443,#1a3a6a)' }} />
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4, marginBottom: 8 }}>{r.title}</p>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={10}/>{r.readTime || 1} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          color: var(--navy);
          margin: 28px 0 12px;
          line-height: 1.3;
        }
        .blog-content h2 { font-size: 22px; }
        .blog-content h3 { font-size: 18px; }
        .blog-content h4 { font-size: 15px; }
        .blog-content p  { margin: 0 0 18px; }
        .blog-content ul,.blog-content ol { padding-left: 24px; margin: 0 0 18px; }
        .blog-content li { margin-bottom: 8px; }
        .blog-content a  { color: var(--gold); text-decoration: underline; }
        .blog-content strong { color: var(--navy); font-weight: 700; }
        .blog-content blockquote { border-left: 4px solid var(--gold); padding: 12px 20px; margin: 24px 0; background: var(--cream); border-radius: 0 10px 10px 0; font-style: italic; }
        .blog-content code { background: var(--cream); border: 1px solid var(--border); padding: 2px 6px; border-radius: 5px; font-size: 13.5px; }
        .blog-content pre { background: #0f2443; color: #f0c060; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 20px 0; }
        .blog-content img { max-width: 100%; border-radius: 12px; margin: 20px 0; }
        .blog-content hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
      `}</style>
    </>
  );
}
