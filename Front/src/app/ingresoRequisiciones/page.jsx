"use client";
import React, { useEffect, useState} from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import Select from 'react-select';
import config from '@/app/config';

function IngresosPage() {
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

  //Formularios Seccion 2
  const [articuloSeleccionado, setArticuloSeleccionado] = useState('');
  const [articuloIdSeleccionado, setArticuloIdSeleccionado] = useState('');
  const [cantidadIngresada, setCantidadIngresada] = useState('');
  const [observacionIngresada, setobservacionIngresada] = useState('');
  const [articulosIngresados, setArticulosIngresados] = useState([]);
  const { register,handleSubmit, formState: { errors }, watch } = useForm();

  const cantidadI = watch("FCantidad");
  useEffect(() => {
    // Obtener la cantidad ingresada y asignarla al estado cuando cambie
    if (cantidadI !== undefined) {
      setCantidadIngresada(cantidadI);
    }
  }, [cantidadI]);

  const ObservacionI = watch("FObservacion");
  useEffect(() => {
    // Obtener la cantidad ingresada y asignarla al estado cuando cambie
    if (ObservacionI !== undefined) {
      setobservacionIngresada(ObservacionI);
    }
  }, [ObservacionI]);


  const [selectedOption, setSelectedOption] = useState(null); // Estado para el valor seleccionado

  //Agregando articulos a la tabla del modal
  const handleAgregar = () => {
    console.log("ingresada: "+ cantidadIngresada+ "cantidad: "+cantidadArticulo)
    if (articuloSeleccionado && cantidadIngresada && cantidadIngresada <= cantidadArticulo && cantidadIngresada!=0) {
      // Verificar si el artículo ya está en la lista
      const articuloExistente = articulosIngresados.find(item => item.nombre === articuloSeleccionado);
  
      if (articuloExistente) {
        // Si el artículo ya existe, actualizar la cantidad
        const nuevosArticulos = articulosIngresados.map(item => {
          if (item.nombre === articuloSeleccionado) {
            const nuevaCantidad = parseInt(item.cantidad) + parseInt(cantidadIngresada);
            return {
              ...item,
              cantidad: nuevaCantidad.toString()
            };
          }
          return item;
        });
  
        setArticulosIngresados(nuevosArticulos);
      } else {
        // Si el artículo no existe, agregar un nuevo artículo
        const nuevoArticulo = {
          articulo: articuloIdSeleccionado,
          nombre: articuloSeleccionado,
          cantidad: cantidadIngresada,
        };
        setArticulosIngresados([...articulosIngresados, nuevoArticulo]);
      }
  
      // Reiniciar los valores del artículo seleccionado y la cantidad ingresada
      document.querySelector('input[name="FCantidad"]').value = 0;
      setArticuloSeleccionado('');
      setCantidadIngresada('');
      setSelectedOption(null);
      setCantidadArticulo('');
      //Verficamos que la cantidad a ingresar no sea mayor a la existente
    }else if (cantidadArticulo < cantidadIngresada ) {
      
      Swal.fire({
        icon: 'info',
        title: 'No hay suficiente stock en el inventario.',
      })
    }
    else if (cantidadIngresada == 0){
      Swal.fire({
        icon: 'info',
        title: 'Ingresa una cantidad mayor a 0',
      })
    }
  };

  //Enviar Datos Agregar nueva requisicion 
  const enviarIngreso = async () => {
    const userData = localStorage.getItem('usuarioDatos');
    const userDataObj = JSON.parse(userData);

    try {
      // Crear el objeto de datos
      let datos = {
        observacion: observacionIngresada,
        correoSolicitante: userDataObj.correo_electronico,
        solicitante: userDataObj.nombre+' '+userDataObj.apellido,
        
      };
  
      datos.requisiciones = articulosIngresados;
      // Realizar la solicitud POST
      const response = await axios.post(`${config.apiUrl}/agregarRequisicion`, datos);
  
      //Verificar si la solicitud fue exitosa
      if (response.status === 200) {
        // Mostrar SweetAlert2 con el mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Requisición enviada',
          text: 'La solicitud se ha enviado correctamente.',
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

  //Aprobar Requisiciones
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
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Cantidad Actualizada',
      });
      realizarSolicitudAxios();
      setCantidadEditando(null); // Desactivar la edición después de guardar
    })
    .catch(error => {
      console.error('Error al enviar la solicitud:', error);
      // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
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
          label: articulo.Codigo+' '+articulo.Nombre,
          cantidad: articulo.Cantidad
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

  //Cantidad mostrada
  const [cantidadArticulo, setCantidadArticulo] = useState('');

  const handleArticuloChange = (selectedOption) => {
    setArticuloIdSeleccionado(selectedOption.value); // Actualiza el valor seleccionado
    setArticuloSeleccionado(selectedOption.label);
    setCantidadArticulo(selectedOption.cantidad);
    setSelectedOption(selectedOption);
  };

  //Seleccionar
  //state para especificar que ID esta seleccionado
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState({
    IDINGRESO: '',
    FECHAINGRESO: '',
    DESPACHO: '',
    REQUISICION: '',
    ESTADO: ''
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



 // Función para quitar un artículo del listado
  const quitarArticulo = (item) => {
    const nuevosArticulos = articulosIngresados.filter((articulo) => articulo !== item);
    setArticulosIngresados(nuevosArticulos);
  };


  return (
    <div className="fondo">
      <Navegacion />
      <div className="container-fluid p-4 " style={{ width: "55%"}}>
        <h1 className="fondo">Realizar Requisición</h1>

        <div className="table-responsive card custom-card rounded" style={{ height: '600px' }}>
          <>
            <div className="container">
              <div className="row">
              <div className="col-md-12">
                <div className="form-group m-1">
                  <label htmlFor="observacionAgregar" className="font-weight-bold">Observación:</label>
                  <input type="text" className="form-control" placeholder="Motivo" {...register("FObservacion", { required: true })} />
                </div>
              </div>
              </div>
              <div className="row">
                {/* Columna 1: Label y Select */}
                <div className="col-md-6">
                  <div className="form-group m-1">
                    <label htmlFor="articuloAgregar" className="font-weight-bold">Selecciona articulos e ingresa la cantidad solicitada: </label>
                    <Select
                      instanceId={'wsad123wqwe'}
                      name="FArticulo"
                      placeholder="Seleccionar..."
                      options={opcionesArticulos}
                      onChange={handleArticuloChange}
                      value={selectedOption} // Manejador de cambio del Select
                      isSearchable
                    />
                  </div>
                </div>

                {/* Columna 2: H1 */}
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <label htmlFor="articuloAgregar" className="font-weight-bold">Cantidad actual del artículo:</label>
                    <h2>{cantidadArticulo}</h2>
                  </div>
                </div>
              </div>
            
            <div className="row justify-content-center align-items-center">
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
            </div>
            <hr className="divider" />
            {/* Tabla para mostrar los artículos ingresados */}
            {articulosIngresados.length > 0 && (
            <>
              <h4>Artículos a solicitar:</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Artículo</th>
                  <th>Cantidad</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </>
            )}
          </>
          <br></br>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ marginTop: 'auto' }}>
            <button type="button" className="btn btn-success" onClick={enviarIngreso}>
              <i className="bi bi-check2-circle p-1"></i>
              Realizar Solicitud
            </button>
            <button
              className="btn btn-secondary me-md-2"
              type="button"
              onClick={() => {
                window.location.href = '/inicio';
              }}
            >
              Regresar al menu
            </button>
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
