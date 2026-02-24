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

## Enquiry Email (Backend)

The contact form submits to backend endpoint `POST /api/enquiry` and sends email using SMTP.

1. Copy `.env.example` to `.env`
2. Fill SMTP values:
	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_USER`
	- `SMTP_PASS`
	- `ENQUIRY_TO_EMAIL` (default: `maniubu3295@gmail.com`)
3. Start backend: `npm run server`
4. Start frontend: `npm run dev`

In local dev, Vite proxies `/api/*` to `http://localhost:8787`.

## Content Notes

- Tone and messaging are enterprise-focused and non-hype.
- No fake statistics, testimonials, or partner logos are included.
- Founder portrait is intentionally a professional placeholder block and can be replaced with a real image later.
