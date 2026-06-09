"use client";

import { useState } from "react";

export default function OtpVerification({ email, onVerified, onCancel, showToast }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (code.length < 6) {
      showToast("El código debe tener 6 dígitos", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onVerified(data.user, data.token);
      } else {
        showToast(data.message || "Código incorrecto", "error");
      }
    } catch (error) {
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Verificación de Seguridad</h2>
      
      {/* Texto informativo manteniendo estilo limpio */}
      <p style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "0.9rem", opacity: 0.8 }}>
        Ingresa el código enviado a:<br/><strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otpCode">Código de Verificación</label>
          <input
            id="otpCode"
            type="text"
            className="form-input"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            required
            autoFocus
            style={{ 
              textAlign: "center", 
              letterSpacing: "0.5em", 
              fontWeight: "bold",
              fontSize: "1.2rem" 
            }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Verificando..." : "Confirmar Código"}
        </button>
      </form>

      <p className="auth-switch">
        ¿Te equivocaste de correo?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onCancel(); }}>
          Volver atrás
        </a>
      </p>
    </div>
  );
}