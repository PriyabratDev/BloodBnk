import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Droplets, Plus, AlertTriangle } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Inventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ bloodGroup: "A+", units: "" });

  const load = async () => { const res = await api.get("/inventory"); setInventory(res.data); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => { e.preventDefault(); await api.post("/inventory", form); setForm({ bloodGroup: "A+", units: "" }); load(); };
  const canManage = user?.role === "admin" || user?.role === "staff";
  const totalUnits = inventory.reduce((sum, i) => sum + (i.units || 0), 0);
  const lowCount = inventory.filter(i => i.units <= (i.lowStockThreshold || 10)).length;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--blue-light)] text-[var(--blue)] rounded-xl"><Droplets className="w-7 h-7" /></div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Blood Inventory</h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">{totalUnits} total units across {inventory.length} groups</p>
          </div>
        </div>
        {lowCount > 0 && <div className="flex items-center gap-2 bg-[var(--red-light)] border border-[var(--red)] text-[var(--red)] px-4 py-2 rounded-lg text-sm font-bold"><AlertTriangle className="w-4 h-4" />{lowCount} critically low</div>}
      </div>

      {canManage && (
        <form className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 mb-8 items-end" onSubmit={handleSubmit}>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Blood Group</label>
            <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>{BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}</select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Units to Add</label>
            <input type="number" min="1" placeholder="Enter quantity" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} required />
          </div>
          <button type="submit" className="bg-[var(--red)] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 cursor-pointer whitespace-nowrap"><Plus className="w-4 h-4" /> Add Stock</button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {BLOOD_GROUPS.map((bg) => {
          const item = inventory.find((i) => i.bloodGroup === bg);
          const units = item?.units || 0;
          const threshold = item?.lowStockThreshold || 10;
          const isLow = units <= threshold;
          const pct = Math.min(100, (units / (threshold * 3)) * 100);
          return (
            <div key={bg} className="relative rounded-2xl p-6 text-center shadow-sm transition-all hover:shadow-lg overflow-hidden border" style={{ background: "var(--surface)", borderColor: isLow ? "var(--red)" : "var(--border)" }}>
              {isLow && <div className="absolute top-0 left-0 w-full h-1" style={{ background: "var(--red)" }} />}
              <div className="text-2xl font-extrabold mb-1" style={{ color: isLow ? "var(--red)" : "var(--primary)" }}>{bg}</div>
              <div className="text-4xl font-black my-3 text-[var(--text)]">{units}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Units Available</div>
              <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ background: "var(--surface2)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: isLow ? "var(--red)" : "var(--primary)" }} />
              </div>
              {isLow && <div className="flex items-center justify-center gap-1 text-xs font-bold mt-2 text-[var(--red)]"><AlertTriangle className="w-3 h-3" /> Low Stock</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}