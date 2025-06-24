"use client";

import React from 'react';
import CompactProfileCarousel from './compact-profile-carousel';

const CompactProfileCarouselDemo = () => {
  const profilesData = [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah_dev",
      profileImage: "https://mighty.tools/mockmind-api/content/human/80.jpg",
      role: "Frontend Dev",
      isOnline: true
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "mikechen",
      profileImage: "https://mighty.tools/mockmind-api/content/human/125.jpg",
      role: "Full Stack",
      isOnline: true
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      username: "emily_r",
      profileImage: "https://mighty.tools/mockmind-api/content/human/104.jpg",
      role: "UI/UX Designer",
      isOnline: false
    },
    {
      id: "4",
      name: "David Kim",
      username: "david_k",
      profileImage: "https://mighty.tools/mockmind-api/content/human/108.jpg",
      role: "Backend Dev",
      isOnline: true
    },
    {
      id: "5",
      name: "Lisa Thompson",
      username: "lisa_t",
      profileImage: "https://mighty.tools/mockmind-api/content/human/92.jpg",
      role: "Product Manager",
      isOnline: false
    },
    {
      id: "6",
      name: "Alex Wong",
      username: "alex_wong",
      profileImage: "https://mighty.tools/mockmind-api/content/human/97.jpg",
      role: "DevOps",
      isOnline: true
    },
    {
      id: "7",
      name: "Maria Garcia",
      username: "maria_g",
      profileImage: "https://mighty.tools/mockmind-api/content/human/128.jpg",
      role: "Data Scientist",
      isOnline: false
    },
    {
      id: "8",
      name: "James Wilson",
      username: "james_w",
      profileImage: "https://mighty.tools/mockmind-api/content/human/91.jpg",
      role: "Mobile Dev",
      isOnline: true
    },
    {
      id: "9",
      name: "Sophie Martinez",
      username: "sophie_m",
      profileImage: "https://mighty.tools/mockmind-api/content/human/122.jpg",
      role: "Designer",
      isOnline: true
    },
    {
      id: "10",
      name: "Ryan Cooper",
      username: "ryan_c",
      profileImage: "https://mighty.tools/mockmind-api/content/human/129.jpg",
      role: "QA Engineer",
      isOnline: false
    },
    {
      id: "11",
      name: "Zara Khan",
      username: "zara_k",
      profileImage: "https://mighty.tools/mockmind-api/content/human/87.jpg",
      role: "Marketing",
      isOnline: true
    },
    {
      id: "12",
      name: "Tom Anderson",
      username: "tom_a",
      profileImage: "https://mighty.tools/mockmind-api/content/human/85.jpg",
      role: "Sales",
      isOnline: false
    },
    {
      id: "13",
      name: "Nina Patel",
      username: "nina_p",
      profileImage: "https://mighty.tools/mockmind-api/content/human/113.jpg",
      role: "HR Manager",
      isOnline: true
    },
    {
      id: "14",
      name: "Jack Thompson",
      username: "jack_t",
      profileImage: "https://mighty.tools/mockmind-api/content/human/116.jpg",
      role: "Analyst",
      isOnline: true
    },
    {
      id: "15",
      name: "Maya Singh",
      username: "maya_s",
      profileImage: "https://mighty.tools/mockmind-api/content/human/127.jpg",
      role: "Content Writer",
      isOnline: false
    },
    {
      id: "16",
      name: "Lucas Brown",
      username: "lucas_b",
      profileImage: "https://mighty.tools/mockmind-api/content/human/126.jpg",
      role: "Operations",
      isOnline: true
    },
    {
      id: "17",
      name: "Aria Davis",
      username: "aria_d",
      profileImage: "https://mighty.tools/mockmind-api/content/human/106.jpg",
      role: "Finance",
      isOnline: false
    },
    {
      id: "18",
      name: "Owen Taylor",
      username: "owen_t",
      profileImage: "https://mighty.tools/mockmind-api/content/human/82.jpg",
      role: "Support",
      isOnline: true
    }
  ];

  return (
    <CompactProfileCarousel 
      profiles={profilesData}
      className="py-4"
    />
  );
};

export default CompactProfileCarouselDemo; 