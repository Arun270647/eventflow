import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      application_submitted: 'FileText',
      application_approved: 'Check',
      application_rejected: 'X',
      user_registered: 'UserPlus',
      event_created: 'Calendar',
      system_update: 'Settings'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      application_submitted: 'text-primary',
      application_approved: 'text-success',
      application_rejected: 'text-error',
      user_registered: 'text-primary',
      event_created: 'text-warning',
      system_update: 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Recent Activity
        </h3>
      </div>
      <div className="p-4">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground font-medium truncate">
                      {activity?.title}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {activity?.description}
                  </p>
                  
                  {activity?.metadata && (
                    <div className="flex items-center mt-2 space-x-4 text-xs text-muted-foreground">
                      {activity?.metadata?.user && (
                        <span className="flex items-center">
                          <Icon name="User" size={12} className="mr-1" />
                          {activity?.metadata?.user}
                        </span>
                      )}
                      {activity?.metadata?.location && (
                        <span className="flex items-center">
                          <Icon name="MapPin" size={12} className="mr-1" />
                          {activity?.metadata?.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;