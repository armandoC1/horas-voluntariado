"use client";

import { useState, useEffect } from "react";

const messages = [
  "Cargando...",
  "Preparando tus actividades...",
  "Obteniendo datos...",
  "Casi listo...",
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo/Icon */}
        <div className="loading-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Spinner */}
        <div className="spinner-container">
          <div className="spinner-ring"></div>
          <div className="spinner-ring spinner-ring-delayed"></div>
        </div>

        <div className="loading-text-container">
          <p className="loading-text" key={messageIndex}>
            {messages[messageIndex]}
          </p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          padding: 2rem;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          max-width: 300px;
          width: 100%;
        }

        .loading-icon {
          color: var(--primary-color);
          opacity: 0.8;
          animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .spinner-container {
          position: relative;
          width: 56px;
          height: 56px;
        }

        .spinner-ring {
          position: absolute;
          inset: 0;
          border: 3px solid transparent;
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-ring-delayed {
          border-top-color: transparent;
          border-bottom-color: var(--primary-light);
          animation: spin 1.5s linear infinite reverse;
          inset: 6px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text-container {
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .loading-text {
          color: var(--text-light);
          font-size: 0.95rem;
          font-weight: 500;
          text-align: center;
          margin: 0;
          animation: textFade 2s ease-in-out;
        }

        @keyframes textFade {
          0% { opacity: 0; transform: translateY(10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        .progress-bar-container {
          width: 200px;
          height: 4px;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
          border-radius: 9999px;
          animation: progressSlide 1.5s ease-in-out infinite;
        }

        @keyframes progressSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
