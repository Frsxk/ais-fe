import type { Route } from "./+types/student.krs";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useState } from "react";
import { Check, Plus, AlertTriangle, Lock, Users, X } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Course Registration (KRS) - AIS-NG" }];
}

const MAX_CREDITS = 24;

interface CourseData {
  id: string;
  name: string;
  credits: number;
  lecturer: string;
  schedule: string;
  capacity: number;
  enrolled: number;
}

const AVAILABLE_COURSES: CourseData[] = [
  { id: "CS301", name: "Data Structures", credits: 3, lecturer: "Dr. Anwar", schedule: "Mon 08:00", capacity: 45, enrolled: 38 },
  { id: "CS302", name: "Web Programming", credits: 3, lecturer: "Prof. Sarah", schedule: "Tue 10:00", capacity: 40, enrolled: 40 },
  { id: "CS303", name: "Database Systems", credits: 4, lecturer: "Dr. Budi", schedule: "Wed 13:00", capacity: 50, enrolled: 47 },
  { id: "CS304", name: "Artificial Intelligence", credits: 3, lecturer: "Prof. Rian", schedule: "Thu 09:00", capacity: 35, enrolled: 20 },
  { id: "CS305", name: "Computer Networks", credits: 3, lecturer: "Dr. Dewi", schedule: "Fri 08:00", capacity: 40, enrolled: 33 },
  { id: "CS306", name: "Operating Systems", credits: 4, lecturer: "Prof. Hadi", schedule: "Mon 13:00", capacity: 45, enrolled: 42 },
  { id: "CS307", name: "Software Engineering", credits: 3, lecturer: "Dr. Lina", schedule: "Wed 08:00", capacity: 50, enrolled: 50 },
  { id: "CS308", name: "Mobile Development", credits: 3, lecturer: "Prof. Rudi", schedule: "Thu 13:00", capacity: 35, enrolled: 12 },
];

export default function StudentKRS() {
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "error" | "warning" } | null>(null);

  const totalCredits = AVAILABLE_COURSES
    .filter(c => selected.includes(c.id))
    .reduce((sum, c) => sum + c.credits, 0);

  const remainingCredits = MAX_CREDITS - totalCredits;
  const creditPercentage = Math.min((totalCredits / MAX_CREDITS) * 100, 100);

  const showToast = (message: string, type: "error" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleEnroll = (course: CourseData) => {
    // Deselecting is always allowed
    if (selected.includes(course.id)) {
      setSelected(prev => prev.filter(c => c !== course.id));
      return;
    }

    // Block: class is full
    if (course.enrolled >= course.capacity) {
      showToast(`Cannot enroll in ${course.name} — class is full (${course.capacity}/${course.capacity}).`, "error");
      return;
    }

    // Block: would exceed credit limit
    if (totalCredits + course.credits > MAX_CREDITS) {
      showToast(`Adding ${course.name} (${course.credits} SKS) would exceed the ${MAX_CREDITS} credit limit. You have ${remainingCredits} credits remaining.`, "error");
      return;
    }

    setSelected(prev => [...prev, course.id]);
  };

  const getCourseStatus = (course: CourseData) => {
    if (course.enrolled >= course.capacity) return "full";
    if (!selected.includes(course.id) && totalCredits + course.credits > MAX_CREDITS) return "over-limit";
    return "available";
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Course Registration"
        subtitle="Select your courses for Semester 6"
        userName="Budi Santoso"
        role="Student"
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-right duration-300 ${
            toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
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
            {AVAILABLE_COURSES.map(course => {
              const isSelected = selected.includes(course.id);
              const status = getCourseStatus(course);
              const isFull = status === "full";
              const isOverLimit = status === "over-limit";
              const isDisabled = isFull || isOverLimit;

              return (
                <div
                  key={course.id}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "bg-indigo-50/80 border-indigo-200 shadow-md shadow-indigo-100/50 cursor-pointer"
                      : isFull
                        ? "bg-slate-50/50 border-slate-200/40 opacity-60 cursor-not-allowed"
                        : isOverLimit
                          ? "bg-amber-50/30 border-amber-200/40 opacity-70 cursor-not-allowed"
                          : "bg-white/70 border-slate-200/60 hover:border-indigo-300/50 hover:shadow-md cursor-pointer"
                  }`}
                  onClick={() => toggleEnroll(course)}
                >
                  {/* Full / Over-limit badge */}
                  {isFull && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Lock size={10} /> FULL
                    </div>
                  )}
                  {isOverLimit && !isFull && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <AlertTriangle size={10} /> EXCEEDS
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{course.id}</span>
                    <button
                      className={`p-1.5 rounded-full transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : isDisabled
                            ? "bg-slate-100 text-slate-300"
                            : "bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600"
                      }`}
                      disabled={isDisabled && !isSelected}
                    >
                      {isSelected ? <Check size={16} strokeWidth={3} /> : isDisabled ? <Lock size={14} /> : <Plus size={16} strokeWidth={2.5} />}
                    </button>
                  </div>

                  <h4 className={`font-bold text-lg mb-1 leading-tight ${isFull ? "text-slate-500 line-through" : "text-slate-800"}`}>
                    {course.name}
                  </h4>
                  <p className="text-sm text-slate-500 mb-3">{course.lecturer} • {course.schedule}</p>

                  <div className="flex items-center gap-2">
                    <div className="flex bg-white/50 w-fit px-3 py-1 rounded-full text-sm font-semibold text-slate-600 border border-slate-100">
                      {course.credits} SKS
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${
                      course.enrolled >= course.capacity
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : course.enrolled >= course.capacity * 0.9
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      <Users size={12} /> {course.enrolled}/{course.capacity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="xl:col-span-1">
          <GlassCard className="sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-200/50 pb-4">Registration Summary</h3>

            {/* Credit Progress Bar */}
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
                    totalCredits > MAX_CREDITS
                      ? "bg-rose-500"
                      : totalCredits >= MAX_CREDITS * 0.8
                        ? "bg-amber-400"
                        : "bg-indigo-500"
                  }`}
                  style={{ width: `${creditPercentage}%` }}
                />
              </div>
              <p className={`text-xs mt-2 font-medium ${remainingCredits <= 0 ? "text-rose-500" : remainingCredits <= 6 ? "text-amber-500" : "text-slate-400"}`}>
                {remainingCredits > 0
                  ? `${remainingCredits} credits remaining`
                  : "Maximum credits reached"}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Selected Courses</span>
                <span className="font-bold text-slate-800">{selected.length}</span>
              </div>
            </div>

            {selected.length > 0 ? (
              <div className="space-y-2 mb-6">
                {AVAILABLE_COURSES.filter(c => selected.includes(c.id)).map(course => (
                  <div key={course.id} className="flex justify-between items-center text-sm py-2.5 px-3 rounded-lg bg-white/40 border border-slate-100">
                    <span className="text-slate-700 truncate pr-4">{course.name}</span>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">{course.credits} SKS</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No courses selected yet.
              </div>
            )}

            <button
              disabled={selected.length === 0}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                selected.length > 0
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Confirm Registration
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
