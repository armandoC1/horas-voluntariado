import { hashPassword, generateToken } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { generateAndSendOtp } from "../../../../../lib/otp";
import { checkRateLimit, registerLimiter } from "../../../../../lib/rate-limit";

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = await checkRateLimit(registerLimiter, ip);
  
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ 
        message: `Demasiados registros. Intenta de nuevo en ${rateLimit.retryAfter} segundos.` 
      }),
      { 
        status: 429, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const { name, email, password } = await request.json();

    // validaciones
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Todos los campos son obligatorios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          message: "La contraseña debe tener al menos 6 caracteres",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Email inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingUsers = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ message: "El email ya está registrado" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await hashPassword(password);

    await query(
      "INSERT INTO users (name, email, password, is_verified) VALUES ($1, $2, $3, FALSE)",
      [name, email, hashedPassword]
    );

    const emailSent = await generateAndSendOtp(email);

    if (!emailSent) {
      return new Response(
        JSON.stringify({
          message: "Usuario creado pero falló el envío del correo",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usuario registrado. Por favor, verifica tu email",
        requireOtp: true,
        email: email,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
