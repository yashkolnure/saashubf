import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiUpload, FiImage } from 'react-icons/fi';

// ─── ALL sub-components OUTSIDE the parent to prevent remount on re-render ───

const CATS = [
  'CRM','ERP','HR & Payroll','Marketing Automation','Analytics','Finance','Project Management',
  'Communication','Security','E-Commerce','Customer Support','DevOps','Education','Healthcare',
  'Legal','Logistics','Sales','Design','Accounting',
  'Restaurant Management','Fitness & Gym Management','Booking & Scheduling',
  'AI & Automation','Digital Marketing','Digital Identity','WhatsApp Marketing',
  'Other',
];

const STEPS = [
  { label: 'Product Type', desc: 'White-label or SaaS?' },
  { label: 'Basic Info', desc: 'Name, description, media' },
  { label: 'Pricing', desc: 'Pricing model & terms' },
  { label: 'Technical', desc: 'Deployment & specs' },
  { label: 'Market', desc: 'Target audience & features' },
  { label: 'Support', desc: 'Support & onboarding' },
  { label: 'Review', desc: 'Submit for review' },
];

function StepBar({ step }) {
  return (
    <div className="flex mb-8 border-b border-[var(--border)] overflow-x-auto">
      {STEPS.map((s, i) => (
        <div key={s.label} className={`flex-1 min-w-[90px] px-3 py-3 text-center border-b-2 transition-all ${i === step ? 'border-[var(--navy)]' : i < step ? 'border-[var(--gold)]' : 'border-transparent'}`}>
          <div className={`text-xs font-bold mb-0.5 ${i === step ? 'text-[var(--navy)]' : i < step ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>{String(i+1).padStart(2,'0')}</div>
          <div className={`text-xs font-medium ${i === step ? 'text-[var(--navy)]' : i < step ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// Plain field wrapper — no controlled input inside, just label + children slot
function FieldWrap({ label, required, hint, children }) {
  return (
    <div>
      <label className="field-label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function CheckButton({ checked, onChange, label }) {
  return (
    <button type="button" onClick={onChange}
      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all ${checked ? 'border-[var(--navy)] bg-navy-pale text-[var(--navy)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'}`}>
      <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-[var(--navy)] border-[var(--navy)]' : 'border-gray-300'}`}>
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      {label}
    </button>
  );
}

function ImageUpload({ value, onChange, label = 'Upload Image', multiple = false, preview = [] }) {
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => { onChange(reader.result, file.name); };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] rounded-xl p-6 cursor-pointer hover:border-[var(--navy-light)] hover:bg-gray-50 transition-all">
        <FiUpload size={20} className="text-[var(--text-muted)]" />
        <span className="text-sm text-[var(--text-muted)]">Click to upload{multiple ? ' (multiple)' : ''}</span>
        <span className="text-xs text-[var(--text-muted)]">PNG, JPG up to 2MB</span>
        <input type="file" className="hidden" accept="image/*" multiple={multiple} onChange={handleFile} />
      </label>
      {preview.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {preview.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-[var(--border)]" />
              <button type="button" onClick={() => onChange(null, null, i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center"><FiX size={10}/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const initialForm = {
  listingType: '',
  productName: '', tagline: '', category: '', additionalCategories: [], shortDescription: '', fullDescription: '',
  logo: '', screenshots: [], demoVideoUrl: '', productWebsite: '', foundedYear: '', companyStage: '',
  // White-label specific
  isFullSourceCode: false, hasResellRights: false, isRebrandable: false, whitelabelDetails: '',
  // Pricing
  pricingModel: '', hasFreerial: false, freeTrialDays: '', minContractLength: '', refundPolicy: '', currency: 'USD',
  startingPrice: '', pricesByCurrency: {},
  // Technical
  deployment: [], platforms: [], hasApi: false, apiDocUrl: '', integrations: '', securityCerts: '', dataResidency: '', uptimeSla: '', isOpenSource: false, repoUrl: '',
  // Market
  targetCompanySize: [], targetIndustries: '', keyFeatures: '', languagesSupported: 'English',
  useCases: [{ title: '', description: '' }],
  testimonials: [{ name: '', designation: '', company: '', quote: '' }],
  faq: [{ question: '', answer: '' }],
  // Support
  supportChannels: [], supportHours: '', supportTimezone: 'IST', onboardingType: '', documentationUrl: '', offersTraining: false, hasDedicatedManager: false,
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // Stable setters using functional updates
  const set = useCallback((k, v) => setForm(prev => ({ ...prev, [k]: v })), []);
  const toggleArr = useCallback((k, v) => setForm(prev => ({
    ...prev, [k]: prev[k].includes(v) ? prev[k].filter(x => x !== v) : [...prev[k], v]
  })), []);

  const handleLogoUpload = useCallback((dataUrl) => {
    if (dataUrl === null) { set('logo', ''); return; }
    set('logo', dataUrl);
  }, [set]);

  const handleScreenshotUpload = useCallback((dataUrl, name, removeIdx) => {
    if (removeIdx !== undefined) {
      setForm(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== removeIdx) }));
    } else if (dataUrl) {
      setForm(prev => ({ ...prev, screenshots: [...prev.screenshots, dataUrl] }));
    }
  }, []);

  const next = () => {
    if (step === 0 && !form.listingType) { toast.error('Please select a listing type'); return; }
    if (step === 1 && (!form.productName.trim() || !form.category)) { toast.error('Product name and category are required'); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        integrations: form.integrations.split(',').map(s => s.trim()).filter(Boolean),
        securityCerts: form.securityCerts.split(',').map(s => s.trim()).filter(Boolean),
        keyFeatures: form.keyFeatures.split(',').map(s => s.trim()).filter(Boolean),
        languagesSupported: form.languagesSupported.split(',').map(s => s.trim()).filter(Boolean),
        targetIndustries: form.targetIndustries.split(',').map(s => s.trim()).filter(Boolean),
        testimonials: form.testimonials.filter(t => t.name.trim() || t.quote.trim()).map(t => ({ ...t, approved: true })),
      };
      const { data } = await api.post('/listings', payload);
      if (data.requiresPayment) {
        toast.error(`This listing requires ₹${data.amount} payment. Payment integration coming soon — contact support.`);
      } else {
        toast.success('Listing submitted for review! Goes live once approved.');
        navigate('/seller/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create listing');
    } finally { setLoading(false); }
  };

  return (
    <SidebarLayout role="seller" title="Create New Listing" subtitle="Fill in your product details to generate a dynamic landing page">
      <div className="max-w-3xl mx-auto">
        <StepBar step={step} />

        <div className="card p-7">
          {/* STEP 0: Listing Type */}
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold text-[var(--navy)] mb-1" >What type of software are you listing?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">This determines what information buyers see and which category your listing appears in.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <button type="button" onClick={() => set('listingType', 'whitelabel')}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${form.listingType === 'whitelabel' ? 'border-[var(--gold)] bg-[#fdf6e7]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}>
                  <div className="text-3xl mb-3">🏷️</div>
                  <p className="font-bold text-[var(--navy)] mb-1">White-Label Software</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">A ready-made platform that buyers can rebrand and resell. Source code, reseller rights, custom domain support.</p>
                  <ul className="mt-3 space-y-1.5">
                    {['Rebrandable product', 'Reseller rights', 'Source code optional'].map(f => (
                      <li key={f} className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[var(--gold)] flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </button>
                <button type="button" onClick={() => set('listingType', 'saas')}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${form.listingType === 'saas' ? 'border-[var(--navy)] bg-[rgba(15,36,67,0.04)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}>
                  <div className="text-3xl mb-3">☁️</div>
                  <p className="font-bold text-[var(--navy)] mb-1">SaaS Product</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Your own cloud-based software product. Subscription, per-seat, or usage-based pricing for direct buyers.</p>
                  <ul className="mt-3 space-y-1.5">
                    {['Cloud hosted', 'Direct subscription', 'Own product'].map(f => (
                      <li key={f} className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[var(--navy)] flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--navy)]" >Basic Product Information</h3>

              <FieldWrap label="Product Name" required>
                <input className="input-field" value={form.productName} onChange={e => set('productName', e.target.value)} placeholder="e.g. ProCRM Suite, WhiteHR Platform" />
              </FieldWrap>

              <FieldWrap label="Tagline" hint="One powerful line that sells the product (160 chars max)">
                <input className="input-field" value={form.tagline} onChange={e => set('tagline', e.target.value)} maxLength={160} placeholder="e.g. Complete white-label CRM — rebrand and resell in 48 hours" />
              </FieldWrap>

              <FieldWrap label="Primary Category" required hint="The main category your product belongs to">
                <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select primary category...</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FieldWrap>

              <FieldWrap label="Additional Categories" hint="Select all other categories that apply — helps buyers find your product in more searches">
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATS.filter(c => c !== form.category).map(c => {
                    const selected = form.additionalCategories.includes(c);
                    return (
                      <button key={c} type="button"
                        onClick={() => set('additionalCategories', selected ? form.additionalCategories.filter(x => x !== c) : [...form.additionalCategories, c])}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selected ? 'border-[var(--navy)] bg-[rgba(15,36,67,0.08)] text-[var(--navy)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]'}`}>
                        {selected && <span className="mr-1">✓</span>}{c}
                      </button>
                    );
                  })}
                </div>
                {form.additionalCategories.length > 0 && (
                  <p className="text-xs text-[var(--text-muted)] mt-2">{form.additionalCategories.length} additional {form.additionalCategories.length === 1 ? 'category' : 'categories'} selected</p>
                )}
              </FieldWrap>

              <FieldWrap label="Short Description" hint="Shown on listing cards — max 250 characters">
                <textarea className="input-field resize-none" rows={2} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} maxLength={250} placeholder="Brief summary visible in search results..." />
              </FieldWrap>

              <FieldWrap label="Full Description" hint="Use this to fully describe features, benefits, and what makes your product unique">
                <textarea className="input-field resize-none" rows={7} value={form.fullDescription} onChange={e => set('fullDescription', e.target.value)} placeholder="Detailed product description, key features, technology stack, what's included..." />
              </FieldWrap>

              {/* Logo upload */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <ImageUpload label="Product Logo" value={form.logo} onChange={handleLogoUpload} preview={form.logo ? [form.logo] : []} />
                  {form.logo && (
                    <button type="button" onClick={() => set('logo', '')} className="text-xs text-red-500 mt-1 hover:underline">Remove logo</button>
                  )}
                </div>
                <div>
                  <ImageUpload label="Screenshots (up to 10)" multiple onChange={handleScreenshotUpload} preview={form.screenshots} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Product Website URL">
                  <input type="url" className="input-field" value={form.productWebsite} onChange={e => set('productWebsite', e.target.value)} placeholder="https://..." />
                </FieldWrap>
                <FieldWrap label="Demo Video URL">
                  <input type="url" className="input-field" value={form.demoVideoUrl} onChange={e => set('demoVideoUrl', e.target.value)} placeholder="YouTube or Loom URL" />
                </FieldWrap>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Founded Year">
                  <input type="number" className="input-field" value={form.foundedYear} onChange={e => set('foundedYear', e.target.value)} placeholder="2020" min="1990" max="2025" />
                </FieldWrap>
                <FieldWrap label="Company Stage">
                  <select className="input-field" value={form.companyStage} onChange={e => set('companyStage', e.target.value)}>
                    <option value="">Select...</option>
                    <option value="startup">Startup</option>
                    <option value="growth">Growth Stage</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </FieldWrap>
              </div>

              {/* White-label specific */}
              {form.listingType === 'whitelabel' && (
                <div className="border border-[var(--gold)] rounded-xl p-5" style={{ background: '#fdf6e7' }}>
                  <p className="text-sm font-semibold text-[var(--navy)] mb-3 flex items-center gap-2">🏷️ White-Label Details</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <CheckButton checked={form.isRebrandable} onChange={() => set('isRebrandable', !form.isRebrandable)} label="Fully rebrandable" />
                    <CheckButton checked={form.hasResellRights} onChange={() => set('hasResellRights', !form.hasResellRights)} label="Reseller rights" />
                    <CheckButton checked={form.isFullSourceCode} onChange={() => set('isFullSourceCode', !form.isFullSourceCode)} label="Full source code" />
                  </div>
                  <FieldWrap label="White-Label Details" hint="What exactly does the buyer get? Setup process, licensing terms, what can be customised...">
                    <textarea className="input-field resize-none" rows={4} value={form.whitelabelDetails} onChange={e => set('whitelabelDetails', e.target.value)} placeholder="Describe what the buyer receives: source code / hosted platform, onboarding process, customisation scope, licensing..." />
                  </FieldWrap>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Pricing */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--navy)]">Pricing & Commercial Terms</h3>

              <FieldWrap label="Pricing Model" required>
                <select className="input-field" value={form.pricingModel} onChange={e => set('pricingModel', e.target.value)}>
                  <option value="">Select model...</option>
                  <option value="one_time">One-time licence fee</option>
                  <option value="per_seat">Per-seat subscription</option>
                  <option value="flat">Flat monthly/annual rate</option>
                  <option value="usage_based">Usage-based pricing</option>
                  <option value="hybrid">Hybrid (setup + subscription)</option>
                  <option value="custom">Custom / Negotiable</option>
                </select>
              </FieldWrap>

              {/* Base price + currency */}
              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Base Currency">
                  <select className="input-field" value={form.currency} onChange={e => set('currency', e.target.value)}>
                    <option value="USD">USD $ — US Dollar</option>
                    <option value="EUR">EUR € — Euro</option>
                    <option value="GBP">GBP £ — British Pound</option>
                    <option value="INR">INR ₹ — Indian Rupee</option>
                    <option value="AED">AED د.إ — UAE Dirham</option>
                    <option value="SGD">SGD S$ — Singapore Dollar</option>
                    <option value="AUD">AUD A$ — Australian Dollar</option>
                    <option value="CAD">CAD C$ — Canadian Dollar</option>
                    <option value="JPY">JPY ¥ — Japanese Yen</option>
                    <option value="MYR">MYR RM — Malaysian Ringgit</option>
                    <option value="BRL">BRL R$ — Brazilian Real</option>
                    <option value="ZAR">ZAR R — South African Rand</option>
                    <option value="CHF">CHF — Swiss Franc</option>
                    <option value="SEK">SEK kr — Swedish Krona</option>
                  </select>
                </FieldWrap>
                <FieldWrap label="Starting Price (optional)" hint="Buyers will see 'Starting from X'. Leave blank for Ask-for-Price.">
                  <input type="number" className="input-field" value={form.startingPrice}
                    onChange={e => set('startingPrice', e.target.value)}
                    placeholder={`e.g. 99  (in ${form.currency})`} min="0" />
                </FieldWrap>
              </div>

              {/* Per-currency overrides */}
              {form.startingPrice && (
                <div className="p-4 rounded-xl border border-[var(--border)] space-y-3" style={{ background: '#f8fafc' }}>
                  <p className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider mb-2">
                    Per-Country Price Overrides
                    <span className="ml-2 font-normal text-[var(--text-muted)] normal-case">— optional. If left blank, your base price is auto-converted.</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { code: 'USD', label: 'USD $', flag: '🇺🇸' },
                      { code: 'EUR', label: 'EUR €', flag: '🇪🇺' },
                      { code: 'GBP', label: 'GBP £', flag: '🇬🇧' },
                      { code: 'INR', label: 'INR ₹', flag: '🇮🇳' },
                      { code: 'AED', label: 'AED د.إ', flag: '🇦🇪' },
                      { code: 'SGD', label: 'SGD S$', flag: '🇸🇬' },
                      { code: 'AUD', label: 'AUD A$', flag: '🇦🇺' },
                      { code: 'CAD', label: 'CAD C$', flag: '🇨🇦' },
                    ].filter(c => c.code !== form.currency).map(({ code, label, flag }) => (
                      <div key={code} className="flex items-center gap-2">
                        <span className="text-base flex-shrink-0">{flag}</span>
                        <span className="text-xs font-semibold text-[var(--text-secondary)] w-14 flex-shrink-0">{label}</span>
                        <input
                          type="number" min="0" placeholder="auto"
                          className="input-field flex-1 text-sm"
                          value={form.pricesByCurrency[code] || ''}
                          onChange={e => {
                            const val = e.target.value;
                            set('pricesByCurrency', {
                              ...form.pricesByCurrency,
                              [code]: val === '' ? undefined : Number(val),
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-[var(--border)]">
                <input type="checkbox" id="hasFreerial" checked={form.hasFreerial} onChange={e => set('hasFreerial', e.target.checked)} className="w-4 h-4 accent-[var(--navy)]" />
                <label htmlFor="hasFreerial" className="text-sm font-medium text-[var(--navy)]">Offer a free trial period</label>
                {form.hasFreerial && (
                  <div className="flex items-center gap-2 ml-auto">
                    <input type="number" className="input-field w-20 text-center" value={form.freeTrialDays} onChange={e => set('freeTrialDays', e.target.value)} placeholder="30" min="1" />
                    <span className="text-sm text-[var(--text-muted)]">days</span>
                  </div>
                )}
              </div>

              <FieldWrap label="Minimum Contract Length">
                <select className="input-field" value={form.minContractLength} onChange={e => set('minContractLength', e.target.value)}>
                  <option value="">No minimum</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom</option>
                </select>
              </FieldWrap>

              <FieldWrap label="Refund Policy">
                <textarea className="input-field resize-none" rows={3} value={form.refundPolicy} onChange={e => set('refundPolicy', e.target.value)} placeholder="e.g. No refunds after deployment. 7-day refund for white-label licence..." />
              </FieldWrap>
            </div>
          )}

          {/* STEP 3: Technical */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--navy)]" >Technical Specifications</h3>

              <FieldWrap label="Deployment Options">
                <div className="flex flex-wrap gap-2 mt-1">
                  {['cloud', 'on_premise', 'hybrid'].map(d => (
                    <CheckButton key={d} checked={form.deployment.includes(d)} onChange={() => toggleArr('deployment', d)} label={d.replace('_', '-')} />
                  ))}
                </div>
              </FieldWrap>

              <FieldWrap label="Available Platforms">
                <div className="flex flex-wrap gap-2 mt-1">
                  {['web', 'ios', 'android', 'desktop'].map(p => (
                    <CheckButton key={p} checked={form.platforms.includes(p)} onChange={() => toggleArr('platforms', p)} label={p} />
                  ))}
                </div>
              </FieldWrap>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                  <input type="checkbox" id="hasApi" checked={form.hasApi} onChange={e => set('hasApi', e.target.checked)} className="w-4 h-4 accent-[var(--navy)]" />
                  <label htmlFor="hasApi" className="text-sm font-medium text-[var(--navy)]">Has API Access</label>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                  <input type="checkbox" id="isOpenSource" checked={form.isOpenSource} onChange={e => set('isOpenSource', e.target.checked)} className="w-4 h-4 accent-[var(--navy)]" />
                  <label htmlFor="isOpenSource" className="text-sm font-medium text-[var(--navy)]">Open Source</label>
                </div>
              </div>

              {form.hasApi && (
                <FieldWrap label="API Documentation URL">
                  <input type="url" className="input-field" value={form.apiDocUrl} onChange={e => set('apiDocUrl', e.target.value)} placeholder="https://docs.yourproduct.com" />
                </FieldWrap>
              )}

              <FieldWrap label="Integrations" hint="Comma-separated: Slack, Salesforce, Zapier, Tally, WhatsApp...">
                <input className="input-field" value={form.integrations} onChange={e => set('integrations', e.target.value)} placeholder="Slack, Salesforce, Razorpay, WhatsApp, Tally..." />
              </FieldWrap>

              <FieldWrap label="Security Certifications" hint="Comma-separated: SOC 2, ISO 27001, GDPR...">
                <input className="input-field" value={form.securityCerts} onChange={e => set('securityCerts', e.target.value)} placeholder="SOC 2, ISO 27001, GDPR, VAPT..." />
              </FieldWrap>

              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Data Residency / Hosting Region">
                  <input className="input-field" value={form.dataResidency} onChange={e => set('dataResidency', e.target.value)} placeholder="India (AWS Mumbai)" />
                </FieldWrap>
                <FieldWrap label="Uptime SLA">
                  <input className="input-field" value={form.uptimeSla} onChange={e => set('uptimeSla', e.target.value)} placeholder="99.9%" />
                </FieldWrap>
              </div>
            </div>
          )}

          {/* STEP 4: Market */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--navy)]" >Target Market & Features</h3>

              <FieldWrap label="Target Company Size">
                <div className="flex flex-wrap gap-2 mt-1">
                  {[['smb','SMB (1–50)'],['mid_market','Mid-market (51–500)'],['enterprise','Enterprise (500+)']].map(([v,l]) => (
                    <CheckButton key={v} checked={form.targetCompanySize.includes(v)} onChange={() => toggleArr('targetCompanySize', v)} label={l} />
                  ))}
                </div>
              </FieldWrap>

              <FieldWrap label="Target Industries" hint="Comma-separated: e.g. Restaurant, Fitness, E-Commerce, Healthcare">
                <input className="input-field" value={form.targetIndustries} onChange={e => set('targetIndustries', e.target.value)} placeholder="Food & Beverage, Retail, Healthcare, Education..." />
              </FieldWrap>

              <FieldWrap label="Key Features" hint="Comma-separated — these appear as feature tags on your listing">
                <textarea className="input-field resize-none" rows={3} value={form.keyFeatures} onChange={e => set('keyFeatures', e.target.value)} placeholder="Real-time dashboard, Role-based access, API access, Mobile app, Custom reports, Multi-tenant, SSO..." />
              </FieldWrap>

              <FieldWrap label="Languages Supported">
                <input className="input-field" value={form.languagesSupported} onChange={e => set('languagesSupported', e.target.value)} placeholder="English, Hindi, Tamil, Marathi..." />
              </FieldWrap>

              {/* Use cases */}
              <div>
                <label className="field-label">Use Cases</label>
                <div className="space-y-3">
                  {form.useCases.map((uc, i) => (
                    <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                      <div className="flex-1 space-y-2">
                        <input className="input-field text-sm" value={uc.title} onChange={e => { const a = [...form.useCases]; a[i] = { ...a[i], title: e.target.value }; set('useCases', a); }} placeholder={`Use case ${i+1} title`} />
                        <input className="input-field text-sm" value={uc.description} onChange={e => { const a = [...form.useCases]; a[i] = { ...a[i], description: e.target.value }; set('useCases', a); }} placeholder="Brief description..." />
                      </div>
                      {form.useCases.length > 1 && (
                        <button type="button" onClick={() => set('useCases', form.useCases.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:text-red-600 mt-1"><FiX size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => set('useCases', [...form.useCases, { title: '', description: '' }])} className="btn-ghost text-sm mt-2">
                  <FiPlus size={13} /> Add use case
                </button>
              </div>

              {/* FAQ */}
              <div>
                <label className="field-label">FAQ</label>
                <div className="space-y-3">
                  {form.faq.map((f, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-[var(--border)] space-y-2">
                      <input className="input-field text-sm" value={f.question} onChange={e => { const a = [...form.faq]; a[i] = { ...a[i], question: e.target.value }; set('faq', a); }} placeholder="Question..." />
                      <textarea className="input-field resize-none text-sm" rows={2} value={f.answer} onChange={e => { const a = [...form.faq]; a[i] = { ...a[i], answer: e.target.value }; set('faq', a); }} placeholder="Answer..." />
                      {form.faq.length > 1 && (
                        <button type="button" onClick={() => set('faq', form.faq.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:underline flex items-center gap-1"><FiX size={11} />Remove</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => set('faq', [...form.faq, { question: '', answer: '' }])} className="btn-ghost text-sm mt-2">
                  <FiPlus size={13} /> Add FAQ
                </button>
              </div>

              {/* Testimonials */}
              <div>
                <label className="field-label">Customer Testimonials</label>
                <p className="field-hint mb-3">Add real quotes from your customers. These appear on your listing page.</p>
                <div className="space-y-3">
                  {form.testimonials.map((t, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-[var(--border)] space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input className="input-field text-sm" value={t.name} onChange={e => { const a = [...form.testimonials]; a[i] = { ...a[i], name: e.target.value }; set('testimonials', a); }} placeholder="Customer name" />
                        <input className="input-field text-sm" value={t.designation} onChange={e => { const a = [...form.testimonials]; a[i] = { ...a[i], designation: e.target.value }; set('testimonials', a); }} placeholder="Designation" />
                        <input className="input-field text-sm" value={t.company} onChange={e => { const a = [...form.testimonials]; a[i] = { ...a[i], company: e.target.value }; set('testimonials', a); }} placeholder="Company" />
                      </div>
                      <textarea className="input-field resize-none text-sm" rows={2} value={t.quote} onChange={e => { const a = [...form.testimonials]; a[i] = { ...a[i], quote: e.target.value }; set('testimonials', a); }} placeholder="Their quote about your product..." />
                      {form.testimonials.length > 1 && (
                        <button type="button" onClick={() => set('testimonials', form.testimonials.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:underline flex items-center gap-1"><FiX size={11} />Remove</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => set('testimonials', [...form.testimonials, { name: '', designation: '', company: '', quote: '' }])} className="btn-ghost text-sm mt-2">
                  <FiPlus size={13} /> Add testimonial
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Support */}
          {step === 5 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--navy)]" >Support & Onboarding</h3>

              <FieldWrap label="Support Channels">
                <div className="flex flex-wrap gap-2 mt-1">
                  {['email','chat','phone','slack','whatsapp'].map(c => (
                    <CheckButton key={c} checked={form.supportChannels.includes(c)} onChange={() => toggleArr('supportChannels', c)} label={c} />
                  ))}
                </div>
              </FieldWrap>

              <div className="grid grid-cols-2 gap-4">
                <FieldWrap label="Support Hours">
                  <input className="input-field" value={form.supportHours} onChange={e => set('supportHours', e.target.value)} placeholder="9 AM – 6 PM, Mon–Sat" />
                </FieldWrap>
                <FieldWrap label="Timezone">
                  <input className="input-field" value={form.supportTimezone} onChange={e => set('supportTimezone', e.target.value)} placeholder="IST (UTC+5:30)" />
                </FieldWrap>
              </div>

              <FieldWrap label="Onboarding Type">
                <select className="input-field" value={form.onboardingType} onChange={e => set('onboardingType', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="self_serve">Self-serve (documentation only)</option>
                  <option value="assisted">Assisted (guided setup)</option>
                  <option value="custom">Custom (dedicated onboarding team)</option>
                </select>
              </FieldWrap>

              <FieldWrap label="Documentation URL">
                <input type="url" className="input-field" value={form.documentationUrl} onChange={e => set('documentationUrl', e.target.value)} placeholder="https://docs.yourproduct.com" />
              </FieldWrap>

              <div className="space-y-3">
                {[['offersTraining','Offers training sessions / onboarding calls'],['hasDedicatedManager','Dedicated account manager available']].map(([k, label]) => (
                  <div key={k} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                    <input type="checkbox" id={k} checked={form[k]} onChange={e => set(k, e.target.checked)} className="w-4 h-4 accent-[var(--navy)]" />
                    <label htmlFor={k} className="text-sm font-medium text-[var(--navy)] cursor-pointer">{label}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[var(--navy)]" >Review & Submit</h3>

              {/* Preview card */}
              <div className="card p-5 border-2 border-[var(--border)]">
                <div className="flex items-start gap-4 mb-4">
                  {form.logo && <img src={form.logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-[var(--border)]" />}
                  <div>
                    <p className="font-bold text-[var(--navy)] text-lg">{form.productName || 'Untitled product'}</p>
                    <p className="text-sm text-[var(--text-muted)]">{form.tagline}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`badge ${form.listingType === 'whitelabel' ? 'badge-gold' : 'badge-navy'}`}>{form.listingType === 'whitelabel' ? 'White-Label' : 'SaaS'}</span>
                      {form.category && <span className="badge badge-gray">{form.category}</span>}
                      {form.additionalCategories.map(c => <span key={c} className="badge badge-gray">{c}</span>)}
                      {form.hasFreerial && <span className="badge badge-green">Free Trial</span>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ['Pricing', form.pricingModel?.replace('_',' ')],
                    ['Deployment', form.deployment.join(', ')],
                    ['Platforms', form.platforms.join(', ')],
                    ['Support', form.supportChannels.join(', ')],
                    ['Trial', form.hasFreerial ? `${form.freeTrialDays} days` : 'No'],
                    ['Currency', form.currency],
                  ].filter(([,v]) => v).map(([k,v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-[var(--text-muted)] flex-shrink-0">{k}:</span>
                      <span className="font-medium text-[var(--text-secondary)] capitalize">{v}</span>
                    </div>
                  ))}
                </div>
                {form.screenshots.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {form.screenshots.slice(0,4).map((s,i) => <img key={i} src={s} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-[var(--border)]" />)}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg border" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ Seller Disclaimer</p>
                <p className="text-xs text-amber-700">Listing fees are non-refundable once published. You are responsible for ensuring all listing content is accurate. Fraudulent or misleading listings will be permanently removed and your account may be suspended.</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
                ℹ️ Your listing will be manually reviewed by our team before going live. This typically takes 1 business day.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-[var(--border)]">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-outline flex-1 justify-center">← Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary flex-1 justify-center">Continue →</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
                {loading ? 'Submitting...' : '🚀 Submit for Review'}
              </button>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}