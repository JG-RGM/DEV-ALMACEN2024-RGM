"use client";
import React, { useEffect, useState } from "react";
import Navegacion from "@/components/Navegacion";
import "@/app/globals.css";
import axios from "axios";
import Paginacion from "@/components/Paginacion";
import { paginar } from "@/utils/paginacion";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import config from '@/app/config';

function InventarioActualPage() {

  const idPAGINA = 12; //IDENTIFICADOR DE PAGINA UNICO
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

  //Paginacion
  const [posts, setPosts] = useState([]);

  const [pagActual, setPaginaActual] = useState(1);
  const tamPagina = 10;

  const handlePageChange = (page) => {
    setPaginaActual(page);
  };

  const paginatePosts = paginar(posts, pagActual, tamPagina);

  /////    *************************** Carga inicial **********************************************

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articulosData] = await Promise.all([
          axios.get(`${config.apiUrl}/consultarArticulosPerecederos`)
        ]);
  
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
  

  return (
    <div className="fondo">
      <Navegacion />
      <div className="container-fluid p-4 justify-content-center" style={{ width: "95%"}}>
        <h1 className="fondo text-center">Artículos Perecederos</h1>

        <div className="table-responsive card custom-card rounded">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">           
          </div>
          <br></br>
          <table id="tablaDatos" className="table ">
            <thead>
              <tr align="center">
                <th scope="col" align="center" style={{ width: '200px' }}>Código Articulo</th>
                <th scope="col" align="center">Nombre</th>
                <th scope="col" align="left">Descripción</th>
                <th scope="col" align="center">Marca</th>
                <th scope="col" align="center">Familia</th>
                <th scope="col" align="center">Cantidad</th>
                <th scope="col" align="center">Fecha Vencimiento</th>
                <th scope="col" align="left" style={{ textAlign: 'left'}}>Estado</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatePosts.map((post) => (
                <tr key={post.id}>
                  <td align="center"> {post.codigo}</td>
                  <td align="center"> {post.nombreArticulo}</td>
                  <td align="left"> {post.descripcion}</td>
                  <td align="center"> {post.nombreMarca}</td>
                  <td align="center"> {post.nombreFamilia}</td>
                  <td align="center"> {post.cantidad}</td>
                  <td align="center"> {post.fechaVencimiento}</td>
                  <td align="left">
                      {post.estadoVencimiento === 'Expirado' && 
                          <i className="bi bi-x-circle-fill" style={{color:'red', marginRight: '15px'}}></i>}
                      {post.estadoVencimiento === 'Por expirar' && 
                          <i className="bi bi-exclamation-circle-fill" style={{color:'orange', marginRight: '15px'}}></i>}
                      {post.estadoVencimiento === 'Vigente' && 
                          <i className="bi bi-check-circle-fill" style={{color:'green', marginRight: '15px'}}></i>}
                      {post.estadoVencimiento}
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


      {/* Scrip de boostrap para Modal */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" />
      <script src="https://cdn.datatables.net/v/bs5/dt-1.13.4/datatables.min.js" />
      <script src="https://cdn.datatables.net/1.12.1/js/dataTables.bootstrap5.min.js" />
    </div>
  );
}

export default InventarioActualPage;
