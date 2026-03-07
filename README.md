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

Default seeded test accounts:

- `contributor@fuckjournal.local` / `Phase1User123!`
- `editor@fuckjournal.local` / `Phase1Editor123!`

Optional overrides:

- `SEED_TEST_USER_EMAIL`
- `SEED_TEST_USER_PASSWORD`
- `SEED_TEST_EDITOR_EMAIL`
- `SEED_TEST_EDITOR_PASSWORD`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Suggested local workflow:

```bash
npm install
cp .env.example .env.local
npm run db:generate
npm run db:migrate
npm run db:seed
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
      sign-in/
      sign-up/
      submit/
      contact/
    api/auth/
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
