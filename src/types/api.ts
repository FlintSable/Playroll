export interface SortRequest {
  action: "sortByName" | "sortByType";
  data: {
    items: ContentItem[];
    ascending?: boolean;
  };
}

export interface SortResponse {
  items: ContentItem[];
}
