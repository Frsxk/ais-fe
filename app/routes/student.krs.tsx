import type { Route } from "./+types/student.krs";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { useState } from "react";
import { Check, Plus } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Course Registration (KRS) - Nusa AIS" }];
}

const AVAILABLE_COURSES = [
  { id: "CS301", name: "Data Structures", credits: 3, lecturer: "Dr. Anwar", schedule: "Mon 08:00" },
  { id: "CS302", name: "Web Programming", credits: 3, lecturer: "Prof. Sarah", schedule: "Tue 10:00" },
  { id: "CS303", name: "Database Systems", credits: 4, lecturer: "Dr. Budi", schedule: "Wed 13:00" },
  { id: "CS304", name: "Artificial Intelligence", credits: 3, lecturer: "Prof. Rian", schedule: "Thu 09:00" },
];

export default function StudentKRS() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  
  const toggleEnroll = (id: string) => {
    setEnrolled(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const totalCredits = AVAILABLE_COURSES
    .filter(c => enrolled.includes(c.id))
    .reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Course Registration" 
        subtitle="Select your courses for Semester 6"
        userName="Budi Santoso"
        role="Student"
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Available Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_COURSES.map(course => {
              const isEnrolled = enrolled.includes(course.id);
              return (
                <div 
                  key={course.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isEnrolled 
                      ? "bg-indigo-50/80 border-indigo-200 shadow-md shadow-indigo-100/50" 
                      : "bg-white/70 border-slate-200/60 hover:border-indigo-300/50 hover:shadow-md"
                  }`}
                  onClick={() => toggleEnroll(course.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{course.id}</span>
                    <button className={`p-1.5 rounded-full transition-colors ${
                      isEnrolled ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600"
                    }`}>
                      {isEnrolled ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5}/>}
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{course.name}</h4>
                  <p className="text-sm text-slate-500 mb-3">{course.lecturer} • {course.schedule}</p>
                  <div className="flex bg-white/50 w-fit px-3 py-1 rounded-full text-sm font-semibold text-slate-600 border border-slate-100">
                    {course.credits} Credits
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-1">
          <GlassCard className="sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200/50 pb-4">Registration Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Selected Courses</span>
                <span className="font-bold text-slate-800">{enrolled.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Credits</span>
                <span className="font-bold text-slate-800">{totalCredits} / 24</span>
              </div>
            </div>

            {enrolled.length > 0 ? (
              <div className="space-y-2 mb-6">
                {AVAILABLE_COURSES.filter(c => enrolled.includes(c.id)).map(course => (
                  <div key={course.id} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0">
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
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                enrolled.length > 0 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" 
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
