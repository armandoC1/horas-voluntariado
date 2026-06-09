import { query } from "@/lib/db";
import { requireAuth, createErrorResponse, createSuccessResponse } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    
    // Total de actividades
    const totalResult = await query(
      "SELECT COUNT(*) FROM activities WHERE user_id = $1",
      [user.id]
    );
    
    // Horas totales (solo las que tienen hours calculado)
    const hoursResult = await query(
      "SELECT COALESCE(SUM(hours), 0) as total_hours FROM activities WHERE user_id = $1 AND hours IS NOT NULL",
      [user.id]
    );
    
    // Actividades grandes
    const grandesResult = await query(
      "SELECT COUNT(*) FROM activities WHERE user_id = $1 AND activity_type = 'GRANDE'",
      [user.id]
    );
    
    // Actividades pequeñas
    const pequenasResult = await query(
      "SELECT COUNT(*) FROM activities WHERE user_id = $1 AND activity_type = 'PEQUEÑA'",
      [user.id]
    );
    
    // Ciclos únicos
    const ciclosResult = await query(
      "SELECT COUNT(DISTINCT cycle) FROM activities WHERE user_id = $1",
      [user.id]
    );
    
    return createSuccessResponse({
      summary: {
        totalActivities: parseInt(totalResult[0].count),
        totalHours: Number.parseFloat(hoursResult[0].total_hours).toFixed(1),
        grandes: parseInt(grandesResult[0].count),
        pequenas: parseInt(pequenasResult[0].count),
        ciclos: parseInt(ciclosResult[0].count),
      },
    });
  } catch (error) {
    console.error("Get summary error:", error);
    return createErrorResponse("Error al obtener resumen", 500);
  }
}
