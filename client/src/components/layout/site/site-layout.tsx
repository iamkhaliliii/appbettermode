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
  Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sitesApi, Site } from '@/lib/api';
import { useEffect } from 'react';

// Simple theme toggle component since the original import was missing
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

interface SiteLayoutProps {
  children: React.ReactNode;
  siteSD: string;
}

export function SiteLayout({ children, siteSD }: SiteLayoutProps) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Determine active navigation item
  const isActive = (path: string) => {
    return location.includes(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
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
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-9 w-full h-9 bg-gray-50 dark:bg-gray-800/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              
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
          <div className="md:hidden pb-3 px-2">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 w-full h-9 bg-gray-50 dark:bg-gray-800/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
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
      <div className="hidden md:block bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <Link 
              href={`/site/${siteSD}`} 
              className={`px-4 py-3 text-sm font-medium ${isActive('') && !isActive('/discussion') && !isActive('/qa') && !isActive('/wishlist') ? 'border-b-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              Home
            </Link>
            <Link 
              href={`/site/${siteSD}/discussion`} 
              className={`px-4 py-3 text-sm font-medium ${isActive('/discussion') ? 'border-b-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              Discussions
            </Link>
            <Link 
              href={`/site/${siteSD}/qa`} 
              className={`px-4 py-3 text-sm font-medium ${isActive('/qa') ? 'border-b-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              Q&A
            </Link>
            <Link 
              href={`/site/${siteSD}/wishlist`} 
              className={`px-4 py-3 text-sm font-medium ${isActive('/wishlist') ? 'border-b-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              Wishlist
            </Link>
            <Link 
              href={`/site/${siteSD}/about`} 
              className={`px-4 py-3 text-sm font-medium ${isActive('/about') ? 'border-b-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
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
              <span className="font-semibold text-gray-900 dark:text-white">
                {site?.name || 'Community'}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {site?.name || 'Community'} - Powered by BetterMode
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 