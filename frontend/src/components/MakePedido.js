import React from 'react';
import '../styles/MakePedido.css';

function MakePedido({ productos, categorias, onBack, onProcesarPedido }) {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [quantities, setQuantities] = React.useState({});

  const productosFiltrados = selectedCategory
    ? productos.filter(p => p.categoria === selectedCategory)
    : productos;

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
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            Todos ({productos.length})
          </button>
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
        </div>

        <div className="products-grid">
          {productosFiltrados.length === 0 ? (
            <p className="no-products">No hay productos en esta categoría</p>
          ) : (
            productosFiltrados.map(producto => (
              <div key={producto.id} className="product-card">
                <div className="product-header">
                  <span className="category-badge">{producto.categoria}</span>
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
            ))
          )}
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
