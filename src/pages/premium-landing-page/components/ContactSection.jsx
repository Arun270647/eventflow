import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: 'Mail',
      title: 'Email Us',
      content: 'support@eventflow.com',
      description: 'Get in touch for support and inquiries',
      action: 'mailto:support@eventflow.com'
    },
    {
      icon: 'Phone',
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      description: 'Available Monday to Friday, 9 AM - 6 PM EST',
      action: 'tel:+15551234567'
    },
    {
      icon: 'MapPin',
      title: 'Visit Us',
      content: '123 Music Avenue, Suite 456',
      description: 'New York, NY 10001, United States',
      action: 'https://maps.google.com/?q=123+Music+Avenue+New+York+NY'
    },
    {
      icon: 'Clock',
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      description: 'Saturday: 10:00 AM - 4:00 PM EST',
      action: null
    }
  ];

  const socialLinks = [
    { icon: 'Facebook', url: 'https://facebook.com/eventflow', label: 'Facebook' },
    { icon: 'Twitter', url: 'https://twitter.com/eventflow', label: 'Twitter' },
    { icon: 'Instagram', url: 'https://instagram.com/eventflow', label: 'Instagram' },
    { icon: 'Linkedin', url: 'https://linkedin.com/company/eventflow', label: 'LinkedIn' },
    { icon: 'Youtube', url: 'https://youtube.com/eventflow', label: 'YouTube' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-indigo-50">
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
            Get In
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about EventFlow? We're here to help you get started on your musical journey. Reach out to our friendly team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-8">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo?.map((info, index) => (
                <motion.div
                  key={info?.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={info?.icon} size={20} color="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {info?.title}
                    </h4>
                    {info?.action ? (
                      <a
                        href={info?.action}
                        className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-300"
                      >
                        {info?.content}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {info?.content}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">
                      {info?.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.label}
                    href={social?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all duration-300 focus-ring"
                    aria-label={social?.label}
                  >
                    <Icon name={social?.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h3>

              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg ${
                    submitStatus === 'success' ?'bg-green-50 text-green-800 border border-green-200' :'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon
                      name={submitStatus === 'success' ? 'CheckCircle' : 'AlertCircle'}
                      size={20}
                      className="mr-2"
                    />
                    <span>
                      {submitStatus === 'success' ?'Message sent successfully! We\'ll get back to you soon.' :'Failed to send message. Please try again.'}
                    </span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  type="text"
                  name="subject"
                  value={formData?.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData?.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  iconName="Send"
                  iconPosition="right"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  By submitting this form, you agree to our{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms of Service
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-64 lg:h-80">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="EventFlow Office Location"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=40.7589,-73.9851&z=14&output=embed"
                className="border-0"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;