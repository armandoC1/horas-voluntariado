"use client";

import { useState, useEffect } from "react";

const HOURS_GOAL = 60;
const NEW_SCHEMA_YEAR = 2026;
const REQUIRED_ACTIVITIES = ["FERIA", "ENTRENO", "FESTIVAL"];

function Dashboard({ activities }) {
  const [selectedCycle, setSelectedCycle] = useState(null);

  const isActivityBased = (cycle) => {
    const cycleActivities = activities.filter((a) => a.cycle === cycle);
    if (cycleActivities.length === 0) return false;
    return cycleActivities.some(
      (a) => new Date(a.created_at).getFullYear() >= NEW_SCHEMA_YEAR,
    );
  };

  const getCurrentCycle = () => {
    if (activities.length === 0) return null;
    return Math.max(...activities.map((activity) => activity.cycle));
  };

  const getAllCycles = () => {
    if (activities.length === 0) return [];
    return [...new Set(activities.map((activity) => activity.cycle))].sort(
      (a, b) => a - b,
    );
  };

  const getHoursForCycle = (cycle) => {
    if (!cycle) return 0;
    return activities
      .filter((activity) => activity.cycle === cycle)
      .reduce(
        (total, activity) => total + Number.parseFloat(activity.hours || 0),
        0,
      );
  };

  const getActivityProgress = (cycle) => {
    const cycleActivities = activities.filter((a) => a.cycle === cycle);
    const completedTypes = cycleActivities.map((a) =>
      a.activity_type?.toUpperCase(),
    );
    const count = REQUIRED_ACTIVITIES.filter((type) =>
      completedTypes.includes(type),
    ).length;
    return {
      count,
      percentage: (count / REQUIRED_ACTIVITIES.length) * 100,
    };
  };

  useEffect(() => {
    if (!selectedCycle) {
      setSelectedCycle(getCurrentCycle());
    }
  }, [activities]);

  const currentCycle = selectedCycle || getCurrentCycle();

  const activityMode = isActivityBased(currentCycle);
  const hoursCompleted = getHoursForCycle(currentCycle);
  const activityProgress = getActivityProgress(currentCycle);

  const progressPercentage = activityMode
    ? activityProgress.percentage
    : Math.min(100, (hoursCompleted / HOURS_GOAL) * 100);
  const hoursRemaining = Math.max(0, HOURS_GOAL - hoursCompleted);

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
          {!activityMode ? (
            <>
              <p>
                Horas completadas: <span>{hoursCompleted.toFixed(1)}</span>
              </p>
              <p>
                Horas restantes: <span>{hoursRemaining.toFixed(1)}</span>
              </p>
            </>
          ) : (
            <>
              <p>
                Actividades completadas:{" "}
                <span>
                  {activityProgress.count} de {REQUIRED_ACTIVITIES.length}
                </span>
              </p>
              <p style={{ fontSize: "0.85em", marginTop: "5px", opacity: 0.8 }}>
                {REQUIRED_ACTIVITIES.map((type) => {
                  const done = activities.some(
                    (a) =>
                      a.cycle === currentCycle &&
                      a.activity_type?.toUpperCase() === type,
                  );
                  return (
                    <span key={type} style={{ marginRight: "10px" }}>
                      {done ? "✅" : "⚪"} {type}
                    </span>
                  );
                })}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="stats-card cycles">
        <h2>Ciclos</h2>
        <div className="cycle-list">
          {getAllCycles().map((cycle) => {
            const hours = getHoursForCycle(cycle);
            const isNew = isActivityBased(cycle);
            const act = getActivityProgress(cycle);

            return (
              <button
                key={cycle}
                className={`cycle-badge ${
                  cycle === selectedCycle ? "active" : ""
                }`}
                onClick={() => setSelectedCycle(cycle)}
              >
                Ciclo {cycle}:{" "}
                {isNew ? `${act.count}/3 Act.` : `${hours.toFixed(1)}h`}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
