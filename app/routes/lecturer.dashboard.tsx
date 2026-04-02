import type { Route } from "./+types/lecturer.dashboard";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { Users, FileText, Calendar as CalIcon, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lecturer Dashboard - AIS-NG" }];
}

interface CourseFromAPI {
  id: number;
  code: string;
  name: string;
  creditWeight: number;
  quota: number;
  lecturerId: number;
}

interface ScheduleFromAPI {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface TodayClass {
  courseName: string;
  courseCode: string;
  startTime: string;
  endTime: string;
}

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<CourseFromAPI[]>([]);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const allCourses = await api.get<CourseFromAPI[]>("/courses");
        const owned = allCourses.filter(c => c.lecturerId === user?.id);
        setMyCourses(owned);

        const today = DAY_NAMES[new Date().getDay()];
        const classes: TodayClass[] = [];
        let studentCount = 0;

        await Promise.all(
          owned.map(async (c) => {
            try {
              const schedules = await api.get<ScheduleFromAPI[]>(`/schedules/course/${c.id}`);
              schedules
                .filter(s => s.dayOfWeek === today)
                .forEach(s => classes.push({
                  courseName: c.name,
                  courseCode: c.code,
                  startTime: s.startTime,
                  endTime: s.endTime,
                }));
            } catch { /* skip */ }

            try {
              const students = await api.get<unknown[]>(`/enrollments/course/${c.id}`);
              studentCount += students.length;
            } catch { /* skip */ }
          })
        );

        classes.sort((a, b) => a.startTime.localeCompare(b.startTime));
        setTodayClasses(classes);
        setTotalStudents(studentCount);
      } catch { /* empty */ }
      setLoading(false);
    }
    loadDashboard();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Lecturer Dashboard"
        subtitle="Manage your courses and students"
        userName={user?.name || user?.email || ""}
        role="Lecturer"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Active Courses</h3>
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><FileText size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{myCourses.length}</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Total Students</h3>
            <div className="bg-sky-100 text-sky-600 p-2 rounded-xl"><Users size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{totalStudents}</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Today's Classes</h3>
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><CalIcon size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{todayClasses.length}</span>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Today's Classes</h3>
        <div className="space-y-4">
          {todayClasses.length > 0 ? todayClasses.map(cls => (
            <div key={`${cls.courseCode}-${cls.startTime}`} className="p-4 rounded-xl bg-white/50 border border-slate-200/50 flex items-center gap-4 hover:bg-white/70 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center font-bold">
                <span className="text-xs">{cls.startTime.slice(0, 5)}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{cls.courseName} ({cls.courseCode})</h4>
                <p className="text-sm text-slate-500">{cls.startTime.slice(0, 5)}–{cls.endTime.slice(0, 5)}</p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-slate-400 text-center py-4">No classes scheduled for today.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
