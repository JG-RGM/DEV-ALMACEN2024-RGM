"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'
import '@/app/creacionRoles/permisos.css';
import config from '@/app/config';


function Configuracion() {
  const idPAGINA = 14; //IDENTIFICADOR DE PAGINA UNICO
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

  
  // CHIECK LIST 
  // Definir el estado para almacenar los permisos seleccionados
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [nombreRol, setNombreRol] = useState('');
  const [errorSeleccion, setErrorSeleccion] = useState(false);
  const [errorNombre, setErrorNombre] = useState(false);

  // Estado local para los checkboxes
  const [checkboxEstados, setCheckboxEstados] = useState({});

  useEffect(() => {
    // Actualizar los estados de los checkboxes cuando cambie permisosSeleccionados
    const nuevosCheckboxEstados = {};
    permisosSeleccionados.forEach(index => {
        nuevosCheckboxEstados[index] = true;
    });
    setCheckboxEstados(nuevosCheckboxEstados);
  }, [permisosSeleccionados]);

  const handlePermisoChange = (index) => {
    let nuevosPermisos = [...permisosSeleccionados];
    let nuevosCheckboxEstados = {...checkboxEstados}; // Crear una copia del objeto de estados de los checkboxes
    
    if (nuevosCheckboxEstados[index]) {
        nuevosPermisos = nuevosPermisos.filter(permiso => permiso !== index);
    } else {
        nuevosPermisos.push(index);
    }

    nuevosCheckboxEstados[index] = !nuevosCheckboxEstados[index];
    
    setPermisosSeleccionados(nuevosPermisos);
    setCheckboxEstados(nuevosCheckboxEstados);
  };

  

  const handleNombreRolChange = (event) => {
  setNombreRol(event.target.value);
  };

  const crearRol = async () => {
    // Verificar si al menos un permiso está seleccionado
    if (permisosSeleccionados.length === 0) {
        setErrorSeleccion(true);
        return;
    }
    // Verificar si el nombre del rol está vacío
    if (nombreRol.trim() === '') {
        setErrorNombre(true);
        return;
    }
    // Restablecer el estado de errores
    setErrorSeleccion(false);
    setErrorNombre(false);

    // Crear el objeto de datos
    let datos = {
        permisos: permisosSeleccionados,
        nombreRol: nombreRol,    
    };

    try {  
      // Realizar la solicitud POST
      const response = await axios.post(`${config.apiUrl}/crearRol`, datos);
  
      //Verificar si la solicitud fue exitosa
      if (response.status === 200) {
        // Mostrar SweetAlert2 con el mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Nuevo rol creado',
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

    // Resetear el nombre del rol y los permisos seleccionados
    setNombreRol('');
    setPermisosSeleccionados([]);
  };

  const permisos = [
    "Gestión de usuarios",
    "Gestión de marcas",
    "Gestión de familias",
    "Gestión de concentraciones",
    "Gestión de presentaciones",
    "Creación de artículos",
    "Ingreso de artículos / Aprobación de ingreso de artículos",
    "Requisición de artículos",
    "Aprobación de requisiciones",
    "Despacho de requisiciones",
    "Listado de inventario general",
    "Listado de artículos perecederos",
    "Configuración de año / Corte de inventario",
    "Gestión de roles",
    "Reportes"
  ];


  // FIN CHECKS DE PERMISOS

  const handleInputChange = (e) => {
    setNuevoAnio(e.target.value);
    const regex = /^\d{4}$/;
    setErrorInput(!regex.test(e.target.value));
  };

  //Carga inicial
  useEffect(() => {
    // const getPost = async () => {
    //   const { data: res } = await axios.get(
    //     `${config.apiUrl}/ConsultarFechaActual`
    //   );
    //   setPosts(res);
    // };
    // getPost();
  }, []);

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container p-5" align="center">
      <div className="table-responsive card custom-card rounded">
        <h2>Creación de rol:</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
            <h5><b>Seleccione los permisos del nuevo rol</b></h5>
            {errorSeleccion && <span style={{ color: 'red' }}>Debe seleccionar al menos un permiso.</span>}
                {permisos.map((permiso, index) => (
                    <div key={index+1}>
                        <label className="checkbox-label">
                          <input
                              type="checkbox"
                              checked={checkboxEstados[index+1] || false} // Verificar si está seleccionado
                              onChange={() => handlePermisoChange(index+1)}
                          />
                          {permiso}
                        </label>
                    </div>
                ))}
            </div>
            <div className="m-5" style={{ flex: 1 }}>
                <i className="bi bi-person-lines-fill" style={{ fontSize: '2rem' }}></i>
                <br></br>
                <h5><b>Ingrese nombre del nuevo rol:</b></h5>
                <input
                    className={`form-control text-center`}
                    type="text"
                    placeholder="Nombre nuevo rol"
                    value={nombreRol}
                    onChange={handleNombreRolChange}
                    style={{ width: '100%', textAlign: 'center' }}
                />
                {errorNombre && <span style={{ color: 'red' }}>El nombre del rol no puede estar vacío.</span>}
                <br></br>
                <button type="button" className="btn btn-primary btn-lg" onClick={crearRol}>Crear nuevo rol</button>
                
            </div>
        </div>
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
    </div>
  );
}

export default Configuracion;