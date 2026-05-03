import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import { FiMessageSquare, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function SellerInboxPage() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/threads').then(r => { setThreads(r.data.threads); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <SidebarLayout title="Inbox" subtitle="Buyer inquiries and conversations">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <div className="card p-12 text-center max-w-md mx-auto">
          <p className="text-4xl mb-3">📬</p>
          <p className="font-medium text-[var(--navy)]">No inquiries yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Buyer inquiries will appear here once your listings go live</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {threads.map(t => {
            const lastMsg = t.messages?.[t.messages.length - 1];
            const unread = t.messages?.some(m => !m.isRead && m.receiver?.toString() !== t.seller?._id?.toString());
            return (
              <Link key={t._id} to={`/messages/${t._id}`}
                className={`card p-5 flex items-start gap-4 hover:shadow-md transition-all ${unread ? 'border-[var(--gold)] bg-amber-50/30' : ''}`}>
                <div className="w-10 h-10 bg-[var(--cream)] rounded-full flex items-center justify-center font-bold text-[var(--navy)] flex-shrink-0">
                  {t.buyer?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-[var(--navy)] text-sm">{t.buyerCompanyName || t.buyer?.name}</p>
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <FiClock size={10} />{formatDistanceToNow(new Date(t.lastMessage), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Re: {t.listing?.productName}</p>
                  <p className="text-sm text-[var(--text-secondary)] truncate">{lastMsg?.content}</p>
                </div>
                {unread && <div className="w-2.5 h-2.5 bg-[var(--gold)] rounded-full flex-shrink-0 mt-1" />}
              </Link>
            );
          })}
        </div>
      )}
    </SidebarLayout>
  );
}
