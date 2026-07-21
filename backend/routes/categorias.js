const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Crear una nueva categoría
router.post('/', categoriasController.crear);

// Obtener todas las categorías
router.get('/', categoriasController.obtenerTodas);

module.exports = router;
