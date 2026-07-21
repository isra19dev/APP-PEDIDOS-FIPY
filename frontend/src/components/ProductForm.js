import React, { useState } from 'react';
import '../styles/ProductForm.css';

function ProductForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      nombre: '',
      categoria: 'Carnes',
      descripcion: '',
      cantidad_minima: 0,
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'precio' || name === 'cantidad_minima' ? Number(value) : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Editar Producto' : 'Nuevo Producto'}</h3>

      <div className="form-group">
        <label htmlFor="nombre">Nombre *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Hamburguesas 180g"
        />
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
        >
          <option value="Corte">Corte</option>
          <option value="Carnes">Carnes</option>
          <option value="Pan">Pan</option>
          <option value="Varios">Varios</option>
        </select>
        {errors.categoria && <span className="error">{errors.categoria}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="precio">Precio (€)</label>
        <input
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción del producto"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cantidad_minima">Cantidad Mínima</label>
        <input
          type="number"
          id="cantidad_minima"
          name="cantidad_minima"
          value={formData.cantidad_minima}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
