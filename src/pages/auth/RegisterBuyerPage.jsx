import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function RegisterBuyerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register/buyer', form);
      toast.success('Account created! Please check your email to verify.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">S</span></div>
          <span className="font-bold text-xl text-ink-900">SaaSHub</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1">Create buyer account</h1>
        <p className="text-ink-500 text-sm mb-6">Browse and contact SaaS sellers for free</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name','text','Full name'],['email','email','you@company.com'],['password','password','Min 8 characters']].map(([k,t,ph]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-ink-700 mb-1.5 capitalize">{k}</label>
              <input type={t} value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} className="input-field" placeholder={ph} required />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-ink-500">Already have an account? <Link to="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}
