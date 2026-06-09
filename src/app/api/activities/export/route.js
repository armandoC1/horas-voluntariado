import { query } from "@/lib/db";
import { requireAuth, createErrorResponse, createSuccessResponse } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const cycle = searchParams.get("cycle");
    
    let dataQuery = `SELECT id, name, date, start_time, end_time, location, cycle, hours, manual_hours, created_at, activity_type
       FROM activities 
       WHERE user_id = $1`;
    let dataParams = [user.id];
    let paramIndex = 2;
    
    if (cycle && cycle !== "all") {
      dataQuery += ` AND cycle = $${paramIndex}`;
      dataParams.push(parseInt(cycle));
      paramIndex++;
    }
    
    dataQuery += ` ORDER BY date DESC, created_at DESC`;
    
    const activities = await query(dataQuery, dataParams);

    return createSuccessResponse({ activities });
  } catch (error) {
    console.error("Export activities error:", error);
    return createErrorResponse("Error al exportar actividades", 500);
  }
}
