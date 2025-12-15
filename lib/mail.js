import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email, token) {
  try {
    const timeString = new Date().toLocaleTimeString();

    await transporter.sendMail({
      from: {
        name: "Horas Voluntariado",
        address: process.env.SMTP_USER,
      },
      to: email,
      subject: `Código ${token} - Solicitado a las ${timeString}`,
      text: `Tu código de acceso es: ${token}. Si no lo solicitaste, ignora este mensaje.`,
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
    
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="${
        process.env.NEXT_PUBLIC_APP_URL || "https://horasvoluntariado.site"
      }/favicon.ico" alt="Logo" style="width: 60px; height: 60px; border-radius: 12px;" />
    </div>
    
    <h2 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0 0 12px 0; letter-spacing: -0.5px; text-align: center;">
      Código de Acceso
    </h2>
    
    <p style="font-size: 15px; color: #666; margin: 0 0 32px 0; line-height: 1.5; text-align: center;">
      Usa el siguiente código para completar tu inicio de sesión:
    </p>
    
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%); padding: 32px 24px; border-radius: 16px; text-align: center; margin: 32px 0; border: 1px solid #c7d2fe;">
      <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #3730a3; font-family: 'Courier New', monospace;">
        ${token}
      </span>
    </div>
    
    <p style="font-size: 13px; color: #9ca3af; margin: 32px 0 0 0; line-height: 1.6; text-align: center;">
      Si no solicitaste este código, puedes ignorar este correo.
    </p>
    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        Desarrollado por <a href="https://armandodev.site/" style="color: #3730a3; text-decoration: none; font-weight: 500;">armandodev.site</a>
      </p>
    </div>
    
  </div>
`,
    });
    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
}
