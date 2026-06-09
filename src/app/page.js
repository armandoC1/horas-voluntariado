"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import Toast from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    showToast("Inicio de sesión exitoso", "success");
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  const handleRegister = (userData, token) => {
    localStorage.setItem("token", token);
    showToast("Cuenta creada exitosamente", "success");
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="login-page">
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        showToast={showToast}
      />

      <div className="login-footer">
        <p>
          <Link href="/about">Acerca de este sistema</Link>
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
          &copy; 2026 CRivera
        </p>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--background-light);
          padding: 2rem 1rem;
        }
        .login-footer {
          margin-top: 2rem;
          text-align: center;
        }
        .login-footer a {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
        }
        .login-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
