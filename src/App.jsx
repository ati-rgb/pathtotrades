import { useState, useEffect } from "react";

/* ── SVG ICONS (inline, zero-load, consistent cross-device) ── */
const I = {
  bolt: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  wrench: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  wind: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>,
  building: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01"/></svg>,
  sun: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  bridge: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M2 18h20"/><path d="M6 12a6 6 0 0 1 12 0"/></svg>,
  roof: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21L12 3l9 18"/><path d="M3 21h18"/></svg>,
  brush: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z"/><path d="M9 8C5.49 12 1 21 1 21s9-4.49 13-8"/></svg>,
  cube: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  ruler: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.32 4.36a.5.5 0 0 0 .62.62l4.36-1.32a2 2 0 0 0 .83-.5z"/><path d="M15 5l4 4"/><path d="M13.5 6.5l2 2"/><path d="M11 8l2 2"/><path d="M8.5 9.5l2 2"/></svg>,
};

const ICON_MAP = { "C-10": "bolt", "C-36": "wrench", "C-20": "wind", "B": "building", "C-46": "sun", "A": "bridge", "C-39": "roof", "C-33": "brush", "C-8": "cube", "C-9": "ruler" };

function TradeIcon({ code, size = 18, color }) {
  const fn = I[ICON_MAP[code]];
  return fn ? <span style={{ color: color || P.blue, display: "inline-flex" }}>{fn(size)}</span> : null;
}

