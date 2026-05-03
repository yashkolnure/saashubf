import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/common/SidebarLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, FiGlobe, FiFileText } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = () => {
    api.get('/blog/admin/all').then(r => {
      setPosts(r.data.posts);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/blog/${id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const published = posts.filter(p => p.status === 'published').length;
  const drafts    = posts.filter(p => p.status === 'draft').length;

  return (
    <SidebarLayout role="admin" title="Blog Manager" subtitle="Create and manage all blog posts">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Posts',     value: posts.length, icon: <FiFileText />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Published',       value: published,    icon: <FiGlobe />,    color: 'text-green-600 bg-green-50' },
          { label: 'Drafts',          value: drafts,       icon: <FiClock />,    color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
            <div>
              <p className="text-2xl font-bold text-[var(--navy)]">{value}</p>
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--navy)]">All Posts</h2>
        <Link to="/admin/blog/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-lg">
          <FiPlus size={14} /> New Post
        </Link>
      </div>

      {/* Posts table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📝</p>
            <p className="font-semibold text-[var(--navy)] mb-2">No blog posts yet</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">Create your first post to start driving organic traffic.</p>
            <Link to="/admin/blog/new" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm">
              <FiPlus size={14} /> Write First Post
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--cream)]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map(p => (
                <tr key={p._id} className="hover:bg-[var(--cream)] transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-[var(--navy)] truncate max-w-xs">{p.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.readTime || 1} min read · {p.author?.name || 'Admin'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge badge-gray text-xs">{p.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${p.status === 'published' ? 'badge-green' : 'badge-gray'}`}>
                      {p.status === 'published' ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1"><FiEye size={12}/>{p.views || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-[var(--text-muted)]">
                    {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {p.status === 'published' && (
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="View live">
                          <FiEye size={14}/>
                        </a>
                      )}
                      <Link to={`/admin/blog/${p._id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-[var(--cream)] text-[var(--text-secondary)] transition-colors" title="Edit">
                        <FiEdit2 size={14}/>
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.title)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete">
                        <FiTrash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SidebarLayout>
  );
}
