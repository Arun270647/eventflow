import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PersonalInfoSection = ({ 
  formData, 
  errors, 
  onChange,
  className = ""
}) => {
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'in', label: 'India' },
    { value: 'jp', label: 'Japan' },
    { value: 'br', label: 'Brazil' },
    { value: 'mx', label: 'Mexico' }
  ];

  const stateOptions = [
    { value: 'al', label: 'Alabama' },
    { value: 'ak', label: 'Alaska' },
    { value: 'az', label: 'Arizona' },
    { value: 'ar', label: 'Arkansas' },
    { value: 'ca', label: 'California' },
    { value: 'co', label: 'Colorado' },
    { value: 'ct', label: 'Connecticut' },
    { value: 'de', label: 'Delaware' },
    { value: 'fl', label: 'Florida' },
    { value: 'ga', label: 'Georgia' },
    { value: 'hi', label: 'Hawaii' },
    { value: 'id', label: 'Idaho' },
    { value: 'il', label: 'Illinois' },
    { value: 'in', label: 'Indiana' },
    { value: 'ia', label: 'Iowa' },
    { value: 'ks', label: 'Kansas' },
    { value: 'ky', label: 'Kentucky' },
    { value: 'la', label: 'Louisiana' },
    { value: 'me', label: 'Maine' },
    { value: 'md', label: 'Maryland' },
    { value: 'ma', label: 'Massachusetts' },
    { value: 'mi', label: 'Michigan' },
    { value: 'mn', label: 'Minnesota' },
    { value: 'ms', label: 'Mississippi' },
    { value: 'mo', label: 'Missouri' },
    { value: 'mt', label: 'Montana' },
    { value: 'ne', label: 'Nebraska' },
    { value: 'nv', label: 'Nevada' },
    { value: 'nh', label: 'New Hampshire' },
    { value: 'nj', label: 'New Jersey' },
    { value: 'nm', label: 'New Mexico' },
    { value: 'ny', label: 'New York' },
    { value: 'nc', label: 'North Carolina' },
    { value: 'nd', label: 'North Dakota' },
    { value: 'oh', label: 'Ohio' },
    { value: 'ok', label: 'Oklahoma' },
    { value: 'or', label: 'Oregon' },
    { value: 'pa', label: 'Pennsylvania' },
    { value: 'ri', label: 'Rhode Island' },
    { value: 'sc', label: 'South Carolina' },
    { value: 'sd', label: 'South Dakota' },
    { value: 'tn', label: 'Tennessee' },
    { value: 'tx', label: 'Texas' },
    { value: 'ut', label: 'Utah' },
    { value: 'vt', label: 'Vermont' },
    { value: 'va', label: 'Virginia' },
    { value: 'wa', label: 'Washington' },
    { value: 'wv', label: 'West Virginia' },
    { value: 'wi', label: 'Wisconsin' },
    { value: 'wy', label: 'Wyoming' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Personal Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Please provide your basic contact information and location details.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData?.firstName || ''}
          onChange={(e) => onChange('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData?.lastName || ''}
          onChange={(e) => onChange('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
        />
      </div>
      <Input
        label="Stage/Artist Name"
        type="text"
        placeholder="Enter your stage or artist name"
        description="This is how you'll be known to audiences"
        value={formData?.stageName || ''}
        onChange={(e) => onChange('stageName', e?.target?.value)}
        error={errors?.stageName}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={formData?.email || ''}
          onChange={(e) => onChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData?.phone || ''}
          onChange={(e) => onChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />
      </div>
      <Input
        label="Street Address"
        type="text"
        placeholder="123 Main Street"
        value={formData?.address || ''}
        onChange={(e) => onChange('address', e?.target?.value)}
        error={errors?.address}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="City"
          type="text"
          placeholder="Enter city"
          value={formData?.city || ''}
          onChange={(e) => onChange('city', e?.target?.value)}
          error={errors?.city}
          required
        />

        <Select
          label="State/Province"
          placeholder="Select state"
          options={stateOptions}
          value={formData?.state || ''}
          onChange={(value) => onChange('state', value)}
          error={errors?.state}
          searchable
          required
        />

        <Input
          label="ZIP/Postal Code"
          type="text"
          placeholder="12345"
          value={formData?.zipCode || ''}
          onChange={(e) => onChange('zipCode', e?.target?.value)}
          error={errors?.zipCode}
          required
        />
      </div>
      <Select
        label="Country"
        placeholder="Select country"
        options={countryOptions}
        value={formData?.country || ''}
        onChange={(value) => onChange('country', value)}
        error={errors?.country}
        searchable
        required
      />
      <Input
        label="Date of Birth"
        type="date"
        value={formData?.dateOfBirth || ''}
        onChange={(e) => onChange('dateOfBirth', e?.target?.value)}
        error={errors?.dateOfBirth}
        description="Must be 18 years or older to apply"
        required
      />
    </div>
  );
};

export default PersonalInfoSection;