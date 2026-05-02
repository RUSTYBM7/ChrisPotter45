import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import HeroSocialBar from "@/components/shared/HeroSocialBar";

// ── CONFIG — replace these before publishing ──────────────────────────────────
const BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const USDT_TRC20  = "TGCRkw1Vq759FBCrwxkZGgqZiqrSdpHysD";
const STRIPE_URL  = "https://donate.stripe.com/00000000";
const PAYPAL_URL  = "https://paypal.me/heartlandlegacyfund";

// ── Helpers ───────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); io.unobserve(el); } }, { threshold: 0.06 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">{children}</p>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const EVENTS = [
  { date: "June 14, 2025", day: "14", month: "JUN", title: "Annual Heartland Charity Gala", location: "Fairmont Palliser, Calgary, AB", type: "Black Tie Gala", desc: "Our flagship annual evening — an elegant dinner, live auction, and entertainment in support of the Fund. Chris Potter will be in attendance for a personal address and private reception with sponsors.", capacity: "250 guests", tickets: "From $350/person" },
  { date: "July 5, 2025", day: "05", month: "JUL", title: "Youth Open Riding Day", location: "High River Equestrian Centre, AB", type: "Community Event", desc: "A free open day for underprivileged youth across southern Alberta to experience horses and riding for the first time. Fully supervised sessions with certified instructors. No prior experience needed.", capacity: "50 youth spots", tickets: "Free — Registration required" },
  { date: "October 18, 2025", day: "18", month: "OCT", title: "Fall Fundraiser Auction", location: "The Fairmont Hotel Vancouver, BC", type: "Charity Auction", desc: "A curated evening of live and silent auction lots — signed memorabilia, exclusive experiences, fine art, and bespoke packages. All proceeds support the youth equestrian program expansion into British Columbia.", capacity: "180 guests", tickets: "From $200/person" },
  { date: "December 6, 2025", day: "06", month: "DEC", title: "Winter Ride for Recovery", location: "Whitemud Equine Centre, Edmonton, AB", type: "Charity Ride", desc: "Our annual winter charity ride through the river valley — participants raise pledges for the horse rescue program. Hot chocolate, live music, and an awards ceremony follow. Open to all riding abilities.", capacity: "Open registration", tickets: "Minimum $100 pledge" },
];

const TIERS = [
  { amount: "$25", label: "A Day of Feed", tier: "01", desc: "Provides one week of hay and feed for a horse in our rescue program, giving a rehabilitating animal the nutrition it needs to recover.", impact: "Feeds 1 horse for 7 days" },
  { amount: "$100", label: "A Lesson", tier: "02", desc: "Covers the full cost of one youth equestrian session — instructor time, horse, equipment, and insurance. One child's first experience with a horse.", impact: "Funds 1 youth session" },
  { amount: "$500", label: "A Week of Care", tier: "03", desc: "Covers comprehensive veterinary care for one rescued horse for an entire week, including examinations, medications, farrier, and specialist visits if needed.", impact: "Full vet care, 1 horse" },
  { amount: "$2,500+", label: "A Season", tier: "04", desc: "Sponsors an entire youth cohort through one 12-week equestrian term — 8 participants, all materials, transport, instruction, and a graduation ceremony.", impact: "Sponsors 8 youth, 12 weeks" },
];

