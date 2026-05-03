import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { FiEye, FiMessageSquare, FiStar, FiPlus, FiEdit2, FiPause, FiPlay, FiTrash2, FiAlertCircle, FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  active: { label: 'Active', cls: 'badge-green' },
  draft: { label: 'Draft', cls: 'badge-gray' },
  paused: { label: 'Paused', cls: 'badge-amber' },
  pending_review: { label: 'Under Review', cls: 'badge-navy' },
  rejected: { label: 'Rejected', cls: 'badge-red' },
};

function StatCard({ label, value, icon, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <span className="text-[var(--text-muted)]">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-[var(--navy)]" >{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
    </div>
  );
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const { feeFor } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/seller/dashboard').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetch, []);

  const toggleStatus = async (id) => {
    try { await api.patch(`/listings/${id}/toggle`); fetch(); toast.success('Status updated'); } catch { toast.error('Failed'); }
  };
  const deleteListing = async (id) => {
    if (!confirm('Delete this listing permanently?')) return;
    try { await api.delete(`/listings/${id}`); fetch(); toast.success('Listing deleted'); } catch { toast.error('Failed'); }
  };

  const { stats = {}, listings = [] } = data || {};
  const approvalStatus = user?.company?.verificationStatus;
  const used = stats.listingsUsed || 0;
  const quota = stats.freeQuota || 3;

  return (
    <SidebarLayout role="seller" title="Dashboard" subtitle={user?.company?.legalName}>
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Verification banner */}
          {approvalStatus === 'pending' && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6 border" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
              <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#92400e' }}>Account pending approval</p>
                <p className="text-xs mt-0.5" style={{ color: '#b45309' }}>Our team is reviewing your company details. You can create listings but they won't go live until your account is approved (typically 1–2 business days).</p>
              </div>
            </div>
          )}
          {approvalStatus === 'rejected' && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6 border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
              <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-700">Account verification rejected</p>
                <p className="text-xs mt-0.5 text-red-600">Please contact support with updated documents. Reason: {user?.company?.verificationNotes || 'See email for details.'}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Views" value={stats.totalViews || 0} icon={<FiEye size={15} />} />
            <StatCard label="Inquiries" value={stats.totalInquiries || 0} icon={<FiMessageSquare size={15} />} sub={stats.unreadThreads ? `${stats.unreadThreads} unread` : null} />
            <StatCard label="Avg Rating" value={stats.avgRating || '—'} icon={<FiStar size={15} />} sub={`${stats.totalReviews || 0} reviews`} />
            <StatCard label="Active Listings" value={`${stats.activeListings || 0}/${stats.totalListings || 0}`} icon={<FiTrendingUp size={15} />} />
          </div>

          {/* Quota card */}
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-[var(--navy)]">Listing Quota</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">First {quota} listings are always free</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--navy)]" >{used}<span className="text-base text-[var(--text-muted)] font-normal">/{quota}</span></p>
                {used >= quota && <p className="text-xs text-[var(--gold)] font-medium">{feeFor(1000) || '~$12'} / next listing</p>}
              </div>
            </div>
            <div className="w-full rounded-full h-1.5 bg-gray-100">
              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (used/quota)*100)}%`, background: used >= quota ? 'var(--gold)' : 'var(--navy)' }} />
            </div>
          </div>

          {/* Listings table */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="font-semibold text-[var(--navy)]">Your Listings</h2>
              <Link to="/seller/listings/new" className="btn-primary text-sm py-2"><FiPlus size={13} />New Listing</Link>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl mx-auto mb-4">📦</div>
                <p className="font-medium text-[var(--navy)] mb-1">No listings yet</p>
                <p className="text-sm text-[var(--text-muted)] mb-5">Create your first product listing to start receiving inquiries from buyers.</p>
                <Link to="/seller/listings/new" className="btn-primary text-sm"><FiPlus size={13} />Create First Listing</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Inquiries</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map(l => {
                      const status = STATUS_CONFIG[l.status] || STATUS_CONFIG.draft;
                      return (
                        <tr key={l._id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                                {l.logo ? <img src={l.logo} alt="" className="w-full h-full object-cover" /> : <span className="font-bold text-sm text-[var(--navy)]">{l.productName?.[0]}</span>}
                              </div>
                              <div>
                                <p className="font-medium text-[var(--navy)] text-sm">{l.productName}</p>
                                <p className="text-xs text-[var(--text-muted)]">{l.category}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${l.listingType === 'whitelabel' ? 'badge-gold' : 'badge-navy'}`}>
                              {l.listingType === 'whitelabel' ? 'White-Label' : 'SaaS'}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              <span className={`status-dot ${l.status === 'active' ? 'status-active' : l.status === 'pending_review' ? 'status-pending' : l.status === 'rejected' ? 'status-rejected' : 'status-draft'}`} />
                              <span className="text-xs font-medium text-[var(--text-secondary)]">{status.label}</span>
                            </div>
                          </td>
                          <td className="font-mono text-sm">{l.viewCount}</td>
                          <td className="font-mono text-sm">{l.inquiryCount}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <Link to={`/listings/${l.slug}`} title="View" className="p-1.5 text-[var(--text-muted)] hover:text-[var(--navy)] hover:bg-gray-50 rounded-lg transition-colors"><FiExternalLink size={13} /></Link>
                              <Link to={`/seller/listings/${l._id}/edit`} title="Edit" className="p-1.5 text-[var(--text-muted)] hover:text-[var(--navy)] hover:bg-gray-50 rounded-lg transition-colors"><FiEdit2 size={13} /></Link>
                              <button onClick={() => toggleStatus(l._id)} title={l.status === 'active' ? 'Pause' : 'Resume'} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--navy)] hover:bg-gray-50 rounded-lg transition-colors">
                                {l.status === 'active' ? <FiPause size={13} /> : <FiPlay size={13} />}
                              </button>
                              <button onClick={() => deleteListing(l._id)} title="Delete" className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </SidebarLayout>
  );
}