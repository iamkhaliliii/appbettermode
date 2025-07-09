"use client";

import { ImagesGridProps } from "./types";

export function ImagesGrid({ images, isPreview = false }: ImagesGridProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
      {images.length === 1 && (
        <img 
          src={images[0].src} 
          alt={images[0].alt}
          className="w-full h-80 object-cover"
        />
      )}
      
      {images.length === 2 && (
        <div className="grid grid-cols-2 h-64 gap-px bg-zinc-200 dark:bg-zinc-700">
          {images.map((img, index) => (
            <img 
              key={index}
              src={img.src} 
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      )}
      
      {images.length === 3 && (
        <div className="grid grid-cols-3 h-64 gap-px bg-zinc-200 dark:bg-zinc-700">
          <img 
            src={images[0].src} 
            alt={images[0].alt}
            className="w-full h-full object-cover col-span-2"
          />
          <div className="grid grid-rows-2 gap-px">
            <img 
              src={images[1].src} 
              alt={images[1].alt}
              className="w-full h-full object-cover"
            />
            <img 
              src={images[2].src} 
              alt={images[2].alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      {images.length === 4 && (
        <div className="grid grid-cols-2 grid-rows-2 h-80 gap-px bg-zinc-200 dark:bg-zinc-700">
          {images.map((img, index) => (
            <img 
              key={index}
              src={img.src} 
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      )}
      
      {images.length >= 5 && (
        <div className="grid grid-cols-4 grid-rows-2 h-80 gap-px bg-zinc-200 dark:bg-zinc-700">
          <img 
            src={images[0].src} 
            alt={images[0].alt}
            className="w-full h-full object-cover col-span-2 row-span-2"
          />
          <img 
            src={images[1].src} 
            alt={images[1].alt}
            className="w-full h-full object-cover"
          />
          <img 
            src={images[2].src} 
            alt={images[2].alt}
            className="w-full h-full object-cover"
          />
          <img 
            src={images[3].src} 
            alt={images[3].alt}
            className="w-full h-full object-cover"
          />
          <div className="relative">
            <img 
              src={images[4].src} 
              alt={images[4].alt}
              className="w-full h-full object-cover"
            />
            {images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-sm font-semibold">+{images.length - 5}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 