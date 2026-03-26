import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   QUIZ — "What trade is right for you?"
   6 questions → personalized result → email gate
   ═══════════════════════════════════════════════ */

const QUIZ = [
  { q: "Do you prefer working indoors or outdoors?",
    opts: [
      { label: "Mostly indoors", scores: { electrician: 2, plumber: 1, hvac: 1, drywall: 3, painter: 2 } },
      { label: "Mostly outdoors", scores: { roofer: 3, concrete: 3, solar: 2, genEng: 2 } },
      { label: "A mix of both", scores: { electrician: 1, plumber: 1, hvac: 2, genBuild: 2, solar: 1 } },
      { label: "Don't care either way", scores: { electrician: 1, plumber: 1, hvac: 1, genBuild: 1, solar: 1, roofer: 1, concrete: 1, drywall: 1, painter: 1, genEng: 1 } },
    ]
  },
  { q: "How do you feel about math and technical problem-solving?",
    opts: [
      { label: "I'm good with numbers and diagrams", scores: { electrician: 3, hvac: 2, genEng: 3, solar: 2 } },
      { label: "I can handle basic math", scores: { plumber: 2, genBuild: 2, concrete: 1, roofer: 1 } },
      { label: "I'd rather work with my hands than do calculations", scores: { drywall: 3, painter: 3, roofer: 2, concrete: 2 } },
    ]
  },
  { q: "How important is earning potential to you versus getting started quickly?",
    opts: [
      { label: "I want the highest possible income — I'll invest the time", scores: { electrician: 3, plumber: 3, genEng: 3, hvac: 2 } },
      { label: "I want to start earning as soon as possible", scores: { painter: 3, drywall: 3, roofer: 2, concrete: 2 } },
      { label: "Balance of both — good pay, reasonable timeline", scores: { hvac: 2, genBuild: 2, solar: 2, plumber: 1 } },
    ]
  },
  { q: "How much physical intensity are you comfortable with?",
    opts: [
      { label: "I can handle heavy, demanding work", scores: { concrete: 3, roofer: 3, genEng: 2 } },
      { label: "Moderate — active but not extreme", scores: { electrician: 2, hvac: 2, plumber: 2, genBuild: 2, solar: 2 } },
      { label: "I prefer lighter physical work", scores: { painter: 3, drywall: 2, electrician: 1 } },
    ]
  },
  { q: "Do you want to eventually run your own business, or work for someone else?",
    opts: [
      { label: "I want to own my own business", scores: { genBuild: 3, electrician: 2, plumber: 2, painter: 2, hvac: 1 } },
      { label: "I want a stable job working for a company or union", scores: { genEng: 3, electrician: 1, hvac: 2, roofer: 1, concrete: 1 } },
      { label: "Not sure yet — want to keep my options open", scores: { electrician: 1, plumber: 1, hvac: 1, solar: 1, genBuild: 1 } },
    ]
  },
  { q: "Which of these interests you most?",
    opts: [
      { label: "Wiring, power systems, and technology", scores: { electrician: 4, solar: 2 } },
      { label: "Water systems, pipes, and gas lines", scores: { plumber: 4 } },
      { label: "Heating, cooling, and climate systems", scores: { hvac: 4 } },
      { label: "Building structures from the ground up", scores: { genBuild: 3, concrete: 2, genEng: 2 } },
      { label: "Renewable energy and solar", scores: { solar: 4, electrician: 1 } },
      { label: "Finishing work — making things look right", scores: { painter: 3, drywall: 3 } },
      { label: "Roofing and exterior work", scores: { roofer: 4 } },
    ]
  },
];

/* ═══════════════════════════════════════════════
   TRADE DATA — human-readable, state-aware
   ═══════════════════════════════════════════════ */

