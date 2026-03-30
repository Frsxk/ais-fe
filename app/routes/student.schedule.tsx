import type { Route } from "./+types/student.schedule";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Schedule - Nusa AIS" }];
}

export default function StudentSchedule() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Class Schedule" 
        subtitle="Your weekly timetable"
        userName="Budi Santoso"
        role="Student"
      />
      
      <GlassCard className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Schedule View Available Soon</h3>
        <p className="text-slate-500 max-w-md">The interactive weekly calendar view is being configured. Please check your dashboard for today's immediate classes.</p>
      </GlassCard>
    </div>
  );
}
