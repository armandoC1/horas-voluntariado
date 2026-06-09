"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActivityForm from "@/components/ActivityForm";
import ActivitiesList from "@/components/ActivitiesList";
import Toast from "@/components/Toast";
import { useActivities } from "@/hooks/useActivities";

export default function ActivitiesPage() {
  const router = useRouter();
  const { activities, reload } = useActivities();
  const [toast, setToast] = useState(null);
  const [activityToEdit, setActivityToEdit] = useState(null);

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

  const handleActivityCreated = () => {
    reload();
    showToast("Actividad registrada correctamente", "success");
  };

  const handleActivityUpdated = () => {
    reload();
    showToast("Actividad actualizada correctamente", "success");
    setActivityToEdit(null);
  };

  const handleActivityDeleted = () => {
    reload();
    showToast("Actividad eliminada correctamente", "success");
  };

  const handleActivityEdit = (activity) => {
    setActivityToEdit(activity);
    setTimeout(() => {
      const formSection = document.getElementById("activity-form-section");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "center" });
        const firstInput = formSection.querySelector("input");
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setActivityToEdit(null);
  };

  return (
    <div className="activities-page">
      <header className="page-header">
        <h1>Mis Actividades</h1>
        <p>Registra, edita y gestiona tus actividades de voluntariado</p>
      </header>

      <ActivityForm
        onActivityCreated={handleActivityCreated}
        onActivityUpdated={handleActivityUpdated}
        showToast={showToast}
        activityToEdit={activityToEdit}
        onCancelEdit={handleCancelEdit}
      />
      <ActivitiesList
        activities={activities}
        onActivityDeleted={handleActivityDeleted}
        onActivityEdit={handleActivityEdit}
        showToast={showToast}
      />

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
