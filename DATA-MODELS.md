# Data Models — Stackless v1

**Parent documents:** [PRD.md](PRD.md) · [MVP.md](MVP.md) · [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md) · [ADMIN-ROLE.md](ADMIN-ROLE.md)
**Version:** 1.0
**Date:** February 8, 2026
**Scope:** Every data entity in the system — what it contains, where it lives, how it relates to other entities, and why each field exists.

---

## Architecture Constraint: Where Data Lives

Stackless has no traditional database. Data is split across two storage layers based on its nature:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA STORAGE MAP                               │
│                                                                         │
│   ┌───────────────────────────────────┐  ┌───────────────────────────┐  │
│   │  LAYER 1: FILE SYSTEM (Git Repo)  │  │  LAYER 2: KV STORE       │  │
│   │  ──────────────────────────────── │  │  (Upstash Redis / Vercel  │  │
│   │                                   │  │   KV — serverless, free   │  │
│   │  • Post (MDX + frontmatter)       │  │   tier)                   │  │
│   │  • Topic (topics.json)            │  │                           │  │
│   │  • LearningPath (path JSONs)      │  │  • Suggestion             │  │
│   │  • SiteConfig (site-config.json)  │  │  • Feedback               │  │
│   │  • Admin (implicit — GitHub)      │  │                           │  │
│   │                                   │  │  WHY HERE: Readers can    │  │
│   │  WHY HERE: Content authored by    │  │  submit data. Can't push  │  │
│   │  admin. Changes are rare          │  │  to Git from the browser. │  │
│   │  (4–6x/month). Git provides       │  │  Need a write path that   │  │
│   │  versioning, rollback, and        │  │  doesn't require auth.    │  │
│   │  the admin panel reads/writes     │  │  Serverless KV = no       │  │
│   │  via GitHub API.                  │  │  server, no ops, pennies. │  │
│   └───────────────────────────────────┘  └───────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Why not one database for everything?** The core content (posts, topics, paths) benefits enormously from being files in Git — version history, offline editing, MDX rendering, zero infrastructure. Adding a database for 5 entities would mean maintaining a connection pool, an ORM, migrations, backups — all for data that changes a handful of times per month. The lightweight KV store is added *only* for the two entities that require reader-initiated writes (suggestions and feedback).

---

## Entity Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                       ENTITY RELATIONSHIP MAP                        │
│                                                                      │
│                                                                      │
│   ┌──────────┐          ┌──────────┐                                │
│   │  Admin   │ creates  │   Post   │                                │
│   │ (single) │─────────→│          │◄─── readNext ───┐              │
│   └──────────┘          │          │                  │              │
│        │                │          │──────────────────┘              │
│        │                └────┬─────┘                                │
│        │                     │ belongs to                           │
│        │                     ▼                                      │
│        │                ┌──────────┐                                │
│        │ manages        │  Topic   │                                │
│        │───────────────→│          │                                │
│        │                └──────────┘                                │
│        │                                                            │
│        │                ┌──────────────┐                            │
│        │ manages        │ LearningPath │                            │
│        │───────────────→│              │── contains ──→ Post[]      │
│        │                └──────────────┘                            │
│        │                                                            │
│        │                ┌──────────────┐                            │
│        │ manages        │  SiteConfig  │                            │
│        │───────────────→│   (single)   │                            │
│        │                └──────────────┘                            │
│        │                                                            │
│        │  reviews       ┌──────────────┐                            │
│        │───────────────→│  Suggestion  │◄─── readers submit         │
│        │                └──────────────┘                            │
│        │                                                            │
│        │  reviews       ┌──────────────┐                            │
│        └───────────────→│  Feedback    │◄─── readers submit         │
│                         └──────────────┘                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Total entities: 7** — Post, Topic, LearningPath, SiteConfig, Admin, Suggestion, Feedback.

---

## Entity 1: Post

The core entity. Everything else exists to support it.

**Storage:** MDX file in `/content/posts/[slug].mdx`
**Managed by:** Git (body) + Admin panel (metadata)

### Fields

