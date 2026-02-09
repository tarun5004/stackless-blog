# Stackless — Session Response (Admin CMS & Auth)

## What Was Done

### 1. Auth: GitHub OAuth → Credentials Provider
- **Replaced** `src/lib/auth.ts` — switched from GitHub OAuth to NextAuth Credentials provider
- Admin signs in with `ADMIN_EMAIL` + `ADMIN_PASSWORD` (env vars)
- JWT strategy, 7-day session, no external OAuth dependencies
- **Updated `.env.local`** with `ADMIN_EMAIL=admin@stackless.dev` and `ADMIN_PASSWORD=stackless2025`
- Old GitHub OAuth env vars (`GITHUB_ID`, `GITHUB_SECRET`, `ADMIN_GITHUB_ID`) are no longer used

### 2. Admin Login Page
- **Rewrote** `src/app/admin/login/page.tsx` — email/password form instead of GitHub OAuth button
- Inline error handling (invalid credentials show error message)
- Loading spinner during sign-in
- Clean, minimal design (centered card with branded "S" icon)

### 3. Post CRUD — Create & Edit Pages
- **Created** `src/app/admin/posts/new/page.tsx` — uses PostEditor with `POST` method
- **Created** `src/app/admin/posts/[slug]/page.tsx` — loads post from DB, pre-fills PostEditor with `PUT` method
- PostEditor now automatically sets `published: !draft` on submit

### 4. Post Delete API
- **Added** `deletePost(slug)` function to `src/db/queries/posts.ts`
- **Added** `DELETE` handler to `src/app/api/posts/route.ts` — auth-protected, accepts `{ slug }` body

### 5. AdminPostsList — Full CMS Actions
- **Rewrote** `src/components/admin/AdminPostsList.tsx` with:
  - **"+ New Post"** button linking to `/admin/posts/new`
  - **Edit Post** button → navigates to `/admin/posts/[slug]`
  - **Publish / Unpublish** toggle (calls PUT API)
  - **Set Featured / Remove Featured** toggle
  - **Delete Post** with confirmation dialog
  - **View Live** link (opens in new tab)
  - Inline action status feedback ("Saving...", "Published!", "Deleted!")
  - Empty state with illustration when no posts match filter

### 6. Settings Page
- Updated auth provider label from "GitHub OAuth" to "Credentials (Email + Password)"

---

## Build Status

**Zero TypeScript errors. 25 routes.**

```
Route (app)
├ ƒ /admin/posts/[slug]    ← NEW (edit post)
├ ƒ /admin/posts/new       ← NEW (create post)
└ ... (23 other routes unchanged)
```

---

## How to Use

### Login
1. Go to `/admin/login`
2. Email: `admin@stackless.dev`
3. Password: `stackless2025`

### Create a Post
1. Login → Posts → click **"+ New Post"**
2. Fill in title, slug, summary, topic, content (Markdown)
3. Toggle "Draft" off when ready to publish
4. Click **"Create Post"**

### Edit a Post
1. Login → Posts → click a post → click **"Edit Post"**
2. Modify any field
3. Click **"Update Post"**

### Delete a Post
1. Login → Posts → click a post → click **"Delete Post"**
2. Confirm in the dialog

### Change Admin Credentials
Edit `.env.local`:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
AUTH_SECRET=your-secret-key
```

---

## Files Changed

| File | Action |
|------|--------|
| `src/lib/auth.ts` | Rewritten (Credentials provider) |
| `src/app/admin/login/page.tsx` | Rewritten (email/password form) |
| `src/app/admin/posts/new/page.tsx` | Created |
| `src/app/admin/posts/[slug]/page.tsx` | Created |
| `src/app/api/posts/route.ts` | Modified (added DELETE handler) |
| `src/db/queries/posts.ts` | Modified (added deletePost function) |
| `src/components/admin/AdminPostsList.tsx` | Rewritten (full CMS actions) |
| `src/components/admin/PostEditor.tsx` | Modified (auto-sets published field) |
| `src/app/admin/settings/page.tsx` | Modified (auth provider label) |
| `.env.local` | Modified (new auth env vars) |

---

## Architecture Notes

- **No new dependencies added** — everything uses existing packages
- **Auth is fully self-contained** — no external OAuth, no database for sessions (JWT only)
- **All API mutations are auth-protected** — POST/PUT/DELETE check `auth()` session
- **Middleware** still protects all `/admin/*` routes (no changes needed)
- **Serialization** still works correctly — `.lean()` + `serializeDoc/serializeDocs` in query layer

---

## Recommended Next Steps

1. **Change credentials** — update `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` in `.env.local` before deploying
2. **Topic CRUD** — add create/edit/delete UI for topics (API already supports POST)
3. **Path CRUD** — add create/edit/delete UI for learning paths
4. **Markdown preview** — add live preview pane in PostEditor
5. **Image upload** — integrate cloud storage for OG images
6. **Dark mode** — add theme toggle (gated to v2 per original spec)
