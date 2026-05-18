import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, X } from "lucide-react";

const COLORS = ["#dc2626", "#ea580c", "#d97706", "#16a34a", "#2563eb", "#7c3aed", "#db2777", "#0891b2"];

export default function Predict() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState([]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    api.get("/predict").then((res) => {
      const { predictions, days } = res.data;
      const chartData = days.map((d, i) => {
        const row = { day: `Day ${d}` };
        Object.keys(predictions).forEach((bg) => { row[bg] = predictions[bg][i]; });
        return row;
      });
      setData({ chartData, bloodGroups: Object.keys(predictions) });
      setSelected(Object.keys(predictions));
      setLoading(false);
    }).catch(() => { setError("ML service unavailable. Ensure Flask is running on port 5001."); setLoading(false); });
  }, []);

  const toggle = (bg) => setSelected((prev) => prev.includes(bg) ? prev.filter((x) => x !== bg) : [...prev, bg]);

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await api.post("/predict/retrain");
      showToast("Model retrained successfully. Refresh to see updated predictions.", "success");
    } catch (e) {
      showToast(e.response?.data?.message || "Retrain failed. Is Flask running on port 5001?", "error");
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl font-semibold text-sm max-w-sm" style={{ background: toast.type === "success" ? "var(--green-light)" : "var(--red-light)", color: toast.type === "success" ? "var(--green)" : "var(--red)", border: `1px solid ${toast.type === "success" ? "var(--green)" : "var(--red)"}` }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="cursor-pointer opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>ML Demand Forecast</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>30-day prediction via Linear Regression</p>
          </div>
        </div>
        {(user?.role === "admin" || user?.role === "staff") && (
          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-opacity"
            style={{ background: "var(--primary)", color: "white" }}
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? "animate-spin" : ""}`} />
            {isRetraining ? "Retraining..." : "Retrain Model"}
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center py-20" style={{ color: "var(--text-muted)" }}>
          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
          <p className="font-semibold">Loading predictions...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl mb-6" style={{ background: "var(--red-light)", border: "1px solid var(--red)", color: "var(--red)" }}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {data && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.bloodGroups.map((bg, i) => (
              <button key={bg} onClick={() => toggle(bg)} className="px-4 py-2 rounded-lg font-bold text-sm border transition-all cursor-pointer" style={selected.includes(bg) ? { background: COLORS[i % COLORS.length], borderColor: COLORS[i % COLORS.length], color: "white" } : { background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
                {bg}
              </button>
            ))}
          </div>

          <div className="rounded-2xl p-6 shadow-sm mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--primary)" }} /> Demand Trend
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data.chartData}>
                <defs>
                  {data.bloodGroups.filter(bg => selected.includes(bg)).map((bg, i) => (
                    <linearGradient key={bg} id={`g-${bg}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} interval={4} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)" }} />
                <Legend />
                {data.bloodGroups.filter(bg => selected.includes(bg)).map((bg, i) => (
                  <Area key={bg} type="monotone" dataKey={bg} stroke={COLORS[i % COLORS.length]} fill={`url(#g-${bg})`} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>Avg Predicted Demand (30 Days)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "var(--surface2)" }}>
                    {["Blood Group", "Avg Daily", "Total 30-Day", "Severity"].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.bloodGroups.map((bg) => {
                    const vals = data.chartData.map((r) => r[bg] || 0);
                    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
                    const total = vals.reduce((a, b) => a + b, 0).toFixed(0);
                    const isHigh = avg > 10;
                    return (
                      <tr key={bg} style={{ borderTop: "1px solid var(--border)" }}>
                        <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-md text-sm font-bold text-white" style={{ background: "var(--red)" }}>{bg}</span></td>
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text)" }}>{avg} units/day</td>
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text)" }}>{total} units</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: isHigh ? "var(--orange-light)" : "var(--green-light)", color: isHigh ? "var(--orange)" : "var(--green)" }}>
                            {isHigh ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {isHigh ? "High" : "Normal"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}