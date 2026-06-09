import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
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
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ color: '#4f46e5', marginBottom: '1rem' }}>
          Página no encontrada
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#4f46e5',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
