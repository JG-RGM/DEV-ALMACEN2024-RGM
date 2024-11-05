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
import Select from 'react-select';
import PDF from "@/components/PDF";
import dynamic from "next/dynamic";
import { pdf } from '@react-pdf/renderer';
import * as FileSaver from 'file-saver';
import config from '@/app/config';

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Cargando...</p>,
});

function InventarioActualPage() {
  const idPAGINA = 6; //IDENTIFICADOR DE PAGINA UNICO
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
  const { register, reset ,handleSubmit, formState: { errors }, setValue } = useForm();
    
  //Enviar Datos Agregar nuevo articulo
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${config.apiUrl}/agregarArticulo`, data);     
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Árticulo agregado',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar árticulo',
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
          title: 'Error al agregar árticulo',
          text: 'Ocurrio un error en la base de datos',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar árticulo',
          text: 'Error de conexión',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
        });;
      }
    }
    
    reset();
  };

  //Eliminar usuario
  //state para especificar que ID esta seleccionado
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const seleccionarId = (id) => {
    setIdSeleccionado(id);
  };


  //Paginacion
  const [posts, setPosts] = useState([]);

  const [pagActual, setPaginaActual] = useState(1);
  const tamPagina = 10;

  const handlePageChange = (page) => {
    setPaginaActual(page);
  };

  const paginatePosts = paginar(posts, pagActual, tamPagina);

  /////    *************************** Carga inicial **********************************************

  //Marca
  const handleArticuloChange1 = (selectedOption) => {
    setValue("FMarca", selectedOption.value); // Actualiza el valor seleccionado
  };

  //Familia
  const handleArticuloChange2 = (selectedOption) => {
    setValue("FFamilia", selectedOption.value); // Actualiza el valor seleccionado
  };

  //Concentracion
  const handleArticuloChange3 = (selectedOption) => {
    setValue("FConcentracion", selectedOption.value); // Actualiza el valor seleccionado
  };

  //Presentacion
  const handleArticuloChange4 = (selectedOption) => {
    setValue("FPresentacion", selectedOption.value); // Actualiza el valor seleccionado
  };


  //Familias
  const [opcionesFamilias, setFamilias] = useState([]);
  //Marcas
  const [opcionesMarcas, setMarcas] = useState([]);
  //Concentracion
  const [opcionesConcentracion, setConcentracion] = useState([]);
  //Presentacion
  const [opcionesPresentacion, setPresentacion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [familiasData, marcasData, concentracionData, presentacionData, articulosData] = await Promise.all([
          axios.get(`${config.apiUrl}/consultarFamiliasHabilitadas`),
          axios.get(`${config.apiUrl}/consultarMarcasHabilitadas`),
          axios.get(`${config.apiUrl}/consultarConcentracionHabilitadas`),
          axios.get(`${config.apiUrl}/consultarPresentacionHabilitadas`),
          axios.get(`${config.apiUrl}/consultarArticulos`)
        ]);
  
        const opcionesF = familiasData.data.map(familia => ({
          value: familia.idFamilia,
          label: familia.nombre
        }));
  
        const opcionesM = marcasData.data.map(marca => ({
          value: marca.idMarca,
          label: marca.nombre
        }));

        const opcionesC = concentracionData.data.map(concentracion => ({
          value: concentracion.idConcentracion,
          label: concentracion.nombre
        }));

        const opcionesP = presentacionData.data.map(presentacion => ({
          value: presentacion.idPresentacion,
          label: presentacion.nombre
        }));
  
        setFamilias(opcionesF);
        setMarcas(opcionesM);
        setConcentracion(opcionesC);
        setPresentacion(opcionesP);
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
  
  // Función para obtener el nombre de la marca por su ID
  const obtenerNombreMarca = (idMarca) => {
    const marcaEncontrada = opcionesMarcas.find(marca => marca.value === idMarca);
    return marcaEncontrada ? marcaEncontrada.label : 'Marca no encontrada';
  };

  // Función para obtener el nombre de la familia por su ID
  const obtenerNombreFamilia = (idFamilia) => {
    const familiaEncontrada = opcionesFamilias.find(familia => familia.value === idFamilia);
    return familiaEncontrada ? familiaEncontrada.label : 'Familia no encontrada';
  };

  // Función para obtener el nombre de la concentracion por su ID
  const obtenerNombreConcentracion = (idConcentracion) => {
    const concentracionEncontrada = opcionesConcentracion.find(concentracion => concentracion.value === idConcentracion);
    return concentracionEncontrada ? concentracionEncontrada.label : 'Concentración no encontrada';
  };

  // Función para obtener el nombre de la presentacion por su ID
  const obtenerNombrePresentacion = (idPresentacion) => {
    const presentacionEncontrada = opcionesPresentacion.find(presentacion => presentacion.value === idPresentacion);
    return presentacionEncontrada ? presentacionEncontrada.label : 'Presentación no encontrada';
  };
  

  const generarPDF = () => {
    const MyDocument = (
        <PDF datos={dataReporte}/>
    );

    pdf(MyDocument).toBlob().then(blob => {
        FileSaver.saveAs(blob, 'RGM-Reporte.pdf');
    });
  };

  const [dataReporte, setdataReporte] = useState(null);

  const fetchData = () => {
    setdataReporte('10/10/2023');
  };

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container-fluid p-4 justify-content-center" style={{ width: "95%"}}>
        <h1 className="fondo text-center">Inventario actual RGM</h1>

        <div className="table-responsive card custom-card rounded">
          <br></br>
          <table id="tablaDatos" className="table ">
            <thead>
              <tr align="center">
                <th scope="col" align="center" style={{ width: '200px' }}>Código Articulo</th>
                <th scope="col" align="center">Nombre</th>
                <th scope="col" align="left">Descripción</th>
                <th scope="col" align="center">Familia</th>
                <th scope="col" align="center">Marca</th>
                <th scope="col" align="center">Presentación</th>
                <th scope="col" align="center">Concentración</th>
                <th scope="col" align="center">Saldo Inicial</th>
                <th scope="col" align="center">Ingresos</th>
                <th scope="col" align="center">Egresos</th>
                <th scope="col" align="center">Existencia</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                <tr key={post.idArticulo}>
                  <td align="center"> {post.Codigo}</td>
                  <td align="center"> {post.Nombre}</td>
                  <td align="left"> {post.Descripcion}</td>
                  <td align="center"> {obtenerNombreFamilia(post.IdFamilia)}</td>
                  <td align="center"> {obtenerNombreMarca(post.IdMarca)}</td>
                  <td align="center"> {obtenerNombrePresentacion(post.IdPresentacion)}</td>
                  <td align="center"> {obtenerNombreConcentracion(post.IdConcentracion)}</td>
                  <td align="center"> {post.CantidadInicial}</td>
                  <td align="center"> {post.Ingresos}</td>
                  <td align="center"> {post.Egresos}</td>
                  <td align="center"> {post.Cantidad}</td>
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

      {/* Modal NUEVO ARTICULO*/}
      <div
        className="modal fade"
        id="nuevoArticulo"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Crear nuevo árticulo
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            {/* INICIO FORMULARIO NUEVO ARTICULO */}
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
            </div>
            <hr className="divider" />
            <div className="row">
              <div className="col-md-12">
                <div className="form-group m-1">
                  <label htmlFor="FNombre" className="font-weight-bold">Nombre</label>
                  <input id="FNombre" className="form-control" type="text" placeholder="Nombre"  {...register("FNombre", { required: true })} />
                  {errors.FNombre && <span className="text-danger">Ingrese nombre árticulo. </span>}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group m-1">
                  <label htmlFor="FDescripcion" className="font-weight-bold">Descripción</label>
                  <input id="FDescripcion" className="form-control" type="text" placeholder="Descripción"  {...register("FDescripcion", { required: true })} />
                  {errors.FDescripcion && <span className="text-danger">Ingrese descripción árticulo</span>}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group m-1">
                  <label htmlFor="FCantidadI" className="font-weight-bold">Cantidad inicial</label>
                  <input id="FCantidadI" className="form-control" type="number" placeholder="1" min="0"  {...register("FCantidadI", { required: true })} />
                  {errors.FCantidadI && <span className="text-danger">Ingrese una cantidad</span>}
                </div>
              </div>
            </div>
              
            <div className="form-group m-1">
              <label  className="font-weight-bold">Seleccione una marca: </label>
              <Select
                instanceId={'wsad123wqwe'}
                placeholder="Marcas"
                name="FMarca"
                options={opcionesMarcas}
                onChange={handleArticuloChange1} // Manejador de cambio del Select
                isSearchable
              />
              {errors.FMarca && <span className="text-danger">Seleccione una marca.</span>}
            </div>

            <div className="form-group m-1">
              <label className="font-weight-bold">Seleccione una familia: </label>
              <Select
                instanceId={'wsad123wqwe'}
                placeholder="Familias"
                name="FFamilia"
                options={opcionesFamilias}
                onChange={handleArticuloChange2} // Manejador de cambio del Select
                isSearchable
              />
              {errors.FFamilia && <span className="text-danger">Seleccione una familia.</span>}
            </div>

            <div className="form-group m-1">
              <label className="font-weight-bold">Seleccione una presentación: </label>
              <Select
                instanceId={'wsad123wqwe'}
                placeholder="Presentación"
                name="FPresentacion"
                options={opcionesPresentacion}
                onChange={handleArticuloChange4} // Manejador de cambio del Select
                isSearchable
              />
              {errors.FPresentacion && <span className="text-danger">Seleccione una presentación.</span>}
            </div>  

            <div className="form-group m-1">
              <label className="font-weight-bold">Seleccione una concentración: </label>
              <Select
                instanceId={'wsad123wqwe'}
                placeholder="Concentración"
                name="FConcentracion"
                options={opcionesConcentracion}
                onChange={handleArticuloChange3} // Manejador de cambio del Select
                isSearchable
              />
              {errors.FConcentracion && <span className="text-danger">Seleccione una concentración.</span>}
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
                  Crear Árticulo
                </button>
              </div> 
              </div>
            </form>
            {/* FIN FORMULARIO NUEVO ARTICULO */}
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

export default InventarioActualPage;