| Field | Type | Required | Stored In | Why It Exists |
|---|---|---|---|---|
| `title` | `string` | ✅ | Frontmatter | The post headline. Displayed on the post page, homepage, topic pages, OG tags, RSS feed. The single most visible piece of data in the system. |
| `slug` | `string` | ✅ | Frontmatter + filename | URL identifier. `how-discord-stores-messages` → `/posts/how-discord-stores-messages`. Also used as the unique key to reference this post from readNext, learning paths, and topic ordering. Must be unique across all posts. |
| `date` | `Date (ISO 8601)` | ✅ | Frontmatter | Publish date. Used for reverse-chronological sorting on homepage and in RSS feed. Set automatically when admin clicks "Publish" in the panel (if not already set). |
| `category` | `string` | ✅ | Frontmatter | Foreign key to a Topic (by slug). E.g., `"databases"`. Determines which topic page this post appears on. Validated at build time — must match a slug in `topics.json`. |
| `readingTime` | `string` | ✅ | Frontmatter | Human-readable estimate. E.g., `"14 min"`. Displayed alongside the title everywhere — homepage, topic pages, post header. Helps readers decide whether to commit before clicking. |
| `summary` | `string` | ✅ | Frontmatter | 1–2 sentence description. Used in: homepage post list, topic page list, RSS feed `<description>`, OG `meta description`, Google search snippet. One of the most SEO-critical fields. |
| `originalSource` | `{ title: string, url: string }` | ✅ | Frontmatter | Attribution to the original engineering blog. Displayed prominently at the top and bottom of every post. Core to Stackless's editorial philosophy — we stand on their shoulders and say so. |
| `readNext` | `string[]` (max 2) | ❌ | Frontmatter | Array of post slugs. Admin-curated suggestions for what to read after this post. Resolved at build time to full post objects. If empty, fallback logic kicks in (same-category next → most-recent global). |
| `featured` | `boolean` | ❌ (default: `false`) | Frontmatter | Whether this post is showcased on the homepage hero. At most one post can be `featured: true` at any time — enforced by the admin panel (setting one to true unsets the previous). |
| `draft` | `boolean` | ❌ (default: `false`) | Frontmatter | If `true`, the post is excluded from the public build — no page generated, no listing, no RSS entry, no sitemap entry. The MDX file remains in Git. The admin panel can toggle this without touching the post body. |
| `order` | `number` | ❌ | Frontmatter | Display position within its category page. Lower numbers appear first. Allows the admin to order posts pedagogically (foundational → advanced) rather than chronologically. Admin panel handles reordering via drag-and-drop. |
| `body` | `MDX content` | ✅ | File body (below frontmatter) | The actual blog post content. Markdown prose + JSX components (Callout, Definition, Figure, Takeaways). Compiled to HTML at build time. Never touched by the admin panel — authored only in VS Code. |

### Constraints

| Rule | Enforcement |
|---|---|
| `slug` must be unique | Build-time validation. If two posts share a slug, the build fails. |
| `category` must exist in `topics.json` | Build-time validation. Referencing a non-existent topic fails the build. |
| `readNext` slugs must resolve to published posts | Build-time warning (not failure). Unresolved slugs are silently omitted; flagged in admin panel content health. |
| Only one post can be `featured: true` | Admin panel enforces. If set via direct frontmatter edit, build-time validation warns if multiple featured posts exist (takes the most recent by date). |
| `date` must not be in the future | Build-time warning. Posts with future dates are still built but flagged. (Not blocked — allows scheduling by convention.) |

### Computed Fields (Build-Time, Not Stored)

These fields are derived at build time from the stored fields. They don't exist in frontmatter — they're calculated when generating the static page.

| Field | Type | Derived From | Purpose |
|---|---|---|---|
| `url` | `string` | `slug` | Full URL path: `/posts/{slug}` |
| `readNextResolved` | `Post[]` | `readNext` slugs + fallback logic | The actual post objects to render in the "Read Next" section. Includes fallback results if `readNext` is empty. |
| `pathNav` | `{ pathTitle, pathSlug, previous?, next? }` or `null` | Cross-reference with LearningPath entities | If this post is in a learning path, contains the path name and adjacent posts. Used to render path navigation. |
| `wordCount` | `number` | `body` | Total word count of the MDX body. Available for admin panel display and potential auto-calculation of `readingTime`. |
| `hasImages` | `boolean` | `body` | Whether the post contains any image references. Used in content health checks (e.g., are referenced images present in the repo?). |

