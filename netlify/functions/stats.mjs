import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = new URL(req.url);
  const secret = url.searchParams.get("key");

  if (secret !== Netlify.env.get("ANALYTICS_KEY")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const store = getStore("analytics");
  const days = parseInt(url.searchParams.get("days") || "7");
  const results = [];

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `daily:${d.toISOString().split("T")[0]}`;
    const data = await store.get(key, { type: "json" });
    if (data) results.push(data);
  }

  const totals = {
    period: `${days} days`,
    totalViews: results.reduce((s, d) => s + d.views, 0),
    totalEmails: results.reduce((s, d) => s + (d.events?.email_submit || 0), 0),
    tradeClicks: {},
    referrers: {},
    finderClicks: results.reduce((s, d) => s + (d.events?.finder_click || 0), 0),
    daily: results,
  };

  for (const day of results) {
    for (const [t, c] of Object.entries(day.trades || {})) {
      totals.tradeClicks[t] = (totals.tradeClicks[t] || 0) + c;
    }
    for (const [r, c] of Object.entries(day.referrers || {})) {
      totals.referrers[r] = (totals.referrers[r] || 0) + c;
    }
  }

  return new Response(JSON.stringify(totals, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  path: "/api/stats"
};
