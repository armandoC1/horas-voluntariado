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
let isInitialized = false 

export async function getConnection() {
  try {
    if (!pool) {
      console.log(`Connecting to database: ${dbConfig.host}/${dbConfig.database}`)
      pool = new Pool(dbConfig)
      
      // Inicializar tablas solo una vez
      // if (!isInitialized) {
      //   console.log('Inicializando tablas de base de datos...')
      //   await initDatabase()
      //   isInitialized = true
      //   console.log('✅ Tablas inicializadas exitosamente')
      // }
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

// export async function initDatabase() {
//   try {
//     if (!pool) {
//       throw new Error("Pool no está inicializado")
//     }

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `)

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS activities (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         date DATE NOT NULL,
//         start_time TIME NOT NULL,
//         end_time TIME NOT NULL,
//         location VARCHAR(255) NOT NULL,
//         cycle INTEGER NOT NULL,
//         hours DECIMAL(4,2) NOT NULL,
//         manual_hours BOOLEAN DEFAULT FALSE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//       )
//     `)

//     console.log("CockroachDB database tables initialized successfully")
//   } catch (error) {
//     console.error("Error initializing database:", error)
//     throw error
//   }
//}