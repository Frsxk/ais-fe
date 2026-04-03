import type { Route } from "./+types/lecturer.courses.$courseId.student.$enrollmentId";
import { Link, useParams } from "react-router";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Save, Target } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Student Grade - AIS-NG" }];
}

interface Course {
  id: number;
  code: string;
  name: string;
  creditWeight: number;
}

interface Component {
  id: number;
  name: string;
  weight: number;
}

interface ScoreRecord {
  gradeId: number;
  enrollmentId: number;
  componentId: number;
  score: string | number;
}

export default function StudentGrade() {
  const { courseId, enrollmentId } = useParams();
  const cid = Number(courseId);
  const eid = Number(enrollmentId);
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const [scores, setScores] = useState<Record<number, string>>({});

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const [cData, compData, scoreData, enrollments] = await Promise.all([
        api.get<Course>(`/courses/${cid}`),
        api.get<Component[]>(`/grades/components/${cid}`),
        api.get<ScoreRecord[]>(`/grades/scores/${cid}`),
        api.get<any[]>(`/enrollments/course/${cid}`),
      ]);
      setCourse(cData);
      setComponents(compData);
      
      const currentEnrollment = enrollments.find(e => e.enrollmentId === eid);
      if (currentEnrollment) {
        setStudentName(currentEnrollment.studentName || currentEnrollment.studentEmail);
      }
      
      const newScores: Record<number, string> = {};
      scoreData.filter(s => s.enrollmentId === eid).forEach(s => {
        newScores[s.componentId] = String(s.score);
      });
      setScores(newScores);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [cid, eid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScoreChange = (componentId: number, val: string) => {
    setScores(prev => ({ ...prev, [componentId]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = components.map(c => {
        const val = scores[c.id];
        if (val !== undefined && val !== "") {
          return api.post("/grades/scores", {
            enrollmentId: eid,
            componentId: c.id,
            score: Number(val),
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      showToast("Grades saved successfully", "success");
      loadData();
    } catch {
      showToast("Failed to save grades", "error");
    }
    setSaving(false);
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }
  
  const projectedScore = components.reduce((acc, c) => {
    const val = Number(scores[c.id] || 0);
    return acc + (val * (c.weight / 100));
  }, 0);

  const getGradeLetter = (score: number) => {
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 40) return "D";
    return "E";
  };

  const gradeLetter = getGradeLetter(projectedScore);
  const getGradeColor = (letter: string) => {
    if (letter.startsWith("A")) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (letter.startsWith("B")) return "text-indigo-600 bg-indigo-50 border-indigo-200";
    if (letter.startsWith("C")) return "text-amber-600 bg-amber-50 border-amber-200";
    if (letter === "D") return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title={`Grading: ${studentName || "Student"}`}
        subtitle={`${course.name} (${course.code})`}
        userName={user?.name || user?.email || ""}
        role="Lecturer"
      />

      <Link
        to={`/lecturer/courses/${cid}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Course Details
      </Link>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-right duration-300 ${
          toast.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          <Target size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Target size={20} className="text-indigo-500" /> Grading Components
              </h3>
            </div>

            {components.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No grading components have been created for this course yet.<br/>
                <Link to={`/lecturer/grading/${cid}`} className="text-indigo-500 underline mt-2 inline-block">Manage Grading Components</Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {components.map(c => (
                    <div key={c.id} className="p-4 bg-white/60 rounded-xl border border-slate-200/50">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-slate-700">{c.name}</label>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{c.weight}% Weight</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Score (0-100)"
                        value={scores[c.id] || ""}
                        onChange={(e) => handleScoreChange(c.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-lg"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200/50">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-70"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Grades
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200/50 pb-2">Projection</h3>
            <div className="text-center flex flex-col items-center justify-center py-6 gap-2">
              <p className="text-6xl font-black text-slate-800 font-mono tracking-tight">
                {projectedScore.toFixed(1)}
              </p>
              <div className={`mt-2 px-4 py-1 border rounded-full font-bold text-lg inline-flex items-center justify-center ${getGradeColor(gradeLetter)}`}>
                {gradeLetter}
              </div>
              <p className="text-sm text-slate-500 mt-2 font-medium">Accumulated Final Score</p>
            </div>

          </GlassCard>
        </div>
      </div>
    </div>
  );
}
