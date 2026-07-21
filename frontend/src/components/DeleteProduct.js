import React, { useState } from 'react';
import '../styles/DeleteProduct.css';

function DeleteProduct({ productos, categorias, onBack, onDelete }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const productosFiltrados = selectedCategory
    ? productos.filter(p => p.categoria === selectedCategory)
    : productos;

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
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

        <div className="products-list">
          {productosFiltrados.length === 0 ? (
            <p className="no-products">No hay productos en esta categoría</p>
          ) : (
            productosFiltrados.map(producto => (
              <div key={producto.id} className="product-item">
                <div className="product-info">
                  <span className="category-badge">{producto.categoria}</span>
                  <span className="product-name">{producto.nombre}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(producto.id, producto.nombre)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteProduct;
