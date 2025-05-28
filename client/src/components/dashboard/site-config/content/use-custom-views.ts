import { useState, useEffect } from 'react';
import { CustomView } from './content-view-manager';

const STORAGE_KEY = 'content-custom-views';

export const useCustomViews = () => {
  const [views, setViews] = useState<CustomView[]>([]);
  const [currentView, setCurrentView] = useState<CustomView | null>(null);

  // Load views from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedViews = JSON.parse(stored).map((view: any) => ({
          ...view,
          createdAt: new Date(view.createdAt),
          updatedAt: new Date(view.updatedAt)
        }));
        setViews(parsedViews);
      }
    } catch (error) {
      console.error('Failed to load custom views:', error);
    }
  }, []);

  // Save views to localStorage whenever views change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    } catch (error) {
      console.error('Failed to save custom views:', error);
    }
  }, [views]);

  const saveView = (viewData: Omit<CustomView, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newView: CustomView = {
      ...viewData,
      id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setViews(prev => [...prev, newView]);
    setCurrentView(newView);
    return newView;
  };

  const updateView = (viewId: string, updates: Partial<CustomView>) => {
    setViews(prev => prev.map(view => 
      view.id === viewId 
        ? { ...view, ...updates, updatedAt: new Date() }
        : view
    ));

    if (currentView?.id === viewId) {
      setCurrentView(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deleteView = (viewId: string) => {
    setViews(prev => prev.filter(view => view.id !== viewId));
    if (currentView?.id === viewId) {
      setCurrentView(null);
    }
  };

  const loadView = (view: CustomView) => {
    setCurrentView(view);
    return view;
  };

  const clearCurrentView = () => {
    setCurrentView(null);
  };

  return {
    views,
    currentView,
    saveView,
    updateView,
    deleteView,
    loadView,
    clearCurrentView
  };
}; 