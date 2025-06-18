import { getUserFromToken } from "../../../../../lib/auth"

export async function GET(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  const user = await getUserFromToken(token)

  if (!user) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

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
}
