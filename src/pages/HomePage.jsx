import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SEO from '../components/common/SEO';
import Footer from '../components/common/Footer';
import api from '../utils/api';
import { useCurrency } from '../context/CurrencyContext';
import {
  FiArrowRight, FiCheckCircle, FiSearch, FiEye, FiShield,
  FiZap, FiStar, FiUsers, FiLock,
  FiMessageSquare, FiFilter, FiBarChart2, FiCheck, FiGlobe,
  FiAward, FiDollarSign, FiGrid, FiChevronRight,
} from 'react-icons/fi';

/* ─── Static data ──────────────────────────────────────────── */

const CATS = [
  { name: 'CRM', icon: '📊', gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', shadow: 'rgba(59,130,246,0.25)', desc: 'Customer Relationship Management' },
  { name: 'HR & Payroll', icon: '👥', gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', shadow: 'rgba(139,92,246,0.25)', desc: 'HR Automation & Payroll' },
  { name: 'ERP', icon: '🏭', gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.25)', desc: 'Enterprise Resource Planning' },
  { name: 'E-Commerce', icon: '🛒', gradient: 'linear-gradient(135deg,#f97316,#ea580c)', shadow: 'rgba(249,115,22,0.25)', desc: 'Online Store & Commerce' },
  { name: 'Analytics', icon: '📈', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.25)', desc: 'Data Insights & Reporting' },
  { name: 'Finance', icon: '💰', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', shadow: 'rgba(239,68,68,0.25)', desc: 'Accounting & Invoicing' },
  { name: 'Communication', icon: '💬', gradient: 'linear-gradient(135deg,#ec4899,#be185d)', shadow: 'rgba(236,72,153,0.25)', desc: 'Team Chat & Collaboration' },
  { name: 'Security', icon: '🔒', gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)', shadow: 'rgba(6,182,212,0.25)', desc: 'Cybersecurity & Compliance' },
];

const TESTIMONIALS = [
  { name: 'James Whitfield', role: 'CTO, NovaTech UK', text: 'Found our white-label CRM in 2 days. Saved us 6 months of development time and over $120K in build cost. The seller was professional and delivered exactly what was listed.', rating: 5, avatar: 'J', color: '#6366f1', tag: 'Buyer' },
  { name: 'Priya Mehta', role: 'Founder, CloudSoft Singapore', text: 'Listed 3 products for free. Got 40+ serious B2B inquiries in the first month — quality leads, not noise. Best ROI channel we\'ve found for our white-label SaaS.', rating: 5, avatar: 'P', color: '#8b5cf6', tag: 'Seller' },
  { name: 'Carlos Rivera', role: 'Director, DataBase Inc. (US)', text: 'The verification process builds real trust. Buyers know we\'re legitimate before the first message. Deal closure rate is 3x better than cold outreach.', rating: 5, avatar: 'C', color: '#0891b2', tag: 'Seller' },
];

const TICKER_ITEMS = [
  '🏷️ White-Label CRM', '☁️ SaaS HR Platform', '📊 Analytics Suite',
  '🛒 E-Commerce Engine', '🏭 ERP System', '💬 Team Communication',
  '🔒 Security Suite', '💰 Finance & Accounting', '🎓 EdTech Platform',
  '🏥 HealthTech SaaS', '📣 Marketing Automation', '⚙️ DevOps Tools',
];

/* ─── Reusable sub-components ──────────────────────────────── */

function StarRow({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array(count).fill(0).map((_, i) => (
        <FiStar key={i} size={13} fill="#f59e0b" color="#f59e0b" />
      ))}
    </div>
  );
}

/* Animated listing card shown inside hero UI mockup */
function MockCard({ name, type, cat, color, accentBg, emoji, views = 0, delay = '0s' }) {
  const isWL = type === 'White-Label';
  return (
    <div style={{
      background: '#fff', borderRadius: 14, overflow: 'hidden',
      border: '1.5px solid #e2e6ed', marginBottom: 8,
      animation: `slideUp 0.5s ${delay} ease both`,
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${color},${color}80,transparent)` }} />
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg,${color},${color}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, flexShrink: 0,
          }}>{emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a2332', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
            <div style={{ fontSize: 10.5, color: '#8896a8', display: 'flex', alignItems: 'center', gap: 3 }}>
              <FiCheckCircle size={9} color="#10b981" /> Verified Seller
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: accentBg, color, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10.5, color: '#64748b', background: '#f1f5f9', borderRadius: 5, padding: '2px 7px' }}>{cat}</span>
          {isWL && <span style={{ fontSize: 10.5, color: '#059669', background: 'rgba(16,185,129,0.08)', borderRadius: 5, padding: '2px 7px' }}>Free Trial</span>}
          <span style={{ fontSize: 10.5, color: '#8896a8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
            <FiEye size={10} /> {views}
          </span>
        </div>
      </div>
    </div>
  );
}

/* The detailed app-UI hero illustration */
function HeroMockup() {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Glow behind the mockup */}
      <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.3) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

      {/* Browser window frame */}
      <div style={{
        position: 'relative',
        width: 420,
        background: '#0d1224',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 48px 96px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
        overflow: 'hidden',
        transform: 'perspective(900px) rotateY(-6deg) rotateX(2deg)',
        transformOrigin: 'right center',
        animation: 'floatMock 7s ease-in-out infinite',
      }}>
        {/* Browser chrome */}
        <div style={{ background: '#080c18', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '3px 10px', fontSize: 10.5, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiLock size={9} color="rgba(255,255,255,0.25)" /> onlinesaasmarketplace.com/listings
          </div>
          <FiGrid size={12} color="rgba(255,255,255,0.2)" />
        </div>

        {/* Inner app content */}
        <div style={{ background: '#f2f5ff', padding: '12px 14px 14px' }}>
          {/* Mini search + filter row */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 9, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 7, border: '1.5px solid #e2e6ed' }}>
              <FiSearch size={11} color="#8896a8" />
              <span style={{ fontSize: 11, color: '#8896a8' }}>Search white-label software…</span>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid #e2e6ed', borderRadius: 9, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <FiFilter size={11} color="#4a5568" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4a5568' }}>Filter</span>
            </div>
          </div>

          {/* Type pills */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[
              { label: 'All Software', active: false },
              { label: '🏷️ White-Label', active: true },
              { label: '☁️ SaaS', active: false },
            ].map(p => (
              <span key={p.label} style={{
                fontSize: 10.5, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                background: p.active ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#fff',
                color: p.active ? '#fff' : '#64748b',
                border: p.active ? 'none' : '1.5px solid #e2e6ed',
                whiteSpace: 'nowrap',
              }}>{p.label}</span>
            ))}
          </div>

          {/* Result count */}
          <div style={{ fontSize: 10, color: '#8896a8', marginBottom: 8, fontWeight: 600 }}>
            Showing <span style={{ color: '#1a2332' }}>48 results</span> · White-Label
          </div>

          {/* Listing cards inside the mockup */}
          <MockCard name="SalesEdge CRM" type="White-Label" cat="CRM" color="#f59e0b" accentBg="rgba(245,158,11,0.1)" emoji="📊" views={1240} delay="0.1s" />
          <MockCard name="HRMaster Pro Suite" type="SaaS" cat="HR & Payroll" color="#7c3aed" accentBg="rgba(124,58,237,0.08)" emoji="👥" views={892} delay="0.2s" />
          <MockCard name="ShopEngine WL" type="White-Label" cat="E-Commerce" color="#f97316" accentBg="rgba(249,115,22,0.08)" emoji="🛒" views={674} delay="0.3s" />

          {/* Pagination dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 6 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ width: i === 1 ? 18 : 7, height: 7, borderRadius: 99, background: i === 1 ? '#7c3aed' : '#cbd5e1', transition: 'all 0.2s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating: Inquiry sent badge */}
      <div style={{
        position: 'absolute', top: 12, right: -20,
        background: 'rgba(10,14,32,0.9)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14, padding: '10px 14px',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', gap: 10,
        animation: 'floatA 5s ease-in-out infinite',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: 10,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiMessageSquare size={15} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Inquiry Sent!</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Seller responds in ~2h</div>
        </div>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', flexShrink: 0 }} />
      </div>

      {/* Floating: Verified seller badge */}
      <div style={{
        position: 'absolute', bottom: 40, right: -28,
        background: 'rgba(10,14,32,0.9)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14, padding: '10px 14px',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', gap: 10,
        animation: 'floatB 6s ease-in-out infinite',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: 10,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,147,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiAward size={15} color="#f0c060" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Seller Verified</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>GST · CIN · Domain ✓</div>
        </div>
      </div>

      {/* Floating: Active listings count */}
      <div style={{
        position: 'absolute', bottom: -10, left: -20,
        background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
        borderRadius: 14, padding: '12px 18px',
        boxShadow: '0 8px 28px rgba(124,58,237,0.5)',
        animation: 'floatC 8s ease-in-out infinite',
        zIndex: 10,
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>500+</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>Active Listings</div>
      </div>
    </div>
  );
}

/* "How it works" step illustration */
function StepIllustration({ step }) {
  const illustrations = {
    1: (
      <div style={{ position: 'relative', height: 80 }}>
        {/* Mini search + filter mockup */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '8px 12px', border: '1.5px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          <FiSearch size={12} color="#8896a8" />
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#e2e6ed' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#f59e0b','#7c3aed','#10b981'].map((c, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 20, background: c, opacity: i === 0 ? 1 : 0.3 }} />
          ))}
        </div>
      </div>
    ),
    2: (
      <div style={{ position: 'relative', height: 80 }}>
        {/* Mini detail view mockup */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '8px 12px', border: '1.5px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#f59e0b,#d97706)' }} />
            <div>
              <div style={{ height: 7, width: 80, borderRadius: 4, background: '#1a2332', marginBottom: 3 }} />
              <div style={{ height: 6, width: 50, borderRadius: 4, background: '#e2e6ed' }} />
            </div>
            <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.12)', borderRadius: 6, padding: '3px 8px' }}>
              <div style={{ height: 6, width: 30, borderRadius: 4, background: '#10b981' }} />
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: '#e2e6ed', marginBottom: 4 }} />
          <div style={{ height: 6, borderRadius: 4, background: '#e2e6ed', width: '75%' }} />
        </div>
      </div>
    ),
    3: (
      <div style={{ position: 'relative', height: 80 }}>
        {/* Mini message compose mockup */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '8px 12px', border: '1.5px solid var(--border)' }}>
          <div style={{ height: 6, borderRadius: 4, background: '#e2e6ed', marginBottom: 4, width: '90%' }} />
          <div style={{ height: 6, borderRadius: 4, background: '#e2e6ed', marginBottom: 4, width: '70%' }} />
          <div style={{ height: 6, borderRadius: 4, background: '#e2e6ed', marginBottom: 10, width: '80%' }} />
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 7, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <div style={{ height: 6, width: 50, borderRadius: 4, background: 'rgba(255,255,255,0.6)' }} />
          </div>
        </div>
      </div>
    ),
    4: (
      <div style={{ position: 'relative', height: 80 }}>
        {/* Mini deal/chat thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', borderRadius: '10px 10px 10px 2px', padding: '5px 10px', maxWidth: '70%' }}>
            <div style={{ height: 6, width: 80, borderRadius: 4, background: '#94a3b8' }} />
          </div>
          <div style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '10px 10px 2px 10px', padding: '5px 10px', maxWidth: '70%' }}>
            <div style={{ height: 6, width: 60, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }} />
          </div>
          <div style={{ alignSelf: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <FiCheck size={10} color="#10b981" />
            <div style={{ height: 6, width: 50, borderRadius: 4, background: '#10b981', opacity: 0.5 }} />
          </div>
        </div>
      </div>
    ),
  };
  return illustrations[step] || null;
}

/* Mini listing card for featured section */
function ListingMini({ listing: l }) {
  const isWL = l.listingType === 'whitelabel';
  const accent = isWL ? '#f59e0b' : '#7c3aed';
  const accentBg = isWL ? 'rgba(245,158,11,0.08)' : 'rgba(124,58,237,0.07)';

  return (
    <Link to={`/listings/${l.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <article style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: 18, overflow: 'hidden', height: '100%',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${accentBg.replace('08','20')}`; e.currentTarget.style.borderColor = accent + '50'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = ''; }}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg,${accent},${accent}60,transparent)` }} />
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: l.logo ? '#fff' : `linear-gradient(135deg,${accent},${accent}99)`, border: l.logo ? '1.5px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: `0 4px 12px ${accent}30` }}>
              {l.logo ? <img src={l.logo} alt={`${l.productName} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>{l.productName?.[0]}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <h3 style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{l.productName}</h3>
                {l.seller?.company?.isVerified && <FiCheckCircle size={13} color="#10b981" style={{ flexShrink: 0 }} />}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{l.seller?.company?.legalName}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, margin: 0 }}>
            {l.tagline || l.shortDescription}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: accentBg, color: accent }}>
                {isWL ? 'White-Label' : 'SaaS'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: '#f1f5f9', color: '#475569' }}>
                {l.category}
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <FiEye size={11} /> {l.viewCount || 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [tickerPaused, setTickerPaused] = useState(false);
  const navigate = useNavigate();

  /* SEO: document title + meta tags */
  useEffect(() => {
    document.title = 'SaaSHub — Global White-Label & SaaS Software Marketplace';

    const metas = [
      { name: 'description', content: 'Buy and sell white-label SaaS software globally. Find CRM, ERP, HR, Analytics & more rebrandable platforms from verified technology vendors. Free to list. Zero commission.' },
      { name: 'keywords', content: 'white label software marketplace, buy white label SaaS, sell SaaS globally, B2B software marketplace, resell SaaS, white label CRM, white label ERP, rebrandable software, SaaS reseller platform' },
      { property: 'og:title', content: 'SaaSHub — Global White-Label & SaaS Software Marketplace' },
      { property: 'og:description', content: 'Discover 500+ verified white-label SaaS products worldwide. Buy or sell CRM, ERP, HR, Analytics & more. No commission, verified sellers.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'SaaSHub — Buy & Sell White-Label SaaS Software' },
      { name: 'twitter:description', content: 'The global B2B marketplace for white-label and SaaS software. Free listing, 0% commission, verified sellers worldwide.' },
      { name: 'robots', content: 'index, follow' },
    ];

    const tags = [];
    metas.forEach(attrs => {
      const el = document.createElement('meta');
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      tags.push(el);
    });

    /* JSON-LD structured data */
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'SaaSHub',
          description: 'The global marketplace for white-label and SaaS software',
          url: window.location.origin,
        },
        {
          '@type': 'WebSite',
          name: 'SaaSHub',
          url: window.location.origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${window.location.origin}/listings?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    });
    document.head.appendChild(ld);
    tags.push(ld);

    return () => tags.forEach(el => el.remove());
  }, []);

  const { feeFor, symbol, currency } = useCurrency();

  useEffect(() => {
    api.get('/listings?limit=6&sort=most_viewed')
      .then(r => setFeatured(r.data.listings || []))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (search.trim()) navigate(`/listings?search=${encodeURIComponent(search.trim())}`);
    else navigate('/listings');
  };

  const SITE = 'https://onlinesaasmarketplace.com';
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SaaS & White-Label Software — India\'s Largest Marketplace',
    description: "India's #1 B2B marketplace for verified SaaS products and white-label software. CRM, ERP, HR, restaurant, gym, booking, AI, WhatsApp marketing and 20+ more categories.",
    url: `${SITE}/listings`,
    numberOfItems: featured.length || 500,
    itemListElement: featured.slice(0, 10).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.productName,
      url: `${SITE}/listings/${l.slug}`,
      description: l.shortDescription || l.tagline,
    })),
  };

  return (
    <>
    <SEO
      title="Buy & Sell SaaS & White-Label Software in India — #1 Marketplace"
      description="India's #1 marketplace to buy and sell SaaS software and white-label solutions. 500+ verified products — CRM, ERP, HR, AI tools, restaurant, gym & booking software. Free to list. Zero commission."
      keywords="SaaS marketplace India, white label software India, buy SaaS software India, sell SaaS software online, white label software marketplace, B2B SaaS marketplace India, verified SaaS vendors India, Indian SaaS products, software reseller India, buy white label software, white label CRM India, white label ERP India, restaurant software India, gym software India, booking software India, AI software India, WhatsApp marketing software India"
      url="/"
      jsonLd={homeJsonLd}
      breadcrumb={[{ name: 'Home', url: '/' }]}
    />
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatMock { 0%,100% { transform:perspective(900px) rotateY(-6deg) rotateX(2deg) translateY(0); } 50% { transform:perspective(900px) rotateY(-6deg) rotateX(2deg) translateY(-10px); } }
        @keyframes floatA { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes floatB { 0%,100% { transform:translateY(-4px); } 50% { transform:translateY(6px); } }
        @keyframes floatC { 0%,100% { transform:translateY(-6px) rotate(-2deg); } 50% { transform:translateY(4px) rotate(2deg); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes ticker { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmerSkeleton { 0%{background-position:-600px 0;} 100%{background-position:600px 0;} }

        .a0 { animation: slideUp 0.7s 0s ease both; }
        .a1 { animation: slideUp 0.7s 0.12s ease both; }
        .a2 { animation: slideUp 0.7s 0.22s ease both; }
        .a3 { animation: slideUp 0.7s 0.32s ease both; }
        .a4 { animation: slideUp 0.7s 0.42s ease both; }

        .hero-search-wrap {
          display:flex; align-items:center;
          background:rgba(255,255,255,0.07);
          border:1.5px solid rgba(255,255,255,0.14);
          border-radius:14px;
          padding:5px 5px 5px 16px;
          backdrop-filter:blur(20px);
          max-width:520px; width:100%;
          transition:all 0.2s;
        }
        .hero-search-wrap:focus-within {
          border-color:rgba(167,139,250,0.55);
          background:rgba(255,255,255,0.1);
          box-shadow:0 0 0 4px rgba(124,58,237,0.18);
        }
        .hero-search-wrap input {
          flex:1; border:none; outline:none;
          font-family:'Inter',sans-serif; font-size:14px;
          color:#fff; background:transparent; padding:9px 12px;
        }
        .hero-search-wrap input::placeholder { color:rgba(255,255,255,0.38); }
        .hero-search-btn {
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          color:#fff; font-family:'Inter',sans-serif; font-weight:700;
          font-size:13px; padding:10px 20px; border-radius:10px;
          border:none; cursor:pointer; transition:all 0.15s;
          white-space:nowrap; box-shadow:0 4px 14px rgba(124,58,237,0.45);
          display:inline-flex; align-items:center; gap:6px;
        }
        .hero-search-btn:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,58,237,0.55); }

        .pop-chip {
          font-size:12px; font-weight:600;
          color:rgba(255,255,255,0.55);
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:20px; padding:4px 14px;
          text-decoration:none; transition:all 0.15s; cursor:pointer;
        }
        .pop-chip:hover { color:#fff; background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.22); }

        .ticker-track {
          display:flex; gap:28px; align-items:center; white-space:nowrap;
          animation:ticker 28s linear infinite;
        }
        .ticker-track.paused { animation-play-state:paused; }

        .cat-card {
          background:#fff; border:1.5px solid var(--border); border-radius:18px;
          padding:22px 18px; display:flex; align-items:center; gap:14px;
          text-decoration:none; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer;
          position:relative; overflow:hidden;
        }
        .cat-card::after {
          content:''; position:absolute; inset:0;
          background:currentColor; opacity:0; transition:opacity 0.2s;
          border-radius:inherit;
        }
        .cat-card:hover { transform:translateY(-5px); border-color:transparent; }

        .step-card {
          background:#fff; border:1.5px solid var(--border); border-radius:22px;
          padding:28px 24px; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          position:relative; overflow:hidden;
        }
        .step-card:hover { transform:translateY(-5px); border-color:transparent; }

        .testimonial-card {
          background:#fff; border:1.5px solid var(--border); border-radius:22px;
          padding:30px; transition:all 0.2s; display:flex; flex-direction:column; gap:18px;
        }
        .testimonial-card:hover { box-shadow:0 16px 40px rgba(15,36,67,0.1); transform:translateY(-3px); }

        .trust-card {
          background:#fff; border-radius:22px; padding:32px 28px;
          transition:all 0.25s; display:flex; flex-direction:column; align-items:flex-start; gap:16px;
        }
        .trust-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(15,36,67,0.09); }

        .seller-feature {
          display:flex; align-items:flex-start; gap:14px;
          padding:18px 20px; background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08); border-radius:14px;
          transition:all 0.2s;
        }
        .seller-feature:hover { background:rgba(255,255,255,0.07); border-color:rgba(255,255,255,0.15); }

        .pw { max-width:1200px; margin:0 auto; padding:0 28px; }
        .section { padding:96px 0; }
        .section-sm { padding:72px 0; }

        .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .grid-cats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .grid-listings { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }

        @media (max-width:1120px) {
          .grid-listings { grid-template-columns:repeat(2,1fr) !important; }
          .grid-cats { grid-template-columns:repeat(2,1fr) !important; }
          .hero-flex { flex-direction:column !important; align-items:flex-start !important; gap:60px !important; }
          .hero-mock-wrap { align-self:center; }
        }
        @media (max-width:768px) {
          .grid-2 { grid-template-columns:1fr !important; }
          .grid-3 { grid-template-columns:1fr 1fr !important; }
          .grid-4 { grid-template-columns:1fr 1fr !important; }
          .section { padding:64px 0 !important; }
          .section-sm { padding:48px 0 !important; }
          .pw { padding:0 20px !important; }
        }
        @media (max-width:560px) {
          .grid-3,.grid-listings { grid-template-columns:1fr !important; }
          .grid-cats { grid-template-columns:repeat(2,1fr) !important; }
          .grid-4 { grid-template-columns:1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(145deg, #060c1e 0%, #0c0623 50%, #070c1c 100%)',
        position: 'relative', overflow: 'hidden', padding: '120px 0 100px',
      }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', animation: 'pulseGlow 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(200,147,39,0.07) 0%,transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />

        <div className="pw" style={{ position: 'relative' }}>
          <div className="hero-flex" style={{ display: 'flex', alignItems: 'center', gap: 64 }}>

            {/* ── Left: Copy ── */}
            <div style={{ flex: '0 0 52%', maxWidth: 560 }}>
              {/* Badge */}
              <div className="a0" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(167,139,250,0.28)', borderRadius: 24, padding: '6px 16px 6px 10px', marginBottom: 30 }}>
                <span style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>NEW</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#c4b5fd' }}>The Global Software B2B Marketplace</span>
              </div>

              {/* Headline */}
              <h1 className="a1" style={{ fontSize: 'clamp(40px,5.5vw,66px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.045em', color: '#fff', marginBottom: 22, margin: '0 0 22px' }}>
                Buy & Sell<br />
                <span style={{ background: 'linear-gradient(125deg,#f0c060 0%,#a78bfa 50%,#60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  White-Label
                </span><br />
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>SaaS Software</span>
              </h1>

              <p className="a2" style={{ fontSize: 16, color: 'rgba(255,255,255,0.52)', lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
                The global marketplace connecting <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>verified technology sellers</strong> with businesses worldwide ready to buy or rebrand SaaS platforms. Zero commission. Zero middlemen.
              </p>

              {/* Search */}
              <div className="a2 hero-search-wrap" style={{ marginBottom: 18 }}>
                <FiSearch size={16} color="rgba(255,255,255,0.38)" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search CRM, ERP, HR software, Analytics..."
                  aria-label="Search software listings"
                />
                <button className="hero-search-btn" onClick={handleSearch}>
                  <FiSearch size={13} /> Search
                </button>
              </div>

              {/* Popular chips */}
              <div className="a3" style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', marginBottom: 40 }}>
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Popular:</span>
                {['White-Label CRM', 'ERP System', 'HR Platform', 'E-Commerce Engine', 'Analytics SaaS'].map(t => (
                  <Link key={t} to={`/listings?search=${encodeURIComponent(t)}`} className="pop-chip">{t}</Link>
                ))}
              </div>

              {/* Mini social proof row */}
              <div className="a4" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { val: '500+', lbl: 'Listings' },
                  { val: '200+', lbl: 'Verified Sellers' },
                  { val: '0%', lbl: 'Commission' },
                ].map(({ val, lbl }) => (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 3, fontWeight: 600 }}>{lbl}</div>
                  </div>
                ))}
                <div style={{ height: 32, width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', gap: -6, alignItems: 'center' }}>
                  {['#6366f1','#8b5cf6','#0891b2','#f59e0b'].map((c, i) => (
                    <div key={c} style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${c},${c}99)`, border: '2px solid rgba(7,11,30,0.8)', marginLeft: i ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      {['R','P','A','M'][i]}
                    </div>
                  ))}
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginLeft: 10, fontWeight: 600 }}>Trusted by 1,200+ businesses</span>
                </div>
              </div>
            </div>

            {/* ── Right: App mockup illustration ── */}
            <div className="a4 hero-mock-wrap" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 420 }}>
              <HeroMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ANIMATED TICKER
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '14px 0', overflow: 'hidden' }}
        onMouseEnter={() => setTickerPaused(true)} onMouseLeave={() => setTickerPaused(false)}>
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          <div className={`ticker-track ${tickerPaused ? 'paused' : ''}`}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                {item}
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-strong)', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          HOW THE PLATFORM WORKS (visual flow)
      ══════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="pw">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Platform Flow</div>
            <h2 className="display-heading" style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 14 }}>How SaaSHub Works</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
              From discovery to signed deal in 4 structured steps — no commission, no middlemen, ever.
            </p>
          </div>

          {/* Connection line */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 44, left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg,#6366f1,#f59e0b,#10b981,#8b5cf6)', borderRadius: 99, opacity: 0.25, pointerEvents: 'none' }} />

            <div className="grid-4" style={{ gap: 16 }}>
              {[
                { n: '01', t: 'Browse & Filter', d: 'Search 500+ verified white-label and SaaS products by category, pricing model, deployment type, and free-trial availability.', color: '#6366f1', bg: 'rgba(99,102,241,0.09)', border: 'rgba(99,102,241,0.2)', step: 1 },
                { n: '02', t: 'Review Details', d: 'Deep-dive into product screenshots, tech specs, pricing plans, and verified seller info. Request a free demo directly.', color: '#f59e0b', bg: 'rgba(245,158,11,0.09)', border: 'rgba(245,158,11,0.25)', step: 2 },
                { n: '03', t: 'Send Inquiry', d: 'Use our structured inquiry form — share your use case, budget, and company size directly with the seller. No phone sharing.', color: '#10b981', bg: 'rgba(16,185,129,0.09)', border: 'rgba(16,185,129,0.25)', step: 3 },
                { n: '04', t: 'Close the Deal', d: 'Negotiate directly with verified sellers through our secure messaging thread. No platform commissions on any deal you close.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.09)', border: 'rgba(139,92,246,0.2)', step: 4 },
              ].map(({ n, t, d, color, bg, border, step }) => (
                <div key={n} className="step-card" style={{ borderColor: border }}>
                  {/* Step illustration */}
                  <div style={{ marginBottom: 18 }}>
                    <StepIllustration step={step} />
                  </div>
                  {/* Number + icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>{n.slice(1)}</span>
                    </div>
                    <span style={{ fontSize: 32, fontWeight: 900, color, opacity: 0.15, letterSpacing: '-0.04em' }}>{n}</span>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--text-primary)', marginBottom: 8 }}>{t}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>{d}</p>
                  {/* Hover CTA */}
                  <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color, opacity: 0 }} className="step-cta">
                    Learn more <FiChevronRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div className="pw">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-tag" style={{ marginBottom: 10 }}>Browse by Industry</div>
              <h2 className="display-heading" style={{ fontSize: 'clamp(26px,3.5vw,36px)', margin: 0 }}>Explore Software Categories</h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8, maxWidth: 400 }}>Find white-label and SaaS products across every major business domain.</p>
            </div>
            <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 700, color: 'var(--purple)', textDecoration: 'none', background: 'var(--purple-pale)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(124,58,237,0.15)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--purple-pale)'; e.currentTarget.style.color = 'var(--purple)'; }}>
              View all categories <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cats">
            {CATS.map(({ name, icon, gradient, shadow, desc }) => (
              <Link key={name} to={`/listings?category=${encodeURIComponent(name)}`} className="cat-card"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 32px ${shadow}`; e.currentTarget.style.borderColor = 'transparent'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = ''; }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 6px 18px ${shadow}` }}>
                  {icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>
                </div>
                <FiChevronRight size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TWO PRODUCT TYPES — detailed
      ══════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="pw">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>What You Can Buy or Sell</div>
            <h2 className="display-heading" style={{ fontSize: 'clamp(26px,3.5vw,40px)', marginBottom: 14 }}>Two Software Models. One Platform.</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
              Whether you're buying a rebrandable platform or a subscription SaaS tool, we support both B2B software models.
            </p>
          </div>

          <div className="grid-2">
            {/* White-Label Card */}
            <Link to="/listings?type=whitelabel" style={{ textDecoration: 'none' }}>
              <div style={{ borderRadius: 24, padding: '36px 32px', transition: 'all 0.28s', cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg,#fffbf0,#fff8e1)', border: '2px solid rgba(200,147,42,0.18)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(200,147,42,0.2)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,147,42,0.18)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                {/* Background deco */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.07)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(245,158,11,0.04)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 8px 24px rgba(245,158,11,0.4)' }}>🏷️</div>
                  <span style={{ background: 'rgba(200,147,42,0.12)', color: '#92400e', borderRadius: 20, padding: '4px 13px', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>White-Label</span>
                </div>

                <h3 style={{ fontWeight: 900, fontSize: 24, color: 'var(--text-primary)', marginBottom: 10 }}>White-Label Software</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24 }}>
                  Ready-made platforms you can rebrand and resell as your own. Perfect for agencies and resellers wanting to launch faster without building from scratch.
                </p>

                {/* Feature list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[
                    { icon: '🔑', text: 'Full source code or SaaS licence transfer' },
                    { icon: '🎨', text: 'Rebrandable UI — your logo, colors, domain' },
                    { icon: '💼', text: 'Reseller & sub-licensing rights included' },
                    { icon: '⚡', text: 'Launch in days, not months' },
                    { icon: '📞', text: 'Direct seller support & onboarding' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{icon}</div>
                      {text}
                    </div>
                  ))}
                </div>

                {/* Mini stats */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 26, padding: '16px 0', borderTop: '1px dashed rgba(200,147,42,0.2)', borderBottom: '1px dashed rgba(200,147,42,0.2)' }}>
                  {[['120+','Products'],['Free','Platform Fee'],['Resell','Rights']].map(([v,l]) => (
                    <div key={l} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#d97706', letterSpacing: '-0.02em' }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 800, color: '#d97706', background: 'rgba(245,158,11,0.1)', padding: '10px 18px', borderRadius: 12 }}>
                  Browse White-Label Products <FiArrowRight size={14} />
                </div>
              </div>
            </Link>

            {/* SaaS Card */}
            <Link to="/listings?type=saas" style={{ textDecoration: 'none' }}>
              <div style={{ borderRadius: 24, padding: '36px 32px', transition: 'all 0.28s', cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg,#f7f5ff,#ede9fe)', border: '2px solid rgba(124,58,237,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(124,58,237,0.2)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.07)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(124,58,237,0.04)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>☁️</div>
                  <span style={{ background: 'rgba(124,58,237,0.1)', color: '#4c1d95', borderRadius: 20, padding: '4px 13px', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SaaS Product</span>
                </div>

                <h3 style={{ fontWeight: 900, fontSize: 24, color: 'var(--text-primary)', marginBottom: 10 }}>SaaS Products</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24 }}>
                  Cloud-hosted software sold directly to businesses via subscription. Ideal for ISVs and product companies looking for qualified B2B buyers.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[
                    { icon: '☁️', text: 'Cloud-hosted — ready to use immediately' },
                    { icon: '🔄', text: 'Free trial periods available on many products' },
                    { icon: '💳', text: 'Per-seat, usage-based, or flat subscription' },
                    { icon: '📊', text: 'Detailed analytics and reporting included' },
                    { icon: '🔗', text: 'API integrations and webhook support' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{icon}</div>
                      {text}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 26, padding: '16px 0', borderTop: '1px dashed rgba(124,58,237,0.15)', borderBottom: '1px dashed rgba(124,58,237,0.15)' }}>
                  {[['380+','Products'],['Free','Trials'],['0%','Commission']].map(([v,l]) => (
                    <div key={l} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.02em' }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.08)', padding: '10px 18px', borderRadius: 12 }}>
                  Browse SaaS Products <FiArrowRight size={14} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURED LISTINGS
      ══════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
          <div className="pw">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-tag" style={{ marginBottom: 10 }}>Featured Products</div>
                <h2 className="display-heading" style={{ fontSize: 'clamp(24px,3vw,36px)', margin: 0 }}>Most Viewed Software</h2>
                <p style={{ fontSize: 14.5, color: 'var(--text-muted)', marginTop: 8 }}>Top-rated white-label and SaaS products this week</p>
              </div>
              <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 700, color: 'var(--purple)', textDecoration: 'none', background: 'var(--purple-pale)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(124,58,237,0.15)' }}>
                See all listings <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid-listings">
              {featured.map(l => <ListingMini key={l._id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          FOR SELLERS — dark section
      ══════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'linear-gradient(145deg,#060c1e,#0c0623,#060c1e)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(200,147,39,0.12) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />

        <div className="pw" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Left: copy */}
            <div style={{ flex: '0 0 45%', minWidth: 280 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(200,147,39,0.12)', border: '1px solid rgba(240,192,96,0.2)', borderRadius: 24, padding: '5px 14px', marginBottom: 24 }}>
                <FiZap size={12} color="#f0c060" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f0c060', letterSpacing: '0.05em' }}>FOR SOFTWARE SELLERS</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 18 }}>
                Reach 1,000+<br />
                <span style={{ background: 'linear-gradient(135deg,#f0c060,#c89327)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Qualified Buyers
                </span>
              </h2>
              <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 32, maxWidth: 420 }}>
                SaaSHub is the global B2B marketplace for technology vendors. List your white-label or SaaS product in minutes and get inbound inquiries from verified businesses worldwide.
              </p>

              {/* Pricing callout */}
              <div style={{ background: 'rgba(200,147,39,0.08)', border: '1px solid rgba(200,147,39,0.2)', borderRadius: 14, padding: '18px 20px', marginBottom: 30 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f0c060', marginBottom: 6, letterSpacing: '0.04em' }}>PRICING</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>Free</span>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>first 3 listings</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{feeFor(1000) || '~$12'} per additional listing · 0% commission ever</div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/register/seller" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg,#c89327,#f0c060)',
                  color: '#0a0e20', fontWeight: 800, fontSize: 14,
                  padding: '12px 24px', borderRadius: 14, textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(200,147,39,0.45)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(200,147,39,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(200,147,39,0.45)'; }}>
                  <FiZap size={15} /> Start Selling Free
                </Link>
                <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 14, padding: '12px 22px', borderRadius: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s' }}>
                  View Marketplace <FiArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: feature pills */}
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: <FiUsers size={18} />, t: 'Verified Buyer Base', d: 'Every buyer provides company details. No tyre-kickers — only serious B2B purchasers.', color: '#6366f1' },
                { icon: <FiShield size={18} />, t: 'Fraud-Protected Messaging', d: 'Phone numbers blocked for first 3 messages. Full conversation logs. Report & block available.', color: '#f59e0b' },
                { icon: <FiBarChart2 size={18} />, t: 'Seller Analytics Dashboard', d: 'Track listing views, inquiry rates, conversion funnel, and top-performing products in real time.', color: '#10b981' },
                { icon: <FiGlobe size={18} />, t: 'SEO-Optimised Listings', d: 'Your products rank on Google for category-specific B2B searches. Free visibility boost.', color: '#8b5cf6' },
                { icon: <FiDollarSign size={18} />, t: 'Zero Commission Model', d: 'Every rupee of every deal you close stays yours. We earn on listing fees, not deal outcomes.', color: '#f0c060' },
              ].map(({ icon, t, d, color }) => (
                <div key={t} className="seller-feature">
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}1a`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="pw">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Social Proof</div>
            <h2 className="display-heading" style={{ fontSize: 'clamp(26px,3.5vw,40px)', marginBottom: 12 }}>Trusted by Builders & Sellers</h2>
            <p style={{ fontSize: 15.5, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto', lineHeight: 1.75 }}>
              Real experiences from buyers and software vendors who've closed deals on SaaSHub.
            </p>
          </div>

          <div className="grid-3">
            {TESTIMONIALS.map(({ name, role, text, rating, avatar, color, tag }) => (
              <blockquote key={name} className="testimonial-card" style={{ margin: 0 }}>
                {/* Quote mark */}
                <div style={{ fontSize: 48, lineHeight: 0.8, color, opacity: 0.15, fontFamily: 'Georgia, serif', marginBottom: 8, display: 'block' }}>"</div>
                {/* Stars */}
                <StarRow count={rating} />
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '14px 0 20px', fontStyle: 'italic' }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg,${color},${color}bb)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: tag === 'Buyer' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', color: tag === 'Buyer' ? '#4f46e5' : '#059669' }}>
                    {tag}
                  </span>
                </div>
              </blockquote>
            ))}
          </div>

          {/* Trust bar */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, marginTop: 52, padding: '28px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {[
              { icon: <FiUsers size={18} />, v: '1,200+', l: 'Businesses Served', c: '#6366f1' },
              { icon: <FiCheckCircle size={18} />, v: '100%', l: 'Verified Sellers', c: '#10b981' },
              { icon: <FiMessageSquare size={18} />, v: '4,800+', l: 'Inquiries Processed', c: '#f59e0b' },
              { icon: <FiAward size={18} />, v: '4.9 / 5', l: 'Platform Rating', c: '#8b5cf6' },
              { icon: <FiShield size={18} />, v: '0%', l: 'Commission', c: '#0891b2' },
            ].map(({ icon, v, l, c }) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${c}15`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST & SECURITY
      ══════════════════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div className="pw">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Security & Trust</div>
            <h2 className="display-heading" style={{ fontSize: 'clamp(24px,3.5vw,36px)', marginBottom: 12 }}>Built for Safe B2B Transactions</h2>
            <p style={{ fontSize: 15.5, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto' }}>Every interaction on SaaSHub is protected by our multi-layered trust infrastructure.</p>
          </div>

          <div className="grid-3">
            {[
              { icon: <FiUsers size={26} />, title: 'Manually Verified Sellers', desc: 'Every seller provides GST number, Company CIN, and official domain email. Our admin team reviews each account before approval. No anonymous sellers.', color: '#6366f1', bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.12)', badge: 'Verified' },
              { icon: <FiLock size={26} />, title: 'Fraud-Protected Messaging', desc: 'Phone numbers and personal contact details are blocked for the first 3 messages. All conversations are logged and auditable. Full report & block system.', color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.18)', badge: 'Secure' },
              { icon: <FiShield size={26} />, title: 'Full Legal Transparency', desc: 'Platform disclaimers on every listing. Buyers must acknowledge terms before contacting. Trust score, verification badges, and review system visible to all parties.', color: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.18)', badge: 'Transparent' },
            ].map(({ icon, title, desc, color, bg, border, badge }) => (
              <div key={title} className="trust-card" style={{ border: `1.5px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.07em', padding: '4px 11px', borderRadius: 20, background: bg, color, textTransform: 'uppercase' }}>{badge}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 16.5, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(145deg,#060c1e,#0c0623,#060c1e)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />

        <div className="pw" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '100px 28px' }}>
          {/* Top badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,147,39,0.12)', border: '1px solid rgba(240,192,96,0.2)', borderRadius: 24, padding: '6px 18px', marginBottom: 28 }}>
            <FiZap size={12} color="#f0c060" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f0c060', letterSpacing: '0.05em' }}>FREE TO LIST — NO CREDIT CARD</span>
          </div>

          <h2 style={{ fontWeight: 900, fontSize: 'clamp(32px,5.5vw,58px)', color: '#fff', letterSpacing: '-0.045em', marginBottom: 20, lineHeight: 1.05 }}>
            Your software deserves<br />
            <span style={{ background: 'linear-gradient(135deg,#f0c060,#c89327)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              the right audience.
            </span>
          </h2>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', marginBottom: 44, maxWidth: 460, margin: '0 auto 44px', lineHeight: 1.8 }}>
            List your white-label or SaaS software today. First 3 listings are completely free. No monthly fees. No commission on any deal you close — ever.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            <Link to="/register/seller" style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: 'linear-gradient(135deg,#c89327,#f0c060)',
              color: '#0a0e20', fontWeight: 800, fontSize: 15,
              padding: '14px 28px', borderRadius: 16, textDecoration: 'none',
              boxShadow: '0 6px 28px rgba(200,147,39,0.5)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(200,147,39,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,147,39,0.5)'; }}>
              <FiZap size={16} /> Start Selling Free
            </Link>
            <Link to="/listings" style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 15,
              padding: '14px 26px', borderRadius: 16, textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}>
              Browse Marketplace <FiArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: <FiCheck size={13} />, text: 'No credit card required' },
              { icon: <FiCheck size={13} />, text: '0% commission, ever' },
              { icon: <FiCheck size={13} />, text: 'Verified sellers only' },
              { icon: <FiCheck size={13} />, text: 'First 3 listings free' },
            ].map(({ icon, text }) => (
              <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                <span style={{ color: '#10b981' }}>{icon}</span>{text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}
