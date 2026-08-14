CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_edicion TIMESTAMP,
  productos JSONB NOT NULL,
  notas TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  pdf_ruta VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);