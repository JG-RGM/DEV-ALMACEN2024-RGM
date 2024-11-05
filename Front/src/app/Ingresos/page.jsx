"use client";
import React, { useEffect, useState} from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import Paginacion from "@/components/Paginacion";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import Select from 'react-select';
import PDF3 from '@/components/PDF3';
import * as FileSaver from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import config from '@/app/config';

function IngresosPage() {

  const idPAGINA = 7; //IDENTIFICADOR DE PAGINA UNICO
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

  //Formularios Seccion 1
  const [formData, setFormData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  //Formularios Seccion 2
  const [seccion, setSeccion] = useState(1);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState('');
  const [articuloIdSeleccionado, setArticuloIdSeleccionado] = useState('');
  const [cantidadIngresada, setCantidadIngresada] = useState('');
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [fechaCaducidadIngresada, setfechaCaducidadIngresada] = useState('');
  const [articulosIngresados, setArticulosIngresados] = useState([]);
  const { register,handleSubmit, formState: { errors }, watch } = useForm();

  // Obtener la fecha actual en formato YYYY-MM-DD para establecerla como valor por defecto
  const today = new Date().toISOString().split('T')[0];

  //Formulario Seccion 1
  const handleNextSection = () => {
     // Realizar validaciones antes de pasar a la siguiente sección
     const fecha = document.getElementById('fecha').value;
     const despacho = document.querySelector('input[name="FDespacho"]').value;
     const requisicion = document.querySelector('input[name="FRequisicion"]').value;
     const observaciones = document.querySelector('input[name="FObservaciones"]').value;

     if (fecha && despacho && requisicion && observaciones) {
      // Si todos los campos requeridos tienen valores
      // Guardar en el estado (formData) si es necesario
      setFormData([fecha, despacho, requisicion, observaciones ]);

      // Permitir pasar a la siguiente sección
      setSeccion(seccion + 1);
      setErrorMessage(''); 
    } else {
       // Mostrar mensaje de error si algún campo está vacío
       setErrorMessage('Por favor, complete todos los campos.');
    }
  };

  //Formulario Seccion 2
  const handlePreviousSection = () => {
    setSeccion(seccion - 1);
  };


 
  const cantidadI = watch("FCantidad");
  useEffect(() => {
    // Obtener la cantidad ingresada y asignarla al estado cuando cambie
    if (cantidadI !== undefined) {
      setCantidadIngresada(cantidadI);
    }
  }, [cantidadI]);

  const fechaCaducidad = watch("FechaCaducidad");
  useEffect(() => {
    // Obtener la cantidad ingresada y asignarla al estado cuando cambie
    if (fechaCaducidad !== undefined) {
      setfechaCaducidadIngresada(fechaCaducidad);
    }
  }, [fechaCaducidad]);

  const [selectedOption, setSelectedOption] = useState(null); // Estado para el valor seleccionado

  //Agregando articulos a la tabla del modal
  const handleAgregar = () => {
    if (articuloSeleccionado && cantidadIngresada && cantidadIngresada > 0 ) {  
      
      // Si el check no se esta mostrando
      if(!mostrarFecha){
        // Si el artículo no existe, agregar un nuevo artículo
        const nuevoArticulo = {
          articulo: articuloIdSeleccionado,
          nombre: articuloSeleccionado,
          cantidad: cantidadIngresada,
          fechavencimiento: '-',
        };
        setArticulosIngresados([...articulosIngresados, nuevoArticulo]);
      }else{
        // Si el artículo no existe, agregar un nuevo artículo
        const nuevoArticulo = {
          articulo: articuloIdSeleccionado,
          nombre: articuloSeleccionado,
          cantidad: cantidadIngresada,
          fechavencimiento: fechaCaducidadIngresada,
        };
        setArticulosIngresados([...articulosIngresados, nuevoArticulo]);        
      }

      // Reiniciar los valores del artículo seleccionado y la cantidad ingresada
      document.querySelector('input[name="FCantidad"]').value = null;
      document.querySelector('input[name="FArticulo"]').value = 0;
      
      if(mostrarFecha){
        setMostrarFecha(!mostrarFecha);// Cambiar el estado del checkbox
      }
      setArticuloSeleccionado('');
      setCantidadIngresada('');
      setSelectedOption(null);
      
    }
  };

  //Enviar Datos Agregar nuevo ingreso
  const enviarIngreso = async () => {
    try {
      // Crear el objeto de datos
      let datos = {
        fecha: formData[0],
        despacho: formData[1],
        requi: formData[2],
        observaciones: formData[3],
        solicitante: usuario.nombre+' '+usuario.apellido,
      };
  
      datos.ingresos = articulosIngresados;
  
      console.log(datos);
      // Realizar la solicitud POST
      const response = await axios.post(`${config.apiUrl}/agregarIngresos`, datos);
  
      // Verificar si la solicitud fue exitosa
      if (response.status === 200) {
        // Cerrar el modal
        $('#exampleModal').modal('hide');
  
        // Mostrar SweetAlert2 con el mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Ingreso exitoso',
          text: 'Los datos se han enviado correctamente.',
        }).then(() => {
          window.location.reload();
        });
      } else {
        // Mostrar SweetAlert2 con un mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al procesar la solicitud.',
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      // Mostrar SweetAlert2 con un mensaje de error en caso de fallo en la solicitud
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar la solicitud.',
      }).then(() => {
        window.location.reload();
      });
    }
  };

  //Realizar ingresos
  const realizarIngreso = (idIngreso) => {
    // Hacer la solicitud POST con Axios
    axios.post(`${config.apiUrl}/realizarIngreso`, {
      idIngreso: idIngreso
    })
    .then(response => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Ingreso Aprobado',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar ingreso',
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

  //************************************************************************* INICIO SELECT ARTICULOS

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
          label: articulo.Codigo+' '+articulo.Nombre
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


  //************************************************************************ FIN SELECT DE ARTICULOS */

  const handleArticuloChange = (selectedOption) => {
    setArticuloIdSeleccionado(selectedOption.value); // Actualiza el valor seleccionado
    setArticuloSeleccionado(selectedOption.label);
    setSelectedOption(selectedOption);
  };

  //Seleccionar
  //state para especificar que ID esta seleccionado
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState({
    idIngreso: '',
    FechaIngreso: '',
    Despacho: '',
    Requisicion: '',
    Estado: ''
  });
  const [resultadoDetalleIngresos, setresultadoDetalleIngresos] = useState(null);
  const [errorDetalleIngresos, seterrorDetalleIngresos] = useState(null);

  //Despues de seleccionarlo realiza el llamado de los datos del ingreso en especifico
  const seleccionarIngreso = (ingreso) => {
    setresultadoDetalleIngresos(null);
    setIngresoSeleccionado(ingreso);
  };



  const realizarSolicitudAxios = () => {
    try {
      if (ingresoSeleccionado) {
        axios.post(`${config.apiUrl}/consultarDetalleIngresos`, ingresoSeleccionado)
          .then(response => {
            setresultadoDetalleIngresos(response.data);
          })
          .catch(error => {
            seterrorDetalleIngresos('Error en la solicitud Axios:', error);
          });
      } else {
        seterrorDetalleIngresos('Error: El ingreso aún no se ha actualizado.');
      }
    } catch (error) {
      seterrorDetalleIngresos('Error:', error);
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
          `${config.apiUrl}/consultarIngresos`
        );
        setPosts(res);
      };
      getPost();
    }, []);



  const handlePageChange = (page) => {
    setPaginaActual(page);
  };

  const paginatePosts = paginar(posts, pagActual, tamPagina);

   // Función para quitar un artículo del listado
   const quitarArticulo = (item) => {
    const nuevosArticulos = articulosIngresados.filter((articulo) => articulo !== item);
    setArticulosIngresados(nuevosArticulos);
  };

  const handleMostrarFechaChange = () => {
    setMostrarFecha(!mostrarFecha); // Invierte el valor actual
  };

    //Rechazar Ingreso
    const rechazarIngreso = (idIngreso) => {
      // Hacer la solicitud POST con Axios
      axios.post(`${config.apiUrl}/rechazarIngreso`, {
        idIngreso: idIngreso
      })
      .then(response => {
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Ingreso Rechazado',
            showConfirmButton: false,
            timer: 2500
          }).then(() => {
            window.location.reload();
          });;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al rechazar ingreso',
            showConfirmButton: false,
            timer: 2500
          });
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al rechazar ingreso',
          showConfirmButton: false,
          timer: 2500
        });
      });
    };

  const consultarPDF = (post) => {
    // Realizar la solicitud GET utilizando Axios
    const envioDatos = {
      idIngreso: post.idIngreso,
    };

    axios.post(`${config.apiUrl}/generarReporteIngreso`, envioDatos)
    .then(response => {
      // Manejar la respuesta de la solicitud
      if(response.data != null){

        console.log(response.data);
        let informacion = {
          observacion: response.data[0].Observacion,
          despacho: response.data[0].Despacho,
          requisicion: response.data[0].Requisicion,
          fechaIngreso: response.data[0].fechaIngreso || '-',
          solicitante: response.data[0].Solicitante,
          codigo: response.data [0].Codigo
        }

        let objetoDatos = response.data;
        var nombre = response.data[0].Codigo;

        // Propiedades que deseas incluir en el nuevo objeto
        let propiedadesDeseadas = ["codigoArticulo", "nombreArticulo", "fechaVencimiento", "cantidadIngresada"];

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

        const MyDocument = (
          <PDF3 Reporte={'ingreso'} Datos={arregloDatos} Informacion={informacion} Autor={usuario.nombre+' '+usuario.apellido} />
        );
    
        pdf(MyDocument).toBlob().then(blob => {
            FileSaver.saveAs(blob, `RGM_Ingreso_${nombre}.pdf`);
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
        <h1 className="fondo">Ingreso de artículos</h1>

        <div className="table-responsive card custom-card rounded" >
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              className="btn btn-primary me-md-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Ingreso de artículos
            </button>
          </div>
          <br></br>
          <table id="tablaDatos" className="table ">
            <thead>
              <tr align="center">
                <th scope="col" align="center" style={{ width: '200px' }}>No. Ingreso</th>
                <th scope="col" align="center">Despacho</th>
                <th scope="col" align="center">Requisición</th>
                <th scope="col" align="center">Fecha de Ingreso</th>
                <th scope="col" align="center">Solicitante</th>
                <th scope="col" align="center">Observacion</th>
                <th scope="col" align="center">Estado</th>
                <th scope="col" align="center"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                <tr key={post.idIngreso}>
                  <td align="center"> {post.Codigo}</td>
                  <td align="center"> {post.Despacho}</td>
                  <td align="center"> {post.Requisicion}</td>
                  <td align="center"> {post.FechaIngreso}</td>
                  <td align="center"> {post.Solicitante}</td>
                  <td align="center"> {post.Observacion}</td>
                  <td align="center">
                    {post.Estado === 1 ? (
                      <span>Pendiente <i className="bi bi-clock-history" style={{ color: 'red' }}></i> </span>
                    ) : (
                      post.Estado === 2 ? (
                        <span>
                          Aprobado <i className="bi bi-check-all p-1" style={{ color: 'green' }}></i>
                        </span>
                      ) : (
                        <span>Pendiente <i className="bi bi-clock-history" style={{ color: 'red' }}></i> </span>
                      )
                    )}
                  </td>
                  <td align="center">
                    
                  {post.Estado === 1 && ( 
                    //AGREGAR VALIDACION SI ES ADMINISTRADOR O NO PARA APROBACIONES
                    <div>
                      <button className="btn btn-warning btn-sm m-1" onClick={() => seleccionarIngreso(post)} data-bs-toggle="modal" data-bs-target="#modalVisualizar">
                      <i className="bi bi-eye-fill p-1"></i>
                        Visualizar
                      </button>
                    </div>
                  )}

                  {post.Estado === 2 && (
                    <div>
                      <button className="btn btn-warning btn-sm m-1" style={{ width: '105px', height:'35px' }} onClick={() => seleccionarIngreso(post)} data-bs-toggle="modal" data-bs-target="#modalVisualizar">
                      <i className="bi bi-eye-fill p-1"></i>
                        Visualizar
                      </button>
                      <button className="btn btn-info btn-sm m-1"  style={{ width: '105px', height:'35px' }} onClick={() => consultarPDF(post)}>
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

       {/* Modal INGRESO ARTICULOS*/}
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
                Formulario de ingresos
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
              <span style={{ marginRight: '5px', fontSize: '15px', color: seccion === 1 ? '#5271ff' : '#5271ff' }}>{seccion === 1 ? '●' : '●'}</span>
              <span style={{ fontSize: '15px', color: seccion === 2 ? '#5271ff' : 'gray' }}>{seccion === 2 ? '●' : '●'}</span>
            </div>
            <div className="modal-body">
            <form >
              {seccion === 1 && (
                <>
                <div className="row">
                {errorMessage && <span className="text-danger">{errorMessage}</span>}
                  <div className="form-group m-1">
                  <label htmlFor="fecha" className="font-weight-bold">Seleccione Fecha: </label>
                    <input
                      className="form-control"
                      type="date"
                      id="fecha"
                      name="fecha"
                      defaultValue={today}
                      {...register('fecha')}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="form-group m-1">
                      <label htmlFor="despachoAgregar" className="font-weight-bold">Ingrese Despacho:</label>
                      <input className="form-control" type="number" placeholder="00000" step={1} min={0} {...register("FDespacho", { required: true })} />
                      {errors.FDespacho && <span className="text-danger">Ingrese no. despacho. </span>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group m-1">
                      <label htmlFor="requisicionAgregar" className="font-weight-bold">Ingrese Requisición:</label>
                      <input className="form-control" type="number" placeholder="0000" step={1} min={0}  {...register("FRequisicion", { required: true })} />
                      {errors.FRequisicion && <span className="text-danger">Ingrese no. requisición.</span>}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group m-1">
                      <label htmlFor="obsercacionesAgregar" className="font-weight-bold">Observaciones:</label>
                      <input className="form-control" type="text" placeholder="Observaciones" {...register("FObservaciones", { required: true })} />
                      {errors.FObservaciones && <span className="text-danger">Ingrese observacion. </span>}
                    </div>
                  </div>
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
                  <button type="button" className="btn btn-primary" onClick={handleNextSection}>Continuar</button>
                </div> 
                </div>
                </>
              )}
              {seccion === 2 && (
                <>
                <div className="form-group m-1">
                  <label htmlFor="articuloAgregar" className="font-weight-bold">Artículo a ingresar: </label>
                  <Select
                    id="SelectAgregar"
                    name="FArticulo"
                    placeholder="Seleccionar..."
                    options={opcionesArticulos}
                    onChange={handleArticuloChange}
                    value={selectedOption} // Manejador de cambio del Select
                    isSearchable
                  />
                  {errors.FRequisicion && <span className="text-danger">Seleccione un producto.</span>}
                </div>
                              
                <div className="row justify-content-center align-items-center">
                <div className="col-md-12">
                <div className="form-check d-flex justify-content-center align-items-center"> 
                  <input
                    type="checkbox"
                    id="mostrarFecha"
                    className="form-check-input" 
                    style={{ width: "25px", height: "25px", marginRight:"10px" }} 
                    checked={mostrarFecha}
                    onChange={handleMostrarFechaChange}
                  />
                  <label htmlFor="mostrarFecha" className="form-check-label">Es perecedero.</label>
                </div>
              </div>

                {/* Input de fecha que se muestra si el check está seleccionado */}
                {mostrarFecha && (
                  <div className="col-md-12">
                    <div className="form-group m-1">
                    <label htmlFor="fecha" className="font-weight-bold">Seleccione fecha de vencimiento: </label>
                      <input
                        className="form-control"
                        type="date"
                        id="fecha"
                        name="fecha"
                        defaultValue={today}
                        {...register('FechaCaducidad')}
                      />
                    </div>
                  </div>
                )}



                  <div className="col-md-6">
                    <div className="form-group m-1">
                      <label htmlFor="cantidadAgregar" className="font-weight-bold">Cantidad</label>
                      <input type="number" className="form-control" placeholder="Cantidad" step={1} min={1} {...register("FCantidad", { required: false })} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label ></label><br></br>
                    <button type="button" className="btn btn-primary col-12" onClick={handleAgregar}>Agregar artículo</button>
                  </div>
                </div>
                <hr className="divider" />
                {/* Tabla para mostrar los artículos ingresados */}
                {articulosIngresados.length > 0 && (
                <>
                  <h4>Artículos ingresados:</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Artículo</th>
                        <th>Cantidad</th>
                        <th>Vencimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articulosIngresados.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <a href="#" onClick={() => quitarArticulo(item)} style={{ cursor: 'pointer' }}>
                              <span className="badge badge-pill badge-primary" style={{color: 'red', fontSize:'18px'}}><i className="bi bi-x-circle"></i></span>
                            </a>
                            {item.nombre}
                          </td>
                          <td>{item.cantidad}</td>
                          <td>{item.fechavencimiento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
                )}
                <div className="mb-4"> 
                <br></br> 
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">             
                <button type="button" className="btn btn-secondary" onClick={handlePreviousSection}>Regresar</button>
                <button type="button" className="btn btn-primary" onClick={enviarIngreso}>
                Crear Nuevo Ingreso
                </button>
                </div> 
                </div>
                </>
              )}
            </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal VISUALIZAR INGRESO*/}
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
                Ingreso {ingresoSeleccionado.Codigo}
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
                <div className="row">
                  <div className="col">
                    <h5 className="mb-4">Fecha ingreso: <b>{ingresoSeleccionado.FechaIngreso}</b></h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h5>Despacho: <b>{ingresoSeleccionado.Despacho}</b></h5>
                  </div>
                  <div className="col">
                    <h5>Requisición: <b>{ingresoSeleccionado.Requisicion}</b></h5>
                  </div>
                </div>
              </div>
              <hr></hr>
              <span>{errorDetalleIngresos}</span>
              {resultadoDetalleIngresos ? (
                  <div className="table-container" style={{ maxWidth: '1500px', maxHeight: '700px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th >Código</th>
                          <th >Artículo</th>
                          <th >Descripción</th>
                          <th >Ingreso</th>
                          <th >Vencimiento</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultadoDetalleIngresos.map((detalle, index) => (
                        <tr key={index}>
                        <td >{detalle.codigoArticulo}</td>
                        <td >{detalle.nombreArticulo}</td>
                        <td >{detalle.descripcionArticulo}</td>
                        <td >
                          {cantidadEditando && cantidadEditando.idDetalle === detalle.iddetalle ? (
                            <input
                              type="number"
                              className="form-control"
                              style={{ width: '80px' }}
                              value={cantidadEditando.cantidad}
                              min="1"
                              onWheel={(e) => e.preventDefault()}  // Deshabilitar el scroll del mouse
                              onWheelCapture={(e) => e.preventDefault()} // En algunos casos, usar onWheelCapture
                              inputMode="numeric"     
                              onChange={(e) => setCantidadEditando({ ...cantidadEditando, cantidad: e.target.value })}
                            />
                          ) : (
                            detalle.cantidadTotalIngresada
                          )}
                        </td>
                        <td >{detalle.fechaVencimientoDetalle}</td>
                        <td align="center">
                          {ingresoSeleccionado.Estado === 1 && (
                            <>
                              {cantidadEditando && cantidadEditando.idDetalle === detalle.iddetalle ? (
                                <button className="btn btn-success btn-sm m-1" onClick={() => guardarEdicion(detalle.iddetalle)}>
                                  <i className="bi bi-check-square"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-warning btn-sm m-1"
                                  onClick={() => activarEdicion(detalle.iddetalle, detalle.cantidadTotalIngresada)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                              )}
                            </>
                          )}
                        </td>
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
              {ingresoSeleccionado.Estado === 1 && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button type="button" className="btn btn-danger" onClick={() => rechazarIngreso(ingresoSeleccionado.idIngreso)}>
                    Rechazar Ingreso
                  </button>
                  <button type="button" className="btn btn-success" onClick={() => realizarIngreso(ingresoSeleccionado.idIngreso)}>
                    Aprobar Ingreso
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal ACTUALIZAR CANTIDAD*/}
            <div
        className="modal fade"
        id="modalActualizarCantidad"
        tabIndex="-1"
        aria-labelledby="modalActualizarCantidad"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="modalActualizarCantidad">
                Ingreso No.{ingresoSeleccionado.idIngreso}
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
                <div className="row">
                  <div className="col">
                    <h5 className="mb-4">Fecha ingreso: <b>{ingresoSeleccionado.FechaIngreso}</b></h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h5>Despacho: <b>{ingresoSeleccionado.Despacho}</b></h5>
                  </div>
                  <div className="col">
                    <h5>Requisición: <b>{ingresoSeleccionado.Requisicion}</b></h5>
                  </div>
                </div>
              </div>
              <hr></hr>
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

export default IngresosPage;