/* ── PROGRESS BAR ── */
function ProgressBar({ steps, expanded }) {
  const completed = Object.keys(expanded).filter(k => expanded[k]).length;
  const pct = Math.round((completed / steps.length) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 1 }}>{steps.length}-step roadmap</span>
        <span style={{ fontSize: 11, color: completed > 0 ? P.green : P.muted, fontWeight: 600 }}>{completed}/{steps.length} reviewed</span>
      </div>
      <div style={{ height: 4, background: P.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: completed === steps.length ? P.green : P.blue, borderRadius: 2, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TRADE DATA — 10 California CSLB classifications
   Sources: CSLB, BLS, IBEW, UA, SB 607, SB 216
   Last verified: March 2026
   ════════════════════════════════════════ */

const TRADES = {
  "C-10": {
    name: "Electrical Contractor", code: "C-10",
    desc: "Wiring, lighting, solar PV, and power systems for residential, commercial, and industrial projects.",
    salary: { entry: "$66K", mid: "$78K", senior: "$95K+", unionJ: "$106K+", unionTotal: "$140–180K+", unionHr: "$51+/hr", unionLocal: "IBEW Local 11 LA · Local 569 SD", top: "$200K+ owners" },
    growth: "9%", employed: "72,880", timeline: "4–12 mo", cost: "$900–$2K+",
    tags: ["high-pay", "high-demand"],
    compare: { difficulty: 4, physical: 3, bizSpeed: 3, barrier: 4, ceiling: 5, seasonal: 1 },
    wcExempt: false,
    steps: [
      { id: 1, title: "Verify 4 years experience", time: "Before applying", cost: "$0", body: "Journeyman-level electrical within last 10 years. Education substitutes up to 3 years.", docs: ["Work Experience form (supervisor-signed)", "W-2s / pay stubs backup", "Transcripts if substituting"], tip: "Experience verification is the #1 delay. Start gathering docs now." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk wait", cost: "$450", body: "Application for Original Contractor License, C-10 classification. Mail with fee.", docs: ["CSLB application", "Experience forms", "$450 check/MO"], tip: "CSLB is backlogged 8–12 weeks. Don't quit your day job until your number is in hand." },
      { id: 3, title: "Fingerprinting (Live Scan)", time: "1 day", cost: "$49–80", body: "DOJ + FBI background check. Must be a fresh scan for CSLB.", docs: ["Photo ID", "CSLB Live Scan form"], tip: "Do this while your app processes — runs in parallel." },
      { id: 4, title: "Prep for & pass 2 exams", time: "1–3 months", cost: "$150–500", body: "Law & Business (115 Qs, 3.5 hrs) + C-10 Trade (100 Qs, 3.5 hrs). Closed-book, 72% to pass. 18-month window, 3-week retake wait.", docs: ["Prep course enrollment"], tip: "Law & Business: study mechanics liens, payroll taxes, contract law — NOT trade codes. 50% fail without prep, 90%+ pass with a course.", flag: "hard" },
      { id: 5, title: "Complete asbestos open-book exam", time: "1–2 hours", cost: "$0", body: "Mandatory for ALL new CSLB applicants. Awareness only, not certification.", docs: ["Asbestos Exam & Verification Form"], tip: "Easy but mandatory — CSLB cannot issue your license without it." },
      { id: 6, title: "File $25,000 contractor bond", time: "1–3 days", cost: "$250–600/yr", body: "Increased from $15K in 2023 (SB 607). Separate $25K BQI bond if RME/RMO without 10%+ ownership. LLCs need extra $100K bond.", docs: ["Surety bond certificate", "BQI bond (if needed)"], tip: "Many sources still say $15K — it's been $25K since Jan 2023.", flag: "cost" },
      { id: 7, title: "Get workers' comp insurance", time: "1–3 days", cost: "$800–3K+/yr", body: "Cannot exempt even as solo operator. Ghost policies start ~$800–1,500/yr.", docs: ["WC certificate filed with CSLB"], tip: "CSLB won't issue without WC on file. Get quotes from State Fund CA.", flag: "cost" },
      { id: 8, title: "Pay fee & receive license", time: "1–2 weeks", cost: "$200", body: "C-10 valid 2 years. 32 hours CE each renewal. License # on all ads, cards, contracts, vehicles.", docs: ["$200 payment"], tip: "Congratulations — you're a licensed C-10 Electrical Contractor." }
    ]
  },
  "C-36": {
    name: "Plumbing Contractor", code: "C-36",
    desc: "Water supply, drainage, gas piping, and fixtures for residential and commercial properties.",
    salary: { entry: "$63K", mid: "$75K", senior: "$90K+", unionJ: "$133K+", unionTotal: "$150K+", unionHr: "$64+/hr", unionLocal: "UA Local 447", top: "$150K+ owners" },
    growth: "4%", employed: "55,000+", timeline: "4–12 mo", cost: "$900–$2K+",
    tags: ["high-pay"],
    compare: { difficulty: 4, physical: 4, bizSpeed: 3, barrier: 4, ceiling: 5, seasonal: 1 },
    wcExempt: true,
    steps: [
      { id: 1, title: "Verify 4 years plumbing experience", time: "Before applying", cost: "$0", body: "Journeyman-level within last 10 years. Water supply, drainage, gas piping.", docs: ["Work Experience form", "W-2s / tax returns"], tip: "⚠ OWNER-BUILDER TRAP: Homeowner-signed verifications get flagged for audit nearly 100%. Have backup docs.", flag: "warn" },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-36 classification. 8–12 week backlogs.", docs: ["Application", "Experience forms", "$450 fee"], tip: "CSLB verifies ~3% of claims — if audited, they want 4 years of paychecks." },
      { id: 3, title: "Fingerprinting", time: "1 day", cost: "$49–80", body: "Live Scan for DOJ/FBI.", docs: ["Photo ID", "Live Scan form"], tip: "Do immediately — runs in parallel." },
      { id: 4, title: "Prep for & pass 2 exams", time: "1–3 months", cost: "$150–500", body: "Law & Business + C-36 Trade. Both closed-book, 72% to pass.", docs: ["Prep materials"], tip: "Law & Business: mechanics liens, payroll taxes. Trade: CA Plumbing Code.", flag: "hard" },
      { id: 5, title: "Asbestos open-book exam", time: "1–2 hours", cost: "$0", body: "Mandatory for all CSLB applicants.", docs: ["Asbestos form"], tip: "Don't let this simple step hold up your license." },
      { id: 6, title: "File $25K bond + insurance", time: "1–3 days", cost: "$250–600/yr + WC", body: "$25K bond (up from $15K in 2023). WC expansion delayed to 2028 but CSLB already flagging renewals.", docs: ["Surety bond", "WC certificate"], tip: "Bond is $25K not $15K since Jan 2023.", flag: "cost" },
      { id: 7, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-36 valid 2 years. CSLB doesn't require CE but industry increasingly expects it.", docs: ["$200 payment"], tip: "Stay current with CA Plumbing Code updates every 3 years." }
    ]
  },
  "C-20": {
    name: "HVAC Contractor", code: "C-20",
    desc: "Heating, ventilating, air-conditioning, and evaporative cooling for residential and commercial.",
    salary: { entry: "$58K", mid: "$70K", senior: "$85K+", unionJ: "$95K+", unionTotal: "$120K+", unionHr: "$45+/hr", unionLocal: "UA HVAC/R Techs", top: "$130K+ owners" },
    growth: "9%", employed: "40,000+", timeline: "4–12 mo", cost: "$900–$2.2K+",
    tags: ["high-demand"],
    compare: { difficulty: 4, physical: 3, bizSpeed: 3, barrier: 4, ceiling: 4, seasonal: 2 },
    wcExempt: false,
    steps: [
      { id: 1, title: "Get EPA 608 Universal cert", time: "1–2 weeks", cost: "$10–150", body: "MANDATORY prerequisite. Any tech handling refrigerants needs this. Never expires.", docs: ["EPA 608 card"], tip: "Can't touch a manifold without this. Online from $10 (SkillCat) to $150.", flag: "warn" },
      { id: 2, title: "Verify 4 years HVAC experience", time: "Before applying", cost: "$0", body: "Journeyman-level. Must include heating, ventilation, AC, or evaporative cooling.", docs: ["Work Experience form", "W-2s", "EPA 608 copy"], tip: "General construction alone won't qualify." },
      { id: 3, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-20 classification. Highest-demand class in CA.", docs: ["Application", "Experience forms", "$450"], tip: "Submit early — backlogs are real." },
      { id: 4, title: "Fingerprinting + pass 2 exams", time: "1–3 months", cost: "$200–580", body: "Live Scan + Law & Business + C-20 Trade. Includes R-454B refrigerant regs.", docs: ["Live Scan", "HVAC prep (2026 ed.)"], tip: "Law & Business: liens, taxes. Trade: refrigeration cycles, electrical.", flag: "hard" },
      { id: 5, title: "Asbestos + Lead-Safe exams", time: "1–2 hours", cost: "$0", body: "Mandatory asbestos awareness. Lead-Safe recommended for pre-1978 buildings.", docs: ["Asbestos form"], tip: "CSLB can't issue license without asbestos form." },
      { id: 6, title: "File $25K bond + workers' comp", time: "1–3 days", cost: "$250–600 + $1.5K–3K+/yr WC", body: "⚠ C-20 CANNOT exempt from WC — mandatory since July 2023 (SB 216). Even solo.", docs: ["Surety bond", "WC certificate (no exemption)"], tip: "WC for solo C-20 runs $1.5–3K+/yr. Ghost policy is cheapest.", flag: "cost" },
      { id: 7, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-20 valid 2 years. Consider NATE certification.", docs: ["$200 payment"], tip: "Consider refrigerant handling liability coverage." }
    ]
  },
  "B": {
    name: "General Building Contractor", code: "B",
    desc: "Any building requiring 2+ unrelated trades. The most versatile contractor license in California.",
    salary: { entry: "$65K", mid: "$85K", senior: "$100K+", unionJ: "Varies", unionTotal: "$120–160K+", unionHr: "Varies", unionLocal: "Carpenters, Laborers, etc.", top: "$200K+ owners" },
    growth: "5%", employed: "100,000+", timeline: "4–12 mo", cost: "$900–$2K+",
    tags: ["versatile", "high-pay"],
    compare: { difficulty: 4, physical: 3, bizSpeed: 4, barrier: 4, ceiling: 5, seasonal: 1 },
    wcExempt: true,
    steps: [
      { id: 1, title: "Verify 4 years multi-trade exp", time: "Before applying", cost: "$0", body: "Must show breadth across 2+ unrelated trades (framing, concrete, drywall, etc.).", docs: ["Experience forms", "W-2s / tax returns"], tip: "CSLB audits ~3% — if audited, they want 4 years of documentation." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "Class B General Building. Most versatile license.", docs: ["Application", "Experience forms", "$450"], tip: "Opens whole-building projects — significantly larger opportunities." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "1–3 months", cost: "$200–580", body: "Live Scan + Law & Business + Class B Trade. B exam is broader than specialty exams.", docs: ["Live Scan", "B prep materials"], tip: "B trade exam covers multiple trades + project management. Allow extra study time.", flag: "hard" },
      { id: 4, title: "Asbestos open-book exam", time: "1–2 hrs", cost: "$0", body: "Mandatory for all.", docs: ["Asbestos form"], tip: "Quick and mandatory." },
      { id: 5, title: "File $25K bond + insurance", time: "1–3 days", cost: "$250–600/yr + WC", body: "$25K bond. WC delayed to 2028 but most clients require it. GCs need higher liability.", docs: ["Surety bond", "WC certificate"], tip: "Most GC clients require WC for bid qualification.", flag: "cost" },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "Class B valid 2 years. 5 hrs CE each renewal.", docs: ["$200 payment"], tip: "You can now bid on multi-trade projects." }
    ]
  },
  "C-46": {
    name: "Solar Contractor", code: "C-46",
    desc: "Solar energy systems — install, modify, maintain, repair. California's fastest-growing classification.",
    salary: { entry: "$55K", mid: "$70K", senior: "$85K+", unionJ: "$100K+", unionTotal: "$130K+", unionHr: "$48+/hr", unionLocal: "IBEW (solar = electrical)", top: "$150K+ owners" },
    growth: "22%", employed: "30,000+", timeline: "4–12 mo", cost: "$900–$2K+",
    tags: ["high-demand", "fast-growth"],
    compare: { difficulty: 3, physical: 3, bizSpeed: 4, barrier: 3, ceiling: 4, seasonal: 2 },
    wcExempt: true,
    steps: [
      { id: 1, title: "Verify 4 years solar experience", time: "Before applying", cost: "$0", body: "CSLB may accept combo of solar + electrical experience.", docs: ["Experience form", "Solar project docs", "NABCEP (recommended)"], tip: "One of the most valuable licenses in CA right now." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-46 Solar. Fastest-growing classification.", docs: ["Application", "Experience forms", "$450"], tip: "Newest CSLB classification — demand is exploding." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "1–3 months", cost: "$200–580", body: "Live Scan + Law & Business + C-46 Trade. Covers PV design, NEC, inverters, Title 24.", docs: ["Live Scan", "Solar prep (2026 ed.)"], tip: "Trade: inverters, battery storage, Title 24/NEM." },
      { id: 4, title: "Asbestos exam", time: "1–2 hrs", cost: "$0", body: "Mandatory. Relevant for rooftop work on older buildings.", docs: ["Asbestos form"], tip: "Quick." },
      { id: 5, title: "File $25K bond + insurance", time: "1–3 days", cost: "$250–600/yr + WC", body: "$25K bond. WC strongly recommended — rooftop fall liability.", docs: ["Surety bond", "WC or exemption"], tip: "Most clients require WC for bid qualification." },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-46 valid 2 years. NABCEP cert commands premium pricing.", docs: ["$200 payment"], tip: "NABCEP Board Certified = significant credibility." }
    ]
  },
  "A": {
    name: "General Engineering", code: "A",
    desc: "Infrastructure and heavy civil — roads, bridges, pipelines, airports, dams, sewers, utilities.",
    salary: { entry: "$70K", mid: "$90K", senior: "$110K+", unionJ: "Varies", unionTotal: "$130–180K+", unionHr: "Varies", unionLocal: "Operating Engineers, Laborers", top: "$250K+ owners" },
    growth: "5%", employed: "25,000+", timeline: "6–14 mo", cost: "$1.2K–$3K+",
    tags: ["high-pay", "advanced"],
    compare: { difficulty: 5, physical: 3, bizSpeed: 2, barrier: 5, ceiling: 5, seasonal: 1 },
    wcExempt: true,
    steps: [
      { id: 1, title: "Verify engineering experience", time: "Before applying", cost: "$0", body: "4 years infrastructure/heavy civil. Most holders have engineering degrees in practice.", docs: ["Work Experience form", "W-2s", "Degree transcripts"], tip: "Hardest license to qualify for. Must be infrastructure-focused.", flag: "warn" },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "Class A General Engineering.", docs: ["Application", "Experience forms", "$450"], tip: "Public works, highways, bridges — biggest projects in the state." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "2–4 months", cost: "$350–880", body: "One of the hardest CSLB exams — earthwork, grading, utilities, structural concepts.", docs: ["Live Scan", "Class A prep"], tip: "Requires genuine engineering knowledge. Most need a dedicated prep course.", flag: "hard" },
      { id: 4, title: "Asbestos exam", time: "1–2 hrs", cost: "$0", body: "Mandatory. Class A eligible for hazmat certification.", docs: ["Asbestos form"], tip: "For demolition/hazmat, need additional CSLB cert." },
      { id: 5, title: "File $25K bond + insurance + project bonds", time: "1–3 days", cost: "$250–600/yr + WC + project bonds", body: "Class A typically requires performance + payment bonds per project.", docs: ["Surety bond", "WC certificate", "Project bonds"], tip: "Factor project-specific bonds into every bid.", flag: "cost" },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "Class A valid 2 years. Access to largest CA projects.", docs: ["$200 payment"], tip: "Welcome to heavy civil." }
    ]
  },
  "C-39": {
    name: "Roofing Contractor", code: "C-39",
    desc: "Install, repair, maintain roofs — residential, commercial, industrial. Year-round CA demand.",
    salary: { entry: "$50K", mid: "$62K", senior: "$80K+", unionJ: "$85K+", unionTotal: "$110K+", unionHr: "$40+/hr", unionLocal: "Roofers Local 36 LA · Local 95 SD", top: "$150K+ owners" },
    growth: "2%", employed: "18,000+", timeline: "4–12 mo", cost: "$900–$2.2K+",
    tags: [],
    compare: { difficulty: 3, physical: 5, bizSpeed: 4, barrier: 3, ceiling: 4, seasonal: 2 },
    wcExempt: false,
    steps: [
      { id: 1, title: "Verify 4 years roofing experience", time: "Before applying", cost: "$0", body: "Installation, repair, maintenance of roofing systems.", docs: ["Work Experience form", "W-2s"], tip: "Roofing only — general construction doesn't count." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-39 Roofing. Higher-risk classification = higher insurance.", docs: ["Application", "Experience forms", "$450"], tip: "Insurance costs reflect the risk level." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "1–3 months", cost: "$200–580", body: "Law & Business + C-39 Trade. Materials, waterproofing, safety.", docs: ["Live Scan", "Roofing prep"], tip: "Know your materials — built-up, mod-bit, single-ply, tile, shingle, metal." },
      { id: 4, title: "Asbestos exam", time: "1–2 hrs", cost: "$0", body: "Critical — old roofs frequently contain asbestos.", docs: ["Asbestos form"], tip: "Know the rules for asbestos-containing roofing materials." },
      { id: 5, title: "File $25K bond + workers' comp", time: "1–3 days", cost: "$250–600 + $2K–5K+/yr WC", body: "⚠ C-39 CANNOT exempt from WC — mandatory even solo. Roofing WC = highest premiums.", docs: ["Surety bond", "WC (no exemption)"], tip: "Budget $2–5K+/yr for WC from day one.", flag: "cost" },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-39 valid 2 years.", docs: ["$200 payment"], tip: "OSHA fall protection training reduces premiums and keeps you alive." }
    ]
  },
  "C-33": {
    name: "Painting & Decorating", code: "C-33",
    desc: "Interior/exterior painting, surface prep, specialty finishes, wallcoverings. 2nd-largest specialty class (12,450+ licensees).",
    salary: { entry: "$45K", mid: "$55K", senior: "$70K+", unionJ: "$75K+", unionTotal: "$95K+", unionHr: "$36+/hr", unionLocal: "IUPAT DC 36", top: "$120K+ owners" },
    growth: "4%", employed: "35,000+", timeline: "4–10 mo", cost: "$900–$1.8K",
    tags: ["easy-entry", "fast-start"],
    compare: { difficulty: 2, physical: 3, bizSpeed: 5, barrier: 2, ceiling: 3, seasonal: 2 },
    wcExempt: true,
    steps: [
      { id: 1, title: "Verify 4 years painting experience", time: "Before applying", cost: "$0", body: "Journeyman-level interior/exterior painting, surface prep, finishes.", docs: ["Work Experience form", "W-2s"], tip: "One of the easiest trades to document — must be journeyman, not helper." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-33. 2nd largest specialty class — competition is fierce.", docs: ["Application", "Experience forms", "$450"], tip: "Differentiation matters more here than most trades." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "1–2 months", cost: "$200–480", body: "C-33 trade exam is one of the easier CSLB exams.", docs: ["Live Scan", "Painting prep"], tip: "Trade exam is easy. Law & Business is where people fail." },
      { id: 4, title: "Asbestos + Lead-Safe exams", time: "1–2 hrs", cost: "$0", body: "Asbestos mandatory. Lead-Safe/RRP critical for pre-1978 work.", docs: ["Asbestos form", "RRP cert (rec.)"], tip: "Lead-Safe is critical for residential work." },
      { id: 5, title: "File $25K bond + insurance", time: "1–3 days", cost: "$250–600/yr", body: "$25K bond. WC exemption available until 2028. Lower insurance than most trades.", docs: ["Surety bond", "WC or exemption"], tip: "Lower insurance costs = pricing advantage." },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-33 valid 2 years.", docs: ["$200 payment"], tip: "Marketing and estimating matter more than brushwork." }
    ]
  },
  "C-8": {
    name: "Concrete Contractor", code: "C-8",
    desc: "Foundations, driveways, patios, retaining walls, commercial structures. Essential to every project.",
    salary: { entry: "$48K", mid: "$62K", senior: "$80K+", unionJ: "$85K+", unionTotal: "$110K+", unionHr: "$42+/hr", unionLocal: "OPCMIA Cement Masons", top: "$150K+ owners" },
    growth: "3%", employed: "30,000+", timeline: "4–12 mo", cost: "$900–$2.2K+",
    tags: [],
    compare: { difficulty: 3, physical: 5, bizSpeed: 3, barrier: 3, ceiling: 4, seasonal: 2 },
    wcExempt: false,
    steps: [
      { id: 1, title: "Verify 4 years concrete experience", time: "Before applying", cost: "$0", body: "Forming, pouring, finishing, stamping, flatwork, structural.", docs: ["Work Experience form", "W-2s"], tip: "Must be concrete-specific. General laborer work doesn't count." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-8 Concrete. Steady demand regardless of market.", docs: ["Application", "Experience forms", "$450"], tip: "Fundamental to construction — always in demand." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "1–3 months", cost: "$200–580", body: "Law & Business + C-8 Trade. Mix design, forming, finishing, reinforcement.", docs: ["Live Scan", "Concrete prep"], tip: "Know ACI standards, mix ratios, CA seismic requirements." },
      { id: 4, title: "Asbestos exam", time: "1–2 hrs", cost: "$0", body: "Mandatory.", docs: ["Asbestos form"], tip: "Quick and mandatory." },
      { id: 5, title: "File $25K bond + workers' comp", time: "1–3 days", cost: "$250–600 + $1.5K–3K+/yr WC", body: "⚠ C-8 CANNOT exempt from WC — mandatory since July 2023 (SB 216).", docs: ["Surety bond", "WC (no exemption)"], tip: "Budget WC from day one.", flag: "cost" },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-8 valid 2 years.", docs: ["$200 payment"], tip: "Concrete = crew work. Most successful C-8s have 2–3 workers from day one." }
    ]
  },
  "C-9": {
    name: "Drywall Contractor", code: "C-9",
    desc: "Gypsum wallboard, metal framing, taping, texturing. Needed on every building project.",
    salary: { entry: "$48K", mid: "$60K", senior: "$75K+", unionJ: "$80K+", unionTotal: "$100K+", unionHr: "$38+/hr", unionLocal: "IUPAT", top: "$130K+ owners" },
    growth: "3%", employed: "25,000+", timeline: "4–10 mo", cost: "$900–$1.8K",
    tags: ["easy-entry"],
    compare: { difficulty: 2, physical: 4, bizSpeed: 4, barrier: 2, ceiling: 3, seasonal: 1 },
    wcExempt: true,
    steps: [
      { id: 1, title: "Verify 4 years drywall experience", time: "Before applying", cost: "$0", body: "Hanging, taping, texturing, metal framing. Journeyman-level.", docs: ["Work Experience form", "W-2s"], tip: "Accessible trade to qualify for." },
      { id: 2, title: "Submit CSLB application", time: "1 day + 8–12 wk", cost: "$450", body: "C-9 Drywall. Consistent demand.", docs: ["Application", "Experience forms", "$450"], tip: "Every building needs drywall." },
      { id: 3, title: "Fingerprinting + pass 2 exams", time: "1–2 months", cost: "$200–480", body: "C-9 exam is straightforward. Focus study on Law & Business.", docs: ["Live Scan", "Drywall prep"], tip: "Trade exam is easy — Law & Business is where people fail." },
      { id: 4, title: "Asbestos exam", time: "1–2 hrs", cost: "$0", body: "Mandatory. Older buildings may have asbestos in joint compound.", docs: ["Asbestos form"], tip: "Know the rules for existing asbestos-containing compound." },
      { id: 5, title: "File $25K bond + insurance", time: "1–3 days", cost: "$250–600/yr", body: "$25K bond. WC exemption available until 2028.", docs: ["Surety bond", "WC or exemption"], tip: "Most profitable as crew — budget for WC from the start." },
      { id: 6, title: "Receive license", time: "1–2 weeks", cost: "$200", body: "C-9 valid 2 years.", docs: ["$200 payment"], tip: "Speed + quality = contracts." }
    ]
  }
};

const FILTERS = [
  { key: "ceiling", label: "Highest earning", inv: false },
  { key: "bizSpeed", label: "Fastest to start", inv: false },
  { key: "barrier", label: "Easiest entry", inv: true },
  { key: "physical", label: "Least physical", inv: true },
];

const FINDER = [
  { q: "What best describes the work you do (or want to do)?", opts: [
    { label: "Electrical / wiring / power", codes: ["C-10"] },
    { label: "Plumbing / pipes / gas", codes: ["C-36"] },
    { label: "HVAC / heating / cooling", codes: ["C-20"] },
    { label: "Solar panels / renewables", codes: ["C-46"] },
    { label: "Whole buildings / general construction", codes: ["B"] },
    { label: "Roads / bridges / infrastructure", codes: ["A"] },
    { label: "Roofing", codes: ["C-39"] },
    { label: "Painting / finishing", codes: ["C-33"] },
    { label: "Concrete / foundations", codes: ["C-8"] },
    { label: "Drywall / framing", codes: ["C-9"] },
    { label: "I'm not sure yet", codes: [] },
  ]}
];

/* ─── COLORS ─── */
const P = {
  bg: "#fff", soft: "#f7f8fa", card: "#fff",
  ink: "#111827", mid: "#374151", muted: "#6b7280", light: "#9ca3af",
  blue: "#1d4ed8", blueLight: "#dbeafe", blueMid: "#3b82f6",
  green: "#059669", greenLight: "#d1fae5",
  amber: "#d97706", amberLight: "#fef3c7",
  violet: "#7c3aed", violetLight: "#ede9fe",
  red: "#dc2626", redLight: "#fee2e2",
  border: "#e5e7eb", borderDark: "#d1d5db",
};

/* ─── COMPONENTS ─── */
function Bar({ v, max = 5, color = P.blue }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{ width: 14, height: 6, borderRadius: 1, background: i < v ? (v >= 4 ? P.green : v >= 3 ? P.amber : P.muted) : "#f1f5f9" }} />
      ))}
    </div>
  );
}

function Sal({ salary }) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${P.border}`, marginBottom: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "18px 16px", background: P.soft }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Non-Union</div>
          {[["Entry", salary.entry], ["Mid", salary.mid], ["Senior", salary.senior]].map(([l, v], i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ fontSize: 11, color: P.muted }}>{l}</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>{v}<span style={{ fontSize: 11, color: P.light }}>/yr</span></div>
            </div>
          ))}
        </div>
        <div style={{ padding: "18px 16px", background: P.violetLight, borderLeft: `1px solid ${P.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: P.violet, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>Union</div>
          <div style={{ fontSize: 9, color: P.muted, marginBottom: 12 }}>{salary.unionLocal}</div>
          {[["Journeyman", salary.unionJ], ["Hourly", salary.unionHr], ["Total comp", salary.unionTotal]].map(([l, v], i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ fontSize: 11, color: P.muted }}>{l}</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: P.violet }}>{v}{i !== 1 && <span style={{ fontSize: 11, color: P.light }}>/yr</span>}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "8px 16px", background: P.amberLight, borderTop: `1px solid ${P.border}`, textAlign: "center", fontSize: 12, fontWeight: 700, color: P.amber }}>Business owners: {salary.top}</div>
    </div>
  );
}

