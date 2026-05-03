import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ onSearch, placeholder = "Search SaaS products..." }) {
  const [q, setQ] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onSearch(q); };
  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <FiSearch className="absolute left-4 text-ink-400" size={18} />
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-11 pr-28 h-12 text-base rounded-2xl shadow-sm border-ink-200"
      />
      <button type="submit" className="absolute right-2 btn-primary text-sm py-1.5 px-4">Search</button>
    </form>
  );
}
