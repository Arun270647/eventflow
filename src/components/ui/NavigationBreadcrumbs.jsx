import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = ({ 
  customBreadcrumbs = null,
  showHome = true,
  className = ""
}) => {
  const location = useLocation();

  // Route to breadcrumb mapping
  const routeBreadcrumbs = {
    '/premium-landing-page': [
      { label: 'Home', path: '/premium-landing-page' }
    ],
    '/authentication-portal': [
      { label: 'Home', path: '/premium-landing-page' },
      { label: 'Authentication', path: '/authentication-portal' }
    ],
    '/admin-dashboard': [
      { label: 'Admin', path: '/admin-dashboard' },
      { label: 'Dashboard', path: '/admin-dashboard' }
    ],
    '/artist-portal-dashboard': [
      { label: 'Artist Portal', path: '/artist-portal-dashboard' },
      { label: 'Dashboard', path: '/artist-portal-dashboard' }
    ],
    '/artist-application-form': [
      { label: 'Artist Portal', path: '/artist-portal-dashboard' },
      { label: 'Application Form', path: '/artist-application-form' }
    ],
    '/user-portal-dashboard': [
      { label: 'User Portal', path: '/user-portal-dashboard' },
      { label: 'Dashboard', path: '/user-portal-dashboard' }
    ]
  };

  // Use custom breadcrumbs if provided, otherwise generate from route
  const breadcrumbs = customBreadcrumbs || routeBreadcrumbs?.[location?.pathname] || [
    { label: 'Dashboard', path: location?.pathname }
  ];

  // Don't show breadcrumbs on landing page unless custom ones are provided
  if (location?.pathname === '/premium-landing-page' && !customBreadcrumbs) {
    return null;
  }

  const handleNavigation = (path, event) => {
    // Allow default link behavior for navigation
    if (path === location?.pathname) {
      event?.preventDefault();
    }
  };

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {showHome && location?.pathname !== '/premium-landing-page' && (
        <>
          <Link
            to="/premium-landing-page"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-150 focus-ring rounded px-1 py-0.5"
          >
            <Icon name="Home" size={16} className="mr-1" />
            <span>Home</span>
          </Link>
          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
        </>
      )}
      {breadcrumbs?.map((crumb, index) => {
        const isLast = index === breadcrumbs?.length - 1;
        const isActive = crumb?.path === location?.pathname;

        return (
          <React.Fragment key={crumb?.path || index}>
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            )}
            {isLast || isActive ? (
              <span 
                className="text-foreground font-medium px-1 py-0.5"
                aria-current="page"
              >
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                onClick={(e) => handleNavigation(crumb?.path, e)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 focus-ring rounded px-1 py-0.5"
              >
                {crumb?.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default NavigationBreadcrumbs;