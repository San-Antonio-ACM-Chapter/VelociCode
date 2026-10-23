# Yearly rollover

How to retire one year's site and launch the next. Written so a new
organizer, or an AI agent, can follow it start to finish. The example uses
2026 → 2027; substitute the real years.

## How the domains work

| Domain | Serves | Worker | Lives on |
|---|---|---|---|
| `velocicode.acmsa.org` | The current year | `velocicode-<current year>` | `main` |
| `<year>.velocicode.acmsa.org` | That year, forever | `velocicode-<year>` | `main` while current, then `year/<year>` |
| `hub.velocicode.acmsa.org` | The hub: what VelociCode is, links to every year | `velocicode-hub` | `hub/` on `main` |

- Each year is its own Worker. Once deployed, an archived year keeps serving
  without ever being rebuilt.
- The current year answers on both the bare domain and its year domain from
  day one. Use the **year domain** for anything that must keep working after
  the year ends: QR codes, slide links, the canonical URL. Use the bare domain
  only for "the current jam" promotion.
- The ACM SA main site (acmsa.org) redirects `/velocicode/*` to
  `velocicode.acmsa.org`, so it always lands on the current year.
- Domains are declared in `wrangler.jsonc` (`routes` with `custom_domain:
  true`). Deploys attach them; nobody adds them in the dashboard.

## Before you start

- [ ] The new year's site is built and reviewed on a branch off `main`.
- [ ] You have push access to this repo. CI holds the Cloudflare token
      (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` repository secrets).
- [ ] Pick a quiet time: the bare domain is down for a few minutes between
      steps 2 and 3.

## 1. Archive the outgoing year

Cut the archive branch from `main` **before** any next-year work merges to
`main`:

```sh
git switch main && git pull
git switch -c year/2026
```

On `year/2026`, edit `wrangler.jsonc` and remove the bare domain, keeping
only the year domain:

```jsonc
"routes": [
  { "pattern": "2026.velocicode.acmsa.org", "custom_domain": true }
],
```

Also delete the `hub/` folder on this branch; the hub deploys only from
`main`. Commit and push:

```sh
git commit -am "chore: archive 2026 at 2026.velocicode.acmsa.org"
git push -u origin year/2026
```

CI deploys `velocicode-2026` with only its year domain. Pushes to `year/*`
branches deploy that year's Worker, so later fixes to an archived year go on
its branch. **Never delete a `year/*` branch.**

## 2. Launch the new year on `main`

In one PR:

- [ ] Replace the site in `src/app/` and `public/` with the 2027 site. The
      2026 code is preserved on `year/2026`.
- [ ] `wrangler.jsonc`: set `"name": "velocicode-2027"` and routes to both
      domains:
      ```jsonc
      "routes": [
        { "pattern": "velocicode.acmsa.org", "custom_domain": true },
        { "pattern": "2027.velocicode.acmsa.org", "custom_domain": true }
      ],
      ```
- [ ] `src/app/layout.tsx` `metadataBase`, the page's `canonical` and
      Open Graph URLs: `https://2027.velocicode.acmsa.org`.
- [ ] QR codes and slide links that should outlive the year use
      `https://2027.velocicode.acmsa.org`.
- [ ] The footer links to `https://hub.velocicode.acmsa.org` ("All
      expeditions"). The 404 page should too, since old bare-domain links
      from previous years land on the new site.
- [ ] Event settings in `src/app/events.ts` (theme, dates, RSVP link).
- [ ] Hub, `hub/public/index.html`:
  - Add a 2027 `<article class="expedition is-latest">` at the top of
    Expeditions, linking to `https://2027.velocicode.acmsa.org/`.
  - Remove `is-latest` from the 2026 article. Its link already points at
    `https://2026.velocicode.acmsa.org/`.
  - Update the "Expedition 0N is hatching" note at the bottom.

Merge right after step 1's deploy finishes. CI deploys `velocicode-2027`
(both domains) and the hub.

## 3. Verify

```sh
for u in velocicode 2027.velocicode 2026.velocicode hub.velocicode; do
  curl -s -o /dev/null -w "%{http_code} https://$u.acmsa.org/\n" "https://$u.acmsa.org/"
done
```

All four should return `200`. Open the bare domain and the hub in a browser
and check that the bare domain shows 2027 and the hub lists 2027 first.

## If a deploy fails

A failed deploy leaves the previous version serving, so nothing goes down.

- **Domain already in use by another Worker:** step 1 didn't deploy, or ran
  after step 2. Deploy `year/<old year>` first (Actions → CI → Run workflow
  on that branch), then re-run `main`. As a last resort, detach the domain
  from the old Worker in the Cloudflare dashboard (Workers → the Worker →
  Settings → Domains & Routes) and re-run.
- **Authentication error:** the token needs Workers Scripts: Edit and
  Account Settings: Read on the ACM San Antonio account, plus Workers
  Routes: Edit and Zone: Read on `acmsa.org`.
