import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6 bg-[var(--surface2)]">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 w-full max-w-md shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-[var(--red-light)] text-[var(--red)] rounded-xl">
            <LogIn className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center text-[var(--text)]">Welcome Back</h2>
        <p className="text-[var(--text-muted)] text-center mb-8 text-sm">Sign in to manage blood bank operations</p>
        {error && (
          <div className="flex items-center gap-2 bg-[var(--red-light)] border border-[var(--red)] text-[var(--red)] px-4 py-3 rounded-lg text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input type="email" placeholder="Email address" value={form.email} className="pl-10"
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input type="password" placeholder="Password" value={form.password} className="pl-10"
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="w-full bg-[var(--red)] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">Don't have an account? <Link to="/register" className="text-[var(--primary)] font-bold hover:underline">Register</Link></p>
      </div>
    </div>
  );
}