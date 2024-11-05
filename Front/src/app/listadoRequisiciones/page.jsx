"use client";
import React, { useEffect, useState} from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import Paginacion from "@/components/Paginacion";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'
import config from '@/app/config';

function aprobacionRequisicionesPage() {
  const idPAGINA = 8; //IDENTIFICADOR DE PAGINA UNICO
  useEffect(() => {
    const userData = localStorage.getItem('usuarioDatos');
    if (userData) {
      const datos = JSON.parse(userData);
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
      idRequisicion: idRequisicion
    })
    .then(response => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Requisicion Aprobado',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar requisicion',
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
  // Función para guardar la edición
  const guardarEdicion = (idDetalle) => {
    // Accede a la cantidad editada y al idDetalle
    const nuevaCantidad = cantidadEditando.cantidad;

    // Hacer la solicitud POST con Axios
    axios.post(`${config.apiUrl}/actualizarCantidadDetalle`, {
      idDetalle: idDetalle,
      Cantidad: nuevaCantidad
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Cantidad Actualizada',
      });
      realizarSolicitudAxios();
      setCantidadEditando(null); // Desactivar la edición después de guardar
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar cantidad',
      });
    });
  };
  //********************************************************************FIN EDITAR CANTIDAD INGRESADA

  //Seleccionar
  //state para especificar que ID esta seleccionado
  const [requisicionSeleccionado, setRequisicionSeleccionado] = useState({
    idRequisicion: '',
    FechaRequisicion: '',
    Despacho: '',
    Requisicion: '',
    Estado: ''
  });
  const [resultadoDetalleRequisicions, setresultadoDetalleRequisicion] = useState(null);
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
            // Filtrar objetos para mantener solo uno por cada idArticulo y cantidadSolicitada
            const uniqueObjetos = {}; // Objeto auxiliar para realizar el seguimiento de los elementos únicos
            const nuevoArrayFiltrado = response.data.filter(objeto => {
              const key = objeto.codigoArticulo;
              if (!uniqueObjetos[key]) {
                  uniqueObjetos[key] = true;
                  return true; // Mantener el objeto si es único
              }
              return false; // Descartar el objeto si es duplicado
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



  //Paginacion
  const [posts, setPosts] = useState([]);

  const [pagActual, setPaginaActual] = useState(1);
  const tamPagina = 10;

    //Carga inicial
    useEffect(() => {
      const getPost = async () => {
        const { data: res } = await axios.get(
          `${config.apiUrl}/consultarRequisiciones`
        );
        setPosts(res);
      };
      getPost();
    }, []);



  const handlePageChange = (page) => {
    setPaginaActual(page);
  };

  const paginatePosts = paginar(posts, pagActual, tamPagina);


  return (
    <div className="fondo">
      <Navegacion />
      <div className="container-fluid p-4 " style={{ width: "90%"}}>
        <h1 className="fondo">Listado de Requisiciones</h1>

        <div className="table-responsive card custom-card rounded" >
          <table id="tablaDatos" className="table ">
            <thead>
              <tr align="center">
                <th scope="col" align="center" style={{ width: '200px' }}>No. Requisición</th>
                <th scope="col" align="center">Fecha Solicitud</th>
                <th scope="col" align="center">Solicitante</th>
                <th scope="col" align="center">Observaciones</th>
                <th scope="col" align="center">Estado</th>
                <th scope="col" align="center">Detalle</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
            {paginatePosts
            .filter(post => post.estado !== 4)  // Filtrar requisiciones con estado 4
            .map((post) => (
              <tr key={post.idRequisicion}>
                <td align="center"> {post.codigo}</td>
                <td align="center"> {post.fechaSolicitud}</td>
                <td align="center"> {post.solicitante}</td>
                <td align="center"> {post.observaciones}</td>
                <td align="center">
                  {post.estado === 1 ? (
                    <span>Pendiente <i className="bi bi-clock-history" style={{ color: 'red' }}></i> </span>
                  ) : post.estado === 2 ? (
                    <span>
                      Aprobado <i className="bi bi-check-all p-1" style={{ color: 'green' }}></i>
                    </span>
                  ) : post.estado === 3 ? (
                    <span>
                      Rechazado <i className="bi bi-x-circle" style={{ color: 'blue' }}></i>
                    </span>
                  ) : (
                    <span>Pendiente <i className="bi bi-clock-history" style={{ color: 'red' }}></i> </span>
                  )}
                </td>
                <td align="center">
                  {(post.estado === 1 || post.estado === 2) && (
                    <div>
                      <button className="btn btn-warning btn-sm m-1" onClick={() => seleccionarRequisicion(post)} data-bs-toggle="modal" data-bs-target="#modalVisualizar">
                        <i className="bi bi-eye-fill p-1"></i>
                        Visualizar
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
                  <div className="table-container" style={{ maxWidth: '1500px', maxHeight: '700px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr align="center">
                          <th >Código</th>
                          <th >Artículo</th>
                          <th >Descripción</th>
                          <th >Cantidad solicitada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultadoDetalleRequisicions.map((detalle, index) => (
                        <tr key={index} align="center">
                          <td >{detalle.codigoArticulo}</td>
                          <td >{detalle.nombreArticulo}</td>
                          <td >{detalle.descripcionArticulo}</td>
                          <td align="center">{detalle.cantidadTotalIngresada}</td>
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
              {requisicionSeleccionado.estado === 1 && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
                  {/* <button type="button" className="btn btn-success" onClick={() => realizarRequisicion(requisicionSeleccionado.idRequisicion)}>
                    Aprobar Requisicion
                  </button> */}
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

export default aprobacionRequisicionesPage;
