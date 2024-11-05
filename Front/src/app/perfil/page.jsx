"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import imagenPerfil from '../../assets/images/usuario.png';// Ruta de la imagen
import Image from "next/image";
import Swal from 'sweetalert2';
import config from '@/app/config';


function Perfil() {

  const [contraN, setNuevaContrasena] = useState('');
  const [contraC, setNuevaContrasenaC] = useState('');

  const verificarCambioContrasena = (correo) => {
    if (contraN.trim() === '' || contraC.trim() === '') {
      // Al menos uno de los campos está vacío
      Swal.fire({
        icon: 'warning',
        title: 'Faltan campos por llenar',
        showConfirmButton: true,
        confirmButtonText: 'Ok'
      })
      return false;
    }
  
    if (contraN !== contraC) {
      // Las contraseñas no coinciden
      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden. Por favor, confirma tu contraseña correctamente.',
        showConfirmButton: true,
        confirmButtonText: 'Ok'
      })
      return false;
    }
  
    // Ambos campos son iguales y no están vacíos
    // Realizar la solicitud Axios para cambiar la contraseña
    let datos = {
      Contra: contraN,
      Correo: correo,
    };
    axios.post(`${config.apiUrl}/cambiarContra`, datos)
    .then(response => {
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña',
          text: 'Se realizo el cambio de contraseña',
        }).then(() => {
          window.location.reload();
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Contraseña',
          text: 'No se pudo realizar el cambio de contraseña',
        }).then(() => {
          window.location.reload();
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña',
        text: 'No se pudo realizar el cambio de contraseña',
      }).then(() => {
        window.location.reload();
      });
    });
  
    return true; // Puedes omitir esto si no necesitas utilizar el resultado en el código que llama a esta función
  };
  
  //Datos usuario:
  const [datosUsuario, setDatosUsuario] = useState(null);

  //Carga inicial
  useEffect(() => {

    const userData = localStorage.getItem('usuarioDatos');
    if(userData){
      const datos = JSON.parse(userData);
      setDatosUsuario(datos);
    }
  }, []);

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container p-5" align="center">
      <div className="table-responsive card custom-card rounded text-center">
  <div className="d-flex flex-column flex-lg-row">
    {/* Lado Izquierdo */}
    <div className="text-left p-3 flex-grow-1">
      <h1 className="fondo">Perfil</h1>
      <div className="d-flex justify-content-center">
        <Image src={imagenPerfil} alt="Foto de perfil" className="imagen-perfil" />
      </div>
      <h2>{datosUsuario?.nombre} {datosUsuario?.apellido}</h2>
      <hr></hr>
      <h3><b>Correo: </b>{datosUsuario?.correo_electronico}</h3>
      <h3><b>Rol: </b>{datosUsuario?.nombreRol || 'Otro'}</h3>
    </div>

    {/* Lado Derecho */}
    <div className="p-4 flex-grow-1 text-center">
      {/* Inputs para cambiar la contraseña */}
      <div className="mb-3">
        <label htmlFor="contraN" className="form-label">Nueva Contraseña</label>
        <input type="password" className="form-control" id="contraN" onChange={(e) => setNuevaContrasena(e.target.value)}/>
      </div>
      <div className="mb-3">
        <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
        <input type="password" className="form-control" id="confirmarContrasena" onChange={(e) => setNuevaContrasenaC(e.target.value)}/>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => verificarCambioContrasena(datosUsuario?.correo_electronico)}>Confirmar</button>
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

export default Perfil;
