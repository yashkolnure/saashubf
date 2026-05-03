import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiTwitter, FiLinkedin, FiGithub, FiMail, FiArrowRight, FiShield, FiCheck } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { feeFor } = useCurrency();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #070b1e 0%, #050819 100%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .footer-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .footer-link {
          font-family: Outfit, sans-serif;
          font-size: 13.5px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.2s ease;
          display: block;
          padding: 4px 0;
          line-height: 1.5;
        }
        .footer-link:hover { color: rgba(255,255,255,0.85); }
        .footer-link-highlight:hover { color: #f0c060 !important; }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.18);
          color: #fff;
          transform: translateY(-2px);
        }

        .footer-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 5px 12px;
          font-family: Outfit, sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 80%, transparent 100%);
          margin: 48px 0 28px;
        }

        .footer-col-title {
          font-family: Outfit, sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .newsletter-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: Outfit, sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }
        .newsletter-input::placeholder { color: rgba(255,255,255,0.25); }

        .newsletter-wrap {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 6px 6px 6px 14px;
          transition: all 0.25s ease;
          margin-top: 16px;
        }
        .newsletter-wrap:focus-within {
          border-color: rgba(200,147,39,0.35);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(200,147,39,0.08);
        }
        .newsletter-btn {
          background: linear-gradient(135deg, #c89327, #f0c060);
          border: none;
          border-radius: 8px;
          padding: 7px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .newsletter-btn:hover { filter: brightness(1.1); transform: scale(1.03); }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px rgba(16,185,129,0.6);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 8px rgba(16,185,129,0.6); }
          50% { box-shadow: 0 0 16px rgba(16,185,129,0.9), 0 0 24px rgba(16,185,129,0.4); }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }

        .bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .bottom-bar { flex-direction: column; text-align: center; }
        }

        .glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,147,39,0.5) 30%, rgba(200,147,39,0.8) 50%, rgba(200,147,39,0.5) 70%, transparent);
          margin-bottom: 0;
        }
      `}</style>

      {/* Ambient orbs */}
      <div className="footer-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.07), transparent)', top: '-30%', left: '-10%' }} />
      <div className="footer-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(200,147,39,0.07), transparent)', bottom: '-20%', right: '-5%' }} />

      {/* Top glow accent */}
      <div className="glow-line" />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 0' }}>

        <div className="footer-grid">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #c89327, #f0c060)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(200,147,39,0.35)' }}>
                <FiZap size={16} color="#0a0f1e" strokeWidth={3} />
              </div>
              <div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>SaaS</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg, #c89327, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Hub</span>
              </div>
            </Link>

            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              The global marketplace for white-label and SaaS software. Connect with verified technology vendors worldwide and close deals directly.
            </p>

            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: '6px 12px', marginBottom: 22 }}>
              <div className="status-dot" />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, color: 'rgba(16,185,129,0.9)' }}>All systems operational</span>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              <a href="#" className="social-btn"><FiTwitter size={15} /></a>
              <a href="#" className="social-btn"><FiLinkedin size={15} /></a>
              <a href="#" className="social-btn"><FiGithub size={15} /></a>
              <a href="#" className="social-btn"><FiMail size={15} /></a>
            </div>

            {/* Pricing pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['Free to list · 3 products', `${feeFor(1000) || '~$12'} per extra listing`, '0% commission'].map(t => (
                <span key={t} className="footer-pill">{t}</span>
              ))}
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Get product updates
              </p>
              {subscribed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 14px' }}>
                  <FiCheck size={15} color="#10b981" />
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'rgba(16,185,129,0.9)' }}>You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="newsletter-wrap">
                  <input
                    className="newsletter-input"
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button type="submit" className="newsletter-btn">
                    <FiArrowRight size={15} color="#0a0f1e" strokeWidth={2.5} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Marketplace links */}
          <div>
            <div className="footer-col-title">Marketplace</div>
            <Link to="/listings" className="footer-link footer-link-highlight">Browse All Software</Link>
            <Link to="/listings?type=whitelabel" className="footer-link footer-link-highlight">White-Label Products</Link>
            <Link to="/listings?type=saas" className="footer-link footer-link-highlight">SaaS Products</Link>
            <Link to="/listings?category=CRM" className="footer-link">CRM Software</Link>
            <Link to="/listings?category=ERP" className="footer-link">ERP Systems</Link>
            <Link to="/listings?category=Analytics" className="footer-link">Analytics</Link>
            <Link to="/listings?category=E-Commerce" className="footer-link">E-Commerce</Link>
          </div>

          {/* Sellers links */}
          <div>
            <div className="footer-col-title">Sellers</div>
            <Link to="/register/seller" className="footer-link footer-link-highlight">Create Seller Account</Link>
            <Link to="/seller/dashboard" className="footer-link">Seller Dashboard</Link>
            <Link to="/seller/listings/new" className="footer-link">List a Product</Link>
            <Link to="/seller/inbox" className="footer-link">Inbox</Link>
            <Link to="/seller/analytics" className="footer-link">Analytics</Link>
            <div style={{ marginTop: 20, background: 'rgba(200,147,39,0.08)', border: '1px solid rgba(200,147,39,0.15)', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, color: '#f0c060', margin: '0 0 4px', letterSpacing: '0.05em' }}>FREE PLAN</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>List up to 3 products at zero cost. No hidden fees.</p>
            </div>
          </div>

          {/* Company links */}
          <div>
            <div className="footer-col-title">Company</div>
            <Link to="#" className="footer-link">Privacy Policy</Link>
            <Link to="#" className="footer-link">Terms of Service</Link>
            <Link to="#" className="footer-link">Disclaimer</Link>
            <Link to="#" className="footer-link">Contact Us</Link>
            <Link to="#" className="footer-link">About</Link>
            <Link to="#" className="footer-link">Blog</Link>

            {/* Trust badge */}
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 9, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 12, padding: '12px 14px' }}>
              <FiShield size={16} color="#93c5fd" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, color: '#93c5fd', margin: '0 0 3px', letterSpacing: '0.04em' }}>VERIFIED PLATFORM</p>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11.5, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>All sellers manually reviewed by our trust team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom bar */}
        <div className="bottom-bar" style={{ paddingBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12.5, color: 'rgba(255,255,255,0.22)', margin: 0 }}>
              © {new Date().getFullYear()} SaaSHub Technologies Pvt. Ltd. · All rights reserved.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,150,50,0.06)', border: '1px solid rgba(255,150,50,0.12)', borderRadius: 8, padding: '6px 12px' }}>
            <span style={{ fontSize: 13 }}>⚠️</span>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11.5, color: 'rgba(255,255,255,0.28)', margin: 0, lineHeight: 1.4, maxWidth: 480 }}>
              Disclaimer: SaaSHub facilitates introductions only. We do not verify product claims or handle transactions. Always conduct independent due diligence before any purchase.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <Link key={l} to="#" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}