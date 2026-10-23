import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export function BackendControls() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    // On mount, try to start the backend
    invoke('start_backend').then(() => setRunning(true)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f0f0f0' }}>
      <p>Backend status: {running ? 'running' : 'stopped'}</p>
      <button onClick={() => invoke('stop_backend').then(() => setRunning(false)).catch(console.error)}>
        Stop backend
      </button>
    </div>
  );
}
