"use client";

import React from 'react';
import AdvancedProfileCarousel from './advanced-profile-carousel';

const AdvancedProfileCarouselDemo = () => {
  const profilesData = [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah_dev",
      profileImage: "https://mighty.tools/mockmind-api/content/human/99.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/99.jpg",
      timeAgo: "5m ago",
      role: "Frontend Developer",
      isOnline: true,
      stats: {
        posts: 127,
        followers: 2840,
        following: 194
      }
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "mikechen",
      profileImage: "https://mighty.tools/mockmind-api/content/human/91.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/91.jpg",
      timeAgo: "12m ago",
      role: "Full Stack Developer",
      isOnline: true,
      stats: {
        posts: 89,
        followers: 1567,
        following: 203
      }
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      username: "emily_r",
      profileImage: "https://mighty.tools/mockmind-api/content/human/34.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/34.jpg",
      timeAgo: "1h ago",
      role: "UI/UX Designer",
      isOnline: false,
      stats: {
        posts: 156,
        followers: 3201,
        following: 167
      }
    },
    {
      id: "4",
      name: "David Kim",
      username: "david_k",
      profileImage: "https://mighty.tools/mockmind-api/content/human/21.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/21.jpg",
      timeAgo: "2h ago",
      role: "Backend Developer",
      isOnline: true,
      stats: {
        posts: 74,
        followers: 987,
        following: 145
      }
    },
    {
      id: "5",
      name: "Lisa Thompson",
      username: "lisa_t",
      profileImage: "https://mighty.tools/mockmind-api/content/human/19.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/19.jpg",
      timeAgo: "3h ago",
      role: "Product Manager",
      isOnline: false,
      stats: {
        posts: 203,
        followers: 4567,
        following: 234
      }
    },
    {
      id: "6",
      name: "Alex Wong",
      username: "alex_wong",
      profileImage: "https://mighty.tools/mockmind-api/content/human/10.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/10.jpg",
      timeAgo: "4h ago",
      role: "DevOps Engineer",
      isOnline: true,
      stats: {
        posts: 45,
        followers: 789,
        following: 98
      }
    },
    {
      id: "7",
      name: "Maria Garcia",
      username: "maria_g",
      profileImage: "https://mighty.tools/mockmind-api/content/human/75.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/75.jpg",
      timeAgo: "6h ago",
      role: "Data Scientist",
      isOnline: false,
      stats: {
        posts: 91,
        followers: 1345,
        following: 112
      }
    },
    {
      id: "8",
      name: "James Wilson",
      username: "james_w",
      profileImage: "https://mighty.tools/mockmind-api/content/human/26.jpg",
      avatarImage: "https://mighty.tools/mockmind-api/content/human/26.jpg",
      timeAgo: "8h ago",
      role: "Mobile Developer",
      isOnline: true,
      stats: {
        posts: 67,
        followers: 1123,
        following: 156
      }
    }
  ];

  return (
    <div className="w-full">
      <AdvancedProfileCarousel 
        profiles={profilesData}
        autoPlay={true}
        autoPlayInterval={4000}
        showDots={true}
        showStats={true}
        className="px-4"
      />
    </div>
  );
};

export default AdvancedProfileCarouselDemo; 