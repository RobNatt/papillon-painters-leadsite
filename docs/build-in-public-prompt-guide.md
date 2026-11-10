# Build In Public: A Painter Lead Site Built with Claude

How one lead site for painters in Papillion, Nebraska was built with Claude Code, in the order it happened. Every prompt below is the one that was actually sent.

---

## 1. Project snapshot

**What was built:** A lead-generation referral website for **house painting** in **Papillion, Nebraska** (ZIPs 68046 and 68133). Homeowners request a quote and are passed to one local painter. Painting company owners see the site as proof the builder can get a painting company found on Google.

**Final result**
- Live site: https://papillion-painters.vercel.app
- Planned domain: papillionpainters.com (not connected yet at the end of this conversation)
- Pages:
  - Home
  - An interior and exterior painting cost guide with a photo color tool and estimator
  - "Websites for painting companies"
  - "How to get painting leads" (a free vs. paid comparison article)
  - Privacy, a hidden thank-you page, a sitemap and robots.txt

**Tools used**
- **Claude Code** did all the planning, building, testing and deploying.
- **Next.js** (App Router) with TypeScript and Tailwind CSS.
- **GSAP** (ScrollTrigger and SplitText) and **Lenis** for motion and smooth scrolling.
- **GitHub** for the code, and **Vercel** for hosting (it deploys automatically on every push).
- **Lighthouse and PageSpeed Insights** for speed checks.
- **Higgsfield**, used by the site owner to generate the placeholder photos.
- **Resend** for email delivery, planned but not set up yet.
- Not used in this conversation: Google Search Console, a CRM, Google Keyword Planner.

**How long it took:** About 5–6 hours of working sessions over two days, going by the session timestamps. Claude did the building and testing during those sessions. That breaks down roughly as:
- About 1 hour for the plan plus all four pages.
- About 4 hours for the review, speed fixes, deploy, six interactive features and photos.
- A few minutes for the sitemap.

---

## 2. The build, in order

### Phase 1: Brief, site plan and design direction

**Goal:** Get a site map, design system and motion plan approved before any page is built.

**The prompt:**

> We're building a premium, motion-driven website for painters in Papillion, Nebraska. It should feel like an award-winning agency site, not a template. The screenshots in /references are layout and color inspiration only; don't copy their text.
>
> Stack: Next.js (App Router) + TypeScript + Tailwind CSS. GSAP with ScrollTrigger and SplitText for motion, Lenis for smooth scrolling, next/font and next/image. Deploys on Vercel.
>
> Audiences:
> - Homeowners in Papillion who want a house painter. They submit a quote request, and we connect them with a local painter.
> - Painting company owners. The site itself proves we can get a painting company found on Google.
>
> Pages and target keywords:
> 1. Home (homeowners): [professional painters papillion]
> 2. Interior & exterior painting in Papillion (homeowners): [exterior painting cost]
> 3. Websites for painting companies (painters): [Painting leads for free]
> 4. "How this site got found" (painters): [How to get painting leads: The Best Free and Paid Startegies]. You found this site because we ranked it; book a call to get the same.
>
> Motion direction:
> - A hero with a split-text headline reveal and a slow parallax on the background imagery.
> - Scroll-triggered section reveals, a pinned "how it works" sequence (3 steps), smooth page transitions, magnetic buttons, and subtle hover states.
> - Motion should feel calm and expensive, never busy.
>
> Non-negotiables:
> - Every page server-rendered with real text in the HTML so Google can read it.
> - The hero text is visible immediately; the animation enhances it and never hides content from crawlers.
> - Respect prefers-reduced-motion (turn the motion off for those users).
> - Target Lighthouse 90+ on mobile.
> - No fake reviews, license numbers, street address or hours. State clearly that this is a referral service connecting homeowners with local painters, not a painting company.
>
> First: set up the project, then show me the site map, the design system (colors, type, spacing) and the motion plan for each page. Wait for my OK before building the pages.

**What Claude produced:**
- **Set-up:** the project, plus a design-system page showing the colors, type, spacing and a live sample of each animation.
- **Site map:** a table of URLs.
- **Design system:** colors named like paint chips (Platte Navy, Prairie Green, Dusk Plum, Night Charcoal, with Wet Ochre as the only accent), the Archivo font, and a 4px spacing scale.
- **Motion plan:** what moves on each page and how.

**What Claude pushed back on:** Claude proposed four changes to the brief.
1. **Hero headline:** split it into lines on the server and reveal it with CSS, instead of SplitText. SplitText needs JavaScript first, which would hide or delay the headline and hurt the speed score.
2. **Page 2:** "exterior painting cost" is a research-style search, so the page needs to be a real cost guide with cited prices.
3. **Pages 3 and 4:** they would compete for the same searches. Page 3 should focus on "your own website is the free lead channel you own", and page 4 should be the broad free-and-paid guide.
4. **Ranking proof on page 4:** it must show only real Search Console data, and stay empty until there is some.

It also fixed the "Startegies" typo, and asked five questions: domain, where leads go, booking link, photos, and which services to list.

**What happened next:** The computer went down mid-session. The follow-up prompt that recovered it:

> can you reload our previous conversation? my computer went down

Claude read back the saved session. Nothing was lost.

---

### Phase 2: Approve the plan, answer the questions, build all pages

**Goal:** Approve the plan with changes, give the business details, and get every page built.

