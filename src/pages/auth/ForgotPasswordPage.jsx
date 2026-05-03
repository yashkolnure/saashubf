import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/auth/forgot-password', { email }); setSent(true); } catch { toast.error('Error sending reset link'); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <SEO title="Reset Password | SaaSHub" description="Reset your SaaSHub account password to regain access to your seller or buyer dashboard." noindex />
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8"><div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">S</span></div><span className="font-bold text-xl text-ink-900">SaaSHub</span></Link>
        {sent ? (
          <div className="text-center"><p className="text-4xl mb-4">📬</p><h2 className="text-xl font-bold mb-2">Check your email</h2><p className="text-ink-500 text-sm mb-4">If an account exists for {email}, we sent a reset link.</p><Link to="/login" className="btn-primary">Back to login</Link></div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-1">Reset password</h1>
            <p className="text-ink-500 text-sm mb-6">Enter your email and we'll send a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@company.com" required />
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">{loading ? 'Sending...' : 'Send reset link'}</button>
            </form>
            <p className="mt-4 text-center text-sm"><Link to="/login" className="text-brand-600 hover:underline">Back to login</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
