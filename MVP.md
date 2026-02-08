# MVP Definition — Stackless v1

**Parent document:** [PRD.md](PRD.md)
**Version:** 1.0
**Date:** February 8, 2026
**Scope:** What ships in the first public version — and nothing more.

---

## Guiding Principle

> Ship the smallest thing that delivers a complete reading experience.
>
> v1 is not a platform. It's a blog that works — fast, clean, readable.
> If a feature doesn't directly help a student read and understand a post, it doesn't ship in v1.

---

## 1. MVP Feature List (Must-Haves Only)

Every feature below must be present on launch day. No partial implementations — each ships complete or not at all.

### 1.1 Blog Post Pages

| Feature | Specification |
|---|---|
| **Render Markdown blog posts as full pages** | Each post is a standalone page with a clean, distraction-free reading layout. |
| **Post metadata** | Every post displays: title, publish date, estimated reading time, category/topic tag, and a link to the original engineering blog being explained. |
| **Consistent post structure** | Every post follows the editorial template: context → analogy → deep explanation → diagram (if needed) → takeaways. The template is enforced by content convention, not code. |
| **"What you should remember" section** | Every post ends with 3–5 bullet-point takeaways — visually distinct from the body text. |
| **Original source attribution** | A prominent, clearly labeled link to the original company engineering blog at the top of every post. Not hidden in a footer footnote. |
| **Inline term definitions** | Key jargon terms (e.g., "sharding," "backpressure") are explained inline on first use — via a short parenthetical, a tooltip, or a styled aside. No assumption the reader already knows. |
| **Static diagrams/illustrations** | Support for images and diagrams within posts (architecture diagrams, flow diagrams). Served as static images — no interactive rendering engines. |
| **Code snippets (read-only)** | Syntax-highlighted code blocks for pseudocode or small illustrative snippets. Read-only, no execution. |
| **"Read next" suggestion** | At the bottom of every post, suggest 1–2 related posts. Manually curated by the admin, not algorithmic. |

### 1.2 Homepage

| Feature | Specification |
|---|---|
| **Hero section** | One line explaining what Stackless is. No carousel, no animation. Just clarity. Example: *"Real engineering blogs, explained for students."* |
| **Latest posts list** | Display the most recent 6–10 posts with title, date, reading time, category, and a one-line summary. |
| **Category filter** | Filter posts by topic/category (e.g., Databases, Distributed Systems, Caching, Messaging). Simple tag-based filtering — not a faceted search. |

### 1.3 Category/Topic Pages

| Feature | Specification |
|---|---|
| **Dedicated page per category** | A page listing all posts under a given category (e.g., `/topics/databases`). |
| **Logical ordering** | Posts within a category are ordered by the admin (not by date). This allows a recommended reading sequence — foundational posts first, advanced posts later. |

### 1.4 Learning Paths (Lightweight)

| Feature | Specification |
|---|---|
| **Curated reading sequences** | Admin can define named learning paths (e.g., "Understanding Databases: From B-Trees to Distributed Storage"). Each path is an ordered list of 4–8 posts. |
| **Learning path page** | A dedicated page listing all available paths with a short description. Each path links to its posts in sequence. |
| **Sequential navigation within a path** | When reading a post as part of a path, show "Previous in path" / "Next in path" navigation. |

### 1.5 About Page

| Feature | Specification |
|---|---|
| **Static about page** | Explains who writes Stackless, why it exists, and the editorial philosophy. Written by Varun. One page, no fluff. |

### 1.6 SEO & Metadata

| Feature | Specification |
|---|---|
| **Page titles & meta descriptions** | Every page (home, post, category, about) has a unique, descriptive `<title>` and `<meta description>`. |
| **Open Graph tags** | Every post page has OG tags (title, description, image) so links shared on Twitter/X, LinkedIn, WhatsApp render with a proper preview card. |
| **Canonical URLs** | Clean, descriptive URLs: `/posts/how-discord-stores-messages`, `/topics/databases`. No query strings, no IDs in URLs. |
| **Structured data (JSON-LD)** | Blog post schema markup for Google rich results (article title, author, date, description). |
| **Sitemap & robots.txt** | Auto-generated sitemap.xml. Proper robots.txt allowing full indexing. |

### 1.7 RSS Feed

| Feature | Specification |
|---|---|
| **Full-content RSS feed** | A `/feed.xml` or `/rss.xml` endpoint serving the full content of recent posts. Readers who prefer RSS should get the complete reading experience in their reader. |

### 1.8 Performance

| Feature | Specification |
|---|---|
| **Static site generation** | All pages are pre-rendered at build time. No server-side rendering per request. No client-side data fetching for content. |
| **Fast page loads** | Target: < 2 seconds Largest Contentful Paint on a 4G connection. This is a hard requirement, not a nice-to-have. |
| **Minimal JavaScript** | The site should work without JavaScript enabled. JS is allowed for progressive enhancement (e.g., tooltips) but not required for reading. |
| **Optimized images** | All images served in modern formats (WebP/AVIF) with proper sizing and lazy loading. |

