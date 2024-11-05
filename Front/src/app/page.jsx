"use client";
import React, {useEffect} from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import config from '@/app/config';

//PANTALLA PARA INICIAR SESION
function IndexPage(){

  //Carga inicial
  useEffect(() => {

    const userData = localStorage.getItem('usuarioDatos');
	console.log('carga inicial');
	console.log(userData);
    if(userData){
      window.location.href = '/inicio';
    }

  }, []);

  //Formularios
  const { register,handleSubmit, formState: { errors } } = useForm();

  //Enviar Datos Inicir Sesion
  const onSubmit = async (data) => {

    const datos = {...data, correo: data.correo, contra: data.contra}
    try {
      	console.log(`${config.apiUrl}/autenticarUsuario`);
	const response = await axios.post(`${config.apiUrl}/autenticarUsuario`, datos);     
      if (response.status === 200) {
        const usuario = response.data[0];
        if(usuario.idEstado == 1){ // si el usuario esta habilitado
          Swal.fire({
            icon: 'success',
            title: 'Iniciando sesion...',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            const datosJson = JSON.stringify(response.data[0]);
            localStorage.setItem('usuarioDatos', datosJson);
            window.location.href = '/inicio';
          });;
        }else if(usuario.idEstado == 2){// si el usuario esta deshabilitado
          Swal.fire({
            icon: 'info',
            title: 'Usuario Deshabilitado',
            showConfirmButton: false,
            timer: 2000
          })
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al inciar sesion',
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
          title: 'Contraseña incorrecta',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.reload();
        });;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos incorrectos',
          text: 'Valide sus datos o que su usuario este habilitado.',
          showConfirmButton: true,
          timer: 4000
        }).then(() => {
          window.location.reload();
        });;
      }
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

export default IndexPage
