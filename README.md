# F.U.C.K Journal

F.U.C.K = Foundations of Uncertainty, Complexity, and Knowledge

A bilingual journal platform for serious papers, observations, and original viewpoints. The public site is editorial and manuscript-first; the private platform covers contributor submission, reviewer workflow, editorial decisions, publication preparation, and export handoff.

## Positioning

F.U.C.K Journal is built around a simple idea: good work should be easier to read seriously and easier to publish fairly. The platform is designed to keep manuscripts formal and legible, while making workflow rules, publication stages, and editorial boundaries easier to inspect.

Core editorial commitments:

- ideas matter more than titles
- papers should not need to feel distant or elitist
- stories, observations, and original viewpoints can deserve serious treatment
- fairness should come from transparent rules rather than administrator discretion
- governance should stay open to criticism and revision

## Product Surfaces

- Public site: homepage, archive, manuscript-first published paper view, manifesto, protocol, governance, templates, about, community
- Contributor workspace: create submission record, upload review-ready PDF, track editorial decisions
- Reviewer desk: access assigned manuscripts only, submit structured review recommendations
- Editorial desk: screen submissions, assign reviewers, update statuses, prepare publications
- Publication workspace: publication metadata, issue placement, audit trail, markdown/json export

## Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Prisma + PostgreSQL
- Auth.js credentials authentication
- `next-intl` for `/en` and `/zh`
- Local or Vercel Blob manuscript storage
- PDF-first submission workflow
- Playwright for end-to-end workflow coverage

## Local Quick Start

```bash
cd ~/Work/FUCK
cp .env.example .env.local
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open:

- [http://127.0.0.1:3000/zh](http://127.0.0.1:3000/zh)
- [http://127.0.0.1:3000/en](http://127.0.0.1:3000/en)

Default seeded accounts:

- Contributor: `contributor@fuckjournal.local` / `Phase1User123!`
- Reviewer: `reviewer@fuckjournal.local` / `Phase3Reviewer123!`
- Editor: `editor@fuckjournal.local` / `Phase1Editor123!`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run test:e2e
```

## Environment Variables

See [`.env.example`](/Users/guoliefeng/Work/FUCK/.env.example) for the full annotated template.

Required in all deployed environments:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `STORAGE_PROVIDER`
- `NOTIFICATION_PROVIDER`

Recommended production defaults:

- `STORAGE_PROVIDER=vercel-blob` on Vercel
- `NOTIFICATION_PROVIDER=mock` until a real provider is wired in
- `MAX_MANUSCRIPT_PDF_BYTES=26214400`

Optional operational controls:

- `AUTH_RATE_LIMIT_WINDOW_MS`
- `AUTH_LOGIN_RATE_LIMIT_MAX`
- `AUTH_REGISTER_RATE_LIMIT_MAX`
- `UPLOAD_RATE_LIMIT_WINDOW_MS`
- `UPLOAD_RATE_LIMIT_MAX`
- `MAX_AUTH_JSON_BYTES`
- `ENABLE_PUBLICATION_DOWNLOADS`
- `LOCAL_STORAGE_DIR`
- `BLOB_READ_WRITE_TOKEN`
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`
- `SEED_TEST_*`
- `SEED_ADMIN_*`

Legacy/internal compatibility variables still present in the codebase:

- `MAX_SOURCE_ARCHIVE_BYTES`

The author-facing workflow is PDF-first, but this variable is still documented because existing storage and validation layers retain compatibility hooks that should not be silently removed.

## Preview vs Production

Preview deployments:

- set `NEXTAUTH_URL` to the exact preview URL
- set `NEXT_PUBLIC_SITE_URL` to the exact preview URL
- keep `NOTIFICATION_PROVIDER=mock`
- use a non-production database
- prefer `STORAGE_PROVIDER=vercel-blob` if the preview must preserve uploaded files across redeploys

Production deployments:

- set `NEXTAUTH_URL` to the canonical production origin
- set `NEXT_PUBLIC_SITE_URL` to the canonical production origin
- use a production PostgreSQL database
- use persistent storage
- run `npm run db:deploy` before or during the release
- verify seeded staff accounts or create real staff accounts before editorial use
- leave `ENABLE_PUBLICATION_DOWNLOADS` unset unless public manuscript downloads are explicitly approved

## Workflow Summary

Current journal workflow:

1. Contributor creates a submission record.
2. Contributor fills metadata and uploads a review-ready PDF.
3. Contributor submits the manuscript into editorial screening.
4. Editor screens scope/readiness and assigns reviewers.
5. Reviewer submits a recommendation.
6. Editor requests revision, rejects, or accepts.
7. Accepted manuscript moves into publication preparation.
8. Editor exports publication markdown/json and optionally marks the record publication-ready or published.

The platform deliberately keeps:

- author manuscript delivery inside the uploaded PDF
- reviewer access scoped only to assigned manuscripts
- editorial state transitions explicit
- publication audit events inspectable

## End-to-End Testing

Minimal Playwright coverage lives in [tests/e2e/journal-workflow.spec.ts](/Users/guoliefeng/Work/FUCK/tests/e2e/journal-workflow.spec.ts).

It covers:

1. sign up
2. sign in
3. contributor submission creation
4. manuscript PDF upload and final submission
5. editor reviewer assignment
6. reviewer review submission
7. editor acceptance
8. publication markdown/json export

Fixture manuscript:

- [tests/fixtures/launch-review-manuscript.pdf](/Users/guoliefeng/Work/FUCK/tests/fixtures/launch-review-manuscript.pdf)

Run locally:

```bash
npm run test:e2e
```

By default, Playwright will:

- seed default accounts
- build the app
- start a production server
- run the workflow in Chromium

If you already have port `3000` occupied, run on another port:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npm run test:e2e
```

