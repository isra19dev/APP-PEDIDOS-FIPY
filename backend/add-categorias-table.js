const pool = require('./config/db');

async function addCategoriasTable() {
  try {
    console.log('🔧 Creando tabla categorias...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabla categorias creada exitosamente');

    // Insertar categorías por defecto
    const categoriasPorDefecto = ['Carnes', 'Corte', 'Pan', 'Varios'];
    
    for (const categoria of categoriasPorDefecto) {
      await pool.query(
        'INSERT INTO categorias (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING',
        [categoria]
      );
    }

    console.log('✅ Categorías por defecto insertadas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear tabla categorias:', error);
    process.exit(1);
  }
}

addCategoriasTable();
