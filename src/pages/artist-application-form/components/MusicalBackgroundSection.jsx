import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MusicalBackgroundSection = ({ 
  formData, 
  errors, 
  onChange,
  className = ""
}) => {
  const genreOptions = [
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'blues', label: 'Blues' },
    { value: 'country', label: 'Country' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'hip-hop', label: 'Hip Hop' },
    { value: 'r&b', label: 'R&B' },
    { value: 'classical', label: 'Classical' },
    { value: 'folk', label: 'Folk' },
    { value: 'reggae', label: 'Reggae' },
    { value: 'metal', label: 'Metal' },
    { value: 'punk', label: 'Punk' },
    { value: 'indie', label: 'Indie' },
    { value: 'alternative', label: 'Alternative' },
    { value: 'world', label: 'World Music' },
    { value: 'latin', label: 'Latin' },
    { value: 'gospel', label: 'Gospel' },
    { value: 'funk', label: 'Funk' },
    { value: 'other', label: 'Other' }
  ];

  const instrumentOptions = [
    { value: 'vocals', label: 'Vocals' },
    { value: 'guitar', label: 'Guitar' },
    { value: 'bass', label: 'Bass Guitar' },
    { value: 'drums', label: 'Drums' },
    { value: 'piano', label: 'Piano/Keyboard' },
    { value: 'violin', label: 'Violin' },
    { value: 'saxophone', label: 'Saxophone' },
    { value: 'trumpet', label: 'Trumpet' },
    { value: 'flute', label: 'Flute' },
    { value: 'cello', label: 'Cello' },
    { value: 'clarinet', label: 'Clarinet' },
    { value: 'trombone', label: 'Trombone' },
    { value: 'harmonica', label: 'Harmonica' },
    { value: 'banjo', label: 'Banjo' },
    { value: 'mandolin', label: 'Mandolin' },
    { value: 'ukulele', label: 'Ukulele' },
    { value: 'synthesizer', label: 'Synthesizer' },
    { value: 'dj-equipment', label: 'DJ Equipment' },
    { value: 'other', label: 'Other' }
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (3-5 years)' },
    { value: 'advanced', label: 'Advanced (6-10 years)' },
    { value: 'professional', label: 'Professional (10+ years)' }
  ];

  const performanceTypeOptions = [
    { value: 'solo', label: 'Solo Artist' },
    { value: 'band', label: 'Band Member' },
    { value: 'duo', label: 'Duo/Pair' },
    { value: 'ensemble', label: 'Ensemble/Group' },
    { value: 'orchestra', label: 'Orchestra' },
    { value: 'choir', label: 'Choir' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Musical Background
        </h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your musical experience, skills, and performance style.
        </p>
      </div>
      <Select
        label="Primary Genre"
        placeholder="Select your primary musical genre"
        description="Choose the genre that best represents your music"
        options={genreOptions}
        value={formData?.primaryGenre || ''}
        onChange={(value) => onChange('primaryGenre', value)}
        error={errors?.primaryGenre}
        searchable
        required
      />
      <Select
        label="Secondary Genres"
        placeholder="Select additional genres (optional)"
        description="You can select multiple genres that influence your music"
        options={genreOptions}
        value={formData?.secondaryGenres || []}
        onChange={(value) => onChange('secondaryGenres', value)}
        error={errors?.secondaryGenres}
        multiple
        searchable
        clearable
      />
      <Select
        label="Primary Instrument/Skill"
        placeholder="Select your main instrument or skill"
        options={instrumentOptions}
        value={formData?.primaryInstrument || ''}
        onChange={(value) => onChange('primaryInstrument', value)}
        error={errors?.primaryInstrument}
        searchable
        required
      />
      <Select
        label="Additional Instruments/Skills"
        placeholder="Select additional instruments (optional)"
        description="List any other instruments you can play"
        options={instrumentOptions}
        value={formData?.additionalInstruments || []}
        onChange={(value) => onChange('additionalInstruments', value)}
        error={errors?.additionalInstruments}
        multiple
        searchable
        clearable
      />
      <Select
        label="Experience Level"
        placeholder="Select your experience level"
        options={experienceLevelOptions}
        value={formData?.experienceLevel || ''}
        onChange={(value) => onChange('experienceLevel', value)}
        error={errors?.experienceLevel}
        required
      />
      <Select
        label="Performance Type"
        placeholder="How do you typically perform?"
        options={performanceTypeOptions}
        value={formData?.performanceType || ''}
        onChange={(value) => onChange('performanceType', value)}
        error={errors?.performanceType}
        required
      />
      <Input
        label="Years of Experience"
        type="number"
        placeholder="5"
        description="Total years you've been actively making music"
        value={formData?.yearsOfExperience || ''}
        onChange={(e) => onChange('yearsOfExperience', e?.target?.value)}
        error={errors?.yearsOfExperience}
        min="0"
        max="50"
        required
      />
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          Performance Experience
          <span className="text-destructive ml-1">*</span>
        </label>
        <p className="text-xs text-muted-foreground -mt-2">
          Check all that apply to your performance background
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Live venue performances"
            checked={formData?.performanceExperience?.includes('live-venues') || false}
            onChange={(e) => {
              const current = formData?.performanceExperience || [];
              const updated = e?.target?.checked 
                ? [...current, 'live-venues']
                : current?.filter(item => item !== 'live-venues');
              onChange('performanceExperience', updated);
            }}
          />
          
          <Checkbox
            label="Festival performances"
            checked={formData?.performanceExperience?.includes('festivals') || false}
            onChange={(e) => {
              const current = formData?.performanceExperience || [];
              const updated = e?.target?.checked 
                ? [...current, 'festivals']
                : current?.filter(item => item !== 'festivals');
              onChange('performanceExperience', updated);
            }}
          />
          
          <Checkbox
            label="Studio recording"
            checked={formData?.performanceExperience?.includes('studio-recording') || false}
            onChange={(e) => {
              const current = formData?.performanceExperience || [];
              const updated = e?.target?.checked 
                ? [...current, 'studio-recording']
                : current?.filter(item => item !== 'studio-recording');
              onChange('performanceExperience', updated);
            }}
          />
          
          <Checkbox
            label="Online streaming"
            checked={formData?.performanceExperience?.includes('online-streaming') || false}
            onChange={(e) => {
              const current = formData?.performanceExperience || [];
              const updated = e?.target?.checked 
                ? [...current, 'online-streaming']
                : current?.filter(item => item !== 'online-streaming');
              onChange('performanceExperience', updated);
            }}
          />
          
          <Checkbox
            label="Private events"
            checked={formData?.performanceExperience?.includes('private-events') || false}
            onChange={(e) => {
              const current = formData?.performanceExperience || [];
              const updated = e?.target?.checked 
                ? [...current, 'private-events']
                : current?.filter(item => item !== 'private-events');
              onChange('performanceExperience', updated);
            }}
          />
          
          <Checkbox
            label="Street performances"
            checked={formData?.performanceExperience?.includes('street-performances') || false}
            onChange={(e) => {
              const current = formData?.performanceExperience || [];
              const updated = e?.target?.checked 
                ? [...current, 'street-performances']
                : current?.filter(item => item !== 'street-performances');
              onChange('performanceExperience', updated);
            }}
          />
        </div>
        
        {errors?.performanceExperience && (
          <p className="text-sm text-destructive mt-1">{errors?.performanceExperience}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Notable Venues Performed"
          type="text"
          placeholder="e.g., Madison Square Garden, Local Jazz Club"
          description="List 1-2 notable venues where you've performed"
          value={formData?.notableVenues || ''}
          onChange={(e) => onChange('notableVenues', e?.target?.value)}
          error={errors?.notableVenues}
        />

        <Input
          label="Musical Education"
          type="text"
          placeholder="e.g., Berklee College of Music, Self-taught"
          description="Formal education or training background"
          value={formData?.musicalEducation || ''}
          onChange={(e) => onChange('musicalEducation', e?.target?.value)}
          error={errors?.musicalEducation}
        />
      </div>
    </div>
  );
};

export default MusicalBackgroundSection;