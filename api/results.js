// api/results.js
// Takes { name, email, mobile, answers, website } from the client.
// All scoring, domain matching, and career matching happens here using the
// private data in lib/data.js — none of that ever reaches the browser.
// Also logs the submission to Google Sheets via a server-side-only URL.

const { validateAnswers, computeScores, matchDomains, matchCareers, TRAIT_ORDER } = require("../lib/data.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};

  // Honeypot — hidden field real visitors never fill in.
  if (body.website) {
    console.log("[results] Honeypot triggered — treating as bot, not logging.");
    return res.status(200).json({ status: "ok" });
  }

  // Lead validation
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const mobile = String(body.mobile || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const mobileDigits = mobile.replace(/\D/g, "");
  if (name.length < 2 || !emailOk || mobileDigits.length < 7 || mobileDigits.length > 13) {
    console.warn("[results] Lead validation failed:", { name, email, mobile,
      nameOk: name.length >= 2, emailOk, mobileDigitsCount: mobileDigits.length });
    return res.status(400).json({ error: "Invalid contact details" });
  }

  // Answer validation
  const { ok, errors, clean } = validateAnswers(body.answers);
  if (!ok) {
    console.warn("[results] Answer validation failed:", errors);
    return res.status(400).json({ error: "Invalid or incomplete answers", details: errors });
  }

  console.log("[results] Validation passed for", email, "— computing scores…");

  // Scoring (server-only logic)
  const scores = computeScores(clean);
  const topTrait = TRAIT_ORDER.reduce((a,b) => scores[b] > scores[a] ? b : a, "R");
  const domains = matchDomains(scores); // all 12, sorted desc
  const topCareers = matchCareers(scores).slice(0, 6);

  // Fire-and-forget log to Google Sheets (URL only ever lives in this env var)
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.warn("[results] GOOGLE_SCRIPT_URL is not set — skipping Sheets logging. " +
      "Set it in .env.local (local) or Vercel → Settings → Environment Variables (deployed).");
  } else if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(scriptUrl)) {
    console.warn("[results] GOOGLE_SCRIPT_URL doesn't look like a full Apps Script Web App URL. " +
      "It should look like https://script.google.com/macros/s/AKfycb.../exec — " +
      "got: " + scriptUrl);
  } else {
    try {
      const sheetRes = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          data: JSON.stringify({
            timestamp: new Date().toISOString(),
            name, email, mobile,
            traitScores: scores,
            topTrait,
            topDomains: domains.slice(0,3).map(d => `${d.name} (${Math.round(d.match*100)}%)`),
            topCareers: topCareers.slice(0,3).map(c => `${c.name} (${Math.round(c.match*100)}%)`),
          })
        }),
      });
      const sheetText = await sheetRes.text();
      if (sheetRes.ok) {
        console.log("[results] Sheets logging succeeded for", email, "— response:", sheetText.slice(0,200));
      } else {
        console.error("[results] Sheets logging returned an error status:", sheetRes.status, sheetText.slice(0,300));
      }
    } catch (err) {
      // Logging failure shouldn't block the person from seeing their results,
      // but we still want it visible in the server logs.
      console.error("[results] Sheets logging threw an error:", err.message);
    }
  }

  // Only display-ready data goes back to the browser — no vectors, no weights.
  return res.status(200).json({
    traitScores: scores,
    topTrait,
    domains: domains.map(d => ({ key:d.key, name:d.name, match:d.match, topCareers:d.topCareers })),
    topCareers,
  });
};