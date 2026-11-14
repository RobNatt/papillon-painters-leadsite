/**
 * Blog posts, as data.
 *
 * Added 14 November 2026. Each post answers a question Google shows in its
 * "People also ask" boxes for Omaha-area painting searches. Rules every post
 * keeps (see the brief these were written to):
 *
 * - Papillion Painters is a referral service. No post says it paints, quotes,
 *   employs, vets, licenses or guarantees painters.
 * - Every outside figure links to the page it came from, opened and re-checked
 *   before publishing. Cost figures match the cost page's own sources.
 * - No invented customers, reviews or local stories.
 *
 * Links inside `text` and `items` are written [words](url) and rendered by
 * the blog page. Nothing else is parsed.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  /** Meta description and the card line on the blog index. */
  excerpt: string;
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM-DD, bumped when the body meaningfully changes. */
  dateModified: string;
  /** Who the post is for: decides the call to action at the end. */
  audience: "homeowner" | "painter";
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "cost-to-paint-2000-sq-ft-house-exterior",
    title: "How Much Does It Cost to Paint a 2,000 Sq Ft House Exterior?",
    excerpt: "If a 2,000 sq ft home has about 2,000 sq ft of paintable siding, national per-foot rates put it near $3,000 to $8,740. Here's why.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "homeowner",
    body: [
      { type: "p", text: "If a 2,000 sq ft house has about 2,000 square feet of siding to paint, national rates put the job near $3,000 to $8,740. The typical exterior repaint averages about $3,177, with most falling between $1,800 and $4,500." },
      { type: "p", text: "Those two answers differ because the square footage on your listing is floor area, not wall area. This post explains how to bridge that gap for a home in Papillion or Omaha." },
      { type: "h2", text: "What the national cost data says" },
      { type: "p", text: "NerdWallet reports that [an exterior paint job ranges from about $1,800 to $4,500](https://www.nerdwallet.com/home-ownership/home-improvement/learn/save-on-cost-to-paint-a-house), with an average of $3,177. The same article, updated Feb. 19, 2026, puts the rate at $1.50 to $4 per square foot." },
      { type: "p", text: "HomeWyse puts the [national average at $2.20 to $4.37 per square foot](https://www.homewyse.com/services/cost_to_paint_house_exterior.html) as of May 2026. Its estimate covers removing loose paint, spot priming, caulking and two coats on siding. Trim costs extra." },
      { type: "p", text: "Our [painting cost page and estimator](/interior-exterior-painting-papillion) uses these same sources, so the numbers here will match what you see there." },
      { type: "h2", text: "Floor area is not the same as painted area" },
      { type: "p", text: "Exterior estimates use the painted wall surface, not floor area. [HomeWyse](https://www.homewyse.com/services/cost_to_paint_house_exterior.html) even counts enclosed openings in that total. Your 2,000 square feet describes the floors inside." },
      { type: "p", text: "To estimate the painted surface yourself, measure around the outside of the house. Multiply that distance by the height of the siding, then add the triangles under any gables." },
      { type: "p", text: "Two homes with the same floor area can have very different wall areas. A ranch spreads out, so its walls run long but short. A two-story stacks the same floors on a smaller footprint, so its walls run shorter but twice as tall." },
      { type: "h2", text: "How a 2,000 sq ft home maps onto the rates" },
      { type: "p", text: "Here is the plain math, assuming the painted surface really is about 2,000 square feet. Treat it as a starting point, not a quote." },
      {
        type: "ul",
        items: [
          "NerdWallet low end: 2,000 x $1.50 = $3,000",
          "NerdWallet high end: 2,000 x $4 = $8,000",
          "HomeWyse low end: 2,000 x $2.20 = $4,400",
          "HomeWyse high end: 2,000 x $4.37 = $8,740",
        ],
      },
      { type: "p", text: "[NerdWallet's own table](https://www.nerdwallet.com/home-ownership/home-improvement/learn/save-on-cost-to-paint-a-house) lists $3,000 to $8,000 for 2,000 square feet of exterior space, which matches the first two lines. Notice that this runs well past the top of the $1,800 to $4,500 typical range." },
      { type: "p", text: "That gap is a clue. Many homes have less paintable surface than their floor area, so a typical job lands lower. If your measured surface comes out smaller, multiply that number by the rates instead." },
      { type: "h2", text: "What raises or lowers the price" },
      { type: "p", text: "NerdWallet notes that labor is the largest part of the cost, and much of that time goes to prep. It also says an extra story and the type of siding can make a big difference." },
      {
        type: "ul",
        items: [
          "Stories: multi-story homes need high ladders and sometimes scaffolding, which NerdWallet says can make the work more costly.",
          "Siding: the material changes how much prep and paint the job takes, so ask each painter how they handle yours.",
          "Prep: scraping, patching, sanding and caulking all take hours. Peeling or damaged surfaces add to the bill.",
          "Trim: [HomeWyse](https://www.homewyse.com/services/cost_to_paint_house_exterior.html) prices trim as an extra, so a home with lots of trim, shutters or detail adds labor.",
          "Power washing: HomeWyse lists it as an optional line item, so check whether a quote includes it.",
          "Paint grade: NerdWallet notes premium paints can cover better and last longer, even at a higher price per gallon.",
        ],
      },
      { type: "p", text: "You can trim cost by doing simple prep yourself, such as trimming shrubs back from the walls. NerdWallet also suggests getting several bids and asking each painter to list coats, products and prep in writing." },
      { type: "h2", text: "Timing and value" },
      { type: "p", text: "NerdWallet says spring or fall is the best time to paint an exterior, when weather is milder. Our guide to the [best time to paint a house exterior in Nebraska](/blog/best-time-to-paint-house-exterior-nebraska) covers local timing in more detail." },
      { type: "p", text: "We didn't find a reliable source for how many days a 1,500 or 2,000 sq ft exterior takes, so we won't guess. Ask each painter for a schedule in the quote." },
      { type: "p", text: "Whether paint raises a home's value is another question we couldn't pin to a sourced figure for exteriors. Staying on top of repaints does protect your siding, and our post on [how often to repaint a house](/blog/how-often-to-repaint-a-house) explains the usual cycles." },
      { type: "h2", text: "Getting a real number for your home" },
      { type: "p", text: "National rates are a guide, but your siding, stories and prep decide the final price. The only way to get a firm number is to have a painter look at the house." },
      { type: "p", text: "Papillion Painters is a referral service, not a painting company. When you [request a free quote](/#quote), one independent local painter contacts you, and you decide whether to hire them." },
      { type: "p", text: "Before you compare offers, read our tips on [how to choose a house painter in Papillion](/blog/how-to-choose-a-house-painter-papillion). If you're also planning indoor work, see [what it costs to paint a room](/blog/cost-to-paint-a-room)." },
    ],
  },
  {
    slug: "best-time-to-paint-house-exterior-nebraska",
    title: "When Is the Best Time to Paint a House Exterior in Nebraska?",
    excerpt: "In Papillion and Omaha, May through September is the safest time to paint outside. October can work with low-temperature paint and a dry forecast.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "homeowner",
    body: [
      { type: "p", text: "In Papillion and Omaha, May through September is the safest time to paint a house exterior. In those months, average nighttime lows stay above the 50°F guideline many latex paints follow." },
      { type: "p", text: "October can work with a low-temperature paint and a dry forecast. November through March is usually too cold. We are Papillion Painters, a referral service that connects homeowners with independent local painters." },
      { type: "h2", text: "How cold is too cold for exterior paint?" },
      { type: "p", text: "It depends on the product. [Sherwin-Williams](https://www.sherwin-williams.com/home-builders/products/resources/faqs/exterior-product-application-faqs) says the normal recommendation for latex paint is 50°F, and that traditional latex paints need temperatures above 60°F to cure properly." },
      { type: "p", text: "Some newer paints go lower. [Sherwin-Williams](https://www.sherwin-williams.com/home-builders/products/resources/faqs/exterior-product-application-faqs) lists Duration, Resilience, SuperPaint and A-100 Exterior as products that can be applied and cure as low as 35°F. [Benjamin Moore](https://www.benjaminmoore.com/en-us/product/aura-exterior-paint-flat/N629) lists an application range of 35°F to 100°F for Aura Exterior Flat." },
      { type: "p", text: "So the real answer is on the can your painter plans to use. Ask which product it is and what its temperature range is before you set a date." },
      { type: "h2", text: "What Omaha weather looks like month by month" },
      { type: "p", text: "NOAA's [1991 to 2020 climate normals for Omaha Eppley Airfield](https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00014942.csv) give the long-term average high and low for each month. They are measured at the airport, so treat them as a general guide for the metro, Papillion included." },
      {
        type: "ul",
        items: [
          "March: average high 52.1°F, average low 30.0°F",
          "April: high 64.1°F, low 41.1°F",
          "May: high 74.6°F, low 52.7°F",
          "June: high 84.4°F, low 63.4°F",
          "July: high 88.1°F, low 68.0°F",
          "August: high 85.8°F, low 65.6°F",
          "September: high 79.1°F, low 56.1°F",
          "October: high 65.5°F, low 43.2°F",
          "November: high 50.3°F, low 30.2°F",
        ],
      },
      { type: "p", text: "From May through September, the normal low stays above 50°F. On a typical day in those months, paint stays above the standard latex guideline even overnight." },
      { type: "h2", text: "Is October too late to paint outside?" },
      { type: "p", text: "Not always, but it takes more care. October's normal high is 65.5°F, while its normal low is 43.2°F, below the 50°F guideline for standard latex." },
      { type: "p", text: "That makes October a better fit for paints rated down to 35°F, applied in the warmest part of the day. By November the normal low is 30.2°F, which is below even those ratings." },
      { type: "p", text: "Normals are long-term averages, so any given week can run much warmer or colder. Check the forecast for the days after painting, not just the day itself." },
      { type: "h2", text: "Why dew, rain and night lows matter" },
      { type: "p", text: "Paint needs more than one warm afternoon. [Sherwin-Williams](https://www.sherwin-williams.com/home-builders/products/resources/faqs/exterior-product-application-faqs) says the temperature should ideally stay in the suggested range and above the dew point for at least 48 hours after application." },
      { type: "p", text: "Dew is the hidden problem in spring and fall. [Sherwin-Williams](https://www.sherwin-williams.com/home-builders/products/resources/faqs/exterior-product-application-faqs) notes that dew forms on almost everything once the sun goes down. Most products need at least 4 hours of dry time before moisture settles on them." },
      { type: "p", text: "It also names a common mistake: painting on a day above 50°F when the night drops below 35°F. In practice, that means finishing early enough for the paint to dry before evening dew or rain arrives." },
      { type: "h2", text: "When should you not do exterior painting?" },
      {
        type: "ul",
        items: [
          "When the air or surface temperature is below the minimum listed for the product.",
          "When nights in the next couple of days will fall below the product's rating.",
          "When rain or heavy dew is likely before the paint has had at least 4 hours to dry.",
          "On very hot, dry days. [Sherwin-Williams](https://www.sherwin-williams.com/en-us/project-center/maintenance-repair/how-to-fix-paint-flaking) says paint that dries too quickly, often from high heat and low humidity, can crack.",
          "Above the product's maximum. [Benjamin Moore](https://www.benjaminmoore.com/en-us/product/aura-exterior-paint-flat/N629) lists 100°F as the top of the range for Aura Exterior Flat.",
          "When the siding is wet, dirty or flaking. Sherwin-Williams says surfaces should be clean and dry before painting.",
        ],
      },
      { type: "h2", text: "What is the best month to paint a house in Omaha?" },
      { type: "p", text: "By the numbers, June through August have the warmest nights, with normal lows of 63.4°F to 68.0°F. July also brings the hottest afternoons, with a normal high of 88.1°F, so plan around the worst heat." },
      { type: "p", text: "May and September offer milder highs with lows still above 50°F. May is also wet, with a [normal 4.66 inches of rain](https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00014942.csv), so build a few spare days into the schedule." },
      { type: "p", text: "Starting early gives you more choice of dates. Still weighing the budget? See [what it costs to paint a 2,000 sq ft exterior](/blog/cost-to-paint-2000-sq-ft-house-exterior) and [how often a house needs repainting](/blog/how-often-to-repaint-a-house)." },
      { type: "h2", text: "Planning your exterior project" },
      { type: "p", text: "Before you hire, read [how to choose a house painter in Papillion](/blog/how-to-choose-a-house-painter-papillion). Ask each painter which paint they will use and what its temperature range is." },
      { type: "p", text: "When you are ready, [request a free quote](/#quote). One independent local painter contacts you, and you decide whether to hire." },
    ],
  },
  {
    slug: "how-often-to-repaint-a-house",
    title: "How Often Should a House Be Repainted, Inside and Out?",
    excerpt: "Most exteriors need repainting every 3 to 10 years depending on siding, and most interior walls every 3 to 5 years. Here are the signs it is time.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "homeowner",
    body: [
      { type: "p", text: "Most house exteriors need repainting every 3 to 10 years, and most interior walls every 3 to 5 years. The exact timing depends on the siding, the room, the paint and the weather." },
      { type: "p", text: "We are Papillion Painters, a referral service for homeowners in Papillion and the Omaha area. Here is what published sources say about timing, warning signs and painting over old paint." },
      { type: "h2", text: "How often should a house exterior be repainted?" },
      { type: "p", text: "[Nationwide](https://www.nationwide.com/lc/resources/home/articles/when-to-paint-your-house) says exterior paint can last anywhere from 3 to 20 years. Paint quality, siding type and location all change the number." },
      { type: "p", text: "It gives these rough intervals by siding:" },
      {
        type: "ul",
        items: [
          "Wood siding: every 3 to 7 years.",
          "Stucco and vinyl: about every 10 years.",
        ],
      },
      { type: "p", text: "If your siding is something else, such as fiber cement or brick, ask the painter or the siding maker. We did not find a source we trust for those figures." },
      { type: "h2", text: "Does Nebraska weather shorten paint life?" },
      { type: "p", text: "Weather plays a big part. Nationwide lists strong sunlight, harsh winters, extreme humidity and storms among the causes of paint damage." },
      { type: "p", text: "It also says caulk can lose its stretch as sunny days alternate with freezing nights. In regions with heavy rain and snow seasons, it notes paint can wear out faster." },
      { type: "p", text: "Omaha qualifies on the cold side. NOAA's [1991 to 2020 normals](https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00014942.csv) put the average January low at Eppley Airfield at 15.2°F. Check your paint and caulk each spring, and see [the best time to paint in Nebraska](/blog/best-time-to-paint-house-exterior-nebraska) before you book." },
      { type: "h2", text: "How often do you need to paint a house interior?" },
      { type: "p", text: "[Family Handyman](https://www.familyhandyman.com/list/signs-time-repaint-walls/) says interior walls usually need repainting every three to five years or so. High-traffic areas may need it sooner, and quiet rooms can go longer." },
      { type: "p", text: "Room-by-room figures vary a lot from source to source, so we left them out. Judge each room by how it looks and how it cleans." },
      { type: "p", text: "A useful habit is to walk each room once a year in good daylight. Look for faded patches near windows, marks that will not wash off, and any bubbling near bathrooms or the kitchen." },
      { type: "p", text: "If you are pricing a single room, see [what it costs to paint a room](/blog/cost-to-paint-a-room)." },
      { type: "h2", text: "Signs it is time to repaint" },
      { type: "p", text: "Outside, Nationwide points to signs like these:" },
      {
        type: "ul",
        items: [
          "Flaking, bubbling or cracking paint, which can point to rot or mold behind it.",
          "Caulk that has gone stiff, cracked, split or pulled away.",
          "Fading, especially on darker colors.",
          "Trim that no longer stands out from the siding.",
        ],
      },
      { type: "p", text: "Chalking is another clue. [Sherwin-Williams](https://www.sherwin-williams.com/en-us/project-center/maintenance-repair/paint-chalking) describes it as fine white powder that forms on exterior paint as it weathers." },
      { type: "p", text: "Inside, Family Handyman lists fading color, bubbled paint, and stains or scuffs that will not clean off. Bubbles can mean trapped moisture, so fix the source first." },
      { type: "h2", text: "Can I just paint over old exterior paint?" },
      { type: "p", text: "Only if it is sound and clean. [Sherwin-Williams](https://www.sherwin-williams.com/en-us/project-center/maintenance-repair/how-to-fix-paint-flaking) says painting over flaking paint leads to poor adhesion and more peeling." },
      { type: "p", text: "Its advice is to scrape off loose paint, sand the edges, and use a primer that seals and stabilizes peeling or chalky surfaces. Surfaces should be clean and dry before painting." },
      { type: "p", text: "Chalk should be rinsed or power washed off with a suitable cleaner, rinsed with clean water and left to dry, according to Sherwin-Williams." },
      { type: "h2", text: "What are signs of a bad paint job?" },
      { type: "p", text: "Some failures trace back to how the paint went on. Sherwin-Williams says cracking is often linked to poor surface prep or paint applied too thickly or unevenly." },
      { type: "p", text: "Its [exterior troubleshooting FAQ](https://www.sherwin-williams.com/architects-specifiers-designers/planks-work-platforms/resources/faqs/exterior-troubleshooting-faqs) says the most common cause of alligatoring is a paint film that is too thick. It also advises letting caulk dry fully before painting over it." },
      { type: "p", text: "Paint that was thinned too much or spread too thin can also chalk heavily, per Sherwin-Williams. Early peeling, cracking or heavy chalk on a fairly new job is worth asking the painter about." },
      { type: "h2", text: "Planning your next repaint" },
      { type: "p", text: "If these signs sound familiar, read [how to choose a house painter in Papillion](/blog/how-to-choose-a-house-painter-papillion). Our [cost page and estimator](/interior-exterior-painting-papillion) can give you a starting budget." },
      { type: "p", text: "When you are ready, [request a free quote](/#quote). One independent local painter contacts you, and you decide whether to hire." },
    ],
  },
  {
    slug: "repaint-or-replace-kitchen-cabinets",
    title: "Is It Cheaper to Repaint or Replace Kitchen Cabinets?",
    excerpt: "Painting is usually cheaper. Fixr puts professional cabinet painting at a $4,000 average, about half the $8,000 average to replace cabinets.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "homeowner",
    body: [
      { type: "p", text: "Repainting kitchen cabinets is usually much cheaper than replacing them. [Fixr's 2026 cabinet painting guide](https://www.fixr.com/costs/paint-kitchen-cabinets) puts professional painting at an average of $4,000, about half its $8,000 average for replacement." },
      { type: "p", text: "Painting only pays off when the cabinet boxes are still solid, though. Below are the costs, the timeline, the honest downsides and the cases where new cabinets are the better buy." },
      { type: "p", text: "We are Papillion Painters, a referral service that connects homeowners in Papillion and Omaha with independent local painters. We don't paint cabinets ourselves, so the numbers here come from published cost guides." },
      { type: "h2", text: "What painting, refacing and replacing cost" },
      { type: "p", text: "Fixr's guide, updated January 27, 2026, gives these national figures for an average-sized kitchen:" },
      {
        type: "ul",
        items: [
          "Painting: $2,500 to $6,500, with a national average of $4,000.",
          "Refacing (new doors and drawer fronts on the existing boxes): an average of $8,250.",
          "Replacement: an average of $8,000.",
        ],
      },
      { type: "p", text: "Refacing and replacement land close together in that guide, and both run about double the painting average. Your own quotes will depend on kitchen size, the cabinets you choose and how much prep the job needs." },
      { type: "p", text: "The guide isn't perfectly consistent, either. Its FAQ lists different painting and replacement figures than the main text, so treat any national average as a starting point, not a price." },
      { type: "h2", text: "How much does it cost to have your kitchen cabinets sprayed?" },
      { type: "p", text: "Fixr prices most professional cabinet painting at $3 to $10 per square foot, or $30 to $70 per linear foot of cabinetry. Some contractors charge by the piece instead:" },
      {
        type: "ul",
        items: [
          "$70 to $125 per door",
          "$30 to $110 per drawer front",
          "$75 to $150 per cabinet",
        ],
      },
      { type: "p", text: "On spraying, Fixr says a sprayer means longer prep but easier application. It adds that spraying is often cheaper than brushing. Ask each painter whether they spray or brush, and whether doors get painted off site." },
      { type: "h2", text: "How long does it take a professional to paint kitchen cabinets?" },
      { type: "p", text: "Fixr says a professional can typically prep and paint an average kitchen's cabinets in four to five days. Plan on part of your kitchen being out of use for that stretch." },
      { type: "p", text: "Drying time is a big reason why. [Benjamin Moore's page for its Advance paint](https://www.benjaminmoore.com/en-us/product/N794), lists it for cabinet projects. It gives a dry time of 4 to 6 hours and a recoat time of 16 hours." },
      { type: "p", text: "The same page lists an application range of 50 to 90 degrees F. That matters in a Nebraska winter if doors are sprayed in a garage, so ask where the work happens. Exterior jobs have their own season, covered in [the best time to paint a house exterior in Nebraska](/blog/best-time-to-paint-house-exterior-nebraska)." },
      { type: "h2", text: "What are the downsides of painting kitchen cabinets?" },
      { type: "p", text: "Painted cabinets are not a forever finish. [Fixr's FAQ](https://www.fixr.com/costs/paint-kitchen-cabinets) says professionally painted cabinets can last 8 to 10 years with proper care. Its main text says 5 to 10 years." },
      {
        type: "ul",
        items: [
          "Chipping and peeling. Fixr says painting needs extensive preparation to avoid both, so rushed cleaning, sanding or priming shows up fast.",
          "Paint tradeoffs. Fixr notes latex is less durable and needs more touch-ups, while oil-based paint shows imperfections more readily.",
          "Sheen. Matte and satin finishes are harder to clean and more likely to stain, according to the same guide.",
          "Downtime. Several days of work plus drying between coats means a disrupted kitchen.",
          "Paint can't fix structure. Sagging shelves, swollen boxes or a layout you dislike will still be there afterward.",
        ],
      },
      { type: "p", text: "Cabinets take more daily wear than most walls. For how long other painted surfaces typically hold up, see [how often to repaint a house](/blog/how-often-to-repaint-a-house)." },
      { type: "h2", text: "When replacing makes more sense" },
      { type: "p", text: "Paint changes the color, not the construction. Replacement is usually the better call when:" },
      {
        type: "ul",
        items: [
          "The boxes are water-damaged, warped or coming apart, often under the sink.",
          "You want a new layout, more storage or different cabinet sizes.",
          "You're already redoing countertops and floors and want everything new at once.",
          "You dislike the door style itself, which paint won't change.",
        ],
      },
      { type: "p", text: "Refacing sits in between: new doors and fronts on the boxes you already have. If the boxes are solid and you just want a fresh color, painting is the cheaper path by a wide margin." },
      { type: "p", text: "Painting walls at the same time? See [what it costs to paint a room](/blog/cost-to-paint-a-room) or try the estimator on our [interior and exterior painting cost page](/interior-exterior-painting-papillion)." },
      { type: "h2", text: "Getting a cabinet painting quote in Papillion" },
      { type: "p", text: "Before comparing quotes, read [how to choose a house painter in Papillion](/blog/how-to-choose-a-house-painter-papillion). Ask every painter what prep is included, which paint they'll use and how long your kitchen will be out of service." },
      { type: "p", text: "When you're ready, [request a free quote](/#quote). One independent local painter contacts you, and you decide whether to hire." },
    ],
  },
  {
    slug: "how-to-choose-a-house-painter-papillion",
    title: "How Do I Choose a House Painter in Papillion?",
    excerpt: "Check Nebraska contractor registration, insurance proof, a written estimate and, for pre-1978 homes, EPA lead-safe certification before you hire.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "homeowner",
    body: [
      { type: "p", text: "To choose a house painter in Papillion, check state registration, insurance proof, a written estimate and, for pre-1978 homes, EPA lead-safe certification. Then compare at least two quotes on scope, not just price." },
      { type: "p", text: "We are Papillion Painters, a referral service. We pass quote requests to independent local painters, but we don't vet, license or insure them, so these checks are yours to make." },
      { type: "h2", text: "Is a contractor's license required in Nebraska?" },
      { type: "p", text: "Nebraska requires contractors to register with the state. The [Nebraska Department of Labor's contractor page](https://dol.nebraska.gov/LaborStandards/Contractors) says all contractors doing business in Nebraska must register with the department." },
      { type: "p", text: "That page describes registration, not a painting license. Registration is a baseline, not a seal of approval. The page says it \"does not ensure quality of work or protect against fraud.\"" },
      { type: "p", text: "We couldn't find an official Papillion or Sarpy County page that sets a separate painter license. If you want to be certain about local rules, ask the City of Papillion directly." },
      { type: "h2", text: "How can I access the Nebraska contractor database?" },
      { type: "p", text: "Use the state's free [Search Registered Contractors and Subcontractors](https://dol.nebraska.gov/conreg/Search) tool. You can search by business (DBA) name, corporation name, city, zip code, phone number or registration number." },
      { type: "p", text: "It also has county and NAICS code filters, so you can narrow results to Sarpy County. Search the exact business name on your estimate, since the state requires a separate registration number for each name a contractor uses." },
      { type: "p", text: "If a painter doesn't show up in the search, ask why before you hire. Don't take a verbal answer as a substitute for checking." },
      { type: "h2", text: "What insurance should a painter carry?" },
      { type: "p", text: "Ask for a certificate of insurance, not just a yes. We can't give legal or insurance advice, but these are the two coverages homeowners most often ask to see:" },
      {
        type: "ul",
        items: [
          "General liability. Ask for a current certificate showing the insurer, policy dates and coverage limits. This is the policy that typically applies if the crew damages your property.",
          "Workers' compensation. The [state's contractor page](https://dol.nebraska.gov/LaborStandards/Contractors) says contractors with one or more employees must file a current Workers' Compensation Certificate of Insurance. If anyone besides the owner will work on your home, ask to see that proof too.",
        ],
      },
      { type: "p", text: "You can call the insurer named on a certificate to confirm the policy is active. If you're unsure what coverage protects you, ask your own insurance agent." },
      { type: "h2", text: "Do I need a lead-safe certified painter?" },
      { type: "p", text: "If your home was built before 1978 and the job will disturb painted surfaces, yes. [EPA's Renovation, Repair and Painting page](https://www.epa.gov/lead/renovation-repair-and-painting-program) says anyone paid to disturb paint in homes built before 1978 must be certified, even sole proprietors." },
      { type: "p", text: "EPA also says workers must be trained, either as certified renovators or on the job by a certified renovator, in lead-safe practices. EPA recommends homeowners hire a lead-safe certified contractor." },
      { type: "p", text: "You can look up firms with EPA's [lead-safe certified firm search](https://cdxocsppapps.epa.gov/ocspp-oppt-lead/firm-location-search). Ask the painter for their firm certification and the name of the certified renovator on your job." },
      { type: "h2", text: "Questions to ask before you hire" },
      {
        type: "ul",
        items: [
          "What is your exact business name, so I can find you in the Nebraska contractor search?",
          "Can you send a certificate of insurance for general liability, and workers' comp if you have employees?",
          "If my home was built before 1978, is your firm EPA lead-safe certified?",
          "Will the written estimate list every surface, the prep work, the number of coats and the exact paint product?",
          "Who will be on site each day, and who is my contact if something goes wrong?",
          "How much is due up front, and when is the rest due?",
          "Is there a written warranty, and what does it cover?",
          "When can you start, and how do you handle weather delays?",
        ],
      },
      { type: "p", text: "Timing questions matter here, since Nebraska weather limits exterior work. See [the best time to paint a house exterior in Nebraska](/blog/best-time-to-paint-house-exterior-nebraska). For budget context, see [what it costs to paint a 2,000 sq ft house exterior](/blog/cost-to-paint-2000-sq-ft-house-exterior)." },
      { type: "h2", text: "What are signs of a bad paint job?" },
      {
        type: "ul",
        items: [
          "Drips, runs or sags in the finish.",
          "Visible brush or roller marks, or patchy, uneven color.",
          "Paint on glass, hardware, floors, siding or plants that should have been covered.",
          "Ragged lines where walls meet trim or ceilings.",
          "Missed spots behind fixtures, under eaves or along the tops of trim.",
          "Peeling or bubbling soon after the job, which often points to poor prep.",
        ],
      },
      { type: "p", text: "Walk the finished job with the painter before the final payment. Point out problems then, while the crew and materials are still around." },
      { type: "p", text: "A good job should also last. For realistic timelines, see [how often to repaint a house](/blog/how-often-to-repaint-a-house), and for a kitchen project, [whether to repaint or replace kitchen cabinets](/blog/repaint-or-replace-kitchen-cabinets)." },
      { type: "h2", text: "Getting a quote in Papillion or Omaha" },
      { type: "p", text: "If you'd like a starting point, [request a free quote](/#quote). One independent local painter contacts you, you run the checks above, and you decide whether to hire." },
    ],
  },
  {
    slug: "cost-to-paint-a-room",
    title: "How Much Does It Cost to Paint a Room?",
    excerpt: "Painting a room costs about $1,100 on average, with most paying $400 to $1,600, per Angi. A 12x12 room runs about $290 to $870.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "homeowner",
    body: [
      { type: "p", text: "Painting a room costs about $1,100 on average, and most homeowners pay $400 to $1,600. A 12x12 room runs about $290 to $870 at typical professional rates." },
      { type: "p", text: "Room size, ceiling height, paint type and the number of coats drive where you land. Here is how the numbers work for a room in Papillion or Omaha." },
      { type: "h2", text: "The national averages" },
      { type: "p", text: "Angi's room cost guide, updated Oct. 28, 2026, puts the [national average cost to paint a room at $1,100](https://www.angi.com/articles/how-much-does-it-cost-paint-room.htm). It says most homeowners spend $400 to $1,600, and pros often charge $2 to $6 per square foot." },
      { type: "p", text: "Angi's whole-house guide adds more detail. It lists a [national average of $2.75 per square foot for walls alone](https://www.angi.com/articles/how-much-does-it-cost-paint-interior-house.htm), and $4.70 when walls, trim and ceilings are included." },
      { type: "p", text: "[Angi's room cost guide](https://www.angi.com/articles/how-much-does-it-cost-paint-room.htm) breaks costs down by size:" },
      {
        type: "ul",
        items: [
          "10x10: $200 to $600",
          "10x12: $240 to $720",
          "12x12: $290 to $870",
          "14x16: $450 to $1,350",
          "16x16: $515 to $1,540",
        ],
      },
      { type: "h2", text: "What a painter would charge for a 12x12 room" },
      { type: "p", text: "Angi's room-size figures line up with its $2 to $6 rate multiplied by the floor area. Here is the arithmetic, step by step." },
      {
        type: "ul",
        items: [
          "Floor area: 12 ft x 12 ft = 144 sq ft",
          "Low end: 144 x $2 = $288, which rounds to Angi's $290",
          "High end: 144 x $6 = $864, which rounds to Angi's $870",
          "Walls only at $2.75: 144 x $2.75 = $396",
          "Walls, trim and ceiling at $4.70: 144 x $4.70 = $676.80",
        ],
      },
      { type: "p", text: "So a plain 12x12 bedroom, walls only, would likely land near $400. Adding the ceiling and trim pushes it toward $680. Repairs, tall ceilings or dark colors can push it higher." },
      { type: "h2", text: "How much it costs to paint trim and doors" },
      { type: "p", text: "Angi puts [trim, baseboards, crown molding and windows at $1 to $3 per linear foot](https://www.angi.com/articles/how-much-does-it-cost-paint-room.htm). Ornate or hard-to-reach trim can run up to $6 per linear foot." },
      { type: "p", text: "A 12x12 room has 48 feet of wall around it (12 x 4 = 48). At $1 to $3 per foot, baseboards would cost about $48 to $144, before subtracting the doorway." },
      { type: "p", text: "Angi's room guide doesn't list a separate price per door, so we won't quote one. Ask your painter to show doors as their own line item. Angi also notes that skipping the trim and painting only walls often cuts the total in half." },
      { type: "h2", text: "How many coats of paint you need" },
      { type: "p", text: "Angi says that [in most cases you'll apply two coats](https://www.angi.com/articles/how-much-does-it-cost-paint-room.htm). Going from a dark color to a lighter one typically needs extra coats for full coverage." },
      { type: "p", text: "Each added coat costs an average of $50 to $70 per 300 to 400 square feet of wall, in materials and labor combined. Angi's whole-house guide also suggests primer when painting a light color over a dark one." },
      { type: "p", text: "To estimate paint, add up the wall lengths and multiply by the height. With standard 8-foot walls, a 12x12 room has 48 x 8 = 384 sq ft of wall. At 300 to 400 sq ft per gallon, that's roughly one gallon per coat, or two gallons for two coats." },
      { type: "h2", text: "Other things that change the price" },
      {
        type: "ul",
        items: [
          "Ceilings: Angi says painting a ceiling adds $1 to $6 per square foot, with cathedral ceilings at the high end.",
          "Wall repairs: drywall repair typically runs $300 to $900, averaging about $600.",
          "Moving furniture: extra labor can run $25 to $50 per hour, though it's often included.",
          "Season: Angi notes fall and winter are slower for painters, which can help you get a lower rate.",
          "Older homes: homes built before 1980 commonly contain lead paint, and Angi lists a lead inspection at $200 to $400.",
        ],
      },
      { type: "p", text: "On timing, Angi says a professional team can often paint a single room in about two days. If you're weighing a bigger kitchen project, see our post on whether to [repaint or replace kitchen cabinets](/blog/repaint-or-replace-kitchen-cabinets)." },
      { type: "h2", text: "Getting a quote for your room" },
      { type: "p", text: "Our [cost page and estimator](/interior-exterior-painting-papillion) uses these same Angi figures for a quick ballpark. A painter seeing the room in person will give you a real number." },
      { type: "p", text: "Papillion Painters is a referral service, not a painting company. When you [ask for a free quote](/#quote), one independent local painter contacts you, and you decide whether to hire." },
      { type: "p", text: "Before you hire, read [how to choose a house painter in Papillion](/blog/how-to-choose-a-house-painter-papillion). Planning outside work too? See [what it costs to paint a 2,000 sq ft exterior](/blog/cost-to-paint-2000-sq-ft-house-exterior) and [how often to repaint a house](/blog/how-often-to-repaint-a-house)." },
    ],
  },
  {
    slug: "how-to-advertise-a-painting-business",
    title: "What Is the Best Way to Advertise a Painting Business?",
    excerpt: "Start with a complete Google Business Profile, steady reviews and a website that ranks locally. Then add paid ads and referrals once those basics work.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "painter",
    body: [
      { type: "p", text: "The best way to advertise a painting business is to be easy to find on Google when homeowners search near you. That means a complete Google Business Profile, a steady flow of real reviews, and a website that ranks for local searches." },
      { type: "p", text: "Paid ads, referrals and yard signs all help, but they work best on top of that base. This post explains each channel and how to weigh them." },
      { type: "p", text: "A quick note on who we are. Papillion Painters is a referral service run by N-Tech Digital Solutions, an Omaha web design and SEO company. We pass homeowner quote requests to independent local painters, so we watch this question closely." },
      { type: "h2", text: "Your Google Business Profile comes first" },
      { type: "p", text: "Google says local results are based mainly on relevance, distance and popularity. Its help page on [how Google ranks local results](https://support.google.com/business/answer/7091) explains all three." },
      { type: "p", text: "Relevance is how well your profile matches the search. Distance is how far you are from the searcher. Prominence is how well known your business is." },
      { type: "p", text: "Google also states that businesses with complete and accurate info are more likely to show up. It adds that you cannot request or pay for a better local ranking." },
      {
        type: "ul",
        items: [
          "Pick the right primary category and list every service you offer.",
          "Set your real service area, such as Papillion, La Vista, Bellevue and Omaha.",
          "Add hours, a phone number that is answered, and photos of finished jobs.",
          "Keep the business name, address and phone the same everywhere online.",
        ],
      },
      { type: "h2", text: "Reviews are part of how Google ranks you" },
      { type: "p", text: "The same Google page says more reviews and positive ratings can help your local ranking. Reviews also help the homeowner who is comparing three painters on one screen." },
      { type: "p", text: "Google's [tips to get more reviews](https://support.google.com/business/answer/3474122) suggest sending customers a review link or QR code. Ask at the final walkthrough, while the customer is happy with the job." },
      { type: "p", text: "Reply to every review, short and polite. Google prohibits offering free or discounted services in exchange for reviews, so never trade a discount for one." },
      { type: "h2", text: "A website that ranks for local searches" },
      { type: "p", text: "Your profile gets you into the map results. A website lets you show up in the regular results too, and gives Google more reasons to trust you." },
      { type: "p", text: "The pages that tend to work are simple. One page per service, one page per main town you serve, and price ranges where you can give them." },
      { type: "p", text: "Helpful articles also earn searches. Homeowners look up the [cost to paint a 2,000 sq ft exterior](/blog/cost-to-paint-2000-sq-ft-house-exterior) or the [best time to paint in Nebraska](/blog/best-time-to-paint-house-exterior-nebraska). Answering those questions puts your name in front of buyers early." },
      { type: "p", text: "Here is our own small, honest result. From 16 Aug to 11 Nov 2026, Search Console showed our home page at an average position of 9.8 for \"house painter near me\"." },
      { type: "p", text: "It averaged 8.2 for \"painting services near me\", from searchers near Papillion. Those were tiny numbers: 6 and 3 impressions, with 0 clicks." },
      { type: "p", text: "It is not a lead machine yet. It does show that a new, focused local site can reach page one for these searches." },
      { type: "h2", text: "Local Services Ads charge per lead" },
      { type: "p", text: "Local Services Ads appear at the top of some Google searches. Google's [getting started page](https://support.google.com/localservices/answer/6224841) says you pay only for leads related to your business and services." },
      { type: "p", text: "A lead is a homeowner calling or messaging you through the ad. Google also warns that not answering calls or messages regularly can affect how your ad ranks." },
      { type: "p", text: "That makes these ads a good fit for owners who answer the phone fast. If calls go to voicemail for a day, you pay for leads you then lose." },
      { type: "h2", text: "Referrals and yard signs still work" },
      { type: "p", text: "Word of mouth costs little and brings buyers who already trust you. Ask happy customers directly, and leave a card or send a short text with your number." },
      { type: "p", text: "A yard sign on an active job is seen by neighbors who live in similar homes. Check that the homeowner is fine with it, and check any neighborhood rules first." },
      { type: "p", text: "Both channels feed the others. A neighbor who sees your sign often looks you up on Google before calling, so your reviews still matter." },
      { type: "h2", text: "Paid lead marketplaces are a trade-off" },
      { type: "p", text: "Lead marketplaces can fill a slow calendar quickly. The trade-off is that you often compete with other painters for the same homeowner." },
      { type: "p", text: "You also build their brand, not yours. When you stop paying, the leads usually stop too." },
      { type: "p", text: "Treat them as a top-up while your own profile and website grow. Track every job they produce so you know the real cost of each customer." },
      { type: "h2", text: "Where to start this month" },
      { type: "p", text: "Fix your Google profile, ask your last ten customers for reviews, and make sure your website covers each service and town. Then add paid ads if you can answer every lead fast." },
      { type: "p", text: "Our guide on [how to get painting leads](/how-to-get-painting-leads) goes deeper into the lead side. To see what homeowners care about, read [how homeowners choose a house painter](/blog/how-to-choose-a-house-painter-papillion)." },
      { type: "p", text: "For the bigger picture on the market, see [whether painters are in demand](/blog/are-painters-in-demand). If your website is the weak link, see what goes into [websites for painting companies](/websites-for-painting-companies)." },
    ],
  },
  {
    slug: "are-painters-in-demand",
    title: "Are Painters in High Demand?",
    excerpt: "Steady, not booming. BLS projects 3 percent growth for painters from 2025 to 2035, with about 24,900 openings a year, mostly to replace workers who leave.",
    date: "2026-11-14",
    dateModified: "2026-11-14",
    audience: "painter",
    body: [
      { type: "p", text: "Painters are in steady demand, not booming demand. The US Bureau of Labor Statistics projects painter jobs to grow 3 percent from 2025 to 2035, with about 24,900 openings each year." },
      { type: "p", text: "For a painting-business owner, that means homeowners keep needing painters year after year. The work is there, but you still have to be the company they find." },
      { type: "p", text: "We are Papillion Painters, a referral service that passes homeowner quote requests in Papillion and Omaha to independent local painters. Here is what the federal numbers say, and what to do with them." },
      { type: "h2", text: "What the Bureau of Labor Statistics says" },
      { type: "p", text: "These figures come from the BLS Occupational Outlook Handbook page for [painters, construction and maintenance](https://www.bls.gov/ooh/construction-and-extraction/painters-construction-and-maintenance.htm)." },
      {
        type: "ul",
        items: [
          "Median pay: $49,400 per year, or $23.75 per hour, in May 2025.",
          "Jobs: 326,900 in 2025.",
          "Projected growth: 3 percent from 2025 to 2035, an increase of 9,800 jobs.",
          "Openings: about 24,900 a year, on average, over the decade.",
          "Self-employed: about 31 percent of painters.",
        ],
      },
      { type: "p", text: "So roughly three in ten painters work for themselves. Many of them run small companies that compete for the same local jobs you do." },
      { type: "h2", text: "Why openings outpace growth" },
      { type: "p", text: "Growth adds only 9,800 jobs over ten years. Yet BLS expects about 24,900 openings every single year." },
      { type: "p", text: "BLS says many openings come from replacing workers who move to other jobs or leave the labor force, such as by retiring. The trade keeps losing experienced people." },
      { type: "p", text: "For an owner, this cuts two ways. Hiring good painters can be hard. But as older companies close, their customers need someone new." },
      { type: "h2", text: "What this means for Omaha-area owners" },
      { type: "p", text: "We looked for Nebraska and Omaha painter figures from BLS, but could not open a page that showed them. So we will not guess at local numbers here." },
      { type: "p", text: "What we can say is that local demand follows local homes. Every house in Papillion, Bellevue and Omaha needs repainting on a cycle, as our post on [how often to repaint a house](/blog/how-often-to-repaint-a-house) explains." },
      { type: "p", text: "Nebraska weather also squeezes exterior work into a shorter window. Our post on the [best time to paint a house exterior in Nebraska](/blog/best-time-to-paint-house-exterior-nebraska) covers that timing." },
      { type: "h2", text: "Demand only helps if homeowners find you" },
      { type: "p", text: "Steady demand does not spread evenly. Homeowners often search on Google, compare a few names, and call the ones that look trustworthy." },
      { type: "p", text: "Companies with a complete Google Business Profile, recent reviews and a clear website tend to get those calls. Busy painters without them often rely on referrals alone." },
      { type: "p", text: "Referrals are great, but they are hard to grow on purpose. Search is where you can add more demand when you want it." },
      { type: "h2", text: "How to capture more of that demand" },
      {
        type: "ul",
        items: [
          "Answer every call and message the same day. A slow reply hands the job to the next painter.",
          "Ask each happy customer for a Google review at the final walkthrough.",
          "Show price ranges on your site, so homeowners know you fit their budget.",
          "Fill slow months with interior work, such as rooms and cabinets.",
          "Know your crew's capacity, so you only advertise what you can deliver.",
        ],
      },
      { type: "p", text: "Interior jobs are a good off-season target. Homeowners search for the [cost to paint a room](/blog/cost-to-paint-a-room) and [whether to repaint or replace kitchen cabinets](/blog/repaint-or-replace-kitchen-cabinets)." },
      { type: "p", text: "Our post on [how to advertise a painting business](/blog/how-to-advertise-a-painting-business) walks through each marketing channel in more detail." },
      { type: "h2", text: "Hiring is part of the same problem" },
      { type: "p", text: "More demand is only useful if you can staff the jobs. Since many openings come from people leaving the trade, keeping good painters matters as much as finding new ones." },
      { type: "p", text: "The BLS median of $23.75 an hour gives you a national benchmark when you set wages. Local rates may differ." },
      { type: "p", text: "Plan marketing and hiring together. More leads than your crew can handle means slow replies and lost jobs." },
      { type: "h2", text: "Turning demand into booked jobs" },
      { type: "p", text: "The numbers say the work will keep coming. The owners who win it are the ones homeowners can find and reach quickly." },
      { type: "p", text: "For a practical next step, our guide on [how to get painting leads](/how-to-get-painting-leads) lays out where Omaha-area painters can find more homeowners." },
    ],
  },
];

export const blogPath = "/blog";

export function postPath(slug: string) {
  return `${blogPath}/${slug}`;
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** Outside URLs cited in a post, for the Article schema's `citation`. */
export function postCitations(post: Post): string[] {
  const urls = new Set<string>();
  for (const b of post.body) {
    const texts = b.type === "ul" ? b.items : [b.text];
    for (const t of texts) {
      for (const m of t.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(m[1]);
    }
  }
  return [...urls];
}

/** Reading time at 238 words a minute, link URLs excluded. */
export function readingMinutes(post: Post): number {
  const words = post.body
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.text))
    .join(" ")
    .replace(/\]\([^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 238));
}
