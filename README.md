# F.U.C.K Journal

F.U.C.K = Foundations of Universality, Complexity and Knowledge

A bilingual academic journal website built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui-style components, MDX and `next-intl`.

## Stack

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui component patterns
- MDX content from `content/articles`
- `next-intl` i18n with `/en` and `/zh`
- Prisma + PostgreSQL for the submission platform
- Auth.js credentials authentication
- Storage-agnostic manuscript uploads with local and Vercel Blob adapters
- Reviewer workflow, editorial decisions and publication-ready foundation
- Editorial publication queue, publication metadata workspace and export drafts
- Editorial issue planning, publication audit trail and queue search filters
- RSS, sitemap, robots and OG/Twitter metadata routes

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run db:migrate
npm run db:deploy
npm run db:generate
npm run db:seed
```

## Local Development

Create a local env file before using the submission platform:

```bash
cp .env.example .env.local
```

Required values:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `STORAGE_PROVIDER`
- `NOTIFICATION_PROVIDER`

Default seeded test accounts:

- `contributor@fuckjournal.local` / `Phase1User123!`
- `reviewer@fuckjournal.local` / `Phase3Reviewer123!`
- `editor@fuckjournal.local` / `Phase1Editor123!`

Optional overrides:

- `LOCAL_STORAGE_DIR`
- `NOTIFICATION_PROVIDER`
- `MAX_MANUSCRIPT_PDF_BYTES`
- `MAX_SOURCE_ARCHIVE_BYTES`
- `BLOB_READ_WRITE_TOKEN`
- `SEED_TEST_USER_EMAIL`
- `SEED_TEST_USER_PASSWORD`
- `SEED_TEST_REVIEWER_EMAIL`
- `SEED_TEST_REVIEWER_PASSWORD`
- `SEED_TEST_EDITOR_EMAIL`
- `SEED_TEST_EDITOR_PASSWORD`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Storage notes:

- `STORAGE_PROVIDER=local` stores uploaded files under `.uploads/` by default.
- `STORAGE_PROVIDER=vercel-blob` requires `BLOB_READ_WRITE_TOKEN`.
- The upload layer is adapter-based, so the submission flow stays the same if the storage provider changes later.

Notification notes:

- `NOTIFICATION_PROVIDER=mock` logs workflow notifications to the server console.
- Reviewer assignment, reviewer removal, review submission, submission status changes, revision requests, acceptance, rejection and publication workflow updates emit provider-neutral notification events.

Suggested local workflow:

```bash
npm install
cp .env.example .env.local
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Migration and schema workflow:

```bash
npm run db:generate
npm run db:migrate
```

Seed the default test accounts:

```bash
npm run db:seed
```

Seed roles created by default:

- `USER` contributor account
- `REVIEWER` reviewer account
- `EDITOR` editor account

Reviewer workflow notes:

- Editors assign reviewer accounts from the editor submission detail page.
- Reviewers can access only submissions assigned to them.
- Reviewer recommendations do not update submission status directly.
- Editors remain responsible for moving a manuscript to `UNDER_REVIEW`, requesting revision, accepting, rejecting and marking accepted submissions as publication-ready.

Publication workflow notes:

- Accepted submissions appear in `/en/editor/publications` and `/zh/editor/publications`.
- Publication metadata is managed separately from author manuscript editing.
- Markdown and JSON export endpoints prepare internal publication drafts without modifying `content/articles`.
- The public site remains MDX-based and accepted submissions are not exposed automatically.

Editorial operations notes:

- Contributor, reviewer, editorial and publication queues now support search and filtering.
- `/en/editor/issues` and `/zh/editor/issues` group accepted manuscripts by publication year, volume and issue.
- Publication detail pages now show an internal audit trail for metadata updates, publication-ready changes and publish marks.
- Reviewer and anonymous users are redirected away from editorial routes, and callback URLs preserve the concrete target page.

Run the app:

```bash
npm run dev
```

Production build check:

```bash
npm run build
```

Production migration command:

```bash
npm run db:deploy
```

## Content

Articles live under:

```bash
content/articles/<slug>/<locale>.mdx
```

Each article uses frontmatter:

```yaml
title:
author:
date:
tags:
language:
summary:
featured:
```

## Structure

```text
prisma/
  schema.prisma
  migrations/
src/
  app/
    [locale]/
      articles/
      about/
      community/
      dashboard/
      editor/
        issues/
        publications/
      manifesto/
      reviewer/
      sign-in/
      sign-up/
      submit/
      templates/
      contact/
    api/auth/
    api/editor/publications/
    api/submissions/
    rss.xml/
    sitemap.ts
    robots.ts
  components/
  i18n/
  lib/
  messages/
content/
  articles/
public/
```

This project builds cleanly with `npm run build`.

## Deploying To Vercel

1. Provision a PostgreSQL database for production.
2. In Vercel, create a project from this repository.
3. Set production environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL=https://fuckjournal.org`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://fuckjournal.org`
   - `STORAGE_PROVIDER`
   - `NOTIFICATION_PROVIDER`
   - `LOCAL_STORAGE_DIR` if you stay on local disk outside Vercel
   - `BLOB_READ_WRITE_TOKEN` if you use `STORAGE_PROVIDER=vercel-blob`
4. Run production migrations against the target database:

```bash
npm install
npm run db:deploy
```

5. Seed initial staff accounts if needed:

```bash
npm run db:seed
```

6. Trigger a Vercel deployment.
7. Verify:
   - `/en`
   - `/en/sign-in`
   - `/en/editor`
   - `/en/editor/publications`
   - file upload and export endpoints with an editor account

Recommended production setup:

- Use `STORAGE_PROVIDER=vercel-blob` on Vercel so uploaded manuscript files persist across deployments.
- Keep `NOTIFICATION_PROVIDER=mock` until a real email provider is wired in.
- Run `npm run build` locally before shipping to confirm the Prisma client and App Router routes compile cleanly.
