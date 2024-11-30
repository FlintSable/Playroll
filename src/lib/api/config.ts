export const API_CONFIG = {
  SORTING_SERVICE:
    process.env.NEXT_PUBLIC_SORTING_SERVICE_URL || "http://localhost:3001",
  BOOKMARKS_SERVICE:
    process.env.NEXT_PUBLIC_BOOKMARKS_SERVICE_URL || "http://localhost:3002",
  AUTH_SERVICE:
    process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3003",
};
