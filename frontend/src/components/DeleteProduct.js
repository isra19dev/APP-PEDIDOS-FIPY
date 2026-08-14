import React, { useState } from 'react';
import '../styles/DeleteProduct.css';

function DeleteProduct({ productos, categorias, onBack, onDelete }) {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const productosFiltrados = React.useMemo(() => {
    let filtered = selectedCategory
      ? productos.filter(p => p.categoria === selectedCategory)
      : productos;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm, productos]);

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="delete-product-container">
      <header className="delete-product-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver
        </button>
        <h1>🗑️ Eliminar Producto</h1>
      </header>

      <div className="delete-product-content">
        <div className="category-filter">
          <h3>Categorías</h3>
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

        <div className="products-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {productosFiltrados.length === 0 ? (
            <p className="no-products">❌ No hay productos en esta categoría</p>
          ) : (
            <div className="products-grid">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="product-card">
                  <div className="product-image-wrapper">
                    {producto.foto_url ? (
                      <img 
                        src={`http://localhost:5000${producto.foto_url}`} 
                        alt={producto.nombre}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">📷</div>
                    )}
                  </div>
                  <div className="product-details">
                    <span className="product-category">{producto.categoria}</span>
                    <h3 className="product-name">{producto.nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(producto.id, producto.nombre)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteProduct;
