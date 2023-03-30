document.addEventListener('DOMContentLoaded', () => {
    const botonDescargar = document.getElementById('descargarPDF');
    const calcularValoresBoton = document.getElementById('calcularValores');

    botonDescargar.addEventListener('click', async () => {
        const nombre = document.getElementById('nombre').value;
        const cedula = document.getElementById('cedula').value;
        const telefono = document.getElementById('telefono').value;
        const accesorios = document.getElementById('accesorios').value;
        const descripcion = document.getElementById('descripcion').value;
        const direccion = document.getElementById('direccion').value;
        const dia = document.getElementById('dia').value;
        const mes = document.getElementById('mes').value;
        const anio = document.getElementById('anio').value;
        const dias_vencimiento = document.getElementById('dias_vencimiento').value;
        const precio = document.getElementById('precio').value;
        const valor_en_letras = document.getElementById('valor_en_letras').value;
        const fecha = document.getElementById('fecha').value;
        const cuota = document.getElementById('cuota').value;
        const fecha_inicio = document.getElementById('fecha_inicio').value;
        const fecha_cobranza = document.getElementById('fecha_cobranza').value;
        const nombreFac = document.getElementById('nombreFac').value;
        const cedulaFac = document.getElementById('cedulaFac').value;
        const telefonoFac = document.getElementById('telefonoFac').value;
        const direccionFac = document.getElementById('direccionFac').value;
        const emailFac = document.getElementById('emailFac').value;
        
        // Modificar el PDF existente con los datos del usuario
        const pdfBytes = await modificarPDF(nombre, cedula, telefono, accesorios, descripcion, direccion, dia, mes, anio, dias_vencimiento, precio, valor_en_letras, fecha, cuota, fecha_inicio, fecha_cobranza, precioAccesoriosGlobal, precioEntregaGlobal, descuentoGlobal, nombreFac, cedulaFac, telefonoFac, direccionFac, emailFac);

        // Descargar PDF modificado
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'datos_usuario.pdf';
        link.click();
    });

    calcularValoresBoton.addEventListener('click', (event) => {
        event.preventDefault();
        calcularSubtotal();
    });
    
    const precioInput = document.getElementById('precio');
    const precioAutoInput = document.getElementById('precio_auto');
    const cuotaInput = document.getElementById('cuota');
    const mensualidadInput = document.getElementById('mensualidad');

    precioInput.addEventListener('input', () => {
        precioAutoInput.value = precioInput.value;
    });

    cuotaInput.addEventListener('input', () => {
        mensualidadInput.value = cuotaInput.value;
    });

});

let subtotalGlobal = 0;
let precioAccesoriosGlobal = 0;
let precioEntregaGlobal = 0;
let descuentoGlobal = 0;
let ivaGlobal = 0;

function calcularSubtotal() {
    const cuotaInput = document.getElementById('cuota');
    const precioAccesoriosInput = document.getElementById('precio_accesorios');
    const precioEntregaInput = document.getElementById('precio_entrega');
    const descuentoInput = document.getElementById('descuento');
    const subtotalInput = document.getElementById('subtotal');
    const ivaInput = document.getElementById('iva');
    const precioTotalInput = document.getElementById('precioTotal');

    const cuota = parseFloat(cuotaInput.value) || 0;
    const precioAccesorios = parseFloat(precioAccesoriosInput.value) || 0;
    const precioEntrega = parseFloat(precioEntregaInput.value) || 0;
    const descuento = parseFloat(descuentoInput.value) || 0;

    const subTotalSinDescuento = cuota + precioAccesorios + precioEntrega;
    const descuentoCalculado = subTotalSinDescuento * (descuento / 100);
    const subtotal = subTotalSinDescuento - descuentoCalculado;
    const iva = subtotal * 0.12;
    const precioTotal = subtotal + iva;

    subtotalInput.value = subtotal.toFixed(2);
    ivaInput.value = iva.toFixed(2);
    precioTotalInput.value = precioTotal.toFixed(2);

    subtotalGlobal = subtotal;
    precioAccesoriosGlobal = precioAccesorios;
    precioEntregaGlobal = precioEntrega;
    descuentoGlobal = descuento;
    // Agrega el ivaGlobal para usar en modificarPDF
    ivaGlobal = iva;
}

const diasVencimientoInput = document.getElementById('dias_vencimiento');
const fechaInicioInput = document.getElementById('fecha_inicio');
const fechaCobranzaInput = document.getElementById('fecha_cobranza');

