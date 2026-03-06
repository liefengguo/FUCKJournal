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
- Production-ready static rendering
- RSS, sitemap, robots and OG/Twitter metadata routes

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
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
src/
  app/
    [locale]/
      articles/
      about/
      community/
      manifesto/
      submit/
      contact/
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

## Deployment

This project builds cleanly with `npm run build` and is ready for production deployment.
