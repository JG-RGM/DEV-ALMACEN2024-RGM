"use client";
import Navegacion from "@/components/Navegacion";
import React, { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Head from 'next/head';

function MenuDeTarjetas() {
  const redirectToPage = (page) => {
    window.location.href = `/${page}`;
  };

  const cardsData = [
    {
      permiso: 1,
      title: 'Gestión de Usuarios',
      description: 'Administra y gestiona los usuarios del sistema.',
      icon: 'bi bi-person-fill', // Icono Bootstrap
      color: '#003366', // Color asociado
      link: 'usuarios',
    },
    {
      permiso: 2,
      title: 'Gestión de Marcas',
      description: 'Crea o modifica una marca para los árticulos.',
      icon: 'bi bi-bookmark-plus-fill', // Icono Bootstrap
      color: '#0088cc', // Color asociado
      link: 'marcas',
    },
    {
      permiso: 3,
      title: 'Gestión de Familias',
      description: 'Crea o modifica una familia para los árticulos.',
      icon: 'bi bi-patch-plus-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'familias',
    },
    {
      permiso: 4,
      title: 'Gestión de Concentración',
      description: 'Crea o modifica una familia para los árticulos.',
      icon: 'bi bi-patch-plus-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'concentracion',
    },
    {
      permiso: 5,
      title: 'Gestión de Presentación',
      description: 'Crea o modifica una familia para los árticulos.',
      icon: 'bi bi-patch-plus-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'presentacion',
    },
    {
      permiso: 6,
      title: 'Creación de articulos',
      description: 'Administra y controla el inventario de la empresa.',
      icon: 'bi bi-archive-fill', // Icono Bootstrap
      color: '#005580', // Color asociado
      link: 'creacionArticulos',
    },
    {
      permiso: 7,
      title: 'Ingreso y Aprobación de Artículos',
      description: 'Registra nuevos artículos en el sistema.',
      icon: 'bi bi-cart-fill', // Icono Bootstrap
      color: '#0069de', // Color asociado
      link: 'Ingresos',
    },
    {
      permiso: 8,
      title: 'Requisición de Artículos',
      description: 'Crea solicitudes de artículos requeridos.',
      icon: 'bi bi-list-check', // Icono Bootstrap
      color: '#0099ff', // Color asociado
      link: 'ingresoRequisiciones',
    },
    {
      permiso: 8,
      title: 'Listado de requisiciones',
      description: 'Crea o modifica una familia para los árticulos.',
      icon: 'bi bi-check-square-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'listadoRequisiciones',
    },
    {
      permiso: 9,
      title: 'Aprobación de Requisiciones',
      description: 'Aprueba o rechaza solicitudes de artículos.',
      icon: 'bi bi-check-square-fill', // Icono Bootstrap
      color: '#00ccff', // Color asociado
      link: 'aprobacionRequisiciones',
    },
    {
      permiso: 10,
      title: 'Despacho de Requisiciones',
      description: 'Modifica el año actual del inventario.',
      icon: 'bi bi-gear-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'despacho',
    },
    {
      permiso: 11,
      title: 'Listado de inventario general',
      description: 'Administra y controla el inventario de la empresa.',
      icon: 'bi bi-archive-fill', // Icono Bootstrap
      color: '#005580', // Color asociado
      link: 'inventarioActual',
    },
    {
      permiso: 12,
      title: 'Listado Artículos Perecederos',
      description: 'Crea o modifica una marca para los árticulos.',
      icon: 'bi bi-calendar3-week', // Icono Bootstrap
      color: '#5088cc', // Color asociado
      link: 'perecederos',
    },
    {
      permiso: 13,
      title: 'Configuración RGM',
      description: 'Modifica el año actual del inventario.',
      icon: 'bi bi-gear-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'configuracion',
    },
    {
      permiso: 14,
      title: 'Creación de Roles',
      description: 'Modifica el año actual del inventario.',
      icon: 'bi bi-gear-fill', // Icono Bootstrap
      color: '#00bbff', // Color asociado
      link: 'creacionRoles',
    },
    {
      permiso: 15,
      title: 'Reportes RGM',
      description: 'Modifica el año actual del inventario.',
      icon: 'bi bi-gear-fill', // Icono Bootstrap
      color: '#99bbff', // Color asociado
      link: 'reporteria',
    },
  ];

  const handleCardClick = (link) => {
    redirectToPage(link);
  };


  //Datos usuario:
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [cards, setCards] = useState([]);
  var permisosArray = [];
  //Carga inicial
  useEffect(() => {

    const userData = localStorage.getItem('usuarioDatos');
    if(userData){
      const datos = JSON.parse(userData);
      setDatosUsuario(datos);

      permisosArray = datos.permisosUsuario.split(',').map(Number);
      const cardsFiltradas = cardsData.filter(card => {
      // Verificar si el permiso de la tarjeta está incluido en permisosUsuario
      return permisosArray.includes(card.permiso);
      });

      setCards(cardsFiltradas);

    }
  }, []);

  return (
    <div>
      <Navegacion/>
      <Head>
        <link rel="shortcut icon" href="./Favicon/favicon.ico"/>
      </Head>
        
      
      <div className="container-fluid fondo pt-4">
  <div className="card custom-card2 rounded-3">
    <h1 className="text-center mb-4">Inventario Registro Garantias Mobiliarias</h1>
    <div className="card-body">
      <div className="row justify-content-center">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div
                className="card custom-card text-center position-relative"
                style={{
                  backgroundColor: card.color,
                  cursor: 'pointer',
                  borderRadius: '25px',
                  transition: 'transform 0.2s',
                  width: '100%', // Ajusta el ancho según tus necesidades
                  height: '200px', // Ajusta la altura según tus necesidades
                  margin: '0 auto', // Centra horizontalmente
                }}
                onClick={() => handleCardClick(card.link)}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <i className={card.icon} style={{ fontSize: '2rem', color: 'white', marginTop: '0px' }}></i>
                <div className="card-body">
                  <h4 className="card-title" style={{ color: 'white', marginTop: '5px' }}>{card.title}</h4>
                  
                </div>
              </div>
            </div>
          ))) : (
            <div className="col-md-3 mb-4">
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <div className="text-primary text-center position-relative" role="status">
                <div className="spinner-border" style={{ width: '200px', height: '200px' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export default MenuDeTarjetas;