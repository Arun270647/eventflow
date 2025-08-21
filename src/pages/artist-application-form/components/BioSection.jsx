import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BioSection = ({ 
  formData, 
  errors, 
  onChange,
  className = ""
}) => {
  const [bioCharCount, setBioCharCount] = useState(0);
  const [artistStatementCharCount, setArtistStatementCharCount] = useState(0);
  
  const maxBioLength = 1000;
  const maxArtistStatementLength = 500;
  const minBioLength = 100;
  const minArtistStatementLength = 50;

  useEffect(() => {
    setBioCharCount((formData?.bio || '')?.length);
    setArtistStatementCharCount((formData?.artistStatement || '')?.length);
  }, [formData?.bio, formData?.artistStatement]);

  const handleBioChange = (e) => {
    const value = e?.target?.value;
    if (value?.length <= maxBioLength) {
      onChange('bio', value);
      setBioCharCount(value?.length);
    }
  };

  const handleArtistStatementChange = (e) => {
    const value = e?.target?.value;
    if (value?.length <= maxArtistStatementLength) {
      onChange('artistStatement', value);
      setArtistStatementCharCount(value?.length);
    }
  };

  const getCharCountColor = (current, min, max) => {
    if (current < min) return 'text-warning';
    if (current >= max - 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Artist Bio & Statement
        </h3>
        <p className="text-sm text-muted-foreground">
          Tell your story and share your artistic vision. This helps event organizers understand who you are as an artist.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Artist Bio
            <span className="text-destructive ml-1">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Write a compelling biography that tells your musical story, influences, and journey as an artist.
          </p>
          
          <div className="relative">
            <textarea
              value={formData?.bio || ''}
              onChange={handleBioChange}
              placeholder={`Tell your story as an artist. Include your musical journey, influences, achievements, and what makes your music unique. This bio will be used to introduce you to potential audiences and event organizers.\n\nExample: "Sarah Johnson is a singer-songwriter from Nashville who blends folk and indie rock with heartfelt lyrics about love, loss, and finding hope. Drawing inspiration from artists like Joni Mitchell and Bon Iver, she has performed at over 50 venues across the Southeast..."`}
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows="8"
              required
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {bioCharCount >= minBioLength && (
                <Icon name="CheckCircle" size={16} className="text-success" />
              )}
              <span className={`text-xs ${getCharCountColor(bioCharCount, minBioLength, maxBioLength)}`}>
                {bioCharCount}/{maxBioLength}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 text-xs">
              <span className={bioCharCount >= minBioLength ? 'text-success' : 'text-warning'}>
                Minimum: {minBioLength} characters
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Recommended: {Math.floor(maxBioLength * 0.7)}-{maxBioLength} characters
              </span>
            </div>
          </div>
          
          {errors?.bio && (
            <p className="text-sm text-destructive mt-1">{errors?.bio}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Artist Statement
            <span className="text-destructive ml-1">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            A brief statement about your artistic vision, goals, and what you hope to achieve through your music.
          </p>
          
          <div className="relative">
            <textarea
              value={formData?.artistStatement || ''}
              onChange={handleArtistStatementChange}
              placeholder={`Share your artistic vision and goals. What drives your creativity? What message do you want to convey through your music?\n\nExample: "My music explores themes of resilience and human connection. I believe music has the power to heal and bring people together, and I strive to create songs that resonate with listeners on a deep emotional level."`}
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows="5"
              required
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {artistStatementCharCount >= minArtistStatementLength && (
                <Icon name="CheckCircle" size={16} className="text-success" />
              )}
              <span className={`text-xs ${getCharCountColor(artistStatementCharCount, minArtistStatementLength, maxArtistStatementLength)}`}>
                {artistStatementCharCount}/{maxArtistStatementLength}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 text-xs">
              <span className={artistStatementCharCount >= minArtistStatementLength ? 'text-success' : 'text-warning'}>
                Minimum: {minArtistStatementLength} characters
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Keep it concise and impactful
              </span>
            </div>
          </div>
          
          {errors?.artistStatement && (
            <p className="text-sm text-destructive mt-1">{errors?.artistStatement}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Musical Influences"
          type="text"
          placeholder="e.g., Bob Dylan, Radiohead, Nina Simone"
          description="List 3-5 artists who have influenced your music"
          value={formData?.musicalInfluences || ''}
          onChange={(e) => onChange('musicalInfluences', e?.target?.value)}
          error={errors?.musicalInfluences}
        />

        <Input
          label="Career Highlights"
          type="text"
          placeholder="e.g., Opened for major artist, Album release, Award"
          description="Notable achievements or milestones in your career"
          value={formData?.careerHighlights || ''}
          onChange={(e) => onChange('careerHighlights', e?.target?.value)}
          error={errors?.careerHighlights}
        />
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="PenTool" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Writing Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Write in third person for your bio ("Sarah is a singer-songwriter...")</li>
              <li>• Include specific achievements, venues, or collaborations</li>
              <li>• Mention your unique style or what sets you apart</li>
              <li>• Keep your artist statement personal and authentic</li>
              <li>• Proofread for grammar and spelling errors</li>
              <li>• Avoid overly technical music terminology</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {bioCharCount >= minBioLength ? '✓' : bioCharCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Bio Progress
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {artistStatementCharCount >= minArtistStatementLength ? '✓' : artistStatementCharCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Statement Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioSection;