import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); io.unobserve(el); }
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const BADGES = [
  {
    id: "pioneer", tier: "01",
    name: "Pioneer Badge", price: "$1,000", usd: 1000,
    tagline: "Your first step into the inner circle.",
    color: "from-amber-900/20 to-transparent",
    border: "border-amber-600/20",
    accent: "text-amber-400",
    accentBorder: "border-amber-500/25",
    dot: "bg-amber-500",
    ring: "bg-amber-500/10",
    photo: "/photos/IMG_0988.JPG",
    perks: [
      "Official Pioneer digital badge certificate",
      "Name listed permanently on the Fanbase Wall",
      "Early access to all news and announcements",
      "Monthly exclusive newsletter from Chris",
      "Digital autographed portrait",
      "Access to WhatsApp private channel",
    ],
  },
  {
    id: "champion", tier: "02",
    name: "Champion Badge", price: "$2,500", usd: 2500,
    tagline: "Step up. Be recognized. Be remembered.",
    color: "from-slate-700/20 to-transparent",
    border: "border-slate-400/20",
    accent: "text-slate-300",
    accentBorder: "border-slate-400/25",
    dot: "bg-slate-400",
    ring: "bg-slate-400/10",
    photo: "/photos/IMG_0983.JPG",
    perks: [
      "All Pioneer perks",
      "Champion digital badge certificate",
      "Exclusive behind-the-scenes content library",
      "Quarterly personal video update from Chris",
      "Signed limited edition fine art print",
      "Priority response on all fan mail",
      "Early access to giveaway draws",
    ],
  },
  {
    id: "patron", tier: "03",
    name: "Patron Badge", price: "$5,000", usd: 5000,
    tagline: "The gold standard of fan recognition.",
    color: "from-yellow-900/20 to-transparent",
    border: "border-yellow-500/25",
    accent: "text-yellow-400",
    accentBorder: "border-yellow-500/30",
    dot: "bg-yellow-500",
    ring: "bg-yellow-500/10",
    featured: true,
    photo: "/photos/IMG_0992.JPG",
    perks: [
      "All Champion perks",
      "Gold Patron digital badge certificate",
      "Personalized video message from Chris",
      "Virtual meet & greet event access",
      "Heartland collectible merchandise pack (shipped)",
      "Patron-only Q&A sessions",
      "Credits mention in select projects",
      "Giveaway priority queue",
    ],
  },
  {
    id: "legacy", tier: "04",
    name: "Legacy Badge", price: "$10,000", usd: 10000,
    tagline: "Your legacy is written alongside his.",
    color: "from-violet-900/20 to-transparent",
    border: "border-violet-500/25",
    accent: "text-violet-300",
    accentBorder: "border-violet-500/30",
    dot: "bg-violet-400",
    ring: "bg-violet-500/10",
    photo: "/photos/IMG_0986.JPG",
    perks: [
      "All Patron perks",
      "Platinum Legacy digital badge certificate",
      "In-person meet & greet opportunity",
      "Personalized signed memorabilia",
      "Advance screener access to new projects",
      "Name in end credits of select productions",
      "Annual one-on-one video call with Chris",
      "VIP event ticket priority",
    ],
  },
  {
    id: "founding", tier: "05",
    name: "Founding Circle", price: "$25,000", usd: 25000,
    tagline: "The rarest circle. Reserved for the most devoted.",
    color: "from-rose-900/20 to-transparent",
    border: "border-rose-500/25",
    accent: "text-rose-300",
    accentBorder: "border-rose-500/30",
    dot: "bg-rose-400",
    ring: "bg-rose-500/10",
    photo: "/photos/IMG_1003.JPG",
    perks: [
      "All Legacy perks",
      "Diamond Founding Circle badge certificate",
      "On-set visit during production (arranged)",
      "Executive Producer credit on select projects",
      "Private dinner with Chris (select cities)",
      "Lifetime fanbase membership — no renewals",
      "Founding Circle physical wall plaque",
      "Birthday call from Chris personally",
    ],
  },
];

