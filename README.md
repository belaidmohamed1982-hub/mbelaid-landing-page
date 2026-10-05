# mbelaid consulting - landing page

Static bilingual (EN/FR) landing page for mbelaid consulting: https://mbelaid.com

- Plain HTML / CSS / JavaScript, no build step.
- Texts live in `js/i18n.js` (EN and FR dictionaries).
- Fonts (Inter, Plus Jakarta Sans) are self-hosted in `assets/fonts`.
- Contact form opens WhatsApp with a prefilled message (no backend).
- Hosted on Vercel; DNS at Namecheap.

## Run locally

```
python -m http.server 8765
```

Then open http://localhost:8765

## Deploy

```
vercel deploy --prod
```
