# LiftIQ Cloudflare Pages migration

Target URL: https://liftiq.pages.dev/ (user-reported; live accessibility not verified here).
Production remains GitHub `main` until approval; branch `feature/cloudflare-pages-backend-migration` contains a preview implementation.

## Pages configuration
- Connect existing GitHub repo `Deidrajw/LiftIQ`; production branch `main`.
- Framework: none; build command: `exit 0`; output folder: `public`; repository root: `/`.
- `functions/api/*.js` serves API routes alongside static `public/index.html`.
- API endpoints are now `/api/auth-config`, `/api/auth-session`, `/api/hevy-sync`, `/api/ai-coach`. Existing Netlify functions remain in place as a fallback.

## Secure server-side variables
Set `HEVY_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `ALLOWED_GOOGLE_EMAIL` in Cloudflare Pages Settings → Variables and Secrets; optional `GEMINI_MODEL`. Treat API keys and allowlisted email as secrets. Never put API keys in GitHub or frontend/localStorage. Configure both production and preview where testing requires them.

## Google OAuth
Add `https://liftiq.pages.dev` as an **authorized JavaScript origin** for the existing Google OAuth client in Google Cloud Console. Preserve the existing Netlify origin until migration is complete. If using a branch preview address, add its exact origin only when needed for an authorized manual test.

## Preservation & cutover
Do not delete or reset original Netlify project, functions, keys, or user browser data.
IMPORTANT: `localStorage` is scoped per hostname. The user's training settings, saved journals, cycle records and chats on `liftiqtrainingtracker.netlify.app` are **not** automatically present on `liftiq.pages.dev`. A verified data export/import and rollback plan are required before production cutover.

## Verification plan
- Run Node migration smoke checks; verify Cloudflare build logs compile all Pages Functions, and check `/api/auth-config`.
- Test unauthorized requests to `/api/hevy-sync` and `/api/ai-coach` are denied.
- Test signed-in Google session for the allowlisted account, Hevy pagination + all-history import, and Gemini response/limits; check both mobile and desktop.
- Verify no client-visible API key and no unsafe writebacks to Hevy or permanent plan edits.
- Match published commit to approved `main`; verify persisted data migration and rollback before replacing Netlify.
- No deployment from this branch should be described as full production without explicit user approval and signed-in testing.

## Current status
Files and tests committed on branch; automated GitHub CI results and actual Cloudflare Pages build/runtime not yet verified. This is a **preview-only** integration.
