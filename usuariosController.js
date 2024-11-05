// usuariosController.js
const db = require('./dbConfig');

//Consultar Usuarios
async function ConsultarUsuarios(req, res) {
  try {
      // Llamar al procedimiento almacenado
      db.query('CALL RGM_ConsultarUsuarios()', (error, results) => {
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

//Agregar Usuario Nuevo
function AgregarUsuario(req, res) {
  const { FNombre, FApellido, FCorreo, FRol } = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_InsertarUsuario('${FCorreo.trim()}','${FNombre.trim()}','${FApellido.trim()}','${FRol.trim()}')`, (error, results) => {
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

//Deshabilitar Usuario
function DeshabilitarUsuario(req, res) {
    const {FCorreo} = req.body;
    // Insertar por medio de un procedimiento almacenado.  
    try {
      // Llamar al procedimiento almacenado
      db.query(`CALL RGM_CambiarEstadoUsuario('${FCorreo.trim()}')`, (error, results) => {
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

//Habilitar Usuario
function HabilitarUsuario(req, res) {
    const {FCorreo} = req.body;
    // Insertar por medio de un procedimiento almacenado.
    try {
      // Llamar al procedimiento almacenado
      db.query(`CALL RGM_HabilitarUsuario('${FCorreo.trim()}')`, (error, results) => {
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

//Actualizar Usuario
function ActualizarUsuario(req, res) {
  const { FANombre, FAApellido, FACorreo, FARol } = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_ActualizarUsuario('${FACorreo.trim()}','${FANombre.trim()}','${FAApellido.trim()}',${FARol})`, (error, results) => {
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

//Cambiar Contraseña Usuario
function CambiarContraUsuario(req, res) {
  const {Correo, Contra} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CambiarContrasena('${Correo.trim()}','${Contra.trim()}')`, (error, results) => {
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



////////////////////////////////////////////////////////////////// FUNCIONES DE CONFIGURACION //////////////////////////////////////////////////////////

//Actualizar Año Acutal
function ActualizarFechaActual(req, res) {
  const nuevo_anio = req.body.anio;
    // Insertar por medio de un procedimiento almacenado.
    try {
      // Llamar al procedimiento almacenado
      db.query(`CALL RGM_CambiarFechaActual(${nuevo_anio})`, (error, results) => {
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

//Consultar FechaActual
async function ConsultarFechaActual(req, res) {
  try {
      // Llamar al procedimiento almacenado
      db.query('CALL ObtenerFechaActual()', (error, results) => {
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

//Realizar corte de inventario
async function RealizarCorteInventario(req, res) {
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RealizarCorteAnual()`, (error, results) => {
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

module.exports = {
  AgregarUsuario,
  DeshabilitarUsuario,
  HabilitarUsuario,
  ActualizarUsuario,
  ActualizarFechaActual,
  CambiarContraUsuario,
  ConsultarUsuarios,
  ConsultarFechaActual,
  RealizarCorteInventario
};