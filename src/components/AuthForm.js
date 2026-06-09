"use client";

import { useState } from "react";
import OtpVerification from "./OtpVerification";

function ResetPasswordForm({ onCancel, showToast }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        showToast("Código enviado a tu correo", "success");
      } else {
        showToast(data.message || "Error al solicitar código", "error");
      }
    } catch (err) {
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast("Contraseña actualizada. Inicia sesión.", "success");
        onCancel(); 
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{step === 1 ? "Recuperar Contraseña" : "Nueva Contraseña"}</h2>
      
      <form onSubmit={step === 1 ? handleRequestCode : handleResetPassword}>
        {step === 1 ? (
          <div className="form-group">
            <label htmlFor="reset-email">Correo Electrónico</label>
            <input
              type="email"
              id="reset-email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <>
            <p style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#666" }}>
              Hemos enviado el código a: <br/>
              <strong>{email}</strong>
            </p>


            <div className="form-group">
              <label htmlFor="reset-code">Código de Verificación</label>
              <input
                type="text"
                id="reset-code"
                className="form-input"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                style={{ textAlign: "center", letterSpacing: "5px" }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Nueva Contraseña</label>
              <input
                type="password"
                id="new-password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Procesando..." : (step === 1 ? "Enviar Código" : "Actualizar Contraseña")}
        </button>
      </form>

      <p className="auth-switch">
        <a href="#" onClick={(e) => { e.preventDefault(); onCancel(); }}>
          Volver al inicio de sesión
        </a>
      </p>
    </div>
  );
}

function AuthForm({ onLogin, onRegister, showToast }) {
  const [view, setView] = useState("login");
  
  const [showOtp, setShowOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isLoginMode = view === "login";

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
      
      const body = isLoginMode
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requireOtp) {
          setPendingEmail(data.email || formData.email);
          setShowOtp(true);
          showToast(data.message, "info");
        } else {
          if (isLoginMode) onLogin(data.user, data.token);
          else onRegister(data.user, data.token);
        }
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Auth error:", error);
      showToast("Error de conexión", "error");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpVerified = (user, token) => {
    if (view === "login") onLogin(user, token);
    else onRegister(user, token);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registro de Voluntariado</h1>

        {showOtp ? (
          <OtpVerification 
            email={pendingEmail}
            onVerified={handleOtpVerified}
            onCancel={() => setShowOtp(false)}
            showToast={showToast}
          />
        ) : view === "forgot" ? (

          <ResetPasswordForm 
            onCancel={() => setView("login")} 
            showToast={showToast} 
          />
        ) : (
          <div className="auth-form">
            <h2>{view === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

            <form onSubmit={handleSubmit}>
              {view === "register" && (
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>

              {view === "register" && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                </div>
              )}

              {view === "login" && (
                <div style={{ textAlign: "right", marginBottom: "1.5rem", marginTop: "-0.5rem" }}>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setView("forgot"); }}
                    style={{ fontSize: "0.9rem", color: "#666", textDecoration: "none" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? "Cargando..."
                  : view === "login"
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
              </button>
            </form>

            <p className="auth-switch">
              {view === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView(view === "login" ? "register" : "login");
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
              >
                {view === "login" ? "Regístrate aquí" : "Inicia sesión aquí"}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;