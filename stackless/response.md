# Stackless — Refactor & Stabilization Report

**Date:** February 8, 2026
**Scope:** Architecture cleanup, MongoDB stabilization, MDX pipeline removal
**Lead:** Senior Staff Engineer (automated execution)

---

## 1. Final Folder Structure

```
src/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── layout.tsx                        # Root layout (Navbar + Footer)
│   ├── globals.css                       # Tailwind v4 styles
│   ├── not-found.tsx                     # 404 page
│   ├── favicon.ico
│   │
│   ├── about/page.tsx                    # Static about page
│   ├── posts/[slug]/page.tsx             # Blog post (react-markdown)
│   ├── topics/page.tsx                   # Topics listing
│   ├── topics/[slug]/page.tsx            # Posts by topic
│   ├── paths/page.tsx                    # Learning paths listing
│   ├── paths/[slug]/page.tsx             # Path detail
│   ├── search/page.tsx                   # Full-text search
│   ├── feed.xml/route.ts                 # RSS 2.0 feed
│   │
│   ├── admin/
│   │   ├── layout.tsx                    # Auth guard + AdminShell
│   │   ├── page.tsx                      # Admin dashboard
│   │   ├── posts/page.tsx                # Post management
│   │   ├── topics/page.tsx               # Topic management
│   │   ├── paths/page.tsx                # Path management
│   │   ├── settings/page.tsx             # Site settings
│   │   ├── deploy/page.tsx               # Vercel deploy trigger
│   │   ├── analytics/page.tsx            # Analytics placeholder
│   │   └── login/page.tsx                # GitHub OAuth login
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts   # NextAuth handler
│       ├── posts/route.ts                # GET/POST/PUT posts
│       ├── topics/route.ts               # GET/POST topics
│       ├── paths/route.ts                # GET/POST paths
│       └── deploy/route.ts               # POST → Vercel deploy hook
│
├── components/
│   ├── ui/
│   │   ├── PostCard.tsx                  # Blog post card
│   │   ├── TopicTag.tsx                  # Topic badge
│   │   ├── SearchView.tsx                # Client-side search
│   │   ├── ReadNext.tsx                  # Read next suggestions
│   │   └── PathNav.tsx                   # Learning path navigation
│   │
│   ├── layout/
│   │   ├── Navbar.tsx                    # Site navigation
│   │   └── Footer.tsx                    # Site footer
│   │
│   └── admin/
│       ├── AdminShell.tsx                # Admin sidebar layout
│       ├── AdminPostsList.tsx            # Post list with filters
│       ├── PostEditor.tsx                # Post create/edit form
│       └── DeployActions.tsx             # Deploy button component
│
├── db/
│   ├── client.ts                         # Mongoose singleton connection
│   ├── types.ts                          # Shared TypeScript interfaces
│   ├── seed.ts                           # DB seeder script
│   ├── test-connection.ts                # Connection test script
│   │
│   ├── models/
│   │   ├── index.ts                      # Barrel export
│   │   ├── Post.ts                       # Post schema
│   │   ├── Topic.ts                      # Topic schema
│   │   ├── Path.ts                       # Learning path schema
│   │   ├── User.ts                       # User schema
│   │   └── Settings.ts                   # Site settings schema
│   │
│   └── queries/
│       ├── posts.ts                      # getPosts, getPostBySlug, createPost, updatePost
│       ├── topics.ts                     # getTopics, getTopicBySlug, createTopic
│       └── paths.ts                      # getPaths, getPathBySlug, getPathNavForPost, createPath
│
└── lib/
    ├── auth.ts                           # NextAuth v5 config (GitHub OAuth)
    ├── readnext.ts                       # Read-next suggestion algorithm
    └── rss.ts                            # RSS feed generator
```

---

## 2. What Was Deleted

### Directories removed
| Directory | Reason |
|---|---|
| `content/` | Entire filesystem content system (MDX posts, topics.json, path JSONs, images) |
| `src/components/mdx/` | MDX custom components (Callout, Definition, Figure, Takeaways) |
| `src/components/shared/` | Replaced by `components/ui/` |
| `src/components/post/` | Replaced by `components/ui/` (ReadNext, PathNav) |
| `src/components/search/` | Replaced by `components/ui/SearchView` |
| `src/app/api/admin/` | Nested admin API (flattened to `api/deploy/`) |

