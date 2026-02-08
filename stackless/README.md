# Stackless

**Real engineering blogs, explained for students.**

Stackless takes ideas from real company engineering blogs — Discord, Netflix, Uber, Stripe — and re-explains them so students with basic CS fundamentals can genuinely understand.

---

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build (SSG)
npm run lint       # Run ESLint
```

---

## Project Structure

```
stackless/
│
├── content/                          ← ALL CONTENT LIVES HERE (Git-managed)
│   ├── posts/                        ← Blog posts as MDX files
│   │   └── how-discord-stores-messages.mdx
│   ├── paths/                        ← Learning path definitions (JSON)
│   │   └── databases-from-zero.json
│   ├── topics.json                   ← Topic/category definitions
│   ├── site-config.json              ← Global site settings (title, URL, author)
│   └── images/                       ← Post images (diagrams, architecture drawings)
│
├── src/
│   ├── app/                          ← NEXT.JS APP ROUTER (pages & routes)
│   │   ├── layout.tsx                ← Root layout — Navbar, Footer, SEO metadata
│   │   ├── page.tsx                  ← Homepage — hero, latest posts, topic grid
│   │   ├── about/page.tsx            ← About page — what, why, who
│   │   ├── not-found.tsx             ← 404 page — friendly redirect
│   │   ├── posts/[slug]/page.tsx     ← Blog post template (SSG with generateStaticParams)
│   │   ├── topics/
│   │   │   ├── page.tsx              ← Topics index — lists all categories
│   │   │   └── [slug]/page.tsx       ← Topic detail — posts filtered by topic
│   │   ├── paths/
│   │   │   ├── page.tsx              ← Learning paths index
│   │   │   └── [slug]/page.tsx       ← Path detail — ordered post sequence
│   │   └── feed.xml/route.ts        ← RSS feed (Route Handler → XML)
│   │
│   ├── components/                   ← REACT COMPONENTS (organized by domain)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            ← Sticky top nav — logo, Topics, Paths, About, RSS
│   │   │   └── Footer.tsx            ← Site footer — tagline, nav links, attribution
│   │   └── shared/
│   │       ├── PostCard.tsx           ← Reusable post list item (title, summary, meta)
│   │       └── TopicTag.tsx           ← Category label/link (pill style)
│   │
│   ├── lib/                          ← UTILITIES & DATA LAYER (build-time only)
│   │   ├── content.ts                ← Read/parse MDX posts from filesystem
│   │   ├── topics.ts                 ← Load/validate topics from topics.json
│   │   ├── paths.ts                  ← Load/validate learning paths + nav resolution
│   │   ├── readnext.ts               ← "Read Next" suggestion algorithm
│   │   ├── rss.ts                    ← RSS 2.0 XML generation
│   │   ├── config.ts                 ← Site config loader (site-config.json)
│   │   └── schema.ts                 ← Zod schemas for all content types
│   │
│   └── app/globals.css               ← Tailwind imports + design tokens + prose overrides
│
├── public/                           ← STATIC FILES (served as-is by CDN)
│   ├── robots.txt
│   ├── favicon.ico
│   └── og-default.png                ← Default Open Graph image (1200×630)
│
├── next.config.ts                    ← Next.js configuration
├── tsconfig.json                     ← TypeScript config (strict mode, path aliases)
├── postcss.config.mjs                ← PostCSS with Tailwind plugin
└── package.json                      ← Dependencies & scripts
```

---

## Folder-by-Folder Explanation

### `content/`
**Why it's separate from `src/`:** Content is data, not code. Keeping it at the root makes it easy for the author to add/edit posts without touching application code. This directory is the "database" — Git history = editorial history.

- **`posts/`** — Each `.mdx` file is a blog post. Frontmatter (YAML) defines metadata (title, slug, topic, difficulty, source URL). The body is Markdown + JSX custom components.
- **`paths/`** — JSON files that define ordered sequences of posts for guided learning. Each file lists post slugs in reading order.
- **`topics.json`** — Array of category objects (slug, name, description). Single file, not a folder, because topics change rarely.
- **`site-config.json`** — Singleton. Global settings: site title, tagline, author name, analytics domain. Read once at build time.
- **`images/`** — Post images. Referenced by filename in MDX. Optimized by Next.js Image at build time.

### `src/app/`
**Next.js App Router.** File-system based routing. Each folder = a route. `page.tsx` = the page component. `layout.tsx` = shared wrapper.

- **`layout.tsx`** — The shell for every page. Loads fonts, sets global metadata (OG, Twitter, JSON-LD WebSite schema), renders Navbar + Footer.
- **`page.tsx`** — Homepage. Hero section, latest posts, topic grid.
- **`posts/[slug]/page.tsx`** — Dynamic route. One page per blog post. Uses `generateStaticParams()` to pre-render all posts at build time (SSG). Includes Article JSON-LD.
- **`topics/` & `paths/`** — Index pages list all topics/paths. `[slug]` routes show filtered views.
- **`feed.xml/route.ts`** — Route Handler (not a page). Generates RSS XML on request.

### `src/components/`
**Organized by domain, not by type.** `layout/` for structural components, `shared/` for reusable atoms. Future additions: `post/` (PostHeader, PostBody, ReadNext, PathNav), `mdx/` (Callout, Definition, Figure, Takeaways), `home/` (Hero, FeaturedPost, PostList).

### `src/lib/`
**Build-time utilities only.** These modules run during `next build`, never in the browser. They read the filesystem, parse content, validate with Zod, and return typed data.

- **`schema.ts`** — Zod schemas for every content type. If frontmatter is malformed, the build fails — not the reader's experience.
- **`content.ts`** — Core content loader. Reads `.mdx` files, parses frontmatter with `gray-matter`, validates with Zod, returns typed `PostEntry[]`.
- **`readnext.ts`** — Algorithm: same-topic posts first, then cross-topic fills. Deduplicates against learning path navigation.

### `public/`
Static assets served directly by the CDN. `robots.txt` allows all crawlers. `og-default.png` is the fallback Open Graph image for pages without a custom one.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSG, React components, excellent MDX support |
| Language | TypeScript | Type safety, build-time error catching |
| Content | MDX (Markdown + JSX) | Custom components in prose, no database |
| Styling | Tailwind CSS + Typography plugin | Utility-first, great prose defaults |
| Validation | Zod | Runtime schema validation for frontmatter |
| Deployment | Vercel | Zero-config for Next.js, global CDN |
| Analytics | Plausible (v1 setup pending) | Privacy-respecting, lightweight |

---

## Design Decisions

1. **No dark mode in v1.** Gated behind analytics — add when >30% traffic is night hours.
2. **No search in v1.** Add Pagefind (client-side) when post count exceeds 30.
3. **No newsletter in v1.** Add when >25% returning visitors.
4. **No user accounts, no comments.** This is a read-only blog. Readers suggest posts via a feedback form (v2 KV store).
5. **Content in Git, not a CMS.** VS Code + MDX is faster for a solo author who codes. Git history = editorial history.
6. **SSG, not SSR.** Read-heavy workload. Static files = zero compute at request time = instant page loads.