const TESTIMONIALS = [
  { name: "Sarah M.", location: "Calgary, Canada", badge: "Patron", quote: "Heartland changed the way I see family and resilience. Tim Fleming is part of our family now." },
  { name: "James T.", location: "London, UK", badge: "Champion", quote: "I've followed Chris's work since Kung Fu. The depth he brings to every character is extraordinary." },
  { name: "Mei L.", location: "Sydney, Australia", badge: "Pioneer", quote: "Heartland on Netflix introduced me to Chris Potter. I've since watched every season three times." },
  { name: "Robert K.", location: "Toronto, Canada", badge: "Legacy", quote: "The passion and authenticity in everything Chris does — acting, directing, producing — is unmatched." },
  { name: "Priya S.", location: "Mumbai, India", badge: "Patron", quote: "Tim Fleming's journey is one of the most beautifully written characters in Canadian television history." },
  { name: "Clara B.", location: "Paris, France", badge: "Pioneer", quote: "Even across the ocean, Chris Potter's work connects with something universal and deeply human." },
];

const UPDATES = [
  { date: "March 2025", title: "Heartland Season 18 Announced", body: "CBC has confirmed production on Season 18 is underway. Chris returns as Tim Fleming." },
  { date: "January 2025", title: "Behind the Lens: New Directing Credit", body: "Chris Potter completed directing on two new episodes of Heartland Season 17, which aired in late 2024." },
  { date: "November 2024", title: "Heartland Season 17 Now Streaming", body: "All episodes of Season 17 are now available on Netflix worldwide and CBC Gem in Canada." },
  { date: "September 2024", title: "Fan Meet & Greet — Calgary", body: "Chris attended a special Heartland fan event in Calgary, meeting over 300 fans in person." },
  { date: "July 2024", title: "New Production Project", body: "Chris has joined a new Canadian drama production as both lead actor and co-producer. Details TBA." },
];

interface BadgeModalProps {
  badge: typeof BADGES[0];
  onClose: () => void;
}

