import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Jazz Under the Stars',
      artist: 'Sarah Mitchell Quartet',
      date: '2025-01-15',
      time: '8:00 PM',
      venue: 'Central Park Amphitheater',
      location: 'New York, NY',
      price: '$45',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      category: 'Jazz',
      attendees: 250,
      featured: true
    },
    {
      id: 2,
      title: 'Rock Revolution Festival',
      artist: 'Multiple Artists',
      date: '2025-01-22',
      time: '6:00 PM',
      venue: 'Madison Square Garden',
      location: 'New York, NY',
      price: '$85',
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
      category: 'Rock',
      attendees: 1200,
      featured: true
    },
    {
      id: 3,
      title: 'Classical Evening Gala',
      artist: 'Metropolitan Orchestra',
      date: '2025-01-28',
      time: '7:30 PM',
      venue: 'Lincoln Center',
      location: 'New York, NY',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=300&fit=crop',
      category: 'Classical',
      attendees: 800,
      featured: false
    },
    {
      id: 4,
      title: 'Electronic Nights',
      artist: 'DJ Alex Storm',
      date: '2025-02-05',
      time: '10:00 PM',
      venue: 'Brooklyn Warehouse',
      location: 'Brooklyn, NY',
      price: '$35',
      image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?w=400&h=300&fit=crop',
      category: 'Electronic',
      attendees: 500,
      featured: false
    },
    {
      id: 5,
      title: 'Acoustic Sessions',
      artist: 'Emma Rodriguez',
      date: '2025-02-12',
      time: '7:00 PM',
      venue: 'Blue Note Cafe',
      location: 'Greenwich Village, NY',
      price: '$25',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      category: 'Acoustic',
      attendees: 150,
      featured: false
    },
    {
      id: 6,
      title: 'Hip Hop Showcase',
      artist: 'Various Artists',
      date: '2025-02-18',
      time: '9:00 PM',
      venue: 'Apollo Theater',
      location: 'Harlem, NY',
      price: '$55',
      image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?w=400&h=300&fit=crop',
      category: 'Hip Hop',
      attendees: 600,
      featured: true
    }
  ];

  const eventsPerSlide = 3;
  const totalSlides = Math.ceil(upcomingEvents?.length / eventsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentEvents = () => {
    const startIndex = currentSlide * eventsPerSlide;
    return upcomingEvents?.slice(startIndex, startIndex + eventsPerSlide);
  };

  return (
    <section id="events" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-indigo-50">
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
            Upcoming
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Musical Events
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing musical experiences happening near you. From intimate acoustic sessions to grand orchestral performances.
          </p>
        </motion.div>

        {/* Events Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              {Array.from({ length: totalSlides })?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
              >
                <Icon name="ChevronLeft" size={20} className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
              >
                <Icon name="ChevronRight" size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {getCurrentEvents()?.map((event, index) => (
              <motion.div
                key={event?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  {/* Event Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={event?.image}
                      alt={event?.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {event?.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                      {event?.category}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {formatDate(event?.date)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {event?.time}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {event?.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      by {event?.artist}
                    </p>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <Icon name="MapPin" size={16} className="mr-2" />
                      <span>{event?.venue}, {event?.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          {event?.price}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Icon name="Users" size={16} className="mr-1" />
                          <span>{event?.attendees}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ExternalLink"
                        iconPosition="right"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* View All Events CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => window.location.href = '/authentication-portal'}
            iconName="Calendar"
            iconPosition="left"
            className="px-8 py-4"
          >
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;