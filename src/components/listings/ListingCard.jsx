import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiEye, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';

const deploymentLabel = { cloud: 'Cloud', on_premise: 'On-Premise', hybrid: 'Hybrid' };
const pricingLabel = { per_seat: 'Per Seat', usage_based: 'Usage Based', flat: 'Flat Rate', one_time: 'One-time', hybrid: 'Hybrid', custom: 'Custom' };

export default function ListingCard({ listing }) {
  const { priceFor } = useCurrency();
  const { productName, tagline, logo, slug, category, pricingModel, deployment, hasFreerial, rating, reviewCount, viewCount, inquiryCount, seller } = listing;
  const displayPrice = priceFor(listing);

  return (
    <Link to={`/listings/${slug}`} className="card p-5 flex flex-col gap-3 group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logo ? <img src={logo} alt={productName} className="w-full h-full object-cover rounded-xl" /> : (
            <span className="font-bold text-xl text-ink-500">{productName?.[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-semibold text-ink-900 text-sm truncate group-hover:text-brand-700 transition-colors">{productName}</h3>
            {seller?.company?.isVerified && <FiCheckCircle size={13} className="text-brand-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-ink-500 truncate">{seller?.company?.legalName}</p>
        </div>
      </div>

      <p className="text-sm text-ink-600 line-clamp-2 leading-relaxed">{tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="badge badge-blue text-xs">{category}</span>
        {hasFreerial && <span className="badge badge-green text-xs">Free Trial</span>}
        {pricingModel && <span className="badge badge-gray text-xs">{pricingLabel[pricingModel] || pricingModel}</span>}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-ink-100 text-xs text-ink-500">
        <div className="flex items-center gap-3">
          {rating > 0 && (
            <span className="flex items-center gap-1"><FiStar size={11} className="text-amber-400" />{rating} ({reviewCount})</span>
          )}
          <span className="flex items-center gap-1"><FiEye size={11} />{viewCount}</span>
          <span className="flex items-center gap-1"><FiMessageSquare size={11} />{inquiryCount}</span>
        </div>
        {displayPrice
          ? <span className="text-brand-600 font-semibold">{displayPrice}</span>
          : <span className="text-brand-600 font-medium">Ask Price →</span>
        }
      </div>
    </Link>
  );
}
