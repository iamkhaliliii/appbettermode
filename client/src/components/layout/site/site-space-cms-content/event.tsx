import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useLocation } from 'wouter';

interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: string;
  site_id: string;
}

interface EventContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

export function EventContent({ siteSD, space, site }: EventContentProps) {
  const [, setLocation] = useLocation();

  const handleNewEvent = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  return (
    <div className="event-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Events
        </h2>
        <Button onClick={handleNewEvent}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>
      
      <Card className="text-center p-6">
        <CardContent className="pt-6">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Event Content</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a placeholder for the Event component.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 