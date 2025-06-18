"use client";

import { useState, useEffect } from "react";

const HOURS_GOAL = 60;

function Dashboard({ activities }) {
  const [selectedCycle, setSelectedCycle] = useState(null);

  const getCurrentCycle = () => {
    if (activities.length === 0) return null;
    return Math.max(...activities.map((activity) => activity.cycle));
  };

  const getAllCycles = () => {
    if (activities.length === 0) return [];
    return [...new Set(activities.map((activity) => activity.cycle))].sort(
      (a, b) => a - b
    );
  };

  const getHoursForCycle = (cycle) => {
    if (!cycle) return 0;
    return activities
      .filter((activity) => activity.cycle === cycle)
      .reduce(
        (total, activity) => total + Number.parseFloat(activity.hours),
        0
      );
  };

  useEffect(() => {
    if (!selectedCycle) {
      setSelectedCycle(getCurrentCycle());
    }
  }, [activities]);

  const currentCycle = selectedCycle || getCurrentCycle();
  const hoursCompleted = getHoursForCycle(currentCycle);
  const hoursRemaining = Math.max(0, HOURS_GOAL - hoursCompleted);
  const progressPercentage = Math.min(100, (hoursCompleted / HOURS_GOAL) * 100);

  return (
    <section className="dashboard">
      <div className="stats-card current-cycle">
        <h2>
          Ciclo Actual: <span>{currentCycle || "-"}</span>
        </h2>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="stats">
          <p>
            Horas completadas: <span>{hoursCompleted.toFixed(1)}</span>
          </p>
          <p>
            Horas restantes: <span>{hoursRemaining.toFixed(1)}</span>
          </p>
        </div>
      </div>

      <div className="stats-card cycles">
        <h2>Ciclos</h2>
        <div className="cycle-list">
          {getAllCycles().map((cycle) => {
            const hours = getHoursForCycle(cycle);
            return (
              <button
                key={cycle}
                className={`cycle-badge ${
                  cycle === selectedCycle ? "active" : ""
                }`}
                onClick={() => setSelectedCycle(cycle)}
              >
                Ciclo {cycle}: {hours.toFixed(1)}h
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
