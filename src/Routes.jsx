import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import PremiumLandingPage from './pages/premium-landing-page';
import UserPortalDashboard from './pages/user-portal-dashboard';
import AuthenticationPortal from './pages/authentication-portal';
import ArtistPortalDashboard from './pages/artist-portal-dashboard';
import ArtistApplicationForm from './pages/artist-application-form';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/premium-landing-page" element={<PremiumLandingPage />} />
        <Route path="/user-portal-dashboard" element={<UserPortalDashboard />} />
        <Route path="/authentication-portal" element={<AuthenticationPortal />} />
        <Route path="/artist-portal-dashboard" element={<ArtistPortalDashboard />} />
        <Route path="/artist-application-form" element={<ArtistApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
