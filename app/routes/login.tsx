import type { Route } from "./+types/login";
import { Form, redirect } from "react-router";
import { GlassPanel } from "../components/ui/GlassCard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - AIS-NG" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const role = formData.get("role") as string;
  
  if (role === "lecturer") {
    return redirect("/lecturer");
  }
  return redirect("/student");
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassPanel className="flex flex-col items-center">
          <div className="bg-fuchsia-100 p-1.5 rounded-2xl mb-6 shadow-lg shadow-indigo-600/20 overflow-hidden">
            <img src="/logo.png" alt="AIS Logo" className="w-12 h-12 object-contain rounded-xl" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-center text-slate-500 mb-8">Sign in to the Academic Information System</p>
          
          <Form method="post" className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">Email or NIM/NIDN</label>
              <input 
                type="text" 
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200/50 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Enter your email or ID"
                defaultValue="student@nusa.edu"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 ml-1">Password</label>
              <input 
                type="password" 
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200/50 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Login As</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200/50 bg-white/40 flex-1 hover:bg-white/70 transition-colors">
                  <input type="radio" name="role" value="student" defaultChecked className="accent-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200/50 bg-white/40 flex-1 hover:bg-white/70 transition-colors">
                  <input type="radio" name="role" value="lecturer" className="accent-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Lecturer</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit"
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
            >
              Sign In
            </button>
          </Form>
        </GlassPanel>
      </div>
    </div>
  );
}
