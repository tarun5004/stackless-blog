# Admin Role Definition — Stackless v1

**Parent documents:** [PRD.md](PRD.md) · [MVP.md](MVP.md) · [TECHNICAL-ARCHITECTURE.md](TECHNICAL-ARCHITECTURE.md)
**Version:** 1.0
**Date:** February 8, 2026
**Scope:** Every permission, workflow, dashboard section, and safety rule for the sole admin (Varun).

---

## Architecture Context: The Hybrid Model

Stackless uses a **hybrid admin model** — content authoring happens in Git (MDX files in VS Code), but operational management happens through a lightweight web-based admin panel.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ADMIN WORKFLOW SPLIT                            │
│                                                                         │
│   ┌──────────────────────────────┐  ┌────────────────────────────────┐  │
│   │  GIT (VS Code + Terminal)    │  │  WEB PANEL (/admin)            │  │
│   │  ─────────────────────────── │  │  ────────────────────────────  │  │
│   │                              │  │                                │  │
│   │  • Write blog posts (MDX)    │  │  • Toggle draft/publish        │  │
│   │  • Add images & diagrams     │  │  • Manage categories           │  │
│   │  • Use custom components     │  │  • Manage learning paths       │  │
│   │  • Preview locally           │  │  • Reorder posts in topics     │  │
│   │  • Full version history      │  │  • Set featured post           │  │
│   │                              │  │  • View content health         │  │
│   │  WHY HERE: Prose authoring   │  │  • View analytics (embedded)   │  │
│   │  is best in a code editor.   │  │  • Trigger rebuild/deploy      │  │
│   │  MDX needs syntax support.   │  │                                │  │
│   │  Git gives version control.  │  │  WHY HERE: Metadata ops are    │  │
│   │                              │  │  faster in a UI than editing   │  │
│   │                              │  │  JSON files and pushing Git.   │  │
│   └──────────────────────────────┘  └────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What the admin panel IS:** A thin operational layer. It reads from and writes to the same Git repo (via GitHub API or a flat-file JSON store). It does not store content — it manages metadata about content.

**What the admin panel is NOT:** A content editor. You will never write or edit a blog post body inside the admin panel.

---

## 1. Admin Permissions

### 1.1 Complete Permission Matrix

