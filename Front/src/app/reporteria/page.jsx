"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'
import '@/app/creacionRoles/permisos.css';
import PDF from "@/components/PDF";
import PDFK from "@/components/PDFK";
import { pdf } from '@react-pdf/renderer';
import * as FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import config from '@/app/config';


function Reporteria() {
  
  const idPAGINA = 15; //IDENTIFICADOR DE PAGINA UNICO
  const [usuario, setUsuario] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('usuarioDatos');
    if (userData) {
      const datos = JSON.parse(userData);
      setUsuario(datos);
      const permisosArray = datos.permisosUsuario.split(',').map(Number);

      // Verifica si idPAGINA está en permisosArray
      if (!permisosArray.includes(idPAGINA)) {
        // Si idPAGINA no está en permisosArray, redirige a la página especificada
        window.location.href = '/inicio';
      }
    }
  }, []);

  // Estados para los valores de los selectores y fechas
  const [tipoReporte, setTipoReporte] = useState('');
  const [nombreReporte, setNombreReporte] = useState('');
  const [estadoReporte, setEstadoReporte] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [codigoArticulo, setcodigoArticulo] = useState('');
  const [nombreArticulo, setnombreArticulo] = useState('');

  // Estado para controlar la disponibilidad de los selectores secundarios
  const [selectoresActivos, setSelectoresActivos] = useState(true);
  const [selectoresArticulos, setselectoresArticulos] = useState(true);
  const [opcionGenerar, setOpcionGenerar] = useState(true);
  const [opcionImprimir, setOpcionImprimir] = useState(true);

  // Opciones para el primer select (tipo de reporte)
  const opcionesTipoReporte = [
    { value: 'requisiciones', label: 'Requisiciones' },
    { value: 'ingresos', label: 'Ingresos' },
    { value: 'perecederos', label: 'Artículos Perecederos' },
    { value: 'inventario', label: 'Inventario General' },
    { value: 'kardex', label: 'Kardex por Artículo' },
    { value: 'familias', label: 'Familias' },
    { value: 'marcas', label: 'Marcas' },
    { value: 'concentraciones', label: 'Concentraciones' },
    { value: 'presentaciones', label: 'Presentaciones' }
  ];

  // Opciones para el segundo select (estado del reporte)
  const opcionesEstadoReporte = [
    { value: 'todas', label: 'Todos' },
    { value: 'solicitadas', label: 'Solicitados' },
    { value: 'autorizadas', label: 'Autorizados' },
    { value: 'rechazadas', label: 'Anulados' },
    { value: 'despachadas', label: 'Despachados' }
  ];

  // Manejar cambios en el primer select
  const handleTipoReporteChange = (event) => {
    setTipoReporte(event.target.value);
    const selectedIndex = event.target.selectedIndex;
    setNombreReporte(event.target.options[selectedIndex].text);
    // Configuración para desactivar los selectores según la opción seleccionada
    if (event.target.value === 'familias' || event.target.value === 'marcas' || event.target.value === 'concentraciones' 
    || event.target.value === 'presentaciones' || event.target.value === 'perecederos' ) {
      setSelectoresActivos(false);
      setselectoresArticulos(true);
    }else if(event.target.value === 'kardex') {
      setselectoresArticulos(false);
      setSelectoresActivos(true);      
    } 
    else {
      setSelectoresActivos(true);
      setselectoresArticulos(true);
    }
    setOpcionGenerar(false);
    setOpcionImprimir(true);
  };

  // Manejar cambios en el segundo select
  const handleEstadoReporteChange = (event) => {
    setEstadoReporte(event.target.value);
    setOpcionImprimir(true);
  };

  // Manejar cambios en el input de fecha de inicio
  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  // Manejar cambios en el input de fecha de fin
  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  // Manejar cambios en el input de fecha de fin
  const handleArticuloChange = (event) => {
    setcodigoArticulo(event.target.value);
    setnombreArticulo(event.target.selectedOptions[0].text);
  };

// Para reporte inicio
const [dataReporte, setdataReporte] = useState(null); //Datos reportes

