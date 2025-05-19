import React from 'react';

interface GlobalAdminSidebarProps {
  currentPath: string;
}

export function GlobalAdminSidebar({ currentPath }: GlobalAdminSidebarProps) {
  console.log('Current Path in GlobalAdminSidebar:', currentPath);
  return (
    <div>
      <p>Global Admin Sidebar</p>
      {/* Placeholder for global navigation links */}
      <ul>
        <li><a href="/sites">Sites</a></li>
        <li><a href="/users">Users (Placeholder)</a></li>
        <li><a href="/settings">Global Settings (Placeholder)</a></li>
      </ul>
    </div>
  );
} 