const TRADES = {
  electrician: {
    name: "Electrician", slug: "electrician",
    tagline: "Wire buildings. Power the future. One of the highest-paying trades.",
    desc: "Install, repair, and maintain electrical systems — wiring, lighting, power, and solar. Residential, commercial, and industrial.",
    salary: { entry: "$50–66K", mid: "$70–85K", senior: "$90–110K+", union: "$106–140K+", top: "$200K+ (business owners)" },
    growth: "9% nationally", physical: 3, mathLevel: "High", bizPotential: 5, speed: 2,
    whyChoose: "Highest earning ceiling of any specialty trade. Every building needs electricity. AI and automation can't replace hands-on wiring. Strong union options with IBEW.",
    states: {
      CA: { code: "C-10", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: false, timeline: "4–12 months", cost: "$900–$2,000+", ceHours: "32 hrs / 2 yrs", unionLocals: "IBEW Local 11 (LA), Local 569 (SD), Local 6 (SF)", unionHr: "$51+/hr" },
      TX: { code: "Journeyman / Master", board: "TDLR", expYears: "4 (8,000 hrs for Journeyman)", exams: 1, bondAmt: "None (state level)", wcExempt: true, timeline: "2–6 months after hours met", cost: "$128–$200+", ceHours: "4 hrs / year", notes: "Apprentice registration required with TDLR before hours count. Journeyman exam split into 2 parts (NEC Knowledge + Calculations) as of March 2025. Only 27% pass rate in 2024. Open-book exam — bring your own NEC 2023 book. Master requires 12,000 hrs + 2 yrs as Journeyman. Electrical Contractor license ($110/yr) required to run a business.", unionLocals: "IBEW Local 20 (Dallas), Local 716 (Houston), Local 60 (San Antonio)", unionHr: "$40+/hr" },
    }
  },
  plumber: {
    name: "Plumber", slug: "plumber",
    tagline: "Essential, recession-proof, and among the highest-paid trades.",
    desc: "Install and repair water supply, drainage, gas piping, and fixtures for homes and businesses.",
    salary: { entry: "$48–63K", mid: "$68–80K", senior: "$85–100K+", union: "$133K+", top: "$150K+ (business owners)" },
    growth: "4% nationally", physical: 4, mathLevel: "Medium", bizPotential: 5, speed: 2,
    whyChoose: "Highest union pay of any specialty trade (UA Local 447 at $64+/hr). Completely recession-proof — buildings always need water and drainage. Strong path to business ownership.",
    states: {
      CA: { code: "C-36", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: true, timeline: "4–12 months", cost: "$900–$2,000+", ceHours: "None required by CSLB", unionLocals: "UA Local 447 (Sacramento), Local 78 (LA)", unionHr: "$64+/hr" },
      TX: { code: "Journeyman / Master / RMP", board: "TSBPE", expYears: "4 (8,000 hrs for Journeyman)", exams: 1, bondAmt: "None (state level)", wcExempt: true, timeline: "2–8 months after hours met", cost: "$345–$600+", ceHours: "24 hrs / year (Master)", notes: "Licensed through Texas State Board of Plumbing Examiners (TSBPE), NOT TDLR. Responsible Master Plumber (RMP) license needed to run a business — requires Master license + 24-hr TSBPE course + $300K liability insurance. Workers' comp is optional for all private employers in Texas — the only state where this is true.", unionLocals: "UA Local 68 (Houston), Local 142 (San Antonio)", unionHr: "$38+/hr" },
    }
  },
  hvac: {
    name: "HVAC Technician", slug: "hvac",
    tagline: "Heating and cooling — constant demand, year-round work.",
    desc: "Install, service, and maintain heating, ventilation, air-conditioning, and refrigeration systems.",
    salary: { entry: "$45–58K", mid: "$62–75K", senior: "$80–95K+", union: "$95–120K+", top: "$130K+ (business owners)" },
    growth: "9% nationally", physical: 3, mathLevel: "High", bizPotential: 4, speed: 2,
    whyChoose: "Climate change is making HVAC more essential every year. Requires EPA 608 certification on top of license. Heat pump specialization pays $5–15/hr premium over standard HVAC work.",
    states: {
      CA: { code: "C-20", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: false, timeline: "4–12 months", cost: "$900–$2,200+", ceHours: "None required by CSLB", prereqs: "EPA 608 Universal Certification (mandatory)", unionLocals: "UA HVAC/R Service Techs", unionHr: "$45+/hr" },
      TX: { code: "ACR Contractor (Class A/B)", board: "TDLR", expYears: "4 (or 1 yr cert + 3 yrs)", exams: 1, bondAmt: "None (state level)", wcExempt: true, timeline: "2–6 months after hours met", cost: "$165–$300+", ceHours: "8 hrs / year", notes: "Class A = unlimited tonnage. Class B = under 25 tons. Technician certification available after 2 yrs + 2,000-hr TDLR-approved program. EPA 608 still required for refrigerant handling. Insurance required: $100K+ liability. TX construction employment grew 3.2% in 2025 — 876,700 total. Workers' comp optional for private employers.", prereqs: "EPA 608 Universal Certification (mandatory for refrigerant)", unionLocals: "UA HVAC/R locals", unionHr: "$35+/hr" },
    }
  },
  genBuild: {
    name: "General Contractor", slug: "general-contractor",
    tagline: "The most versatile license — build anything.",
    desc: "Construct, alter, or repair buildings and structures requiring multiple trades. Manage entire projects.",
    salary: { entry: "$55–65K", mid: "$75–90K", senior: "$100–130K+", union: "$120–160K+", top: "$200K+ (business owners)" },
    growth: "5% nationally", physical: 3, mathLevel: "Medium", bizPotential: 5, speed: 3,
    whyChoose: "The most versatile license. You can bid on whole-building projects, not just specialty work. Highest path to business ownership. Most GCs eventually run their own companies.",
    states: {
      CA: { code: "B", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: true, timeline: "4–12 months", cost: "$900–$2,000+", ceHours: "5 hrs / 2 yrs", unionLocals: "Carpenters, Laborers, etc.", unionHr: "Varies by trade" },
      TX: { code: "No state license required", board: "City-level only", expYears: "Varies by city", exams: "Varies by city", bondAmt: "Varies by city", wcExempt: true, timeline: "1–4 weeks (city registration)", cost: "$100–$500 (city fees)", ceHours: "Varies", notes: "Texas does NOT require a state-level general contractor license — one of the few states with no state GC license. Requirements vary dramatically by city: Dallas requires registration, Austin requires registration, San Antonio has a two-license system, and Houston requires NO registration at all. Workers' comp is optional for private employers. You need trade-specific licenses (electrical, plumbing, HVAC) if doing that work yourself.", unionLocals: "Carpenters, Laborers by region", unionHr: "Varies" },
    }
  },
  solar: {
    name: "Solar Installer", slug: "solar",
    tagline: "Fastest-growing trade in the country. Ride the clean energy wave.",
    desc: "Install, modify, maintain, and repair solar energy systems. Panels, inverters, battery storage.",
    salary: { entry: "$42–55K", mid: "$60–72K", senior: "$80–95K+", union: "$100–130K+", top: "$150K+ (business owners)" },
    growth: "22% nationally", physical: 3, mathLevel: "Medium", bizPotential: 4, speed: 3,
    whyChoose: "22% job growth — fastest of any construction trade. Federal incentives (Inflation Reduction Act) are driving explosive demand through 2030. Great combination of outdoor work and technology.",
    states: {
      CA: { code: "C-46", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: true, timeline: "4–12 months", cost: "$900–$2,000+", ceHours: "None required", unionLocals: "IBEW (solar falls under electrical)", unionHr: "$48+/hr" },
      TX: { code: "Electrical Contractor + Solar Retailer (SB 1036)", board: "TDLR", expYears: "Same as Electrician", exams: "Electrical exam", bondAmt: "None (state level)", wcExempt: true, timeline: "Same as Electrician path", cost: "$200–$500+", ceHours: "Same as Electrician", notes: "Solar installation in Texas requires an Electrical Contractor license through TDLR. New SB 1036 (effective Sept 2026) adds mandatory registration for solar retailers and salespeople — separate from installation licensing. Retailers must include licensed electrical contractor details in every sale. Homeowners get a 5-day cancellation window. Major growth market driven by IRA incentives.", unionLocals: "IBEW locals", unionHr: "$40+/hr" },
    }
  },
  genEng: {
    name: "Heavy Civil / Engineering", slug: "heavy-civil",
    tagline: "Roads, bridges, pipelines. The biggest projects in construction.",
    desc: "Infrastructure and heavy civil projects — highways, bridges, dams, airports, pipelines, utilities.",
    salary: { entry: "$55–70K", mid: "$80–95K", senior: "$110–140K+", union: "$130–180K+", top: "$250K+ (business owners)" },
    growth: "5% nationally", physical: 3, mathLevel: "Very High", bizPotential: 4, speed: 1,
    whyChoose: "Access to the largest construction projects in the country. Infrastructure spending is at historic highs. Strong union presence. Most Class A holders have engineering backgrounds.",
    states: {
      CA: { code: "A", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: true, timeline: "6–14 months", cost: "$1,200–$3,000+", ceHours: "None required", unionLocals: "Operating Engineers, Laborers, Teamsters", unionHr: "Varies" },
      TX: { code: "No state license required", board: "City/project-level", expYears: "N/A", exams: "None (state level)", bondAmt: "Per-project", wcExempt: true, timeline: "Immediate (no state license)", cost: "Varies by city/project", ceHours: "None", notes: "Texas has no state-level heavy civil/engineering contractor license. Requirements are set by cities and project owners. Government contracts typically require bonds, insurance, and workers' comp. Texas infrastructure spending is among the highest in the nation — massive highway, pipeline, and energy projects.", unionLocals: "Operating Engineers, Laborers, Teamsters", unionHr: "Varies" },
    }
  },
  roofer: {
    name: "Roofer", slug: "roofer",
    tagline: "Fast entry, year-round work, quick path to running your own crew.",
    desc: "Install, repair, and maintain roofs on residential, commercial, and industrial buildings.",
    salary: { entry: "$38–50K", mid: "$55–68K", senior: "$75–90K+", union: "$85–110K+", top: "$150K+ (business owners)" },
    growth: "2% nationally", physical: 5, mathLevel: "Low", bizPotential: 4, speed: 4,
    whyChoose: "One of the fastest trades to start working in. Relatively low barriers to entry. Strong demand in California's climate. Quick path to crew leadership and business ownership.",
    states: {
      CA: { code: "C-39", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: false, timeline: "4–12 months", cost: "$900–$2,200+", ceHours: "None required", unionLocals: "Roofers Local 36 (LA), Local 95 (SD)", unionHr: "$40+/hr" },
      TX: { code: "No state license required", board: "City-level only", expYears: "None (state level)", exams: "None (state level)", bondAmt: "Varies by city", wcExempt: true, timeline: "Immediate (no state license)", cost: "$100–$300 (city registration)", ceHours: "None", notes: "Texas does not require a state roofing license. Some cities require contractor registration. Workers' comp is optional. The Texas roofing market is one of the largest in the country due to hail and storm damage — high demand year-round.", unionLocals: "Roofers Local 123 (Houston), Local 22 (Dallas)", unionHr: "$30+/hr" },
    }
  },
  painter: {
    name: "Painter", slug: "painter",
    tagline: "Easiest trade to enter. Low startup costs. Fast to business ownership.",
    desc: "Interior and exterior painting, surface preparation, specialty finishes, and wallcoverings.",
    salary: { entry: "$35–45K", mid: "$48–58K", senior: "$65–75K+", union: "$75–95K+", top: "$120K+ (business owners)" },
    growth: "4% nationally", physical: 3, mathLevel: "Low", bizPotential: 4, speed: 5,
    whyChoose: "Lowest barrier to entry of any licensed trade. Easiest exam. Lowest insurance costs. Fastest path to owning your own business. Marketing and client relationships matter more than technical complexity.",
    states: {
      CA: { code: "C-33", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: true, timeline: "4–10 months", cost: "$900–$1,800", ceHours: "None required", unionLocals: "IUPAT DC 36", unionHr: "$36+/hr" },
      TX: { code: "No state license required", board: "None", expYears: "None", exams: "None", bondAmt: "None", wcExempt: true, timeline: "Immediate", cost: "Minimal (business registration only)", ceHours: "None", notes: "Texas has no state license requirement for painters. You can start a painting business with just a general business registration. Some cities may require contractor registration. EPA Lead-Safe certification required for pre-1978 homes (federal requirement, not state). This is one of the easiest trades to start a business in Texas.", unionLocals: "IUPAT", unionHr: "$25+/hr" },
    }
  },
  concrete: {
    name: "Concrete Worker", slug: "concrete",
    tagline: "Foundational trade. Every building starts with concrete.",
    desc: "Form, pour, finish, and stamp concrete for foundations, driveways, patios, retaining walls, and commercial structures.",
    salary: { entry: "$38–48K", mid: "$55–68K", senior: "$75–90K+", union: "$85–110K+", top: "$150K+ (business owners)" },
    growth: "3% nationally", physical: 5, mathLevel: "Medium", bizPotential: 4, speed: 3,
    whyChoose: "Concrete is needed on every construction project. Steady demand regardless of market conditions. Work is physically demanding but deeply satisfying. Decorative concrete (stamping, staining) is a growing premium market.",
    states: {
      CA: { code: "C-8", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: false, timeline: "4–12 months", cost: "$900–$2,200+", ceHours: "None required", unionLocals: "OPCMIA Cement Masons", unionHr: "$42+/hr" },
      TX: { code: "No state license required", board: "None", expYears: "None", exams: "None", bondAmt: "None", wcExempt: true, timeline: "Immediate", cost: "Minimal (business registration only)", ceHours: "None", notes: "Texas has no state license requirement for concrete work. You can start immediately with a general business registration. Some cities may require contractor registration for permitted work. Workers' comp optional. Texas's massive construction market means high demand for concrete workers year-round.", unionLocals: "OPCMIA locals", unionHr: "$30+/hr" },
    }
  },
  drywall: {
    name: "Drywall Installer", slug: "drywall",
    tagline: "Needed on every building. Fast to learn, steady demand.",
    desc: "Install gypsum wallboard, metal framing, taping, and texturing for walls and ceilings.",
    salary: { entry: "$38–48K", mid: "$52–64K", senior: "$70–80K+", union: "$80–100K+", top: "$130K+ (business owners)" },
    growth: "3% nationally", physical: 4, mathLevel: "Low", bizPotential: 3, speed: 4,
    whyChoose: "Needed on literally every building project. One of the easier trades to enter. Consistent, year-round demand. Fast to learn the basics, but finishing quality separates the good from the great.",
    states: {
      CA: { code: "C-9", board: "CSLB", expYears: 4, exams: 2, bondAmt: "$25,000", wcExempt: true, timeline: "4–10 months", cost: "$900–$1,800", ceHours: "None required", unionLocals: "IUPAT", unionHr: "$38+/hr" },
      TX: { code: "No state license required", board: "None", expYears: "None", exams: "None", bondAmt: "None", wcExempt: true, timeline: "Immediate", cost: "Minimal (business registration only)", ceHours: "None", notes: "Texas has no state license requirement for drywall installation. Start with a general business registration. Some cities may require contractor registration. Workers' comp optional. Texas's booming residential and commercial construction creates steady drywall demand.", unionLocals: "IUPAT", unionHr: "$28+/hr" },
    }
  },
};

