# Information Architecture & User Flows — Stackless v1

**Parent documents:** [PRD.md](PRD.md) · [MVP.md](MVP.md)
**Version:** 1.0
**Date:** February 8, 2026
**Scope:** Structure, navigation, and flows for every page and interaction in the MVP.

---

## Design Philosophy

> This is an editorial blog, not a web application.
>
> The IA follows the conventions of professional publications — The Margins, Stratechery, Increment (RIP), Dan Luu's blog — not SaaS dashboards or marketing sites.
>
> Every structural decision optimizes for one thing: **a reader going from "I found this site" to "I just finished a post and I know what to read next" with zero friction.**

---

## 1. Sitemap

```
stackless.dev
│
├── /                           ← Homepage
├── /posts/[slug]               ← Individual blog post (e.g., /posts/how-discord-stores-messages)
├── /topics                     ← All topics listing page
├── /topics/[slug]              ← Category page (e.g., /topics/databases)
├── /paths                      ← All learning paths listing page
├── /paths/[slug]               ← Individual learning path page (e.g., /paths/databases-from-zero)
├── /about                      ← About page
├── /feed.xml                   ← RSS feed (not a rendered page)
├── /sitemap.xml                ← Sitemap for search engines (auto-generated)
└── /404                        ← Custom 404 page
```

**Total rendered pages at launch:** ~20–30
(1 homepage + 5–10 posts + 3–4 topic pages + 1–2 path pages + 1 topics index + 1 paths index + 1 about + 1 404)

**URL conventions:**
- All lowercase, hyphenated slugs.
- No trailing slashes.
- No dates in URLs (posts are evergreen, not time-bound).
- No nested categories (`/topics/databases` not `/topics/infrastructure/databases`).

---

## 2. Homepage — Section-by-Section (Top to Bottom)

The homepage has one job: help the reader find a post to read. It is not a landing page. It does not sell anything.

### Section 1: Global Navigation Bar

```
┌──────────────────────────────────────────────────────────────────┐
│  Stackless              Topics    Paths    About           RSS   │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Logo / site name** | "Stackless" — left-aligned. Text wordmark, not an icon. Links to homepage. |
| **Nav links** | Topics · Paths · About — right-aligned. Maximum 3 navigation items. |
| **RSS icon** | Small, unobtrusive RSS icon at the far right. Links to `/feed.xml`. |
| **No hamburger menu on mobile** | At narrow widths, all 3 links + RSS still fit. If tested and they don't, collapse into a simple menu — but avoid it if possible. |

The nav bar is **sticky/fixed on scroll** — it's always accessible. Thin and minimal so it doesn't steal vertical space from content.

---

### Section 2: Hero / Site Introduction

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│         Real engineering blogs, explained for students.          │
│                                                                  │
│    We take posts from Discord, Netflix, Uber, and Stripe         │
│    engineering blogs and re-explain them — clearly and            │
│    completely — so you can actually understand them.              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Headline** | One sentence. The value proposition. ~8–12 words. |
| **Subtext** | 1–2 sentences expanding the headline. Names real companies to build credibility. |
| **No CTA button** | No "Start Reading" or "Subscribe" button. The content below IS the action. Scroll is the CTA. |
| **No illustration or hero image** | Text only. Clean, typographic, confident. |
| **Shown only on first visit?** | No — always visible. It's small enough that it doesn't annoy returning visitors, and it anchors the site's identity. |

---

### Section 3: Featured / Pinned Post (Optional)

```
┌──────────────────────────────────────────────────────────────────┐
│  FEATURED                                                        │
│                                                                  │
│  How Discord Stores Trillions of Messages                        │
│  A deep dive into the architecture behind Discord's message      │
│  storage — from Cassandra to ScyllaDB.                           │
│                                                                  │
│  Databases  ·  14 min read  ·  Jan 28, 2026                     │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Purpose** | Let the admin spotlight one post — the best entry point for new readers. |
| **Implementation** | A `featured: true` flag in one post's frontmatter. Only one post at a time. |
| **Visibility** | Visually distinct from the post list below (larger type, more whitespace, subtle label). |
| **Optional** | If no post is flagged as featured, this section doesn't render. The latest posts list starts immediately. |

