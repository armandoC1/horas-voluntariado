"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="about-page">
      {/* Navbar */}
      <nav className="about-navbar">
        <div className="about-nav-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>Registro de Voluntariado</span>
        </div>
        <div className="about-nav-links">
          <Link href="/" className="about-nav-link">
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-badge">
            <span className="about-hero-badge-dot"></span>
            Proyecto Independiente
          </div>
          <h1>Registro Digital de Horas de Voluntariado</h1>
          <p className="about-hero-subtitle">
            Esta es una plataforma independiente creada para facilitar el seguimiento de actividades de servicio social. 
            <strong> No es una aplicación oficial de la Dirección de Integración (DI).</strong> Rápida, transparente y accesible desde cualquier dispositivo.
          </p>
          <div className="about-hero-cta">
            <Link href="/" className="btn-primary about-hero-btn">
              Comenzar Ahora
            </Link>
          </div>
        </div>
        <div className="about-hero-pattern"></div>
      </section>

      {/* Features */}
      <section className="about-section">
        <div className="about-section-header">
          <h2>¿Qué ofrece esta plataforma?</h2>
          <p>Herramientas diseñadas para simplificar el registro y seguimiento de voluntariado</p>
        </div>

        <div className="about-features">
          <div className="about-feature-card">
            <div className="about-feature-icon feature-register">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Registro Digital</h3>
            <p>Registra cada actividad con fecha, lugar, horas y tipo. Olvídate del papel y el Excel.</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon feature-progress">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>Seguimiento por Ciclo</h3>
            <p>Visualiza tu progreso organizado por ciclo. Controla actividades grandes y pequeñas.</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon feature-export">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h3>Exportar Reportes</h3>
            <p>Descarga tu historial en CSV o PDF para presentaciones y reportes oficiales.</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon feature-access">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3>Acceso Multi-dispositivo</h3>
            <p>Accede desde tu celular, tablet o computadora. Tu información siempre disponible.</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon feature-security">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Seguro y Privado</h3>
            <p>Autenticación con JWT, contraseñas encriptadas y rate limiting para proteger tu cuenta.</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon feature-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
            <h3>Modo Oscuro</h3>
            <p>Interfaz adaptable a tu preferencia. Modo claro u oscuro con transición suave.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="about-section about-section-alt">
        <div className="about-section-header">
          <h2>¿Cómo funciona?</h2>
          <p>Tres simples pasos para comenzar</p>
        </div>

        <div className="about-steps">
          <div className="about-step">
            <div className="about-step-number">1</div>
            <h3>Crea tu cuenta</h3>
            <p>Regístrate con tu correo institucional y configura tu contraseña.</p>
          </div>
          <div className="about-step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div className="about-step">
            <div className="about-step-number">2</div>
            <h3>Registra actividades</h3>
            <p>Ingresa fecha, lugar, horas y tipo de cada actividad de voluntariado.</p>
          </div>
          <div className="about-step-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div className="about-step">
            <div className="about-step-number">3</div>
            <h3>Visualiza y exporta</h3>
            <p>Revisa tu progreso, filtra por ciclo y exporta reportes cuando los necesites.</p>
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="about-section">
        <div className="about-dev">
          <div className="about-dev-avatar">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="about-dev-content">
            <h3>Desarrollado por CRivera</h3>
            <p>
              Este sistema fue creado con el objetivo de modernizar y simplificar 
              el proceso de registro de voluntariado para la comunidad de becarios 
              de la Dirección de Integración de El Salvador.
            </p>
            <a
              href="https://armandodev.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-dev-link"
            >
              Visitar sitio del desarrollador
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-content">
          <div className="about-footer-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>Registro de Voluntariado</span>
          </div>
          <p className="about-footer-copy">
            &copy; {new Date().getFullYear()} CRivera. Todos los derechos reservados.
          </p>
          <a href="https://armandodev.site/" target="_blank" rel="noopener noreferrer" className="about-footer-link">
            armandodev.site
          </a>
        </div>
      </footer>
    </div>
  );
}
