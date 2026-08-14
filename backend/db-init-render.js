const { Client } = require('pg');
require('dotenv').config();

async function initializeDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔧 Conectando a PostgreSQL en Render...');
    await client.connect();

    // Crear tabla de categorias
    console.log('📝 Creando tabla de categorias...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla de categorias creada');

    // Crear tabla de productos
    console.log('📝 Creando tabla de productos...');
    await client.query(`
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
    console.log('✅ Tabla de productos creada');

    // Crear tabla de pedidos
    console.log('📝 Creando tabla de pedidos...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        productos JSONB NOT NULL,
        total DECIMAL(10, 2),
        estado VARCHAR(50) DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla de pedidos creada');

    // Insertar categorias
    console.log('🌱 Insertando categorias...');
    await client.query(`
      INSERT INTO categorias (nombre) VALUES
      ('Corte'),
      ('Carnes'),
      ('Pan'),
      ('Varios')
      ON CONFLICT (nombre) DO NOTHING
    `);
    console.log('✅ Categorias insertadas');

    // Insertar productos de ejemplo
    console.log('🌱 Insertando productos de ejemplo...');
    await client.query(`
      INSERT INTO productos (nombre, categoria, precio, descripcion, cantidad_minima, foto_url) VALUES
      -- CORTE
      ('Jamón York', 'Corte', 8.50, 'Jamón de corte para sándwiches', 2, '/uploads/jamon-york.jpg'),
      ('Cochinillo', 'Corte', 15.00, 'Cochinillo asado', 1, '/uploads/cochinillo.jpg'),
      ('Jamón Ibérico', 'Corte', 20.00, 'Jamón ibérico de bellota', 1, '/uploads/jamon-iberico.jpg'),
      
      -- CARNES
      ('Hamburguesas 180g', 'Carnes', 3.50, 'Hamburguesas premium congeladas', 20, '/uploads/hamburguesas.jpg'),
      ('Lomo Alto', 'Carnes', 12.00, 'Lomo de primera calidad', 5, '/uploads/lomo.jpg'),
      ('Pechuga de Pollo', 'Carnes', 5.00, 'Pechugas de pollo fresco', 10, '/uploads/pollo.jpg'),
      ('Albóndigas', 'Carnes', 6.00, 'Albóndigas caseras', 15, '/uploads/albondigas.jpg'),
      
      -- PAN
      ('Pan FIPY Blanco', 'Pan', 2.50, 'Pan blanco de molde', 20, '/uploads/pan-blanco.jpg'),
      ('Pan FIPY Integral', 'Pan', 3.00, 'Pan integral de molde', 15, '/uploads/pan-integral.jpg'),
      ('Caja Bollitos', 'Pan', 4.00, 'Caja de 12 bollitos', 10, '/uploads/bollitos.jpg'),
      
      -- VARIOS
      ('Tenedores Plástico', 'Varios', 1.20, 'Paquete de 100 tenedores', 3, '/uploads/tenedores.jpg'),
      ('Pajitas Plástico', 'Varios', 0.80, 'Paquete de 250 pajitas', 5, '/uploads/pajitas.jpg'),
      ('Salsa Ketchup', 'Varios', 2.00, 'Botella de 500ml', 5, '/uploads/ketchup.jpg'),
      ('Salsa Mayonesa', 'Varios', 2.50, 'Botella de 500ml', 5, '/uploads/mayonesa.jpg'),
      ('Servilletas', 'Varios', 1.50, 'Paquete de 500 servilletas', 5, '/uploads/servilletas.jpg')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Productos insertados');

    await client.end();
    console.log('\n🎉 Base de datos en Render inicializada correctamente');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
