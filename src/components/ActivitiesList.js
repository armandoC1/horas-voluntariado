"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

function ActivitiesList({ activities, onActivityDeleted, onActivityEdit, onCreateClick, showToast }) {
  const [filterCycle, setFilterCycle] = useState("all");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    activityId: null,
    activityName: "",
  });

  const getAllCycles = () => {
    if (activities.length === 0) return [];
    return [...new Set(activities.map((activity) => activity.cycle))].sort(
      (a, b) => a - b,
    );
  };

  const formatTime12Hour = (timeString) => {
    if (!timeString) return "--:--";

    const [hours, minutes] = timeString.split(":");
    let hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour}:${minutes.padStart(2, "0")} ${ampm}`;
  };

  const handleDeleteClick = (id, name) => {
    setDeleteModal({
      isOpen: true,
      activityId: id,
      activityName: name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/activities/${deleteModal.activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        onActivityDeleted();
        showToast("Actividad eliminada correctamente", "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Error al eliminar la actividad", "error");
    }

    setDeleteModal({ isOpen: false, activityId: null, activityName: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, activityId: null, activityName: "" });
  };

  const downloadCSV = () => {
    let dataToExport = activities;
    if (filterCycle !== "all") {
      dataToExport = activities.filter(
        (activity) => activity.cycle === Number.parseInt(filterCycle),
      );
    }

    if (dataToExport.length === 0) {
      showToast("No hay actividades para exportar", "error");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Fecha,Actividad,Tipo,Lugar,Hora Entrada,Hora Salida,Horas,Ciclo\n";

    dataToExport.forEach((activity) => {
      const date = new Date(activity.date);
      const formattedDate = date.toLocaleDateString("es-ES");
      const formattedStartTime = formatTime12Hour(activity.start_time);
      const formattedEndTime = formatTime12Hour(activity.end_time);

      const row = [
        formattedDate,
        activity.name,
        activity.activity_type || "General",
        activity.location,
        formattedStartTime,
        formattedEndTime,
        activity.hours ? Number.parseFloat(activity.hours).toFixed(1) : "0.0",
        activity.cycle,
      ];

      const escapedRow = row.map((field) => {
        if (
          typeof field === "string" &&
          (field.includes(",") || field.includes("\n"))
        ) {
          return `"${field}"`;
        }
        return field;
      });

      csvContent += escapedRow.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    const fileName =
      filterCycle !== "all"
        ? `horas_voluntariado_ciclo_${filterCycle}.csv`
        : "horas_voluntariado_todos_ciclos.csv";

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Archivo CSV descargado correctamente", "success");
  };

  const filteredActivities =
    filterCycle === "all"
      ? activities
      : activities.filter(
          (activity) => String(activity.cycle) === String(filterCycle),
        );

  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <>
      <section className="activities-section">
        <div className="section-header">
          <h2>Registro de Actividades</h2>
          <div className="header-actions">
            <button className="create-activity-btn" onClick={onCreateClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Crear Actividad
            </button>
          </div>
        </div>

        <div className="filters-bar">
          <div className="filter">
            <label htmlFor="filter-cycle">Filtrar por ciclo:</label>
            <select
              id="filter-cycle"
              value={filterCycle}
              onChange={(e) => setFilterCycle(e.target.value)}
            >
              <option value="all">Todos</option>
              {getAllCycles().map((cycle) => (
                <option key={cycle} value={cycle}>
                  Ciclo {cycle}
                </option>
              ))}
            </select>
            <button onClick={downloadCSV} className="btn-secondary">
              Descargar CSV/Excel
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Actividad</th>
                <th>Lugar</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Horas / Tipo</th>
                <th>Ciclo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedActivities.map((activity) => {
                const date = new Date(activity.date);
                const formattedDate = date.toLocaleDateString("es-ES");
                const formattedStartTime = formatTime12Hour(
                  activity.start_time,
                );
                const formattedEndTime = formatTime12Hour(activity.end_time);

                const isNewSchema =
                  activity.activity_type !== null &&
                  activity.activity_type !== undefined;

                return (
                  <tr
                    key={activity.id}
                    style={{ animation: "fadeIn 0.3s ease" }}
                  >
                    <td>{formattedDate}</td>
                    <td>{activity.name}</td>
                    <td>{activity.location}</td>
                    <td>{formattedStartTime}</td>
                    <td>{formattedEndTime}</td>
                    <td>
                      {isNewSchema ? (
                        <span className={`type-badge ${activity.activity_type?.toLowerCase()}`}>
                          {activity.activity_type === "GRANDE" ? "Grande" : "Pequeña"}
                        </span>
                      ) : (
                        <span className="hours-badge">
                          {Number.parseFloat(activity.hours || 0).toFixed(1)}h
                          {activity.manual_hours && <span className="manual-indicator" title="Horas manuales">*</span>}
                        </span>
                      )}
                    </td>
                    <td>{activity.cycle}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => onActivityEdit(activity)}
                          title="Editar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteClick(activity.id, activity.name)}
                          title="Eliminar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sortedActivities.length === 0 && (
            <p
              style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
            >
              No hay actividades registradas
              {filterCycle !== "all" && ` para el ciclo ${filterCycle}`}
            </p>
          )}
        </div>
      </section>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar Actividad"
        message={`¿Estás seguro de que deseas eliminar la actividad "${deleteModal.activityName}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      <style jsx>{`
        /* Badges de tipo de actividad - diseño limpio */
        .type-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .type-badge.grande {
          background-color: #fff7ed;
          color: #9a3412;
          border: 1px solid #fdba74;
        }
        .type-badge.pequeña {
          background-color: #f0fdf4;
          color: #166534;
          border: 1px solid #86efac;
        }

        /* Badge de horas (esquema antiguo) */
        .hours-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background-color: #f3f4f6;
          color: #374151;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .manual-indicator {
          color: #d97706;
          font-size: 0.7rem;
          font-weight: 700;
        }

        /* Botones de acción */
        .action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .action-btn.edit {
          background-color: #eff6ff;
          color: #2563eb;
        }
        .action-btn.edit:hover {
          background-color: #dbeafe;
          transform: scale(1.1);
        }
        .action-btn.delete {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .action-btn.delete:hover {
          background-color: #fee2e2;
          transform: scale(1.1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default ActivitiesList;
