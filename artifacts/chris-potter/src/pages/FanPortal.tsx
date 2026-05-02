import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import HeroSocialBar from "@/components/shared/HeroSocialBar";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); io.unobserve(el); } }, { threshold: 0.05 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

// ── Config ───────────────────────────────────────────────────────────────────
const EXCLUSIVE_CONTENT = [
  { category: "Behind the Scenes", items: [
    { title: "On Set — Heartland S17", desc: "Behind-the-scenes stills from the latest season.", photo: "/photos/IMG_0992.JPG", badge: "Exclusive" },
    { title: "The Edit Suite", desc: "Chris Potter in the editing room during post-production.", photo: "/photos/IMG_0982.JPG", badge: "Members Only" },
    { title: "Location Scouting", desc: "Early morning scouts for the ranch exteriors.", photo: "/photos/IMG_0995.JPG", badge: "Exclusive" },
  ]},
  { category: "Gallery", items: [
    { title: "Cowboy Series", desc: "Full editorial series in the Heartland landscape.", photo: "/photos/IMG_0988.JPG", badge: "Hi-Res Available" },
    { title: "Outdoor Portraits", desc: "Approved portrait series for fan and editorial use.", photo: "/photos/IMG_0986.JPG", badge: "Hi-Res Available" },
    { title: "Winter Series", desc: "Heartland in the Canadian winter.", photo: "/photos/IMG_1003.JPG", badge: "Hi-Res Available" },
  ]},
];

const ANNOUNCEMENTS = [
  { date: "May 2025", title: "Heartland Season 18 — First Look", body: "Exclusive first-look images from the Season 18 set, shared with badge holders two weeks ahead of the public announcement.", badge: "Members Only" },
  { date: "April 2025", title: "Personal Message from Chris", body: "A personal video message recorded exclusively for Fanbase members, reflecting on 18 seasons of Heartland.", badge: "Video" },
  { date: "March 2025", title: "Giveaway Winners — Q1 2025", body: "The Q1 2025 giveaway results. Three Patron badge holders receive signed Heartland prints.", badge: "Giveaway" },
  { date: "February 2025", title: "Director's Notes — S17 Finale", body: "Chris shares personal notes and thoughts from directing the Season 17 finale. Available exclusively to Legacy+ badge holders.", badge: "Legacy+" },
];

// Update these video IDs with real YouTube interview/podcast video IDs for Chris Potter
const PODCAST_EPISODES = [
  {
    videoId: "TJEgcK9s0Lo",
    title: "18 Seasons of Tim Fleming",
    show: "Heartland Insider Podcast",
    date: "February 2025",
    duration: "52 min",
    desc: "Chris Potter reflects on nearly two decades playing Tim Fleming in Heartland — the character's evolution, most memorable scenes, and what keeps him coming back to the Heartland ranch.",
    topics: ["Heartland", "Acting", "Character Development", "CBC"],
  },
  {
    videoId: "Lam_h8AcJaA",
    title: "From Actor to Director: The Transition",
    show: "Director's Chair",
    date: "November 2024",
    duration: "44 min",
    desc: "An in-depth conversation about stepping behind the camera — how Chris made the transition from actor to director, the challenges of directing scenes you're also acting in, and advice for aspiring filmmakers.",
    topics: ["Directing", "Filmmaking", "Behind the Camera", "Career"],
  },
  {
    videoId: "r9Rqfr8DWEQ",
    title: "Canadian Hollywood: The Long Game",
    show: "Inside Canadian Cinema",
    date: "August 2024",
    duration: "38 min",
    desc: "A candid conversation about building a multi-decade career in Canadian entertainment — from Kung Fu: The Legend Continues to 18 seasons of Heartland and beyond.",
    topics: ["Canadian Film", "Career", "Craft", "Industry"],
  },
];

const SESSION_TYPES = [
  { id: "private-meet", label: "Private Meet & Greet", icon: "🤝", desc: "A personal one-on-one or small group conversation with Chris. 20-minute virtual session.", tier: "Patron+" },
  { id: "podcast", label: "Podcast Co-Host Session", icon: "🎙", desc: "Join Chris as a co-host for an exclusive recorded podcast episode shared in the Fan Portal.", tier: "Legacy" },
  { id: "collaboration", label: "Creative Collaboration", icon: "🎬", desc: "Pitch a creative project — a short film, interview, or artistic collaboration with Chris.", tier: "Legacy" },
  { id: "interview", label: "Exclusive Interview", icon: "📝", desc: "Submit questions for a personal written or video interview response from Chris Potter.", tier: "Ambassador+" },
];

// ── Shared components ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] tracking-[0.24em] uppercase text-white/25 mb-4">{children}</p>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88] text-white mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{children}</h2>;
}

