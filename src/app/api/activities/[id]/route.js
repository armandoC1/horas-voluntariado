import { query } from "../../../../../lib/db";
import { requireAuth } from "../../../../../lib/api-auth";

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const {
      name,
      date,
      start_time,
      end_time,
      location,
      cycle,
      hours,
      manual_hours,
    } = await request.json();

    const activities = await query(
      "SELECT id FROM activities WHERE id = $1 AND user_id = $2",
      [id, user.id]
    );

    if (activities.length === 0) {
      return new Response(
        JSON.stringify({ message: "Actividad no encontrada" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await query(
      `UPDATE activities 
       SET name = $1, date = $2, start_time = $3, end_time = $4, location = $5, cycle = $6, hours = $7, manual_hours = $8
       WHERE id = $9 AND user_id = $10`,
      [
        name,
        date,
        start_time,
        end_time,
        location,
        cycle,
        hours,
        manual_hours || false,
        id,
        user.id,
      ]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Actividad actualizada exitosamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Update activity error:", error);
    return new Response(
      JSON.stringify({ message: "Error al actualizar actividad" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    const result = await query(
      "DELETE FROM activities WHERE id = $1 AND user_id = $2",
      [id, user.id]
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ message: "Actividad no encontrada" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Actividad eliminada exitosamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Delete activity error:", error);
    return new Response(
      JSON.stringify({ message: "Error al eliminar actividad" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
