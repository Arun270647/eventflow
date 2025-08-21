import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialAuthButtons = ({ mode }) => {
  const handleSocialAuth = (provider) => {
    // Mock social authentication
    console.log(`${mode} with ${provider}`);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">
            Or {mode === 'login' ? 'sign in' : 'sign up'} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('Google')}
          className="flex items-center justify-center space-x-2"
        >
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span>Google</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialAuth('GitHub')}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Github" size={20} />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;