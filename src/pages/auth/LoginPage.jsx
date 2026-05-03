import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/listings');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <SEO
        title="Sign In to SaaSHub"
        description="Sign in to your SaaSHub account. Manage your SaaS listings, track B2B leads, browse India's top white-label software products, and contact verified vendors directly."
        keywords="SaaSHub login, SaaS marketplace login India, seller dashboard login, software marketplace sign in"
        url="/login"
        noindex
      />
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">S</span></div>
          <span className="font-bold text-xl text-ink-900">SaaSHub</span>
        </Link>
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Welcome back</h1>
        <p className="text-ink-500 text-sm mb-6">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} className="input-field" placeholder="you@company.com" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-ink-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
            </div>
            <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} className="input-field" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="mt-6 text-center text-sm text-ink-500">
          <p>Don't have an account?</p>
          <div className="flex gap-3 justify-center mt-2">
            <Link to="/register/buyer" className="text-brand-600 hover:underline font-medium">Join as Buyer</Link>
            <span>·</span>
            <Link to="/register/seller" className="text-brand-600 hover:underline font-medium">List your SaaS</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