| Permission | Mechanism | Scope |
|---|---|---|
| **Create a new blog post** | Git (write MDX file, commit, push) | Unlimited |
| **Edit a blog post body** | Git (edit MDX file, commit, push) | Any published or draft post |
| **Delete a blog post permanently** | Git (delete file, commit, push) | Any post — irreversible in production, recoverable via Git history |
| **Toggle post draft/publish status** | Admin panel (updates frontmatter `draft` field, commits via GitHub API) | Any post |
| **Set a post as featured** | Admin panel (updates `featured` flag, ensures only one post is featured at a time) | Any published post |
| **Create/edit/delete categories** | Admin panel (modifies `topics.json`, commits via GitHub API) | Full CRUD |
| **Create/edit/delete learning paths** | Admin panel (modifies path JSON files, commits via GitHub API) | Full CRUD |
| **Reorder posts within a category** | Admin panel (drag-and-drop updates `order` fields in post frontmatter) | Any category |
| **Reorder posts within a learning path** | Admin panel (drag-and-drop updates order in path JSON) | Any path |
| **Set "Read Next" suggestions for a post** | Admin panel (updates `readNext` in frontmatter) | Any post |
| **View analytics** | Admin panel (embedded Plausible/Umami dashboard) | All-time site data |
| **Trigger manual redeploy** | Admin panel (calls Vercel deploy hook) | Entire site |
| **Rollback to a previous deploy** | Vercel dashboard (or `git revert` + push) | Any Git commit |
| **View content health & warnings** | Admin panel (build-time validation report) | All posts |
| **Access the admin panel** | GitHub OAuth (only the repo owner's GitHub account) | Single user |

### 1.2 What the Admin CANNOT Do from the Panel

| Action | Why Not | How to Do It Instead |
|---|---|---|
| Write or edit post body text | MDX authoring requires a proper code editor with syntax highlighting, live preview, and component autocomplete. A textarea in a browser is objectively worse. | VS Code + Git |
| Upload images through the panel | Images need to be co-located with MDX files, optimized, and referenced with correct relative paths. A file picker UI doesn't help. | Add to `/content/images/`, reference in MDX |
| Change site design or layout | Design changes are code changes. They need a code editor and local preview. | Edit React components in VS Code |
| Manage deployment infrastructure | Infrastructure config (domain, CDN, build settings) belongs in Vercel/Cloudflare dashboards, not a custom panel. | Vercel + Cloudflare dashboards |

---

## 2. Admin Dashboard — Sections (Top to Bottom)

The admin panel lives at `stackless.dev/admin` (protected by auth). It is a single-page app with a sidebar navigation.

### 2.1 Dashboard Layout

```
┌───────────────────────────────────────────────────────────────────────┐
│  STACKLESS ADMIN                                    Varun  ·  Logout │
├──────────────┬────────────────────────────────────────────────────────┤
│              │                                                        │
│  ■ Overview  │   [Active section content renders here]               │
│              │                                                        │
│  ■ Posts     │                                                        │
│              │                                                        │
│  ■ Topics    │                                                        │
│              │                                                        │
│  ■ Paths     │                                                        │
│              │                                                        │
│  ■ Analytics │                                                        │
│              │                                                        │
│  ■ Settings  │                                                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
│              │                                                        │
│  ■ Deploy    │                                                        │
│              │                                                        │
├──────────────┴────────────────────────────────────────────────────────┤
│  Last deploy: 2 hours ago  ·  Build: healthy  ·  18 posts published  │
└───────────────────────────────────────────────────────────────────────┘
```

---

### 2.2 Section 1: Overview (Dashboard Home)

The first thing the admin sees after login. Quick status at a glance — no clicks needed.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Overview                                                            │
│                                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │  18         │ │  3          │ │  2          │ │  4          │   │
│  │  Published  │ │  Drafts     │ │  Paths      │ │  Topics     │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                      │
│  Content Health                                                      │
│  ──────────────                                                      │
│  ⚠ 2 posts have no "Read Next" suggestions                         │
│  ⚠ 1 post has a readNext slug that doesn't match any published post │
│  ✓ All frontmatter schemas valid                                    │
│  ✓ No orphaned images                                               │
│  ✓ All learning path references resolve                             │
│                                                                      │
│  Recent Activity                                                     │
│  ───────────────                                                     │
│  • Published "How Uber Matches Riders" — 3 days ago                 │
│  • Moved "Caching 101" from draft to published — 5 days ago         │
│  • Updated learning path "Databases from Zero" — 1 week ago         │
│                                                                      │
│  This Week (from Plausible)                                          │
│  ──────────────────────────                                          │
│  2,340 visitors  ·  4,120 page views  ·  6m 12s avg time on page    │
│  Top post: "How Discord Stores Messages" (890 views)                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

| Element | Source | Detail |
|---|---|---|
| **Stat cards** | Git repo (parsed at panel load) | Counts of published posts, drafts, paths, topics. |
| **Content health warnings** | Build-time validation log (stored as JSON artifact) | Flags missing readNext slugs, broken references, missing fields. Updated on every build. |
| **Recent activity** | Git commit history (via GitHub API) | Last 5–10 content-related commits, human-readable. |
| **This week stats** | Plausible API (embedded) | Top-line analytics for the current week. |

---

### 2.3 Section 2: Posts

The core section. Lists all posts (published + drafts). Lets the admin manage metadata without touching the MDX file.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Posts                                              [Filter ▾]       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ STATUS │ TITLE                            │ TOPIC    │ DATE     ││
│  ├────────┼──────────────────────────────────┼──────────┼──────────┤│
│  │ ● Live │ How Discord Stores Messages      │ Database │ Jan 28   ││
│  │ ★ Feat │ How Uber Matches Riders          │ Dist Sys │ Feb 5    ││
│  │ ● Live │ What Happens When You Like Tweet │ Caching  │ Feb 1    ││
│  │ ● Live │ What Is a Database, Really?      │ Database │ Jan 10   ││
│  │ ○ Draft│ How Stripe Processes Payments    │ Database │ —        ││
│  │ ○ Draft│ Kafka for Beginners              │ Messagi… │ —        ││
│  │ ○ Draft│ Circuit Breakers Explained       │ Dist Sys │ —        ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Filter: All ·  Published (4) ·  Drafts (3) ·  Featured (1)        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Clicking a post row** opens the post detail view:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Back to Posts                                                     │
│                                                                      │
│  How Discord Stores Trillions of Messages                            │
│                                                                      │
│  Status: ● Published          [Switch to Draft]                      │
│  Featured: No                 [Set as Featured]                      │
│                                                                      │
│  ── Metadata ──────────────────────────────────────────              │
│                                                                      │
│  Topic:         [Databases          ▾]                               │
│  Reading Time:  [14 min             ]                                │
│  Publish Date:  [2026-01-28         ]                                │
│  Order (in topic): [2               ]                                │
│                                                                      │
│  ── Original Source ───────────────────────────────────              │
│                                                                      │
│  Source Title:  [How Discord Stores Trillions of Messages ]          │
│  Source URL:    [https://discord.com/blog/how-discord...  ]          │
│                                                                      │
│  ── Read Next ─────────────────────────────────────────              │
│                                                                      │
│  Suggestion 1:  [What Is a Database, Really?        ▾]  [✕ Remove]  │
│  Suggestion 2:  [What Happens When You Like a Tweet ▾]  [✕ Remove]  │
│                 [+ Add suggestion]                                    │
│                                                                      │
│  ── Learning Paths ────────────────────────────────────              │
│                                                                      │
│  Part of: "Understanding Databases" (position 2 of 4)               │
│                                                                      │
│  ── Actions ───────────────────────────────────────────              │
│                                                                      │
│  [Open in GitHub]    [View Live Post]    [View Analytics for Post]   │
│                                                                      │
│  ── Danger Zone ───────────────────────────────────────              │
│                                                                      │
│  [Unpublish (set to draft)]                                          │
│                                                                      │
│  ────────────────────────────────────────────                        │
│  Last edited: 3 days ago (commit abc1234)                            │
│  [Save Changes]                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**What "Save Changes" does:** Commits the updated frontmatter back to the GitHub repo via the GitHub API. This triggers a Vercel rebuild. The post body (MDX content) is never touched by the admin panel — only frontmatter metadata fields.

---

### 2.4 Section 3: Topics

Manage categories. CRUD + ordering.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Topics                                            [+ New Topic]     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │  ≡  Databases              5 posts    [Edit] [Delete]           ││
│  │  ≡  Distributed Systems    4 posts    [Edit] [Delete]           ││
│  │  ≡  Caching                3 posts    [Edit] [Delete]           ││
│  │  ≡  Messaging              2 posts    [Edit] [Delete]           ││
│  │  ≡  Networking             1 post     [Edit] [Delete]           ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ≡ = drag handle (reorder topics for display on site)               │
│                                                                      │
│  ┌─ Edit Topic ──────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  Name:        [Databases                                    ]  │  │
│  │  Slug:        databases  (auto-generated, editable)            │  │
│  │  Description: [How real companies store, query, and scale   ]  │  │
│  │               [their data.                                  ]  │  │
│  │                                                                │  │
│  │  Posts in this topic (drag to reorder):                        │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  1. ≡  What Is a Database, Really?           order: 1   │  │  │
│  │  │  2. ≡  How Discord Stores Messages           order: 2   │  │  │
│  │  │  3. ≡  Why Netflix Built Their Own DB         order: 3   │  │  │
│  │  │  4. ≡  How Stripe Handles Payments DB         order: 4   │  │  │
│  │  │  5. ≡  Scaling Postgres at Notion             order: 5   │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  [Save]  [Cancel]                                              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

| Action | What Happens Under the Hood |
|---|---|
| **Create topic** | Adds an entry to `topics.json`, commits via GitHub API, triggers rebuild. |
| **Edit topic** | Updates the entry in `topics.json`. If slug changes, updates the `category` field in all affected posts' frontmatter. Committed as a single atomic commit. |
| **Delete topic** | Removes the entry from `topics.json`. Posts in that category are NOT deleted — their `category` field becomes empty (flagged as a content health warning). Requires confirmation. |
| **Reorder posts** | Updates the `order` field in each affected post's frontmatter. Single commit with all changes. |

---

### 2.5 Section 4: Learning Paths

Same pattern as Topics. Manage paths, reorder posts within them.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Learning Paths                                    [+ New Path]      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │  Understanding Databases          4 posts    [Edit] [Delete]    ││
│  │  Distributed Systems 101          3 posts    [Edit] [Delete]    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─ Edit Path ───────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  Title:       [Understanding Databases: From B-Trees to...  ]  │  │
│  │  Slug:        databases-from-zero  (auto-generated)            │  │
│  │  Description: [Start with how databases work under the hood,]  │  │
│  │               [then explore how companies scale them.       ]  │  │
│  │                                                                │  │
│  │  Posts in path (drag to reorder):                              │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  1. ≡  What Is a Database, Really?                      │  │  │
│  │  │  2. ≡  How Discord Stores Messages                      │  │  │
│  │  │  3. ≡  Why Netflix Built Their Own DB                    │  │  │
│  │  │  4. ≡  How Stripe Handles Payments DB                   │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  [+ Add post to path]  (dropdown of all published posts)      │  │
│  │                                                                │  │
│  │  [Save]  [Cancel]                                              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

| Action | What Happens Under the Hood |
|---|---|
| **Create path** | Creates a new JSON file in `/content/paths/`, commits via GitHub API. |
| **Edit path** | Updates the path JSON file. If post order changes, the path JSON is updated. Post frontmatter is NOT modified — path membership is defined by the path file, not the post. |
| **Delete path** | Deletes the path JSON file. Posts that were in the path are unaffected — they just lose their path navigation on the next build. Requires confirmation. |
| **Add post to path** | Appends the post slug to the path's `posts` array. |
| **Remove post from path** | Removes the slug from the array. |

---

### 2.6 Section 5: Analytics

An embedded view of Plausible/Umami analytics. Not a custom-built dashboard — an iframe or API-driven integration that brings external analytics into the admin panel.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Analytics                                  [Open in Plausible →]    │
│                                                                      │
│  ── Site-Wide (This Month) ──────────────────────────────────────   │
│                                                                      │
│  Visitors: 8,420       Page Views: 14,800     Avg Time: 5m 32s      │
│  Bounce Rate: 42%      Top Referrer: Google    Top Country: India    │
│                                                                      │
│  ── Top Posts (by time on page) ─────────────────────────────────   │
│                                                                      │
│  1. How Discord Stores Messages        7m 14s    2,340 views        │
│  2. How Uber Matches Riders            6m 48s    1,120 views        │
│  3. What Is a Database, Really?        5m 02s      980 views        │
│  4. What Happens When You Like a Tweet 4m 56s      760 views        │
│                                                                      │
│  ── Scroll Depth (avg across all posts) ─────────────────────────   │
│                                                                      │
│  25% ████████████████████████████████████████████ 94%                │
│  50% ██████████████████████████████████████ 82%                      │
│  75% ████████████████████████████████ 71%                            │
│  100% █████████████████████████ 58%                                  │
│                                                                      │
│  ── Referral Sources ────────────────────────────────────────────   │
│                                                                      │
│  Google: 52%  ·  Twitter/X: 18%  ·  Direct: 15%  ·  Reddit: 8%     │
│  LinkedIn: 4%  ·  Other: 3%                                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Implementation:** Plausible provides a [Stats API](https://plausible.io/docs/stats-api) and an embeddable shared dashboard. The admin panel fetches key stats via the API and renders them. The "Open in Plausible" link goes to the full external dashboard for deeper analysis.

**Per-post analytics:** When viewing a post's detail view (Section 2.3), the "View Analytics for Post" button shows that specific post's traffic, time-on-page, and referrers — filtered via the Plausible API.

---

### 2.7 Section 6: Settings

Site-level configuration. Rarely used, but necessary.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Settings                                                            │
│                                                                      │
│  ── Site Metadata ───────────────────────────────────────────────   │
│                                                                      │
│  Site Title:       [Stackless                                    ]   │
│  Tagline:          [Real engineering blogs, explained for students]   │
│  Site URL:         [https://stackless.dev                        ]   │
│  Author Name:      [Varun                                        ]   │
│  Default OG Image: [og-default.png] [Upload new]                     │
│                                                                      │
│  ── Social Links (shown in footer) ─────────────────────────────   │
│                                                                      │
│  Twitter/X:  [@stacklessdev                                      ]   │
│  GitHub:     [github.com/varun/stackless                         ]   │
│                                                                      │
│  ── RSS Feed ────────────────────────────────────────────────────   │
│                                                                      │
│  Posts in feed:    [20      ]  (most recent N posts)                  │
│  Feed format:      Full content (not truncated)                      │
│                                                                      │
│  ── Plausible Integration ───────────────────────────────────────   │
│                                                                      │
│  Site ID:          [stackless.dev                                ]   │
│  API Key:          [••••••••••••••••••]  [Reveal]                     │
│                                                                      │
│  [Save Settings]                                                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Storage:** Settings are stored in a `site-config.json` file in the repo root. Updating settings commits the changed file via GitHub API and triggers a rebuild.

---

### 2.8 Section 7: Deploy

Manual control over the build/deploy pipeline.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Deploy                                                              │
│                                                                      │
│  Current Status                                                      │
│  ──────────────                                                      │
│  Last deploy:  Feb 8, 2026 at 2:34 PM   ● Succeeded                │
│  Build time:   47 seconds                                            │
│  Commit:       abc1234 — "Published: How Uber Matches Riders"        │
│  Triggered by: git push (automatic)                                  │
│                                                                      │
│  Recent Deploys                                                      │
│  ──────────────                                                      │
│  • Feb 8, 2:34 PM   ● Success   abc1234  "Published: How Uber..."   │
│  • Feb 5, 11:20 AM  ● Success   def5678  "Updated topic order"      │
│  • Feb 3, 9:15 AM   ● Success   ghi9012  "Published: Tweet post"    │
│  • Feb 1, 4:00 PM   ✕ Failed    jkl3456  "Added broken readNext"    │
│                                                                      │
│  Actions                                                             │
│  ────────                                                            │
│  [Trigger Rebuild]   Rebuilds from latest commit on main.            │
│                      Use when a build failed due to a transient       │
│                      error, or after an external dependency updated.  │
│                                                                      │
│  [Open Vercel Dashboard →]                                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

| Action | Implementation |
|---|---|
| **Trigger Rebuild** | Calls the Vercel Deploy Hook (a POST request to a webhook URL). Same as `git push` but without a new commit — just re-runs the build. |
| **View deploy history** | Fetched from Vercel API (last 10 deploys with status, timestamp, commit message). |
| **Rollback** | Not in the admin panel. Rollbacks are done via `git revert` + push, or through Vercel's dashboard. Intentionally excluded from the admin panel to prevent accidental use — this is a destructive action. |

---

## 3. Blog Creation Workflow

### 3.1 End-to-End Flow (Git + Admin Panel Combined)

```
  ┌─────────────────────────────────────────────────────────┐
  │  PHASE 1: WRITE (in VS Code)                           │
  │                                                         │
  │  1. Create new MDX file in /content/posts/              │
  │     Filename: how-uber-matches-riders.mdx               │
  │                                                         │
  │  2. Write minimal frontmatter:                          │
  │     ---                                                 │
  │     title: "How Uber Matches Riders to Drivers"         │
  │     slug: "how-uber-matches-riders"                     │
  │     category: "distributed-systems"                     │
  │     summary: "..."                                      │
  │     originalSource:                                     │
  │       title: "..."                                      │
  │       url: "https://..."                                │
  │     draft: true            ← starts as draft            │
  │     ---                                                 │
  │                                                         │
  │  3. Write the post body in Markdown/MDX                 │
  │     - Context/hook                                      │
  │     - Analogy                                           │
  │     - Deep explanation with subheadings                 │
  │     - Diagrams (<Figure>), definitions (<Definition>)   │
  │     - What You Should Remember (<Takeaways>)            │
  │                                                         │
  │  4. Add images to /content/images/                      │
  │                                                         │
  │  5. Preview locally: npm run dev → localhost:3000       │
  │     Check: rendering, images, components, mobile layout │
  │                                                         │
  │  6. Commit and push:                                    │
  │     git add . && git commit -m "Draft: Uber post"       │
  │     git push                                            │
  │     (Build runs. Draft post is excluded from public      │
  │      site but visible in admin panel.)                   │
  │                                                         │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │  PHASE 2: REFINE METADATA (in Admin Panel)             │
  │                                                         │
  │  7. Open admin panel → Posts → click the new draft      │
  │                                                         │
  │  8. Set metadata:                                       │
  │     - Verify/adjust topic assignment                    │
  │     - Set reading time (or let it auto-calculate)       │
  │     - Set readNext suggestions (pick from dropdown of   │
  │       published posts)                                  │
  │     - Decide: add to a learning path? If yes, go to    │
  │       Paths section and add the post slug to a path.    │
  │                                                         │
  │  9. Review content health:                              │
  │     - No warnings on this post?                         │
  │     - readNext slugs resolve correctly?                 │
  │     - Topic exists?                                     │
  │                                                         │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │  PHASE 3: PUBLISH (in Admin Panel)                     │
  │                                                         │
  │  10. Click [Publish] (sets draft: false, sets date      │
  │      to today if not already set)                       │
  │                                                         │
  │  11. Optionally: click [Set as Featured] to make this   │
  │      the featured post on the homepage                  │
  │                                                         │
  │  12. Admin panel commits the frontmatter changes via    │
  │      GitHub API → Vercel rebuild triggers               │
  │                                                         │
  │  13. ~60 seconds later: post is live on the public site │
  │                                                         │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │  PHASE 4: VERIFY (in Browser)                          │
  │                                                         │
  │  14. Visit the live URL: stackless.dev/posts/how-uber-  │
  │      matches-riders                                     │
  │                                                         │
  │  15. Check:                                             │
  │      - Post renders correctly                           │
  │      - OG tags work (paste URL in Twitter/LinkedIn      │
  │        card validator)                                   │
  │      - Read Next links resolve                          │
  │      - Learning path nav appears (if applicable)        │
  │      - Homepage shows the post in the latest list       │
  │      - Topic page includes the post at correct position │
  │                                                         │
  │  16. Done. ✓                                            │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

### 3.2 Time Estimate Per Post

| Phase | Estimated Time |
|---|---|
| Writing the MDX content | 3–8 hours (depends on complexity) |
| Adding images/diagrams | 30–60 minutes |
| Local preview & iteration | 15–30 minutes |
| Metadata setup in admin panel | 5–10 minutes |
| Publishing + verification | 5 minutes |
| **Total** | **4–10 hours per post** |

The admin panel saves time only where it should — metadata operations. The writing itself is fast because it's in a proper editor, not a tiny web textarea.

---

## 4. Blog Editing & Publishing Workflow

### 4.1 Editing Content (Post Body)

```
  Admin notices a typo / wants to improve a section
         │
         ▼
  Opens the MDX file in VS Code
         │
         ▼
  Makes edits (content, diagrams, components)
         │
         ▼
  Previews locally (npm run dev)
         │
         ▼
  Commits and pushes
         │
         ▼
  Vercel rebuilds → live in ~60 seconds
         │
         ▼
  No admin panel involvement needed
  (content body changes don't require metadata updates)
```

### 4.2 Editing Metadata (Via Admin Panel)

```
  Admin wants to change the readNext suggestion or reorder a topic
         │
         ▼
  Opens admin panel → Posts → selects the post
         │
         ▼
  Changes the relevant field(s) in the post detail view
         │
         ▼
  Clicks [Save Changes]
         │
         ▼
  Admin panel commits the changed frontmatter via GitHub API
  (commit message: "admin-panel: updated metadata for [post-slug]")
         │
         ▼
  Vercel rebuilds → live in ~60 seconds
```

### 4.3 Publishing a Draft

```
  Admin has a draft post (draft: true, written and pushed via Git)
         │
         ▼
  Opens admin panel → Posts → filters by "Drafts" → selects the post
         │
         ▼
  Reviews metadata: topic, readNext, reading time, original source
         │
         ▼
  Clicks [Publish]
         │
         ▼
  System sets:
    draft: false
    date: today (if not already set)
         │
         ▼
  Commits via GitHub API → Vercel rebuilds → post is live
```

### 4.4 Unpublishing a Post

```
  Admin wants to remove a live post from the site
         │
         ▼
  Posts → selects the post → Danger Zone → [Unpublish]
         │
         ▼
  Confirmation dialog:
    "This will remove the post from the public site.
     The MDX file will NOT be deleted — it becomes a draft.
     Readers who visit the old URL will see a 404.
     Continue?"
         │
         ▼
  [Confirm Unpublish]
         │
         ▼
  Sets draft: true in frontmatter → commits → rebuilds
         │
         ▼
  Post is removed from:
    - Homepage
    - Topic page
    - Learning paths (shows gap or skips the post)
    - RSS feed
    - Sitemap
  But the MDX file still exists in Git (recoverable anytime)
```

### 4.5 Changing the Featured Post

```
  Admin wants to feature a different post on the homepage
         │
         ▼
  Posts → selects a published post → [Set as Featured]
         │
         ▼
  System automatically:
    1. Sets featured: false on the currently featured post
    2. Sets featured: true on the selected post
    3. Commits both changes in a single atomic commit
         │
         ▼
  Rebuilds → new featured post appears on homepage
```

**Constraint:** At most one post can be featured at any time. The admin panel enforces this — it's not just a convention.

---

## 5. Content Health & Moderation

Since Stackless is a single-author blog, "moderation" doesn't mean reviewing other people's content. It means **self-moderation** — automated checks that help the admin maintain quality and consistency across the content library.

### 5.1 Build-Time Validation (Automated on Every Deploy)

These checks run during `npm run build`. If a critical check fails, the build fails and nothing deploys.

| Check | Severity | What It Catches |
|---|---|---|
| **Frontmatter schema validation** | 🔴 Build fails | Missing required fields (title, slug, category, summary, originalSource). Invalid types. |
| **Unique slug enforcement** | 🔴 Build fails | Two posts with the same slug. Would cause URL collision. |
| **Category existence** | 🔴 Build fails | Post references a `category` that doesn't exist in `topics.json`. |
| **readNext slug resolution** | 🟡 Warning | A `readNext` slug doesn't match any published post. Build succeeds, but the suggestion is silently omitted and flagged in the admin panel. |
| **Learning path slug resolution** | 🟡 Warning | A path references a post slug that doesn't exist or is in draft. Path renders with the missing post skipped. |
| **Image existence** | 🟡 Warning | A post references an image file that doesn't exist in the expected location. |
| **Orphaned images** | 🟢 Info | An image file exists in `/content/images/` but is not referenced by any post. Not harmful, but clutters the repo. |
| **Draft posts in readNext** | 🟡 Warning | A published post's readNext references a draft post. The suggestion is omitted at build time but flagged. |

### 5.2 Content Health Dashboard (Admin Panel — Overview Section)

These checks are run at build time and the results are stored as a JSON artifact. The admin panel reads this artifact and displays the current health status.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Content Health                                                      │
│                                                                      │
│  ── Errors (0) ──────────────────────────────────────────────────   │
│  ✓ No errors. All builds passing.                                   │
│                                                                      │
│  ── Warnings (3) ────────────────────────────────────────────────   │
│                                                                      │
│  ⚠ "How Uber Matches Riders" has no readNext suggestions.          │
│    → Open post to add suggestions                                    │
│                                                                      │
│  ⚠ "Kafka for Beginners" (draft) is referenced in the path         │
│    "Distributed Systems 101". It will be skipped until published.   │
│    → Publish the post  or  → Remove from path                       │
│                                                                      │
│  ⚠ "how-stripe-handles-payments" is referenced in readNext of      │
│    "What Is a Database, Really?" but is still a draft.              │
│    → Publish the post  or  → Remove from readNext                   │
│                                                                      │
│  ── Suggestions (2) ────────────────────────────────────────────   │
│                                                                      │
│  ℹ  2 orphaned images in /content/images/ (unused by any post).     │
│     discord-old-diagram.webp, uber-draft-v1.webp                     │
│     → Delete them  or  → Ignore                                     │
│                                                                      │
│  ℹ  Topic "Networking" has only 1 post. Consider adding more        │
│     before featuring it prominently.                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Pre-Publish Checklist (Displayed When Admin Clicks "Publish")

Before a draft goes live, the admin sees a checklist confirming the post is ready:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Ready to publish "How Uber Matches Riders"?                        │
│                                                                      │
│  ✓  Title is set                                                    │
│  ✓  Summary is set (shown on homepage and in OG tags)               │
│  ✓  Category assigned: Distributed Systems                          │
│  ✓  Original source linked                                          │
│  ✓  Reading time set: 11 min                                        │
│  ⚠  No readNext suggestions set (will use fallback: next posts     │
│     in same category)                                                │
│  ✓  No broken image references                                      │
│  ✓  Post has a "What You Should Remember" section                   │
│                                                                      │
│  [Publish Anyway]          [Go Back and Fix]                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Warnings do not block publishing.** Only build-time errors (red) block deployment. Warnings (yellow) are advisory — the admin can publish with warnings and fix later.

---

## 6. Safety Rules — What Admin Can Override

### 6.1 Protection Levels

Every action in the admin panel has a protection level that determines whether it can be performed freely, requires confirmation, or is restricted.

| Protection Level | Meaning | Example Actions |
|---|---|---|
| 🟢 **Free** | Perform immediately. No confirmation needed. | Edit reading time, change category, add readNext |
| 🟡 **Confirm** | Show a confirmation dialog explaining the impact. Reversible action. | Publish a draft, unpublish a post, set featured, remove post from path |
| 🔴 **Danger** | Show a detailed warning dialog. Action has consequences that aren't immediately reversible from the panel. | Delete a topic with posts in it, delete a learning path |
| ⛔ **Blocked** | Cannot be done from the admin panel at all. Must use Git or external dashboards. | Delete a post file, rollback a deployment, change site code |

### 6.2 Complete Safety Rule Matrix

| Action | Level | Override Behavior |
|---|---|---|
| **Edit post metadata fields** | 🟢 Free | Instant save. Triggers rebuild. |
| **Change a post's category** | 🟢 Free | Updates frontmatter. Post moves to new topic page on rebuild. |
| **Add/remove readNext** | 🟢 Free | Updates frontmatter. |
| **Reorder posts in a topic** | 🟢 Free | Updates `order` fields in affected posts. |
| **Publish a draft** | 🟡 Confirm | "This post will be publicly visible. Continue?" |
| **Unpublish a post** | 🟡 Confirm | "This removes the post from the public site. The URL will 404. Readers who bookmarked it will get a broken link. Continue?" |
| **Set a post as featured** | 🟡 Confirm | "This will replace the current featured post ([title]). Continue?" |
| **Add a post to a learning path** | 🟢 Free | Appends slug to path JSON. |
| **Remove a post from a path** | 🟡 Confirm | "This post will no longer appear in the path navigation. Readers mid-path may see a gap. Continue?" |
| **Delete a learning path** | 🔴 Danger | "This will permanently remove the path '[title]'. Posts in the path will NOT be deleted, but path navigation will disappear from those post pages. This cannot be undone from the admin panel. Continue?" |
| **Create a new topic** | 🟢 Free | Adds to `topics.json`. |
| **Rename a topic** | 🟡 Confirm | "This will update the name displayed on the site. The URL slug will also change, which means existing links to this topic page will break. Continue?" Also updates all posts in that topic. |
| **Delete a topic** | 🔴 Danger | "This topic has [N] posts. Deleting it will leave those posts without a category (flagged as content health warnings). The topic page URL will 404. Continue?" |
| **Trigger manual rebuild** | 🟡 Confirm | "This will rebuild the site from the latest commit. If the latest commit has build errors, the deploy will fail and the current live site will be unaffected. Continue?" |
| **Delete a post file** | ⛔ Blocked | Cannot be done from admin panel. Use Git. Rationale: permanent data deletion should require the deliberation of a Git commit, not a button click. |
| **Rollback a deployment** | ⛔ Blocked | Cannot be done from admin panel. Use Vercel dashboard or `git revert`. Rationale: rollbacks affect the entire site, not just one post. Too destructive for a single button. |
| **Edit post body/content** | ⛔ Blocked | Cannot be done from admin panel. Use VS Code + Git. Rationale: MDX authoring needs a proper editor. |
| **Change site design/code** | ⛔ Blocked | Cannot be done from admin panel. Use VS Code + Git. |

### 6.3 Audit Trail

Every action taken through the admin panel is traceable because every change results in a Git commit (via the GitHub API). The commit messages follow a consistent format:

```
admin-panel: published "how-uber-matches-riders"
admin-panel: updated readNext for "how-discord-stores-messages"
admin-panel: reordered posts in topic "databases"
admin-panel: created learning path "distributed-systems-101"
admin-panel: deleted topic "networking"
admin-panel: set featured post to "how-uber-matches-riders"
```

This means:
- Every change has a timestamp (Git commit timestamp).
- Every change can be reverted (`git revert <commit>`).
- The admin can see what the panel changed vs. what was changed manually in VS Code.
- There's no separate audit log to maintain — Git IS the audit log.

---

## 7. Admin Panel — Technical Implementation Notes

### 7.1 Authentication

```
  Admin visits /admin
         │
         ▼
  Is there a valid session?
         │
         ├── NO  → Redirect to GitHub OAuth flow
         │         (GitHub App or OAuth App, scope: repo access)
         │         User authenticates with GitHub
         │         Callback validates the user is the repo owner
         │         Session created (HTTP-only cookie, 7-day expiry)
         │         Redirect to /admin dashboard
         │
         └── YES → Load dashboard
```

| Decision | Detail |
|---|---|
| **Auth provider** | GitHub OAuth. The admin already has a GitHub account (they push to the repo). No new credentials to manage. |
| **Who can log in** | Only the GitHub account that owns the repo. Hardcoded in an environment variable (`ADMIN_GITHUB_ID`). Any other GitHub user is rejected. |
| **Session** | HTTP-only, secure, SameSite cookie. 7-day expiry. No refresh tokens needed for a single-user system. |
| **No password** | There is no Stackless-specific password. Auth is delegated entirely to GitHub. |

### 7.2 Data Layer

The admin panel does NOT have its own database. It reads from and writes to the GitHub repository via the GitHub API.

```
  Admin Panel (browser)
         │
         ▼
  Next.js API Routes (/api/admin/*)
         │
         ├── GET  /api/admin/posts     → GitHub API: read all .mdx files, parse frontmatter
         ├── GET  /api/admin/posts/:slug  → GitHub API: read one .mdx file, parse frontmatter
         ├── PUT  /api/admin/posts/:slug  → GitHub API: update frontmatter in .mdx file, commit
         ├── GET  /api/admin/topics    → GitHub API: read topics.json
         ├── PUT  /api/admin/topics    → GitHub API: update topics.json, commit
         ├── GET  /api/admin/paths     → GitHub API: read /content/paths/*.json
         ├── PUT  /api/admin/paths/:slug → GitHub API: update path JSON, commit
         ├── POST /api/admin/deploy    → Vercel Deploy Hook: trigger rebuild
         ├── GET  /api/admin/health    → Read build validation artifact
         └── GET  /api/admin/analytics → Plausible Stats API: fetch metrics
```

**Key principle:** The GitHub repo is the single source of truth. The admin panel is a convenience layer on top of Git — it never stores any data independently. If the admin panel disappears, the entire site and all content remains intact in Git.

### 7.3 What This Adds to the Stack

| Addition | Impact |
|---|---|
| **Next.js API routes** (5–8 endpoints) | Runs on Vercel serverless functions. No new infrastructure. Already part of the Next.js deploy. |
| **GitHub OAuth** | One environment variable (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ADMIN_GITHUB_ID`). Standard OAuth flow. |
| **Session cookie** | Handled by a lightweight library (e.g., `iron-session`). No database needed for sessions. |
| **Plausible API key** | One environment variable. Read-only API access. |
| **Admin UI components** | A handful of React components behind the `/admin` route. Not shipped to public-facing pages. Code-split so readers never download admin JS. |

**What this does NOT add:** No database. No additional hosting. No new services. The admin panel is just a few API routes and a protected React page — all running within the existing Next.js deploy.

---

*This document defines everything the admin can do, how they do it, and what safeguards protect against mistakes. The next step is implementation.*
