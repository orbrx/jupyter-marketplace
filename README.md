<h1 align="center">
  <a href="https://github.com/orbrx/jupyter-marketplace" target="_blank" rel="noopener noreferrer"><img src="./public/jupyter-marketplace-logo.png" alt="JupyterLab Marketplace logo" height="64" valign="middle"></a>
  <span>JupyterLab Marketplace</span>
</h1>
<p align="center">
  JupyterLab Extensions Catalog • Built by <img src="./public/orbrx.svg" alt="Orange Bricks" height="8" valign="middle"> Orange Bricks
</p>

<p align="center">
  <img src="./public/screenshot.png" alt="Screenshot of the site" width="800" />
</p>

A community-run marketplace for JupyterLab extensions. It surfaces real-world signals from PyPI (via BigQuery) and GitHub—stars, recent updates, and download trends—to make discovery less guessy.

Not affiliated with Project Jupyter. Built by Orange Bricks.

- **Live site:** https://marketplace.orbrx.io/
- **Feedback / issues:** https://github.com/orbrx/jupyter-marketplace/issues/new/choose
- **About:** https://marketplace.orbrx.io/about

## Features

- 🔎 Search across name, summary, description, author
- 🧭 Sorts: New & Rising, Popular This Month, Most Downloaded, Most Stars, Recently Updated, Name (A–Z)
- 🧱 Cards show stars, 30-day & all-time downloads (when available), and "Updated X days ago"
- ♾️ Infinite scroll with stable ordering
- 🐞 Per-card "Report" link → prefilled GitHub issue
- 🪄 Keyboard-friendly UI (focus states, skip to content)

Data is refreshed nightly from a separate ingestion pipeline (PyPI BigQuery + GitHub). This repo is frontend only.

## Status

Community beta. Data may lag or be incomplete.
If a listing looks wrong, please open a Data correction issue (template below).

## Contributing

We welcome issues and PRs!

- **Data correction:** wrong repo mapped, stale stars, bad category, etc.
- **Feature request:** new sort/filter, better accessibility, UI polish
- **Bug report:** crashes, layout issues, API errors

## Issue templates

Open: https://github.com/orbrx/jupyter-marketplace/issues/new/choose

- **Data correction** — package name, what's wrong, suggested fix
- **Feature request** — what you need, why it helps
- **Bug report** — steps to reproduce, URL, screenshots

## Governance & non-affiliation

This is a community project built by Orange Bricks. It is not an official Jupyter property.
Trademarks and logos are the property of their respective owners.

Removal/correction policy: if a listing is inaccurate or you want your package removed, open a Data correction issue with details.

## Privacy

- No accounts or tracking pixels by default.
- If analytics are enabled by a deployer, they must be privacy-respecting and disclosed in /privacy.
- Local preferences (e.g., banner dismissal) are stored in this browser only.

## License

Code in this repository is licensed under Apache-2.0.
Third-party data (PyPI, GitHub) is used under their respective terms.

## Acknowledgements

- Thanks to the Jupyter community and maintainers of the many extensions featured here.
- Hat tip to VS Code Marketplace for inspiration on UX patterns.

## Quick start (local dev)

Prereqs: Node.js 18+, pnpm (or npm/yarn)

```bash
git clone https://github.com/orbrx/jupyter-marketplace.git
cd jupyter-marketplace
pnpm install
cp .env.example .env.local
# Edit env values, then:
pnpm dev
# open http://localhost:3000
```

## Environment variables

The Supabase database is **publicly accessible** for read-only operations. You can use the live database directly for development, or connect to it for data exploration and analysis:

Create `.env.local`:

```bash
# Public Supabase client (read-only access)
NEXT_PUBLIC_SUPABASE_URL=https://mijujdykpaerevemuznw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1panVqZHlrcGFlcmV2ZW11em53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzE1MTQsImV4cCI6MjA3MTIwNzUxNH0.5MuKbZsCEYGCqcRY9RFkwpHc1-o2G8V9ebR6WNrf5m0
```

## How it works (frontend)

- Next.js 15 (App Router) + TypeScript, Tailwind, shadcn/ui
- Reads from a Supabase table/view exposed as a public, read-only API
- All filtering/sorting is executed server-side via Supabase queries
- No accounts; banner dismissal and a few preferences are stored in localStorage

The ingestion/data pipeline (BigQuery + GitHub enrichment + Supabase load) lives in a separate repo and is not part of this codebase.

## Dev notes

- Keep pages small and accessible.
- All new UI should work without JavaScript where reasonable (progressive enhancement).
- Please run `pnpm lint` before opening a PR.

## Accessibility

- Semantic headings and landmarks
- Focus-visible states on all interactive controls
- Keyboard support for search, sorting, and card actions
- If you spot anything we can improve, open an issue—accessibility bugs are prioritized.

## Repo structure (frontend)

```
app/                    # Next.js App Router pages
components/             # UI components (cards, filters, header)
lib/                    # supabase client, helpers
public/                 # static assets
styles/                 # Tailwind styles
```

**Maintainer:** Konstantin Taletskiy • Orange Bricks  
**Questions?** Open an issue: https://github.com/orbrx/jupyter-marketplace/issues/new/choose
