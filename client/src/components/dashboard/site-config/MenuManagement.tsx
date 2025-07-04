import React, { useState, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Link, 
  FileText, 
  Folder, 
  FolderOpen,
  GripVertical, 
  Edit3, 
  Trash2, 
  Save,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';
import { Input } from '@/components/ui/primitives/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/primitives/select';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types
export interface MenuItem {
  id: string;
  type: 'link' | 'page' | 'folder';
  label: string;
  url?: string;
  pageId?: string;
  children?: MenuItem[];
  isEditing?: boolean;
  isExpanded?: boolean;
}

interface MenuManagementProps {
  onSave: (menuStructure: MenuItem[]) => void;
  onCancel: () => void;
  initialMenu?: MenuItem[];
  availablePages?: { id: string; name: string; url: string }[];
}

// Drop Zone Component for Folders
interface DropZoneProps {
  id: string;
  isActive: boolean;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ id, isActive, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-all duration-200",
        isActive && "ring-2 ring-blue-300 ring-offset-2 bg-blue-50/50",
        isOver && "ring-2 ring-green-300 ring-offset-2 bg-green-50/50"
      )}
    >
      {children}
    </div>
  );
};

// Sortable Menu Item Component
interface SortableMenuItemProps {
  item: MenuItem;
  onUpdate: (id: string, updates: Partial<MenuItem>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, type: MenuItem['type']) => void;
  onToggleExpanded: (id: string) => void;
  availablePages: { id: string; name: string; url: string }[];
  previewMode: boolean;
  level: number;
  draggedItemId?: string;
  dragOverFolderId?: string;
}

