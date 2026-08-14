const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Si hay DATABASE_URL (Render), úsala; si no, usa las variables individuales
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hamburgueseria_db',
  });
}

pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err);
});

module.exports = pool;
