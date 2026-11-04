# Natasha 2027 Support Poster Platform

A complete responsive campaign support site adapted from the supplied reference. It includes:

- Responsive home page using the supplied campaign photography
- Browser-based poster generator with upload, drag, zoom, rotate and reset controls
- High-resolution 2000 × 2000 JPG downloads based on the supplied poster template
- Success/download/share flow
- Supporter gallery with LGA filters and poster previews
- Live local statistics across all five Kogi Central LGAs
- Mobile navigation and Vercel/Netlify SPA routing support

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Privacy

Uploaded supporter photos are processed entirely in the browser with the Canvas API. They are not sent to a server. Generated poster thumbnails and statistics are stored only in the visitor's browser using `localStorage`.
