import "./globals.css"

export const metadata = {
  title: "Registro de Voluntariado CDev | Sistema para registrar horas de servicio social",
  description:
    "Plataforma desarrollada por CDev para registrar, gestionar y consultar horas de voluntariado de manera rápida y eficiente.",
  keywords: [
    "registro de voluntariado",
    "horas de servicio social",
    "Dirección de Integración",
    "plataforma de voluntariado",
    "control de horas",
    "registro de actividades"
  ],
  authors: [{ name: "CDev", url: "https://carloshernandez.site" }],
  openGraph: {
    title: "Registro de Voluntariado CDev",
    description:
      "Sistema moderno para registrar y administrar horas de voluntariado desarrollado por CDev.",
    url: "https://carloshernandez.site/", 
    siteName: "Registro de Voluntariado CDev",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Registro de Voluntariado CDev",
    description:
      "Gestiona y registra tus horas de servicio social con la plataforma de CDev.",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
