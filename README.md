# AADHIRAI INNOVATIONS Website

Production-ready enterprise website built with React, Vite, Tailwind CSS, and React Router.

## Stack

- React (Vite)
- Tailwind CSS (via `@tailwindcss/vite`)
- React Router DOM

## Routes

- `/` — Enterprise SaaS company single-page layout
- `/founder` — Founder’s Note page

## Development

- Install: `npm install`
- Run frontend dev server: `npm run dev`
- Run backend enquiry API: `npm run server`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Backend & Email

This is a split deployment: the marketing site (this repo's frontend) is hosted on Vercel, and
`server.js` (Express) runs on a separate self-hosted server at `support.aadhiraiinnovations.com`.
`vercel.json` rewrites all `/api/*` requests there — there are no Vercel serverless functions in
this repo (an `api/` directory with files would shadow that rewrite; don't add one).

SMTP and notification-recipient settings (enquiry, tickets, licenses, etc.) are configured through
the Admin panel's Settings page, stored in the database — not environment variables — and read via
`server/settings.js`. To run the backend locally: `npm run server` (needs `DATABASE_URL` and
`JWT_SECRET` in `.env`; see `.env.example`). In local dev, Vite proxies `/api/*` to
`http://localhost:8787`.

## Content Notes

- Tone and messaging are enterprise-focused and non-hype.
- No fake statistics, testimonials, or partner logos are included.
- Founder portrait is intentionally a professional placeholder block and can be replaced with a real image later.
