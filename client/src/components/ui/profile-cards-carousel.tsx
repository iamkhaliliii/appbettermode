"use client";

import React from "react";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { ProfileCard } from "@/components/ui/profile-card";

interface ProfileData {
  name: string;
  username: string;
  profileImage: string;
  avatarImage: string;
  timeAgo: string;
  role?: string;
}

const ProfileCarouselCard = ({ profile, index }: { profile: ProfileData; index: number }) => {
  return (
    <div className="w-72 h-80 flex items-center justify-center p-4">
      <ProfileCard
        name={profile.name}
        username={profile.username}
        profileImage={profile.profileImage}
        avatarImage={profile.avatarImage}
        timeAgo={profile.timeAgo}
        onAddMember={() => console.log(`Add ${profile.name} as member`)}
      />
    </div>
  );
};

export default function ProfileCardsCarousel() {
  const profileCards = profilesData.map((profile, index) => (
    <ProfileCarouselCard key={profile.username} profile={profile} index={index} />
  ));

  return (
    <div className="space-y-4 w-full">
      <div className="w-full">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Community Members
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Meet our active community members and event organizers
        </p>
      </div>
      <div className="w-full overflow-x-hidden">
        <Carousel items={profileCards} />
      </div>
    </div>
  );
}

const profilesData: ProfileData[] = [
  {
    name: "Sarah Johnson",
    username: "sarah_dev",
    profileImage: "https://mighty.tools/mockmind-api/content/human/99.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/99.jpg",
    timeAgo: "5m ago",
    role: "Frontend Developer"
  },
  {
    name: "Mike Chen",
    username: "mikechen",
    profileImage: "https://mighty.tools/mockmind-api/content/human/91.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/91.jpg",
    timeAgo: "12m ago",
    role: "Full Stack Developer"
  },
  {
    name: "Emily Rodriguez",
    username: "emily_r",
    profileImage: "https://mighty.tools/mockmind-api/content/human/34.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/34.jpg",
    timeAgo: "1h ago",
    role: "UI/UX Designer"
  },
  {
    name: "David Kim",
    username: "david_k",
    profileImage: "https://mighty.tools/mockmind-api/content/human/21.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/21.jpg",
    timeAgo: "2h ago",
    role: "Backend Developer"
  },
  {
    name: "Lisa Thompson",
    username: "lisa_t",
    profileImage: "https://mighty.tools/mockmind-api/content/human/19.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/19.jpg",
    timeAgo: "3h ago",
    role: "Product Manager"
  },
  {
    name: "Alex Wong",
    username: "alex_wong",
    profileImage: "https://mighty.tools/mockmind-api/content/human/10.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/10.jpg",
    timeAgo: "4h ago",
    role: "DevOps Engineer"
  },
  {
    name: "Maria Garcia",
    username: "maria_g",
    profileImage: "https://mighty.tools/mockmind-api/content/human/75.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/75.jpg",
    timeAgo: "6h ago",
    role: "Data Scientist"
  },
  {
    name: "James Wilson",
    username: "james_w",
    profileImage: "https://mighty.tools/mockmind-api/content/human/26.jpg",
    avatarImage: "https://mighty.tools/mockmind-api/content/human/26.jpg",
    timeAgo: "8h ago",
    role: "Mobile Developer"
  }
]; 