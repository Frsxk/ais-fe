import { NavLink } from "react-router";
import { Home, Calendar, BookOpen, GraduationCap, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
          "hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600",
          isActive ? "bg-indigo-100/50 text-indigo-700 shadow-sm" : ""
        )
      }
    >
      <Icon size={20} className="stroke-[2.5]" />
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
}

export function NavigationMenu({ isLecturer = false }: { isLecturer?: boolean }) {
  return (
    <nav className="glass-panel w-64 rounded-3xl shadow-xl flex flex-col h-[calc(100vh-2rem)] m-4 overflow-hidden sticky top-4 shrink-0">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <GraduationCap size={24} className="stroke-[2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Nusa AIS
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <NavItem to={isLecturer ? "/lecturer" : "/student"} icon={Home} label="Dashboard" />
          <NavItem 
            to={isLecturer ? "/lecturer/courses" : "/student/schedule"} 
            icon={Calendar} 
            label={isLecturer ? "My Courses" : "Schedule"} 
          />
          {!isLecturer && (
            <NavItem to="/student/krs" icon={BookOpen} label="Course Registration" />
          )}
        </div>
      </div>

      <div className="mt-auto p-6 pt-2">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-rose-50 text-slate-500 hover:text-rose-600"
        >
          <LogOut size={20} className="stroke-[2.5]" />
          <span className="font-medium text-sm">Sign Out</span>
        </NavLink>
      </div>
    </nav>
  );
}
