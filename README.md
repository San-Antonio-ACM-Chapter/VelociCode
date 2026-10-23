# VelociCode

Site for VelociCode, ACM San Antonio's month-long game jam, at
[velocicode.acmsa.org](https://velocicode.acmsa.org). It includes the landing
page, the `/guess` theme game, and the event slide decks under `/slides`.

Extracted from [acm-sa-website-v2](https://github.com/San-Antonio-ACM-Chapter/acm-sa-website-v2)
with its history, where it lived at `/velocicode`.

## Development

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm build        # static export to out/
pnpm preview      # build, then serve out/ through wrangler like production
```

Event settings (theme reveal, kickoff video, outreach sections, RSVP link,
schedule) live in `src/app/events.ts`.

## Deployment

Next.js static export served by Cloudflare Workers static assets.
`.github/workflows/ci.yml` lints and builds every PR, and deploys on every
push to `main`. It needs two repository secrets:

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy token: Workers Scripts: Edit and Account Settings: Read on the ACM SA account, plus Workers Routes: Edit on its zones |
| `CLOUDFLARE_ACCOUNT_ID` | ACM SA Cloudflare account |

The `velocicode.acmsa.org` custom domain is declared in `wrangler.jsonc`, so
each deploy attaches it to the Worker if it's missing.
