"use client";

import { useState, useEffect } from "react";
import {
  Video,
  FileText,
  Book,
  Headphones,
  Wrench,
  Image,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ArrowUpDown,
  ExternalLink,
  Edit,
  Share2,
  Folder,
  Plus,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
// import { ChevronUpDown, ArrowUpDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import BookmarkControls from "@/app/components/BookmarkControls";

// n: 1 of 2 - add new media type here
type ContentType =
  | "video"
  | "blog"
  | "paper"
  | "book"
  | "podcast"
  | "tool"
  | "image"
  | "docs";

type ContentItem = {
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

//n: 2 of 2 - add new media type here
const iconMap: Record<ContentType, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
  paper: <FileText className="h-4 w-4" />,
  book: <Book className="h-4 w-4" />,
  podcast: <Headphones className="h-4 w-4" />,
  tool: <Wrench className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
  docs: <FileText className="h-4 w-4" />,
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
        notes: "Covered useState and useEffect",
      },
      {
        id: "2",
        title: "CSS Grid Layout",
        type: "blog",
        url: "https://example.com/css-grid",
        description: "Comprehensive guide to CSS Grid",
        progress: 75,
        notes: "Great resource for layout techniques",
      },
    ],
  },
  {
    id: "2",
    name: "Game Development",
    items: [
      {
        id: "7",
        title: "Unity Engine Masterclass",
        type: "video",
        url: "https://example.com/unity-masterclass",
        description: "Complete guide to game development with Unity",
        progress: 40,
        notes: "Learning about physics systems and particle effects",
      },
      {
        id: "8",
        title: "Game Design Patterns",
        type: "book",
        url: "https://example.com/game-patterns",
        description: "Essential patterns for game architecture and design",
        progress: 65,
        notes: "Great examples of component systems",
      },
      {
        id: "9",
        title: "Game Dev Tools Overview",
        type: "blog",
        url: "https://example.com/gamedev-tools",
        description:
          "Comprehensive comparison of popular game development tools",
        progress: 100,
        notes: "Helped choose tech stack for current project",
      },
    ],
  },
  {
    id: "4",
    name: "Cybersecurity",
    items: [
      {
        id: "13",
        title: "Ethical Hacking Course",
        type: "video",
        url: "https://example.com/ethical-hacking",
        description: "Comprehensive guide to penetration testing",
        progress: 55,
        notes: "Learning about network security protocols",
      },
      {
        id: "14",
        title: "Security Tools Guide",
        type: "blog",
        url: "https://example.com/security-tools",
        description: "Overview of essential security testing tools",
        progress: 95,
        notes: "Implemented several tools in current project",
      },
      {
        id: "15",
        title: "Cyber Security Weekly",
        type: "podcast",
        url: "https://example.com/security-weekly",
        description: "Weekly updates on security threats and solutions",
        progress: 80,
        notes: "Great coverage of recent vulnerabilities",
      },
    ],
  },
];

