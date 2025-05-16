import React from 'react';

interface SitePublicSidebarProps {
  siteIdentifier: string;
  currentPath: string;
}

export function SitePublicSidebar({ siteIdentifier, currentPath }: SitePublicSidebarProps) {
  console.log('Site Identifier in SitePublicSidebar:', siteIdentifier);
  console.log('Current Path in SitePublicSidebar:', currentPath);
  return (
    <div>
      <p>Public Sidebar for: {siteIdentifier}</p>
      {/* Placeholder for public site navigation or context */}
      <ul>
        <li><a href={`/site/${siteIdentifier}/`}>Home</a></li>
        <li><a href={`/site/${siteIdentifier}/search`}>Search</a></li>
      </ul>
    </div>
  );
} 