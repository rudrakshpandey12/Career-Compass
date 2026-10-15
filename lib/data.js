// lib/data.js
// SERVER-ONLY. This file lives outside /api, so Vercel never exposes it as
// a route and it never ships to the browser — it's only require()'d from
// inside the serverless functions in /api. This is where the actual
// question bank, trait weights, and domain/career vectors live.

const SECTIONS = [
  {
    id: "interests",
    title: "Activities You Enjoy",
    weight: 0.25,
    questions: [
      { id: 1, type: "agreement", q: "Build or repair something with your hands.", traits: { R: 1 } },
      { id: 2, type: "agreement", q: "Find out why something works.", traits: { I: 1 } },
      { id: 3, type: "agreement", q: "Design a poster or visual.", traits: { A: 1 } },
      { id: 4, type: "agreement", q: "Help a classmate understand a topic.", traits: { S: 1 } },
      { id: 5, type: "agreement", q: "Lead a group activity.", traits: { E: 1 } },
      { id: 6, type: "agreement", q: "Organize notes into a clear system.", traits: { C: 1 } },

      { id: 7, type: "agreement", q: "Use tools to assemble something.", traits: { R: 1 } },
      { id: 8, type: "agreement", q: "Compare facts before reaching a conclusion.", traits: { I: 1 } },
      { id: 9, type: "agreement", q: "Write a short story or poem.", traits: { A: 1 } },
      { id: 10, type: "agreement", q: "Listen when a friend needs support.", traits: { S: 1 } },
      { id: 11, type: "agreement", q: "Convince others to try your idea.", traits: { E: 1 } },
      { id: 12, type: "agreement", q: "Follow a checklist to finish a task.", traits: { C: 1 } },

      { id: 13, type: "agreement", q: "Build a model of something.", traits: { R: 1 } },
      { id: 14, type: "agreement", q: "Solve a challenging puzzle.", traits: { I: 1 } },
      { id: 15, type: "agreement", q: "Create a video or animation.", traits: { A: 1 } },
      { id: 16, type: "agreement", q: "Explain a difficult topic to someone.", traits: { S: 1 } },
      { id: 17, type: "agreement", q: "Organize an event at school.", traits: { E: 1 } },
      { id: 18, type: "agreement", q: "Check work carefully for mistakes.", traits: { C: 1 } },

      { id: 19, type: "agreement", q: "Take care of plants or animals.", traits: { R: 1 } },
      { id: 20, type: "agreement", q: "Research a question that interests you.", traits: { I: 1 } },
      { id: 21, type: "agreement", q: "Create an original character or design.", traits: { A: 1 } },
      { id: 22, type: "agreement", q: "Volunteer for a community activity.", traits: { S: 1 } },
      { id: 23, type: "agreement", q: "Start a small project of your own.", traits: { E: 1 } },
      { id: 24, type: "agreement", q: "Sort information into categories.", traits: { C: 1 } },

      { id: 25, type: "agreement", q: "Try a practical experiment yourself.", traits: { R: 1 } },
      { id: 26, type: "agreement", q: "Find patterns in numbers or information.", traits: { I: 1 } },
      { id: 27, type: "agreement", q: "Choose colors and layouts for a project.", traits: { A: 1 } },
      { id: 28, type: "agreement", q: "Support someone who feels left out.", traits: { S: 1 } },
      { id: 29, type: "agreement", q: "Present your ideas to a group.", traits: { E: 1 } },
      { id: 30, type: "agreement", q: "Keep records neat and up to date.", traits: { C: 1 } },

      { id: 31, type: "agreement", q: "Operate equipment by following safety steps.", traits: { R: 1 } },
      { id: 32, type: "agreement", q: "Investigate what caused a problem.", traits: { I: 1 } },
      { id: 33, type: "agreement", q: "Create a design from scratch.", traits: { A: 1 } },
      { id: 34, type: "agreement", q: "Teach a younger student something new.", traits: { S: 1 } },
      { id: 35, type: "agreement", q: "Make a plan to reach a goal.", traits: { E: 1 } },
      { id: 36, type: "agreement", q: "Manage your time and deadlines.", traits: { C: 1 } },
    ],
  },
  {
    id: "workstyle",
    title: "How You Prefer to Work",
    weight: 0.45,
    questions: [
      { id: 37, type: "agreement", q: "I prefer solving problems through practical action.", traits: { R: 1 } },
      { id: 38, type: "agreement", q: "I compare evidence before making decisions.", traits: { I: 1 } },
      { id: 39, type: "agreement", q: "I like freedom to try creative approaches.", traits: { A: 1 } },
      { id: 40, type: "agreement", q: "I enjoy working with others toward shared goals.", traits: { S: 1 } },
      { id: 41, type: "agreement", q: "I stay comfortable when plans suddenly change.", traits: { E: 1 } },
      { id: 42, type: "agreement", q: "I break large tasks into clear steps.", traits: { C: 1 } },
    ],
  },
  {
    id: "values",
    title: "What Matters in Your Future",
    weight: 0.30,
    questions: [
      { id: 43, type: "importance", q: "How important is practical, hands-on work?", traits: { R: 1 } },
      { id: 44, type: "importance", q: "How important is learning and solving complex problems?", traits: { I: 1 } },
      { id: 45, type: "importance", q: "How important is creative freedom in your work?", traits: { A: 1 } },
      { id: 46, type: "importance", q: "How important is helping people or society?", traits: { S: 1 } },
      { id: 47, type: "importance", q: "How important are leadership and financial growth?", traits: { E: 1 } },
      { id: 48, type: "importance", q: "How important are stability and clear procedures?", traits: { C: 1 } },
    ],
  },
];

