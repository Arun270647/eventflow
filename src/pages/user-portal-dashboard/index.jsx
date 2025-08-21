import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedHeader } from '../../components/ui/AuthenticatedHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Import components
import { EventCard } from './components/EventCard';
import FilterPanel from './components/FilterPanel';
import QuickStats from './components/QuickStats';
import RecommendedEvents from './components/RecommendedEvents';
import { BookingHistory } from './components/BookingHistory';
import FavoriteArtists from './components/FavoriteArtists';

const UserPortalDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('discover');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    genre: 'all',
    location: 'all',
    priceRange: 'all',
    dateRange: 'all',
    availableOnly: false,
    favoriteArtists: false
  });

  // Mock user data
  const currentUser = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'user',
    avatar: null
  };

  // Mock stats data
  const mockStats = {
    totalEvents: 156,
    upcomingEvents: 24,
    favoriteArtists: 8,
    ticketsBooked: 12
  };

  // Mock events data
  const mockEvents = [
    {
      id: 'event-1',
      title: 'Summer Music Festival 2025',
      artist: 'Various Artists',
      genre: 'Pop',
      date: '2025-09-15',
      time: '14:00',
      venue: 'Central Park, New York',
      price: 85,
      originalPrice: 95,
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
      status: 'available',
      isFavorited: false
    },
    {
      id: 'event-2',
      title: 'Jazz Night at Blue Note',
      artist: 'Sarah Mitchell Quartet',
      genre: 'Jazz',
      date: '2025-08-28',
      time: '20:00',
      venue: 'Blue Note, Chicago',
      price: 45,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      status: 'selling-fast',
      isFavorited: true
    },
    {
      id: 'event-3',
      title: 'Electronic Fusion Night',
      artist: 'Digital Dreams',
      genre: 'Electronic',
      date: '2025-08-30',
      time: '21:00',
      venue: 'The Warehouse, Los Angeles',
      price: 35,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
      status: 'available',
      isFavorited: false
    },
    {
      id: 'event-4',
      title: 'Acoustic Sunset Session',
      artist: 'Emma Rodriguez',
      genre: 'Folk',
      date: '2025-09-05',
      time: '18:00',
      venue: 'Rooftop Gardens, Miami',
      price: 25,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      status: 'available',
      isFavorited: false
    },
    {
      id: 'event-5',
      title: 'Rock Legends Tribute',
      artist: 'The Midnight Collective',
      genre: 'Rock',
      date: '2025-09-10',
      time: '19:30',
      venue: 'Madison Square Garden, New York',
      price: 75,
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&fit=crop',
      status: 'available',
      isFavorited: true
    },
    {
      id: 'event-6',
      title: 'Classical Symphony Evening',
      artist: 'Metropolitan Orchestra',
      genre: 'Classical',
      date: '2025-09-20',
      time: '19:00',
      venue: 'Symphony Hall, Boston',
      price: 65,
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=300&fit=crop',
      status: 'sold-out',
      isFavorited: false
    }
  ];

  // Mock recommended events
  const mockRecommendedEvents = mockEvents?.slice(0, 3);

  // Mock booking history
  const mockBookings = [
    {
      id: 'booking-1',
      event: {
        title: 'Jazz Night at Blue Note',
        artist: 'Sarah Mitchell Quartet',
        date: '2025-07-15',
        venue: 'Blue Note, Chicago'
      },
      tickets: 2,
      totalPrice: 90,
      status: 'confirmed',
      purchaseDate: '2025-06-01'
    },
    {
      id: 'booking-2',
      event: {
        title: 'Electronic Fusion Night',
        artist: 'Digital Dreams',
        date: '2025-06-20',
        venue: 'The Warehouse, Los Angeles'
      },
      tickets: 1,
      totalPrice: 35,
      status: 'attended',
      purchaseDate: '2025-05-15'
    }
  ];

  // Mock favorite artists
  const mockArtists = [
    {
      id: 'artist-1',
      name: 'Sarah Mitchell Quartet',
      genre: 'Jazz',
      followers: 12500,
      isFollowing: true,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop'
    },
    {
      id: 'artist-2',
      name: 'The Midnight Collective',
      genre: 'Rock',
      followers: 45000,
      isFollowing: true,
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&h=150&fit=crop'
    }
  ];

  const [events, setEvents] = useState(mockEvents);

  // Handle user logout
  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/authentication-portal');
  };

  // Handle event favoriting
  const handleFavorite = (eventId, isFavorited) => {
    setEvents(prev => 
      prev?.map(event => 
        event?.id === eventId 
          ? { ...event, isFavorited }
          : event
      )
    );
  };

  // Handle event sharing
  const handleShare = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out ${event?.title} by ${event?.artist}`,
        url: window.location?.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(`${event?.title} by ${event?.artist} - ${window.location?.href}`);
      // You could show a toast notification here
    }
  };

  // Handle ticket booking
  const handleBookTicket = (event) => {
    // In a real app, this would navigate to a booking flow
    console.log('Booking ticket for:', event?.title);
    // You could show a modal or navigate to a booking page
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to events
    // This would typically involve API calls in a real application
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
  };

  // Navigation items for mobile view
  const navigationItems = [
    { id: 'discover', label: 'Discover', icon: 'Search' },
    { id: 'my-events', label: 'My Events', icon: 'Calendar' },
    { id: 'bookings', label: 'Bookings', icon: 'Ticket' },
    { id: 'favorites', label: 'Favorites', icon: 'Heart' },
    { id: 'profile', label: 'Profile', icon: 'User' }
  ];

  // Get filtered events based on current filters
  const getFilteredEvents = () => {
    return events?.filter(event => {
      if (filters?.search && !event?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) && 
          !event?.artist?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }
      if (filters?.genre !== 'all' && event?.genre?.toLowerCase() !== filters?.genre) {
        return false;
      }
      if (filters?.availableOnly && event?.status === 'sold-out') {
        return false;
      }
      if (filters?.favoriteArtists && !event?.isFavorited) {
        return false;
      }
      return true;
    });
  };

  const filteredEvents = getFilteredEvents();

  // Render main content based on active view
  const renderMainContent = () => {
    switch (activeView) {
      case 'discover':
        return (
          <div className="space-y-8">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e?.target?.value)}
                  className="w-full"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                iconName="Filter"
                iconPosition="left"
                className="sm:w-auto"
              >
                Filters
              </Button>
            </div>
            {/* Quick Stats */}
            <QuickStats stats={mockStats} />
            {/* Recommended Events */}
            <RecommendedEvents
              events={mockRecommendedEvents}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onBookTicket={handleBookTicket}
            />
            {/* All Events */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  All Events ({filteredEvents?.length})
                </h2>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm border border-border rounded-lg px-3 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Date</option>
                    <option>Price</option>
                    <option>Popularity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents?.map((event) => (
                  <EventCard
                    key={event?.id}
                    event={event}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                    onBookTicket={handleBookTicket}
                  />
                ))}
              </div>

              {filteredEvents?.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Events Found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Try adjusting your search criteria or filters to find more events.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'my-events':
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Calendar" size={24} color="var(--color-primary)" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                My Events
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your personalized event calendar and schedule will appear here.
              </p>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <BookingHistory
            bookings={mockBookings}
            onViewTicket={(booking) => console.log('View ticket:', booking)}
            onRateEvent={(booking) => console.log('Rate event:', booking)}
          />
        );

      case 'favorites':
        return (
          <FavoriteArtists
            artists={mockArtists}
            onFollowToggle={(artistId) => console.log('Toggle follow:', artistId)}
            onViewProfile={(artist) => console.log('View profile:', artist)}
          />
        );

      case 'profile':
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={24} color="var(--color-primary)" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Profile Settings
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Manage your account settings, preferences, and personal information.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthenticatedHeader 
        user={currentUser} 
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <NavigationBreadcrumbs />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-muted-foreground">
              Discover amazing musical events and manage your bookings
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <nav className="space-y-2">
                  {navigationItems?.map((item) => (
                    <button
                      key={item?.id}
                      onClick={() => setActiveView(item?.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-150 focus-ring ${
                        activeView === item?.id
                          ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={20} />
                      <span className="font-medium">{item?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {renderMainContent()}
            </div>

            {/* Filter Panel (Desktop) */}
            {activeView === 'discover' && (
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <FilterPanel
                    isOpen={false}
                    onClose={() => {}}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Navigation */}
            <div className="flex overflow-x-auto space-x-1 mb-6 pb-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => setActiveView(item?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-ring ${
                    activeView === item?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Content */}
            {renderMainContent()}
          </div>
        </div>
      </main>
      {/* Filter Panel (Mobile) */}
      {activeView === 'discover' && (
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}
    </div>
  );
};

export default UserPortalDashboard;