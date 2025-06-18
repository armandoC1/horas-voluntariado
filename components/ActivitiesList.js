"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

function ActivitiesList({ activities, onActivityDeleted, showToast }) {
  const [filterCycle, setFilterCycle] = useState("all");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    activityId: null,
    activityName: "",
  });

  const getAllCycles = () => {
    if (activities.length === 0) return [];
    return [...new Set(activities.map((activity) => activity.cycle))].sort(
      (a, b) => a - b
    );
  };

  const formatTime12Hour = (timeString) => {
    if (!timeString) return "";

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
        }
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
        (activity) => activity.cycle === Number.parseInt(filterCycle)
      );
    }

    if (dataToExport.length === 0) {
      showToast("No hay actividades para exportar", "error");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Fecha,Actividad,Lugar,Hora Entrada,Hora Salida,Horas,Ciclo\n";

    dataToExport.forEach((activity) => {
      const date = new Date(activity.date);
      const formattedDate = date.toLocaleDateString("es-ES");
      const formattedStartTime = formatTime12Hour(activity.start_time);
      const formattedEndTime = formatTime12Hour(activity.end_time);

      const row = [
        formattedDate,
        activity.name,
        activity.location,
        formattedStartTime,
        formattedEndTime,
        Number.parseFloat(activity.hours).toFixed(1),
        activity.cycle,
      ];

      const escapedRow = row.map((field) => {
        if (typeof field === "string" && field.includes(",")) {
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
          (activity) => String(activity.cycle) === String(filterCycle)
          // (activity) => activity.cycle === Number.parseInt(filterCycle)
        );

  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <>
      <section className="activities-section">
        <div className="section-header">
          <h2>Registro de Actividades</h2>
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

        <div className="activities-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Actividad</th>
                <th>Lugar</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Horas</th>
                <th>Ciclo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedActivities.map((activity) => {
                const date = new Date(activity.date);
                const formattedDate = date.toLocaleDateString("es-ES");
                const formattedStartTime = formatTime12Hour(
                  activity.start_time
                );
                const formattedEndTime = formatTime12Hour(activity.end_time);

                return (
                  <tr key={activity.id}>
                    <td>{formattedDate}</td>
                    <td>{activity.name}</td>
                    <td>{activity.location}</td>
                    <td>{formattedStartTime}</td>
                    <td>{formattedEndTime}</td>
                    <td>
                      {Number.parseFloat(activity.hours).toFixed(1)}
                      {activity.manual_hours && " *"}
                    </td>
                    <td>{activity.cycle}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDeleteClick(activity.id, activity.name)
                        }
                      >
                        Eliminar
                      </button>
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
    </>
  );
}

export default ActivitiesList;
