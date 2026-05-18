import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { HeartPulse, Menu, X, LayoutDashboard, Users, Droplets, Inbox, Activity, LogOut, LogIn, KeyRound, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const role = user?.role;

  const NavItem = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
        isActive(to)
          ? "bg-[var(--primary-light)] text-[var(--primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] px-6 py-3 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[var(--red-light)] text-[var(--red)] flex items-center justify-center">
          <HeartPulse className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-xl text-[var(--text)] tracking-tight">BloodBank</span>
      </Link>

      <button
        className="md:hidden text-[var(--text)] p-2 hover:bg-[var(--surface2)] rounded-md transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 mr-2 text-[var(--text-muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)] rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {user ? (
          <>
            <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to="/donors" icon={Users}>Donors</NavItem>
            <NavItem to="/requests" icon={Inbox}>Requests</NavItem>
            <NavItem to="/inventory" icon={Droplets}>Inventory</NavItem>
            <NavItem to="/predict" icon={Activity}>Forecasting</NavItem>

            <div className="h-6 w-px bg-[var(--border)] mx-2" />

            <div className="flex flex-col items-end leading-none px-2">
              <span className="text-sm font-bold text-[var(--text)]">{user.name}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--primary)]">{role}</span>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-[var(--text-muted)] hover:bg-[var(--red-light)] hover:text-[var(--red)] rounded-lg transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4 ml-4">
            <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link to="/register" className="bg-[var(--red)] text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
              <KeyRound className="w-4 h-4" /> Get Started
            </Link>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--surface)] border-b border-[var(--border)] p-4 flex flex-col gap-2 md:hidden shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] mb-2">
            <span className="text-sm font-semibold text-[var(--text-muted)]">Theme</span>
            <button onClick={toggleTheme} className="p-2 bg-[var(--surface2)] text-[var(--text)] rounded-md">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {user ? (
            <>
              <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
              <NavItem to="/donors" icon={Users}>Donors</NavItem>
              <NavItem to="/requests" icon={Inbox}>Requests</NavItem>
              <NavItem to="/inventory" icon={Droplets}>Inventory</NavItem>
              <NavItem to="/predict" icon={Activity}>Forecasting</NavItem>
              <div className="h-px bg-[var(--border)] my-2" />
              <div className="px-3 py-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--text)] text-sm">{user.name}</div>
                  <div className="text-xs text-[var(--primary)] font-bold">{role}</div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-[var(--red-light)] text-[var(--red)] rounded-lg text-sm font-semibold">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-2.5 border border-[var(--border)] rounded-lg text-[var(--text)] font-semibold">Sign In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full text-center py-2.5 bg-[var(--red)] text-white rounded-lg font-semibold">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}