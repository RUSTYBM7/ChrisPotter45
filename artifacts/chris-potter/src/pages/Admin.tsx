import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────
type AdminTab = "overview" | "subscribers" | "badge" | "inquiries" | "compose" | "vip" | "events" | "reports" | "settings";
interface Subscriber { email: string; name?: string; phone?: string; subscribedAt: string; tags?: string[]; preferences?: Record<string, unknown>; notes?: string; }
interface Contact { id: string; type: "management" | "fanbase" | "event"; status: "pending" | "read" | "responded" | "archived"; firstName: string; lastName: string; email: string; receivedAt: string; data: Record<string, string>; notes?: string; badgeTier?: string; }
interface VIPRequest { id: string; email: string; name: string; sessionType: string; message: string; availability?: string; requestedAt: string; status: "pending" | "approved" | "scheduled" | "completed" | "declined"; scheduledDate?: string; notes?: string; }
interface Stats { subscribers: number; newThisWeek: number; totalContacts: number; pendingContacts: number; vipRequests: number; pendingVip: number; managementInquiries: number; badgeApplications: number; }

// ── API ──────────────────────────────────────────────────────────────────────
const api = {
  async call(token: string, method: string, path: string, body?: unknown) {
    const r = await fetch(`/api/admin/${path}`, { method, headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return r.json();
  },
  stats: (t: string) => api.call(t, "GET", "stats"),
  subscribers: (t: string) => api.call(t, "GET", "subscribers"),
  updateSub: (t: string, body: unknown) => api.call(t, "PATCH", "subscribers", body),
  deleteSub: (t: string, email: string) => api.call(t, "DELETE", "subscribers", { email }),
  contacts: (t: string) => api.call(t, "GET", "contacts"),
  updateContact: (t: string, body: unknown) => api.call(t, "PATCH", "contacts", body),
  vip: (t: string) => api.call(t, "GET", "vip"),
  updateVip: (t: string, body: unknown) => api.call(t, "PATCH", "vip", body),
  compose: (t: string, body: unknown) => api.call(t, "POST", "compose", body),
};

// ── Utility components ───────────────────────────────────────────────────────
function Tag({ label, color = "default", onRemove }: { label: string; color?: string; onRemove?: () => void }) {
  const colors: Record<string, string> = { default: "bg-white/8 text-white/50 border-white/12", green: "bg-green-500/15 text-green-400 border-green-500/25", amber: "bg-amber-500/15 text-amber-400 border-amber-500/25", red: "bg-red-500/15 text-red-400 border-red-500/25", blue: "bg-blue-500/15 text-blue-400 border-blue-500/25" };
  return <span className={`inline-flex items-center gap-1 text-[9px] tracking-widest uppercase border rounded-full px-2 py-0.5 ${colors[color] ?? colors.default}`}>{label}{onRemove && <button onClick={onRemove} className="ml-0.5 opacity-50 hover:opacity-100">×</button>}</span>;
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = { pending: { label: "Pending", color: "amber" }, read: { label: "Read", color: "blue" }, responded: { label: "Responded", color: "green" }, archived: { label: "Archived", color: "default" }, approved: { label: "Approved", color: "green" }, scheduled: { label: "Scheduled", color: "blue" }, completed: { label: "Completed", color: "default" }, declined: { label: "Declined", color: "red" } };
  const { label, color } = map[status] ?? { label: status, color: "default" };
  return <Tag label={label} color={color} />;
}
function Spinner() { return <div className="w-5 h-5 border-2 border-white/15 border-t-white/60 rounded-full animate-spin" />; }
function Empty({ message }: { message: string }) { return <div className="flex flex-col items-center justify-center py-20 text-white/20"><p className="text-xs tracking-widest uppercase">{message}</p></div>; }

// ── Email Templates ──────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "announcement", label: "Season Announcement", subject: "Heartland Season 18 — New Release Date Announced", body: `<div style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official</p><h1 style="font-size:42px;font-weight:900;text-transform:uppercase;margin:0 0 24px;">Big News.</h1><p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">We have an exciting announcement to share with you. [Add your message here]</p><a href="https://chrispotterofficial.site/fan-portal" style="display:inline-block;background:#fff;color:#07090F;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">Read More</a><p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">&copy; ${new Date().getFullYear()} Chris Potter Official</p></div>` },
  { id: "vip_invite", label: "VIP Invitation", subject: "You've Been Invited — Exclusive Chris Potter VIP Experience", body: `<div style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official — VIP Access</p><h1 style="font-size:42px;font-weight:900;text-transform:uppercase;margin:0 0 24px;">You're Invited.</h1><p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">We're delighted to extend a personal invitation for an exclusive VIP experience with Chris Potter. [Add details]</p><a href="https://chrispotterofficial.site/fan-portal" style="display:inline-block;background:#fff;color:#07090F;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">Accept Invitation</a><p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">&copy; ${new Date().getFullYear()} Chris Potter Official</p></div>` },
  { id: "newsletter", label: "Newsletter Update", subject: "The Chris Potter Newsletter — May 2025", body: `<div style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official · Newsletter</p><h1 style="font-size:42px;font-weight:900;text-transform:uppercase;margin:0 0 24px;">This Month.</h1><p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">[Your newsletter content here]</p><p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">&copy; ${new Date().getFullYear()} Chris Potter Official &middot; <a href="#" style="color:rgba(255,255,255,0.3);">Unsubscribe</a></p></div>` },
  { id: "badge_approved", label: "Badge Approved", subject: "Your Badge Application Has Been Approved — Chris Potter Official", body: `<div style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official — Fanbase</p><h1 style="font-size:42px;font-weight:900;text-transform:uppercase;margin:0 0 24px;">Congratulations!</h1><p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">Your Fanbase Badge application has been reviewed and approved. Welcome to the exclusive Chris Potter community. [Add badge tier and benefits details]</p><a href="https://chrispotterofficial.site/fan-portal" style="display:inline-block;background:#fff;color:#07090F;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">Access Fan Portal</a><p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">&copy; ${new Date().getFullYear()} Chris Potter Official</p></div>` },
  { id: "session_confirmed", label: "VIP Session Confirmed", subject: "Your VIP Session Is Confirmed — Chris Potter Official", body: `<div style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official — VIP Session</p><h1 style="font-size:42px;font-weight:900;text-transform:uppercase;margin:0 0 24px;">It's Official.</h1><p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">Your private session with Chris Potter has been confirmed for [DATE]. We're looking forward to spending this time with you. [Add session details, Zoom link, location, etc.]</p><p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">&copy; ${new Date().getFullYear()} Chris Potter Official</p></div>` },
];

// ── Tabs ─────────────────────────────────────────────────────────────────────
function Overview({ token, stats }: { token: string; stats: Stats | null }) {
  const [recent, setRecent] = useState<{ contacts: Contact[]; subs: Subscriber[]; vip: VIPRequest[] }>({ contacts: [], subs: [], vip: [] });
  useEffect(() => {
    Promise.all([api.contacts(token), api.subscribers(token), api.vip(token)]).then(([c, s, v]) => {
      setRecent({ contacts: (c.data ?? []).slice(0, 5), subs: (s.data ?? []).slice(0, 5), vip: (v.data ?? []).slice(0, 5) });
    });
  }, [token]);

  const cards = [
    { label: "Total Subscribers", value: stats?.subscribers ?? "—", sub: `+${stats?.newThisWeek ?? 0} this week`, color: "from-white/5 to-white/[0.02]" },
    { label: "Badge Applications", value: stats?.badgeApplications ?? "—", sub: `${stats?.pendingContacts ?? 0} pending`, color: "from-amber-500/10 to-amber-500/[0.02]" },
    { label: "Management Inquiries", value: stats?.managementInquiries ?? "—", sub: `${stats?.pendingContacts ?? 0} pending`, color: "from-blue-500/10 to-blue-500/[0.02]" },
    { label: "VIP Requests", value: stats?.vipRequests ?? "—", sub: `${stats?.pendingVip ?? 0} awaiting review`, color: "from-purple-500/10 to-purple-500/[0.02]" },
  ];

  return (
    <div className="p-8 max-w-[1200px]">
      <h2 className="text-2xl font-black uppercase mb-8 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c, i) => (
          <div key={i} className={`border border-white/8 rounded-xl p-5 bg-gradient-to-br ${c.color}`}>
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-2">{c.label}</p>
            <p className="text-3xl font-black text-white">{c.value}</p>
            <p className="text-[10px] text-white/25 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/6 rounded-xl p-5">
          <p className="text-[9px] tracking-widest uppercase text-white/25 mb-4">Recent Subscribers</p>
          {recent.subs.length ? recent.subs.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
              <div><p className="text-xs text-white/70">{s.name || "Anonymous"}</p><p className="text-[10px] text-white/30">{s.email}</p></div>
              <p className="text-[9px] text-white/20">{new Date(s.subscribedAt).toLocaleDateString()}</p>
            </div>
          )) : <Empty message="No subscribers yet" />}
        </div>
        <div className="border border-white/6 rounded-xl p-5">
          <p className="text-[9px] tracking-widest uppercase text-white/25 mb-4">Recent Contacts</p>
          {recent.contacts.length ? recent.contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
              <div><p className="text-xs text-white/70">{c.firstName} {c.lastName}</p><p className="text-[10px] text-white/30">{c.type} · {c.data.reason || c.data.badgeTier || "—"}</p></div>
              <StatusBadge status={c.status} />
            </div>
          )) : <Empty message="No contacts yet" />}
        </div>
        <div className="border border-white/6 rounded-xl p-5">
          <p className="text-[9px] tracking-widest uppercase text-white/25 mb-4">VIP Requests</p>
          {recent.vip.length ? recent.vip.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
              <div><p className="text-xs text-white/70">{v.name || v.email}</p><p className="text-[10px] text-white/30">{v.sessionType}</p></div>
              <StatusBadge status={v.status} />
            </div>
          )) : <Empty message="No VIP requests yet" />}
        </div>
      </div>
    </div>
  );
}

function Subscribers({ token }: { token: string }) {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Subscriber | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => { setLoading(true); api.subscribers(token).then(r => { setData(r.data ?? []); setLoading(false); }); }, [token]);
  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(s => JSON.stringify(s).toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    await api.updateSub(token, selected);
    setSaving(false);
    load();
  };

  const del = async (email: string) => {
    if (!confirm(`Remove ${email}?`)) return;
    await api.deleteSub(token, email);
    setSelected(null);
    load();
  };

  const exportCSV = () => {
    const rows = [["Email","Name","Phone","Subscribed","Tags"].join(","), ...data.map(s => [s.email,s.name??"",s.phone??"",s.subscribedAt,(s.tags??[]).join("|")].join(","))];
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" })); a.download = "subscribers.csv"; a.click();
  };

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Subscribers <span className="text-white/30 text-lg">({data.length})</span></h2>
        <button onClick={exportCSV} className="text-[9px] tracking-widest uppercase border border-white/12 text-white/40 hover:text-white/70 hover:border-white/25 px-4 py-2 rounded transition-all">Export CSV</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, tag..." className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 mb-5" />
      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : !filtered.length ? <Empty message="No subscribers found" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/6">{["Email","Name","Phone","Subscribed","Tags","Actions"].map(h => <th key={h} className="text-left py-3 px-4 text-[9px] tracking-widest uppercase text-white/25 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors cursor-pointer" onClick={() => setSelected(s)}>
                  <td className="py-3 px-4 text-white/70">{s.email}</td>
                  <td className="py-3 px-4 text-white/50">{s.name || "—"}</td>
                  <td className="py-3 px-4 text-white/35">{s.phone || "—"}</td>
                  <td className="py-3 px-4 text-white/30 text-xs">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4"><div className="flex flex-wrap gap-1">{(s.tags ?? []).map((t, ti) => <Tag key={ti} label={t} />)}</div></td>
                  <td className="py-3 px-4"><button onClick={e => { e.stopPropagation(); del(s.email); }} className="text-[9px] tracking-widest uppercase text-red-400/40 hover:text-red-400/70 transition-colors">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div className="relative bg-[#0a0d14] border border-white/10 rounded-2xl p-7 w-full max-w-md mx-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white">{selected.email}</h3>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/60">✕</button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Display Name</label>
                  <input value={selected.name ?? ""} onChange={e => setSelected({ ...selected, name: e.target.value })} className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20" /></div>
                <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Phone</label>
                  <input value={selected.phone ?? ""} onChange={e => setSelected({ ...selected, phone: e.target.value })} className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20" /></div>
                <div>
                  <label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">{(selected.tags ?? []).map((t, ti) => <Tag key={ti} label={t} onRemove={() => setSelected({ ...selected, tags: (selected.tags ?? []).filter((_, j) => j !== ti) })} />)}</div>
                  <div className="flex gap-2"><input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setSelected({ ...selected, tags: [...(selected.tags ?? []), tagInput.trim()] }); setTagInput(""); } }} placeholder="Add tag (press Enter)" className="flex-1 bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/20" /></div>
                </div>
                <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Notes</label>
                  <textarea value={selected.notes ?? ""} onChange={e => setSelected({ ...selected, notes: e.target.value })} rows={2} className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 resize-none" /></div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => del(selected.email)} className="text-xs text-red-400/50 hover:text-red-400/80 transition-colors">Delete subscriber</button>
                  <button onClick={save} disabled={saving} className="bg-white text-[#07090F] text-[10px] tracking-widest uppercase font-bold px-5 py-2 rounded-lg hover:bg-white/85 disabled:opacity-50 transition-colors">{saving ? "Saving…" : "Save"}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Contacts({ token, type }: { token: string; type: "management" | "fanbase" }) {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(() => { setLoading(true); api.contacts(token).then(r => { setData((r.data ?? []).filter((c: Contact) => c.type === type)); setLoading(false); }); }, [token, type]);
  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(c => filter === "all" || c.status === filter);
  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    await api.updateContact(token, { id, status, notes: notes[id] ?? "" });
    setSaving(null); load();
  };

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{type === "management" ? "Management Inquiries" : "Badge Applications"} <span className="text-white/30 text-lg">({data.length})</span></h2>
        <div className="flex gap-2">
          {["all","pending","read","responded","archived"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all ${filter === f ? "border-white/25 text-white/70 bg-white/5" : "border-white/8 text-white/25 hover:text-white/45"}`}>{f}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : !filtered.length ? <Empty message="No contacts found" /> : (
        <div className="space-y-0">
          {filtered.map(c => (
            <div key={c.id} className="border-b border-white/5">
              <div className="flex items-center gap-4 py-4 cursor-pointer hover:bg-white/[0.015] px-3 -mx-3 rounded transition-colors" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <p className="text-sm font-medium text-white/80">{c.firstName} {c.lastName}</p>
                    {type === "fanbase" && c.data.badgeTier && <Tag label={c.data.badgeTier} color="amber" />}
                    {type === "management" && c.data.reason && <Tag label={c.data.reason} />}
                  </div>
                  <p className="text-xs text-white/35">{c.email} · {new Date(c.receivedAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={c.status} />
                <span className="text-white/20 text-xs">{expanded === c.id ? "▲" : "▼"}</span>
              </div>
              <AnimatePresence>
                {expanded === c.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pb-5 px-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 border border-white/5 rounded-xl p-5 bg-white/[0.02]">
                        {Object.entries(c.data).filter(([k]) => !["firstName","lastName"].includes(k)).map(([k, v]) => v && v !== "—" && (
                          <div key={k} className="flex gap-3">
                            <span className="text-[9px] tracking-widest uppercase text-white/25 w-24 flex-shrink-0 pt-0.5">{k.replace(/([A-Z])/g, " $1")}</span>
                            <span className="text-xs text-white/60 break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <div><label className="block text-[9px] tracking-widest uppercase text-white/25 mb-1.5">Notes</label>
                          <textarea value={notes[c.id] ?? c.notes ?? ""} onChange={e => setNotes({ ...notes, [c.id]: e.target.value })} rows={3} className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/18 resize-none" /></div>
                        <div><label className="block text-[9px] tracking-widest uppercase text-white/25 mb-2">Update Status</label>
                          <div className="flex flex-wrap gap-2">
                            {["pending","read","responded","archived"].map(s => (
                              <button key={s} onClick={() => updateStatus(c.id, s)} disabled={saving === c.id || c.status === s} className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all disabled:opacity-40 ${c.status === s ? "border-white/25 text-white/60 bg-white/5" : "border-white/8 text-white/25 hover:text-white/50 hover:border-white/18"}`}>{s}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Compose({ token }: { token: string }) {
  const [to, setTo] = useState("all");
  const [customEmail, setCustomEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [template, setTemplate] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const applyTemplate = (id: string) => {
    const t = TEMPLATES.find(t => t.id === id);
    if (t) { setSubject(t.subject); setBody(t.body); }
  };

  const send = async () => {
    if (!subject || !body) return;
    setStatus("sending");
    const recipient = to === "custom" ? customEmail : to;
    const r = await api.compose(token, { to: recipient, subject, html: body });
    setStatus(r.success ? "done" : "error");
    setMsg(r.message ?? "");
  };

  return (
    <div className="p-8 max-w-[1000px]">
      <h2 className="text-2xl font-black uppercase text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Compose Email</h2>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Recipient Group</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/22">
              <option value="all">All Newsletter Subscribers</option>
              <option value="badge">All Badge Applicants</option>
              <option value="management">Management Inquiries</option>
              <option value="vip">VIP Request Members</option>
              <option value="custom">Custom Email Address</option>
            </select>
          </div>
          {to === "custom" && <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Email Address</label><input value={customEmail} onChange={e => setCustomEmail(e.target.value)} type="email" placeholder="recipient@email.com" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20" /></div>}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Load Template</label>
            <select value={template} onChange={e => { setTemplate(e.target.value); applyTemplate(e.target.value); }} className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/22">
              <option value="">— Select a template —</option>
              {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line..." className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20" /></div>
          <div><label className="block text-[9px] tracking-widest uppercase text-white/30 mb-1.5">HTML Body</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} placeholder="<div>Your HTML email content here...</div>" className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-xs text-white/70 font-mono focus:outline-none focus:border-white/20 resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setPreview(!preview)} className="flex-1 py-3 border border-white/12 text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 rounded-lg transition-all">{preview ? "Edit" : "Preview"}</button>
            <button onClick={send} disabled={status === "sending" || !subject || !body} className="flex-1 py-3 bg-white text-[#07090F] text-[10px] tracking-widest uppercase font-bold rounded-lg hover:bg-white/85 disabled:opacity-40 transition-colors">{status === "sending" ? "Sending…" : "Send Email"}</button>
          </div>
          {(status === "done" || status === "error") && <p className={`text-sm ${status === "done" ? "text-green-400/70" : "text-red-400/70"}`}>{msg}</p>}
        </div>
        <div className="border border-white/6 rounded-xl overflow-hidden">
          <div className="border-b border-white/6 px-4 py-3 flex items-center justify-between">
            <span className="text-[9px] tracking-widest uppercase text-white/25">Email Preview</span>
            {subject && <span className="text-xs text-white/35 truncate max-w-[200px]">{subject}</span>}
          </div>
          <div className="h-[520px] overflow-auto bg-[#07090F]">
            {body ? <div dangerouslySetInnerHTML={{ __html: body }} /> : <div className="flex items-center justify-center h-full text-white/15 text-xs tracking-widest uppercase">No content</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function VIPSessions({ token }: { token: string }) {
  const [data, setData] = useState<VIPRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, { notes: string; scheduledDate: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(() => { setLoading(true); api.vip(token).then(r => { setData(r.data ?? []); setLoading(false); }); }, [token]);
  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(v => filter === "all" || v.status === filter || v.sessionType === filter);
  const types: Record<string, string> = { "private-meet": "Private Meet", podcast: "Podcast Session", collaboration: "Collaboration", interview: "Interview" };

  const update = async (id: string, status: string) => {
    setSaving(id);
    const e = editing[id] ?? {};
    await api.updateVip(token, { id, status, notes: e.notes, scheduledDate: e.scheduledDate });
    setSaving(null); load();
  };

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>VIP Sessions <span className="text-white/30 text-lg">({data.length})</span></h2>
        <div className="flex gap-2 flex-wrap">
          {["all","pending","approved","scheduled","completed","declined"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all ${filter === f ? "border-white/25 text-white/70 bg-white/5" : "border-white/8 text-white/25 hover:text-white/45"}`}>{f}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : !filtered.length ? <Empty message="No VIP requests yet" /> : (
        <div className="space-y-0">
          {filtered.map(v => (
            <div key={v.id} className="border-b border-white/5">
              <div className="flex items-center gap-4 py-4 cursor-pointer hover:bg-white/[0.015] px-3 -mx-3 rounded transition-colors" onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <p className="text-sm font-medium text-white/80">{v.name || v.email}</p>
                    <Tag label={types[v.sessionType] ?? v.sessionType} color="amber" />
                  </div>
                  <p className="text-xs text-white/35">{v.email} · {new Date(v.requestedAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={v.status} />
                {v.scheduledDate && <span className="text-[10px] text-white/30">{new Date(v.scheduledDate).toLocaleDateString()}</span>}
                <span className="text-white/20 text-xs">{expanded === v.id ? "▲" : "▼"}</span>
              </div>
              <AnimatePresence>
                {expanded === v.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pb-5 px-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="border border-white/5 rounded-xl p-5 bg-white/[0.02] space-y-3">
                        <div className="flex gap-3"><span className="text-[9px] uppercase text-white/25 w-24">Session</span><span className="text-xs text-white/60">{types[v.sessionType] ?? v.sessionType}</span></div>
                        <div className="flex gap-3"><span className="text-[9px] uppercase text-white/25 w-24">Availability</span><span className="text-xs text-white/60">{v.availability || "—"}</span></div>
                        <div className="flex gap-3"><span className="text-[9px] uppercase text-white/25 w-24">Message</span><span className="text-xs text-white/60">{v.message || "—"}</span></div>
                      </div>
                      <div className="space-y-3">
                        <div><label className="block text-[9px] tracking-widest uppercase text-white/25 mb-1.5">Schedule Date</label>
                          <input type="date" value={editing[v.id]?.scheduledDate ?? v.scheduledDate ?? ""} onChange={e => setEditing({ ...editing, [v.id]: { ...editing[v.id], scheduledDate: e.target.value } })} className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/18" /></div>
                        <div><label className="block text-[9px] tracking-widest uppercase text-white/25 mb-1.5">Internal Notes</label>
                          <textarea value={editing[v.id]?.notes ?? v.notes ?? ""} onChange={e => setEditing({ ...editing, [v.id]: { ...editing[v.id], notes: e.target.value } })} rows={2} className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/18 resize-none" /></div>
                        <div className="flex gap-2 flex-wrap">
                          {["approved","scheduled","completed","declined"].map(s => (
                            <button key={s} onClick={() => update(v.id, s)} disabled={saving === v.id || v.status === s} className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded border transition-all disabled:opacity-40 ${v.status === s ? "border-white/25 text-white/60 bg-white/5" : "border-white/8 text-white/25 hover:text-white/50"}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventRegistrations({ token }: { token: string }) {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.contacts(token).then(r => {
      setData((r.data ?? []).filter((c: Contact) => c.type === "event"));
      setLoading(false);
    });
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(c => JSON.stringify(c).toLowerCase().includes(search.toLowerCase()));

  const byEvent: Record<string, Contact[]> = {};
  filtered.forEach(c => {
    const name = c.data?.eventName ?? "Unknown Event";
    if (!byEvent[name]) byEvent[name] = [];
    byEvent[name].push(c);
  });

  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    await api.updateContact(token, { id, status, notes: notes[id] ?? "" });
    setSaving(null); load();
  };

  const totalParty = filtered.reduce((sum, c) => sum + (Number(c.data?.partySize) || 1), 0);

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Event Registrations <span className="text-white/30 text-lg">({data.length})</span>
        </h2>
        <div className="flex gap-3 items-center">
          <div className="border border-white/6 rounded-xl px-4 py-2.5 text-center">
            <p className="text-[8px] tracking-widest uppercase text-white/25">Total Attendees</p>
            <p className="text-xl font-black text-white">{totalParty}</p>
          </div>
          <div className="border border-white/6 rounded-xl px-4 py-2.5 text-center">
            <p className="text-[8px] tracking-widests uppercase text-white/25">Events</p>
            <p className="text-xl font-black text-white">{Object.keys(byEvent).length}</p>
          </div>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or event..."
        className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 mb-7" />

      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : !data.length ? <Empty message="No event registrations yet" /> : (
        <div className="space-y-8">
          {Object.entries(byEvent).map(([eventName, regs]) => {
            const totalGuests = regs.reduce((s, c) => s + (Number(c.data?.partySize) || 1), 0);
            return (
              <div key={eventName}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-bold text-white/80">{eventName}</h3>
                  <span className="text-[9px] tracking-widests uppercase text-amber-400/65 border border-amber-500/20 px-2 py-0.5 rounded-full">{regs.length} registrants · {totalGuests} guests</span>
                  {regs[0]?.data?.eventDate && <span className="text-[9px] text-white/22 ml-auto">{regs[0].data.eventDate}</span>}
                </div>
                <div className="border border-white/6 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/6 bg-white/[0.02]">
                        {["Name", "Email", "Party", "Phone", "Message", "Registered", "Status"].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-[9px] tracking-widests uppercase text-white/22 font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {regs.map(c => (
                        <>
                          <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                            <td className="py-3 px-4 text-white/75 font-medium">{c.firstName} {c.lastName}</td>
                            <td className="py-3 px-4 text-white/45 text-xs">{c.email}</td>
                            <td className="py-3 px-4">
                              <span className="text-white/70 font-bold">{c.data?.partySize || "1"}</span>
                              <span className="text-white/25 text-xs"> guests</span>
                            </td>
                            <td className="py-3 px-4 text-white/30 text-xs">{c.data?.phone || "—"}</td>
                            <td className="py-3 px-4 text-white/30 text-xs max-w-[160px] truncate">{c.data?.message || "—"}</td>
                            <td className="py-3 px-4 text-white/28 text-xs">{new Date(c.receivedAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                          </tr>
                          {expanded === c.id && (
                            <tr className="bg-white/[0.01] border-b border-white/4">
                              <td colSpan={7} className="px-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    {Object.entries(c.data).filter(([k]) => !["firstName","lastName"].includes(k) && c.data[k]).map(([k, v]) => (
                                      <div key={k} className="flex gap-3">
                                        <span className="text-[9px] uppercase text-white/22 w-24 flex-shrink-0 pt-0.5">{k.replace(/([A-Z])/g, " $1")}</span>
                                        <span className="text-xs text-white/55 break-all">{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-[9px] tracking-widests uppercase text-white/22 mb-1.5">Internal Notes</label>
                                      <textarea value={notes[c.id] ?? c.notes ?? ""} onChange={e => setNotes({ ...notes, [c.id]: e.target.value })} rows={2}
                                        className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/18 resize-none" />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                      {["pending","read","responded","archived"].map(s => (
                                        <button key={s} onClick={() => updateStatus(c.id, s)} disabled={saving === c.id || c.status === s}
                                          className={`text-[9px] tracking-widests uppercase px-3 py-1.5 rounded border transition-all disabled:opacity-40 ${c.status === s ? "border-white/25 text-white/60 bg-white/5" : "border-white/8 text-white/25 hover:text-white/50 hover:border-white/18"}`}>{s}</button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Reports({ stats }: { stats: Stats | null }) {
  const bars = [
    { label: "Subscribers", value: stats?.subscribers ?? 0, color: "bg-white/40" },
    { label: "Badge Apps", value: stats?.badgeApplications ?? 0, color: "bg-amber-400/50" },
    { label: "Mgmt Inquiries", value: stats?.managementInquiries ?? 0, color: "bg-blue-400/50" },
    { label: "VIP Requests", value: stats?.vipRequests ?? 0, color: "bg-purple-400/50" },
    { label: "Pending", value: stats?.pendingContacts ?? 0, color: "bg-orange-400/50" },
  ];
  const max = Math.max(...bars.map(b => b.value), 1);

  return (
    <div className="p-8 max-w-[900px]">
      <h2 className="text-2xl font-black uppercase text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Reports & Analytics</h2>
      <div className="border border-white/6 rounded-xl p-7 mb-6">
        <p className="text-[9px] tracking-widest uppercase text-white/25 mb-6">Activity Overview</p>
        <div className="space-y-4">
          {bars.map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[10px] tracking-wide text-white/40 w-28 flex-shrink-0">{b.label}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${b.color}`} initial={{ width: 0 }} animate={{ width: `${(b.value / max) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
              </div>
              <span className="text-sm font-bold text-white/60 w-8 text-right">{b.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Records", value: (stats?.subscribers ?? 0) + (stats?.totalContacts ?? 0) + (stats?.vipRequests ?? 0), desc: "subscribers + contacts + VIP" },
          { label: "Response Rate", value: `${stats?.totalContacts ? Math.round(((stats.totalContacts - stats.pendingContacts) / stats.totalContacts) * 100) : 0}%`, desc: "contacts responded to" },
          { label: "New This Week", value: stats?.newThisWeek ?? 0, desc: "newsletter subscribers" },
        ].map((c, i) => (
          <div key={i} className="border border-white/6 rounded-xl p-5">
            <p className="text-[9px] tracking-widest uppercase text-white/25 mb-2">{c.label}</p>
            <p className="text-3xl font-black text-white mb-1">{c.value}</p>
            <p className="text-[10px] text-white/20">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const vars = [
    { label: "SMTP Host", key: "SMTP_HOST" }, { label: "SMTP User", key: "SMTP_USER" },
    { label: "Twilio SID", key: "TWILIO_ACCOUNT_SID" }, { label: "Twilio From", key: "TWILIO_FROM_NUMBER" },
    { label: "Admin Password", key: "ADMIN_PASSWORD" }, { label: "Magic Link Secret", key: "MAGIC_LINK_SECRET" },
  ];
  return (
    <div className="p-8 max-w-[800px]">
      <h2 className="text-2xl font-black uppercase text-white mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Settings</h2>
      <div className="border border-white/6 rounded-xl p-7 mb-6">
        <p className="text-[9px] tracking-widest uppercase text-white/25 mb-5">Required Environment Variables</p>
        <p className="text-xs text-white/35 mb-5">Configure these in your hosting environment (Vercel dashboard → Settings → Environment Variables).</p>
        <div className="space-y-3">
          {vars.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <div><p className="text-xs text-white/60">{v.label}</p><p className="text-[9px] text-white/25 font-mono">{v.key}</p></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 inline-block" /><span className="text-[9px] text-white/25 tracking-wider">Set in server environment</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-white/6 rounded-xl p-7">
        <p className="text-[9px] tracking-widest uppercase text-white/25 mb-4">Data Storage</p>
        <p className="text-xs text-white/35 leading-relaxed mb-3">Data is stored as JSON files in the server's <code className="text-white/45 bg-white/5 px-1.5 py-0.5 rounded">data/</code> directory.</p>
        <p className="text-xs text-white/25 leading-relaxed">For Vercel production deployments, data is written to <code className="text-white/35 bg-white/5 px-1.5 py-0.5 rounded">/tmp</code> (ephemeral). For persistent production storage, connect a database such as Vercel KV, Supabase, or PlanetScale and update the API functions accordingly.</p>
      </div>
    </div>
  );
}

// ── Admin Login ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [pw, setPw] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const data = await r.json() as { success: boolean; token?: string; message?: string };
      if (data.success && data.token) { onLogin(data.token); }
      else { setStatus("error"); setMsg(data.message ?? "Invalid password"); }
    } catch { setStatus("error"); setMsg("Connection error. Is the server running?"); }
  };

  return (
    <div className="min-h-screen bg-[#030508] text-white flex items-center justify-center">
      <motion.div className="w-full max-w-sm mx-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/25 mb-2 text-center">Chris Potter Official</p>
        <h1 className="text-5xl font-black uppercase text-white text-center mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Admin</h1>
        <form onSubmit={login} className="border border-white/8 rounded-2xl p-7 bg-white/[0.02] space-y-4">
          <div><label className="block text-[9px] tracking-widest uppercase text-white/25 mb-2">Admin Password</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} required autoFocus className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/15 focus:outline-none focus:border-white/22" /></div>
          {status === "error" && <p className="text-red-400/70 text-sm">{msg}</p>}
          <button type="submit" disabled={status === "loading"} className="w-full py-3.5 bg-white text-[#030508] text-[11px] tracking-[0.22em] uppercase font-bold rounded-lg hover:bg-white/85 disabled:opacity-50 transition-colors">{status === "loading" ? "Signing in…" : "Sign In"}</button>
        </form>
        <p className="text-[9px] text-white/15 text-center mt-4">Set ADMIN_PASSWORD environment variable to enable access</p>
      </motion.div>
    </div>
  );
}

// ── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV: { id: AdminTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "subscribers", label: "Subscribers", icon: "◉" },
  { id: "badge", label: "Badge Apps", icon: "⬡" },
  { id: "inquiries", label: "Inquiries", icon: "◎" },
  { id: "compose", label: "Compose", icon: "✉" },
  { id: "vip", label: "VIP Sessions", icon: "★" },
  { id: "events", label: "Events", icon: "◆" },
  { id: "reports", label: "Reports", icon: "▦" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

// ── Main Admin ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cp_admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    api.stats(token).then(r => { if (r.success) setStats(r.data ?? r); }).catch(() => null);
  }, [token]);

  const login = (t: string) => { setToken(t); localStorage.setItem("cp_admin_token", t); };
  const logout = () => { setToken(null); localStorage.removeItem("cp_admin_token"); };

  if (!token) return <AdminLogin onLogin={login} />;

  return (
    <div className="min-h-screen bg-[#030508] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#020407]">
        <div className="p-5 border-b border-white/5">
          <p className="text-[8px] tracking-[0.28em] uppercase text-white/20 mb-0.5">Chris Potter</p>
          <p className="text-sm font-bold text-white/70 tracking-wide">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${tab === n.id ? "bg-white/8 text-white/80" : "text-white/30 hover:text-white/55 hover:bg-white/[0.04]"}`}>
              <span className="text-[10px] w-4 text-center opacity-70">{n.icon}</span>
              <span className="text-[11px] tracking-wide">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="w-full text-[9px] tracking-widest uppercase text-white/20 hover:text-white/45 transition-colors py-2">Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
            {tab === "overview" && <Overview token={token} stats={stats} />}
            {tab === "subscribers" && <Subscribers token={token} />}
            {tab === "badge" && <Contacts token={token} type="fanbase" />}
            {tab === "inquiries" && <Contacts token={token} type="management" />}
            {tab === "compose" && <Compose token={token} />}
            {tab === "vip" && <VIPSessions token={token} />}
            {tab === "events" && <EventRegistrations token={token} />}
            {tab === "reports" && <Reports stats={stats} />}
            {tab === "settings" && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
