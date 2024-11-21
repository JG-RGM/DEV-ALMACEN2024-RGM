"use client";
import React, { useEffect, useState} from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import Paginacion from "@/components/Paginacion";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'
import PDF2 from '@/components/PDF2';
import * as FileSaver from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import config from '@/app/config';

function despachoPage() {

  const idPAGINA = 10; //IDENTIFICADOR DE PAGINA UNICO
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

  // Obtener la fecha actual en formato YYYY-MM-DD para establecerla como valor por defecto
  const today = new Date().toISOString().split('T')[0];

  //Aprobar Requisicion
  const realizarRequisicion = (idRequisicion) => {
    // Hacer la solicitud POST con Axios
    axios.post(`${config.apiUrl}/realizarRequisicion`, {
      idRequisicion: idRequisicion,
      datos: resultadoDetalleRequisicions
    })
    .then(response => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Requisición Despachada',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al despachar requisición',
          showConfirmButton: false,
          timer: 2500
        });
      }
    })
    .catch(error => {
      console.error('Error al enviar la solicitud:', error);
    });
  };


  //********************************************************************EDITAR CANTIDAD INGRESADA
  const [cantidadEditando, setCantidadEditando] = useState(null);

  // Función para activar la edición
  const activarEdicion = (idDetalle, cantidad) => {
    setCantidadEditando({ idDetalle, cantidad });
  };

  // Función para guardar la edición
  const guardarEdicion = (idDetalle) => {
    // Accede a la cantidad editada y al idDetalle
    const nuevaCantidad = cantidadEditando.cantidad;

    // Hacer la solicitud POST con Axios
    axios.post(`${config.apiUrl}/agregarCantidadAprobada`, {
      idDetalle: idDetalle,
      Cantidad: nuevaCantidad
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Cantidad Aprobada',
      });
      realizarSolicitudAxios();
      setCantidadEditando(null); // Desactivar la edición después de guardar
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error al aprobar cantidad',
      });
    });
  };
  //********************************************************************FIN EDITAR CANTIDAD INGRESADA

  //Seleccionar
  //state para especificar que ID esta seleccionado
  const [requisicionSeleccionado, setRequisicionSeleccionado] = useState({
    idRequisicion: '',
    FechaRequisicion: '',
    estado: ''
  });
  const [resultadoDetalleRequisicions, setresultadoDetalleRequisicion] = useState(null);
  const [resultadoDetalleDespacho, setresultadoDetalleDespacho] = useState(null);
  const [errorDetalleRequisicions, seterrorDetalleRequisicion] = useState(null);

  //Despues de seleccionarlo realiza el llamado de los datos del requisicion en especifico
  const seleccionarRequisicion = (requisicion) => {
    setresultadoDetalleRequisicion(null);
    setRequisicionSeleccionado(requisicion);
  };


  const realizarSolicitudAxios = () => {
    try {
      if (requisicionSeleccionado) {

        axios.post(`${config.apiUrl}/consultarDetalleRequisiciones`, requisicionSeleccionado)
          .then(response => {
            
            //setresultadoDetalleRequisicion(response.data);
            
            const arrayObjetosOriginales = response.data; // Usamos el resultado de la solicitud Axios
            let contador = 0;
            // Aplicar la lógica dentro de la función map
            const arrayObjetosNuevo = arrayObjetosOriginales.map((objeto, index, array) => {
              // Si la fecha de vencimiento no es nula
              
              if (objeto.fechaVencimiento !== null) {
                
                // Calcular la cantidad faltante
                const faltanteActual = objeto.cantidadArticuloVencimiento - objeto.cantidadAprobada;
                // Si la cantidad faltante actual es positiva
                if (faltanteActual < 0) {
                  
                  objeto.restar =  objeto.cantidadArticuloVencimiento;
                  objeto.faltan = (faltanteActual*(-1));
                  objeto.cantidadAprobada = objeto.cantidadArticuloVencimiento;
                    
                    // Buscar el siguiente objeto con un idArticulo diferente
                    for (let i = index + 1; i < array.length; i++) {
                      if (array[i].idArticulo == objeto.idArticulo) {
                        array[i].cantidadAprobada = (faltanteActual*(-1));
                        objeto.incluye = 1;
                        break;
                      }
                    }
                  
                } else {
                  
                  objeto.restar = faltanteActual >= 0 ? objeto.cantidadAprobada : faltanteActual*(-1);
                  // Buscar el siguiente objeto con un idArticulo diferente
                  for (let i = index + 1; i < array.length; i++) {
                    if (array[i].idArticulo == objeto.idArticulo) {
                      contador = 1;
                      break;
                    }else{
                      contador = 0;
                      break;
                    }
                  }
                  if(contador == 0){
                    objeto.incluye = 1;
                  }
                  

                }
              }else{
                objeto.incluye = 1;
              }
              return objeto;
            });

            // Filtrar objetos según los criterios especificados
            const nuevoArrayFiltrado = arrayObjetosNuevo.filter(objeto => {
              // Filtrar si la cantidadAprobada es menor que cantidadArticuloVencimiento, si la fecha de vencimiento es nula, si la resta es 0 y si listar es igual a 1
              return objeto.incluye === 1;
            });

            setresultadoDetalleRequisicion(nuevoArrayFiltrado);
          })
          .catch(error => {
            seterrorDetalleRequisicion('Error en la solicitud Axios:', error);
          });
      } else {
        seterrorDetalleRequisicion('Error: El requisicion aún no se ha actualizado.');
      }
    } catch (error) {
      seterrorDetalleRequisicion('Error:', error);
    }
  };

  const realizarSolicitudAxios2 = () => {
    try {
      if (requisicionSeleccionado) {

        axios.post(`${config.apiUrl}/consultarDetalleDespacho`, requisicionSeleccionado)
          .then(response => {
            setresultadoDetalleDespacho(response.data);
          })
          .catch(error => {
            seterrorDetalleRequisicion('Error en la solicitud Axios:', error);
          });
      } else {
        seterrorDetalleRequisicion('Error: El requisicion aún no se ha actualizado.');
      }
    } catch (error) {
      seterrorDetalleRequisicion('Error:', error);
    }
  };

  useEffect(() => {
    // Configurar el evento después de que el componente se haya montado
    const modalElement = document.getElementById('modalVisualizar');
    if (modalElement) {
      modalElement.addEventListener('shown.bs.modal', realizarSolicitudAxios);
    }

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      if (modalElement) {
        modalElement.removeEventListener('shown.bs.modal', realizarSolicitudAxios);
      }

    };
  }, [realizarSolicitudAxios]);


  useEffect(() => {
    // Configurar el evento después de que el componente se haya montado
    const modalElement = document.getElementById('modalVisualizar2');
    if (modalElement) {
      modalElement.addEventListener('shown.bs.modal', realizarSolicitudAxios2);
    }

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      if (modalElement) {
        modalElement.removeEventListener('shown.bs.modal', realizarSolicitudAxios2);
      }

    };
  }, [realizarSolicitudAxios2]);

  //Paginacion
  const [posts, setPosts] = useState([]);

  const [pagActual, setPaginaActual] = useState(1);
  const tamPagina = 10;

    //Carga inicial
    useEffect(() => {
      const getPost = async () => {
        const { data: res } = await axios.get(
          `${config.apiUrl}/consultarRequisicionesDespacho`
        );
        setPosts(res);
      };
      getPost();
    }, []);



  const handlePageChange = (page) => {
    setPaginaActual(page);
  };

  const paginatePosts = paginar(posts, pagActual, tamPagina);

  const [informacionReporte, setInformacionReporte] = useState(null); 
  const [dataReporte, setdataReporte] = useState(null); //Datos reportes

  //State para el nombre del reporte
  const [nombreReporte, setNombreReporte] = useState(''); 

  const consultarPDF = (post) => {
    // Realizar la solicitud GET utilizando Axios
    const envioDatos = {
      idRequisicion: post.idRequisicion,
    };

    axios.post(`${config.apiUrl}/generarReporteDespacho`, envioDatos)
    .then(response => {
      // Manejar la respuesta de la solicitud
      if(response.data != null){

        let informacion = {
          observacion: response.data[0].Observacion,
          fechaDespacho: response.data[0].fechaDespacho,
          solicitante: response.data[0].solicitante,
          autorizador: response.data[0].autorizador,
          codigo: response.data[0].Codigo
        }
        setInformacionReporte(informacion);
        var nombre = response.data[0].Codigo;

        let objetoDatos = response.data;

        // Propiedades que deseas incluir en el nuevo objeto
        let propiedadesDeseadas = ["codigoArticulo", "nombreArticulo", "cantidadSolicitada", "cantidadAprobada"];



        // Crear un nuevo array con objetos que contienen solo las propiedades deseadas
        let nuevoArray = objetoDatos.map(objeto => {
            let nuevoObjeto = {};
            propiedadesDeseadas.forEach(propiedad => {
                if (objeto.hasOwnProperty(propiedad)) {
                    nuevoObjeto[propiedad] = objeto[propiedad];
                }
            });
            return nuevoObjeto;
        });

        //Convertir el arreglo de objetos en un arreglo de arreglos de forma dinámica
        const arregloDatos = nuevoArray.map(objeto => {
          return Object.values(objeto);
        });
        setdataReporte(arregloDatos);

        const MyDocument = (
          <PDF2 Reporte={'despacho'} Datos={arregloDatos} Informacion={informacion} Autor={usuario.nombre+' '+usuario.apellido} />
        );
    
        pdf(MyDocument).toBlob().then(blob => {
            FileSaver.saveAs(blob, `RGM_Despacho_${nombre}.pdf`);
        });

      }else{
        Swal.fire({
          icon: 'info',
          text: 'No existen datos para reportar.',
          showConfirmButton: true,
        })
      }
  
    })
    .catch(error => {
      // Manejar errores
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al generar reporte',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: true,
        }).then(() => {
        });;
      } else {
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

  const consultarPDF2 = (post) => {
    // Realizar la solicitud GET utilizando Axios
    const envioDatos = {
      idRequisicion: post.idRequisicion,
    };

    axios.post(`${config.apiUrl}/generarReporteDespacho`, envioDatos)
    .then(response => {
      // Manejar la respuesta de la solicitud
      if(response.data != null){

        let informacion = {
          observacion: response.data[0].Observacion,
          fechaDespacho: response.data[0].fechaDespacho,
          solicitante: response.data[0].solicitante,
          autorizador: '',
          codigo: response.data[0].Codigo
        }
        setInformacionReporte(informacion);
        var nombre = response.data[0].Codigo;

        let objetoDatos = response.data;

        // Propiedades que deseas incluir en el nuevo objeto
        let propiedadesDeseadas = ["codigoArticulo", "nombreArticulo", "cantidadSolicitada"];



        // Crear un nuevo array con objetos que contienen solo las propiedades deseadas
        let nuevoArray = objetoDatos.map(objeto => {
            let nuevoObjeto = {};
            propiedadesDeseadas.forEach(propiedad => {
                if (objeto.hasOwnProperty(propiedad)) {
                    nuevoObjeto[propiedad] = objeto[propiedad];
                }
            });
            return nuevoObjeto;
        });

        //Convertir el arreglo de objetos en un arreglo de arreglos de forma dinámica
        const arregloDatos = nuevoArray.map(objeto => {
          return Object.values(objeto);
        });
        setdataReporte(arregloDatos);

        const MyDocument = (
          <PDF2 Reporte={'despachoR'} Datos={arregloDatos} Informacion={informacion} Autor={usuario.nombre+' '+usuario.apellido} />
        );
    
        pdf(MyDocument).toBlob().then(blob => {
            FileSaver.saveAs(blob, `RGM_Despacho_Rechazado_${nombre}.pdf`);
        });

      }else{
        Swal.fire({
          icon: 'info',
          text: 'No existen datos para reportar.',
          showConfirmButton: true,
        })
      }
  
    })
    .catch(error => {
      // Manejar errores
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al generar reporte',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: true,
        }).then(() => {
        });;
      } else {
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

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container-fluid p-4 " style={{ width: "90%"}}>
        <h1 className="fondo">Despacho de Requisiciones</h1>

        <div className="table-responsive card custom-card rounded" >
          <table id="tablaDatos" className="table ">
            <thead>
              <tr align="center">
                <th scope="col" align="center" style={{ width: '200px' }}>No. Requisición</th>
                <th scope="col" align="center">Solicitante</th>
                <th scope="col" align="center" style={{ width: '45%' }}>Observaciones</th>
                <th scope="col" align="center">Fecha Solicitud</th>
                <th scope="col" align="center">Fecha Despacho</th>
                <th scope="col" align="center">Estado</th>
                <th scope="col" align="center">Detalle</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                <tr key={post.idRequisicion}>
                  <td align="center"> {post.codigo}</td>
                  <td align="center"> {post.solicitante}</td>
                  <td align="left"> {post.observaciones}</td>
                  <td align="center"> {post.fechaSolicitud}</td>
                  <td align="center"> {post.fechaDespacho}</td>
                  <td align="center">
                    {post.estado === 2 ? (
                      <span>Pendiente Despacho <i className="bi bi-clock-history" style={{ color: 'red' }}></i> </span>
                    ) : (
                      post.estado === 3 ? (
                        <span>
                          Despachado <i className="bi bi-check-all p-1" style={{ color: 'green' }}></i>
                        </span>
                      ) : post.estado === 4 ? (
                        <span>
                          Rechazado <i className="bi bi-dash-circle" style={{ color: 'red' }}></i>
                        </span>
                      ) 
                      : (
                        <span>Pendiente <i className="bi bi-clock-history" style={{ color: 'red' }}></i> </span>
                      )
                    )}
                  </td>
                  <td align="center">
                    
                  {post.estado === 2 && ( 
                    //Para despachar
                    <div>
                      <button className="btn btn-warning btn-sm m-1" onClick={() => seleccionarRequisicion(post)} data-bs-toggle="modal" data-bs-target="#modalVisualizar">
                      <i className="bi bi-eye-fill p-1"></i>
                        Visualizar
                      </button>
                    </div>
                    
                  )}

                  {post.estado === 3 && (
                    <div>
                      <button className="btn btn-warning btn-sm m-1" style={{ width: '105px', height:'35px' }} onClick={() => seleccionarRequisicion(post)} data-bs-toggle="modal" data-bs-target="#modalVisualizar2">
                      <i className="bi bi-eye-fill p-1"></i>
                        Visualizar
                      </button>
                      <button className="btn btn-info btn-sm m-1" style={{ width: '105px', height:'35px' }} onClick={() => consultarPDF(post)}>
                      <i className="bi bi-filetype-pdf p-1"></i>
                        PDF
                      </button>
                    </div>
                  )}

                  {post.estado === 4 && (
                    <div>
                      <button className="btn btn-warning btn-sm m-1" style={{ width: '105px', height:'35px' }} onClick={() => seleccionarRequisicion(post)} data-bs-toggle="modal" data-bs-target="#modalVisualizar">
                      <i className="bi bi-eye-fill p-1"></i>
                        Visualizar
                      </button>
                      <button className="btn btn-info btn-sm m-1" style={{ width: '105px', height:'35px' }} onClick={() => consultarPDF2(post)}>
                      <i className="bi bi-filetype-pdf p-1"></i>
                        PDF
                      </button>
                    </div>
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paginacion
            items={posts.length}
            pagActual={pagActual}
            tamPagina={tamPagina}
            onPageChange={handlePageChange}
          />

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
     
      {/* Modal VISUALIZAR REQUISICION*/}
      <div
        className="modal fade"
        id="modalVisualizar"
        tabIndex="-1"
        aria-labelledby="modalVisualizar"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalVisualizar">
                Detalle Requisición {requisicionSeleccionado.codigo}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container text-center">
              </div>
              <span>{errorDetalleRequisicions}</span>
              {resultadoDetalleRequisicions ? (
                  <div className="table-container" style={{ maxWidth: '3000px', maxHeight: '700px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr align="center">
                          <th >Código</th>
                          <th >Artículo</th>
                          <th >Descripción</th>
                          <th >Cantidad solicitada</th>
                          <th >Cantidad aprobada</th>
                          <th >Fecha Vencimiento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultadoDetalleRequisicions.map((detalle, index) => (
                        <tr key={index} align="center">
                          <td >{detalle.codigoArticulo}</td>
                          <td >{detalle.nombreArticulo}</td>
                          <td >{detalle.descripcionArticulo}</td>
                          <td align="center">{detalle.cantidadTotalIngresada}</td>
                          <td align="center"><b>{detalle.cantidadAprobada}</b></td>
                          <td align="center"><b>{detalle.fechaVencimiento}</b></td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                <div className="text-center mt-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
              {requisicionSeleccionado.estado === 2 && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button type="button" className="btn btn-success" onClick={() => realizarRequisicion(requisicionSeleccionado.idRequisicion)}>
                    Realizar Despacho
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal VISUALIZAR Despacho*/}
      <div
        className="modal fade"
        id="modalVisualizar2"
        tabIndex="-1"
        aria-labelledby="modalVisualizar2"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalVisualizar">
                Detalle Requisición {requisicionSeleccionado.codigo}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container text-center">
              </div>
              <span>{errorDetalleRequisicions}</span>
              {resultadoDetalleDespacho ? (
                  <div className="table-container" style={{ maxWidth: '3000px', maxHeight: '700px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr align="center">
                          <th >Código</th>
                          <th >Artículo</th>
                          <th >Descripción</th>
                          <th >Cantidad solicitada</th>
                          <th >Cantidad aprobada</th>
                          <th >Fecha Vencimiento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultadoDetalleDespacho.map((detalle, index) => (
                        <tr key={index} align="center">
                          <td >{detalle.codigoArticulo}</td>
                          <td >{detalle.nombreArticulo}</td>
                          <td >{detalle.descripcionArticulo}</td>
                          <td align="center">{detalle.cantidadSolicitada}</td>
                          <td align="center"><b>{detalle.cantidadAprobada}</b></td>
                          <td align="center"><b>{detalle.fechaVencimiento}</b></td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                <div className="text-center mt-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrip de boostrap para Modal */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" />
      <script src="https://cdn.datatables.net/v/bs5/dt-1.13.4/datatables.min.js" />
      <script src="https://cdn.datatables.net/1.12.1/js/dataTables.bootstrap5.min.js" />
    </div>
  );
}

export default despachoPage;
