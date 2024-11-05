"use client";
import React, {useEffect} from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import config from '@/app/config';

//PANTALLA PARA INICIAR SESION
function Peticion(){

  //Carga inicial
  useEffect(() => {

    const userData = localStorage.getItem('usuarioDatos');
    if(userData){
      window.location.href = '/inicio';
    }

  }, []);

  //Formularios
  const { register,handleSubmit, formState: { errors } } = useForm();

  //Enviar Datos Inicir Sesion
  const onSubmit = async (data) => {

    const datos = {...data, correo: data.correo, contra: data.contra}
    console.log(`${config.apiUrl}/autenticarUsuario`);

    try {
      const response = axios.get(`${config.apiUrl}/ConsultarFechaActual`)
        console.log(response);
            // La solicitud fue exitosa, puedes manejar los datos de respuesta aquí
            console.log('Datos recibidos:', response);
        
    } catch (error) {     
	console.log(error);
    }
  };

  return (
    <div className="fondo">
      <div className="container p-5">
      </div>

      <div className="container p-5  table-responsive card custom-card rounded">
        <div className="row">
          <div className="col bg">

          </div>
          <div className="col">

            <h2 className="fw-bold text-center py-5">Bienvenido</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico
                </label>
                <input type="email" className="form-control" placeholder="Correo" {...register("correo", { 
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Dirección de correo electrónico no válida",
                  }, })} />
                {errors.correo && <span className="text-danger">Es necesario utilizar un correo.</span>}
              </div>
              <div className="mb-4">
                <label htmlFor="contra" className="form-label">
                  Contraseña
                </label>
                <input type="password"  className="form-control" placeholder="Contraseña" {...register("contra", { required: true })} />
                {errors.contra && <span className="text-danger">Ingrese su conraseña.</span>}
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Iniciar Sesión
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Peticion
