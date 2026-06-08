# Datu & Co. — Sample Website

A sample e-commerce landing page built for **Datu & Co.** ("Modern Warrior" apparel) as a prospect demo by **RDahunan I.T. Services**.

> Status: **Sample / prospect demo** — not yet a paid project. Built to show the client what their site could look like.

## What it demonstrates
The two features the client asked for in Messenger:
1. **Place an order** — add products to a slide-out cart with size + quantity.
2. **Connect to Facebook for chats** — "Place Order via Messenger" opens Messenger with the full order pre-filled; floating Messenger button + chat CTAs throughout.

## Brand match
Pulled from the client's Facebook/Instagram (`@datuandco`):
- **Name:** Datu & Co. — *Modern Warrior*
- **Slogan:** "Exclusively original. No copies. No shortcuts."
- **Palette:** near-black `#0A0A0B` + antique gold `#C8A24B` + bone/cream
- **Type:** Cinzel (heritage display) + Inter (body)
- **Logo motif:** circular crest with gold trident/shield (recreated as SVG)

## Tech
Plain HTML + CSS + JS — no build step. Mobile-first, full SEO/OG tags, custom SVG favicon.

```
src/
  index.html   # markup + SEO/OG
  styles.css   # black + gold warrior theme, responsive
  script.js    # products, cart, Messenger order flow
vercel.json    # serves /src as static
```

## Run locally
Just open `src/index.html` in a browser, or:
```
npx serve src
```

## Before going live (real project)
- [ ] Set `MESSENGER_URL` in `script.js` to the real page link (currently `m.me/datucobai`)
- [ ] Swap placeholder Unsplash images for real Datu & Co. product photos
- [ ] Replace product names/prices with the real catalog
- [ ] Add real contact number + Instagram link
- [ ] Optional: real checkout (PayMongo) instead of Messenger-only ordering

## Deploy
```
vercel --prod
```
