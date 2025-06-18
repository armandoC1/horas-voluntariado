import { verifyPassword, generateToken } from "../../../../../lib/auth"
import { query } from "../../../../../lib/db"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email y contraseña son obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Buscar usuario
    const users = await query("SELECT id, name, email, password FROM users WHERE email = $1", [email])

    const user = users[0]
    if (!user) {
      return new Response(JSON.stringify({ message: "Email o contraseña incorrectos" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return new Response(JSON.stringify({ message: "Email o contraseña incorrectos" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Generar token
    const token = generateToken(user.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Login error:", error)
    return new Response(JSON.stringify({ message: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
