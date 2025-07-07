import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  Search, 
  User, 
  Bell, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  Settings,
  Moon,
  Sun,
  Info,
  Shield,
  Bookmark
} from 'lucide-react';

import { Button } from '@/components/ui/primitives';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/forms';
import { Input } from '@/components/ui/primitives';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives';
import { Site } from '@/lib/api';

// Theme toggle component
function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
      ? 'dark' 
      : 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  );
}

interface SiteHeaderProps {
  siteSD: string;
  site: Site | null;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  onSearchInputClick?: () => void;
  isSearchPage?: boolean;
  isAdminHeaderVisible?: boolean;
}

export function SiteHeader({ 
  siteSD, 
  site, 
  isMenuOpen, 
  setIsMenuOpen, 
  searchQuery, 
  setSearchQuery,
  handleSearch,
  onSearchInputClick,
  isSearchPage,
  isAdminHeaderVisible = true
}: SiteHeaderProps) {
  const [location] = useLocation();

  // Determine active navigation item
  const isActive = (path: string) => {
    return location.includes(path);
  };

  return (
    <>
      {/* Header */}
      <header className={`sticky ${isAdminHeaderVisible ? 'top-12' : 'top-0'} z-20 w-full border-b bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <Link href={`/site/${siteSD}`} className="flex items-center space-x-2">
                {site?.logo_url ? (
                  <img src={site.logo_url} alt={site.name} className="h-8 w-8 object-contain" />
                ) : (
                  <div 
                    className="h-8 w-8 rounded-md flex items-center justify-center font-bold text-white"
                    style={{ 
                      backgroundColor: site?.brand_color || '#6366f1',
                    }}
                  >
                    {site?.name?.substring(0, 1) || 'S'}
                  </div>
                )}
                <span className="font-semibold text-lg hidden sm:inline-block text-gray-900 dark:text-white">
                  {site?.name || 'Community'}
                </span>
              </Link>
            </div>
            
            {/* Search Bar - Hidden on Mobile */}
            {!isSearchPage && (
              <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search... (⌘K)"
                      className="pl-9 w-full h-9 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={onSearchInputClick}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hidden sm:flex">
                <Bookmark size={18} />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hidden sm:flex">
                <Bell size={18} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                      User
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/site/${siteSD}/moderation`}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Moderation</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Mobile Search - Visible only on Mobile */}
          {!isSearchPage && (
            <div className="md:hidden pb-3 px-2">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search... (⌘K)"
                    className="pl-9 w-full h-9 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={onSearchInputClick}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile Navigation Menu - Only shown when menu is open on mobile */}
      <div className={`md:hidden fixed inset-0 z-50 bg-gray-800/50 dark:bg-black/50 transition-opacity duration-200 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            {site?.logo_url ? (
              <img src={site.logo_url} alt={site.name} className="h-8 w-8 object-contain" />
            ) : (
              <div 
                className="h-8 w-8 rounded-md flex items-center justify-center font-bold text-white"
                style={{ 
                  backgroundColor: site?.brand_color || '#6366f1',
                }}
              >
                {site?.name?.substring(0, 1) || 'S'}
              </div>
            )}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/site/${siteSD}`} 
                  className={`flex items-center p-2 rounded-md ${isActive('') && !isActive('/discussion') && !isActive('/qa') && !isActive('/wishlist') ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={18} className="mr-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={`/site/${siteSD}/discussion`} 
                  className={`flex items-center p-2 rounded-md ${isActive('/discussion') ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageSquare size={18} className="mr-3" />
                  <span>Discussions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={`/site/${siteSD}/qa`} 
                  className={`flex items-center p-2 rounded-md ${isActive('/qa') ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HelpCircle size={18} className="mr-3" />
                  <span>Q&A</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={`/site/${siteSD}/wishlist`} 
                  className={`flex items-center p-2 rounded-md ${isActive('/wishlist') ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Star size={18} className="mr-3" />
                  <span>Wishlist</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={`/site/${siteSD}/about`} 
                  className={`flex items-center p-2 rounded-md ${isActive('/about') ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Info size={18} className="mr-3" />
                  <span>About</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Desktop Navigation */}
    </>
  );
} 