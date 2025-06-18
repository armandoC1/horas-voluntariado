"use client";

import { useState } from "react";

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
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const convert12hTo24h = (hour, minute, ampm) => {
    let hourInt = Number.parseInt(hour, 10);

    if (ampm === "PM" && hourInt < 12) {
      hourInt += 12;
    } else if (ampm === "AM" && hourInt === 12) {
      hourInt = 0;
    }

    return `${hourInt.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const calculateHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    let diff = end - start;
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const startTime = convert12hTo24h(
      formData.startHour,
      formData.startMinute,
      formData.startAmPm
    );
    const endTime = convert12hTo24h(
      formData.endHour,
      formData.endMinute,
      formData.endAmPm
    );

    let hours;
    if (
      formData.manualHours &&
      !isNaN(Number.parseFloat(formData.manualHours))
    ) {
      hours = Number.parseFloat(formData.manualHours);
    } else {
      hours = calculateHours(startTime, endTime);
    }

    const activityData = {
      name: formData.name,
      date: formData.date,
      start_time: startTime,
      end_time: endTime,
      location: formData.location,
      cycle: Number.parseInt(formData.cycle),
      hours: hours,
      manual_hours: formData.manualHours ? true : false,
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
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="form-section">
      <h2>{editingId ? "Editar Actividad" : "Registrar Nueva Actividad"}</h2>

      <form onSubmit={handleSubmit}>
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

        <div className="form-row">
          <div className="form-group">
            <label>Hora de Entrada</label>
            <div className="time-input-12h">
              <select
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                required
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
                required
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <select
                name="startAmPm"
                value={formData.startAmPm}
                onChange={handleChange}
                required
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Hora de Salida</label>
            <div className="time-input-12h">
              <select
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
                required
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
                required
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <select
                name="endAmPm"
                value={formData.endAmPm}
                onChange={handleChange}
                required
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
          <label htmlFor="manualHours">Horas Manuales (opcional)</label>
          <input
            type="number"
            id="manualHours"
            name="manualHours"
            value={formData.manualHours}
            onChange={handleChange}
            step="0.1"
            min="0"
            placeholder="Dejar vacío para cálculo automático"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
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
    </section>
  );
}

export default ActivityForm;
