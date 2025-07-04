import { useLocation, useRoute } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/features/content";
import { SpaceContent } from "@/components/dashboard/site-config/SpaceContent";
import { SiteContent } from "../../../../../components/dashboard/site-config/SiteContent";
import { DashboardPageWrapper } from "@/components/dashboard/DashboardPageWrapper";
import { TreeView, TreeNode } from "@/components/ui/tree-view";
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
  FileText as FilePlus,
  Globe,
  Users,
  FileText,
  Image,
  Palette,
  Shield,
  Bell
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
import MenuManagement from "@/components/dashboard/site-config/MenuManagement";

// CSS to disable all links in the preview
const disableLinksStyle = `
  .preview-container a {
    pointer-events: none !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
  }
`;

export default function SiteSpecificConfigPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config');
  const siteSD = params?.siteSD || '';
  
  const [location, setLocation] = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedConfigNode, setSelectedConfigNode] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const isFeed = location.includes('/spaces/feed');

  // Function to get dynamic icon for expandable folders
  const getDynamicIcon = (nodeId: string, defaultIcon: React.ReactNode, expandedIcon: React.ReactNode) => {
    return expandedIds.has(nodeId) ? expandedIcon : defaultIcon;
  };

  // State to track expanded nodes
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["pages", "my-spaces"]));

  // Configuration tree data
  const configTreeData: TreeNode[] = [
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

  // Set up keyboard shortcut for opening the dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if key 'n' is pressed and no input elements are focused
      if (
        event.key === 'n' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setAddContentDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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



  return (
    <DashboardPageWrapper 
      siteSD={siteSD}
      onNewContent={() => setAddContentDialogOpen(true)}
    >
      {/* CSS to disable links in preview */}
      <style>
        {disableLinksStyle}
      </style>
      
      {/* Add Content Dialog */}
      <AddContentDialog
        open={addContentDialogOpen}
        onOpenChange={setAddContentDialogOpen}
      />
      <div className="w-full p-4">
        <div className="flex gap-4 h-[calc(100vh-8rem)]">
          {/* Configuration Navigation Tree */}
          <div className="w-80 flex-shrink-0">
            <div className="h-full bg-background/50 rounded-xl border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Site Configuration</h3>
                <p className="text-sm text-muted-foreground">Navigate through pages and configuration sections</p>
              </div>
              <div className="p-2 h-[calc(100%-5rem)] overflow-y-auto">
                <TreeView
                  data={configTreeData}
                  onNodeClick={(node) => {
                    setSelectedConfigNode(node.id);
                  }}
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
                    if (nodeId === "menu") {
                      setIsMenuModalOpen(true);
                    } else {
                      setActiveDropdown(activeDropdown === nodeId ? null : nodeId);
                    }
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
                              setActiveDropdown(null);
                            }}
                          >
                            <Folder className="h-4 w-4" />
                            New Folder
                          </button>
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <FilePlus className="h-4 w-4" />
                            New Page
                          </button>
                        </div>
                      );
                    } else if (["job-board", "events", "qa", "ideas-wishlist", "knowledge-base", "blog", "discussions", "changelog"].includes(nodeId)) {
                      return (
                        <div className="bg-background border border-border rounded-md shadow-lg py-1 min-w-[180px]">
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <EyeOff className="h-4 w-4" />
                            Hide
                          </button>
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            Rename
                          </button>
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <Settings className="h-4 w-4" />
                            Config
                          </button>
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                            onClick={() => {
                              setActiveDropdown(null);
                            }}
                          >
                            <Home className="h-4 w-4" />
                            Set as Home Page
                          </button>
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2 text-destructive"
                            onClick={() => {
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
                  selectedIds={selectedConfigNode ? [selectedConfigNode] : []}
                  onSelectionChange={(ids) => setSelectedConfigNode(ids[0] || null)}
                  className="border-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <BrowserMockup
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
              languageDropdownOpen={languageDropdownOpen}
              setLanguageDropdownOpen={setLanguageDropdownOpen}
              themeDropdownOpen={themeDropdownOpen}
              setThemeDropdownOpen={setThemeDropdownOpen}
              responsiveDropdownOpen={responsiveDropdownOpen}
              setResponsiveDropdownOpen={setResponsiveDropdownOpen}
            >
              <div 
                key={selectedSpace ? `space-content-${selectedSpace}` : `site-content-${siteSD}`}
                className="w-full h-full transition-opacity duration-300"
              >
                {selectedSpace ? (
                  <SpaceContent siteSD={siteSD} spaceSlug={selectedSpace} />
                ) : (
                  <SiteContent siteSD={siteSD} />
                )}
              </div>
            </BrowserMockup>
          </div>
        </div>
      </div>
      
            {/* Menu Management Modal */}
      <Dialog open={isMenuModalOpen} onOpenChange={setIsMenuModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <MenuManagement
            onSave={(menuStructure) => {
              console.log('Menu saved:', menuStructure);
              // TODO: Save menu structure to backend
              setIsMenuModalOpen(false);
            }}
            onCancel={() => setIsMenuModalOpen(false)}
            initialMenu={[
              // Sample menu for demo
              {
                id: 'home',
                type: 'page',
                label: 'Home',
                pageId: 'feed',
                url: '/feed'
              },
              {
                id: 'community',
                type: 'folder',
                label: 'Community',
                isExpanded: true,
                children: [
                  {
                    id: 'discussions',
                    type: 'page',
                    label: 'Discussions',
                    pageId: 'discussions',
                    url: '/discussions'
                  },
                  {
                    id: 'events',
                    type: 'page',
                    label: 'Events',
                    pageId: 'events',
                    url: '/events'
                  }
                ]
              },
              {
                id: 'external',
                type: 'link',
                label: 'Documentation',
                url: 'https://docs.example.com'
              }
            ]}
            availablePages={[
              { id: 'feed', name: 'Feed', url: '/feed' },
              { id: 'job-board', name: 'Job Board', url: '/jobs' },
              { id: 'events', name: 'Events', url: '/events' },
              { id: 'qa', name: 'Q&A', url: '/qa' },
              { id: 'ideas-wishlist', name: 'Ideas & Wishlist', url: '/ideas' },
              { id: 'knowledge-base', name: 'Knowledge Base', url: '/kb' },
              { id: 'blog', name: 'Blog', url: '/blog' },
              { id: 'discussions', name: 'Discussions', url: '/discussions' },
              { id: 'changelog', name: 'Changelog', url: '/changelog' },
            ]}
          />
        </DialogContent>
      </Dialog>
    </DashboardPageWrapper>
  );
} 