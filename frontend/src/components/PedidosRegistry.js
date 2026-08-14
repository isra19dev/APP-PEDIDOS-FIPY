import React, { useState, useEffect } from 'react';
import '../styles/PedidosRegistry.css';
import { pedidosAPI } from '../services/api';
import CopyPedidoModal from './CopyPedidoModal';

const PedidosRegistry = ({ onBack }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroFecha, setFiltroFecha] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [editandoNotas, setEditandoNotas] = useState(null);
  const [notasTemp, setNotasTemp] = useState('');
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [pedidoDataCopy, setPedidoDataCopy] = useState(null);

  // Cargar pedidos
  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const respuesta = await pedidosAPI.obtenerTodos();
      setPedidos(respuesta.data);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPedidos = () => {
    let resultado = [...pedidos];

    // Filtro por fecha
    const ahora = new Date();
    if (filtroFecha === 'hoy') {
      resultado = resultado.filter(p => {
        const fecha = new Date(p.fecha_creacion);
        return fecha.toDateString() === ahora.toDateString();
      });
    } else if (filtroFecha === 'semana') {
      const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      resultado = resultado.filter(p => new Date(p.fecha_creacion) >= hace7Dias);
    } else if (filtroFecha === 'mes') {
      const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
      resultado = resultado.filter(p => new Date(p.fecha_creacion) >= hace30Dias);
    } else if (filtroFecha === 'custom' && fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59);
      resultado = resultado.filter(p => {
        const fecha = new Date(p.fecha_creacion);
        return fecha >= inicio && fecha <= fin;
      });
    }

    // Filtro por búsqueda
    if (busqueda) {
      resultado = resultado.filter(p => {
        const textoBusqueda = busqueda.toLowerCase();
        const productosStr = JSON.stringify(p.productos).toLowerCase();
        return productosStr.includes(textoBusqueda) || p.notas.toLowerCase().includes(textoBusqueda);
      });
    }

    return resultado;
  };

  const calcularTiempoRestante = (fechaCreacion) => {
    const ahora = new Date();
    const fecha = new Date(fechaCreacion);
    const diferencia = ahora - fecha;
    
    // Calcular tiempo restante correctamente
    const tiempoRestante = (24 * 60 * 60 * 1000) - diferencia; // en ms
    const horas = Math.floor(diferencia / (1000 * 60 * 60));

    if (horas >= 24) {
      return { texto: '🔒 Expirado', puedeEditar: false, urgente: false };
    }

    const horasRestantes = Math.floor(tiempoRestante / (1000 * 60 * 60));
    const minutosRestantes = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));

    if (horasRestantes < 2) {
      return {
        texto: `⏰ ${horasRestantes}h ${minutosRestantes}m restantes`,
        puedeEditar: true,
        urgente: true,
      };
    }

    return {
      texto: `⏱️ ${horasRestantes}h ${minutosRestantes}m`,
      puedeEditar: true,
      urgente: false,
    };
  };

  const descargarPdf = (pedido) => {
    if (!pedido.pdf_ruta) {
      alert('❌ No hay PDF disponible para este pedido');
      return;
    }

    const link = document.createElement('a');
    link.href = `http://localhost:5000${pedido.pdf_ruta}`;
    link.download = `Pedido_${pedido.id}.pdf`;
    link.click();
  };

  const iniciarEdicionNotas = (pedido) => {
    const tiempoRestante = calcularTiempoRestante(pedido.fecha_creacion);
    if (!tiempoRestante.puedeEditar) {
      alert('❌ No puedes editar este pedido (han pasado más de 24 horas)');
      return;
    }

    setEditandoNotas(pedido.id);
    setNotasTemp(pedido.notas || '');
  };

  const guardarNotas = async (pedidoId) => {
    try {
      await pedidosAPI.actualizarNotas(pedidoId, notasTemp);
      await cargarPedidos();
      setEditandoNotas(null);
      setNotasTemp('');
      alert('✅ Notas guardadas correctamente');
    } catch (err) {
      console.error('Error al guardar notas:', err);
      alert('❌ Error al guardar las notas');
    }
  };

  const cancelarEdicion = () => {
    setEditandoNotas(null);
    setNotasTemp('');
  };

  const eliminarPedido = async (pedidoId) => {
    if (window.confirm('⚠️ ¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.')) {
      try {
        await pedidosAPI.eliminar(pedidoId);
        await cargarPedidos();
        alert('✅ Pedido eliminado correctamente');
      } catch (err) {
        console.error('Error al eliminar pedido:', err);
        alert('❌ Error al eliminar el pedido');
      }
    }
  };

  const abrirCopyModal = (pedido) => {
    setPedidoDataCopy({
      id: pedido.id,
      productos: pedido.productos || [],
    });
    setShowCopyModal(true);
  };

  const cerrarCopyModal = () => {
    setShowCopyModal(false);
    setPedidoDataCopy(null);
  };

  const pedidosFiltrados = filtrarPedidos();

  if (loading) {
    return (
      <div className="registry-container">
        <div className="loading">⏳ Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="registry-container">
      {/* Header */}
      <div className="registry-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <h1>📋 Registro de Pedidos</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Filtros */}
      <div className="filtros-section">
        <div className="filtro-grupo">
          <label>Período:</label>
          <select value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}>
            <option value="todos">Todos los pedidos</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Últimos 7 días</option>
            <option value="mes">Últimos 30 días</option>
            <option value="custom">Rango personalizado</option>
          </select>
        </div>

        {filtroFecha === 'custom' && (
          <>
            <div className="filtro-grupo">
              <label>Desde:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="filtro-grupo">
              <label>Hasta:</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="filtro-grupo">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Buscar por producto o notas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="resultados-info">
        {pedidosFiltrados.length > 0 ? (
          <span>📊 {pedidosFiltrados.length} pedido(s) encontrado(s)</span>
        ) : (
          <span>❌ No hay pedidos que coincidan con los filtros</span>
        )}
      </div>

      {/* Lista de pedidos */}
      <div className="pedidos-lista">
        {pedidosFiltrados.map(pedido => {
          const tiempoRestante = calcularTiempoRestante(pedido.fecha_creacion);
          const totalProductos = Array.isArray(pedido.productos)
            ? pedido.productos.reduce((sum, p) => sum + (p.cantidad || 0), 0)
            : 0;

          return (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div className="pedido-info">
                  <h3>Pedido #{pedido.id}</h3>
                  <p className="fecha">
                    📅 {new Date(pedido.fecha_creacion).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className={`tiempo-indicador ${tiempoRestante.urgente ? 'urgente' : ''}`}>
                  {tiempoRestante.texto}
                </div>
              </div>

              {/* Productos */}
              <div className="productos-resumen">
                <strong>📦 Productos ({totalProductos}):</strong>
                <div className="productos-list">
                  {Array.isArray(pedido.productos) ? (
                    pedido.productos.map((prod, idx) => (
                      <span key={idx} className="producto-tag">
                        {prod.nombre} x{prod.cantidad}
                      </span>
                    ))
                  ) : (
                    <span>Sin información</span>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div className="notas-section">
                <strong>📝 Notas:</strong>
                {editandoNotas === pedido.id ? (
                  <div className="notas-edit">
                    <textarea
                      value={notasTemp}
                      onChange={(e) => setNotasTemp(e.target.value)}
                      placeholder="Agregar notas..."
                    />
                    <div className="notas-buttons">
                      <button
                        className="btn-guardar"
                        onClick={() => guardarNotas(pedido.id)}
                      >
                        ✅ Guardar
                      </button>
                      <button className="btn-cancelar" onClick={cancelarEdicion}>
                        ❌ Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="notas-view">
                    <p>{pedido.notas || '(Sin notas)'}</p>
                    {tiempoRestante.puedeEditar && (
                      <button
                        className="btn-editar-notas"
                        onClick={() => iniciarEdicionNotas(pedido)}
                      >
                        💬 Añadir comentario
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="acciones-pedido">
                <button
                  className="btn-descargar"
                  onClick={() => descargarPdf(pedido)}
                  disabled={!pedido.pdf_ruta}
                >
                  📥 Descargar PDF
                </button>
                <button
                  className="btn-copiar"
                  onClick={() => abrirCopyModal(pedido)}
                >
                  🍞🥩 Copiar Productos
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarPedido(pedido.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCopyModal && pedidoDataCopy && (
        <CopyPedidoModal
          pedidoId={pedidoDataCopy.id}
          productos={pedidoDataCopy.productos}
          onClose={cerrarCopyModal}
        />
      )}
    </div>
  );
};

export default PedidosRegistry;
