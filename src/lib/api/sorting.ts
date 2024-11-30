import { API_CONFIG } from "./config";
import { ContentItem, SortRequest } from "@/types/api";

interface SortRequest {
  action: string;
  data: {
    items: ContentItem[];
    ascending?: boolean;
  };
}

export async function sortItems(request: SortRequest) {
  const response = await fetch(`${API_CONFIG.SORTING_SERVICE}/sort`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Sorting failed");
  }

  return response.json();
}
