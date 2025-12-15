import { hashPassword, generateToken } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { generateAndSendOtp } from "../../../../../lib/otp";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validaciones
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

    // Verificar si el usuario ya existe
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

    // Crear usuario
    const hashedPassword = await hashPassword(password);

    await query(
      "INSERT INTO users (name, email, password, is_verified) VALUES ($1, $2, $3, FALSE)",
      [name, email, hashedPassword]
    );

    // const userId = result[0].id;
    // const token = generateToken(userId);

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
