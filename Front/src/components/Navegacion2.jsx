import Link from "next/link";
import { useState } from "react";

function Navegacion() {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem("sesion");
    setMostrarMenu(false); // Ocultar el menú después de cerrar sesión
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" href="/inicio">
            Inventario RGM
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMostrarMenu(!mostrarMenu)}
          >
            ☰
          </button>
          <div className={`collapse navbar-collapse ${mostrarMenu ? 'show' : ''}`} style={{ zIndex: 9999 }}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/inicio">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/perfil">
                  Perfil
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => setMostrarMenu(!mostrarMenu)}
                >
                  Sesion
                </a>
                {mostrarMenu && (
                  <ul className="navbar-nav" style={{ zIndex: 100 }}>
                    <li className="nav-item">
                      <button className="nav-link" onClick={cerrarSesion}>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navegacion;
