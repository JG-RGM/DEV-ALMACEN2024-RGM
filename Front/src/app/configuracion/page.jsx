"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'
import config from '@/app/config';


function Configuracion() {

  const idPAGINA = 13; //IDENTIFICADOR DE PAGINA UNICO
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

  const [posts, setPosts] = useState([]);
  const [nuevoAnio, setNuevoAnio] = useState('');
  const [errorInput, setErrorInput] = useState(false);

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // El mes comienza desde 0
  const yyyy = today.getFullYear();
  const fechaFormateada = dd + '/' + mm + '/' + yyyy;

  const actualizarAnio = async () => {
    if (!errorInput) {
      try {
        await axios.post(`${config.apiUrl}/ActualizarFechaActual`, { anio: nuevoAnio });
        // Actualizar la vista o realizar otras acciones después de la actualización
        Swal.fire({
          icon: 'success',
          title: 'Año Actualizado',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.reload();
        });;
      } catch (error) {
        console.error(error);
        // Manejar errores de ser necesario
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Corrija el formato del año antes de continuar.',
        showConfirmButton: false,
        timer: 2500
      }).then(() => {
      });;
    }
  };

  const realizarCorte = async () => {
    try {
      await axios.post(`${config.apiUrl}/RealizarCorteInventario`);
      // Actualizar la vista o realizar otras acciones después de la actualización
      Swal.fire({
        icon: 'success',
        title: 'Corte realizado',
        showConfirmButton: false,
        timer: 2500
      }).then(() => {
        window.location.reload();
      });;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error al realizar el corte.',
        showConfirmButton: false,
        timer: 2500
      }).then(() => {
      });;
    }
  };


  const handleInputChange = (e) => {
    setNuevoAnio(e.target.value);
    const regex = /^\d{4}$/;
    setErrorInput(!regex.test(e.target.value));
  };

  //Carga inicial
  useEffect(() => {
    const getPost = async () => {
      const { data: res } = await axios.get(
        `${config.apiUrl}/ConsultarFechaActual`
      );
      setPosts(res);
    };
    getPost();
  }, []);

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container p-5" align="center">
        <div className="table-responsive card custom-card rounded text-center">
          <h1 className="fondo">Configuración Sistema</h1>
          <hr></hr>
          <div className="d-flex justify-content-center">
            <h2>Año del sistema actual:</h2>
          </div>
          <div className="d-flex justify-content-center">
          {posts.map((post) => (
            <h3 className="text-center" key={post.FechaActual+1}> {post.FechaActual}</h3>
            ))
          }
          </div>
          
          <form className="mt-4" style={{ maxWidth: '500px', margin: '0 auto' }}> {/* Establecemos el ancho del formulario a 500px */}
            <div className="mb-3">
              <label htmlFor="nuevoAnio" className="form-label">Ingrese el nuevo año:</label>
              <input
                type="text"
                id="nuevoAnio"
                className={`form-control text-center ${errorInput ? 'is-invalid' : ''}`}
                pattern="\d{4}"
                placeholder="Ingrese el nuevo año"
                required
                value={nuevoAnio}
                onChange={handleInputChange}
              />
              {errorInput && (
                <span className="invalid-feedback">
                  El año debe tener 4 dígitos.
                </span>
              )}
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={actualizarAnio}>Actualizar</button>
            <br></br>
            <br></br>
            <button
              className="btn btn-secondary btn-lg"
              type="button"
              onClick={() => {
                window.location.href = '/inicio';
              }}
            >
              Regresar
            </button>
          </form>

          <hr></hr>
          <hr></hr> 
          <div className="mb-3">
            <h3>Realizar corte de inventario con fecha: {fechaFormateada}</h3>
            <br></br>
            <button type="button" className="btn btn-success btn-lg" onClick={realizarCorte}>Realizar Corte</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Configuracion;