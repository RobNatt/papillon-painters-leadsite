/** Sources cited on the two painting-company pages. */
export const leadSources = {
  webtonic: {
    name: "Webtonic, Painting Google Ads Statistics: 35+ PPC Benchmarks for 2026",
    url: "https://www.webtonic.io/blog/painting-google-ads-statistics",
  },
  calls99: {
    name: "99 Calls, Best Lead Generation Options for Painters in 2025",
    url: "https://blog.99calls.com/2025/03/31/best-lead-generation-options-for-painters-in-2025/",
  },
  thumbtackCost: {
    name: "Pipeline Marketing, How Much Does Thumbtack Charge Per Lead? 2026 Cost Breakdown by Trade",
    url: "https://pipeline-marketing.pages.dev/blog/how-much-does-thumbtack-charge-per-lead/",
  },
  housecall: {
    name: "Housecall Pro, Thumbtack vs. Angi",
    url: "https://www.housecallpro.com/resources/thumbtack-vs-angi/",
  },
  googleLocalRanking: {
    name: "Google Business Profile Help, Tips to improve your local ranking on Google",
    url: "https://support.google.com/business/answer/7091",
  },
  googleReviewPolicy: {
    name: "Google Maps user-generated content policy: Fake engagement",
    url: "https://support.google.com/contributionpolicy/answer/7400114",
  },
  ftcReviews: {
    name: "FTC, Final rule banning fake reviews and testimonials (August 2024)",
    url: "https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials",
  },
} as const;

export type LeadSourceId = keyof typeof leadSources;
