const Producto = require('../models/Producto');

// Obtener todos los productos
exports.obtenerTodos = async (req, res) => {
  try {
    console.log('📨 GET /api/productos');
    const productos = await Producto.obtenerTodos();
    console.log('✅ Enviando respuesta con productos');
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message, error.code);
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

// Obtener productos por categoría
exports.obtenerPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    console.log(`📨 GET /api/productos/categoria/${categoria}`);
    const productos = await Producto.obtenerPorCategoria(categoria);
    console.log('✅ Enviando respuesta');
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos por categoría:', error.message);
    res.status(500).json({ error: 'Error al obtener productos por categoría', details: error.message });
  }
};

// Obtener un producto por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.obtenerPorId(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear un nuevo producto
exports.crear = async (req, res) => {
  try {
    console.log('📝 Recibida solicitud POST /productos');
    console.log('Body:', req.body);
    console.log('File recibido:', !!req.file);
    
    const { nombre, categoria, precio, descripcion, cantidad_minima } = req.body;
    
    if (!nombre || !categoria) {
      console.log('❌ Validación fallida: nombre o categoría faltantes');
      return res.status(400).json({ error: 'Nombre y categoría son obligatorios' });
    }

    let foto_url = null;
    if (req.file) {
      // Convertir archivo a Base64
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      foto_url = `data:${mimeType};base64,${base64}`;
      console.log('📸 Imagen convertida a Base64, tamaño:', foto_url.length, 'caracteres');
    }

    const producto = await Producto.crear(nombre, categoria, precio || null, descripcion || '', cantidad_minima || null, foto_url);
    console.log('✅ Producto creado:', producto.id);
    res.status(201).json(producto);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

// Actualizar un producto
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, descripcion, cantidad_minima } = req.body;

    if (!nombre || !categoria) {
      return res.status(400).json({ error: 'Nombre y categoría son obligatorios' });
    }

    let foto_url = req.body.foto_url; // Mantener imagen anterior si no se carga una nueva
    if (req.file) {
      // Convertir archivo a Base64
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      foto_url = `data:${mimeType};base64,${base64}`;
      console.log('📸 Imagen actualizada a Base64, tamaño:', foto_url.length, 'caracteres');
    }

    const producto = await Producto.actualizar(id, nombre, categoria, precio || null, descripcion || '', cantidad_minima || null, foto_url);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar un producto
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.eliminar(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente', producto });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Producto.obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
