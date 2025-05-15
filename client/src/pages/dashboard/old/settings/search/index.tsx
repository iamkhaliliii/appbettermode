import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SparklesIcon, SearchIcon, XIcon, PlusIcon, BookOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function SearchSettingsPage() {
  // State for search sources checkboxes
  const [searchSources, setSearchSources] = useState({
    posts: true,
    spaces: true,
    members: false
  });
  
  // State for knowledge base spaces
  const [knowledgeBaseSpaces, setKnowledgeBaseSpaces] = useState([
    "Getting Started",
    "Content Management",
    "Member Management",
    "Appearance & Design",
    "Reports & Analytics",
    "Apps & Integrations",
    "API & Webhooks"
  ]);
  
  // Handle remove space from knowledge base
  const removeSpace = (space: string) => {
    setKnowledgeBaseSpaces(knowledgeBaseSpaces.filter(s => s !== space));
  };
  
  // Handle adding a new space (placeholder)
  const addSpace = () => {
    // This would typically open a modal or dropdown to select spaces
    alert("This would open a space selection interface");
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Search Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure how search works in your community
          </p>
        </div>

        <div className="space-y-5">
          {/* Search Sources Card - Refined */}
          <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
            <CardHeader className="px-6 pt-5 pb-0">
              <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight mb-1">Search Sources</CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Admins have access to all sources. Select which content types should be available in search results for members.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pt-4">
              <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
            </div>
            <CardContent className="px-6 pt-4 pb-5">        
              <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {/* Posts Item */}
                <div className="flex items-center justify-between py-3 group">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="posts" 
                      checked={searchSources.posts} 
                      disabled 
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
                    />
                    <Label htmlFor="posts" className="text font-medium text-gray-900 dark:text-white cursor-default group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      Posts
                    </Label>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Always included</span>
                </div>
                
                {/* Spaces Item */}
                <div className="flex items-center justify-between py-3 group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/10 rounded-sm transition-colors">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="spaces" 
                      checked={searchSources.spaces} 
                      onCheckedChange={(checked) => setSearchSources({...searchSources, spaces: checked === true})}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
                    />
                    <Label htmlFor="spaces" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      Spaces
                    </Label>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {searchSources.spaces ? "Included" : "Not included"}
                  </span>
                </div>
                
                {/* Members Item */}
                <div className="flex items-center justify-between py-3 group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/10 rounded-sm transition-colors">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="members" 
                      checked={searchSources.members} 
                      onCheckedChange={(checked) => setSearchSources({...searchSources, members: checked === true})}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
                    />
                    <Label htmlFor="members" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      Members
                    </Label>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {searchSources.members ? "Included" : "Not included"}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end mt-5">
                <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        
          {/* Knowledge Base Spaces Card - Refined */}
          <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
            <CardHeader className="px-6 pt-5 pb-0">
              <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight mb-1">Knowledge Base Spaces</CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Select the spaces that contain official knowledge or verified content in your community.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pt-4">
              <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
            </div>
            <CardContent className="px-6 pt-4 pb-5">        
              <div className="border border-gray-200 dark:border-gray-700/80 rounded-md p-3.5 mb-4 min-h-[68px] bg-gray-50/50 dark:bg-gray-800/10">
                <div className="flex flex-wrap gap-2">
                  {knowledgeBaseSpaces.map((space) => (
                    <Badge 
                      key={space} 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2.5 rounded-full flex items-center gap-1.5 transition-colors"
                    >
                      <BookOpenIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-medium">{space}</span>
                      <button 
                        onClick={() => removeSpace(space)} 
                        className="ml-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 p-0.5 transition-colors"
                      >
                        <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      </button>
                    </Badge>
                  ))}
                  <Badge 
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 py-1 px-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
                    onClick={addSpace}
                  >
                    <PlusIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">Add</span>
                  </Badge>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                These spaces will be grouped separately from other posts in search results and prioritized when 
                generating answers with the Ask AI feature (if enabled).
              </p>
              
              <div className="flex justify-end">
                <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Ask AI Access Card - Refined */}
          <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
            <CardHeader className="px-6 pt-5 pb-0">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight">Ask AI access</CardTitle>
                <Badge variant="outline" className="h-5 px-1.5 py-0 bg-green-50 text-green-600 border border-green-100 font-medium text-[10px] rounded-full">New</Badge>
              </div>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Give members access to Ask AI for smarter and more relevant search results.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pt-4">
              <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
            </div>
            <CardContent className="px-6 pt-4 pb-5">
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-50/70 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 rounded-md">
                    <SparklesIcon className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" /> 
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white block">Ask AI</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">AI-powered search assistant</span>
                  </div>
                </div>
                <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Federated Search Card - Refined */}
          <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
            <CardHeader className="px-6 pt-5 pb-0">
              <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight mb-1">Federated Search</CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Enhance community search by integrating both community content and external data sources.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pt-4">
              <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
            </div>
            <CardContent className="px-6 pt-4 pb-5">
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-50/70 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-md">
                    <SearchIcon className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> 
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white block">Connect external sources</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Integrate with platforms your members use</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary-gray" size="sm" className="h-8 px-3 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                    Docs
                  </Button>
                  <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 