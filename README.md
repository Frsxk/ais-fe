# Academic Information System - Next Generation (AIS-NG)

A modern, full-stack Academic Information System designed for managing university course registration, scheduling, and grading.

## Features

### Student Portal
- **Course Registration (KRS)**: Browse available courses, manage credit limits (max 24 SKS), and prevent scheduling conflicts.
- **Class Schedule**: View dynamic weekly timetable for all enrolled courses.
- **Study Results (RHS)**: Track completed academic transcripts and view published grades.
- **Dashboard**: Track enrollment statistics and overall progress.

### Lecturer Portal
- **Course Management**: Establish courses, assign schedules, and view enrolled students.
- **Assessment Management**: Configure custom grading components with strict 100% weight validation.
- **Grade Administration**: Assign individual student scores with automatic letter-grade projection mapping.
- **Grade Publishing**: Securely publish and unpublish grades to the student system.

## Tech Stack

- **Frontend**: React Router v7 framework
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Hosting**: Netlify

## Environment Variables

```
VITE_API_URL=http://localhost:3000
```

## Getting Started

1. Install required dependencies:
```bash
npm install
```

2. Launch the frontend development server:
```bash
npm run dev
```

The application runs at `http://localhost:5173`. Ensure the backend API is running.
