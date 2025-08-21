import React from 'react';
import Icon from '../../../components/AppIcon';
import { EventCard } from './EventCard';

const RecommendedEvents = ({ events, onFavorite, onShare, onBookTicket }) => {
  const mockRecommendedEvents = [
    {
      id: 'rec-1',
      title: 'Jazz Under the Stars',
      artist: 'Sarah Mitchell Quartet',
      genre: 'Jazz',
      date: '2025-08-25',
      time: '19:30',
      venue: 'Central Park Amphitheater, New York',
      price: 45,
      originalPrice: 55,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      status: 'available',
      isFavorited: false,
      reason: 'Based on your jazz preferences'
    },
    {
      id: 'rec-2',
      title: 'Electronic Fusion Night',
      artist: 'Digital Dreams',
      genre: 'Electronic',
      date: '2025-08-28',
      time: '21:00',
      venue: 'The Warehouse, Los Angeles',
      price: 35,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
      status: 'selling-fast',
      isFavorited: true,
      reason: 'Popular in your area'
    },
    {
      id: 'rec-3',
      title: 'Acoustic Sunset Session',
      artist: 'Emma Rodriguez',
      genre: 'Folk',
      date: '2025-08-30',
      time: '18:00',
      venue: 'Rooftop Gardens, Miami',
      price: 25,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      status: 'available',
      isFavorited: false,
      reason: 'Similar to events you\'ve attended'
    }
  ];

  const recommendedEvents = events || mockRecommendedEvents;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Recommended for You
            </h2>
            <p className="text-sm text-muted-foreground">
              Personalized event suggestions based on your preferences
            </p>
          </div>
        </div>
        
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-150 focus-ring rounded px-2 py-1">
          View All
        </button>
      </div>
      {/* Recommendation Reasons */}
      <div className="flex flex-wrap gap-2">
        {Array.from(new Set(recommendedEvents.map(event => event.reason)))?.map((reason, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border"
          >
            {reason}
          </span>
        ))}
      </div>
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendedEvents?.map((event) => (
          <div key={event?.id} className="relative">
            <EventCard
              event={event}
              onFavorite={onFavorite}
              onShare={onShare}
              onBookTicket={onBookTicket}
            />
            
            {/* Recommendation Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full shadow-sm border-2 border-background">
                <Icon name="Sparkles" size={12} className="inline mr-1" />
                Recommended
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {recommendedEvents?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Sparkles" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Recommendations Yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Attend a few events and mark some artists as favorites to get personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;