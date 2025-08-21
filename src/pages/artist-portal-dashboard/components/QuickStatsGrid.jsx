import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsGrid = ({ stats }) => {
  const statItems = [
    {
      id: 'total_applications',
      label: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats?.applicationsChange || null
    },
    {
      id: 'events_participated',
      label: 'Events Participated',
      value: stats?.eventsParticipated || 0,
      icon: 'Calendar',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: stats?.eventsChange || null
    },
    {
      id: 'pending_applications',
      label: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.pendingChange || null
    },
    {
      id: 'profile_views',
      label: 'Profile Views',
      value: stats?.profileViews || 0,
      icon: 'Eye',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: stats?.viewsChange || null
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'k';
    }
    return num?.toString();
  };

  const getChangeColor = (change) => {
    if (!change) return '';
    return change > 0 ? 'text-success' : 'text-destructive';
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    return change > 0 ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item) => (
        <div key={item?.id} className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${item?.bgColor} flex items-center justify-center`}>
              <Icon name={item?.icon} size={24} className={item?.color} />
            </div>
            {item?.change && (
              <div className={`flex items-center space-x-1 ${getChangeColor(item?.change)}`}>
                <Icon name={getChangeIcon(item?.change)} size={16} />
                <span className="text-sm font-medium">
                  {Math.abs(item?.change)}%
                </span>
              </div>
            )}
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(item?.value)}
            </div>
            <div className="text-sm text-muted-foreground">
              {item?.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;