"use client";

import { useState, useEffect } from "react";
import { Video, FileText, Book, Headphones, Wrench, Image, ChevronDown, ChevronUp, ExternalLink, Edit, Share2, Folder, Plus, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
 } from "@/components/ui/sidebar";


type ContentType = "video" | "blog" | "paper" | "book" | "podcast" | "tool" | "image";

type ContentItem ={
  id: string;
  title: string;
  type: ContentType;
  url: string;
  description: string;
  progress: number;
  notes: string;
};

// n: this is the Roll data type
type Collection = {
  id: string;
  name: string;
  items: ContentItem[];
};

const iconMap: Record<ContentType, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
  paper: <FileText className="h-4 w-4" />,
  book: <Book className="h-4 w-4" />,
  podcast: <Headphones className="h-4 w-4" />,
  tool: <Wrench className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
};

const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Web Development",
    items: [
      {
        id: "1",
        title: "React Hooks Tutorial",
        type: "video",
        url: "https://example.com/react-hooks",
        description: "Learn about React Hooks",
        progress: 50,
        notes: "Covered useState and useEffect"
      },
      {
        id: "2",
        title: "CSS Grid Layout",
        type: "blog",
        url: "https://example.com/css-grid",
        description: "Comprehensive guide to CSS Grid",
        progress: 75,
        notes: "Great resource for layout techniques"
      },
    ],
  },
  {
    id: "2",
    name: "Machine Learning",
    items: [
      {
        id: "3",
        title: "Machine Learning Basics",
        type: "book",
        url: "https://example.com/ml-basics",
        description: "Introduction to machine learning concepts",
        progress: 30,
        notes: "Currently on chapter 3: Neural Networks",
      },
      {
        id: "4",
        title: "Data Science Podcast",
        type: "podcast",
        url: "https://example.com/data-science-podcast",
        description: "Weekly discussions on data science topics",
        progress: 100,
        notes: "Great episode on feature engineering",
      },
    ],
  },
];