---

## Entity 2: Topic

A content category that groups related posts.

**Storage:** Entry in `/content/topics.json`
**Managed by:** Admin panel (full CRUD)

### Fields

| Field | Type | Required | Why It Exists |
|---|---|---|---|
| `slug` | `string` | ✅ | URL identifier and foreign key. `"databases"` → `/topics/databases`. Posts reference topics by this slug in their `category` frontmatter field. Must be unique. Must be URL-safe (lowercase, hyphenated). |
| `name` | `string` | ✅ | Human-readable display name. E.g., `"Databases"`, `"Distributed Systems"`. Shown on topic pages, post headers, homepage topic links, nav breadcrumbs. |
| `description` | `string` | ✅ | 1–2 sentence description of what this topic covers. Displayed at the top of the topic page. Also used in the topic page's `<meta description>` for SEO. |
| `order` | `number` | ❌ | Display order on the Topics index page and the homepage "Browse by Topic" section. Lower numbers appear first. Allows the admin to put the most important topics first. |

### Structure (topics.json)

```json
[
  {
    "slug": "databases",
    "name": "Databases",
    "description": "How real companies store, query, and scale their data.",
    "order": 1
  },
  {
    "slug": "distributed-systems",
    "name": "Distributed Systems",
    "description": "The architecture behind services that run across thousands of machines.",
    "order": 2
  },
  {
    "slug": "caching",
    "name": "Caching",
    "description": "Why fast systems are fast — from CDNs to in-memory stores.",
    "order": 3
  }
]
```

### Relationships

