# DLP Live Ride Tracker

A mobile-first Disneyland Paris checklist + live wait-time map.

## What it does
- Live wait times for **Disneyland Park (Queue-Times park 4)** and **Disney Adventure World (Queue-Times park 28)**
- Map view with color-coded live wait pins
- List view sorted alphabetically
- Checklist view with persistent completion checkmarks
- Park, status, and search filters
- Completion stored in browser localStorage
- Auto-refresh every 5 minutes
- Responsive/mobile-first UI
- Queue-Times attribution as required by its API terms

## Run it
The simplest option is to host the folder as a static site.

### Local
Because browsers can restrict cross-origin requests from `file://`, use a tiny local server:

Python:
```bash
python3 -m http.server 8080
```

Then open:
http://localhost:8080

### Deploy
This folder can be deployed directly to:
- GitHub Pages
- Netlify
- Vercel static hosting
- Cloudflare Pages

No build step is required.

## Live data
The app uses:
- https://queue-times.com/parks/4/queue_times.json
- https://queue-times.com/parks/28/queue_times.json

Queue-Times states that its real-time API is updated every 5 minutes and requires prominent "Powered by Queue-Times.com" attribution.

## Important production note
The map coordinates are a curated/approximate coordinate layer so that every live attraction can be shown on the map. Queue-Times' live API provides the ride status/wait information but its documented queue-time response does not provide a coordinate for each ride.

If you want a production-grade version, replace `COORDS` / `LAND_FALLBACK` in `app.js` with a maintained attraction-coordinate dataset or a first-party/licensed map data source.

## Suggested next upgrades
1. Add "My Trip" dates and separate checklists for each day.
2. Add wait-time history sparklines.
3. Add "under X minutes" quick filter.
4. Add walking-route links.
5. Add a "next best ride" recommendation based only on the user's selected checklist and current wait.
6. Add PWA/offline shell and install-to-home-screen support.
7. Add optional cloud sync/login.
