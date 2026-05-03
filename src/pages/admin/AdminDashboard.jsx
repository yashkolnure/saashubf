import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import { FiUsers, FiList, FiMessageSquare, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: accent + '18', color: accent }}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-[var(--navy)]" >{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(r => setData(r.data)).catch(() => {}); }, []);
  const { stats = {}, recentSellers = [], recentListings = [] } = data || {};

  const STATUS_ICON = { approved: <FiCheckCircle size={13} className="text-green-500"/>, pending: <FiClock size={13} className="text-amber-500"/>, rejected: <FiAlertCircle size={13} className="text-red-500"/> };

  return (
    <SidebarLayout role="admin" title="Admin Overview" subtitle="Platform management and moderation">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Sellers" value={stats.totalSellers || 0} icon={<FiUsers size={15}/>} accent="#0f2443" />
        <StatCard label="Pending Review" value={stats.pendingSellers || 0} icon={<FiClock size={15}/>} accent="#d68910" sub="Awaiting verification" />
        <StatCard label="Active Listings" value={stats.activeListings || 0} icon={<FiList size={15}/>} accent="#1a7a4a" sub={`of ${stats.totalListings || 0} total`} />
        <StatCard label="Total Threads" value={stats.totalThreads || 0} icon={<FiMessageSquare size={15}/>} accent="#2a5298" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pending sellers */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div>
              <h2 className="font-semibold text-[var(--navy)] text-sm">Recent Seller Registrations</h2>
              {stats.pendingSellers > 0 && <p className="text-xs text-amber-600 mt-0.5">{stats.pendingSellers} pending verification</p>}
            </div>
            <Link to="/admin/sellers" className="text-xs font-medium text-[var(--navy)] hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentSellers.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] p-5">No recent registrations</p>
            ) : recentSellers.map(s => (
              <Link to={`/admin/sellers/${s._id}`} key={s._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: 'var(--navy)' }}>
                  {s.company?.legalName?.[0] || s.email?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--navy)] truncate">{s.company?.legalName || 'Unknown Company'}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{s.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {STATUS_ICON[s.company?.verificationStatus] || STATUS_ICON.pending}
                  <span className="text-xs capitalize text-[var(--text-muted)]">{s.company?.verificationStatus || 'pending'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Listings under review */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <div>
              <h2 className="font-semibold text-[var(--navy)] text-sm">Listings Pending Review</h2>
            </div>
            <Link to="/admin/listings" className="text-xs font-medium text-[var(--navy)] hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentListings.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] p-5">No listings pending review</p>
            ) : recentListings.map(l => (
              <Link to={`/admin/listings`} key={l._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold bg-gray-100 flex-shrink-0">
                  {l.productName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--navy)] truncate">{l.productName}</p>
                  <p className="text-xs text-[var(--text-muted)]">{l.seller?.company?.legalName}</p>
                </div>
                <span className="text-xs text-amber-600 flex-shrink-0 flex items-center gap-1"><FiClock size={11}/>Review</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}