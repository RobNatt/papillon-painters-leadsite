/**
 * Ranking proof shown on /how-to-get-painting-leads.
 *
 * Add a row each time you check Google Search Console (Performance → Search
 * results, filter by query, last 28 days). Use real numbers only: this list is
 * shown to painting-company owners as evidence. Newest first.
 *
 * Example row:
 * { date: "2026-12-01", query: "painters papillion ne", position: 8.4,
 *   clicks: 12, impressions: 310, note: "First week on page one" },
 */
export type RankingEntry = {
  date: string; // YYYY-MM-DD
  query: string;
  position: number; // average position from Search Console
  clicks?: number;
  impressions?: number;
  note?: string;
};

export const launchDate = "2026-11-04";

export const rankingLog: RankingEntry[] = [
  // Search Console, 28 days to 11 Nov 2026 (pulled 14 Nov). Small numbers: the site is new.
  { date: "2026-11-11", query: "painting services near me", position: 8.2, clicks: 0, impressions: 4, note: "Searchers near Papillion" },
  { date: "2026-11-11", query: "house painter near me", position: 9.8, clicks: 0, impressions: 6, note: "Searchers near Papillion" },
  { date: "2026-11-11", query: "residential painter near me", position: 10.4, clicks: 0, impressions: 5, note: "Searchers near Papillion" },
];
