"use client";

import { VideoCardProps } from "./types";

export function VideoCard({ video, isPreview = false }: VideoCardProps) {
  if (!video) return null;

  return (
    <div className="space-y-3">
      <div className="aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <iframe
          src={video.embedUrl}
          title={video.title}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="px-1">
        <h5 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
          {video.title}
        </h5>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {video.description}
        </p>
      </div>
    </div>
  );
} 