const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const upload = require('../config/multer');

// Obtener todas las categorías
router.get('/categorias', productosController.obtenerCategorias);

// Obtener todos los productos
router.get('/', productosController.obtenerTodos);

// Obtener productos por categoría
router.get('/categoria/:categoria', productosController.obtenerPorCategoria);

// Obtener un producto por ID
router.get('/:id', productosController.obtenerPorId);

// Crear un nuevo producto
router.post('/', upload.single('foto'), productosController.crear);

// Actualizar un producto
router.put('/:id', upload.single('foto'), productosController.actualizar);

// Eliminar un producto
router.delete('/:id', productosController.eliminar);

module.exports = router;