const FAQ_ITEMS = [
  { q: "How does my donation get used?", a: "100% of public donations go directly to program delivery — horse feed, veterinary care, facility costs, instructor wages, and youth transport. Administrative costs are covered separately by the Fund's founding supporters, including Chris Potter personally." },
  { q: "Is the Heartland Legacy Fund a registered charity?", a: "The Fund operates as a community initiative under a registered non-profit umbrella. Tax receipts are available for donations of $50 CAD or more. Please contact support@chrispotterofficial.site for receipt requests." },
  { q: "Can I volunteer my time?", a: "Absolutely. We welcome volunteers for events, administrative support, social media, photography, and on-ground horse care assistance at partner ranches. Submit a support form below with 'Volunteer' selected and tell us your skills." },
  { q: "Does Chris Potter personally attend events?", a: "Chris makes every effort to attend the Annual Gala and Youth Open Day in person. He also participates remotely in quarterly donor briefings. His involvement is genuine and ongoing — this initiative was born from personal conviction, not publicity." },
  { q: "Can my company become a corporate sponsor?", a: "Yes — corporate partnerships are available at several tiers, including naming rights for youth cohorts, event title sponsorship, and logo placement across all Fund materials. Contact us via the support form to receive our corporate sponsorship deck." },
  { q: "What is the minimum donation?", a: "There is no minimum. Any amount is welcomed and appreciated. However, for the largest impact, recurring monthly donations of $25+ provide the most sustainable support for our horses and youth programs." },
  { q: "How are rescue horses selected?", a: "We work with regional animal welfare authorities and independent tiplines. Horses are assessed by our partner veterinarians and prioritized by urgency of need. Every rescued horse receives a full health assessment, rehabilitation plan, and — where possible — a placement with a loving home or working partner ranch." },
  { q: "Are donations accepted internationally?", a: "Yes. We accept international donations via Bitcoin, USDT TRC-20, Stripe, and PayPal, all of which handle currency conversion automatically. International donors should note that Canadian tax receipt rules apply only to Canadian residents." },
];

// ── Event Registration Modal ──────────────────────────────────────────────────
function EventRegistrationModal({ event, onClose }: { event: typeof EVENTS[0]; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", partySize: "1", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/contact/event-registration", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventName: event.title, eventDate: event.date }),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("done"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch { setStatus("error"); setMsg("Something went wrong. Please try again."); }
  };

  const inp = "w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/22 transition-colors";

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/82 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0C0F18] border border-white/10 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">

          {/* Header */}
          <div className="sticky top-0 bg-[#0C0F18]/98 backdrop-blur-sm border-b border-white/6 px-7 py-5 flex items-start justify-between z-10 rounded-t-2xl">
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-white/28 mb-1">Event Registration</p>
              <h3 className="text-xl font-black uppercase text-white leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{event.title}</h3>
              <p className="text-xs text-white/35 mt-1">{event.date} · {event.location}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 hover:border-white/28 flex items-center justify-center text-white/35 hover:text-white transition-all flex-shrink-0 ml-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="px-7 py-7">
            {status === "done" ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                </motion.div>
                <h4 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Registration Received</h4>
                <p className="text-sm text-white/45 max-w-sm mx-auto mb-8">{msg}</p>
                <button onClick={onClose} className="px-6 py-2.5 border border-white/15 rounded-lg text-xs tracking-widest uppercase text-white/40 hover:text-white hover:border-white/30 transition-all">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">First Name *</label>
                    <input required type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" className={inp} />
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Last Name *</label>
                    <input required type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith" className={inp} />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Email Address *</label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Phone (optional)</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" className={inp} />
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Party Size</label>
                    <select value={form.partySize} onChange={set("partySize")} className="w-full bg-[#0a0d14] border border-white/8 rounded-lg px-4 py-3 text-sm text-white/65 focus:outline-none focus:border-white/22 transition-colors">
                      {["1","2","3","4","5","6","7","8","9","10+"].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Message (optional)</label>
                  <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Dietary requirements, accessibility needs, or any other notes..." className={inp + " resize-none"} />
                </div>
                {status === "error" && <p className="text-red-400/65 text-sm">{msg}</p>}
                <button type="submit" disabled={status === "loading"}
                  className="w-full py-4 bg-white text-[#07090F] text-[10px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 transition-colors disabled:opacity-50">
                  {status === "loading" ? "Registering..." : "Register Interest"}
                </button>
                <p className="text-[10px] text-white/18 text-center">Confirmation sent to your email · Full event details follow closer to the date</p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Support Form ──────────────────────────────────────────────────────────────
function SupportForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", supportType: "Donate", amount: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/contact/charity", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("done"); setMsg(data.message); }
      else { setStatus("error"); setMsg(data.message); }
    } catch { setStatus("error"); setMsg("Something went wrong. Please try again or email us directly."); }
  };

  if (status === "done") return (
    <div className="text-center py-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
      </motion.div>
      <h3 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Message Received</h3>
      <p className="text-sm text-white/45 max-w-md mx-auto">{msg}</p>
      <button onClick={() => setStatus("idle")} className="mt-8 text-[9px] tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors">Send Another</button>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">First Name</label>
          <input required value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Chris" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/22 transition-colors" />
        </div>
        <div>
          <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Last Name</label>
          <input required value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Potter" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/22 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Email Address</label>
        <input required type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/22 transition-colors" />
      </div>
      <div>
        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">How Would You Like to Help?</label>
        <select value={form.supportType} onChange={e => update("supportType", e.target.value)} className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/22 transition-colors">
          <option>Donate</option>
          <option>Volunteer</option>
          <option>Corporate Sponsorship</option>
          <option>Media Partnership</option>
          <option>General Inquiry</option>
        </select>
      </div>
      {form.supportType === "Donate" && (
        <div>
          <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Donation Amount (Optional)</label>
          <input type="text" value={form.amount} onChange={e => update("amount", e.target.value)} placeholder="e.g. $100 CAD" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/22 transition-colors" />
        </div>
      )}
      <div>
        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Message</label>
        <textarea required value={form.message} onChange={e => update("message", e.target.value)} rows={4} placeholder="Tell us more about how you'd like to get involved..." className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/18 focus:outline-none focus:border-white/22 resize-none transition-colors" />
      </div>
      {status === "error" && <p className="text-red-400/70 text-sm">{msg}</p>}
      <button type="submit" disabled={status === "loading"} className="w-full py-4 bg-white text-[#07090F] text-[11px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 disabled:opacity-50 transition-colors">
        {status === "loading" ? "Sending…" : "Send to Support Team"}
      </button>
      <p className="text-[10px] text-white/18 text-center">Sent to support@chrispotterofficial.site — we respond within 48 hours.</p>
    </form>
  );
}

