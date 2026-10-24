import React, { useEffect, useState } from 'react';
import {
  GanttScheduleTimelineCalendar,
  GanttScheduleTimelineCalendarProps,
} from '@neuronetio/gantt-schedule-timeline-calendar';
import { fetchProjectTimeline } from '../lib/mikeApi';

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

  if (loading) return <div className="p-4">Loading timeline...</div>;

  return (
    <div className="project-timeline h-full">
      <GanttScheduleTimelineCalendar {...config} />
    </div>
  );
};