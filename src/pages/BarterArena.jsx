import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Timer, FileText, ScrollText,
  QrCode, MessageCircle, Copy, Check, Info,
} from "lucide-react";

/* ── Design tokens as inline CSS vars (no external CSS file needed) ── */
const TOKENS = `
  :root {
    --ba-ink:        oklch(0.22 0.015 250);
    --ba-ink-soft:   oklch(0.45 0.012 250);
    --ba-rule:       oklch(0.86 0.008 250);
    --ba-paper:      oklch(0.985 0.003 75);
    --ba-paper-2:    oklch(0.965 0.006 80);
    --ba-accent:     oklch(0.38 0.09 150);
    --ba-accent-soft:oklch(0.92 0.04 150);
    --ba-warn:       oklch(0.55 0.16 25);
  }
`;

/* ── Static data ── */
const tradeTypes = ["Creatives", "Services", "Products"];
const roles      = ["Owner", "Distributor", "Curator"];
const wants      = ["Surprise me", "Super value", "Just Something"];
const aceCards   = [
  { key: "iou", title: "Credit Note (IOU)" },
  { key: "exp", title: "Experience" },
  { key: "irl", title: "IRL Sample" },
  { key: "skl", title: "Skill Credits" },
];
const campaigns = [
  { id: "BR-014", title: "Logo for Latte",  from: "Creatives", to: "IRL Sample",    status: "Active"      },
  { id: "BR-013", title: "Yoga × Photos",   from: "Services",  to: "Skill Credits", status: "In-Progress" },
  { id: "BR-012", title: "Zine ↔ Vinyl",    from: "Products",  to: "Super value",   status: "Successful"  },
  { id: "BR-011", title: "Code Review",     from: "Services",  to: "Credit Note",   status: "Active"      },
];
const insights = [
  "Deals without a proof link fail 73% of the time.",
  "Vague terms correlate with ghosted counter-parties.",
  "Skipping the IRL sample doubles dispute rate.",
  "Over-promised IOUs lapse within 14 days.",
];
const statusLabel = { Active: "Open", "In-Progress": "In progress", Successful: "Sealed" };

