import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AboutSection = () => {
  const features = [
    {
      icon: 'Users',
      title: 'Artist Management',
      description: 'Comprehensive platform for artists to showcase their talent, manage applications, and connect with event organizers.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'Calendar',
      title: 'Event Organization',
      description: 'Streamlined event management tools for administrators to create, manage, and monitor musical events efficiently.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'Heart',
      title: 'User Experience',
      description: 'Intuitive interface for music lovers to discover events, book tickets, and create personalized musical journeys.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: 'Shield',
      title: 'Secure Platform',
      description: 'Enterprise-grade security with JWT authentication, encrypted data storage, and secure payment processing.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Artists', icon: 'Mic' },
    { number: '500+', label: 'Monthly Events', icon: 'Calendar' },
    { number: '50,000+', label: 'Happy Users', icon: 'Users' },
    { number: '99.9%', label: 'Uptime', icon: 'Shield' }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
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
            Why Choose
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EventFlow?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform brings together artists, administrators, and music enthusiasts in one seamless ecosystem designed for the modern music industry.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature?.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature?.icon} size={28} color="white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature?.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature?.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats?.map((stat, index) => (
              <motion.div
                key={stat?.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name={stat?.icon} size={24} color="white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat?.number}
                </div>
                <div className="text-indigo-100 font-medium">
                  {stat?.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
            Experience the Platform
          </h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 lg:p-12">
              <Image
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop"
                alt="EventFlow Platform Dashboard Preview"
                className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;