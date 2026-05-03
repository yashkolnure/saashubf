import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import api from '../utils/api';
import { useCurrency } from '../context/CurrencyContext';
import { FiSearch, FiX, FiCheckCircle, FiEye, FiMessageSquare, FiStar, FiSliders, FiGrid, FiList, FiTrendingUp, FiArrowRight, FiZap } from 'react-icons/fi';

const CATS = [
  { name: 'CRM', icon: '📊', color: '#6366f1' },
  { name: 'ERP', icon: '🏭', color: '#10b981' },
  { name: 'HR & Payroll', icon: '👥', color: '#8b5cf6' },
  { name: 'Marketing', icon: '📣', color: '#ec4899' },
  { name: 'Analytics', icon: '📈', color: '#f59e0b' },
  { name: 'Finance', icon: '💰', color: '#ef4444' },
  { name: 'Project Management', icon: '✅', color: '#06b6d4' },
  { name: 'Communication', icon: '💬', color: '#84cc16' },
  { name: 'Security', icon: '🔒', color: '#0891b2' },
  { name: 'E-Commerce', icon: '🛒', color: '#f97316' },
  { name: 'Customer Support', icon: '🎧', color: '#a855f7' },
  { name: 'DevOps', icon: '⚙️', color: '#14b8a6' },
  { name: 'Education', icon: '🎓', color: '#3b82f6' },
  { name: 'Healthcare', icon: '🏥', color: '#22c55e' },
  { name: 'Legal', icon: '⚖️', color: '#64748b' },
  { name: 'Other', icon: '✨', color: '#a78bfa' },
];

const PRICING = [['per_seat','Per Seat','👤'],['usage_based','Usage Based','📊'],['flat','Flat Rate','💎'],['one_time','One-time','💸'],['hybrid','Hybrid','🔀'],['custom','Custom','🎯']];

