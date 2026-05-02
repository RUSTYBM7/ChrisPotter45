import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const PRESS_PHOTOS = [
  { src: "/photos/IMG_0988.JPG", label: "Portrait — Cowboy Hat" },
  { src: "/photos/IMG_0983.JPG", label: "Silhouette — Beach" },
  { src: "/photos/IMG_0984.JPG", label: "Headshot — Studio" },
  { src: "/photos/IMG_0986.JPG", label: "Editorial — Outdoor" },
  { src: "/photos/IMG_0995.JPG", label: "Action — Horseback" },
  { src: "/photos/IMG_1003.JPG", label: "Heartland — Winter" },
  { src: "/photos/IMG_0992.JPG", label: "On Set — Heartland" },
  { src: "/photos/IMG_0982.JPG", label: "In the Edit Suite" },
];

const SHORT_BIO = `Chris Potter is a multi-award-winning Canadian actor, director, and producer. Best known worldwide as Tim Fleming in CBC/Netflix's long-running drama Heartland, Chris has brought his signature combination of rugged authenticity and emotional depth to over 50 screen credits spanning three decades.`;

const LONG_BIO = `Chris Potter is a multi-award-winning Canadian actor, director, and producer whose career spans more than three decades in film and television. Born and raised in Canada, Chris first came to prominence in the 1990s through his role in Kung Fu: The Legend Continues, earning a devoted international following.

He is best known worldwide as Tim Fleming in CBC and Netflix's beloved drama Heartland, now in its 18th season and one of Canada's most successful television exports. His portrayal of the emotionally complex rancher, horseman, and father has made Tim Fleming one of the most iconic characters in Canadian television history.

Beyond acting, Chris Potter has steadily built a career as a director and producer. He has directed multiple episodes of Heartland and taken on producing roles across a range of Canadian productions, demonstrating a deep commitment to storytelling that extends behind the camera.

A skilled horseman and outdoorsman, Chris brings a rare authenticity to his performances that audiences worldwide recognize instantly. His work reflects a quiet intensity and a dedication to characters who are grounded, real, and deeply human.

Chris Potter continues to be one of Canada's most respected and beloved screen talents.`;

