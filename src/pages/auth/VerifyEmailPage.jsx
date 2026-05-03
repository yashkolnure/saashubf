import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import SEO from '../../components/common/SEO';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    api.get(`/auth/verify-email/${token}`).then(() => setStatus('success')).catch(() => setStatus('error'));
  }, [token]);
  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center">
      <SEO title="Verify Email | SaaSHub" description="Verify your SaaSHub account email to complete registration and access your dashboard." noindex />
      <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-xl">
        {status === 'loading' && <p>Verifying...</p>}
        {status === 'success' && <><p className="text-4xl mb-4">✅</p><h2 className="text-xl font-bold mb-2">Email verified!</h2><p className="text-ink-500 mb-4 text-sm">Your account is verified. You can now sign in.</p><Link to="/login" className="btn-primary">Sign in</Link></>}
        {status === 'error' && <><p className="text-4xl mb-4">❌</p><h2 className="text-xl font-bold mb-2">Invalid link</h2><p className="text-ink-500 mb-4 text-sm">This verification link is invalid or has expired.</p><Link to="/login" className="btn-outline">Back to login</Link></>}
      </div>
    </div>
  );
}