export default function DashboardContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>(
    mockCollections[0],
  );
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<ContentType[]>([]);
  const [columnLayout, setColumnLayout] = useState<
    "single" | "double" | "triple"
  >("single");
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null,
  );
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({});
  const [isFirstRun, setIsFirstRun] = useState(true);

  // n: 1. tries to load saved collections from localStorage
  // n: default collection selection, runs whenever collections or selectedCollections changes
  //  * 2. if there are no collections use the mock data
  useEffect(() => {
    const storedCollections = localStorage.getItem("collections");
    if (storedCollections) {
      const parsedCollections = JSON.parse(storedCollections);
      setCollections(parsedCollections);
      setSelectedCollection(parsedCollections[0]);
      setIsFirstRun(false);
    } else if (!collections.length) {
      // Only use mock collections if there's nothing in storage and collections is empty
      setCollections(mockCollections);
      setSelectedCollection(mockCollections[0]);
      setIsFirstRun(false);
    }
  }, []);

  //n: persistence, runs when collections state changes
  //3. ensures a collection is always selected for display
  useEffect(() => {
    if (collections.length > 0) {
      localStorage.setItem("collections", JSON.stringify(collections));
    }
  }, [collections]);

  //n: Function to reset to initial state (useful for testing)
  const resetToInitialState = () => {
    localStorage.removeItem("collections");
    setCollections([]);
    setSelectedCollection(null);
    setIsFirstRun(true);
    setActiveFilters([]); //n: Reset filters too
    setExpandedItems([]); //n: Reset expanded items
  };

  //n: Function to load mock data (useful for testing)
  const loadMockData = () => {
    setCollections(mockCollections);
    setSelectedCollection(mockCollections[0]);
    setIsFirstRun(false);
    localStorage.setItem("collections", JSON.stringify(mockCollections));
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection.id);
  };

  const handleSaveCollectionName = (collectionId: string, newName: string) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? { ...collection, name: newName }
          : collection,
      ),
    );
    setEditingCollection(null);
  };

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        items: [],
      };
      setCollections((prev) => [...prev, newCollection]);
      setNewCollectionName("");
      setIsAddingCollection(false);
      setIsFirstRun(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.title && newItem.type && newItem.url && selectedCollection) {
      const item: ContentItem = {
        id: Date.now().toString(),
        title: newItem.title,
        type: newItem.type as ContentType,
        url: newItem.url,
        description: newItem.description || "",
        progress: newItem.progress || 0,
        notes: newItem.notes || "",
      };

      //n: ternary operator
      setCollections((prev) => {
        const newCollections = prev.map((collection) =>
          collection.id === selectedCollection.id
            ? { ...collection, items: [...collection.items, item] }
            : collection,
        );

        const updatedSelectedCollection = newCollections.find(
          (c) => c.id === selectedCollection.id,
        );
        if (updatedSelectedCollection) {
          setSelectedCollection(updatedSelectedCollection);
        }
        return newCollections;
      });
      setNewItem({});
      setIsAddingItem(false);
    }
  };

  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updatedItem: ContentItem) => {
    if (selectedCollection) {
      setCollections((prev) => {
        const newCollections = prev.map((collection) =>
          collection.id === selectedCollection.id
            ? {
                ...collection,
                items: collection.items.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item,
                ),
              }
            : collection,
        );

        // Find and update the selected collection
        const updatedSelectedCollection = newCollections.find(
          (c) => c.id === selectedCollection.id,
        );
        if (updatedSelectedCollection) {
          setSelectedCollection(updatedSelectedCollection);
        }

        return newCollections;
      });

      setEditingItem(null);
    }
  };

  const toggleFilter = (type: ContentType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const getFilteredItems = (collection: Collection | null) => {
    if (!collection) return [];
    return collection.items.filter(
      (item) => activeFilters.length === 0 || activeFilters.includes(item.type),
    );
  };

  const handleShare = () => {
    console.log("Share");
  };

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = async (sortType: "name" | "type") => {
    if (!selectedCollection?.items.length) return;

    try {
      // n: First update the UI to show loading state if needed
      console.log(`Sorting by ${sortType} in ${sortOrder} order`);

      const response = await fetch("/api/sort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `sortBy${sortType.charAt(0).toUpperCase() + sortType.slice(1)}`,
          data: {
            items: selectedCollection.items,
            ascending: sortOrder === "asc",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Sorting failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received sorted data:", data);

      if (!Array.isArray(data.items)) {
        throw new Error("Invalid response format from sorting service");
      }

      // n: Update both collections and selectedCollection atomically
      setCollections((prev) => {
        const newCollections = prev.map((collection) =>
          collection.id === selectedCollection.id
            ? { ...collection, items: data.items }
            : collection,
        );

        // n: Update selected collection
        const updatedCollection = newCollections.find(
          (c) => c.id === selectedCollection.id,
        );
        if (updatedCollection) {
          setSelectedCollection(updatedCollection);
        }

        return newCollections;
      });
    } catch (error) {
      console.error("Sorting failed:", error);
      // n: Optionally add error handling UI here
    }
  };

  const handleBookmarkImport = (importedData) => {
    setCollections((prev) => {
      const mergedCollections = [...prev];
      importedData.forEach((importedCollection) => {
        const existingIndex = mergedCollections.findIndex(
          (c) => c.name === importedCollection.name,
        );
        if (existingIndex >= 0) {
          // n. Merge items, avoiding duplicates
          const existingUrls = new Set(
            mergedCollections[existingIndex].items.map((item) => item.url),
          );
          const newItems = importedCollection.items.filter(
            (item) => !existingUrls.has(item.url),
          );
          mergedCollections[existingIndex].items.push(...newItems);
        } else {
          mergedCollections.push(importedCollection);
        }
      });
      return mergedCollections;
    });
  };

  //n: Add a test controls section that only appears in development
  const TestControls = () => {
    if (process.env.NODE_ENV !== "development") return null;

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
            Is First Run: {isFirstRun ? "Yes" : "No"}
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
                {collections.map((collection) => (
                  <SidebarMenuItem key={collection.id}>
                    {editingCollection === collection.id ? (
                      <div className="flex items-center space-x-2 px-4 py-2">
                        <Input
                          value={collection.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setCollections((prev) =>
                              prev.map((c) =>
                                c.id === collection.id
                                  ? { ...c, name: newName }
                                  : c,
                              ),
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveCollectionName(
                                collection.id,
                                collection.name,
                              );
                            }
                          }}
                          className="h-9"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSaveCollectionName(
                              collection.id,
                              collection.name,
                            )
                          }
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
                          if (e.key === "Enter") {
                            handleAddCollection();
                          }
                        }}
                      />
                      <Button size="sm" onClick={handleAddCollection}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => setIsAddingCollection(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Roll
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
            <p className="mb-4">
              Get started by creating your first roll or exploring the sample
              rolls.
            </p>
            <Button onClick={() => setIsAddingCollection(true)}>
              Create Your First Roll
            </Button>
          </div>
        ) : selectedCollection ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{selectedCollection.name}</h1>
              <div className="flex space-x-2">
                <BookmarkControls
                  selectedCollection={selectedCollection}
                  onImportComplete={handleBookmarkImport}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sort
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSort("name")}>
                      Sort by Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("type")}>
                      Sort by Type
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSortOrder((current) =>
                      current === "asc" ? "desc" : "asc",
                    );
                    handleSort("name");
                  }}
                >
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>

                <Select
                  value={columnLayout}
                  onValueChange={(value: "single" | "double" | "triple") =>
                    setColumnLayout(value)
                  }
                >
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
            <div
              className={`grid gap-4 ${
                columnLayout === "single"
                  ? "grid-cols-1"
                  : columnLayout === "double"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {selectedCollection.items
                .filter(
                  (item) =>
                    activeFilters.length === 0 ||
                    activeFilters.includes(item.type),
                )
                .map((item) => (
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
                            {expandedItems.includes(item.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}

              {/* Add Item Button */}
              <Button
                variant="outline"
                className="h-[100px] boarder-dashed"
                onClick={() => setIsAddingItem(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-2x1 font-bold mb-4">No Roll Selected</h1>
            <p>Please select a roll from the sidebar or create a new one.</p>
          </div>
        )}
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editingItem?.title}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={editingItem?.url}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, url: e.target.value } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editingItem?.description}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                Progress
              </Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={editingItem?.progress}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev
                      ? { ...prev, progress: parseInt(e.target.value) }
                      : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editingItem?.notes}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, notes: e.target.value } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => editingItem && handleUpdateItem(editingItem)}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Roll Item Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 item-center gap-4">
              <Label htmlFor="new-title" className="text-right">
                Title
              </Label>
              <Input
                id="new-title"
                value={newItem.title || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-type" className="text-right">
                Type
              </Label>
              <Select
                value={newItem.type}
                onValueChange={(value: ContentType) =>
                  setNewItem({ ...newItem, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-url" className="text-right">
                URL
              </Label>
              <Input
                id="new-url"
                value={newItem.url || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, url: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="new-description"
                value={newItem.description || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddItem}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Controls */}
      <TestControls />
    </div>
  );
}
