import { TreeView } from "@/components/ui/tree-view";
import { useState, useEffect } from "react";
import { 
  Files, 
  AppWindow, 
  Folder, 
  FolderOpen,
  House,
  Dock, 
  PanelTop, 
  PanelLeft, 
  PanelRight, 
  PanelBottom, 
  SquareMenu, 
  Menu,
  Plus,
  MoreHorizontal,
  EyeOff,
  Edit,
  Settings,
  Home,
  Trash2,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog";
import { Button } from "@/components/ui/primitives/button";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";

const DemoOne = () => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["pages", "my-spaces"]));
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Function to get dynamic icon for expandable folders
  const getDynamicIcon = (nodeId: string, defaultIcon: React.ReactNode, expandedIcon: React.ReactNode) => {
    return expandedIds.has(nodeId) ? expandedIcon : defaultIcon;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const treeData = [
    {
      id: "pages",
      label: "Pages",
      icon: <Files className="h-4 w-4" />,
      children: [
        { 
          id: "feed", 
          label: (
            <div className="flex items-center gap-2">
              <span>Feed</span>
              <House className="h-3 w-3 text-blue-500" />
            </div>
          ), 
          icon: <AppWindow className="h-4 w-4" />
        },
        {
          id: "my-spaces",
          label: "My Spaces",
          icon: getDynamicIcon("my-spaces", <Folder className="h-4 w-4" />, <FolderOpen className="h-4 w-4" />),
          children: [
            { id: "job-board", label: "Job Board", icon: <AppWindow className="h-4 w-4" /> },
            { id: "events", label: "Events", icon: <AppWindow className="h-4 w-4" /> },
            { id: "qa", label: "Q&A", icon: <AppWindow className="h-4 w-4" /> },
            { id: "ideas-wishlist", label: "Ideas & Wishlist", icon: <AppWindow className="h-4 w-4" /> },
            { id: "knowledge-base", label: "Knowledge Base", icon: <AppWindow className="h-4 w-4" /> },
            { id: "blog", label: "Blog", icon: <AppWindow className="h-4 w-4" /> },
            { id: "discussions", label: "Discussions", icon: <AppWindow className="h-4 w-4" /> },
            { id: "changelog", label: "Changelog", icon: <AppWindow className="h-4 w-4" /> },
          ],
        },
      ],
    },
    {
      id: "navigation",
      label: "Navigation",
      icon: <Dock className="h-4 w-4" />,
      children: [
        { id: "header", label: "Header", icon: <PanelTop className="h-4 w-4" /> },
        { id: "left-sidebar", label: "LeftSidebar", icon: <PanelLeft className="h-4 w-4" /> },
        { id: "right-sidebar", label: "RightSidebar", icon: <PanelRight className="h-4 w-4" /> },
        { id: "footer", label: "Footer", icon: <PanelBottom className="h-4 w-4" /> },
      ],
    },
    {
      id: "menu",
      label: "Menu Management",
      icon: <SquareMenu className="h-4 w-4" />,
      children: [
        { id: "global-menu", label: "Global menu", icon: <Menu className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <div className="max-w-xl mx-auto w-full">
      <TreeView
        data={treeData}
        onNodeClick={(node) => console.log("Clicked:", node.label)}
        onNodeExpand={(nodeId, expanded) => {
          setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (expanded) {
              newSet.add(nodeId);
            } else {
              newSet.delete(nodeId);
            }
            return newSet;
          });
        }}
        onActionClick={(nodeId) => {
          console.log("Action clicked for:", nodeId);
          setActiveDropdown(activeDropdown === nodeId ? null : nodeId);
        }}
        actionableNodes={["pages", "menu", "job-board", "events", "qa", "ideas-wishlist", "knowledge-base", "blog", "discussions", "changelog"]}
        activeDropdown={activeDropdown}
        getActionIcon={(nodeId) => {
          if (nodeId === "pages" || nodeId === "menu") {
            return <Plus className="h-3 w-3 text-muted-foreground" />;
          } else {
            return <MoreHorizontal className="h-3 w-3 text-muted-foreground" />;
          }
        }}
        renderDropdown={(nodeId) => {
          if (nodeId === "pages") {
            return (
              <div className="bg-background border border-border rounded-md shadow-lg py-1 min-w-[160px]">
                <button
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => {
                    console.log("New Folder clicked");
                    setActiveDropdown(null);
                  }}
                >
                  <Folder className="h-4 w-4" />
                  New Folder
                </button>
                <button
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => {
                    console.log("New Page clicked");
                    setActiveDropdown(null);
                  }}
                >
                  <FileText className="h-4 w-4" />
                  New Page
                </button>
              </div>
            );
          } else if (nodeId === "menu") {
            return (
              <div className="bg-background border border-border rounded-md shadow-lg py-1 min-w-[160px]">
                <button
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => {
                    console.log("New Menu Item clicked");
                    setIsMenuModalOpen(true);
                    setActiveDropdown(null);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Menu Item
                </button>
              </div>
            );
          } else if (["job-board", "events", "qa", "ideas-wishlist", "knowledge-base", "blog", "discussions", "changelog"].includes(nodeId)) {
             return (
               <div className="bg-background border border-border rounded-md shadow-lg py-1 min-w-[180px]">
                 <button
                   className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                   onClick={() => {
                     console.log("Hide clicked for:", nodeId);
                     setActiveDropdown(null);
                   }}
                 >
                   <EyeOff className="h-4 w-4" />
                   Hide
                 </button>
                 <button
                   className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                   onClick={() => {
                     console.log("Rename clicked for:", nodeId);
                     setActiveDropdown(null);
                   }}
                 >
                   <Edit className="h-4 w-4" />
                   Rename
                 </button>
                 <button
                   className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                   onClick={() => {
                     console.log("Config clicked for:", nodeId);
                     setActiveDropdown(null);
                   }}
                 >
                   <Settings className="h-4 w-4" />
                   Config
                 </button>
                 <button
                   className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                   onClick={() => {
                     console.log("Set as home page clicked for:", nodeId);
                     setActiveDropdown(null);
                   }}
                 >
                   <Home className="h-4 w-4" />
                   Set as Home Page
                 </button>
                 <button
                   className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2 text-destructive"
                   onClick={() => {
                     console.log("Delete clicked for:", nodeId);
                     setActiveDropdown(null);
                   }}
                 >
                   <Trash2 className="h-4 w-4" />
                   Delete
                 </button>
               </div>
             );
          }
          return null;
        }}
        defaultExpandedIds={["pages", "my-spaces"]}
      />
      
      {/* Menu Modal */}
      <Dialog open={isMenuModalOpen} onOpenChange={setIsMenuModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Create a new menu item for your navigation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Menu item name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                placeholder="/path/to/page"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsMenuModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Menu item created");
              setIsMenuModalOpen(false);
            }}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { DemoOne }; 