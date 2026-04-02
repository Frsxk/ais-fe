import type { Route } from "./+types/lecturer.courses";
import { Link } from "react-router";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "My Courses - AIS-NG" }];
}

interface CourseFromAPI {
  id: number;
  code: string;
  name: string;
  creditWeight: number;
  quota: number;
  semesterId: number;
  lecturerId: number;
}

interface ScheduleFromAPI {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export default function LecturerCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [scheduleMap, setScheduleMap] = useState<Map<number, ScheduleFromAPI[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allCourses = await api.get<CourseFromAPI[]>("/courses");
        const mine = allCourses.filter(c => c.lecturerId === user?.id);
        setCourses(mine);

        const sMap = new Map<number, ScheduleFromAPI[]>();
        await Promise.all(
          mine.map(async (c) => {
            try {
              const schedules = await api.get<ScheduleFromAPI[]>(`/schedules/course/${c.id}`);
              sMap.set(c.id, schedules);
            } catch { /* skip */ }
          })
        );
        setScheduleMap(sMap);
      } catch { /* empty */ }
      setLoading(false);
    }
    load();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  const formatSchedule = (courseId: number): string => {
    const slots = scheduleMap.get(courseId) ?? [];
    if (slots.length === 0) return "No schedule";
    return slots.map(s => `${s.dayOfWeek.slice(0, 3)} ${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)}`).join(", ");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="My Courses"
        subtitle="Manage your classes and assign grades"
        userName={user?.name || user?.email || ""}
        role="Lecturer"
        action={
          <Link
            to="/lecturer/courses/new"
            className="flex items-center gap-2 bg-white/50 hover:bg-white text-slate-600 px-4 py-2 rounded-xl transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={18} /> Create Course
          </Link>
        }
      />

      {courses.length === 0 ? (
        <GlassCard className="text-center text-slate-400 py-12">
          No courses assigned to you yet.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <GlassCard key={course.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">{course.code}</span>
                <span className="text-xs text-slate-400 font-medium">{course.creditWeight} SKS</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{course.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{formatSchedule(course.id)}</p>
              <p className="text-xs text-slate-400 mb-6">Quota: {course.quota}</p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                <Link
                  to={`/lecturer/grading/${course.id}`}
                  className="flex-1 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
                >
                  Grade
                </Link>
                <Link
                  to={`/lecturer/courses/${course.id}`}  
                  className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                >
                  Details
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
