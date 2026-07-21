import React from 'react';
import '../styles/Home.css';

function Home({ onMakePedido, onAddProduct, onDeleteProduct, onEditProduct, onAddCategory }) {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🍔 Gestor de Pedidos - FIPY</h1>
        <p>Gestiona tus productos y proveedores fácilmente</p>

        <div className="options-grid">
          <button className="option-btn make-pedido" onClick={onMakePedido}>
            <div className="icon">📋</div>
            <h2>Hacer Pedido</h2>
            <p>Selecciona los productos que necesitas</p>
          </button>

          <button className="option-btn add-product" onClick={onAddProduct}>
            <div className="icon">➕</div>
            <h2>Añadir Producto</h2>
            <p>Agrega nuevos productos a la base de datos</p>
          </button>

          <button className="option-btn add-category" onClick={onAddCategory}>
            <div className="icon">📂</div>
            <h2>Añadir Categoría</h2>
            <p>Crea nuevas categorías de productos</p>
          </button>

          <button className="option-btn edit-product" onClick={onEditProduct}>
            <div className="icon">✏️</div>
            <h2>Editar Producto</h2>
            <p>Modifica la información de los productos</p>
          </button>

          <button className="option-btn delete-product" onClick={onDeleteProduct}>
            <div className="icon">🗑️</div>
            <h2>Eliminar Producto</h2>
            <p>Elimina productos que ya no se traen</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
