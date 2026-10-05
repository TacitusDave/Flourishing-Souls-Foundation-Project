# Flourishing Souls Foundation - Project Overview

> **Empowering lives, nurturing hope, and building thriving communities.**

A web application for the Flourishing Souls Foundation to manage donations,
volunteers, community support, events, and administrative operations
transparently. For setup instructions, see [README.md](README.md).

---

## Mission

The Flourishing Souls Foundation is a non-profit organization dedicated to:

- **Orphan Care & Support** - Providing food, shelter, education, and care to
  vulnerable children
- **Education Initiatives** - Sponsoring scholarships, books, and school
  supplies
- **Healthcare Services** - Funding medical outreach and health support
  programs
- **Community Upliftment** - Skill development, women & youth empowerment

This platform enables donors, volunteers, and community members to
participate in this mission with full transparency into where donations and
volunteer hours go.

---

## Who uses this

**Donors** give securely via Paystack, view their donation history, and can
choose to give anonymously or publicly.

**Volunteers** register, track their hours and skills, and sign up for
events.

**Community members** submit support requests, browse events, and view the
impact gallery.

**Administrators** unlock the panel at `/admin` with a passcode
(`VITE_ADMIN_PASSCODE`) and get an overview of donations, events, volunteers,
and messages, plus full management of events, gallery, support requests, and
site settings - see [ADMIN_SETUP.md](ADMIN_SETUP.md). The panel's data layer
(`src/lib/adminStore.js`) targets the live Supabase project when reachable and
a seeded local store when it isn't, so the admin area works today and flips to
the real database automatically once Supabase is restored.

---

## Architecture

- **Frontend:** React 18 + Vite + Tailwind CSS v4, deployed as a static site
- **Backend:** Supabase (Postgres, Auth, real-time, Storage) plus two
  Supabase Edge Functions for anything that needs the Paystack secret key
  (verifying a payment, checking a webhook signature) - see
  [README.md#payments](README.md#payments)
- **Payments:** Paystack, verified server-side - the client never has
  permission to write a `donations` row directly (enforced by Row Level
  Security, not just app logic)

There is no separate Node/Express backend. An earlier version of this repo
had an empty `backend/` folder that implied one existed; it didn't, and has
been removed. Everything that needs a secret key runs as a Supabase Edge
Function instead.

## Data flow

**Donation:** Donor fills out the form → Paystack Inline popup → on success,
the client calls the `paystack-verify` Edge Function with the transaction
reference only → the function re-verifies against Paystack's API and writes
the donation using Paystack's confirmed amount/status, not the client's
claim. The `paystack-webhook` function is the actual source of truth,
independent of whether the client-side call ever fires.

**Volunteer / support request:** Form → Supabase table insert directly (no
payment involved, so no server-side verification step is needed).

**Registration & login:** donors never need accounts. Supabase Auth handles
staff email/password and Google OAuth when the backend is reachable; a
`profiles` row is created alongside the auth user and `profiles.role`
(`member` or `admin`) gates `/dashboard`. The admin panel is additionally
gated by its own passcode (see [ADMIN_SETUP.md](ADMIN_SETUP.md)).

## Known gaps

Being direct about what's still incomplete, rather than claiming otherwise:

- The admin panel's Messages tab now covers support requests and volunteer
  applications. The standalone list components
  (`src/components/volunteer/VolunteerList.jsx`,
  `src/components/support/SupportList.jsx`) remain unreachable - nothing
  routes to them.
- No test coverage beyond the targeted regression tests in
  `src/**/*.test.{js,jsx}` (see README - this guards against specific bugs
  found during a full rebuild, it's not a comprehensive suite).
- Gallery upload is admin-only by design (`isAdmin` gate in
  `src/pages/Gallery.jsx`); there's no moderation queue for public
  submissions if that's ever wanted.

## Security

- Row Level Security enabled on every table (`supabase/schema.sql`) - most
  notably, no client insert policy on `donations` at all.
- Environment variables split correctly: anything prefixed `VITE_` is public
  by design (bundled into the client); secret keys (Paystack secret key,
  Supabase service role key) are never in a `VITE_` variable and only used
  server-side (Edge Functions, or locally when running `scripts/seed.js`).
- Admin role is set manually in the database, not self-serve from the app.

---

## License

MIT. See `LICENSE` if present, or treat as unlicensed until one is added.

---

**Flourishing Souls Foundation**
*Empowering lives, nurturing hope, building thriving communities.*
