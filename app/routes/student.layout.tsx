import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { NavigationMenu } from "../components/ui/NavigationMenu";
import { useAuth } from "../lib/auth";
import { Menu } from "lucide-react";

export default function StudentLayout() {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (user?.role !== "student") {
      navigate("/lecturer", { replace: true });
    }
  }, [isAuthenticated, user, navigate, isInitializing]);

  if (isInitializing || !isAuthenticated || user?.role !== "student") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <NavigationMenu isLecturer={false} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full max-w-[1400px] mx-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl glass-panel shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-fuchsia-100 p-1 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="AIS Logo" className="w-6 h-6 object-contain rounded" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">AIS-NG</span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
