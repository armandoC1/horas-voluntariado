"use client"

import { useState, useEffect } from "react"
import AuthForm from "../../components/AuthForm"
import Dashboard from "../../components/Dashboard"
import ChartsSection from "../../components/ChartsSection"
import ActivityForm from "../../components/ActivityForm"
import ActivitiesList from "../../components/ActivitiesList"
import Toast from "../../components/Toast"

export default function Home() {
  const [user, setUser] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        await loadActivities(token)
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("token")
    }

    setLoading(false)
  }

  const loadActivities = async (token = localStorage.getItem("token")) => {
    try {
      const response = await fetch("/api/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch (error) {
      console.error("Load activities error:", error)
    }
  }

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token)
    setUser(userData)
    loadActivities(token)
    showToast("Inicio de sesión exitoso", "success")
  }

  const handleRegister = (userData, token) => {
    localStorage.setItem("token", token)
    setUser(userData)
    loadActivities(token)
    showToast("Cuenta creada exitosamente", "success")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setActivities([])
    showToast("Sesión cerrada", "success")
  }

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleActivityCreated = () => {
    loadActivities()
    showToast("Actividad registrada correctamente", "success")
  }

  const handleActivityUpdated = () => {
    loadActivities()
    showToast("Actividad actualizada correctamente", "success")
  }

  const handleActivityDeleted = () => {
    loadActivities()
    showToast("Actividad eliminada correctamente", "success")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <>
      {!user ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} showToast={showToast} />
      ) : (
        <div className="container">
          <header>
            <div className="header-content">
              <h1>Registro de Voluntariado</h1>
              <div className="user-info">
                <span>{user.name}</span>
                <button onClick={handleLogout} className="btn-secondary">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          <main>
            <Dashboard activities={activities} />
            <ChartsSection activities={activities} />
            <ActivityForm
              onActivityCreated={handleActivityCreated}
              onActivityUpdated={handleActivityUpdated}
              showToast={showToast}
            />
            <ActivitiesList activities={activities} onActivityDeleted={handleActivityDeleted} showToast={showToast} />
          </main>

          <footer>
            <p>Sistema de Registro de Horas de Voluntariado</p>
            <p>&copy; 2025 CDev. Todos los derechos reservados. - <a href="https://carloshernandez.site/">Desarrollador</a></p>
          </footer>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
