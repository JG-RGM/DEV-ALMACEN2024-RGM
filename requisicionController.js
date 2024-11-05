// requisicionController.js
const db = require('./dbConfig');
const {enviarCorreo} =require('./mailController');


//Ejecutar consulta Requisiciones *
async function ConsultarRequisiciones(req, res) {
   // Llamar al procedimiento almacenado
   db.query('CALL RGM_ConsultarRequisiciones()', (error, results) => {     
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

//Ejecutar consulta Requisiciones para despacho *
async function ConsultarTodasRequisiciones(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarRequisicionesDespacho()', (error, results) => {     
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

//Agrega la requisicion a la base de datos *
async function AgregarRequisiciones(req, res) {
  let datosRequisicion = req.body;
  try {
      db.query(`CALL RGM_CrearRequisicionArticulo('${datosRequisicion.solicitante.trim()}','${datosRequisicion.observacion.trim()}','${datosRequisicion.correoSolicitante.trim()}')`, (error, results) => {
          if (error) {
              console.error('Error al ejecutar el procedimiento almacenado:', error);
              return res.status(500).send('Error interno del servidor');
          }

          enviarCorreo(datosRequisicion.solicitante.trim());
          // Se realizó correctamente la inserción del requisicion
          const detallesRequisicionPromises = datosRequisicion.requisiciones.map(requisicion => {
              const idArticulo = requisicion.articulo; //.replace(/-\w+$/, ''); -- CAMBIO 2
              const cantidadArticulo = parseInt(requisicion.cantidad);
              
              return new Promise((resolve, reject) => {
                  db.query(`CALL RGM_CrearDetalleRequisicionArticulos(${idArticulo},${cantidadArticulo})`, (error, results) => {
                      if (error) {
                          reject(error);
                      } else {
                          resolve();
                      }
                  });
              });
          });

          // Esperar a que todas las promesas se resuelvan
          Promise.all(detallesRequisicionPromises)
              .then(() => {
                  res.status(200).json(results);
              })
              .catch(error => {
                  console.error('Error al insertar detalles de requisicion:', error);
                  res.status(500).send('Error interno del servidor');
              });
      });
  } catch (err) {
      console.error('Error general:', err);
      return res.status(500).send(err.message);
  }
}


//Ejecutar consulta DETALLE Requisiciones *
async function ConsultarDetalleRequisiciones(req, res) {
  const { idRequisicion } = req.body;
  // Llamar al procedimiento almacenado
  db.query(`CALL RGM_ConsultarDetalleRequisiciones(${idRequisicion})`, (error, results) => {     
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

//Cambiar la cantidad de un articulo del requisicion *
function CambiarCantidadDetalleRequisicion(req, res) {
  const {idDetalle, Cantidad} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_AgregarCantidadAprobadaArticulo(${idDetalle},${Cantidad})`, (error, results) => {
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

//Aprobar la requisicion para que se pueda despachar *
function AprobarRequisicion(req, res) {
  const {idRequisicion, autorizador} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_AprobarRequisicion(${idRequisicion}, '${autorizador.trim()}')`, (error, results) => {
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

//Actualizar las cantidades de los articulos de los Requisiciones *
function RealizarRequisicion(req, res) {
  const {idRequisicion, datos} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_ActualizarCantidadesRequisicion(${idRequisicion})`, (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).send('Error interno del servidor');
      } 

      // Se realizó correctamente la inserción del ingreso
      const detalle = datos.map(detalle => {
          const idRequisicion = detalle.idRequisicion;
          const idArticulo = detalle.idArticulo;
          const codigoArticulo = detalle.codigoArticulo;
          const nombreArticulo = detalle.nombreArticulo;
          const descripcionArticulo = detalle.descripcionArticulo;
          const cantidadAprobada = detalle.cantidadAprobada;
          const cantidadSolicitada = detalle.cantidadTotalIngresada;
          const fechaVencimiento = detalle.fechaVencimiento;
          console.log(fechaVencimiento);
          
          return new Promise((resolve, reject) => {
              db.query(`CALL RGM_CrearDetalleDespacho(${idRequisicion},'${idArticulo}','${codigoArticulo}','${nombreArticulo}','${descripcionArticulo}',${cantidadSolicitada},${cantidadAprobada},'${fechaVencimiento}')`, (error, results) => {
                  if (error) {
                      reject(error);
                  } else {
                      resolve();
                  }
              });
          });
      });

      // Esperar a que todas las promesas se resuelvan
      Promise.all(detalle)
      .then(() => {
          res.status(200).json(results);
      })
      .catch(error => {
          console.error('Error al insertar detalles de ingreso:', error);
          res.status(500).send('Error interno del servidor');
      });


  });
  }catch (err) {
      return res.status(500).send(err.message);
  }
}

//Rechazar requisicion *
function RechazarRequisicion(req, res) {
  const {idRequisicion} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_RechazarRequisicion(${idRequisicion})`, (error, results) => {
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

//Ejecutar consulta DETALLE Despacho *
async function ConsultarDetalleDespacho(req, res) {
  const { idRequisicion } = req.body;
  // Llamar al procedimiento almacenado
  db.query(`CALL RGM_ConsultarDetalleDespacho(${idRequisicion})`, (error, results) => {     
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
  AgregarRequisiciones,
  CambiarCantidadDetalleRequisicion,
  RealizarRequisicion,
  ConsultarRequisiciones,
  ConsultarDetalleRequisiciones,
  ConsultarTodasRequisiciones,
  RechazarRequisicion,
  AprobarRequisicion,
  ConsultarDetalleDespacho
};