const ALL_STATES = {
  AL:{name:"Alabama"},AK:{name:"Alaska"},AZ:{name:"Arizona"},AR:{name:"Arkansas"},
  CA:{name:"California",board:"Contractors State License Board (CSLB)",boardUrl:"https://cslb.ca.gov",hasData:true},
  CO:{name:"Colorado"},CT:{name:"Connecticut"},DE:{name:"Delaware"},FL:{name:"Florida"},
  GA:{name:"Georgia"},HI:{name:"Hawaii"},ID:{name:"Idaho"},IL:{name:"Illinois"},
  IN:{name:"Indiana"},IA:{name:"Iowa"},KS:{name:"Kansas"},KY:{name:"Kentucky"},
  LA:{name:"Louisiana"},ME:{name:"Maine"},MD:{name:"Maryland"},MA:{name:"Massachusetts"},
  MI:{name:"Michigan"},MN:{name:"Minnesota"},MS:{name:"Mississippi"},MO:{name:"Missouri"},
  MT:{name:"Montana"},NE:{name:"Nebraska"},NV:{name:"Nevada"},NH:{name:"New Hampshire"},
  NJ:{name:"New Jersey"},NM:{name:"New Mexico"},NY:{name:"New York"},NC:{name:"North Carolina"},
  ND:{name:"North Dakota"},OH:{name:"Ohio"},OK:{name:"Oklahoma"},OR:{name:"Oregon"},
  PA:{name:"Pennsylvania"},RI:{name:"Rhode Island"},SC:{name:"South Carolina"},SD:{name:"South Dakota"},
  TN:{name:"Tennessee"},TX:{name:"Texas",board:"Texas Dept. of Licensing & Regulation (TDLR) / TX State Board of Plumbing Examiners (TSBPE)",boardUrl:"https://tdlr.texas.gov",hasData:true},UT:{name:"Utah"},VT:{name:"Vermont"},
  VA:{name:"Virginia"},WA:{name:"Washington"},WV:{name:"West Virginia"},WI:{name:"Wisconsin"},
  WY:{name:"Wyoming"},DC:{name:"Washington D.C."}
};

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */

