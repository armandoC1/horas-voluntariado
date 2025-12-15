"use client";

import { useState } from "react";
import OtpVerification from "./OtpVerification"; // <--- Importamos el nuevo componente

function AuthForm({ onLogin, onRegister, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // ESTADOS NUEVOS
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

    if (!isLogin && formData.password !== formData.confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // LOGICA MODIFICADA AQUI
      if (data.success) {
        if (data.requireOtp) {
          // Si el servidor pide OTP, mostramos la otra pantalla
          setPendingEmail(data.email || formData.email);
          setShowOtp(true);
          showToast(data.message, "info");
        } else {
          // Fallback por si desactivas OTP en el futuro
          if (isLogin) onLogin(data.user, data.token);
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

  // MANEJADOR DE EXITO DEL OTP
  const handleOtpVerified = (user, token) => {
    if (isLogin) onLogin(user, token);
    else onRegister(user, token);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registro de Voluntariado</h1>

        {/* CONDICIONAL: Si mostramos OTP o el Formulario Normal */}
        {showOtp ? (
          <OtpVerification 
            email={pendingEmail}
            onVerified={handleOtpVerified}
            onCancel={() => setShowOtp(false)}
            showToast={showToast}
          />
        ) : (
          <div className="auth-form">
            <h2>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
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
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? "Cargando..."
                  : isLogin
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
              </button>
            </form>

            <p className="auth-switch">
              {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(!isLogin);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
              >
                {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;