import React from 'react';
import '../styles/ProductList.css';

function ProductList({ productos, categorias, onEdit, onDelete, selectedCategory, onCategoryChange }) {
  const productosFiltrados = selectedCategory
    ? productos.filter(p => p.categoria === selectedCategory)
    : productos;

  return (
    <div className="product-list-container">
      <div className="category-filter">
        <h3>Filtrar por Categoría</h3>
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          Todos ({productos.length})
        </button>
        {categorias.map(categoria => {
          const count = productos.filter(p => p.categoria === categoria).length;
          return (
            <button
              key={categoria}
              className={`category-btn ${selectedCategory === categoria ? 'active' : ''}`}
              onClick={() => onCategoryChange(categoria)}
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
                <h4>{producto.nombre}</h4>
                <span className="category-badge">{producto.categoria}</span>
              </div>

              <div className="product-details">
                {producto.precio !== null && producto.precio !== undefined && (
                  <p className="precio">
                    <strong>Precio:</strong> €{parseFloat(producto.precio).toFixed(2)}
                  </p>
                )}
                {producto.descripcion && (
                  <p className="descripcion">
                    <strong>Descripción:</strong> {producto.descripcion}
                  </p>
                )}
                {producto.cantidad_minima > 0 && (
                  <p className="cantidad">
                    <strong>Cantidad Mínima:</strong> {producto.cantidad_minima}
                  </p>
                )}
              </div>

              <div className="product-actions">
                <button className="btn btn-sm btn-edit" onClick={() => onEdit(producto)}>
                  ✏️ Editar
                </button>
                <button className="btn btn-sm btn-delete" onClick={() => onDelete(producto.id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
