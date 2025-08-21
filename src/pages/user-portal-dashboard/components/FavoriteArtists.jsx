import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FavoriteArtists = ({ artists, onFollowToggle, onViewProfile }) => {
  const mockFavoriteArtists = [
    {
      id: 'artist-1',
      name: 'Sarah Mitchell',
      genre: 'Jazz',
      followers: 12500,
      upcomingEvents: 3,
      image: 'https://images.unsplash.com/photo-1494790108755-2616c9c9b8d2?w=150&h=150&fit=crop&crop=face',
      isFollowing: true,
      lastActive: '2 days ago',
      bio: 'Award-winning jazz vocalist and composer'
    },
    {
      id: 'artist-2',
      name: 'Digital Dreams',
      genre: 'Electronic',
      followers: 8900,
      upcomingEvents: 2,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isFollowing: true,
      lastActive: '1 week ago',
      bio: 'Electronic music producer and DJ'
    },
    {
      id: 'artist-3',
      name: 'Emma Rodriguez',
      genre: 'Folk',
      followers: 5600,
      upcomingEvents: 1,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isFollowing: true,
      lastActive: '3 days ago',
      bio: 'Singer-songwriter with acoustic soul'
    },
    {
      id: 'artist-4',
      name: 'The Midnight Collective',
      genre: 'Rock',
      followers: 15200,
      upcomingEvents: 4,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isFollowing: true,
      lastActive: '5 days ago',
      bio: 'Alternative rock band from Seattle'
    }
  ];

  const favoriteArtists = artists || mockFavoriteArtists;
  const [localArtists, setLocalArtists] = useState(favoriteArtists);

  const handleFollowToggle = (artistId) => {
    setLocalArtists(prev => 
      prev?.map(artist => 
        artist?.id === artistId 
          ? { ...artist, isFollowing: !artist?.isFollowing }
          : artist
      )
    );
    onFollowToggle?.(artistId);
  };

  const formatFollowers = (count) => {
    if (count >= 1000) {
      return `${(count / 1000)?.toFixed(1)}k`;
    }
    return count?.toString();
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Favorite Artists
            </h2>
            <p className="text-sm text-muted-foreground">
              Artists you follow and their latest updates
            </p>
          </div>
        </div>
        
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-150 focus-ring rounded px-2 py-1">
          Discover More
        </button>
      </div>
      {/* Artists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {localArtists?.map((artist) => (
          <div
            key={artist?.id}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-sm transition-all duration-150 group"
          >
            {/* Artist Image and Follow Button */}
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
                <Image
                  src={artist?.image}
                  alt={artist?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => handleFollowToggle(artist?.id)}
                className="absolute -top-1 -right-1 w-8 h-8 bg-background border-2 border-card rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-150 focus-ring"
                title={artist?.isFollowing ? 'Unfollow' : 'Follow'}
              >
                <Icon
                  name="Heart"
                  size={14}
                  className={artist?.isFollowing ? 'text-red-500 fill-current' : 'text-muted-foreground'}
                />
              </button>
            </div>

            {/* Artist Info */}
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
                {artist?.name}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {artist?.genre}
              </p>
              
              {artist?.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {artist?.bio}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {formatFollowers(artist?.followers)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Followers
                </p>
              </div>
              
              <div className="w-px h-8 bg-border"></div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {artist?.upcomingEvents}
                </p>
                <p className="text-xs text-muted-foreground">
                  Events
                </p>
              </div>
            </div>

            {/* Last Active */}
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Active {artist?.lastActive}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onViewProfile?.(artist)}
                iconName="User"
                iconPosition="left"
              >
                View Profile
              </Button>
              
              {artist?.upcomingEvents > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="Calendar"
                  iconPosition="left"
                  className="text-primary hover:text-primary/80"
                >
                  View Events ({artist?.upcomingEvents})
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {localArtists?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Heart" size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Favorite Artists Yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start following artists to get updates about their upcoming events and new releases.
          </p>
          <Button
            variant="default"
            iconName="Search"
            iconPosition="left"
          >
            Discover Artists
          </Button>
        </div>
      )}
      {/* Quick Actions */}
      {localArtists?.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            iconName="Bell"
            iconPosition="left"
            className="flex-1"
          >
            Notification Settings
          </Button>
          
          <Button
            variant="outline"
            iconName="Share2"
            iconPosition="left"
            className="flex-1"
          >
            Share Favorites
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            Export List
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoriteArtists;