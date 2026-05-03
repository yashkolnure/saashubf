import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { FiMessageSquare, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function BuyerInboxPage() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/threads').then(r => { setThreads(r.data.threads); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div></div>;

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <h1 className="text-2xl font-bold text-ink-900 mb-6 flex items-center gap-2"><FiMessageSquare />My Inquiries</h1>
        {threads.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium text-ink-700">No inquiries yet</p>
            <p className="text-sm text-ink-500 mt-1 mb-4">Browse listings and ask sellers for pricing</p>
            <Link to="/listings" className="btn-primary inline-flex">Browse Listings</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map(t => {
              const lastMsg = t.messages?.[t.messages.length - 1];
              return (
                <Link key={t._id} to={`/messages/${t._id}`} className="card p-5 flex items-start gap-4 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-ink-100 rounded-xl flex items-center justify-center font-bold text-ink-500 flex-shrink-0 text-sm">
                    {t.listing?.productName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-ink-900 text-sm">{t.listing?.productName}</p>
                      <span className="flex items-center gap-1 text-xs text-ink-400"><FiClock size={10}/>{formatDistanceToNow(new Date(t.lastMessage), { addSuffix: true })}</span>
                    </div>
                    <p className="text-xs text-ink-500 mb-1">Seller: {t.seller?.company?.legalName || t.seller?.email}</p>
                    <p className="text-sm text-ink-600 truncate">{lastMsg?.content}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
