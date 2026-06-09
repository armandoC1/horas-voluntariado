import { query } from "@/lib/db";
import { requireAuth, createErrorResponse, createSuccessResponse } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const cycle = searchParams.get("cycle");
    
    const offset = (page - 1) * limit;
    
    let countQuery = `SELECT COUNT(*) FROM activities WHERE user_id = $1`;
    let countParams = [user.id];
    let dataQuery = `SELECT id, name, date, start_time, end_time, location, cycle, hours, manual_hours, created_at, activity_type
       FROM activities 
       WHERE user_id = $1`;
    let dataParams = [user.id];
    let paramIndex = 2;
    
    if (cycle && cycle !== "all") {
      countQuery += ` AND cycle = $${paramIndex}`;
      dataQuery += ` AND cycle = $${paramIndex}`;
      countParams.push(parseInt(cycle));
      dataParams.push(parseInt(cycle));
      paramIndex++;
    }
    
    dataQuery += ` ORDER BY date DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    dataParams.push(limit, offset);
    
    const cyclesQuery = `SELECT DISTINCT cycle FROM activities WHERE user_id = $1 ORDER BY cycle`;
    
    const [countResult, activities, cyclesResult] = await Promise.all([
      query(countQuery, countParams),
      query(dataQuery, dataParams),
      query(cyclesQuery, [user.id]),
    ]);
    
    const total = parseInt(countResult[0].count);
    const totalPages = Math.ceil(total / limit);
    const availableCycles = cyclesResult.map(r => r.cycle);

    return createSuccessResponse({
      activities,
      availableCycles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    return createErrorResponse("Error al obtener actividades", 500);
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const {
      name,
      date,
      start_time,
      end_time,
      location,
      cycle,
      hours,
      manual_hours,
      activity_type,
    } = await request.json();

    //nuevo para las nuevas actividades
    const currentYear = new Date().getFullYear();

    if (currentYear >= 2026) {
      if (!name || !date || !location || !cycle || !activity_type) {
        return createErrorResponse("Datos de actividad incompletos para 2026", 400);
      }

      const result = await query(
        `INSERT INTO activities (user_id, name, date, start_time, end_time, location, cycle, hours, manual_hours, activity_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          user.id,
          name,
          date,
          start_time || null,
          end_time || null,
          location,
          cycle,
          hours || null,
          manual_hours || false,
          activity_type,
        ],
      );

      return createSuccessResponse({
        message: "Actividad 2026 registrada",
        id: result[0].id,
      }, 201);
    } else {
      // Validaciones
      if (
        !name ||
        !date ||
        !start_time ||
        !end_time ||
        !location ||
        !cycle ||
        hours === undefined
      ) {
        return createErrorResponse("Todos los campos son obligatorios", 400);
      }
      const result = await query(
        `INSERT INTO activities (user_id, name, date, start_time, end_time, location, cycle, hours, manual_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          user.id,
          name,
          date,
          start_time,
          end_time,
          location,
          cycle,
          hours,
          manual_hours || false,
        ],
      );

      return createSuccessResponse({
        message: "Actividad creada exitosamente",
        id: result[0].id,
      }, 201);
    }
  } catch (error) {
    console.error("Create activity error:", error);
    return createErrorResponse("Error al crear actividad", 500);
  }
}
