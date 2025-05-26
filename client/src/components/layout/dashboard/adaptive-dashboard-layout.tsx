import React from 'react';
import { useLocation } from 'wouter';
import { DashboardLayout } from './dashboard-layout';
import { ModeratorDashboardLayout } from './moderator-dashboard-layout';

interface AdaptiveDashboardLayoutProps {
  children: React.ReactNode;
  currentSiteIdentifier?: string;
  siteName?: string;
}

export function AdaptiveDashboardLayout({ 
  children, 
  currentSiteIdentifier, 
  siteName 
}: AdaptiveDashboardLayoutProps) {
  const [location] = useLocation();
  
  // Determine if we're in moderator context
  const isModerator = location.startsWith('/dashboard/moderator/');
  
  if (isModerator) {
    return (
      <ModeratorDashboardLayout 
        currentSiteIdentifier={currentSiteIdentifier} 
        siteName={siteName}
      >
        {children}
      </ModeratorDashboardLayout>
    );
  }
  
  return (
    <DashboardLayout 
      currentSiteIdentifier={currentSiteIdentifier} 
      siteName={siteName}
    >
      {children}
    </DashboardLayout>
  );
} 