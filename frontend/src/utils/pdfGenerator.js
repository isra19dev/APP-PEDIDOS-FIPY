import jsPDF from 'jspdf';

export const generarPedidoPDF = (productos, cantidades, fecha = new Date()) => {
  const doc = new jsPDF();
  
  // Encabezado
  doc.setFontSize(20);
  doc.text('🍔 FIPY - PEDIDO DE COMPRA', 20, 20);
  
  // Fecha y hora
  doc.setFontSize(10);
  doc.text(`Fecha: ${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES')}`, 20, 30);
  
  // Línea separadora
  doc.setDrawColor(200);
  doc.line(20, 35, 190, 35);
  
  // Encabezados de tabla
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Categoría', 20, 45);
  doc.text('Producto', 50, 45);
  doc.text('Cantidad', 170, 45);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  // Línea separadora
  doc.setDrawColor(200);
  doc.line(20, 48, 190, 48);
  
  let yPos = 55;
  let totalProductos = 0;
  let productosAñadidos = [];
  
  // Agrupar por categoría
  const porCategoria = {};
  productos.forEach(p => {
    if (!porCategoria[p.categoria]) {
      porCategoria[p.categoria] = [];
    }
    porCategoria[p.categoria].push(p);
  });
  
  // Mostrar productos
  Object.keys(porCategoria).sort().forEach(categoria => {
    porCategoria[categoria].forEach(producto => {
      const cantidad = cantidades[producto.id] || 0;
      if (cantidad > 0) {
        productosAñadidos.push({ categoria: producto.categoria, nombre: producto.nombre, cantidad });
        totalProductos += cantidad;
        
        doc.text(producto.categoria, 20, yPos);
        doc.text(producto.nombre, 50, yPos);
        doc.text(cantidad.toString(), 170, yPos, { align: 'right' });
        yPos += 7;
        
        // Si llegamos al final de la página, agregar nueva página
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
          doc.setFont(undefined, 'bold');
          doc.text('Categoría', 20, yPos);
          doc.text('Producto', 50, yPos);
          doc.text('Cantidad', 170, yPos);
          doc.setFont(undefined, 'normal');
          yPos = 27;
        }
      }
    });
  });
  
  // Total
  doc.setDrawColor(200);
  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 8;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text(`TOTAL DE PRODUCTOS: ${totalProductos}`, 20, yPos);
  
  // Pie de página
  yPos = doc.internal.pageSize.height - 15;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(150);
  doc.text('Generado automáticamente por el sistema de gestión de pedidos FIPY', 20, yPos);
  
  return doc;
};
