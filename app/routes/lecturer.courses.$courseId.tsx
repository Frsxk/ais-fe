import type { Route } from "./+types/lecturer.courses.$courseId";
import { Link, useParams } from "react-router";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Plus, Clock, Users, Calendar, Trash2, Award } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Course Details - AIS-NG" }];
}

interface Course {
  id: number;
  code: string;
  name: string;
  creditWeight: number;
  quota: number;
}

interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface EnrolledStudent {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const cid = Number(courseId);
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newDay, setNewDay] = useState("monday");
  const [newStart, setNewStart] = useState("08:00");
  const [newEnd, setNewEnd] = useState("10:00");
  const [addingSchedule, setAddingSchedule] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [cData, schedData, stuData] = await Promise.all([
        api.get<Course>(`/courses/${cid}`),
        api.get<Schedule[]>(`/schedules/course/${cid}`),
        api.get<EnrolledStudent[]>(`/enrollments/course/${cid}`),
      ]);
      setCourse(cData);
      setSchedules(schedData);
      setStudents(stuData);
    } catch {
      // empty
    }
    setLoading(false);
  }, [cid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingSchedule(true);
    try {
      await api.post("/schedules", {
        courseId: cid,
        dayOfWeek: newDay,
        startTime: newStart,
        endTime: newEnd,
      });
      setShowAddSchedule(false);
      loadData();
    } catch {
      alert("Failed to add schedule.");
    }
    setAddingSchedule(false);
  };

  const removeSchedule = async (scheduleId: number) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      loadData();
    } catch {
      alert("Failed to delete schedule.");
    }
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title={course.name}
        subtitle={`${course.code} • ${course.creditWeight} SKS`}
        userName={user?.name || user?.email || ""}
        role="Lecturer"
      />

      <Link
        to="/lecturer/courses"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to My Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <GlassCard>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-500" /> Schedules
              </h3>
              {!showAddSchedule && (
                <button
                  onClick={() => setShowAddSchedule(true)}
                  className="flex items-center gap-2 bg-white/50 hover:bg-white text-slate-600 px-3 py-1.5 rounded-xl transition-colors shadow-sm font-medium text-xs"
                >
                  <Plus size={16} /> Add Schedule
                </button>
              )}
            </div>

            {showAddSchedule && (
              <form onSubmit={handleAddSchedule} className="mb-6 p-4 rounded-xl bg-white/50 border border-slate-200/60 flex flex-col gap-3">
                <select
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    required
                    value={newStart}
                    onChange={e => setNewStart(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <input
                    type="time"
                    required
                    value={newEnd}
                    onChange={e => setNewEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowAddSchedule(false)} className="text-xs font-semibold text-slate-500 px-3 py-1.5 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={addingSchedule} className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {addingSchedule ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {schedules.length > 0 ? schedules.map(s => (
                <div key={s.id} className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-slate-100">
                  <div className="flex gap-3 items-center">
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 capitalize">{s.dayOfWeek}</p>
                      <p className="text-xs text-slate-500">{s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeSchedule(s.id)} className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )) : (
                <p className="text-slate-400 text-sm text-center py-4">No schedules yet.</p>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={20} className="text-indigo-500" /> Enrolled Students
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {students.length} / {course.quota}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80">
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled At</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(st => (
                    <tr key={st.enrollmentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <p className="font-semibold text-slate-800">{st.studentName}</p>
                        <p className="text-xs text-slate-400 hidden sm:block">{st.studentEmail}</p>
                      </td>
                      <td className="py-4 text-slate-500">{new Date(st.enrolledAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right">
                        <Link
                          to={`/lecturer/courses/${cid}/student/${st.enrollmentId}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          <Award size={14} /> Grade Student
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        No students enrolled in this course yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
