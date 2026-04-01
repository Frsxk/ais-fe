export interface TimeSlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  startHour: number;
  endHour: number;
}

export interface CourseData {
  id: string;
  name: string;
  credits: number;
  lecturer: string;
  room: string;
  schedule: TimeSlot[];
  capacity: number;
  enrolled: number;
}

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const START_HOUR = 7;
export const END_HOUR = 18;
export const MAX_CREDITS = 24;

export const AVAILABLE_COURSES: CourseData[] = [
  {
    id: "CS301", name: "Data Structures", credits: 3,
    lecturer: "Dr. Anwar", room: "Lab A1",
    schedule: [{ day: "Mon", startHour: 8, endHour: 10 }, { day: "Wed", startHour: 8, endHour: 10 }],
    capacity: 45, enrolled: 38,
  },
  {
    id: "CS302", name: "Web Programming", credits: 3,
    lecturer: "Prof. Sarah", room: "Lab B2",
    schedule: [{ day: "Tue", startHour: 10, endHour: 12.5 }],
    capacity: 40, enrolled: 40,
  },
  {
    id: "CS303", name: "Database Systems", credits: 4,
    lecturer: "Dr. Budi", room: "Room 301",
    schedule: [{ day: "Wed", startHour: 13, endHour: 15 }, { day: "Fri", startHour: 13, endHour: 15 }],
    capacity: 50, enrolled: 47,
  },
  {
    id: "CS304", name: "Artificial Intelligence", credits: 3,
    lecturer: "Prof. Rian", room: "Room 205",
    schedule: [{ day: "Thu", startHour: 9, endHour: 11.5 }],
    capacity: 35, enrolled: 20,
  },
  {
    id: "CS305", name: "Computer Networks", credits: 3,
    lecturer: "Dr. Dewi", room: "Lab N2",
    schedule: [{ day: "Fri", startHour: 8, endHour: 10 }],
    capacity: 40, enrolled: 33,
  },
  {
    id: "CS306", name: "Operating Systems", credits: 4,
    lecturer: "Prof. Hadi", room: "Room 402",
    schedule: [{ day: "Mon", startHour: 13, endHour: 15.5 }, { day: "Thu", startHour: 13, endHour: 15.5 }],
    capacity: 45, enrolled: 42,
  },
  {
    id: "CS307", name: "Software Engineering", credits: 3,
    lecturer: "Dr. Lina", room: "Room 101",
    schedule: [{ day: "Tue", startHour: 8, endHour: 10 }],
    capacity: 50, enrolled: 50,
  },
  {
    id: "CS308", name: "Mobile Development", credits: 3,
    lecturer: "Prof. Rudi", room: "Lab C3",
    schedule: [{ day: "Thu", startHour: 13, endHour: 15 }, { day: "Fri", startHour: 10, endHour: 12 }],
    capacity: 35, enrolled: 12,
  },
];

export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatSlot(slot: TimeSlot): string {
  return `${slot.day} ${formatHour(slot.startHour)}–${formatHour(slot.endHour)}`;
}
export function slotsOverlap(a: TimeSlot, b: TimeSlot): boolean {
  return a.day === b.day && a.startHour < b.endHour && b.startHour < a.endHour;
}

export function findConflict(
  candidate: CourseData,
  selectedIds: string[],
  allCourses: CourseData[]
): { conflictCourse: CourseData; candidateSlot: TimeSlot; conflictSlot: TimeSlot } | null {
  const selectedCourses = allCourses.filter(c => selectedIds.includes(c.id));

  for (const sel of selectedCourses) {
    for (const selSlot of sel.schedule) {
      for (const candSlot of candidate.schedule) {
        if (slotsOverlap(candSlot, selSlot)) {
          return { conflictCourse: sel, candidateSlot: candSlot, conflictSlot: selSlot };
        }
      }
    }
  }
  return null;
}

const COURSE_COLORS = [
  { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-800" },
  { bg: "bg-fuchsia-100", border: "border-fuchsia-300", text: "text-fuchsia-800" },
  { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800" },
  { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-800" },
  { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-800" },
  { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-800" },
  { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800" },
] as const;

export function getCourseColor(index: number) {
  return COURSE_COLORS[index % COURSE_COLORS.length];
}
