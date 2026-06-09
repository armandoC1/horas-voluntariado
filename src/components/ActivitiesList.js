"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ConfirmModal from "./ConfirmModal";

function ActivitiesList({
  activities,
  pagination,
  availableCycles,
  filterCycle,
  onCycleChange,
  onPageChange,
  onActivityDeleted,
  onActivityEdit,
  onCreateClick,
  showToast,
}) {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    activityId: null,
    activityName: "",
  });

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

  const fetchAllActivities = async () => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    if (filterCycle && filterCycle !== "all") params.append("cycle", filterCycle);

    const response = await fetch(`/api/activities/export?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al cargar actividades");
    const data = await response.json();
    return data.activities;
  };

  const exportCSV = async () => {
    try {
      const allActivities = await fetchAllActivities();

      if (allActivities.length === 0) {
        showToast("No hay actividades para exportar", "error");
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel
      csvContent +=
        "Fecha,Actividad,Tipo,Lugar,Hora Entrada,Hora Salida,Horas,Ciclo\n";

      allActivities.forEach((activity) => {
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
    } catch (error) {
      console.error("Export CSV error:", error);
      showToast("Error al exportar CSV", "error");
    }
  };

  const exportPDF = async () => {
    try {
      const allActivities = await fetchAllActivities();

      if (allActivities.length === 0) {
        showToast("No hay actividades para exportar", "error");
        return;
      }

      const doc = new jsPDF({ orientation: "landscape" });
      const title =
        filterCycle !== "all"
          ? `Registro de Voluntariado - Ciclo ${filterCycle}`
          : "Registro de Voluntariado - Todos los Ciclos";

      doc.setFontSize(16);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

      const body = allActivities.map((activity) => {
        const date = new Date(activity.date).toLocaleDateString("es-ES");
        return [
          date,
          activity.name,
          activity.activity_type || "General",
          activity.location,
          formatTime12Hour(activity.start_time),
          formatTime12Hour(activity.end_time),
          activity.hours ? Number.parseFloat(activity.hours).toFixed(1) + "h" : "-",
          activity.cycle,
        ];
      });

      autoTable(doc, {
        startY: 35,
        head: [["Fecha", "Actividad", "Tipo", "Lugar", "Entrada", "Salida", "Horas", "Ciclo"]],
        body,
        theme: "grid",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      const fileName =
        filterCycle !== "all"
          ? `horas_voluntariado_ciclo_${filterCycle}.pdf`
          : "horas_voluntariado_todos_ciclos.pdf";

      doc.save(fileName);
      showToast("PDF descargado correctamente", "success");
    } catch (error) {
      console.error("Export PDF error:", error);
      showToast("Error al generar PDF", "error");
    }
  };

  const { page, limit, total, totalPages } = pagination;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

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
              onChange={(e) => {
                onCycleChange(e.target.value);
              }}
            >
              <option value="all">Todos</option>
              {availableCycles.map((cycle) => (
                <option key={cycle} value={cycle}>
                  Ciclo {cycle}
                </option>
              ))}
            </select>
            <div className="export-buttons">
              <button onClick={exportCSV} className="btn-export btn-export-csv" title="Exportar CSV">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                CSV
              </button>
              <button onClick={exportPDF} className="btn-export btn-export-pdf" title="Exportar PDF">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M9 13h6"></path>
                  <path d="M9 17h6"></path>
                  <path d="M9 9h1"></path>
                </svg>
                PDF
              </button>
            </div>
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
              {activities.map((activity) => {
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

          {activities.length === 0 && (
            <p
              style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
            >
              No hay actividades registradas
              {filterCycle !== "all" && ` para el ciclo ${filterCycle}`}
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Mostrando <strong>{startItem}-{endItem}</strong> de <strong>{total}</strong> actividades
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Página anterior"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Anterior
              </button>

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-page ${pageNum === page ? "active" : ""}`}
                  onClick={() => onPageChange(pageNum)}
                  aria-label={`Página ${pageNum}`}
                  aria-current={pageNum === page ? "page" : undefined}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Página siguiente"
              >
                Siguiente
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
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
