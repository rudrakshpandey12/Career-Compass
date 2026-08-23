// lib/data.js
// SERVER-ONLY. This file lives outside /api, so Vercel never exposes it as
// a route and it never ships to the browser — it's only require()'d from
// inside the serverless functions in /api. This is where the actual
// question bank, trait weights, and domain/career vectors live.

const SECTIONS = [
  { id:"interests", title:"Natural Interests & Problem Solving", weight:0.20,
    questions:[
      {id:1, type:"agreement", q:"When I encounter something I don't understand, I naturally want to find out how and why it works.", traits:{I:1}},
      {id:2, type:"agreement", q:"I enjoy solving problems where I need to experiment with different approaches before finding the solution.", traits:{I:0.6, R:0.4}},
      {id:3, type:"agreement", q:"I enjoy working with numbers, information, patterns, or evidence to reach a conclusion.", traits:{I:1}},
      {id:4, type:"agreement", q:"I become excited when I get an opportunity to create something that is different from existing solutions.", traits:{A:1}},
      {id:5, type:"agreement", q:"I enjoy activities where I can build, modify, operate, or improve something and see a practical result.", traits:{R:1}},
      {id:6, type:"agreement", q:"I enjoy understanding complex systems by breaking them into smaller parts.", traits:{I:0.6, C:0.4}},
    ]},
  { id:"scenarios", title:"Situational Behavioral Questions", weight:0.20,
    questions:[
      {id:7, type:"scenario", q:"You are given a difficult task with very little instruction. What would you most naturally do?", options:[
        {id:"A",text:"Start trying things and learn through experimentation",trait:"R"},
        {id:"B",text:"Research the problem before taking action",trait:"I"},
        {id:"C",text:"Discuss it with people who may have useful ideas",trait:"S"},
        {id:"D",text:"Think of an unusual or creative approach",trait:"A"},
        {id:"E",text:"Take ownership and decide how the task should be completed",trait:"E"},
        {id:"F",text:"Create a clear plan and follow it step by step",trait:"C"},
      ]},
      {id:8, type:"scenario", q:"You discover that something you are working on is not producing the expected result. What is your first instinct?", options:[
        {id:"A",text:"Try different practical solutions",trait:"R"},
        {id:"B",text:"Investigate the underlying reason",trait:"I"},
        {id:"C",text:"Ask others for their perspective",trait:"S"},
        {id:"D",text:"Try a completely different approach",trait:"A"},
        {id:"E",text:"Take responsibility and find a way forward",trait:"E"},
        {id:"F",text:"Check the process carefully for errors",trait:"C"},
      ]},
      {id:9, type:"scenario", q:"Your team has several possible solutions to a problem. How would you prefer to choose one?", options:[
        {id:"A",text:"Test which one works best",trait:"R"},
        {id:"B",text:"Compare evidence and data",trait:"I"},
        {id:"C",text:"Discuss everyone's opinions",trait:"S"},
        {id:"D",text:"Choose the most creative solution",trait:"A"},
        {id:"E",text:"Consider which solution will have the greatest impact",trait:"E"},
        {id:"F",text:"Compare them against clear criteria",trait:"C"},
      ]},
      {id:10, type:"scenario", q:"You have one week to complete an important project. Which role would you naturally take?", options:[
        {id:"A",text:"Work directly on building the solution",trait:"R"},
        {id:"B",text:"Analyze the problem and potential risks",trait:"I"},
        {id:"C",text:"Help team members coordinate",trait:"S"},
        {id:"D",text:"Design the overall experience or presentation",trait:"A"},
        {id:"E",text:"Lead the team toward the final goal",trait:"E"},
        {id:"F",text:"Organize the schedule and track progress",trait:"C"},
      ]},
      {id:11, type:"scenario", q:"You are asked to learn a completely unfamiliar subject. Which part would you enjoy most?", options:[
        {id:"A",text:"Practicing it yourself",trait:"R"},
        {id:"B",text:"Understanding the theory behind it",trait:"I"},
        {id:"C",text:"Discussing it with others",trait:"S"},
        {id:"D",text:"Finding creative ways to apply it",trait:"A"},
        {id:"E",text:"Thinking about how it could create opportunities",trait:"E"},
        {id:"F",text:"Learning the correct process and becoming accurate at it",trait:"C"},
      ]},
      {id:12, type:"scenario", q:"You notice that a process could be improved. What would you most likely do?", options:[
        {id:"A",text:"Try changing it and see whether it works better",trait:"R"},
        {id:"B",text:"Analyze what is causing the inefficiency",trait:"I"},
        {id:"C",text:"Ask the people using the process for feedback",trait:"S"},
        {id:"D",text:"Design a completely new approach",trait:"A"},
        {id:"E",text:"Take responsibility for implementing the improvement",trait:"E"},
        {id:"F",text:"Document the improved process clearly",trait:"C"},
      ]},
    ]},
  { id:"people", title:"People, Communication & Leadership", weight:0.15,
    questions:[
      {id:13, type:"agreement", q:"When someone is struggling with a difficult task, I naturally want to help them understand or solve it.", traits:{S:1}},
      {id:14, type:"agreement", q:"I am comfortable speaking to unfamiliar people and starting conversations when necessary.", traits:{E:0.6, S:0.4}},
      {id:15, type:"agreement", q:"I enjoy convincing people to consider an idea that I strongly believe in.", traits:{E:1}},
      {id:16, type:"agreement", q:"When a group needs someone to take responsibility, I am comfortable stepping forward.", traits:{E:1}},
      {id:17, type:"agreement", q:"I prefer understanding what people need before deciding how to solve a problem.", traits:{S:1}},
      {id:18, type:"agreement", q:"I remain calm and useful when other people around me are stressed or uncertain.", traits:{S:0.6, E:0.4}},
    ]},
  { id:"workstyle", title:"Work Style & Decision Making", weight:0.15,
    questions:[
      {id:19, type:"agreement", q:"When making an important decision, I prefer to examine facts and evidence rather than rely mainly on assumptions.", traits:{I:0.6, C:0.4}},
      {id:20, type:"agreement", q:"I am comfortable making decisions when the situation changes unexpectedly.", traits:{E:1}},
      {id:21, type:"agreement", q:"I prefer environments where accuracy, responsibility, and following important procedures matter.", traits:{C:1}},
      {id:22, type:"agreement", q:"I enjoy situations where I need to manage several tasks, people, or priorities at the same time.", traits:{E:0.5, C:0.5}},
      {id:23, type:"agreement", q:"I prefer having freedom to decide how I complete my work rather than being given every step.", traits:{A:0.6, I:0.4}},
      {id:24, type:"agreement", q:"I enjoy working on challenging tasks even when they require continuous learning and improvement.", traits:{I:1}},
    ]},
  { id:"values", title:"Career Values", weight:0.30,
    questions:[
      {id:25, type:"importance", q:"How important is high earning potential and financial growth when choosing your future career?", traits:{E:1}},
      {id:26, type:"importance", q:"How important is job stability and long-term security to you?", traits:{C:1}},
      {id:27, type:"importance", q:"How important is it that your future career allows you to help people or contribute to society?", traits:{S:1}},
      {id:28, type:"importance", q:"How important is continuous learning, new technology, innovation, and intellectual challenge in your career?", traits:{I:0.6, A:0.4}},
      {id:29, type:"importance", q:"How important is having opportunities to lead, make important decisions, and take responsibility?", traits:{E:1}},
      {id:30, type:"importance", q:"How important is having a career that gives you variety, new experiences, changing situations, travel, or interaction with different people?", traits:{A:0.6, E:0.4}},
    ]},
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