### 1.9 Responsive Design

| Feature | Specification |
|---|---|
| **Mobile-friendly layout** | Fully readable on mobile screens (360px+). No horizontal scroll, no pinch-to-zoom required. |
| **Typography-first responsive design** | Font sizes, line heights, and content width adapt to screen size. Reading comfort is the priority — not fitting more content on screen. |

---

## 2. Features Explicitly Excluded from v1

These are things we have considered and deliberately decided to NOT build. This is not a backlog — it's a boundary.

| # | Excluded Feature | Reason for Exclusion |
|---|---|---|
| X1 | **Search** | < 30 posts at launch. Category pages and learning paths provide sufficient navigation. Search adds complexity with no proportional value at this scale. |
| X2 | **Dark mode** | Ship one polished theme. Adding a toggle means designing, testing, and maintaining two visual systems. Not worth it for v1. |
| X3 | **Newsletter / email subscription** | Requires an email service provider, opt-in flows, unsubscribe handling, and GDPR considerations. RSS covers this need without the complexity. |
| X4 | **Comments** | Moderation burden. Discussion happens on Twitter/X. |
| X5 | **User accounts** | No personalization requires authentication. No logins. |
| X6 | **Analytics dashboard** | Use a lightweight, privacy-respecting third-party tool (e.g., Plausible, Umami). No custom-built dashboards. |
| X7 | **Reading progress indicator** | Nice-to-have visual feature. Not critical for v1 reading experience. |
| X8 | **Table of contents (in-post)** | Can be added later. Posts in v1 should be short enough (8–15 min reads) that a TOC isn't essential. |
| X9 | **Estimated difficulty level per post** | Useful but requires establishing a rubric. Defer until content library is large enough to need it. |
| X10 | **Social share buttons** | Browser-native sharing and copy-paste URLs are sufficient. Share buttons add visual clutter. |
| X11 | **Content series / multi-part posts** | Learning paths handle sequencing. No need for a separate "Part 1 of 4" system. |
| X12 | **Bookmark / "save for later"** | Requires user state (local storage or accounts). Out of scope for a stateless reading experience. |
| X13 | **Print-friendly stylesheet** | Extremely niche use case. Defer. |
| X14 | **Internationalization / i18n** | Content is in English only. No translation infrastructure. |
| X15 | **CMS admin panel** | Admin authors in Markdown files directly. No web-based content editor. |

---

## 3. Admin Capabilities in v1

Everything Varun (the sole admin/author) can do at launch.

### Content Authoring

| Capability | How It Works |
|---|---|
| **Write posts in Markdown** | Author posts as `.md` or `.mdx` files locally. Standard Markdown with support for images, code blocks, and frontmatter metadata. |
| **Define post metadata via frontmatter** | Each post file includes YAML frontmatter: `title`, `date`, `category`, `readingTime`, `summary`, `originalSource` (URL), `readNext` (list of related post slugs). |
| **Preview before publishing** | Run a local dev server to preview exactly how a post will look before deploying. |
| **Publish by deploying** | Publishing = committing the Markdown file and triggering a build/deploy. No CMS, no publish button — Git is the CMS. |

### Content Organization

| Capability | How It Works |
|---|---|
| **Assign categories to posts** | Set a `category` field in frontmatter. Categories are defined by convention (a fixed list maintained by the admin). |
| **Define learning paths** | A configuration file (e.g., `paths.json` or a Markdown file) defines each learning path: name, description, and an ordered list of post slugs. |
| **Order posts within categories** | A `weight` or `order` field in frontmatter controls the display order on category pages. Newer posts don't automatically appear first — the admin controls the pedagogical order. |
| **Set "Read Next" suggestions** | Manually specify 1–2 post slugs in the `readNext` frontmatter field. These appear at the bottom of the post. |

### Content Management

| Capability | How It Works |
|---|---|
| **Edit existing posts** | Edit the Markdown file, commit, redeploy. Full version history via Git. |
| **Unpublish a post** | Set `draft: true` in frontmatter. Draft posts are excluded from the build. |
| **View site analytics** | Access a third-party analytics dashboard (Plausible/Umami) to see page views, time on page, scroll depth, referral sources, and top posts. |

### Deployment

| Capability | How It Works |
|---|---|
| **One-command deploy** | `git push` triggers an automated build and deploy pipeline. No manual server management. |
| **Zero-downtime deploys** | Static site hosting means deployments are atomic — the new version replaces the old one instantly. |
| **Rollback** | Revert a Git commit and redeploy. Instant rollback to any previous version of the site. |

---

## 4. User (Reader) Capabilities in v1

Everything a reader can do when they visit Stackless. No account required — ever.

### Discover Content

| Capability | Detail |
|---|---|
| **Browse latest posts on the homepage** | See the most recently published posts with title, date, reading time, and summary. |
| **Browse by category** | Click a category (e.g., "Distributed Systems") to see all posts in that topic, ordered for learning progression. |
| **Explore learning paths** | View curated reading sequences and start from the beginning of a path. |

