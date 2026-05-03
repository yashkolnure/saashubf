import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiExternalLink, FiShield, FiUser, FiGlobe } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function AdminSellerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    api.get(`/admin/sellers/${id}`).then(r => { setData(r.data); setNotes(r.data.seller.company?.verificationNotes || ''); }).catch(() => navigate('/admin/sellers'));
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(action);
    try {
      await api.patch(`/admin/sellers/${id}/verify`, { action, notes });
      toast.success(`Seller ${action}d successfully`);
      navigate('/admin/sellers');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally { setActionLoading(''); }
  };

  if (!data) return (
    <SidebarLayout role="admin" title="Seller Detail">
      <div className="flex items-center justify-center py-20"><div className="w-7 h-7 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin"/></div>
    </SidebarLayout>
  );

  const { seller, listings } = data;
  const status = seller.company?.verificationStatus || 'pending';
  const isPending = status === 'pending';

  return (
    <SidebarLayout role="admin" title="Seller Verification Review" subtitle={seller.company?.legalName}>
      <div className="max-w-4xl">
        <Link to="/admin/sellers" className="btn-ghost text-sm mb-5 inline-flex"><FiArrowLeft size={13}/>Back to Sellers</Link>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Company details */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h2 className="font-semibold text-[var(--navy)] flex items-center gap-2"><FiShield size={15}/>Company Information</h2>
                <span className={`badge capitalize ${status === 'approved' ? 'badge-green' : status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>{status}</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Legal Company Name', seller.company?.legalName],
                    ['GST Number', seller.company?.gstNumber],
                    ['CIN / MCA Number', seller.company?.cinNumber],
                    ['Business PAN', seller.company?.businessPAN],
                    ['Signatory Name', seller.company?.signatoryName],
                    ['Designation', seller.company?.signatoryDesignation],
                    ['Registered Address', seller.company?.registeredAddress],
                    ['Official Email', seller.email],
                    ['Registered', formatDistanceToNow(new Date(seller.createdAt), { addSuffix: true })],
                    ['Trust Score', `${seller.trustScore}/100`],
                  ].map(([k, v]) => v ? (
                    <div key={k} className={k === 'Registered Address' ? 'col-span-2' : ''}>
                      <p className="text-xs text-[var(--text-muted)] mb-0.5">{k}</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{v}</p>
                    </div>
                  ) : null)}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[var(--border)]">
                  {seller.company?.website && (
                    <a href={seller.company.website} target="_blank" rel="noreferrer" className="btn-outline text-xs py-1.5 px-3 gap-1.5">
                      <FiGlobe size={12}/>Website
                    </a>
                  )}
                  {seller.company?.linkedinPage && (
                    <a href={seller.company.linkedinPage} target="_blank" rel="noreferrer" className="btn-outline text-xs py-1.5 px-3 gap-1.5">
                      <FiExternalLink size={12}/>LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Listings */}
            {listings.length > 0 && (
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)]">
                  <h2 className="font-semibold text-[var(--navy)] flex items-center gap-2"><FiUser size={15}/>Product Listings ({listings.length})</h2>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {listings.map(l => (
                    <div key={l._id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-[var(--navy)] flex-shrink-0">{l.productName?.[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--navy)] truncate">{l.productName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{l.category} · {l.listingType === 'whitelabel' ? 'White-Label' : 'SaaS'}</p>
                      </div>
                      <span className={`badge text-xs ${l.status === 'active' ? 'badge-green' : l.status === 'pending_review' ? 'badge-amber' : 'badge-gray'}`}>{l.status.replace('_',' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verification panel */}
          <div className="space-y-4">
            {/* Verification checklist */}
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--navy)] mb-4 text-sm">Verification Checklist</h3>
              <div className="space-y-2.5">
                {[
                  ['Legal company name', !!seller.company?.legalName],
                  ['GST number provided', !!seller.company?.gstNumber],
                  ['CIN / MCA number', !!seller.company?.cinNumber],
                  ['Business PAN', !!seller.company?.businessPAN],
                  ['Office address', !!seller.company?.registeredAddress],
                  ['Official email (non-personal)', !!seller.email && !['gmail','yahoo','hotmail'].some(d => seller.email.includes(d))],
                  ['Company website', !!seller.company?.website],
                  ['LinkedIn page', !!seller.company?.linkedinPage],
                  ['Signatory details', !!seller.company?.signatoryName],
                ].map(([label, ok]) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm">
                    {ok ? <FiCheckCircle size={14} className="text-green-500 flex-shrink-0"/> : <FiXCircle size={14} className="text-gray-300 flex-shrink-0"/>}
                    <span className={ok ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[var(--text-muted)]">Completeness</span>
                  <span className="font-semibold text-[var(--navy)]">{seller.trustScore || 0}/100</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div className="h-1.5 rounded-full" style={{ width: `${seller.trustScore || 0}%`, background: seller.trustScore >= 70 ? 'var(--success)' : seller.trustScore >= 40 ? 'var(--warning)' : 'var(--danger)' }} />
                </div>
              </div>
            </div>

            {/* Decision panel */}
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--navy)] mb-3 text-sm">Admin Decision</h3>
              <div className="mb-3">
                <label className="field-label text-xs">Notes / Reason (sent to seller)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field resize-none text-sm" rows={4} placeholder="Optional: Reason for approval or rejection, additional verification requirements..." />
              </div>

              {isPending || status === 'rejected' ? (
                <button onClick={() => handleAction('approve')} disabled={!!actionLoading} className="w-full mb-2 inline-flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-lg transition-all text-sm text-white disabled:opacity-50" style={{ background: 'var(--success)', border: '1.5px solid var(--success)' }}>
                  <FiCheckCircle size={14}/>{actionLoading === 'approve' ? 'Approving...' : 'Approve Seller'}
                </button>
              ) : null}

              {isPending || status === 'approved' ? (
                <button onClick={() => handleAction('reject')} disabled={!!actionLoading} className="w-full inline-flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-lg transition-all text-sm disabled:opacity-50" style={{ background: 'white', border: '1.5px solid var(--danger)', color: 'var(--danger)' }}>
                  <FiXCircle size={14}/>{actionLoading === 'reject' ? 'Rejecting...' : 'Reject Seller'}
                </button>
              ) : null}

              {status === 'approved' && (
                <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100 text-xs text-green-700 flex items-center gap-2">
                  <FiCheckCircle size={12}/>Seller is verified. All pending listings auto-activated.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
