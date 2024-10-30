# PlayRoll

PlayRoll is a content aggregation and tracking platform designed to help users organize and monitor their progress on various types of content, such as videos, blogs, papers, podcasts, books, and more. Built using Next.js and Shadcn, the app provides a structured way to manage and keep track of diverse media collections, allowing users to create curated content "albums" or "rolls" and share them with others.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [To-Do](#to-do)
- [License](#license)

---

## Project Overview

PlayRoll is designed as a single-page application (SPA) with a focus on usability, extensibility, and ubiquity. It allows users to:
- Organize content into categories like videos, blogs, podcasts, and more.
- Track their progress on each content item.
- Take notes on content, allowing for deeper engagement.
- Create "albums" or "reels" of curated content for a more organized consumption experience.
- Filter content by type and view it in multiple column layouts.

The goal of PlayRoll is to provide users with a centralized, distraction-free place to track and consume content without being bombarded by endless platform recommendations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React with server-side rendering and static generation)
- **UI Library**: [Shadcn](https://shadcn.dev/) for a cohesive and customizable UI component library
- **Language**: TypeScript
- **Icons**: Lucide-react
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16.x or above recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/playroll.git
   cd playroll```
2. Install dependencies:
    ```bash
   npm i
   npm run dev
   ```
3. Run development server:
    ```bash
   npm run dev
   ```   
4. Open browser and visit http://localhost:3000 to view PlayRoll app:

### Project Structure
```bash
playroll/
├── app/
│   ├── page.tsx               # Entry point (home page) with button navigation to /dashboard
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard screen that loads DashboardContent
├── components/
│   ├── DashboardContent.tsx   # Main component rendering the dashboard content
│   ├── CollapsibleCard.tsx    # Component for collapsible content cards
│   ├── ProgressBar.tsx        # Progress bar component
│   ├── FilterControls.tsx     # Filter buttons and layout controls
├── public/                    # Static assets
├── styles/                    # Global styles
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```