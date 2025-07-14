import React from "react";
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
import { Switch } from "@/components/ui/primitives/switch";
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
  Bell,
  Puzzle,
  Navigation,
  PanelTopDashed,
  Megaphone,
  RectangleHorizontal
} from "lucide-react";


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
  const [navigationToggles, setNavigationToggles] = useState<Record<string, boolean>>({
    header: true,
    'left-sidebar': true,
    'right-sidebar': false,
    footer: false
  });
  const isFeed = location.includes('/spaces/feed');

  // Function to get dynamic icon for expandable folders
  const getDynamicIcon = (nodeId: string, defaultIcon: React.ReactNode, expandedIcon: React.ReactNode) => {
    return expandedIds.has(nodeId) ? expandedIcon : defaultIcon;
  };

  // State to track expanded nodes
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["pages", "my-spaces", "header", "left-sidebar"]));

  // Handle navigation toggle changes
  const handleNavigationToggle = (nodeId: string) => {
    setNavigationToggles(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
    
    // Auto-expand the parent if toggling on
    if (!navigationToggles[nodeId]) {
      setExpandedIds(prev => new Set([...Array.from(prev), nodeId]));
    }
  };

  // Configuration tree data
  const configTreeData: TreeNode[] = [
    {
      id: "pages",
      label: "Spaces",
      icon: <Files className="h-4 w-4 text-gray-400" />,
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
          id: "explore", 
          label: "Explore", 
          icon: <AppWindow className="h-4 w-4" />
        },
        { 
          id: "members", 
          label: "Members", 
          icon: <AppWindow className="h-4 w-4" />
        },
        {
          id: "my-spaces",
          label: "My Spaces",
          icon: getDynamicIcon("my-spaces", <Folder className="h-4 w-4 text-gray-400" />, <FolderOpen className="h-4 w-4 text-gray-400" />),
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
      icon: <Dock className="h-4 w-4 text-gray-400" />,
      children: [
        { 
          id: "header", 
          label: (
            <div className="flex items-center justify-between w-full">
              <span>Header</span>
              <div className="flex items-center gap-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add action
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Add to header"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
                <Switch
                  checked={navigationToggles.header}
                  onCheckedChange={(checked) => {
                    handleNavigationToggle("header");
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="scale-50"
                />
              </div>
            </div>
          ), 
          icon: <PanelTop className="h-4 w-4" />,
          children: navigationToggles.header ? [
            { 
              id: "site-header", 
              label: (
                <span style={{ color: '#C29EE7' }}>Site Header</span>
              ), 
              icon: (
                <div className="p-1 rounded" style={{ backgroundColor: '#C29EE715' }}>
                  <PanelTopDashed className="h-4 w-4" style={{ color: '#C29EE7' }} />
                </div>
              )
            },
          ] : undefined
        },
        { 
          id: "left-sidebar", 
          label: (
            <div className="flex items-center justify-between w-full">
              <span>LeftSidebar</span>
              <div className="flex items-center gap-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add action
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Add to left sidebar"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
                <Switch
                  checked={navigationToggles["left-sidebar"]}
                  onCheckedChange={(checked) => {
                    handleNavigationToggle("left-sidebar");
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="scale-50"
                />
              </div>
            </div>
          ), 
          icon: <PanelLeft className="h-4 w-4" />,
          children: navigationToggles["left-sidebar"] ? [
            { 
              id: "menu", 
              label: (
                <span style={{ color: '#C29EE7' }}>Menu</span>
              ), 
              icon: (
                <div className="p-1 rounded" style={{ backgroundColor: '#C29EE715' }}>
                  <Menu className="h-4 w-4" style={{ color: '#C29EE7' }} />
                </div>
              )
            },
          ] : undefined
        },
        { 
          id: "right-sidebar", 
          label: (
            <div className="flex items-center justify-between w-full">
              <span>RightSidebar</span>
              <div className="flex items-center gap-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add action
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Add to right sidebar"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
                <Switch
                  checked={navigationToggles["right-sidebar"]}
                  onCheckedChange={(checked) => {
                    handleNavigationToggle("right-sidebar");
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="scale-50"
                />
              </div>
            </div>
          ), 
          icon: <PanelRight className="h-4 w-4" />,
          children: navigationToggles["right-sidebar"] ? [
            { 
              id: "banner", 
              label: (
                <span style={{ color: '#C29EE7' }}>Banner</span>
              ), 
              icon: (
                <div className="p-1 rounded" style={{ backgroundColor: '#C29EE715' }}>
                  <RectangleHorizontal className="h-4 w-4" style={{ color: '#C29EE7' }} />
                </div>
              )
            },
            { 
              id: "menu", 
              label: (
                <span style={{ color: '#C29EE7' }}>Menu</span>
              ), 
              icon: (
                <div className="p-1 rounded" style={{ backgroundColor: '#C29EE715' }}>
                  <Menu className="h-4 w-4" style={{ color: '#C29EE7' }} />
                </div>
              )
            },
          ] : undefined
        },
        { 
          id: "footer", 
          label: (
            <div className="flex items-center justify-between w-full">
              <span>Footer</span>
                <div className="flex items-center gap-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add action
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Add to footer"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
                <Switch
                  checked={navigationToggles.footer}
                  onCheckedChange={(checked) => {
                    handleNavigationToggle("footer");
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="scale-50"
                />
              </div>
            </div>
          ), 
          icon: <PanelBottom className="h-4 w-4" />,
          children: navigationToggles.footer ? [
            { 
              id: "footer-block", 
              label: (
                <span style={{ color: '#C29EE7' }}>FooterBlock</span>
              ), 
              icon: (
                <div className="p-1 rounded" style={{ backgroundColor: '#C29EE715' }}>
                  <Dock className="h-4 w-4" style={{ color: '#C29EE7' }} />
                </div>
              )
            },
          ] : undefined
        },
      ],
    },
    {
      id: "modules",
      label: "Modules",
      icon: <Puzzle className="h-4 w-4 text-gray-400" />,
      children: [
        { 
          id: "event", 
          label: (
            <span style={{ color: '#D99C9C' }}>Event</span>
          ), 
          icon: (
            <div className="p-1 rounded" style={{ backgroundColor: '#D99C9C15' }}>
              <FileText className="h-4 w-4" style={{ color: '#D99C9C' }} />
            </div>
          )
        },
        { 
          id: "discussion", 
          label: (
            <span style={{ color: '#D99C9C' }}>Discussion</span>
          ), 
          icon: (
            <div className="p-1 rounded" style={{ backgroundColor: '#D99C9C15' }}>
              <Users className="h-4 w-4" style={{ color: '#D99C9C' }} />
            </div>
          )
        },
        { 
          id: "blog", 
          label: (
            <span style={{ color: '#D99C9C' }}>Blog</span>
          ), 
          icon: (
            <div className="p-1 rounded" style={{ backgroundColor: '#D99C9C15' }}>
              <Edit className="h-4 w-4" style={{ color: '#D99C9C' }} />
            </div>
          )
        },
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
                <div className="[&_.tree-item]:group">
                  <TreeView
                    data={configTreeData}
                    onNodeClick={(node) => {
                      setSelectedConfigNode(node.id);
                      
                      // Handle navigation for different node types
                      if (node.id === 'event' || node.id === 'discussion' || node.id === 'blog') {
                        // Navigate to modules/content types
                        setLocation(`/dashboard/site/${siteSD}/site-config/spaces/${node.id}`);
                      } else if (node.id === 'feed' || node.id === 'explore' || node.id === 'members') {
                        // Navigate to main pages
                        setLocation(`/dashboard/site/${siteSD}/site-config/spaces/${node.id}`);
                      } else if (['job-board', 'events', 'qa', 'ideas-wishlist', 'knowledge-base', 'changelog', 'discussions'].includes(node.id)) {
                        // Navigate to specific spaces
                        setLocation(`/dashboard/site/${siteSD}/site-config/spaces/${node.id}`);
                      }
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
                      setActiveDropdown(activeDropdown === nodeId ? null : nodeId);
                    }}
                    actionableNodes={["pages", "modules", "job-board", "events", "qa", "ideas-wishlist", "knowledge-base", "blog", "discussions", "changelog"]}
                    activeDropdown={activeDropdown}
                    getActionIcon={(nodeId) => {
                      if (nodeId === "pages" || nodeId === "modules") {
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
                      } else if (nodeId === "modules") {
                        return (
                          <div className="bg-background border border-border rounded-md shadow-lg py-1 min-w-[160px]">
                            <button
                              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                              onClick={() => {
                                setActiveDropdown(null);
                              }}
                            >
                              <Puzzle className="h-4 w-4" />
                              Add Module
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
                    defaultExpandedIds={["pages", "my-spaces", "header", "left-sidebar"]}
                    selectedIds={selectedConfigNode ? [selectedConfigNode] : []}
                    onSelectionChange={(ids) => setSelectedConfigNode(ids[0] || null)}
                    className="border-none bg-transparent"
                  />
                </div>
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
    </DashboardPageWrapper>
  );
} 