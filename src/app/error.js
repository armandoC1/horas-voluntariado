'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error en la aplicación:', error);
  }, [error]);

  return (
    <div className="error-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>
          Algo salió mal
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
          Hubo un error inesperado. Intenta recargar la página.
        </p>
        <button
          onClick={reset}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#818cf8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
