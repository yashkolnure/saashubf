import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function DisclaimerBox({ type = 'general' }) {
  const texts = {
    general: 'SaaSHub is a listing marketplace only. We do not verify product claims, handle payments, or guarantee any transaction. All deals are made directly between buyer and seller.',
    message: 'By sending this message, you acknowledge that SaaSHub does not verify seller claims or mediate disputes. Do not share sensitive financial information. Always verify the seller independently before making any payment.',
    listing: 'All listing information is provided by the seller. SaaSHub does not verify product capabilities, pricing accuracy, or support quality. Conduct your own due diligence before purchasing.',
    seller: 'Listing fees are non-refundable once published. You are responsible for ensuring all listing content is accurate and complies with our policies. Fraudulent or misleading listings will be removed.',
  };
  return (
    <div className="disclaimer-box flex gap-3">
      <FiAlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
      <p>{texts[type]}</p>
    </div>
  );
}
