import type { Route } from "./+types/student.schedule";
import { PageHeader } from "../components/ui/PageHeader";
import {
  AVAILABLE_COURSES, DAYS, START_HOUR, END_HOUR,
  formatHour, getCourseColor,
  type CourseData, type TimeSlot,
} from "../data/courses";
import { MapPin } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Schedule - AIS-NG" }];
}

const ENROLLED_IDS = ["CS301", "CS304", "CS306", "CS308"];
const enrolledCourses = AVAILABLE_COURSES.filter(c => ENROLLED_IDS.includes(c.id));

const HOUR_HEIGHT = 64;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

function TimeBlock({ course, slot, colorIndex }: { course: CourseData; slot: TimeSlot; colorIndex: number }) {
  const color = getCourseColor(colorIndex);
  const top = (slot.startHour - START_HOUR) * HOUR_HEIGHT;
  const height = (slot.endHour - slot.startHour) * HOUR_HEIGHT;

  return (
    <div
      className={`absolute left-1 right-1 rounded-xl px-2.5 py-2 overflow-hidden border ${color.bg} ${color.border} ${color.text} transition-shadow hover:shadow-lg hover:z-10 cursor-default`}
      style={{ top: `${top}px`, height: `${height}px` }}
      title={`${course.name} — ${course.lecturer}\n${formatHour(slot.startHour)}–${formatHour(slot.endHour)}, ${course.room}`}
    >
      <p className="text-xs font-bold leading-tight truncate">{course.name}</p>
      {height >= 48 && (
        <p className="text-[11px] opacity-70 mt-0.5 truncate">
          {formatHour(slot.startHour)}–{formatHour(slot.endHour)}
        </p>
      )}
      {height >= 80 && (
        <p className="text-[11px] opacity-60 mt-1 flex items-center gap-1 truncate">
          <MapPin size={10} className="shrink-0" /> {course.room}
        </p>
      )}
    </div>
  );
}

export default function StudentSchedule() {
  const colorMap = new Map<string, number>();
  enrolledCourses.forEach((c, i) => colorMap.set(c.id, i));

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Class Schedule"
        subtitle="Your weekly timetable"
        userName="Budi Santoso"
        role="Student"
      />

      <div className="glass-panel rounded-2xl p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-slate-200/60 pb-3 mb-0">
            <div />
            {DAYS.map(day => (
              <div key={day} className="text-center">
                <span className="text-sm font-bold text-slate-700">{day}</span>
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
                    {formatHour(hour)}
                  </span>
                </div>
              ))}
            </div>

            {DAYS.map(day => (
              <div
                key={day}
                className="relative border-l border-slate-100/80"
                style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}
              >
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-slate-100/60"
                    style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
                  />
                ))}

                {enrolledCourses.map(course =>
                  course.schedule
                    .filter(slot => slot.day === day)
                    .map(slot => (
                      <TimeBlock
                        key={`${course.id}-${slot.day}-${slot.startHour}`}
                        course={course}
                        slot={slot}
                        colorIndex={colorMap.get(course.id) ?? 0}
                      />
                    ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {enrolledCourses.map((course, i) => {
          const color = getCourseColor(i);
          return (
            <div key={course.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${color.bg} ${color.border} ${color.text}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-current opacity-60" />
              {course.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
