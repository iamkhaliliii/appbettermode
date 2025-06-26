"use client";

import React from "react";
import { ProfileCarousel, ProfileCard } from "@/components/ui/profile-carousel";

// Sample profile data
const profileData = [
  {
    id: 'profile-1',
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://i.pravatar.cc/300?img=1',
    timeAgo: '12m ago',
    isOnline: true,
    role: 'Developer'
  },
  {
    id: 'profile-2',
    name: 'Sarah Chen',
    username: 'sarahchen',
    avatar: 'https://i.pravatar.cc/300?img=2',
    timeAgo: '1h ago',
    isOnline: true,
    role: 'Designer'
  },
  {
    id: 'profile-3',
    name: 'Mike Rodriguez',
    username: 'mikerod',
    avatar: 'https://i.pravatar.cc/300?img=3',
    timeAgo: '3h ago',
    isOnline: false,
    role: 'Product Manager'
  },
  {
    id: 'profile-4',
    name: 'Emily Watson',
    username: 'emilyw',
    avatar: 'https://i.pravatar.cc/300?img=4',
    timeAgo: '5h ago',
    isOnline: true,
    role: 'Engineer'
  },
  {
    id: 'profile-5',
    name: 'Alex Kim',
    username: 'alexkim',
    avatar: 'https://i.pravatar.cc/300?img=5',
    timeAgo: '1d ago',
    isOnline: false,
    role: 'Marketing'
  },
  {
    id: 'profile-6',
    name: 'Lisa Park',
    username: 'lisapark',
    avatar: 'https://i.pravatar.cc/300?img=6',
    timeAgo: '2d ago',
    isOnline: true,
    role: 'Data Analyst'
  }
];

export default function ProfileCarouselDemo() {
  const handleAddMember = (profileId: string) => {
    console.log('Adding member:', profileId);
    // Handle add member logic here
  };

  const cards = profileData.map((profile, index) => (
    <ProfileCard 
      key={profile.id} 
      profile={profile} 
      index={index}
      onAddMember={handleAddMember}
    />
  ));

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Community Members
      </h2>
      <div className="w-full overflow-x-hidden">
        <ProfileCarousel items={cards} />
      </div>
    </div>
  );
} 