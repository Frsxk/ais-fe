import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx", { id: "index" }), // use login component for index route
  route("login", "routes/login.tsx"),
  layout("routes/student.layout.tsx", [
    route("student", "routes/student.dashboard.tsx"),
    route("student/schedule", "routes/student.schedule.tsx"),
    route("student/krs", "routes/student.krs.tsx"),
  ]),
  layout("routes/lecturer.layout.tsx", [
    route("lecturer", "routes/lecturer.dashboard.tsx"),
    route("lecturer/courses", "routes/lecturer.courses.tsx"),
  ])
] satisfies RouteConfig;
