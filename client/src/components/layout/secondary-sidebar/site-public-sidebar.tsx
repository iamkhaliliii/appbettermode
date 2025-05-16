import React from 'react';

interface SitePublicSidebarProps {
  currentSiteIdentifier: string;
  currentPath: string;
}

export function SitePublicSidebar({ currentSiteIdentifier, currentPath }: SitePublicSidebarProps) {
  console.log('Site Identifier in SitePublicSidebar:', currentSiteIdentifier);
  console.log('Current Path in SitePublicSidebar:', currentPath);
  return (
    <div>
      <p>Public Sidebar for: {currentSiteIdentifier}</p>
      {/* Placeholder for public site navigation or context */}
      <ul>
        <li><a href={`/site/${currentSiteIdentifier}/`}>Home</a></li>
        <li><a href={`/site/${currentSiteIdentifier}/search`}>Search</a></li>
      </ul>
    </div>
  );
} 