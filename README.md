# DLP Live Map v4

Mobile-first Disneyland Paris checklist + schematic map for Oct 16–18, 2026.

## What changed
- Replaced Leaflet/OpenStreetMap with a lightweight, hard-coded SVG resort map.
- Every attraction/experience is retained even when live wait data is missing.
- The map marker itself acts as a completion checkbox: tap it to mark complete.
- Completed markers turn green with a ✓.
- Every land shows `completed / total` and a visual green completion overlay.
- List and Checklist stay synchronized with the map.
- Filters: day, park, experience type, live/completed/closed state, search.
- Added current 2026 Disneyland Park + Disney Adventure World attraction catalog, including World of Frozen, Adventure Way and current closed items.
- Added shows and character encounters as checklistable experiences.
- Trip tab preserves the user's Oct 16–18 plan.
- No Google Maps, Leaflet, OpenStreetMap tiles, or external map library.

## Queue-Times.com wait feed
Queue-Times.com has Disneyland Paris historical wait-time pages and a park-flow visualization. Its live page blocked automated access during development, and I could not verify a public API endpoint. Therefore this static GitHub Pages build does **not** pretend to scrape Queue-Times.com from the browser.

The app reads same-origin `waits.json` in this shape:

```json
{
  "source": "Queue-Times.com",
  "updated": "2026-10-01T18:30:00Z",
  "waits": {
    "Big Thunder Mountain": {"wait": 45, "is_open": true},
    "Peter Pan's Flight": {"wait": 55, "is_open": true},
    "Crush's Coaster": {"is_open": false}
  }
}
```

A small server-side/proxy job can populate `waits.json` from an authorized Queue-Times.com feed if/when you have access to one. Do not put private API credentials in this GitHub Pages repository.

## Deploy
Replace the files in the existing `joshringler/DLPlivemap` GitHub repository with the contents of this folder. GitHub Pages will serve `index.html` automatically.

## Current official attraction catalog
The catalog was cross-checked against Disneyland Paris's current attractions page during development. The official site currently lists 50 attraction entries, with some separately marked closed, and identifies Disney Adventure World as the second park following the 2026 transformation.
