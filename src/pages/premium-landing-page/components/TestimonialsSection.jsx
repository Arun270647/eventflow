import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Professional Jazz Singer',
      userType: 'Artist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: `EventFlow transformed my career as an independent artist. The platform made it incredibly easy to connect with event organizers and showcase my portfolio. I've booked more gigs in the past 6 months than I did in the previous 2 years!`,rating: 5,location: 'New York, NY',joinDate: 'March 2024'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',role: 'Event Coordinator',userType: 'Admin',avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',content: `As an event coordinator, I need reliable tools to manage multiple events simultaneously. EventFlow's admin dashboard is intuitive and powerful. The artist application system streamlined our booking process by 70%. Absolutely game-changing!`,
      rating: 5,
      location: 'Los Angeles, CA',
      joinDate: 'January 2024'
    },
    {
      id: 3,
      name: 'Emily Chen',
      role: 'Music Enthusiast',
      userType: 'User',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: `I love discovering new artists and events through EventFlow. The user interface is beautiful and finding events that match my taste is effortless. I've attended 15 amazing concerts this year, all discovered through this platform!`,
      rating: 5,
      location: 'Chicago, IL',joinDate: 'February 2024'
    },
    {
      id: 4,
      name: 'David Thompson',role: 'Classical Pianist',userType: 'Artist',avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: `The portfolio management features are exceptional. I can showcase my performances, share recordings, and connect with venues all in one place. EventFlow helped me transition from local performances to national tours.`,
      rating: 5,
      location: 'Boston, MA',joinDate: 'April 2024'
    },
    {
      id: 5,
      name: 'Lisa Park',role: 'Venue Manager',userType: 'Admin',avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',content: `Managing our venue's event calendar has never been easier. The platform's booking system and artist verification process gives us confidence in every booking. Our venue utilization increased by 40% since joining EventFlow.`,
      rating: 5,
      location: 'Seattle, WA',joinDate: 'May 2024'
    },
    {
      id: 6,
      name: 'James Wilson',role: 'Music Producer',userType: 'User',avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: `EventFlow is my go-to platform for scouting new talent. The artist profiles are comprehensive, and I've discovered several artists who are now signed to our label. It's an invaluable resource for industry professionals.`,
      rating: 5,
      location: 'Nashville, TN',joinDate: 'June 2024'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, []);

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'Artist':
        return 'from-purple-500 to-pink-500';
      case 'Admin':
        return 'from-blue-500 to-indigo-500';
      case 'User':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 })?.map((_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of artists, administrators, and music lovers who trust EventFlow to elevate their musical experiences.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 lg:p-12 shadow-xl"
          >
            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="Quote" size={28} color="white" />
              </div>
            </div>

            {/* Testimonial Content */}
            <blockquote className="text-lg lg:text-xl text-gray-700 text-center leading-relaxed mb-8">
              "{testimonials?.[currentTestimonial]?.content}"
            </blockquote>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {renderStars(testimonials?.[currentTestimonial]?.rating)}
              </div>
            </div>

            {/* Author Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <Image
                  src={testimonials?.[currentTestimonial]?.avatar}
                  alt={testimonials?.[currentTestimonial]?.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${getUserTypeColor(testimonials?.[currentTestimonial]?.userType)} rounded-full border-2 border-white flex items-center justify-center`}>
                  <Icon 
                    name={testimonials?.[currentTestimonial]?.userType === 'Artist' ? 'Mic' : testimonials?.[currentTestimonial]?.userType === 'Admin' ? 'Shield' : 'User'} 
                    size={12} 
                    color="white" 
                  />
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h4 className="text-xl font-bold text-gray-900">
                  {testimonials?.[currentTestimonial]?.name}
                </h4>
                <p className="text-gray-600 font-medium">
                  {testimonials?.[currentTestimonial]?.role}
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    <span>{testimonials?.[currentTestimonial]?.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Calendar" size={14} className="mr-1" />
                    <span>Joined {testimonials?.[currentTestimonial]?.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
            >
              <Icon name="ChevronLeft" size={20} className="text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-indigo-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
            >
              <Icon name="ChevronRight" size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600">Monthly Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;