/* ── Reusable pill button ── */
function Pill({ value, current, onClick }) {
  const active = value === current;
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] tracking-wide border transition-colors cursor-pointer ${
        active
          ? "bg-[var(--ba-ink)] text-[var(--ba-paper)] border-[var(--ba-ink)]"
          : "bg-transparent text-[var(--ba-ink)] border-[var(--ba-rule)] hover:border-[var(--ba-ink)]"
      }`}
    >
      {value}
    </button>
  );
}

/* ── Main component ── */
export default function BarterArena() {
  const [tradeType, setTradeType] = useState(null);
  const [role,      setRole]      = useState(null);
  const [want,      setWant]      = useState(null);
  const [ace,       setAce]       = useState(null);
  const [filter,    setFilter]    = useState("All");

  const [agreementOpen, setAgreementOpen] = useState(false);
  const [step,          setStep]          = useState("agreement"); // "agreement"|"confirm"|"sealed"
  const [mode,          setMode]          = useState("plain");     // "plain"|"legal"
  const [timeLeft,      setTimeLeft]      = useState(30);
  const [confirmLeft,   setConfirmLeft]   = useState(60);
  const [partyA,        setPartyA]        = useState(false);
  const [partyB,        setPartyB]        = useState(false);
  const [finalDiscount, setFinalDiscount] = useState(null);
  const [dealId]                          = useState(() => `BR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copied,        setCopied]        = useState(false);

  const startRef   = useRef(0);
  const confirmRef = useRef(0);

  /* 30-second review countdown */
  useEffect(() => {
    if (!agreementOpen || step !== "agreement") return;
    startRef.current = Date.now();
    setTimeLeft(30);
    const id = setInterval(() => {
      const left = Math.max(0, 30 - (Date.now() - startRef.current) / 1000);
      setTimeLeft(left);
      if (left <= 0) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [agreementOpen, step]);

  /* 60-second confirmation countdown */
  useEffect(() => {
    if (!agreementOpen || step !== "confirm") return;
    confirmRef.current = Date.now();
    setConfirmLeft(60);
    const id = setInterval(() => {
      const left = Math.max(0, 60 - (Date.now() - confirmRef.current) / 1000);
      setConfirmLeft(left);
      if (left <= 0) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  }, [agreementOpen, step]);

  /* Simulate Party B signing */
  useEffect(() => {
    if (step !== "confirm" || partyB) return;
    const t = setTimeout(() => setPartyB(true), 4000 + Math.random() * 21000);
    return () => clearTimeout(t);
  }, [step, partyB]);

  /* Auto-advance to sealed */
  useEffect(() => {
    if (step === "confirm" && partyA && partyB) setStep("sealed");
  }, [step, partyA, partyB]);

  function openAgreement() {
    setStep("agreement"); setPartyA(false); setPartyB(false);
    setFinalDiscount(null); setMode("plain"); setAgreementOpen(true);
  }
  function acceptAgreement() {
    setFinalDiscount(Number(Math.max(0, Math.min(4, (timeLeft / 30) * 4)).toFixed(2)));
    setStep("confirm");
  }

  const ready    = !!(tradeType && role && want && ace);
  const filtered = campaigns.filter(c => filter === "All" || c.status === filter).slice(0, 4);

  /* Shared label / tag styles */
  const tagCls  = "text-[9px] uppercase tracking-[0.3em] text-[var(--ba-ink-soft)]";
  const monoTag = "font-mono text-[10px] text-[var(--ba-ink-soft)]";

  return (
    <>
      {/* Inject tokens once */}
      <style>{TOKENS}</style>

      <div
        className="min-h-screen font-sans antialiased"
        style={{ background: "linear-gradient(180deg, var(--ba-paper), var(--ba-paper-2))", color: "var(--ba-ink)" }}
      >
        <div className="max-w-[460px] mx-auto px-5 py-5 flex flex-col gap-4">

          {/* ── Top bar ── */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[var(--ba-ink-soft)] hover:text-[var(--ba-ink)] transition-colors no-underline"
            >
              <ArrowLeft size={12} /> Home
            </Link>
            <span className={tagCls}>Common Junction</span>
            <span className={monoTag}>№ BR-015</span>
          </div>

          {/* ── Title ── */}
          <div className="border-b pb-3" style={{ borderColor: "var(--ba-rule)" }}>
            <h1 className="text-[28px] leading-tight m-0" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif", color: "var(--ba-ink)" }}>
              <span className="italic font-light">Barter</span> Arena
            </h1>
            <p className="text-[11px] mt-1 mb-0" style={{ color: "var(--ba-ink-soft)" }}>
              Compose a proposal. Both parties review, sign, and seal.
            </p>
          </div>

          {/* ── Proposal form ── */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border text-[11px]"
            style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper)" }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-3 py-1.5 border-b"
              style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper-2)" }}
            >
              <span className={tagCls}>Proposal</span>
              <span className={monoTag}>Draft</span>
            </div>

            {/* Form grid */}
            <div className="px-3 py-3 grid gap-x-3 gap-y-2 items-center" style={{ gridTemplateColumns: "90px 1fr" }}>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ba-ink-soft)" }}>Offering</span>
              <div className="flex flex-wrap gap-1.5">
                {tradeTypes.map(t => <Pill key={t} value={t} current={tradeType} onClick={() => setTradeType(t)} />)}
              </div>

              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ba-ink-soft)" }}>Acting as</span>
              <div className="flex flex-wrap gap-1.5">
                {roles.map(r => <Pill key={r} value={r} current={role} onClick={() => setRole(r)} />)}
              </div>

              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ba-ink-soft)" }}>In return</span>
              <div className="flex flex-wrap gap-1.5">
                {wants.map(w => <Pill key={w} value={w} current={want} onClick={() => setWant(w)} />)}
              </div>

              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ba-ink-soft)" }}>Tender</span>
              <div className="grid grid-cols-2 gap-1.5">
                {aceCards.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setAce(c.key)}
                    className={`text-left px-2 py-1.5 text-[10px] border transition-colors cursor-pointer ${
                      ace === c.key
                        ? "bg-[var(--ba-ink)] text-[var(--ba-paper)] border-[var(--ba-ink)]"
                        : "bg-transparent text-[var(--ba-ink)] border-[var(--ba-rule)] hover:border-[var(--ba-ink)]"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Card footer */}
            <div
              className="flex items-center justify-between border-t border-dashed px-3 py-2"
              style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper-2)" }}
            >
              <span
                className="text-[10px] italic"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ba-ink-soft)" }}
              >
                {ready ? `${role} offers ${tradeType} for ${want}.` : "Complete all four fields to proceed."}
              </span>
              <button
                disabled={!ready}
                onClick={openAgreement}
                className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  borderColor: "var(--ba-ink)",
                  background: "var(--ba-ink)",
                  color: "var(--ba-paper)",
                }}
                onMouseEnter={e => { if (ready) { e.target.style.background = "transparent"; e.target.style.color = "var(--ba-ink)"; }}}
                onMouseLeave={e => { e.target.style.background = "var(--ba-ink)"; e.target.style.color = "var(--ba-paper)"; }}
              >
                Propose →
              </button>
            </div>
          </motion.section>

          {/* ── Ledger filter ── */}
          <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: "var(--ba-rule)" }}>
            <span className={tagCls}>Ledger</span>
            <div className="flex gap-3">
              {["All", "Active", "In-Progress", "Successful"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-[10px] uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer p-0 ${
                    filter === s
                      ? "underline underline-offset-4"
                      : "hover:text-[var(--ba-ink)]"
                  }`}
                  style={{ color: filter === s ? "var(--ba-ink)" : "var(--ba-ink-soft)" }}
                >
                  {s === "In-Progress" ? "In Progress" : s}
                </button>
              ))}
            </div>
          </div>

          {/* ── Campaign cards ── */}
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border p-2.5 flex flex-col justify-between gap-2 transition-colors min-h-[90px]"
                style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ba-ink)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--ba-rule)")}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px]" style={{ color: "var(--ba-ink-soft)" }}>{c.id}</span>
                  <span
                    className="text-[8px] uppercase tracking-wider border-l pl-1.5"
                    style={{ color: "var(--ba-ink-soft)", borderColor: "var(--ba-rule)" }}
                  >
                    {statusLabel[c.status]}
                  </span>
                </div>
                <div>
                  <div
                    className="text-[14px] leading-tight truncate"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ba-ink)" }}
                  >
                    {c.title}
                  </div>
                  <div className="text-[9px] truncate mt-0.5" style={{ color: "var(--ba-ink-soft)" }}>
                    {c.from} ↔ {c.to}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Disclosures ── */}
          <div className="border-t pt-2" style={{ borderColor: "var(--ba-rule)" }}>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: "var(--ba-ink-soft)" }}>
              <Info size={10} /> Disclosures from prior cycles
            </div>
            <p
              className="text-[10px] italic leading-snug m-0"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ba-ink-soft)" }}
            >
              {insights.join(" · ")}
            </p>
          </div>

        </div>{/* /container */}

        {/* ══════════════════════════════════════════
            Agreement Modal
        ══════════════════════════════════════════ */}
        <AnimatePresence>
          {agreementOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              style={{ background: "oklch(0.22 0.015 250 / 0.4)" }}
              onClick={() => step === "sealed" && setAgreementOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.97, y: 12, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.97, y: 12, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-2xl overflow-hidden flex flex-col border"
                style={{
                  maxHeight: "90vh",
                  background: "var(--ba-paper)",
                  borderColor: "var(--ba-ink)",
                  boxShadow: "0 1px 2px 0 oklch(0.22 0.015 250 / 0.06), 0 8px 24px -12px oklch(0.22 0.015 250 / 0.12)",
                }}
              >

                {/* ── Step: Agreement ── */}
                {step === "agreement" && (
                  <>
                    {/* Modal header */}
                    <div className="flex items-center justify-between border-b px-5 py-3 shrink-0" style={{ borderColor: "var(--ba-rule)" }}>
                      <div className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "var(--ba-ink)" }}>
                        <ScrollText size={16} color="var(--ba-ink-soft)" />
                        Creator Agreement
                      </div>
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--ba-ink-soft)" }}>
                        <Timer size={14} />
                        <span style={{ color: timeLeft < 10 ? "var(--ba-warn)" : undefined }}>
                          {timeLeft.toFixed(1)}s
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-0.5 w-full shrink-0" style={{ background: "var(--ba-rule)" }}>
                      <div
                        className="h-full transition-all"
                        style={{ width: `${(timeLeft / 30) * 100}%`, background: "var(--ba-accent)" }}
                      />
                    </div>

                    {/* Mode tabs */}
                    <div className="flex border-b shrink-0" style={{ borderColor: "var(--ba-rule)" }}>
                      {[
                        { id: "plain", label: "Plain Text", Icon: FileText },
                        { id: "legal", label: "Legal Form", Icon: ScrollText },
                      ].map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          onClick={() => setMode(id)}
                          className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wider transition-colors cursor-pointer border-none ${
                            mode === id ? "border-b-2" : ""
                          }`}
                          style={{
                            background: mode === id ? "var(--ba-paper-2)" : "transparent",
                            color: mode === id ? "var(--ba-ink)" : "var(--ba-ink-soft)",
                            borderBottomColor: mode === id ? "var(--ba-ink)" : "transparent",
                          }}
                        >
                          <Icon size={14} /> {label}
                        </button>
                      ))}
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 px-6 py-5 text-sm" style={{ color: "var(--ba-ink)" }}>
                      {mode === "plain" ? (
                        <div className="flex flex-col gap-4">
                          <section>
                            <div className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: "var(--ba-ink-soft)" }}>Parties</div>
                            <p className="leading-relaxed m-0"><b>Party A (You):</b> {role ?? "Creator"} offering {tradeType ?? "—"}</p>
                            <p className="leading-relaxed m-0"><b>Party B (Counter-barterer):</b> Anonymous, providing "{want ?? "—"}"</p>
                          </section>
                          <hr style={{ border: "none", borderTop: "1px solid var(--ba-rule)" }} />
                          <section>
                            <div className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: "var(--ba-ink-soft)" }}>Deadlines</div>
                            <ul className="text-sm leading-relaxed space-y-0.5 pl-5 m-0">
                              <li><b>Agreement review:</b> 30 seconds.</li>
                              <li><b>Mutual confirmation:</b> 60 seconds after acceptance.</li>
                              <li><b>Delivery window:</b> 7 calendar days from confirmation.</li>
                              <li><b>Dispute window:</b> 48 hours post-delivery.</li>
                            </ul>
                          </section>
                          <hr style={{ border: "none", borderTop: "1px solid var(--ba-rule)" }} />
                          <section>
                            <div className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: "var(--ba-ink-soft)" }}>Rewards</div>
                            <ul className="text-sm leading-relaxed space-y-0.5 pl-5 m-0">
                              <li><b>Party A receives:</b> {want ?? "agreed value"} via {ace ? aceCards.find(a => a.key === ace)?.title : "selected tender"}.</li>
                              <li><b>Party B receives:</b> the offered {tradeType ?? "asset"}.</li>
                              <li><b>Platform commission:</b> 5% (less speed-based discount).</li>
                            </ul>
                          </section>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col gap-3 leading-relaxed text-justify text-[15px]"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                          <p className="m-0"><b>CREATOR-SUBJECTIVE BARTER AGREEMENT.</b> Entered into by <b>Party A</b> (undersigned creator, acting as {role ?? "Owner"}) and <b>Party B</b> (counter-bartering party) for exchange of {tradeType ?? "Subject Matter"} under modality "{want ?? "Surprise me"}".</p>
                          <p className="m-0"><b>1. PARTIES.</b> <b>Party A</b> and <b>Party B</b> each warrant authority to enter and perform this Agreement, with Common Junction (the "Platform") as facilitator and escrow of record.</p>
                          <p className="m-0"><b>2. DEADLINES.</b> (a) review concludes within thirty (30) seconds; (b) mutual confirmation within sixty (60) seconds thereafter; (c) delivery within seven (7) calendar days; (d) dispute window of forty-eight (48) hours post-delivery.</p>
                          <p className="m-0"><b>3. REWARDS &amp; CONSIDERATION.</b> <b>Party A</b> shall receive "{want ?? "Surprise me"}" via the {ace ? aceCards.find(a => a.key === ace)?.title : "elected"} tender. <b>Party B</b> shall receive the Offered Assets in entirety.</p>
                          <p className="m-0"><b>4. COMMISSION.</b> The Platform retains five percent (5%) of deemed fair value, less a Speed-Based Discount of up to four (4.00) percentage points based on remaining review time at acceptance.</p>
                          <p className="m-0"><b>5. REPRESENTATIONS.</b> Each Party warrants lawful ownership of assets it tenders, free of liens, encumbrances or third-party claims.</p>
                          <p className="m-0"><b>6. INDEMNIFICATION &amp; GOVERNING LAW.</b> Each Party shall indemnify and hold harmless the other and the Platform from all claims arising from breach.</p>
                          <p className="m-0">IN WITNESS WHEREOF, by clicking "I Agree", <b>Party A</b> affixes its digital signature and accepts all terms herein irrevocably.</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div
                      className="border-t px-5 py-3 flex items-center justify-between gap-3 shrink-0"
                      style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper-2)" }}
                    >
                      <div className="text-xs" style={{ color: "var(--ba-ink-soft)" }}>
                        Current discount:{" "}
                        <span className="font-medium" style={{ color: "var(--ba-ink)" }}>
                          {Math.max(0, Math.min(4, (timeLeft / 30) * 4)).toFixed(2)}% of 5%
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAgreementOpen(false)}
                          className="text-[11px] uppercase tracking-wider px-4 py-2 border transition-colors cursor-pointer bg-transparent"
                          style={{ borderColor: "var(--ba-rule)", color: "var(--ba-ink-soft)" }}
                          onMouseEnter={e => { e.target.style.color = "var(--ba-ink)"; e.target.style.borderColor = "var(--ba-ink)"; }}
                          onMouseLeave={e => { e.target.style.color = "var(--ba-ink-soft)"; e.target.style.borderColor = "var(--ba-rule)"; }}
                        >
                          Decline
                        </button>
                        <button
                          onClick={acceptAgreement}
                          disabled={timeLeft <= 0}
                          className="text-[11px] uppercase tracking-[0.2em] px-5 py-2 border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ borderColor: "var(--ba-ink)", background: "var(--ba-ink)", color: "var(--ba-paper)" }}
                          onMouseEnter={e => { if (timeLeft > 0) { e.target.style.background = "transparent"; e.target.style.color = "var(--ba-ink)"; }}}
                          onMouseLeave={e => { e.target.style.background = "var(--ba-ink)"; e.target.style.color = "var(--ba-paper)"; }}
                        >
                          I Agree
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step: Confirm ── */}
                {step === "confirm" && (
                  <>
                    <div className="flex items-center justify-between border-b px-5 py-3 shrink-0" style={{ borderColor: "var(--ba-rule)" }}>
                      <div className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, color: "var(--ba-ink)" }}>
                        <Timer size={16} color="var(--ba-ink-soft)" />
                        Mutual Confirmation
                        <span className="font-mono text-[10px]" style={{ color: "var(--ba-ink-soft)" }}>· {dealId}</span>
                      </div>
                      <span
                        className="font-mono text-xs"
                        style={{ color: confirmLeft < 15 ? "var(--ba-warn)" : "var(--ba-ink-soft)" }}
                      >
                        {Math.ceil(confirmLeft)}s
                      </span>
                    </div>

                    <div className="h-0.5 w-full shrink-0" style={{ background: "var(--ba-rule)" }}>
                      <div
                        className="h-full transition-all"
                        style={{ width: `${(confirmLeft / 60) * 100}%`, background: "var(--ba-accent)" }}
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
                      <p className="text-sm leading-relaxed m-0" style={{ color: "var(--ba-ink)" }}>
                        Both <b>Party A</b> and <b>Party B</b> must confirm within <b>60 seconds</b>. If the window lapses, the proposal expires and may be re-tendered later.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Party A */}
                        <div
                          className="border p-3 transition-colors"
                          style={{
                            borderColor: partyA ? "var(--ba-accent)" : "var(--ba-rule)",
                            background: partyA ? "oklch(0.92 0.04 150 / 0.3)" : "transparent",
                          }}
                        >
                          <div className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "var(--ba-ink-soft)" }}>Party A · You</div>
                          <div className="mt-1 text-base" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ba-ink)" }}>
                            {role ?? "Creator"}
                          </div>
                          <button
                            onClick={() => setPartyA(true)}
                            disabled={partyA || confirmLeft <= 0}
                            className="mt-3 w-full text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderColor: "var(--ba-ink)", background: "var(--ba-ink)", color: "var(--ba-paper)" }}
                            onMouseEnter={e => { if (!partyA && confirmLeft > 0) { e.target.style.background = "transparent"; e.target.style.color = "var(--ba-ink)"; }}}
                            onMouseLeave={e => { e.target.style.background = "var(--ba-ink)"; e.target.style.color = "var(--ba-paper)"; }}
                          >
                            {partyA ? "Confirmed ✓" : "Confirm Deal"}
                          </button>
                        </div>

                        {/* Party B */}
                        <div
                          className="border p-3 transition-colors"
                          style={{
                            borderColor: partyB ? "var(--ba-accent)" : "var(--ba-rule)",
                            background: partyB ? "oklch(0.92 0.04 150 / 0.3)" : "transparent",
                          }}
                        >
                          <div className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "var(--ba-ink-soft)" }}>Party B · Anon</div>
                          <div className="mt-1 text-base truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ba-ink)" }}>
                            Anonymous Trader
                          </div>
                          <div className="mt-3 text-center text-[11px]" style={{ color: "var(--ba-ink-soft)" }}>
                            {partyB ? (
                              "Confirmed ✓"
                            ) : (
                              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}>
                                awaiting signature…
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>

                      {confirmLeft <= 0 && !(partyA && partyB) && (
                        <div
                          className="border px-3 py-2 text-[12px]"
                          style={{ borderColor: "oklch(0.55 0.16 25 / 0.4)", background: "oklch(0.55 0.16 25 / 0.05)", color: "var(--ba-ink)" }}
                        >
                          Window closed. The proposal has expired — you may re-tender at any time.
                        </div>
                      )}
                    </div>

                    <div
                      className="border-t px-5 py-3 flex justify-between gap-2 items-center shrink-0"
                      style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper-2)" }}
                    >
                      <button
                        onClick={() => setAgreementOpen(false)}
                        className="text-[11px] uppercase tracking-wider bg-transparent border-none cursor-pointer transition-colors"
                        style={{ color: "var(--ba-ink-soft)" }}
                        onMouseEnter={e => (e.target.style.color = "var(--ba-ink)")}
                        onMouseLeave={e => (e.target.style.color = "var(--ba-ink-soft)")}
                      >
                        Sit back, barter later
                      </button>
                      <div className="text-xs" style={{ color: "var(--ba-ink-soft)" }}>
                        Commission:{" "}
                        <span className="font-medium" style={{ color: "var(--ba-ink)" }}>
                          {(5 - (finalDiscount ?? 0)).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step: Sealed ── */}
                {step === "sealed" && (
                  <div className="px-6 py-7 text-center overflow-y-auto flex flex-col items-center gap-3">
                    <div className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "var(--ba-ink-soft)" }}>Deal Sealed</div>

                    <h3
                      className="m-0 text-3xl"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ba-ink)" }}
                    >
                      <span className="italic font-light">№</span> {dealId}
                    </h3>

                    <p className="text-xs m-0" style={{ color: "var(--ba-ink-soft)" }}>
                      Commission <b style={{ color: "var(--ba-ink)" }}>{(5 - (finalDiscount ?? 0)).toFixed(2)}%</b> · saved {(finalDiscount ?? 0).toFixed(2)}%
                    </p>

                    <div className="border p-3 mt-2" style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper)" }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(`https://chat.commonjunction.app/${dealId}`)}`}
                        alt={`Chat QR for ${dealId}`}
                        width={160} height={160}
                        className="block"
                      />
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.3em] inline-flex items-center gap-1.5 justify-center m-0" style={{ color: "var(--ba-ink-soft)" }}>
                      <QrCode size={12} /> Scan to open private chat
                    </p>

                    <div className="flex items-center gap-2 justify-center flex-wrap">
                      <code
                        className="font-mono border px-2 py-1 text-[11px]"
                        style={{ borderColor: "var(--ba-rule)", background: "var(--ba-paper-2)", color: "var(--ba-ink)" }}
                      >
                        chat.commonjunction.app/{dealId}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://chat.commonjunction.app/${dealId}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider border px-2 py-1 transition-colors cursor-pointer bg-transparent"
                        style={{ borderColor: "var(--ba-rule)", color: "var(--ba-ink-soft)" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ba-ink)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--ba-rule)")}
                      >
                        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>

                    <div className="flex gap-2 justify-center flex-wrap mt-2">
                      <a
                        href={`https://chat.commonjunction.app/${dealId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] px-5 py-2 border transition-colors no-underline"
                        style={{ borderColor: "var(--ba-ink)", background: "var(--ba-ink)", color: "var(--ba-paper)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ba-ink)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--ba-ink)"; e.currentTarget.style.color = "var(--ba-paper)"; }}
                      >
                        <MessageCircle size={14} /> Enter Chat
                      </a>
                      <button
                        onClick={() => setAgreementOpen(false)}
                        className="text-[11px] uppercase tracking-wider px-4 py-2 border transition-colors cursor-pointer bg-transparent"
                        style={{ borderColor: "var(--ba-rule)", color: "var(--ba-ink-soft)" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--ba-ink)"; e.currentTarget.style.borderColor = "var(--ba-ink)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--ba-ink-soft)"; e.currentTarget.style.borderColor = "var(--ba-rule)"; }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