const TRAIT_ORDER = ["R","I","A","S","E","C"];
const TRAIT_NAMES = {R:"Realistic", I:"Investigative", A:"Artistic", S:"Social", E:"Enterprising", C:"Conventional"};

const DOMAINS = {
  technology: { name:"Technology", v:[2,5,2,1,2,3] },
  business: { name:"Business & Management", v:[1,3,1,3,5,3] },
  finance: { name:"Finance & Commerce", v:[0,3,0,1,3,4] },
  healthcare: { name:"Healthcare", v:[2,4,0,4,1,2] },
  aviation: { name:"Aviation", v:[2,2,0,3,3,4] },
  hospitality: { name:"Hospitality", v:[1,1,2,4,3,2] },
  design: { name:"Design & Creativity", v:[2,2,5,1,2,1] },
  media: { name:"Media & Communication", v:[0,2,4,3,3,1] },
  law: { name:"Law & Public Administration", v:[1,3,0,3,4,3] },
  defence: { name:"Defence & Uniform Services", v:[3,2,0,3,4,3] },
  science: { name:"Science & Research", v:[2,5,1,1,0,2] },
  education: { name:"Education & Human Development", v:[0,2,2,5,2,2] },
};

const CAREERS = [
  {name:"Software Engineer", domain:"technology", v:[2,5,2,1,2,3]},
  {name:"AI / Machine Learning Engineer", domain:"technology", v:[1,5,2,1,2,2]},
  {name:"Data Scientist", domain:"technology", v:[1,5,1,1,2,3]},
  {name:"Cyber Security Analyst", domain:"technology", v:[2,5,0,1,1,4]},
  {name:"Full Stack Developer", domain:"technology", v:[2,4,3,1,2,2]},
  {name:"Cloud Engineer", domain:"technology", v:[2,4,1,1,2,4]},
  {name:"MBA / General Management", domain:"business", v:[1,3,1,3,5,3]},
  {name:"Sales Manager", domain:"business", v:[1,1,1,3,5,1]},
  {name:"Operations Manager", domain:"business", v:[2,2,0,2,4,4]},
  {name:"Management Consultant", domain:"business", v:[0,4,1,3,5,2]},
  {name:"Entrepreneur / Founder", domain:"business", v:[2,3,2,2,5,1]},
  {name:"Chartered Accountant", domain:"finance", v:[0,3,0,1,1,5]},
  {name:"Investment Banker", domain:"finance", v:[0,4,0,1,5,3]},
  {name:"Banking Professional", domain:"finance", v:[0,2,0,2,3,4]},
  {name:"Financial Analyst", domain:"finance", v:[0,4,0,1,3,4]},
  {name:"Physician / Doctor", domain:"healthcare", v:[2,5,0,4,2,2]},
  {name:"Dentist", domain:"healthcare", v:[3,4,1,3,1,2]},
  {name:"Nurse", domain:"healthcare", v:[2,3,1,5,1,2]},
  {name:"Pharmacist", domain:"healthcare", v:[1,4,0,3,1,3]},
  {name:"Commercial Pilot", domain:"aviation", v:[4,3,0,2,3,4]},
  {name:"Cabin Crew", domain:"aviation", v:[1,1,1,5,3,2]},
  {name:"Ground Staff / Airport Operations", domain:"aviation", v:[1,1,0,4,2,4]},
  {name:"Air Traffic Controller", domain:"aviation", v:[2,4,0,2,2,5]},
  {name:"Aviation Management", domain:"aviation", v:[1,2,0,3,4,4]},
  {name:"Hotel Management", domain:"hospitality", v:[1,1,2,4,3,2]},
  {name:"Chef", domain:"hospitality", v:[4,1,3,2,2,1]},
  {name:"Luxury Retail Manager", domain:"hospitality", v:[0,1,2,4,4,2]},
  {name:"Tourism / Travel Manager", domain:"hospitality", v:[1,1,2,4,3,2]},
  {name:"Architect", domain:"design", v:[3,3,5,1,2,2]},
  {name:"Animator", domain:"design", v:[1,1,5,1,1,1]},
  {name:"VFX Artist", domain:"design", v:[1,2,5,1,1,1]},
  {name:"Graphic Designer", domain:"design", v:[1,1,5,1,1,1]},
  {name:"Fashion Designer", domain:"design", v:[1,1,5,2,2,1]},
  {name:"Journalist", domain:"media", v:[0,3,4,3,2,1]},
  {name:"Content Creator", domain:"media", v:[0,2,5,2,3,1]},
  {name:"PR Specialist", domain:"media", v:[0,1,3,4,4,1]},
  {name:"Advertising / Copywriter", domain:"media", v:[0,2,5,2,3,1]},
  {name:"Lawyer", domain:"law", v:[0,4,1,3,4,2]},
  {name:"Civil Services (IAS / IPS)", domain:"law", v:[1,3,0,4,4,3]},
  {name:"Judiciary", domain:"law", v:[0,4,0,2,2,4]},
  {name:"Public Administration / Politics", domain:"law", v:[0,2,1,4,5,2]},
  {name:"Army Officer", domain:"defence", v:[4,2,0,3,4,3]},
  {name:"Navy Officer", domain:"defence", v:[3,3,0,2,4,3]},
  {name:"Air Force Officer", domain:"defence", v:[3,3,0,2,4,3]},
  {name:"Police Officer", domain:"defence", v:[3,1,0,4,3,3]},
  {name:"Scientist / Researcher", domain:"science", v:[1,5,1,1,0,2]},
  {name:"Biologist", domain:"science", v:[2,5,1,1,0,2]},
  {name:"Space Research Scientist", domain:"science", v:[2,5,1,1,1,3]},
  {name:"Teacher / Educator", domain:"education", v:[1,2,2,5,2,2]},
  {name:"HR Manager", domain:"education", v:[0,1,1,5,3,2]},
  {name:"Psychologist", domain:"education", v:[0,4,2,5,1,1]},
  {name:"Corporate Trainer", domain:"education", v:[0,2,2,5,3,1]},
];

