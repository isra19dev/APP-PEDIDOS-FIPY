import React from 'react';
import '../styles/Home.css';

function Home({ onMakePedido, onAddProduct, onDeleteProduct, onEditProduct, onAddCategory, onPedidosRegistry }) {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="header-section">
          <img src="/logo fipy pedidos definitivo.png" alt="Burguer FIPY Logo" className="fipy-logo-complete" />
        </div>

        <div className="options-grid">
          <button className="option-btn" onClick={onMakePedido}>
            <span className="emoji">📋</span>
            <h2>HACER PEDIDO</h2>
          </button>

          <button className="option-btn" onClick={onAddProduct}>
            <span className="emoji">➕</span>
            <h2>AÑADIR PRODUCTO</h2>
          </button>

          <button className="option-btn" onClick={onAddCategory}>
            <span className="emoji">📂</span>
            <h2>AÑADIR CATEGORÍA</h2>
          </button>

          <button className="option-btn" onClick={onEditProduct}>
            <span className="emoji">✏️</span>
            <h2>EDITAR PRODUCTO</h2>
          </button>

          <button className="option-btn" onClick={onDeleteProduct}>
            <span className="emoji">🗑️</span>
            <h2>ELIMINAR PRODUCTO</h2>
          </button>

          <button className="option-btn" onClick={onPedidosRegistry}>
            <span className="emoji">📊</span>
            <h2>REGISTRO DE PEDIDOS</h2>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