---

### Section 4: Latest Posts (Primary Content Area)

```
┌──────────────────────────────────────────────────────────────────┐
│  Latest Posts                                                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  How Uber Matches Riders to Drivers in Real Time           │  │
│  │  An explanation of geospatial indexing, dispatch systems,  │  │
│  │  and why Uber doesn't just find "the nearest driver."      │  │
│  │  Distributed Systems  ·  11 min read  ·  Feb 5, 2026      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  What Happens When You "Like" a Tweet                      │  │
│  │  The fan-out problem, timeline caching, and why a simple   │  │
│  │  button triggers a cascade of distributed operations.      │  │
│  │  Caching  ·  9 min read  ·  Feb 1, 2026                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  (... more posts ...)                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Layout** | Stacked list — one post per row, full content width. NOT a grid. NOT cards. Magazine-style list. |
| **Per post** | Title (linked), summary (1–2 lines), category tag, reading time, publish date. |
| **Order** | Reverse chronological (newest first). |
| **Count** | Show all published posts. With <30 posts, pagination is unnecessary. If the list grows, add simple pagination later. |
| **Category tag** | Displayed as a subtle label (not a colored badge). Clicking it navigates to that category's topic page. |
| **No thumbnails** | No post images on listing pages. Text is the interface. Images belong inside the post, not as decoration on a list. |

---

### Section 5: Topic Quick Links

```
┌──────────────────────────────────────────────────────────────────┐
│  Browse by Topic                                                 │
│                                                                  │
│  Databases (5)  ·  Distributed Systems (4)  ·  Caching (3)      │
│  Messaging (2)  ·  Storage (2)  ·  Networking (1)               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Purpose** | Give readers a second browsing axis beyond "latest." |
| **Layout** | Horizontal inline list of topic names with post counts. Not a sidebar — placed after the post list. |
| **Each link** | Navigates to `/topics/[slug]`. |
| **Post counts** | Show the number of posts per topic. Helps the reader gauge depth. |

---

### Section 6: Footer

