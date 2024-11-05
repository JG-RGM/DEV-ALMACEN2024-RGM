import _ from "lodash";

export const paginar = (items, numeroPagina, tamPagina) => {
    const indiceInicio = (numeroPagina - 1) * tamPagina;
    return _(items).slice(indiceInicio).take(tamPagina).value();
}
