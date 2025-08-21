import React from 'react';
import Icon from '../../../components/AppIcon';

const FormProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepLabels = [],
  className = ""
}) => {
  const defaultLabels = [
    'Personal Info',
    'Musical Background', 
    'Portfolio Links',
    'Bio & Statement',
    'File Uploads',
    'Review & Submit'
  ];

  const labels = stepLabels?.length > 0 ? stepLabels : defaultLabels;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 mb-6 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Application Progress
          </span>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      {/* Step Indicators - Desktop */}
      <div className="hidden md:flex items-center justify-between">
        {labels?.slice(0, totalSteps)?.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                isCompleted 
                  ? 'bg-success text-success-foreground' 
                  : isCurrent 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  stepNumber
                )}
              </div>
              
              <span className={`text-xs mt-2 text-center max-w-20 leading-tight ${
                isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
              
              {index < totalSteps - 1 && (
                <div className={`absolute h-0.5 w-full mt-4 -z-10 ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`} 
                style={{ 
                  left: '50%', 
                  right: `-${100 / (totalSteps - 1)}%`,
                  transform: 'translateY(-50%)'
                }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Step Indicators - Mobile */}
      <div className="md:hidden">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            'bg-primary text-primary-foreground'
          }`}>
            {currentStep}
          </div>
          <span className="text-sm font-medium text-foreground">
            {labels?.[currentStep - 1]}
          </span>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          {currentStep > 1 && (
            <span className="text-success">
              {currentStep - 1} step{currentStep - 1 !== 1 ? 's' : ''} completed
            </span>
          )}
          {currentStep > 1 && currentStep < totalSteps && <span> • </span>}
          {currentStep < totalSteps && (
            <span>
              {totalSteps - currentStep} step{totalSteps - currentStep !== 1 ? 's' : ''} remaining
            </span>
          )}
        </div>
      </div>
      {/* Completion Status */}
      {currentStep === totalSteps && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              Application ready for submission!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormProgressIndicator;