import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import DisclaimerBox from '../../components/common/DisclaimerBox';
import { FiCheckCircle } from 'react-icons/fi';

const STEPS = ['Account', 'Company', 'Review'];

export default function RegisterSellerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '',
    company: {
      legalName: '', gstNumber: '', cinNumber: '', businessPAN: '',
      registeredAddress: '', officialEmail: '', website: '',
      signatoryName: '', signatoryDesignation: '', linkedinPage: '',
    }
  });

  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const setC = (k, v) => setForm(p => ({...p, company: {...p.company, [k]: v}}));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register/seller', form);
      toast.success('Seller account created! Verify your email and await approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">S</span></div>
          <span className="font-bold text-xl text-ink-900">SaaSHub</span>
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s,i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-sm font-medium ${i === step ? 'text-brand-600' : i < step ? 'text-brand-500' : 'text-ink-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-brand-100 text-brand-600' : 'bg-ink-100 text-ink-500'}`}>
                  {i < step ? <FiCheckCircle size={12}/> : i+1}
                </div>
                {s}
              </div>
              {i < STEPS.length-1 && <div className="flex-1 h-px bg-ink-200" />}
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-900 mb-4">Account credentials</h2>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Official company email <span className="text-red-500">*</span></label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" placeholder="you@yourcompany.com" required />
              <p className="text-xs text-ink-500 mt-1">Gmail, Yahoo and personal emails are not accepted</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Password <span className="text-red-500">*</span></label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className="input-field" placeholder="Minimum 8 characters" required />
            </div>
            <button onClick={() => { if (!form.email || !form.password) return toast.error('Fill all fields'); setStep(1); }} className="btn-primary w-full justify-center py-3">Continue</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-900 mb-4">Company details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['legalName','Legal company name','text',true],
                ['gstNumber','GST number','text',true],
                ['cinNumber','CIN / MCA number','text',false],
                ['businessPAN','Business PAN','text',false],
                ['signatoryName','Authorized signatory name','text',true],
                ['signatoryDesignation','Designation','text',true],
                ['website','Company website','url',false],
                ['linkedinPage','LinkedIn company page','url',false],
              ].map(([k,label,type,required]) => (
                <div key={k} className={k === 'legalName' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">{label}{required && <span className="text-red-500">*</span>}</label>
                  <input type={type} value={form.company[k]} onChange={e => setC(k, e.target.value)} className="input-field" required={required} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Registered office address <span className="text-red-500">*</span></label>
                <textarea rows={2} value={form.company.registeredAddress} onChange={e => setC('registeredAddress', e.target.value)} className="input-field resize-none" required />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">Back</button>
              <button onClick={() => {
                const { legalName, gstNumber, signatoryName, signatoryDesignation, registeredAddress } = form.company;
                if (!legalName || !gstNumber || !signatoryName || !signatoryDesignation || !registeredAddress) return toast.error('Fill all required fields');
                setStep(2);
              }} className="btn-primary flex-1 justify-center">Review</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ink-900 mb-4">Review & submit</h2>
            <div className="bg-ink-50 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Email</span><span className="font-medium">{form.email}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Company</span><span className="font-medium">{form.company.legalName}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">GST</span><span className="font-medium">{form.company.gstNumber}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Signatory</span><span className="font-medium">{form.company.signatoryName}</span></div>
            </div>
            <DisclaimerBox type="seller" />
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
              ℹ️ After registration, our team will review your company documents within 1–2 business days before your account is approved to list products.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">Back</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Submitting...' : 'Create Seller Account'}</button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-ink-500">Already have an account? <Link to="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}
