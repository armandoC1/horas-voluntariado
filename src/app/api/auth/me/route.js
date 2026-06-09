import { getUserFromToken } from "../../../../../lib/auth"
import { requireAuth } from "../../../../../lib/api-auth"

export async function GET(request) {
  try {
    const user = await requireAuth(request)

    return new Response(
      JSON.stringify({
        success: true,
        user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }
}
