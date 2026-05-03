import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import SEO from '../../components/common/SEO';
import api from '../../utils/api';
import { FiClock, FiEye, FiTag, FiArrowRight } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const SITE_URL = 'https://saashub.in';

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page     = +(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (category) params.set('category', category);

    api.get(`/blog?${params}`).then(r => {
      setPosts(r.data.posts);
      setCategories(r.data.categories || []);
      setTotal(r.data.total);
      setPages(r.data.pages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, category]);

  // Fetch a featured post separately on first load
  useEffect(() => {
    if (page === 1 && !category) {
      api.get('/blog?featured=true&limit=1').then(r => {
        if (r.data.posts.length) setFeatured(r.data.posts[0]);
      }).catch(() => {});
    } else {
      setFeatured(null);
    }
  }, [page, category]);

  const setCategory = (c) => {
    const p = new URLSearchParams();
    if (c) p.set('category', c);
    setSearchParams(p);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SaaSHub Blog',
    description: 'Insights, guides, and trends on SaaS, white-label software, and the Indian tech ecosystem.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'SaaSHub',
      url: SITE_URL,
    },
    blogPost: posts.slice(0, 5).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      description: p.excerpt,
    })),
  };

  return (
    <>
      <SEO
        title="Blog — SaaS Insights, Guides & Industry Trends"
        description="Explore expert articles on SaaS growth, white-label software strategies, B2B sales, and Indian tech ecosystem insights from the SaaSHub team."
        keywords="SaaS blog India, white-label software guide, B2B SaaS insights, SaaS growth strategies, Indian SaaS industry, software marketplace blog"
        url="/blog"
        type="website"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-[var(--cream)]">
        <Navbar />
        <div style={{ height: 88 }} />

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f2443 0%, #1a3a6a 100%)', padding: '56px 24px 48px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', background: 'rgba(240,192,96,0.18)', border: '1px solid rgba(240,192,96,0.3)', color: '#f0c060', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 99, marginBottom: 16 }}>
              SaaSHub Blog
            </span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.02em' }}>
              Insights for SaaS Builders<br />& Software Resellers
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto' }}>
              Strategies, market trends, and playbooks for growing your SaaS business in India and beyond.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>

          {/* ── Category filter ── */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '28px 0 24px' }}>
              <button
                onClick={() => setCategory('')}
                style={{ padding: '7px 16px', borderRadius: 99, border: `1.5px solid ${!category ? 'var(--navy)' : 'var(--border)'}`, background: !category ? 'var(--navy)' : 'white', color: !category ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                All
              </button>
              {categories.map(c => (
                <button key={c}
                  onClick={() => setCategory(c)}
                  style={{ padding: '7px 16px', borderRadius: 99, border: `1.5px solid ${category === c ? 'var(--navy)' : 'var(--border)'}`, background: category === c ? 'var(--navy)' : 'white', color: category === c ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* ── Featured post ── */}
          {featured && !category && page === 1 && (
            <Link to={`/blog/${featured.slug}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 40, textDecoration: 'none', boxShadow: '0 4px 24px rgba(15,36,67,0.07)', transition: 'box-shadow 0.2s' }}
              className="hover:shadow-lg">
              <div style={{ minHeight: 280, background: featured.coverImage ? `url(${featured.coverImage}) center/cover` : 'linear-gradient(135deg,#0f2443,#1a3a6a)' }} />
              <div style={{ padding: '36px 36px' }}>
                <span style={{ display: 'inline-block', background: 'var(--cream)', color: 'var(--navy)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, marginBottom: 14 }}>
                  Featured · {featured.category}
                </span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 12 }}>{featured.title}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={12} /> {featured.readTime} min read</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiEye size={12} /> {featured.views} views</span>
                </div>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>
                  Read article <FiArrowRight size={13} />
                </div>
              </div>
            </Link>
          )}

          {/* ── Post grid ── */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', height: 300, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>📝</p>
              <p style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 18 }}>No posts yet</p>
              <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Check back soon — we're writing something good.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {posts.filter(p => !featured || p._id !== featured._id).map(post => (
                <Link key={post._id} to={`/blog/${post.slug}`}
                  style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0 2px 12px rgba(15,36,67,0.05)' }}
                  className="hover:shadow-lg hover:-translate-y-0.5">
                  <div style={{ height: 180, background: post.coverImage ? `url(${post.coverImage}) center/cover` : 'linear-gradient(135deg,#0f2443,#1a3a6a)', flexShrink: 0 }} />
                  <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{post.category}</span>
                      {post.tags?.[0] && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}><FiTag size={10}/>{post.tags[0]}</span>}
                    </div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4, marginBottom: 8, flex: 1 }}>{post.title}</h3>
                    {post.excerpt && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 'auto' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={10}/>{post.readTime || 1} min read</span>
                      <span>{post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Draft'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
              {[...Array(pages)].map((_, i) => (
                <button key={i}
                  onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', i + 1); setSearchParams(p); }}
                  style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${page === i + 1 ? 'var(--navy)' : 'var(--border)'}`, background: page === i + 1 ? 'var(--navy)' : '#fff', color: page === i + 1 ? '#fff' : 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
