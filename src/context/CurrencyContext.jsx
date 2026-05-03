import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const CURRENCIES = {
  USD: { symbol: '$',    name: 'US Dollar',         flag: '🇺🇸', locale: 'en-US' },
  EUR: { symbol: '€',    name: 'Euro',               flag: '🇪🇺', locale: 'de-DE' },
  GBP: { symbol: '£',    name: 'British Pound',      flag: '🇬🇧', locale: 'en-GB' },
  INR: { symbol: '₹',    name: 'Indian Rupee',       flag: '🇮🇳', locale: 'en-IN' },
  AED: { symbol: 'د.إ',  name: 'UAE Dirham',         flag: '🇦🇪', locale: 'ar-AE' },
  SGD: { symbol: 'S$',   name: 'Singapore Dollar',   flag: '🇸🇬', locale: 'en-SG' },
  AUD: { symbol: 'A$',   name: 'Australian Dollar',  flag: '🇦🇺', locale: 'en-AU' },
  CAD: { symbol: 'C$',   name: 'Canadian Dollar',    flag: '🇨🇦', locale: 'en-CA' },
  JPY: { symbol: '¥',    name: 'Japanese Yen',       flag: '🇯🇵', locale: 'ja-JP' },
  MYR: { symbol: 'RM',   name: 'Malaysian Ringgit',  flag: '🇲🇾', locale: 'ms-MY' },
  BRL: { symbol: 'R$',   name: 'Brazilian Real',     flag: '🇧🇷', locale: 'pt-BR' },
  ZAR: { symbol: 'R',    name: 'South African Rand', flag: '🇿🇦', locale: 'en-ZA' },
  CHF: { symbol: 'CHF',  name: 'Swiss Franc',        flag: '🇨🇭', locale: 'de-CH' },
  SEK: { symbol: 'kr',   name: 'Swedish Krona',      flag: '🇸🇪', locale: 'sv-SE' },
};

// Map ISO country codes → currency (covers IP geolocation + browser locale fallback)
const COUNTRY_TO_CURRENCY = {
  US: 'USD', GB: 'GBP', AU: 'AUD', CA: 'CAD', NZ: 'USD',
  IN: 'INR', AE: 'AED', SG: 'SGD', MY: 'MYR', JP: 'JPY',
  BR: 'BRL', ZA: 'ZAR', CH: 'CHF', SE: 'SEK', NO: 'SEK',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  PT: 'EUR', BE: 'EUR', AT: 'EUR', FI: 'EUR', IE: 'EUR',
  GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR',
  PK: 'USD', BD: 'USD', LK: 'USD', NG: 'USD', KE: 'USD',
  PH: 'USD', VN: 'USD', TH: 'USD', ID: 'USD', EG: 'USD',
  SA: 'AED', KW: 'AED', QA: 'AED', BH: 'AED', OM: 'AED',
};

const GEO_CACHE_KEY = 'saashub_geo_currency';
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Synchronous initial value: manual preference > cached geo > browser locale > USD
function detectInitialCurrency() {
  try {
    const manual = localStorage.getItem('saashub_currency');
    if (manual && CURRENCIES[manual]) return manual;

    const geoStr = localStorage.getItem(GEO_CACHE_KEY);
    if (geoStr) {
      const { currency: c, ts } = JSON.parse(geoStr);
      if (c && CURRENCIES[c] && Date.now() - ts < GEO_CACHE_TTL) return c;
    }

    // Fallback to browser locale while async IP lookup runs
    const lang = navigator.language || navigator.languages?.[0] || 'en-US';
    const region = lang.split('-')[1]?.toUpperCase() || '';
    return COUNTRY_TO_CURRENCY[region] || 'USD';
  } catch {
    return 'USD';
  }
}

