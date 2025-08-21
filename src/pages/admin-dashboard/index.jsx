import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock admin user data
  const adminUser = {
    name: 'Sarah Johnson',
    email: 'sarah.admin@eventflow.com',
    role: 'admin',
    avatar: null
  };

  // Mock applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      artistName: 'Marcus Rivera',
      email: 'marcus.rivera@email.com',
      genre: 'Jazz',
      experience: 8,
      location: 'New York, NY',
      phone: '+1 (555) 123-4567',
      submissionDate: '2025-08-18T10:30:00Z',
      status: 'pending',
      bio: `Passionate jazz musician with over 8 years of professional experience. I specialize in contemporary jazz fusion and have performed at numerous venues across the East Coast.\n\nMy musical journey began in college where I studied music theory and composition. Since then, I've been part of several jazz ensembles and have released two independent albums that received critical acclaim in the jazz community.`,
      portfolioLinks: [
        { platform: 'Spotify', url: 'https://spotify.com/marcus-rivera' },
        { platform: 'YouTube', url: 'https://youtube.com/marcus-rivera-music' },
        { platform: 'SoundCloud', url: 'https://soundcloud.com/marcus-rivera' }
      ]
    },
    {
      id: 2,
      artistName: 'Elena Vasquez',email: 'elena.v@email.com',genre: 'Classical',experience: 12,location: 'Los Angeles, CA',phone: '+1 (555) 987-6543',submissionDate: '2025-08-17T14:15:00Z',status: 'approved',
      bio: `Classically trained violinist with 12 years of professional orchestral experience. I have performed with major symphony orchestras and chamber music ensembles worldwide.\n\nMy repertoire spans from Baroque to contemporary classical music, with a particular passion for romantic era compositions. I hold a Master's degree in Violin Performance from Juilliard School.`,
      portfolioLinks: [
        { platform: 'Website', url: 'https://elenavasquez.com' },
        { platform: 'YouTube', url: 'https://youtube.com/elena-violin' }
      ]
    },
    {
      id: 3,
      artistName: 'DJ Phoenix',
      email: 'djphoenix@email.com',
      genre: 'Electronic',
      experience: 5,
      location: 'Miami, FL',
      phone: '+1 (555) 456-7890',
      submissionDate: '2025-08-16T09:45:00Z',
      status: 'pending',
      bio: `Electronic music producer and DJ specializing in progressive house and techno. I've been creating music for 5 years and have performed at major festivals and clubs across the Southeast.\n\nMy sound combines melodic elements with driving beats, creating an immersive experience for dance floors. I use cutting-edge production techniques and live performance technology.`,
      portfolioLinks: [
        { platform: 'SoundCloud', url: 'https://soundcloud.com/dj-phoenix' },
        { platform: 'Mixcloud', url: 'https://mixcloud.com/dj-phoenix' },
        { platform: 'Instagram', url: 'https://instagram.com/djphoenix_official' }
      ]
    },
    {
      id: 4,
      artistName: 'The Harmony Collective',email: 'info@harmonycollective.com',genre: 'Folk',experience: 6,location: 'Nashville, TN',phone: '+1 (555) 321-0987',submissionDate: '2025-08-15T16:20:00Z',status: 'rejected',
      bio: `Four-piece folk band known for our harmonious vocals and acoustic arrangements. We've been performing together for 6 years, drawing inspiration from traditional American folk music while incorporating modern storytelling.\n\nOur music focuses on themes of community, nature, and human connection. We've released three albums and have toured extensively throughout the Midwest and South.`,
      portfolioLinks: [
        { platform: 'Bandcamp', url: 'https://harmonycollective.bandcamp.com' },
        { platform: 'Spotify', url: 'https://spotify.com/harmony-collective' }
      ]
    },
    {
      id: 5,
      artistName: 'Aria Chen',email: 'aria.chen.music@email.com',genre: 'Pop',experience: 3,location: 'San Francisco, CA',phone: '+1 (555) 654-3210',submissionDate: '2025-08-14T11:30:00Z',status: 'pending',
      bio: `Singer-songwriter with a passion for creating catchy pop melodies with meaningful lyrics. Though relatively new to the professional scene with 3 years of experience, I've already gained a strong following on social media platforms.\n\nMy music blends contemporary pop with indie influences, often featuring personal stories and social commentary. I write, perform, and produce all my own material.`,
      portfolioLinks: [
        { platform: 'TikTok', url: 'https://tiktok.com/@ariachen_music' },
        { platform: 'Instagram', url: 'https://instagram.com/aria_chen_music' },
        { platform: 'YouTube', url: 'https://youtube.com/aria-chen-official' }
      ]
    }
  ]);

  // Mock statistics data
  const statistics = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12% from last month',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Pending Applications',
      value: '23',
      change: '+5 new today',
      changeType: 'positive',
      icon: 'FileText',
      color: 'warning'
    },
    {
      title: 'Approved Artists',
      value: '156',
      change: '+8 this week',
      changeType: 'positive',
      icon: 'Check',
      color: 'success'
    },
    {
      title: 'Active Events',
      value: '42',
      change: '+3 upcoming',
      changeType: 'positive',
      icon: 'Calendar',
      color: 'primary'
    }
  ];

  // Mock activity feed data
  const [activities] = useState([
    {
      id: 1,
      type: 'application_submitted',
      title: 'New Artist Application',
      description: 'Marcus Rivera submitted an application for Jazz category',
      timestamp: '2025-08-21T09:30:00Z',
      metadata: { user: 'Marcus Rivera', location: 'New York, NY' }
    },
    {
      id: 2,
      type: 'application_approved',
      title: 'Application Approved',
      description: 'Elena Vasquez application has been approved and credentials sent',
      timestamp: '2025-08-21T08:15:00Z',
      metadata: { user: 'Elena Vasquez' }
    },
    {
      id: 3,
      type: 'user_registered',
      title: 'New User Registration',
      description: 'John Smith registered as a new user',
      timestamp: '2025-08-21T07:45:00Z',
      metadata: { user: 'John Smith' }
    },
    {
      id: 4,
      type: 'event_created',
      title: 'Event Created',
      description: 'Summer Jazz Festival 2025 event has been created',
      timestamp: '2025-08-20T16:20:00Z',
      metadata: { location: 'Central Park, NY' }
    },
    {
      id: 5,
      type: 'application_rejected',
      title: 'Application Rejected',
      description: 'The Harmony Collective application was rejected due to incomplete portfolio',
      timestamp: '2025-08-20T14:10:00Z',
      metadata: { user: 'The Harmony Collective' }
    }
  ]);

  // Filter applications based on search and filters
  const filteredApplications = applications?.filter(app => {
    const matchesSearch = !searchTerm || 
      app?.artistName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      app?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app?.status === statusFilter;
    
    const matchesDateRange = (!dateRange?.start || new Date(app.submissionDate) >= new Date(dateRange.start)) &&
                            (!dateRange?.end || new Date(app.submissionDate) <= new Date(dateRange.end));
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(prev => prev?.map(app => 
      app?.id === applicationId ? { ...app, status: newStatus } : app
    ));
    
    // Mock notification - in real app, this would trigger email notification
    const application = applications?.find(app => app?.id === applicationId);
    if (application) {
      console.log(`Status changed for ${application?.artistName}: ${newStatus}`);
      if (newStatus === 'approved') {
        console.log(`Credentials generated and sent to ${application?.email}`);
      }
    }
  };

  const handleBulkAction = (action, selectedIds) => {
    setApplications(prev => prev?.map(app => 
      selectedIds?.includes(app?.id) ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' } : app
    ));
    console.log(`Bulk ${action} applied to ${selectedIds?.length} applications`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const handleLogout = () => {
    navigate('/authentication-portal');
  };

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
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export Data
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statistics?.map((stat, index) => (
              <StatisticsCard
                key={index}
                title={stat?.title}
                value={stat?.value}
                change={stat?.change}
                changeType={stat?.changeType}
                icon={stat?.icon}
                color={stat?.color}
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
                    <span className="text-sm text-muted-foreground">Server Status</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                      <span className="text-sm text-success">Online</span>
                    </div>
                  </div>
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
                    <span className="text-sm text-muted-foreground">Last Backup</span>
                    <span className="text-sm text-foreground">2 hours ago</span>
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