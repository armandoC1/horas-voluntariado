"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Edición
  const [name, setName] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    loadProfile();
    loadSummary();
  }, [router]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setName(data.profile.name);
      }
    } catch (error) {
      console.error("Load profile error:", error);
    }
    setLoading(false);
  };

  const loadSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/activities/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Load summary error:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("El nombre es obligatorio", "error");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        showToast("Perfil actualizado correctamente", "success");
        setProfile((prev) => ({ ...prev, name: name.trim() }));
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      showToast("Error al actualizar perfil", "error");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showToast("La nueva contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showToast("Contraseña actualizada correctamente", "success");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Change password error:", error);
      showToast("Error al cambiar contraseña", "error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información y revisa tu progreso</p>
      </header>

      {/* Resumen Stats */}
      {summary && (
        <section className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{summary.totalActivities}</span>
              <span className="stat-label">Actividades</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon hours-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{summary.totalHours}h</span>
              <span className="stat-label">Horas totales</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon grande-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{summary.grandes}</span>
              <span className="stat-label">Grandes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pequena-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{summary.pequenas}</span>
              <span className="stat-label">Pequeñas</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon ciclo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{summary.ciclos}</span>
              <span className="stat-label">Ciclos</span>
            </div>
          </div>
        </section>
      )}

      {/* Información Personal */}
      <section className="profile-section">
        <h2>Información Personal</h2>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="profile-name">Nombre</label>
            <input
              type="text"
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="profile-email">Correo electrónico</label>
            <input
              type="email"
              id="profile-email"
              value={profile?.email || ""}
              disabled
              className="input-disabled"
            />
            <span className="field-hint">El correo no se puede modificar</span>
          </div>

          <div className="form-group">
            <label htmlFor="profile-created">Miembro desde</label>
            <input
              type="text"
              id="profile-created"
              value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("es-ES") : ""}
              disabled
              className="input-disabled"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </section>

      {/* Cambiar Contraseña */}
      <section className="profile-section">
        <h2>Seguridad</h2>
        
        {!showPasswordForm ? (
          <button 
            className="btn-secondary"
            onClick={() => setShowPasswordForm(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Cambiar Contraseña
          </button>
        ) : (
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="current-password">Contraseña Actual</label>
              <input
                type="password"
                id="current-password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="new-password">Nueva Contraseña</label>
              <input
                type="password"
                id="new-password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirm-password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
              <button 
                type="button" 
                className="btn-cancel-edit"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
