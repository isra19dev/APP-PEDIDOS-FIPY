import React, { useState } from 'react';
import '../styles/AddCategory.css';

function AddCategory({ onSubmit, onCancel }) {
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCategoria(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!categoria.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    setLoading(true);
    onSubmit(categoria.trim());
  };

  return (
    <div className="add-category-container">
      <form className="add-category-form" onSubmit={handleSubmit}>
        <h3>Añadir Nueva Categoría</h3>

        <div className="form-group">
          <label htmlFor="categoria">Nombre de la Categoría *</label>
          <input
            type="text"
            id="categoria"
            value={categoria}
            onChange={handleChange}
            placeholder="Ej: Bebidas, Postres, etc."
            disabled={loading}
            maxLength="50"
          />
          {error && <span className="error">{error}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Categoría'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
