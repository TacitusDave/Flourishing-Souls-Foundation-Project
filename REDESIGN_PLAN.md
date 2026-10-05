# Redesign Study & Plan — Flourishing Souls Foundation

Reference: **https://www.theflourishingsoul.com/** — The Flourishing Soul Initiative.
Goal: make our site look, feel, and operate like it — simple and calm. New logo to
be provided; slots reserved for it.

> **Locked decisions (owner-confirmed):**
> 1. **Palette** — from the new logo (delivered): purple `#54249C → #9C3CCC`,
>    gold `#FCCC24 → #B4843C` (primary purple avg `#6728A6`, theme color).
>    Logo files: `public/images/brand-assets/fsf-icon.png` (icon) and
>    `fsf-wordmark.png` (wordmark); regenerate derivatives with
>    `scripts/generate-brand-assets.ps1`.
> 2. **Dark mode** — drop it; the rebuilt site is light-only.
> 3. **Structure** — mirror the reference: Home / About / How We Serve /
>    Board / FAQs / Donate (current content reorganized into those pages;
>    staff tools stay, tucked away).
> 4. **Execution** — logo integration + share metadata: DONE. Phase 1
>    (tokens) + Phase 2 (chrome): DONE — sage palette from the reference
>    theme, reference greys, Jost display / Inter body, light-only
>    (dark: variant compiled but disabled via `data-theme="dark-disabled"`),
>    floating theme toggle removed, footer lightened. NEXT: Phase 3
>    (Home restructure to the reference's layout), Phase 4 (interior
>    pages), Phase 5 (staff surfaces), structure mirror (About / How We
>    Serve / Board / FAQs pages).

---

## 1. What the reference site is

A Wix-built nonprofit site. The feel comes from four things: **near-white
canvas, very light type, one quiet green accent, and enormous patience with
whitespace**. Nothing shouts; one CTA per screen; photography does the emotion.

Page map (all pages studied):

| Page | Slug | What it does |
| --- | --- | --- |
| Home | `/` | Big calm statement → "This is for you who:" bullets → How We Serve (3 cards: 1-on-1 Coaching, Private Community, Free Resources) → Who We Are paragraph → Donate CTA → contact strip |
| Donate | `/about-4` | Single campaign page: $25,000 goal, % allocation breakdown (40/35/15/10), "all donations are tax deductible", EIN |
| FAQs | `/general-5` | Accordion FAQ grouped by section |
| Board Members | `/board` | 3 people: role line, portrait, warm personal bios |
| Essential Reading | `/essential-reading` | File download area for resources |
| Terms | `/general-9` | Plain legal text |
| Booking | Wix booking pages | "Free Intro Call" scheduling form |
| Community | Wix groups/members | "Join the Waitlist!" for private community |
| Blog | `/blog` | Standard feed |

**Operating model:** minimal nav, oneDonate CTA everywhere, a booking form
instead of a contact page, a waitlist instead of a signup, resources as
downloads, and a campaign-style donation page. No clutter, no dashboards
visible to visitors.

## 2. Design system (extracted from the live site's theme)

### Palette — exact Wix theme values

| Role | Color |
| --- | --- |
| Page background | `#FFFFFF` white, secondary surface `#F5F5F5` |
| Borders / dividers | `#E8E6E6` |
| Text primary (titles + body) | `#383838` charcoal |
| Text secondary | `#8A8A8A` grey |
| **Action / buttons / links** | **`#8DA86D` sage green** |
| Sage ramp | `#E1EBD5 → #BCC9AB → #8DA86D → #5E6E4B → #37422B` |
| Cream/sand ramp | `#FCF1D4 → #F7E7BE → #E3CD94 → #8F8264 → #5E5743` |
| Blush/terracotta ramp | `#FFEBE3 → #FFE4D9 → #E0BBAB → #91756A → #614E42` |
| Pale lemon ramp | `#F8F7D6 → #F2EFAE → #CCC978 → #8F8D5B → #57553E` |
| Warm section washes in markup | `#FFF6F2`, peach pops `#FFC48C` / `#FF8044` |

The site is **light-only** — no dark theme exists.