diasVencimientoInput.addEventListener('input', calcularFechaCobranza);
fechaInicioInput.addEventListener('input', calcularFechaCobranza);

function calcularFechaCobranza() {
    const diasVencimiento = parseInt(diasVencimientoInput.value);
    const fechaInicio = fechaInicioInput.value;

    if (!isNaN(diasVencimiento) && fechaInicio) {
        const [fechaInicioDia, fechaInicioMes, fechaInicioAnio] = fechaInicio.split('/');
        const fechaInicioObj = new Date(`${fechaInicioAnio}-${fechaInicioMes}-${fechaInicioDia}`);
        fechaInicioObj.setDate(fechaInicioObj.getDate() + diasVencimiento);
        const fechaCobranzaFormat = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        fechaCobranzaInput.value = fechaCobranzaFormat.format(fechaInicioObj);
    } else {
        fechaCobranzaInput.value = '';
    }
}

async function cargarPDF() {
    const pdfUrl = './recursos/plantilla_contrato.pdf';
    const pdfBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    return pdfBuffer;
}

async function modificarPDF(nombre, cedula, telefono, accesorios, descripcion, direccion, dia, mes, anio, dias_vencimiento, precio, valor_en_letras, fecha, cuota, fecha_inicio, fecha_cobranza, precioAccesorios, precioEntrega, descuento, nombreFac, cedulaFac, telefonoFac, direccionFac, emailFac) {
    const pdfBuffer = await cargarPDF();
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Cambiar el formato de fecha_inicio y fecha_cobranza a aaaa/mm/dd
    const [fechaInicioDia, fechaInicioMes, fechaInicioAnio] = fecha_inicio.split('/');
    const [fechaCobranzaDia, fechaCobranzaMes, fechaCobranzaAnio] = fecha_cobranza.split('/');
    const fechaInicioObj = new Date(`${fechaInicioAnio}-${fechaInicioMes}-${fechaInicioDia}`);
    const fechaCobranzaObj = new Date(`${fechaCobranzaAnio}-${fechaCobranzaMes}-${fechaCobranzaDia}`);
    
    const fechaFormat = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    fecha_inicio = fechaFormat.format(fechaInicioObj);
    fecha_cobranza = fechaFormat.format(fechaCobranzaObj);

    // Obtener el formulario y llenar los campos
    const form = pdfDoc.getForm();
    form.getTextField('nombre').setText(nombre);
    form.getTextField('cedula').setText(cedula);
    form.getTextField('telefono').setText(telefono);
    form.getTextField('accesorios').setText(accesorios);
    form.getTextField('descripcion').setText(descripcion);
    form.getTextField('direccion').setText(direccion);
    form.getTextField('dia').setText(dia);
    form.getTextField('mes').setText(mes);
    form.getTextField('anio').setText(anio);
    form.getTextField('dias_vencimiento').setText(dias_vencimiento);
    form.getTextField('precio').setText(precio);
    form.getTextField('valor_en_letras').setText(valor_en_letras);
    form.getTextField('fecha').setText(fecha);
    form.getTextField('cuota').setText(cuota);
    form.getTextField('fecha_inicio').setText(fecha_inicio);
    form.getTextField('fecha_cobranza').setText(fecha_cobranza);
    form.getTextField('precioAccesorios').setText(precioAccesorios.toFixed(2));
    form.getTextField('precioEntrega').setText(precioEntrega.toFixed(2));
    form.getTextField('descuento').setText(descuento.toFixed(2));
    const iva = (subtotalGlobal * 0.12).toFixed(2);
    form.getTextField('iva').setText(iva);
    const precioTotal = (subtotalGlobal + ivaGlobal).toFixed(2);
    form.getTextField('precioTotal').setText(precioTotal);
    const sumaAccesoriosEntrega = (precioAccesorios + precioEntrega).toFixed(2);
    form.getTextField('sumaAccesoriosEntrega').setText(sumaAccesoriosEntrega);
    form.getTextField('nombreFac').setText(nombreFac);
    form.getTextField('cedulaFac').setText(cedulaFac);
    form.getTextField('telefonoFac').setText(telefonoFac);
    form.getTextField('direccionFac').setText(direccionFac);
    form.getTextField('emailFac').setText(emailFac);

    // Finalizar el formulario y aplicar los cambios
    form.flatten();

    // Serializar el PDF modificado
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}