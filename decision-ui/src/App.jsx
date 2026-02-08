import { useState, useMemo } from 'react';
import GoalTree from './components/GoalTree';
import GoalDetailPanel from './components/GoalDetailPanel';

const goalModules = import.meta.glob('./data/goals.json', { eager: true });
const realGoalData = goalModules['./data/goals.json'];

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  const goals = (realGoalData?.goals ?? realGoalData?.default?.goals) || [];

  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedId) || null,
    [goals, selectedId],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Enron Goal Tracker</h1>
        <span className="app-header__count">
          {goals.length} organizational goals extracted from {goals.reduce((n, g) => n + (g.emails?.length || 0), 0)} emails
        </span>
      </header>

      <div className="app-body">
        <GoalTree
          goals={goals}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selectedGoal ? (
          <GoalDetailPanel
            goal={selectedGoal}
            goals={goals}
            onClose={() => setSelectedId(null)}
            onNavigate={setSelectedId}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-state__content">
              <div className="empty-state__icon">&#9776;</div>
              <h2>Select a goal</h2>
              <p>Click on any goal in the hierarchy to see its KPIs, progress timeline, and supporting emails.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