/** Strips trait weights out of the question bank — this is the shape sent to the client. */
function getSanitizedQuestions() {
  return SECTIONS.map(s => ({
    id: s.id,
    title: s.title,
    questions: s.questions.map(q => {
      if (q.type === "scenario") {
        return {
          id: q.id, type: q.type, q: q.q,
          options: q.options.map(o => ({ id: o.id, text: o.text })) // trait omitted
        };
      }
      return { id: q.id, type: q.type, q: q.q }; // traits omitted
    })
  }));
}

/** Validates that every question has a well-formed answer, returns {ok, errors, cleanAnswers}. */
function validateAnswers(answers) {
  const errors = [];
  const clean = {};
  if (!answers || typeof answers !== "object") return { ok:false, errors:["No answers provided"], clean:{} };

  SECTIONS.forEach(s => s.questions.forEach(q => {
    const a = answers[q.id];
    if (q.type === "scenario") {
      const validIds = q.options.map(o => o.id);
      if (typeof a !== "string" || !validIds.includes(a)) {
        errors.push(`Question ${q.id}: invalid or missing option`);
      } else {
        clean[q.id] = a;
      }
    } else {
      const n = Number(a);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        errors.push(`Question ${q.id}: invalid or missing rating`);
      } else {
        clean[q.id] = n;
      }
    }
  }));

  return { ok: errors.length === 0, errors, clean };
}

