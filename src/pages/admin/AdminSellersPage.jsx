import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import { FiSearch, FiCheckCircle, FiXCircle, FiClock, FiEye } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const STATUS_MAP = {
  pending: { label: 'Pending', cls: 'badge-amber', icon: <FiClock size={11}/> },
  approved: { label: 'Approved', cls: 'badge-green', icon: <FiCheckCircle size={11}/> },
  rejected: { label: 'Rejected', cls: 'badge-red', icon: <FiXCircle size={11}/> },
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSellers = (status = filter) => {
    setLoading(true);
    api.get(`/admin/sellers?status=${status}`).then(r => { setSellers(r.data.sellers); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchSellers(filter); }, [filter]);

  const filtered = sellers.filter(s =>
    !search || s.company?.legalName?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarLayout role="admin" title="Seller Management" subtitle="Verify, approve, or reject seller accounts">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15}/>
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by company or email..." />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['pending','approved','rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${filter === s ? 'bg-white shadow text-[var(--navy)]' : 'text-[var(--text-muted)] hover:text-[var(--navy)]'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-14"><div className="w-7 h-7 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin"/></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-[var(--text-muted)]">
            <FiUsers size={28} className="mx-auto mb-3 opacity-30"/>
            <p className="text-sm">No {filter} sellers found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>GST</th>
                <th>Signatory</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const st = STATUS_MAP[s.company?.verificationStatus] || STATUS_MAP.pending;
                return (
                  <tr key={s._id}>
                    <td>
                      <p className="font-semibold text-[var(--navy)] text-sm">{s.company?.legalName || '—'}</p>
                      {s.company?.website && <a href={s.company.website} target="_blank" rel="noreferrer" className="text-xs text-[var(--navy-light)] hover:underline">{s.company.website}</a>}
                    </td>
                    <td className="text-xs">{s.email}</td>
                    <td className="text-xs font-mono">{s.company?.gstNumber || '—'}</td>
                    <td className="text-xs">{s.company?.signatoryName}<br/><span className="text-[var(--text-muted)]">{s.company?.signatoryDesignation}</span></td>
                    <td className="text-xs text-[var(--text-muted)]">{formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</td>
                    <td><span className={`badge ${st.cls} gap-1`}>{st.icon}{st.label}</span></td>
                    <td>
                      <Link to={`/admin/sellers/${s._id}`} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
                        <FiEye size={11}/>Review
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </SidebarLayout>
  );
}
