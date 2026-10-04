# DLP Live Map — v7 Final Assets

Generic Disneyland Paris live map / checklist web app.

## Included
- `index.html` — app shell
- `app.js` — catalog, live waits, checklist, map interactions and pinch-to-zoom
- `styles.css` — mobile-first styling
- `waits.json` — fallback/static data file
- `resort-map.png` — existing interactive resort map background used by the app
- `disneyland-park-map.png` — new illustrated Disneyland Park artwork
- `adventure-world-map.png` — new illustrated Disney Adventure World artwork

The two new park artworks are supplied as separate assets so they can be integrated into the interactive map overlay without disrupting the existing coordinate system.

Live wait times use Queue-Times when available; attractions remain visible if live data is unavailable. Completion state is saved locally on the device.
