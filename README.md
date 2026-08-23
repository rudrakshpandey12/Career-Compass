# Career Compass

A 30-question career assessment that matches visitors to 12 career domains
(with Aviation and Technology promoted as featured programs), captures
name/email/mobile before showing results, and logs every completed
assessment to a Google Sheet.

## Architecture

```
index.html        — frontend only: renders the quiz, calls the two API
                     routes below, displays whatever they return
api/questions.js   — GET  /api/questions  → sanitized question list
api/results.js     — POST /api/results    → scores answers, logs to
                     Sheets, returns only the final display data
lib/data.js        — SERVER-ONLY. The real question bank (with trait
                     weights), the 12 domain vectors, the 52 career
                     vectors, and the scoring/matching functions live
                     here. Never imported by anything the browser can
                     reach directly — only by the two files in /api.
```

**What the browser never receives:** trait weights per question, domain
RIASEC vectors, career RIASEC vectors, or the scoring/matching formulas.
Someone opening DevTools sees `index.html`'s markup and UI logic, and can
watch two network calls (`/api/questions`, `/api/results`) — but the
response bodies only ever contain question *text* (which the visitor has
to read anyway) and final, already-computed results (domain names, match
percentages, career names) — never the underlying weights or vectors that
produced them.

**What's genuinely unavoidable:** question wording has to reach the
browser for the person to answer it, and final results have to reach the
browser for the person to see them. If someone is determined enough, they
could call `/api/results` directly with crafted answer combinations and
try to reverse-engineer the scoring by comparing outputs — that's a much
higher-effort attack than "View Source" today, and not something a normal
visitor or casual competitor could do by accident. If that residual risk
matters for this client, rate-limiting `/api/results` (e.g. via Vercel's
edge config or a service like Upstash) would close most of the remaining
gap — happy to add that if needed.

---

## 1. Customize the branding & links

Open `index.html` and find the `CONFIG` object near the top of the
`<script>` block. Edit these fields:

```js
const CONFIG = {
  brandName: "Career Compass",
  contactEmail: "hello@yourcoaching.com",
  contactWhatsapp: "https://wa.me/910000000000", // full international number, no + or spaces
  featuredDomainKeys: ["technology", "aviation"], // which domains get pushed
  courses: {
    technology: { icon: "💻", name: "...", desc: "...", url: "https://yourcoaching.com/courses/technology" },
    aviation:   { icon: "✈️", name: "...", desc: "...", url: "https://yourcoaching.com/courses/aviation" }
  },
  domainNames: [ /* display names for the hero chips only */ ]
};
```

Colors live in the `:root` CSS variables at the top of `<style>`.

---

## 2. Connect Google Sheets

1. Create a new Google Sheet. Rename the first tab to `Results`.
2. In row 1, add headers:
   `Timestamp | Name | Email | Mobile | Trait Scores | Top Trait | Top Domains | Top Careers`
3. Go to **Extensions → Apps Script**, delete the starter code, and paste:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Results");
  var data = JSON.parse(e.parameter.data);

  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.mobile,
    JSON.stringify(data.traitScores),
    data.topTrait,
    data.topDomains.join(" | "),
    data.topCareers.join(" | ")
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. **Deploy → New deployment → Web app.** Execute as **Me**, access
   **Anyone**. Deploy, authorize, and copy the Web app URL (ends in `/exec`).
5. **Do not paste this URL into any file.** It goes into a Vercel
   environment variable instead (step 4 below) — that's what keeps write
   access to the Sheet out of the browser entirely.
6. If you ever edit the Apps Script later, you must **Deploy → Manage
   deployments → Edit → New version** — editing the script alone doesn't
   update the live `/exec` URL.

---

## 3. Run locally

```
npm install -g vercel
vercel dev
```

`vercel dev` runs both the static frontend and the `/api` functions
together, exactly like production. Opening `index.html` directly in a
browser (without `vercel dev`) will load the quiz but the API calls will
fail, since there's no server to answer them.

---

## 4. Deploy to Vercel

**Option A — via GitHub (recommended)**

1. Push this whole folder (`index.html`, `vercel.json`, `api/`, `lib/`) to
   a new GitHub repo.
2. [vercel.com](https://vercel.com) → **New Project** → import the repo.
   Vercel auto-detects `api/` as serverless functions and `index.html` as
   static output — no framework preset, no build command needed.
3. Before or after deploying, go to **Project → Settings → Environment
   Variables** and add:
   - **Key:** `GOOGLE_SCRIPT_URL`
   - **Value:** the `/exec` URL from step 2 above
   - **Environments:** check Production, Preview, and Development
4. Click **Deploy**.

**Option B — via CLI**

```
vercel login
vercel env add GOOGLE_SCRIPT_URL
# paste your /exec URL when prompted, select all environments
vercel --prod
```

**Why this still deploys cleanly:** `api/` and `lib/` need zero build
configuration — `api/` is Vercel's built-in convention for serverless
functions (each file becomes a route automatically), and `lib/` is just a
plain folder those functions `require()` from. No `package.json` needed.

---

## 5. Editing content later

All editable content now lives in **`lib/data.js`** (server-side):

- **Questions:** the `SECTIONS` array — text, type, options, and trait
  weights all live together here.
- **Domains:** the `DOMAINS` object — each has a `v: [R,I,A,S,E,C]` score
  (0–5) representing its typical trait profile.
- **Careers:** the `CAREERS` array — each has a `domain` key (must match a
  key in `DOMAINS`) and its own `v: [R,I,A,S,E,C]` vector.

After editing `lib/data.js`, redeploy — nothing in `index.html` needs to
change, since the client only ever asks the API for whatever's current.

Branding, course links, and which domains are "featured" stay in
`index.html`'s `CONFIG` object (see section 1) — that's marketing copy,
not scoring logic, so there's no reason to hide it server-side.
