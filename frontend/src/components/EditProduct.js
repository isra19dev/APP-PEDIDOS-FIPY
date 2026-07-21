import React, { useState } from 'react';
import ProductForm from './ProductForm';
import '../styles/EditProduct.css';

function EditProduct({ productos, categorias, onBack, onEdit }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  const productosFiltrados = selectedCategory
    ? productos.filter(p => p.categoria === selectedCategory)
    : productos;

  const productoEnEdicion = editingProductId
    ? productos.find(p => p.id === editingProductId)
    : null;

  const handleEditClick = (id) => {
    setEditingProductId(id);
  };

  const handleEditSubmit = async (formData) => {
    try {
      await onEdit(editingProductId, formData);
      setEditingProductId(null);
    } catch (err) {
      console.error('Error al actualizar producto:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  if (editingProductId) {
    return (
      <div className="edit-product-container">
        <header className="edit-product-header">
          <button className="back-btn" onClick={handleCancelEdit}>
            ← Volver a lista
          </button>
          <h1>✏️ Editar Producto</h1>
        </header>

        <div className="edit-product-form-container">
          <ProductForm
            initialData={productoEnEdicion}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            categorias={categorias}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <header className="edit-product-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver
        </button>
        <h1>✏️ Editar Producto</h1>
      </header>

      <div className="edit-product-content">
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
                {producto.foto_url && (
                  <div className="product-item-image">
                    <img src={`http://localhost:5000${producto.foto_url}`} alt={producto.nombre} />
                  </div>
                )}
                <div className="product-info">
                  <span className="category-badge">{producto.categoria}</span>
                  <div className="product-details">
                    <span className="product-name">{producto.nombre}</span>
                    <span className="product-description">{producto.descripcion}</span>
                  </div>
                </div>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(producto.id)}
                >
                  ✏️ Editar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
