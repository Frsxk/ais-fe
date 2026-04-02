import type { Route } from "./+types/lecturer.courses.new";
import { Link, useNavigate } from "react-router";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Course - AIS-NG" }];
}

interface SemesterFromAPI {
  id: number;
  name: string;
}

export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [semesters, setSemesters] = useState<SemesterFromAPI[]>([]);
  const [loadingSemesters, setLoadingSemesters] = useState(true);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [creditWeight, setCreditWeight] = useState(3);
  const [quota, setQuota] = useState(40);
  const [semesterId, setSemesterId] = useState<number | "">("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSemesters() {
      try {
        const data = await api.get<SemesterFromAPI[]>("/semesters");
        setSemesters(data);
        if (data.length > 0) {
          setSemesterId(data[0].id);
        }
      } catch (err) {
        setError("Failed to load semesters. You may need to ask an administrator to create one.");
      }
      setLoadingSemesters(false);
    }
    loadSemesters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (semesterId === "") {
      setError("Please select a semester.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await api.post("/courses", {
        code,
        name,
        creditWeight: Number(creditWeight),
        quota: Number(quota),
        semesterId: Number(semesterId),
      });
      navigate("/lecturer/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Create New Course"
        subtitle="Add a new class to your teaching schedule"
        userName={user?.name || user?.email || ""}
        role="Lecturer"
      />

      <Link
        to="/lecturer/courses"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to My Courses
      </Link>

      <div className="max-w-2xl">
        <GlassCard>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {loadingSemesters ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
              <p className="text-sm">Loading form data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 focus-within:text-indigo-600">
                  <label htmlFor="code" className="text-sm font-semibold text-slate-700 ml-1">
                    Course Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CS101"
                    className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 uppercase"
                  />
                </div>

                <div className="space-y-1.5 focus-within:text-indigo-600">
                  <label htmlFor="semester" className="text-sm font-semibold text-slate-700 ml-1">
                    Semester
                  </label>
                  {semesters.length === 0 ? (
                     <div className="px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-medium">
                       No semesters available.
                     </div>
                  ) : (
                    <select
                      id="semester"
                      required
                      value={semesterId}
                      onChange={(e) => setSemesterId(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="" disabled>Select semester</option>
                      {semesters.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 focus-within:text-indigo-600">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">
                  Course Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Introduction to Computer Science"
                  className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 focus-within:text-indigo-600">
                  <label htmlFor="creditWeight" className="text-sm font-semibold text-slate-700 ml-1">
                    Credit Weight (SKS)
                  </label>
                  <input
                    id="creditWeight"
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={creditWeight}
                    onChange={(e) => setCreditWeight(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="space-y-1.5 focus-within:text-indigo-600">
                  <label htmlFor="quota" className="text-sm font-semibold text-slate-700 ml-1">
                    Class Quota (Students)
                  </label>
                  <input
                    id="quota"
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Link
                  to="/lecturer/courses"
                  className="px-6 py-2.5 rounded-xl font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving || semesters.length === 0}
                  className="px-6 py-2.5 rounded-xl font-medium bg-indigo-100/50 text-indigo-700 transition-colors shadow-md shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Create Course
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