/** Core scoring — identical math to the original client-side version, just server-side now. */
function computeScores(cleanAnswers) {
  const buckets = {};
  SECTIONS.forEach(s => buckets[s.id] = {
    raw: Object.fromEntries(TRAIT_ORDER.map(t => [t,0])),
    max: Object.fromEntries(TRAIT_ORDER.map(t => [t,0])),
  });

  SECTIONS.forEach(s => s.questions.forEach(q => {
    const a = cleanAnswers[q.id];
    const bucket = buckets[s.id];
    if (q.type === "scenario") {
      const opt = q.options.find(o => o.id === a);
      bucket.raw[opt.trait] += 1;
      bucket.max[opt.trait] += 1;
      q.options.forEach(o => { if (o.trait !== opt.trait) bucket.max[o.trait] += 1; });
    } else {
      const norm = (a - 1) / 4;
      Object.entries(q.traits).forEach(([t,w]) => {
        bucket.raw[t] += w * norm;
        bucket.max[t] += w * 1;
      });
    }
  }));

  const bucketScores = {};
  Object.entries(buckets).forEach(([sid,b]) => {
    bucketScores[sid] = {};
    TRAIT_ORDER.forEach(t => { bucketScores[sid][t] = b.max[t] > 0 ? b.raw[t]/b.max[t] : 0; });
  });

  const finalScores = Object.fromEntries(TRAIT_ORDER.map(t => [t,0]));
  SECTIONS.forEach(s => TRAIT_ORDER.forEach(t => { finalScores[t] += bucketScores[s.id][t] * s.weight; }));
  return finalScores;
}

function cosineSim(userVec, targetVec5) {
  const target = targetVec5.map(x => x/5);
  const dot = userVec.reduce((s,v,i) => s + v*target[i], 0);
  const magU = Math.sqrt(userVec.reduce((s,v) => s + v*v, 0));
  const magT = Math.sqrt(target.reduce((s,v) => s + v*v, 0));
  return (magU > 0 && magT > 0) ? dot/(magU*magT) : 0;
}

function matchDomains(scores) {
  const userVec = TRAIT_ORDER.map(t => scores[t]);
  return Object.entries(DOMAINS)
    .map(([key,d]) => ({
      key, name: d.name, match: cosineSim(userVec, d.v),
      topCareers: CAREERS.filter(c => c.domain === key).slice(0,3).map(c => c.name),
    }))
    .sort((a,b) => b.match - a.match);
}

function matchCareers(scores) {
  const userVec = TRAIT_ORDER.map(t => scores[t]);
  return CAREERS
    .map(c => ({ name:c.name, domainKey:c.domain, domainName:DOMAINS[c.domain].name, match: cosineSim(userVec, c.v) }))
    .sort((a,b) => b.match - a.match);
}

module.exports = {
  SECTIONS, DOMAINS, CAREERS, TRAIT_ORDER, TRAIT_NAMES,
  getSanitizedQuestions, validateAnswers, computeScores, matchDomains, matchCareers,
};
