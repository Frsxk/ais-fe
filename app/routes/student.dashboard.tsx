import type { Route } from "./+types/student.dashboard";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { BookOpen, GraduationCap, TrendingUp, Calendar as CalIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Student Dashboard - AIS-NG" }];
}

const DASHBOARD_DATA = {
  name: "Budi Santoso",
  nim: "210456789",
  gpa: 3.84,
  credits: 114,
  semester: 6,
  upcomingClasses: [
    { id: 1, name: "Web Programming", time: "10:00 - 12:30", room: "Lab A1" },
    { id: 2, name: "Software Architecture", time: "13:30 - 15:00", room: "Room 402" },
  ]
};

export default function StudentDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your academic progress"
        userName={DASHBOARD_DATA.name}
        role="Student"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Cumulative GPA</p>
            <h3 className="text-2xl font-bold text-slate-800">{DASHBOARD_DATA.gpa}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="bg-fuchsia-100 text-fuchsia-600 p-3 rounded-2xl flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Credits</p>
            <h3 className="text-2xl font-bold text-slate-800">{DASHBOARD_DATA.credits}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="bg-sky-100 text-sky-600 p-3 rounded-2xl flex-shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Semester Target</p>
            <h3 className="text-2xl font-bold text-slate-800">Semester {DASHBOARD_DATA.semester}</h3>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="row-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CalIcon size={20} className="text-indigo-500"/> Today's Schedule
          </h3>
          <div className="space-y-4">
            {DASHBOARD_DATA.upcomingClasses.map((cls) => (
              <div key={cls.id} className="p-4 rounded-xl border border-slate-200/50 bg-white/40 hover:bg-white/60 transition-colors flex items-center gap-4">
                <div className="w-2 h-12 bg-indigo-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{cls.name}</h4>
                  <p className="text-sm text-slate-500">{cls.time} • {cls.room}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            <div className="pb-4 border-b border-slate-200/50">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">ACADEMIC</span>
              <h4 className="font-semibold text-slate-800">KRS Registration Opens Next Week</h4>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">Please ensure all administrative requirements are fulfilled before the KRS period begins on Monday.</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md mb-2 inline-block">FINANCE</span>
              <h4 className="font-semibold text-slate-800">Tuition Fee Payment Deadline</h4>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">A reminder that the final date for tuition fee payments for the upcoming semester is Friday the 24th.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
