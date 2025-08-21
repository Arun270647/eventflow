import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';


const RoleBasedSidebar = ({ 
  user = null, 
  isCollapsed = false, 
  onToggleCollapse = () => {},
  className = ""
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data if not provided
  const currentUser = user || {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: null
  };

  const getSidebarItems = () => {
    const roleBasedItems = {
      admin: [
        {
          label: 'Dashboard',
          path: '/admin-dashboard',
          icon: 'LayoutDashboard',
          description: 'Overview & Analytics'
        },
        {
          label: 'Applications',
          path: '/admin-dashboard',
          icon: 'FileText',
          description: 'Review Artist Applications',
          badge: '12'
        },
        {
          label: 'Events',
          path: '/admin-dashboard',
          icon: 'Calendar',
          description: 'Manage Events'
        },
        {
          label: 'Artists',
          path: '/admin-dashboard',
          icon: 'Users',
          description: 'Artist Management'
        },
        {
          label: 'Users',
          path: '/admin-dashboard',
          icon: 'UserCheck',
          description: 'User Management'
        },
        {
          label: 'Analytics',
          path: '/admin-dashboard',
          icon: 'BarChart3',
          description: 'Reports & Insights'
        },
        {
          label: 'Settings',
          path: '/admin-dashboard',
          icon: 'Settings',
          description: 'System Configuration'
        }
      ],
      artist: [
        {
          label: 'Dashboard',
          path: '/artist-portal-dashboard',
          icon: 'LayoutDashboard',
          description: 'Your Overview'
        },
        {
          label: 'Profile',
          path: '/artist-portal-dashboard',
          icon: 'User',
          description: 'Manage Your Profile'
        },
        {
          label: 'Applications',
          path: '/artist-application-form',
          icon: 'FileText',
          description: 'Submit Applications',
          badge: 'New'
        },
        {
          label: 'Portfolio',
          path: '/artist-portal-dashboard',
          icon: 'Image',
          description: 'Showcase Your Work'
        },
        {
          label: 'Events',
          path: '/artist-portal-dashboard',
          icon: 'Calendar',
          description: 'Your Events'
        },
        {
          label: 'Messages',
          path: '/artist-portal-dashboard',
          icon: 'MessageSquare',
          description: 'Communications',
          badge: '3'
        },
        {
          label: 'Earnings',
          path: '/artist-portal-dashboard',
          icon: 'DollarSign',
          description: 'Financial Overview'
        }
      ],
      user: [
        {
          label: 'Dashboard',
          path: '/user-portal-dashboard',
          icon: 'LayoutDashboard',
          description: 'Your Overview'
        },
        {
          label: 'Discover',
          path: '/user-portal-dashboard',
          icon: 'Search',
          description: 'Find Events'
        },
        {
          label: 'My Events',
          path: '/user-portal-dashboard',
          icon: 'Calendar',
          description: 'Upcoming Events'
        },
        {
          label: 'Bookings',
          path: '/user-portal-dashboard',
          icon: 'Ticket',
          description: 'Your Bookings',
          badge: '2'
        },
        {
          label: 'Favorites',
          path: '/user-portal-dashboard',
          icon: 'Heart',
          description: 'Saved Events'
        },
        {
          label: 'Profile',
          path: '/user-portal-dashboard',
          icon: 'User',
          description: 'Account Settings'
        }
      ]
    };

    return roleBasedItems?.[currentUser?.role] || [];
  };

  const sidebarItems = getSidebarItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border z-150 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-border">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors duration-150 focus-ring"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={20} 
              className="text-muted-foreground"
            />
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} color="var(--color-primary)" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {currentUser?.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems?.map((item) => (
            <button
              key={item?.label}
              onClick={() => handleNavigation(item?.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-150 focus-ring group ${
                location?.pathname === item?.path
                  ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={isCollapsed ? item?.label : ''}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`flex-shrink-0 ${
                  location?.pathname === item?.path ? 'text-primary' : ''
                }`}
              />
              
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {item?.label}
                      </span>
                      {item?.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                          item?.badge === 'New' ?'bg-success/10 text-success' :'bg-primary/10 text-primary'
                        }`}>
                          {item?.badge}
                        </span>
                      )}
                    </div>
                    {item?.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {item?.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-150 focus-ring text-muted-foreground hover:text-foreground hover:bg-muted ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Help & Support' : ''}
          >
            <Icon name="HelpCircle" size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Help & Support</span>
            )}
          </button>
          
          <button
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-150 focus-ring text-muted-foreground hover:text-foreground hover:bg-muted ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Settings' : ''}
          >
            <Icon name="Settings" size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RoleBasedSidebar;