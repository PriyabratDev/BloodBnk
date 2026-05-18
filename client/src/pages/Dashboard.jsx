import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Users, Droplets, Inbox, AlertTriangle, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ donors: 0, requests: 0, pending: 0, alerts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [donors, requests, alerts] = await Promise.all([
          api.get("/donors"),
          api.get("/requests"),
          api.get("/inventory/alerts"),
        ]);
        setStats({
          donors: donors.data.length,
          requests: requests.data.length,
          pending: requests.data.filter((r) => r.status === "pending").length,
          alerts: alerts.data,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tiles = [
    { title: "Total Donors", value: stats.donors, icon: Users, onClick: () => navigate("/donors"), highlight: false },
    { title: "Total Requests", value: stats.requests, icon: Inbox, onClick: () => navigate("/requests"), highlight: false },
    { title: "Pending Requests", value: stats.pending, icon: Droplets, onClick: () => navigate("/requests"), highlight: stats.pending > 0, hColor: "var(--orange)" },
    { title: "Low Stock Alerts", value: stats.alerts.length, icon: AlertTriangle, onClick: () => navigate("/inventory"), highlight: stats.alerts.length > 0, hColor: "var(--red)" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="mb-8 pb-6 border-b border-[var(--border)]">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Overview</h2>
        <p className="mt-1 text-[var(--text-muted)]">Welcome back, <span className="font-semibold text-[var(--text)]">{user?.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {tiles.map((t, i) => (
          <div
            key={i}
            onClick={t.onClick}
            className="relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
            style={{
              background: t.highlight ? t.hColor : "var(--surface)",
              borderColor: t.highlight ? t.hColor : "var(--border)",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl" style={{ background: t.highlight ? "rgba(255,255,255,0.2)" : "var(--surface2)" }}>
                <t.icon className="w-6 h-6" style={{ color: t.highlight ? "white" : "var(--text)" }} />
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: t.highlight ? "white" : "var(--primary)" }} />
            </div>
            <h3 className="text-3xl font-extrabold mb-1" style={{ color: t.highlight ? "white" : "var(--text)" }}>
              {loading ? "..." : t.value}
            </h3>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: t.highlight ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
              {t.title}
            </p>
          </div>
        ))}
      </div>

      {stats.alerts.length > 0 && (
        <div className="bg-[var(--red-light)] border border-[var(--red)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-[var(--border)] pb-4">
            <div className="p-2 bg-[var(--red-light)] rounded-lg text-[var(--red)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[var(--red)]">Critical Inventory Alerts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.alerts.map((a) => (
              <div key={a._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between hover:border-[var(--red)] transition-colors shadow-sm cursor-pointer" onClick={() => navigate("/inventory")}>
                <span className="text-xl font-extrabold text-[var(--red)]">{a.bloodGroup}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--text)]">{a.units}</span>
                  <span className="text-xs text-[var(--text-muted)] block font-semibold uppercase">Units Left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}