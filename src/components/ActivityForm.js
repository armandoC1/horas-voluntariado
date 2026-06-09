"use client";

import { useState, useEffect } from "react";

function ActivityForm({ onActivityCreated, onActivityUpdated, showToast }) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startHour: "8",
    startMinute: "00",
    startAmPm: "AM",
    endHour: "5",
    endMinute: "00",
    endAmPm: "PM",
    location: "",
    cycle: "",
    manualHours: "",
    activity_type: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    if (formData.date) {
      const year = new Date(formData.date).getFullYear();
      setIsNewYear(year >= 2026);
    }
  }, [formData.date]);

  const convert12hTo24h = (hour, minute, ampm) => {
    let hourInt = Number.parseInt(hour, 10);
    if (ampm === "PM" && hourInt < 12) hourInt += 12;
    else if (ampm === "AM" && hourInt === 12) hourInt = 0;
    return `${hourInt.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const calculateHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    let diff = end - start;
    if (diff < 0) diff += 24 * 60 * 60 * 1000;
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const startTime = convert12hTo24h(
      formData.startHour,
      formData.startMinute,
      formData.startAmPm,
    );
    const endTime = convert12hTo24h(
      formData.endHour,
      formData.endMinute,
      formData.endAmPm,
    );

    let hours = null;
    if (!isNewYear || formData.manualHours) {
      if (
        formData.manualHours &&
        !isNaN(Number.parseFloat(formData.manualHours))
      ) {
        hours = Number.parseFloat(formData.manualHours);
      } else {
        hours = calculateHours(startTime, endTime);
      }
    }

    const activityData = {
      name: formData.name,
      date: formData.date,
      start_time: isNewYear
        ? formData.startHour
          ? startTime
          : null
        : startTime,
      end_time: isNewYear ? (formData.endHour ? endTime : null) : endTime,
      location: formData.location,
      cycle: Number.parseInt(formData.cycle),
      hours: hours,
      manual_hours: !!formData.manualHours,
      activity_type: isNewYear ? formData.activity_type : null,
    };

    try {
      const token = localStorage.getItem("token");
      const url = editingId
        ? `/api/activities/${editingId}`
        : "/api/activities";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      const data = await response.json();

      if (data.success) {
        resetForm();
        if (editingId) {
          onActivityUpdated();
          setEditingId(null);
        } else {
          onActivityCreated();
        }
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Activity save error:", error);
      showToast("Error al guardar la actividad", "error");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      startHour: "8",
      startMinute: "00",
      startAmPm: "AM",
      endHour: "5",
      endMinute: "00",
      endAmPm: "PM",
      location: "",
      cycle: "",
      manualHours: "",
      activity_type: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="form-section">
      <h2 style={{ transition: "all 0.3s ease" }}>
        {editingId ? "Editar Actividad" : "Registrar Nueva Actividad"}
      </h2>

      <form onSubmit={handleSubmit} style={{ animation: "fadeIn 0.5s ease" }}>
        <div className="form-group">
          <label htmlFor="name">Nombre de la Actividad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Día</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {isNewYear && (
          <div
            className="form-group"
            style={{ animation: "slideDown 0.4s ease" }}
          >
            <label htmlFor="activity_type">Tipo de Actividad</label>
            <select
              id="activity_type"
              name="activity_type"
              value={formData.activity_type}
              onChange={handleChange}
              required={isNewYear}
              className="select-new-year"
            >
              <option value="">-- Seleccionar Tipo --</option>
              <option value="FERIA">Feria</option>
              <option value="ENTRENO">Entreno</option>
              <option value="FESTIVAL">Festival</option>
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Hora de Entrada {isNewYear && "(Opcional)"}</label>
            <div className="time-input-12h">
              <select
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                required={!isNewYear}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                name="startMinute"
                value={formData.startMinute}
                onChange={handleChange}
                required={!isNewYear}
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                name="startAmPm"
                value={formData.startAmPm}
                onChange={handleChange}
                required={!isNewYear}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Hora de Salida {isNewYear && "(Opcional)"}</label>
            <div className="time-input-12h">
              <select
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
                required={!isNewYear}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                name="endMinute"
                value={formData.endMinute}
                onChange={handleChange}
                required={!isNewYear}
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                name="endAmPm"
                value={formData.endAmPm}
                onChange={handleChange}
                required={!isNewYear}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Lugar</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cycle">Ciclo</label>
          <select
            id="cycle"
            name="cycle"
            value={formData.cycle}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar ciclo</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Ciclo {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="manualHours">
            {isNewYear ? "Horas Extra (Opcional)" : "Horas Manuales (opcional)"}
          </label>
          <input
            type="number"
            id="manualHours"
            name="manualHours"
            value={formData.manualHours}
            onChange={handleChange}
            step="0.1"
            min="0"
            placeholder={
              isNewYear
                ? "Puntos extra o tiempo"
                : "Dejar vacío para cálculo automático"
            }
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ transition: "transform 0.2s" }}
        >
          {loading
            ? "Guardando..."
            : editingId
              ? "Actualizar Actividad"
              : "Guardar Actividad"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingId(null);
              resetForm();
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .btn-primary:active {
          transform: scale(0.98);
        }
        .select-new-year {
          width: 100%;
          padding: 10px;
          border: 2px solid #0070f3;
          border-radius: 5px;
          background: #f0f7ff;
        }
      `}</style>
    </section>
  );
}

export default ActivityForm;
