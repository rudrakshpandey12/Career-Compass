// api/questions.js
// Returns the question bank the client renders — with trait weights and
// scoring hints removed. The full data (including traits) lives in
// lib/data.js, which is never imported by anything under /api that the
// client can reach directly.

const { getSanitizedQuestions } = require("../lib/data.js");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "public, max-age=300"); // light caching, questions rarely change
  return res.status(200).json({ sections: getSanitizedQuestions() });
};
