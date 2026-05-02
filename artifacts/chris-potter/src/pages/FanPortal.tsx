import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import HeroSocialBar from "@/components/shared/HeroSocialBar";

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

const EXCLUSIVE_CONTENT = [
  {
    category: "Behind the Scenes",
    items: [
      { title: "On Set — Heartland S17", desc: "Behind-the-scenes stills from the latest season.", photo: "/photos/IMG_0992.JPG", badge: "Exclusive" },
      { title: "The Edit Suite", desc: "Chris Potter in the editing room working on his directorial debut.", photo: "/photos/IMG_0982.JPG", badge: "Members Only" },
      { title: "Heartland — Location Scouting", desc: "Early morning scouts for the ranch exteriors.", photo: "/photos/IMG_0995.JPG", badge: "Exclusive" },
    ],
  },
  {
    category: "Gallery",
    items: [
      { title: "Heartland — Cowboy Series", desc: "Full editorial series in the Heartland landscape.", photo: "/photos/IMG_0988.JPG", badge: "Hi-Res Available" },
      { title: "Outdoor Portraits", desc: "Approved portrait series for fan and editorial use.", photo: "/photos/IMG_0986.JPG", badge: "Hi-Res Available" },
      { title: "Winter Series", desc: "Heartland in the Canadian winter.", photo: "/photos/IMG_1003.JPG", badge: "Hi-Res Available" },
    ],
  },
];

const ANNOUNCEMENTS = [
  { date: "May 2025", title: "Heartland Season 18 — First Look", body: "Exclusive first-look images from the Season 18 set, shared with badge holders two weeks ahead of the public announcement.", badge: "Members Only" },
  { date: "April 2025", title: "Personal Message from Chris", body: "A personal video message from Chris Potter recorded exclusively for Fanbase members, reflecting on 18 seasons of Heartland.", badge: "Video" },
  { date: "March 2025", title: "Giveaway Winners — Q1 2025", body: "The Q1 2025 giveaway results have been announced. Three Patron badge holders receive signed Heartland prints.", badge: "Giveaway" },
  { date: "February 2025", title: "Director's Notes — S17 Finale", body: "Chris shares his personal notes and thoughts from directing the Season 17 finale. Available exclusively to Legacy+ badge holders.", badge: "Legacy+" },
];

function BadgeCertificate({ email }: { email: string }) {
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div className="relative rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-900/15 to-transparent overflow-hidden p-8 md:p-12">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "repeating-linear-gradient(45deg, rgba(245,197,24,0.3) 0px, transparent 1px, transparent 10px, rgba(245,197,24,0.3) 11px)",
        backgroundSize: "14px 14px",
      }} />
      <div className="relative text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase text-amber-400/50 mb-6">Chris Potter Official · Fanbase Member Certificate</p>
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⭐</span>
        </div>
        <p className="text-sm text-white/40 tracking-widest uppercase mb-2">This certifies that</p>
        <h3 className="text-4xl md:text-5xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{name}</h3>
        <p className="text-sm text-white/35 mb-1">is a verified member of the</p>
        <p className="text-xl font-bold text-amber-400/70 mb-6">Chris Potter Official Fanbase</p>
        <div className="flex items-center justify-center gap-4 text-[9px] tracking-widest uppercase text-white/20">
          <span>Verified Fan Portal Member</span>
          <span>·</span>
          <span>{new Date().getFullYear()}</span>
          <span>·</span>
          <span>chrispotterofficial.site</span>
        </div>
        <div className="mt-6 pt-6 border-t border-white/8">
          <p className="text-[9px] text-white/18 tracking-wide">{email}</p>
        </div>
      </div>
    </div>
  );
}

function PortalDashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const firstName = email.split("@")[0].replace(/[._-]/g, " ").split(" ")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />

      {/* ── PORTAL HERO ── */}
      <section className="relative min-h-[55vh] flex flex-col justify-end pb-16 pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <motion.img src="/photos/IMG_0993.JPG" alt="Fan Portal" className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: [0.16,1,0.3,1] }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/65 to-[#07090F]/40" />
        </div>
        <HeroSocialBar />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full pl-20 md:pl-24">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-[10px] tracking-[0.24em] uppercase text-amber-400/50 mb-4">Fan Portal · Exclusive Access</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[clamp(3.5rem,9vw,7rem)] font-black uppercase leading-[0.88] text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Welcome,<br />{displayName}.
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-white/35 tracking-wide">{email}</p>
            <button onClick={onSignOut} className="text-[9px] tracking-[0.18em] uppercase text-white/25 hover:text-white/50 border border-white/10 hover:border-white/20 px-4 py-1.5 rounded transition-all">
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── MEMBER CERTIFICATE ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/25 mb-8">Your Membership</p>
            <BadgeCertificate email={email} />
          </Reveal>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── EXCLUSIVE ANNOUNCEMENTS ── */}
      <section className="py-20 md:py-28 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/25 mb-4">Members Only</p>
            <h2 className="text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88] text-white mb-12"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Exclusive<br />Updates</h2>
          </Reveal>
          <div className="space-y-0">
            {ANNOUNCEMENTS.map((a, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-7 border-b border-white/6 hover:bg-white/[0.015] transition-all px-2 -mx-2 rounded">
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:w-40 flex-shrink-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/28">{a.date}</p>
                    <span className="text-[8px] tracking-widest uppercase border border-amber-500/25 text-amber-400/55 px-2 py-0.5 rounded-full">{a.badge}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1.5">{a.title}</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">{a.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── EXCLUSIVE CONTENT GRID ── */}
      {EXCLUSIVE_CONTENT.map((section, si) => (
        <section key={si} className={`py-20 md:py-28 ${si % 2 !== 0 ? "bg-[#05070D]" : ""}`}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/25 mb-4">{section.category}</p>
              <h2 className="text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88] text-white mb-12"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{section.category}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.items.map((item, ii) => (
                <Reveal key={ii} delay={ii * 70}>
                  <div className="group relative rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.photo} alt={item.title}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-600" />
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

      <Footer />
    </div>
  );
}

function LoginGate() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  const requestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("sent"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch {
      setStatus("error"); setMsg("Something went wrong. Please try again.");
    }
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
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-[10px] tracking-[0.24em] uppercase text-white/35 mb-5">Exclusive Access</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }}
            className="text-[clamp(4rem,11vw,9rem)] font-black uppercase leading-[0.88] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Fan<br />Portal
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-5 text-base text-white/45 font-light max-w-md">
            Badge holders and newsletter subscribers get access to exclusive behind-the-scenes content, personal updates, and your membership certificate.
          </motion.p>
        </div>
      </section>

      {/* ── LOGIN FORM ── */}
      <section className="py-24 md:py-36 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Member Sign In</p>
              <h2 className="text-[clamp(2.8rem,5vw,4rem)] font-black uppercase leading-[0.88] text-white mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Access Your<br />Portal</h2>
              <p className="text-sm text-white/40 font-light mb-10 leading-relaxed">
                Enter the email address you used to subscribe or apply for a badge. We'll send you a secure sign-in link — no password needed.
              </p>

              {status === "sent" ? (
                <div className="border border-white/12 rounded-xl p-8 bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Check Your Email</h3>
                  <p className="text-sm text-white/45">{msg}</p>
                  <p className="text-xs text-white/25 mt-4">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
                  <button onClick={() => setStatus("idle")} className="mt-6 text-[9px] tracking-widest uppercase text-white/28 hover:text-white/50 transition-colors">
                    Use a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={requestLink} className="space-y-4">
                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">Email Address</label>
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-5 py-4 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>
                  {status === "error" && <p className="text-red-400/70 text-sm">{msg}</p>}
                  <button type="submit" disabled={status === "loading"}
                    className="w-full py-4 bg-white text-[#07090F] text-[11px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50">
                    {status === "loading" ? "Sending..." : "Send Sign-In Link"}
                  </button>
                  <p className="text-[10px] text-white/20 text-center">
                    Not a subscriber yet?{" "}
                    <a href="/fanbase" className="text-white/35 hover:text-white underline transition-colors">Join the Fanbase</a>
                  </p>
                </form>
              )}
            </Reveal>
          </div>

          {/* Feature list */}
          <Reveal delay={200}>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "🖼️", title: "Exclusive Gallery", desc: "High-resolution behind-the-scenes photos and approved press assets." },
                { icon: "📋", title: "Member Certificate", desc: "Your personalized fan membership certificate with your name and details." },
                { icon: "📣", title: "Early Announcements", desc: "Be the first to know about new projects, roles, and Heartland seasons." },
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

export default function FanPortal() {
  const [session, setSession] = useState<{ email: string; token: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("cp_fan_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { email: string; token: string; exp: number };
        if (Date.now() < parsed.exp) {
          setSession({ email: parsed.email, token: parsed.token });
          return;
        }
        localStorage.removeItem("cp_fan_session");
      } catch { localStorage.removeItem("cp_fan_session"); }
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setVerifying(true);
      fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then(r => r.json())
        .then((data: { success: boolean; email?: string; sessionToken?: string }) => {
          if (data.success && data.email && data.sessionToken) {
            const sessionData = { email: data.email, token: data.sessionToken, exp: Date.now() + 24 * 60 * 60 * 1000 };
            localStorage.setItem("cp_fan_session", JSON.stringify(sessionData));
            setSession({ email: data.email, token: data.sessionToken });
            navigate("/fan-portal", { replace: true });
          } else {
            setVerifying(false);
          }
        })
        .catch(() => setVerifying(false));
    }
  }, [navigate]);

  const signOut = () => {
    localStorage.removeItem("cp_fan_session");
    setSession(null);
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#07090F] text-white flex items-center justify-center">
        <NavBar alwaysDark />
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-sm text-white/40 tracking-widest uppercase">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return <PortalDashboard email={session.email} onSignOut={signOut} />;
  }

  return <LoginGate />;
}