const P = {
  bg: "#fff", soft: "#f7f8fa", card: "#fff",
  ink: "#111827", mid: "#374151", muted: "#6b7280", light: "#9ca3af",
  blue: "#1d4ed8", blueLight: "#dbeafe",
  green: "#059669", greenLight: "#d1fae5",
  amber: "#d97706", amberLight: "#fef3c7",
  violet: "#7c3aed", violetLight: "#ede9fe",
  red: "#dc2626", redLight: "#fee2e2",
  border: "#e5e7eb", borderDark: "#d1d5db",
};
const font = "'DM Sans', system-ui, sans-serif";
const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`;

/* ═══════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════ */

function Bar({ v, max = 5 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{ width: 14, height: 6, borderRadius: 1, background: i < v ? (v >= 4 ? P.green : v >= 3 ? P.amber : P.muted) : "#f1f5f9" }} />
      ))}
    </div>
  );
}

function TrustStrip() {
  return (
    <div style={{ borderBottom: `1px solid ${P.border}`, padding: "8px 16px", display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", fontSize: 11, color: P.muted, fontWeight: 500 }}>
      <span>Sourced from state licensing boards</span><span>·</span>
      <span>Updated March 2026</span><span>·</span>
      <span>Free — no sign-in</span><span>·</span>
      <span>Not legal advice</span>
    </div>
  );
}

function Nav({ onHome, onQuiz, current }) {
  return (
    <div style={{ borderBottom: `1px solid ${P.border}`, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 960, margin: "0 auto" }}>
      <span onClick={onHome} style={{ fontWeight: 800, fontSize: 15, color: P.blue, cursor: "pointer", letterSpacing: 0.5 }}>PathToTrades</span>
      <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 600 }}>
        <span onClick={onQuiz} style={{ color: current === "quiz" ? P.blue : P.muted, cursor: "pointer" }}>Find your trade</span>
        <span onClick={onHome} style={{ color: current === "home" ? P.blue : P.muted, cursor: "pointer" }}>Browse by state</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   US MAP — clickable state grid
   ═══════════════════════════════════════════════ */

const ST_POS = [
  ["AK",0,6],["HI",1,6],
  ["WA",1,0],["OR",0,1],["CA",0,3],["NV",1,2],["ID",2,1],["MT",3,0],["WY",3,1],["UT",2,2],["CO",3,2],["AZ",1,3],["NM",2,3],
  ["ND",5,0],["SD",5,1],["NE",5,2],["KS",5,3],["OK",5,4],["TX",4,5],
  ["MN",6,0],["IA",6,1],["MO",6,2],["AR",6,3],["LA",6,4],
  ["WI",7,0],["IL",7,1],["IN",8,1],["MI",8,0],["OH",9,0],
  ["KY",8,2],["TN",7,3],["MS",7,4],["AL",8,4],
  ["WV",9,2],["VA",10,2],["NC",9,3],["SC",10,3],["GA",9,4],["FL",10,5],
  ["PA",10,1],["NY",10,0],["NJ",11,2],["DE",11,3],["MD",11,4],["DC",10,4],
  ["CT",12,1],["RI",12,2],["MA",12,0],["VT",11,0],["NH",11,1],["ME",12,0],
];

function USMap({ onSelectState }) {
  const [hover, setHover] = useState(null);
  const cW = 50, cH = 40, px = 6, py = 6;
  // dedup ME/MA overlap: shift ME
  const positions = ST_POS.map(([a,c,r]) => {
    if (a === "ME") return [a, 13, 0];
    return [a,c,r];
  });
  return (
    <div style={{ overflowX: "auto", padding: "0 4px" }}>
      <svg viewBox={`0 0 ${14 * cW + px * 2} ${7 * cH + py * 2}`} style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
        {positions.map(([abbr, col, row]) => {
          const st = ALL_STATES[abbr];
          if (!st) return null;
          const hasData = st.hasData;
          const isH = hover === abbr;
          const x = px + col * cW, y = py + row * cH;
          return (
            <g key={abbr} onClick={() => onSelectState(abbr)} onMouseEnter={() => setHover(abbr)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <rect x={x} y={y} width={cW - 3} height={cH - 3} rx={4}
                fill={hasData ? (isH ? "#bbf7d0" : P.greenLight) : (isH ? "#f1f5f9" : "#fff")}
                stroke={hasData ? P.green : P.border} strokeWidth={1} />
              <text x={x + (cW - 3) / 2} y={y + (cH - 3) / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                fill={hasData ? P.green : P.muted} fontSize={12} fontWeight={700} fontFamily={font}>{abbr}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6, fontSize: 11, color: P.muted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: P.greenLight, border: `1px solid ${P.green}` }} /> Data available</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#fff", border: `1px solid ${P.border}` }} /> Coming soon</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMING SOON STATE PAGE
   ═══════════════════════════════════════════════ */

function ComingSoonState({ stateAbbr, onBack, email, setEmail, emailSent, onSubmitEmail }) {
  const st = ALL_STATES[stateAbbr];
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: P.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: font, marginBottom: 20, display: "block" }}>← Back to map</button>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: P.ink, marginBottom: 8 }}>{st?.name}</h1>
      <p style={{ fontSize: 16, color: P.muted, marginBottom: 24, lineHeight: 1.6 }}>We're building detailed trade licensing roadmaps for {st?.name}.<br />Be the first to know when it launches.</p>
      {!emailSent ? (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: "12px 14px", borderRadius: 6, border: `1px solid ${P.borderDark}`, background: "#fff", color: P.ink, fontSize: 14, outline: "none", fontFamily: font }} />
            <button onClick={() => onSubmitEmail("waitlist-" + stateAbbr)} style={{ padding: "12px 24px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 14, background: P.blue, color: "#fff", cursor: "pointer", fontFamily: font, whiteSpace: "nowrap" }}>Notify me</button>
          </div>
          <p style={{ fontSize: 11, color: P.light, marginTop: 8 }}>One email, once — when {st?.name} goes live.</p>
        </div>
      ) : (
        <div style={{ padding: 16, borderRadius: 8, background: P.greenLight, display: "inline-block" }}>
          <span style={{ fontWeight: 700, color: P.green }}>You're on the list for {st?.name}.</span>
        </div>
      )}
      <div style={{ marginTop: 40, padding: 20, borderRadius: 10, background: P.soft, border: `1px solid ${P.border}`, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 8 }}>While you wait</div>
        <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.6 }}>Salary data, job growth, and trade comparisons are national. Take the quiz to find which trade fits you — that works for every state.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   QUIZ COMPONENT
   ═══════════════════════════════════════════════ */

function QuizView({ onResult }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});

  const handleAnswer = (opts) => {
    const newScores = { ...scores };
    for (const [trade, pts] of Object.entries(opts.scores)) {
      newScores[trade] = (newScores[trade] || 0) + pts;
    }
    setScores(newScores);

    if (step < QUIZ.length - 1) {
      setStep(step + 1);
    } else {
      const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
      onResult(sorted.slice(0, 3).map(([key]) => key));
    }
  };

  const q = QUIZ[step];
  const pct = Math.round(((step) / QUIZ.length) * 100);

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: P.ink, lineHeight: 1.1, marginBottom: 8 }}>What trade is right for you?</h1>
        <p style={{ fontSize: 15, color: P.muted }}>6 questions. 2 minutes. Get a personalized recommendation.</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: P.muted, marginBottom: 6 }}>
          <span>Question {step + 1} of {QUIZ.length}</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 4, background: P.border, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: P.blue, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 800, color: P.ink, marginBottom: 20 }}>{q.q}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)} style={{
            padding: "16px 20px", borderRadius: 10, border: `1px solid ${P.border}`, background: "#fff",
            color: P.ink, fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: font,
            transition: "all 0.12s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = P.blue; e.currentTarget.style.background = P.blueLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.background = "#fff"; }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   QUIZ RESULTS — email gate
   ═══════════════════════════════════════════════ */

function QuizResults({ results, onSelectTrade, email, setEmail, emailSent, onSubmitEmail }) {
  const topTrades = results.map(key => ({ key, ...TRADES[key] }));

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: P.green, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Your results</div>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: P.ink, lineHeight: 1.1, marginBottom: 8 }}>Your top {topTrades.length} trades</h1>
        <p style={{ fontSize: 15, color: P.muted }}>Based on your answers, here's where you'd thrive.</p>
      </div>

      {topTrades.map((t, i) => (
        <div key={t.key} style={{ marginBottom: 16, padding: 20, borderRadius: 10, border: `1px solid ${i === 0 ? P.blue : P.border}`, background: i === 0 ? P.blueLight : "#fff", cursor: "pointer" }}
          onClick={() => onSelectTrade(t.key)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i === 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: P.blue, color: "#fff", fontWeight: 700 }}>Best match</span>}
              <span style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>{t.name}</span>
            </div>
            <span style={{ fontSize: 13, color: P.green, fontWeight: 700 }}>{t.growth}</span>
          </div>
          <p style={{ fontSize: 14, color: P.mid, marginBottom: 10 }}>{t.tagline}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: P.muted, flexWrap: "wrap" }}>
            <span>Entry: <strong style={{ color: P.ink }}>{t.salary.entry}</strong></span>
            <span>Union: <strong style={{ color: P.violet }}>{t.salary.union}</strong></span>
            <span>Business owners: <strong style={{ color: P.amber }}>{t.salary.top}</strong></span>
          </div>
        </div>
      ))}

      {!emailSent ? (
        <div style={{ marginTop: 24, padding: 24, borderRadius: 10, background: P.soft, border: `1px solid ${P.border}`, textAlign: "center" }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: P.ink }}>Get your personalized career guide</h3>
          <p style={{ fontSize: 13, color: P.muted, marginBottom: 14 }}>How to get started in your recommended trade — training options, hiring tips, and the full licensing roadmap for your state.</p>
          <div style={{ display: "flex", gap: 6, maxWidth: 380, margin: "0 auto" }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: "10px 14px", borderRadius: 6, border: `1px solid ${P.borderDark}`, background: "#fff", color: P.ink, fontSize: 14, outline: "none", fontFamily: font }} />
            <button onClick={onSubmitEmail} style={{ padding: "10px 20px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 14, background: P.blue, color: "#fff", cursor: "pointer", fontFamily: font }}>Send it</button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 24, padding: 20, borderRadius: 10, background: P.greenLight, textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: P.green, fontSize: 15 }}>Check your inbox — your guide is on the way.</div>
        </div>
      )}

      <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: P.muted }}>Click any trade above to see the full step-by-step roadmap.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TRADE DETAIL PAGE — human-readable
   ═══════════════════════════════════════════════ */

function TradeDetail({ tradeKey, state, onBack }) {
  const t = TRADES[tradeKey];
  const s = t.states[state];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: P.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: font, marginBottom: 20 }}>← Back</button>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: P.ink, lineHeight: 1.1, marginBottom: 6 }}>How to Become a Licensed {t.name}</h1>
        <p style={{ fontSize: 14, color: P.muted }}>{ALL_STATES[state]?.name || state} {ALL_STATES[state]?.board ? `· ${ALL_STATES[state].board}` : ""}</p>
        {s?.code && <p style={{ fontSize: 12, color: P.light, marginTop: 4 }}>Classification: {s.code}</p>}
      </div>

      <p style={{ fontSize: 15, color: P.mid, lineHeight: 1.7, marginBottom: 24 }}>{t.desc}</p>

      <div style={{ padding: 18, borderRadius: 10, background: P.blueLight, border: `1px solid #93c5fd`, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: P.blue, marginBottom: 8 }}>Why choose this trade?</div>
        <p style={{ fontSize: 14, color: P.mid, lineHeight: 1.65 }}>{t.whyChoose}</p>
      </div>

      {/* Salary */}
      <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${P.border}`, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ padding: "18px 16px", background: P.soft }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Non-Union</div>
            {[["Entry", t.salary.entry], ["Mid-Career", t.salary.mid], ["Senior", t.salary.senior]].map(([l, v], i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 8 : 0 }}>
                <div style={{ fontSize: 11, color: P.muted }}>{l}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>{v}<span style={{ fontSize: 11, color: P.light }}>/yr</span></div>
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 16px", background: P.violetLight, borderLeft: `1px solid ${P.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: P.violet, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>Union</div>
            <div style={{ fontSize: 9, color: P.muted, marginBottom: 12 }}>{s?.unionLocals || "Check local unions"}</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: P.muted }}>Total Comp</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: P.violet }}>{t.salary.union}<span style={{ fontSize: 11, color: P.light }}>/yr</span></div>
            </div>
            {s?.unionHr && <div><div style={{ fontSize: 11, color: P.muted }}>Hourly</div><div style={{ fontSize: 19, fontWeight: 800, color: P.violet }}>{s.unionHr}</div></div>}
          </div>
        </div>
        <div style={{ padding: "8px 16px", background: P.amberLight, borderTop: `1px solid ${P.border}`, textAlign: "center", fontSize: 12, fontWeight: 700, color: P.amber }}>Business owners: {t.salary.top}</div>
      </div>

      {/* Quick stats */}
      {s && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
          {[{ l: "Total cost", v: s.cost, c: P.green, bg: P.greenLight }, { l: "Timeline", v: s.timeline, c: P.blue, bg: P.blueLight }, { l: "Job growth", v: t.growth, c: P.amber, bg: P.amberLight }].map((x, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 8, background: x.bg, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: P.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2, fontWeight: 600 }}>{x.l}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: x.c }}>{x.v}</div>
            </div>
          ))}
        </div>
      )}

      {/* State-specific licensing info */}
      {s && (
        <div style={{ padding: 18, borderRadius: 10, background: P.soft, border: `1px solid ${P.border}`, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 12 }}>Licensing requirements — {ALL_STATES[state]?.name}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 13 }}>
            <div><span style={{ color: P.muted }}>Experience: </span><strong>{s.expYears} years journey-level</strong></div>
            <div><span style={{ color: P.muted }}>Exams: </span><strong>{s.exams} (Law & Business + Trade)</strong></div>
            <div><span style={{ color: P.muted }}>Bond: </span><strong>{s.bondAmt}</strong></div>
            <div><span style={{ color: P.muted }}>Workers' comp: </span><strong style={{ color: !s.wcExempt ? P.red : P.ink }}>{s.wcExempt ? "Exemption available" : "Mandatory (no exemption)"}</strong></div>
            <div><span style={{ color: P.muted }}>CE: </span><strong>{s.ceHours}</strong></div>
            {s.prereqs && <div style={{ gridColumn: "1 / -1" }}><span style={{ color: P.amber }}>Prerequisite: </span><strong>{s.prereqs}</strong></div>}
          </div>
          {s.notes && <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: "#fff", border: `1px solid ${P.border}` }}><div style={{ fontSize: 11, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Important notes</div><p style={{ fontSize: 12, color: P.mid, lineHeight: 1.6 }}>{s.notes}</p></div>}
          <div style={{ marginTop: 12, fontSize: 11, color: P.light }}>Source: {ALL_STATES[state]?.board} · Updated March 2026</div>
        </div>
      )}

      {!s && (
        <div style={{ padding: 20, borderRadius: 10, background: P.amberLight, border: "1px solid #fde68a", textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.amber, marginBottom: 4 }}>Coming soon: {ALL_STATES[state]?.name || state}</div>
          <p style={{ fontSize: 13, color: P.mid }}>We're building detailed licensing roadmaps for this state. Enter your email below to get notified when it's ready.</p>
        </div>
      )}

      {/* Trade comparison stats */}
      <div style={{ padding: 18, borderRadius: 10, border: `1px solid ${P.border}`, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 12 }}>How this trade compares</div>
        <div style={{ display: "grid", gap: 8 }}>
          {[["Physical demand", t.physical], ["Math required", { Low: 2, Medium: 3, High: 4, "Very High": 5 }[t.mathLevel]], ["Business ownership potential", t.bizPotential], ["Speed to first paycheck", t.speed]].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span style={{ color: P.muted }}>{label}</span>
              <Bar v={val} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: P.light, marginTop: 20 }}>Sources: State licensing boards · BLS.gov · Union locals · Updated March 2026 · pathtotrades.com</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LANDING PAGE — quiz CTA + US map
   ═══════════════════════════════════════════════ */

