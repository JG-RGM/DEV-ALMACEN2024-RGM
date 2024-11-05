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

function FamiliasPage() {
  const idPAGINA = 3; //IDENTIFICADOR DE PAGINA UNICO
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
  const { register: registerFormB, handleSubmit: handleSubmitFormB, formState: { errors: errorsFormB }, reset: resetFormB } = useForm();
    
  //Enviar Datos Nueva Familia
  const onSubmit = async (data) => {
    
    try {
      const response = await axios.post(`${config.apiUrl}/agregarFamilia`, data);     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Familia agregada',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar familia',
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
          title: 'Error al agregar familia',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar familia',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
        });;
      }
    }
    
    reset();
  };

  //Enviar Datos Actualizar usuario
  const onSubmitA = async (data) => {
    if(data.FANombre == ''){
      data.FANombre = idSeleccionado.nomv;
    }
    if(data.FAApellido == ''){
      data.FAApellido = idSeleccionado.APELLIDO;
    }
    const datos = {...data, FACorreo: idSeleccionado.CORREO_ELECTRONICO}
    try {
      const response = await axios.post(`${config.apiUrl}/actualizarUsuario`, datos);     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el usuario',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });;
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el usuario',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el usuario',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      }
    }
    
    resetFormB();
  };

  //Eliminar Familia
  //state para especificar que ID esta seleccionado
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const seleccionarId = (id) => {
    setIdSeleccionado(id);
  };

  const handleEliminar = async () => {
    // Lógica deshabilitar el seleccionado
    try {
      const response = await axios.post(`${config.apiUrl}/cambiarEstadoFamilia`, { FidFamilia: idSeleccionado.idFamilia });     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Familia deshabilitada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar familia',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar familia',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar familia',
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
      const response = await axios.post(`${config.apiUrl}/cambiarEstadoFamilia`, { FidFamilia: idSeleccionado.idFamilia });     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Familia Habilitada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar familia',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar familia',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar familia',
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
        `${config.apiUrl}/consultarFamilias`
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
        <h1 className="fondo">Familias</h1>

        <div className="table-responsive card custom-card rounded">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              className="btn btn-primary me-md-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Agregar Familia
            </button>
          </div>
          <table id="tablaDatos" className="table ">
            <thead>
              <tr>
                <th scope="col" align="center">Familia</th>
                <th scope="col" align="center">Prefijo</th>
                <th scope="col" align="center"></th>
                <th scope="col" align="center"></th>
                <th scope="col" align="center"></th>
                <th scope="col" align="center">Estado</th>
                <th scope="col" align="center"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                  <tr key={post.idFamilia}>
                    <td> {post.nombre}</td>
                    <td> {post.prefijo}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td > {post.estado === 1 ? "Habilitado" : post.estado === 2 ? "Deshabilitado" : "Deshabilitado"}</td>
                    <td align="center">
                      
                    {post.estado === 1 && (
                      <div>
                        <button className="btn btn-danger btn-sm m-1" onClick={() => seleccionarId(post)} data-bs-toggle="modal" data-bs-target="#modalDeshabilitar">
                        <i className="bi bi-trash p-1"></i>
                          Deshabilitar
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

      {/* Modal Nueva familia*/}
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
                Agregar familia
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
              <label  className="font-weight-bold">Nombre</label>
                <input className="form-control" placeholder="Nombre Familia" {...register("FNombre", { required: true })} />
                {errors.FNombre && <span className="text-danger">Es necesario agregar nombre de la familia.</span>}
              </div>
              <div className="form-group m-1">
              <label  className="font-weight-bold">Prefijo</label>
                <input className="form-control" placeholder="Prefijo" {...register("FPrefijo", { required: true })} />
                {errors.FPrefijo && <span className="text-danger">Es necesario agregar un prefijo.</span>}
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

      {/* Modal INHABILITAR Familia */}
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
                Deshabilitar familia
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              ¿Está seguro que desea deshabilitar la siguiente familia? <br></br> <div style={{ textAlign: 'center', fontSize: '1.2em' }}><b>{idSeleccionado?.nombre}</b></div>
              <br></br>
              <button className="btn btn-primary mt-3" onClick={handleEliminar} data-bs-dismiss="modal">Confirmar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal HABILITAR Familia */}
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
                Habilitar familia
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              ¿Está seguro que desea habilitar la siguiente familia? <br></br> <div style={{ textAlign: 'center', fontSize: '1.2em' }}><b>{idSeleccionado?.nombre}</b></div>
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

export default FamiliasPage;
