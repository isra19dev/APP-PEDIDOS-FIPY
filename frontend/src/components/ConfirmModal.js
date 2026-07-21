import React from 'react';
import '../styles/ConfirmModal.css';

function ConfirmModal({ title, message, onConfirm, onCancel, loading = false }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
