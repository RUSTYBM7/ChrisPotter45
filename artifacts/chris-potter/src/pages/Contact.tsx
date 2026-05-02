import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); io.unobserve(el); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

// ── Management Inquiry Modal ──────────────────────────────────────────────────
interface ModalProps { onClose: () => void; }

function ManagementModal({ onClose }: ModalProps) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", jobTitle: "", reason: "",
    projectDetails: "", timeline: "", preferredContact: "", message: "", agreeTerms: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreeTerms) { setMsg("Please agree to the terms to proceed."); setStatus("error"); return; }
    setStatus("loading"); setMsg("");
    try {
      const r = await fetch("/api/contact/management", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("success"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch { setStatus("error"); setMsg("Something went wrong. Please try again."); }
  };

  const inp = "w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/25 transition-colors";
  const sel = "w-full bg-[#0a0d14] border border-white/8 rounded-lg px-4 py-3 text-sm text-white/65 focus:outline-none focus:border-white/25 transition-colors";
  const lbl = "block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5";

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0C0F18] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

          {/* Header */}
          <div className="sticky top-0 bg-[#0C0F18]/98 backdrop-blur-sm border-b border-white/6 px-7 py-5 flex items-center justify-between z-10 rounded-t-2xl">
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-white/30 mb-0.5">Professional Inquiry</p>
              <h3 className="text-xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Management Inquiry</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 hover:border-white/28 flex items-center justify-center text-white/35 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="px-7 py-7">
            {status === "success" ? (
              <div className="text-center py-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                </motion.div>
                <h4 className="text-4xl font-black uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Received.</h4>
                <p className="text-sm text-white/45 max-w-sm mx-auto mb-8">{msg}</p>
                <button onClick={onClose} className="px-6 py-2.5 border border-white/15 rounded-lg text-xs tracking-widest uppercase text-white/40 hover:text-white hover:border-white/30 transition-all">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>First Name *</label><input required type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" className={inp} /></div>
                  <div><label className={lbl}>Last Name *</label><input required type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith" className={inp} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Email Address *</label><input required type="email" value={form.email} onChange={set("email")} placeholder="jane@studio.com" className={inp} /></div>
                  <div><label className={lbl}>Phone</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" className={inp} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Company / Organization</label><input type="text" value={form.company} onChange={set("company")} placeholder="Studio or agency" className={inp} /></div>
                  <div><label className={lbl}>Your Title</label><input type="text" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Casting Director" className={inp} /></div>
                </div>
                <div>
                  <label className={lbl}>Reason for Contact *</label>
                  <select required value={form.reason} onChange={set("reason")} className={sel}>
                    <option value="">Select inquiry type</option>
                    <option>Casting — Feature Film</option>
                    <option>Casting — Television Series</option>
                    <option>Casting — TV Movie</option>
                    <option>Directing Opportunity</option>
                    <option>Producing / Co-Production</option>
                    <option>Speaking Engagement</option>
                    <option>Public Appearance</option>
                    <option>Press / Media Interview</option>
                    <option>Podcast / Editorial Feature</option>
                    <option>Business / Licensing</option>
                    <option>Legal / Rights</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Project Details</label>
                  <textarea rows={3} value={form.projectDetails} onChange={set("projectDetails")} placeholder="Describe your project, role, or opportunity..." className={inp + " resize-none"} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Timeline</label>
                    <select value={form.timeline} onChange={set("timeline")} className={sel}>
                      <option value="">Select timeline</option>
                      <option>Immediate (within 2 weeks)</option>
                      <option>Short-term (1–3 months)</option>
                      <option>Mid-term (3–6 months)</option>
                      <option>Long-term (6+ months)</option>
                      <option>Flexible / TBD</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Preferred Contact</label>
                    <select value={form.preferredContact} onChange={set("preferredContact")} className={sel}>
                      <option value="">Select preference</option>
                      <option>Email</option>
                      <option>Phone</option>
                      <option>Video Call</option>
                      <option>In-Person Meeting</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Additional Message</label>
                  <textarea rows={3} value={form.message} onChange={set("message")} placeholder="Any additional context or requirements..." className={inp + " resize-none"} />
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.agreeTerms} onChange={set("agreeTerms")} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-white" />
                  <span className="text-xs text-white/30 leading-relaxed group-hover:text-white/45 transition-colors">
                    I confirm this is a professional inquiry and agree that my information will be used solely to process and respond to this request by Chris Potter's management team.
                  </span>
                </label>
                {status === "error" && <p className="text-red-400/65 text-sm">{msg}</p>}
                <button type="submit" disabled={status === "loading"}
                  className="w-full py-4 bg-white text-[#07090F] text-[10px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50">
                  {status === "loading" ? "Submitting..." : "Submit Inquiry"}
                </button>
                <p className="text-[10px] text-white/18 text-center">Reviewed within 3–5 business days · management@chrispotterofficial.site</p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Contact() {
  const [modalOpen, setModalOpen] = useState(false);
  const [, navigate] = useLocation();

  const CARDS = [
    {
      label: "Management & Casting",
      heading: "Professional\nInquiries",
      desc: "Casting directors, producers, studios, speaking engagements, appearances, press, and business representation.",
      note: "Reviewed within 3–5 business days",
      email: "management@chrispotterofficial.site",
      action: () => setModalOpen(true),
      actionLabel: "Open Inquiry Form",
      primary: true,
      items: ["Feature Film & Television", "Directing & Producing", "Speaking & Appearances", "Press & Media", "Business & Licensing"],
    },
    {
      label: "Fanbase & Badges",
      heading: "Fan\nCommunity",
      desc: "Badge memberships, fan portal access, exclusive content, VIP session requests, and fanbase inquiries.",
      note: "Reviewed within 48 hours",
      email: "fandom@chrispotterofficial.site",
      action: () => navigate("/fanbase"),
      actionLabel: "Visit Fanbase Page",
      primary: false,
      items: ["Pioneer, Champion, Patron Badges", "Fan Portal Access", "VIP Session Requests", "Exclusive Content", "Fan Community"],
    },
    {
      label: "Foundation & Charity",
      heading: "Heartland\nLegacy Fund",
      desc: "Donations, volunteering, corporate sponsorships, event registrations, and general foundation inquiries.",
      note: "Reviewed within 48 hours",
      email: "support@chrispotterofficial.site",
      action: () => navigate("/charity"),
      actionLabel: "Visit Foundation Page",
      primary: false,
      items: ["Donate & Give Back", "Volunteer", "Corporate Sponsorship", "Event Registration", "General Foundation"],
    },
    {
      label: "Press & Media",
      heading: "Media\nRequests",
      desc: "Editorial features, interview requests, podcast appearances, photography usage, and media partnerships.",
      note: "Reviewed within 2–3 business days",
      email: "management@chrispotterofficial.site",
      action: () => navigate("/press-kit"),
      actionLabel: "View Press Kit",
      primary: false,
      items: ["Editorial Interviews", "Podcast Appearances", "Photography & Assets", "Biographical Features", "Media Partnerships"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />

      <PageHero
        photo="/photos/IMG_0982.JPG"
        photoPosition="center top"
        label="Casting · Management · Press"
        heading={"Contact &\nManagement"}
        subheading="Professional Inquiries Only"
      />

      {/* INFO STRIP */}
      <div className="border-y border-white/5 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Management", info: "management@chrispotterofficial.site", note: "Casting & professional inquiries" },
            { label: "Fan Inquiries", info: "fandom@chrispotterofficial.site", note: "Fan support & fanbase badges" },
            { label: "Response Time", info: "3–5 Business Days", note: "All inquiries are reviewed" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}>
              <p className="text-[9px] tracking-[0.22em] uppercase text-white/25 mb-2">{item.label}</p>
              <p className="text-sm text-white font-medium">{item.info}</p>
              <p className="text-xs text-white/35 mt-1">{item.note}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CONTACT CARDS */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">How Can We Help?</p>
            <h2 className="text-[clamp(2.8rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-white mb-14"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Choose Your<br />Inquiry Type
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            {CARDS.map((card, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`group relative border rounded-2xl p-8 md:p-10 flex flex-col h-full transition-all duration-300 ${
                  card.primary
                    ? "border-white/15 bg-white/[0.025] hover:border-white/28 hover:bg-white/[0.04]"
                    : "border-white/6 bg-white/[0.01] hover:border-white/14 hover:bg-white/[0.02]"
                }`}>
                  {card.primary && (
                    <div className="absolute top-5 right-5">
                      <span className="text-[8px] tracking-[0.18em] uppercase text-white/40 border border-white/15 px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                  )}
                  <p className="text-[9px] tracking-[0.22em] uppercase text-white/28 mb-3">{card.label}</p>
                  <h3 className="text-[clamp(2rem,3.5vw,3rem)] font-black uppercase leading-[0.9] text-white mb-4"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {card.heading.split("\n").map((line, j) => <span key={j}>{line}{j === 0 && <br />}</span>)}
                  </h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed mb-6">{card.desc}</p>

                  <div className="space-y-2 mb-8 flex-1">
                    {card.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                        <p className="text-xs text-white/38">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/6 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] tracking-widest uppercase text-white/22 mb-0.5">Contact</p>
                        <p className="text-[11px] text-white/38 font-mono">{card.email}</p>
                        <p className="text-[9px] text-white/20 mt-1">{card.note}</p>
                      </div>
                      <button onClick={card.action}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-[10px] tracking-[0.18em] uppercase font-semibold transition-all ${
                          card.primary
                            ? "bg-white text-[#07090F] hover:bg-white/88"
                            : "border border-white/12 text-white/50 hover:border-white/28 hover:text-white"
                        }`}>
                        {card.actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Direct email strip */}
          <Reveal delay={200}>
            <div className="mt-8 border border-white/5 rounded-xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
              <div>
                <p className="text-[9px] tracking-widest uppercase text-white/22 mb-1">Prefer to write directly?</p>
                <p className="text-sm text-white/45 font-light">All emails are read and forwarded to the appropriate team member.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:management@chrispotterofficial.site" className="text-[10px] tracking-[0.15em] uppercase text-white/35 border border-white/8 hover:border-white/22 hover:text-white/65 px-4 py-2 rounded-lg transition-all">management@chrispotterofficial.site</a>
                <a href="mailto:support@chrispotterofficial.site" className="text-[10px] tracking-[0.15em] uppercase text-white/35 border border-white/8 hover:border-white/22 hover:text-white/65 px-4 py-2 rounded-lg transition-all">support@chrispotterofficial.site</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      {modalOpen && <ManagementModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
