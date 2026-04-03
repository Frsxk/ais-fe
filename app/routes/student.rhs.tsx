import type { Route } from "./+types/student.rhs";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, TrendingUp, BookOpen, Award, Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Summary of Study Results (RHS) - AIS-NG" }];
}

interface CourseGradeFromAPI {
  courseCode: string;
  courseName: string;
  creditWeight: number;
  semesterId: number;
  finalScore: number;
  letterGrade: string;
  gradePoint: number;
}

interface SemesterFromAPI {
  semesterId: number;
  gpa: number;
  courses: CourseGradeFromAPI[];
}

interface GradeSummary {
  semesters: SemesterFromAPI[];
  cumulativeGPA: number;
}

function gradeColor(letter: string): string {
  if (letter.startsWith("A")) return "text-emerald-600 bg-emerald-50";
  if (letter.startsWith("B")) return "text-sky-600 bg-sky-50";
  if (letter.startsWith("C")) return "text-amber-600 bg-amber-50";
  if (letter === "D") return "text-orange-600 bg-orange-50";
  return "text-rose-600 bg-rose-50";
}

function SemesterBlock({ record }: { record: SemesterFromAPI }) {
  const [expanded, setExpanded] = useState(true);
  const totalCredits = record.courses.reduce((s, c) => s + c.creditWeight, 0);

  return (
    <GlassCard className="overflow-hidden p-0!">
      <button onClick={() => setExpanded(p => !p)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/30 transition-colors">
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
          <div className="text-left">
            <h3 className="font-bold text-slate-800">Semester {record.semesterId}</h3>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Credits</p>
            <p className="text-sm font-bold text-slate-700">{totalCredits}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">GPA</p>
            <p className={`text-sm font-bold ${record.gpa >= 3.5 ? "text-emerald-600" : record.gpa >= 3.0 ? "text-sky-600" : record.gpa >= 2.0 ? "text-amber-600" : "text-rose-600"}`}>
              {record.gpa.toFixed(2)}
            </p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 overflow-x-auto">
          <div className="min-w-[480px]">
          <div className="grid grid-cols-[1fr_60px_80px_80px] gap-2 px-6 py-3 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wide">
            <span>Course</span>
            <span className="text-center">Credits</span>
            <span className="text-center">Grade</span>
            <span className="text-center">Score</span>
          </div>
          {record.courses.map(course => (
            <div key={course.courseCode} className="grid grid-cols-[1fr_60px_80px_80px] gap-2 px-6 py-3 border-t border-slate-100/60 hover:bg-white/40 transition-colors items-center">
              <div>
                <p className="text-sm font-semibold text-slate-800">{course.courseName}</p>
                <p className="text-xs text-slate-400">{course.courseCode}</p>
              </div>
              <span className="text-sm text-slate-600 font-medium text-center">{course.creditWeight}</span>
              <div className="flex justify-center">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${gradeColor(course.letterGrade)}`}>
                  {course.letterGrade}
                </span>
              </div>
              <span className="text-sm text-slate-600 font-medium text-center tabular-nums">{course.finalScore.toFixed(1)}</span>
            </div>
          ))}
        </div>
        </div>
      )}
    </GlassCard>
  );
}

export default function StudentRHS() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<GradeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await api.get<GradeSummary>("/grades/my/summary");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load grades");
      }
      setLoading(false);
    }
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  const allCourses = summary?.semesters.flatMap(s => s.courses) ?? [];
  const totalCredits = allCourses.reduce((s, c) => s + c.creditWeight, 0);

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Summary of Study Results"
        subtitle="Complete academic transcript"
        userName={user?.name || user?.email || ""}
        role="Student"
      />

      {error && (
        <GlassCard className="text-center text-rose-500 text-sm">{error}</GlassCard>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="flex items-center gap-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl shrink-0"><TrendingUp size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Cumulative GPA</p>
                <h3 className="text-2xl font-bold text-slate-800">{summary.cumulativeGPA.toFixed(2)}</h3>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl shrink-0"><BookOpen size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Credits</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalCredits}</h3>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
              <div className="bg-fuchsia-100 text-fuchsia-600 p-3 rounded-2xl shrink-0"><Award size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Semesters</p>
                <h3 className="text-2xl font-bold text-slate-800">{summary.semesters.length}</h3>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            {summary.semesters.slice().reverse().map(record => (
              <SemesterBlock key={record.semesterId} record={record} />
            ))}
          </div>

          {summary.semesters.length === 0 && (
            <GlassCard className="text-center text-slate-400 py-12">
              No published grades yet.
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
