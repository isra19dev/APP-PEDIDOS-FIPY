const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function initializeDatabase() {
  try {
    console.log('🔧 Conectando a PostgreSQL...');
    await client.connect();

    // Crear la base de datos si no existe
    console.log('📦 Creando base de datos...');
    await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'hamburgueseria_db'
    `).then(async (res) => {
      if (res.rows.length === 0) {
        await client.query('CREATE DATABASE hamburgueseria_db');
        console.log('✅ Base de datos creada exitosamente');
      } else {
        console.log('✅ Base de datos ya existe');
      }
    });

    await client.end();

    // Conectar a la nueva base de datos y crear tablas
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'hamburgueseria_db',
    });

    console.log('🔗 Conectando a hamburgueseria_db...');
    await dbClient.connect();

    // Crear tabla de productos
    console.log('📝 Creando tabla de productos...');
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        precio DECIMAL(10, 2),
        descripcion TEXT,
        cantidad_minima INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla de productos creada');

    // Insertar datos de ejemplo
    console.log('🌱 Insertando datos de ejemplo...');
    await dbClient.query(`
      DELETE FROM productos;
      
      INSERT INTO productos (nombre, categoria, precio, descripcion, cantidad_minima) VALUES
      -- CORTE
      ('Jamón York', 'Corte', 8.50, 'Jamón de corte para sándwiches', 2),
      ('Cochinillo', 'Corte', 15.00, 'Cochinillo asado', 1),
      ('Jamón Ibérico', 'Corte', 20.00, 'Jamón ibérico de bellota', 1),
      
      -- CARNES
      ('Hamburguesas 180g', 'Carnes', 3.50, 'Hamburguesas premium congeladas', 20),
      ('Lomo Alto', 'Carnes', 12.00, 'Lomo de primera calidad', 5),
      ('Pechuga de Pollo', 'Carnes', 5.00, 'Pechugas de pollo fresco', 10),
      ('Albóndigas', 'Carnes', 6.00, 'Albóndigas caseras', 15),
      
      -- PAN
      ('Pan FIPY Blanco', 'Pan', 2.50, 'Pan blanco de molde', 20),
      ('Pan FIPY Integral', 'Pan', 3.00, 'Pan integral de molde', 15),
      ('Caja Bollitos', 'Pan', 4.00, 'Caja de 12 bollitos', 10),
      
      -- VARIOS
      ('Tenedores Plástico', 'Varios', 1.20, 'Paquete de 100 tenedores', 3),
      ('Pajitas Plástico', 'Varios', 0.80, 'Paquete de 250 pajitas', 5),
      ('Salsa Ketchup', 'Varios', 2.00, 'Botella de 500ml', 5),
      ('Salsa Mayonesa', 'Varios', 2.50, 'Botella de 500ml', 5),
      ('Servilletas', 'Varios', 1.50, 'Paquete de 500 servilletas', 5)
    `);
    console.log('✅ Datos de ejemplo insertados');

    await dbClient.end();
    console.log('\n🎉 Base de datos inicializada correctamente');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

initializeDatabase();
