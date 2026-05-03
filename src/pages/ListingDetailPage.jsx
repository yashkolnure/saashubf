import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import DisclaimerBox from '../components/common/DisclaimerBox';
import TrustScore from '../components/common/TrustScore';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  FiCheckCircle, FiExternalLink, FiStar, FiEye, FiMessageSquare, FiX,
  FiChevronRight, FiChevronLeft, FiArrowLeft, FiInfo, FiZap, FiSettings,
  FiCloud, FiUsers, FiLayers, FiHelpCircle, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const DEPLOY_LABELS = { cloud: '☁️ Cloud', on_premise: '🖥️ On-Premise', hybrid: '🔀 Hybrid' };
const PLATFORM_LABELS = { web: '🌐 Web', ios: '📱 iOS', android: '🤖 Android', desktop: '💻 Desktop' };

const TABS = [
  { id: 'overview', label: 'Overview', icon: <FiInfo size={14} /> },
  { id: 'features', label: 'Features', icon: <FiLayers size={14} /> },
  { id: 'technical', label: 'Technical', icon: <FiSettings size={14} /> },
  { id: 'support', label: 'Support', icon: <FiUsers size={14} /> },
  { id: 'reviews', label: 'Reviews', icon: <FiStar size={14} /> },
  { id: 'faq', label: 'FAQ', icon: <FiHelpCircle size={14} /> },
];

