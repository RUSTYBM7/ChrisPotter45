import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import SocialSidebar from "@/components/shared/SocialSidebar";
import PageHero from "@/components/shared/PageHero";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); io.unobserve(el); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const BADGES = [
  {
    id: "pioneer",
    name: "Pioneer Badge",
    price: "$1,000",
    usd: 1000,
    color: "from-amber-900/30 to-amber-700/10",
    border: "border-amber-600/25",
    accent: "text-amber-400",
    ring: "bg-amber-500/20",
    dot: "bg-amber-500",
    perks: [
      "Official Pioneer digital badge",
      "Early access to news and announcements",
      "Name listed on the Fanbase Wall",
      "Monthly supporter newsletter",
      "Digital autographed photo",
    ],
  },
  {
    id: "champion",
    name: "Champion Badge",
    price: "$2,500",
    usd: 2500,
    color: "from-slate-700/30 to-slate-500/10",
    border: "border-slate-400/25",
    accent: "text-slate-300",
    ring: "bg-slate-400/20",
    dot: "bg-slate-400",
    perks: [
      "All Pioneer perks",
      "Champion digital badge",
      "Exclusive behind-the-scenes content",
      "Quarterly video update from Chris",
      "Signed limited edition print",
      "Priority response on fan mail",
    ],
  },
  {
    id: "patron",
    name: "Patron Badge",
    price: "$5,000",
    usd: 5000,
    color: "from-yellow-900/30 to-yellow-600/10",
    border: "border-yellow-500/30",
    accent: "text-yellow-400",
    ring: "bg-yellow-500/20",
    dot: "bg-yellow-500",
    featured: true,
    perks: [
      "All Champion perks",
      "Gold Patron digital badge",
      "Personalized video message from Chris",
      "Access to virtual meet & greet events",
      "Heartland collectible merchandise pack",
      "Invitation to patron-only Q&A sessions",
      "Credits mention in select projects",
    ],
  },
  {
    id: "legacy",
    name: "Legacy Badge",
    price: "$10,000",
    usd: 10000,
    color: "from-violet-900/30 to-violet-600/10",
    border: "border-violet-500/30",
    accent: "text-violet-300",
    ring: "bg-violet-500/20",
    dot: "bg-violet-400",
    perks: [
      "All Patron perks",
      "Platinum Legacy digital badge",
      "In-person meet & greet opportunity",
      "Personalized signed memorabilia",
      "Advance screener access to new projects",
      "Name in end credits of select productions",
      "Annual one-on-one video call with Chris",
    ],
  },
  {
    id: "founding",
    name: "Founding Circle",
    price: "$25,000",
    usd: 25000,
    color: "from-rose-900/30 to-rose-600/10",
    border: "border-rose-500/30",
    accent: "text-rose-300",
    ring: "bg-rose-500/20",
    dot: "bg-rose-400",
    perks: [
      "All Legacy perks",
      "Diamond Founding Circle badge",
      "On-set visit during production",
      "Executive Producer credit on select projects",
      "Private dinner with Chris (select cities)",
      "Lifetime fanbase membership",
      "Founding Circle wall plaque (physical)",
      "Personal phone call on your birthday",
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
  { date: "January 2025", title: "Behind the Lens: New Directing Credit", body: "Chris Potter has completed directing on two new episodes of Heartland Season 17, which aired in late 2024." },
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

  const inputClass = "w-full bg-white/[0.025] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors";

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0C0F18] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className={`text-[9px] tracking-widest uppercase ${badge.accent} border border-current/20 px-2 py-0.5 rounded mb-2 inline-block`}>{badge.name}</span>
              <h3 className="text-3xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{badge.price} · Apply</h3>
              <p className="text-xs text-white/35 mt-1">Contact: fandom@chrispotterofficial.site</p>
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
                  <input required type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" className={inputClass} /></div>
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Last Name *</label>
                  <input required type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith" className={inputClass} /></div>
              </div>
              <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Email Address *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="jane@email.com" className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" className={inputClass} /></div>
                <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Country</label>
                  <input type="text" value={form.country} onChange={set("country")} placeholder="Canada" className={inputClass} /></div>
              </div>
              <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Why do you want to join the {badge.name}?</label>
                <textarea rows={3} value={form.whyJoin} onChange={set("whyJoin")} placeholder="Share what Chris Potter's work means to you..." className={inputClass + " resize-none"} /></div>
              <div><label className="block text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5">Additional Message</label>
                <textarea rows={2} value={form.message} onChange={set("message")} placeholder="Any questions or special requests..." className={inputClass + " resize-none"} /></div>
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

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />
      <SocialSidebar />
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
                  From Heartland fans who've watched every season to film enthusiasts who first discovered Chris in Kung Fu, this is the place where the appreciation for his craft finds a home.
                </p>
                <div className="flex flex-wrap gap-8">
                  {[{ n: "170+", l: "Countries" }, { n: "500K+", l: "Global Fans" }, { n: "17", l: "Seasons Celebrated" }].map((s, i) => (
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

      {/* ── 3. FAN BADGES ── */}
      <section id="badges" className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Supporter Badges</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Show Your<br />Support
              </h2>
              <p className="text-sm text-white/40 max-w-xs font-light">Each badge tier unlocks exclusive access and benefits. Click any badge to apply.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {BADGES.map((badge, i) => (
              <Reveal key={badge.id} delay={i * 70}>
                <div className={`relative rounded-xl border ${badge.border} bg-gradient-to-br ${badge.color} p-6 flex flex-col h-full ${badge.featured ? "ring-1 ring-yellow-500/20" : ""}`}>
                  {badge.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[9px] tracking-widest uppercase px-3 py-1 rounded-full">Most Popular</div>
                  )}
                  <div className={`w-10 h-10 rounded-full ${badge.ring} flex items-center justify-center mb-5`}>
                    <div className={`w-3 h-3 rounded-full ${badge.dot}`} />
                  </div>
                  <p className={`text-[10px] tracking-widest uppercase ${badge.accent} mb-1`}>{badge.name}</p>
                  <p className="text-2xl font-black text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{badge.price}</p>
                  <ul className="space-y-2 flex-1 mb-6">
                    {badge.perks.map((p, pi) => (
                      <li key={pi} className="flex items-start gap-2 text-xs text-white/45">
                        <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${badge.dot}`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveBadge(badge)}
                    className={`w-full py-3 text-[10px] tracking-[0.2em] uppercase font-bold rounded-lg border transition-all duration-200 ${badge.featured ? "bg-white text-[#07090F] border-transparent hover:bg-white/88" : `border-current ${badge.accent} hover:bg-white/5`}`}>
                    Apply
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-8 text-center text-xs text-white/22">
              Inquiries sent directly to <a href="mailto:fandom@chrispotterofficial.site" className="text-white/40 hover:text-white underline transition-colors">fandom@chrispotterofficial.site</a>
            </p>
          </Reveal>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── 4. COMMUNITY WALL ── */}
      <section className="py-24 md:py-32 bg-[#05070D]">
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

      {/* ── 5. EXCLUSIVE ACCESS ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Exclusive Access</p>
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              What Supporters<br />Receive
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Behind the Scenes", desc: "Exclusive photos and videos from film sets and production days — content only supporters see.", photo: "/photos/IMG_0982.JPG" },
              { title: "Personal Updates", desc: "Direct messages and video updates from Chris about upcoming projects, travel, and creative work.", photo: "/photos/IMG_0984.JPG" },
              { title: "Early Announcements", desc: "Supporters are the first to know about new roles, release dates, and production news.", photo: "/photos/IMG_0995.JPG" },
              { title: "Live Events", desc: "Virtual and in-person meet & greets, Q&A sessions, and screening events for badge holders.", photo: "/photos/IMG_1004.JPG" },
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

      {/* ── 6. LATEST UPDATES ── */}
      <section className="py-24 md:py-32 bg-[#05070D]">
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
                <div className={`flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-7 border-b border-white/6 hover:bg-white/[0.015] transition-all px-2 -mx-2 rounded`}>
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

      {/* ── 7. JOIN / NEWSLETTER CTA ── */}
      <section className="py-24 md:py-36">
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
                Whether you've been a fan since Kung Fu or discovered Heartland on Netflix, there's a place for you here. Subscribe to stay connected.
              </p>
              {newsStatus === "success" ? (
                <div className="border border-white/15 rounded-xl p-8 bg-white/[0.02]">
                  <p className="text-2xl font-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>You're In!</p>
                  <p className="text-sm text-white/45 mt-2">Welcome to the Chris Potter Fanbase newsletter.</p>
                </div>
              ) : (
                <form onSubmit={subscribeNewsletter} className="flex gap-3">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address"
                    className="flex-1 bg-white/[0.03] border border-white/8 rounded-lg px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" />
                  <button type="submit" disabled={newsStatus === "loading"}
                    className="px-6 py-3.5 bg-white text-[#07090F] text-[10px] tracking-[0.18em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50 whitespace-nowrap">
                    {newsStatus === "loading" ? "..." : "Join Now"}
                  </button>
                </form>
              )}

              <div className="mt-10 pt-8 border-t border-white/8">
                <p className="text-xs text-white/30 mb-4 tracking-wide uppercase">Select a Badge Tier</p>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map(b => (
                    <button key={b.id} onClick={() => setActiveBadge(b)}
                      className={`text-[10px] tracking-wide px-4 py-2 rounded-full border transition-all hover:bg-white/5 ${b.border} ${b.accent}`}>
                      {b.name} — {b.price}
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
