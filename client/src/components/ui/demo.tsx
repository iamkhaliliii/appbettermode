import InteractiveCalendar from '@/components/ui/calendar-layout';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

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