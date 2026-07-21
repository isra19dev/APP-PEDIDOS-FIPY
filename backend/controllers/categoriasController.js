const Categoria = require('../models/Categoria');

// Crear una nueva categoría
exports.crear = async (req, res) => {
  try {
    console.log('📝 Recibida solicitud POST /categorias');
    const { categoria } = req.body;

    if (!categoria || !categoria.trim()) {
      console.log('❌ Validación fallida: categoría vacía');
      return res.status(400).json({ error: 'La categoría es obligatoria' });
    }

    const result = await Categoria.crear(categoria.trim());
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    console.log('✅ Categoría creada:', result.categoria);
    res.status(201).json({ message: 'Categoría creada exitosamente', categoria: result.categoria });
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría', details: error.message });
  }
};

// Obtener todas las categorías
exports.obtenerTodas = async (req, res) => {
  try {
    const categorias = await Categoria.obtenerTodas();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
