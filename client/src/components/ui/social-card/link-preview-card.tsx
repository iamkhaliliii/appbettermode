"use client";

import { ArrowRight } from "lucide-react";
import { LinkPreviewCardProps } from "./types";

export function LinkPreviewCard({ link, isPreview = false }: LinkPreviewCardProps) {
  if (!link) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50/30 dark:bg-zinc-800/30 p-4">
      <div className="flex items-start gap-3">
        {link.icon && (
          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
            {link.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            {link.title}
          </h5>
          {link.description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {link.description}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
      </div>
    </div>
  );
} 