import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
            >
              Elevate Your
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Musical Journey
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Connect artists, administrators, and music lovers through our comprehensive event management platform. Discover, create, and experience unforgettable musical moments.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => window.location.href = '/authentication-portal'}
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('about')}
              iconName="Play"
              iconPosition="left"
              className="w-full sm:w-auto text-lg px-8 py-4 border-2 hover:bg-gray-50 transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 pt-8"
          >
            <div className="flex items-center space-x-2 text-gray-500">
              <Icon name="Shield" size={20} />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Icon name="Users" size={20} />
              <span className="text-sm font-medium">10,000+ Artists</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Icon name="Calendar" size={20} />
              <span className="text-sm font-medium">500+ Events Monthly</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Icon name="Star" size={20} />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={() => scrollToSection('about')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-300 focus-ring"
        >
          <Icon name="ChevronDown" size={24} className="text-gray-600" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;