"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import Paginacion from "@/components/Paginacion";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import config from '@/app/config';

function ConcentracionPage() {
  const idPAGINA = 4; //IDENTIFICADOR DE PAGINA UNICO
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
  
  //Formularios
  const { register, reset ,handleSubmit, formState: { errors } } = useForm();
    
  //Enviar Datos Nueva Concentración
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${config.apiUrl}/agregarConcentracion`, data);     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Concentración agregada',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar concentración',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      }
    } catch (error) {  
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar concentración',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar concentración',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
        });;
      }
    }
    
    reset();
  };

  //Eliminar Concentracion
  //state para especificar que ID esta seleccionado
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const seleccionarId = (id) => {
    setIdSeleccionado(id);
  };

  const handleEliminar = async () => {
    // Lógica deshabilitar el seleccionado
    try {
      const response = await axios.post(`${config.apiUrl}/cambiarEstadoConcentracion`, { FidConcentracion: idSeleccionado.idConcentracion });     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Concentración deshabilitada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar marca',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar marca',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar marca',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      }
    }
  };

  const handleHabilitar = async () => {
    // Lógica habilitar el seleccionado
    try {
      const response = await axios.post(`${config.apiUrl}/cambiarEstadoConcentracion`, { FidConcentracion: idSeleccionado.idConcentracion });     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Concentración Habilitada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar marca',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar marca',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar marca',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      }
    }
  };

  //Paginacion
  const [posts, setPosts] = useState([]);

  const [pagActual, setPaginaActual] = useState(1);
  const tamPagina = 10;

  //Carga inicial
  useEffect(() => {
    const getPost = async () => {
      const { data: res } = await axios.get(
        `${config.apiUrl}/consultarConcentracion`
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
      <div className="container p-4">
        <h1 className="fondo">Concentración</h1>

        <div className="table-responsive card custom-card rounded">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              className="btn btn-primary me-md-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Agregar Concentración
            </button>
          </div>
          <table id="tablaDatos" className="table ">
            <thead>
              <tr>
                <th scope="col" align="center">Código</th>
                <th scope="col" align="center">Concentración</th>
                <th scope="col" align="center"></th>
                <th scope="col" align="center"></th>
                <th scope="col" align="center"></th>
                <th scope="col" align="center">Estado</th>
                <th scope="col" align="center"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                  <tr key={post.idConcentracion}>
                    <td align="center"> {post.idConcentracion}</td>
                    <td> {post.nombre}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td > {post.estado === 1 ? "Habilitado" : post.estado === 2 ? "Deshabilitado" : "Deshabilitado"}</td>
                    <td align="center">
                      
                    {post.estado === 1 && (
                      <div>
                         <button className="btn btn-danger btn-sm m-1" onClick={() => seleccionarId(post)} data-bs-toggle="modal" data-bs-target="#modalDeshabilitar">
                        <i className="bi bi-trash p-1"></i>
                          Inhabilitar
                        </button>
                      </div>
                    )}

                    {post.estado === 2 && (
                      <div>
                        <button className="btn btn-outline-primary btn-sm m-1" onClick={() => seleccionarId(post)} data-bs-toggle="modal" data-bs-target="#modalHabilitar">
                        <i className="bi bi-arrow-clockwise"></i>
                          Habilitar
                        </button>
                      </div>
                    )}  
                    </td>
                  </tr>
                ))
              }
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

      {/* Modal Nueva Concentración*/}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Agregar Concentración
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            {/* INICIO FORMULARIO AGREGAR */}
            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="form-group m-1">
              <label htmlFor="nombreAgregar" className="font-weight-bold">Ingrese concentración:</label>
                <input className="form-control" placeholder="Concentración" {...register("FNombre", { required: true })} />
                {errors.FNombre && <span className="text-danger">Es necesario agregar la concentración.</span>}
              </div>
              <div className="mb-4"> 
              <br></br> 
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">             
                <button
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" type="submit">
                  Agregar
                </button>
              </div> 
              </div>
            </form>
            {/* FIN FORMULARIO AGREGAR */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal INHABILITAR MARCA */}
      <div
        className="modal fade"
        id="modalDeshabilitar"
        tabIndex="-1"
        aria-labelledby="modalHabilitarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalHabilitarLabel">
                Inhabilitar Concentración
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              ¿Está seguro que desea inhabilitar la siguiente concentración? <br></br> <div style={{ textAlign: 'center', fontSize: '1.2em' }}><b>{idSeleccionado?.nombre}</b></div>
              <br></br>
              <button className="btn btn-primary mt-3" onClick={handleEliminar} data-bs-dismiss="modal">Confirmar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal HABILITAR MARCA */}
           <div
        className="modal fade"
        id="modalHabilitar"
        tabIndex="-1"
        aria-labelledby="modalEdiatarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEdiatarLabel">
                Habilitar Concentración
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              ¿Está seguro que desea habilitar la siguiente concentración? <br></br> <div style={{ textAlign: 'center', fontSize: '1.2em' }}><b>{idSeleccionado?.nombre}</b></div>
              <br></br>
              <button className="btn btn-primary mt-3" onClick={handleHabilitar} data-bs-dismiss="modal">Confirmar</button>
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

export default ConcentracionPage;
