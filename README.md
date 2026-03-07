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
- RSS, sitemap, robots and OG/Twitter metadata routes

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run db:migrate
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
- Reviewer assignment, submission status changes, revision requests, acceptance and rejection already emit provider-neutral notification events.

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

Run the app:

```bash
npm run dev
```

Production build check:

```bash
npm run build
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
      manifesto/
      reviewer/
      sign-in/
      sign-up/
      submit/
      templates/
      contact/
    api/auth/
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
