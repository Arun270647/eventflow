import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { artistService } from '../../services/artistService';
import { AuthenticatedHeader } from '../../components/ui/AuthenticatedHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import form section components
import PersonalInfoSection from './components/PersonalInfoSection';
import MusicalBackgroundSection from './components/MusicalBackgroundSection';
import PortfolioLinksSection from './components/PortfolioLinksSection';
import BioSection from './components/BioSection';
import FileUploadSection from './components/FileUploadSection';
import FormProgressIndicator from './components/FormProgressIndicator';
import SubmissionModal from './components/SubmissionModal';

const ArtistApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const totalSteps = 6;
  const stepLabels = [
    'Personal Info',
    'Musical Background', 
    'Portfolio Links',
    'Bio & Statement',
    'File Uploads',
    'Review & Submit'
  ];

  // Current user data from auth context
  const currentUser = {
    name: user?.user_metadata?.full_name || user?.email || 'Artist',
    email: user?.email || '',
    role: 'artist',
    avatar: null
  };

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('artistApplicationDraft');
    const savedStep = localStorage.getItem('artistApplicationStep');
    
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        setFormData(parsedData);
        setLastSavedAt(new Date(parsedData.lastSaved || Date.now()));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(formData)?.length > 0) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  const saveDraft = () => {
    const draftData = {
      ...formData,
      lastSaved: Date.now()
    };
    
    localStorage.setItem('artistApplicationDraft', JSON.stringify(draftData));
    localStorage.setItem('artistApplicationStep', currentStep?.toString());
    setIsDraftSaved(true);
    setLastSavedAt(new Date());
    
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Personal Info
        if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData?.stageName?.trim()) newErrors.stageName = 'Stage/Artist name is required';
        if (!formData?.email?.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';
        if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (!formData?.address?.trim()) newErrors.address = 'Address is required';
        if (!formData?.city?.trim()) newErrors.city = 'City is required';
        if (!formData?.state?.trim()) newErrors.state = 'State is required';
        if (!formData?.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData?.country?.trim()) newErrors.country = 'Country is required';
        if (!formData?.dateOfBirth?.trim()) newErrors.dateOfBirth = 'Date of birth is required';
        else {
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          const age = today?.getFullYear() - birthDate?.getFullYear();
          if (age < 18) newErrors.dateOfBirth = 'Must be 18 years or older';
        }
        break;

      case 2: // Musical Background
        if (!formData?.primaryGenre?.trim()) newErrors.primaryGenre = 'Primary genre is required';
        if (!formData?.primaryInstrument?.trim()) newErrors.primaryInstrument = 'Primary instrument is required';
        if (!formData?.experienceLevel?.trim()) newErrors.experienceLevel = 'Experience level is required';
        if (!formData?.performanceType?.trim()) newErrors.performanceType = 'Performance type is required';
        if (!formData?.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
        if (!formData?.performanceExperience?.length) newErrors.performanceExperience = 'Select at least one performance experience';
        break;

      case 3: // Portfolio Links
        if (!formData?.portfolioLinks?.length || !formData?.portfolioLinks?.[0]?.platform || !formData?.portfolioLinks?.[0]?.url) {
          newErrors.portfolioLinks = 'At least one portfolio link is required';
        } else {
          formData?.portfolioLinks?.forEach((link, index) => {
            if (link?.url && !/^https?:\/\/.+/?.test(link?.url)) {
              newErrors[`portfolioLinks.${index}.url`] = 'Please enter a valid URL';
            }
          });
        }
        break;

      case 4: // Bio & Statement
        if (!formData?.bio?.trim()) newErrors.bio = 'Artist bio is required';
        else if (formData?.bio?.length < 100) newErrors.bio = 'Bio must be at least 100 characters';
        if (!formData?.artistStatement?.trim()) newErrors.artistStatement = 'Artist statement is required';
        else if (formData?.artistStatement?.length < 50) newErrors.artistStatement = 'Statement must be at least 50 characters';
        break;

      case 5: // File Uploads (optional)
        // No required validations for file uploads
        break;

      case 6: // Review & Submit
        // Final validation happens in submission modal
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        saveDraft();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get current user from auth context
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // Submit application to database
      const applicationData = await artistService.submitArtistApplication(formData, user.id);
      
      // Clear saved draft
      localStorage.removeItem('artistApplicationDraft');
      localStorage.removeItem('artistApplicationStep');
      
      // Show success and redirect
      alert('Application submitted successfully! You will receive a confirmation email once reviewed by our team.');
      navigate('/artist-portal-dashboard');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`There was an error submitting your application: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      setShowSubmissionModal(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoSection
            formData={formData}
            errors={errors}
            onChange={handleFormChange}
          />
        );
      case 2:
        return (
          <MusicalBackgroundSection
            formData={formData}
            errors={errors}
            onChange={handleFormChange}
          />
        );
      case 3:
        return (
          <PortfolioLinksSection
            formData={formData}
            errors={errors}
            onChange={handleFormChange}
          />
        );
      case 4:
        return (
          <BioSection
            formData={formData}
            errors={errors}
            onChange={handleFormChange}
          />
        );
      case 5:
        return (
          <FileUploadSection
            formData={formData}
            errors={errors}
            onChange={handleFormChange}
          />
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Review & Submit
              </h3>
              <p className="text-sm text-muted-foreground">
                Please review your application before submitting. You can go back to make changes if needed.
              </p>
            </div>
            {/* Application Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground">{formData?.firstName} {formData?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stage Name:</span>
                      <span className="text-foreground font-medium">{formData?.stageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{formData?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground">{formData?.city}, {formData?.state}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Musical Background</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Primary Genre:</span>
                      <span className="text-foreground capitalize">{formData?.primaryGenre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instrument:</span>
                      <span className="text-foreground capitalize">{formData?.primaryInstrument}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="text-foreground capitalize">{formData?.experienceLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Years:</span>
                      <span className="text-foreground">{formData?.yearsOfExperience} years</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Portfolio & Content</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Portfolio Links:</span>
                      <span className="text-foreground">{formData?.portfolioLinks?.length || 0} links</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded Files:</span>
                      <span className="text-foreground">{formData?.uploadedFiles?.length || 0} files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bio Length:</span>
                      <span className="text-foreground">{formData?.bio?.length || 0} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statement Length:</span>
                      <span className="text-foreground">{formData?.artistStatement?.length || 0} characters</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">
                      Application Complete
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your application is ready for submission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader user={currentUser} />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <NavigationBreadcrumbs />
            
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Artist Application Form
              </h1>
              <p className="text-muted-foreground">
                Complete your application to join EventFlow as a featured artist. 
                All required fields must be completed before submission.
              </p>
            </div>

            {/* Draft Status */}
            {lastSavedAt && (
              <div className="mt-4 flex items-center space-x-2 text-sm">
                <Icon 
                  name={isDraftSaved ? "Check" : "Clock"} 
                  size={16} 
                  className={isDraftSaved ? "text-success" : "text-muted-foreground"}
                />
                <span className={isDraftSaved ? "text-success" : "text-muted-foreground"}>
                  {isDraftSaved 
                    ? "Draft saved" 
                    : `Last saved: ${lastSavedAt?.toLocaleTimeString()}`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <FormProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />

          {/* Form Content */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                iconName="ChevronLeft"
                iconPosition="left"
                iconSize={16}
              >
                Previous
              </Button>
              
              <Button
                variant="ghost"
                onClick={saveDraft}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
              >
                Save Draft
              </Button>
            </div>

            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ChevronRight"
                  iconPosition="right"
                  iconSize={16}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setShowSubmissionModal(true)}
                  iconName="Send"
                  iconPosition="right"
                  iconSize={16}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-muted/30 border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="HelpCircle" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  If you have questions about the application process or need assistance, we're here to help.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <button className="text-primary hover:underline">
                    Application Guidelines
                  </button>
                  <button className="text-primary hover:underline">
                    Contact Support
                  </button>
                  <button className="text-primary hover:underline">
                    FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Submission Modal */}
      <SubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onConfirm={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
      />
    </div>
  );
};

export default ArtistApplicationForm;