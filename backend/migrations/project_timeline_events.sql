-- Create project_timeline_events table
-- For Supabase/PostgreSQL compatibility
CREATE TABLE IF NOT EXISTS project_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start TIMESTAMP NOT NULL,
  end TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_timeline_events_project_id ON project_timeline_events(project_id);
CREATE INDEX IF NOT EXISTS idx_project_timeline_events_start ON project_timeline_events(start);
CREATE INDEX IF NOT EXISTS idx_project_timeline_events_end ON project_timeline_events(end);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_project_timeline_events_updated_at 
  BEFORE UPDATE ON project_timeline_events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();