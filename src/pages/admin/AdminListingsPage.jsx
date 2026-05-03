import React, { useEffect, useState } from 'react';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiLink, FiCheckCircle, FiXCircle, FiEyeOff } from 'react-icons/fi';

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('pending_review');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');

  const fetchListings = (s = filter) => {
    setLoading(true);
    api.get(`/admin/listings?status=${s}`).then(r => { setListings(r.data.listings); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchListings(filter); }, [filter]);

  const updateStatus = async (id, status) => {
    setActing(id + status);
    try {
      await api.patch(`/admin/listings/${id}/status`, { status });
      toast.success(`Listing ${status.replace('_', ' ')}`);
      fetchListings();
    } catch { toast.error('Action failed'); } finally { setActing(''); }
  };

  return (
    <SidebarLayout role="admin" title="Listing Moderation" subtitle="Review and approve product listings">
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {[['pending_review','Pending Review'],['active','Active'],['rejected','Rejected'],['paused','Paused']].map(([s,l]) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === s ? 'bg-white shadow text-[var(--navy)]' : 'text-[var(--text-muted)] hover:text-[var(--navy)]'}`}>{l}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-14"><div className="w-7 h-7 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin"/></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-14 text-[var(--text-muted)]"><p className="text-sm">No listings in this category</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Product</th><th>Seller</th><th>Type</th><th>Category</th><th>Views</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-sm text-[var(--navy)] flex-shrink-0 overflow-hidden">
                        {l.logo ? <img src={l.logo} className="w-full h-full object-cover" alt=""/> : l.productName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--navy)]">{l.productName}</p>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-xs">{l.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs">{l.seller?.company?.legalName || l.seller?.email}</td>
                  <td><span className={`badge text-xs ${l.listingType === 'whitelabel' ? 'badge-gold' : 'badge-navy'}`}>{l.listingType === 'whitelabel' ? 'White-Label' : 'SaaS'}</span></td>
                  <td className="text-xs text-[var(--text-muted)]">{l.category}</td>
                  <td className="font-mono text-sm">{l.viewCount}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <a href={`/listings/${l.slug}`} target="_blank" rel="noreferrer" title="View listing" className="p-1.5 text-[var(--text-muted)] hover:text-[var(--navy)] hover:bg-gray-50 rounded-lg transition-colors"><FiLink size={13}/></a>
                      {filter !== 'active' && (
                        <button onClick={() => updateStatus(l._id, 'active')} disabled={!!acting} title="Approve" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-40"><FiCheckCircle size={14}/></button>
                      )}
                      {filter !== 'rejected' && (
                        <button onClick={() => updateStatus(l._id, 'rejected')} disabled={!!acting} title="Reject" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"><FiXCircle size={14}/></button>
                      )}
                      {filter === 'active' && (
                        <button onClick={() => updateStatus(l._id, 'paused')} disabled={!!acting} title="Pause" className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-40"><FiEyeOff size={14}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SidebarLayout>
  );
}
