import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PublicHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'Events', href: '#events' },
    { label: 'Artists', href: '#artists' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const scrollToSection = (href) => {
    if (href?.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-200 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-nav shadow-sm border-b border-border' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item) => (
                <button
                  key={item?.label}
                  onClick={() => scrollToSection(item?.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-150 font-medium focus-ring rounded-md px-2 py-1"
                >
                  {item?.label}
                </button>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/authentication-portal'}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button 
                variant="default"
                onClick={() => window.location.href = '/authentication-portal'}
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus-ring"
              aria-label="Toggle mobile menu"
            >
              <Icon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
              />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-300 md:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 w-64 h-full bg-card border-l border-border shadow-lg">
            <div className="p-6 space-y-6">
              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.label}
                    onClick={() => scrollToSection(item?.href)}
                    className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-150 font-medium py-2 focus-ring rounded-md"
                  >
                    {item?.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/authentication-portal';
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="default"
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/authentication-portal';
                  }}
                  iconName="ArrowRight"
                  iconPosition="right"
                  iconSize={16}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicHeader;