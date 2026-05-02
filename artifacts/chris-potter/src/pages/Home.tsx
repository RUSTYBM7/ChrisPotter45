import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TOPICS = ["Housing", "Education", "Healthcare"];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [activeTopic, setActiveTopic] = useState("Housing");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white overflow-x-hidden">

      {/* ─── NAV ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#080C14]/95 backdrop-blur-md border-b border-white/5" : ""
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => scrollTo("hero")}
              className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white"
              data-testid="nav-logo"
            >
              Chris Potter
            </button>
          </motion.div>

          {/* Desktop nav */}
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hidden md:flex items-center gap-10"
          >
            {[["Watch", "watch"], ["About", "about"], ["Topics", "topics"], ["Contact", "contact"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="nav-link text-xs tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors duration-200"
                data-testid={`nav-${id}`}
              >
                {label}
              </button>
            ))}
          </motion.nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="nav-menu-toggle"
          >
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-64" : "max-h-0"}`}>
          <div className="px-6 pb-6 bg-[#080C14]/98 border-b border-white/5 flex flex-col gap-5">
            {[["Watch", "watch"], ["About", "about"], ["Topics", "topics"], ["Contact", "contact"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors text-left"
                data-testid={`mobile-nav-${id}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-20">
        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
          {/* Top label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-xs tracking-[0.22em] uppercase text-white/40 mb-8"
            data-testid="hero-label"
          >
            Watch my views on:
          </motion.p>

          {/* Topic pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="flex flex-wrap gap-3 mb-12 md:mb-16"
          >
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`topic-pill px-5 py-2 rounded-full text-sm tracking-[0.08em] transition-all duration-250 ${
                  activeTopic === topic ? "active text-white" : "text-white/60"
                }`}
                data-testid={`topic-pill-${topic.toLowerCase()}`}
              >
                {activeTopic === topic && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 align-middle -mt-0.5" />
                )}
                {topic}
              </button>
            ))}
          </motion.div>

          {/* Video frame */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="relative w-full max-w-5xl mx-auto"
            data-testid="hero-video-frame"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0D1220] video-glow border border-white/8">
              {/* Dark cinematic frame interior */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#0D1628] to-[#070C18]" />

              {/* Subtle grid texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "60px 60px"
                }}
              />

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 hover:border-white/50 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                  <svg className="w-6 h-6 text-white/50 group-hover:text-white/80 transition-colors ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-white/25 text-xs tracking-[0.2em] uppercase">{activeTopic} · Latest View</p>
              </div>

              {/* Scrolling topic label bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white/50 text-xs tracking-widest uppercase">{activeTopic}</span>
                <span className="text-white/30 text-xs">0:00 / 1:23</span>
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 left-5 flex items-center gap-3">
                <span className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase">Chris Potter</span>
              </div>
              <div className="absolute top-4 right-5">
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
            </div>

            {/* Frame shadow/glow strip */}
            <div className="absolute -bottom-8 left-10 right-10 h-8 bg-blue-600/10 blur-xl rounded-full" />
          </motion.div>

          {/* Large display headline scrolling below */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-24 md:mt-32 overflow-hidden"
          >
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SCROLLING MARQUEE ─── */}
      <div className="overflow-hidden py-10 md:py-14 border-y border-white/5 bg-[#060A12]" data-testid="marquee-section">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-0 mr-0">
              {["HOUSING", "EDUCATION", "HEALTHCARE"].map((word, j) => (
                <span key={j} className="flex items-center">
                  <span
                    className="text-[clamp(3rem,8vw,7rem)] font-black tracking-tight leading-none uppercase"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", color: j === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)" }}
                  >
                    {word}
                  </span>
                  <span className="mx-8 md:mx-14 text-[clamp(1.5rem,3vw,3rem)] text-white/10 font-light">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 md:py-36" data-testid="about-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
            <div className="md:col-span-4">
              <RevealDiv>
                <p className="text-xs tracking-[0.22em] uppercase text-white/35 mb-5">About</p>
                <h2
                  className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.92] uppercase tracking-tight text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  data-testid="about-heading"
                >
                  Chris<br />Potter
                </h2>
              </RevealDiv>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <RevealDiv delay={150}>
                <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8 font-light">
                  Chris Potter is a nationally recognized commentator, speaker, and thought leader on America's most pressing social policy issues — housing affordability, education reform, and healthcare access.
                </p>
                <p className="text-base md:text-lg text-white/50 leading-relaxed mb-8 font-light">
                  With over a decade of experience shaping public discourse, Chris brings clarity and conviction to conversations that matter. His insights have appeared in leading media outlets, think tanks, and legislative hearings across the country.
                </p>
                <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">
                  Whether speaking to a stadium audience or testifying before a Senate committee, Chris Potter cuts through the noise with evidence-based arguments and an unflinching commitment to actionable solutions.
                </p>

                <div className="mt-12 flex flex-wrap gap-6">
                  <div data-testid="stat-years">
                    <p className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>10+</p>
                    <p className="text-xs tracking-[0.15em] uppercase text-white/35 mt-1">Years of Impact</p>
                  </div>
                  <div className="w-px bg-white/8 self-stretch" />
                  <div data-testid="stat-talks">
                    <p className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>200+</p>
                    <p className="text-xs tracking-[0.15em] uppercase text-white/35 mt-1">Talks & Keynotes</p>
                  </div>
                  <div className="w-px bg-white/8 self-stretch" />
                  <div data-testid="stat-topics">
                    <p className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3</p>
                    <p className="text-xs tracking-[0.15em] uppercase text-white/35 mt-1">Core Policy Areas</p>
                  </div>
                </div>
              </RevealDiv>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── TOPICS ─── */}
      <section id="topics" className="py-24 md:py-36" data-testid="topics-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <RevealDiv>
            <p className="text-xs tracking-[0.22em] uppercase text-white/35 mb-4">Areas of Focus</p>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-tight uppercase tracking-tight text-white mb-16 md:mb-20"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              data-testid="topics-heading"
            >
              What Chris<br />Stands For
            </h2>
          </RevealDiv>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                topic: "Housing",
                number: "01",
                description:
                  "America's housing crisis is a policy failure, not a market inevitability. Chris advocates for bold zoning reform, renter protections, and public investment in attainable housing at every income level.",
                points: ["Zoning & Land Use Reform", "Renter Rights & Protections", "Affordable Housing Funding"],
              },
              {
                topic: "Education",
                number: "02",
                description:
                  "A world-class education should not be a function of a child's zip code. Chris challenges the systemic inequities that lock millions out of the opportunity that good schooling provides.",
                points: ["Equitable School Funding", "Teacher Pay & Retention", "Early Childhood Investment"],
              },
              {
                topic: "Healthcare",
                number: "03",
                description:
                  "Healthcare is a right, not a luxury. Chris makes the case for transparent pricing, expanded coverage, and systems that put patients — not profits — first.",
                points: ["Coverage Expansion", "Price Transparency", "Mental Health Access"],
              },
            ].map((item, i) => (
              <RevealDiv key={item.topic} delay={i * 120}>
                <div
                  className="h-full border border-white/8 rounded-lg p-8 md:p-10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/14 transition-all duration-400 group"
                  data-testid={`topic-card-${item.topic.toLowerCase()}`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-xs tracking-[0.2em] text-white/25 uppercase">{item.number}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors duration-300">
                      <svg className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>

                  <h3
                    className="text-4xl md:text-5xl font-black uppercase text-white mb-5 leading-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.topic}
                  </h3>

                  <p className="text-sm text-white/50 leading-relaxed mb-8 font-light">
                    {item.description}
                  </p>

                  <ul className="space-y-2.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-xs text-white/35 tracking-wide">
                        <span className="w-1 h-1 rounded-full bg-blue-400/60 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── WATCH / LATEST VIEWS ─── */}
      <section id="watch" className="py-24 md:py-36" data-testid="watch-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-14 md:mb-18 gap-6 flex-wrap">
            <RevealDiv>
              <p className="text-xs tracking-[0.22em] uppercase text-white/35 mb-4">Latest Views</p>
              <h2
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-tight uppercase tracking-tight text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                data-testid="watch-heading"
              >
                Watch &<br />Listen
              </h2>
            </RevealDiv>
            <RevealDiv delay={100}>
              <button
                className="text-xs tracking-[0.18em] uppercase text-white/40 hover:text-white transition-colors duration-200 border border-white/15 hover:border-white/35 px-5 py-3 rounded"
                data-testid="view-all-button"
              >
                View All
              </button>
            </RevealDiv>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              { title: "The Housing Crisis Explained", topic: "Housing", duration: "14:32", tag: "Featured" },
              { title: "Why School Funding Is Broken", topic: "Education", duration: "18:45", tag: "Recent" },
              { title: "The True Cost of American Healthcare", topic: "Healthcare", duration: "22:10", tag: "Recent" },
              { title: "Zoning Laws That Are Killing Cities", topic: "Housing", duration: "9:58", tag: null },
              { title: "Teachers Deserve Better", topic: "Education", duration: "11:20", tag: null },
              { title: "Mental Health & the Coverage Gap", topic: "Healthcare", duration: "16:04", tag: null },
            ].map((video, i) => (
              <RevealDiv key={video.title} delay={i * 80}>
                <div
                  className="group cursor-pointer"
                  data-testid={`video-card-${i}`}
                >
                  <div className="relative aspect-video rounded-md overflow-hidden bg-[#0D1220] border border-white/6 mb-4 group-hover:border-white/15 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      video.topic === "Housing" ? "from-blue-900/30 to-slate-900/80" :
                      video.topic === "Education" ? "from-indigo-900/30 to-slate-900/80" :
                      "from-sky-900/30 to-slate-900/80"
                    }`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/8 transition-all duration-300">
                        <svg className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 text-white/40 text-xs">{video.duration}</div>
                    {video.tag && (
                      <div className="absolute top-3 left-3 text-[10px] tracking-[0.15em] uppercase text-white/50 border border-white/15 px-2 py-0.5 rounded-sm">
                        {video.tag}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-blue-400/70 mb-1.5">{video.topic}</p>
                  <h4 className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors duration-200 font-medium leading-snug">
                    {video.title}
                  </h4>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── QUOTE / PULLQUOTE ─── */}
      <section className="py-24 md:py-36 overflow-hidden" data-testid="quote-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <RevealDiv>
            <div className="max-w-4xl">
              <p className="text-4xl md:text-5xl lg:text-6xl font-light text-white/80 leading-[1.2] tracking-tight mb-10">
                "The defining issues of our time — housing, education, healthcare — are not inevitable. They are choices. And we can choose differently."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-xs tracking-[0.2em] uppercase text-white/35">Chris Potter</p>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 md:py-36" data-testid="contact-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
            <div className="md:col-span-5">
              <RevealDiv>
                <p className="text-xs tracking-[0.22em] uppercase text-white/35 mb-5">Get in Touch</p>
                <h2
                  className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.92] uppercase tracking-tight text-white mb-8"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  data-testid="contact-heading"
                >
                  Book Chris<br />to Speak
                </h2>
                <p className="text-base text-white/50 leading-relaxed font-light mb-10">
                  Chris is available for keynote addresses, panel discussions, media commentary, and legislative consultations on housing, education, and healthcare policy.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className="w-1 h-1 rounded-full bg-blue-400/60" />
                    Keynote Speaking
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className="w-1 h-1 rounded-full bg-blue-400/60" />
                    Media Commentary & Interviews
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className="w-1 h-1 rounded-full bg-blue-400/60" />
                    Policy Consulting
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className="w-1 h-1 rounded-full bg-blue-400/60" />
                    Panel Discussions
                  </div>
                </div>
              </RevealDiv>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <RevealDiv delay={150}>
                <form
                  className="space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                  data-testid="contact-form"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.18em] uppercase text-white/35 mb-2">First Name</label>
                      <input
                        type="text"
                        placeholder="Jane"
                        className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.18em] uppercase text-white/35 mb-2">Last Name</label>
                      <input
                        type="text"
                        placeholder="Smith"
                        className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-white/35 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="jane@organization.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-white/35 mb-2">Organization</label>
                    <input
                      type="text"
                      placeholder="Your organization"
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                      data-testid="input-organization"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-white/35 mb-2">Type of Inquiry</label>
                    <select
                      className="w-full bg-[#0D1220] border border-white/10 rounded px-4 py-3.5 text-sm text-white/70 focus:outline-none focus:border-white/30 transition-colors appearance-none"
                      data-testid="select-inquiry-type"
                    >
                      <option value="">Select one</option>
                      <option value="keynote">Keynote Speaking</option>
                      <option value="media">Media / Interview</option>
                      <option value="consulting">Policy Consulting</option>
                      <option value="panel">Panel Discussion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-white/35 mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about the event or inquiry..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                      data-testid="input-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-[#080C14] text-xs tracking-[0.18em] uppercase font-bold rounded hover:bg-white/90 transition-colors duration-200"
                    data-testid="button-submit-contact"
                  >
                    Send Inquiry
                  </button>
                </form>
              </RevealDiv>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10 md:py-14" data-testid="footer">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-white/50">Chris Potter</p>

          <div className="flex gap-8">
            {[["Watch", "watch"], ["About", "about"], ["Topics", "topics"], ["Contact", "contact"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[10px] tracking-[0.18em] uppercase text-white/25 hover:text-white/50 transition-colors"
                data-testid={`footer-nav-${id}`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-[10px] tracking-wide text-white/20">
            &copy; {new Date().getFullYear()} Chris Potter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
