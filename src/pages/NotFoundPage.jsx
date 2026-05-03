import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Browse 500+ verified SaaS and white-label software products on SaaSHub — India's #1 software marketplace."
        noindex
      />
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div>
          <p className="text-8xl mb-6">404</p>
          <h1 className="text-3xl font-bold text-ink-900 mb-3">Page not found</h1>
          <p className="text-ink-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-primary">Go Home</Link>
            <Link to="/listings" className="btn-outline">Browse Listings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
