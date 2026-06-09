import { verifyPassword } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { generateAndSendOtp } from "../../../../../lib/otp";
import { checkRateLimit, loginLimiter } from "../../../../../lib/rate-limit";
import { loginSchema, validate } from "../../../../../lib/schemas";

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = await checkRateLimit(loginLimiter, ip);
  
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ 
        message: `Demasiados intentos. Intenta de nuevo en ${rateLimit.retryAfter} segundos.` 
      }),
      { 
        status: 429, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const body = await request.json();
    const validation = validate(body, loginSchema);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ message: validation.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password } = validation.data;
    const cleanEmail = email.trim().toLowerCase();

    const users = await query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [cleanEmail]
    );

    const user = users[0];

    // si no existe el usuario
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Credenciales incorrectas" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ message: "Credenciales incorrectas" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Intentando enviar OTP a: ${user.email}`);
    
    const emailSent = await generateAndSendOtp(user.email);

    if (!emailSent) {
      return new Response(
        JSON.stringify({ message: "Error al enviar el código de verificación." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Credenciales válidas. Verifique su correo.",
        requireOtp: true, 
        email: user.email,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}