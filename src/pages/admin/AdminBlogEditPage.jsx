import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSave, FiEye, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

const BLOG_CATEGORIES = [
  'Insights', 'SaaS Growth', 'White-Label', 'Product Updates',
  'India Tech', 'Marketing', 'Sales', 'Case Study', 'How-To Guide', 'Industry News',
];

const emptyForm = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '',
  category: 'Insights', tags: [], status: 'draft', featured: false,
  metaTitle: '', metaDescription: '', keywords: [],
};

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map(v => (
          <span key={v} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--cream)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--navy)]">
            {v}
            <button type="button" onClick={() => onChange(values.filter(x => x !== v))} className="text-[var(--text-muted)] hover:text-red-500"><FiX size={10}/></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input-field flex-1" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder} />
        <button type="button" onClick={add} className="btn-ghost px-3 py-2 text-sm"><FiPlus size={14}/></button>
      </div>
    </div>
  );
}

export default function AdminBlogEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState({ meta: 0, desc: 0 });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isNew) {
      api.get(`/blog/admin/all`).then(r => {
        const post = r.data.posts.find(p => p._id === id);
        if (post) {
          // Need full content — fetch by slug
          api.get(`/blog/${post.slug}`).then(r2 => {
            const full = r2.data.post;
            setForm({
              title: full.title || '',
              slug: full.slug || '',
              excerpt: full.excerpt || '',
              content: full.content || '',
              coverImage: full.coverImage || '',
              category: full.category || 'Insights',
              tags: full.tags || [],
              status: full.status || 'draft',
              featured: full.featured || false,
              metaTitle: full.metaTitle || '',
              metaDescription: full.metaDescription || '',
              keywords: full.keywords || [],
            });
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, isNew]);

  useEffect(() => {
    setCharCount({ meta: form.metaTitle.length, desc: form.metaDescription.length });
  }, [form.metaTitle, form.metaDescription]);

  // Auto-generate slug from title (new posts only)
  useEffect(() => {
    if (isNew && form.title) {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      set('slug', slug);
    }
  }, [form.title, isNew]);

  const handleSubmit = async (status) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, status };
      if (isNew) {
        await api.post('/blog', payload);
        toast.success('Post created!');
      } else {
        await api.put(`/blog/${id}`, payload);
        toast.success('Post updated!');
      }
      navigate('/admin/blog');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <SidebarLayout role="admin" title="Blog Editor">
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"/>
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout role="admin" title={isNew ? 'New Blog Post' : 'Edit Blog Post'} subtitle={form.title || 'Untitled'}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/admin/blog')} className="btn-ghost flex items-center gap-2 text-sm">
            <FiArrowLeft size={14}/> Back
          </button>
          <div className="flex items-center gap-2">
            {form.slug && form.status === 'published' && (
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-2 text-sm px-3 py-2 rounded-lg">
                <FiEye size={14}/> Preview
              </a>
            )}
            <button onClick={() => handleSubmit('draft')} disabled={saving}
              className="btn-ghost flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-[var(--border)]">
              Save Draft
            </button>
            <button onClick={() => handleSubmit('published')} disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-lg">
              <FiSave size={14}/> {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* ── Main content card ── */}
        <div className="card p-6 space-y-5">
          <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Content</h3>

          <div>
            <label className="field-label">Title <span className="text-red-500">*</span></label>
            <input className="input-field text-lg font-bold" value={form.title}
              onChange={e => set('title', e.target.value)} placeholder="Write a compelling headline..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Slug (URL)</label>
              <input className="input-field font-mono text-sm" value={form.slug}
                onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="post-url-slug" />
              {form.slug && <p className="field-hint">/blog/<strong>{form.slug}</strong></p>}
            </div>
            <div>
              <label className="field-label">Category</label>
              <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Excerpt <span className="text-xs text-[var(--text-muted)] font-normal">(shown on blog cards)</span></label>
            <textarea className="input-field resize-none" rows={2} value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)} maxLength={400}
              placeholder="A short, compelling summary of what this post covers..." />
          </div>

          <div>
            <label className="field-label">Cover Image URL</label>
            <input type="url" className="input-field" value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)} placeholder="https://images.unsplash.com/..." />
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover preview" className="mt-2 w-full h-40 object-cover rounded-xl border border-[var(--border)]" onError={e => e.target.style.display='none'} />
            )}
          </div>

          <div>
            <label className="field-label">Content <span className="text-red-500">*</span> <span className="text-xs text-[var(--text-muted)] font-normal">— HTML supported</span></label>
            <textarea
              className="input-field resize-y font-mono text-sm"
              rows={20}
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder={`<h2>Introduction</h2>\n<p>Your article content here. HTML is fully supported.</p>\n\n<h3>Key Points</h3>\n<ul>\n  <li>First point</li>\n  <li>Second point</li>\n</ul>`}
            />
            <p className="field-hint">Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;img&gt;, &lt;blockquote&gt;, &lt;code&gt;</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TagInput label="Tags" values={form.tags} onChange={v => set('tags', v)} placeholder="e.g. SaaS, India, Growth" />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-[var(--navy)]" />
              <span className="text-sm font-medium text-[var(--navy)]">Feature this post</span>
              <span className="text-xs text-[var(--text-muted)]">(shown prominently on blog home)</span>
            </label>
          </div>
        </div>

        {/* ── SEO card ── */}
        <div className="card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">SEO Settings</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Controls how this post appears in Google search results.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="field-label mb-0">Meta Title</label>
              <span className={`text-xs ${charCount.meta > 60 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>{charCount.meta}/70</span>
            </div>
            <input className="input-field" value={form.metaTitle}
              onChange={e => set('metaTitle', e.target.value)} maxLength={70}
              placeholder="SEO-optimised title (leave blank to use post title)" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="field-label mb-0">Meta Description</label>
              <span className={`text-xs ${charCount.desc > 155 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>{charCount.desc}/160</span>
            </div>
            <textarea className="input-field resize-none" rows={2} value={form.metaDescription}
              onChange={e => set('metaDescription', e.target.value)} maxLength={160}
              placeholder="Compelling description for Google — 120-155 characters ideal" />
          </div>

          <TagInput label="Keywords" values={form.keywords} onChange={v => set('keywords', v)}
            placeholder="e.g. SaaS India, white-label software" />

          {/* Google preview */}
          {(form.metaTitle || form.title) && (
            <div className="border border-[var(--border)] rounded-xl p-4 bg-white">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Google Preview</p>
              <p className="text-xs text-green-700 mb-0.5">onlinesaasmarketplace.com › blog › {form.slug || 'post-slug'}</p>
              <p className="text-[#1a0dab] text-base font-medium mb-0.5 leading-tight hover:underline cursor-pointer">
                {(form.metaTitle || form.title).slice(0, 70)}{(form.metaTitle || form.title).length > 70 ? '...' : ''}
              </p>
              <p className="text-[#4d5156] text-sm leading-snug">
                {(form.metaDescription || form.excerpt || '').slice(0, 155)}{(form.metaDescription || form.excerpt || '').length > 155 ? '...' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Bottom save */}
        <div className="flex justify-end gap-3 pb-8">
          <button onClick={() => handleSubmit('draft')} disabled={saving}
            className="btn-ghost px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm">
            Save as Draft
          </button>
          <button onClick={() => handleSubmit('published')} disabled={saving}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm">
            <FiSave size={14}/> {saving ? 'Saving...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
