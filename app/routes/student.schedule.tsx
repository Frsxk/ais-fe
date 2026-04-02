import type { Route } from "./+types/student.schedule";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";
import { BookMarked, Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Schedule - AIS-NG" }];
}

interface EnrollmentFromAPI {
  courseId: number;
  courseCode: string;
  courseName: string;
}

interface ScheduleFromAPI {
  id: number;
  courseId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface CalendarBlock {
  courseCode: string;
  courseName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  colorIndex: number;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri",
};
const START_HOUR = 7;
const END_HOUR = 18;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT = 64;
const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

const COURSE_COLORS = [
  { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-800" },
  { bg: "bg-fuchsia-100", border: "border-fuchsia-300", text: "text-fuchsia-800" },
  { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800" },
  { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-800" },
  { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-800" },
  { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-800" },
  { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800" },
];

function timeToDecimal(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function TimeBlock({ block }: { block: CalendarBlock }) {
  const color = COURSE_COLORS[block.colorIndex % COURSE_COLORS.length];
  const startDec = timeToDecimal(block.startTime);
  const endDec = timeToDecimal(block.endTime);
  const top = (startDec - START_HOUR) * HOUR_HEIGHT;
  const height = (endDec - startDec) * HOUR_HEIGHT;

  return (
    <div
      className={`absolute left-1 right-1 rounded-xl px-2.5 py-2 overflow-hidden border ${color.bg} ${color.border} ${color.text} transition-shadow hover:shadow-lg hover:z-10 cursor-default`}
      style={{ top: `${top}px`, height: `${height}px` }}
      title={`${block.courseName}\n${formatTime(block.startTime)}–${formatTime(block.endTime)}`}
    >
      <p className="text-xs font-bold leading-tight truncate">{block.courseName}</p>
      {height >= 48 && (
        <p className="text-[11px] opacity-70 mt-0.5 truncate">
          {formatTime(block.startTime)} - {formatTime(block.endTime)}
        </p>
      )}
      {height >= 80 && (
        <p className="text-[11px] opacity-60 mt-1 flex items-center gap-1 truncate">
          <BookMarked size={10} className="shrink-0" /> {block.courseCode}
        </p>
      )}
    </div>
  );
}

export default function StudentSchedule() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<CalendarBlock[]>([]);
  const [courseNames, setCourseNames] = useState<Map<string, { name: string; index: number }>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const enrollments = await api.get<EnrollmentFromAPI[]>("/enrollments/me");
        const nameMap = new Map<string, { name: string; index: number }>();
        enrollments.forEach((e, i) => nameMap.set(e.courseCode, { name: e.courseName, index: i }));
        setCourseNames(nameMap);

        const allBlocks: CalendarBlock[] = [];
        await Promise.all(
          enrollments.map(async (e) => {
            try {
              const schedules = await api.get<ScheduleFromAPI[]>(`/schedules/course/${e.courseId}`);
              schedules.forEach(s => {
                allBlocks.push({
                  courseCode: e.courseCode,
                  courseName: e.courseName,
                  dayOfWeek: s.dayOfWeek,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  colorIndex: nameMap.get(e.courseCode)?.index ?? 0,
                });
              });
            } catch { /* schedule doesn't exist */ }
          })
        );
        setBlocks(allBlocks);
      } catch { /* show empty */ }
      setLoading(false);
    }
    loadSchedule();
  }, []);

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
        title="Class Schedule"
        subtitle="Your weekly timetable"
        userName={user?.name || user?.email || ""}
        role="Student"
      />

      <div className="glass-panel rounded-2xl p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-slate-200/60 pb-3 mb-0">
            <div />
            {DAYS.map(day => (
              <div key={day} className="text-center">
                <span className="text-sm font-bold text-slate-700">{DAY_LABELS[day]}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[60px_repeat(5,1fr)] relative">
            <div className="relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
              {hours.map(hour => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 flex items-start"
                  style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                >
                  <span className="text-[11px] text-slate-400 font-medium -translate-y-1/2 pr-2 tabular-nums">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {DAYS.map(day => (
              <div key={day} className="relative border-l border-slate-100/80" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
                {hours.map(hour => (
                  <div key={hour} className="absolute left-0 right-0 border-t border-slate-100/60" style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }} />
                ))}
                {blocks.filter(b => b.dayOfWeek === day).map(block => (
                  <TimeBlock key={`${block.courseCode}-${block.startTime}`} block={block} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {blocks.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {Array.from(courseNames.entries()).map(([code, { name, index }]) => {
            const color = COURSE_COLORS[index % COURSE_COLORS.length];
            return (
              <div key={code} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${color.bg} ${color.border} ${color.text}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-current opacity-60" />
                {name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
