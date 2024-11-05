import Link from "next/link";
import { useEffect } from "react";
import Swal from "sweetalert2";

function Navegacion() {
  const cerrarSesion = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0069de',
      cancelButtonColor: '#ff0039',
      confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuarioDatos");
        Swal.fire({
          title: '¡Sesión cerrada!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000 // Duración en milisegundos (2 segundos)
        }).then(() => {
          // Redirigir después de 2 segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 10);
        });
      }
    });
  };

  useEffect(() => {
    // Lógica para verificar si hay una sesión activa al cargar el componente, por ejemplo:
    const sesionActiva = localStorage.getItem("sesion");
    if (!sesionActiva) {
      // Puedes redirigir a la página de inicio de sesión si no hay sesión activa
      // router.push('/login'); // Necesitarás importar el router de Next.js para usar esto
    }
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" href="/inicio">
            Inventario RGM
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                  <a className="nav-link"  href="/inicio">Inicio</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link"  href="/perfil">Perfil</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={cerrarSesion}>
                  Cerrar Sesión <i className="bi bi-box-arrow-right"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navegacion;