import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = ["Actor", "Director", "Producer"];

const PHOTOS = [
  "/photos/IMG_0988.JPG",
  "/photos/IMG_0983.JPG",
  "/photos/IMG_0986.JPG",
  "/photos/IMG_0992.JPG",
  "/photos/IMG_0996.JPG",
  "/photos/IMG_1003.JPG",
  "/photos/IMG_0995.JPG",
  "/photos/IMG_0990.JPG",
  "/photos/IMG_0982.JPG",
  "/photos/IMG_0984.JPG",
  "/photos/IMG_0993.JPG",
  "/photos/IMG_1004.JPG",
];

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealDiv({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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
  const [activeRole, setActiveRole] = useState("Actor");
  const [heroImg, setHeroImg] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImg((i) => (i + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const heroImages = [
    "/photos/IMG_0988.JPG",
    "/photos/IMG_0983.JPG",
    "/photos/IMG_0986.JPG",
  ];

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">

      {/* ─── NAVIGATION ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#07090F]/90 backdrop-blur-md border-b border-white/5"
            : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => scrollTo("hero")}
            className="text-sm font-bold tracking-[0.22em] uppercase text-white"
            data-testid="nav-logo"
          >
            Chris Potter
          </motion.button>

          <motion.nav
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hidden md:flex items-center gap-10"
          >
            {(
              [
                ["Work", "work"],
                ["About", "about"],
                ["Gallery", "gallery"],
                ["Contact", "contact"],
              ] as const
            ).map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="nav-link text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-200"
                data-testid={`nav-${id}`}
              >
                {label}
              </button>
            ))}
          </motion.nav>

          <button
            className="md:hidden p-2 flex flex-col gap-[5px]"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="nav-menu"
          >
            <span
              className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
            />
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-56" : "max-h-0"}`}
        >
          <div className="px-6 pb-8 bg-[#07090F]/98 border-b border-white/5 flex flex-col gap-6">
            {(
              [
                ["Work", "work"],
                ["About", "about"],
                ["Gallery", "gallery"],
                ["Contact", "contact"],
              ] as const
            ).map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors text-left"
                data-testid={`mobile-nav-${id}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end pb-16 md:pb-20">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.img
              key={heroImg}
              src={heroImages[heroImg]}
              alt="Chris Potter"
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              data-testid="hero-image"
            />
          </AnimatePresence>
          {/* Multi-layer dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/50 to-[#07090F]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/60 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-32">
          {/* Role pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`topic-pill px-5 py-2 rounded-full text-sm tracking-[0.06em] transition-all duration-250 ${
                  activeRole === role ? "active text-white" : "text-white/55"
                }`}
                data-testid={`role-pill-${role.toLowerCase()}`}
              >
                {activeRole === role && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 mr-2 align-middle -mt-0.5" />
                )}
                {role}
              </button>
            ))}
          </motion.div>

          {/* Hero name display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          >
            <h1
              className="text-[clamp(4.5rem,13vw,11rem)] font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              data-testid="hero-name"
            >
              Chris<br />Potter
            </h1>
          </motion.div>

          {/* Subtitle line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 flex items-center gap-4"
          >
            <div className="w-8 h-px bg-white/30" />
            <p className="text-xs tracking-[0.22em] uppercase text-white/45">
              Actor · Director · Producer
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            onClick={() => scrollTo("work")}
            className="absolute bottom-0 right-12 hidden md:flex flex-col items-center gap-2 pb-1"
            data-testid="scroll-indicator"
          >
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/25">Scroll</span>
            <span className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.button>
        </div>
      </section>

      {/* ─── SCROLLING MARQUEE ─── */}
      <div className="overflow-hidden border-y border-white/5 bg-[#05070D]" data-testid="marquee">
        <div className="marquee-track py-5 md:py-7">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center">
              {["ACTOR", "DIRECTOR", "PRODUCER", "HEARTLAND"].map((word, j) => (
                <span key={j} className="flex items-center">
                  <span
                    className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-none px-1"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      color:
                        j === 0
                          ? "rgba(255,255,255,0.80)"
                          : j === 3
                          ? "rgba(255,255,255,0.80)"
                          : "rgba(255,255,255,0.10)",
                    }}
                  >
                    {word}
                  </span>
                  <span className="mx-8 md:mx-12 text-white/8 text-2xl font-extralight">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ─── WORK / SELECTED ROLES ─── */}
      <section id="work" className="py-24 md:py-36" data-testid="work-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-16 md:mb-20 gap-6 flex-wrap">
            <RevealDiv>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">
                Selected Work
              </p>
              <h2
                className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                data-testid="work-heading"
              >
                On Screen &<br />Behind the Lens
              </h2>
            </RevealDiv>
            <RevealDiv delay={100}>
              <button
                className="text-[10px] tracking-[0.2em] uppercase text-white/35 hover:text-white border border-white/12 hover:border-white/30 px-5 py-2.5 rounded transition-all duration-200"
                data-testid="view-all-work"
              >
                Full Filmography
              </button>
            </RevealDiv>
          </div>

          {/* Featured project — large */}
          <RevealDiv className="mb-6">
            <div
              className="relative overflow-hidden rounded-lg aspect-[16/7] group cursor-pointer"
              data-testid="work-featured"
            >
              <img
                src="/photos/IMG_1003.JPG"
                alt="Heartland"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/90 via-[#07090F]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                    CBC · Netflix · 2007 – Present
                  </p>
                  <h3
                    className="text-4xl md:text-6xl font-black uppercase text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Heartland
                  </h3>
                  <p className="text-sm text-white/50 mt-1">Tim Fleming — Starring Role</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                  <span className="text-xs tracking-widest uppercase">View</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            </div>
          </RevealDiv>

          {/* Grid of other works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                img: "/photos/IMG_0995.JPG",
                title: "Riding & Roping",
                subtitle: "TV Movie — Lead Role",
                year: "2024",
              },
              {
                img: "/photos/IMG_0988.JPG",
                title: "Directing Projects",
                subtitle: "Film Direction",
                year: "2019 – Present",
              },
              {
                img: "/photos/IMG_0982.JPG",
                title: "In the Edit Suite",
                subtitle: "Production & Post",
                year: "Ongoing",
              },
            ].map((item, i) => (
              <RevealDiv key={item.title} delay={i * 100}>
                <div
                  className="relative overflow-hidden rounded-md aspect-[4/5] group cursor-pointer"
                  data-testid={`work-card-${i}`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/35 mb-1">
                      {item.year}
                    </p>
                    <h4
                      className="text-xl md:text-2xl font-black uppercase text-white"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/45 mt-0.5">{item.subtitle}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 md:py-36" data-testid="about-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-14 md:gap-20 items-start">
            {/* Photo */}
            <div className="md:col-span-5">
              <RevealDiv>
                <div className="relative rounded-md overflow-hidden aspect-[3/4]">
                  <img
                    src="/photos/IMG_0983.JPG"
                    alt="Chris Potter"
                    className="w-full h-full object-cover object-center"
                    data-testid="about-photo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/50 to-transparent" />
                </div>
              </RevealDiv>
            </div>

            {/* Text */}
            <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
              <RevealDiv>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">About</p>
                <h2
                  className="text-[clamp(3.5rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-white mb-8"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  data-testid="about-heading"
                >
                  Chris<br />Potter
                </h2>
              </RevealDiv>

              <RevealDiv delay={120}>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6 font-light">
                  Chris Potter is a multi-award-winning Canadian actor, director, and producer with over three decades of experience in film and television.
                </p>
                <p className="text-base text-white/45 leading-relaxed mb-6 font-light">
                  Best known to audiences worldwide as Tim Fleming in the beloved CBC/Netflix drama <em className="text-white/60 not-italic font-normal">Heartland</em>, Chris has built a career defined by authentic storytelling, physical commitment, and a deep love of the craft.
                </p>
                <p className="text-base text-white/45 leading-relaxed mb-10 font-light">
                  A skilled horseman and outdoorsman, Chris brings a rare combination of rugged authenticity and emotional range to every role. Behind the camera, his directing work reflects the same quiet intensity that defines his performances.
                </p>

                <div className="flex flex-wrap gap-8">
                  {[
                    { num: "30+", label: "Years in Film & TV" },
                    { num: "17", label: "Heartland Seasons" },
                    { num: "50+", label: "Screen Credits" },
                  ].map((stat, i) => (
                    <div key={i} data-testid={`stat-${i}`}>
                      <p
                        className="text-4xl md:text-5xl font-black text-white"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {stat.num}
                      </p>
                      <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </RevealDiv>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── GALLERY ─── */}
      <section id="gallery" className="py-24 md:py-36" data-testid="gallery-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <RevealDiv>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Gallery</p>
            <h2
              className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight text-white mb-14 md:mb-18"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              data-testid="gallery-heading"
            >
              Stills &<br />On Set
            </h2>
          </RevealDiv>

          {/* Masonry-style grid */}
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
              <RevealDiv key={i} delay={i * 60}>
                <div
                  className={`relative overflow-hidden rounded group cursor-pointer ${
                    item.tall ? "aspect-[3/4]" : "aspect-square"
                  }`}
                  data-testid={`gallery-item-${i}`}
                >
                  <img
                    src={item.src}
                    alt={`Chris Potter ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── QUOTE ─── */}
      <section className="py-24 md:py-36" data-testid="quote-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <RevealDiv>
            <div className="max-w-4xl">
              <p className="text-3xl md:text-5xl lg:text-[3.5rem] font-light text-white/75 leading-[1.25] tracking-tight mb-10">
                "I've always been drawn to characters who are complicated — people trying to do right by others while struggling with their own demons. That tension is where the real story lives."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-[10px] tracking-[0.22em] uppercase text-white/30">Chris Potter</p>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 md:py-36" data-testid="contact-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-14 md:gap-20">
            <div className="md:col-span-5">
              <RevealDiv>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">
                  Get in Touch
                </p>
                <h2
                  className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white mb-8"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  data-testid="contact-heading"
                >
                  Casting &<br />Inquiries
                </h2>
                <p className="text-base text-white/45 leading-relaxed mb-10 font-light">
                  Available for feature films, limited series, guest roles, and select directorial projects. Represented for film and television in Canada and internationally.
                </p>

                <div className="space-y-3.5">
                  {[
                    "Feature Film & Television",
                    "Directing Opportunities",
                    "Speaking Engagements",
                    "Fan & Press Inquiries",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white/35">
                      <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* On-set photo */}
                <div className="mt-12 rounded-md overflow-hidden aspect-[4/3]">
                  <img
                    src="/photos/IMG_1004.JPG"
                    alt="Chris Potter on set"
                    className="w-full h-full object-cover object-top"
                    data-testid="contact-photo"
                  />
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
                      <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane"
                        className="w-full bg-white/[0.025] border border-white/8 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/25 transition-colors"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Smith"
                        className="w-full bg-white/[0.025] border border-white/8 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/25 transition-colors"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="jane@studio.com"
                      className="w-full bg-white/[0.025] border border-white/8 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/25 transition-colors"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">
                      Company / Production House
                    </label>
                    <input
                      type="text"
                      placeholder="Your production company"
                      className="w-full bg-white/[0.025] border border-white/8 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/25 transition-colors"
                      data-testid="input-company"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">
                      Type of Inquiry
                    </label>
                    <select
                      className="w-full bg-[#0C0F18] border border-white/8 rounded px-4 py-3.5 text-sm text-white/60 focus:outline-none focus:border-white/25 transition-colors appearance-none"
                      data-testid="select-inquiry"
                    >
                      <option value="">Select one</option>
                      <option value="casting">Casting — Film</option>
                      <option value="casting-tv">Casting — Television</option>
                      <option value="directing">Directing Project</option>
                      <option value="speaking">Speaking / Appearance</option>
                      <option value="press">Press / Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full bg-white/[0.025] border border-white/8 rounded px-4 py-3.5 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/25 transition-colors resize-none"
                      data-testid="input-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-[#07090F] text-[10px] tracking-[0.22em] uppercase font-bold rounded hover:bg-white/88 active:bg-white/75 transition-colors duration-200"
                    data-testid="button-submit"
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
      <footer className="border-t border-white/5 py-10 md:py-12" data-testid="footer">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold tracking-[0.24em] uppercase text-white/40">
            Chris Potter
          </p>
          <div className="flex gap-8">
            {(
              [
                ["Work", "work"],
                ["About", "about"],
                ["Gallery", "gallery"],
                ["Contact", "contact"],
              ] as const
            ).map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[9px] tracking-[0.2em] uppercase text-white/22 hover:text-white/45 transition-colors"
                data-testid={`footer-nav-${id}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[9px] tracking-wide text-white/18">
            &copy; {new Date().getFullYear()} Chris Potter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