const generarPDF = () => {
  let MyDocument;
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses van de 0 a 11
  const anio = fecha.getFullYear();
  var fechaUnificada = dia+'-'+mes+'-'+anio;
  
  if (selectoresArticulos === false) { // es kardex
    MyDocument = (
      <PDFK 
        Reporte={tipoReporte} 
        Datos={dataReporte} 
        FechaI={fechaInicio} 
        FechaF={fechaFin} 
        Autor={usuario.nombre + ' ' + usuario.apellido}
        CodigoArticulo = {codigoArticulo}
        NombreArticulo = {nombreArticulo}
      />
    );
  } else {
    // cualquier otro reporte
    MyDocument = (
      <PDF 
        Reporte={tipoReporte} 
        Datos={dataReporte} 
        FechaI={fechaInicio} 
        FechaF={fechaFin} 
        Autor={usuario.nombre + ' ' + usuario.apellido}
      />
    );
  }

  pdf(MyDocument).toBlob().then(blob => {
    FileSaver.saveAs(blob, `RGM_${nombreReporte}_${fechaUnificada}.pdf`);
  });
};

// Para reporte fin

// Función para generar el reporte 
const generarReporte = () => {
  const datos = {
    nombre_reporte: tipoReporte || 'reporte',
    tipo_estado: estadoReporte || '0',
    fecha_inicio: fechaInicio || '0',
    fecha_fin: fechaFin || '0',
    codigoArticulo: codigoArticulo || '0',
  }
  // Realizar la solicitud GET utilizando Axios
  axios.post(`${config.apiUrl}/generarReporte`, datos)
  .then(response => {
    // Manejar la respuesta de la solicitud
    if(response.data != null){
      // Convertir el arreglo de objetos en un arreglo de arreglos de forma dinámica
        const arregloDatos = response.data.map(objeto => {
        return Object.values(objeto);
      });

      setdataReporte(arregloDatos);
      setOpcionImprimir(false);
    }else{
      Swal.fire({
        icon: 'info',
        text: 'No existen datos para reportar.',
        showConfirmButton: true,
      })
      setOpcionImprimir(true);
    }

  })
  .catch(error => {
    // Manejar errores
    if (error.response) {
      console.log(error.response);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar reporte',
        text: 'Ocurrio un error en la base de datos',
        showConfirmButton: true,
      }).then(() => {
      });;
    } else {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar reporte',
        text: 'Error de conexión',
        showConfirmButton: false,
        timer: 2500
      }).then(() => {
      });;
    }
  });
};


