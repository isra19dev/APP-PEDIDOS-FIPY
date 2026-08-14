const Pedido = require('../models/Pedido');
const fs = require('fs');
const path = require('path');

// Directorio para guardar PDFs
const pdfDir = path.join(__dirname, '../public/pedidos');

// Asegurar que el directorio existe
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

exports.crear = async (req, res) => {
  try {
    const { productos, notas = '', pdfBase64 = null } = req.body;

    if (!productos || !Array.isArray(productos)) {
      return res.status(400).json({ error: 'Productos inválidos' });
    }

    let pdfRuta = null;

    // Si viene PDF en base64, guardarlo en servidor
    if (pdfBase64) {
      try {
        const timestamp = Date.now();
        const nombrePdf = `pedido_${timestamp}.pdf`;
        const rutaPdf = path.join(pdfDir, nombrePdf);

        // Convertir base64 a buffer
        const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ''), 'base64');

        // Guardar archivo
        fs.writeFileSync(rutaPdf, pdfBuffer);
        pdfRuta = `/pedidos/${nombrePdf}`;

        console.log(`✅ PDF guardado: ${pdfRuta}`);
      } catch (pdfError) {
        console.error('Error al guardar PDF:', pdfError);
        // Continuar sin PDF si hay error
      }
    }

    const nuevoPedido = await Pedido.crear(productos, notas, pdfRuta);
    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

exports.obtenerTodos = async (req, res) => {
  try {
    const pedidos = await Pedido.obtenerTodos();
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.obtenerPorId(id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener tiempo restante para editar
    const tiempoRestante = await Pedido.getTiempoRestante(id);
    const puedeEditarse = tiempoRestante > 0;

    res.json({
      ...pedido,
      puedeEditarse,
      tiempoRestante,
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

exports.obtenerPorFechas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Fechas requeridas' });
    }

    const pedidos = await Pedido.obtenerPorFechas(fechaInicio, fechaFin);
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos por fechas:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

exports.actualizarNotas = async (req, res) => {
  try {
    const { id } = req.params;
    const { notas } = req.body;

    // Verificar si puede editarse
    const puedeEditarse = await Pedido.puedeEditarse(id);
    if (!puedeEditarse) {
      return res.status(403).json({ error: 'No puedes editar este pedido (han pasado más de 24 horas)' });
    }

    const pedidoActualizado = await Pedido.actualizarNotas(id, notas);
    res.json(pedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar notas:', error);
    res.status(500).json({ error: 'Error al actualizar notas' });
  }
};

exports.actualizarPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { pdfRuta } = req.body;

    if (!pdfRuta) {
      return res.status(400).json({ error: 'Ruta del PDF requerida' });
    }

    const pedidoActualizado = await Pedido.actualizarPdf(id, pdfRuta);
    res.json(pedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar PDF:', error);
    res.status(500).json({ error: 'Error al actualizar PDF' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID del pedido requerido' });
    }

    const pedidoEliminado = await Pedido.eliminar(id);
    
    if (!pedidoEliminado) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    console.log(`✅ Pedido ${id} eliminado correctamente`);
    res.json({ mensaje: 'Pedido eliminado correctamente', pedido: pedidoEliminado });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
};
