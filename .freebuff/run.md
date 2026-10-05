# Run doc — Flourishing Souls Foundation (Vite + React 18 + Tailwind v4)

## Reproduce the artifacts (fresh checkout)

1. Copy environment files from the main checkout into the worktree root
   (never commit them; values may need port/URL adaptation):
   - `.env.local` (Supabase project URL/key, Paystack public key,
     `VITE_ADMIN_PASSCODE` for the admin panel)
   - `.env.production` / `.env.example` are templates — optional to copy.
2. Install dependencies with npm (there is a `package-lock.json`; no other
   package manager is used):
   ```
   npm install
   ```
3. Nothing else needs generating — there is no codegen step. `npm run build`
   (typecheck-free Vite production build) is a good smoke test:
   ```
   npm run build
   ```

## Run the dev server

1. Ensure port **5173** is free (the Vite default; if taken, pass
   `-- --port <free-port>` to the dev command and adapt the preview URL).
2. Start detached (Windows), with stdout and stderr in different files.
   **Important:** pass `-- --host 127.0.0.1` — without it Vite binds to
   `[::1]` (IPv6-only) on this machine and `http://127.0.0.1:5173` will not
   answer, which breaks the preview webview:
   ```
   powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--host','127.0.0.1' -WorkingDirectory '<project root>' -RedirectStandardOutput '<log>.log' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
   ```
   (This command can appear to hang in a bash session because the detached
   process holds the output pipes — the server does start; verify with
   `netstat -ano | findstr 5173` and curl instead of trusting the exit.)
3. Wait for `http://127.0.0.1:5173/` to answer HTTP 200 (a few seconds;
   the first page load compiles on demand). Confirm the pid survives:
   `powershell -NoProfile -Command "Get-Process -Id <pid>"`.
4. Register the preview with the URL and the pid printed by step 2.

Note: the app is a Vite SPA; deep routes (`/admin`, `/events`, …) are served
by the dev server automatically. The Supabase backend referenced by
`.env.local` is currently unreachable (project paused/deleted), so data comes
from the built-in local demo store — this is expected, not an error.

## Brand assets (regenerate when the logo changes)

Source logo files live outside the repo (see paths inside the script):
`scripts/generate-brand-assets.ps1`. It rewrites `public/favicon.ico`,
`public/apple-touch-icon.png`, `public/icons/icon-{192,512}.png`,
`public/images/og-image.png`, and copies the icon/wordmark masters into
`public/images/brand-assets/`:

```
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-brand-assets.ps1
```

`npm run build` also runs `scripts/generate-route-meta.mjs`, which bakes
per-route share metadata (title/description/OG/Twitter/canonical) into
`dist/<route>/index.html` from `src/lib/pageMeta.js`. Add new public routes
to that module; static hosts without directory-index serving need a rewrite
rule pointing each route at its generated file.
