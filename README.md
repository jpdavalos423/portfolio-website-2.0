# JP Davalos Portfolio 2.0

Personal portfolio site built with Astro, MDX content collections, and React islands for interactive project previews.

## Stack

- Astro 5
- TypeScript
- Tailwind CSS 4 (via Vite plugin)
- MDX content collections
- React 19 islands
- Biome (lint/format)

## Local Setup

### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm

### Install and Run

```bash
pnpm install
pnpm dev
```

Dev server runs at `http://localhost:4321`.

## Scripts

| Command | Purpose |
| :-- | :-- |
| `pnpm dev` | Start local Astro dev server (`NODE_ENV=development`) |
| `pnpm build` | Build static production output to `dist/` |
| `pnpm preview` | Preview the built site locally |
| `pnpm lint` | Run Biome checks across config and `src/` |
| `pnpm format` | Apply Biome formatting |

## Project Layout

```text
src/
  components/      UI components (cards, nav, sections, SEO, islands)
  content/         MDX entries for projects and experience
  layouts/         Shared page layout
  lib/             Collection schemas, sorting, image helpers
  pages/           Route files
public/
  demos/           Poster images + preview media
  resume.pdf
```

## Route Map

- `/` Home (hero, selected work, experience snapshot, contact)
- `/projects` All projects
- `/projects/[slug]` Project detail pages (generated from `src/content/projects/*.mdx`)
- `/experience` Experience hub (featured + recent)
- `/experience/all`, `/experience/industry`, `/experience/research`, `/experience/leadership`
- `/experience/[slug]` Experience detail pages (generated from `src/content/experience/*.mdx`)
- `/contact`

## Content Model

Collections are defined in `src/lib/collections.ts` and exported from `src/content.config.ts`.

### `projects` collection

Each file in `src/content/projects/*.mdx` must include:

| Field | Type | Notes |
| :-- | :-- | :-- |
| `title` | `string` | Required |
| `date` | `string` | `YYYY-MM` or `YYYY-MM-DD` |
| `featured` | `boolean` | Drives home page selection priority |
| `summary` | `string` | Single line only |
| `stack` | `string[]` | At least 1 item |
| `highlights` | `string[]` | Up to 3 items |
| `poster` | `string` | Path in `public/` (e.g. `/demos/posters/foo.webp`) |
| `links` | `{ label, url }[]` | At least 1 valid URL |
| `demoWebm` | `string` | Optional, used for interactive hover preview |
| `demoMp4` | `string` | Optional, used as hover preview fallback |

### `experience` collection

Each file in `src/content/experience/*.mdx` must include:

| Field | Type | Notes |
| :-- | :-- | :-- |
| `role` | `string` | Required |
| `org` | `string` | Required |
| `type` | `industry \| research \| leadership` | Used by category routes |
| `start` | `string` | `YYYY-MM` |
| `end` | `string` | `YYYY-MM`, required when `present` is not `true` |
| `present` | `boolean` | Set `true` for current roles, then omit `end` |
| `featured` | `boolean` | Used by `/experience` featured section |
| `stack` | `string[]` | At least 1 item |
| `highlights` | `string[]` | At least 1 item |
| `links` | `{ label, url }[]` | Optional |

Validation rule: each entry must provide exactly one of `end` or `present: true`.

### Slugs and Sorting

- Slugs are derived from MDX filenames.
- Projects are sorted newest-first by `date`.
- Experience is sorted newest-first by `start`.

### Media Conventions for Project Cards

For each `poster` image, add responsive variants in `public/demos/posters/`:

- `name-640.webp`
- `name-960.webp`
- `name-1280.webp`
- `name.webp` (full-size source)

Also register the base poster dimensions in `src/lib/posterImages.ts` so generated `srcset` metadata has correct width/height.

## Deploy

This repo currently uses Astro’s default static output (no SSR adapter). Deploy as a static site from `dist/`.

### Pre-deploy checks

```bash
pnpm lint
pnpm build
pnpm preview
```

### Host Settings (Vercel / Netlify / Cloudflare Pages / similar)

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 20+

No runtime environment variables are required by the current codebase.
