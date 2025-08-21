import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PortfolioLinksSection = ({ 
  formData, 
  errors, 
  onChange,
  className = ""
}) => {
  const portfolioLinks = formData?.portfolioLinks || [{ platform: '', url: '', description: '' }];

  const platformOptions = [
    { value: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
    { value: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/your-profile' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/channel/...' },
    { value: 'bandcamp', label: 'Bandcamp', placeholder: 'https://yourname.bandcamp.com' },
    { value: 'apple-music', label: 'Apple Music', placeholder: 'https://music.apple.com/artist/...' },
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-profile' },
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/your-page' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@your-profile' },
    { value: 'website', label: 'Personal Website', placeholder: 'https://your-website.com' },
    { value: 'other', label: 'Other', placeholder: 'https://...' }
  ];

  const addPortfolioLink = () => {
    const newLinks = [...portfolioLinks, { platform: '', url: '', description: '' }];
    onChange('portfolioLinks', newLinks);
  };

  const removePortfolioLink = (index) => {
    if (portfolioLinks?.length > 1) {
      const newLinks = portfolioLinks?.filter((_, i) => i !== index);
      onChange('portfolioLinks', newLinks);
    }
  };

  const updatePortfolioLink = (index, field, value) => {
    const newLinks = [...portfolioLinks];
    newLinks[index] = { ...newLinks?.[index], [field]: value };
    onChange('portfolioLinks', newLinks);
  };

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getPlatformPlaceholder = (platform) => {
    const option = platformOptions?.find(opt => opt?.value === platform);
    return option ? option?.placeholder : 'https://...';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Portfolio & Social Links
        </h3>
        <p className="text-sm text-muted-foreground">
          Share your online presence and music portfolio. Add links to your music, social media, and professional profiles.
        </p>
      </div>
      <div className="space-y-6">
        {portfolioLinks?.map((link, index) => (
          <div key={index} className="p-4 border border-border rounded-lg bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                Link #{index + 1}
                {index === 0 && <span className="text-destructive ml-1">*</span>}
              </h4>
              {portfolioLinks?.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePortfolioLink(index)}
                  iconName="Trash2"
                  iconSize={16}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Platform
                  {index === 0 && <span className="text-destructive ml-1">*</span>}
                </label>
                <select
                  value={link?.platform}
                  onChange={(e) => updatePortfolioLink(index, 'platform', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  required={index === 0}
                >
                  <option value="">Select platform</option>
                  {platformOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                {errors?.[`portfolioLinks.${index}.platform`] && (
                  <p className="text-sm text-destructive mt-1">
                    {errors?.[`portfolioLinks.${index}.platform`]}
                  </p>
                )}
              </div>

              <Input
                label="URL"
                type="url"
                placeholder={getPlatformPlaceholder(link?.platform)}
                value={link?.url}
                onChange={(e) => updatePortfolioLink(index, 'url', e?.target?.value)}
                error={errors?.[`portfolioLinks.${index}.url`]}
                required={index === 0}
              />
            </div>

            <Input
              label="Description (Optional)"
              type="text"
              placeholder="Brief description of this link or what people will find"
              description="Help reviewers understand what they'll see when they visit this link"
              value={link?.description}
              onChange={(e) => updatePortfolioLink(index, 'description', e?.target?.value)}
              error={errors?.[`portfolioLinks.${index}.description`]}
            />

            {link?.url && !validateUrl(link?.url) && (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertTriangle" size={16} />
                <span className="text-sm">Please enter a valid URL starting with http:// or https://</span>
              </div>
            )}

            {link?.url && validateUrl(link?.url) && (
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm">Valid URL format</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={addPortfolioLink}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          disabled={portfolioLinks?.length >= 10}
        >
          Add Another Link
        </Button>
      </div>
      {portfolioLinks?.length >= 10 && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum of 10 portfolio links allowed
        </p>
      )}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Portfolio Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include your best and most recent work</li>
              <li>• Make sure all links are public and accessible</li>
              <li>• Add descriptions to help reviewers understand your content</li>
              <li>• Include a variety of platforms to showcase different aspects of your work</li>
              <li>• Ensure your profiles are professional and up-to-date</li>
            </ul>
          </div>
        </div>
      </div>
      {errors?.portfolioLinks && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{errors?.portfolioLinks}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioLinksSection;