# Data Structure Visualizer - Replit Setup

## Project Overview
This is an interactive web application for learning data structures through visual animations and step-by-step operations. Built with Next.js 15, TypeScript, Shadcn/ui, React Flow and Framer Motion.

## Current State
The project has been successfully configured for the Replit environment:
- ✅ Dependencies installed
- ✅ Next.js configuration updated for Replit proxy support
- ✅ Development server running on port 5000
- ✅ Deployment configuration set up

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Graph Visualization**: React Flow
- **UI Components**: Shadcn/ui
- **Content**: MDX files for explanations

## Key Features
The application visualizes multiple data structures:
- Linked Lists (singly, doubly, circular)
- Stack & Queue with LIFO/FIFO operations
- Trees (BST and AVL with auto-balancing)
- Heap (min/max implementations)
- Applications: Infix to Postfix conversion, Message Queue simulation, Polynomial multiplication, Huffman coding, Dijkstra's algorithm

## Configuration Changes Made
1. **next.config.ts**: Added Replit-specific configuration to allow proxy connections and handle iframe embedding
2. **Workflow**: Set up to run `npm run dev -- --hostname 0.0.0.0 --port 5000`
3. **Deployment**: Configured for autoscale deployment with build and start commands

## Development Workflow
The Next.js development server is configured to run on `0.0.0.0:5000` to work with Replit's proxy system. The application compiles MDX content and serves the interactive visualizers.

## Recent Changes (September 23, 2025)
- Initial Replit setup completed
- Dependencies installed and verified
- Development server configured and tested
- Deployment configuration added