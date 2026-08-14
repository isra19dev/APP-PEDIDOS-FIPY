const pool = require('../config/db');

class Pedido {
  // Crear un nuevo pedido
  static async crear(productos, notas = '', pdfRuta = null) {
    try {
      const result = await pool.query(
        'INSERT INTO pedidos (productos, notas, pdf_ruta, estado) VALUES ($1, $2, $3, $4) RETURNING *',
        [JSON.stringify(productos), notas, pdfRuta, 'activo']
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los pedidos
  static async obtenerTodos() {
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos ORDER BY fecha_creacion DESC'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un pedido por ID
  static async obtenerPorId(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener pedidos por rango de fechas
  static async obtenerPorFechas(fechaInicio, fechaFin) {
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos WHERE fecha_creacion BETWEEN $1 AND $2 ORDER BY fecha_creacion DESC',
        [fechaInicio, fechaFin]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar notas de un pedido
  static async actualizarNotas(id, notas) {
    try {
      const result = await pool.query(
        'UPDATE pedidos SET notas = $1, fecha_edicion = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [notas, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar PDF de un pedido
  static async actualizarPdf(id, pdfRuta) {
    try {
      const result = await pool.query(
        'UPDATE pedidos SET pdf_ruta = $1 WHERE id = $2 RETURNING *',
        [pdfRuta, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verificar si un pedido puede ser editado (< 24 horas)
  static async puedeEditarse(id) {
    try {
      const result = await pool.query(
        'SELECT fecha_creacion FROM pedidos WHERE id = $1',
        [id]
      );
      if (!result.rows[0]) return false;

      const fechaCreacion = new Date(result.rows[0].fecha_creacion);
      const ahora = new Date();
      const diferencia = (ahora - fechaCreacion) / (1000 * 60 * 60); // en horas

      return diferencia < 24;
    } catch (error) {
      throw error;
    }
  }

  // Obtener tiempo restante para editar (en ms)
  static async getTiempoRestante(id) {
    try {
      const result = await pool.query(
        'SELECT fecha_creacion FROM pedidos WHERE id = $1',
        [id]
      );
      if (!result.rows[0]) return 0;

      const fechaCreacion = new Date(result.rows[0].fecha_creacion);
      const ahora = new Date();
      const tiempoTranscurrido = ahora - fechaCreacion;
      const tiempoMaximo = 24 * 60 * 60 * 1000; // 24 horas en ms

      return Math.max(0, tiempoMaximo - tiempoTranscurrido);
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const result = await pool.query(
        'DELETE FROM pedidos WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pedido;
