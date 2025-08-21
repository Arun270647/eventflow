import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const EventApplicationModal = ({ isOpen, onClose, event, onSubmitApplication }) => {
  const [formData, setFormData] = useState({
    performanceType: '',
    duration: '',
    equipment: '',
    specialRequests: '',
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.performanceType?.trim()) {
      newErrors.performanceType = 'Performance type is required';
    }
    
    if (!formData?.duration?.trim()) {
      newErrors.duration = 'Performance duration is required';
    }
    
    if (!formData?.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmitApplication(event?.id, formData);
      onClose();
      // Reset form
      setFormData({
        performanceType: '',
        duration: '',
        equipment: '',
        specialRequests: '',
        agreedToTerms: false
      });
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Apply to Event
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {event?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-150 focus-ring"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Event Details */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{event?.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{event?.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{event?.venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{event?.capacity} capacity</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Performance Type"
            type="text"
            placeholder="e.g., Solo acoustic, Band performance, DJ set"
            value={formData?.performanceType}
            onChange={(e) => handleInputChange('performanceType', e?.target?.value)}
            error={errors?.performanceType}
            required
            description="Describe the type of performance you'll provide"
          />

          <Input
            label="Performance Duration"
            type="text"
            placeholder="e.g., 30 minutes, 1 hour, 2 sets of 45 minutes"
            value={formData?.duration}
            onChange={(e) => handleInputChange('duration', e?.target?.value)}
            error={errors?.duration}
            required
            description="How long will your performance be?"
          />

          <Input
            label="Equipment Requirements"
            type="text"
            placeholder="e.g., Microphone, guitar amp, full PA system"
            value={formData?.equipment}
            onChange={(e) => handleInputChange('equipment', e?.target?.value)}
            description="List any equipment you'll need (optional)"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Special Requests or Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={4}
              placeholder="Any additional information, special requirements, or notes for the event organizers..."
              value={formData?.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="I agree to the terms and conditions"
              description="By checking this box, you agree to the event terms, cancellation policy, and performance guidelines."
              checked={formData?.agreedToTerms}
              onChange={(e) => handleInputChange('agreedToTerms', e?.target?.checked)}
              error={errors?.agreedToTerms}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Send"
              iconPosition="right"
              iconSize={16}
              fullWidth
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventApplicationModal;