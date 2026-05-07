import { getAdminToken } from "../auth/adminSession";
import {
  useAdminStats,
  useSubscribers,
  useDeleteSubscriber,
} from "../queries/admin";
import { AdminLogout } from "./AdminLogout";
import { LoadingBlock, ErrorBlock } from "./ui/Feedback";

export function AdminDashboard() {
  const token = getAdminToken()!;
  const stats = useAdminStats(token);
  const subs = useSubscribers(token);
  const del = useDeleteSubscriber(token);

  if (stats.isLoading || subs.isLoading) {
    return <LoadingBlock label="Loading admin dashboard…" />;
  }

  if (stats.isError || subs.isError) {
    return <ErrorBlock message="Failed to load admin data." />;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Admin Dashboard</h1>
        <AdminLogout />
      </div>

      {/* STATS GRID */}
      <div style={gridStyle}>
        <StatCard label="Subscribers" value={stats.data?.subscribers} />
        <StatCard label="VIP Requests" value={stats.data?.vipRequests} />
        <StatCard label="Contacts" value={stats.data?.totalContacts} />
      </div>

      {/* SUBSCRIBER LIST */}
      <section>
        <h2>Subscribers</h2>
        <div style={listStyle}>
          {subs.data?.map((s) => (
            <div key={s.email} style={rowStyle}>
              <span>{s.email}</span>
              <button onClick={() => del.mutate(s.email)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <div style={cardStyle}>
      <div style={{ opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: 32 }}>{value ?? "—"}</div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 32,
};

const cardStyle = {
  padding: 20,
  borderRadius: 12,
  background: "#111",
  color: "#fff",
};

const listStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 8,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: 12,
  background: "#1a1a1a",
  borderRadius: 8,
};