// Hardcoded fallback USD-base rates (used if API is down)
const FALLBACK_RATES = {
  USD:1, EUR:0.93, GBP:0.79, INR:83.5, AED:3.67, SGD:1.35,
  AUD:1.53, CAD:1.36, JPY:149.5, MYR:4.72, BRL:4.97,
  ZAR:18.63, CHF:0.90, SEK:10.52,
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(detectInitialCurrency);
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [ratesLoaded, setRatesLoaded] = useState(false);
  // Track whether the user has manually overridden the currency
  const [userOverride] = useState(() => {
    try { const m = localStorage.getItem('saashub_currency'); return !!(m && CURRENCIES[m]); } catch { return false; }
  });

  // IP-based geo detection — runs once on mount if no manual override
  useEffect(() => {
    if (userOverride) return;

    // If we already have a fresh cached geo result, skip the network call
    try {
      const geoStr = localStorage.getItem(GEO_CACHE_KEY);
      if (geoStr) {
        const { currency: c, ts } = JSON.parse(geoStr);
        if (c && CURRENCIES[c] && Date.now() - ts < GEO_CACHE_TTL) {
          setCurrencyState(c);
          return;
        }
      }
    } catch {}

    // Fetch real IP location
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const country = data.country_code;
        const detected = COUNTRY_TO_CURRENCY[country] || 'USD';
        if (CURRENCIES[detected]) {
          setCurrencyState(detected);
          try {
            localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ currency: detected, ts: Date.now() }));
          } catch {}
        }
      })
      .catch(() => {}); // silently keep current value on failure
  }, [userOverride]);

  // Fetch live exchange rates once on mount
  useEffect(() => {
    api.get('/currencies/rates')
      .then(r => {
        if (r.data?.rates) {
          setRates(r.data.rates);
          setRatesLoaded(true);
        }
      })
      .catch(() => {
        setRatesLoaded(true);
      });
  }, []);

  const setCurrency = useCallback((code) => {
    if (!CURRENCIES[code]) return;
    try {
      localStorage.setItem('saashub_currency', code);
      // Clear geo cache so manual choice always wins
      localStorage.removeItem(GEO_CACHE_KEY);
    } catch {}
    setCurrencyState(code);
  }, []);

  // Convert amount from fromCurrency to the active currency
  const convert = useCallback((amount, fromCurrency = 'USD') => {
    if (!amount || isNaN(amount)) return null;
    if (fromCurrency === currency) return amount;
    const fromRate = rates[fromCurrency];
    const toRate = rates[currency];
    if (!fromRate || !toRate) return null;
    return (amount / fromRate) * toRate;
  }, [rates, currency]);

  // Format a number as a price in the active currency
  const format = useCallback((amount) => {
    if (amount == null || isNaN(amount)) return null;
    const info = CURRENCIES[currency] || { symbol: currency, locale: 'en-US' };
    try {
      return new Intl.NumberFormat(info.locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'JPY' ? 0 : 0,
        maximumFractionDigits: currency === 'JPY' ? 0 : 0,
      }).format(Math.round(amount));
    } catch {
      return `${info.symbol}${Math.round(amount).toLocaleString()}`;
    }
  }, [currency]);

  // Convert + format in one call.
  // listing: the listing object; uses listing.pricesByCurrency override if available.
  const priceFor = useCallback((listing) => {
    if (!listing?.startingPrice) return null;

    // Check if seller set a direct override for this currency
    const overrides = listing.pricesByCurrency || {};
    if (overrides[currency] != null) {
      return format(overrides[currency]);
    }

    // Convert from listing.currency (seller's base currency) → active currency
    const baseAmount = listing.startingPrice;
    const baseCurrency = listing.currency || 'INR';
    const converted = convert(baseAmount, baseCurrency);
    return converted != null ? format(converted) : null;
  }, [currency, convert, format]);

  // Format the listing fee (₹1,000 INR → $12 USD etc.)
  const feeFor = useCallback((amountINR) => {
    const converted = convert(amountINR, 'INR');
    return converted != null ? format(converted) : null;
  }, [convert, format]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      currencies: CURRENCIES,
      rates,
      ratesLoaded,
      convert,
      format,
      priceFor,
      feeFor,
      symbol: CURRENCIES[currency]?.symbol || '$',
      flag: CURRENCIES[currency]?.flag || '',
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
