const { Pool } = require('pg');
require('dotenv').config();

let pool;

console.log('🔍 Verificando variables de entorno...');
console.log(`DATABASE_URL disponible: ${!!process.env.DATABASE_URL}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);

// Si hay DATABASE_URL (Render), úsala; si no, usa las variables individuales
if (process.env.DATABASE_URL) {
  console.log('✅ Usando DATABASE_URL (Render)');
  const dbUrl = process.env.DATABASE_URL.substring(0, 50) + '...';
  console.log(`📍 URL de BD: ${dbUrl}`);
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  console.log('⚠️ DATABASE_URL no encontrada, usando variables locales');
  console.log(`DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`DB_PORT: ${process.env.DB_PORT || 5432}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || 'hamburgueseria_db'}`);
  
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hamburgueseria_db',
  });
}

pool.on('error', (err) => {
  console.error('❌ Error en el pool de conexiones:', err.message);
});

// Inicializar tablas automáticamente al conectarse
async function initializeTables() {
  try {
    console.log('🔧 Intentando inicializar tablas...');
    
    // Crear tabla de categorias
    console.log('📝 Creando tabla de categorias...');
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS categorias (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla categorias OK');
    } catch (err) {
      console.error('⚠️ Error en tabla categorias:', err.message);
    }

    // Crear tabla de productos
    console.log('📝 Creando tabla de productos...');
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS productos (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          precio DECIMAL(10, 2),
          descripcion TEXT,
          cantidad_minima INTEGER DEFAULT 0,
          foto_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla productos OK');
    } catch (err) {
      console.error('⚠️ Error en tabla productos:', err.message);
    }

    // Crear tabla de pedidos
    console.log('📝 Creando tabla de pedidos...');
    try {
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
      console.log('✅ Tabla pedidos OK');
    } catch (err) {
      console.error('⚠️ Error en tabla pedidos:', err.message);
    }

    // Verificar si hay categorías, si no, insertar
    console.log('🌱 Verificando categorías...');
    try {
      const result = await pool.query('SELECT COUNT(*) as count FROM categorias');
      if (result.rows[0].count === 0) {
        console.log('📝 Insertando categorías por defecto...');
        await pool.query(`
          INSERT INTO categorias (nombre) VALUES
          ('Corte'),
          ('Carnes'),
          ('Pan'),
          ('Varios')
          ON CONFLICT (nombre) DO NOTHING
        `);
        console.log('✅ Categorias insertadas');
      } else {
        console.log('✅ Categorías ya existen, no se reinsertarán');
      }
    } catch (err) {
      console.error('⚠️ Error al verificar/insertar categorías:', err.message);
    }

    // Verificar si hay productos, si no, insertar datos de ejemplo
    console.log('🌱 Verificando productos...');
    try {
      const result = await pool.query('SELECT COUNT(*) as count FROM productos');
      if (result.rows[0].count === 0) {
        console.log('📝 Insertando productos de ejemplo...');
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
        console.log('✅ Productos de ejemplo insertados');
      } else {
        console.log(`✅ La BD ya tiene ${result.rows[0].count} productos, no se reinsertarán`);
      }
    } catch (err) {
      console.error('⚠️ Error al verificar/insertar productos:', err.message);
    }

    console.log('✅ Inicialización de tablas completada');
  } catch (error) {
    console.error('❌ Error general en inicialización:', error.message);
  }
}

// Ejecutar inicialización cuando el módulo se carga
initializeTables();

module.exports = pool;
