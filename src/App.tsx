import { useEffect, useRef } from 'react';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

function App() {
  const timelineRef = useRef<Timeline>(null);
  useEffect(() => {
    const container = document.getElementById('visualization');
    const items = new DataSet([
      { id: 1, content: 'item 1', start: '2025-04-20' },
      { id: 2, content: 'item 2', start: '2025-04-14' },
      { id: 3, content: 'item 3', start: '2025-04-18' },
      { id: 4, content: 'item 4', start: '2025-04-16', end: '2025-04-19' },
      { id: 5, content: 'item 5', start: '2025-04-25' },
      { id: 6, content: 'item 6', start: '2025-04-27', type: 'point' },
    ]);
    const timeline = new Timeline(container!, items, {
      showMajorLabels: true,
      showMinorLabels: true,
      format: { minorLabels: { day: 'ddd D' } },
    });
    timelineRef.current = timeline;
    console.log('Timeline initialized', timeline);
    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        console.log('Timeline destroyed');
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '1000px' }}>
      <p>Task Master Timeline</p>
      <div id='visualization' />
    </div>
  );
}

export default App;
