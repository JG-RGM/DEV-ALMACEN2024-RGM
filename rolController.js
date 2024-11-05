// rolController.js
const db = require('./dbConfig');

//Agregar rol
function AgregarRol(req, res) {
    const { permisos, nombreRol} = req.body;
    //Insertar por medio de un procedimiento almacenado.
    try {
      // Llamar al procedimiento almacenado
      db.query(`CALL RGM_CrearRol('${nombreRol.trim()}','${permisos}')`, (error, results) => {
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


  //Consultar Roles
async function ConsultarRoles(req, res) {
    try {
        // Llamar al procedimiento almacenado
        db.query('CALL RGM_ConsultarRoles()', (error, results) => {
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
    AgregarRol,
    ConsultarRoles
  };