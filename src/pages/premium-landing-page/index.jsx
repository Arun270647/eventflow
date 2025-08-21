import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PublicHeader from '../../components/ui/PublicHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import EventsSection from './components/EventsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

const PremiumLandingPage = () => {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup on unmount
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>EventFlow - Premium Musical Event Management Platform</title>
        <meta 
          name="description" 
          content="Connect artists, administrators, and music lovers through our comprehensive event management platform. Discover, create, and experience unforgettable musical moments with EventFlow." 
        />
        <meta 
          name="keywords" 
          content="music events, event management, artist booking, concert tickets, music platform, event organizer" 
        />
        <meta name="author" content="EventFlow" />
        <meta property="og:title" content="EventFlow - Premium Musical Event Management Platform" />
        <meta 
          property="og:description" 
          content="Streamline musical event management by connecting artists, administrators, and users through a sophisticated platform." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eventflow.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EventFlow - Premium Musical Event Management Platform" />
        <meta 
          name="twitter:description" 
          content="Connect artists, administrators, and music lovers through our comprehensive event management platform." 
        />
        <link rel="canonical" href="https://eventflow.com" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <PublicHeader />

        {/* Main Content */}
        <main className="relative">
          {/* Hero Section */}
          <HeroSection />

          {/* About Section */}
          <AboutSection />

          {/* Events Section */}
          <EventsSection />

          {/* Testimonials Section */}
          <TestimonialsSection />

          {/* Contact Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default PremiumLandingPage;