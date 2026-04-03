import { NavLink, useNavigate, useLocation } from "react-router";
import { Home, Calendar, BookOpen, LogOut, Award, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/auth";
import { useEffect } from "react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  activePatterns?: string[];
  onClick?: () => void;
}

function NavItem({ to, icon: Icon, label, end, activePatterns, onClick }: NavItemProps) {
  const location = useLocation();
  const manualMatch = activePatterns?.some(pattern => location.pathname.startsWith(pattern));

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
          "hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600",
          (isActive || manualMatch) ? "bg-indigo-100/50 text-indigo-700 shadow-sm" : ""
        )
      }
    >
      <Icon size={20} className="stroke-[2.5]" />
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
}

interface NavigationMenuProps {
  isLecturer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function NavigationMenu({ isLecturer = false, isOpen = false, onClose }: NavigationMenuProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose?.();
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    onClose?.();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navContent = (
    <>
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-fuchsia-100 p-1.5 rounded-xl overflow-hidden">
              <img src="/logo.png" alt="AIS Logo" className="w-8 h-8 object-contain rounded-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              AIS-NG
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <NavItem to={isLecturer ? "/lecturer" : "/student"} icon={Home} label="Dashboard" end onClick={handleNavClick} />
          <NavItem 
            to={isLecturer ? "/lecturer/courses" : "/student/schedule"} 
            icon={Calendar} 
            label={isLecturer ? "My Courses" : "Schedule"} 
            activePatterns={isLecturer ? ["/lecturer/courses", "/lecturer/grading"] : undefined}
            onClick={handleNavClick}
          />
          {!isLecturer && (
            <>
              <NavItem to="/student/krs" icon={BookOpen} label="Course Registration" onClick={handleNavClick} />
              <NavItem to="/student/rhs" icon={Award} label="Grades" onClick={handleNavClick} />
            </>
          )}
        </div>
      </div>

      <div className="mt-auto p-6 pt-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-rose-50 text-slate-500 hover:text-rose-600 w-full"
        >
          <LogOut size={20} className="stroke-[2.5]" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="glass-panel w-64 rounded-3xl shadow-xl hidden lg:flex flex-col h-[calc(100vh-2rem)] m-4 overflow-hidden sticky top-4 shrink-0">
        {navContent}
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
          />
          <nav className="relative w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-300 z-10 border-r border-white/40 rounded-r-3xl">
            {navContent}
          </nav>
        </div>
      )}
    </>
  );
}
