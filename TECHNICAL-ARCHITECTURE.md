# Technical Architecture — Stackless v1

**Parent documents:** [PRD.md](PRD.md) · [MVP.md](MVP.md) · [INFORMATION-ARCHITECTURE.md](INFORMATION-ARCHITECTURE.md)
**Version:** 1.0
**Date:** February 8, 2026
**Role:** Senior Full Stack Engineer
**Scope:** Every technical decision for the MVP — stack, content pipeline, deployment, and data flow.

---

## Design Principles (Engineering)

1. **Static over dynamic.** Every page is pre-built HTML. No server computes anything at request time.
2. **File-system over database.** Content lives in Markdown files inside a Git repo, not in a database.
3. **Zero runtime infrastructure.** No servers to manage. No database to back up. No containers to orchestrate.
4. **Convention over configuration.** The project structure itself encodes the rules. Minimal config files.
5. **Boring technology.** Every tool chosen is stable, widely adopted, and will still work in 5 years.

---

## 1. Overall Architecture

### 1.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN (Varun)                                    │
│                                                                             │
│   VS Code / Editor          Terminal              Browser                   │
│   ┌──────────────┐    ┌──────────────────┐   ┌─────────────────┐           │
│   │  Write .mdx  │    │  git push        │   │  Preview at     │           │
│   │  files       │    │  to GitHub       │   │  localhost:3000  │           │
│   └──────┬───────┘    └────────┬─────────┘   └─────────────────┘           │
│          │                     │                                            │
└──────────┼─────────────────────┼────────────────────────────────────────────┘
           │                     │
           ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GITHUB REPOSITORY                                  │
