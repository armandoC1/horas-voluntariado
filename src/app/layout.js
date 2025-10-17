import "./globals.css"
import Script from 'next/script';


export const metadata = {
  title:
    "Registro de Horas de Voluntariado | Dirección de Integración de El Salvador - CDev",
  description:
    "Sistema digital creado por CDev para el registro y control de horas de voluntariado realizadas por los becarios del programa Dirección de Integración de El Salvador.",
  keywords: [
    "registro de voluntariado",
    "horas de voluntariado",
    "programa de becas El Salvador",
    "dirección de integración",
    "CDev",
    "control de horas de servicio social",
    "plataforma de voluntariado El Salvador"
  ],
  authors: [{ name: "CDev", url: "https://carloshernandez.site" }],
  openGraph: {
    title:
      "Registro de Horas de Voluntariado | Dirección de Integración de El Salvador - CDev",
    description:
      "Plataforma oficial para registrar y controlar las horas de voluntariado de becarios en la Dirección de Integración, desarrollada por CDev.",
    url: "https://horasvoluntariado.site", 
    siteName: "Registro de Voluntariado CDev",
    locale: "es_ES",
    type: "website",
    
  },
  
}


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head> 
        {/* === Google AdSense === */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2150979526953359"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* === Google Analytics (GA4) === */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9QRMBKM6CR"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9QRMBKM6CR');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
