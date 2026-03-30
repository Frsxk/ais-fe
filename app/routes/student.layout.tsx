import { Outlet } from "react-router";
import { NavigationMenu } from "../components/ui/NavigationMenu";

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen">
      <NavigationMenu isLecturer={false} />
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
