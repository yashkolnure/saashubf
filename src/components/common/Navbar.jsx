import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CurrencySelector from './CurrencySelector';
import { FiChevronDown, FiLogOut, FiGrid, FiMessageSquare, FiPlus, FiBarChart2, FiShield, FiZap, FiSearch, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  const sellerLinks = [
    { to: '/seller/dashboard', icon: <FiGrid size={14} />, label: 'Dashboard' },
    { to: '/seller/listings/new', icon: <FiPlus size={14} />, label: 'New Listing' },
    { to: '/seller/inbox', icon: <FiMessageSquare size={14} />, label: 'Inbox' },
    { to: '/seller/analytics', icon: <FiBarChart2 size={14} />, label: 'Analytics' },
  ];
  const buyerLinks = [
    { to: '/buyer/dashboard', icon: <FiGrid size={14} />, label: 'Dashboard' },
    { to: '/buyer/inbox', icon: <FiMessageSquare size={14} />, label: 'My Inquiries' },
  ];
  const adminLinks = [
    { to: '/admin/dashboard', icon: <FiShield size={14} />, label: 'Admin Panel' },
  ];
  const navLinks = user?.role === 'seller' ? sellerLinks : user?.role === 'admin' ? adminLinks : buyerLinks;

  const NAV_ITEMS = [
    { to: '/', label: 'Home', exact: true, match: '/' },
    { to: '/listings', label: 'Browse', match: '/listings' },
    { to: '/blog', label: 'Blog', match: '/blog' },
    { to: '/register/seller', label: 'Sell Software', exact: true, match: '/register/seller' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        /* Floating island wrapper — fixed so the hero extends to top of viewport */
        .nav-island-wrap {
          position: fixed;
          top: 14px;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 0 16px;
          pointer-events: none;
          transition: top 0.3s ease;
        }
        .nav-island-wrap.scrolled { top: 10px; }
        .nav-island { pointer-events: auto; }

        /* The island itself */
        .nav-island {
          max-width: 1180px;
          margin: 0 auto;
          background: rgba(10, 14, 32, 0.72);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 8px 8px 8px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.05) inset,
            0 12px 40px rgba(0,0,0,0.35),
            0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          height: 60px;
        }
        .nav-island.scrolled {
          background: rgba(8, 12, 28, 0.85);
          border-color: rgba(255,255,255,0.1);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 18px 50px rgba(0,0,0,0.45),
            0 4px 12px rgba(0,0,0,0.25);
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-mark {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: linear-gradient(135deg, #c89327 0%, #f0c060 50%, #c89327 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 18px rgba(200,147,39,0.45), 0 0 36px rgba(200,147,39,0.18);
          animation: logoPulse 3s ease-in-out infinite;
          position: relative;
        }
        .nav-logo-mark::before {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 8px;
          background: linear-gradient(135deg, #c89327 0%, #f0c060 50%, #c89327 100%);
        }
        .nav-logo-mark > svg { position: relative; z-index: 1; }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 18px rgba(200,147,39,0.45), 0 0 36px rgba(200,147,39,0.18); }
          50% { box-shadow: 0 0 26px rgba(200,147,39,0.65), 0 0 52px rgba(200,147,39,0.3); }
        }

        /* Center nav pills */
        .nav-center {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 99px;
          padding: 4px;
        }
        .nav-pill {
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          padding: 8px 16px;
          border-radius: 99px;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          text-decoration: none;
          position: relative;
        }
        .nav-pill:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .nav-pill.active {
          color: #0a0e20;
          background: linear-gradient(135deg, #f0c060 0%, #c89327 100%);
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(200,147,39,0.4);
        }

        /* Right side */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-island-ghost {
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          padding: 9px 16px;
          border-radius: 14px;
          border: 1px solid transparent;
          background: transparent;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .btn-island-ghost:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.1);
        }

        .btn-island-primary {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 13px;
          background: linear-gradient(135deg, #c89327, #f0c060);
          color: #0a0e20;
          padding: 9px 18px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: all 0.25s ease;
          box-shadow: 0 4px 18px rgba(200,147,39,0.4), 0 1px 0 rgba(255,255,255,0.4) inset;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .btn-island-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(200,147,39,0.55), 0 1px 0 rgba(255,255,255,0.4) inset;
        }

        /* User chip */
        .user-chip {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 4px 12px 4px 4px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .user-chip:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c89327, #f0c060);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #0a0e20;
        }

        /* Dropdown */
        .dropdown-island {
          position: absolute;
          right: 0;
          top: calc(100% + 12px);
          width: 240px;
          background: rgba(12, 16, 36, 0.92);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset;
          z-index: 200;
          animation: dropIn 0.2s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .drop-header {
          padding: 10px 12px 12px;
          margin-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .drop-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: all 0.15s ease;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .drop-item:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .drop-item.danger { color: rgba(255,120,120,0.85); }
        .drop-item.danger:hover { background: rgba(255,80,80,0.1); color: #ff7878; }
        .drop-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 6px 4px; }

        /* Hamburger */
        .hamburger-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: none;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hamburger-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.16);
        }

        /* Mobile sheet */
        .mobile-backdrop {
          position: fixed; inset: 0;
          background: rgba(5,8,18,0.7);
          backdrop-filter: blur(8px);
          z-index: 90;
          animation: fadeIn 0.2s ease;
        }
        .mobile-sheet {
          position: fixed;
          top: 16px; right: 16px; left: 16px;
          background: rgba(10,14,32,0.96);
          backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 22px;
          padding: 18px;
          z-index: 91;
          animation: sheetDrop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          max-height: calc(100vh - 32px);
          overflow-y: auto;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetDrop {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 14px;
          border-radius: 13px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          transition: all 0.18s;
        }
        .mobile-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .mobile-link.active {
          background: linear-gradient(135deg, rgba(240,192,96,0.15), rgba(200,147,39,0.1));
          color: #f0c060;
          border: 1px solid rgba(240,192,96,0.2);
        }

        /* Responsive */
        @media (max-width: 920px) {
          .nav-center { display: none !important; }
        }
        @media (max-width: 640px) {
          .nav-island-wrap { padding: 0 12px; }
          .nav-island {
            padding: 8px 8px 8px 16px;
            border-radius: 18px;
            height: 56px;
          }
          .desktop-only { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .nav-logo-text { display: none !important; }
        }
      `}</style>

      <div className={`nav-island-wrap ${scrolled ? 'scrolled' : ''}`}>
        <nav className={`nav-island ${scrolled ? 'scrolled' : ''}`}>

          {/* ── Logo ── */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-mark">
              <FiZap size={15} color="#0a0e20" strokeWidth={3} style={{ position: 'relative', zIndex: 2 }} />
            </div>
            <div className="nav-logo-text" style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>SaaS</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg, #c89327, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Hub</span>
            </div>
          </Link>

          {/* ── Center nav pills ── */}
          <div className="nav-center">
            {NAV_ITEMS.map(item => {
              const active = item.exact
                ? location.pathname === item.match
                : location.pathname.startsWith(item.match);
              return (
                <Link key={item.to} to={item.to} className={`nav-pill ${active ? 'active' : ''}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ── Right side ── */}
          <div className="nav-right">
            <div className="desktop-only"><CurrencySelector dark={true} /></div>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-island-ghost desktop-only">Sign in</Link>
                <Link to="/register/seller" className="btn-island-primary desktop-only">
                  <FiZap size={12} /> List Software
                </Link>
              </>
            ) : (
              <div style={{ position: 'relative' }} ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)} className="user-chip">
                  <div className="avatar">{(user?.name || user?.email)?.[0]?.toUpperCase()}</div>
                  <div className="desktop-only" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{user?.name || 'Account'}</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize', lineHeight: 1.2, marginTop: 1 }}>{user?.role}</span>
                  </div>
                  <FiChevronDown size={13} color="rgba(255,255,255,0.5)" className="desktop-only" style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropOpen && (
                  <div className="dropdown-island">
                    <div className="drop-header">
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>{user?.name || 'Account'}</p>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11.5, color: 'rgba(255,255,255,0.45)', margin: '3px 0 0', textTransform: 'capitalize' }}>{user?.role} · {user?.email}</p>
                    </div>
                    {navLinks.map(({ to, icon, label }) => (
                      <Link key={to} to={to} onClick={() => setDropOpen(false)} className="drop-item">
                        {icon}{label}
                      </Link>
                    ))}
                    <div className="drop-divider" />
                    <button onClick={handleLogout} className="drop-item danger">
                      <FiLogOut size={13} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(true)} className="hamburger-btn">
              <FiMenu size={18} />
            </button>
          </div>
        </nav>
      </div>

      {/* ── MOBILE SHEET ── */}
      {mobileOpen && (
        <>
          <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="mobile-sheet">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Link to="/" onClick={() => setMobileOpen(false)} className="nav-logo">
                <div className="nav-logo-mark"><FiZap size={15} color="#0a0e20" strokeWidth={3} style={{ position: 'relative', zIndex: 2 }} /></div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>SaaS</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg, #c89327, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hub</span>
                </div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="hamburger-btn" style={{ display: 'flex' }}>
                <FiX size={18} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Browse</p>
              {NAV_ITEMS.map(item => {
                const active = item.exact
                  ? location.pathname === item.match
                  : location.pathname.startsWith(item.match);
                return (
                  <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={`mobile-link ${active ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Currency picker in mobile sheet */}
            <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Currency</p>
              <CurrencySelector dark={true} />
            </div>

            {!isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-island-ghost" style={{ justifyContent: 'center', padding: 13, border: '1px solid rgba(255,255,255,0.1)' }}>Sign in</Link>
                <Link to="/register/seller" onClick={() => setMobileOpen(false)} className="btn-island-primary" style={{ justifyContent: 'center', padding: 13 }}>
                  <FiZap size={13} /> List Your Software
                </Link>
              </div>
            ) : (
              <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
                  {user?.name || user?.role || 'Account'}
                </p>
                {navLinks.map(({ to, icon, label }) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="mobile-link">{icon}{label}</Link>
                ))}
                <button onClick={handleLogout} className="mobile-link" style={{ color: 'rgba(255,120,120,0.85)', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <FiLogOut size={14} />Sign out
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
