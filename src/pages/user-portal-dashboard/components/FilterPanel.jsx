import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  className = ""
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const genreOptions = [
    { value: 'all', label: 'All Genres' },
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Classical' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'hip-hop', label: 'Hip Hop' },
    { value: 'country', label: 'Country' },
    { value: 'blues', label: 'Blues' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'miami', label: 'Miami, FL' },
    { value: 'austin', label: 'Austin, TX' },
    { value: 'seattle', label: 'Seattle, WA' },
    { value: 'nashville', label: 'Nashville, TN' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      genre: 'all',
      location: 'all',
      priceRange: 'all',
      dateRange: 'all',
      availableOnly: false,
      favoriteArtists: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-300 lg:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-card border-l border-border shadow-lg">
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-80 bg-card border border-border rounded-xl p-6 ${className}`}>
        <FilterContent />
      </div>
    </>
  );

  function FilterContent() {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border lg:border-b-0">
          <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Filter" size={20} />
            <span>Filters</span>
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus-ring"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        {/* Filter Content */}
        <div className="flex-1 space-y-6 py-6 overflow-y-auto">
          {/* Search */}
          <div>
            <Input
              label="Search Events"
              type="search"
              placeholder="Search by event name, artist..."
              value={localFilters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />
          </div>

          {/* Genre Filter */}
          <div>
            <Select
              label="Genre"
              options={genreOptions}
              value={localFilters?.genre}
              onChange={(value) => handleFilterChange('genre', value)}
            />
          </div>

          {/* Location Filter */}
          <div>
            <Select
              label="Location"
              options={locationOptions}
              value={localFilters?.location}
              onChange={(value) => handleFilterChange('location', value)}
              searchable
            />
          </div>

          {/* Price Range */}
          <div>
            <Select
              label="Price Range"
              options={priceRanges}
              value={localFilters?.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
            />
          </div>

          {/* Date Range */}
          <div>
            <Select
              label="Date Range"
              options={[
                { value: 'all', label: 'Any Time' },
                { value: 'today', label: 'Today' },
                { value: 'tomorrow', label: 'Tomorrow' },
                { value: 'this-week', label: 'This Week' },
                { value: 'this-month', label: 'This Month' },
                { value: 'next-month', label: 'Next Month' }
              ]}
              value={localFilters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Additional Options</h3>
            
            <Checkbox
              label="Available tickets only"
              description="Show only events with available tickets"
              checked={localFilters?.availableOnly}
              onChange={(e) => handleFilterChange('availableOnly', e?.target?.checked)}
            />

            <Checkbox
              label="Favorite artists only"
              description="Show only events from your favorite artists"
              checked={localFilters?.favoriteArtists}
              onChange={(e) => handleFilterChange('favoriteArtists', e?.target?.checked)}
            />
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col space-y-3 pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            onClick={handleApplyFilters}
            iconName="Check"
            iconPosition="left"
          >
            Apply Filters
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={handleResetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset All
          </Button>
        </div>
      </div>
    );
  }
};

export default FilterPanel;