## Deployment Readiness

### Vercel Checklist

1. Create the Vercel project from this repository.
2. Provision a PostgreSQL database.
3. Decide on storage:
   - `vercel-blob` for Vercel-hosted persistent manuscript files
   - `local` only for non-Vercel or disposable environments
4. Add required environment variables in Vercel.
5. Confirm `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` match the deployment URL.
6. Run production migrations with `npm run db:deploy`.
7. Seed baseline staff accounts with `npm run db:seed` if needed.
8. Deploy the application.
9. Run the smoke test checklist below before announcing the release.

### Production Database Migration

Before first release:

```bash
npm install
npm run db:generate
npm run db:deploy
```

If this is a new environment and you need seeded test staff:

```bash
npm run db:seed
```

Do not use `prisma migrate dev` against production.

### Storage Provider Notes

`STORAGE_PROVIDER=local`

- stores files under `LOCAL_STORAGE_DIR`
- useful for local development or temporary environments
- not appropriate for Vercel production because filesystem writes are not durable across deployments

`STORAGE_PROVIDER=vercel-blob`

- requires `BLOB_READ_WRITE_TOKEN`
- preferred for Vercel preview and production
- keeps uploaded manuscript files durable across redeploys
- set `ENABLE_PUBLICATION_DOWNLOADS=1` only if the public manuscript download route is intentionally enabled

### Notification Provider Notes

`NOTIFICATION_PROVIDER=mock`

- logs workflow events in a provider-neutral format
- recommended for development, preview, and initial production bring-up

`NOTIFICATION_PROVIDER=disabled`

- suppresses dispatch while keeping workflow logic intact

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`

- optional override for environments where Playwright cannot locate Chromium automatically
- not required for normal application startup

Current workflow events include reviewer assignment changes, review submission, editorial status transitions, and publication updates.

### Post-Deploy Smoke Test

Run these checks after deployment:

1. Public routes load:
   - `/en`
   - `/zh`
   - `/en/manifesto`
   - `/en/protocol`
   - `/en/governance`
   - `/en/articles`
2. Authentication works:
   - sign up
   - sign in
3. Contributor workflow works:
   - create submission
   - upload manuscript PDF
   - submit manuscript
4. Editorial workflow works:
   - assign reviewer
   - update status to `UNDER_REVIEW`
   - update status to `ACCEPTED`
5. Reviewer workflow works:
   - assigned reviewer can open the manuscript
   - assigned reviewer can submit a recommendation
6. Publication workflow works:
   - editor can open publication workspace
   - markdown export returns `200`
   - json export returns `200`
7. Public archive still renders published papers correctly.

## Project Structure

```text
prisma/
  schema.prisma
  migrations/
src/
  app/
    [locale]/
      about/
      articles/
      community/
      contact/
      dashboard/
      editor/
      governance/
      manifesto/
      protocol/
      reviewer/
      sign-in/
      sign-up/
      submit/
      templates/
    api/
      auth/
      editor/
      publications/
      submissions/
  components/
  i18n/
  lib/
  messages/
tests/
  e2e/
  fixtures/
public/
```

## Current Readiness Standard

A release is considered ready when all of the following are true:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`
- production environment variables are set
- migrations have been deployed
- smoke tests pass on the target deployment
