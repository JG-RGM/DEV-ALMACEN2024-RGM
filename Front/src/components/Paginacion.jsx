import _ from "lodash";

const Paginacion = ({ items, tamPagina, pagActual, onPageChange }) => {
  const contadorPaginas = items / tamPagina;
  if (Math.ceil(contadorPaginas) === 1) return null;
  const paginas = _.range(1, contadorPaginas + 1);

  return (
    <nav>
      <ul className="pagination ">
        {paginas.map((pag) => (
          <li key={pag} className={pag === pagActual ? "page-item active" : "page-item"}>
            <a style={{cursor:'pointer'}} onClick={()=> onPageChange(pag)} className="page-link">
              {pag}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Paginacion;