export default function ListingDetailPage() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { priceFor, currency, symbol } = useCurrency();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showInquiry, setShowInquiry] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [inquiry, setInquiry] = useState({ content: '', buyerCompanyName: '', buyerUseCase: '', buyerBudgetRange: '', buyerCompanySize: '' });
  const [sending, setSending] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/listings/${slug}`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => { setLoading(false); });
    window.scrollTo(0, 0);
  }, [slug]);

  const closeInquiry = () => {
    setShowInquiry(false);
    setInquiry({ content: '', buyerCompanyName: '', buyerUseCase: '', buyerBudgetRange: '', buyerCompanySize: '' });
    setDisclaimerChecked(false);
  };

  const sendInquiry = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!disclaimerChecked) { toast.error('Please accept the disclaimer first'); return; }
    if (!inquiry.content.trim()) { toast.error('Please write a message'); return; }
    setSending(true);
    try {
      await api.post('/messages/start', { listingId: data.listing._id, ...inquiry, disclaimerAccepted: true });
      toast.success('Inquiry sent! The seller will respond shortly.');
      closeInquiry();
      navigate('/buyer/inbox');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--purple-pale)', borderTopColor: 'var(--purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Listing not found</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>The product you're looking for doesn't exist or was removed.</p>
          <Link to="/listings" className="btn-purple">
            <FiArrowLeft size={14} /> Back to listings
          </Link>
        </div>
      </div>
    </div>
  );

  const { listing, similar } = data;
  const screenshots = listing.screenshots?.length ? listing.screenshots : [];
  const isWL = listing.listingType === 'whitelabel';
  const accent = isWL ? '#f59e0b' : '#7c3aed';
  const accentGradient = isWL
    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
    : 'linear-gradient(135deg, #7c3aed, #4f46e5)';

  const SITE_URL = 'https://saashub.in';
  const isWLabel = listing.listingType === 'whitelabel';
  const vendorName = listing.seller?.company?.legalName || listing.seller?.name || 'SaaSHub Vendor';

  // Build rich product keywords: name + category + features + intent signals
  const productKeywords = [
    listing.productName,
    `${listing.productName} India`,
    `buy ${listing.productName}`,
    listing.category,
    `${listing.category} software India`,
    isWLabel ? `white label ${listing.category} India` : `${listing.category} SaaS India`,
    isWLabel ? `white label ${listing.category} software` : `best ${listing.category} software India`,
    ...(listing.additionalCategories || []).map(c => `${c} software India`),
    ...(listing.keyFeatures || []).slice(0, 6),
    isWLabel ? 'white label software India' : 'SaaS software India',
    isWLabel ? 'white label software with reseller rights' : 'SaaS marketplace India',
    'verified software vendor India',
    vendorName,
  ].filter(Boolean).join(', ');

  const productDesc = listing.shortDescription ||
    `${listing.productName} is a ${isWLabel ? 'white-label' : 'SaaS'} ${listing.category} solution${listing.startingPrice ? ` starting at ${listing.currency || 'INR'} ${listing.startingPrice}` : ''}. ${listing.tagline || ''} Available on SaaSHub — India's #1 software marketplace.`;

  const listingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: listing.productName,
    description: productDesc,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: listing.category,
    operatingSystem: (listing.platforms || []).join(', ') || 'Web, Android, iOS',
    url: `${SITE_URL}/listings/${listing.slug}`,
    image: listing.logo || listing.screenshots?.[0] || `${SITE_URL}/og-image.png`,
    screenshot: listing.screenshots?.[0],
    featureList: (listing.keyFeatures || []).join(', '),
    inLanguage: 'en-IN',
    isAccessibleForFree: listing.hasFreerial ? 'True' : 'False',
    ...(listing.startingPrice && {
      offers: {
        '@type': 'Offer',
        price: listing.startingPrice,
        priceCurrency: listing.currency || 'INR',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: vendorName },
        priceValidUntil: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      },
    }),
    ...(listing.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: listing.rating,
        reviewCount: listing.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    author: { '@type': 'Organization', name: vendorName },
    publisher: { '@type': 'Organization', name: 'SaaSHub', url: SITE_URL },
  };

  const seoTitle = listing.tagline
    ? `${listing.productName} — ${listing.tagline}`
    : `${listing.productName} | ${isWLabel ? 'White-Label' : 'SaaS'} ${listing.category} Software India`;

  return (
    <>
    <SEO
      title={seoTitle}
      description={productDesc}
      keywords={productKeywords}
      image={listing.logo || listing.screenshots?.[0] || `${SITE_URL}/og-image.png`}
      url={`/listings/${listing.slug}`}
      type="website"
      jsonLd={listingJsonLd}
      breadcrumb={[
        { name: 'Home', url: '/' },
        { name: 'Browse Software', url: '/listings' },
        { name: listing.category, url: `/listings?category=${encodeURIComponent(listing.category)}` },
        { name: listing.productName },
      ]}
    />
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        .ld-wrap { max-width: 1200px; margin: 0 auto; padding: 0 28px; }

        .tab-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 14px 18px; background: transparent; border: none;
          font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
          color: var(--text-muted); cursor: pointer;
          border-bottom: 2.5px solid transparent;
          transition: all 0.2s; white-space: nowrap;
          margin-bottom: -1.5px;
        }
        .tab-btn:hover { color: var(--text-primary); }
        .tab-btn.active {
          color: var(--purple);
          border-bottom-color: var(--purple);
        }

        .info-card {
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 28px;
          animation: slideUp 0.4s ease;
        }

        .grid-2c { display: grid; grid-template-columns: 1fr 320px; gap: 28px; }
        @media (max-width: 980px) { .grid-2c { grid-template-columns: 1fr !important; } }

        .feature-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(124,58,237,0.04), rgba(99,102,241,0.04));
          border: 1px solid rgba(124,58,237,0.08);
          transition: all 0.2s;
        }
        .feature-item:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.08));
          border-color: rgba(124,58,237,0.18);
          transform: translateY(-1px);
        }

        .spec-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0; border-bottom: 1px solid var(--border);
        }
        .spec-row:last-child { border-bottom: none; }
        .spec-key {
          font-size: 13px; font-weight: 700; color: var(--text-muted);
          letter-spacing: 0.04em; text-transform: uppercase;
          min-width: 160px; flex-shrink: 0;
        }
        .spec-val { font-size: 14px; color: var(--text-primary); font-weight: 500; }

        .ss-thumb {
          width: 96px; height: 64px; border-radius: 10px;
          object-fit: cover; cursor: pointer;
          border: 2px solid transparent; transition: all 0.18s;
          flex-shrink: 0;
        }
        .ss-thumb:hover { transform: scale(1.04); }
        .ss-thumb.active { border-color: var(--purple); box-shadow: 0 4px 12px rgba(124,58,237,0.3); }

        .pricing-card-sticky {
          position: sticky; top: 80px;
        }

        .similar-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px; border-radius: 12px;
          text-decoration: none; transition: all 0.18s;
          border: 1.5px solid transparent;
        }
        .similar-link:hover {
          background: var(--purple-pale);
          border-color: rgba(124,58,237,0.18);
        }

        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details[open] .faq-icon { transform: rotate(90deg); }
        .faq-icon { transition: transform 0.25s; }

        .modal-backdrop {
          position: fixed; inset: 0; z-index: 70;
          background: rgba(7,11,30,0.7); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        .modal-card {
          background: #fff; border-radius: 24px; padding: 28px;
          max-width: 540px; width: 100%; max-height: 92vh; overflow-y: auto;
          box-shadow: 0 30px 80px rgba(0,0,0,0.4);
          animation: scaleIn 0.25s ease;
        }

        .lightbox {
          position: fixed; inset: 0; z-index: 80;
          background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .lightbox-img {
          max-width: 92vw; max-height: 88vh; border-radius: 12px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        }
        .lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s; backdrop-filter: blur(8px);
        }
        .lightbox-nav:hover { background: rgba(255,255,255,0.2); }

        .ss-main {
          width: 100%; aspect-ratio: 16/9; object-fit: cover;
          border-radius: 16px; cursor: zoom-in;
          transition: transform 0.3s;
        }
        .ss-main:hover { transform: scale(1.01); }
      `}</style>

      <Navbar />

      {/* ═════ DARK HERO HEADER ═════ */}
      <section style={{
        background: 'linear-gradient(150deg, #070d20 0%, #0f0726 55%, #080d1e 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '110px 0 56px',
      }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${isWL ? 'rgba(245,158,11,0.18)' : 'rgba(124,58,237,0.2)'}, transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <div className="ld-wrap" style={{ position: 'relative' }}>
          {/* Breadcrumb */}
          <Link to="/listings" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
            marginBottom: 28, transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            <FiArrowLeft size={14} /> Back to all listings
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
              {/* Logo */}
              <div style={{
                width: 96, height: 96, borderRadius: 22,
                background: listing.logo ? '#fff' : accentGradient,
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, overflow: 'hidden',
                boxShadow: `0 12px 40px ${isWL ? 'rgba(245,158,11,0.35)' : 'rgba(124,58,237,0.4)'}`,
              }}>
                {listing.logo ?
                  <img src={listing.logo} alt={listing.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                  <span style={{ fontSize: 44, fontWeight: 900, color: '#fff' }}>{listing.productName?.[0]}</span>}
              </div>

              {/* Name + meta */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    padding: '4px 12px', borderRadius: 99,
                    background: `${accent}25`, color: isWL ? '#fcd34d' : '#c4b5fd',
                    border: `1px solid ${accent}40`,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    {isWL ? '🏷️ White-Label' : '☁️ SaaS Product'}
                  </span>
                  {listing.seller?.company?.isVerified && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 700,
                      padding: '4px 12px', borderRadius: 99,
                      background: 'rgba(16,185,129,0.18)', color: '#6ee7b7',
                      border: '1px solid rgba(16,185,129,0.3)',
                    }}>
                      <FiCheckCircle size={11} /> Verified Seller
                    </span>
                  )}
                </div>
                <h1 style={{
                  fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900,
                  color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1,
                  margin: '0 0 8px',
                }}>
                  {listing.productName}
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
                  by <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{listing.seller?.company?.legalName}</span>
                </p>
                {listing.tagline && (
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 640, marginBottom: 20 }}>
                    {listing.tagline}
                  </p>
                )}

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                  {listing.rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiStar size={15} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{listing.rating}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>({listing.reviewCount} reviews)</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
                    <FiEye size={14} />
                    <span style={{ fontSize: 13 }}><span style={{ fontWeight: 700, color: '#fff' }}>{listing.viewCount || 0}</span> views</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
                    <FiMessageSquare size={14} />
                    <span style={{ fontSize: 13 }}><span style={{ fontWeight: 700, color: '#fff' }}>{listing.inquiryCount || 0}</span> inquiries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tag chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {listing.category && (
                <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {listing.category}
                </span>
              )}
              {listing.hasFreerial && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.18)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <FiZap size={11} /> Free Trial · {listing.freeTrialDays || 14} days
                </span>
              )}
              {listing.deployment?.map(d => (
                <span key={d} style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {DEPLOY_LABELS[d] || d}
                </span>
              ))}
            </div>

            {/* ── Tab navigation — inside hero, no sticky ── */}
            <div style={{ marginTop: 22, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 10,
                      background: tab === t.id ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${tab === t.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.5)',
                      fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
                      cursor: 'pointer', transition: 'all 0.18s',
                      backdropFilter: tab === t.id ? 'blur(8px)' : 'none',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ MAIN CONTENT ═════ */}
      <div className="ld-wrap" style={{ padding: '36px 28px 64px', flex: 1, width: '100%' }}>
        <div className="grid-2c">
          {/* ═══ LEFT — main content ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <>
                {screenshots.length > 0 && (
                  <div className="info-card" style={{ padding: 20 }}>
                    <img
                      src={screenshots[imgIdx]}
                      alt="screenshot"
                      className="ss-main"
                      onClick={() => setLightboxOpen(true)}
                    />
                    {screenshots.length > 1 && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
                        {screenshots.map((s, i) => (
                          <img key={i} src={s} onClick={() => setImgIdx(i)} alt=""
                            className={`ss-thumb ${imgIdx === i ? 'active' : ''}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="info-card">
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 9, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiInfo size={15} color="#fff" />
                    </span>
                    About {listing.productName}
                  </h2>
                  <div
                    style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}
                    dangerouslySetInnerHTML={{ __html: listing.fullDescription || listing.shortDescription || '<p>No description available.</p>' }}
                  />
                </div>

                {listing.useCases?.length > 0 && (
                  <div className="info-card">
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18 }}>Use Cases</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                      {listing.useCases.map((u, i) => (
                        <div key={i} style={{
                          background: 'linear-gradient(135deg, var(--purple-pale), #f5f3ff)',
                          border: '1px solid rgba(124,58,237,0.15)',
                          borderRadius: 14, padding: 18,
                        }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--purple), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 18 }}>
                            ✨
                          </div>
                          <h3 style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>{u.title}</h3>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{u.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {listing.testimonials?.filter(t => t.approved).length > 0 && (
                  <div className="info-card">
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18 }}>What customers say</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {listing.testimonials.filter(t => t.approved).map((t, i) => (
                        <div key={i} style={{
                          background: '#fafbff', borderRadius: 14, padding: 20,
                          borderLeft: `4px solid ${accent}`,
                        }}>
                          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.65 }}>
                            "{t.quote}"
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {t.name} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>· {t.designation} @ {t.company}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* FEATURES */}
            {tab === 'features' && (
              <div className="info-card">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiLayers size={15} color="#fff" />
                  </span>
                  Key Features
                </h2>
                {listing.keyFeatures?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    {listing.keyFeatures.map(f => (
                      <div key={f} className="feature-item">
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--purple), var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FiCheck size={14} color="#fff" strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.55 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No features listed yet.</p>
                )}

                {listing.integrations?.length > 0 && (
                  <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px dashed var(--border)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Integrates With</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {listing.integrations.map(i => (
                        <span key={i} style={{
                          fontSize: 12, fontWeight: 600,
                          padding: '6px 14px', borderRadius: 8,
                          background: '#f1f5f9', color: '#475569',
                          border: '1px solid #e2e8f0',
                        }}>
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TECHNICAL */}
            {tab === 'technical' && (
              <div className="info-card">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiSettings size={15} color="#fff" />
                  </span>
                  Technical Specifications
                </h2>
                <div>
                  {[
                    ['Deployment', listing.deployment?.map(d => DEPLOY_LABELS[d]).join(', ')],
                    ['Platforms', listing.platforms?.map(p => PLATFORM_LABELS[p]).join(', ')],
                    ['API Access', listing.hasApi ? 'Available' : 'Not available'],
                    ['Open Source', listing.isOpenSource ? 'Yes' : 'No'],
                    ['Data Residency', listing.dataResidency],
                    ['Uptime SLA', listing.uptimeSla],
                    ['Security Certs', listing.securityCerts?.join(', ')],
                    ['Languages', listing.languagesSupported?.join(', ')],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="spec-row">
                      <div className="spec-key">{k}</div>
                      <div className="spec-val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUPPORT */}
            {tab === 'support' && (
              <div className="info-card">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiUsers size={15} color="#fff" />
                  </span>
                  Support & Onboarding
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {[
                    ['Support Channels', listing.supportChannels?.join(', '), '💬'],
                    ['Support Hours', listing.supportHours, '🕒'],
                    ['Timezone', listing.supportTimezone, '🌐'],
                    ['Onboarding', listing.onboardingType?.replace('_', ' '), '🚀'],
                    ['Training', listing.offersTraining ? 'Available' : 'Not offered', '🎓'],
                    ['Dedicated Manager', listing.hasDedicatedManager ? 'Available' : 'Not available', '👤'],
                  ].filter(([, v]) => v).map(([k, v, icon]) => (
                    <div key={k} style={{
                      background: '#fafbff', borderRadius: 14,
                      border: '1px solid var(--border)', padding: 16,
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                        {k}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {listing.documentationUrl && (
                  <a href={listing.documentationUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 18px', borderRadius: 11,
                      background: 'linear-gradient(135deg, var(--purple), var(--indigo))',
                      color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                    }}>
                    View Documentation <FiExternalLink size={13} />
                  </a>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {tab === 'reviews' && (
              <div className="info-card" style={{ textAlign: 'center', padding: '56px 28px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                }}>⭐</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>No reviews yet</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto' }}>
                  Be the first to review this product after trying it. Reviews help other buyers make informed decisions.
                </p>
              </div>
            )}

            {/* FAQ */}
            {tab === 'faq' && (
              <div className="info-card">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiHelpCircle size={15} color="#fff" />
                  </span>
                  Frequently Asked Questions
                </h2>
                {listing.faq?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {listing.faq.map((f, i) => (
                      <details key={i} style={{
                        background: '#fafbff', borderRadius: 12,
                        border: '1px solid var(--border)', padding: '14px 18px',
                      }}>
                        <summary style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
                        }}>
                          <span>{f.question}</span>
                          <FiChevronRight size={16} className="faq-icon" color="var(--text-muted)" />
                        </summary>
                        <p style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {f.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No FAQs added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* ═══ RIGHT — sticky sidebar ═══ */}
          <aside>
            <div className="pricing-card-sticky" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Pricing & CTA card */}
              <div style={{
                background: '#fff', borderRadius: 20,
                border: '1.5px solid var(--border)',
                padding: 0, overflow: 'hidden',
                boxShadow: '0 8px 28px rgba(15,36,67,0.06)',
              }}>
                {/* Header strip */}
                {(() => {
                  const displayPrice = priceFor(listing);
                  return (
                    <div style={{ background: accentGradient, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
                      <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px', position: 'relative' }}>
                        {displayPrice ? 'Starting From' : 'Pricing'}
                      </p>
                      <h3 style={{ fontSize: displayPrice ? 28 : 22, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em', position: 'relative', lineHeight: 1.1 }}>
                        {displayPrice || 'Ask for Price'}
                      </h3>
                      {displayPrice && listing.pricingModel && (
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', position: 'relative', textTransform: 'capitalize' }}>
                          {listing.pricingModel.replace(/_/g, ' ')}
                        </p>
                      )}
                      {!displayPrice && (
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', position: 'relative' }}>
                          Direct seller pricing · No commission
                        </p>
                      )}
                    </div>
                  );
                })()}

                <div style={{ padding: 22 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                    {listing.pricingModel && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pricing model</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                          {listing.pricingModel.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    {listing.minContractLength && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Min contract</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                          {listing.minContractLength}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing in</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {currency} {symbol}
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const displayPrice = priceFor(listing);
                    return (
                      <button
                        onClick={() => { if (!isAuthenticated) navigate('/login'); else setShowInquiry(true); }}
                        style={{
                          width: '100%', padding: '14px 20px',
                          background: accentGradient, color: '#fff',
                          fontSize: 14.5, fontWeight: 800, letterSpacing: '0.01em',
                          border: 'none', borderRadius: 12, cursor: 'pointer',
                          boxShadow: `0 6px 20px ${isWL ? 'rgba(245,158,11,0.4)' : 'rgba(124,58,237,0.4)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <FiMessageSquare size={15} /> {displayPrice ? 'Send Inquiry' : 'Ask for Price'}
                      </button>
                    );
                  })()}

                  {listing.productWebsite && (
                    <a href={listing.productWebsite} target="_blank" rel="noopener noreferrer"
                      style={{
                        marginTop: 10, padding: '12px 18px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 7,
                        background: '#f8fafc', border: '1.5px solid var(--border)',
                        borderRadius: 12, color: 'var(--text-primary)',
                        fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                      Visit Website <FiExternalLink size={12} />
                    </a>
                  )}

                  {listing.hasFreerial && (
                    <div style={{
                      marginTop: 14, padding: '10px 14px',
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.06))',
                      border: '1px solid rgba(16,185,129,0.18)',
                      borderRadius: 11, display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <FiZap size={14} color="#059669" />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#059669' }}>
                        Free {listing.freeTrialDays || 14}-day trial available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller card */}
              <div style={{
                background: '#fff', borderRadius: 18,
                border: '1.5px solid var(--border)', padding: 20,
              }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                  About the Seller
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {listing.seller?.company?.legalName}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Seller since {new Date(listing.seller?.createdAt).getFullYear()}
                </p>
                {listing.seller?.company?.isVerified && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 12px', borderRadius: 10,
                    background: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.18)',
                    marginBottom: 14,
                  }}>
                    <FiCheckCircle size={14} color="#059669" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>GST & Company Verified</span>
                  </div>
                )}
                <TrustScore score={listing.seller?.trustScore || 0} />
              </div>
              
            <DisclaimerBox type="listing" />


              {/* Similar */}
              {similar?.length > 0 && (
                <div style={{
                  background: '#fff', borderRadius: 18,
                  border: '1.5px solid var(--border)', padding: 20,
                }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                    Similar Products
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {similar.map(s => (
                      <Link key={s._id} to={`/listings/${s.slug}`} className="similar-link">
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: 'linear-gradient(135deg, var(--purple), var(--indigo))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 900, color: '#fff', flexShrink: 0,
                        }}>
                          {s.productName?.[0]}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                            {s.productName}
                          </p>
                          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                            {s.category}
                          </p>
                        </div>
                        <FiChevronRight size={14} color="var(--text-muted)" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ═════ INQUIRY MODAL ═════ */}
      {showInquiry && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeInquiry()}>
          <div className="modal-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  Send Inquiry
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  to {listing.seller?.company?.legalName}
                </p>
              </div>
              <button onClick={closeInquiry} style={{
                background: '#f1f5f9', border: 'none',
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <FiX size={18} />
              </button>
            </div>

            <DisclaimerBox type="message" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <input
                placeholder="Your company name"
                value={inquiry.buyerCompanyName}
                onChange={e => setInquiry(p => ({ ...p, buyerCompanyName: e.target.value }))}
                className="input-field"
              />
              <select
                value={inquiry.buyerCompanySize}
                onChange={e => setInquiry(p => ({ ...p, buyerCompanySize: e.target.value }))}
                className="input-field">
                <option value="">Company size</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="200+">200+ employees</option>
              </select>
              <input
                placeholder="What do you need this for?"
                value={inquiry.buyerUseCase}
                onChange={e => setInquiry(p => ({ ...p, buyerUseCase: e.target.value }))}
                className="input-field"
              />
              <input
                placeholder="Budget range (e.g. $500–$2,000/month)"
                value={inquiry.buyerBudgetRange}
                onChange={e => setInquiry(p => ({ ...p, buyerBudgetRange: e.target.value }))}
                className="input-field"
              />
              <textarea
                rows={4}
                placeholder="Your message to the seller..."
                value={inquiry.content}
                onChange={e => setInquiry(p => ({ ...p, content: e.target.value }))}
                className="input-field"
                style={{ resize: 'none' }}
              />

              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: 12, borderRadius: 12,
                background: '#fafbff', border: '1px solid var(--border)',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={disclaimerChecked}
                  onChange={e => setDisclaimerChecked(e.target.checked)}
                  style={{ marginTop: 3, accentColor: 'var(--purple)' }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  I understand that SaaSHub is a listing platform only and does not verify seller claims or mediate disputes. I will conduct independent due diligence before any payment.
                </span>
              </label>

              <button
                onClick={sendInquiry}
                disabled={sending || !disclaimerChecked}
                style={{
                  padding: '14px 20px', borderRadius: 12,
                  background: sending || !disclaimerChecked ? '#cbd5e1' : 'linear-gradient(135deg, var(--purple), var(--indigo))',
                  color: '#fff', fontSize: 14, fontWeight: 800,
                  border: 'none', cursor: sending || !disclaimerChecked ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: sending || !disclaimerChecked ? 'none' : '0 6px 20px rgba(124,58,237,0.35)',
                  transition: 'all 0.2s',
                }}>
                {sending ? 'Sending…' : <>Send Inquiry <FiArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════ LIGHTBOX ═════ */}
      {lightboxOpen && screenshots.length > 0 && (
        <div className="lightbox" onClick={e => e.target === e.currentTarget && setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} style={{
            position: 'absolute', top: 24, right: 24,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 2,
          }}>
            <FiX size={20} />
          </button>

          {screenshots.length > 1 && (
            <>
              <button className="lightbox-nav" style={{ left: 24 }}
                onClick={() => setImgIdx(i => (i - 1 + screenshots.length) % screenshots.length)}>
                <FiChevronLeft size={20} />
              </button>
              <button className="lightbox-nav" style={{ right: 24 }}
                onClick={() => setImgIdx(i => (i + 1) % screenshots.length)}>
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          <img src={screenshots[imgIdx]} alt="screenshot" className="lightbox-img" />

          {screenshots.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              padding: '8px 16px', borderRadius: 99,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff', fontSize: 13, fontWeight: 700, backdropFilter: 'blur(8px)',
            }}>
              {imgIdx + 1} / {screenshots.length}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
    </>
  );
}
