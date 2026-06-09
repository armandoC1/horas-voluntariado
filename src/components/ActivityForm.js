"use client";

import { useState, useEffect, useCallback } from "react";

function ActivityForm({ onActivityCreated, onActivityUpdated, showToast, activityToEdit, onClose }) {
  const initialForm = {
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
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    if (formData.date) {
      const year = new Date(formData.date).getFullYear();
      setIsNewYear(year >= 2026);
    }
  }, [formData.date]);

  // Cargar datos cuando se recibe una actividad para editar
  useEffect(() => {
    if (activityToEdit) {
      setEditingId(activityToEdit.id);
      setErrors({});
      
      let startHour = "8", startMinute = "00", startAmPm = "AM";
      let endHour = "5", endMinute = "00", endAmPm = "PM";
      
      if (activityToEdit.start_time) {
        const [hours24, minutes] = activityToEdit.start_time.split(":");
        let hourInt = parseInt(hours24);
        startAmPm = hourInt >= 12 ? "PM" : "AM";
        hourInt = hourInt % 12;
        hourInt = hourInt === 0 ? 12 : hourInt;
        startHour = String(hourInt);
        startMinute = minutes;
      }
      
      if (activityToEdit.end_time) {
        const [hours24, minutes] = activityToEdit.end_time.split(":");
        let hourInt = parseInt(hours24);
        endAmPm = hourInt >= 12 ? "PM" : "AM";
        hourInt = hourInt % 12;
        hourInt = hourInt === 0 ? 12 : hourInt;
        endHour = String(hourInt);
        endMinute = minutes;
      }

      setFormData({
        name: activityToEdit.name || "",
        date: activityToEdit.date ? new Date(activityToEdit.date).toISOString().split('T')[0] : "",
        startHour,
        startMinute,
        startAmPm,
        endHour,
        endMinute,
        endAmPm,
        location: activityToEdit.location || "",
        cycle: String(activityToEdit.cycle) || "",
        manualHours: activityToEdit.manual_hours && activityToEdit.hours ? String(activityToEdit.hours) : "",
        activity_type: activityToEdit.activity_type || "",
      });
    }
  }, [activityToEdit]);

  const convert12hTo24h = (hour, minute, ampm) => {
    let hourInt = Number.parseInt(hour, 10);
    if (ampm === "PM" && hourInt < 12) hourInt += 12;
    else if (ampm === "AM" && hourInt === 12) hourInt = 0;
    return `${hourInt.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const getStartTime = useCallback(() => {
    return convert12hTo24h(formData.startHour, formData.startMinute, formData.startAmPm);
  }, [formData.startHour, formData.startMinute, formData.startAmPm]);

  const getEndTime = useCallback(() => {
    return convert12hTo24h(formData.endHour, formData.endMinute, formData.endAmPm);
  }, [formData.endHour, formData.endMinute, formData.endAmPm]);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "name":
        return !value.trim() ? "El nombre es obligatorio" : null;
      case "date":
        if (!value) return "La fecha es obligatoria";
        const date = new Date(value);
        const today = new Date();
        const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        if (date > maxDate) return "La fecha no puede ser más de 1 año en el futuro";
        return null;
      case "activity_type":
        if (isNewYear && !value) return "Selecciona un tipo de actividad";
        return null;
      case "location":
        return !value.trim() ? "El lugar es obligatorio" : null;
      case "cycle":
        return !value ? "Selecciona un ciclo" : null;
      case "manualHours":
        if (value && Number.parseFloat(value) < 0) return "Las horas no pueden ser negativas";
        return null;
      default:
        return null;
    }
  }, [isNewYear]);

  const validateTimeRange = useCallback(() => {
    if (isNewYear) {
      // En new year horas son opcionales, pero si ambos están, validar
      const start = getStartTime();
      const end = getEndTime();
      if (start && end && end <= start) {
        return "La hora de salida debe ser después de la entrada";
      }
      return null;
    } else {
      const start = getStartTime();
      const end = getEndTime();
      if (end <= start) {
        return "La hora de salida debe ser después de la entrada";
      }
      return null;
    }
  }, [isNewYear, getStartTime, getEndTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo que se está editando
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    
    // Si cambian las horas, validar también el rango
    if (["startHour", "startMinute", "startAmPm", "endHour", "endMinute", "endAmPm"].includes(name)) {
      // Validar en el siguiente tick para que formData se actualice
      setTimeout(() => {
        const timeError = validateTimeRange();
        setErrors((prev) => ({ ...prev, timeRange: timeError }));
      }, 0);
    }
  };

  const isFormValid = useCallback(() => {
    const fieldErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) fieldErrors[key] = error;
    });
    const timeError = validateTimeRange();
    if (timeError) fieldErrors.timeRange = timeError;
    
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }, [formData, validateField, validateTimeRange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      showToast("Por favor corrige los errores del formulario", "error");
      return;
    }

    setLoading(true);

    const startTime = getStartTime();
    const endTime = getEndTime();

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
    setFormData(initialForm);
    setErrors({});
  };

  const calculateHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    let diff = end - start;
    if (diff < 0) diff += 24 * 60 * 60 * 1000;
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  };

  const inputErrorClass = (fieldName) => errors[fieldName] ? "input-error" : "";

  return (
    <div className="modal-form-wrapper">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Nombre de la Actividad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputErrorClass("name")}
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Día</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputErrorClass("date")}
            required
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
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
              className={`select-new-year ${inputErrorClass("activity_type")}`}
            >
              <option value="">-- Seleccionar Tipo --</option>
              <option value="GRANDE">Actividad Grande</option>
              <option value="PEQUEÑA">Actividad Pequeña</option>
            </select>
            {errors.activity_type && <span className="field-error">{errors.activity_type}</span>}
          </div>
        )}

        <div className={`form-row ${errors.timeRange ? "time-error" : ""}`}>
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
        {errors.timeRange && (
          <span className="field-error time-range-error">{errors.timeRange}</span>
        )}

        <div className="form-group">
          <label htmlFor="location">Lugar</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={inputErrorClass("location")}
            required
          />
          {errors.location && <span className="field-error">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cycle">Ciclo</label>
          <select
            id="cycle"
            name="cycle"
            value={formData.cycle}
            onChange={handleChange}
            className={inputErrorClass("cycle")}
            required
          >
            <option value="">Seleccionar ciclo</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Ciclo {i + 1}
              </option>
            ))}
          </select>
          {errors.cycle && <span className="field-error">{errors.cycle}</span>}
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
            className={inputErrorClass("manualHours")}
            placeholder={
              isNewYear
                ? "Puntos extra o tiempo"
                : "Dejar vacío para cálculo automático"
            }
          />
          {errors.manualHours && <span className="field-error">{errors.manualHours}</span>}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
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
            onClick={() => {
              setEditingId(null);
              resetForm();
              if (onClose) onClose();
            }}
            className="btn-cancel-edit"
          >
            Cancelar edición
          </button>
        )}
      </form>
    </div>
  );
}

export default ActivityForm;
