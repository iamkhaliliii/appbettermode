"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

// Featured event data matching your event system
const eventData = [
  {
    id: 'featured-react-workshop',
    title: 'React Development Workshop',
    category: 'Workshop',
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    event_date: '2024-01-22T14:00:00',
    event_location: 'Online',
    event_description: 'Learn React development with hands-on projects'
  },
  {
    id: 'featured-design-conf',
    title: 'Design Systems Conference 2024',
    category: 'Conference',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    event_date: '2024-01-25T09:00:00',
    event_location: 'San Francisco, CA',
    event_description: 'The premier design systems conference'
  },
  {
    id: 'featured-ai-summit',
    title: 'AI in Product Development',
    category: 'Webinar',
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    event_date: '2024-01-28T15:00:00',
    event_location: 'Virtual Event',
    event_description: 'How AI is transforming product development'
  },
  {
    id: 'featured-startup-pitch',
    title: 'Startup Pitch Night',
    category: 'Pitch',
    src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    event_date: '2024-02-01T18:00:00',
    event_location: 'Austin, TX',
    event_description: 'Present your startup to investors'
  },
  {
    id: 'featured-dev-meetup',
    title: 'Frontend Developers Meetup',
    category: 'Meetup',
    src: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    event_date: '2024-02-05T19:00:00',
    event_location: 'Seattle, WA',
    event_description: 'Monthly frontend developers community meetup'
  },
  {
    id: 'featured-product-workshop',
    title: 'Product Strategy Workshop',
    category: 'Workshop',
    src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    event_date: '2024-02-08T10:00:00',
    event_location: 'Remote',
    event_description: 'Learn product strategy from industry experts'
  }
];

export default function AppleCardsCarouselDemo() {
  const cards = eventData.map((event, index) => (
    <Card key={event.src} card={event} index={index} />
  ));

  return (
    <div className="space-y-4 w-full">
      <div className="w-full overflow-x-hidden">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

 