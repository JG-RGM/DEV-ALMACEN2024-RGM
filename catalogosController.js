// catalogosController.js
const db = require('./dbConfig');

//Agregar Marca
function AgregarMarca(req, res) {
  const { FNombre } = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CrearMarca('${FNombre.trim()}',' ')`, (error, results) => {
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

//Deshabilitar/Habilitar Marca
function CambiarEstadoMarca(req, res) {
  const {FidMarca} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CambiarEstadoMarca(${FidMarca})`, (error, results) => {
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

//Consultar marcas
function ConsultarMarcas(req, res) {
   // Llamar al procedimiento almacenado
   db.query('CALL RGM_ConsultarMarcas()', (error, results) => {     
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

//Consultar marcas sin deshabilitadas
function ConsultarMarcasHabilitadas(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarMarcasHabilitadas()', (error, results) => {     
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

/////////////////////////////////////////////////////////////////////////////////////////////////FAMILIAS

//Agregar Familia
function AgregarFamilia(req, res) {
  const { FNombre, FPrefijo } = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CrearFamilia('${FNombre.trim()}','${FPrefijo.trim().toUpperCase()}')`, (error, results) => {
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

//Cambiar estado familia
function CambiarEstadoFamilia(req, res) {
  const {FidFamilia} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CambiarEstadoFamilia(${FidFamilia})`, (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        // Obtener el resultado del procedimiento almacenado
          res.status(200).json(results);
      } 
  });
  }catch (err) {
    console.log('errror');
      return res.status(500).send(err.message);
  }
}

//Consultar familias
async function ConsultarFamilias(req, res) {
   // Llamar al procedimiento almacenado
   db.query('CALL RGM_ConsultarFamilias()', (error, results) => {     
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
//Consultar familias habilitadas
async function ConsultarFamiliasHabilitadas(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarFamiliasHabilitadas()', (error, results) => {     
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

/////////////////////////////////////////////////////////////////////////////////////////////////CONCENTRACION

//Agregar Concentracion
function AgregarConcentracion(req, res) {
  const { FNombre} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CrearConcentracion('${FNombre.trim().toUpperCase()}')`, (error, results) => {
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

//Cambiar estado Concentracion
function CambiarEstadoConcentracion(req, res) {
  const {FidConcentracion} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CambiarEstadoConcentracion(${FidConcentracion})`, (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        // Obtener el resultado del procedimiento almacenado
          res.status(200).json(results);
      } 
  });
  }catch (err) {
    console.log('errror');
      return res.status(500).send(err.message);
  }
}

//Consultar Concentracion
async function ConsultarConcentracion(req, res) {
   // Llamar al procedimiento almacenado
   db.query('CALL RGM_ConsultarConcentracion()', (error, results) => {     
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
//Consultar Concentracion habilitadas
async function ConsultarConcentracionHabilitadas(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarConcentracionHabilitadas()', (error, results) => {     
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

/////////////////////////////////////////////////////////////////////////////////////////////////PRESENTACION

//Agregar Presentacion
function AgregarPresentacion(req, res) {
  const { FNombre} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CrearPresentacion('${FNombre.trim().toUpperCase()}')`, (error, results) => {
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

//Cambiar estado Presentacion
function CambiarEstadoPresentacion(req, res) {
  const {FidPresentacion} = req.body;
  // Insertar por medio de un procedimiento almacenado.
  try {
    // Llamar al procedimiento almacenado
    db.query(`CALL RGM_CambiarEstadoPresentacion(${FidPresentacion})`, (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        // Obtener el resultado del procedimiento almacenado
          res.status(200).json(results);
      } 
  });
  }catch (err) {
    console.log('errror');
      return res.status(500).send(err.message);
  }
}

//Consultar Presentacion
async function ConsultarPresentacion(req, res) {
   // Llamar al procedimiento almacenado
   db.query('CALL RGM_ConsultarPresentacion()', (error, results) => {     
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
//Consultar Presentacion habilitadas
async function ConsultarPresentacionHabilitadas(req, res) {
  // Llamar al procedimiento almacenado
  db.query('CALL RGM_ConsultarPresentacionHabilitadas()', (error, results) => {     
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
  AgregarMarca,
  CambiarEstadoMarca,
  ConsultarMarcas,
  ConsultarMarcasHabilitadas,
  AgregarFamilia,
  CambiarEstadoFamilia,
  ConsultarFamilias,
  ConsultarFamiliasHabilitadas,
  AgregarConcentracion,
  CambiarEstadoConcentracion,
  ConsultarConcentracion,
  ConsultarConcentracionHabilitadas,
  AgregarPresentacion,
  CambiarEstadoPresentacion,
  ConsultarPresentacion,
  ConsultarPresentacionHabilitadas
};