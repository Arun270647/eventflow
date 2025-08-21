import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubmissionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isSubmitting = false,
  formData = {},
  className = ""
}) => {
  if (!isOpen) return null;

  const getCompletionStats = () => {
    const requiredFields = [
      'firstName', 'lastName', 'stageName', 'email', 'phone',
      'primaryGenre', 'primaryInstrument', 'experienceLevel',
      'bio', 'artistStatement'
    ];
    
    const completedRequired = requiredFields?.filter(field => 
      formData?.[field] && formData?.[field]?.toString()?.trim() !== ''
    )?.length;
    
    const optionalCompleted = [
      formData?.portfolioLinks?.length > 0,
      formData?.uploadedFiles?.length > 0,
      formData?.musicalInfluences,
      formData?.careerHighlights
    ]?.filter(Boolean)?.length;

    return {
      required: completedRequired,
      totalRequired: requiredFields?.length,
      optional: optionalCompleted,
      totalOptional: 4
    };
  };

  const stats = getCompletionStats();
  const isComplete = stats?.required === stats?.totalRequired;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative bg-card border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Submit Application
            </h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus-ring"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Completion Status */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Icon 
                name={isComplete ? "CheckCircle" : "AlertCircle"} 
                size={20} 
                className={isComplete ? "text-success" : "text-warning"}
              />
              <span className="text-sm font-medium text-foreground">
                Application Status
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Required fields:</span>
                <span className={`font-medium ${
                  stats?.required === stats?.totalRequired ? 'text-success' : 'text-warning'
                }`}>
                  {stats?.required}/{stats?.totalRequired}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Optional sections:</span>
                <span className="font-medium text-foreground">
                  {stats?.optional}/{stats?.totalOptional}
                </span>
              </div>
              
              <div className="w-full bg-border rounded-full h-2 mt-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-success' : 'bg-warning'
                  }`}
                  style={{ 
                    width: `${(stats?.required / stats?.totalRequired) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Application Summary */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Application Summary
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Artist Name:</span>
                <span className="text-foreground font-medium">
                  {formData?.stageName || 'Not provided'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primary Genre:</span>
                <span className="text-foreground capitalize">
                  {formData?.primaryGenre || 'Not selected'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience:</span>
                <span className="text-foreground capitalize">
                  {formData?.experienceLevel || 'Not selected'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Portfolio Links:</span>
                <span className="text-foreground">
                  {formData?.portfolioLinks?.length || 0} link{formData?.portfolioLinks?.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Files Uploaded:</span>
                <span className="text-foreground">
                  {formData?.uploadedFiles?.length || 0} file{formData?.uploadedFiles?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Warning for incomplete application */}
          {!isComplete && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-warning mb-1">
                    Incomplete Application
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Some required fields are missing. Please complete all required sections before submitting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submission Info */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  What happens next?
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your application will be reviewed within 3-5 business days</li>
                  <li>• You'll receive an email confirmation immediately</li>
                  <li>• Check your application status in the artist portal</li>
                  <li>• We'll notify you of our decision via email</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              fullWidth
            >
              Review Application
            </Button>
            
            <Button
              variant="default"
              onClick={onConfirm}
              disabled={!isComplete || isSubmitting}
              loading={isSubmitting}
              iconName={isSubmitting ? undefined : "Send"}
              iconPosition="right"
              iconSize={16}
              fullWidth
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>

          {/* Terms reminder */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            By submitting this application, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;