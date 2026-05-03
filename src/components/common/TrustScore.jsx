import React from 'react';
import { FiShield } from 'react-icons/fi';

export default function TrustScore({ score = 0 }) {
  const color = score >= 70 ? 'text-brand-600' : score >= 40 ? 'text-amber-600' : 'text-red-500';
  const bg = score >= 70 ? 'bg-brand-50 border-brand-200' : score >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium ${bg} ${color}`}>
      <FiShield size={14} />
      <span>Trust Score: {score}/100</span>
    </div>
  );
}
