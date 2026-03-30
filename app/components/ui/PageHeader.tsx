import { Bell, User } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  role?: string;
}

export function PageHeader({ title, subtitle, userName = "User", role = "Student" }: PageHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-full bg-white/50 hover:bg-white text-slate-600 transition-all border border-slate-200/50 shadow-sm relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 px-2 py-1.5 rounded-full bg-white/40 border border-slate-200/50 shadow-sm pr-4">
          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800 leading-tight">{userName}</span>
            <span className="text-xs text-slate-500 leading-tight">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
