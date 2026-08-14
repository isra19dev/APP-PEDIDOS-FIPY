import React from 'react';
import '../styles/CopyPedidoModal.css';

function CopyPedidoModal({ pedidoId, productos, onClose }) {
  const copiarAlPortapapeles = (categoria) => {
    // Filtrar productos por categoría
    const productosFiltrados = productos.filter(p => p.categoria === categoria);
    
    if (productosFiltrados.length === 0) {
      alert(`No hay productos de la categoría "${categoria}" en este pedido`);
      return;
    }

    // Crear mensaje con los productos
    const mensaje = productosFiltrados
      .map(p => `${p.nombre} - ${p.cantidad}`)
      .join('\n');

    // Copiar al portapapeles
    navigator.clipboard.writeText(mensaje).then(() => {
      alert(`✅ ${categoria} copiado al portapapeles`);
    }).catch(() => {
      alert('❌ Error al copiar al portapapeles');
    });
  };

  return (
    <div className="copy-modal-overlay">
      <div className="copy-modal">
        <div className="copy-modal-header">
          <h2>📋 Copiar Pedido #{pedidoId}</h2>
        </div>

        <div className="copy-modal-content">
          <p>Selecciona qué deseas copiar:</p>
          
          <div className="copy-buttons-group">
            <button 
              className="copy-btn copy-pan"
              onClick={() => copiarAlPortapapeles('Pan')}
            >
              🍞 Copiar Pan
            </button>
            
            <button 
              className="copy-btn copy-carne"
              onClick={() => copiarAlPortapapeles('Carnes')}
            >
              🥩 Copiar Carne
            </button>
          </div>

          <div className="copy-modal-footer">
            <button className="close-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CopyPedidoModal;
