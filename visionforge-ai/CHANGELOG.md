# Changelog

All notable changes to VisionForge AI will be documented in this file.

## [1.0.0] — 2025-02-22

### Added

- **Core Platform**
    - Next.js 15 App Router with TypeScript
    - TailwindCSS design system with brand purple palette
    - Prisma ORM with PostgreSQL database schema
    - NextAuth v4 authentication (GitHub, Google, Credentials)

- **Image Generation**
    - Multi-provider support (OpenAI DALL-E 3, Stability AI, HuggingFace)
    - 12 style presets (Photorealistic, Anime, Digital Art, etc.)
    - 5 resolution options (512x512 to 1792x1024)
    - Creativity slider, negative prompts, seed control
    - AI-powered prompt enhancement

- **User System**
    - JWT-based authentication with role support
    - Credit system with subscription tiers (Free, Pro, Enterprise)
    - User dashboard with generation history and stats
    - Profile management

- **Admin Panel**
    - Platform analytics with daily activity charts
    - User management (role, credits, tier)
    - System metrics overview

- **Gallery**
    - Public image gallery with filtering and sorting
    - Like system with toggle
    - Lightbox with keyboard navigation
    - Pagination

- **UI Components**
    - Button, Input, Card, Modal, Tabs, Dropdown
    - Skeleton loaders, spinners, toast notifications
    - Responsive navbar with animated active indicator
    - Dark/light theme support

- **Infrastructure**
    - Rate limiting (token bucket algorithm)
    - Cloud storage abstraction (S3 / R2 / Supabase)
    - Job queue (BullMQ + in-memory fallback)
    - Route protection middleware
    - Zustand state management

- **DevOps**
    - Dockerfile with multi-stage build
    - Docker Compose (app + PostgreSQL + Redis)
    - Vercel deployment configuration
    - GitHub Actions CI/CD pipeline
