# Clearbid — Commercial Contracts (frontend prototype)

A frontend-only prototype for discovering, qualifying and tracking **commercial (private-sector) contract opportunities**.
There is no backend, database or authentication. Seeded opportunities are **real public solicitations** verified on each buyer's source page on 2026-10-13 (a snapshot, not a live feed).

## Run

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /dashboard
npm run build && npm start
```

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react

## What's here

| Route | Purpose |
| --- | --- |
| `/dashboard` | KPIs, pipeline overview, upcoming deadlines, recommended opportunities, recent activity |
| `/commercial-opportunities` | Searchable/filterable table (cards on mobile), add/edit/delete contracts |
| `/commercial-opportunities/[id]` | Detail page with Overview, Requirements (checklist), Documents, Activity tabs |
| `/pipeline` | Kanban board with drag-and-drop and a per-card "Move to stage" menu |
| `/companies` | Buyer companies with a detail slide-over |
| `/documents` | Searchable placeholder document library |
| `/settings` | Theme preference and workspace reset |

## Data & persistence

- Seed data lives in `data/` (`commercial-contracts.ts`, `companies.ts`, `documents.ts`, `activity.ts`).
  - 19 real open RFPs/IFBs from hospitals, housing authorities, transit/airport/port authorities, associations and nonprofits.
  - Each has the buyer's source URL; documents link to the buyer-hosted solicitation PDFs.
  - Values are shown only where the buyer states them ("Not disclosed" otherwise).
  - Pipeline `status`, `fitScore` and checklist progress are example tracking data, not buyer information.
  - To refresh: re-verify each source page, then update `deadline`/`RETRIEVED_AT` (expired solicitations should be removed).
- User changes (added contracts, edits, status moves, checklist ticks, activity) are stored in `localStorage`
  under `clearbid.workspace.v1` via a small `useSyncExternalStore` store in `lib/store.ts`. Settings → Reset workspace clears them.
- Theme defaults to **light** on first load (OS preference is ignored); the header toggle saves the choice to `localStorage`.
- Dashboard KPIs are computed from the data, so they update as contracts are added or moved.
