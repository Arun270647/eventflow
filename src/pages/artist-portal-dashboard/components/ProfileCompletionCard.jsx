import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileCompletionCard = ({ profileData, onEditProfile }) => {
  const completionItems = [
    {
      id: 'basic_info',
      label: 'Basic Information',
      completed: profileData?.basicInfo,
      description: 'Name, email, phone number'
    },
    {
      id: 'bio',
      label: 'Artist Bio',
      completed: profileData?.bio,
      description: 'Professional biography'
    },
    {
      id: 'portfolio',
      label: 'Portfolio Links',
      completed: profileData?.portfolio,
      description: 'Music samples, videos, social media'
    },
    {
      id: 'experience',
      label: 'Experience & Skills',
      completed: profileData?.experience,
      description: 'Performance history, genres, instruments'
    },
    {
      id: 'availability',
      label: 'Availability',
      completed: profileData?.availability,
      description: 'Performance schedule preferences'
    }
  ];

  const completedCount = completionItems?.filter(item => item?.completed)?.length;
  const completionPercentage = Math.round((completedCount / completionItems?.length) * 100);

  const getProgressColor = () => {
    if (completionPercentage >= 80) return 'bg-success';
    if (completionPercentage >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Profile Completion
          </h3>
          <p className="text-sm text-muted-foreground">
            Complete your profile to increase event opportunities
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{completionPercentage}%</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      {/* Completion Items */}
      <div className="space-y-3 mb-6">
        {completionItems?.map((item) => (
          <div key={item?.id} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              item?.completed 
                ? 'bg-success text-white' :'bg-muted border-2 border-border'
            }`}>
              {item?.completed && <Icon name="Check" size={12} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  item?.completed ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {item?.label}
                </span>
                {item?.completed && (
                  <Icon name="CheckCircle" size={16} className="text-success" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{item?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          onClick={onEditProfile}
          iconName="Edit"
          iconPosition="left"
          iconSize={16}
          fullWidth
        >
          Complete Profile
        </Button>
        {completionPercentage === 100 && (
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Preview Profile
          </Button>
        )}
      </div>
      {/* Completion Tips */}
      {completionPercentage < 100 && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">Pro Tip</p>
              <p className="text-muted-foreground">
                Artists with complete profiles are 3x more likely to be selected for events.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionCard;