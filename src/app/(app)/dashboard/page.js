"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import ChartsSection from "@/components/ChartsSection";
import Toast from "@/components/Toast";
import { useActivities } from "@/hooks/useActivities";

export default function DashboardPage() {
  const router = useRouter();
  const { activities, loading } = useActivities(1, 0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando actividades...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen de tu progreso de voluntariado</p>
      </header>

      <Dashboard activities={activities} />
      <ChartsSection activities={activities} />

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
