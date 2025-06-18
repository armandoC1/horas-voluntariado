import "./globals.css"

export const metadata = {
  title: "Registro de Voluntariado",
  description: "Sistema de registro de horas de voluntariado",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
