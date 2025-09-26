# Originals Store - React + TypeScript + Vite Project

## Overview
This is a React e-commerce application built with TypeScript and Vite, featuring a curated store for original/vintage items. The project includes product catalog, detail pages, and admin functionality.

## Recent Changes
- **September 26, 2025**: Successfully imported and configured for Replit environment
  - Installed all dependencies using bun
  - Configured Vite server to run on 0.0.0.0:5000 for Replit proxy compatibility
  - Set up frontend workflow with webview output
  - Verified application runs without errors

## Project Architecture
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Package Manager**: Bun
- **Styling**: Tailwind CSS
- **Routing**: React Router Dom v7
- **UI Libraries**: Framer Motion, Lucide React, React Icons

## Project Structure
```
src/
├── components/
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── ProductCard.tsx
│   └── ProductGrid.tsx
├── pages/
│   ├── Admin.tsx
│   ├── Home.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   └── ProductDetail.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Key Configuration
- **Vite Config**: Pre-configured with Chariot plugin for Replit environment
- **Server Settings**: Host 0.0.0.0, Port 5000, allowedHosts: true for proxy compatibility
- **Dev Server**: Auto-reload enabled with file polling for cloud environment

## Available Scripts
- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run preview`: Preview production build
- `bun run lint`: Run ESLint

## Deployment
- **Target**: Autoscale deployment for stateless React application
- **Build Command**: `bun run build`
- **Start Command**: Production server configuration pending