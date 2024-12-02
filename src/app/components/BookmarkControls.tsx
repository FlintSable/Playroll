import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud, UploadCloud } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const BookmarkControls = ({ selectedCollection, onImportComplete }) => {
  // Changed from collections
  const { toast } = useToast();

  const handleExportBookmarks = async () => {
    try {
      // Check if we have a selected collection
      if (!selectedCollection) {
        toast({
          variant: "destructive",
          description: "No collection selected to export",
        });
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/bookmarks/export",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collections: [selectedCollection] }), // Send array with just selected collection
        },
      );
      // Add these lines after the fetch
      if (!response.ok) {
        throw new Error("Failed to export bookmarks");
      }

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "playroll-bookmarks.html";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        description: "Bookmarks exported successfully",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to export bookmarks",
      });
    }
  };

  const handleImportBookmarks = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("bookmarkFile", file);

    try {
      const response = await fetch(
        "http://localhost:3001/api/bookmarks/import",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to import bookmarks");
      }

      const importedData = await response.json();
      onImportComplete(importedData);

      toast({
        description: "Bookmarks imported successfully",
      });
    } catch (error) {
      console.error("Import failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to import bookmarks",
      });
    }

    // Reset the file input
    event.target.value = "";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Bookmarks
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportBookmarks}>
          <DownloadCloud className="mr-2 h-4 w-4" />
          Export Bookmarks
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".html";
            input.onchange = handleImportBookmarks;
            input.click();
          }}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Import Bookmarks
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkControls;