// ── Badge Certificate ─────────────────────────────────────────────────────────
function BadgeCertificate({ email }: { email: string }) {
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div className="relative rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-900/15 to-transparent overflow-hidden p-8 md:p-12">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(245,197,24,0.3) 0px, transparent 1px, transparent 10px, rgba(245,197,24,0.3) 11px)", backgroundSize: "14px 14px" }} />
      <div className="relative text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/50 mb-6">Chris Potter Official · Fanbase Member Certificate</p>
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 bg-amber-500/10 flex items-center justify-center mx-auto mb-6"><span className="text-3xl">⭐</span></div>
        <p className="text-sm text-white/40 tracking-widest uppercase mb-2">This certifies that</p>
        <h3 className="text-4xl md:text-5xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{name}</h3>
        <p className="text-sm text-white/35 mb-1">is a verified member of the</p>
        <p className="text-xl font-bold text-amber-400/70 mb-6">Chris Potter Official Fanbase</p>
        <div className="flex items-center justify-center gap-4 text-[9px] tracking-widest uppercase text-white/20">
          <span>Verified Fan Portal Member</span><span>·</span><span>{new Date().getFullYear()}</span><span>·</span><span>chrispotterofficial.site</span>
        </div>
        <div className="mt-6 pt-6 border-t border-white/8"><p className="text-[9px] text-white/18 tracking-wide">{email}</p></div>
      </div>
    </div>
  );
}