const generarArchivoExcel = async () => {

  let th = [];
  switch (tipoReporte) {
    case 'familias':
        th = ['Código', 'Familia', 'Prefijo','Estado'];
        break;
    case 'marcas':
        th = ['Código', 'Marca', 'Estado'];
        break;
    case 'concentraciones':
      th = ['Código', 'Concentración', 'Estado'];
        break;
    case 'presentaciones':
      th = ['Código', 'Presentación', 'Estado'];
        break;
    case 'perecederos':
      th = ['Código', 'Nombre', 'Marca', 'Familia', 'Cantidad', 'Fecha Vencimiento'];
        break;
    case 'inventario':
      th = ['Código', 'Nombre', 'Marca', 'Familia', 'Saldo inicial', 'Ingresos', 'Salidas', 'Existencia'];
        break;
    case 'ingresos':
      th = ['Código', 'Solicitante', 'Observación', 'Fecha', 'Despacho', 'Requisición', 'Estado'];
        break;
    case 'requisiciones':
      th = ['Código', 'Solicitante', 'Observación', 'Fecha', 'Fecha Despacho', 'Estado'];
        break;
  }
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Agregar el encabezado con color de fondo
    worksheet.addRow(th);
    const encabezadoRow = worksheet.getRow(1);
    encabezadoRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' } // Color de fondo negro
      };
      cell.font = { color: { argb: 'FFFFFF' } }; // Color de texto blanco
    });

    // Agregar cada fila de dataReporte como una fila en la hoja de Excel
    dataReporte.forEach(row => {
      worksheet.addRow(row);
    });

    // Ajustar el ancho de cada columna basado en el contenido de las celdas
    worksheet.columns.forEach(column => {
      let columnLengths = [];
      column.eachCell(cell => {
        const cellLength = cell.value ? cell.value.toString().length :10;
        columnLengths.push(cellLength);
      });
      const maxLength = Math.max(...columnLengths);
      column.width = maxLength < 10 ? 10 : maxLength; // Establecer el ancho mínimo
    });

    // Establecer el estilo para todas las celdas
    worksheet.eachRow(row => {
      row.eachCell(cell => {
        // Justificar el texto en el centro
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        // Agregar bordes a todas las celdas
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });
    });

    // Guardar el libro de Excel
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const fecha = new Date();
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // Los meses van de 0 a 11
      const anio = fecha.getFullYear();
      var fechaUnificada = dia+'-'+mes+'-'+anio;
      const a = document.createElement('a');
      a.href = url;
      a.download = `RGM_${nombreReporte}_${fechaUnificada}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
}

  //Articulos
  const [opcionesArticulos, setArticulos] = useState([]);

  //SELECT ARTICULOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articulosData] = await Promise.all([
          axios.get(`${config.apiUrl}/consultarArticulos`),
        ]);
  
        const opcionesA = articulosData.data.map(articulo => ({
          value: articulo.idArticulo,
          label: articulo.Codigo+' '+articulo.Nombre,
        }));
   
        setArticulos(opcionesA);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error',
          text: 'Recargue la página o consulte con un técnico.'
        });
      }
    };
  
    fetchData();
  }, []);


  return (
    <div className="fondo">
      <Navegacion />
      <div className="container p-5" align="center">
      <div className="table-responsive card custom-card rounded">
      <div className="container mt-5">
      <h2>Reportes inventario RGM</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <h6><b>1. Seleccione el tipo de reporte:</b></h6>
          <select value={tipoReporte} onChange={handleTipoReporteChange} className="form-select  form-select-md mb-3">
            <option value="" disabled>Seleccionar...</option>
            {opcionesTipoReporte.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>
        <div className={`col-md-6 ${!selectoresArticulos ? 'd-none' : ''}`}>
          <h6><b>2. Seleccione el estado:</b></h6>
          <select value={estadoReporte} onChange={handleEstadoReporteChange} className="form-select form-select-md mb-3" disabled={!selectoresActivos}>
            <option value="" disabled>Seleccionar...</option>
            {opcionesEstadoReporte.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>

        <div className={`col-md-12 ${selectoresArticulos ? 'd-none' : ''}`}>
          <h6><b>Seleccione artículo:</b></h6>
          <select value={codigoArticulo} onChange={handleArticuloChange} className="form-select form-select-md mb-3" disabled={!selectoresActivos}>
            <option value="" disabled>Seleccionar...</option>
            {opcionesArticulos.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>

      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h6><b>3. Seleccione la fecha de inicio:</b></h6>
          <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} className="form-control form-select-md mb-3" disabled={!selectoresActivos}/>
        </div>
        <div className="col-md-6">
          <h6><b>4. Seleccione la fecha de fin:</b></h6>
          <input type="date" value={fechaFin} onChange={handleFechaFinChange} className="form-control form-select-md mb-3" disabled={!selectoresActivos} />
        </div>
      </div>
      <div className="row">
      <div className="row mt-4">
        <div className="col-md-12 text-center" >
          <button onClick={generarReporte} style={{ borderRadius: '8px'}} className="btn btn-primary btn-lg" disabled={opcionGenerar}>GENERAR DATOS</button>
        </div>
      </div>
      <div className="row mt-2 justify-content-center">
        <div className="col-md-3 text-center">
        <h5 hidden={opcionImprimir}>Reporte en formato XLSX:</h5>
          <button onClick={generarArchivoExcel} style={{ borderRadius: '8px'}} className="btn btn-success btn-lg" hidden={opcionImprimir}>
            <i className="bi bi-filetype-xlsx"></i> DESCARGAR XLSX
          </button>
        </div>
        <div className="col-md-3 text-center">
        <h5 hidden={opcionImprimir}>Reporte en formato PDF:</h5>
          <button onClick={generarPDF} style={{ borderRadius: '8px'}} className="btn btn-warning btn-lg" hidden={opcionImprimir}>
            <i className="bi bi-filetype-pdf"></i> DESCARGAR PDF
          </button>
        </div>
      </div>
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              className="btn btn-secondary me-md-2"
              type="button"
              onClick={() => {
                window.location.href = '/inicio';
              }}
            >
              Regresar
            </button>
          </div>
    </div>
      </div>
      </div>
    </div>
  );
}

export default Reporteria;