function Step({ s, idx, total, open, toggle }) {
  const last = idx === total - 1;
  const flagCol = s.flag === "cost" ? P.amber : s.flag === "hard" ? P.red : s.flag === "warn" ? P.amber : P.blue;
  const flagBg = s.flag === "cost" ? P.amberLight : s.flag === "hard" ? P.redLight : s.flag === "warn" ? P.amberLight : P.blueLight;
  return (
    <div style={{ display: "flex", gap: 14, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: s.flag ? flagCol : P.blue, color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{s.id}</div>
        {!last && <div style={{ width: 1.5, flex: 1, background: P.border, minHeight: 12 }} />}
      </div>
      <div onClick={toggle} style={{ flex: 1, marginBottom: last ? 0 : 8, padding: "12px 16px", borderRadius: 8, background: open ? P.soft : P.card, border: `1px solid ${open ? (s.flag ? flagBg : P.blueLight) : P.border}`, cursor: "pointer", transition: "all 0.12s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, color: P.ink, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{s.title}</h3>
              {s.flag === "hard" && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: P.redLight, color: P.red, fontWeight: 700 }}>Key step</span>}
              {s.flag === "cost" && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: P.amberLight, color: P.amber, fontWeight: 700 }}>$$</span>}
              {s.flag === "warn" && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: P.amberLight, color: P.amber, fontWeight: 700 }}>Heads up</span>}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: P.blue, background: P.blueLight, padding: "1px 7px", borderRadius: 4, fontWeight: 600 }}>{s.time}</span>
              <span style={{ fontSize: 11, color: P.green, background: P.greenLight, padding: "1px 7px", borderRadius: 4, fontWeight: 600 }}>{s.cost}</span>
            </div>
          </div>
          <div style={{ color: P.light, fontSize: 14, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", flexShrink: 0, marginTop: 2 }}>▼</div>
        </div>
        {open && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: P.mid, lineHeight: 1.65, margin: "0 0 12px", fontSize: 13 }}>{s.body}</p>
            <div style={{ background: "#fff", borderRadius: 6, padding: 12, marginBottom: 8, border: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Documents</div>
              {s.docs.map((d, i) => <div key={i} style={{ color: P.mid, fontSize: 12, padding: "2px 0" }}>→ {d}</div>)}
            </div>
            <div style={{ background: s.flag ? flagBg : P.soft, border: `1px solid ${s.flag ? (s.flag === "hard" ? "#fca5a5" : "#fde68a") : P.border}`, borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.flag ? flagCol : P.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{s.flag === "warn" ? "Heads up" : s.flag === "hard" ? "Study tip" : s.flag === "cost" ? "Cost note" : "Pro tip"}</div>
              <div style={{ color: P.mid, fontSize: 12, lineHeight: 1.55 }}>{s.tip}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
const track = (event, data = {}) => {
  try { fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, ...data, referrer: document.referrer }) }); } catch(e) {}
};

export default function App() {
  const [sel, setSel] = useState(null);
  const [exp, setExp] = useState({});
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [filter, setFilter] = useState(null);
  const [finder, setFinder] = useState(false);
  const [finderResult, setFinderResult] = useState(null);
  const trade = sel ? TRADES[sel] : null;

  useEffect(() => { track("pageview", { page: "home" }); }, []);

  const submit = () => {
    if (!email.includes("@")) return;
    const fd = new URLSearchParams();
    fd.append("form-name", "email-capture");
    fd.append("email", email);
    fd.append("trade", sel || "homepage");
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: fd.toString() })
      .then(() => { setSent(true); track("email_submit", { trade: sel || "homepage" }); })
      .catch(() => setSent(true));
  };

  const selectTrade = (code) => { setSel(code); setExp({}); track("trade_click", { trade: code }); };
  const toggleStep = (id) => { setExp(p => { const n = { ...p, [id]: !p[id] }; if (!p[id]) track("step_expand", { trade: sel }); return n; }); };
  const clickFinder = () => { setFinder(true); track("finder_click"); };
  const clickFilter = (key) => { setFilter(filter === key ? null : key); track("filter_click", { trade: key }); };

  useEffect(() => { if (sel) { track('pageview', { page: sel }); window.scrollTo({ top: 0, behavior: "smooth" }); } }, [sel]);

  const sorted = Object.entries(TRADES).sort((a, b) => {
    if (!filter) return 0;
    const f = FILTERS.find(x => x.key === filter);
    return f?.inv ? a[1].compare[filter] - b[1].compare[filter] : b[1].compare[filter] - a[1].compare[filter];
  });

  const font = "'DM Sans', system-ui, sans-serif";

  /* ── HOME ── */
  if (!trade) return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.ink, fontFamily: font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Trust strip */}
      <div style={{ borderBottom: `1px solid ${P.border}`, padding: "8px 16px", display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", fontSize: 11, color: P.muted, fontWeight: 500 }}>
        <span>Sourced from CSLB.ca.gov</span>
        <span>·</span>
        <span>Updated March 2026</span>
        <span>·</span>
        <span>Free — no sign-in</span>
        <span>·</span>
        <span>Not legal advice</span>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "36px 20px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: P.blue, textTransform: "uppercase", letterSpacing: 3, marginBottom: 10 }}>PathToTrades</div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 14, color: P.ink }}>Get your California contractor license<br />without piecing together 10 websites.</h1>
          <p style={{ fontSize: 16, color: P.muted, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.65 }}>Step-by-step roadmaps for {Object.keys(TRADES).length} CSLB classifications. Every cost, document, timeline, and exam tip — plus union vs non-union salary data.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <button onClick={clickFinder} style={{ padding: "12px 28px", borderRadius: 8, border: "none", background: P.blue, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: font }}>Find my license path</button>
            <button onClick={() => { setFinder(false); document.getElementById("trades")?.scrollIntoView({ behavior: "smooth" }); }} style={{ padding: "12px 28px", borderRadius: 8, border: `1px solid ${P.border}`, background: "#fff", color: P.mid, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: font }}>Browse all trades</button>
          </div>
        </div>

        {/* Stat banner */}
        <div style={{ textAlign: "center", marginBottom: 32, padding: "10px 16px", borderRadius: 8, background: P.greenLight, border: "1px solid #a7f3d0" }}>
          <span style={{ fontSize: 13, color: P.green, fontWeight: 700 }}>47% of skilled trades workers now earn more than the median college graduate</span>
          <span style={{ fontSize: 11, color: P.muted, marginLeft: 6 }}>— Birmingham Group</span>
        </div>

        {/* Finder modal */}
        {finder && !finderResult && (
          <div style={{ marginBottom: 32, padding: 24, borderRadius: 10, border: `2px solid ${P.blue}`, background: P.blueLight }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: P.ink }}>Which license do you need?</h2>
            <p style={{ fontSize: 13, color: P.mid, marginBottom: 16 }}>{FINDER[0].q}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {FINDER[0].opts.map((opt, i) => (
                <button key={i} onClick={() => {
                  if (opt.codes.length === 1) { selectTrade(opt.codes[0]); setFinder(false); }
                  else if (opt.codes.length === 0) { setFinder(false); setFinderResult(null); }
                  else { setFinderResult(opt.codes); }
                }} style={{ padding: "10px 14px", borderRadius: 6, border: `1px solid ${P.border}`, background: "#fff", color: P.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: font, transition: "border-color 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = P.blue}
                  onMouseLeave={e => e.currentTarget.style.borderColor = P.border}>
                  {opt.codes[0] ? <TradeIcon code={opt.codes[0]} size={14} color={P.mid} /> : "→"} {opt.label}
                </button>
              ))}
            </div>
            <button onClick={() => setFinder(false)} style={{ marginTop: 12, padding: "6px 16px", borderRadius: 6, border: `1px solid ${P.border}`, background: "#fff", color: P.muted, fontSize: 12, cursor: "pointer", fontFamily: font }}>Close</button>
          </div>
        )}

        {/* Trades grid */}
        <div id="trades">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>{Object.keys(TRADES).length} California contractor licenses</h2>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => clickFilter(f.key)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${filter === f.key ? P.blue : P.border}`, background: filter === f.key ? P.blueLight : "#fff", color: filter === f.key ? P.blue : P.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font }}>{f.label}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {sorted.map(([code, t], i) => (
              <div key={code} onClick={() => selectTrade(code)} style={{ padding: "16px 18px", borderRadius: 8, background: P.card, border: `1px solid ${P.border}`, cursor: "pointer", transition: "all 0.12s", animation: `fi 0.3s ease ${i * 0.025}s both` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = P.blue; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <TradeIcon code={code} size={16} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: P.blue, background: P.blueLight, padding: "1px 7px", borderRadius: 4 }}>{code}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {t.tags.includes("high-pay") && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: P.greenLight, color: P.green, fontWeight: 700 }}>High pay</span>}
                    {t.tags.includes("high-demand") && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: P.blueLight, color: P.blue, fontWeight: 700 }}>High demand</span>}
                    {t.tags.includes("easy-entry") && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: P.amberLight, color: P.amber, fontWeight: 700 }}>Easy entry</span>}
                    {t.tags.includes("fast-growth") && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: P.violetLight, color: P.violet, fontWeight: 700 }}>Fast growth</span>}
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: P.ink }}>{t.name}</h3>
                <p style={{ fontSize: 12, color: P.muted, lineHeight: 1.5, marginBottom: 10 }}>{t.desc.substring(0, 80)}...</p>
                <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12, alignItems: "center" }}>
                  <div><span style={{ color: P.muted }}>Entry </span><span style={{ fontWeight: 700 }}>{t.salary.entry}</span></div>
                  <div><span style={{ color: P.violet, fontWeight: 600 }}>Union </span><span style={{ fontWeight: 700, color: P.violet }}>{t.salary.unionJ}</span></div>
                  <div style={{ color: P.muted, fontSize: 11 }}>{t.timeline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email CTA */}
        <div style={{ textAlign: "center", marginTop: 36, padding: 24, borderRadius: 10, background: P.soft, border: `1px solid ${P.border}` }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: P.ink }}>Get printable checklists + cost calculators</h3>
          <p style={{ color: P.muted, fontSize: 13, marginBottom: 14, maxWidth: 440, margin: "0 auto 14px" }}>PDF checklists you can print and bring to the CSLB office, exam prep plans, cost breakdowns — plus new trades added weekly.</p>
          {!sent ? (
            <div style={{ display: "flex", gap: 6, maxWidth: 380, margin: "0 auto" }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: "10px 14px", borderRadius: 6, border: `1px solid ${P.borderDark}`, background: "#fff", color: P.ink, fontSize: 14, outline: "none", fontFamily: font }} />
              <button onClick={submit} style={{ padding: "10px 20px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 14, background: P.blue, color: "#fff", cursor: "pointer", fontFamily: font }}>Notify me</button>
            </div>
          ) : <div style={{ color: P.green, fontWeight: 700, fontSize: 14 }}>✓ You're on the list</div>}
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: P.light }}>Sources: CSLB.ca.gov · BLS.gov · IBEW · UA · Updated March 2026 · pathtotrades.com</div>
      </div>
    </div>
  );

  /* ── ROADMAP ── */
  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.ink, fontFamily: font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${P.border}`, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: P.muted }}>
        <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: P.blue, fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: font }}>← All trades</button>
        <span>Updated March 2026 · CSLB sourced · pathtotrades.com</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px", paddingBottom: sent ? 28 : 80 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <TradeIcon code={sel} size={22} />
            <span style={{ fontSize: 12, fontWeight: 700, color: P.blue, background: P.blueLight, padding: "2px 10px", borderRadius: 4 }}>{trade.code}</span>
            <span style={{ fontSize: 12, color: P.muted }}>California · {trade.employed} employed</span>
            {!trade.wcExempt && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: P.redLight, color: P.red, fontWeight: 700 }}>WC mandatory</span>}
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, marginBottom: 8, color: P.ink, lineHeight: 1.1 }}>{trade.name} License Roadmap</h1>
          <p style={{ fontSize: 14, color: P.mid, lineHeight: 1.6 }}>{trade.desc}</p>
        </div>

        {/* Salary */}
        <div style={{ fontSize: 11, fontWeight: 700, color: P.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>California earnings</div>
        <Sal salary={trade.salary} />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 28 }}>
          {[{ l: "Total cost", v: trade.cost, c: P.green, bg: P.greenLight }, { l: "Timeline", v: trade.timeline, c: P.blue, bg: P.blueLight }, { l: "Job growth", v: trade.growth, c: P.amber, bg: P.amberLight }].map((s, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 8, background: s.bg, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: P.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2, fontWeight: 600 }}>{s.l}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <ProgressBar steps={trade.steps} expanded={exp} />
        <div>{trade.steps.map((s, i) => <Step key={s.id} s={s} idx={i} total={trade.steps.length} open={exp[s.id]} toggle={() => toggleStep(s.id)} />)}</div>

        {/* Union teaser */}
        <div style={{ marginTop: 20, padding: 18, borderRadius: 8, background: P.violetLight, border: "1px solid #c4b5fd", textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: P.violet, marginBottom: 4 }}>Union apprenticeship pathway coming soon</div>
          <p style={{ color: P.mid, fontSize: 12, maxWidth: 440, margin: "0 auto" }}>Higher wages, paid training, health insurance, pension — but competitive entry. Full roadmaps launching soon.</p>
        </div>

        {/* Email CTA (single) */}
        {!sent ? (
          <div style={{ marginTop: 20, padding: 24, borderRadius: 8, textAlign: "center", background: P.soft, border: `1px solid ${P.border}` }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Get the printable {trade.code} checklist (PDF)</h3>
            <p style={{ color: P.muted, fontSize: 13, marginBottom: 14, maxWidth: 440, margin: "0 auto 14px" }}>Print it, bring it to the CSLB office. Every document, fee, and deadline on one page — plus a cost calculator and exam prep plan.</p>
            <div style={{ display: "flex", gap: 6, maxWidth: 380, margin: "0 auto" }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: "10px 14px", borderRadius: 6, border: `1px solid ${P.borderDark}`, background: "#fff", color: P.ink, fontSize: 14, outline: "none", fontFamily: font }} />
              <button onClick={submit} style={{ padding: "10px 20px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 14, background: P.blue, color: "#fff", cursor: "pointer", fontFamily: font }}>Free</button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 20, padding: 20, borderRadius: 8, textAlign: "center", background: P.greenLight }}>
            <div style={{ fontWeight: 700, color: P.green }}>✓ Check your inbox</div>
          </div>
        )}

        {/* Sticky bottom bar */}
        {!sent && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "8px 16px", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderTop: `1px solid ${P.border}`, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: P.mid, fontWeight: 600 }}>{trade.code} checklist →</span>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "7px 12px", borderRadius: 6, border: `1px solid ${P.borderDark}`, background: "#fff", color: P.ink, fontSize: 13, outline: "none", width: 200, fontFamily: font }} />
            <button onClick={submit} style={{ padding: "7px 16px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 13, background: P.blue, color: "#fff", cursor: "pointer", fontFamily: font }}>Free</button>
          </div>
        )}
      </div>
    </div>
  );
}