**The prompt** (it answers Claude's four proposals, then its five questions, in order):

> changes, 1) this is fine 2) This would be a great addition to the site. I think this should have a photo upload with color selection so leads can take a photo of the room they want to paint, change it and then a calculator provides a ranged estimate. We can make this a lead capture so they get the estimate sent to their email. 3) this is fine, when 1 ranks it will carry the ther pages. make sure there's internal linking to help. One page would describe the importance of SEO optimization, GBP updates and optimization and reviews for the "Free" leads. we tie this into our offer. the other [age will be more like an article about comparing angis list, thumbtack, homeadvisor, marketing companies, and seo/aeo. 4) we will update regular with ranking info to show how it works.
>
> Next: 1) papillionpainters.com 2) we will use resend for now but hook up our CRM later. 3) I have this already and will provide later. 4) stock until the site is bought or rented. 5) And so on...

**What Claude produced:**
- **Pages:** all four, server-rendered with real text and linked to each other.
- **Cost guide:** cited price ranges, a small chart and a prep checklist.
- **Color tool:** a visitor uploads a photo, taps a wall and tries colors, then gets a price-range estimate emailed to them. Each estimate is sent to you as a lead.
- **Leads:** quote and estimate emails go through one function, so a CRM can be added later.
- **SEO extras:** a sitemap, robots.txt, share images and structured data.
- **Speed:** mobile Lighthouse came in at 88–94.

**What had to be fixed:**
- **Color tool:** the first version also painted the ceiling, trim and window frames. Claude caught and fixed this before handing over.
- **Photos:** stock photos couldn't be downloaded automatically, so every photo spot got a branded placeholder.

**Claude's open items:**
- **Email sending:** Resend keys and a lead inbox.
- **Booking link:** still to come.
- **Privacy page email:** confirm the contact mailbox shown there exists.
- **FAQ line:** confirm "Painters may pay us for introductions" matches how the site makes money. UNCLEAR: this was never answered in the conversation.

---

### Phase 3: Quote form and booking button specifics

**Goal:** Lock in the exact quote form fields, heading, consent line and the painter "Book a call" link.

**The prompt:**

> Approved. Build all 4 pages with the motion plan.
>
> Homeowner pages: a quote form with name, phone, email, project type (interior, exterior, cabinets, other), timeline and a note. The heading: "Tell us about your project and we'll connect you with a local Papillion painter." Under the button: "By submitting, you agree to be contacted by text and phone about your request. Message and data rates may apply. Reply STOP to opt out." Submit to [FORM ENDPOINT] and show an animated success state.
>
> Painter pages: a "Book a call" button linking to [REDACTED BOOKING LINK].
>
> Run it locally and give me the URL to review.

**What Claude produced:**
- **Quote form:** the exact fields, heading and consent text, plus an animated success state (a paint stroke and checkmark).
- **Book a call:** the button on both painter pages.
- **Review:** a local URL to look at.

**What had to be fixed:**
- **Form endpoint:** `[FORM ENDPOINT]` was still a placeholder in the prompt. Claude made it a setting (`FORM_ENDPOINT_URL`) to fill in later. It was never filled in during this conversation, so the live form can't deliver leads yet.
- **Error messages:** they stayed on screen after the visitor fixed the field, and the error text was too pale on the white card. Claude fixed both.

---

### Phase 4: Review on phone and desktop, smooth the motion, tighten the copy

**Goal:** Make the motion consistent and jank-free, with no layout shift, and make the copy short with one action per section.

**The prompt:**

> Review the site on a phone-sized screen and on desktop. Make the motion feel smoother and more deliberate: consistent easing and timing across the site, nothing that janks on scroll, no layout shift. Tighten the copy to short sentences with one clear action per section. Then show me what you changed.

**What Claude produced:**
- **Motion timing:** one set of timing values for every animation on the site. There had been 11 different durations before.
- **Copy:** cut to 7–11 words per sentence on average, with at most one button per section.
- **Painter contact:** "Book a call" is the main button, and the email form sits behind a "Prefer email?" toggle.
- **Layout shift:** zero on all pages.

**What Claude caught and fixed along the way:**
- **Hero photo:** two animations were fighting over it, which caused jank.
- **Small labels:** a late-loading font made text jump (layout shift).
- **Mobile header:** its height changed as the phone's address bar showed and hid.
- **Startup timing:** a warning appeared because the animation code started before the page had finished loading.

---

### Phase 5: Lighthouse check on mobile

**Goal:** Get Performance, SEO and Accessibility to 90 or above on mobile.

**The prompt:**

> Also run a Lighthouse check on mobile and fix anything that keeps performance, SEO or accessibility below 90.

**What Claude produced:**
- **The problem:** phones were laying out the whole long page on first load.
- **The fix:** sections below the first screen now wait to render until the page has loaded.
- **Result:** mobile Performance went to 90–96 on Claude's machine. SEO, Accessibility and Best Practices were already 100.

**What had to be fixed:** Scores swung widely between runs because other apps were using the computer's CPU. Claude switched to taking the middle score of three runs.

---

### Phase 6: Deploy to GitHub and Vercel

**Goal:** Put the code on GitHub and get a live URL.

**The prompt:**

> push it up to github, then vercel to trigger deployment. github: [REDACTED GITHUB REPO URL]

**What Claude produced:**
- **GitHub:** set up the repository, checked it for secrets, and pushed the first commit.
- **Vercel:** created a project linked to the repo. The first build went live in about 30 seconds.
- **From then on:** every push to `main` redeploys automatically.

**What to know:** The live form shows an error until the form endpoint or Resend is set up in Vercel's settings.

---

### Phase 7: Speed test on the live site

**Goal:** Get Google's own PageSpeed numbers for the live URL.

**The prompt:**

