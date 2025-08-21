import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationModal = ({ application, onClose, onStatusChange }) => {
  const handleStatusChange = (status) => {
    onStatusChange(application?.id, status);
    onClose();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning/10 text-warning', label: 'Pending Review' },
      approved: { color: 'bg-success/10 text-success', label: 'Approved' },
      rejected: { color: 'bg-error/10 text-error', label: 'Rejected' }
    };
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-500 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-xl rounded-lg border border-border">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{application?.artistName}</h2>
                <p className="text-sm text-muted-foreground">{application?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(application?.status)}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-ring"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Genre:</span>
                      <span className="text-foreground font-medium">{application?.genre}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="text-foreground font-medium">{application?.experience} years</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground font-medium">{application?.location}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground font-medium">{application?.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="text-foreground font-medium">
                        {new Date(application.submissionDate)?.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Links */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Portfolio Links</h3>
                  <div className="space-y-3">
                    {application?.portfolioLinks?.map((link, index) => (
                      <a
                        key={index}
                        href={link?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon name="ExternalLink" size={16} className="text-primary" />
                          <span className="text-foreground font-medium">{link?.platform}</span>
                        </div>
                        <Icon name="ArrowUpRight" size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Bio and Additional Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Artist Bio</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {application?.bio}
                    </p>
                  </div>
                </div>

                {/* Application Timeline */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Application Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Application submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.submissionDate)?.toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                    {application?.status !== 'pending' && (
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          application?.status === 'approved' ? 'bg-success' : 'bg-error'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Application {application?.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date()?.toLocaleDateString('en-US')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Application ID: #{application?.id}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              {application?.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange('rejected')}
                    iconName="X"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleStatusChange('approved')}
                    iconName="Check"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Approve Application
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;