import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const defaultStats = {
    upcomingEvents: 3,
    totalBookings: 12,
    favoriteArtists: 8,
    savedEvents: 15
  };

  const currentStats = { ...defaultStats, ...stats };

  const statItems = [
    {
      label: 'Upcoming Events',
      value: currentStats?.upcomingEvents,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Total Bookings',
      value: currentStats?.totalBookings,
      icon: 'Ticket',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Favorite Artists',
      value: currentStats?.favoriteArtists,
      icon: 'Heart',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Saved Events',
      value: currentStats?.savedEvents,
      icon: 'Bookmark',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow duration-150"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${item?.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon
                name={item?.icon}
                size={20}
                className={item?.color}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-bold text-foreground">
                {item?.value}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {item?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;