// ── Podcast Episodes ──────────────────────────────────────────────────────────
function PodcastSection() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <SectionLabel>Podcast & Interviews</SectionLabel>
          <SectionTitle>Listen & Watch</SectionTitle>
        </Reveal>
        <div className="space-y-12">
          {PODCAST_EPISODES.map((ep, i) => (
            <Reveal key={ep.videoId} delay={i * 60}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? "md:grid-cols-[5fr_4fr]" : "md:grid-cols-[4fr_5fr] md:[direction:rtl]"} gap-0 rounded-2xl overflow-hidden border border-white/8 group`}>
                {/* Video embed */}
                <div className="relative aspect-video bg-black/60 overflow-hidden md:[direction:ltr]">
                  {playing === ep.videoId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ep.videoId}?autoplay=1&rel=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title={ep.title}
                    />
                  ) : (
                    <div className="relative w-full h-full cursor-pointer" onClick={() => setPlaying(ep.videoId)}>
                      <img
                        src={`https://img.youtube.com/vi/${ep.videoId}/hqdefault.jpg`}
                        alt={ep.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
                          <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1"><span className="text-[9px] text-white/50 tracking-widest uppercase">{ep.duration}</span></div>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-7 md:p-9 bg-[#05070D] flex flex-col justify-center md:[direction:ltr]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[8px] tracking-[0.2em] uppercase text-amber-400/55 border border-amber-500/20 rounded-full px-2 py-0.5">Exclusive</span>
                    <span className="text-[9px] text-white/25">{ep.date} · {ep.duration}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-white leading-tight mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{ep.title}</h3>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 mb-4">{ep.show}</p>
                  <p className="text-sm text-white/45 font-light leading-relaxed mb-5">{ep.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {ep.topics.map(t => <span key={t} className="text-[8px] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-2 py-0.5">{t}</span>)}
                  </div>
                  <button onClick={() => setPlaying(playing === ep.videoId ? null : ep.videoId)} className="self-start text-[10px] tracking-[0.2em] uppercase font-semibold text-white/60 border border-white/15 hover:border-white/30 hover:text-white/80 px-5 py-2.5 rounded-lg transition-all">
                    {playing === ep.videoId ? "✕ Close" : "▶ Play Episode"}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── VIP Sessions ──────────────────────────────────────────────────────────────
function VIPSection({ email }: { email: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ message: "", availability: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/admin/vip", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: email.split("@")[0], sessionType: selected, message: form.message, availability: form.availability }),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("done"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch { setStatus("error"); setMsg("Something went wrong. Please try again."); }
  };

  return (
    <section className="py-20 md:py-28 bg-[#05070D]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <SectionLabel>Private Sessions</SectionLabel>
          <SectionTitle>Personal<br />Experiences</SectionTitle>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {SESSION_TYPES.map(s => (
            <Reveal key={s.id} delay={SESSION_TYPES.indexOf(s) * 50}>
              <div onClick={() => setSelected(selected === s.id ? null : s.id)}
                className={`group cursor-pointer border rounded-xl p-6 transition-all ${selected === s.id ? "border-white/25 bg-white/[0.04]" : "border-white/6 hover:border-white/14 hover:bg-white/[0.015]"}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-70">{s.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white/80">{s.label}</h3>
                      <span className="text-[8px] tracking-widest uppercase text-amber-400/55 border border-amber-500/20 rounded-full px-2 py-px">{s.tier}</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${selected === s.id ? "border-white/60 bg-white/15" : "border-white/15"}`} />
                </div>
                <p className="text-xs text-white/35 leading-relaxed pl-9">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <div className="max-w-2xl border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
                {status === "done" ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Request Received</h3>
                    <p className="text-sm text-white/45">{msg}</p>
                    <button onClick={() => { setStatus("idle"); setSelected(null); }} className="mt-6 text-[9px] tracking-widest uppercase text-white/28 hover:text-white/55 transition-colors">Submit Another</button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <p className="text-[9px] tracking-[0.22em] uppercase text-white/30 mb-5">Request: {SESSION_TYPES.find(s => s.id === selected)?.label}</p>
                    <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Your Account Email</label>
                      <input disabled value={email} className="w-full bg-white/[0.02] border border-white/6 rounded-lg px-4 py-3 text-sm text-white/40 cursor-not-allowed" /></div>
                    <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Availability / Preferred Times</label>
                      <input value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} placeholder="e.g. Weekends, evenings EST, or specific dates..." className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/20" /></div>
                    <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Tell Chris Why This Matters to You</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Share your story, what this session means to you, and any specifics you'd like to discuss..." required className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/20 resize-none" /></div>
                    {status === "error" && <p className="text-red-400/70 text-sm">{msg}</p>}
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setSelected(null)} className="flex-1 py-3.5 border border-white/10 text-[10px] tracking-widest uppercase text-white/35 hover:text-white/55 rounded-lg transition-all">Cancel</button>
                      <button type="submit" disabled={status === "loading"} className="flex-1 py-3.5 bg-white text-[#07090F] text-[10px] tracking-widest uppercase font-bold rounded-lg hover:bg-white/85 disabled:opacity-50 transition-colors">{status === "loading" ? "Submitting…" : "Submit Request"}</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Collaboration Banner ───────────────────────────────────────────────────────
function CollaborationBanner() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-r from-white/[0.04] to-transparent p-10 md:p-14">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/8 to-transparent" />
            <div className="relative max-w-xl">
              <p className="text-[9px] tracking-[0.28em] uppercase text-amber-400/55 mb-4">For Creators & Filmmakers</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.88] text-white mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Collaborate<br />with Chris</h2>
              <p className="text-sm text-white/45 font-light leading-relaxed mb-8">Are you a writer, director, producer, or artist with a vision? Chris Potter actively seeks meaningful collaborations. Submit your project concept through the VIP Sessions form above.</p>
              <div className="flex flex-wrap gap-4">
                {["Short Films", "Podcast Appearances", "Directing Projects", "Panel Discussions", "Educational Talks"].map(t => (
                  <span key={t} className="text-[9px] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-3 py-1.5">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Portal Dashboard ──────────────────────────────────────────────────────────
function PortalDashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const firstName = email.split("@")[0].replace(/[._-]/g, " ").split(" ")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex flex-col justify-end pb-16 pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <motion.img src="/photos/IMG_0993.JPG" alt="Fan Portal" className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: [0.16,1,0.3,1] }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/65 to-[#07090F]/40" />
        </div>
        <HeroSocialBar />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full pl-20 md:pl-24">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[10px] tracking-[0.24em] uppercase text-amber-400/50 mb-4">Fan Portal · Exclusive Access</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[clamp(3.5rem,9vw,7rem)] font-black uppercase leading-[0.88] text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Welcome,<br />{displayName}.
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-white/35 tracking-wide">{email}</p>
            <button onClick={onSignOut} className="text-[9px] tracking-[0.18em] uppercase text-white/25 hover:text-white/50 border border-white/10 hover:border-white/20 px-4 py-1.5 rounded transition-all">Sign Out</button>
          </motion.div>
        </div>
      </section>

      {/* Member Certificate */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal><p className="text-[10px] tracking-[0.24em] uppercase text-white/25 mb-8">Your Membership</p><BadgeCertificate email={email} /></Reveal>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* Exclusive Announcements */}
      <section className="py-20 md:py-28 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal><SectionLabel>Members Only</SectionLabel><SectionTitle>Exclusive<br />Updates</SectionTitle></Reveal>
          <div className="space-y-0">
            {ANNOUNCEMENTS.map((a, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-7 border-b border-white/6 hover:bg-white/[0.015] transition-all px-2 -mx-2 rounded">
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:w-40 flex-shrink-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/28">{a.date}</p>
                    <span className="text-[8px] tracking-widest uppercase border border-amber-500/25 text-amber-400/55 px-2 py-0.5 rounded-full">{a.badge}</span>
                  </div>
                  <div><h3 className="text-base font-semibold text-white mb-1.5">{a.title}</h3><p className="text-sm text-white/40 font-light leading-relaxed">{a.body}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* Exclusive Content Grid */}
      {EXCLUSIVE_CONTENT.map((section, si) => (
        <section key={si} className={`py-20 md:py-28 ${si % 2 !== 0 ? "bg-[#05070D]" : ""}`}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal><SectionLabel>{section.category}</SectionLabel><SectionTitle>{section.category}</SectionTitle></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.items.map((item, ii) => (
                <Reveal key={ii} delay={ii * 70}>
                  <div className="group relative rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.photo} alt={item.title} className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-600" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[8px] tracking-widest uppercase text-amber-400/65 border border-amber-500/25 px-2 py-0.5 rounded-full mb-2 inline-block">{item.badge}</span>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-white/45">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="section-line mx-6 md:mx-12" />

      {/* Podcast / Interviews */}
      <PodcastSection />

      <div className="section-line mx-6 md:mx-12" />

      {/* VIP Private Sessions */}
      <VIPSection email={email} />

      <div className="section-line mx-6 md:mx-12" />

      {/* Collaboration Banner */}
      <CollaborationBanner />

      <Footer />
    </div>
  );
}

// ── Login Gate ────────────────────────────────────────────────────────────────
function LoginGate() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  const requestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/auth/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("sent"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch { setStatus("error"); setMsg("Something went wrong. Please try again."); }
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />
      <section className="relative min-h-screen flex flex-col justify-end pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <motion.img src="/photos/IMG_0986.JPG" alt="Fan Portal" className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: [0.16,1,0.3,1] }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/60 to-[#07090F]/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/70 via-transparent to-transparent" />
        </div>
        <HeroSocialBar />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-32 pl-20 md:pl-24">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[10px] tracking-[0.24em] uppercase text-white/35 mb-5">Exclusive Access</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }}
            className="text-[clamp(4rem,11vw,9rem)] font-black uppercase leading-[0.88] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Fan<br />Portal
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-5 text-base text-white/45 font-light max-w-md">
            Badge holders and newsletter subscribers get access to exclusive content, private sessions with Chris, podcast episodes, and your personal membership certificate.
          </motion.p>
        </div>
      </section>

      <section className="py-24 md:py-36 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Member Sign In</p>
              <h2 className="text-[clamp(2.8rem,5vw,4rem)] font-black uppercase leading-[0.88] text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Access Your<br />Portal</h2>
              <p className="text-sm text-white/40 font-light mb-10 leading-relaxed">Enter the email address you used to subscribe or apply for a badge. We'll send you a secure sign-in link — no password needed.</p>
              {status === "sent" ? (
                <div className="border border-white/12 rounded-xl p-8 bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Check Your Email</h3>
                  <p className="text-sm text-white/45">{msg}</p>
                  <p className="text-xs text-white/25 mt-4">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
                  <button onClick={() => setStatus("idle")} className="mt-6 text-[9px] tracking-widest uppercase text-white/28 hover:text-white/50 transition-colors">Use a different email</button>
                </div>
              ) : (
                <form onSubmit={requestLink} className="space-y-4">
                  <div><label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">Email Address</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-5 py-4 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" /></div>
                  {status === "error" && <p className="text-red-400/70 text-sm">{msg}</p>}
                  <button type="submit" disabled={status === "loading"} className="w-full py-4 bg-white text-[#07090F] text-[11px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50">
                    {status === "loading" ? "Sending..." : "Send Sign-In Link"}
                  </button>
                  <p className="text-[10px] text-white/20 text-center">Not a subscriber yet? <a href="/fanbase" className="text-white/35 hover:text-white underline transition-colors">Join the Fanbase</a></p>
                </form>
              )}
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { icon: "🖼️", title: "Exclusive Gallery", desc: "Hi-res behind-the-scenes photos and approved press assets." },
                { icon: "📋", title: "Member Certificate", desc: "Your personalized fan membership certificate." },
                { icon: "🎙", title: "Podcasts & Interviews", desc: "3 exclusive Chris Potter interview episodes — members only." },
                { icon: "★", title: "Private Sessions", desc: "Request a personal VIP meet, podcast session, or collaboration." },
              ].map((f, i) => (
                <div key={i} className="border border-white/6 rounded-xl p-6 hover:border-white/12 hover:bg-white/[0.015] transition-all">
                  <span className="text-2xl mb-3 block opacity-70">{f.icon}</span>
                  <h3 className="text-sm font-semibold text-white/75 mb-2">{f.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function FanPortal() {
  const [session, setSession] = useState<{ email: string; token: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("cp_fan_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { email: string; token: string; exp: number };
        if (Date.now() < parsed.exp) { setSession({ email: parsed.email, token: parsed.token }); return; }
        localStorage.removeItem("cp_fan_session");
      } catch { localStorage.removeItem("cp_fan_session"); }
    }
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setVerifying(true);
      fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
        .then(r => r.json())
        .then((data: { success: boolean; email?: string; sessionToken?: string }) => {
          if (data.success && data.email && data.sessionToken) {
            const sd = { email: data.email, token: data.sessionToken, exp: Date.now() + 24 * 60 * 60 * 1000 };
            localStorage.setItem("cp_fan_session", JSON.stringify(sd));
            setSession({ email: data.email, token: data.sessionToken });
            navigate("/fan-portal", { replace: true });
          } else { setVerifying(false); }
        })
        .catch(() => setVerifying(false));
    }
  }, [navigate]);

  if (verifying) return (
    <div className="min-h-screen bg-[#07090F] text-white flex items-center justify-center">
      <NavBar alwaysDark />
      <div className="text-center"><div className="w-10 h-10 border-2 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-6" /><p className="text-sm text-white/40 tracking-widest uppercase">Verifying access...</p></div>
    </div>
  );

  if (session) return <PortalDashboard email={session.email} onSignOut={() => { localStorage.removeItem("cp_fan_session"); setSession(null); }} />;
  return <LoginGate />;
}
