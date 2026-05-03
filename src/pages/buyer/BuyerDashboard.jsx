import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiSearch } from 'react-icons/fi';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  useEffect(() => { api.get('/messages/threads').then(r => setThreads(r.data.threads)).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Welcome, {user?.name}</h1>
        <p className="text-ink-500 text-sm mb-8">Your buyer dashboard</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link to="/listings" className="card p-6 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors"><FiSearch size={22} /></div>
            <div>
              <p className="font-semibold text-ink-900">Browse Software</p>
              <p className="text-sm text-ink-500">Discover new SaaS tools</p>
            </div>
          </Link>
          <Link to="/buyer/inbox" className="card p-6 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors relative">
              <FiMessageSquare size={22} />
              {threads.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">{threads.length}</span>}
            </div>
            <div>
              <p className="font-semibold text-ink-900">My Inquiries</p>
              <p className="text-sm text-ink-500">{threads.length} active conversation{threads.length !== 1 ? 's' : ''}</p>
            </div>
          </Link>
        </div>
        {threads.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-ink-900 mb-4">Recent Conversations</h2>
            <div className="space-y-3">
              {threads.slice(0, 5).map(t => (
                <Link key={t._id} to={`/messages/${t._id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition-colors">
                  <div className="w-9 h-9 bg-ink-100 rounded-xl flex items-center justify-center text-sm font-bold text-ink-500">
                    {t.listing?.productName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{t.listing?.productName}</p>
                    <p className="text-xs text-ink-500 truncate">{t.messages?.[t.messages.length-1]?.content}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
