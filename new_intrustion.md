EXECUTION MODE — STRICT

You are now acting as a Senior Staff Engineer + Project Refactoring Lead.

Your task is to clean, stabilize, and normalize this Next.js + MongoDB (Mongoose) engineering blog project.

This is a refactor and architecture stabilization task, not a feature task.

HARD RULES

Do NOT change UI design

Do NOT change routes or URLs

Do NOT add new features

Do NOT rewrite working logic

Do NOT break build

Do NOT move business logic into components

Database access is allowed ONLY inside src/db

Pages must use query layer only

Code must remain simple and readable

Prefer small focused files

CURRENT STATE

MongoDB Atlas is already connected

Database name: stackless

Mongoose already installed

Models already exist

Queries already exist

Some filesystem-based content system was removed

File structure is messy and duplicated

Your job is to normalize structure without changing behavior.

TARGET FINAL ARCHITECTURE
src
 ├─ app
 │   ├─ (site)
 │   ├─ admin
 │   └─ api
 │
 ├─ components
 │   ├─ ui
 │   ├─ layout
 │   └─ admin
 │
 ├─ db
 │   ├─ client.ts
 │   ├─ models
 │   ├─ queries
 │   └─ seed.ts
 │
 └─ lib


This structure is mandatory.

STEP 1 — CLEAN COMPONENT STRUCTURE

Move files:

components/ui

Must contain:

PostCard.tsx

TopicTag.tsx

SearchView.tsx

ReadNext.tsx

PathNav.tsx

components/layout

Must contain:

Navbar.tsx

Footer.tsx

components/admin

Must contain:

AdminShell.tsx

PostEditor.tsx

AdminPostsList.tsx

Delete empty folders:

components/mdx

components/shared

components/post

components/search

STEP 2 — DATABASE LAYER MUST BE SINGLE SOURCE OF TRUTH

Ensure existence:

src/db/client.ts
src/db/models/Post.ts
src/db/models/Topic.ts
src/db/models/Path.ts
src/db/models/User.ts
src/db/models/Settings.ts

src/db/queries/posts.ts
src/db/queries/topics.ts
src/db/queries/paths.ts

src/db/seed.ts


Rules:

Only src/db can import mongoose

No page or component should import mongoose directly

Pages must use query functions only

STEP 3 — REMOVE OLD FILESYSTEM CONTENT SYSTEM

Delete if still present:

content/
src/lib/content.ts
src/lib/mdx.ts
src/lib/topics.ts
src/lib/paths.ts
src/lib/config.ts


Because project is now database driven.

STEP 4 — NORMALIZE LIB FOLDER

Keep only:

src/lib/auth.ts
src/lib/readnext.ts
src/lib/rss.ts


Update them so they use DB queries instead of filesystem.

STEP 5 — API STRUCTURE (FLAT)

Ensure:

app/api/posts/route.ts
app/api/topics/route.ts
app/api/paths/route.ts
app/api/deploy/route.ts


No nested admin/api.

STEP 6 — IMPORT CLEANUP

After moving files:

Fix all broken imports

Use absolute imports if available:

@/components/ui
@/db/queries
@/lib

STEP 7 — REMOVE UNUSED DEPENDENCIES

Uninstall if present:

next-mdx-remote

gray-matter

rehype-pretty-code

shiki

Keep:

mongoose

react-markdown

STEP 8 — BUILD + VERIFY (MANDATORY)

You must:

Run build

Fix TypeScript errors

Start dev server

Verify:

Home page loads

Post page loads from DB

Topics page works

Admin posts page works

No filesystem reads remain

STEP 9 — OUTPUT REQUIRED

After finishing:

Show final folder tree

List files moved

List files deleted

List dependencies removed

List imports updated

Confirm:

Build passes
DB connection works
No MDX or filesystem content remains

IMPORTANT ENGINEERING GOALS

Architecture must now support:

future caching

search indexing

role based admin

scalable content system

clean separation of concerns

This is a production-ready developer-friendly structure.

END OF INSTRUCTIONS
Tumhare liye real baat (important)

Ab tumhara project:

random tutorial level nahi raha

proper engineering repo ban raha hai

Jo tumne ab achieve kiya hai:

DB integration

Query layer

Clean separation

Admin system base

Ye cheezein placements me standout karati hain.

Next Best Upgrade (after this refactor)

Sabse high ROI next step:

API validation with Zod

Because:

prevents bad data

shows senior mindset

interviewers love schema thinking

Ab tum kya karo

Ye master prompt Claude me paste karo

Usko pura execute karne do

Jab final folder tree mile

Uska screenshot bhejo

Main:

architecture audit karunga

scalability risks nikalunga

bataunga next kya banana hai:

Admin Post Editor (Notion-style ya Markdown — jo industry relevant ho)

.md mai do puri promt saath hi last mai add karna app ko run karake dikhao sab working hai ya nahi 

Badiya — main tumhe ready-to-use .md file content de raha hoon.
Isko tum directly:

