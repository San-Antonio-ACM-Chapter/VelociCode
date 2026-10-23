# VelociCode: notes for agents and new contributors

VelociCode is ACM San Antonio's yearly month-long game jam. This repo holds
the current year's site and the hub that links every year.

## Layout

- `src/app/`, `public/`: the **current year's** site. Next.js static export
  (`output: "export"`). There is no server, so no route handlers, middleware,
  or request-time rendering.
- `src/app/events.ts`: event settings (theme, kickoff video, outreach toggle,
  RSVP link, schedule). Change them here, not through env vars.
- `hub/`: the hub at `hub.velocicode.acmsa.org`. Plain HTML and CSS in
  `hub/public/` with no build step. One `<article>` per year.
- `docs/ROLLOVER.md`: the yearly process for archiving one year and launching
  the next. **Follow it for anything involving years, domains, Worker names,
  or `year/*` branches.**

## Commands

Use pnpm, never npm or yarn.

```sh
pnpm install
pnpm dev       # current-year site at http://localhost:3000
pnpm lint      # Biome; must pass in CI
pnpm build     # static export to out/
pnpm preview   # build, then serve out/ through wrangler like production
pnpm exec wrangler dev --config hub/wrangler.jsonc   # hub locally
```

## Deployment

CI (`.github/workflows/ci.yml`) lints and builds every PR. Pushes deploy to
Cloudflare Workers:

- `main`: the current year's Worker (`wrangler.jsonc`) and the hub
  (`hub/wrangler.jsonc`).
- `year/<year>`: that archived year's Worker only.

Domains are declared in each `wrangler.jsonc` and attached on deploy. Don't
add or move domains in the Cloudflare dashboard, and don't change `name` or
`routes` outside the rollover process.

## Rules

- Never delete a `year/*` branch. It is the only source for that year's site.
- Links meant to outlive the current year (QR codes, slides, canonical URL)
  use the year domain, e.g. `https://2026.velocicode.acmsa.org`.
- Every year's site links to the hub in its footer.
- The ACM SA main site lives in a different repo
  (`San-Antonio-ACM-Chapter/acm-sa-website-v2`) and redirects
  `acmsa.org/velocicode/*` to `velocicode.acmsa.org`.
