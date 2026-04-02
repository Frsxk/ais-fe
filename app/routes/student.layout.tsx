import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { NavigationMenu } from "../components/ui/NavigationMenu";
import { useAuth } from "../lib/auth";

export default function StudentLayout() {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

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
      <NavigationMenu isLecturer={false} />
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
