import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UpcomingEventsCarousel = ({ events, onApplyToEvent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events?.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events?.length) % events?.length);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10 border-success/20';
      case 'applied':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'accepted':
        return 'text-success bg-success/10 border-success/20';
      case 'closed':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return 'Calendar';
      case 'applied':
        return 'Clock';
      case 'accepted':
        return 'CheckCircle';
      case 'closed':
        return 'Lock';
      default:
        return 'Calendar';
    }
  };

  if (!events || events?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Events Available</h3>
        <p className="text-muted-foreground">Check back later for new event opportunities.</p>
      </div>
    );
  }

  const currentEvent = events?.[currentIndex];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              disabled={events?.length <= 1}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {events?.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={events?.length <= 1}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Discover and apply to musical events
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Image */}
          <div className="lg:col-span-1">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={currentEvent?.image}
                alt={currentEvent?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  {currentEvent?.title}
                </h4>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {currentEvent?.description}
                </p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(currentEvent?.applicationStatus)}`}>
                <Icon name={getStatusIcon(currentEvent?.applicationStatus)} size={14} />
                <span className="text-xs font-medium capitalize">
                  {currentEvent?.applicationStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{currentEvent?.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{currentEvent?.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{currentEvent?.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{currentEvent?.capacity} capacity</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-sm">
                <span className="text-muted-foreground">Application deadline:</span>
                <p className="font-medium text-foreground">{currentEvent?.applicationDeadline}</p>
              </div>
              
              {currentEvent?.applicationStatus === 'available' && (
                <Button
                  variant="default"
                  onClick={() => onApplyToEvent(currentEvent?.id)}
                  iconName="Send"
                  iconPosition="right"
                  iconSize={16}
                >
                  Apply Now
                </Button>
              )}
              
              {currentEvent?.applicationStatus === 'applied' && (
                <Button variant="outline" disabled>
                  Application Submitted
                </Button>
              )}
              
              {currentEvent?.applicationStatus === 'accepted' && (
                <Button variant="success">
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Accepted
                </Button>
              )}
              
              {currentEvent?.applicationStatus === 'closed' && (
                <Button variant="ghost" disabled>
                  Applications Closed
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsCarousel;