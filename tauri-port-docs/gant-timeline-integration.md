# Gantt‑Schedule‑Timeline‑Calendar Integration

Below is a quick guide to adding the **Gantt‑Schedule‑Timeline‑Calendar** library to the frontend of **Mike‑OSS**. The steps assume a React application but can be adapted to other frameworks.

---

## 1. Install the library

```bash
# npm or yarn
npm install @neuronetio/gantt-schedule-timeline-calendar
# or
yarn add @neuronetio/gantt-schedule-timeline-calendar
```

> **Note:** The library ships as a React component. If you’re using a different framework, you’ll need to wrap it or use a similar timeline component.

---

## 2. Create the Timeline component (React example)

```tsx
// src/components/ProjectTimeline.tsx
import React, { useEffect, useState } from 'react';
import {
  GanttScheduleTimelineCalendar,
  GanttScheduleTimelineCalendarProps,
} from '@neuronetio/gantt-schedule-timeline-calendar';
import { fetchProjectTimeline } from '../services/api';

type TimelineEvent = {
  id: string;
  name: string;
  start: string;   // ISO date
  end: string;     // ISO date
};

type ProjectTimelineProps = {
  projectId: string;
};

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projectId,
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProjectTimeline(projectId);
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const config: GanttScheduleTimelineCalendarProps = {
    // Minimal config – you can tweak it later
    events: events.map(e => ({
      id: e.id,
      title: e.name,
      start: new Date(e.start),
      end: new Date(e.end),
    })),
    // Other options...
  };

  if (loading) return <div>Loading timeline…</div>;

  return (
    <div className="project-timeline">
      <GanttScheduleTimelineCalendar {...config} />
    </div>
  );
};
```

---

## 3. API Client (React example)

```ts
// src/services/api.ts
export async function fetchProjectTimeline(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/timeline`);
  if (!res.ok) throw new Error('Failed to load timeline');
  return res.json(); // expects an array of {id, name, start, end}
}
```

---

## 4. Backend endpoint (Node/Express example)

```ts
// src/routes/projectRoutes.ts
import express from 'express';
import { getTimelineForProject } from '../controllers/projectController';

const router = express.Router();

router.get('/:id/timeline', async (req, res) => {
  const { id } = req.params;
  try {
    const timeline = await getTimelineForProject(id);
    res.json(timeline);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
// src/controllers/projectController.ts
import { ProjectTimelineEvent } from '../models/timelineEvent'; // your ORM model

export async function getTimelineForProject(projectId: string) {
  // Example using Prisma, Sequelize, or plain SQL
  return await ProjectTimelineEvent.findAll({
    where: { projectId },
    attributes: ['id', 'name', 'start', 'end'],
  });
}
```

---

## 5. Database schema (PostgreSQL example)

```sql
CREATE TABLE project_timeline_events (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  start TIMESTAMP NOT NULL,
  end TIMESTAMP NOT NULL
  -- optional: description, color, etc.
);
```

Add migration scripts or ORM models accordingly.

---

## 6. Layout – Timeline on the left

```tsx
// src/pages/MainApp.tsx
import React from 'react';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { Outlet } from 'react-router-dom';
import './MainApp.css'; // make sure to include this

const MainApp: React.FC = () => {
  // Assuming you have a selected project ID from context or router
  const selectedProjectId = '1234-...';

  return (
    <div className="main-app">
      <aside className="timeline-sidebar">
        <ProjectTimeline projectId={selectedProjectId} />
      </aside>
      <main className="content-area">
        <Outlet /> {/* rest of the app */}
      </main>
    </div>
  );
};

export default MainApp;
/* MainApp.css */
.main-app {
  display: flex;
  height: 100vh;
}
.timeline-sidebar {
  width: 320px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}
.content-area {
  flex: 1;
  overflow-y: auto;
}
```

---

## 7. Routing (React Router example)

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainApp from './pages/MainApp';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />}> 
          <Route index element={<Dashboard />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          {/* other routes */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 8. Final touches

1. **Styling** – tweak the calendar CSS if needed; the library exposes `className` props.
2. **Auth** – add JWT headers to `fetchProjectTimeline` if your API requires it.
3. **Pagination/Filtering** – if the project has many events, consider adding pagination or lazy‑loading in the API.
4. **Testing** – write unit tests for the component and integration tests for the endpoint.

---

### Next steps

1. Let me know which frontend framework and backend stack you’re using (React/Angular/Vue + Express/Django/etc.).
2. Share any existing project structure or routing setup so I can adapt the snippets accordingly.
3. If you already have a DB schema for projects, I can help you extend it with timeline events.

Once I have that, I’ll craft the exact files and code changes you need to drop into your repo. 🚀
