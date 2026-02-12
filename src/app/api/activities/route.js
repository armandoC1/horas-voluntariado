import { getUserFromToken } from "../../../../lib/auth";
import { query } from "../../../../lib/db";

export async function GET(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);

  if (!user) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const activities = await query(
      `SELECT id, name, date, start_time, end_time, location, cycle, hours, manual_hours, created_at, activity_type
       FROM activities 
       WHERE user_id = $1 
       ORDER BY date DESC, created_at DESC`,
      [user.id],
    );

    return new Response(
      JSON.stringify({
        success: true,
        activities,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Get activities error:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener actividades" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function POST(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);

  if (!user) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
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
        return new Response(
          JSON.stringify({
            message: "Datos de actividad incompletos para 2026",
          }),
          { status: 400 },
        );
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

      return new Response(
        JSON.stringify({
          success: true,
          message: "Actividad 2026 registrada",
          id: result[0].id,
        }),
        { status: 201 },
      );
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
        return new Response(
          JSON.stringify({ message: "Todos los campos son obligatorios" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
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

      return new Response(
        JSON.stringify({
          success: true,
          message: "Actividad creada exitosamente",
          id: result[0].id,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("Create activity error:", error);
    return new Response(
      JSON.stringify({ message: "Error al crear actividad" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
