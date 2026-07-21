import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import MakePedido from './components/MakePedido';
import ProductForm from './components/ProductForm';
import DeleteProduct from './components/DeleteProduct';
import ConfirmModal from './components/ConfirmModal';
import { productosAPI } from './services/api';
import { generarPedidoPDF } from './utils/pdfGenerator';

function App() {
  const [screen, setScreen] = useState('home'); // home, makePedido, addProduct, deleteProduct
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingQuantities, setPendingQuantities] = useState(null);

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productosRes, categoriasRes] = await Promise.all([
        productosAPI.obtenerTodos(),
        productosAPI.obtenerCategorias(),
      ]);

      setProductos(productosRes.data);
      setCategorias(categoriasRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al conectar con el servidor. Asegúrate de que el backend está corriendo en http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      await productosAPI.crear(formData);
      await cargarDatos();
      setScreen('home');
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError('Error al crear el producto');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productosAPI.eliminar(id);
      await cargarDatos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto');
    }
  };

  const handleProcesarPedido = (quantities) => {
    setPendingQuantities(quantities);
    setShowConfirmModal(true);
  };

  const handleConfirmPedido = () => {
    if (!pendingQuantities) return;

    try {
      // Generar PDF
      const doc = generarPedidoPDF(productos, pendingQuantities);
      
      // Descargar PDF
      const fecha = new Date();
      const nombreArchivo = `Pedido_FIPY_${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}_${String(fecha.getHours()).padStart(2, '0')}-${String(fecha.getMinutes()).padStart(2, '0')}.pdf`;
      
      doc.save(nombreArchivo);
      
      // Cerrar modal y volver a inicio
      setShowConfirmModal(false);
      setPendingQuantities(null);
      setScreen('home');
      
      // Mostrar confirmación
      alert('✅ Pedido generado correctamente. El archivo ha sido descargado.');
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('❌ Error al generar el PDF');
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">⏳ Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-banner">
          ❌ {error}
          <button onClick={cargarDatos} className="retry-btn">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {screen === 'home' && (
        <Home
          onMakePedido={() => setScreen('makePedido')}
          onAddProduct={() => setScreen('addProduct')}
          onDeleteProduct={() => setScreen('deleteProduct')}
        />
      )}

      {screen === 'makePedido' && (
        <MakePedido
          productos={productos}
          categorias={categorias}
          onBack={() => setScreen('home')}
          onProcesarPedido={handleProcesarPedido}
        />
      )}

      {screen === 'addProduct' && (
        <div className="add-product-container">
          <div className="add-product-header">
            <button className="back-btn" onClick={() => setScreen('home')}>
              ← Volver
            </button>
            <h1>➕ Añadir Producto</h1>
          </div>
          <div className="add-product-form">
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setScreen('home')}
            />
          </div>
        </div>
      )}

      {screen === 'deleteProduct' && (
        <DeleteProduct
          productos={productos}
          categorias={categorias}
          onBack={() => setScreen('home')}
          onDelete={handleDeleteProduct}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Procesamiento de Pedido"
          message="¿Estás seguro de que deseas procesar este pedido? Se generará un archivo PDF con los productos seleccionados."
          onConfirm={handleConfirmPedido}
          onCancel={() => {
            setShowConfirmModal(false);
            setPendingQuantities(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
