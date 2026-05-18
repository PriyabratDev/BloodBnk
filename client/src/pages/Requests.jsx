import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Inbox, Plus, X, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ patientName: "", bloodGroup: "A+", units: 1, hospital: "", contactNumber: "", urgency: "medium" });
  const [showForm, setShowForm] = useState(false);

  const load = async () => { const res = await api.get("/requests"); setRequests(res.data); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); await api.post("/requests", form); setShowForm(false); load(); };
  const updateStatus = async (id, status) => { await api.put(`/requests/${id}/status`, { status }); load(); };
  const canManage = user?.role === "admin" || user?.role === "staff";

  const urgencyConfig = {
    low:    { icon: CheckCircle,  color: "var(--green)"  },
    medium: { icon: Clock,        color: "var(--orange)" },
    high:   { icon: AlertTriangle, color: "var(--red)"   },
  };

  const statusStyle = (status) => ({
    background: status === "fulfilled" ? "var(--green-light)" : status === "rejected" ? "var(--red-light)" : "var(--orange-light)",
    color:      status === "fulfilled" ? "var(--green)"      : status === "rejected" ? "var(--red)"       : "var(--orange)",
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: "var(--orange-light)", color: "var(--orange)" }}>
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>Blood Requests</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {requests.filter(r => r.status === "pending").length} pending · {requests.length} total
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
          style={{ background: "var(--red)", color: "white" }}
        >
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Request</>}
        </button>
      </div>

      {showForm && (
        <form
          className="rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onSubmit={handleSubmit}
        >
          <input placeholder="Patient Name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
            {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
          </select>
          <input type="number" min="1" placeholder="Units" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} required />
          <input placeholder="Hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} required />
          <input placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
            <option value="low">Low Urgency</option>
            <option value="medium">Medium Urgency</option>
            <option value="high">High Urgency</option>
          </select>
          <button type="submit" className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity md:col-span-3" style={{ background: "var(--red)", color: "white" }}>
            <CheckCircle className="w-4 h-4" /> Submit Request
          </button>
        </form>
      )}

      <div className="rounded-2xl shadow-sm overflow-x-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "var(--surface2)" }}>
              {["Patient", "Blood Group", "Units", "Hospital", "Urgency", "Status", canManage && "Actions"].filter(Boolean).map(h => (
                <th key={h} className="text-left p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>No requests found.</td></tr>
            ) : requests.map((r) => {
              const urg = urgencyConfig[r.urgency] || urgencyConfig.medium;
              const UrgIcon = urg.icon;
              return (
                <tr key={r._id} style={{ borderTop: "1px solid var(--border)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text)" }}>{r.patientName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-md text-sm font-bold text-white" style={{ background: "var(--red)" }}>{r.bloodGroup}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text)" }}>{r.units}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text)" }}>{r.hospital}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold capitalize" style={{ color: urg.color }}>
                      <UrgIcon className="w-3.5 h-3.5" />{r.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={statusStyle(r.status)}>{r.status}</span>
                  </td>
                  {canManage && (
                    <td className="px-4 py-3">
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors"
                            style={{ background: "var(--green-light)", color: "var(--green)" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "var(--green-light)"; e.currentTarget.style.color = "var(--green)"; }}
                            onClick={() => updateStatus(r._id, "fulfilled")}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Fulfill
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors"
                            style={{ background: "var(--red-light)", color: "var(--red)" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--red)"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "var(--red-light)"; e.currentTarget.style.color = "var(--red)"; }}
                            onClick={() => updateStatus(r._id, "rejected")}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}