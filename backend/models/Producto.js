const pool = require('../config/db');

class Producto {
  // Obtener todos los productos
  static async obtenerTodos() {
    try {
      const result = await pool.query('SELECT * FROM productos ORDER BY categoria, nombre');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener productos por categoría
  static async obtenerPorCategoria(categoria) {
    try {
      const result = await pool.query(
        'SELECT * FROM productos WHERE categoria = $1 ORDER BY nombre',
        [categoria]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un producto por ID
  static async obtenerPorId(id) {
    try {
      const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo producto
  static async crear(nombre, categoria, precio, descripcion, cantidad_minima, foto_url) {
    try {
      const result = await pool.query(
        `INSERT INTO productos (nombre, categoria, precio, descripcion, cantidad_minima, foto_url)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nombre, categoria, precio, descripcion, cantidad_minima, foto_url]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un producto
  static async actualizar(id, nombre, categoria, precio, descripcion, cantidad_minima, foto_url) {
    try {
      const result = await pool.query(
        `UPDATE productos 
         SET nombre = $1, categoria = $2, precio = $3, descripcion = $4, cantidad_minima = $5, foto_url = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [nombre, categoria, precio, descripcion, cantidad_minima, foto_url, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un producto
  static async eliminar(id) {
    try {
      const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las categorías disponibles
  static async obtenerCategorias() {
    try {
      const result = await pool.query('SELECT DISTINCT categoria FROM productos ORDER BY categoria');
      return result.rows.map(row => row.categoria);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Producto;
