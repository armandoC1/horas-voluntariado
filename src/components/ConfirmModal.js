"use client";

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className={`modal-icon ${type}`}>
            {type === "danger" && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {type === "warning" && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.29 3.86L1.82 18A2 2 0 0 0 3.24 21h17.52a2 2 0 0 0 1.42-3.14L13.71 3.86a2 2 0 0 0-3.42 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn-confirm ${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 400px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        .modal-header {
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          text-align: center;
        }

        .modal-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }

        .modal-icon.danger {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .modal-icon.warning {
          background-color: #fef3c7;
          color: #d97706;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .modal-body {
          padding: 0 1.5rem 1.5rem 1.5rem;
          text-align: center;
        }

        .modal-body p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .modal-footer {
          padding: 1rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .btn-cancel {
          background-color: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .btn-cancel:hover {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-confirm {
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          color: white;
        }

        .btn-confirm.danger {
          background-color: #dc2626;
        }

        .btn-confirm.danger:hover {
          background-color: #b91c1c;
        }

        .btn-confirm.warning {
          background-color: #d97706;
        }

        .btn-confirm.warning:hover {
          background-color: #b45309;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            margin: 1rem;
            width: calc(100% - 2rem);
          }

          .modal-footer {
            flex-direction: column;
          }

          .btn-cancel,
          .btn-confirm {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
