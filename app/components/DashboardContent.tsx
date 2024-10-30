"use client";

import { useState } from "react";
import { Video, FileText, Book, Headphones, Wrench, Image, ChevronDown, ChevronUp, ExternalLink, Edit, Folder} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [selectedCollection, setSelectedCollection] = useState<Collection>(mockCollections[0]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<ContentType[]>([]);
  const [columnLayout, setColumnLayout] = useState<"single" | "double" | "triple">("single");

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleEdit = (item: ContentItem) => {
    console.log("Edit item:", item);
    // Implement edit functionality here
  };

  const toggleFilter = (type: ContentType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredItems = selectedCollection.items.filter(
    (item) => activeFilters.length === 0 || activeFilters.includes(item.type)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Collections Pane */}
      <div className="w-64 bg-muted p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Collections</h2>
        {mockCollections.map((collection) => (
          <Button
            key={collection.id}
            variant={selectedCollection.id === collection.id ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => setSelectedCollection(collection)}
          >
            <Folder className="mr-2 h-4 w-4" />
            {collection.name}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{selectedCollection.name}</h1>

          {/* Filters and Layout Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(iconMap).map(([type, icon]) => (
                <Button
                  key={type}
                  variant={activeFilters.includes(type as ContentType) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(type as ContentType)}
                >
                  {icon}
                  <span className="ml-2">{type}</span>
                </Button>
              ))}
            </div>
            <Select
              value={columnLayout}
              onValueChange={(value: "single" | "double" | "triple") => setColumnLayout(value)}
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
          {filteredItems.map((item) => (
            <Collapsible
              key={item.id}
              open={expandedItems.includes(item.id)}
              onOpenChange={() => toggleItem(item.id)}
            >
              <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">{iconMap[item.type]}</div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
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
              </div>
              <CollapsibleContent>
                <div className="p-4 mt-2 bg-muted rounded-lg space-y-4">
                  <p className="text-sm">{item.description}</p>
                  <div className="bg-background p-3 rounded-md">
                    <h4 className="font-semibold mb-2">Notes:</h4>
                    <p className="text-sm">{item.notes}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Resource
                    </a>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
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
    </div>
  );
}