> yes let's run it from a live site.

**What happened:**
- **PageSpeed API:** the free, keyless quota was used up, so every request was refused.
- **Fallback:** Claude ran Lighthouse against the live URL from the local machine instead.
- **Result:** scores were much lower than before. A side-by-side test showed the machine was busy, not the site; the local copy scored just as low in the same minute.

**The fix:** None in code. Claude gave browser links to pagespeed.web.dev (which works even when the API quota is gone), and offered to use an API key for repeat runs.

---

### Phase 8: Six interactive features

**Goal:** Add premium interaction features without breaking speed, the form, accessibility or honesty rules.

**The prompt:**

> You're working on the existing Papillion Painters site (Next.js App Router, TypeScript, Tailwind, GSAP with ScrollTrigger and SplitText, Lenis smooth scroll), deployed at https://papillion-painters.vercel.app. Don't rebuild the site. Keep the current brand, colors (navy, green, sage, wheat, ochre, plum), typography, copy, page structure, lead form and consent line exactly as they are. This pass adds six interaction features so the site feels premium and memorable.
>
> Before you write any code, read the current codebase. Then give me a short plan with:
>
> which file each feature lives in
> which existing components you'll change
> any new dependencies, and why each is needed
>
> Wait for my OK before you start building.
>
> Global rules (apply to every feature)
> Performance first.
> Animate only transform and opacity. Never animate layout properties.
> Lazy-load anything below the fold.
> Use next/image for every photo, with proper sizes.
> Targets: Lighthouse mobile Performance 85+, CLS under 0.05, and the lead form must stay instantly usable. No animation may delay the hero form.
> One scroll system.
> Drive every scroll effect from a single Lenis instance synced to ScrollTrigger (lenis.on('scroll', ScrollTrigger.update) and the GSAP ticker).
> Use gsap.context() / useGSAP and clean up on unmount, so nothing leaks between route changes.
> Reduced motion. When prefers-reduced-motion: reduce is on:
> turn off the pinning, zooming, brush trail and carousel motion
> show the same content statically, still fully readable.
> Touch devices. No feature can depend on a mouse. Each one needs a touch or no-hover fallback, listed below. Test at 390px wide.
> Honest content.
> No invented reviews, ratings, review counts, license numbers, years in business or "as seen on" logos.
> Trust items must be things that are actually true about this site.
> Use photos from /public or clearly marked placeholders I can swap later, and list every placeholder at the end.
> Accessibility.
> Every motion element gets aria-hidden if it's decorative.
> Keyboard focus stays visible.
> The color tool must work with keyboard and touch.
> Feature 1: Trust bar
> A slim bar directly under the hero, before "Who we are."
> 4–5 short items with a simple line icon each:
> "Free for homeowners"
> "One painter, not a bidding list"
> "Papillion & Sarpy County"
> "Free on-site quotes"
> "No account needed"
> Desktop: items in a single row with thin dividers.
> Mobile: becomes the infinite carousel from Feature 2.
> Items fade and rise in with a small stagger the first time the bar enters view.
> Feature 2: Infinite carousel (marquee)
> Build one reusable \<Marquee\> component: seamless infinite loop, direction prop, speed prop, pause on hover/focus.
> Use it twice:
> the trust bar on mobile
> a slow band of project-type words or photos ("Interior · Exterior · Cabinets · Decks · Trim · Small commercial") placed between "What painters quote" and the visualizer section
> Scroll velocity should briefly speed it up and skew it slightly, then ease back to normal. Use GSAP quickTo, not a re-render.
> Duplicate the items for the loop, and mark the duplicates aria-hidden.
> Reduced motion: a static row that wraps.
> Feature 3: Paint-brush cursor in chosen sections
> In the "Who we are" section and the final "Ready for a real price?" CTA only, moving the mouse leaves a soft paint stroke on a \<canvas\> behind the text.
> How it looks and behaves:
> The stroke has a slightly textured, bristle-like edge.
> It uses the brand palette and cycles to the next color each time the cursor re-enters the section.
> It fades out over about 1.5 seconds.
> Optional: a small brush-tip cursor that replaces the default cursor inside those sections only.
> Text must stay fully readable above the paint. Keep paint opacity around 0.35–0.5 and check contrast.
> Implementation:
> Use requestAnimationFrame.
> Interpolate points between mouse events so fast moves still give smooth strokes.
> Cap the device pixel ratio at 2.
> Pause the canvas when the section is offscreen (IntersectionObserver).
> Touch and no-hover devices: a one-time auto-painted stroke that sweeps across the section headline when it enters view.
> Feature 4: Photo upload and recolor ("See the color on your own walls")
>
> There's already a visualizer section and a link to /interior-exterior-painting-papillion#estimator. Upgrade that into a real tool, and keep both the homepage teaser and the estimator page pointing to it.
>
> How it works for the homeowner:
>
> Upload a photo or take one on the phone (accept="image/*", capture allowed). Processing happens in the browser only. The photo isn't uploaded anywhere unless the user submits the quote form, which keeps the existing promise "Your photo stays on your device unless you send it."
> Tap or click a wall or surface. A flood-fill selection, with a tolerance slider, picks similar-colored connected pixels. Add these too:
> a brush/eraser to touch up the mask
> an undo
> Pick a color from the 6 brand swatches (Platte Navy, Prairie Green, Sage Field, Wheat Straw, Wet Ochre, Dusk Plum) or a custom color picker.
> The recolor has to look like paint, not a flat fill. Keep the photo's light and shadow by changing hue and saturation and blending luminance, e.g. a LAB/HSL luminosity-preserving blend or a multiply/color blend on the masked area.
> A before/after slider to compare.
> Download the result, and a "Get a quote for this color" button that scrolls to the quote form. That button pre-fills the Note field with the chosen color and surface ("Exterior, Sage Field") and, if the user agrees, attaches the image.
>
> Technical:
>
> Canvas 2D (or OffscreenCanvas plus a Web Worker for the fill so the UI stays smooth).
> Downscale large photos to about 1600px on the long side before processing.
> Handle EXIF rotation from phones.
> Include a sample house photo so people can try it without uploading.
> Keep it simple and solid. Don't bring in a heavy ML segmentation model in this pass. If you think an optional AI-assisted "select wall" button is worth it later, note it as a follow-up and don't build it.
> Feature 5: Unveiling hero (scroll storytelling)
>
> The hero becomes a pinned three-stage scroll sequence. The lead form must still be reachable right away: keep the hero form visible in stage 1, and put a sticky "Get a free quote" button in the header the whole time.
>
> Stage 1 (top of page): the current hero, with headline, subtext and form.
> Stage 1 → 2 (scroll down):
> Pin the section.
> The hero image or background scales up while a dark overlay ramps to near-black, so it feels like zooming into darkness.
> The headline splits (SplitText) and drifts out.
> Stage 2 (in the dark):
> A short statement appears in large type, e.g. "Every wall in Papillion has a story."
> Moving the mouse reveals photos: painted rooms, exteriors, close-up brush texture. They fade and scale in at the cursor position in a loose trail, then fade out.
> Keep at most about 6 on screen at once, recycled from a pool, with images preloaded.
> Stage 2 → 3 (keep scrolling):
> The darkness zooms back out (scale down, overlay fades) to reveal the next section ("Who we are") underneath.
> Then unpin.
> Scrub the whole sequence to scroll (scrub: true or about 0.8), so it plays backward when the user scrolls back up.
> Touch and no-hover: in stage 2, the photos appear automatically in a timed sequence instead of following the cursor.
> Reduced motion: no pin. Stages render as normal stacked sections.
> Feature 6: Photo zoom on appear and on scroll
>
> Make this a reusable \<ZoomImage\> wrapper and use it for every content photo on the site (not icons or the logo):
>
> On enter: the image starts at about scale 1.15 inside an overflow-hidden frame, eases to 1.0 and fades in as it enters the viewport.
> While scrolling past: a gentle continued parallax/zoom-out (1.0 → 0.95, or a slight y-offset) tied to scroll.
> The frame size stays fixed, so the layout never shifts.
> Also fix while you're in there
> Remove the large empty gap between "Read the painting cost guide" and the FAQ section, on both desktop and mobile.
> Keep \<link rel="canonical"\> as it is. I'll handle the domain separately.
> When you're done
> Run a production build and fix any type, lint or hydration errors.
> Test at 1440px, 1024px and 390px, and with reduced motion on. Confirm the lead form still submits exactly as before.
> Give me a short report:
> what you built
> which files changed
> every placeholder image I need to replace
> Lighthouse mobile scores before and after
> anything you'd improve next
> Don't deploy until I review it.

