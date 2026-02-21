# VisionForge AI

A production-ready AI image generation platform built with Next.js 15, TypeScript, and TailwindCSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **AI Image Generation** — Generate images via OpenAI DALL-E 3, Stability AI, or HuggingFace
- **Prompt Enhancer** — AI-powered prompt improvement with rule-based fallback
- **User Authentication** — GitHub, Google, and credentials login via NextAuth
- **User Dashboard** — Track generations, images, credits, and history
- **Admin Panel** — Analytics, user management, and platform metrics
- **Public Gallery** — Browse, like, and download community creations
- **Credit System** — Per-user credit management with subscription tiers
- **Dark Mode** — Full dark/light theme support via next-themes
- **Responsive Design** — Mobile-first UI with glass morphism design system
- **Rate Limiting** — Token bucket rate limiting per IP/user
- **Cloud Storage** — Abstracted storage (S3 / Cloudflare R2 / Supabase)
- **Job Queue** — BullMQ + Redis with in-memory fallback

---

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 15 (App Router) |
| Language   | TypeScript 5.7          |
| Styling    | TailwindCSS + CVA       |
| Database   | PostgreSQL + Prisma ORM |
| Auth       | NextAuth v4 (JWT)       |
| State      | Zustand                 |
| Animation  | Framer Motion           |
| UI         | Radix UI primitives     |
| Queue      | BullMQ + Redis          |
| Validation | Zod                     |

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis (optional, for production queue)

### 1. Clone & Install

```bash
cd visionforge-ai
npm install --legacy-peer-deps
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/visionforge"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Provider (openai | stability | huggingface)
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."

# OAuth (optional)
GITHUB_ID="..."
GITHUB_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Docker

### Using Docker Compose

```bash
docker compose up -d
```

This starts the app, PostgreSQL, and Redis. The app runs on port 3000.

### Standalone Docker

```bash
docker build -t visionforge-ai .
docker run -p 3000:3000 --env-file .env visionforge-ai
```

---

## Project Structure

```
visionforge-ai/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth + registration
│   │   ├── generate/       # Image generation
│   │   ├── prompt-enhance/ # Prompt enhancement
│   │   ├── images/         # Gallery + likes
│   │   ├── dashboard/      # User dashboard stats
│   │   └── admin/          # Admin analytics + users
│   ├── dashboard/          # User dashboard pages
│   ├── admin/              # Admin panel pages
│   ├── gallery/            # Public gallery
│   ├── generate/           # Generation page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Reusable UI primitives
│   ├── layout/             # Navbar, Footer, Sidebar
│   └── generate/           # Generation-specific components
├── lib/
│   ├── services/           # Business logic services
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── storage.ts          # Cloud storage abstraction
│   ├── queue.ts            # Job queue
│   ├── rate-limit.ts       # Rate limiting
│   ├── store.ts            # Zustand stores
│   └── validators.ts       # Zod schemas
├── prisma/
│   └── schema.prisma       # Database schema
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── middleware.ts            # Auth + route protection
├── Dockerfile              # Production Docker image
├── docker-compose.yml      # Full stack compose
├── vercel.json             # Vercel deployment config
└── .github/workflows/      # CI/CD pipeline
```

---

## API Reference

### Authentication

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | `/api/auth/register`      | Register new user |
| POST   | `/api/auth/[...nextauth]` | NextAuth handler  |

### Image Generation

| Method | Endpoint              | Description      |
| ------ | --------------------- | ---------------- |
| POST   | `/api/generate`       | Generate images  |
| POST   | `/api/prompt-enhance` | Enhance a prompt |

### Gallery

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/images`           | List gallery images  |
| POST   | `/api/images/[id]/like` | Toggle like on image |

### Dashboard

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/dashboard/stats` | User dashboard stats |

### Admin

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/admin/analytics` | Platform analytics |
| GET    | `/api/admin/users`     | List users         |
| PATCH  | `/api/admin/users`     | Update user        |

---

## Design System

### Colors

- **Brand**: Purple palette (`#675afe` base) with 50–950 shades
- **Surface**: Dark grays (`#0a0a0f` to `#2a2a3e`)
- **Semantic**: Success green, warning amber, error red

### Components

Built with **Class Variance Authority (CVA)** for type-safe variants:

- `Button` — 6 variants, 4 sizes, loading state
- `Input` / `Textarea` — Labels, errors, icons
- `Card` — Default, glass, bordered variants
- `Modal` — Radix Dialog based
- `Tabs` — Radix Tabs
- `Dropdown` — Radix Dropdown Menu
- `Loader` — Skeleton, Spinner, Dots, ImageSkeleton, PageLoader
- `ImageGrid` + `Lightbox` — Animated gallery with keyboard navigation

---

## Environment Variables

| Variable                                    | Required    | Description                            |
| ------------------------------------------- | ----------- | -------------------------------------- |
| `DATABASE_URL`                              | Yes         | PostgreSQL connection string           |
| `NEXTAUTH_SECRET`                           | Yes         | JWT signing secret                     |
| `NEXTAUTH_URL`                              | Yes         | App URL                                |
| `AI_PROVIDER`                               | No          | `openai` / `stability` / `huggingface` |
| `OPENAI_API_KEY`                            | Conditional | Required if AI_PROVIDER=openai         |
| `STABILITY_API_KEY`                         | Conditional | Required if AI_PROVIDER=stability      |
| `HUGGINGFACE_API_KEY`                       | Conditional | Required if AI_PROVIDER=huggingface    |
| `GITHUB_ID` / `GITHUB_SECRET`               | No          | GitHub OAuth                           |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No          | Google OAuth                           |
| `STORAGE_PROVIDER`                          | No          | `s3` / `r2` / `supabase`               |
| `REDIS_URL`                                 | No          | Redis for BullMQ queue                 |
| `RATE_LIMIT_MAX_REQUESTS`                   | No          | Rate limit max (default: 10)           |
| `RATE_LIMIT_WINDOW_MS`                      | No          | Rate limit window (default: 60000)     |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy automatically

### Docker

```bash
docker compose up -d
npx prisma db push    # Run migrations inside container
```

### Manual

```bash
npm run build
npm start
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
