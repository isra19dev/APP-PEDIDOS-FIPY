import React, { useState } from 'react';
import '../styles/ProductForm.css';

function ProductForm({ onSubmit, initialData, onCancel, categorias = [] }) {
  const [formData, setFormData] = useState(
    initialData || {
      nombre: '',
      categoria: categorias.length > 0 ? categorias[0] : '',
      descripcion: '',
      foto: null,
    }
  );

  const [fotoPreview, setFotoPreview] = useState(initialData?.foto_url || null);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'foto' && files) {
      const file = files[0];
      setFormData({
        ...formData,
        foto: file,
      });
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.categoria && <span className="error">{errors.categoria}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción del producto"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="foto">Foto del Producto</label>
        <input
          type="file"
          id="foto"
          name="foto"
          onChange={handleChange}
          accept="image/*"
        />
        {fotoPreview && (
          <div className="foto-preview">
            <img src={fotoPreview} alt="Preview" />
          </div>
        )}
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
