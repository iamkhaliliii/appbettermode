import InteractiveCalendar from '@/components/ui/calendar-layout';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import React from 'react';
import { EventFiltersDemo } from './event-filters-demo';
import { EventSortDemo } from './event-sort-demo';
import { Sort, SortField, SortDirection } from './event-sort';

const InteractiveCalendarDemo = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start bg-black px-4 py-10 md:justify-center">
      <InteractiveCalendar />
    </main>
  );
};

export function ProgressiveBlurBasic() {
  return (
    <div className='relative my-4 aspect-square w-[300px] overflow-hidden rounded-[4px]'>
      <img
        src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        alt='Benjamin Spiers - Moonlight 2023'
        className='absolute inset-0 w-full h-full object-cover'
      />
      <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[50%] w-full'
        blurIntensity={6}
      />
      <div className='absolute bottom-0 left-0'>
        <div className='flex flex-col items-start gap-0 px-5 py-4'>
          <p className='text-base font-medium text-white'>Benjamin Spiers</p>
          <span className='mb-2 text-base text-zinc-300'>Moonlight 2023</span>
          <p className='text-base text-white'>Oil on linen. 40cm by 30cm</p>
        </div>
      </div>
    </div>
  );
}

export { InteractiveCalendarDemo as DemoOne };

export default function Demo() {
  const [demoSorts, setDemoSorts] = React.useState<Sort[]>([
    {
      id: 'default-date',
      field: SortField.DATE,
      direction: SortDirection.ASC
    }
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Event Filters & Sort Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Advanced filtering and sorting system for events with multiple operators and visual feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filters Demo */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🔍 Advanced Filters
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click on "Filter" to add advanced filters with different operators
            </p>
          </div>

          <EventFiltersDemo />

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Available Filter Types:
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Status:</strong> Upcoming, Ongoing, Past</li>
              <li>• <strong>Category:</strong> Meetup, Workshop, Conference, Webinar</li>
              <li>• <strong>Event Type:</strong> Online, Offline, Hybrid</li>
              <li>• <strong>Date:</strong> Today, Tomorrow, This week, Next week</li>
              <li>• <strong>Featured:</strong> Featured, Not Featured</li>
            </ul>
          </div>
        </div>

        {/* Sort Demo */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📊 Advanced Sorting
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the sort chips to create multi-level sorting with direction control
            </p>
          </div>

          <EventSortDemo sorts={demoSorts} setSorts={setDemoSorts} />

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Available Sort Fields:
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>📅 Date:</strong> Event date/time</li>
              <li>• <strong>🔤 Title:</strong> Alphabetical by title</li>
              <li>• <strong>🏷️ Category:</strong> By event category</li>
              <li>• <strong>👥 Attendees:</strong> By attendee count</li>
              <li>• <strong>📅 Created:</strong> By creation date</li>
              <li>• <strong>📅 Updated:</strong> By last update</li>
            </ul>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                💡 Tip: Multiple sorts create priority order (first sort → second sort → etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 