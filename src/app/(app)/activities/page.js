"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActivityForm from "@/components/ActivityForm";
import ActivitiesList from "@/components/ActivitiesList";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import { useActivities } from "@/hooks/useActivities";

export default function ActivitiesPage() {
  const router = useRouter();
  const { activities, reload } = useActivities();
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

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

  const handleOpenCreate = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleActivityCreated = () => {
    reload();
    showToast("Actividad registrada correctamente", "success");
    handleCloseModal();
  };

  const handleActivityUpdated = () => {
    reload();
    showToast("Actividad actualizada correctamente", "success");
    handleCloseModal();
  };

  const handleActivityDeleted = () => {
    reload();
    showToast("Actividad eliminada correctamente", "success");
  };

  return (
    <div className="activities-page">
      <header className="page-header">
        <h1>Mis Actividades</h1>
        <p>Registra, edita y gestiona tus actividades de voluntariado</p>
      </header>

      <ActivitiesList
        activities={activities}
        onActivityDeleted={handleActivityDeleted}
        onActivityEdit={handleOpenEdit}
        onCreateClick={handleOpenCreate}
        showToast={showToast}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingActivity ? "Editar Actividad" : "Registrar Nueva Actividad"}
        size="large"
      >
        <ActivityForm
          key={editingActivity ? editingActivity.id : "create"}
          onActivityCreated={handleActivityCreated}
          onActivityUpdated={handleActivityUpdated}
          showToast={showToast}
          activityToEdit={editingActivity}
          onClose={handleCloseModal}
        />
      </Modal>

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
