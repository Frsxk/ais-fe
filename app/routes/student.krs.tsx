import type { Route } from "./+types/student.krs";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect, useCallback } from "react";
import { Check, Plus, AlertTriangle, Users, X, Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Course Registration (KRS) - AIS-NG" }];
}

const MAX_CREDITS = 24;

interface CourseFromAPI {
  id: number;
  code: string;
  name: string;
  creditWeight: number;
  quota: number;
  semesterId: number;
  lecturerId: number;
}

interface EnrollmentFromAPI {
  enrollmentId: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  creditWeight: number;
}

interface ScheduleFromAPI {
  id: number;
  courseId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface EnrollmentCount {
  courseId: number;
  count: number;
}

export default function StudentKRS() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentFromAPI[]>([]);
  const [schedules, setSchedules] = useState<Map<number, ScheduleFromAPI[]>>(new Map());
  const [enrollmentCounts, setEnrollmentCounts] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        api.get<CourseFromAPI[]>("/courses"),
        api.get<EnrollmentFromAPI[]>("/enrollments/me"),
      ]);
      setCourses(coursesRes);
      setEnrollments(enrollmentsRes);

      const scheduleMap = new Map<number, ScheduleFromAPI[]>();
      const countMap = new Map<number, number>();

      await Promise.all(
        coursesRes.map(async (c) => {
          try {
            const sched = await api.get<ScheduleFromAPI[]>(`/schedules/course/${c.id}`);
            scheduleMap.set(c.id, sched);
          } catch { /* schedule may not exist */ }
        })
      );

      coursesRes.forEach(c => countMap.set(c.id, 0));

      setSchedules(scheduleMap);
      setEnrollmentCounts(countMap);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalCredits = enrollments.reduce((sum, e) => sum + e.creditWeight, 0);
  const remainingCredits = MAX_CREDITS - totalCredits;
  const creditPercentage = Math.min((totalCredits / MAX_CREDITS) * 100, 100);
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  const handleEnroll = async (course: CourseFromAPI) => {
    setActionLoading(course.id);
    try {
      await api.post("/enrollments", { courseId: course.id });
      showToast(`Enrolled in ${course.name}`, "success");
      await loadData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Enrollment failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDrop = async (course: CourseFromAPI) => {
    setActionLoading(course.id);
    try {
      await api.delete(`/enrollments/${course.id}`);
      showToast(`Dropped ${course.name}`, "success");
      await loadData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Drop failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const formatScheduleLabel = (courseId: number): string => {
    const slots = schedules.get(courseId) ?? [];
    if (slots.length === 0) return "Schedule TBD";
    return slots.map(s => `${s.dayOfWeek.slice(0, 3)} ${s.startTime.slice(0, 5)}–${s.endTime.slice(0, 5)}`).join(", ");
  };

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
        title="Course Registration"
        subtitle="Select your courses for the current semester"
        userName={user?.name || user?.email || ""}
        role="Student"
      />

      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-right duration-300 ${
            toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Available Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              const isProcessing = actionLoading === course.id;

              return (
                <div
                  key={course.id}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                    isEnrolled
                      ? "bg-indigo-50/80 border-indigo-200 shadow-md shadow-indigo-100/50 cursor-pointer"
                      : "bg-white/70 border-slate-200/60 hover:border-indigo-300/50 hover:shadow-md cursor-pointer"
                  }`}
                  onClick={() => {
                    if (isProcessing) return;
                    isEnrolled ? handleDrop(course) : handleEnroll(course);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{course.code}</span>
                    <button
                      className={`p-1.5 rounded-full transition-colors ${
                        isEnrolled
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600"
                      }`}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isEnrolled ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <Plus size={16} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>

                  <h4 className="font-bold text-lg mb-1 leading-tight text-slate-800">{course.name}</h4>
                  <p className="text-xs text-slate-400 mb-3">{formatScheduleLabel(course.id)}</p>

                  <div className="flex items-center gap-2">
                    <div className="flex bg-white/50 w-fit px-3 py-1 rounded-full text-sm font-semibold text-slate-600 border border-slate-100">
                      {course.creditWeight} SKS
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border bg-slate-50 text-slate-500 border-slate-100">
                      <Users size={12} /> Quota: {course.quota}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-1">
          <GlassCard className="sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-200/50 pb-4">Registration Summary</h3>

            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-medium text-slate-500">Credit Usage</span>
                <span className={`text-sm font-bold ${totalCredits > MAX_CREDITS ? "text-rose-600" : totalCredits >= MAX_CREDITS * 0.8 ? "text-amber-600" : "text-indigo-600"}`}>
                  {totalCredits} / {MAX_CREDITS} SKS
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    totalCredits > MAX_CREDITS ? "bg-rose-500" : totalCredits >= MAX_CREDITS * 0.8 ? "bg-amber-400" : "bg-indigo-500"
                  }`}
                  style={{ width: `${creditPercentage}%` }}
                />
              </div>
              <p className={`text-xs mt-2 font-medium ${remainingCredits <= 0 ? "text-rose-500" : remainingCredits <= 6 ? "text-amber-500" : "text-slate-400"}`}>
                {remainingCredits > 0 ? `${remainingCredits} credits remaining` : "Maximum credits reached"}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Enrolled Courses</span>
                <span className="font-bold text-slate-800">{enrollments.length}</span>
              </div>
            </div>

            {enrollments.length > 0 ? (
              <div className="space-y-2 mb-6">
                {enrollments.map(e => (
                  <div key={e.enrollmentId} className="flex justify-between items-center text-sm py-2.5 px-3 rounded-lg bg-white/40 border border-slate-100">
                    <span className="text-slate-700 truncate pr-4">{e.courseName}</span>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">{e.creditWeight} SKS</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No courses enrolled yet.
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