**What Claude produced first (a plan, no code):**
- **Where each feature lives:** the files for each feature, with no new software libraries needed.
- **Conflicts it flagged in the brief:**
  - The hero form is taller than the screen, so the pin should start only after the whole form has been scrolled past.
  - Loading the animation code on phones costs speed.
- **Three questions:** placeholder photos, the dark-stage line, and an "attach my color preview" checkbox on the quote form.

**The answer prompt:**

> 1) B, we can use higgsfield to generate these for you and i can upload them. 2) as-is 3)ok

**What Claude built:**
- **Trust bar:** under the hero. A single row on desktop, a scrolling marquee on phones.
- **Marquee:** reusable, used twice.
- **Paint brush:** in two sections, with a one-time automatic stroke on touch screens.
- **Color tool upgrades:** brush, eraser, undo, the six brand swatches, download, keyboard control, and a "Get a quote for this color" button. That button pre-fills the Note field and can attach the preview.
- **Unveiling hero:** the pinned, scroll-scrubbed dark sequence.
- **ZoomImage:** on every content photo.
- **Gap fix:** the large gap above the FAQ is gone.
- **Phone header:** a quote button that stays visible.

**What Claude caught and fixed in testing:**
- **Invisible blocker:** after the hero sequence, the faded hero sat invisibly over the next sections and blocked clicks.
- **Jumping back up:** going to the top (for example with the header quote button) briefly replayed the dark stage, which also caused a layout shift.
- **Phone header:** it wrapped onto two lines at 390px and clipped at 360px.
- **Grey veil:** a grey layer still covered "Who we are" while visitors read it.
- **Phone speed:** loading the animation code on phones dropped the home score from 77 to 66. The code now loads on the visitor's first touch or scroll. Result: home 83, the other pages 85–89, CLS 0 on every page.

**Still open:** home mobile Performance ended at 83, under the 85 target.

---

### Phase 9: Images

**Goal:** Replace the branded placeholders with photos.

**The prompt:**

> the photos are uploaded

**What happened:**
- **The photos:** 12 AI-generated **placeholder** images, made with Higgsfield and saved with "placeholder-" in each filename. They are not real jobs.
- **Mapping:** Claude assigned each photo to a spot on the site, and made the sample house photo the color tool's demo.

