import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import { FiChevronDown } from 'react-icons/fi';

export default function CurrencySelector({ dark = true }) {
  const { currency, setCurrency, flag } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const entries = Object.entries(CURRENCIES);

  const btnStyle = dark ? {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 11,
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.18s',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Outfit, sans-serif',
    whiteSpace: 'nowrap',
  } : {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: '#f8fafc',
    border: '1.5px solid var(--border)',
    borderRadius: 11,
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.18s',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontFamily: 'Outfit, sans-serif',
    whiteSpace: 'nowrap',
  };

  const dropStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 220,
    background: dark ? 'rgba(12,16,36,0.97)' : '#fff',
    border: dark ? '1px solid rgba(255,255,255,0.1)' : '1.5px solid var(--border)',
    borderRadius: 16,
    padding: 8,
    boxShadow: dark
      ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset'
      : '0 8px 28px rgba(15,36,67,0.12)',
    zIndex: 200,
    backdropFilter: 'blur(20px)',
    maxHeight: 340,
    overflowY: 'auto',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={btnStyle}
        onMouseEnter={e => {
          e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.12)' : '#f1f5f9';
          e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.22)' : 'var(--border-strong)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : '#f8fafc';
          e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.12)' : 'var(--border)';
        }}
      >
        <span style={{ fontSize: 14 }}>{flag}</span>
        <span>{currency}</span>
        <FiChevronDown size={11} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', opacity: 0.6 }} />
      </button>

      {open && (
        <div style={dropStyle}>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 800,
            color: dark ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '4px 10px 8px', margin: 0,
          }}>Select Currency</p>

          {entries.map(([code, info]) => {
            const active = code === currency;
            return (
              <button
                key={code}
                onClick={() => { setCurrency(code); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 10px', borderRadius: 10,
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'Outfit, sans-serif', fontSize: 13,
                  background: active
                    ? (dark ? 'rgba(200,147,39,0.15)' : 'rgba(124,58,237,0.08)')
                    : 'transparent',
                  color: active
                    ? (dark ? '#f0c060' : 'var(--purple)')
                    : (dark ? 'rgba(255,255,255,0.7)' : 'var(--text-primary)'),
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : '#f8fafc';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{info.flag}</span>
                <span style={{ flex: 1, fontWeight: active ? 700 : 500 }}>{info.name}</span>
                <span style={{ fontSize: 12, opacity: 0.55, fontWeight: 700 }}>{info.symbol}</span>
                {active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: dark ? '#f0c060' : 'var(--purple)', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