function downloadBio() {
  const blob = new Blob([LONG_BIO], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ChrisPotter_OfficialBio.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPhoto(src: string, label: string) {
  const a = document.createElement("a");
  a.href = src;
  a.download = `ChrisPotter_${label.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function printPressKit() {
  window.print();
}

export default function PressKit() {
  const [copied, setCopied] = useState(false);

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden" id="press-kit-root">
      <NavBar alwaysDark />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end pb-16 md:pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/photos/IMG_0984.JPG"
            alt="Chris Potter"
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/50 to-[#07090F]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/70 via-transparent to-transparent" />
        </div>
        <HeroSocialBar />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[10px] tracking-[0.24em] uppercase text-white/35 mb-5"
          >
            Media & Press
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9, ease: [0.16,1,0.3,1] }}
            className="text-[clamp(4rem,11vw,9rem)] font-black uppercase leading-[0.88] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Press<br />Kit
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-6 flex items-center gap-4"
          >
            <div className="w-8 h-px bg-white/30" />
            <p className="text-xs tracking-[0.22em] uppercase text-white/45">Official Assets · Bios · Photography</p>
          </motion.div>
        </div>
      </section>

      {/* ── DOWNLOAD BAR ── */}
      <div className="border-y border-white/5 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase text-white/28 mb-1">Quick Downloads</p>
            <p className="text-sm text-white/60 font-light">Official press assets for Chris Potter</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={downloadBio}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/12 hover:border-white/28 rounded-lg text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" /></svg>
              Bio (.txt)
            </button>
            <button onClick={printPressKit}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#07090F] rounded-lg text-xs tracking-[0.15em] uppercase font-bold hover:bg-white/88 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4" /></svg>
              Download Press Kit PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── OFFICIAL BIO ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-14 md:gap-20">
            <div className="md:col-span-4">
              <Reveal>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">Official Biography</p>
                <h2
                  className="text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88] text-white mb-8"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  About<br />Chris Potter
                </h2>
                <div className="flex flex-wrap gap-3">
                  <button onClick={downloadBio}
                    className="flex items-center gap-2 px-4 py-2 border border-white/12 hover:border-white/28 rounded text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" /></svg>
                    Download Bio
                  </button>
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <Reveal delay={100}>
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/7 bg-white/[0.02] p-6 md:p-8">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/28 mb-3">Short Bio</p>
                    <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">{SHORT_BIO}</p>
                  </div>
                  <div className="rounded-xl border border-white/7 bg-white/[0.02] p-6 md:p-8">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/28 mb-4">Full Biography</p>
                    <div className="space-y-4">
                      {LONG_BIO.split("\n\n").map((para, i) => (
                        <p key={i} className="text-sm md:text-base text-white/55 font-light leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Key facts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Nationality", value: "Canadian" },
                      { label: "Known For", value: "Heartland" },
                      { label: "Seasons", value: "18 (Tim Fleming)" },
                      { label: "Career Span", value: "1990s – Present" },
                    ].map((f, i) => (
                      <div key={i} className="rounded-lg border border-white/6 bg-white/[0.015] p-4">
                        <p className="text-[9px] tracking-widest uppercase text-white/25 mb-1">{f.label}</p>
                        <p className="text-sm text-white/65 font-medium">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── APPROVED PHOTOGRAPHY ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <Reveal>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Approved Photography</p>
              <h2
                className="text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88] text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                High-Res<br />Photos
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/50" />
                All photos approved for editorial use with credit
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRESS_PHOTOS.map((photo, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="group relative overflow-hidden rounded-xl">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.label}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-xs text-white font-medium mb-3">{photo.label}</p>
                    <button
                      onClick={() => downloadPhoto(photo.src, photo.label)}
                      className="flex items-center gap-1.5 w-full justify-center py-2 bg-white text-[#07090F] rounded text-[9px] tracking-[0.15em] uppercase font-bold hover:bg-white/88 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" /></svg>
                      Download
                    </button>
                  </div>
                  <p className="text-[9px] tracking-wide text-white/35 mt-2 text-center">{photo.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-8 text-xs text-white/22 text-center">
              Photo credit: Chris Potter Official · For editorial use only
            </p>
          </Reveal>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── PRESS CONTACTS ── */}
      <section className="py-24 md:py-32 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-4">Press Contacts</p>
            <h2
              className="text-[clamp(2.8rem,5vw,4.5rem)] font-black uppercase leading-[0.88] text-white mb-14"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Get in<br />Touch
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                type: "Press & Media Inquiries",
                email: "management@chrispotterofficial.site",
                note: "Interviews, editorial features, broadcast appearances",
                icon: "📰",
              },
              {
                type: "Fan & Community",
                email: "fandom@chrispotterofficial.site",
                note: "Fan events, badge tiers, community partnerships",
                icon: "⭐",
              },
              {
                type: "Casting & Bookings",
                email: "management@chrispotterofficial.site",
                note: "Professional casting and booking inquiries",
                icon: "🎬",
              },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-xl border border-white/7 p-7 hover:border-white/14 hover:bg-white/[0.02] transition-all">
                  <span className="text-2xl mb-4 block opacity-70">{c.icon}</span>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-white/28 mb-2">{c.type}</p>
                  <button
                    onClick={() => copyEmail(c.email)}
                    className="text-base font-medium text-white hover:text-white/70 transition-colors text-left break-all mb-3"
                  >
                    {c.email}
                  </button>
                  <p className="text-xs text-white/35 font-light">{c.note}</p>
                  <button
                    onClick={() => copyEmail(c.email)}
                    className="mt-4 text-[9px] tracking-[0.16em] uppercase text-white/28 hover:text-white/50 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    {copied ? "Copied!" : "Copy email"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── USAGE GUIDELINES ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="rounded-xl border border-white/6 p-7 md:p-10 bg-white/[0.015]">
              <p className="text-[9px] tracking-[0.22em] uppercase text-white/28 mb-4">Usage Guidelines</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Photo Credit", desc: 'All photos must be credited as: \u201cChris Potter Official\u201d or \u201cCourtesy of Chris Potter\u201d.' },
                  { title: "Editorial Use", desc: "Photos may be used in news articles, reviews, and editorial coverage without prior approval." },
                  { title: "Commercial Use", desc: "Commercial use, modifications, or use in advertising requires prior written approval from management." },
                ].map((g, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-white/70 mb-2">{g.title}</p>
                    <p className="text-xs text-white/35 font-light leading-relaxed">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      {/* ── PRINT STYLES ── */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print, nav, footer, button { display: none !important; }
          #press-kit-root { background: white; color: black; }
          img { max-width: 200px !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
          * { color: black !important; border-color: #ccc !important; background: white !important; }
        }
      `}</style>
    </div>
  );
}