**What Claude caught and fixed:**
- **Siding fill:** on the real house photo, tapping the siding painted only one board at a time. Claude changed the fill so it crosses thin shadow lines but still stops at trim and doors.
- **Leaks:** fills spread into a cream sofa next to a sage wall, and that's fixed. White doors in shadow next to similar-toned walls can still leak. The workaround is the tolerance slider or the eraser.
- **Scroll stutter:** real photos made scroll-linked zooms stutter (49 slow frames out of 290). Moving the photos onto their own GPU layers brought it down to 8.
- **Readability:** the white "Every wall in Papillion has a story." line was hard to read over a bright photo. The trail photos now top out at 72% opacity, with a soft shadow behind the text.

---

### Phase 10: Redeploy

**Goal:** Ship the reviewed changes.

**The prompt:**

> go ahead and push up to github and trigger a vercel redeploy

**What Claude produced:** A secrets check, a commit and a push to `main`. Vercel rebuilt in about 20 seconds. Claude confirmed all pages load and every photo shows on the live site.

---

### Phase 11: Sitemap

**Goal:** Have a sitemap ready for Google.

**The prompts:**

> prepare a sitemap

> what is the sitemap url?

**What Claude produced:**
- **Fix:** the existing sitemap gave every page the same "last modified" date. Claude gave each page its own accurate date.
- **Checks:** the sitemap is valid, every listed page loads, and each page's canonical tag matches its sitemap entry.
- **The URL:** `https://papillionpainters.com/sitemap.xml`, to submit once that domain is connected.

**What to know:**
- **Not pushed yet:** this change wasn't deployed at the end of the conversation.
- **Build tool blocked:** a Windows security setting (Application Control) started blocking Next.js's normal build tool. Claude used a slower fallback build.

---

### Phases that did not happen in this conversation

- **Keyword research and picking the town:** UNCLEAR. The town and keywords were already chosen when the first prompt was sent; how they were picked isn't in the conversation.
- **Google Search Console:** not done yet. The sitemap is ready, but the domain wasn't connected.
- **Lead form wiring (endpoint or CRM):** not done. `FORM_ENDPOINT_URL` and the Resend settings were never filled in, so live submissions show an error until they are.

---

## 3. Reusable prompt templates

Replace everything in [BRACKETS]. Leave the rest as written.

### Template A: Brief and site plan (Phase 1)

> We're building a premium, motion-driven website for [TRADE]s in [TOWN], [STATE]. It should feel like an award-winning agency site, not a template. The screenshots in /references are layout and color inspiration only; don't copy their text.
>
> Stack: Next.js (App Router) + TypeScript + Tailwind CSS. GSAP with ScrollTrigger and SplitText for motion, Lenis for smooth scrolling, next/font and next/image. Deploys on Vercel.
>
> Audiences:
> - Homeowners in [TOWN] who want a [TRADE]. They submit a quote request, and we connect them with a local [TRADE].
> - [TRADE] company owners. The site itself proves we can get a [TRADE] company found on Google.
>
> Pages and target keywords:
> 1. Home (homeowners): [KEYWORD 1]
> 2. [SERVICE PAGE NAME] in [TOWN] (homeowners): [KEYWORD 2]
> 3. Websites for [TRADE] companies ([TRADE] owners): [KEYWORD 3]
> 4. "How this site got found" ([TRADE] owners): [KEYWORD 4]. You found this site because we ranked it; book a call to get the same.
>
> Motion direction:
> - A hero with a split-text headline reveal and a slow parallax on the background imagery.
> - Scroll-triggered section reveals, a pinned "how it works" sequence (3 steps), smooth page transitions, magnetic buttons, and subtle hover states.
> - Motion should feel calm and expensive, never busy.
>
> Non-negotiables:
> - Every page server-rendered with real text in the HTML so Google can read it.
> - The hero text is visible immediately; the animation enhances it and never hides content from crawlers.
> - Respect prefers-reduced-motion (turn the motion off for those users).
> - Target Lighthouse 90+ on mobile.
> - No fake reviews, license numbers, street address or hours. State clearly that this is a referral service connecting homeowners with local [TRADE]s, not a [TRADE] company.
>
> First: set up the project, then show me the site map, the design system (colors, type, spacing) and the motion plan for each page. Wait for my OK before building the pages.

### Template B: Approve the plan and answer Claude's questions (Phase 2)

Claude's plan will end with numbered proposals and numbered questions. Answer them by number, as in the original. These were the questions this time; yours may differ.

> changes, 1) [YOUR ANSWER TO CLAUDE'S PROPOSAL 1] 2) [YOUR ANSWER TO PROPOSAL 2, e.g. the cost page should have a photo upload with color selection so leads can take a photo of the room they want to paint, change it and then a calculator provides a ranged estimate. We can make this a lead capture so they get the estimate sent to their email.] 3) [YOUR ANSWER TO PROPOSAL 3, e.g. make sure there's internal linking to help.] 4) [YOUR ANSWER TO PROPOSAL 4]
>
> Next: 1) [DOMAIN] 2) [WHERE LEADS GO, e.g. resend for now but hook up our CRM later] 3) [BOOKING LINK, or "I have this already and will provide later"] 4) [PHOTOS, e.g. stock until the site is bought or rented] 5) [SERVICES TO LIST]

### Template C: Quote form and booking button (Phase 3)

> Approved. Build all 4 pages with the motion plan.
>
> Homeowner pages: a quote form with name, phone, email, project type ([SERVICE TYPES]), timeline and a note. The heading: "Tell us about your project and we'll connect you with a local [TOWN] [TRADE]." Under the button: "By submitting, you agree to be contacted by text and phone about your request. Message and data rates may apply. Reply STOP to opt out." Submit to [CONTACT METHOD, e.g. your form endpoint or CRM webhook URL] and show an animated success state.
>
> [TRADE] pages: a "Book a call" button linking to [BOOKING LINK].
>
> Run it locally and give me the URL to review.

