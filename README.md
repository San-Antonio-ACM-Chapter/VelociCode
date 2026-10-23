# VelociCode

Sites for VelociCode, ACM San Antonio's month-long game jam.

| Domain | What |
|---|---|
| [velocicode.acmsa.org](https://velocicode.acmsa.org) | The current year (2026): landing page, `/guess`, slide decks under `/slides` |
| [2026.velocicode.acmsa.org](https://2026.velocicode.acmsa.org) | The 2026 site's permanent address |
| [hub.velocicode.acmsa.org](https://hub.velocicode.acmsa.org) | The hub: what VelociCode is, with links to every year |

Extracted from [acm-sa-website-v2](https://github.com/San-Antonio-ACM-Chapter/acm-sa-website-v2)
with its history, where it lived at `/velocicode`.

**Starting a new year?** Follow [docs/ROLLOVER.md](docs/ROLLOVER.md).
Agents and new contributors: start with [AGENTS.md](AGENTS.md).

## Development

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm build        # static export to out/
pnpm preview      # build, then serve out/ through wrangler like production
pnpm exec wrangler dev --config hub/wrangler.jsonc   # the hub
```

Event settings (theme reveal, kickoff video, outreach sections, RSVP link,
schedule) live in `src/app/events.ts`. The hub is plain HTML and CSS in
`hub/public/`.

## Deployment

Static sites on Cloudflare Workers, one Worker per year plus one for the
hub. `.github/workflows/ci.yml` lints and builds every PR. Pushes to `main`
deploy the current year and the hub; pushes to `year/<year>` deploy that
archived year. Domains are declared in each `wrangler.jsonc`.

CI needs two repository secrets:

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Workers Scripts: Edit and Account Settings: Read on the ACM San Antonio account; Workers Routes: Edit and Zone: Read on `acmsa.org` |
| `CLOUDFLARE_ACCOUNT_ID` | ACM San Antonio Cloudflare account |
