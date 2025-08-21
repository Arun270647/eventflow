import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedHeader } from '../../components/ui/AuthenticatedHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import { ApplicationStatusCard } from './components/ApplicationStatusCard';
import UpcomingEventsCarousel from './components/UpcomingEventsCarousel';
import ProfileCompletionCard from './components/ProfileCompletionCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickStatsGrid from './components/QuickStatsGrid';
import EventApplicationModal from './components/EventApplicationModal';

import Button from '../../components/ui/Button';

const ArtistPortalDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock user data
  const currentUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'artist',
    avatar: null
  };

  // Mock application status data
  const applicationData = {
    status: 'approved',
    approvedDate: 'August 15, 2025',
    artistId: 'ART-2025-001',
    submittedDate: 'August 10, 2025',
    feedback: null
  };

  // Mock profile completion data
  const profileData = {
    basicInfo: true,
    bio: true,
    portfolio: false,
    experience: true,
    availability: false
  };

  // Mock statistics data
  const statsData = {
    totalApplications: 12,
    eventsParticipated: 8,
    pendingApplications: 3,
    profileViews: 156,
    applicationsChange: 15,
    eventsChange: 25,
    pendingChange: -10,
    viewsChange: 32
  };

  // Mock upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Summer Jazz Festival',
      description: 'A celebration of jazz music featuring local and international artists in the heart of downtown.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      venue: 'Central Park Amphitheater',
      date: 'September 15, 2025',
      time: '7:00 PM - 11:00 PM',
      capacity: '2,000',
      applicationDeadline: 'August 30, 2025',
      applicationStatus: 'available'
    },
    {
      id: 2,
      title: 'Acoustic Nights',
      description: 'An intimate evening of acoustic performances showcasing singer-songwriters and solo artists.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
      venue: 'The Blue Note Cafe',
      date: 'September 22, 2025',
      time: '8:00 PM - 10:30 PM',
      capacity: '150',
      applicationDeadline: 'September 5, 2025',
      applicationStatus: 'applied'
    },
    {
      id: 3,
      title: 'Rock the City',
      description: 'High-energy rock concert featuring multiple bands and solo rock artists from across the region.',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop',
      venue: 'Metro Arena',
      date: 'October 8, 2025',
      time: '6:00 PM - 12:00 AM',
      capacity: '5,000',
      applicationDeadline: 'September 20, 2025',
      applicationStatus: 'accepted'
    }
  ];

  // Mock recent activities data
  const recentActivities = [
    {
      id: 1,
      type: 'event_accepted',
      title: 'Application Accepted',
      description: 'Your application for Rock the City has been accepted!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      metadata: {
        eventName: 'Rock the City',
        location: 'Metro Arena'
      }
    },
    {
      id: 2,
      type: 'event_applied',
      title: 'Application Submitted',
      description: 'You applied to perform at Acoustic Nights',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      metadata: {
        eventName: 'Acoustic Nights',
        location: 'The Blue Note Cafe'
      }
    },
    {
      id: 3,
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'You updated your artist bio and experience section',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 4,
      type: 'message_received',
      title: 'New Message',
      description: 'Event organizer sent you a message about upcoming performance',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: 5,
      type: 'application_approved',
      title: 'Artist Application Approved',
      description: 'Congratulations! Your artist application has been approved',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    }
  ];

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/authentication-portal');
  };

  const handleApplyToEvent = (eventId) => {
    const event = upcomingEvents?.find(e => e?.id === eventId);
    setSelectedEvent(event);
    setIsApplicationModalOpen(true);
  };

  const handleSubmitApplication = async (eventId, applicationData) => {
    // Mock API call
    console.log('Submitting application for event:', eventId, applicationData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update event status to 'applied'
    // In a real app, this would be handled by the backend
    console.log('Application submitted successfully');
  };

  const handleEditProfile = () => {
    // Navigate to profile editing or open profile modal
    console.log('Edit profile clicked');
  };

  const customBreadcrumbs = [
    { label: 'Artist Portal', path: '/artist-portal-dashboard' },
    { label: 'Dashboard', path: '/artist-portal-dashboard' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader 
        user={currentUser} 
        onLogout={handleLogout}
      />
      <RoleBasedSidebar
        user={currentUser}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <NavigationBreadcrumbs customBreadcrumbs={customBreadcrumbs} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {currentUser?.name}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your artist profile and discover new performance opportunities
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate('/artist-application-form')}
                  iconName="FileText"
                  iconPosition="left"
                  iconSize={16}
                >
                  New Application
                </Button>
                <Button
                  variant="default"
                  onClick={handleEditProfile}
                  iconName="User"
                  iconPosition="left"
                  iconSize={16}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-8">
            <QuickStatsGrid stats={statsData} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Application Status */}
              <ApplicationStatusCard applicationData={applicationData} />
              
              {/* Upcoming Events Carousel */}
              <UpcomingEventsCarousel 
                events={upcomingEvents}
                onApplyToEvent={handleApplyToEvent}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Completion */}
              <ProfileCompletionCard 
                profileData={profileData}
                onEditProfile={handleEditProfile}
              />
              
              {/* Recent Activity Feed */}
              <RecentActivityFeed activities={recentActivities} />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/artist-application-form')}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Submit Application
              </Button>
              <Button
                variant="outline"
                onClick={handleEditProfile}
                iconName="Edit"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Update Profile
              </Button>
              <Button
                variant="outline"
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Messages
              </Button>
              <Button
                variant="outline"
                iconName="Calendar"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                My Schedule
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Event Application Modal */}
      <EventApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        event={selectedEvent}
        onSubmitApplication={handleSubmitApplication}
      />
    </div>
  );
};

export default ArtistPortalDashboard;