"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  // Detectar navegación entre páginas
  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        router.push("/");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      router.push("/");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/activities", label: "Actividades" },
    { href: "/about", label: "Acerca de" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background-light)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 1.5rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '3px solid transparent',
              borderTopColor: '#4f46e5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              inset: '6px',
              border: '3px solid transparent',
              borderBottomColor: '#818cf8',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite reverse'
            }} />
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: 500 }}>Verificando sesión...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-hidden" : ""}`}>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="mobile-title">Registro de Voluntariado</span>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <h2>Registro de Voluntariado</h2>
          </Link>
          {/* Collapse toggle - desktop only */}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            aria-label="Colapsar menú"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? (
                <>
                  <polyline points="9 18 15 12 9 6"></polyline>
                </>
              ) : (
                <>
                  <polyline points="15 18 9 12 15 6"></polyline>
                </>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => {
                setMobileMenuOpen(false);
                if (pathname !== item.href) {
                  setNavigating(true);
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-theme">
          <ThemeToggle />
        </div>

        <div className="sidebar-footer">
          <div className="user-name">{user?.name}</div>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Floating toggle when sidebar is collapsed on desktop */}
      {sidebarCollapsed && (
        <button
          className="sidebar-expand-floating"
          onClick={() => setSidebarCollapsed(false)}
          title="Expandir menú"
          aria-label="Expandir menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="app-main">
        {/* Indicador de navegación */}
        {navigating && (
          <div className="page-transition-indicator">
            <div className="page-transition-bar"></div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