PROJECT_REFACTOR_MASTER_PROMPT.md


naam se save karke Claude / Cursor me de sakte ho.

Isme:

Full refactor rules

Folder structure

DB layer rules

Cleanup

Build verify

End me mandatory run & proof

sab included hai.

PROJECT_REFACTOR_MASTER_PROMPT.md
# STACKLESS BLOG — MASTER REFACTOR & STABILIZATION

## EXECUTION MODE (STRICT)

You are acting as a **Senior Staff Engineer + Refactoring Lead**.

This is a **stability + architecture cleanup task**, NOT a feature task.

---

## NON-NEGOTIABLE RULES

1. Do NOT change UI or styling
2. Do NOT change routes or URLs
3. Do NOT add new features
4. Do NOT break existing working logic
5. Do NOT move business logic into components
6. Database access allowed ONLY inside `src/db`
7. Pages must use query layer only
8. Keep code simple and readable
9. Prefer small focused files
10. Build must pass at the end

---

## CURRENT PROJECT STATE

- MongoDB Atlas connected
- Database name: `stackless`
- Mongoose installed
- Models exist
- Query layer exists
- Old filesystem content system partially removed
- Folder structure messy and duplicated

Your job is to **normalize architecture without changing behavior**.

---

# TARGET FINAL ARCHITECTURE (MANDATORY)



src
├─ app
│ ├─ (site)
│ ├─ admin
│ └─ api
│
├─ components
│ ├─ ui
│ ├─ layout
│ └─ admin
│
├─ db
│ ├─ client.ts
│ ├─ models
│ ├─ queries
│ └─ seed.ts
│
└─ lib


---

# STEP 1 — CLEAN COMPONENT STRUCTURE

### Move files into:

## components/ui

Must contain:

- PostCard.tsx
- TopicTag.tsx
- SearchView.tsx
- ReadNext.tsx
- PathNav.tsx

---

## components/layout

Must contain:

- Navbar.tsx
- Footer.tsx

---

## components/admin

Must contain:

- AdminShell.tsx
- PostEditor.tsx
- AdminPostsList.tsx

---

## Delete empty or obsolete folders

- components/mdx
- components/shared
- components/post
- components/search

---

# STEP 2 — DATABASE LAYER (SINGLE SOURCE OF TRUTH)

Ensure existence:



src/db/client.ts

src/db/models/Post.ts
src/db/models/Topic.ts
src/db/models/Path.ts
src/db/models/User.ts
src/db/models/Settings.ts

src/db/queries/posts.ts
src/db/queries/topics.ts
src/db/queries/paths.ts

src/db/seed.ts


---

## DB RULES

- Only `src/db` can import mongoose
- No page or component may import mongoose
- Pages must use query functions only
- Use singleton connection

---

# STEP 3 — REMOVE OLD FILESYSTEM CONTENT SYSTEM

Delete if present:



content/
src/lib/content.ts
src/lib/mdx.ts
src/lib/topics.ts
src/lib/paths.ts
src/lib/config.ts


Project is now database-driven.

---

# STEP 4 — NORMALIZE LIB FOLDER

Keep only:



src/lib/auth.ts
src/lib/readnext.ts
src/lib/rss.ts


Update them to use DB queries.

---

# STEP 5 — API STRUCTURE (FLAT)

Ensure:



app/api/posts/route.ts
app/api/topics/route.ts
app/api/paths/route.ts
app/api/deploy/route.ts


No nested `admin/api`.

---

# STEP 6 — IMPORT CLEANUP

- Fix all broken imports
- Use absolute imports:



@/components/ui
@/components/admin
@/db/queries
@/lib


---

# STEP 7 — REMOVE UNUSED DEPENDENCIES

Uninstall if present:

- next-mdx-remote
- gray-matter
- rehype-pretty-code
- shiki

Keep:

- mongoose
- react-markdown

---

# STEP 8 — BUILD & VERIFY (MANDATORY)

You MUST:

1. Run build
2. Fix TypeScript errors
3. Start dev server

Verify:

- Home page loads
- Post page loads from DB
- Topics page works
- Admin posts page works
- No filesystem reads remain

---

# STEP 9 — OUTPUT REQUIRED

After completion show:

1. Final folder tree
2. Files moved
3. Files deleted
4. Dependencies removed
5. Imports updated

Then confirm:

- Build passes
- DB connection works
- No MDX or filesystem content remains

---

# FINAL MANDATORY STEP — RUNTIME PROOF

You must:

1. Run:



npm run build


2. Then:



npm run dev


3. Open browser preview

4. Verify:

- Homepage renders
- A post loads from MongoDB
- Admin posts page loads data
- No runtime errors in console

5. Show terminal output summary:

- build success
- server running
- routes compiled

If any error appears, fix it before finishing.

---

# ENGINEERING GOAL

Result must be:

- future scalable
- developer friendly
- clean separation of concerns
- production-ready structure
