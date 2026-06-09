import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { generateAndSendOtp, verifyOTPCode } from "@/lib/otp";
import { checkRateLimit, resetPasswordLimiter } from "@/lib/rate-limit";
import { resetPasswordRequestSchema, resetPasswordUpdateSchema, validate } from "@/lib/schemas";

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = await checkRateLimit(resetPasswordLimiter, ip);
  
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ 
        message: `Demasiados intentos de recuperación. Intenta de nuevo en ${rateLimit.retryAfter} segundos.` 
      }),
      { 
        status: 429, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const body = await request.json();
    const validation = validate(body, resetPasswordRequestSchema);
    
    if (!validation.success) {
      return new Response(JSON.stringify({ message: validation.message }), { status: 400 });
    }

    const { email } = validation.data;
    const cleanEmail = email.trim().toLowerCase();

    const users = await query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    
    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "Este correo no está registrado" }), { status: 404 });
    }
    const emailSent = await generateAndSendOtp(cleanEmail);

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
    const body = await request.json();
    const validation = validate(body, resetPasswordUpdateSchema);
    
    if (!validation.success) {
      return new Response(JSON.stringify({ message: validation.message }), { status: 400 });
    }

    const { email, code, newPassword } = validation.data;
    const cleanEmail = email.trim().toLowerCase();

    const verification = await verifyOTPCode(cleanEmail, code);

    if (!verification.valid) {
      return new Response(JSON.stringify({ message: verification.message || "Código inválido o expirado" }), { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, cleanEmail]);

    return new Response(JSON.stringify({ success: true, message: "Contraseña actualizada correctamente" }), { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ message: "Error interno" }), { status: 500 });
  }
}