export default function DashboardContent() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection>(mockCollections[0]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<ContentType[]>([]);
  const [columnLayout, setColumnLayout] = useState<"single" | "double" | "triple">("single");
  const [editingCollection, setEditingCollection] = useState<string | null>(null)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isAddingCollection, setIsAddingCollection] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({})
  const [isFirstRun, setIsFirstRun] = useState(true)

  // n: 1. tries to load saved collections from localStorage
  // n: default collection selection, runs whenever collections or selectedCollections changes  
  //  * 2. if there are no collections use the mock data
  useEffect(() => {
    const storedCollections = localStorage.getItem('collections')
    if (storedCollections) {
      const parsedCollections = JSON.parse(storedCollections)
      setCollections(parsedCollections)
      setSelectedCollection(parsedCollections[0])
      setIsFirstRun(false)
    } else if (!collections.length) {
      // Only use mock collections if there's nothing in storage and collections is empty
      setCollections(mockCollections)
      setSelectedCollection(mockCollections[0])
      setIsFirstRun(false)
    }
  }, [])

  //n: persistence, runs when collections state changes
  //3. ensures a collection is always selected for display 
  useEffect(() => {
    if (collections.length > 0) {
      localStorage.setItem('collections', JSON.stringify(collections))
    }
  }, [collections])

  // n: Function to reset to initial state (useful for testing)
  const resetToInitialState = () => {
    localStorage.removeItem('collections');
    setCollections([]);
    setSelectedCollection(null);
    setIsFirstRun(true);
    setActiveFilters([]); // Reset filters too
    setExpandedItems([]); // Reset expanded items
  };

  // n: Function to load mock data (useful for testing)
  const loadMockData = () => {
    setCollections(mockCollections)
    setSelectedCollection(mockCollections[0])
    setIsFirstRun(false)
    localStorage.setItem('collections', JSON.stringify(mockCollections))
  }

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection.id)
  };

  const handleSaveCollectionName = (collectionId: string, newName: string) => {
    setCollections(prev => prev.map(collection =>
      collection.id === collectionId ? { ...collection, name: newName } : collection
    ))
    setEditingCollection(null)
  }

  const handleAddCollection = () =>{
    if(newCollectionName.trim()){
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        items: []
      }
      setCollections(prev => [...prev, newCollection])
      setNewCollectionName("")
      setIsAddingCollection(false)
      setIsFirstRun(false)
    }
  }

  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item)
  }

  const toggleFilter = (type: ContentType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getFilteredItems = (collection: Collection | null) => {
    if (!collection) return [];
    return collection.items.filter(
      (item) => activeFilters.length === 0 || activeFilters.includes(item.type)
    );
  };

  const handleShare = () => {
    console.log("Share")
  }

  // n: Add a test controls section that only appears in development
  const TestControls = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-card rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Test Controls</h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToInitialState}
            className="w-full"
          >
            Reset to First Run
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadMockData}
            className="w-full"
          >
            Load Mock Data
          </Button>
          <div className="text-sm text-muted-foreground">
            Collections: {collections.length}
            <br />
            Is First Run: {isFirstRun ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Rolls Pane */}
      <div className="w-[250px] flex-shrink-0">
        <SidebarProvider>
          <Sidebar className="border-r">
            <SidebarHeader>
              <h2 className="text-lg font-semibold px-4 py-2">Rolls</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {collections.map(collection => (
                  <SidebarMenuItem key={collection.id}>
                    {editingCollection === collection.id ? (
                      <div className="flex items-center space-x-2 px-4 py-2">
                        <Input
                          value={collection.name}
                          onChange={(e) => {
                            const newName = e.target.value
                            setCollections(prev => prev.map(c =>
                              c.id === collection.id ? { ...c, name: newName } : c
                            ))
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveCollectionName(collection.id, collection.name)
                            }
                          }}
                          className="h-9"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveCollectionName(collection.id, collection.name)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <SidebarMenuButton
                        isActive={selectedCollection?.id === collection.id}
                        onClick={() => setSelectedCollection(collection)}
                        onDoubleClick={() => handleEditCollection(collection)}
                      >
                        <Folder className="mr-2 h-4 w-4" />
                        {collection.name}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
                
                {/* Add Collection Button */}
                <SidebarMenuItem>
                  {isAddingCollection ? (
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <Input
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Collection name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCollection()
                          }
                        }}
                      />
                      <Button size="sm" onClick={handleAddCollection}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <SidebarMenuButton onClick={() => setIsAddingCollection(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Collection
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
        </SidebarProvider>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {isFirstRun ? (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to PlayRoll!</h1>
            <p className="mb-4">Get started by creating your first roll or exploring the sample rolls.</p>
            <Button onClick={() => setIsAddingCollection(true)}>Create Your First Roll</Button>
          </div>
        ) : selectedCollection ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{selectedCollection.name}</h1>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Select value={columnLayout} onValueChange={(value: "single" | "double" | "triple") => setColumnLayout(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select column layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Column</SelectItem>
                    <SelectItem value="double">Two Columns</SelectItem>
                    <SelectItem value="triple">Three Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Items */}
            <div className={`grid gap-4 ${
              columnLayout === "single" ? "grid-cols-1" : 
              columnLayout === "double" ? "grid-cols-1 md:grid-cols-2" : 
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {selectedCollection.items
                .filter(item => activeFilters.length === 0 || activeFilters.includes(item.type))
                .map(item => (
                <Collapsible
                  key={item.id}
                  open={expandedItems.includes(item.id)}
                  onOpenChange={() => toggleItem(item.id)}
                >
                  <div className="relative flex items-center justify-between p-4 bg-card rounded-lg shadow group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {iconMap[item.type]}
                      </div>
                      <div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold hover:underline"
                        >
                          {item.title}
                        </a>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">{item.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Progress: {item.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={item.progress} className="w-24" />
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {expandedItems.includes(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    {/* URL tooltip on hover */}
                    <div className="absolute left-0 -top-8 hidden group-hover:block bg-popover text-popover-foreground p-2 rounded shadow-lg text-sm">
                      {item.url}
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="p-4 mt-2 bg-muted rounded-lg space-y-4">
                      <p className="text-sm">{item.description}</p>
                      <div className="bg-background p-3 rounded-md">
                        <h4 className="font-semibold mb-2">Notes:</h4>
                        <p className="text-sm">{item.notes}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        ) : null}
      </div>


      {/* Test Controls */}
      <TestControls />


    </div>
  );
}