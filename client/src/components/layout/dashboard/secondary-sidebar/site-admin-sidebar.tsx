import React from 'react';

interface SiteAdminSidebarProps {
  siteIdentifier: string;
  currentPath: string;
}

export const SiteAdminSidebar: React.FC<SiteAdminSidebarProps> = ({ siteIdentifier, currentPath }) => {
  console.log('Site Identifier in SiteAdminSidebar:', siteIdentifier);
  console.log('Current Path in SiteAdminSidebar:', currentPath);
  return (
    <div>
      <p>Site Admin Sidebar for: {siteIdentifier}</p>
      {/* Placeholder for site-specific admin navigation links */}
      <ul>
        <li><a href={`/dashboard/site/${siteIdentifier}/content`}>Content</a></li>
        <li><a href={`/dashboard/site/${siteIdentifier}/people`}>People</a></li>
        <li><a href={`/dashboard/site/${siteIdentifier}/settings`}>Settings</a></li>
      </ul>
    </div>
  );
};