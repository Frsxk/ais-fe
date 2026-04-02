import type { Route } from "./+types/lecturer.grading.$courseId";
import { useParams, Link } from "react-router";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, AlertTriangle, ArrowLeft, Save, Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Grade Management - AIS-NG" }];
}

interface ComponentFromAPI {
  id: number;
  courseId: number;
  name: string;
  weight: number;
}

interface CourseFromAPI {
  id: number;
  code: string;
  name: string;
}

interface LocalComponent {
  id: number | null;
  name: string;
  weight: number;
  isNew: boolean;
  isDirty: boolean;
}

export default function LecturerGrading() {
  const { courseId: courseIdParam } = useParams();
  const courseId = Number(courseIdParam);
  const { user } = useAuth();

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [components, setComponents] = useState<LocalComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const [course, comps, publishStatus] = await Promise.all([
        api.get<CourseFromAPI>(`/courses/${courseId}`),
        api.get<ComponentFromAPI[]>(`/grades/components/${courseId}`),
        api.get<{ isPublished: boolean }>(`/grades/publish/${courseId}/status`),
      ]);
      setCourseName(course.name);
      setCourseCode(course.code);
      setComponents(comps.map(c => ({
        id: c.id, name: c.name, weight: c.weight, isNew: false, isDirty: false,
      })));
      setIsPublished(publishStatus.isPublished);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load", "error");
    }
    setLoading(false);
  }, [courseId]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const isWeightValid = totalWeight === 100;

  const addComponent = () => {
    setComponents(prev => [...prev, { id: null, name: "", weight: 0, isNew: true, isDirty: true }]);
  };

  const removeComponent = async (index: number) => {
    const comp = components[index];
    if (comp.id !== null) {
      try {
        await api.delete(`/grades/components/${comp.id}`);
        showToast("Component deleted", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Delete failed", "error");
        return;
      }
    }
    setComponents(prev => prev.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: "name" | "weight", value: string | number) => {
    setComponents(prev =>
      prev.map((c, i) =>
        i === index
          ? { ...c, [field]: field === "weight" ? Math.max(0, Math.min(100, Number(value))) : value, isDirty: true }
          : c
      )
    );
  };

  const handleSave = async () => {
    if (!isWeightValid) return;
    setSaving(true);

    try {
      for (const comp of components) {
        if (!comp.isDirty) continue;

        if (comp.isNew) {
          await api.post("/grades/components", {
            courseId,
            name: comp.name,
            weight: comp.weight,
          });
        } else if (comp.id !== null) {
          await api.put(`/grades/components/${comp.id}`, {
            name: comp.name,
            weight: comp.weight,
          });
        }
      }
      showToast("Components saved successfully", "success");
      await loadData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    }
    setSaving(false);
  };

  const handlePublishToggle = async () => {
    if (!isWeightValid) {
      showToast("Cannot publish: component weights must total 100%.", "error");
      return;
    }
    setTogglingPublish(true);
    try {
      const updated = await api.put<{ isPublished: boolean }>(`/grades/publish/${courseId}`);
      setIsPublished(updated.isPublished);
      showToast(updated.isPublished ? "Grades successfully published!" : "Grades unpublished successfully.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to toggle publish status", "error");
    }
    setTogglingPublish(false);
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
        title="Assessment Components"
        subtitle={`${courseCode} — ${courseName}`}
        userName={user?.name || user?.email || ""}
        role="Lecturer"
      />

      <Link to="/lecturer/courses" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to My Courses
      </Link>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-right duration-300 ${
          toast.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <GlassCard>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Components</h3>
              <button onClick={addComponent} className="flex items-center gap-2 bg-white/50 hover:bg-white text-slate-600 px-3 py-1.5 rounded-xl transition-colors shadow-sm font-medium text-xs">
                <Plus size={16} /> Add Component
              </button>
            </div>

            <div className="grid grid-cols-[1fr_120px_48px] gap-3 mb-3 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Component Name</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide text-center">Weight (%)</span>
              <span />
            </div>

            <div className="space-y-3">
              {components.map((comp, index) => (
                <div key={comp.id ?? `new-${index}`} className="grid grid-cols-[1fr_120px_48px] gap-3 items-center p-3 rounded-xl bg-white/50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={e => updateComponent(index, "name", e.target.value)}
                    placeholder="e.g., Midterm Exam"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={comp.weight}
                    onChange={e => updateComponent(index, "weight", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm text-slate-800 text-center tabular-nums"
                  />
                  <button onClick={() => removeComponent(index)} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" title="Remove component">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {components.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No assessment components defined. Click "Add Component" to begin.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="xl:col-span-1">
          <GlassCard className="sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200/50 pb-4">Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Components</span>
                <span className="font-bold text-slate-800">{components.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Weight</span>
                <span className={`font-bold ${isWeightValid ? "text-emerald-600" : "text-rose-600"}`}>{totalWeight}%</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${totalWeight > 100 ? "bg-rose-500" : totalWeight === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min(totalWeight, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-2 font-medium ${totalWeight === 100 ? "text-emerald-500" : totalWeight > 100 ? "text-rose-500" : "text-slate-400"}`}>
                {totalWeight === 100 ? "Weights balanced ✓" : totalWeight > 100 ? `${totalWeight - 100}% over — reduce weights` : `${100 - totalWeight}% remaining`}
              </p>
            </div>

            {!isWeightValid && totalWeight > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2 mb-6">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium">Component weights must total exactly 100% before saving.</p>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={!isWeightValid || components.length === 0 || saving}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mb-3 ${
                isWeightValid && components.length > 0
                  ? "bg-white/60 hover:bg-white text-indigo-600 border border-indigo-200/60 shadow-sm"
                  : "bg-white/30 text-slate-400 border border-slate-200/40 cursor-not-allowed"
              }`}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Components"}
            </button>
            <button
              onClick={handlePublishToggle}
              disabled={togglingPublish || components.length === 0}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isPublished
                  ? "bg-white/60 hover:bg-rose-50 text-rose-600 border border-rose-200/60 shadow-sm"
                  : "bg-white/60 hover:bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-sm"
              } disabled:opacity-50`}
            >
              {togglingPublish ? <Loader2 size={16} className="animate-spin" /> : null}
              {isPublished ? "Unpublish Grades" : "Publish Grades"}
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
