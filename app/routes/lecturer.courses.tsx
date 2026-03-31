import type { Route } from "./+types/lecturer.courses";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "My Courses - AIS-NG" }];
}

const COURSES = [
  { id: "CS301", name: "Data Structures", room: "Lab A1", time: "Mon, 08:00 - 10:30", semester: "Odd" },
  { id: "CS305", name: "Operating Systems", room: "Room 402", time: "Tue, 13:00 - 15:30", semester: "Even" },
  { id: "CS401", name: "Computer Networks", room: "Lab N2", time: "Wed, 09:00 - 11:30", semester: "Odd" },
  { id: "CS403", name: "Software Engineering", room: "Room 101", time: "Thu, 10:00 - 12:30", semester: "Even" }
];

export default function LecturerCourses() {
  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="My Courses" 
        subtitle="Manage your classes and assign grades"
        userName="Dr. Anwar"
        role="Lecturer"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {COURSES.map((course) => (
          <GlassCard key={course.id} className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">{course.id}</span>
              <span className="text-xs text-slate-400 font-medium">Semester {course.semester}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{course.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{course.time} • {course.room}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
              <button className="flex-1 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                Grade
              </button>
              <button className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Details
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
