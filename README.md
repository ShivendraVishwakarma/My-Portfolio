# Shivendra Vishwakarma — Portfolio

Personal portfolio built with **React + Vite**, **Tailwind CSS v4**, **GSAP / ScrollTrigger**, **Lenis**, **framer-motion** and **Three.js**.
The design and motion follow [jishnumondal.vercel.app](https://jishnumondal.vercel.app/).

## What moves

| Section | Animation |
| --- | --- |
| Loader | Counter runs 0 → 100 while the bar fills, then the name and counter lift away and the screen slides up |
| Menu | "Dive In" toggle rolls its label, the plus spins into ×, colour layers and the panel slide in, items rise with numbering |
| Hero | WebGL ghost-cursor smoke trail (bloom + grain), variable-font **TextPressure** name, glow and dust parallax, timed intro, fade on scroll |
| Buttons | Magnetic pull toward the cursor with a springy release |
| Philosophy | Scroll-to-expand media: rounded, blurred window opens to full bleed, statement fades up |
| Projects | Per-character title reveal; glass cards rise, copy slides in from the side, screenshots scale up |
| Skills & Profiles | LeetCode / CodeChef / GitHub cards rise in, solved-question counters count up, difficulty bars fill |
| Experience | Hover states (static, as on the reference) |
| Contact | Glass cards rise in with a staggered ease; form with loading / success / error states |
| Global | Lenis smooth scroll, top scroll-progress bar, film-grain noise overlay |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

All copy and links are in [`src/data/profile.js`](src/data/profile.js). Coding-profile numbers (LeetCode, CodeChef, GitHub) are a snapshot in `codingProfiles` — update them there.
Images live in `public/images` (philosophy backdrop, currently a placeholder) and `public/projects` (project covers).

## Contact form

The form sends messages to a hosted contact service when `VITE_CONTACT_ENDPOINT` is set. Formspree is the recommended beginner setup: create a form in Formspree, verify the receiving email address, and copy its form endpoint (for example, `https://formspree.io/f/your-form-id`). The endpoint is public because it is used by the browser; do not put private credentials in a `VITE_` variable.

For local development, copy `.env.example` to `.env.local` and replace the placeholder with your Formspree endpoint:

```bash
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. Restart the Vite dev server after changing environment variables. Vite embeds `VITE_` values in the built frontend, so they are public and must never contain private API keys, passwords, or tokens.

For deployment, add `VITE_CONTACT_ENDPOINT` in the project's environment-variable settings in Vercel or Netlify, using the same Formspree endpoint. Apply it to the production environment (and preview environments if you want contact submissions to work there), then trigger a new deployment. Do not upload `.env.local` to the host or commit it to Git.

If no endpoint is configured, the existing mailto fallback opens the visitor's email app with a prefilled message; the visitor still needs to send it. When an endpoint is configured, success is shown only after the service responds successfully. Failed requests show an error and an **Email Direct** fallback.

### Contact form checks

1. Run `npm run dev`, open the portfolio, and submit a valid test message. Confirm the success state appears and check the receiving inbox (including spam) and the Formspree submission dashboard.
2. Submit with a blank field and with an invalid email address. Browser validation and form validation should prevent sending.
3. To check a service failure, temporarily use an invalid endpoint in `.env.local`, restart Vite, and submit. Confirm an error appears and **Email Direct** remains available. Restore the valid endpoint afterward. A network disconnect can also exercise the network-error message.
4. After deployment, submit another test message on the live site and confirm receipt in the inbox and service dashboard. Confirm the deployment has `VITE_CONTACT_ENDPOINT` set for the environment you are testing.

### Environment files and Git

`.env`, `.env.local`, `.env.*.local`, and any file containing real credentials or private configuration must stay out of GitHub. The repository ignores these files. `.env.example` is safe to commit because it contains only a placeholder; replace the placeholder only in your ignored local `.env.local` and deployment settings. If a real credential was ever committed or exposed, rotate it with the provider.

After reviewing changes with `git diff` and `git status`, stage only the intended files:

```bash
git add src/components/Contact.jsx README.md .gitignore .env.example
```

Then inspect the staged content with `git diff --cached` before committing. Example commands after that review:

```bash
git commit -m "Make portfolio contact form functional"
git push
```

Do not stage environment files or commit secrets.
