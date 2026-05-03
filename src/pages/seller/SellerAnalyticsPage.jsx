import React, { useEffect, useState } from 'react';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import { FiEye, FiMessageSquare, FiStar, FiTrendingUp } from 'react-icons/fi';

export default function SellerAnalyticsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/seller/dashboard').then(r => setData(r.data)).catch(() => {}); }, []);
  const { stats, listings } = data || { stats: {}, listings: [] };

  return (
    <SidebarLayout title="Analytics" subtitle="Track your listing performance">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Views',     value: stats.totalViews     || 0,  icon: <FiEye />,         color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Inquiries', value: stats.totalInquiries || 0,  icon: <FiMessageSquare />,color: 'text-brand-600 bg-brand-50' },
          { label: 'Avg Rating',      value: stats.avgRating      || '—',icon: <FiStar />,         color: 'text-amber-600 bg-amber-50' },
          { label: 'Active Listings', value: stats.activeListings || 0,  icon: <FiTrendingUp />,   color: 'text-ink-600 bg-ink-100' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
            <div className="text-2xl font-bold text-[var(--navy)]">{value}</div>
            <div className="text-sm text-[var(--text-muted)]">{label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[var(--navy)] mb-4">Per-listing Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                {['Product', 'Status', 'Views', 'Inquiries', 'Rating', 'Category'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-[var(--text-muted)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {listings.map(l => (
                <tr key={l._id} className="hover:bg-[var(--cream)]">
                  <td className="py-3 pr-4 font-medium text-[var(--navy)]">{l.productName}</td>
                  <td className="py-3 pr-4"><span className={`badge text-xs ${l.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{l.status}</span></td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{l.viewCount}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{l.inquiryCount}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{l.rating || '—'}</td>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">{l.category}</td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-[var(--text-muted)]">No listings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
