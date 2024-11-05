const db = require('./dbConfig');

//Autenticar Usuario
async function AutenticarUsuario(req, res) {
 console.log('Esta entrando a la peticion');
 const { correo, contra } = req.body;

  try {
      // Llamar al procedimiento almacenado
      db.query(`CALL RGM_AutenticarUsuario('${correo.trim()}','${contra.trim()}')`, (error, results) => {
        if (error) {
          console.error('Error al ejecutar el procedimiento almacenado:', error);
          res.status(500).send('Error interno del servidor');
        } else {
          // Obtener el resultado del procedimiento almacenado
          const procResultados = results[0];
          console.log(procResultados);
          const resultados = [];
          if (procResultados.length > 0) {
          // Si hay al menos una fila en los resultados
          for (const row of procResultados) {
              // Iterar sobre las filas
              resultados.push(row);
          }
            res.status(200).json(resultados);
          } else {
              res.json(null);
          }
        } 
      });

  }catch (err) {
      return res.send(err.message);
  }
}



module.exports = {
    AutenticarUsuario
  };
