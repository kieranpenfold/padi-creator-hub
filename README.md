# PADI EMEA Creator Hub (GitHub Pages + Supabase)

A **Netflix-style** private CRM for content creators, photographers, influencers, and celebrities.  
Deployed as a static SPA on **GitHub Pages**, with **Supabase** for database & storage.

> **Passcode model:** The app uses a single **passcode** (`password`) for entry by logging into a dedicated Supabase auth user.  
> Users type the passcode on `/login`, the app signs in with `VITE_CREATOR_HUB_EMAIL` and that passcode.  
> **Row Level Security (RLS)** restricts reads/writes to that one user only.

---

## 0) Prereqs
- A GitHub repo (e.g., `padi-creator-hub`), with **Pages** enabled.
- A **Supabase** project (free tier OK).

---

## 1) Supabase: Create resources

### 1.1 Enable Email/Password Auth
- Dashboard → **Authentication → Providers** → ensure **Email** is enabled.
- Dashboard → **Authentication → Users** → **Add user**
  - Email: `creatorhub@padi.com` (or your choice, must match `VITE_CREATOR_HUB_EMAIL`)
  - Password: **`PADIEMEAcreatorhub`** (or your chosen passcode)
  - Turn on "Auto confirm" or manually confirm the user.
- Open the new user profile, copy the **User ID (UUID)**.

### 1.2 Create tables + RLS
- Dashboard → **SQL Editor** → Run the contents of `supabase/schema.sql`.
- **Edit** the line that inserts `allowed_user_id` with the UUID you copied for your auth user.
- This creates tables: `creators`, `social_links`, `media_assets`, `work_items`, `notes`, `ratings`, and RLS policies that allow access **only** for that one user.

### 1.3 Storage bucket
- Dashboard → **Storage** → New bucket: `creator-media` (leave **private**).
- You can optionally create a `creators/` folder. The app currently uses direct URLs; if you want signed URLs, extend the app accordingly.

### 1.4 (Optional) Seed data
- Dashboard → **SQL Editor** → Run `supabase/seed.sql` to insert a sample creator.

---

## 2) Configure GitHub

### 2.1 Add repository **Secrets**
- Settings → **Secrets and variables → Actions → New repository secret**:
  - `VITE_SUPABASE_URL` → from Supabase project Settings → Project URL
  - `VITE_SUPABASE_ANON_KEY` → from Supabase project Settings → API → `anon` public key
  - `VITE_CREATOR_HUB_EMAIL` → e.g. `creatorhub@padi.com`

> We do *not* store the passcode in the repo. Users will type it on `/login`.

### 2.2 Pages via GitHub Actions
- Ensure `/.github/workflows/deploy.yml` exists (included).
- Push to `main`. The Action will:
  - set `BASE_PATH=/<repo-name>/` for Vite
  - build the SPA
  - publish to **gh-pages** and attach to Pages

### 2.3 Pages Settings
- Repo → **Settings → Pages** → set **Source = GitHub Actions**.
- After the first successful run, your app should be live at:  
  `https://<your-username>.github.io/<repo-name>/`

---

## 3) Local development
```bash
# 1) Clone repo
npm ci

# 2) Create .env.local with your Supabase values
cp .env.example .env.local
# Fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CREATOR_HUB_EMAIL

# 3) Run
npm run dev
# App will open at http://localhost:5173
# Login passcode = the Supabase user password you chose (e.g., PADIEMEAcreatorhub)
```

---

## 4) How the passcode works
- The passcode **is the Supabase auth password** for the dedicated user (email = `VITE_CREATOR_HUB_EMAIL`).
- RLS policies restrict all table access to **only** that user’s `auth.uid()`.
- Anyone without the passcode cannot sign in, so they cannot query or mutate data.

> For production-grade security, add GitHub SSO or individual user accounts later.

---

## 5) Feature overview
- Netflix-like **grid** of creators with search.
- **Creator detail**: description, socials, media (link thumbnails), previous work, notes.
- **Star ratings** (1–5, half stars): per-rater, average shown.
- **Create/Edit** Creator with categories/tags (comma lists).
- **Work items**: campaign, status, dates, links.
- **Notes**: timestamped, per-creator.
- **Social links**: per-creator.

> Media uploads: This starter links images/videos by URL. To use Supabase file uploads + signed URLs, add an uploader using `supabase.storage.from('creator-media').upload(...)` and store returned paths in `media_assets.url`.

---

## 6) GDPR/PII
- The DB includes contact info fields. Store only what you need, and document consent.  
- Add per-creator export/delete flows if required by your policies.

---

## 7) Customize
- Tailwind styles in `src/index.css`.
- Card layout in `src/components/CreatorCard.tsx` and pages in `src/pages/*`.

---

## 8) Troubleshooting
- **Login fails**: Confirm Email/Password is enabled and the user exists/confirmed. Verify passcode matches.
- **RLS errors**: Ensure `allowed_user_id` in `app_config` matches the auth user UUID.
- **Pages 404**: We use HashRouter and include `404.html`. Ensure Actions deployed successfully.
- **Assets not loading on Pages**: Check the `BASE_PATH` step in the workflow. It should be `/<repo-name>/`.

---

## License
MIT

