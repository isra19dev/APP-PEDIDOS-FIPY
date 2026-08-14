const pool = require('../config/db');

class Categoria {
  // Obtener todas las categorías
  static async obtenerTodas() {
    try {
      console.log('🔍 Buscando categorías en BD...');
      const result = await pool.query(
        'SELECT id, nombre FROM categorias ORDER BY nombre'
      );
      console.log(`✅ Se encontraron ${result.rows.length} categorías`);
      return result.rows;
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error.message, error.code);
      throw error;
    }
  }

  // Crear una nueva categoría
  static async crear(nombre) {
    try {
      console.log(`📝 Creando categoría: ${nombre}`);
      const result = await pool.query(
        'INSERT INTO categorias (nombre) VALUES ($1) RETURNING id, nombre',
        [nombre]
      );
      console.log('✅ Categoría creada:', result.rows[0]);
      return { success: true, categoria: result.rows[0] };
    } catch (error) {
      console.error('❌ Error al crear categoría:', error.message, error.code);
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'La categoría ya existe' };
      }
      throw error;
    }
  }
}

module.exports = Categoria;
