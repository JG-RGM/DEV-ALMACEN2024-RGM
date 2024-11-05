// ingresosController.js
const db = require('./dbConfig');


//Ejecutar consulta INGRESOS
async function ConsultarIngresos(req, res) {
   // Llamar al procedimiento almacenado
   db.query('CALL RGM_ConsultarIngresos()', (error, results) => {     
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

async function AgregarIngresos(req, res) {
  let datosIngreso = req.body;
  try {
      db.query(`CALL RGM_CrearIngresoArticulo('${datosIngreso.fecha.trim()}','${datosIngreso.despacho.trim()}','${datosIngreso.requi.trim()}','${datosIngreso.observaciones.trim()}','${datosIngreso.solicitante.trim()}')`, (error, results) => {
          if (error) {
              console.error('Error al ejecutar el procedimiento almacenado:', error);
              return res.status(500).send('Error interno del servidor');
          }

          // Se realizó correctamente la inserción del ingreso
          const detallesIngresoPromises = datosIngreso.ingresos.map(ingreso => {
            
              const idArticulo = ingreso.articulo //.replace(/-\w+$/, '');  --- CAMBIO 1
              const cantidadArticulo = parseInt(ingreso.cantidad);
              const fechaVencimiento = ingreso.fechavencimiento;
              console.log('Vamos a ingresar el articulo con id: ' + idArticulo);
              return new Promise((resolve, reject) => {
                  db.query(`CALL RGM_CrearDetalleArticulos(${idArticulo},${cantidadArticulo},'${fechaVencimiento}')`, (error, results) => {
                      if (error) {
                          reject(error);
                      } else {
                          resolve();
                      }
                  });
              });
          });

          // Esperar a que todas las promesas se resuelvan
          Promise.all(detallesIngresoPromises)
              .then(() => {
                  res.status(200).json(results);
              })
              .catch(error => {
                  console.error('Error al insertar detalles de ingreso:', error);
                  res.status(500).send('Error interno del servidor');
              });
      });
  } catch (err) {
      console.error('Error general:', err);
      return res.status(500).send(err.message);
  }
}

//Cambiar la cantidad de un articulo del ingreso
function CambiarCantidadDetalleIngreso(req, res) {
  const {idDetalle, Cantidad} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CambiarCantidadArticuloIngreso(${idDetalle},${Cantidad})`, (error, results) => {
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

//Actualizar las cantidades de los articulos de los ingresos
function RealizarIngreso(req, res) {
  const {idIngreso} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_ActualizarCantidadesArticulo(${idIngreso})`, (error, results) => {
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

//Actualizar las cantidades de los articulos de los ingresos
function RechazarIngreso(req, res) {
  const {idIngreso} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_RechazarIngreso(${idIngreso})`, (error, results) => {
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

//Ejecutar consulta DETALLE INGRESOS *
async function ConsultarDetalleIngresos(req, res) {
  const { idIngreso } = req.body;
  // Llamar al procedimiento almacenado
  db.query(`CALL RGM_ConsultarDetalleIngreso(${idIngreso})`, (error, results) => {     
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
    AgregarIngresos,
    CambiarCantidadDetalleIngreso,
    RealizarIngreso,
    ConsultarIngresos,
    ConsultarDetalleIngresos,
    RechazarIngreso
  };
