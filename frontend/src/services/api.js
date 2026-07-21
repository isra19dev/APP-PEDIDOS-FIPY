import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productosAPI = {
  // Obtener todos los productos
  obtenerTodos: () => apiClient.get('/productos'),

  // Obtener productos por categoría
  obtenerPorCategoria: (categoria) => apiClient.get(`/productos/categoria/${categoria}`),

  // Obtener un producto por ID
  obtenerPorId: (id) => apiClient.get(`/productos/${id}`),

  // Obtener todas las categorías
  obtenerCategorias: () => apiClient.get('/productos/categorias'),

  // Crear un nuevo producto
  crear: (datos) => apiClient.post('/productos', datos),

  // Actualizar un producto
  actualizar: (id, datos) => apiClient.put(`/productos/${id}`, datos),

  // Eliminar un producto
  eliminar: (id) => apiClient.delete(`/productos/${id}`),
};

export default apiClient;