function BadgeModal({ badge, onClose }: BadgeModalProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", country: "", whyJoin: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/contact/fanbase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, badgeTier: badge.name }),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("success"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch {
      setStatus("error"); setMsg("Something went wrong. Please try again.");
    }
  };

  const inp = "w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors";

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
          className="bg-[#0C0F18] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className={`text-[9px] tracking-widest uppercase ${badge.accent} border ${badge.accentBorder} px-2 py-0.5 rounded mb-2 inline-block`}>{badge.name}</span>
              <h3 className="text-3xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{badge.price} · Apply</h3>
              <p className="text-xs text-white/30 mt-1">Contact: fandom@chrispotterofficial.site</p>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {status === "success" ? (
            <div className="text-center py-8">
              <p className="text-4xl font-black uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Request Sent!</p>
              <p className="text-sm text-white/50">{msg}</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 border border-white/15 rounded text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors">Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">First Name *</label>
                  <input required type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" className={inp} /></div>
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Last Name *</label>
                  <input required type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith" className={inp} /></div>
              </div>
              <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Email Address *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="jane@email.com" className={inp} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" className={inp} /></div>
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Country</label>
                  <input type="text" value={form.country} onChange={set("country")} placeholder="Canada" className={inp} /></div>
              </div>
              <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Why do you want to join the {badge.name}?</label>
                <textarea rows={3} value={form.whyJoin} onChange={set("whyJoin")} placeholder="Share what Chris Potter's work means to you..." className={inp + " resize-none"} /></div>
              <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Additional Message</label>
                <textarea rows={2} value={form.message} onChange={set("message")} placeholder="Any questions or special requests..." className={inp + " resize-none"} /></div>
              {status === "error" && <p className="text-red-400/70 text-xs">{msg}</p>}
              <button type="submit" disabled={status === "loading"}
                className="w-full py-3.5 bg-white text-[#07090F] text-[10px] tracking-[0.2em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50">
                {status === "loading" ? "Sending..." : `Apply for ${badge.name}`}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Fanbase() {
  const [activeBadge, setActiveBadge] = useState<typeof BADGES[0] | null>(null);
  const [email, setEmail] = useState("");
  const [newsStatus, setNewsStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [triviaActive, setTriviaActive] = useState(0);
  const [triviaAnswered, setTriviaAnswered] = useState<number | null>(null);

  const subscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsStatus("loading");
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setNewsStatus("success"); setEmail(""); }
      else setNewsStatus("error");
    } catch { setNewsStatus("error"); }
  };

  const TRIVIA = [
    { q: "How many seasons of Heartland has Chris appeared in?", options: ["12", "15", "17+", "10"], correct: 2 },
    { q: "What was Chris Potter's breakout TV role in the early 1990s?", options: ["Heartland", "Kung Fu: The Legend Continues", "Due South", "The Commish"], correct: 1 },
    { q: "Which streaming giant brought Heartland to a global audience?", options: ["Hulu", "Disney+", "Netflix", "Amazon Prime"], correct: 2 },
    { q: "What is the name of Chris Potter's character in Heartland?", options: ["Ty Borden", "Jack Bartlett", "Tim Fleming", "Peter Morris"], correct: 2 },
  ];

  const currentTrivia = TRIVIA[triviaActive % TRIVIA.length];

  const handleTriviaAnswer = (idx: number) => {
    if (triviaAnswered !== null) return;
    setTriviaAnswered(idx);
    setTimeout(() => {
      setTriviaActive(a => a + 1);
      setTriviaAnswered(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />
      {activeBadge && <BadgeModal badge={activeBadge} onClose={() => setActiveBadge(null)} />}

      {/* ── 1. HERO ── */}
      <PageHero
        photo="/photos/IMG_0992.JPG"
        photoPosition="center top"
        label="The Chris Potter Fanbase"
        heading={"The\nFanbase"}
        subheading="A Community Built Around Authentic Storytelling"
      />

      {/* ── 2. SUPPORTERS HUB ── */}
      <section className="py-24 md:py-32 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <Reveal>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">Supporters Hub</p>
                <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  More Than<br />a Fan Page
                </h2>
                <p className="text-xl text-white/65 font-light leading-relaxed mb-6">
                  The Chris Potter Fanbase is a curated community for people who connect with authentic, character-driven storytelling.
                </p>
                <p className="text-base text-white/40 font-light leading-relaxed mb-10">
                  From Heartland fans who've watched every season to film enthusiasts who first discovered Chris in Kung Fu: The Legend Continues — this is the place where the appreciation for his craft finds a home.
                </p>
                <div className="flex flex-wrap gap-8">
                  {[{ n: "170+", l: "Countries" }, { n: "500K+", l: "Global Fans" }, { n: "18", l: "Seasons Celebrated" }].map((s, i) => (
                    <div key={i}><p className="text-4xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.n}</p>
                      <p className="text-[10px] tracking-widest uppercase text-white/25 mt-1">{s.l}</p></div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Reveal delay={120}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <img src="/photos/IMG_0993.JPG" alt="On Set" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-[3/4] mt-8">
                    <img src="/photos/IMG_0985.JPG" alt="Behind the Scenes" className="w-full h-full object-cover" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 3. FAN ACTIVITIES (NEW) ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Fan Activities</p>
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-16" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Get Involved
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
            {/* Giveaways */}
            <Reveal delay={0}>
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-amber-900/10 to-transparent overflow-hidden flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src="/photos/IMG_1004.JPG" alt="Giveaways" className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-sm">🎁</div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-amber-400/60">Monthly</p>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Fan Giveaways</h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed mb-5 flex-1">
                    Every month, badge holders are entered into exclusive draws for signed Heartland collectibles, limited edition prints, props from the set, and personalized memorabilia.
                  </p>
                  <div className="space-y-2 mb-6">
                    {["Signed merchandise & photos", "On-set props & collectibles", "Limited edition fine art prints", "Priority entries for higher tiers"].map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                        <div className="w-1 h-1 rounded-full bg-amber-500/50 flex-shrink-0" />
                        {p}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3">
                    <p className="text-[9px] tracking-[0.16em] uppercase text-amber-400/60 mb-1">Next Draw</p>
                    <p className="text-sm text-white/60 font-medium">June 1, 2025 · Heartland Season 18 Bundle</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Trivia & Games */}
            <Reveal delay={80}>
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-blue-900/10 to-transparent overflow-hidden flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src="/photos/IMG_0982.JPG" alt="Trivia" className="w-full h-full object-cover object-center hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-sm">🎯</div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-blue-400/60">Live & Interactive</p>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Trivia & Fan Games</h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed mb-5">
                    Weekly trivia challenges, polls, and interactive quizzes about Chris Potter's career and Heartland. Climb the global leaderboard and earn recognition.
                  </p>

                  {/* Live trivia mini-game */}
                  <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 flex-1">
                    <p className="text-[9px] tracking-[0.16em] uppercase text-blue-400/60 mb-3">Try a Question</p>
                    <AnimatePresence mode="wait">
                      <motion.div key={triviaActive}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}>
                        <p className="text-xs font-medium text-white/70 mb-3 leading-relaxed">{currentTrivia.q}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {currentTrivia.options.map((opt, idx) => (
                            <button key={idx} onClick={() => handleTriviaAnswer(idx)}
                              className={`text-[10px] tracking-wide px-2 py-2 rounded-lg border text-left transition-all duration-200 ${
                                triviaAnswered === null
                                  ? "border-white/10 text-white/40 hover:border-blue-400/30 hover:text-white/60 hover:bg-blue-500/5"
                                  : idx === currentTrivia.correct
                                    ? "border-green-400/40 bg-green-500/10 text-green-400"
                                    : triviaAnswered === idx
                                      ? "border-red-400/40 bg-red-500/10 text-red-400"
                                      : "border-white/5 text-white/20"
                              }`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Exclusive Tickets */}
            <Reveal delay={160}>
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-violet-900/10 to-transparent overflow-hidden flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src="/photos/IMG_0996.JPG" alt="Tickets" className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-sm">🎟️</div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-violet-400/60">Priority Access</p>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Exclusive Tickets</h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed mb-5 flex-1">
                    Badge holders get priority access to Heartland premiere screenings, fan events, and exclusive in-person experiences that never go to the general public.
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      { event: "Heartland S18 Premiere Screening", date: "Fall 2025", tier: "Patron+" },
                      { event: "Calgary Fan Meet & Greet", date: "Summer 2025", tier: "Champion+" },
                      { event: "Virtual Set Tour & Q&A", date: "Ongoing", tier: "Pioneer+" },
                    ].map((ev, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-xs font-medium text-white/65">{ev.event}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{ev.date}</p>
                        </div>
                        <span className="text-[8px] tracking-widest uppercase border border-violet-500/25 text-violet-400/60 px-2 py-0.5 rounded flex-shrink-0">{ev.tier}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveBadge(BADGES[0])}
                    className="w-full py-2.5 border border-violet-500/25 text-violet-400/70 text-[10px] tracking-[0.18em] uppercase rounded-lg hover:bg-violet-500/8 transition-all">
                    Get Access
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 4. FAN BADGES — VERTICAL FULL-WIDTH CARDS ── */}
      <section id="badges" className="py-24 md:py-36 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Supporter Badges</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Show Your<br />Support
              </h2>
              <p className="text-sm text-white/38 max-w-xs font-light">Five tiers of recognition. Each one sends directly to fandom@chrispotterofficial.site</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5">
            {BADGES.map((badge, i) => (
              <Reveal key={badge.id} delay={i * 60}>
                <div className={`relative rounded-2xl border ${badge.border} bg-gradient-to-r ${badge.color} overflow-hidden group`}>
                  {badge.featured && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
                  )}

                  <div className="flex flex-col md:flex-row">
                    {/* Photo */}
                    <div className="md:w-72 md:flex-shrink-0 aspect-[16/9] md:aspect-auto overflow-hidden">
                      <img
                        src={badge.photo}
                        alt={badge.name}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-7 md:p-10 flex flex-col md:flex-row gap-8 items-start">

                      {/* Left: name + price + tagline */}
                      <div className="md:w-64 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[9px] tracking-[0.2em] uppercase text-white/22 font-mono">Tier {badge.tier}</span>
                          <div className="flex-1 h-px bg-white/8" />
                        </div>
                        <p className={`text-[10px] tracking-widest uppercase ${badge.accent} mb-2`}>{badge.name}</p>
                        <p className="text-5xl md:text-6xl font-black text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                          {badge.price}
                        </p>
                        <p className="text-sm text-white/40 font-light italic mb-6">{badge.tagline}</p>

                        {badge.featured && (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${badge.accentBorder} ${badge.ring} mb-4`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span className={`text-[9px] tracking-widest uppercase ${badge.accent}`}>Most Popular</span>
                          </div>
                        )}

                        <button
                          onClick={() => setActiveBadge(badge)}
                          className={`w-full md:w-auto px-8 py-3 rounded-lg text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-200 ${
                            badge.featured
                              ? "bg-white text-[#07090F] hover:bg-white/88"
                              : `border ${badge.accentBorder} ${badge.accent} hover:bg-white/5`
                          }`}
                        >
                          Apply
                        </button>
                      </div>

                      {/* Right: perks */}
                      <div className="flex-1">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/22 mb-4">What's Included</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                          {badge.perks.map((perk, pi) => (
                            <div key={pi} className="flex items-start gap-2.5">
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${badge.dot}`} />
                              <p className="text-sm text-white/50 font-light leading-snug">{perk}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <p className="mt-8 text-center text-xs text-white/20">
              Inquiries sent directly to <a href="mailto:fandom@chrispotterofficial.site" className="text-white/38 hover:text-white underline transition-colors">fandom@chrispotterofficial.site</a>
            </p>
          </Reveal>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 5. COMMUNITY WALL ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Community</p>
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Fan Voices
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="border border-white/7 rounded-xl p-6 hover:border-white/14 hover:bg-white/[0.02] transition-all">
                  <p className="text-sm text-white/55 leading-relaxed mb-5 font-light italic">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/75">{t.name}</p>
                      <p className="text-[10px] text-white/28 mt-0.5">{t.location}</p>
                    </div>
                    <span className="text-[9px] tracking-widest uppercase border border-amber-500/20 text-amber-400/50 px-2 py-0.5 rounded">{t.badge}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 6. EXCLUSIVE ACCESS ── */}
      <section className="py-24 md:py-32 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Exclusive Access</p>
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              What Supporters<br />Receive
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Behind the Scenes", desc: "Exclusive photos and videos from film sets and production days.", photo: "/photos/IMG_0982.JPG" },
              { title: "Personal Updates", desc: "Direct messages and video updates from Chris about upcoming projects.", photo: "/photos/IMG_0984.JPG" },
              { title: "Early Announcements", desc: "Supporters are the first to know about new roles and release dates.", photo: "/photos/IMG_0995.JPG" },
              { title: "Live Events", desc: "Virtual and in-person meet & greets, Q&As, and screening events.", photo: "/photos/IMG_1004.JPG" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group cursor-pointer">
                  <div className="rounded-xl overflow-hidden aspect-[4/3] mb-4">
                    <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 font-light leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 7. LATEST UPDATES ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Latest News</p>
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Updates &<br />Announcements
            </h2>
          </Reveal>
          <div className="space-y-0">
            {UPDATES.map((u, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-7 border-b border-white/6 hover:bg-white/[0.015] transition-all px-2 -mx-2 rounded">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/28 md:w-36 flex-shrink-0 mt-0.5">{u.date}</p>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1.5">{u.title}</h3>
                    <p className="text-sm text-white/40 font-light">{u.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 8. JOIN / NEWSLETTER CTA ── */}
      <section className="py-24 md:py-36 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="rounded-2xl overflow-hidden aspect-square md:aspect-[4/5]">
                <img src="/photos/IMG_0986.JPG" alt="Chris Potter" className="w-full h-full object-cover object-top" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">Join the Fanbase</p>
              <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Be Part of<br />the Story
              </h2>
              <p className="text-lg text-white/55 font-light leading-relaxed mb-8">
                Whether you've been a fan since Kung Fu or discovered Heartland on Netflix, there's a place for you here.
              </p>
              {newsStatus === "success" ? (
                <div className="border border-white/15 rounded-xl p-8 bg-white/[0.02]">
                  <p className="text-2xl font-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>You're In!</p>
                  <p className="text-sm text-white/45 mt-2">Welcome to the Chris Potter Fanbase newsletter.</p>
                </div>
              ) : (
                <form onSubmit={subscribeNewsletter} className="flex gap-3 mb-10">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address"
                    className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" />
                  <button type="submit" disabled={newsStatus === "loading"}
                    className="px-6 py-3.5 bg-white text-[#07090F] text-[10px] tracking-[0.18em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50 whitespace-nowrap">
                    {newsStatus === "loading" ? "..." : "Join Now"}
                  </button>
                </form>
              )}

              <div className={newsStatus === "success" ? "mt-8 pt-8 border-t border-white/8" : "pt-0"}>
                <p className="text-xs text-white/30 mb-4 tracking-wide uppercase">Select a Badge Tier</p>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map(b => (
                    <button key={b.id} onClick={() => setActiveBadge(b)}
                      className={`text-[10px] tracking-wide px-4 py-2 rounded-full border transition-all hover:bg-white/5 ${b.accentBorder} ${b.accent}`}>
                      {b.name} · {b.price}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
