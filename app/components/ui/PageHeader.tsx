import { User } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  role?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, userName = "User", role = "Student", action }: PageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4 mb-8">
      {/* Title & User Badge Row */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight truncate leading-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 mt-1 text-sm sm:text-base truncate leading-normal">{subtitle}</p>}
        </div>

        <div className="sm:hidden flex items-center gap-2 px-1.5 py-1 rounded-full bg-white/40 border border-slate-200/50 shadow-sm pr-3 shrink-0">
          <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full">
            <User size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-tight max-w-[80px] truncate">{userName}</span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">{role}</span>
          </div>
        </div>
      </div>

      {/* Action & User Badge Row */}
      <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
        {action}

        <div className="hidden sm:flex items-center gap-3 px-2 py-1.5 rounded-full bg-white/40 border border-slate-200/50 shadow-sm pr-4 shrink-0 transition-all hover:bg-white/60">
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