Have the real endpoint ready before you send this. If you leave `[FORM ENDPOINT]` in, the form is built but can't deliver leads.

### Template D: Review pass (Phase 4)

> Review the site on a phone-sized screen and on desktop. Make the motion feel smoother and more deliberate: consistent easing and timing across the site, nothing that janks on scroll, no layout shift. Tighten the copy to short sentences with one clear action per section. Then show me what you changed.

### Template E: Speed and SEO check (Phase 5)

> Also run a Lighthouse check on mobile and fix anything that keeps performance, SEO or accessibility below 90.

### Template F: Deploy (Phase 6)

> push it up to github, then vercel to trigger deployment. github: [GITHUB REPO URL]

### Template G: Test the live site (Phase 7)

> yes let's run it from a live site.

### Template H: Interactive features (Phase 8)

> You're working on the existing [BRAND NAME] site (Next.js App Router, TypeScript, Tailwind, GSAP with ScrollTrigger and SplitText, Lenis smooth scroll), deployed at [LIVE URL]. Don't rebuild the site. Keep the current brand, colors ([BRAND COLORS]), typography, copy, page structure, lead form and consent line exactly as they are. This pass adds six interaction features so the site feels premium and memorable.
>
> Before you write any code, read the current codebase. Then give me a short plan with:
>
> which file each feature lives in
> which existing components you'll change
> any new dependencies, and why each is needed
>
> Wait for my OK before you start building.
>
> Global rules (apply to every feature)
> Performance first.
> Animate only transform and opacity. Never animate layout properties.
> Lazy-load anything below the fold.
> Use next/image for every photo, with proper sizes.
> Targets: Lighthouse mobile Performance 85+, CLS under 0.05, and the lead form must stay instantly usable. No animation may delay the hero form.
> One scroll system.
> Drive every scroll effect from a single Lenis instance synced to ScrollTrigger (lenis.on('scroll', ScrollTrigger.update) and the GSAP ticker).
> Use gsap.context() / useGSAP and clean up on unmount, so nothing leaks between route changes.
> Reduced motion. When prefers-reduced-motion: reduce is on:
> turn off the pinning, zooming, brush trail and carousel motion
> show the same content statically, still fully readable.
> Touch devices. No feature can depend on a mouse. Each one needs a touch or no-hover fallback, listed below. Test at 390px wide.
> Honest content.
> No invented reviews, ratings, review counts, license numbers, years in business or "as seen on" logos.
> Trust items must be things that are actually true about this site.
> Use photos from /public or clearly marked placeholders I can swap later, and list every placeholder at the end.
> Accessibility.
> Every motion element gets aria-hidden if it's decorative.
> Keyboard focus stays visible.
> The color tool must work with keyboard and touch.
> Feature 1: Trust bar
> A slim bar directly under the hero, before "[FIRST SECTION AFTER HERO]."
> 4–5 short items with a simple line icon each:
> "[TRUST ITEM 1, e.g. Free for homeowners]"
> "[TRUST ITEM 2]"
> "[TOWN] & [COUNTY]"
> "[TRUST ITEM 4]"
> "[TRUST ITEM 5]"
> Desktop: items in a single row with thin dividers.
> Mobile: becomes the infinite carousel from Feature 2.
> Items fade and rise in with a small stagger the first time the bar enters view.
> Feature 2: Infinite carousel (marquee)
> Build one reusable \<Marquee\> component: seamless infinite loop, direction prop, speed prop, pause on hover/focus.
> Use it twice:
> the trust bar on mobile
> a slow band of project-type words or photos ("[SERVICE TYPES, separated by ·]") placed between "[SERVICES SECTION NAME]" and the visualizer section
> Scroll velocity should briefly speed it up and skew it slightly, then ease back to normal. Use GSAP quickTo, not a re-render.
> Duplicate the items for the loop, and mark the duplicates aria-hidden.
> Reduced motion: a static row that wraps.
> Feature 3: Paint-brush cursor in chosen sections
> In the "[SECTION 1]" section and the final "[CLOSING CTA HEADING]" CTA only, moving the mouse leaves a soft paint stroke on a \<canvas\> behind the text.
> How it looks and behaves:
> The stroke has a slightly textured, bristle-like edge.
> It uses the brand palette and cycles to the next color each time the cursor re-enters the section.
> It fades out over about 1.5 seconds.
> Optional: a small brush-tip cursor that replaces the default cursor inside those sections only.
> Text must stay fully readable above the paint. Keep paint opacity around 0.35–0.5 and check contrast.
> Implementation:
> Use requestAnimationFrame.
> Interpolate points between mouse events so fast moves still give smooth strokes.
> Cap the device pixel ratio at 2.
> Pause the canvas when the section is offscreen (IntersectionObserver).
> Touch and no-hover devices: a one-time auto-painted stroke that sweeps across the section headline when it enters view.
> Feature 4: Photo upload and recolor ("See the color on your own walls")
>
> There's already a visualizer section and a link to [ESTIMATOR PAGE URL]#estimator. Upgrade that into a real tool, and keep both the homepage teaser and the estimator page pointing to it.
>
> How it works for the homeowner:
>
> Upload a photo or take one on the phone (accept="image/*", capture allowed). Processing happens in the browser only. The photo isn't uploaded anywhere unless the user submits the quote form, which keeps the existing promise "Your photo stays on your device unless you send it."
> Tap or click a wall or surface. A flood-fill selection, with a tolerance slider, picks similar-colored connected pixels. Add these too:
> a brush/eraser to touch up the mask
> an undo
> Pick a color from the [NUMBER] brand swatches ([BRAND COLORS]) or a custom color picker.
> The recolor has to look like paint, not a flat fill. Keep the photo's light and shadow by changing hue and saturation and blending luminance, e.g. a LAB/HSL luminosity-preserving blend or a multiply/color blend on the masked area.
> A before/after slider to compare.
> Download the result, and a "Get a quote for this color" button that scrolls to the quote form. That button pre-fills the Note field with the chosen color and surface ("[EXAMPLE, e.g. Exterior, Sage Field]") and, if the user agrees, attaches the image.
>
> Technical:
>
> Canvas 2D (or OffscreenCanvas plus a Web Worker for the fill so the UI stays smooth).
> Downscale large photos to about 1600px on the long side before processing.
> Handle EXIF rotation from phones.
> Include a sample house photo so people can try it without uploading.
> Keep it simple and solid. Don't bring in a heavy ML segmentation model in this pass. If you think an optional AI-assisted "select wall" button is worth it later, note it as a follow-up and don't build it.
> Feature 5: Unveiling hero (scroll storytelling)
>
> The hero becomes a pinned three-stage scroll sequence. The lead form must still be reachable right away: keep the hero form visible in stage 1, and put a sticky "Get a free quote" button in the header the whole time.
>
> Stage 1 (top of page): the current hero, with headline, subtext and form.
> Stage 1 → 2 (scroll down):
> Pin the section.
> The hero image or background scales up while a dark overlay ramps to near-black, so it feels like zooming into darkness.
> The headline splits (SplitText) and drifts out.
> Stage 2 (in the dark):
> A short statement appears in large type, e.g. "[STATEMENT, e.g. Every wall in [TOWN] has a story.]"
> Moving the mouse reveals photos: [PHOTO SUBJECTS, e.g. painted rooms, exteriors, close-up brush texture]. They fade and scale in at the cursor position in a loose trail, then fade out.
> Keep at most about 6 on screen at once, recycled from a pool, with images preloaded.
> Stage 2 → 3 (keep scrolling):
> The darkness zooms back out (scale down, overlay fades) to reveal the next section ("[FIRST SECTION AFTER HERO]") underneath.
> Then unpin.
> Scrub the whole sequence to scroll (scrub: true or about 0.8), so it plays backward when the user scrolls back up.
> Touch and no-hover: in stage 2, the photos appear automatically in a timed sequence instead of following the cursor.
> Reduced motion: no pin. Stages render as normal stacked sections.
> Feature 6: Photo zoom on appear and on scroll
>
> Make this a reusable \<ZoomImage\> wrapper and use it for every content photo on the site (not icons or the logo):
>
> On enter: the image starts at about scale 1.15 inside an overflow-hidden frame, eases to 1.0 and fades in as it enters the viewport.
> While scrolling past: a gentle continued parallax/zoom-out (1.0 → 0.95, or a slight y-offset) tied to scroll.
> The frame size stays fixed, so the layout never shifts.
> Also fix while you're in there
> [ANY SPECIFIC LAYOUT FIXES YOU'VE SPOTTED]
> Keep \<link rel="canonical"\> as it is. I'll handle the domain separately.
> When you're done
> Run a production build and fix any type, lint or hydration errors.
> Test at 1440px, 1024px and 390px, and with reduced motion on. Confirm the lead form still submits exactly as before.
> Give me a short report:
> what you built
> which files changed
> every placeholder image I need to replace
> Lighthouse mobile scores before and after
> anything you'd improve next
> Don't deploy until I review it.

### Template I: Answering the feature plan (Phase 8)

> 1) [YOUR CHOICE ON PHOTOS, e.g. B, we can use [IMAGE TOOL] to generate these for you and i can upload them] 2) [YOUR ANSWER, e.g. as-is] 3)[YOUR ANSWER, e.g. ok]

