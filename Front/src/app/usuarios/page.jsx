"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import Paginacion from "@/components/Paginacion";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import config from '@/app/config';

function UsuarioPage() {

  const idPAGINA = 1; //IDENTIFICADOR DE PAGINA UNICO
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
    
  //Enviar Datos Agregar Nuevo usuario
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${config.apiUrl}/agregarUsuario`, data);     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario agregado',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar el usuario',
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
          title: 'Error al agregar el usuario',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar el usuario',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      }
    }
    
    reset();
  };

  //Enviar Datos Actualizar usuario
  const onSubmitA = async (data) => {
    if(data.FANombre == ''){
      data.FANombre = idSeleccionado.Nombre;
    }
    if(data.FAApellido == ''){
      data.FAApellido = idSeleccionado.Apellido;
    }
    const datos = {...data, FACorreo: idSeleccionado.Correo_Electronico}
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

  //Eliminar usuario
  //state para especificar que ID esta seleccionado
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const seleccionarId = (id) => {
    let objeto = posts.find((objeto) => objeto.Correo_Electronico === id)
    setIdSeleccionado(objeto);
  };

  const handleEliminar = async () => {
    // Lógica para eliminar la fila con el identificador seleccionado
    try {
      const response = await axios.post(`${config.apiUrl}/eliminarUsuario`, { FCorreo: idSeleccionado.Correo_Electronico });     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario deshabilitado',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar usuario',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar usuario',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al deshabilitar usuario',
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
    // Lógica para eliminar la fila con el identificador seleccionado
    try {
      const response = await axios.post(`${config.apiUrl}/habilitarUsuario`, { FCorreo: idSeleccionado.Correo_Electronico });     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario habilitado',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar usuario',
          showConfirmButton: false,
          timer: 2500
        });
      }
    } catch (error) {     
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar usuario',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al habilitar usuario',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 2500
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

  //Roles
  const [opcionesRoles, setRoles] = useState([]);
  const [rolesTabla, setRolesTabla] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, articulosData] = await Promise.all([
          axios.get(`${config.apiUrl}/consultarRoles`),
          axios.get(`${config.apiUrl}/consultarUsuarios`)
        ]);
  
        const opcionesR = rolesData.data.map(rol => ({
          value: rol.idRol,
          label: rol.nombre
        }));

        setRolesTabla(rolesData.data);

        setRoles(opcionesR);
        setPosts(articulosData.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un error',
          text: 'Recargue la página o consulte con un técnico.'
        });;
      }
    };
  
    fetchData();
  }, []);



  const handlePageChange = (page) => {
    setPaginaActual(page);
  };

  const paginatePosts = paginar(posts, pagActual, tamPagina);

  //Nombre de roles para la tabla
  function obtenerRolPorId(idBuscado) {
    // Busca el objeto con el ID correspondiente en el array
    const objetoEncontrado = rolesTabla.find(item => item.idRol === idBuscado);
    
    // Verifica si se encontró un objeto con el ID buscado
    if (objetoEncontrado) {
        // Devuelve el nombre del objeto encontrado
        return objetoEncontrado.nombre;
    } else {
        // Devuelve null si no se encuentra ningún objeto con el ID buscado
        return null;
    }
  }

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container p-4">
        <h1 className="fondo">Administrar Usuarios</h1>

        <div className="table-responsive card custom-card rounded">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              className="btn btn-primary me-md-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Agregar Usuario
            </button>
          </div>
          <table id="tablaDatos" className="table ">
            <thead>
              <tr align="center">
                <th scope="col" align="center">Código</th>
                <th scope="col" align="center">Nombre</th>
                <th scope="col" align="center">Apellido</th>
                <th scope="col" align="center">Correo Electronico</th>
                <th scope="col" align="center">Fecha de Creación</th>
                <th scope="col" align="center">Rol</th>
                <th scope="col" align="center">Estado</th>
                <th scope="col" align="center"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                <tr key={post.idUsuario} align="center">
                  <td align="center"> {post.idUsuario}</td>
                  <td> {post.Nombre}</td>
                  <td> {post.Apellido}</td>
                  <td> {post.Correo_Electronico}</td>
                  <td> {post.FechaCreacion}</td>
                  <td align="center"> {obtenerRolPorId(post.IdRol)}</td>
                  <td > {post.idEstado === 1 ? "Habilitado" : post.idEstado === 2 ? "Deshabilitado" : "Deshabilitado"}</td>
                  <td align="center">
                    
                  {post.idEstado === 1 && (
                    <div>
                      <button className="btn btn-warning btn-sm m-1" onClick={() => seleccionarId(post.Correo_Electronico)} data-bs-toggle="modal"  data-bs-target="#modalModificar">
                      <i className="bi bi-pencil-square p-1"></i>
                        Actualizar
                      </button>
                      <button className="btn btn-danger btn-sm m-1" onClick={() => seleccionarId(post.Correo_Electronico)} data-bs-toggle="modal" data-bs-target="#modalEliminar">
                      <i className="bi bi-trash p-1"></i>
                        Deshabilitar
                      </button>
                    </div>
                  )}

                  {post.idEstado === 2 && (
                    <div>
                      <button className="btn btn-outline-primary btn-sm m-1" onClick={() => seleccionarId(post.Correo_Electronico)} data-bs-toggle="modal" data-bs-target="#modalHabilitar">
                      <i className="bi bi-arrow-clockwise"></i>
                        Habilitar
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

      {/* Modal AGREGAR USUARIO*/}
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
                Agregar usuario nuevo
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
            <form onSubmit={handleSubmit(onSubmit)} id="formAgregar">

              <div className="form-group m-1">
              <label htmlFor="nombreAgregar" className="font-weight-bold">Nombre</label>
                <input className="form-control" placeholder="Nombre" {...register("FNombre", { required: true })} />
                {errors.FNombre && <span className="text-danger">Es necesario agregar nombre.</span>}
              </div>
              <div className="form-group m-1">
              <label htmlFor="apellidoAgregar" className="font-weight-bold">Apellido</label>
                <input className="form-control" placeholder="Apellido" {...register("FApellido", { required: true })} />
                {errors.FApellido && <span className="text-danger">Es necesario agregar apellido.</span>}
              </div>
              <div className="form-group m-1">
              <label htmlFor="correoAgregar" className="font-weight-bold">Correo</label>
                <input className="form-control" type="email" placeholder="correo@rgm.com" {...register("FCorreo", { required: true })} />
                {errors.FCorreo && <span className="text-danger">Es necesario agregar correo.</span>}
              </div>
              <div className="form-group m-4">
              <label htmlFor="correoAgregar" className="font-weight-bold">Seleccione un Rol: </label>
                <select {...register("FRol")} className="form-control" required defaultValue="">
                  <option value=""  disabled>Selecciona una opción</option>
                  {opcionesRoles.map((opcion, index) => (
                    <option key={index} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errors.FRol && <span className="text-danger">Es necesario seleccionar rol.</span>}
              </div>

              <div className="mb-4"> 
              <br></br> 
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">             
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
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

      {/* Modal ELIMINAR USUARIO */}
      <div
        className="modal fade"
        id="modalEliminar"
        tabIndex="-1"
        aria-labelledby="modalEdiatarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEdiatarLabel">
                Deshabilitar Usuario
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              ¿Está seguro que desea deshabilitar el siguiente usuario? <br></br> 
                <div style={{ textAlign: 'center', fontSize: '1.2em' }}>
                  Usuario:<b> {idSeleccionado?.Nombre}</b><br></br>
                  Correo:<b> {idSeleccionado?.Correo_Electronico}</b>
                </div>
              <br></br>
              <button className="btn btn-primary mt-3" onClick={handleEliminar} data-bs-dismiss="modal">Confirmar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal HABILITAR USUARIO */}
      <div
        className="modal fade"
        id="modalHabilitar"
        tabIndex="-1"
        aria-labelledby="modalHabilitarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalHabilitarLabel">
                Habilitar Usuario
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              ¿Está seguro que desea habilitar el siguiente usuario? <br></br> 
                <div style={{ textAlign: 'center', fontSize: '1.2em' }}>
                  Usuario:<b> {idSeleccionado?.Nombre}</b><br></br>
                  Correo:<b> {idSeleccionado?.Correo_Electronico}</b>
                </div>
              <br></br>
              <button className="btn btn-primary mt-3" onClick={handleHabilitar} data-bs-dismiss="modal">Habilitar</button>
            </div>
          </div>
        </div>
      </div>


      {/* Modal MODIFICAR USUARIO*/}
      <div
        className="modal fade"
        id="modalModificar"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modificar Usuario 
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Modificar los datos del usuario: <b>{idSeleccionado?.Correo_Electronico}</b></p>
            {/* INICIO FORMULARIO MODIFICAR */}
            <form onSubmit={handleSubmitFormB(onSubmitA)} id="formAgregar">

              <div className="form-group m-1">
              <label htmlFor="actualizarNombre" className="font-weight-bold">Nombre</label>
                <input className="form-control" placeholder={idSeleccionado?.Nombre || ''} {...registerFormB("FANombre", { required: false })} />
                {errorsFormB.FANombre && <span className="text-danger">Es necesario agregar nombre.</span>}
              </div>
              <div className="form-group m-1">
              <label htmlFor="actualizarApellido" className="font-weight-bold">Apellido</label>
                <input className="form-control" placeholder={idSeleccionado?.Apellido || ''} {...registerFormB("FAApellido", { required: false })} />
                {errorsFormB.FAApellido && <span className="text-danger">Es necesario agregar apellido.</span>}
              </div>
              <div className="form-group m-4">
              <label htmlFor="actualizarRol" className="font-weight-bold">Seleccione un Rol: </label>
              <select
                {...registerFormB("FARol")}
                className="form-control"
                required
                value={idSeleccionado?.IdRol}
                onChange={(event) => {
                  let selectedValue = event.target.value;
                  // Aquí puedes realizar alguna acción adicional si es necesario
                  setIdSeleccionado(prevState => ({
                    ...prevState,
                    IdRol: selectedValue
                  }));
                }}
              >
                  <option value="" disabled>Selecciona una opción</option>
                  {opcionesRoles.map((opcion, index) => (
                    <option key={index} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errorsFormB.FARol && <span className="text-danger">Es necesario seleccionar rol.</span>}
              </div>

              <div className="mb-4"> 
              <br></br> 
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">             
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
              </div> 
              </div>
            </form>
            {/* FIN FORMULARIO MODIFICAR */}
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

export default UsuarioPage;
