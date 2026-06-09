import { verifyPassword } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { generateAndSendOtp } from "../../../../../lib/otp";
import { checkRateLimit, loginLimiter } from "../../../../../lib/rate-limit";

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
    let { email, password } = await request.json();
    email = email.trim();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email y contraseña son obligatorios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const users = await query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
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