import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application_submitted':
        return 'Send';
      case 'application_approved':
        return 'CheckCircle';
      case 'application_rejected':
        return 'XCircle';
      case 'event_applied':
        return 'Calendar';
      case 'event_accepted':
        return 'Star';
      case 'profile_updated':
        return 'Edit';
      case 'message_received':
        return 'MessageSquare';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'application_approved': case'event_accepted':
        return 'text-success';
      case 'application_rejected':
        return 'text-destructive';
      case 'application_submitted': case'event_applied':
        return 'text-primary';
      case 'message_received':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!activities || activities?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent activity to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-150 focus-ring rounded px-2 py-1">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={activity?.id || index} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity?.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity?.description}
                  </p>
                  {activity?.metadata && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {activity?.metadata?.eventName && (
                        <span className="inline-flex items-center space-x-1">
                          <Icon name="Calendar" size={12} />
                          <span>{activity?.metadata?.eventName}</span>
                        </span>
                      )}
                      {activity?.metadata?.location && (
                        <span className="inline-flex items-center space-x-1 ml-3">
                          <Icon name="MapPin" size={12} />
                          <span>{activity?.metadata?.location}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {activities?.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-150 focus-ring rounded px-3 py-2">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;