import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Droplets, Activity, ClipboardList, ShieldCheck, BarChart3, ArrowRight, UserPlus, FileHeart, Smile } from "lucide-react";

function AnimatedCounter({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime;
    let animationFrame;
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      if (progress < duration * 1000) {
        setCount(Math.min(end, Math.floor((progress / (duration * 1000)) * end)));
        animationFrame = requestAnimationFrame(updateCount);
      } else { setCount(end); }
    };
    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return <span>{count.toLocaleString()}</span>;
}

export default function Home() {
  const { user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { quote: "The ML predictions helped us reduce blood wastage by 30% in just three months.", name: "Dr. Meera Sharma", role: "Chief Medical Officer, City General Hospital" },
    { quote: "Real-time inventory tracking has been a game-changer for emergency response.", name: "Rajesh Kumar", role: "Blood Bank Director, Apollo Hospital" },
    { quote: "We've increased our donor retention rate by 45% using the smart donor management.", name: "Priya Nair", role: "Operations Head, St. Mary's Medical Center" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

  const BtnPrimary = ({ to, children, className = "" }) => (
    <Link to={to} className={`inline-flex items-center gap-2 bg-[var(--red)] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:opacity-90 transition-opacity shadow-md ${className}`}>{children}</Link>
  );
  const BtnSecondary = ({ to, children, className = "" }) => (
    <Link to={to} className={`inline-flex items-center gap-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] px-8 py-3.5 rounded-xl font-bold text-base hover:bg-[var(--surface2)] transition-colors ${className}`}>{children}</Link>
  );

  return (
    <div className="w-full overflow-x-hidden" style={{ background: "var(--bg)" }}>
      <section className="relative px-6 pt-12 pb-16 lg:pt-28 lg:pb-24 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 inset-x-0 h-80 pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--primary-light), transparent)" }} />
        <div className="mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-start text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold mb-6" style={{ borderColor: "var(--primary)", background: "var(--primary-light)", color: "var(--primary)" }}>
              <ShieldCheck className="w-4 h-4" /> Trusted Healthcare Platform
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ color: "var(--text)" }}>
              Ensuring <span style={{ color: "var(--red)" }}>Every Drop</span> <br />Saves a Life.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg lg:text-xl mb-8 max-w-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Enterprise-grade blood bank management. Real-time tracking, intelligent donor logistics, and predictive ML forecasting for hospital operations.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              {user ? (
                <BtnPrimary to="/dashboard">Open Dashboard <ArrowRight className="w-5 h-5" /></BtnPrimary>
              ) : (
                <>
                  <BtnPrimary to="/register">Get Started <ArrowRight className="w-5 h-5" /></BtnPrimary>
                  <BtnSecondary to="/login">Staff Login</BtnSecondary>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
            <div className="relative rounded-2xl p-8 border shadow-xl" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--red-light)", color: "var(--red)" }}>
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: "var(--text)" }}>Live Inventory Feed</h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Updated real-time</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--green-light)", color: "var(--green)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--green)" }} />Live
                </span>
              </div>
              <div className="space-y-4">
                {[{ bg: "A+", units: 142, pct: 85 }, { bg: "O-", units: 23, pct: 15, low: true }, { bg: "B+", units: 98, pct: 65 }, { bg: "AB+", units: 67, pct: 45 }].map(({ bg, units, pct, low }) => (
                  <div key={bg} className="flex items-center gap-4">
                    <span className="w-10 text-sm font-extrabold text-center py-1 rounded-md text-white flex-shrink-0" style={{ background: "var(--red)" }}>{bg}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface2)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: low ? "var(--red)" : "var(--primary)" }} />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right" style={{ color: low ? "var(--red)" : "var(--text)" }}>{units} units</span>
                    {low && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "var(--red-light)", color: "var(--red)" }}>LOW</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-10 px-6" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ n: 12500, label: "Active Donors", suffix: "+" }, { n: 98, label: "Hospitals Served", suffix: "+" }, { n: 99, label: "Uptime SLA", suffix: "%" }, { n: 50000, label: "Requests Fulfilled", suffix: "+" }].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold" style={{ color: "var(--red)" }}><AnimatedCounter end={s.n} />{s.suffix}</div>
              <div className="text-sm font-medium mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: "var(--text)" }}>Built for Clinical Excellence</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>Every feature engineered to meet the demands of modern blood banking operations.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Droplets, title: "Real-time Inventory", desc: "Live blood stock tracking across all blood groups with automatic low-stock alerts and critical notifications.", color: "var(--red)", bg: "var(--red-light)" },
              { icon: UserPlus, title: "Donor Management", desc: "Comprehensive donor registry with eligibility tracking, contact management, and demographic filtering.", color: "var(--primary)", bg: "var(--primary-light)" },
              { icon: FileHeart, title: "Request Workflow", desc: "End-to-end blood request management with urgency classification, status tracking, and fulfillment.", color: "var(--orange)", bg: "var(--orange-light)" },
              { icon: Activity, title: "ML Forecasting", desc: "Linear regression models predict 30-day blood demand, helping prevent shortages before they occur.", color: "var(--green)", bg: "var(--green-light)" },
              { icon: ShieldCheck, title: "RBAC Security", desc: "Granular Role-Based Access Control ensuring clinical data compliance. Admin, staff, and user roles.", color: "var(--green)", bg: "var(--green-light)" },
              { icon: BarChart3, title: "Analytics Hub", desc: "Executive dashboards with actionable insights on inventory trends, donor activity, and fulfillment rates.", color: "var(--blue)", bg: "var(--blue-light)" },
            ].map((f, i) => (
              <motion.div variants={itemVariants} key={i} className="group rounded-2xl border p-8 transition-all hover:shadow-lg" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ background: f.bg, color: f.color }}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: "var(--text)" }}>How It Works</h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>Three simple steps to smarter blood bank management</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{ icon: UserPlus, step: "01", title: "Register & Onboard", desc: "Set up your hospital's blood bank profile and invite staff with the right access levels." },
              { icon: ClipboardList, step: "02", title: "Manage & Track", desc: "Add donors, log inventory, and process blood requests through an intuitive dashboard." },
              { icon: Activity, step: "03", title: "Predict & Optimize", desc: "Let the ML engine forecast demand and proactively optimize your blood stock levels." }
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md" style={{ background: "var(--red)", color: "white" }}>
                  <s.icon className="w-8 h-8" />
                </div>
                <div className="text-xs font-black tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>STEP {s.step}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 border-b border-[var(--border)]" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Smile className="w-10 h-10 mx-auto mb-6" style={{ color: "var(--primary)" }} />
            <h2 className="text-3xl font-extrabold mb-10" style={{ color: "var(--text)" }}>Trusted by Medical Professionals</h2>
            <div className="relative min-h-[140px]">
              {testimonials.map((t, i) => (
                <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${i === activeTestimonial ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                  <p className="text-xl md:text-2xl font-medium mb-6 leading-snug" style={{ color: "var(--text)" }}>"{t.quote}"</p>
                  <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>{t.name}</div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} className={`h-2 rounded-full transition-all duration-300 cursor-pointer`} style={{ width: i === activeTestimonial ? 32 : 8, background: i === activeTestimonial ? "var(--primary)" : "var(--border)" }} onClick={() => setActiveTestimonial(i)} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24 text-center" style={{ background: "var(--red)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Ready to Upgrade Your Blood Bank?</h2>
          <p className="text-xl text-white/80 font-medium mb-10">The standard used by top medical institutions globally.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3.5 rounded-xl text-base hover:bg-[var(--surface2)] transition-colors shadow-md" style={{ color: "var(--red)" }}>
                Access Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center gap-2 bg-white font-bold px-8 py-3.5 rounded-xl text-base hover:bg-[var(--surface2)] transition-colors shadow-md" style={{ color: "var(--red)" }}>
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl text-base hover:bg-white/10 transition-colors">
                  Staff Login
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="py-8 px-6 border-t border-[var(--border)]" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold" style={{ color: "var(--text)" }}>
            <HeartPulse className="w-5 h-5" style={{ color: "var(--red)" }} />
            BloodBank Medical Systems
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>© 2026 BloodBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}