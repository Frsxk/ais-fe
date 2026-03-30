import type { Route } from "./+types/lecturer.dashboard";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lecturer Dashboard - Nusa AIS" }];
}

export default function LecturerDashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Lecturer Dashboard" 
        subtitle="Manage your courses and students"
        userName="Dr. Anwar"
        role="Lecturer"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Active Courses</h3>
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><FileText size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">4</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Total Students</h3>
            <div className="bg-sky-100 text-sky-600 p-2 rounded-xl"><Users size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">142</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Pending Grades</h3>
            <div className="bg-amber-100 text-amber-600 p-2 rounded-xl"><Clock size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">12</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 font-medium text-sm">Advising Requests</h3>
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><CheckCircle size={18} /></div>
          </div>
          <span className="text-3xl font-bold text-slate-800">5</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard>
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Today's Classes</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/50 border border-slate-200/50 flex justify-between items-center hover:bg-white/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center font-bold">
                    <span className="text-xs">08:00</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Data Structures (CS301)</h4>
                    <p className="text-sm text-slate-500">Lab A1 • 45 Students</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg text-sm hover:bg-indigo-100 transition-colors">View Roster</button>
              </div>

              <div className="p-4 rounded-xl bg-white/50 border border-slate-200/50 flex justify-between items-center hover:bg-white/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex flex-col items-center justify-center font-bold">
                    <span className="text-xs">14:00</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Advanced Algorithms</h4>
                    <p className="text-sm text-slate-500">Room 302 • 30 Students</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-lg text-sm hover:bg-slate-200 transition-colors">View Roster</button>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Tasks</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="mt-0.5 text-amber-500"><Clock size={16} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Grade Midterm Exams</h4>
                  <p className="text-xs text-slate-500">Data Structures • Due in 2 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="mt-0.5 text-emerald-500"><CheckCircle size={16} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Approve KRS</h4>
                  <p className="text-xs text-slate-500">5 advisees waiting for approval</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