// ── Giving Methods ────────────────────────────────────────────────────────────
function GivingMethods() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <div className="space-y-3">
      <div className="border border-white/8 rounded-xl p-5 bg-white/[0.02] hover:border-white/14 transition-all">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/12 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400/80 font-black text-base leading-none">₿</span>
            </div>
            <div><p className="text-sm font-semibold text-white/80">Bitcoin</p><p className="text-[9px] tracking-wide text-white/28">BTC · Any amount</p></div>
          </div>
          <button onClick={() => copy(BTC_ADDRESS, "btc")} className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all ${copied === "btc" ? "border-green-500/30 text-green-400/70" : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/55"}`}>
            {copied === "btc" ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <div className="bg-white/[0.025] border border-white/6 rounded-lg px-3 py-2.5">
          <p className="font-mono text-[10px] text-white/35 break-all leading-relaxed select-all">{BTC_ADDRESS}</p>
        </div>
      </div>

      <div className="border border-white/8 rounded-xl p-5 bg-white/[0.02] hover:border-white/14 transition-all">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/18 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-400/75 font-black text-sm leading-none">₮</span>
            </div>
            <div><p className="text-sm font-semibold text-white/80">USDT Tether</p><p className="text-[9px] tracking-wide text-white/28">TRC-20 · TRON Network</p></div>
          </div>
          <button onClick={() => copy(USDT_TRC20, "usdt")} className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all ${copied === "usdt" ? "border-green-500/30 text-green-400/70" : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/55"}`}>
            {copied === "usdt" ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <div className="bg-white/[0.025] border border-white/6 rounded-lg px-3 py-2.5">
          <p className="font-mono text-[10px] text-white/35 break-all leading-relaxed select-all">{USDT_TRC20}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a href={STRIPE_URL} target="_blank" rel="noopener noreferrer" className="group border border-white/8 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-white/22 hover:bg-white/[0.03] transition-all text-center">
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/18 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/70" />
              <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/70" />
            </svg>
          </div>
          <div><p className="text-xs font-semibold text-white/75 mb-0.5">Donate by Card</p><p className="text-[9px] text-white/28">Visa · Mastercard · Amex</p></div>
          <span className="text-[8px] tracking-widest uppercase text-white/22 group-hover:text-white/50 transition-colors mt-auto">Donate via Stripe →</span>
        </a>
        <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer" className="group border border-white/8 rounded-xl p-5 flex flex-col items-center gap-3 hover:border-white/22 hover:bg-white/[0.03] transition-all text-center">
          <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/18 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400/70" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.79A.774.774 0 015.706 2h7.422c2.29 0 3.974.53 5.002 1.574.97.988 1.26 2.29.879 3.969l-.113.449C18.232 10.73 15.96 12 12.83 12H10.13c-.558 0-1.04.406-1.13.957l-.852 5.396-.134.84-.938 2.144z" />
            </svg>
          </div>
          <div><p className="text-xs font-semibold text-white/75 mb-0.5">PayPal</p><p className="text-[9px] text-white/28">Quick & secure</p></div>
          <span className="text-[8px] tracking-widest uppercase text-white/22 group-hover:text-white/50 transition-colors mt-auto">Donate via PayPal →</span>
        </a>
      </div>
      <p className="text-[10px] text-white/18 leading-relaxed pt-1">For tax receipts or major gift discussions, contact <span className="text-white/30">support@chrispotterofficial.site</span></p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Charity() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [registerEvent, setRegisterEvent] = useState<typeof EVENTS[0] | null>(null);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then((d: { success: boolean; counts: Record<string, number> }) => { if (d.success) setEventCounts(d.counts); })
      .catch(() => { /* non-fatal */ });
  }, [registerEvent]);

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-28 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <motion.img src="/photos/IMG_1003.JPG" alt="Heartland Legacy Fund"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: [0.16,1,0.3,1] }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/60 to-[#07090F]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/65 via-transparent to-transparent" />
        </div>
        <HeroSocialBar />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            className="text-[10px] tracking-[0.28em] uppercase text-white/35 mb-5">
            Chris Potter · Community Initiative · Est. 2014
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
            className="text-[clamp(3.5rem,10vw,9rem)] font-black uppercase leading-[0.88] text-white mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            The Heartland<br />Legacy Fund
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
            className="text-base md:text-lg text-white/50 font-light max-w-xl mb-8">
            Rescuing horses. Empowering youth. Building a legacy that lasts far beyond the screen.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="flex items-center gap-4">
            <a href="#support" className="bg-white text-[#07090F] text-[11px] tracking-[0.2em] uppercase font-bold px-7 py-3.5 rounded-lg hover:bg-white/88 transition-colors">Support the Fund</a>
            <a href="#mission" className="text-[10px] tracking-[0.18em] uppercase text-white/45 hover:text-white/70 border border-white/12 hover:border-white/28 px-5 py-3.5 rounded-lg transition-all">Our Mission ↓</a>
          </motion.div>
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <div className="border-y border-white/5 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 md:divide-x md:divide-white/6">
            {[
              { n: "400+", l: "Horses Rescued" }, { n: "1,200+", l: "Youth Enrolled" },
              { n: "12", l: "Programs Funded" }, { n: "10", l: "Years Active" }, { n: "3", l: "Provinces" },
            ].map((s, i) => (
              <div key={i} className="md:px-8 first:pl-0 last:pr-0 text-center md:text-left">
                <p className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.n}</p>
                <p className="text-[9px] tracking-[0.18em] uppercase text-white/28 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHRIS'S PERSONAL STATEMENT ── */}
      <section id="mission" className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-center">
            <div className="md:col-span-5">
              <Reveal>
                <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                  <img src="/photos/IMG_0986.JPG" alt="Chris Potter" className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/60 to-transparent" />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-5">A Word from Chris</p>
                <div className="relative mb-8">
                  <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent" />
                  <blockquote className="pl-6 text-xl md:text-2xl font-light text-white/75 leading-[1.6] italic">
                    "Heartland taught me something I already knew in my bones — that the relationship between a person and a horse is unlike anything else in this world. It strips away everything that isn't real. These animals, and the young people who discover them, deserve every chance we can give them."
                  </blockquote>
                  <p className="pl-6 mt-5 text-[10px] tracking-[0.2em] uppercase text-white/30">— Chris Potter, Founder, Heartland Legacy Fund</p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-base text-white/50 font-light leading-relaxed mb-5">
                  The Heartland Legacy Fund was established in 2014, growing out of Chris Potter's first-hand encounters with neglected horses during Heartland filming in High River, Alberta. What began as a personal effort to rehome three horses has become a structured, multi-province initiative operating year-round.
                </p>
                <p className="text-sm text-white/38 font-light leading-relaxed">
                  The Fund operates two core streams: emergency horse rescue and rehabilitation in partnership with regional animal welfare bodies, and the Youth Equestrian Access Program — a fully funded 12-week riding curriculum delivered free of charge to youth from low-income households in Alberta, British Columbia, and Saskatchewan.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── THE CAUSE ── */}
      <section className="py-20 md:py-28 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal><p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">What We Do</p>
            <h2 className="text-[clamp(2.8rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Two Streams.<br />One Mission.</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal delay={0}>
              <div className="border border-white/8 rounded-2xl overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src="/photos/IMG_0992.JPG" alt="Horse Rescue" className="w-full h-full object-cover object-center hover:scale-[1.03] transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <span className="text-[8px] tracking-[0.2em] uppercase text-amber-400/60 border border-amber-500/25 px-2 py-0.5 rounded-full mb-4 inline-block">Stream One</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Horse Rescue &<br />Rehabilitation</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed mb-5">
                    Working with Alberta's SPCA, the BC SPCA, and independent animal welfare officers, the Fund responds to reports of neglected, abused, or abandoned horses across Western Canada.
                  </p>
                  <p className="text-sm text-white/38 font-light leading-relaxed mb-6">
                    Each horse receives a full veterinary assessment upon rescue, an individualized rehabilitation plan — covering nutrition, farriery, dental care, and mental recovery — and wherever possible, placement with a vetted partner ranch or private home. We have successfully rehabilitated and rehomed over 400 horses since 2014.
                  </p>
                  <div className="space-y-2">
                    {["Emergency field response 24/7", "Full veterinary and farrier partnership", "Rehabilitation programs up to 18 months", "Long-term placement and follow-up monitoring"].map((i, idx) => (
                      <div key={idx} className="flex items-start gap-2.5"><div className="w-1 h-1 rounded-full bg-amber-400/50 mt-1.5 flex-shrink-0" /><p className="text-xs text-white/40">{i}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="border border-white/8 rounded-2xl overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src="/photos/IMG_0988.JPG" alt="Youth Equestrian" className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <span className="text-[8px] tracking-[0.2em] uppercase text-blue-400/60 border border-blue-500/25 px-2 py-0.5 rounded-full mb-4 inline-block">Stream Two</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Youth Equestrian<br />Access Program</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed mb-5">
                    The Youth Equestrian Access Program removes every financial barrier between a child and their first experience with a horse. Tuition, transport, equipment, helmets, boots — all provided at zero cost.
                  </p>
                  <p className="text-sm text-white/38 font-light leading-relaxed mb-6">
                    Each cohort runs for 12 weeks with 8 participants, guided by certified equestrian instructors. Beyond riding technique, the program teaches responsibility, emotional regulation, and the patience that comes from working alongside a living animal. Participants graduate with a certificate and ongoing access to partner ranch facilities.
                  </p>
                  <div className="space-y-2">
                    {["Fully funded — zero cost to families", "Certified professional instructors", "12-week structured curriculum", "Ongoing ranch access post-graduation"].map((i, idx) => (
                      <div key={idx} className="flex items-start gap-2.5"><div className="w-1 h-1 rounded-full bg-blue-400/50 mt-1.5 flex-shrink-0" /><p className="text-xs text-white/40">{i}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── UPCOMING EVENTS ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">2025 Schedule</p>
            <h2 className="text-[clamp(2.8rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Upcoming<br />Events</h2>
          </Reveal>
          <div className="space-y-5">
            {EVENTS.map((ev, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group border border-white/6 rounded-2xl p-7 md:p-9 hover:border-white/15 hover:bg-white/[0.015] transition-all">
                  <div className="flex flex-col md:flex-row gap-7 md:gap-10">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center">
                        <p className="text-[9px] tracking-widest uppercase text-white/30">{ev.month}</p>
                        <p className="text-2xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{ev.day}</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <span className="text-[8px] tracking-[0.18em] uppercase text-amber-400/55 border border-amber-500/20 px-2 py-0.5 rounded-full">{ev.type}</span>
                        <span className="text-[9px] text-white/25">{ev.location}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black uppercase text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{ev.title}</h3>
                      <p className="text-sm text-white/45 font-light leading-relaxed mb-5">{ev.desc}</p>
                      <div className="flex flex-wrap gap-6">
                        <div><p className="text-[9px] tracking-widest uppercase text-white/22 mb-1">Capacity</p><p className="text-xs text-white/55">{ev.capacity}</p></div>
                        <div><p className="text-[9px] tracking-widest uppercase text-white/22 mb-1">Tickets / Entry</p><p className="text-xs text-white/55">{ev.tickets}</p></div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center flex flex-col items-center gap-3">
                      {(eventCounts[ev.title] ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400/80" />
                          </span>
                          <span className="text-[9px] tracking-widest uppercase text-green-400/65">{eventCounts[ev.title]} registered</span>
                        </div>
                      )}
                      <button onClick={() => setRegisterEvent(ev)} className="text-[9px] tracking-widest uppercase text-white/40 hover:text-white border border-white/12 hover:border-white/30 hover:bg-white/[0.04] px-5 py-2.5 rounded-lg transition-all whitespace-nowrap">Register Interest</button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── HOW YOUR GIFT HELPS ── */}
      <section className="py-20 md:py-28 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">Impact by Amount</p>
            <h2 className="text-[clamp(2.8rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-white mb-14" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>How Your<br />Gift Helps</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((t, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="border border-white/6 rounded-xl p-7 hover:border-white/15 hover:bg-white/[0.015] transition-all h-full flex flex-col">
                  <p className="text-[9px] tracking-[0.22em] uppercase text-white/20 mb-4">{t.tier}</p>
                  <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{t.amount}</p>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-white/35 mb-4">{t.label}</p>
                  <p className="text-sm text-white/45 font-light leading-relaxed mb-5 flex-1">{t.desc}</p>
                  <div className="border-t border-white/6 pt-4">
                    <p className="text-[9px] tracking-widest uppercase text-green-400/55">{t.impact}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── SUPPORT FORM + GIVING METHODS ── */}
      <section id="support" className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">Get Involved</p>
            <h2 className="text-[clamp(2.8rem,5.5vw,5rem)] font-black uppercase leading-[0.9] text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Ready<br />to Help?</h2>
            <p className="text-base text-white/45 font-light max-w-xl mb-14">
              Fill in the form below and our support team will get back to you within 48 hours to discuss how you can make the greatest impact. For direct giving, use the payment methods on the right.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <Reveal delay={0}>
              <div className="border border-white/8 rounded-2xl p-7 md:p-9 bg-white/[0.01]">
                <p className="text-[9px] tracking-widest uppercase text-white/25 mb-6">Support Form → support@chrispotterofficial.site</p>
                <SupportForm />
              </div>
            </Reveal>
            <div>
              <Reveal delay={80}>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-5">Direct Giving Methods</p>
                <GivingMethods />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="section-line mx-6 md:mx-12" />

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-[#05070D]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/28 mb-4">Questions</p>
                <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-[0.9] text-white mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Frequently<br />Asked</h2>
                <p className="text-sm text-white/40 font-light leading-relaxed">
                  Anything else? Write to us at <span className="text-white/55">support@chrispotterofficial.site</span>
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-0">
                {FAQ_ITEMS.map((item, i) => (
                  <Reveal key={i} delay={i * 40}>
                    <div className="border-b border-white/6">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left gap-4">
                        <p className="text-sm md:text-base font-medium text-white/75 group-hover:text-white transition-colors">{item.q}</p>
                        <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-white/30 text-xl flex-shrink-0 leading-none">+</motion.span>
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <p className="text-sm text-white/45 font-light leading-relaxed pb-5">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA BANNER ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-10 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5" />
              <div className="relative">
                <p className="text-[10px] tracking-[0.28em] uppercase text-white/28 mb-4">Join the Movement</p>
                <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.9] text-white mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  Every Gift Matters.<br />Every Horse Counts.
                </h2>
                <p className="text-base text-white/40 font-light mb-8 max-w-lg mx-auto">
                  The Heartland Legacy Fund depends entirely on the generosity of people like you. Together, we can build something that lasts long after the cameras stop rolling.
                </p>
                <a href="#support" className="inline-block bg-white text-[#07090F] text-[11px] tracking-[0.22em] uppercase font-bold px-8 py-4 rounded-lg hover:bg-white/88 transition-colors">
                  Support the Fund Now
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      {registerEvent && <EventRegistrationModal event={registerEvent} onClose={() => setRegisterEvent(null)} />}
    </div>
  );
}
