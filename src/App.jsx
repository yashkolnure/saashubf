import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterBuyerPage from './pages/auth/RegisterBuyerPage';
import RegisterSellerPage from './pages/auth/RegisterSellerPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import CreateListingPage from './pages/seller/CreateListingPage';
import EditListingPage from './pages/seller/EditListingPage';
import SellerInboxPage from './pages/seller/SellerInboxPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerInboxPage from './pages/buyer/BuyerInboxPage';
import ThreadPage from './pages/ThreadPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminSellerDetailPage from './pages/admin/AdminSellerDetailPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminBlogEditPage from './pages/admin/AdminBlogEditPage';
import BlogListPage from './pages/blog/BlogListPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"                    element={<HomePage />} />
      <Route path="/listings"            element={<ListingsPage />} />
      <Route path="/listings/:slug"      element={<ListingDetailPage />} />
      <Route path="/blog"                element={<BlogListPage />} />
      <Route path="/blog/:slug"          element={<BlogDetailPage />} />
      <Route path="/login"               element={<LoginPage />} />
      <Route path="/register/buyer"      element={<RegisterBuyerPage />} />
      <Route path="/register/seller"     element={<RegisterSellerPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password"     element={<ForgotPasswordPage />} />

      {/* ── Seller ── */}
      <Route path="/seller/dashboard"          element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/listings/new"       element={<ProtectedRoute role="seller"><CreateListingPage /></ProtectedRoute>} />
      <Route path="/seller/listings/:id/edit"  element={<ProtectedRoute role="seller"><EditListingPage /></ProtectedRoute>} />
      <Route path="/seller/inbox"              element={<ProtectedRoute role="seller"><SellerInboxPage /></ProtectedRoute>} />
      <Route path="/seller/analytics"          element={<ProtectedRoute role="seller"><SellerAnalyticsPage /></ProtectedRoute>} />

      {/* ── Buyer ── */}
      <Route path="/buyer/dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/buyer/inbox"     element={<ProtectedRoute role="buyer"><BuyerInboxPage /></ProtectedRoute>} />

      {/* ── Shared (authenticated) ── */}
      <Route path="/messages/:threadId" element={<ProtectedRoute><ThreadPage /></ProtectedRoute>} />

      {/* ── Admin ── */}
      <Route path="/admin/dashboard"       element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/sellers"         element={<ProtectedRoute role="admin"><AdminSellersPage /></ProtectedRoute>} />
      <Route path="/admin/sellers/:id"     element={<ProtectedRoute role="admin"><AdminSellerDetailPage /></ProtectedRoute>} />
      <Route path="/admin/listings"        element={<ProtectedRoute role="admin"><AdminListingsPage /></ProtectedRoute>} />
      <Route path="/admin/blog"            element={<ProtectedRoute role="admin"><AdminBlogPage /></ProtectedRoute>} />
      <Route path="/admin/blog/new"        element={<ProtectedRoute role="admin"><AdminBlogEditPage /></ProtectedRoute>} />
      <Route path="/admin/blog/:id/edit"   element={<ProtectedRoute role="admin"><AdminBlogEditPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{
              duration: 4000,
              style: { borderRadius: '10px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 4px 16px rgba(15,36,67,0.12)' },
              success: { iconTheme: { primary: '#1a7a4a', secondary: '#fff' } },
            }} />
            <AppRoutes />
          </BrowserRouter>
        </CurrencyProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