function LandingView({ onSelectTrade, onQuiz, onSelectState }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: P.blue, textTransform: "uppercase", letterSpacing: 3, marginBottom: 10 }}>PathToTrades</div>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 14, color: P.ink }}>Find your path into<br />the skilled trades.</h1>
        <p style={{ fontSize: 16, color: P.muted, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.65 }}>Free step-by-step guides to getting licensed, finding work, and building a career in construction trades. Every state, every trade, every cost.</p>
        <button onClick={onQuiz} style={{ padding: "14px 32px", borderRadius: 8, border: "none", background: P.blue, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: font }}>Take the quiz — find your trade</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 28, padding: "10px 16px", borderRadius: 8, background: P.greenLight, border: "1px solid #a7f3d0" }}>
        <span style={{ fontSize: 13, color: P.green, fontWeight: 700 }}>47% of skilled trades workers now earn more than the median college graduate</span>
        <span style={{ fontSize: 11, color: P.muted, marginLeft: 6 }}>— Birmingham Group</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: P.ink, marginBottom: 4 }}>Choose your state</h2>
        <p style={{ fontSize: 13, color: P.muted }}>Click a state to see trades and licensing requirements</p>
      </div>

      <USMap onSelectState={onSelectState} />

      <div style={{ textAlign: "center", marginTop: 32, padding: 20, borderRadius: 10, background: P.soft, border: `1px solid ${P.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginBottom: 4 }}>Not sure which trade? Start with the quiz.</div>
        <p style={{ fontSize: 13, color: P.muted, marginBottom: 12 }}>6 questions. 2 minutes. Personalized recommendation with salary data.</p>
        <button onClick={onQuiz} style={{ padding: "10px 24px", borderRadius: 6, border: "none", background: P.blue, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: font }}>Take the quiz</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BROWSE TRADES FOR A STATE
   ═══════════════════════════════════════════════ */

function BrowseTradesView({ state, onSelectTrade, onBack, onQuiz }) {
  const [sort, setSort] = useState(null);
  const stInfo = ALL_STATES[state];
  const SORTS = [
    { key: "salary", label: "Highest paying" },
    { key: "speed", label: "Fastest to start" },
    { key: "bizPotential", label: "Best for business" },
    { key: "physicalInv", label: "Least physical" },
  ];
  const sorted = Object.entries(TRADES).sort((a, b) => {
    if (!sort) return 0;
    if (sort === "salary") return 0;
    if (sort === "physicalInv") return a[1].physical - b[1].physical;
    return b[1][sort] - a[1][sort];
  });
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: P.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: font, marginBottom: 20 }}>← Back to map</button>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: P.ink, lineHeight: 1.1, marginBottom: 6 }}>Trades in {stInfo?.name || state}</h1>
        {stInfo?.board && <p style={{ fontSize: 13, color: P.muted }}>{stInfo.board}</p>}
        <button onClick={onQuiz} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 6, border: `1px solid ${P.blue}`, background: "transparent", color: P.blue, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: font }}>Not sure which trade? Take the quiz</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {SORTS.map(s => (
          <button key={s.key} onClick={() => setSort(sort === s.key ? null : s.key)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${sort === s.key ? P.blue : P.border}`, background: sort === s.key ? P.blueLight : "#fff", color: sort === s.key ? P.blue : P.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font }}>{s.label}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {sorted.map(([key, t], i) => {
          const hasState = !!t.states[state];
          return (
            <div key={key} onClick={() => onSelectTrade(key)} style={{ padding: "16px 18px", borderRadius: 8, background: P.card, border: `1px solid ${P.border}`, cursor: "pointer", transition: "all 0.12s", animation: `fi 0.3s ease ${i * 0.025}s both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = P.blue; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: P.ink }}>{t.name}</h3>
                {hasState && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: P.greenLight, color: P.green, fontWeight: 700 }}>{stInfo?.name} data</span>}
              </div>
              <p style={{ fontSize: 12, color: P.muted, lineHeight: 1.5, marginBottom: 10 }}>{t.tagline}</p>
              <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12, alignItems: "center" }}>
                <div><span style={{ color: P.muted }}>Entry </span><span style={{ fontWeight: 700 }}>{t.salary.entry}</span></div>
                <div><span style={{ color: P.violet, fontWeight: 600 }}>Union </span><span style={{ fontWeight: 700, color: P.violet }}>{t.salary.union}</span></div>
                <span style={{ fontSize: 11, color: P.green, fontWeight: 600 }}>{t.growth}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════ */

const track = (event, data = {}) => {
  try { fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, ...data, referrer: document.referrer }) }); } catch(e) {}
};

export default function App() {
  const [view, setView] = useState("home");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => { track("pageview", { page: view, state: selectedState }); }, [view]);

  const submitEmail = (source) => {
    if (!email.includes("@")) return;
    const fd = new URLSearchParams();
    fd.append("form-name", "email-capture");
    fd.append("email", email);
    fd.append("trade", selectedTrade || quizResults?.[0] || "none");
    fd.append("source", source);
    fd.append("state", selectedState || "none");
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: fd.toString() })
      .then(() => { setEmailSent(true); track("email_submit", { trade: selectedTrade, source, state: selectedState }); })
      .catch(() => setEmailSent(true));
  };

  const goHome = () => { setView("home"); setSelectedTrade(null); setSelectedState(null); };
  const goQuiz = () => { setView("quiz"); track("quiz_start"); };

  const selectState = (abbr) => {
    setSelectedState(abbr);
    setEmailSent(false);
    track("state_click", { state: abbr });
    if (ALL_STATES[abbr]?.hasData) {
      setView("stateTrades");
    } else {
      setView("comingSoon");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectTrade = (key) => {
    setSelectedTrade(key);
    setView("trade");
    track("trade_click", { trade: key, state: selectedState });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.ink, fontFamily: font }}>
      <style>{css}</style>
      <TrustStrip />
      <Nav onHome={goHome} onQuiz={goQuiz} current={view === "quiz" || view === "quizResults" ? "quiz" : "home"} />

      {view === "home" && <LandingView onSelectTrade={selectTrade} onQuiz={goQuiz} onSelectState={selectState} />}

      {view === "comingSoon" && selectedState && (
        <ComingSoonState stateAbbr={selectedState} onBack={goHome} email={email} setEmail={setEmail} emailSent={emailSent} onSubmitEmail={submitEmail} />
      )}

      {view === "stateTrades" && selectedState && (
        <BrowseTradesView state={selectedState} onSelectTrade={selectTrade} onBack={goHome} onQuiz={goQuiz} />
      )}

      {view === "quiz" && (
        <QuizView onResult={(results) => { setQuizResults(results); setView("quizResults"); track("quiz_complete", { top: results[0] }); }} />
      )}

      {view === "quizResults" && quizResults && (
        <QuizResults results={quizResults} onSelectTrade={selectTrade} email={email} setEmail={setEmail} emailSent={emailSent} onSubmitEmail={() => submitEmail("quiz")} />
      )}

      {view === "trade" && selectedTrade && (
        <TradeDetail tradeKey={selectedTrade} state={selectedState || "CA"} onBack={() => {
          if (quizResults) setView("quizResults");
          else if (selectedState) setView("stateTrades");
          else goHome();
        }} />
      )}
    </div>
  );
}
