import type { Route } from "./+types/student.dashboard";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { BookOpen, TrendingUp, Calendar as CalIcon, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Student Dashboard - AIS-NG" }];
}

interface EnrollmentFromAPI {
  courseId: number;
  courseCode: string;
  courseName: string;
  creditWeight: number;
}

interface ScheduleFromAPI {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface GradeSummary {
  cumulativeGPA: number;
  semesters: { courses: { creditWeight: number }[] }[];
}

interface TodayClass {
  courseName: string;
  courseCode: string;
  startTime: string;
  endTime: string;
}

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentFromAPI[]>([]);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [grades, setGrades] = useState<GradeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [enr, gradeSummary] = await Promise.all([
          api.get<EnrollmentFromAPI[]>("/enrollments/me"),
          api.get<GradeSummary>("/grades/my/summary").catch(() => null),
        ]);
        setEnrollments(enr);
        setGrades(gradeSummary);

        const today = DAY_NAMES[new Date().getDay()];
        const classes: TodayClass[] = [];

        await Promise.all(
          enr.map(async (e) => {
            try {
              const schedules = await api.get<ScheduleFromAPI[]>(`/schedules/course/${e.courseId}`);
              schedules
                .filter(s => s.dayOfWeek === today)
                .forEach(s => classes.push({
                  courseName: e.courseName,
                  courseCode: e.courseCode,
                  startTime: s.startTime,
                  endTime: s.endTime,
                }));
            } catch { /* skip */ }
          })
        );

        classes.sort((a, b) => a.startTime.localeCompare(b.startTime));
        setTodayClasses(classes);
      } catch { /* will show empty */ }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  const totalEnrolledCredits = enrollments.reduce((s, e) => s + e.creditWeight, 0);
  const allGradedCredits = grades?.semesters.flatMap(s => s.courses).reduce((s, c) => s + c.creditWeight, 0) ?? 0;

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your academic progress"
        userName={user?.name || user?.email || ""}
        role="Student"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Cumulative GPA</p>
            <h3 className="text-2xl font-bold text-slate-800">{grades?.cumulativeGPA.toFixed(2) ?? "–"}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="bg-fuchsia-100 text-fuchsia-600 p-3 rounded-2xl shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Graded Credits</p>
            <h3 className="text-2xl font-bold text-slate-800">{allGradedCredits}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="bg-sky-100 text-sky-600 p-3 rounded-2xl shrink-0">
            <CalIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Current Enrollment</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalEnrolledCredits} SKS</h3>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="row-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CalIcon size={20} className="text-indigo-500" /> Today's Schedule
          </h3>
          <div className="space-y-4">
            {todayClasses.length > 0 ? todayClasses.map(cls => (
              <div key={`${cls.courseCode}-${cls.startTime}`} className="p-4 rounded-xl border border-slate-200/50 bg-white/40 hover:bg-white/60 transition-colors flex items-center gap-4">
                <div className="w-2 h-12 bg-indigo-500 rounded-full" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{cls.courseName}</h4>
                  <p className="text-sm text-slate-500">{cls.startTime.slice(0, 5)}–{cls.endTime.slice(0, 5)}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">No classes scheduled for today.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Enrolled Courses</h3>
          <div className="space-y-3">
            {enrollments.length > 0 ? enrollments.map(e => (
              <div key={e.courseId} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-semibold text-slate-800">{e.courseName}</p>
                  <p className="text-xs text-slate-400">{e.courseCode}</p>
                </div>
                <span className="font-semibold text-slate-600">{e.creditWeight} SKS</span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">No courses enrolled yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
