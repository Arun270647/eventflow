import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AuthHeader from './components/AuthHeader';
import { AuthForm } from './components/AuthForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import ForgotPasswordModal from './components/ForgotPasswordModal';

const AuthenticationPortal = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showForgotPassword) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForgotPassword]);

  return (
    <>
      <Helmet>
        <title>{authMode === 'login' ? 'Sign In' : 'Create Account'} - EventFlow</title>
        <meta 
          name="description" 
          content={`${authMode === 'login' ? 'Sign in to your EventFlow account' : 'Create your EventFlow account'} to access premium musical event management features.`}
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
        {/* Header */}
        <AuthHeader />

        {/* Main Content */}
        <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {authMode === 'login' ? 'Welcome back' : 'Join EventFlow'}
              </h1>
              
              <p className="text-muted-foreground">
                {authMode === 'login' ?'Sign in to access your dashboard and manage your musical events' :'Create your account to start managing musical events and connect with artists'
                }
              </p>
            </div>

            {/* Auth Card */}
            <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 animate-slide-up">
              {/* Social Auth Buttons */}
              <SocialAuthButtons mode={authMode} />

              {/* Auth Form */}
              <div className="mt-6">
                <AuthForm 
                  mode={authMode}
                  onToggleMode={toggleAuthMode}
                  onForgotPassword={handleForgotPassword}
                />
              </div>
            </div>

            {/* Mock Credentials Info */}
            <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg animate-fade-in">
              <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div><strong>Admin:</strong> admin@eventflow.com / Admin123!</div>
                <div><strong>Artist:</strong> artist@eventflow.com / Artist123!</div>
                <div><strong>User:</strong> user@eventflow.com / User123!</div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <button className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Privacy Policy
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Terms of Service
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Support
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} EventFlow. All rights reserved.
              </p>
            </div>
          </div>
        </main>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal 
          isOpen={showForgotPassword}
          onClose={closeForgotPassword}
        />
      </div>
    </>
  );
};

export default AuthenticationPortal;