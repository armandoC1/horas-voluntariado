import { initDatabase } from "../../../../lib/db";

export async function POST() {
  try {
    await initDatabase();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tablas creadas exitosamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating tables:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error al crear las tablas: " + error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
