import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import HeroSocialBar from "@/components/shared/HeroSocialBar";
import { filmography, type CreditType, type MediumType } from "@/data/filmography";
import { timelineEvents, awards } from "@/data/timeline";
import { quotes } from "@/data/quotes";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); }
    }, { threshold: 0.08 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

// ── FILMOGRAPHY SECTION ──────────────────────────────────────────────────────
function FilmographySection() {
  const [filterType, setFilterType] = useState<CreditType | "All">("All");
  const [filterMedium, setFilterMedium] = useState<MediumType | "All">("All");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [showAll, setShowAll] = useState(false);

  const filtered = filmography
    .filter(c => filterType === "All" || c.type.includes(filterType))
    .filter(c => filterMedium === "All" || c.medium === filterMedium)
    .sort((a, b) => sortDir === "desc" ? b.year - a.year : a.year - b.year);

  const visible = showAll ? filtered : filtered.slice(0, 10);

  return (
    <section id="filmography" className="py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between mb-14">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Filmography</p>
            <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Full<br />Credits
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <button onClick={() => setSortDir(s => s === "desc" ? "asc" : "desc")} className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-white/35 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded transition-all">
              Year {sortDir === "desc" ? "↓" : "↑"}
            </button>
          </Reveal>
        </div>

        {/* Filters */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-3">
            {(["All", "Actor", "Director", "Producer"] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition-all duration-200 ${filterType === t ? "border-white/50 text-white bg-white/8" : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {(["All", "TV Series", "TV Movie", "Feature Film"] as const).map(m => (
              <button key={m} onClick={() => setFilterMedium(m)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition-all duration-200 ${filterMedium === m ? "border-white/50 text-white bg-white/8" : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"}`}>
                {m}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Table */}
        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {["Year", "Title", "Role / Character", "Type", "Medium", "Network"].map(h => (
                    <th key={h} className="text-left text-[9px] tracking-[0.22em] uppercase text-white/25 pb-3 pr-6 whitespace-nowrap font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((c, i) => (
                  <tr key={c.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors group ${c.notable ? "" : ""}`}>
                    <td className="py-4 pr-6 text-sm font-light text-white/50 whitespace-nowrap">
                      {c.year}{c.yearEnd && c.yearEnd !== c.year ? `–${c.yearEnd}` : ""}
                    </td>
                    <td className="py-4 pr-6">
                      <span className={`text-sm font-medium ${c.notable ? "text-white" : "text-white/75"}`}>{c.title}</span>
                      {c.notable && <span className="ml-2 inline-block w-1 h-1 rounded-full bg-white/30 align-middle" />}
                    </td>
                    <td className="py-4 pr-6 text-sm text-white/45 font-light">{c.role}{c.character && c.character !== c.role ? ` — ${c.character}` : ""}</td>
                    <td className="py-4 pr-6">
                      <div className="flex flex-wrap gap-1">
                        {c.type.map(t => (
                          <span key={t} className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border ${
                            t === "Actor" ? "border-blue-500/20 text-blue-400/60" :
                            t === "Director" ? "border-amber-500/20 text-amber-400/60" :
                            "border-emerald-500/20 text-emerald-400/60"
                          }`}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-xs text-white/30 whitespace-nowrap">{c.medium}</td>
                    <td className="py-4 text-xs text-white/25">{c.network || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > 10 && (
            <button onClick={() => setShowAll(s => !s)} className="mt-8 text-[10px] tracking-[0.2em] uppercase text-white/35 hover:text-white border border-white/10 hover:border-white/25 px-6 py-2.5 rounded transition-all">
              {showAll ? "Show Less" : `Show All ${filtered.length} Credits`}
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── IN HIS WORDS SECTION ─────────────────────────────────────────────────────
function InHisWordsSection() {
  const [active, setActive] = useState(0);
  const [filterCat, setFilterCat] = useState<string>("all");
  const categories = ["all", "craft", "heartland", "direction", "life", "philosophy"];
  const filtered = quotes.filter(q => filterCat === "all" || q.category === filterCat);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % filtered.length), 6000);
    return () => clearInterval(t);
  }, [filtered.length]);

  useEffect(() => { setActive(0); }, [filterCat]);

  const current = filtered[active] ?? quotes[0];

  return (
    <section id="words" className="py-24 md:py-36 bg-[#05070D]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">In His Words</p>
          <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Thoughts &<br />Reflections
          </h2>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={60}>
          <div className="flex flex-wrap gap-2 mb-16">
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide border capitalize transition-all ${filterCat === c ? "border-white/50 text-white bg-white/8" : "border-white/10 text-white/35 hover:border-white/22 hover:text-white/55"}`}>
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Featured rotating quote */}
        <Reveal delay={100}>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border border-white/6 p-8 md:p-14 mb-14">
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.div key={current.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}>
                <p className="text-2xl md:text-4xl font-light text-white/80 leading-[1.4] mb-8 italic">
                  "{current.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-white/20" />
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Chris Potter</p>
                    {current.context && <p className="text-xs text-white/20 mt-0.5">{current.context}{current.year ? ` · ${current.year}` : ""}</p>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex gap-1.5 mt-8">
              {filtered.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === active ? "bg-white/60 w-4" : "bg-white/15"}`} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Quote grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, 6).map((q, i) => (
            <Reveal key={q.id} delay={i * 60}>
              <button onClick={() => setActive(filtered.indexOf(q))}
                className={`text-left w-full p-6 rounded-lg border transition-all duration-200 hover:bg-white/[0.03] ${active === i && filterCat !== "all" ? "border-white/20 bg-white/[0.03]" : "border-white/6"}`}>
                <p className="text-sm text-white/55 leading-relaxed mb-4 font-light line-clamp-3">"{q.text}"</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border ${
                    q.category === "craft" ? "border-blue-500/20 text-blue-400/50" :
                    q.category === "heartland" ? "border-amber-500/20 text-amber-400/50" :
                    q.category === "direction" ? "border-purple-500/20 text-purple-400/50" :
                    "border-white/10 text-white/30"
                  }`}>{q.category}</span>
                  {q.year && <span className="text-[9px] text-white/20 tracking-widest">{q.year}</span>}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AWARDS + TIMELINE SECTION ─────────────────────────────────────────────────
function TimelineSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const stopDrag = () => setIsDragging(false);

  return (
    <section id="timeline" className="py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-14">
        <Reveal>
          <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Career & Awards</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Milestones &<br />Recognition
            </h2>
            <p className="text-xs text-white/30 tracking-wide">← Drag to explore →</p>
          </div>
        </Reveal>
      </div>

      {/* Horizontal scrolling timeline */}
      <div
        ref={scrollRef}
        className={`timeline-scroll overflow-x-auto pb-8 cursor-grab ${isDragging ? "cursor-grabbing select-none" : ""}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div className="timeline-track relative px-12 md:px-24" style={{ width: `max(${timelineEvents.length * 280}px, 100%)` }}>
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-y-1/2" />

          <div className="flex gap-0 items-center" style={{ minWidth: `${timelineEvents.length * 280}px` }}>
            {timelineEvents.map((event, i) => {
              const isTop = i % 2 === 0;
              return (
                <div key={event.id} className="relative flex flex-col items-center" style={{ width: 260, flexShrink: 0 }}>
                  {/* Card above the line */}
                  <div className={`w-48 ${isTop ? "mb-6" : "invisible mb-6"}`}>
                    {isTop && (
                      <div className={`rounded-lg border p-4 text-left bg-[#07090F] ${event.highlight ? "border-white/18 bg-white/[0.03]" : "border-white/6"}`}>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">{event.year}</p>
                        <p className="text-sm font-semibold text-white mb-1.5">{event.title}</p>
                        <p className="text-xs text-white/40 font-light leading-relaxed">{event.description}</p>
                        {event.category === "award" && <div className="mt-3 inline-block text-[9px] tracking-widest uppercase border border-amber-500/25 text-amber-400/60 px-2 py-0.5 rounded">Award</div>}
                        {event.category === "direction" && <div className="mt-3 inline-block text-[9px] tracking-widest uppercase border border-purple-500/25 text-purple-400/60 px-2 py-0.5 rounded">Direction</div>}
                      </div>
                    )}
                  </div>

                  {/* Dot on the line */}
                  <div className="relative z-10">
                    <div className={`w-3 h-3 rounded-full border-2 ${event.highlight ? "bg-white border-white/80" : "bg-[#07090F] border-white/30"}`} />
                    {event.highlight && <div className="absolute inset-0 -m-1 rounded-full bg-white/10 animate-pulse" />}
                  </div>

                  {/* Card below the line */}
                  <div className={`w-48 ${!isTop ? "mt-6" : "invisible mt-6"}`}>
                    {!isTop && (
                      <div className={`rounded-lg border p-4 text-left bg-[#07090F] ${event.highlight ? "border-white/18 bg-white/[0.03]" : "border-white/6"}`}>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">{event.year}</p>
                        <p className="text-sm font-semibold text-white mb-1.5">{event.title}</p>
                        <p className="text-xs text-white/40 font-light leading-relaxed">{event.description}</p>
                        {event.category === "award" && <div className="mt-3 inline-block text-[9px] tracking-widest uppercase border border-amber-500/25 text-amber-400/60 px-2 py-0.5 rounded">Award</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Awards grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-20">
        <Reveal>
          <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-10">Awards & Nominations</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((a, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="border border-white/7 rounded-lg p-5 hover:border-white/15 hover:bg-white/[0.02] transition-all">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/28 mb-2">{a.year}</p>
                <p className="text-base font-medium text-white mb-1">{a.title}</p>
                <p className="text-xs text-white/40 mb-2">{a.body}</p>
                <span className="text-[9px] tracking-widest uppercase border border-amber-500/20 text-amber-400/50 px-2 py-0.5 rounded">{a.category}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── NEWSLETTER SECTION ───────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("success"); setMsg(data.message); setEmail(""); setName(""); }
      else { setStatus("error"); setMsg(data.message); }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="newsletter" className="py-24 md:py-36 bg-[#05070D]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">Newsletter</p>
            <h2 className="text-[clamp(3rem,7vw,5.5rem)] font-black uppercase leading-[0.9] text-white mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Stay in the<br />Loop
            </h2>
            <p className="text-base text-white/45 font-light leading-relaxed mb-12">
              Get exclusive updates on new projects, behind-the-scenes news, and personal messages from Chris — delivered directly to your inbox.
            </p>
          </Reveal>

          {status === "success" ? (
            <Reveal>
              <div className="border border-white/15 rounded-xl p-10 bg-white/[0.03]">
                <p className="text-3xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>You're In.</p>
                <p className="text-sm text-white/50">{msg}</p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={80}>
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                    className="bg-white/[0.03] border border-white/8 rounded-lg px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" />
                  <input type="email" placeholder="Your email address" required value={email} onChange={e => setEmail(e.target.value)}
                    className="bg-white/[0.03] border border-white/8 rounded-lg px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" />
                </div>
                {status === "error" && <p className="text-red-400/70 text-xs text-left">{msg}</p>}
                <button type="submit" disabled={status === "loading"}
                  className="w-full py-4 bg-white text-[#07090F] text-[10px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 active:bg-white/75 transition-colors disabled:opacity-50">
                  {status === "loading" ? "Subscribing..." : "Subscribe to Newsletter"}
                </button>
                <p className="text-[10px] text-white/18 tracking-wide">No spam. Unsubscribe at any time.</p>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── FUNDRAISING SECTION ──────────────────────────────────────────────────────
// ⚠️  Replace these with real wallet addresses and payment links before publishing
const BTC_ADDRESS  = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const USDT_TRC20   = "TGCRkw1Vq759FBCrwxkZGgqZiqrSdpHysD";
const STRIPE_URL   = "https://donate.stripe.com/00000000";    // Replace with your Stripe donation link
const PAYPAL_URL   = "https://paypal.me/heartlandlegacyfund"; // Replace with your PayPal link

function FundraisingSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <section id="give-back" className="py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left — cause description */}
          <div>
            <Reveal>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Community Initiative</p>
              <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                The Heartland<br />Legacy Fund
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed mb-5">
                Chris Potter has championed the Heartland Legacy Fund for over a decade — a community initiative providing horse rescue programs and free equestrian training for underprivileged youth across Western Canada.
              </p>
              <p className="text-sm text-white/38 font-light leading-relaxed mb-10">
                Rooted in the same values that define the Heartland story — compassion, resilience, and the profound bond between humans and animals — the Fund ensures the next generation of young riders can experience the transformative power of horsemanship, regardless of their background.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { num: "400+", label: "Horses Rescued" },
                  { num: "1,200+", label: "Youth Enrolled" },
                  { num: "12", label: "Programs Funded" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[clamp(2rem,4vw,3rem)] font-black text-white leading-none mb-1.5" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.num}</p>
                    <p className="text-[9px] tracking-[0.18em] uppercase text-white/28">{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[9px] tracking-widest uppercase text-white/28">2025 Annual Goal</span>
                  <span className="text-xs text-white/40 tabular-nums">$68,420 · $100,000</span>
                </div>
                <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-2">
                  <motion.div className="h-full bg-gradient-to-r from-white/50 to-white/18 rounded-full"
                    initial={{ width: 0 }} whileInView={{ width: "68.4%" }} viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2, ease: [0.16,1,0.3,1] }} />
                </div>
                <p className="text-[9px] text-white/20">68% funded · Updated May 2025</p>
              </div>
            </Reveal>
          </div>

          {/* Right — payment options */}
          <div>
            <Reveal delay={120}>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-5">Choose How to Give</p>
              <div className="space-y-3">

                {/* Bitcoin */}
                <div className="border border-white/8 rounded-xl p-5 bg-white/[0.02] hover:border-white/14 transition-all">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/12 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400/80 font-black text-base leading-none">₿</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/80">Bitcoin</p>
                        <p className="text-[9px] tracking-wide text-white/28">BTC · Any amount</p>
                      </div>
                    </div>
                    <button onClick={() => copy(BTC_ADDRESS, "btc")}
                      className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all ${copied === "btc" ? "border-green-500/30 text-green-400/70" : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/55"}`}>
                      {copied === "btc" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-white/[0.025] border border-white/6 rounded-lg px-3 py-2.5">
                    <p className="font-mono text-[10px] text-white/35 break-all leading-relaxed select-all">{BTC_ADDRESS}</p>
                  </div>
                </div>

                {/* USDT TRC-20 */}
                <div className="border border-white/8 rounded-xl p-5 bg-white/[0.02] hover:border-white/14 transition-all">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/18 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400/75 font-black text-sm leading-none">₮</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/80">USDT Tether</p>
                        <p className="text-[9px] tracking-wide text-white/28">TRC-20 · TRON Network</p>
                      </div>
                    </div>
                    <button onClick={() => copy(USDT_TRC20, "usdt")}
                      className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all ${copied === "usdt" ? "border-green-500/30 text-green-400/70" : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/55"}`}>
                      {copied === "usdt" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-white/[0.025] border border-white/6 rounded-lg px-3 py-2.5">
                    <p className="font-mono text-[10px] text-white/35 break-all leading-relaxed select-all">{USDT_TRC20}</p>
                  </div>
                </div>

                {/* Stripe + PayPal */}
                <div className="grid grid-cols-2 gap-3">
                  <a href={STRIPE_URL} target="_blank" rel="noopener noreferrer"
                    className="group border border-white/8 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-white/18 hover:bg-white/[0.02] transition-all text-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/18 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/70" />
                        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/70" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/75 mb-0.5">Donate by Card</p>
                      <p className="text-[9px] text-white/28">Visa · Mastercard</p>
                    </div>
                    <span className="text-[8px] tracking-widest uppercase text-white/20 group-hover:text-white/45 transition-colors mt-auto">Donate →</span>
                  </a>
                  <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer"
                    className="group border border-white/8 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-white/18 hover:bg-white/[0.02] transition-all text-center">
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/18 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400/70" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.79A.774.774 0 015.706 2h7.422c2.29 0 3.974.53 5.002 1.574.97.988 1.26 2.29.879 3.969l-.113.449C18.232 10.73 15.96 12 12.83 12H10.13c-.558 0-1.04.406-1.13.957l-.852 5.396-.134.84-.938 2.144z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/75 mb-0.5">PayPal</p>
                      <p className="text-[9px] text-white/28">Quick & secure</p>
                    </div>
                    <span className="text-[8px] tracking-widest uppercase text-white/20 group-hover:text-white/45 transition-colors mt-auto">Donate →</span>
                  </a>
                </div>
              </div>

              <p className="text-[10px] text-white/18 mt-5 leading-relaxed">
                For tax receipts, major gifts, or corporate sponsorship enquiries, contact us at{" "}
                <span className="text-white/30">foundation@chrispotterofficial.site</span>
              </p>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
const HERO_IMGS = ["/photos/IMG_0988.JPG", "/photos/IMG_0983.JPG", "/photos/IMG_0986.JPG"];
const ROLES = ["Actor", "Director", "Producer"];

export default function Home() {
  const [activeRole, setActiveRole] = useState("Actor");
  const [heroImg, setHeroImg] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar />

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end pb-32 md:pb-36">
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.img key={heroImg} src={HERO_IMGS[heroImg]} alt="Chris Potter"
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/50 to-[#07090F]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/60 via-transparent to-transparent" />
        </div>

        <HeroSocialBar />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[10px] tracking-[0.28em] uppercase text-white/35 mb-5">
            Canadian Actor · Director · Producer
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-3 mb-7">
            {ROLES.map(role => (
              <button key={role} onClick={() => setActiveRole(role)}
                className={`topic-pill px-5 py-2 rounded-full text-sm tracking-[0.06em] transition-all duration-250 ${activeRole === role ? "active text-white" : "text-white/55"}`}>
                {activeRole === role && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 mr-2 align-middle -mt-0.5" />}
                {role}
              </button>
            ))}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55 }}
            className="text-[clamp(4.5rem,13vw,11rem)] font-black uppercase leading-[0.88] tracking-tight text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Chris<br />Potter
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 flex items-center gap-4">
            <div className="w-8 h-px bg-white/30" />
            <p className="text-xs tracking-[0.22em] uppercase text-white/45">Actor · Director · Producer</p>
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            onClick={() => scrollTo("work")}
            className="absolute bottom-0 right-12 hidden md:flex flex-col items-center gap-2 pb-1">
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/25">Scroll</span>
            <span className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.button>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden border-y border-white/5 bg-[#05070D]">
        <div className="marquee-track py-5 md:py-7">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center">
              {["ACTOR", "DIRECTOR", "PRODUCER", "HEARTLAND"].map((w, j) => (
                <span key={j} className="flex items-center">
                  <span className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-none px-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", color: j === 0 || j === 3 ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.10)" }}>
                    {w}
                  </span>
                  <span className="mx-8 md:mx-12 text-white/8 text-2xl font-extralight">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK ── */}
      <section id="work" className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
            <Reveal>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Selected Work</p>
              <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                On Screen &<br />Behind the Lens
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <button onClick={() => scrollTo("filmography")} className="text-[10px] tracking-[0.2em] uppercase text-white/35 hover:text-white border border-white/12 hover:border-white/30 px-5 py-2.5 rounded transition-all">
                Full Filmography
              </button>
            </Reveal>
          </div>
          <Reveal className="mb-6">
            <div className="relative overflow-hidden rounded-lg aspect-[16/7] group cursor-pointer">
              <img src="/photos/IMG_1003.JPG" alt="Heartland" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/90 via-[#07090F]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">CBC · Netflix · 2007 – Present</p>
                  <h3 className="text-4xl md:text-6xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Heartland</h3>
                  <p className="text-sm text-white/50 mt-1">Tim Fleming — Starring Role</p>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { img: "/photos/IMG_0995.JPG", title: "Riding & Roping", sub: "TV Movie — Lead Role", year: "2024" },
              { img: "/photos/IMG_0988.JPG", title: "Directing Projects", sub: "Film Direction", year: "2019 – Present" },
              { img: "/photos/IMG_0982.JPG", title: "In the Edit Suite", sub: "Production & Post", year: "Ongoing" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="relative overflow-hidden rounded-md aspect-[4/5] group cursor-pointer">
                  <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/35 mb-1">{item.year}</p>
                    <h4 className="text-xl md:text-2xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{item.title}</h4>
                    <p className="text-xs text-white/45 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── IN HIS WORDS (4th section) ── */}
      <InHisWordsSection />

      <div className="section-line mx-6 md:mx-12" />

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-14 md:gap-20 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className="relative rounded-md overflow-hidden aspect-[3/4]">
                  <img src="/photos/IMG_0983.JPG" alt="Chris Potter" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/50 to-transparent" />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
              <Reveal>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">About</p>
                <h2 className="text-[clamp(3.5rem,7vw,6rem)] font-black uppercase leading-[0.88] text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  Chris<br />Potter
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6 font-light">
                  Chris Potter is a multi-award-winning Canadian actor, director, and producer with over three decades of experience in film and television.
                </p>
                <p className="text-base text-white/45 leading-relaxed mb-6 font-light">
                  Best known worldwide as Tim Fleming in CBC/Netflix's <em className="text-white/60 not-italic font-normal">Heartland</em>, Chris brings a rare combination of rugged authenticity and emotional depth to every role.
                </p>
                <p className="text-base text-white/45 leading-relaxed mb-10 font-light">
                  A skilled horseman and outdoorsman, his directing and producing work reflects the same quiet intensity that defines his performances — stories about real people in real places.
                </p>
                <div className="flex flex-wrap gap-8">
                  {[{ num: "30+", label: "Years in Film & TV" }, { num: "17", label: "Heartland Seasons" }, { num: "50+", label: "Screen Credits" }].map((s, i) => (
                    <div key={i}>
                      <p className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.num}</p>
                      <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── FILMOGRAPHY ── */}
      <FilmographySection />

      <div className="section-line mx-6 md:mx-12" />

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Gallery</p>
            <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Stills &<br />On Set
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { src: "/photos/IMG_0992.JPG", tall: true },
              { src: "/photos/IMG_0996.JPG", tall: false },
              { src: "/photos/IMG_0984.JPG", tall: false },
              { src: "/photos/IMG_0990.JPG", tall: true },
              { src: "/photos/IMG_0993.JPG", tall: false },
              { src: "/photos/IMG_0981.JPG", tall: true },
              { src: "/photos/IMG_1002.JPG", tall: false },
              { src: "/photos/IMG_0987.JPG", tall: false },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`relative overflow-hidden rounded group cursor-pointer ${item.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                  <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-600" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── AWARDS & CAREER TIMELINE (2nd to last) ── */}
      <TimelineSection />

      <div className="section-line mx-6 md:mx-12" />

      {/* ── FUNDRAISING ── */}
      <FundraisingSection />

      <div className="section-line mx-6 md:mx-12" />

      {/* ── NEWSLETTER ── */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
