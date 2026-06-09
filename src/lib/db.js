import pkg from "pg"
const { Pool } = pkg

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 26257 || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
}

let pool

export async function getConnection() {
  try {
    if (!pool) {
      console.log(`Connecting to database: ${dbConfig.host}/${dbConfig.database}`)
      pool = new Pool(dbConfig)
    }
    return pool
  } catch (error) {
    console.error("Error creating database pool:", error)
    throw error
  }
}

export async function query(sql, params = []) {
  try {
    const connection = await getConnection()
    const result = await connection.query(sql, params)
    return result.rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}