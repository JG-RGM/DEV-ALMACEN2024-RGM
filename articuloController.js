// articuloController.js
const db = require('./dbConfig');


//Ejecutar consulta articulos
async function ConsultarArticulos(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarArticulos()', (error, results) => {     
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      res.status(500).send('Error interno del servidor');
    } else {
      if (results.length === 0) {
        // La tabla está vacía
        res.json([]);
      } else {
        // La tabla tiene datos
        const procResultados = results[0];
        const resultados = [];
        for (const row of procResultados) {
          resultados.push(row);
        }
        res.status(200).json(resultados);
      }
    } 
  });
}

//Crear Articulo Nuevo con 0 Stock
function CrearArticulo(req, res) {
  const { FNombre, FDescripcion, FMarca, FFamilia, FConcentracion, FPresentacion } = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CrearArticulo('${FNombre.trim()}','${FDescripcion.trim()}',0,${FMarca},${FFamilia},${FConcentracion},${FPresentacion})`, (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        // Obtener el resultado del procedimiento almacenado
          res.status(200).json(results);
      } 
  });
  }catch (err) {
      return res.status(500).send(err.message);
  }
}

//Ejecutar consulta articulos Predecederos
async function ConsultarArticulosPerecederos(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarArticulosPerecederos()', (error, results) => {     
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      res.status(500).send('Error interno del servidor');
    } else {
      if (results.length === 0) {
        // La tabla está vacía
        res.json([]);
      } else {
        // La tabla tiene datos
        const procResultados = results[0];
        const resultados = [];
        for (const row of procResultados) {
          resultados.push(row);
        }
        res.status(200).json(resultados);
      }
    } 
  });
}


module.exports = {
  CrearArticulo,
  ConsultarArticulos,
  ConsultarArticulosPerecederos
};