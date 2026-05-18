import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import Requests from "./pages/Requests";
import Inventory from "./pages/Inventory";
import Predict from "./pages/Predict";
import { AlertTriangle } from "lucide-react";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 text-center">
      <AlertTriangle className="w-16 h-16 mb-6" style={{ color: "var(--red)" }} />
      <h1 className="text-4xl font-extrabold mb-3 tracking-tight" style={{ color: "var(--text)" }}>404 - Page Not Found</h1>
      <p className="text-lg font-medium mb-8 max-w-md" style={{ color: "var(--text-muted)" }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-opacity hover:opacity-90 shadow-sm"
        style={{ background: "var(--red)", color: "white" }}
      >
        Return to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen transition-colors duration-300" style={{ background: "var(--bg)", color: "var(--text)" }}>
          <Navbar />
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/donors" element={<PrivateRoute><Donors /></PrivateRoute>} />
              <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
              <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
              <Route path="/predict" element={<PrivateRoute><Predict /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}