```
┌──────────────────────────────────────────────────────────────────┐
│  Stackless — Real engineering blogs, explained for students.     │
│                                                                  │
│  Topics  ·  Paths  ·  About  ·  RSS                             │
│                                                                  │
│  Built by Varun. All content is original.                        │
│  © 2026                                                          │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Tagline** | Repeats the site's one-liner. |
| **Navigation** | Duplicates the top nav links for readers who've scrolled to the bottom. |
| **Attribution** | Simple author credit. No social media links (unless Varun wants a Twitter/X link — optional). |
| **Minimal** | No multi-column mega footer. This is a blog, not a SaaS product. |

---

## 3. Blog Listing Page Structure (`/topics/[slug]`)

This page lists all posts within a single category/topic.

```
┌──────────────────────────────────────────────────────────────────┐
│  [Global Nav]                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Databases                                                       │
│                                                                  │
│  How real companies store, query, and scale their data.          │
│  Posts are ordered from foundational to advanced.                │
│                                                                  │
│  ─────────────────────────────────────────────────               │
│                                                                  │
│  1. What Is a Database, Really?                                  │
│     Beyond "it stores data" — how databases actually work        │
│     under the hood, and why there are so many kinds.             │
│     8 min read  ·  Jan 10, 2026                                 │
│                                                                  │
│  2. How Discord Stores Trillions of Messages                     │
│     From Cassandra's pain points to ScyllaDB — the full          │
│     migration story, explained for students.                     │
│     14 min read  ·  Jan 28, 2026                                │
│                                                                  │
│  3. Why Netflix Built Their Own Database (and You Wouldn't)      │
│     ...                                                          │
│                                                                  │
│  ─────────────────────────────────────────────────               │
│                                                                  │
│  Related Learning Path:                                          │
│  → Understanding Databases: From B-Trees to Distributed Storage  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Topic name as heading** | Large, clear heading. This is the page title. |
| **Topic description** | 1–2 sentences explaining what this category covers. Written by the admin, stored in a config file. |
| **Ordering note** | A subtle line: "Posts are ordered from foundational to advanced." Sets the expectation that this is a pedagogy-driven order, not date-driven. |
| **Numbered post list** | Posts are numbered explicitly. This reinforces the intentional ordering and gives readers a sense of progression. |
| **Per post** | Title, summary, reading time, date. Same format as homepage list. |
| **Related learning path link** | If a learning path exists that overlaps with this category, link to it at the bottom. Cross-pollination between topics and paths. |
| **No filtering or sorting controls** | The admin has already ordered these posts. The reader trusts the sequence. |

---

## 4. Blog Reading Page Structure (`/posts/[slug]`) — Detailed

This is the most important page on the site. Every structural decision here serves one goal: **uninterrupted, comfortable reading.**

### Full Page Structure (Top to Bottom)

```
┌──────────────────────────────────────────────────────────────────┐
│  [Global Nav]                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ ARTICLE HEADER ──────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  How Discord Stores Trillions of Messages                  │   │
│  │                                                            │   │
│  │  Databases  ·  14 min read  ·  January 28, 2026            │   │
│  │                                                            │   │
│  │  Originally explained in:                                  │   │
│  │  → How Discord Stores Trillions of Messages (discord.com)  │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ ARTICLE BODY ────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  [Context / Hook]                                          │   │
│  │  Imagine you send a message in a Discord server with       │   │
│  │  500,000 members. That message needs to be stored,         │   │
│  │  indexed, and retrievable — instantly. Now multiply         │   │
│  │  that by every server on Discord...                        │   │
│  │                                                            │   │
│  │  [Analogy / Mental Model]                                  │   │
│  │  Think of it like a library. If you have 100 books, you    │   │
│  │  can find any book by scanning the shelf. But when you     │   │
│  │  have 10 billion books...                                  │   │
│  │                                                            │   │
│  │  [Deep Explanation]                                        │   │
│  │  Discord originally used Cassandra...                      │   │
│  │                                                            │   │
│  │  [Diagram — if applicable]                                 │   │
│  │  ┌──────────────────────────────────┐                      │   │
│  │  │    [Architecture Diagram]        │                      │   │
│  │  │    Static image, alt text,       │                      │   │
│  │  │    optional caption below        │                      │   │
│  │  └──────────────────────────────────┘                      │   │
│  │  Figure 1: Discord's message storage architecture          │   │
│  │  before and after the ScyllaDB migration.                  │   │
│  │                                                            │   │
│  │  [Code Snippet — if applicable]                            │   │
│  │  ```python                                                 │   │
│  │  # Pseudocode: how a message gets routed                   │   │
│  │  partition = hash(channel_id) % num_shards                 │   │
│  │  shard = get_shard(partition)                               │   │
│  │  shard.write(message)                                      │   │
│  │  ```                                                       │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ TAKEAWAYS ───────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  What You Should Remember                                  │   │
│  │                                                            │   │
│  │  • Discord stores trillions of messages across sharded     │   │
│  │    clusters — no single machine holds everything.          │   │
│  │  • They migrated from Cassandra to ScyllaDB because...    │   │
│  │  • The key trade-off was...                                │   │
│  │  • This is an example of the "shared-nothing"             │   │
│  │    architecture pattern.                                   │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ ORIGINAL SOURCE ─────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  Want to go deeper?                                        │   │
│  │  Read the original post on Discord's engineering blog →    │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ LEARNING PATH NAV (conditional) ─────────────────────────┐   │
│  │                                                            │   │
│  │  This post is part of: Understanding Databases             │   │
│  │                                                            │   │
│  │  ← Previous: What Is a Database, Really?                   │   │
│  │  → Next: Why Netflix Built Their Own Database              │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ READ NEXT ───────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  Read Next                                                 │   │
│  │                                                            │   │
│  │  → What Happens When You "Like" a Tweet                    │   │
│  │    Caching  ·  9 min read                                  │   │
│  │                                                            │   │
│  │  → How Uber Matches Riders to Drivers in Real Time         │   │
│  │    Distributed Systems  ·  11 min read                     │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

### Element-by-Element Specification

#### 4.1 Article Header

| Element | Detail |
|---|---|
| **Title** | The post title. Largest text on the page. Should be compelling but not clickbait — promise exactly what the post delivers. |
| **Metadata row** | Category tag (linked to topic page) · Reading time · Publish date. All on one line, smaller text. |
| **Original source link** | Labeled "Originally explained in:" followed by the title of the original engineering blog post, linked to the original URL. Opens in a new tab. Positioned directly below metadata so the reader sees attribution before they start reading. |
| **No author name** | Single-author blog. Author is implicit. No avatar, no byline. |
| **No cover image** | No hero images. The title IS the visual anchor. This is an editorial, not a spec magazine. |

#### 4.2 Article Body

| Element | Detail |
|---|---|
| **Content width** | Constrained to ~65–75 characters per line (the optimal range for reading). Content does not stretch to full viewport width on desktop. |
| **Typography** | Serif or humanist sans-serif body text. Large enough to read without squinting (~18–20px). Generous line height (~1.6–1.8). |
| **Paragraphs** | Separated by whitespace, not indentation. Short paragraphs — 3–5 sentences max. The post should breathe. |
| **Subheadings** | Used liberally to break the post into scannable sections. A reader should be able to skim headings and get the post's structure. |
| **Inline term definitions** | When a jargon term appears for the first time, it's defined immediately — either in parentheses, as a short aside, or in a visually distinct callout block. Example: *"Discord used **Cassandra** (a distributed NoSQL database designed for high write throughput) to store messages."* |
| **Callout blocks** | Styled blockquotes or aside elements for: analogies, key definitions, "why this matters" explanations. Visually distinct from body text but not disruptive. |
| **Diagrams** | Full-width (within content column) static images. Every diagram has: alt text for accessibility, a numbered caption below (e.g., "Figure 1: ..."), a brief description for readers who can't load images. |
| **Code snippets** | Syntax-highlighted. Language label visible. Used sparingly — only when pseudocode or a data structure clarifies the explanation. Never more than 15–20 lines. |
| **Links** | External links open in new tabs. Internal links (to other Stackless posts) open in the same tab. Links are styled distinctly from body text. |

#### 4.3 Takeaways Section

| Element | Detail |
|---|---|
| **Heading** | "What You Should Remember" — consistent across every post. |
| **Format** | Bulleted list. 3–5 items. Each item is 1–2 sentences. |
| **Visual treatment** | Visually separated from the body — a different background shade, a top border, or extra whitespace. The reader should recognize this as the conclusion even while scrolling fast. |
| **Purpose** | Cement understanding. If a reader forgets everything else, these bullets should stick. |

#### 4.4 Original Source (End-of-Post)

| Element | Detail |
|---|---|
| **Heading** | "Want to go deeper?" |
| **Link** | Full title of the original engineering blog post, linked. |
| **Purpose** | The original source appears at the top (attribution) and the bottom (invitation to go deeper). Different framing, same link. Top says "this is where the idea comes from." Bottom says "now that you understand, read the original." |

#### 4.5 Learning Path Navigation (Conditional)

| Element | Detail |
|---|---|
| **Shown when** | The current post belongs to at least one learning path. |
| **Hidden when** | The post is standalone (not part of any path). |
| **Content** | Path name (linked to the path page), previous post link, next post link. |
| **Position** | After the original source section, before "Read Next." It takes priority over general suggestions because it represents an intentional learning sequence. |
| **Edge cases** | First post in path: no "Previous" link. Last post in path: no "Next" link, replaced with "You've completed this path! → View all paths." |
| **Multiple paths** | If a post belongs to multiple paths (rare in v1), show the first one. v2 can add a selector. |

#### 4.6 Read Next Section

| Element | Detail |
|---|---|
| **Heading** | "Read Next" |
| **Count** | 1–2 suggested posts. Never more than 2. |
| **Per suggestion** | Title (linked), category tag, reading time. No summary — keep it tight. |
| **Source** | Manually defined by the admin in the post's frontmatter (`readNext` field). |
| **Fallback** | If `readNext` is empty, show the 2 most recent posts from the same category. If the category has no other posts, show the 2 most recent posts from any category. |
| **Purpose** | Keep the reader on the site. One more post. Then one more. Organic depth, not manipulative loops. |

---

## 5. Admin Content Creation & Editing Flow

The admin (Varun) interacts with the blog entirely through local files and Git. There is no web-based admin panel.

### 5.1 Creating a New Post

```
Step 1: Create file
  └─ Create a new .md (or .mdx) file in the /content/posts/ directory.
     Filename becomes the URL slug: how-discord-stores-messages.md → /posts/how-discord-stores-messages

Step 2: Write frontmatter
  └─ Add YAML frontmatter at the top of the file:

     ---
     title: "How Discord Stores Trillions of Messages"
     date: 2026-01-28
     category: databases
     readingTime: "14 min"
     summary: "A deep dive into Discord's message storage architecture — from Cassandra to ScyllaDB."
     originalSource:
       title: "How Discord Stores Trillions of Messages"
       url: "https://discord.com/blog/how-discord-stores-trillions-of-messages"
     readNext:
       - "why-netflix-built-their-own-database"
       - "what-happens-when-you-like-a-tweet"
     featured: false
     draft: false
     order: 2          # Position within its category page
     ---

Step 3: Write content
  └─ Write the post body in Markdown following the editorial template:
     - Context / Hook
     - Analogy / Mental model
     - Deep explanation (with subheadings)
     - Diagram(s) if needed
     - Code snippets if needed
     - "What You Should Remember" section (## What You Should Remember)

Step 4: Add images
  └─ Place diagram/image files in /content/posts/images/ or a co-located folder.
     Reference in Markdown: ![Alt text](./images/discord-architecture.webp)

Step 5: Preview locally
  └─ Run the dev server (e.g., `npm run dev`).
     Open the post in a browser. Check:
     - Rendering, formatting, images load
     - Frontmatter metadata displays correctly
     - "Read Next" links resolve to real posts
     - Learning path navigation shows (if applicable)

Step 6: Publish
  └─ git add . → git commit → git push
     CI/CD pipeline triggers: build → deploy.
     Post is live within minutes.
```

### 5.2 Editing an Existing Post

```
Step 1: Open the .md file in the editor.
Step 2: Make changes (content, frontmatter, images).
Step 3: Preview locally to verify.
Step 4: git commit → git push.
        Change is live after the automated build completes.
        Full edit history preserved in Git.
```

### 5.3 Unpublishing a Post

```
Step 1: Set `draft: true` in the post's frontmatter.
Step 2: git commit → git push.
        The build process excludes draft posts.
        The post URL returns a 404.
        No content is deleted — it's just hidden from the build.
```

### 5.4 Creating or Updating a Learning Path

```
Step 1: Open /content/paths/databases-from-zero.md (or .json).

Step 2: Define or edit the path:

     ---
     title: "Understanding Databases: From B-Trees to Distributed Storage"
     description: "Start with how databases work under the hood, then explore how companies like Discord, Netflix, and Stripe scale them."
     posts:
       - "what-is-a-database-really"
       - "how-discord-stores-messages"
       - "why-netflix-built-their-own-database"
       - "how-stripe-handles-payments-database"
     ---

Step 3: Preview locally — verify the path page renders and in-post path navigation works.
Step 4: git commit → git push.
```

### 5.5 Managing Categories/Topics

```
Categories are defined in a single config file: /content/topics.json (or similar).

[
  {
    "slug": "databases",
    "name": "Databases",
    "description": "How real companies store, query, and scale their data."
  },
  {
    "slug": "distributed-systems",
    "name": "Distributed Systems",
    "description": "The architecture behind services that run across thousands of machines."
  }
]

To add a new category: add an entry to this file and redeploy.
To rename a category: update the entry — posts reference categories by slug, so the slug is the stable identifier.
```

### 5.6 Complete Admin Flow Diagram

```
                    ┌──────────────┐
                    │  Write .md   │
                    │  file locally │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Add front-  │
                    │  matter data │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Add images  │
                    │  (if any)    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Run local   │
                    │  dev server  │
                    │  & preview   │
                    └──────┬───────┘
                           │
                     ┌─────▼──────┐
                     │  Looks     │──── No ──→ Edit & re-preview
                     │  good?     │
                     └─────┬──────┘
                           │ Yes
                    ┌──────▼───────┐
                    │  git add .   │
                    │  git commit  │
                    │  git push    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  CI/CD runs  │
                    │  Build site  │
                    │  Deploy      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   LIVE ✓     │
                    └──────────────┘
```

---

## 6. Content Discovery Flow (v1 — No Search)

Search is excluded from v1 (per the MVP). Readers discover content through four pathways. This section maps each one.

### 6.1 Entry Points — How Readers Arrive

```
  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
  │  Google /      │   │  Twitter/X    │   │  Direct URL   │   │  RSS Feed     │
  │  Search Engine │   │  LinkedIn     │   │  (shared by   │   │  Reader       │
  │                │   │  Reddit       │   │   a friend)   │   │               │
  └───────┬───────┘   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
          │                   │                   │                   │
          ▼                   ▼                   ▼                   ▼
   Lands on a post     Lands on a post     Lands on a post     Reads in RSS
   page directly       page directly       page directly       (full content)
```

**Key insight:** Most readers will land on a post page directly — not the homepage. SEO and social sharing drive readers to individual posts. The IA must ensure that a reader who lands on any post can easily discover the rest of the site without going "home" first.

### 6.2 Discovery Flow A: Browse by Recency (Homepage)

```
  Reader visits homepage
         │
         ▼
  Scans hero text (understands what the site is)
         │
         ▼
  Scans latest posts list
         │
         ▼
  Clicks a post title that looks interesting
         │
         ▼
  Reads the post
         │
         ▼
  Reaches "Read Next" → clicks next suggestion → continues reading
```

### 6.3 Discovery Flow B: Browse by Topic

```
  Reader clicks "Topics" in nav (or a category tag on a post)
         │
         ▼
  Sees all topics with post counts on the /topics page
         │
         ▼
  Clicks a topic (e.g., "Databases")
         │
         ▼
  Sees all posts in that category, ordered foundational → advanced
         │
         ▼
  Starts reading from the top (or picks a specific post)
         │
         ▼
  Reads the post → follows "Read Next" or continues down the category list
```

### 6.4 Discovery Flow C: Follow a Learning Path

```
  Reader clicks "Paths" in nav
         │
         ▼
  Sees all available learning paths with descriptions
         │
         ▼
  Clicks a path (e.g., "Understanding Databases")
         │
         ▼
  Sees the ordered list of posts in the path
         │
         ▼
  Clicks the first post (or wherever they want to start)
         │
         ▼
  Reads the post → uses "Next in path" nav → reads the next one → ...
         │
         ▼
  Reaches the end of the path
         │
         ▼
  Sees "You've completed this path! → View all paths"
```

### 6.5 Discovery Flow D: Land on a Post Directly (SEO / Social)

```
  Reader lands on /posts/how-discord-stores-messages from Google
         │
         ▼
  Reads the post (no context needed — the post is self-contained)
         │
         ▼
  Notices the category tag "Databases" in the header
         │                              │
         ├── Clicks category tag ──→ Sees all database posts (Flow B)
         │
         ▼
  Scrolls to "Read Next" suggestions
         │
         ├── Clicks a suggestion ──→ Reads another post
         │
         ▼
  Scrolls to learning path nav (if applicable)
         │
         ├── Clicks path ──→ Sees the full path and their position in it (Flow C)
         │
         ▼
  Notices "Stackless" in the nav bar
         │
         └── Clicks logo ──→ Homepage (Flow A)
```

**This is the critical flow.** A reader who land-on a random post has four natural exit paths — not a dead end. Every post page is a hub, not a leaf.

---

## 7. Related Blog Suggestion Logic (Conceptual)

"Read Next" is not algorithmic. It's curated. But there are rules governing how suggestions are chosen and what happens when the admin doesn't specify them.

### 7.1 Primary: Admin-Curated Suggestions

```
Source:      readNext field in post frontmatter
Count:       1–2 post slugs
Criteria:    The admin picks posts that satisfy ONE of these relationships:

             1. CONCEPTUAL PREREQUISITE
                "If you liked this post, read this first to understand the foundation."
                Example: "How Discord Stores Messages" → readNext: "What Is a Database, Really?"

             2. CONCEPTUAL SEQUEL
                "Now that you understand this, here's the next level."
                Example: "What Is a Database, Really?" → readNext: "How Discord Stores Messages"

             3. LATERAL CONNECTION
                "This post applies the same concept in a different context."
                Example: "How Discord Stores Messages" (sharding) →
                         readNext: "How Uber Matches Riders" (also uses sharding, different domain)

Constraint:  The admin NEVER suggests a post solely because it's popular or recent.
             Suggestions are always based on conceptual relevance.
```

### 7.2 Fallback: Automatic Suggestions (When Admin Doesn't Specify)

```
IF readNext is empty:
  │
  ├─ Step 1: Find posts in the SAME CATEGORY, excluding the current post.
  │          Sort by the admin-defined `order` field (foundational first).
  │          Pick the next 2 posts in sequence after the current one.
  │
  ├─ Step 2: If the category has < 2 other posts:
  │          Fill remaining slots with the 2 most RECENT posts from ANY category.
  │
  └─ Step 3: If there are < 2 total other posts on the site:
             Show whatever exists. Even 1 suggestion is fine.
             Show nothing if this is literally the only post (launch day edge case).
```

### 7.3 Suggestion Display Rules

| Rule | Detail |
|---|---|
| **Never self-reference** | A post never suggests itself. |
| **Never suggest drafts** | Only published (`draft: false`) posts appear as suggestions. |
| **No duplicates** | If the same post would appear in both "Read Next" and "Learning Path Next," only show it once (in the learning path section, which takes priority). |
| **No randomization** | Suggestions are deterministic. The same post always shows the same suggestions. Predictability builds trust. |
| **Max 2** | Never more than 2 suggestions. Choice overload is the enemy of action. |

### 7.4 Decision Tree — What Appears at the Bottom of Every Post

```
  Post rendered
       │
       ▼
  Is this post in a learning path?
       │
       ├── YES → Show "Learning Path Navigation" section
       │         (path name, previous post, next post)
       │
       └── NO  → Skip learning path section
       │
       ▼
  Does readNext exist in frontmatter?
       │
       ├── YES → Show "Read Next" with the specified posts
       │
       └── NO  → Show "Read Next" using the fallback logic (same category, then recent)
       │
       ▼
  Are any suggested posts the same as the "Next in path" post?
       │
       ├── YES → Remove the duplicate from "Read Next" (path nav takes priority)
       │
       └── NO  → Show both sections as-is
```

---

## Appendix: All Pages Summary

| Page | URL | Primary Purpose |
|---|---|---|
| Homepage | `/` | Orient the reader. Show latest posts. Offer browsing paths. |
| Blog Post | `/posts/[slug]` | The core experience. Read, learn, find the next thing to read. |
| Topics Index | `/topics` | List all categories with post counts. |
| Topic Page | `/topics/[slug]` | All posts in a category, in pedagogical order. |
| Paths Index | `/paths` | List all learning paths with descriptions. |
| Path Page | `/paths/[slug]` | Ordered list of posts in a learning sequence. |
| About | `/about` | Who writes this, why, editorial philosophy. |
| 404 | `/404` | Friendly error page with a link back to homepage. |
| RSS Feed | `/feed.xml` | Full-content feed for RSS readers. Not a rendered page. |
| Sitemap | `/sitemap.xml` | Auto-generated for search engines. Not a rendered page. |

**Total distinct page templates:** 7 (Home, Post, Topics Index, Topic, Paths Index, Path, About, 404)

---

*This document defines the structure and flow of every page and interaction in Stackless v1. Visual design, component design, and tech stack selection are covered in subsequent documents.*
