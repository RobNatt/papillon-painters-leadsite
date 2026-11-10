# Papillion Painters (papillionpainters.com)

A referral site that connects Papillion, NE homeowners with local painters. It also works as proof of SEO for painting-company owners. Built with Next.js 16 (App Router, Cache Components), Tailwind v4, GSAP and Lenis, and deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # every page prerenders as static HTML
```

Copy `.env.example` to `.env.local`. In development, if neither `FORM_ENDPOINT_URL` nor the Resend variables are set, leads are printed to the terminal instead of sent. In production, the forms show an error until at least one of them is configured.

## Things you'll update

| What | Where |
|---|---|
| Resend key, sender address and lead inbox | Env vars `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_TO_EMAIL` (verify the sending domain in Resend first) |
| Form endpoint | Env var `FORM_ENDPOINT_URL`. Every lead is POSTed there as JSON (CRM or automation webhook); Resend email also goes out when configured |
| Painter booking link | Defaults to the N-Tech booking calendar; override with `NEXT_PUBLIC_BOOKING_URL` |
| Quote form options and consent text | `projectTypes`, `timelines` and `smsConsent` in `src/lib/site.ts` |
| Ranking proof | `src/content/ranking-log.ts`. Add one row per Search Console check, real numbers only |
| Page dates (sitemap + Article schema) | `src/lib/page-dates.ts`: bump a page's `updated` date when its content changes (e.g. after adding a ranking-log row) |
| Photos | Save each file at the path listed in `src/content/images.ts` (e.g. `public/images/hero-home.jpg`) and rebuild. Until a file exists, a branded placeholder shows |
| CRM | `deliverLead()` in `src/lib/leads.ts`. Every form goes through it |
| Estimate pricing | `src/lib/estimate.ts`, calibrated to the cited national sources |
| "Last reviewed" date | `site.lastReviewed` in `src/lib/site.ts` |

## How the motion works

- **One engine, one scroll system.** `src/lib/motion/init.ts` runs on every device with a single Lenis instance driving ScrollTrigger through the GSAP ticker. Wheel scrolling is smoothed on desktop; touch scrolling stays native.
- **When it loads.** Desktop: when the browser is idle after hydration. Phones/tablets: on the first touch, scroll or key press, so a phone's first seconds stay free for the hero form (`src/components/motion-root.tsx`).
- **Timing** comes from shared tokens (`globals.css` and `src/lib/motion/tokens.ts`). Only transform and opacity are animated.
- **Features:** unveiling home hero (`hero-unveil.*`), marquees (`marquee.*`), paint-brush sections (`lib/motion/brush.ts`), `ZoomImage` photos, and the trust bar.
- **Hero headlines** are split on the server and revealed with CSS, so the text is in the HTML and visible right away.
- **Reduced motion, or no JavaScript:** no pinning, zooming, brush or marquee motion. Everything renders as normal, readable sections.
- **Page transitions** use React's `<ViewTransition>` (`src/components/page-transition.tsx`).
