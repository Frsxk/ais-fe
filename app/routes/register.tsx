import type { Route } from "./+types/login";
import { GlassPanel } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AlertTriangle, Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Register - AIS-NG" }];
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, role);
      const raw = localStorage.getItem("ais_user");
      const user = raw ? JSON.parse(raw) : null;
      navigate(user?.role === "lecturer" ? "/lecturer" : "/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassPanel className="flex flex-col items-center">
          <div className="bg-fuchsia-100 p-1.5 rounded-2xl mb-6 shadow-lg shadow-indigo-600/20 overflow-hidden">
            <img src="/logo.png" alt="AIS Logo" className="w-12 h-12 object-contain rounded-xl" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Create Account</h1>
          <p className="text-center text-slate-500 mb-6">Register to Academic Information System <span className= "italic">Next Generation</span></p>

          {error && (
            <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-sm font-medium">
              <AlertTriangle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/50 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">Email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/50 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <input
                type="password"
                id="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/50 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Min 6 characters"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Register As</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200/50 bg-white/40 flex-1 hover:bg-white/70 transition-colors">
                  <input type="radio" value="student" checked={role === "student"} onChange={e => setRole(e.target.value)} className="accent-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200/50 bg-white/40 flex-1 hover:bg-white/70 transition-colors">
                  <input type="radio" value="lecturer" checked={role === "lecturer"} onChange={e => setRole(e.target.value)} className="accent-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Lecturer</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="mt-2 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Log in</Link>
            </p>
          </form>
        </GlassPanel>
      </div>
    </div>
  );
}