### Template J: Photos uploaded (Phase 9)

> the photos are uploaded

### Template K: Redeploy (Phase 10)

> go ahead and push up to github and trigger a vercel redeploy

### Template L: Sitemap (Phase 11)

> prepare a sitemap

> what is the sitemap url?

---

## 4. Mistakes and lessons

| What went wrong | Why | Rule for next time |
|---|---|---|
| The computer went down mid-session | Hardware, not the tool | Sessions are saved. Ask Claude to reload the previous conversation instead of starting over. |
| The live quote form can't deliver leads | `[FORM ENDPOINT]` was left as a placeholder in the prompt and never filled in | Have your real endpoint or CRM webhook ready before you write the form prompt. |
| The keyword list had a typo ("Startegies") | Typed by hand | Ask Claude to check keyword spelling in the plan step. It caught this one. |
| Two painter pages would have competed for the same searches | Overlapping keywords | Give each page one distinct search to win. Ask Claude to flag overlap in the plan. |
| The first color tool also painted the ceiling, trim and frames | The edge detection was too loose | Test the color tool on a sample room and on real photos before showing anyone. |
| The color tool painted single siding boards on a real house photo | Siding shadow lines looked like edges | Test with an exterior photo, not just an interior one. |
| Fills can leak onto white doors in shadow next to similar-toned walls | Low-contrast photos are hard for any tap-to-fill | Keep the brush, eraser and tolerance slider. Note an AI "select wall" button as a future option. |
| Speed scores jumped around (for example 93 one hour, 61–66 the next) | Other apps (a screen recorder, browsers) were using the CPU | Close heavy apps before testing, take the middle of 3+ runs, and confirm on pagespeed.web.dev. |
| The free PageSpeed API refused every request | The keyless API shares a daily quota | Use the pagespeed.web.dev website, or get your own free API key. |
| A late-loading font made text jump (layout shift) | The label font arrived after first paint | Preload small accent fonts, and don't let them swap in late. |
| Two animations fought over the same hero photo | Both animated the same element | Give each moving element only one animation. |
| The animated hero invisibly blocked clicks on the next section | The finished, transparent hero stayed on top | After any pinned animation, check the page below can still be clicked. |
| Jumping back to the top replayed the dark stage | The scrubbed animation lagged behind a big jump | Test the header "Get a free quote" button from deep in the page. |
| Adding animation code on phones dropped the home score from 77 to 66 | The code ran while the page was loading | Load heavy animation code on phones only after the first touch or scroll. |
| The phone header wrapped at 390px and clipped at 360px | Too many items for a narrow screen | Test at 360px as well as 390px. |
| White headline text was hard to read over a bright photo | Full-opacity photos sat behind the text | Check text readability over your brightest photo. |
| Scrolling stuttered once real photos were added | The browser re-drew large scaled images every frame | Re-test scroll smoothness after adding real photos. |
| A build failed with "resource busy" | An old local server was still running | Stop old local servers before rebuilding. |
| A Windows security setting blocked the normal build tool | Windows Application Control | If a build suddenly fails on Windows, check security settings. A slower fallback build works. |
| Proof of ranking couldn't be shown yet | The site is new and has no Search Console data | Leave the ranking section empty until you have real numbers. Never fake them. |