| Relationship | Type | Detail |
|---|---|---|
| Topic → Posts | One-to-Many | A topic has many posts. Resolved at build time by filtering all posts where `category === topic.slug`. |
| Post → Topic | Many-to-One | A post belongs to exactly one topic. Enforced by the single `category` field in frontmatter (not an array — a post can't be in two categories). |

### Constraints

| Rule | Enforcement |
|---|---|
| `slug` must be unique | Admin panel prevents duplicate slugs. Build-time validation as a safety net. |
| Deleting a topic with posts | Admin panel shows danger confirmation. Posts are NOT deleted — their `category` becomes orphaned (flagged in content health). |
| Renaming a topic slug | Admin panel updates all posts that reference the old slug. Committed as a single atomic commit. |

### Why Not Tags?

Posts have a single `category`, not multiple tags. Rationale:

- **Simplicity.** One post → one topic. No ambiguity about where a post lives. No "should I tag this as both 'databases' and 'distributed-systems'?" decisions.
- **Clean IA.** Topic pages are definitive. A post appears on exactly one topic page. No duplication.
- **Pedagogical ordering.** Posts within a topic are manually ordered. This only works if each post belongs to one sequence. Multi-tagging fragments the learning path.
- **Scalable later.** If v2+ needs secondary tags, they can be added as an optional `tags: string[]` field without disrupting the primary `category` model.

---

## Entity 3: LearningPath

A curated, ordered sequence of posts that guides a reader through a topic from beginning to end.

**Storage:** JSON file in `/content/paths/[slug].json`
**Managed by:** Admin panel (full CRUD + reorder)

### Fields

| Field | Type | Required | Why It Exists |
|---|---|---|---|
| `slug` | `string` | ✅ | URL identifier. `"databases-from-zero"` → `/paths/databases-from-zero`. Must be unique across paths. |
| `title` | `string` | ✅ | Human-readable name. E.g., `"Understanding Databases: From B-Trees to Distributed Storage"`. Displayed on the paths index, path page, and in-post path navigation. |
| `description` | `string` | ✅ | 2–3 sentence description. Explains what the reader will learn and what level it's aimed at. Shown on the paths index and path page header. Used in `<meta description>` for SEO. |
| `posts` | `string[]` | ✅ | Ordered array of post slugs. The sequence matters — position 0 is the starting post. The in-post navigation ("Previous" / "Next") is derived from this order. |

### Structure (JSON file)

```json
{
  "slug": "databases-from-zero",
  "title": "Understanding Databases: From B-Trees to Distributed Storage",
  "description": "Start with how databases work under the hood, then explore how companies like Discord, Netflix, and Stripe scale them.",
  "posts": [
    "what-is-a-database-really",
    "how-discord-stores-messages",
    "why-netflix-built-their-own-db",
    "how-stripe-handles-payments-db"
  ]
}
```

### Relationships

| Relationship | Type | Detail |
|---|---|---|
| LearningPath → Posts | Many-to-Many (ordered) | A path contains multiple posts in a specific order. A post can belong to multiple paths (rare in v1, but not structurally prevented). |
| Post → LearningPaths | Computed (build-time) | At build time, the system cross-references all paths to determine which paths a given post belongs to and its position within each. This is used to render path navigation on the post page. |

### Constraints

| Rule | Enforcement |
|---|---|
| `slug` must be unique | Admin panel prevents duplicates. |
| All post slugs in `posts` must exist | Build-time warning. Missing/draft posts are skipped in the rendered path (not fatal — allows paths to reference upcoming posts that aren't published yet). |
| A path must have at least 2 posts | Admin panel validation. A single-post "path" is meaningless. |
| A path should have at most 8 posts | Admin panel soft warning (not blocked). Paths longer than 8 feel intimidating. This is a guideline, not a hard limit. |

### Why Paths ≠ Topics?

They serve different functions:

| | Topic | Learning Path |
|---|---|---|
| **Purpose** | Group posts by subject | Guide readers through a learning sequence |
| **Ordering** | Admin-ordered (pedagogical) but browsable in any order | Strictly sequential — meant to be read first-to-last |
| **Membership** | Every post must belong to exactly one topic | Posts optionally belong to paths. Not all posts are in paths. |
| **Cross-category** | No. A topic IS a category. | Yes. A path can include posts from multiple topics (e.g., a databases post and a caching post in the same path). |
| **Navigation** | Topic page lists posts. No in-post navigation. | In-post "Previous / Next" buttons. The reader is led through. |

---

## Entity 4: SiteConfig

Global configuration for the site. A singleton — there's only one.

**Storage:** `/content/site-config.json`
**Managed by:** Admin panel (Settings section)

### Fields

| Field | Type | Required | Why It Exists |
|---|---|---|---|
| `siteTitle` | `string` | ✅ | The site name. Used in: `<title>` tags (as suffix), OG tags, RSS feed title, nav bar, footer. Default: `"Stackless"`. |
| `tagline` | `string` | ✅ | The one-liner value proposition. Used in: homepage hero, footer, OG description for the homepage. E.g., `"Real engineering blogs, explained for students."` |
| `siteUrl` | `string` | ✅ | Canonical base URL. E.g., `"https://stackless.dev"`. Used to generate canonical URLs, OG URLs, sitemap URLs, RSS feed links. Must include protocol, must not have a trailing slash. |
| `authorName` | `string` | ✅ | Used in: JSON-LD structured data (Article schema `author`), about page, RSS feed `<author>`. |
| `defaultOgImage` | `string` | ✅ | Path to the fallback Open Graph image (relative to `/public/`). Used when a post doesn't have its own OG image. Ensures every shared link has a visual preview. |
| `social` | `{ twitter?: string, github?: string }` | ❌ | Social media handles. Displayed in footer. Twitter handle also used for `twitter:site` meta tag. |
| `rss` | `{ postsInFeed: number }` | ❌ | RSS feed configuration. `postsInFeed` controls how many recent posts are included (default: 20). |
| `plausible` | `{ siteId: string, apiKey: string }` | ❌ | Analytics integration. `siteId` is the Plausible domain. `apiKey` is used by the admin panel API routes to fetch analytics data. Not committed to Git — stored as a Vercel environment variable instead. |

### Why a Separate Config File?

Site-level metadata could live in `next.config.ts` or environment variables, but a dedicated JSON file:
- Is editable from the admin panel (Settings section) without touching code.
- Has a clear, single-purpose schema — not tangled with Next.js config options.
- Is version-controlled in Git like all other content.

**Exception:** Sensitive fields (`plausible.apiKey`, OAuth secrets) are stored as Vercel environment variables, NOT in the JSON file. The admin panel reads them from `process.env` at runtime.

---

## Entity 5: Admin

The single human who operates Stackless. Not stored as a record in a file or database — defined implicitly by GitHub OAuth and environment configuration.

**Storage:** Environment variable (`ADMIN_GITHUB_ID`)
**Managed by:** Vercel environment config (set once, rarely changed)

### Fields

| Field | Type | Stored In | Why It Exists |
|---|---|---|---|
| `githubId` | `string` | Env var: `ADMIN_GITHUB_ID` | The GitHub user ID (numeric) of the sole admin. When a user authenticates via GitHub OAuth, their ID is checked against this value. If it doesn't match, access is denied. This is the entire auth system — one hardcoded ID. |
| `githubUsername` | `string` | Derived from OAuth response | Display name shown in the admin panel header (e.g., "Varun · Logout"). Not stored — fetched from the GitHub OAuth token on each session. |
| `avatarUrl` | `string` | Derived from OAuth response | GitHub profile picture. Optionally shown in the admin panel header. Not stored. |

### Why Not a Users Table?

There is exactly one admin. Ever. The PRD explicitly excludes multi-author support (NG5) and user accounts (NG1). Storing a single user in a database or JSON file is over-engineering. An environment variable is the simplest correct solution:

- No database query on login. Just `if (oauthUser.id === process.env.ADMIN_GITHUB_ID)`.
- No user management UI. No password resets. No role CRUD.
- If the admin's GitHub account changes (astronomically unlikely), update one env var and redeploy.

### Reader Identity

Readers have **no identity** in the system. There is:
- No `User` entity for readers.
- No session, no cookie (except the analytics script's cookie-less tracking).
- No profile, no preferences, no bookmarks.

A reader is a stateless HTTP request. The site treats every request identically. This is a deliberate product decision (PRD NG1), and it dramatically simplifies the data model, the security surface, and the privacy posture.

---

## Entity 6: Suggestion

A reader-submitted request for a specific engineering blog to be explained on Stackless. This is the primary reader-to-admin feedback channel.

**Storage:** Upstash Redis (serverless KV store) or Vercel KV
**Managed by:** Readers submit via a simple form; admin reviews in the admin panel

### Why This Entity Exists

Stackless explains engineering blogs that students find hard to understand. But how does the admin know *which* blogs to explain next? Two sources:

1. **Admin's own curation** — the admin reads engineering blogs and picks the most impactful ones.
2. **Reader requests** — students say "I found this engineering blog and I can't understand it. Please explain it."

Source #2 is incredibly valuable. It's direct signal about what the audience wants, what's confusing them, and which blogs are failing them. A "Suggest a Blog" form is the simplest way to capture this.

### Fields

| Field | Type | Required | Why It Exists |
|---|---|---|---|
| `id` | `string (ULID)` | ✅ (auto-generated) | Unique identifier. ULID is preferred over UUID because it's sortable by creation time — recent suggestions appear first without a separate sort. |
| `blogUrl` | `string` | ✅ | URL of the engineering blog post the reader wants explained. E.g., `"https://engineering.fb.com/2024/..."`. This is the core data — the admin uses it to evaluate what to write next. |
| `blogTitle` | `string` | ❌ | Reader-provided title of the blog post. Optional because not all readers will bother — and the admin can open the URL to get the title themselves. Reduces form friction. |
| `reason` | `string` (max 500 chars) | ❌ | Why the reader wants this explained. E.g., "I'm studying for system design interviews and this blog about Cassandra at Discord made no sense to me." Gives the admin context about student pain points. Optional to reduce friction. |
| `status` | `enum: "new" │ "reviewed" │ "planned" │ "published" │ "declined"` | ✅ (default: `"new"`) | Admin workflow state. Enables the admin to triage suggestions without losing track. |
| `adminNote` | `string` | ❌ | Private note from the admin. E.g., "Good idea, will pair with the caching series." Never shown to readers. Only visible in the admin panel. |
| `linkedPostSlug` | `string` | ❌ | If the admin writes a post based on this suggestion, this field links to the resulting post's slug. Closes the loop: suggestion → published post. |
| `createdAt` | `Date (ISO 8601)` | ✅ (auto-generated) | When the suggestion was submitted. Used for sorting (newest first) and for gauging recency. |

### Structure (Stored in KV)

```
Key:    suggestion:{id}
Value:  {
          "id": "01HXYZ...",
          "blogUrl": "https://discord.com/blog/...",
          "blogTitle": "How Discord Indexes Billions of Messages",
          "reason": "I'm studying distributed systems and this was really confusing.",
          "status": "new",
          "adminNote": null,
          "linkedPostSlug": null,
          "createdAt": "2026-02-08T14:30:00Z"
        }
```

Additionally, a sorted set (`suggestions:by-date`) maintains an index ordered by `createdAt` for efficient listing in the admin panel.

### Anti-Spam Measures

Since this is an unauthenticated endpoint (readers don't have accounts), spam protection is essential:

| Measure | Detail |
|---|---|
| **Rate limiting** | Max 3 suggestions per IP per 24 hours. Implemented via KV with TTL keys (`ratelimit:suggest:{ip}` → counter with 24h expiry). |
| **Honeypot field** | A hidden form field (`website`) that real users won't fill in. If it contains a value → silent discard (spam bot). |
| **URL validation** | `blogUrl` must be a valid URL. Non-URL submissions are rejected client-side and server-side. |
| **Length limits** | `blogTitle` max 300 chars. `reason` max 500 chars. Prevents abuse via enormous payloads. |
| **No immediate feedback loop** | Readers are told "Thanks for your suggestion!" but never see status updates. No notification system. This removes the incentive for spamming (spammers want visible output). |

### Admin Panel View: Suggestions

```
┌──────────────────────────────────────────────────────────────────────┐
│  Suggestions                        Filter: [All ▾]   (23 total)    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ STATUS  │ BLOG                                      │ DATE     ││
│  ├─────────┼───────────────────────────────────────────┼──────────┤│
│  │ ● New   │ discord.com/.../how-discord-indexes...    │ Feb 8    ││
│  │ ● New   │ uber.com/.../cost-of-a-ride...            │ Feb 7    ││
│  │ ◐ Revd  │ netflix.com/.../scaling-memcached...      │ Feb 3    ││
│  │ ◉ Plnd  │ stripe.com/.../online-migrations...       │ Jan 28   ││
│  │ ✓ Pub'd │ meta.com/.../memcache-at-scale...         │ Jan 15   ││
│  │ ✕ Decl  │ myblog.spam/.../totally-real-eng...       │ Jan 10   ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ── Selected: discord.com/.../how-discord-indexes ──────────────    │
│                                                                      │
│  Blog URL:   https://discord.com/blog/how-discord-indexes-...        │
│  Blog Title: How Discord Indexes Billions of Messages                │
│  Reason:     "I'm studying distributed systems and this was         │
│              really confusing."                                      │
│  Submitted:  Feb 8, 2026                                             │
│                                                                      │
│  Status: [New ▾]  →  Reviewed / Planned / Published / Declined      │
│  Admin Note: [                                                    ]  │
│  Linked Post: [None ▾]  (dropdown of all posts)                      │
│                                                                      │
│  [Save]  [Delete]                                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Entity 7: Feedback

Free-form feedback from readers about the site, a specific post, or general experience. Not *comments* on posts (those are excluded per PRD NG2) — this is *private feedback to the admin*.

**Storage:** Upstash Redis (serverless KV store) or Vercel KV
**Managed by:** Readers submit via a minimal form; admin reviews in the admin panel

### Why This Entity Exists (And Why It's Not "Comments")

The PRD bans comments (NG2). Comments are public, threaded, and require moderation — they're a social feature. Feedback is different:

| | Comments (excluded) | Feedback (included) |
|---|---|---|
| **Visible to** | All readers | Only the admin |
| **Purpose** | Public discussion | Private signal to the admin |
| **Moderation** | Requires active moderation | Admin reads at their own pace |
| **Threading** | Threaded replies | One-way (reader → admin, no response) |
| **Location** | Attached to a specific post, displayed in-page | Submitted via a form, read in the admin panel |

Feedback is a low-friction "whisper to the admin" — not a public conversation. It helps the admin understand what's working and what's confusing without the moderation burden of a comments section.

### Fields

| Field | Type | Required | Why It Exists |
|---|---|---|---|
| `id` | `string (ULID)` | ✅ (auto-generated) | Unique identifier. ULID for sortability. |
| `type` | `enum: "general" │ "post-specific" │ "correction" │ "appreciation"` | ✅ | Categorizes the feedback so the admin can prioritize. `"correction"` is highest priority (factual errors), `"appreciation"` is lowest (nice to see, no action needed). |
| `postSlug` | `string` | ❌ | Which post the feedback is about (if `type` is `"post-specific"` or `"correction"`). Links feedback to a specific post. `null` for general feedback. |
| `message` | `string` (max 1000 chars) | ✅ | The feedback content. E.g., "The analogy about the library was really helpful but the diagram is confusing" or "You said Cassandra uses quorum reads by default — I think that's wrong." |
| `status` | `enum: "unread" │ "read" │ "actioned" │ "dismissed"` | ✅ (default: `"unread"`) | Admin workflow state. Tracks whether feedback has been reviewed and acted on. |
| `createdAt` | `Date (ISO 8601)` | ✅ (auto-generated) | Submission timestamp. For sorting. |

### Anti-Spam Measures

Same as Suggestions: rate limiting (5 per IP per 24h), honeypot field, length limits, no feedback loop to the submitter.

### Where the Form Appears (Reader-Facing)

The feedback form is NOT a modal, NOT a popup, and NOT an always-visible widget. It appears in two places:

1. **Footer of every post page** — A small, quiet link: "Found an error? Have feedback? → Let us know." Opens a simple inline form.
2. **About page** — A feedback section at the bottom.

The form is minimal:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Send Feedback                                                       │
│                                                                      │
│  What's this about?                                                  │
│  ○ This post  ○ A correction  ○ General feedback  ○ Just thanks     │
│                                                                      │
│  Your message:                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [Send]                                                              │
│                                                                      │
│  No email required. No account needed. We read everything.          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

No name field, no email field. Stackless doesn't collect personal information from readers. The message is the only thing that matters.

---

## Relationship Matrix (All Entities)

| From | To | Relationship | Cardinality | How It's Stored |
|---|---|---|---|---|
| Post | Topic | belongs to | Many-to-One | `category` field in Post frontmatter references Topic `slug` |
| Topic | Posts | contains | One-to-Many | Computed at build time: filter Posts where `category === topic.slug` |
| LearningPath | Posts | contains (ordered) | Many-to-Many | `posts` array in LearningPath JSON (ordered list of Post slugs) |
| Post | LearningPaths | part of | Many-to-Many | Computed at build time: scan all LearningPaths for the Post's slug |
| Post | Posts (readNext) | suggests | Many-to-Many (max 2) | `readNext` array in Post frontmatter (list of Post slugs) |
| Suggestion | Post | resulted in | One-to-One (optional) | `linkedPostSlug` in Suggestion record |
| Feedback | Post | about | Many-to-One (optional) | `postSlug` in Feedback record |
| Admin | all entities | manages | — | Implicit. Single admin, full control. |

---

## Data Flow Diagram: Build Time vs. Runtime

```
┌─────────────────────────────────────────────────────────────────┐
│                        BUILD TIME                                │
│                                                                  │
│  Inputs (from Git repo):                                        │
│  ├── /content/posts/*.mdx     → Parse frontmatter + body        │
│  ├── /content/topics.json     → Load topic definitions          │
│  ├── /content/paths/*.json    → Load learning path definitions  │
│  └── /content/site-config.json → Load site metadata             │
│                                                                  │
│  Processing:                                                     │
│  ├── Validate all schemas (Zod)                                 │
│  ├── Resolve Post → Topic relationships                         │
│  ├── Resolve Post → LearningPath relationships                  │
│  ├── Resolve readNext slugs → Post objects (with fallback)      │
│  ├── Deduplicate readNext vs pathNav                            │
│  ├── Compile MDX → HTML                                         │
│  └── Generate static pages, sitemap, RSS                        │
│                                                                  │
│  Output: Static HTML, CSS, JS → deployed to CDN                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        RUNTIME                                   │
│                                                                  │
│  Reader actions:                                                 │
│  ├── Page loads → served from CDN (no server, no DB)            │
│  ├── Submit suggestion → POST /api/suggest → write to KV       │
│  └── Submit feedback → POST /api/feedback → write to KV        │
│                                                                  │
│  Admin actions (via admin panel):                                │
│  ├── Login → GitHub OAuth → session cookie                      │
│  ├── Read posts list → GitHub API → parse frontmatter           │
│  ├── Update metadata → GitHub API → commit → Vercel rebuild     │
│  ├── Read suggestions → KV read                                 │
│  ├── Read feedback → KV read                                    │
│  ├── Update suggestion/feedback status → KV write               │
│  ├── Read analytics → Plausible API                             │
│  └── Trigger deploy → Vercel Deploy Hook                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## What This Model Does NOT Include (And Why)

| Excluded Concept | Why Not |
|---|---|
| **User / Reader entity** | No reader accounts. No logins. No stored preferences. Readers are stateless HTTP requests. The PRD explicitly excludes user accounts (NG1). |
| **Comment entity** | No public comments. Excluded per PRD (NG2). Feedback (Entity 7) serves the admin's need for reader signal without the moderation burden. |
| **Tag entity** | Posts have a single `category`, not multiple tags. Simplifies the IA and prevents categorization ambiguity. Tags can be added in v2 as an optional field. |
| **Image / Media entity** | Images are static files in `/content/images/`. No media library, no upload management. The admin adds images via Git. Tracking them as entities would require a media management UI — out of scope. |
| **Analytics entity** | Analytics data lives in Plausible (external service). Stackless doesn't store any analytics data itself. The admin panel reads from the Plausible API. |
| **Notification entity** | No notification system. Readers get no notifications (no accounts). The admin checks the panel when they want — no push notifications, no email alerts. |
| **Draft / Revision entity** | Draft status is a boolean on the Post entity. Full revision history lives in Git. There is no separate "revisions table" — Git is the revision store. |

---

## Schema Validation Summary

| Entity | Validated When | Tool | Failure Behavior |
|---|---|---|---|
| **Post** (frontmatter) | Build time | Zod schema | Build fails (required fields) or warns (optional field issues) |
| **Topic** | Build time + admin panel | Zod schema + UI validation | Build fails if malformed. Panel prevents invalid input. |
| **LearningPath** | Build time + admin panel | Zod schema + UI validation | Build warns if post slugs don't resolve. Panel prevents invalid input. |
| **SiteConfig** | Build time + admin panel | Zod schema + UI validation | Build fails if required fields missing. Panel prevents invalid input. |
| **Admin** | Runtime (OAuth) | GitHub OAuth + env var check | Access denied if GitHub ID doesn't match `ADMIN_GITHUB_ID`. |
| **Suggestion** | Runtime (API route) | Zod schema + rate limiter | Rejected with 400 (validation error) or 429 (rate limit). |
| **Feedback** | Runtime (API route) | Zod schema + rate limiter | Rejected with 400 (validation error) or 429 (rate limit). |

---

*This document defines every data entity in Stackless v1. All schemas will be implemented as Zod validators in `/src/lib/schema.ts`, shared between build-time validation and runtime API routes.*
