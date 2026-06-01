# Panini World Cup 2026 Sticker Tracker

A mobile-first web app to track your Panini FIFA World Cup 2026 sticker collection. Supports multiple users and trade matching.

## Features
- **Quick Entry** — Type sticker codes (e.g., MEX5) to mark as collected
- **Checklist View** — Browse by team, see collected/missing/duplicates at a glance
- **Progress Dashboard** — Track completion percentage
- **Trade Finder** — Compare collections between friends to find swap opportunities

## Tech Stack
- Frontend: Vanilla HTML/CSS/JS (mobile-first)
- Backend: Azure Functions (Node.js)
- Database: Azure Table Storage
- Hosting: Azure Static Web Apps

## Local Development
```bash
npm run dev
```
Opens at http://localhost:3000

## Deployment
Connected to Azure Static Web Apps — auto-deploys on push to `main`.

## Environment Variables (Azure App Settings)
- `AZURE_STORAGE_CONNECTION_STRING` — Connection string for Azure Table Storage
