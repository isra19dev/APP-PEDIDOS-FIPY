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

// Inicializar tablas automáticamente al conectarse
async function initializeTables() {
  try {
    // Crear tabla de categorias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        precio DECIMAL(10, 2),
        descripcion TEXT,
        cantidad_minima INTEGER DEFAULT 0,
        foto_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        productos JSONB NOT NULL,
        total DECIMAL(10, 2),
        estado VARCHAR(50) DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar categorias si no existen
    await pool.query(`
      INSERT INTO categorias (nombre) VALUES
      ('Corte'),
      ('Carnes'),
      ('Pan'),
      ('Varios')
      ON CONFLICT (nombre) DO NOTHING
    `);

    // Insertar productos si no existen
    await pool.query(`
      INSERT INTO productos (nombre, categoria, precio, descripcion, cantidad_minima, foto_url) VALUES
      ('Jamón York', 'Corte', 8.50, 'Jamón de corte para sándwiches', 2, '/uploads/jamon-york.jpg'),
      ('Cochinillo', 'Corte', 15.00, 'Cochinillo asado', 1, '/uploads/cochinillo.jpg'),
      ('Jamón Ibérico', 'Corte', 20.00, 'Jamón ibérico de bellota', 1, '/uploads/jamon-iberico.jpg'),
      ('Hamburguesas 180g', 'Carnes', 3.50, 'Hamburguesas premium congeladas', 20, '/uploads/hamburguesas.jpg'),
      ('Lomo Alto', 'Carnes', 12.00, 'Lomo de primera calidad', 5, '/uploads/lomo.jpg'),
      ('Pechuga de Pollo', 'Carnes', 5.00, 'Pechugas de pollo fresco', 10, '/uploads/pollo.jpg'),
      ('Albóndigas', 'Carnes', 6.00, 'Albóndigas caseras', 15, '/uploads/albondigas.jpg'),
      ('Pan FIPY Blanco', 'Pan', 2.50, 'Pan blanco de molde', 20, '/uploads/pan-blanco.jpg'),
      ('Pan FIPY Integral', 'Pan', 3.00, 'Pan integral de molde', 15, '/uploads/pan-integral.jpg'),
      ('Caja Bollitos', 'Pan', 4.00, 'Caja de 12 bollitos', 10, '/uploads/bollitos.jpg'),
      ('Tenedores Plástico', 'Varios', 1.20, 'Paquete de 100 tenedores', 3, '/uploads/tenedores.jpg'),
      ('Pajitas Plástico', 'Varios', 0.80, 'Paquete de 250 pajitas', 5, '/uploads/pajitas.jpg'),
      ('Salsa Ketchup', 'Varios', 2.00, 'Botella de 500ml', 5, '/uploads/ketchup.jpg'),
      ('Salsa Mayonesa', 'Varios', 2.50, 'Botella de 500ml', 5, '/uploads/mayonesa.jpg'),
      ('Servilletas', 'Varios', 1.50, 'Paquete de 500 servilletas', 5, '/uploads/servilletas.jpg')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Tablas de base de datos inicializadas correctamente');
  } catch (error) {
    console.error('⚠️ Error al inicializar tablas:', error.message);
  }
}

// Ejecutar inicialización cuando el módulo se carga
initializeTables();

module.exports = pool;
