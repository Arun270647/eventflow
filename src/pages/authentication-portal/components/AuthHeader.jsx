import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AuthHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-200 bg-card/95 backdrop-blur-nav border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <Link 
            to="/premium-landing-page"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-150 focus-ring rounded-lg p-2"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="hidden sm:inline font-medium">Back to Home</span>
          </Link>

          {/* Logo */}
          <Link 
            to="/premium-landing-page" 
            className="flex items-center space-x-2 focus-ring rounded-lg"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Music" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              EventFlow
            </span>
          </Link>

          {/* Help Button */}
          <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-150 focus-ring rounded-lg p-2">
            <Icon name="HelpCircle" size={20} />
            <span className="hidden sm:inline font-medium">Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;