const SortableMenuItem: React.FC<SortableMenuItemProps> = ({
  item,
  onUpdate,
  onDelete,
  onAddChild,
  onToggleExpanded,
  availablePages,
  previewMode,
  level = 0,
  draggedItemId,
  dragOverFolderId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    data: {
      type: 'menu-item',
      item: item,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleLabelChange = (value: string) => {
    onUpdate(item.id, { label: value });
  };

  const handleUrlChange = (value: string) => {
    onUpdate(item.id, { url: value });
  };

  const handlePageSelect = (pageId: string) => {
    const selectedPage = availablePages.find(p => p.id === pageId);
    onUpdate(item.id, { 
      pageId,
      url: selectedPage?.url,
      label: selectedPage?.name || item.label
    });
  };

  const isFolder = item.type === 'folder';
  const isBeingDraggedOver = dragOverFolderId === item.id && draggedItemId !== item.id;
  const isBeingDragged = draggedItemId === item.id;

  const iconsByType = {
    link: <ExternalLink className="h-4 w-4 text-green-600" />,
    page: <FileText className="h-4 w-4 text-blue-600" />,
    folder: item.isExpanded ? 
      <FolderOpen className="h-4 w-4 text-amber-600" /> : 
      <Folder className="h-4 w-4 text-amber-600" />
  };

  if (previewMode) {
    return (
      <div className={cn("space-y-2", level > 0 && "ml-6")}>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
          {iconsByType[item.type]}
          <span className="font-medium">{item.label}</span>
          {item.url && <span className="text-xs text-gray-500">({item.url})</span>}
        </div>
        {item.children && item.children.map(child => (
          <SortableMenuItem
            key={child.id}
            item={child}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddChild={onAddChild}
            onToggleExpanded={onToggleExpanded}
            availablePages={availablePages}
            previewMode={previewMode}
            level={level + 1}
            draggedItemId={draggedItemId}
            dragOverFolderId={dragOverFolderId}
          />
        ))}
      </div>
    );
  }

  const ItemContent = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "space-y-2",
        level > 0 && "ml-6",
        isDragging && "opacity-30 z-50 rotate-3 scale-105",
        isBeingDragged && "shadow-2xl"
      )}
    >
      {/* Main Item */}
      <div className={cn(
        "group flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-all duration-200",
        item.isEditing && "bg-blue-50 border-blue-200 shadow-sm",
        isBeingDraggedOver && "bg-green-50 border-green-300 shadow-md ring-2 ring-green-200",
        isDragging && "bg-white border-gray-300 shadow-xl"
      )}>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
        >
          <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </div>

        {/* Expand/Collapse for folders */}
        {isFolder && (
          <button
            onClick={() => onToggleExpanded(item.id)}
            className="p-1 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110"
          >
            {item.isExpanded ? 
              <ChevronDown className="h-3 w-3 text-gray-600" /> : 
              <ChevronRight className="h-3 w-3 text-gray-600" />
            }
          </button>
        )}

        {/* Icon */}
        <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
          {iconsByType[item.type]}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {item.isEditing ? (
            <div className="space-y-2">
              {/* Label Input */}
              <Input
                value={item.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Enter label"
                className="h-8 text-sm border-blue-200 focus:border-blue-400"
                autoFocus
                onBlur={() => onUpdate(item.id, { isEditing: false })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    onUpdate(item.id, { isEditing: false });
                  }
                }}
              />
              
              {/* URL Input for links */}
              {item.type === 'link' && (
                <Input
                  value={item.url || ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Enter URL (e.g., https://example.com)"
                  className="h-8 text-sm border-blue-200 focus:border-blue-400"
                />
              )}
              
              {/* Page Selector */}
              {item.type === 'page' && (
                <Select
                  value={item.pageId || ''}
                  onValueChange={handlePageSelect}
                >
                  <SelectTrigger className="h-8 text-sm border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-medium truncate">{item.label}</span>
              {item.url && (
                <span className="text-xs text-gray-500 ml-2 truncate max-w-32 bg-gray-100 px-2 py-1 rounded">
                  {item.url}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Drop Indicator for Folders */}
        {isFolder && isBeingDraggedOver && (
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium animate-pulse">
            Drop here
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {/* Add Child (for folders) */}
          {isFolder && (
            <>
              <button
                onClick={() => onAddChild(item.id, 'page')}
                className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600 transition-all duration-200 hover:scale-110"
                title="Add page"
              >
                <FileText className="h-3 w-3" />
              </button>
              <button
                onClick={() => onAddChild(item.id, 'link')}
                className="p-1.5 hover:bg-green-100 rounded-full text-green-600 transition-all duration-200 hover:scale-110"
                title="Add link"
              >
                <Link className="h-3 w-3" />
              </button>
            </>
          )}

          {/* Edit */}
          <button
            onClick={() => onUpdate(item.id, { isEditing: !item.isEditing })}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-all duration-200 hover:scale-110"
            title="Edit"
          >
            <Edit3 className="h-3 w-3" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 hover:bg-red-100 rounded-full text-red-600 transition-all duration-200 hover:scale-110"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Children (for folders) */}
      {isFolder && item.isExpanded && item.children && item.children.length > 0 && (
        <div className="space-y-2 relative">
          {/* Connection line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
          
          <SortableContext items={item.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {item.children.map(child => (
              <SortableMenuItem
                key={child.id}
                item={child}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddChild={onAddChild}
                onToggleExpanded={onToggleExpanded}
                availablePages={availablePages}
                previewMode={previewMode}
                level={level + 1}
                draggedItemId={draggedItemId}
                dragOverFolderId={dragOverFolderId}
              />
            ))}
          </SortableContext>
        </div>
      )}

      {/* Empty folder drop zone */}
      {isFolder && item.isExpanded && (!item.children || item.children.length === 0) && (
        <div className="ml-6 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400 hover:border-gray-300 transition-colors">
          <Folder className="h-6 w-6 mx-auto mb-1 opacity-50" />
          <p className="text-xs">Drop items here or use + buttons above</p>
        </div>
      )}
    </div>
  );

  // Wrap folders in drop zones
  if (isFolder) {
    return (
      <DropZone id={`folder-${item.id}`} isActive={isBeingDraggedOver}>
        {ItemContent}
      </DropZone>
    );
  }

  return ItemContent;
};

// Main Menu Management Component
const MenuManagement: React.FC<MenuManagementProps> = ({
  onSave,
  onCancel,
  initialMenu = [],
  availablePages = [
    { id: 'feed', name: 'Feed', url: '/feed' },
    { id: 'job-board', name: 'Job Board', url: '/jobs' },
    { id: 'events', name: 'Events', url: '/events' },
    { id: 'qa', name: 'Q&A', url: '/qa' },
    { id: 'blog', name: 'Blog', url: '/blog' },
    { id: 'discussions', name: 'Discussions', url: '/discussions' },
    { id: 'changelog', name: 'Changelog', url: '/changelog' },
  ]
}) => {
  // Initialize with sample data if empty
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    initialMenu.length > 0 ? initialMenu : [
      {
        id: 'sample-folder',
        type: 'folder',
        label: 'Main Navigation',
        isExpanded: true,
        children: [
          { id: 'sample-home', type: 'page', label: 'Home', pageId: 'feed', url: '/feed' },
          { id: 'sample-about', type: 'link', label: 'About Us', url: '/about' }
        ]
      }
    ]
  );

  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | undefined>();
  const [dragOverFolderId, setDragOverFolderId] = useState<string | undefined>();

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Track changes
  useEffect(() => {
    const hasChangesDetected = JSON.stringify(menuItems) !== JSON.stringify(initialMenu);
    setHasChanges(hasChangesDetected);
  }, [menuItems, initialMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'p':
            e.preventDefault();
            setPreviewMode(!previewMode);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewMode]);

  // Generate unique ID
  const generateId = () => `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Save handler
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(menuItems);
      setHasChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Find item and its parent in the tree
  const findItemInTree = (items: MenuItem[], targetId: string, parent?: MenuItem): { item: MenuItem | null, parent: MenuItem | null } => {
    for (const item of items) {
      if (item.id === targetId) {
        return { item, parent: parent || null };
      }
      if (item.children) {
        const result = findItemInTree(item.children, targetId, item);
        if (result.item) return result;
      }
    }
    return { item: null, parent: null };
  };

  // Remove item from tree
  const removeItemFromTree = (items: MenuItem[], targetId: string): MenuItem[] => {
    return items.filter(item => {
      if (item.id === targetId) return false;
      if (item.children) {
        item.children = removeItemFromTree(item.children, targetId);
      }
      return true;
    });
  };

  // Add item to folder
  const addItemToFolder = (items: MenuItem[], folderId: string, newItem: MenuItem): MenuItem[] => {
    return items.map(item => {
      if (item.id === folderId && item.type === 'folder') {
        return {
          ...item,
          children: [...(item.children || []), newItem],
          isExpanded: true
        };
      }
      if (item.children) {
        return { ...item, children: addItemToFolder(item.children, folderId, newItem) };
      }
      return item;
    });
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItemId(event.active.id as string);
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDragOverFolderId(undefined);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're over a folder drop zone
    if (overId.startsWith('folder-')) {
      const folderId = overId.replace('folder-', '');
      const { item: overItem } = findItemInTree(menuItems, folderId);
      
      if (overItem && overItem.type === 'folder' && activeId !== folderId) {
        setDragOverFolderId(folderId);
      } else {
        setDragOverFolderId(undefined);
      }
    } else {
      setDragOverFolderId(undefined);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItemId(undefined);
    setDragOverFolderId(undefined);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the dragged item
    const { item: draggedItem } = findItemInTree(menuItems, activeId);
    if (!draggedItem) return;

    // If dropping on a folder drop zone
    if (overId.startsWith('folder-')) {
      const folderId = overId.replace('folder-', '');
      const { item: targetFolder } = findItemInTree(menuItems, folderId);
      
      if (targetFolder && targetFolder.type === 'folder' && activeId !== folderId) {
        // Check if target folder is not a child of the dragged item (prevent circular reference)
        const { item: targetInDragged } = findItemInTree(draggedItem.children || [], folderId);
        if (targetInDragged) return;

        setMenuItems(prev => {
          // Remove item from its current position
          let newItems = removeItemFromTree(prev, activeId);
          // Add item to the target folder
          newItems = addItemToFolder(newItems, folderId, draggedItem);
          return newItems;
        });
        return;
      }
    }

    // Regular reordering within the same level
    if (activeId !== overId) {
      const { parent: activeParent } = findItemInTree(menuItems, activeId);
      const { parent: overParent } = findItemInTree(menuItems, overId);

      // Only reorder if items are at the same level
      if (activeParent?.id === overParent?.id) {
        setMenuItems(prev => {
          const items = activeParent ? activeParent.children || [] : prev;
          const oldIndex = items.findIndex(item => item.id === activeId);
          const newIndex = items.findIndex(item => item.id === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            
            if (activeParent) {
              // Update parent's children
              const updateParent = (menuItems: MenuItem[]): MenuItem[] => {
                return menuItems.map(item => {
                  if (item.id === activeParent.id) {
                    return { ...item, children: reorderedItems };
                  }
                  if (item.children) {
                    return { ...item, children: updateParent(item.children) };
                  }
                  return item;
                });
              };
              return updateParent(prev);
            } else {
              // Top level reordering
              return reorderedItems;
            }
          }
          return prev;
        });
      }
    }
  };

  // Add new menu item
  const addMenuItem = useCallback((parentId: string | undefined, type: MenuItem['type']) => {
    const newItem: MenuItem = {
      id: generateId(),
      type,
      label: type === 'folder' ? 'New Folder' : type === 'page' ? 'Select Page' : 'New Link',
      url: type === 'link' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
      isEditing: true,
      isExpanded: type === 'folder' ? true : undefined,
    };

    setMenuItems(prev => {
      if (!parentId) {
        return [...prev, newItem];
      }

      const addToParent = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === parentId && item.type === 'folder') {
            return {
              ...item,
              children: [...(item.children || []), newItem],
              isExpanded: true
            };
          }
          if (item.children) {
            return { ...item, children: addToParent(item.children) };
          }
          return item;
        });
      };

      return addToParent(prev);
    });
  }, []);

  // Update menu item
  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    const updateInTree = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return { ...item, children: updateInTree(item.children) };
        }
        return item;
      });
    };

    setMenuItems(prev => updateInTree(prev));
  }, []);

  // Delete menu item
  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => removeItemFromTree(prev, id));
  }, []);

  // Toggle folder expansion
  const toggleExpanded = useCallback((id: string) => {
    updateMenuItem(id, { isExpanded: undefined }); // Toggle by setting to undefined first
    setMenuItems(prev => {
      const toggleInTree = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === id && item.type === 'folder') {
            return { ...item, isExpanded: !item.isExpanded };
          }
          if (item.children) {
            return { ...item, children: toggleInTree(item.children) };
          }
          return item;
        });
      };
      return toggleInTree(prev);
    });
  }, []);

  // Get all item IDs for sortable context
  const getAllItemIds = (items: MenuItem[]): string[] => {
    const ids: string[] = [];
    const traverse = (menuItems: MenuItem[]) => {
      menuItems.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(items);
    return ids;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Menu Management</h3>
            <p className="text-sm text-gray-600">Create and organize your navigation menu with drag & drop</p>
          </div>
          
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition-all duration-200 font-medium",
              previewMode 
                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" 
                : "hover:bg-gray-50 border-gray-200"
            )}
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>

        {/* Add Item Buttons */}
        {!previewMode && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => addMenuItem(undefined, 'link')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium"
            >
              <Link className="h-4 w-4" />
              Add Link
            </button>
            
            <button
              onClick={() => addMenuItem(undefined, 'page')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium"
            >
              <FileText className="h-4 w-4" />
              Add Page
            </button>
            
            <button
              onClick={() => addMenuItem(undefined, 'folder')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all duration-200 font-medium"
            >
              <Folder className="h-4 w-4" />
              Add Folder
            </button>
          </div>
        )}
      </div>

      {/* Menu Content */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            {previewMode ? 'Preview Mode' : 'Edit Mode'}
          </span>
          {hasChanges && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {menuItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No menu items</p>
              <p className="text-sm">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={getAllItemIds(menuItems)} 
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.map(item => (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      onUpdate={updateMenuItem}
                      onDelete={deleteMenuItem}
                      onAddChild={addMenuItem}
                      onToggleExpanded={toggleExpanded}
                      availablePages={availablePages}
                      previewMode={previewMode}
                      level={0}
                      draggedItemId={draggedItemId}
                      dragOverFolderId={dragOverFolderId}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          {previewMode 
            ? 'Preview mode - switch to edit to make changes'
            : 'Drag items to reorder or drop into folders • Ctrl+S to save • Ctrl+P to preview'
          }
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Menu
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement; 