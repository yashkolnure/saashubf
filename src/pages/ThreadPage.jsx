import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import DisclaimerBox from '../components/common/DisclaimerBox';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiAlertTriangle, FiExternalLink } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function ThreadPage() {
  const { threadId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [reporting, setReporting] = useState(false);
  const bottomRef = useRef(null);

  const fetchThread = async () => {
    try {
      const { data } = await api.get(`/messages/${threadId}`);
      setThread(data.thread);
    } catch (err) {
      toast.error('Failed to load conversation');
    }
  };

  useEffect(() => { fetchThread(); }, [threadId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread?.messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.post(`/messages/${threadId}/reply`, { content: reply });
      setReply('');
      fetchThread();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Message blocked or failed to send');
    } finally { setSending(false); }
  };

  const reportThread = async () => {
    const reason = prompt('Reason for reporting this conversation:');
    if (!reason) return;
    setReporting(true);
    try {
      await api.post(`/messages/${threadId}/report`, { reason });
      toast.success('Reported. Our team will review within 48 hours.');
    } catch { toast.error('Failed to report'); } finally { setReporting(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } };

  if (!thread) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
    </div>
  );

  const isMe = (senderId) => senderId?._id === user?._id || senderId === user?._id;

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col">

        {/* Thread header */}
        <div className="card p-4 mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ink-100 rounded-xl flex items-center justify-center font-bold text-ink-500 flex-shrink-0">
              {thread.listing?.productName?.[0]}
            </div>
            <div>
              <p className="font-semibold text-ink-900 text-sm">{thread.listing?.productName}</p>
              <Link to={`/listings/${thread.listing?.slug}`} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                View listing <FiExternalLink size={10} />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reportThread} disabled={reporting} title="Report conversation" className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <FiAlertTriangle size={16} />
            </button>
          </div>
        </div>

        {/* Inquiry context */}
        {thread.buyerUseCase && (
          <div className="bg-ink-50 border border-ink-200 rounded-2xl p-4 mb-4 text-sm">
            <p className="font-medium text-ink-700 mb-2">Inquiry context</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-ink-600">
              {thread.buyerCompanyName && <div><span className="text-ink-400">Company: </span>{thread.buyerCompanyName}</div>}
              {thread.buyerCompanySize && <div><span className="text-ink-400">Size: </span>{thread.buyerCompanySize}</div>}
              {thread.buyerUseCase && <div className="col-span-2"><span className="text-ink-400">Use case: </span>{thread.buyerUseCase}</div>}
              {thread.buyerBudgetRange && <div><span className="text-ink-400">Budget: </span>{thread.buyerBudgetRange}</div>}
            </div>
          </div>
        )}

        <DisclaimerBox type="message" />

        {/* Messages */}
        <div className="flex-1 space-y-4 mt-4 overflow-y-auto max-h-[50vh] pr-1">
          {thread.messages.map((msg, i) => {
            const mine = isMe(msg.sender);
            return (
              <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white border border-ink-200 text-ink-800 rounded-bl-sm'}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1.5 ${mine ? 'text-brand-200' : 'text-ink-400'}`}>
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Fraud notice for early messages */}
        {thread.messages.length < 3 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700 flex items-center gap-2">
            <FiAlertTriangle size={12} />
            Phone numbers and external links are blocked in the first 3 messages for your safety.
          </div>
        )}

        {/* Reply box */}
        <div className="mt-4 card p-3 flex items-end gap-3">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="flex-1 resize-none border-0 outline-none text-sm text-ink-800 bg-transparent leading-relaxed max-h-32"
            rows={2}
          />
          <button onClick={sendReply} disabled={sending || !reply.trim()} className="btn-primary p-3 rounded-xl flex-shrink-0 disabled:opacity-40">
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
