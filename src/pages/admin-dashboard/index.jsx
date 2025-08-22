import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { artistService } from '../../services/artistService';
import { emailService } from '../../services/emailService';
import { AuthenticatedHeader } from '../../components/ui/AuthenticatedHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import StatisticsCard from './components/StatisticsCard';
import { ApplicationsTable } from './components/ApplicationsTable';
import FilterBar from './components/FilterBar';
import ActivityFeed from './components/ActivityFeed';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState([]);

  // Admin user data
  const adminUser = {
    name: user?.user_metadata?.full_name || user?.email || 'Admin',
    email: user?.email || '',
    role: 'admin',
    avatar: null
  };

  // Mock activity feed data (in production, this would come from database)
  const [activities] = useState([
    {
      id: 1,
      type: 'application_submitted',
      title: 'New Artist Application',
      description: 'An artist submitted an application for review',
      timestamp: new Date().toISOString(),
      metadata: { user: 'New Artist', location: 'Various' }
    },
    {
      id: 2,
      type: 'application_approved',
      title: 'Application Approved',
      description: 'An artist application has been approved and credentials sent',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metadata: { user: 'Approved Artist' }
    },
    {
      id: 3,
      type: 'user_registered',
      title: 'New User Registration',
      description: 'A new user registered on the platform',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      metadata: { user: 'New User' }
    }
  ]);

  // Load applications from database
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await artistService.getPendingApplications();
      
      // Transform data to match expected format
      const transformedApplications = data.map(app => {
        const formData = JSON.parse(app.admin_notes || '{}');
        const portfolioData = JSON.parse(app.portfolio_attachments || '{}');
        
        return {
          id: app.id,
          artistName: formData.stageName || `${formData.firstName} ${formData.lastName}`,
          email: formData.email || app.artist?.email,
          genre: formData.primaryGenre || 'Unknown',
          experience: parseInt(formData.yearsOfExperience) || 0,
          location: `${formData.city || 'Unknown'}, ${formData.state || 'Unknown'}`,
          phone: formData.phone || 'Not provided',
          submissionDate: app.submitted_at,
          status: app.status,
          bio: formData.bio || '',
          portfolioLinks: portfolioData.portfolioLinks || [],
          formData: formData,
          originalApplication: app
        };
      });
      
      setApplications(transformedApplications);
      
      // Update statistics
      const pending = transformedApplications.filter(app => app.status === 'pending').length;
      const approved = transformedApplications.filter(app => app.status === 'approved').length;
      const total = transformedApplications.length;
      
      setStatistics([
        {
          title: 'Total Applications',
          value: total.toString(),
          change: `+${pending} new`,
          changeType: 'positive',
          icon: 'FileText',
          color: 'primary'
        },
        {
          title: 'Pending Applications',
          value: pending.toString(),
          change: pending > 0 ? `${pending} awaiting review` : 'All reviewed',
          changeType: pending > 0 ? 'warning' : 'positive',
          icon: 'Clock',
          color: 'warning'
        },
        {
          title: 'Approved Artists',
          value: approved.toString(),
          change: approved > 0 ? `${approved} approved` : 'None yet',
          changeType: 'positive',
          icon: 'Check',
          color: 'success'
        },
        {
          title: 'Success Rate',
          value: total > 0 ? `${Math.round((approved / total) * 100)}%` : '0%',
          change: 'Based on total applications',
          changeType: 'positive',
          icon: 'TrendingUp',
          color: 'primary'
        }
      ]);
      
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on search and filters
  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    const matchesDateRange = (!dateRange.start || new Date(app.submissionDate) >= new Date(dateRange.start)) &&
                            (!dateRange.end || new Date(app.submissionDate) <= new Date(dateRange.end));
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleStatusChange = async (applicationId, newStatus, reason = '') => {
    try {
      setLoading(true);
      
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      let result;
      if (newStatus === 'approved') {
        // Approve application and create artist profile
        result = await artistService.approveArtistApplication(applicationId, user.id);
        
        // Send approval email
        try {
          await emailService.sendArtistApprovalEmail({
            email: application.email,
            fullName: `${application.formData.firstName} ${application.formData.lastName}`,
            stageName: application.formData.stageName
          });
          console.log(`Approval email sent to ${application.email}`);
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
          // Continue with approval even if email fails
        }
        
      } else if (newStatus === 'rejected') {
        // Reject application
        result = await artistService.rejectArtistApplication(applicationId, user.id, reason);
        
        // Send rejection email
        try {
          await emailService.sendArtistRejectionEmail({
            email: application.email,
            fullName: `${application.formData.firstName} ${application.formData.lastName}`,
            stageName: application.formData.stageName
          }, reason);
          console.log(`Rejection email sent to ${application.email}`);
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError);
          // Continue with rejection even if email fails
        }
      }

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Show success message
      const action = newStatus === 'approved' ? 'approved' : 'rejected';
      alert(`Application ${action} successfully! ${newStatus === 'approved' ? 'Approval' : 'Rejection'} email has been sent.`);
      
      // Reload applications to get fresh data
      setTimeout(() => {
        loadApplications();
      }, 1000);
      
    } catch (error) {
      console.error(`Error ${newStatus === 'approved' ? 'approving' : 'rejecting'} application:`, error);
      alert(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} application: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      setLoading(true);
      
      const promises = selectedIds.map(id => 
        handleStatusChange(id, action === 'approve' ? 'approved' : 'rejected')
      );
      
      await Promise.all(promises);
      
      console.log(`Bulk ${action} applied to ${selectedIds.length} applications`);
      alert(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} ${selectedIds.length} applications.`);
      
    } catch (error) {
      console.error('Error with bulk action:', error);
      alert(`Failed to perform bulk action: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/authentication-portal');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={24} className="animate-spin mx-auto mb-4" />
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthenticatedHeader user={adminUser} onLogout={handleLogout} />
      
      {/* Sidebar */}
      <RoleBasedSidebar
        user={adminUser}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <NavigationBreadcrumbs />
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage artist applications, users, and system overview
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
                onClick={loadApplications}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Create Event
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <Icon name="AlertTriangle" size={20} className="text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statistics.map((stat, index) => (
              <StatisticsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Applications Section */}
            <div className="xl:col-span-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Artist Applications</h2>
                
                {/* Filter Bar */}
                <FilterBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  onClearFilters={handleClearFilters}
                />

                {/* Applications Table */}
                <ApplicationsTable
                  applications={filteredApplications}
                  onStatusChange={handleStatusChange}
                  onBulkAction={handleBulkAction}
                  loading={loading}
                />
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="xl:col-span-4 space-y-6">
              {/* Activity Feed */}
              <ActivityFeed activities={activities} />

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Zap" size={20} className="mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="UserPlus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Add New User
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Calendar"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Schedule Event
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Mail"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Send Notifications
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Settings"
                    iconPosition="left"
                    iconSize={16}
                  >
                    System Settings
                  </Button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Activity" size={20} className="mr-2" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                      <span className="text-sm text-success">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Service</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                      <span className="text-sm text-success">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applications</span>
                    <span className="text-sm text-foreground">{applications.length} total</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm text-foreground">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;