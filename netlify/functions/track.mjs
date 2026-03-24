import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { event, trade, page, referrer } = await req.json();
    const store = getStore("analytics");
    const today = new Date().toISOString().split("T")[0];
    const key = `daily:${today}`;

    let data = await store.get(key, { type: "json" });
    if (!data) {
      data = { date: today, views: 0, trades: {}, events: {}, referrers: {} };
    }

    if (event === "pageview") {
      data.views++;
      if (page) {
        data.events[page] = (data.events[page] || 0) + 1;
      }
      if (referrer) {
        const ref = referrer.includes("reddit") ? "reddit" :
                    referrer.includes("facebook") ? "facebook" :
                    referrer.includes("google") ? "google" :
                    referrer.includes("pathtotrades") ? "direct" : "other";
        data.referrers[ref] = (data.referrers[ref] || 0) + 1;
      }
    }

    if (event === "trade_click" && trade) {
      data.trades[trade] = (data.trades[trade] || 0) + 1;
    }

    if (event === "step_expand" && trade) {
      const stepKey = `step:${trade}`;
      data.events[stepKey] = (data.events[stepKey] || 0) + 1;
    }

    if (event === "email_submit") {
      data.events["email_submit"] = (data.events["email_submit"] || 0) + 1;
    }

    if (event === "finder_click") {
      data.events["finder_click"] = (data.events["finder_click"] || 0) + 1;
    }

    if (event === "filter_click" && trade) {
      data.events[`filter:${trade}`] = (data.events[`filter:${trade}`] || 0) + 1;
    }

    await store.setJSON(key, data);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const config = {
  path: "/api/track"
};