### Typography

| Use | Reference font | Weight |
| --- | --- | --- |
| All headings / titles | **Brandon Grotesque Light** (`brandon-grot-w01-light`) | normal (light!), line-height 1.4 |
| Secondary display | DIN Next Light | light |
| Body | Helvetica W01 Roman / Wix Madefor | regular |

The signature is **light-weight geometric sans at generous sizes** — not bold,
never serif. Brandon Grotesque is commercial; closest free stand-ins:
**Jost** (Futura-like, closest match) or **Poppins Light**. Current site uses
Fraunces (serif) + Inter — both would be replaced.

### Texture & feel

- Rounded-full pill buttons, thin 1px borders, almost no shadows
- Soft pastel section bands (cream/blush) alternating with white
- Low-contrast greys for secondary text; charcoal for headings
- Calm motion: simple fades/zooms, nothing bouncy
- Line icons, small circular social buttons, simple accordions

### Voice

Short, warm, direct, second-person: "This is for woman who: … feels alone…".
Simple bullet lists over dense paragraphs. One ask per screen.

## 3. Current site inventory (what we're changing)

| Piece | Today |
| --- | --- |
| Tokens (`src/styles/tailwind.css`) | Purple "Amethyst" brand ramp, amber accent, warm-stone neutrals, Fraunces display + Inter, dark mode via `data-theme`, eyebrow device, reveal/word-reveal animations |
| Routes | `/`, `/donate`, `/volunteer`, `/support`, `/events`, `/gallery`, `/login`, `/dashboard` (auth), `/admin/*` (passcode), 404 |
| Header | Sticky blurred bar, pill nav, "Get Involved" dropdown, Donate CTA, staff login, user menu |
| Footer | Dark `neutral-950` 3-column footer with socials + contact |
| Layout | `max-w-screen-2xl`, floating theme switcher, footer hidden on `/events`, `/gallery`, `/admin` |
| Pages | Home (hero slideshow + animated headline, pillars, how-it-works, trust, tiers, CTA), Donate (tiers + Paystack), Volunteer, Support, Events, Gallery, Login, Dashboard, Admin suite |

## 4. Gap analysis

| Aspect | Today | Target (reference feel) |
| --- | --- | --- |
| Brand color | Purple `#7C3AED` | Sage `#8DA86D` + cream/blush/lemon support |
| Backgrounds | White + warm stone | White + `#F5F5F5` + cream `#FFF6F2` bands |
| Type | Fraunces serif display + Inter | Light geometric sans (Jost/Poppins) everywhere |
| Weight | Medium/semibold everywhere | Light, airy, generous sizes |
| Dark mode | Yes | Drop (reference is light-only) — pending decision |
| Nav | 5+ links, dropdown, staff login visible | 4–5 simple links, one Donate pill |
| Donation UX | Tier cards | Campaign model: goal + % allocation + tax note |
| Footer | Dark, busy | Light/cream, quiet: contact, socials, terms |

## 5. Phased plan

1. **Phase 1 — Tokens** (`tailwind.css`): replace brand ramp with sage; add
   cream/blush/lemon support ramps; swap fonts to Jost or Poppins (Google
   Fonts, CSP already allows it); adjust radii/shadows (softer, rounder);
   light-only unless dark mode is kept.
2. **Phase 2 — Chrome**: Header (calm nav, single Donate pill, logo slot),
   Footer (light/cream), Layout (remove floating theme switcher if light-only).
3. **Phase 3 — Home**: statement hero (keep slideshow, restyle; keep word
   animation — it fits the calm brief), "This is for you who:" block, How We
   Serve cards, Who We Are, impact allocation, FAQ teaser, Donate CTA.
4. **Phase 4 — Interior pages**: Donate (campaign model), Volunteer, Support,
   Events, Gallery, 404 — same calm system.
5. **Phase 5 — Staff surfaces**: Login, Dashboard, Admin restyled on the new
   tokens; functionality untouched.
6. **Logo**: when provided, drop into `public/images/` and swap the references
   in Header/Footer/favicon/manifest.

Every phase keeps lint/build/tests green and is verified in the live preview.