---

## 5. Decisions and why

- **Next.js + Tailwind + GSAP + Lenis on Vercel:** server-rendered pages Google can read, with premium motion and free automatic deploys.
- **Referral wording ("we're not painters, we know which painter to call"):** the site connects homeowners to one painter. Saying so plainly is honest and builds trust.
- **No business address schema (Organization, not LocalBusiness):** local-business markup implies an address and that you do the work.
- **One painter per request, not a bidding list:** the main reason a homeowner would pick this over Angi or Thumbtack.
- **The consent line under the button:** text and phone consent, taken word for word from the brief, stated where the visitor clicks.
- **Hero headline revealed by CSS, not SplitText:** visible on first paint, readable by Google, and better for speed.
- **A real cost guide with cited prices:** "exterior painting cost" is a research search, so the page has to answer it.
- **Ranking proof shows real data only:** fake ranking claims would break the "no fake claims" rule, and painting company owners would check.
- **No reviews, ratings, license numbers or "as seen on" logos:** the site has none to show. Trust items are only things that are true.
- **Leads go to one function (form endpoint and/or Resend):** swapping in a CRM later means changing one place.
- **Painter pages: "Book a call" first, email form behind a toggle:** one clear action per section.
- **Placeholder photos generated with Higgsfield:** they're marked "placeholder-" in the filename and never captioned as real jobs, to be replaced once the site is rented or sold.
- **Photo processing in the browser only:** keeps the promise "Your photo stays on your device unless you send it."
- **No AI wall-selection model:** kept the tool simple and fast. It's noted as a possible follow-up.
- **No forced-camera upload:** phones offer both the camera and the photo library.
- **Phones load the animation engine on first touch or scroll:** keeps the hero form instantly usable and the speed score up.
- **The hero pins only after the form has been scrolled past:** the form never animates while someone is filling it in.
- **Reduced-motion visitors get plain stacked sections:** the same content, fully readable, with no motion.
- **FAQ line "Painters may pay us for introductions":** an honest disclosure for a rank-and-rent site. UNCLEAR: the owner never confirmed this matches their business model.

---

## 6. Checklist

Tick these off before you point a domain at the site or hand it to a painter.

- [ ] Site loads on a phone at 360px and 390px wide: no sideways scrolling, and the header fits on one line.
- [ ] Site loads on desktop at 1024px and 1440px.
- [ ] With "reduce motion" turned on in your phone or computer settings, every section is visible and readable.
- [ ] No placeholder text left anywhere, such as `[FORM ENDPOINT]`, sample names or "lorem ipsum".
- [ ] Placeholder photos are either replaced or clearly marked as placeholders in your files, and never captioned as real jobs.
- [ ] No fake reviews, ratings, license numbers, addresses or hours anywhere on the site.
- [ ] The referral disclosure appears near every form and in the footer.
- [ ] The consent line sits directly under the quote button.
- [ ] Test-submit the quote form on a phone and on desktop. The success message shows.
- [ ] The test lead actually arrives in your inbox or CRM, not just "success" on screen.
- [ ] The color tool's "Get a quote for this color" button fills in the Note field, and the attached preview arrives with the lead.
- [ ] Your form endpoint or email settings are entered in Vercel (Project → Settings → Environment Variables), and the site has been redeployed.
- [ ] The "Book a call" link opens your calendar.
- [ ] Your domain is connected in Vercel, and every page's canonical tag matches that domain.
- [ ] The sitemap opens at `https://[DOMAIN]/sitemap.xml` and lists every page you want indexed.
- [ ] The site is verified in Google Search Console, and the sitemap is submitted on the real domain, not the vercel.app address.
- [ ] PageSpeed Insights (mobile) checked on the live URL with your own numbers saved: Performance, Accessibility, SEO and CLS.
- [ ] The "ranking log" is empty or holds real Search Console numbers only.
