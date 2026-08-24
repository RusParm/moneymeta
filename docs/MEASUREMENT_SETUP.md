# Measurement setup

Updated: 2026-08-24

## What is already active

Money Meta uses one analytics system: Vercel Web Analytics. Page views and Web Vitals are already installed through the official Astro integrations. This release adds anonymous product events without transmitting calculator values or other player-entered numbers.

| Event | Trigger | Properties |
|---|---|---|
| `tool_start` | First changed input in a model during the page visit | model key, path |
| `tool_open` | Explicit route into a calculator | surface, destination |
| `guide_open` | Explicit route into applied analysis | surface, destination |
| `weekly_open` | GTA Online weekly issue opened from Meta | surface, destination |
| `subscription_open` | Update or Telegram CTA clicked | surface, destination |
| `updates_route_open` | Editorial format selected on `/updates/` | surface, destination |

The event contract intentionally excludes bank values, prices, goals, search terms and shared-scenario parameters.

## Google Search Console

The code path is ready, but Google ownership cannot be completed without the property owner's verification token.

1. Create a Domain property for `themoneymeta.com` in Google Search Console.
2. Prefer DNS verification at the domain provider. If the HTML-tag method is used, copy only the token value.
3. Set `PUBLIC_GOOGLE_SITE_VERIFICATION` for Production and Preview in Vercel.
4. Redeploy and confirm the token appears as `<meta name="google-site-verification">`.
5. Submit `https://themoneymeta.com/sitemap.xml`.
6. Do not add GA4 or Plausible in parallel until the first measurement review shows a specific gap Vercel Analytics cannot answer.

## Telegram path

Every page now has a context-aware update block. Until a channel URL is supplied, GTA pages lead to the weekly brief or Launch Watch and other pages lead to `/updates/`; there is no dead or invented handle.

After the channel is created, set `PUBLIC_TELEGRAM_URL` to the complete public URL. The same interface then routes every subscription CTA to Telegram and records `subscription_open` without another source change.

## First review

Review the period ending 2026-09-14. Use decisions, not vanity totals:

- landing pages with impressions but weak clicks: rewrite the title and direct answer;
- pages with visits but few `tool_open` or `tool_start` events: repair the article-to-model handoff;
- tools with starts but weak return paths: add a saved scenario or a recurring reason to revisit;
- GTA weekly visits: compare direct/return traffic with the surrounding GTA Meta page;
- hub sequence: deepen the hub whose focused pages generate the strongest repeat use, while keeping all five on the freshness board.
