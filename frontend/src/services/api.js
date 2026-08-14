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

  // Crear un nuevo producto (con FormData para la imagen)
  crear: (datos) => {
    const formData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('categoria', datos.categoria);
    formData.append('descripcion', datos.descripcion);
    if (datos.foto) {
      formData.append('foto', datos.foto);
    }
    return axios.post(`${API_BASE_URL}/productos`, formData);
  },

  // Actualizar un producto (con FormData para la imagen)
  actualizar: (id, datos) => {
    const formData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('categoria', datos.categoria);
    formData.append('descripcion', datos.descripcion);
    if (datos.foto_url) {
      formData.append('foto_url', datos.foto_url);
    }
    if (datos.foto) {
      formData.append('foto', datos.foto);
    }
    return axios.put(`${API_BASE_URL}/productos/${id}`, formData);
  },

  // Eliminar un producto
  eliminar: (id) => apiClient.delete(`/productos/${id}`),
};

export const categoriasAPI = {
  // Crear una nueva categoría
  crear: (categoria) => {
    return axios.post(`${API_BASE_URL}/categorias`, { categoria });
  },

  // Obtener todas las categorías
  obtenerTodas: () => apiClient.get('/categorias'),
};

export const pedidosAPI = {
  // Crear un nuevo pedido con PDF en base64
  crear: (productos, notas = '', pdfBase64 = null) => 
    apiClient.post('/pedidos', { productos, notas, pdfBase64 }),

  // Obtener todos los pedidos
  obtenerTodos: () => apiClient.get('/pedidos'),

  // Obtener un pedido por ID (con info de edición)
  obtenerPorId: (id) => apiClient.get(`/pedidos/${id}`),

  // Obtener pedidos por rango de fechas
  obtenerPorFechas: (fechaInicio, fechaFin) =>
    apiClient.get('/pedidos/filtro/fechas', {
      params: { fechaInicio, fechaFin },
    }),

  // Actualizar notas de un pedido
  actualizarNotas: (id, notas) =>
    apiClient.put(`/pedidos/${id}/notas`, { notas }),

  // Actualizar PDF de un pedido
  actualizarPdf: (id, pdfRuta) =>
    apiClient.put(`/pedidos/${id}/pdf`, { pdfRuta }),

  // Eliminar un pedido
  eliminar: (id) =>
    apiClient.delete(`/pedidos/${id}`),
};

export default apiClient;
