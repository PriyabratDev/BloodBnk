import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Users, Plus, X, Search, MapPin, Trash2, CheckCircle, XCircle } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Donors() {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", bloodGroup: "A+", phone: "", email: "", city: "" });
  const [filter, setFilter] = useState({ bloodGroup: "", city: "" });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const params = {};
    if (filter.bloodGroup) params.bloodGroup = filter.bloodGroup;
    if (filter.city) params.city = filter.city;
    const res = await api.get("/donors", { params });
    setDonors(res.data);
  };

  useEffect(() => { load(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/donors", form);
    setForm({ name: "", age: "", bloodGroup: "A+", phone: "", email: "", city: "" });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this donor?")) return;
    await api.delete(`/donors/${id}`);
    load();
  };

  const canManage = user?.role === "admin" || user?.role === "staff";

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>Donor Registry</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{donors.length} registered donors</p>
          </div>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
            style={{ background: "var(--red)", color: "white" }}
          >
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Donor</>}
          </button>
        )}
      </div>

      {showForm && (
        <form
          className="rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onSubmit={handleSubmit}
        >
          <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
            {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
          </select>
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <button type="submit" className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity md:col-span-3" style={{ background: "var(--red)", color: "white" }}>
            <CheckCircle className="w-4 h-4" /> Save Donor
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl shadow-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <select value={filter.bloodGroup} className="pl-10" onChange={(e) => setFilter({ ...filter, bloodGroup: e.target.value })}>
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <input placeholder="Filter by city..." value={filter.city} className="pl-10" onChange={(e) => setFilter({ ...filter, city: e.target.value })} />
        </div>
      </div>

      <div className="rounded-2xl shadow-sm overflow-x-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "var(--surface2)" }}>
              {["Name", "Age", "Blood Group", "Phone", "City", "Eligible", canManage && "Action"].filter(Boolean).map(h => (
                <th key={h} className="text-left p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donors.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>No donors found.</td></tr>
            ) : donors.map((d) => (
              <tr key={d._id} className="transition-colors" style={{ borderTop: "1px solid var(--border)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text)" }}>{d.name}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--text)" }}>{d.age}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-md text-sm font-bold text-white" style={{ background: "var(--red)" }}>{d.bloodGroup}</span>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--text)" }}>{d.phone}</td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--text)" }}>{d.city}</td>
                <td className="px-4 py-3">
                  {d.isEligible
                    ? <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--green)" }}><CheckCircle className="w-4 h-4" /> Yes</span>
                    : <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--red)" }}><XCircle className="w-4 h-4" /> No</span>}
                </td>
                {canManage && (
                  <td className="px-4 py-3">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors"
                      style={{ background: "var(--red-light)", color: "var(--red)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--red)"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--red-light)"; e.currentTarget.style.color = "var(--red)"; }}
                      onClick={() => handleDelete(d._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}