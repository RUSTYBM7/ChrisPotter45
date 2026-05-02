import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  company: string; jobTitle: string; address: string; city: string; country: string;
  reason: string; projectDetails: string; timeline: string; howHeard: string;
  preferredContact: string; message: string; agreeTerms: boolean;
}

const emptyForm: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  company: "", jobTitle: "", address: "", city: "", country: "",
  reason: "", projectDetails: "", timeline: "", howHeard: "",
  preferredContact: "", message: "", agreeTerms: false,
};

export default function Contact() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({
        ...f,
        [k]: (e.target as HTMLInputElement).type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
      }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreeTerms) { setMsg("Please agree to the terms to proceed."); setStatus("error"); return; }
    setStatus("loading"); setMsg("");
    try {
      const r = await fetch("/api/contact/management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json() as { success: boolean; message: string };
      if (data.success) { setStatus("success"); setMsg(data.message); setForm(emptyForm); }
      else { setStatus("error"); setMsg(data.message); }
    } catch {
      setStatus("error"); setMsg("Something went wrong. Please try again.");
    }
  };

  const inp = "w-full bg-white/[0.025] border border-white/8 rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors";
  const lbl = "block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2";
  const sel = "w-full bg-[#0C0F18] border border-white/8 rounded-lg px-4 py-3.5 text-sm text-white/60 focus:outline-none focus:border-white/25 transition-colors appearance-none";

  return (
    <div className="min-h-screen bg-[#07090F] text-white overflow-x-hidden">
      <NavBar alwaysDark />
      <SocialSidebar />

      {/* HERO */}
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

      {/* FORM SECTION */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-16 md:gap-24">

            {/* Left: info */}
            <div className="md:col-span-4">
              <Reveal>
                <p className="text-[10px] tracking-[0.24em] uppercase text-white/30 mb-5">Management Inquiry</p>
                <h2
                  className="text-[clamp(3rem,6vw,5rem)] font-black uppercase leading-[0.88] text-white mb-8"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Get in<br />Touch
                </h2>
                <p className="text-base text-white/45 font-light leading-relaxed mb-10">
                  All inquiries are reviewed by Chris Potter's management team. Please provide as much detail as possible to help us respond efficiently.
                </p>

                <div className="space-y-6 mb-14">
                  {[
                    { title: "Casting — Film & Television", desc: "Feature films, limited series, TV movies, guest roles" },
                    { title: "Directing & Producing", desc: "Direct an episode, co-produce, creative consultation" },
                    { title: "Speaking & Appearances", desc: "Events, panels, charity functions, public appearances" },
                    { title: "Press & Media", desc: "Interviews, editorial features, podcast appearances" },
                    { title: "Business & Legal", desc: "Licensing, partnerships, rights and representation" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0 mt-2" />
                      <div>
                        <p className="text-xs font-medium text-white/70">{item.title}</p>
                        <p className="text-[11px] text-white/30 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg overflow-hidden aspect-[4/3]">
                  <img src="/photos/IMG_0984.JPG" alt="Chris Potter" className="w-full h-full object-cover" />
                </div>
              </Reveal>
            </div>

            {/* Right: form */}
            <div className="md:col-span-8">
              <Reveal delay={150}>
                {status === "success" ? (
                  <div className="border border-white/15 rounded-2xl p-12 text-center bg-white/[0.02]">
                    <h3
                      className="text-5xl font-black uppercase mb-4 text-white"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      Received.
                    </h3>
                    <p className="text-base text-white/50">{msg}</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-6">

                    {/* Personal */}
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>First Name *</label><input required type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" className={inp} /></div>
                      <div><label className={lbl}>Last Name *</label><input required type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith" className={inp} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Email Address *</label><input required type="email" value={form.email} onChange={set("email")} placeholder="jane@studio.com" className={inp} /></div>
                      <div><label className={lbl}>Phone Number</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" className={inp} /></div>
                    </div>

                    {/* Professional */}
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Company / Organization</label><input type="text" value={form.company} onChange={set("company")} placeholder="Production company" className={inp} /></div>
                      <div><label className={lbl}>Your Title / Role</label><input type="text" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Casting Director" className={inp} /></div>
                    </div>

                    {/* Address */}
                    <div><label className={lbl}>Street Address</label><input type="text" value={form.address} onChange={set("address")} placeholder="123 Studio Lot, Suite 100" className={inp} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>City</label><input type="text" value={form.city} onChange={set("city")} placeholder="Los Angeles" className={inp} /></div>
                      <div><label className={lbl}>Country</label><input type="text" value={form.country} onChange={set("country")} placeholder="United States" className={inp} /></div>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className={lbl}>Reason for Contact *</label>
                      <select required value={form.reason} onChange={set("reason")} className={sel}>
                        <option value="">Select inquiry type</option>
                        <option value="Casting — Feature Film">Casting — Feature Film</option>
                        <option value="Casting — Television Series">Casting — Television Series</option>
                        <option value="Casting — TV Movie">Casting — TV Movie</option>
                        <option value="Directing Opportunity">Directing Opportunity</option>
                        <option value="Producing / Co-Production">Producing / Co-Production</option>
                        <option value="Speaking Engagement">Speaking Engagement</option>
                        <option value="Public Appearance">Public Appearance</option>
                        <option value="Press / Media Interview">Press / Media Interview</option>
                        <option value="Podcast / Editorial Feature">Podcast / Editorial Feature</option>
                        <option value="Business / Licensing">Business / Licensing</option>
                        <option value="Legal / Rights">Legal / Rights</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Project details */}
                    <div>
                      <label className={lbl}>Project Details</label>
                      <textarea rows={4} value={form.projectDetails} onChange={set("projectDetails")} placeholder="Describe your project, role, script, or opportunity..." className={inp + " resize-none"} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Timeline / Urgency</label>
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
                        <label className={lbl}>Preferred Contact Method</label>
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
                      <label className={lbl}>How Did You Hear About Chris Potter?</label>
                      <select value={form.howHeard} onChange={set("howHeard")} className={sel}>
                        <option value="">Select one</option>
                        <option>Heartland (CBC/Netflix)</option>
                        <option>IMDb</option>
                        <option>Social Media</option>
                        <option>Industry Referral</option>
                        <option>Film Festival</option>
                        <option>Personal Acquaintance</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={lbl}>Additional Message</label>
                      <textarea rows={5} value={form.message} onChange={set("message")} placeholder="Any additional context, requirements, or questions..." className={inp + " resize-none"} />
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={set("agreeTerms")}
                        className="mt-0.5 w-4 h-4 flex-shrink-0 accent-white"
                      />
                      <span className="text-xs text-white/35 leading-relaxed group-hover:text-white/50 transition-colors">
                        I confirm this is a professional inquiry and agree that my information will be used solely to process and respond to this request by Chris Potter's management team.
                      </span>
                    </label>

                    {status === "error" && (
                      <p className="text-red-400/70 text-sm">{msg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-4 bg-white text-[#07090F] text-[10px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/88 active:bg-white/75 transition-colors disabled:opacity-50"
                    >
                      {status === "loading" ? "Submitting..." : "Submit Inquiry"}
                    </button>

                    <p className="text-[10px] text-white/18 text-center">
                      All submissions are reviewed by management within 3–5 business days.
                    </p>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
