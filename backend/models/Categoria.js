const pool = require('../config/db');

class Categoria {
  // Obtener todas las categorías
  static async obtenerTodas() {
    try {
      const result = await pool.query(
        'SELECT nombre FROM categorias ORDER BY nombre'
      );
      return result.rows.map(row => row.nombre);
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva categoría
  static async crear(nombre) {
    try {
      const result = await pool.query(
        'INSERT INTO categorias (nombre) VALUES ($1) RETURNING nombre',
        [nombre]
      );
      return { success: true, categoria: result.rows[0].nombre };
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'La categoría ya existe' };
      }
      throw error;
    }
  }
}

module.exports = Categoria;
