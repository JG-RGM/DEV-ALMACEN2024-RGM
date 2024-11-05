// reporteController.js
const db = require('./dbConfig');

//Generar Reporte
async function GenerarReporte(req, res) {

const { nombre_reporte, tipo_estado, fecha_inicio, fecha_fin, codigoArticulo } = req.body;

const fechaInicioFormateada = new Date(fecha_inicio).toISOString().slice(0, 10);
const fechaFinFormateada = new Date(fecha_fin).toISOString().slice(0, 10);
const codigo = parseInt(codigoArticulo);

try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_GenerarReporte('${nombre_reporte}','${tipo_estado}','${fechaInicioFormateada}','${fechaFinFormateada}',${codigo})`, (error, results) => {
        if (error) {
            console.error('Error al ejecutar el procedimiento almacenado:', error);
            res.status(500).send('Error interno del servidor');
        } else {
        // Obtener el resultado del procedimiento almacenado
        const procResultados = results[0];
        const resultados = [];
        if (procResultados.length > 0) {
        // Si hay al menos una fila en los resultados
        for (const row of procResultados) {
            // Iterar sobre las filas
            resultados.push(row);
        }
            res.json(resultados);
        } else {
            res.json(null);
        }
        } 
    });
}catch (err) {
    return res.status(500).send(err.message);
}
}

//Generar Reporte Detalle Requisicion
async function GenerarReporteRequisicion(req, res) {

    const { idRequisicion } = req.body;
       
    try {
        // Llamar al procedimiento almacenado
        db.query(`CALL RGM_ReporteDetalleRequisiciones(${idRequisicion})`, (error, results) => {
            if (error) {
                console.error('Error al ejecutar el procedimiento almacenado:', error);
                res.status(500).send('Error interno del servidor');
            } else {
            // Obtener el resultado del procedimiento almacenado
            const procResultados = results[0];
            const resultados = [];
            if (procResultados.length > 0) {
            // Si hay al menos una fila en los resultados
            for (const row of procResultados) {
                // Iterar sobre las filas
                resultados.push(row);
            }
                res.json(resultados);
            } else {
                res.json(null);
            }
            } 
        });
    }catch (err) {
        return res.status(500).send(err.message);
    }
}

//Generar Reporte Detalle Ingreso
async function GenerarReporteIngreso(req, res) {

    const { idIngreso } = req.body;
       
    try {
        // Llamar al procedimiento almacenado
        db.query(`CALL RGM_ReporteDetalleIngreso(${idIngreso})`, (error, results) => {
            if (error) {
                console.error('Error al ejecutar el procedimiento almacenado:', error);
                res.status(500).send('Error interno del servidor');
            } else {
            // Obtener el resultado del procedimiento almacenado
            const procResultados = results[0];
            const resultados = [];
            if (procResultados.length > 0) {
            // Si hay al menos una fila en los resultados
            for (const row of procResultados) {
                // Iterar sobre las filas
                resultados.push(row);
            }
                res.json(resultados);
            } else {
                res.json(null);
            }
            } 
        });
    }catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports = {
    GenerarReporte,
    GenerarReporteRequisicion,
    GenerarReporteIngreso
};