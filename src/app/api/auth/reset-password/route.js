import { query } from "../../../../../lib/db";
import { hashPassword } from "../../../../../lib/auth";
import { generateAndSendOtp, verifyOTPCode } from "../../../../../lib/otp";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email requerido" }), { status: 400 });
    }

    const users = await query("SELECT id FROM users WHERE email = $1", [email]);
    
    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "Este correo no está registrado" }), { status: 404 });
    }
    const emailSent = await generateAndSendOtp(email);

    if (!emailSent) {
      return new Response(JSON.stringify({ message: "Error al enviar correo" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: "Código enviado" }), { status: 200 });

  } catch (error) {
    console.error("Reset request error:", error);
    return new Response(JSON.stringify({ message: "Error interno" }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return new Response(JSON.stringify({ message: "Faltan datos" }), { status: 400 });
    }

    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ message: "La contraseña debe tener al menos 6 caracteres" }), { status: 400 });
    }

    const verification = await verifyOTPCode(email, code);

    if (!verification.valid) {
      return new Response(JSON.stringify({ message: verification.message || "Código inválido o expirado" }), { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    return new Response(JSON.stringify({ success: true, message: "Contraseña actualizada correctamente" }), { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ message: "Error interno" }), { status: 500 });
  }
}