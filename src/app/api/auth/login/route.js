import { verifyPassword } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { generateAndSendOtp } from "../../../../../lib/otp";

export async function POST(request) {
  try {
    // 1. Limpiamos el email (quitar espacios accidentales)
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

    // 2. Buscar usuario en la base de datos
    const users = await query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
    );

    const user = users[0];

    // Si no existe el usuario
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Credenciales incorrectas" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. VERIFICACIÓN DE CONTRASEÑA (ACTIVA)
    // Comparamos la contraseña que escribió con la encriptada en la DB
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

    // 4. Generar y Enviar OTP
    // Usamos user.email para asegurar que se envía al correo registrado
    console.log(`Intentando enviar OTP a: ${user.email}`);
    
    const emailSent = await generateAndSendOtp(user.email);

    // Si falla el envío (Hostinger/DB error), avisamos
    if (!emailSent) {
      return new Response(
        JSON.stringify({ message: "Error al enviar el código de verificación." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 5. Éxito: Pedimos al Frontend que muestre la pantalla de código
    return new Response(
      JSON.stringify({
        success: true,
        message: "Credenciales válidas. Verifique su correo.",
        requireOtp: true, // <--- Importante: sin la 'd' al final
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