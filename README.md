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

All copy and links are in [`src/data/profile.js`](src/data/profile.js). CodeChef and GitHub numbers remain snapshots there. LeetCode uses validated public data from `public/data/leetcode.json` when available and falls back to the existing values in `codingProfiles`.
Images live in `public/images` (philosophy backdrop, currently a placeholder) and `public/projects` (project covers).

## LeetCode statistics sync

The GitHub Actions workflow in `.github/workflows/update-leetcode.yml` requests public LeetCode statistics once daily at **07:17 UTC**. It also supports a manual run from **Actions → Sync LeetCode public statistics → Run workflow**. Scheduled runs may be delayed by GitHub. Changed JSON is committed by the workflow so a connected Vercel or Netlify deployment can publish it; unchanged data creates no commit.

The updater in `scripts/update-leetcode.mjs` queries LeetCode GraphQL without authentication. It validates the total and Easy, Medium, and Hard counts, then requests calendar data separately for the current and previous year. Calendar data is saved only if both responses contain valid timestamp-to-count maps. Requests have a 15-second timeout. If the counts request fails or is invalid, the updater exits without changing the JSON. If counts are valid but the calendar request fails, counts can still be updated while the previous validated calendar is retained.

### Real calendar versus activity preview

When a real calendar has been fetched and validated, the portfolio displays it with real streak, active-day, and best-day calculations, plus a **Last synced** date. If no valid calendar has been saved, the existing filled heatmap remains as an **Activity preview**. Its deterministic generated squares and derived summary statistics are illustrative and do not represent LeetCode submissions. It is never labeled “live.” A last-known-good real calendar takes priority over the preview if a later calendar sync fails.

At the time this integration was prepared, LeetCode returned public solved counts for this profile but denied anonymous calendar access with `no permission to check the calendar`. The heatmap therefore starts in preview mode until a future sync can retrieve and validate a calendar. The old browser-side Heroku request has been removed; visitors load only this site's JSON.

### Setup, credentials, and troubleshooting

Push the workflow, updater, and `public/data/leetcode.json` to the repository, ensure GitHub Actions is enabled, and allow the workflow to write repository contents. The workflow needs only `contents: write` so it can publish a changed JSON file. It needs no LeetCode or GitHub secret. Run it manually from the Actions page to check the current result. The logs report validated counts, calendar success or failure, and when a prior calendar is retained.

The workflow and updater plus `public/data/leetcode.json` are safe to commit; that JSON contains public profile data. Never commit LeetCode cookies, session tokens, passwords, private credentials, or local secret files. Do not put private credentials in React source or `VITE_` variables.

If counts remain at the profile fallback, inspect the workflow logs for request or validation errors. If the heatmap says **Activity preview**, no valid real calendar is present in the JSON; LeetCode may deny anonymous access, rate-limit requests, or change its unofficial GraphQL behavior. If the workflow reports a JSON change but the site remains old, check that the static deployment completed. These updates are scheduled, not real-time.

## Contact form

The form sends messages to a hosted contact service when `VITE_CONTACT_ENDPOINT` is set. Formspree is the recommended beginner setup: create a form in Formspree, verify the receiving email address, and copy its form endpoint (for example, `https://formspree.io/f/your-form-id`). The endpoint is public because it is used by the browser; do not put private credentials in a `VITE_` variable.

For local development, copy `.env.example` to `.env.local` and replace the placeholder with your Formspree endpoint:

```bash
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. Restart the Vite dev server after changing environment variables. Vite embeds `VITE_` values in the built frontend, so they are public and must never contain private API keys, passwords, or tokens.

For deployment, add `VITE_CONTACT_ENDPOINT` in the project's environment-variable settings in Vercel or Netlify, using the same Formspree endpoint. Apply it to the production environment (and preview environments if you want contact submissions to work there), then trigger a new deployment. Do not upload `.env.local` to the host or commit it to Git.

## Portfolio chatbot

The floating **Ask Shivendra** chat sends messages to `/api/chat`, handled by the Vercel Node.js serverless function in `api/chat.js`. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey), then add it to your local `.env.local` as `GEMINI_API_KEY=your_actual_key`. Do not use the `VITE_` prefix: Vite exposes prefixed variables in browser bundles. Keep the key out of source control and documentation.

For local frontend-only work, use `npm run dev`. To run the serverless function locally too, install/use the Vercel CLI and run `vercel dev` from the project root after linking the Vercel project and setting `GEMINI_API_KEY` in `.env.local`. The Vite dev server alone does not serve `/api/chat`. On Vercel, add `GEMINI_API_KEY` in **Project Settings → Environment Variables** for Production (and Preview/Development as needed), then redeploy. The key is read only by the serverless function.

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