### Read Content

| Capability | Detail |
|---|---|
| **Read a full blog post** | Clean, distraction-free reading experience. No popups, no modals, no "sign up" interruptions. |
| **See reading time upfront** | Know before clicking how long a post will take (e.g., "12 min read"). |
| **Understand jargon in context** | Key terms are defined inline when first introduced. No need to open a separate tab to Google a term. |
| **See the original source** | One click to read the original company engineering blog the post is explaining. |
| **Review takeaways** | Every post ends with "What you should remember" — a quick summary to cement understanding. |

### Navigate Content

| Capability | Detail |
|---|---|
| **Move through a learning path** | "Previous" / "Next" buttons when reading a post within a path. |
| **Find related posts** | "Read Next" suggestions at the bottom of every post. |
| **Navigate back to category or home** | Clear breadcrumb or navigation to return to the category page or homepage. |

### Subscribe to Updates

| Capability | Detail |
|---|---|
| **Subscribe via RSS** | Add the RSS feed to any reader (Feedly, Inoreader, etc.) to get new posts delivered. Full content in feed — no "click to read more" truncation. |

### Share Content

| Capability | Detail |
|---|---|
| **Share via URL** | Every post has a clean, readable, permanent URL that can be shared anywhere. |
| **Get a rich preview when sharing** | Links shared on Twitter/X, LinkedIn, or WhatsApp render with a proper title, description, and image preview. |

---

## 5. v2 Scope — What Can Be Added Later

These are features that have clear value but are explicitly deferred. They'll be considered once v1 is live, content is flowing, and real reader behavior data exists.

### High Confidence (Likely v2)

| Feature | Trigger to Build |
|---|---|
| **Dark mode toggle** | If analytics show significant evening/night reading sessions (>30% of traffic between 8 PM–2 AM). |
| **In-post table of contents** | When posts regularly exceed 15 minutes reading time and readers report losing their place. |
| **Newsletter (email subscription)** | When returning visitor rate exceeds 25% — these readers want a push notification channel. Use a simple service like Buttondown, not a custom build. |
| **Reading progress bar** | When average post length increases and scroll depth data shows readers abandoning mid-post. |
| **Search** | When the content library exceeds 30 posts and category browsing becomes insufficient. Lightweight client-side search (e.g., Pagefind) — not a search backend. |

### Medium Confidence (Maybe v2/v3)

| Feature | Trigger to Build |
|---|---|
| **"Difficulty level" tags** | When the content library has enough range (beginner to advanced) that readers need guidance on where to start. |
| **Glossary page** | When the same 20+ jargon terms are defined across multiple posts and a centralized reference becomes valuable. |
| **Post series / multi-part indicator** | When there are 3+ topics that require multi-part treatment and learning paths alone don't convey the "part 1 of 3" relationship clearly. |
| **Guest posts (curated)** | When trusted contributors (e.g., senior engineers) want to contribute and Varun can maintain editorial quality control. |
| **Social share buttons** | Only if data shows readers want to share but aren't — unlikely, but worth revisiting. |
| **Bookmark / save for later** | If readers request it. Could use browser-local storage without accounts. |

### Low Confidence (v3+ or Never)

| Feature | Trigger to Build |
|---|---|
| **Community Discord / forum** | Only if a genuine community forms organically and needs a home. Not something to build speculatively. |
| **Interactive diagrams** | If static diagrams consistently fail to convey complex flows (e.g., request routing through a distributed system). High cost, high maintenance. |
| **Podcast or audio versions** | Only if content format experimentation shows demand. Different medium = different production pipeline. |
| **Localization / translations** | Only if meaningful non-English traffic emerges organically. Translation is expensive to maintain. |
| **Anonymized reading analytics shared with readers** | "500 other students read this post" — could increase trust and social proof. But also adds complexity. Revisit if growth stalls. |

---

## MVP Launch Checklist

Before going live, these must all be true:

- [ ] **5+ blog posts published** — enough content that the site feels real, not empty.
- [ ] **At least 2 categories with 2+ posts each** — category pages aren't ghost towns.
- [ ] **1 complete learning path** — demonstrates the concept and gives readers a guided entry point.
- [ ] **About page written** — explains who, why, and the editorial philosophy.
- [ ] **RSS feed functional** — validated in a feed reader.
- [ ] **OG tags verified** — links render correctly on Twitter/X and LinkedIn.
- [ ] **Page load under 2 seconds** — tested on a throttled connection (4G simulation).
- [ ] **Mobile layout reviewed** — tested on at least 2 screen sizes (phone + tablet).
- [ ] **Analytics connected** — lightweight privacy-respecting analytics live and tracking.
- [ ] **Deployed to production URL** — not localhost. Real domain. HTTPS.

---

*This document defines the v1 boundary. If a feature isn't listed in Section 1, it does not ship. When in doubt, leave it out.*
