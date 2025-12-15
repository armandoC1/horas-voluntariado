import { generateToken } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { verifyOTPCode } from "../../../../../lib/otp";

export async function POST(request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
        return new Response(JSON.stringify({ message: "Faltan datos" }), { status: 400 })
    }

    const verification = await verifyOTPCode(email, code);
    
    if (!verification.valid) {
        return new Response(JSON.stringify({ message: verification.message }), { status: 400 })
    }

    const users = await query("SELECT * FROM users WHERE email = $1", [email])
    const user = users[0]

    if (!user) {
        return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 })
    }

    if (!user.is_verified) {
        await query("UPDATE users SET is_verified = TRUE WHERE email = $1", [email])
    }
    const token = generateToken(user.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verificación exitosa",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
      }),
      { status: 200 }
    )

  } catch (error) {
    console.error("Verify error:", error)
    return new Response(JSON.stringify({ message: "Error interno" }), { status: 500 })
  }
}