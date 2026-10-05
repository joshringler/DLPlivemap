# DLP Live Map

Mobile-first Disneyland Paris resort guide with interactive map, checklist, and live attraction waits.

## Map artwork
- `disneyland-park-map.png` — new Disneyland Park artwork
- `adventure-world-map.png` — new Disney Adventure World artwork
- `resort-map.png` — new resort overview composed from the two new park artworks

## Live waits
The browser loads `waits.json` from the same GitHub Pages origin. A GitHub Actions workflow fetches Queue-Times server-side every 5 minutes, avoiding browser CORS problems with the external API. The workflow can also be run manually from **Actions → Update live wait times → Run workflow**.

Queue-Times attribution is displayed in the app. Attractions remain visible when a ride has no live feed.