│                                                                             │
│   /content/posts/*.mdx        ← Blog post content                          │
│   /content/paths/*.json       ← Learning path definitions                  │
│   /content/topics.json        ← Category/topic metadata                    │
│   /src/                       ← Application code (Next.js)                 │
│   /public/                    ← Static assets (images, fonts)              │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   │  git push triggers
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BUILD PIPELINE (Vercel)                            │
│                                                                             │
│   1. Clone repo                                                             │
│   2. Install dependencies                                                   │
│   3. Process .mdx files → parse frontmatter, compile to HTML                │
│   4. Generate static pages (SSG) for every route                            │
│   5. Generate sitemap.xml, feed.xml                                         │
│   6. Optimize images (WebP/AVIF, responsive sizes)                          │
│   7. Deploy to CDN edge nodes globally                                      │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CDN EDGE NETWORK                                   │
│                                                                             │
│   Pre-built HTML, CSS, JS, images served from edge locations                │
│   No origin server. No database queries. Just files on a CDN.              │
│                                                                             │
│   stackless.dev ──→ nearest edge node ──→ static HTML response             │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            READER (Student)                                 │
│                                                                             │
│   Receives fully-rendered HTML. Minimal JS hydration.                       │
│   No client-side data fetching. No loading spinners.                        │
│   Page is readable before any JS executes.                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       ANALYTICS (External Service)                          │
│                                                                             │
│   Plausible Analytics (hosted) or Umami (self-hosted)                       │
│   Lightweight script (~1KB). No cookies. GDPR-compliant.                    │
│   Tracks: page views, time on page, scroll depth, referrers.               │
│   Dashboard accessed separately — not part of the blog codebase.           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Tech Stack — Final Choices

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | **Next.js (App Router)** | Static Site Generation (SSG) with `generateStaticParams`. React ecosystem for component reuse. Excellent MDX support. Industry-standard for content sites. |
| **Language** | **TypeScript** | Type safety for content schemas, frontmatter validation, and component props. Catches errors at build time. |
| **Content** | **MDX (Markdown + JSX)** | Markdown for prose, JSX for custom components (callout boxes, term definitions, figure captions). No database. Files in the repo. |
| **Styling** | **Tailwind CSS** | Utility-first CSS. Fast to build, easy to maintain solo. Excellent typography plugin (`@tailwindcss/typography`) for prose styling. |
| **Deployment** | **Vercel** | Zero-config for Next.js. Automatic builds on `git push`. Global CDN. Free tier covers a blog's traffic comfortably. |
| **Analytics** | **Plausible Analytics** | Privacy-respecting. Lightweight (< 1KB script). No cookies. Provides time-on-page, scroll depth, referrers. $9/month or self-host. |
| **KV Store** | **Upstash Redis (or Vercel KV)** | Serverless key-value store for reader-submitted data (suggestions, feedback). Free tier sufficient. No server to manage. See [DATA-MODELS.md](DATA-MODELS.md) for full details. |
| **Domain/DNS** | **Cloudflare** | Free DNS, fast propagation, SSL. Domain registered anywhere, DNS managed on Cloudflare. |
| **Version Control** | **GitHub** | Source of truth for all content and code. Commit history = editorial history. |

### 1.3 What Is NOT in the Stack

| Omission | Why |
|---|---|
| **No relational database** | Content is in files. Reader-submitted data (suggestions, feedback) uses a lightweight serverless KV store — not a full database. See [DATA-MODELS.md](DATA-MODELS.md). |
| **No backend/API server** | No dynamic endpoints needed. Everything is generated at build time. |
| **No CMS (Contentful, Sanity, etc.)** | Adds a dependency, a subscription, a learning curve, and sync complexity. VS Code + MDX is faster for a solo author who codes. |
| **No Docker/containers** | Nothing to containerize. Vercel handles the build environment. |
| **No Redis/cache layer** | The CDN IS the cache. Static files don't need application-level caching. |
| **No authentication service (for readers)** | No user accounts for readers. The admin authenticates via GitHub OAuth to access the admin panel (`/admin`). See [ADMIN-ROLE.md](ADMIN-ROLE.md) for full details. |

---

## 2. Why This Architecture Suits a Blog Platform

### 2.1 The Core Argument: Blogs Are Read-Heavy, Write-Rare

```
  Writes (admin publishes):     4–6 per month
  Reads (visitors load pages):  thousands–millions per month

  Write-to-read ratio:          ~1 : 10,000+
```

This is the most extreme read-heavy workload in software. The correct architecture for a system where writes are rare and reads are everything is **pre-computation** — build the HTML once when the admin writes, serve it instantly to every reader from static files.

A database-backed blog (WordPress, Ghost, custom API + frontend) computes the same HTML on every request. That's wasted work for a read-heavy site.

### 2.2 Architecture Benefits Mapped to Requirements

| Requirement (from PRD/MVP) | How This Architecture Delivers |
|---|---|
| **Page load < 2s LCP** | Static HTML served from CDN edge. No server round-trip. No database query. No SSR computation. LCP is essentially the time to download a single HTML file + CSS. |
| **SEO-friendly** | Full HTML is in the response. Search engine crawlers get complete content immediately — no JavaScript rendering required. Meta tags, Open Graph, JSON-LD structured data all baked into the static HTML at build time. |
| **Works without JavaScript** | The entire reading experience is server-rendered HTML + CSS. JS is only for progressive enhancement (e.g., tooltips). |
| **Minimal publishing friction** | Write MDX → `git push` → live in ~60 seconds. No CMS login, no publish button, no content sync. |
| **Full version history** | Git commit history tracks every change to every post. Rollback = `git revert`. Free, permanent audit trail. |
| **Zero ops burden** | No servers. No database backups. No SSL certificate rotation. No security patches for a running server. Vercel manages the infrastructure. |
| **Scales without thinking** | CDN handles traffic spikes automatically. If a post hits the front page of Hacker News, the CDN serves the same static file — no scaling concerns. |
| **Ownership** | Content lives in Markdown files in a Git repo the admin owns. If Vercel disappears, the same repo deploys to Netlify, Cloudflare Pages, or any static host in under an hour. No vendor lock-in on content. |

### 2.3 Tradeoffs Acknowledged

| Tradeoff | Impact | Acceptable Because |
|---|---|---|
| **Build time on every change** | Every edit triggers a full site rebuild (~30–90 seconds for <30 pages). | Build happens in CI, not locally. The admin pushes and walks away. Rebuild time is invisible. |
| **No real-time content updates** | A published post isn't "live" until the build finishes. | 60-second deploy latency is fine for a blog. We're not publishing breaking news. |
| **No dynamic content** | Can't show "trending posts" or personalized recommendations. | V1 has no personalization by design. All content decisions are admin-curated. |
| **MDX requires technical skill** | The admin must know Markdown and be comfortable with a code editor. | The admin IS a developer. Writing in VS Code is faster than any CMS for someone who codes daily. |

---

## 3. Content Management Approach

### 3.1 Why MDX (Not Markdown, Not a CMS, Not a Database)

| Option | Verdict | Reasoning |
|---|---|---|
| **Plain Markdown** | ❌ Too limited | Can't embed custom components (callout boxes, term definitions, styled takeaway sections). Would need to hack around Markdown's constraints. |
| **MDX** | ✅ Chosen | Markdown for 95% of writing (prose, headings, lists, code blocks, images). JSX for the 5% that needs custom treatment (callouts, definitions, figure captions). Best of both worlds. |
| **Headless CMS (Contentful, Sanity)** | ❌ Overkill | Adds a third-party dependency, a monthly cost, a content sync layer, and a learning curve — all for a single-author blog. The admin is a developer; a CMS slows him down. |
| **Database (Postgres, Mongo)** | ❌ Wrong tool | Requires a running server, a connection pool, an ORM, migrations, backups. For what? To store text that changes 4–6 times a month? Files are the right abstraction. |
| **Ghost / WordPress** | ❌ Wrong philosophy | Opinionated platforms with their own admin panels, plugin ecosystems, and upgrade cycles. Stackless needs full design control and zero platform baggage. |

### 3.2 Content Directory Structure

```
/content
│
├── /posts
│   ├── how-discord-stores-messages.mdx
│   ├── what-happens-when-you-like-a-tweet.mdx
│   ├── how-uber-matches-riders.mdx
│   └── what-is-a-database-really.mdx
│
├── /paths
│   ├── databases-from-zero.json
│   └── distributed-systems-101.json
│
├── topics.json
│
└── /images
    ├── discord-architecture.webp
    ├── uber-dispatch-flow.webp
    └── tweet-fanout-diagram.webp
```

### 3.3 Post File Anatomy (MDX + Frontmatter)

```mdx
---
title: "How Discord Stores Trillions of Messages"
slug: "how-discord-stores-messages"
date: 2026-01-28
category: "databases"
readingTime: "14 min"
summary: "A deep dive into Discord's message storage — from Cassandra to ScyllaDB."
originalSource:
  title: "How Discord Stores Trillions of Messages"
  url: "https://discord.com/blog/how-discord-stores-trillions-of-messages"
readNext:
  - "what-is-a-database-really"
  - "what-happens-when-you-like-a-tweet"
featured: false
draft: false
order: 2
---

Imagine you send a message in a Discord server with 500,000 members...

<Callout type="analogy">
  Think of it like a library. If you have 100 books, you can find any
  book by scanning the shelf. But with 10 billion books...
</Callout>

Discord originally used **Cassandra** — a distributed NoSQL database designed
for high write throughput.

<Definition term="Cassandra">
  A distributed database that spreads data across many machines. It's designed
  to handle massive write volumes but trades off read performance and
  consistency for that capability.
</Definition>

![Discord's message storage architecture](./images/discord-architecture.webp)
*Figure 1: How messages flow from a user's client to a storage shard.*

## What You Should Remember

- Discord stores trillions of messages across sharded clusters.
- They migrated from Cassandra to ScyllaDB because...
- The key trade-off was consistency vs. availability.
- This is an example of the "shared-nothing" architecture pattern.
```

### 3.4 Frontmatter Schema (TypeScript Validation)

Every MDX file's frontmatter is validated at build time. If a required field is missing or malformed, the build fails with a clear error — not a silent rendering bug.

```
PostFrontmatter {
  title:          string        (required)   — Post title
  slug:           string        (required)   — URL slug, must be unique
  date:           Date          (required)   — Publish date (ISO 8601)
  category:       string        (required)   — Must match a slug in topics.json
  readingTime:    string        (required)   — e.g., "14 min"
  summary:        string        (required)   — 1–2 sentence description
  originalSource: {
    title:        string        (required)   — Title of the source blog post
    url:          string        (required)   — URL of the source blog post
  }
  readNext:       string[]      (optional)   — Array of post slugs (max 2)
  featured:       boolean       (optional)   — Default: false
  draft:          boolean       (optional)   — Default: false
  order:          number        (optional)   — Display order within category
}
```

Validation tool: **Zod** or **Content Collections schema** (if using a content layer like Contentlayer or Next.js's built-in MDX support with custom loaders). The schema is defined once and applied to every post at build time.

### 3.5 Content Pipeline — Build-Time Processing

```
                    BUILD TIME (runs on Vercel, ~60 seconds)
                    ==========================================

  ┌──────────────┐
  │  Read all    │
  │  .mdx files  │
  │  from /content/posts/
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Parse YAML  │──→  Validate against Zod schema
  │  frontmatter │     (fail build if invalid)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Filter out  │──→  draft: true posts are excluded
  │  drafts      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Compile MDX │──→  Markdown → HTML
  │  to HTML     │     JSX components → rendered React elements
  │              │     Code blocks → syntax-highlighted HTML (at build time)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Generate    │──→  One static HTML page per post
  │  pages via   │     One page per topic (from topics.json)
  │  SSG         │     One page per learning path (from /paths/*.json)
  │              │     Homepage, About, 404, Topics index, Paths index
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Generate    │──→  sitemap.xml (all public URLs)
  │  SEO assets  │     feed.xml (RSS, full content)
  │              │     robots.txt
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Optimize    │──→  Images → WebP/AVIF, responsive srcset
  │  assets      │     CSS → purged & minified
  │              │     JS → tree-shaken, code-split, minified
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Deploy to   │──→  All static files pushed to CDN edge
  │  CDN         │     Atomic deployment (old version replaced instantly)
  └──────────────┘
```

### 3.6 Custom MDX Components (v1 Scope)

Only the components actually needed for the editorial format. No component library. No design system.

| Component | Purpose | Usage |
|---|---|---|
| `<Callout>` | Styled aside for analogies, warnings, or "why this matters" blocks. | `<Callout type="analogy">...</Callout>` |
| `<Definition>` | Inline jargon explanation. Visually distinct from body text. | `<Definition term="Sharding">...</Definition>` |
| `<Figure>` | Image with a numbered caption and alt text. | `<Figure src="..." alt="..." caption="Figure 1: ..." />` |
| `<Takeaways>` | The "What You Should Remember" section. Renders as a styled bullet list in a distinct container. | `<Takeaways>...</Takeaways>` |
| `<SourceLink>` | The "Want to go deeper?" link to the original blog. | Auto-generated from frontmatter. Not manually placed. |

**Total custom components: 4 authored + 1 auto-generated.** That's all. No component creep.

---

## 4. Role-Based Access

### 4.1 Why There Are Only Two Roles

Stackless has no user accounts. There is no authentication system, no login page, no session management. This is deliberate (see PRD NG1).

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Role 1: ADMIN (Varun)                                         │
│   ─────────────────────                                         │
│   Authentication: GitHub repo write access                       │
│   (whoever can push to the repo can publish)                    │
│                                                                  │
│   Role 2: READER (Everyone else)                                │
│   ──────────────────────────────                                │
│   Authentication: None                                           │
│   (the site is public, no login required)                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Access Control Matrix

| Action | Admin | Reader |
|---|---|---|
| Read any published post | ✅ | ✅ |
| Browse topics, paths, about | ✅ | ✅ |
| Subscribe via RSS | ✅ | ✅ |
| Create a new post | ✅ (via Git) | ❌ |
| Edit a post | ✅ (via Git) | ❌ |
| Unpublish a post | ✅ (set `draft: true`) | ❌ |
| Define learning paths | ✅ (edit JSON files) | ❌ |
| Manage categories | ✅ (edit `topics.json`) | ❌ |
| View analytics | ✅ (Plausible dashboard) | ❌ |
| Deploy the site | ✅ (`git push`) | ❌ |
| Access admin panel | N/A — no admin panel exists | N/A |

### 4.3 Security Model

| Concern | How It's Handled |
|---|---|
| **Who can publish?** | Only people with push access to the GitHub repo. In practice: Varun. The repo is private. |
| **Who can read?** | Everyone. The deployed site is public. No gating. |
| **Can readers modify content?** | No. The site is static HTML. There's no write path from the browser to the content. No forms, no API endpoints, no database to attack. |
| **DDoS protection** | Vercel's CDN + Cloudflare DNS provide built-in DDoS mitigation. Static sites are inherently resilient — there's no origin server to overwhelm. |
| **Secrets/credentials** | The only secret is the GitHub repo access + Vercel deployment token. Both are managed through standard GitHub/Vercel security — 2FA, access tokens, no secrets in code. |
| **Supply chain security** | Minimal dependencies. Lock file (`package-lock.json`) committed. Dependabot enabled for vulnerability alerts. |

**The attack surface of a static site is effectively zero.** There are no API endpoints to exploit, no database to inject into, no sessions to hijack, no file uploads to abuse.

---

## 5. Search Implementation Strategy

### 5.1 v1: No Search (By Design)

Per the MVP document (X1), search is excluded from v1. With fewer than 30 posts, the three discovery mechanisms — latest posts, topic browsing, and learning paths — are sufficient.

### 5.2 v2: Client-Side Static Search

When the content library crosses ~30 posts, search will be added using a **client-side static search index** — no search server, no Elasticsearch, no API.

**Recommended tool: Pagefind**

```
Why Pagefind:
├── Runs at build time — indexes the static HTML output
├── Zero runtime server — search index is a static file loaded by the browser
├── Tiny payload — only loads the index chunks relevant to the query (~100KB for a small site)
├── No configuration — point it at the build output, it generates everything
├── Works without JS frameworks — vanilla JS widget, can be styled freely
└── Used by: MDN Web Docs, Astro docs, many Hugo sites
```

### 5.3 Search Architecture (v2)

```
                    BUILD TIME
                    ==========

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  Next.js     │────→│  Static HTML │────→│  Pagefind    │
  │  builds site │     │  output in   │     │  indexes the │
  │              │     │  /out or     │     │  HTML output │
  │              │     │  /.next      │     │              │
  └──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
                                            ┌──────▼───────┐
                                            │  Search index│
                                            │  (static     │
                                            │   .pf files) │
                                            │  deployed    │
                                            │  with site   │
                                            └──────────────┘

                    RUNTIME (in browser)
                    ====================

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  Reader      │────→│  Loads index │────→│  Results     │
  │  types query │     │  chunks on   │     │  rendered    │
  │  in search   │     │  demand      │     │  client-side │
  │  input       │     │  (~100KB)    │     │              │
  └──────────────┘     └──────────────┘     └──────────────┘

  No server involved. No API call. Search runs entirely in the browser
  against a pre-built index file.
```

### 5.4 Search Scope & Ranking (v2 Design Notes)

| Aspect | Decision |
|---|---|
| **What's indexed** | Post titles, summaries, body text, category names. NOT code blocks. |
| **Ranking** | Title matches scored highest, then summary, then body. Default Pagefind behavior is sufficient. |
| **UI** | A search input in the nav bar (replaces the blank space on the right). Results shown as a dropdown or an overlay — not a separate page. |
| **Fallback** | If JS is disabled, the search input is hidden. Topic browsing and paths remain available. |

---

## 6. Related Blogs Logic — Technical Implementation

### 6.1 Data Flow

"Read Next" suggestions are resolved **at build time**, not at runtime. The logic runs during the static site generation step.

```
  Build step: resolveReadNext(post)
  ====================================

  Input:  A single post's frontmatter + all other published posts
  Output: An array of 0–2 post objects (title, slug, category, readingTime)

  ┌──────────────────────────────────────────────────────────────┐
  │  Step 1: Read the post's readNext field from frontmatter    │
  │                                                              │
  │  readNext: ["what-is-a-database-really",                    │
  │             "what-happens-when-you-like-a-tweet"]            │
  │                                                              │
  │  → If defined and non-empty: resolve slugs to post objects  │
  │    - Validate each slug exists as a published post          │
  │    - Warn at build time if a slug doesn't resolve (typo?)   │
  │    - Skip drafts (don't suggest unpublished posts)          │
  │    - Return the resolved posts. Done.                       │
  │                                                              │
  │  → If empty or missing: proceed to Step 2.                  │
  └──────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────────┐
  │  Step 2: Fallback — same-category posts                     │
  │                                                              │
  │  - Get all published posts in the same category             │
  │  - Exclude the current post                                 │
  │  - Sort by the `order` field (admin-defined sequence)       │
  │  - Find the current post's position in this sorted list     │
  │  - Take the next 2 posts in sequence                        │
  │                                                              │
  │  Example:                                                    │
  │    Category "databases" ordered: [A, B, C, D, E]            │
  │    Current post: C                                           │
  │    Suggestion: [D, E]                                        │
  │                                                              │
  │  → If 2 posts found: return them. Done.                     │
  │  → If 0–1 posts found: proceed to Step 3.                  │
  └──────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────────┐
  │  Step 3: Fallback — most recent posts from any category     │
  │                                                              │
  │  - Get all published posts across all categories            │
  │  - Exclude the current post                                 │
  │  - Exclude any post already selected in Step 2              │
  │  - Sort by date (newest first)                              │
  │  - Take enough posts to fill remaining slots (up to 2 total)│
  │                                                              │
  │  → Return whatever is available (could be 0 if site has     │
  │    only 1 post — edge case on launch day).                  │
  └──────────────────────────────────────────────────────────────┘
```

### 6.2 Deduplication with Learning Path Navigation

A post can appear in both the "Read Next" section and as the "Next in path" link. Showing the same post twice is wasteful.

```
  After resolving Read Next posts:
  ─────────────────────────────────

  ┌─────────────────────────────────────────────────┐
  │  Is this post part of a learning path?          │
  │                                                  │
  │  YES → Get the "next post" in the path          │
  │        │                                         │
  │        ├─ Is that post in the Read Next list?    │
  │        │  │                                      │
  │        │  ├─ YES → Remove it from Read Next      │
  │        │  │        (path nav takes priority)     │
  │        │  │                                      │
  │        │  └─ NO  → Keep both sections as-is      │
  │        │                                         │
  │  NO  → Show Read Next section only               │
  └─────────────────────────────────────────────────┘
```

### 6.3 Learning Path Resolution

Learning paths are stored as JSON files. At build time, the system:

1. Reads all path definition files from `/content/paths/`.
2. For each post being rendered, checks if that post's slug appears in any path's `posts` array.
3. If yes, injects path navigation data into the post's page: path name, previous post, next post.

```
/content/paths/databases-from-zero.json
{
  "slug": "databases-from-zero",
  "title": "Understanding Databases: From B-Trees to Distributed Storage",
  "description": "Start with how databases work, then explore...",
  "posts": [
    "what-is-a-database-really",       ← position 0 (first, no "previous")
    "how-discord-stores-messages",      ← position 1
    "why-netflix-built-their-own-db",   ← position 2
    "how-stripe-handles-payments-db"    ← position 3 (last, no "next")
  ]
}
```

```
  For post "how-discord-stores-messages" (position 1):

  pathNav = {
    pathTitle: "Understanding Databases: From B-Trees to Distributed Storage",
    pathSlug: "databases-from-zero",
    previous: { title: "What Is a Database, Really?", slug: "what-is-a-database-really" },
    next: { title: "Why Netflix Built Their Own Database", slug: "why-netflix-built-their-own-db" }
  }
```

---

## 7. Project Structure (File Organization)

```
stackless/
│
├── content/                            # All content lives here
│   ├── posts/                          # Blog posts (MDX files)
│   │   ├── how-discord-stores-messages.mdx
│   │   └── what-is-a-database-really.mdx
│   ├── paths/                          # Learning path definitions
│   │   └── databases-from-zero.json
│   ├── topics.json                     # Category definitions
│   └── images/                         # Post images (diagrams, etc.)
│       ├── discord-architecture.webp
│       └── uber-dispatch-flow.webp
│
├── src/
│   ├── app/                            # Next.js App Router pages
│   │   ├── layout.tsx                  # Root layout (nav, footer)
│   │   ├── page.tsx                    # Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Blog post template
│   │   ├── topics/
│   │   │   ├── page.tsx                # Topics index
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Topic listing page
│   │   ├── paths/
│   │   │   ├── page.tsx                # Paths index
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Learning path page
│   │   ├── feed.xml/
│   │   │   └── route.ts               # RSS feed generation
│   │   └── not-found.tsx               # 404 page
│   │
│   ├── components/                     # React components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── post/
│   │   │   ├── PostHeader.tsx          # Title, metadata, source link
│   │   │   ├── PostBody.tsx            # MDX content wrapper
│   │   │   ├── ReadNext.tsx            # Read Next suggestions
│   │   │   └── PathNav.tsx             # Learning path navigation
│   │   ├── mdx/                        # Custom MDX components
│   │   │   ├── Callout.tsx
│   │   │   ├── Definition.tsx
│   │   │   ├── Figure.tsx
│   │   │   └── Takeaways.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedPost.tsx
│   │   │   └── PostList.tsx
│   │   └── shared/
│   │       ├── PostCard.tsx            # Reusable post list item
│   │       └── TopicTag.tsx            # Category label/link
│   │
│   ├── lib/                            # Utilities and data fetching
│   │   ├── content.ts                  # Read/parse MDX files
│   │   ├── paths.ts                    # Read/resolve learning paths
│   │   ├── topics.ts                   # Read/resolve topics
│   │   ├── readnext.ts                 # Read Next resolution logic
│   │   ├── rss.ts                      # RSS feed generation
│   │   └── schema.ts                   # Zod schemas for frontmatter
│   │
│   └── styles/
│       └── globals.css                 # Tailwind imports + custom prose styles
│
├── public/                             # Static files served as-is
│   ├── favicon.ico
│   ├── og-default.png                  # Default Open Graph image
│   └── robots.txt
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

**File count at launch: ~35–40 files.** That's the entire application. A solo developer can hold the entire system in their head.

---

## 8. Performance Budget

| Metric | Target | Enforcement |
|---|---|---|
| **LCP** | < 2.0s on 4G | Lighthouse CI in GitHub Actions. Build fails if exceeded. |
| **Total page weight (HTML + CSS + JS)** | < 200KB (excluding images) | Bundle analysis in CI. |
| **JavaScript shipped to reader** | < 50KB (gzipped) | Minimal hydration. Most pages are pure HTML + CSS. |
| **Time to Interactive** | < 3.0s on 4G | Lighthouse CI. |
| **Cumulative Layout Shift** | < 0.1 | Image dimensions specified. No dynamic content injection. |
| **First Contentful Paint** | < 1.5s on 4G | Static HTML, critical CSS inlined. |

### Image Optimization Pipeline

```
  Source image (PNG/JPG from admin)
         │
         ▼
  Next.js Image Optimization (next/image)
         │
         ├── Converts to WebP (and AVIF where supported)
         ├── Generates responsive sizes (640, 750, 1080, 1200px)
         ├── Adds width/height attributes (prevents layout shift)
         ├── Lazy-loads below-the-fold images
         └── Serves via CDN with immutable cache headers
```

---

## 9. SEO Implementation Detail

| SEO Element | Implementation |
|---|---|
| **Page titles** | Template: `{Post Title} — Stackless` for posts, `{Topic} — Stackless` for topics, `Stackless — Real engineering blogs, explained for students` for homepage. |
| **Meta descriptions** | Post `summary` from frontmatter. Homepage and topic pages have hand-written descriptions. |
| **Open Graph tags** | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (article for posts, website for others). Generated in `layout.tsx` and page-level `generateMetadata()`. |
| **Twitter Card** | `twitter:card` = `summary_large_image`. Same title/description/image as OG. |
| **Canonical URL** | `<link rel="canonical" href="https://stackless.dev/posts/{slug}" />` on every page. |
| **JSON-LD structured data** | `Article` schema on post pages: headline, author, datePublished, description, image. `WebSite` schema on homepage. |
| **Sitemap** | Auto-generated at build time. Lists all posts, topics, paths, and static pages. |
| **RSS** | Full-content RSS feed at `/feed.xml`. |
| **Robots.txt** | Allow all crawling. No pages blocked. |
| **URL structure** | Clean, semantic slugs. No query parameters. No fragments in URLs. |

---

## 10. Deployment & CI/CD

```
  Developer pushes to `main` branch on GitHub
         │
         ▼
  GitHub → Vercel webhook triggers
         │
         ▼
  Vercel Build Environment
  ┌──────────────────────────────────────────────────┐
  │  1. npm ci                (install deps)         │
  │  2. npm run lint          (ESLint + TypeScript)   │
  │  3. npm run build         (Next.js SSG)          │
  │     ├── Validate frontmatter schemas             │
  │     ├── Compile MDX → HTML                       │
  │     ├── Generate all static pages                │
  │     ├── Generate sitemap.xml                     │
  │     ├── Generate feed.xml                        │
  │     └── Optimize images                          │
  │  4. Lighthouse CI        (performance check)     │
  │     └── Fail if LCP > 2s or score < 90           │
  └──────────────────────────┬───────────────────────┘
                             │
                    All checks pass?
                    ┌────────┴────────┐
                    │ YES             │ NO
                    ▼                 ▼
            Deploy to CDN       Build fails.
            (atomic swap)       Error in GitHub.
            Site is live.       Nothing deployed.
```

**Branch strategy:** Simple. `main` branch = production. No staging environments in v1. Preview deployments on pull requests (Vercel provides this automatically).

---

## Architecture Decision Records (Summary)

| Decision | Chosen | Rejected Alternative | Key Reason |
|---|---|---|---|
| Rendering strategy | SSG (Static Site Generation) | SSR, CSR, ISR | Read-heavy workload. SSG = zero compute at request time. |
| Framework | Next.js (App Router) | Astro, Hugo, Gatsby | Best MDX ecosystem. React for component reuse. Vercel-native. |
| Content format | MDX files in Git | CMS, Database, Markdown-only | Custom components + zero infrastructure + Git history. |
| Styling | Tailwind CSS | CSS Modules, Styled Components | Fastest for solo dev. Typography plugin handles prose. |
| Hosting | Vercel | Netlify, Cloudflare Pages, AWS | Zero-config for Next.js. Atomic deploys. Free tier sufficient. |
| Search (v2) | Pagefind (client-side) | Algolia, Elasticsearch, Meilisearch | No server. No API key. Runs entirely in-browser on static index. |
| Analytics | Plausible | Google Analytics, custom build | Privacy-respecting, lightweight, no cookies, scroll depth tracking. |
| Auth strategy | GitHub OAuth (admin panel) + Git repo access (content) | NextAuth, Firebase Auth, Clerk | Hybrid model: GitHub OAuth for admin panel, Git for content authoring. No reader accounts. See [ADMIN-ROLE.md](ADMIN-ROLE.md). |

---

*This document defines how Stackless is built. It is a companion to the product documents (PRD, MVP), the information architecture, and the [admin role definition](ADMIN-ROLE.md). The next step is implementation — building the actual codebase following this architecture.*
