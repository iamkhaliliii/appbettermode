import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
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

interface KnowledgeContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

export function KnowledgeContent({ siteSD, space, site }: KnowledgeContentProps) {
  const [, setLocation] = useLocation();

  const handleNewArticle = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  return (
    <div className="knowledge-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Knowledge Base
        </h2>
        <Button onClick={handleNewArticle}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>
      
      <Card className="text-center p-6">
        <CardContent className="pt-6">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Knowledge Base Content</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a placeholder for the Knowledge Base component.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 