const TYPES = [
  { value: '', label: 'All Software', icon: '🌐', gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
  { value: 'whitelabel', label: 'White-Label', icon: '🏷️', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { value: 'saas', label: 'SaaS Product', icon: '☁️', gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)' },
];

function ListingCard({ listing: l }) {
  const isWL = l.listingType === 'whitelabel';
  const accentColor = isWL ? '#f59e0b' : '#7c3aed';
  const accentBg = isWL ? 'rgba(245,158,11,0.1)' : 'rgba(124,58,237,0.08)';
  const { priceFor } = useCurrency();
  const displayPrice = priceFor(l);

  return (
    <Link to={`/listings/${l.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div className="listing-card" style={{
        background: '#fff',
        border: '1.5px solid var(--border)',
        borderRadius: 18,
        padding: 0,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
      }}>
        {/* Top accent gradient */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80, transparent)` }} />

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {/* Header: logo + name */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: l.logo ? '#fff' : `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
              border: `1.5px solid ${l.logo ? 'var(--border)' : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
              boxShadow: `0 4px 12px ${accentColor}25`,
            }}>
              {l.logo ?
                <img src={l.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                <span style={{ fontWeight: 900, fontSize: 22, color: '#fff' }}>{l.productName?.[0]}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                  {l.productName}
                </p>
                {l.seller?.company?.isVerified && <FiCheckCircle size={14} color="#10b981" style={{ flexShrink: 0 }} />}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {l.seller?.company?.legalName}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, minHeight: 40 }}>
            {l.tagline || l.shortDescription}
          </p>

          {/* Tags row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
              background: accentBg, color: accentColor,
              letterSpacing: '0.02em',
            }}>
              {isWL ? 'White-Label' : 'SaaS'}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
              background: '#f1f5f9', color: '#475569',
            }}>
              {l.category}
            </span>
            {l.hasFreerial && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                background: 'rgba(16,185,129,0.1)', color: '#059669',
                display: 'inline-flex', alignItems: 'center', gap: 3,
              }}>
                <FiZap size={10} /> Trial
              </span>
            )}
          </div>

          {/* Stats footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 14, borderTop: '1px dashed var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {l.rating > 0 && (
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <FiStar size={12} fill="#f59e0b" color="#f59e0b" />{l.rating}
                </span>
              )}
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiEye size={11} />{l.viewCount || 0}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiMessageSquare size={11} />{l.inquiryCount || 0}
              </span>
            </div>
            {displayPrice ? (
              <span style={{ fontSize: 12, fontWeight: 800, color: accentColor, background: accentBg, padding: '3px 8px', borderRadius: 7 }}>
                From {displayPrice}
              </span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 700, color: accentColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                View <FiArrowRight size={11} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
      height: 230, overflow: 'hidden', position: 'relative',
    }}>
      <div className="shimmer" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default function ListingsPage() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    category: params.get('category') || '',
    listingType: params.get('type') || '',
    pricingModel: '',
    hasTrial: '',
    sort: 'newest',
  });
  const debounceRef = useRef(null);
  const selfNavRef = useRef(false);

  const fetchListings = (f = filters, p = 1) => {
    setLoading(true);
    const q = new URLSearchParams({ ...f, page: p, limit: 15 });
    Object.keys(f).forEach(k => { if (!f[k]) q.delete(k); });
    api.get(`/listings?${q}`).then(r => {
      setListings(r.data.listings || []);
      setTotal(r.data.total || 0);
      setPages(r.data.pages || 1);
      setPage(p);
    }).catch(() => {
      setListings([]); setTotal(0); setPages(1);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selfNavRef.current) { selfNavRef.current = false; return; }
    const fromUrl = {
      search: params.get('search') || '',
      category: params.get('category') || '',
      listingType: params.get('type') || '',
      pricingModel: params.get('pricingModel') || '',
      hasTrial: params.get('hasTrial') || '',
      sort: params.get('sort') || 'newest',
    };
    setFilters(fromUrl);
    fetchListings(fromUrl, 1);
  }, [params]);

  const syncParams = (f) => {
    selfNavRef.current = true;
    const p = {};
    if (f.search) p.search = f.search;
    if (f.category) p.category = f.category;
    if (f.listingType) p.type = f.listingType;
    if (f.pricingModel) p.pricingModel = f.pricingModel;
    if (f.hasTrial) p.hasTrial = f.hasTrial;
    if (f.sort && f.sort !== 'newest') p.sort = f.sort;
    setParams(p, { replace: true });
  };

  const applyFilter = (k, v) => {
    const nf = { ...filters, [k]: v };
    setFilters(nf);
    syncParams(nf);
    if (k === 'search') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchListings(nf, 1), 350);
    } else {
      fetchListings(nf, 1);
    }
  };

  const clearAll = () => {
    const nf = { search: '', category: '', listingType: '', pricingModel: '', hasTrial: '', sort: 'newest' };
    setFilters(nf);
    setParams({});
    fetchListings(nf, 1);
  };

  const removeFilter = (key) => {
    applyFilter(key, key === 'sort' ? 'newest' : '');
  };

  const activeFilters = [
    filters.listingType && { key: 'listingType', label: TYPES.find(t => t.value === filters.listingType)?.label, color: '#7c3aed' },
    filters.category && { key: 'category', label: filters.category, color: '#0891b2' },
    filters.pricingModel && { key: 'pricingModel', label: PRICING.find(p => p[0] === filters.pricingModel)?.[1], color: '#f59e0b' },
    filters.hasTrial === 'true' && { key: 'hasTrial', label: 'Free Trial', color: '#10b981' },
  ].filter(Boolean);

  const activeCategory = filters.category || '';

  // Per-category keyword maps for maximum targeting
  const CAT_KEYWORDS = {
    'CRM':                    'CRM software India, white label CRM India, customer relationship management software India, best CRM for small business India, CRM SaaS India',
    'ERP':                    'ERP software India, white label ERP India, enterprise resource planning India, ERP for Indian SMEs, cloud ERP India',
    'HR & Payroll':           'HR software India, payroll software India, white label HR software India, HRMS India, payroll management India',
    'Restaurant Management':  'restaurant management software India, restaurant POS India, QR menu software India, restaurant billing software India, hotel management software India',
    'Fitness & Gym Management':'gym management software India, fitness centre software India, white label gym software India, gym billing software India',
    'Booking & Scheduling':   'booking software India, appointment scheduling software India, online booking system India, reservation software India',
    'Marketing Automation':   'marketing automation software India, email marketing software India, marketing software India',
    'AI & Automation':        'AI software India, AI sales software India, AI chatbot India, automation software India, artificial intelligence SaaS India',
    'WhatsApp Marketing':     'WhatsApp marketing software India, WhatsApp automation India, WhatsApp business software India',
    'E-Commerce':             'e-commerce software India, online store software India, white label e-commerce India',
    'Analytics':              'analytics software India, business intelligence India, data analytics SaaS India',
    'Finance':                'finance software India, accounting software India, invoicing software India, GST software India',
    'Digital Marketing':      'digital marketing software India, SEO software India, social media software India',
  };

  const catKw = activeCategory ? (CAT_KEYWORDS[activeCategory] || `${activeCategory} software India, white label ${activeCategory} software India, ${activeCategory} SaaS India`) : '';

  const seoTitle = activeCategory
    ? `Buy ${activeCategory} Software India — SaaS & White-Label Solutions | SaaSHub`
    : 'Buy SaaS & White-Label Software India — 500+ Verified Products | SaaSHub';
  const seoDesc = activeCategory
    ? `Buy verified ${activeCategory} SaaS and white-label software from trusted Indian vendors on SaaSHub. Compare pricing, features, and contact sellers directly. Free to enquire.`
    : 'Browse 500+ verified SaaS products and white-label software from trusted Indian vendors. CRM, ERP, HR, restaurant, gym, AI, booking software and more. Zero commission on enquiries.';
  const seoKw = activeCategory
    ? `${catKw}, buy ${activeCategory} software India, white label ${activeCategory} India, best ${activeCategory} software India, SaaS marketplace India, verified software vendors India`
    : 'buy SaaS software India, white label software India, SaaS marketplace India, B2B software marketplace India, verified SaaS vendors India, software reseller India, cloud software India, enterprise software India, business software India';

  return (
    <>
    <SEO
      title={seoTitle}
      description={seoDesc}
      keywords={seoKw}
      url={`/listings${activeCategory ? `?category=${encodeURIComponent(activeCategory)}` : ''}`}
      breadcrumb={[
        { name: 'Home', url: '/' },
        { name: 'Browse Software', url: '/listings' },
        ...(activeCategory ? [{ name: activeCategory, url: `/listings?category=${encodeURIComponent(activeCategory)}` }] : []),
      ]}
    />
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f5f7fa 0%, #eef2f7 50%, #f5f7fa 100%);
          background-size: 1000px 100%;
          animation: shimmer 1.6s infinite linear;
        }
        .listing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(15,36,67,0.1), 0 6px 16px rgba(15,36,67,0.06);
          border-color: var(--border-strong);
        }

        .pill-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 24px;
          font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(10px); white-space: nowrap;
        }
        .pill-btn:hover { background: rgba(255,255,255,0.13); color: #fff; border-color: rgba(255,255,255,0.25); }
        .pill-btn.active {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 14px rgba(124,58,237,0.4);
        }

        .filter-section { margin-bottom: 24px; }
        .filter-label {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em;
          color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px;
        }

        .toggle-row {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 11px;
          font-size: 13px; font-weight: 500;
          color: var(--text-secondary);
          background: transparent; border: 1.5px solid transparent;
          cursor: pointer; transition: all 0.18s; text-align: left;
        }
        .toggle-row:hover { background: var(--purple-pale); color: var(--purple); }
        .toggle-row.active {
          background: linear-gradient(135deg, var(--purple), var(--indigo));
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        .filter-grid { display: grid; grid-template-columns: 240px 1fr; gap: 28px; }
        @media (max-width: 1024px) {
          .filter-grid { grid-template-columns: 1fr !important; }
          .filter-sidebar-desktop { display: none !important; }
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 1100px) { .results-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .results-grid { grid-template-columns: 1fr !important; } }

        .filter-toggle-mobile {
          display: none;
        }
        @media (max-width: 1024px) {
          .filter-toggle-mobile { display: inline-flex !important; }
        }

        .drawer-backdrop {
          position: fixed; inset: 0; background: rgba(7,11,30,0.6); z-index: 60;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        .drawer {
          position: fixed; left: 0; top: 0; bottom: 0; width: 320px;
          background: #fff; z-index: 61; padding: 24px;
          overflow-y: auto;
          animation: slideRight 0.25s ease;
          box-shadow: 8px 0 32px rgba(0,0,0,0.15);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        .scroll-area::-webkit-scrollbar { width: 4px; }
        .scroll-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }

        .pagi-btn {
          width: 38px; height: 38px; border-radius: 11px;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
          background: #fff; border: 1.5px solid var(--border); color: var(--text-secondary);
          cursor: pointer; transition: all 0.18s;
        }
        .pagi-btn:hover { border-color: var(--purple); color: var(--purple); }
        .pagi-btn.active {
          background: linear-gradient(135deg, var(--purple), var(--indigo));
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 12px rgba(124,58,237,0.35);
        }

        .sort-select {
          font-family: 'Inter', sans-serif;
          appearance: none; -webkit-appearance: none;
          padding: 10px 36px 10px 14px;
          border: 1.5px solid var(--border); border-radius: 11px;
          background: #fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'><polyline points='6 9 12 15 18 9'></polyline></svg>") no-repeat right 12px center;
          font-size: 13px; font-weight: 600; color: var(--text-primary);
          cursor: pointer; outline: none; transition: all 0.18s;
        }
        .sort-select:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }

        .search-bar-modern {
          flex: 1; max-width: 100%;
          display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1.5px solid var(--border);
          border-radius: 13px; padding: 4px 4px 4px 16px;
          transition: all 0.18s;
        }
        .search-bar-modern:focus-within {
          border-color: var(--purple);
          box-shadow: 0 0 0 4px rgba(124,58,237,0.1);
        }
        .search-bar-modern input {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: 'Inter', sans-serif; font-size: 14px;
          padding: 10px 0; color: var(--text-primary);
        }
        .search-bar-modern input::placeholder { color: var(--text-muted); }
      `}</style>

      <Navbar />

      {/* ─── DARK HERO HEADER ─── */}
      <section style={{
        background: 'linear-gradient(150deg, #070d20 0%, #0f0726 55%, #080d1e 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '120px 0 80px',
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
              <FiTrendingUp size={12} color="#a78bfa" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.05em' }}>BROWSE SOFTWARE MARKETPLACE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(30px,4.5vw,48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 14 }}>
              Discover the perfect{' '}
              <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 60%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                software
              </span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Browse {total > 0 ? total + '+' : '500+'} verified white-label and SaaS products. Filter by category, type, and pricing.
            </p>
          </div>

          {/* Search & sort row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 720, margin: '0 auto', flexWrap: 'wrap' }}>
            <div className="search-bar-modern" style={{ flex: '1 1 320px' }}>
              <FiSearch size={17} color="var(--text-muted)" />
              <input
                value={filters.search}
                onChange={e => applyFilter('search', e.target.value)}
                placeholder="Search by name, category, or features..."
              />
              {filters.search && (
                <button onClick={() => applyFilter('search', '')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text-muted)', display: 'flex' }}>
                  <FiX size={14} />
                </button>
              )}
            </div>
            <button
              className="filter-toggle-mobile"
              onClick={() => setFilterDrawerOpen(true)}
              style={{
                display: 'none',
                alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
              <FiSliders size={14} /> Filters {activeFilters.length > 0 && <span style={{ background: '#7c3aed', borderRadius: 99, padding: '1px 7px', fontSize: 11 }}>{activeFilters.length}</span>}
            </button>
          </div>

          {/* Type pill toggles */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => applyFilter('listingType', t.value)}
                className={`pill-btn ${filters.listingType === t.value ? 'active' : ''}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACTIVE FILTERS BAR ─── */}
      {activeFilters.length > 0 && (
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active filters:</span>
            {activeFilters.map(f => (
              <button key={f.key} onClick={() => removeFilter(f.key)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px 5px 12px', borderRadius: 99,
                background: `${f.color}15`, color: f.color,
                border: `1px solid ${f.color}30`, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = `${f.color}25`}
                onMouseLeave={e => e.currentTarget.style.background = `${f.color}15`}>
                {f.label} <FiX size={12} />
              </button>
            ))}
            <button onClick={clearAll} style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '36px 28px', width: '100%' }}>
        <div className="filter-grid">

          {/* ═══ DESKTOP SIDEBAR ═══ */}
          <aside className="filter-sidebar-desktop">
            <div style={{ position: 'sticky', top: 100 }}>
              {/* Filter card */}
              <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--purple), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiSliders size={14} color="#fff" />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Filters</span>
                  </div>
                  {activeFilters.length > 0 && (
                    <button onClick={clearAll} style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      Reset
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="filter-section">
                  <div className="filter-label">
                    <span>Category</span>
                    {filters.category && <button onClick={() => applyFilter('category', '')} style={{ background: 'transparent', border: 'none', color: 'var(--purple)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Clear</button>}
                  </div>
                  <div className="scroll-area" style={{ maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                    {CATS.map(c => (
                      <button key={c.name} onClick={() => applyFilter('category', filters.category === c.name ? '' : c.name)}
                        className={`toggle-row ${filters.category === c.name ? 'active' : ''}`}>
                        <span style={{ fontSize: 14 }}>{c.icon}</span>
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="filter-section">
                  <div className="filter-label">
                    <span>Pricing Model</span>
                    {filters.pricingModel && <button onClick={() => applyFilter('pricingModel', '')} style={{ background: 'transparent', border: 'none', color: 'var(--purple)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Clear</button>}
                  </div>
                  {PRICING.map(([v, l, ic]) => (
                    <button key={v} onClick={() => applyFilter('pricingModel', filters.pricingModel === v ? '' : v)}
                      className={`toggle-row ${filters.pricingModel === v ? 'active' : ''}`}>
                      <span style={{ fontSize: 13 }}>{ic}</span>
                      <span>{l}</span>
                    </button>
                  ))}
                </div>

                {/* Free Trial */}
                <div className="filter-section" style={{ marginBottom: 0 }}>
                  <div className="filter-label">
                    <span>Special</span>
                  </div>
                  <button onClick={() => applyFilter('hasTrial', filters.hasTrial === 'true' ? '' : 'true')}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 12,
                      background: filters.hasTrial === 'true' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16,185,129,0.06)',
                      border: filters.hasTrial === 'true' ? 'none' : '1.5px solid rgba(16,185,129,0.18)',
                      color: filters.hasTrial === 'true' ? '#fff' : '#059669',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.18s',
                      boxShadow: filters.hasTrial === 'true' ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                    }}>
                    <FiZap size={14} />
                    <span style={{ flex: 1, textAlign: 'left' }}>Free Trial</span>
                    <div style={{
                      width: 32, height: 18, borderRadius: 99,
                      background: filters.hasTrial === 'true' ? 'rgba(255,255,255,0.3)' : 'rgba(16,185,129,0.15)',
                      position: 'relative', flexShrink: 0,
                    }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 2,
                        left: filters.hasTrial === 'true' ? 16 : 2,
                        transition: 'left 0.18s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ═══ MAIN RESULTS ═══ */}
          <main>
            {/* Results header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
                  {loading ? 'Searching…' : (
                    <>
                      Showing <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{listings.length}</span>
                      {' '}of{' '}
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{total}</span>
                      {' '}product{total !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>
              <select value={filters.sort} onChange={e => applyFilter('sort', e.target.value)} className="sort-select">
                <option value="newest">✨ Newest first</option>
                <option value="most_viewed">👁️ Most viewed</option>
                <option value="most_inquired">💬 Most inquired</option>
                <option value="top_rated">⭐ Top rated</option>
              </select>
            </div>

            {/* Results grid */}
            {loading ? (
              <div className="results-grid">
                {Array(9).fill(0).map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : listings.length === 0 ? (
              <div style={{
                background: '#fff', border: '1.5px dashed var(--border)', borderRadius: 18,
                padding: 64, textAlign: 'center',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 24, margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, var(--purple-pale), #fef3ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                }}>
                  🔍
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>No matches found</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
                  Try adjusting your filters, or clear them all to browse the full catalog.
                </p>
                <button onClick={clearAll} className="btn-purple" style={{ padding: '11px 22px' }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="results-grid">
                  {listings.map(l => <ListingCard key={l._id} listing={l} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 44, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => page > 1 && fetchListings(filters, page - 1)}
                      className="pagi-btn"
                      disabled={page === 1}
                      style={{ width: 'auto', padding: '0 14px', opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                      ← Prev
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(pages, page + 2)).map(p => (
                      <button key={p} onClick={() => fetchListings(filters, p)}
                        className={`pagi-btn ${page === p ? 'active' : ''}`}>
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => page < pages && fetchListings(filters, page + 1)}
                      className="pagi-btn"
                      disabled={page === pages}
                      style={{ width: 'auto', padding: '0 14px', opacity: page === pages ? 0.4 : 1, cursor: page === pages ? 'not-allowed' : 'pointer' }}>
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ═══ MOBILE FILTER DRAWER ═══ */}
      {filterDrawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setFilterDrawerOpen(false)} />
          <div className="drawer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Filters</h3>
              <button onClick={() => setFilterDrawerOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}>
                <FiX size={20} />
              </button>
            </div>

            {/* Type */}
            <div className="filter-section">
              <div className="filter-label"><span>Listing Type</span></div>
              {TYPES.map(t => (
                <button key={t.value} onClick={() => applyFilter('listingType', t.value)}
                  className={`toggle-row ${filters.listingType === t.value ? 'active' : ''}`}>
                  <span>{t.icon}</span><span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Category */}
            <div className="filter-section">
              <div className="filter-label"><span>Category</span></div>
              {CATS.map(c => (
                <button key={c.name} onClick={() => applyFilter('category', filters.category === c.name ? '' : c.name)}
                  className={`toggle-row ${filters.category === c.name ? 'active' : ''}`}>
                  <span>{c.icon}</span><span>{c.name}</span>
                </button>
              ))}
            </div>

            {/* Pricing */}
            <div className="filter-section">
              <div className="filter-label"><span>Pricing Model</span></div>
              {PRICING.map(([v, l, ic]) => (
                <button key={v} onClick={() => applyFilter('pricingModel', filters.pricingModel === v ? '' : v)}
                  className={`toggle-row ${filters.pricingModel === v ? 'active' : ''}`}>
                  <span>{ic}</span><span>{l}</span>
                </button>
              ))}
            </div>

            {/* Trial */}
            <button onClick={() => applyFilter('hasTrial', filters.hasTrial === 'true' ? '' : 'true')}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                background: filters.hasTrial === 'true' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16,185,129,0.06)',
                border: filters.hasTrial === 'true' ? 'none' : '1.5px solid rgba(16,185,129,0.18)',
                color: filters.hasTrial === 'true' ? '#fff' : '#059669',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                marginBottom: 16,
              }}>
              {filters.hasTrial === 'true' ? '✓ ' : ''}Free Trial Available
            </button>

            <button onClick={() => setFilterDrawerOpen(false)} className="btn-purple" style={{ width: '100%', justifyContent: 'center', padding: 13 }}>
              Show {total} results
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
    </>
  );
}