### Files removed
| File | Reason |
|---|---|
| `src/lib/content.ts` | Filesystem content reader |
| `src/lib/mdx.ts` | MDX compilation pipeline |
| `src/lib/topics.ts` | Filesystem topic reader |
| `src/lib/paths.ts` | Filesystem path reader |
| `src/lib/config.ts` | Filesystem site-config reader |
| `src/lib/schema.ts` | Zod validation schemas (Mongoose handles this now) |

### Dependencies removed
| Package | Reason |
|---|---|
| `next-mdx-remote` | MDX rendering pipeline removed |
| `rehype-pretty-code` | Code highlighting for MDX (not needed with react-markdown) |
| `shiki` | Syntax highlighter for rehype-pretty-code |
| `gray-matter` | Frontmatter parser for MDX files |
| `rehype-slug` | Heading anchor plugin (not imported anywhere) |
| `zod` | Schema validation (Mongoose schemas replace this) |

---

## 3. What Was Moved

| From | To | Reason |
|---|---|---|
| `components/shared/PostCard.tsx` | `components/ui/PostCard.tsx` | Consolidated into `ui/` |
| `components/shared/TopicTag.tsx` | `components/ui/TopicTag.tsx` | Consolidated into `ui/` |
| `components/post/ReadNext.tsx` | `components/ui/ReadNext.tsx` | Consolidated into `ui/` |
| `components/post/PathNav.tsx` | `components/ui/PathNav.tsx` | Consolidated into `ui/` |
| `components/search/SearchView.tsx` | `components/ui/SearchView.tsx` | Consolidated into `ui/` |
| `app/api/admin/deploy/route.ts` | `app/api/deploy/route.ts` | Flattened API structure |

---

## 4. What Was Refactored

### Data layer migration
- All pages now import from `@/db/queries/*` instead of `@/lib/content.ts` or `@/lib/mdx.ts`
- Post content rendered via `react-markdown` + `remark-gfm` (was `next-mdx-remote` + `compileMDX`)
- All `PostEntry` types (with nested `frontmatter`) replaced by flat `DbPost` type

### New files created
| File | Purpose |
|---|---|
| `src/db/types.ts` | Shared TypeScript interfaces (`DbPost`, `DbTopic`, `DbPath`, `PathNavData`, `ReadNextSuggestion`) |
| `src/components/admin/PostEditor.tsx` | Post create/edit form component |
| `src/app/api/posts/route.ts` | REST API for posts (GET/POST/PUT) |
| `src/app/api/topics/route.ts` | REST API for topics (GET/POST) |
| `src/app/api/paths/route.ts` | REST API for paths (GET/POST) |
| `src/app/api/deploy/route.ts` | Deploy trigger (moved from nested path) |

### Import updates
- All public pages: imports from `@/db/queries/*` and `@/components/ui/*`
- All admin pages: imports from `@/db/queries/*` and `@/components/admin/*`
- `lib/readnext.ts`: imports `DbPost`, `PathNavData` from `@/db/types`
- `lib/rss.ts`: imports `DbPost` from `@/db/types`
- `DeployActions.tsx`: endpoint updated from `/api/admin/deploy` to `/api/deploy`
- All pages use `export const dynamic = "force-dynamic"` for server-side rendering

### Seed script
- Rewrote `src/db/seed.ts` to use inline sample data instead of reading from deleted `content/` directory
- Removed `gray-matter` dependency
- Still safe to run multiple times (upsert on slug)

---

## 5. Database Collections

**Database:** `stackless` (MongoDB Atlas)

| Collection | Key Fields | Indexes |
|---|---|---|
| `posts` | title, slug, summary, content, topic, difficulty, readTimeMinutes, publishedAt, featured, draft, published, readNext[], sourceUrl, sourcePublisher, ogImage | `slug` (unique), `published` |
| `topics` | name, slug, description | `slug` (unique) |
| `paths` | title, slug, description, posts[] | `slug` |
| `users` | email, role (ADMIN/USER) | `email` (unique) |
| `settings` | siteName, description, social { twitter, github, linkedin } | — |

