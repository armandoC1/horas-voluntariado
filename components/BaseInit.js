"use client";

import { useState } from "react";

function DatabaseInit({ onInitialized }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const initializeDatabase = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Base de datos inicializada correctamente");
        if (onInitialized) {
          setTimeout(() => {
            onInitialized();
          }, 2000);
        }
      } else {
        setMessage("❌ Error: " + data.message);
      }
    } catch (error) {
      setMessage("❌ Error de conexión: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="database-init">
      <div className="init-card">
        <h2>Inicializar Base de Datos</h2>
        <p>
          Las tablas de la base de datos necesitan ser creadas. Haz clic para
          inicializar:
        </p>

        <button
          onClick={initializeDatabase}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Creando tablas..." : "Crear Tablas"}
        </button>

        {message && (
          <div
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <style jsx>{`
        .database-init {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .init-card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          text-align: center;
        }

        .init-card h2 {
          color: #4f46e5;
          margin-bottom: 1rem;
        }

        .init-card p {
          margin-bottom: 2rem;
          color: #6b7280;
        }

        .message {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .message.success {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .message.error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
      `}</style>
    </div>
  );
}

export default DatabaseInit;
