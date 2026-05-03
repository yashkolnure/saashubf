import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiPlus, FiMessageSquare, FiBarChart2,
  FiShield, FiUsers, FiList, FiLogOut, FiSettings,
  FiZap, FiUser, FiChevronDown, FiHome, FiBookOpen,
} from 'react-icons/fi';

const SELLER_NAV = [
  { to: '/seller/dashboard',   icon: <FiGrid size={15} />,         label: 'Dashboard' },
  { to: '/seller/listings/new',icon: <FiPlus size={15} />,         label: 'New Listing' },
  { to: '/seller/inbox',       icon: <FiMessageSquare size={15} />,label: 'Inbox' },
  { to: '/seller/analytics',   icon: <FiBarChart2 size={15} />,    label: 'Analytics' },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard', icon: <FiShield size={15} />,   label: 'Overview' },
  { to: '/admin/sellers',   icon: <FiUsers size={15} />,    label: 'Sellers' },
  { to: '/admin/listings',  icon: <FiList size={15} />,     label: 'Listings' },
  { to: '/admin/blog',      icon: <FiBookOpen size={15} />, label: 'Blog' },
];

export default function SidebarLayout({ children, role = 'seller', title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = role === 'admin' ? ADMIN_NAV : SELLER_NAV;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (user?.name || user?.email || '?')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className="w-56 flex-shrink-0 hidden lg:flex flex-col bg-white border-r border-[var(--border)] min-h-screen"
        style={{ boxShadow: '4px 0 24px rgba(15,36,67,0.04)', position: 'sticky', top: 0, height: '100vh' }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[var(--border)] flex items-center gap-2.5">
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg, #c89327 0%, #f0c060 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(200,147,39,0.4)',
            flexShrink: 0,
          }}>
            <FiZap size={14} color="#0a0e20" strokeWidth={3} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--navy)', letterSpacing: '-0.02em' }}>SaaS</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg, #c89327, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>Hub</span>
          </div>
        </div>

        {/* Portal label */}
        <div className="px-5 pt-4 pb-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {role === 'admin' ? 'Admin Panel' : 'Seller Portal'}
          </p>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-2 flex-1">
          {navItems.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={`sidebar-link mb-0.5 ${isActive(to) ? 'active' : ''}`}>
              {icon}{label}
            </Link>
          ))}

          <div className="my-3 border-t border-[var(--border)]" />

          <Link to="/" className="sidebar-link mb-0.5">
            <FiHome size={15} /> Back to Marketplace
          </Link>
        </nav>

        {/* User profile footer */}
        <div className="border-t border-[var(--border)] p-3">
          {/* Profile toggle button */}
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--cream)] transition-all text-left"
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #c89327, #f0c060)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#0a0e20',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="text-xs font-semibold text-[var(--navy)] truncate leading-tight">{user?.name || 'Account'}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate leading-tight capitalize">{user?.role}</p>
            </div>
            <FiChevronDown
              size={13}
              className="text-[var(--text-muted)] flex-shrink-0 transition-transform"
              style={{ transform: profileOpen ? 'rotate(180deg)' : 'none' }}
            />
          </button>

          {/* Expanded profile menu */}
          {profileOpen && (
            <div className="mt-1 rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--cream)]">
              {/* Email row */}
              <div className="px-3 py-2.5 border-b border-[var(--border)]">
                <p className="text-[10px] text-[var(--text-muted)] leading-tight truncate">{user?.email}</p>
              </div>

              <Link
                to={role === 'seller' ? '/seller/dashboard' : '/admin/dashboard'}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--navy)] hover:bg-white transition-all"
              >
                <FiUser size={12} /> Profile
              </Link>

              <Link
                to={role === 'seller' ? '/seller/settings' : '/admin/settings'}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--navy)] hover:bg-white transition-all"
              >
                <FiSettings size={12} /> Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                <FiLogOut size={12} /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {(title || subtitle) && (
          <div className="bg-white border-b border-[var(--border)] px-6 py-5 flex-shrink-0">
            {title && <h1 className="text-xl font-bold text-[var(--navy)]">{title}</h1>}
            {subtitle && <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
          </div>
        )}
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