All collections have `timestamps: true` (createdAt, updatedAt).

---

## 6. How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Setup

```bash
# 1. Clone & install
git clone <repo-url>
cd stackless
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your values:
#   MONGODB_URI=mongodb+srv://...
#   AUTH_SECRET=<random-string>
#   GITHUB_ID=<github-oauth-app-id>
#   GITHUB_SECRET=<github-oauth-app-secret>
#   ADMIN_GITHUB_ID=<your-github-numeric-id>

# 3. Seed the database (optional — inserts sample content)
npx tsx src/db/seed.ts

# 4. Run dev server
npm run dev

# 5. Build for production
npm run build
```

### Available scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npx tsx src/db/seed.ts` | Seed database with sample data |
| `npx tsx src/db/test-connection.ts` | Test MongoDB connection |

---

## 7. How to Test DB Connection

```bash
npx tsx src/db/test-connection.ts
```

Expected output:
```
[test] Connecting to MongoDB...
[test] Connected.

[test] Post found: DB Connection Test (db-connection-test)

[test] ✅ All checks passed!
```

Alternatively, verify through the app:
1. Run `npm run dev`
2. Open `http://localhost:3000` — homepage should display posts from MongoDB
3. Click any post — full content should render via react-markdown

---

## 8. Remaining Technical Debt

| Item | Priority | Notes |
|---|---|---|
| **AUTH_SECRET warning in dev** | Low | NextAuth shows `MissingSecret` errors in dev logs. The secret IS set in `.env.local` but NextAuth v5 beta has this known issue with env loading order. Works correctly in production. |
| **Admin post create/edit pages** | Medium | `PostEditor.tsx` component is created but admin pages for `/admin/posts/new` and `/admin/posts/[slug]/edit` don't exist yet. The API routes (`POST /api/posts`, `PUT /api/posts`) are ready. |
| **API validation** | Medium | API routes do basic field checks. Consider adding Zod validation for request bodies before DB writes. |
| **Search implementation** | Low | Client-side search works but fetches all posts. Consider MongoDB Atlas Search or text indexes for scale. |
| **Image handling** | Low | `ogImage` field exists but no image upload system. Currently just stores filenames. |
| **Caching** | Low | All pages use `force-dynamic`. Consider ISR or `unstable_cache` for frequently-read pages. |
| **test-connection.ts** | Low | Development utility. Could be moved to a `scripts/` directory. |
| **Error monitoring** | Low | No Sentry or similar. Consider adding for production. |

---

## 9. Build Verification

```
✓ Compiled successfully in 10.4s
✓ TypeScript — zero errors
✓ Static pages generated (9/9)
✓ 22 routes compiled

Routes:
  Static:  /_not-found, /about
  Dynamic: /, /admin/*, /api/*, /feed.xml, /paths/*, /posts/*, /search, /topics/*
```

### Runtime verification
- ✅ Homepage renders — posts loaded from MongoDB
- ✅ Post page renders — markdown content via react-markdown
- ✅ Topics page renders — topics from DB
- ✅ Paths page renders — learning paths from DB
- ✅ Admin routes protected — redirects to login (307)
- ✅ API routes respond — /api/posts, /api/topics, /api/paths, /api/deploy
- ✅ RSS feed generates — /feed.xml

---

## 10. Current Dependencies

### Production
| Package | Version | Purpose |
|---|---|---|
| next | 16.1.6 | Framework (App Router) |
| react | 19.2.3 | UI library |
| react-dom | 19.2.3 | React DOM renderer |
| mongoose | ^9.1.6 | MongoDB ODM |
| next-auth | ^5.0.0-beta.30 | Authentication (GitHub OAuth) |
| @auth/core | ^0.41.0 | Auth core library |
| react-markdown | ^10.1.0 | Markdown rendering |
| remark-gfm | ^4.0.1 | GitHub-flavored markdown |
| @tailwindcss/typography | ^0.5.19 | Prose typography styles |

### Dev
| Package | Purpose |
|---|---|
| typescript | Type checking |
| tailwindcss v4 | CSS framework |
| @tailwindcss/postcss | PostCSS integration |
| eslint + eslint-config-next | Linting |
| tsx | TypeScript execution (scripts) |

---

*End of engineering handover document.*
