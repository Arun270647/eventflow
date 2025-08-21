import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'For Artists', href: '/authentication-portal' },
        { label: 'For Venues', href: '/authentication-portal' },
        { label: 'For Fans', href: '/authentication-portal' },
        { label: 'Event Management', href: '/authentication-portal' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'API Documentation', href: '#' },
        { label: 'Community Guidelines', href: '#' },
        { label: 'Success Stories', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#' },
        { label: 'Press Kit', href: '#' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'GDPR Compliance', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: 'Facebook', url: 'https://facebook.com/eventflow', label: 'Facebook' },
    { icon: 'Twitter', url: 'https://twitter.com/eventflow', label: 'Twitter' },
    { icon: 'Instagram', url: 'https://instagram.com/eventflow', label: 'Instagram' },
    { icon: 'Linkedin', url: 'https://linkedin.com/company/eventflow', label: 'LinkedIn' },
    { icon: 'Youtube', url: 'https://youtube.com/eventflow', label: 'YouTube' }
  ];

  const scrollToSection = (sectionId) => {
    if (sectionId?.startsWith('#')) {
      const element = document.querySelector(sectionId);
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = (href, e) => {
    if (href?.startsWith('#')) {
      e?.preventDefault();
      scrollToSection(href);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Stay in the Loop
            </h3>
            <p className="text-gray-400 mb-8">
              Get the latest updates on new events, featured artists, and platform enhancements delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition-colors duration-200"
              />
              <Button
                variant="default"
                iconName="Send"
                iconPosition="right"
                className="sm:w-auto"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link 
              to="/premium-landing-page" 
              className="flex items-center space-x-2 mb-6 focus-ring rounded-lg"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Music" size={24} color="white" />
              </div>
              <span className="text-2xl font-bold">EventFlow</span>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting the music community through innovative event management solutions. Empowering artists, venues, and fans to create unforgettable experiences.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.label}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 focus-ring"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections?.map((section) => (
            <div key={section?.title} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white">
                {section?.title}
              </h4>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.label}>
                    {link?.href?.startsWith('#') ? (
                      <button
                        onClick={(e) => handleLinkClick(link?.href, e)}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm focus-ring rounded"
                      >
                        {link?.label}
                      </button>
                    ) : link?.href?.startsWith('/') ? (
                      <Link
                        to={link?.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm focus-ring rounded"
                      >
                        {link?.label}
                      </Link>
                    ) : (
                      <a
                        href={link?.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm focus-ring rounded"
                      >
                        {link?.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} EventFlow. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Icon name="Shield" size={16} />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Lock" size={16} />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Icon name="Globe" size={16} />
                <span>English (US)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Icon name="DollarSign" size={16} />
                <span>USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;