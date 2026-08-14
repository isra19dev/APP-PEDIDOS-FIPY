const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const pedidosRoutes = require('./routes/pedidos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging para debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Servir archivos estáticos (imágenes y PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/pedidos', express.static(path.join(__dirname, 'public/pedidos')));

// Ruta de inicialización de BD (solo en Render)
app.post('/api/init-db', async (req, res) => {
  res.json({ 
    message: '✅ Base de datos ya está inicializada automáticamente',
    status: 'success'
  });
});

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '✅ Backend funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
