const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Crear un nuevo pedido
router.post('/', pedidosController.crear);

// Obtener todos los pedidos
router.get('/', pedidosController.obtenerTodos);

// Obtener un pedido por ID (con info de edición)
router.get('/:id', pedidosController.obtenerPorId);

// Obtener pedidos por rango de fechas
router.get('/filtro/fechas', pedidosController.obtenerPorFechas);

// Actualizar notas de un pedido
router.put('/:id/notas', pedidosController.actualizarNotas);

// Actualizar PDF de un pedido
router.put('/:id/pdf', pedidosController.actualizarPdf);

// Eliminar un pedido
router.delete('/:id', pedidosController.eliminar);

module.exports = router;
