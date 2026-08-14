import React from 'react';
import '../styles/MakePedido.css';

function MakePedido({ productos, categorias, onBack, onProcesarPedido }) {
  const [selectedCategory, setSelectedCategory] = React.useState('Pan');
  const [quantities, setQuantities] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState('');

  const productosFiltrados = React.useMemo(() => {
    let filtered = selectedCategory
      ? productos.filter(p => p.categoria === selectedCategory)
      : productos;

    // Si hay término de búsqueda, filtrar por nombre o descripción
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm, productos]);

  const handleQuantityChange = (id, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setQuantities({
      ...quantities,
      [id]: numValue,
    });
  };

  const handleIncrement = (id) => {
    const current = quantities[id] || 0;
    setQuantities({
      ...quantities,
      [id]: current + 1,
    });
  };

  const handleDecrement = (id) => {
    const current = quantities[id] || 0;
    if (current > 0) {
      setQuantities({
        ...quantities,
        [id]: current - 1,
      });
    }
  };

  const totalProductosSeleccionados = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const handleProcesar = () => {
    if (totalProductosSeleccionados === 0) {
      alert('Por favor, selecciona al menos un producto');
      return;
    }
    onProcesarPedido(quantities);
  };

  return (
    <div className="make-pedido-container">
      <header className="make-pedido-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver
        </button>
        <h1>📋 Hacer Pedido</h1>
      </header>

      <div className="make-pedido-content">
        <div className="category-filter">
          <h3>Filtrar por Categoría</h3>
          {categorias.map(categoria => {
            const count = productos.filter(p => p.categoria === categoria).length;
            return (
              <button
                key={categoria}
                className={`category-btn ${selectedCategory === categoria ? 'active' : ''}`}
                onClick={() => setSelectedCategory(categoria)}
              >
                {categoria} ({count})
              </button>
            );
          })}
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            Todos ({productos.length})
          </button>
        </div>

        <div className="products-container">
          {!selectedCategory && (
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar producto por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          )}

          <div className="products-grid">
          {productosFiltrados.length === 0 ? (
            <p className="no-products">
              {searchTerm.trim()
                ? `No se encontraron productos con "${searchTerm}"`
                : 'No hay productos en esta categoría'}
            </p>
          ) : (
            productosFiltrados.map(producto => (
              <div key={producto.id} className="product-card">
                <div className="product-image-wrapper">
                  {producto.foto_url && (
                    <img 
                      src={producto.foto_url.startsWith('data:') ? producto.foto_url : `http://localhost:5000${producto.foto_url}`} 
                      alt={producto.nombre}
                      className="product-image"
                    />
                  )}
                </div>

                <div className="product-details">
                  <div className="product-header">
                    <span className="product-category">{producto.categoria}</span>
                  </div>

                  <h3 className="product-name">{producto.nombre}</h3>

                  <div className="quantity-control">
                    <button
                      className="qty-btn minus"
                      onClick={() => handleDecrement(producto.id)}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      className="qty-input"
                      value={quantities[producto.id] || 0}
                      onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                      min="0"
                    />

                    <button
                      className="qty-btn plus"
                      onClick={() => handleIncrement(producto.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </div>

      <div className="procesar-pedido-footer">
        <div className="footer-content">
          <span className="total-info">
            {totalProductosSeleccionados > 0 ? (
              <>
                <strong>Total productos:</strong> {totalProductosSeleccionados}
              </>
            ) : (
              <span className="sin-seleccion">Selecciona productos para procesar</span>
            )}
          </span>
          <button 
            className="procesar-btn" 
            onClick={handleProcesar}
            disabled={totalProductosSeleccionados === 0}
          >
            ✓ Procesar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default MakePedido;
