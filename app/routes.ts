import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx", { id: "index" }),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  layout("routes/student.layout.tsx", [
    route("student", "routes/student.dashboard.tsx"),
    route("student/schedule", "routes/student.schedule.tsx"),
    route("student/krs", "routes/student.krs.tsx"),
    route("student/rhs", "routes/student.rhs.tsx"),
  ]),
  layout("routes/lecturer.layout.tsx", [
    route("lecturer", "routes/lecturer.dashboard.tsx"),
    route("lecturer/courses", "routes/lecturer.courses.tsx"),
    route("lecturer/courses/new", "routes/lecturer.courses.new.tsx"),
    route("lecturer/courses/:courseId", "routes/lecturer.courses.$courseId.tsx"),
    route("lecturer/courses/:courseId/student/:enrollmentId", "routes/lecturer.courses.$courseId.student.$enrollmentId.tsx"),
    route("lecturer/grading/:courseId", "routes/lecturer.grading.$courseId.tsx"),
  ])
] satisfies RouteConfig;
