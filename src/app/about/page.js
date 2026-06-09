"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-container">
          <h1>Acerca de este Sistema</h1>
          <p className="about-subtitle">
            Plataforma oficial para el registro y control de horas de
            voluntariado del programa de becas de la Dirección de Integración
            de El Salvador.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="about-container">
        <div className="about-grid">
          {/* ¿Qué es? */}
          <div className="about-card">
            <div className="about-card-icon">📋</div>
            <h2>¿Qué es?</h2>
            <p>
              Este sistema permite a los becarios registrar de forma digital
              las actividades de voluntariado que realizan como parte de su
              programa. Reemplaza el registro manual en papel, haciendo el
              proceso más eficiente, transparente y accesible.
            </p>
          </div>

          {/* ¿Para qué sirve? */}
          <div className="about-card">
            <div className="about-card-icon">🎯</div>
            <h2>¿Para qué sirve?</h2>
            <p>
              Facilita el seguimiento del progreso de horas de servicio social,
              permite visualizar estadísticas por ciclo, exportar reportes y
              mantener un historial completo de actividades en un solo lugar.
            </p>
          </div>

          {/* ¿Cómo funciona? */}
          <div className="about-card">
            <div className="about-card-icon">⚙️</div>
            <h2>¿Cómo funciona?</h2>
            <p>
              Los becarios crean una cuenta, registran cada actividad con fecha,
              lugar y horas dedicadas, y el sistema calcula automáticamente
              su progreso hacia la meta requerida. Todo queda guardado de
              forma segura.
            </p>
          </div>

          {/* Desarrollador */}
          <div className="about-card developer">
            <div className="about-card-icon">💻</div>
            <h2>Desarrollador</h2>
            <p>
              Este sistema fue desarrollado por{" "}
              <strong>CRivera</strong> con el objetivo de modernizar y
              simplificar el proceso de registro de voluntariado para la
              comunidad de becarios.
            </p>
            <p style={{ marginTop: "1rem" }}>
              <a
                href="https://armandodev.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="about-link"
              >
                Visitar sitio del desarrollador →
              </a>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2>¿Listo para empezar?</h2>
          <p>Regístrate o inicia sesión para comenzar a registrar tus actividades.</p>
          <div className="about-cta-buttons">
            <Link href="/" className="btn-primary about-btn">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>

      <footer className="about-footer">
        <p>
          &copy; 2026 CRivera. Todos los derechos reservados. -{" "}
          <a href="https://armandodev.site/">armandodev.site</a>
        </p>
      </footer>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: var(--background-light);
        }
        .about-hero {
          background: linear-gradient(135deg, var(--primary-color) 0%, #6366f1 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }
        .about-hero h1 {
          color: white;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .about-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .about-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: -2rem auto 3rem;
        }
        .about-card {
          background: white;
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow);
          text-align: center;
          transition: transform 0.2s ease;
        }
        .about-card:hover {
          transform: translateY(-4px);
        }
        .about-card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .about-card h2 {
          color: var(--primary-color);
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }
        .about-card p {
          color: var(--text-light);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .about-link {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
        }
        .about-link:hover {
          text-decoration: underline;
        }
        .about-cta {
          background: white;
          border-radius: var(--radius);
          padding: 3rem 2rem;
          box-shadow: var(--shadow);
          text-align: center;
          margin-bottom: 3rem;
        }
        .about-cta h2 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }
        .about-cta p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }
        .about-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .about-btn {
          display: inline-block;
          text-decoration: none;
          padding: 0.75rem 2rem;
        }
        .about-footer {
          text-align: center;
          padding: 2rem;
          color: var(--text-light);
          font-size: 0.875rem;
          border-top: 1px solid var(--border-color);
        }
        .about-footer a {
          color: var(--primary-color);
          text-decoration: none;
        }
        @media (max-width: 768px) {
          .about-hero h1 {
            font-size: 1.8rem;
          }
          .about-subtitle {
            font-size: 1rem;
          }
          .about-grid {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
