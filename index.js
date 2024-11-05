//archivo index.js
var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { AgregarUsuario, DeshabilitarUsuario, HabilitarUsuario, ActualizarUsuario, CambiarContraUsuario, ConsultarUsuarios} = require('./usuariosController');
const { ActualizarFechaActual, ConsultarFechaActual, RealizarCorteInventario } = require('./usuariosController');
const { AgregarMarca, CambiarEstadoMarca, ConsultarMarcas, AgregarFamilia, CambiarEstadoFamilia, ConsultarFamilias, ConsultarMarcasHabilitadas, ConsultarFamiliasHabilitadas } = require('./catalogosController');
const { AgregarConcentracion, CambiarEstadoConcentracion, ConsultarConcentracion, ConsultarConcentracionHabilitadas } = require('./catalogosController');
const { AgregarPresentacion, CambiarEstadoPresentacion, ConsultarPresentacion, ConsultarPresentacionHabilitadas } = require('./catalogosController');
const { AgregarIngresos, CambiarCantidadDetalleIngreso, RealizarIngreso, ConsultarIngresos, ConsultarDetalleIngresos, RechazarIngreso } = require('./ingresosController');
const { AgregarRequisiciones, ConsultarRequisiciones, ConsultarDetalleRequisiciones, ConsultarTodasRequisiciones, CambiarCantidadDetalleRequisicion, RealizarRequisicion, RechazarRequisicion, AprobarRequisicion, ConsultarDetalleDespacho } = require('./requisicionController');
const { CrearArticulo, ConsultarArticulos, ConsultarArticulosPerecederos } = require('./articuloController');
const { AutenticarUsuario } = require('./autenticacionController');
const { AgregarRol, ConsultarRoles } = require('./rolController');
const { GenerarReporte, GenerarReporteRequisicion, GenerarReporteIngreso } = require('./reporteController');


//const PUERTO = 8080;
const PUERTO = 5500;
var app = express();
app.use(bodyParser.json());

// Configurar el middleware CORS para permitir cualquier origen
app.use(cors());

app.listen(PUERTO, function(){
	console.log('Servidor http corriendio en el puerto '+ PUERTO);
    
});


//=====================
//===== CONFIGURACION ======
//=====================
app.get('/ConsultarFechaActual', ConsultarFechaActual);

app.post('/ActualizarFechaActual', ActualizarFechaActual);

app.post('/RealizarCorteInventario', RealizarCorteInventario);



//=====================
//===== USUARIOS ======
//=====================

//CONSULTAR USUARIOS *
app.get('/consultarUsuarios', ConsultarUsuarios);

//AGREGAR USUARIO NUEVO  *
app.post('/agregarUsuario', AgregarUsuario); 

//DESHABILITAR USUARIO *
app.post('/eliminarUsuario', DeshabilitarUsuario);

//HABILTIAR USUARIO *
app.post('/habilitarUsuario', HabilitarUsuario);

//ACTUALIZAR USUARIO *
app.post('/actualizarUsuario', ActualizarUsuario);

//AUTENTICAR *
app.post('/autenticarUsuario', AutenticarUsuario);

//CAMBIAR CONTRASEÑA *
app.post('/cambiarContra', CambiarContraUsuario);

//=====================
//===== MARCAS ======
//=====================

//CONSULTAR Marcas *
app.get('/consultarMarcas', ConsultarMarcas);

//CONSULTAR Marcas Habilitadas * 
app.get('/consultarMarcasHabilitadas', ConsultarMarcasHabilitadas);

//AGREGAR MARCA *
app.post('/agregarMarca', AgregarMarca); 

//DESHABILITAR/HABILITAR MARCA  *
app.post('/cambiarEstadoMarca', CambiarEstadoMarca); 

//=====================
//===== FAMILIAS ======
//=====================

//CONSULTAR FAMILIAS *
app.get('/consultarFamilias', ConsultarFamilias);

//CONSULTAR FAMILIAS HABILITADAS *
app.get('/consultarFamiliasHabilitadas', ConsultarFamiliasHabilitadas);

//AGREGAR FAMILIA *
app.post('/agregarFamilia', AgregarFamilia); 

//CAMBIAR ESTADO FAMILIA *
app.post('/cambiarEstadoFamilia', CambiarEstadoFamilia); 

//=====================
//===== CONCENTRACION ======
//=====================

//CONSULTAR CONCENTRACION *
app.get('/consultarConcentracion', ConsultarConcentracion);

//CONSULTAR CONCENTRACION HABILITADAS 
app.get('/consultarConcentracionHabilitadas', ConsultarConcentracionHabilitadas);

//AGREGAR CONCENTRACION *
app.post('/agregarConcentracion', AgregarConcentracion); 

//CAMBIAR ESTADO CONCENTRACION 
app.post('/cambiarEstadoConcentracion', CambiarEstadoConcentracion); 

//=====================
//===== PRESENTACION ======
//=====================

//CONSULTAR CONCENTRACION *
app.get('/consultarPresentacion', ConsultarPresentacion);

//CONSULTAR CONCENTRACION HABILITADAS 
app.get('/consultarPresentacionHabilitadas', ConsultarPresentacionHabilitadas);

//AGREGAR CONCENTRACION *
app.post('/agregarPresentacion', AgregarPresentacion); 

//CAMBIAR ESTADO CONCENTRACION 
app.post('/cambiarEstadoPresentacion', CambiarEstadoPresentacion); 


//=====================
//===== ARTICULOS ======
//=====================

//CONSULTAR ARTICULOS *
app.get('/consultarArticulos', ConsultarArticulos);

//AGREGAR ARTICULO *
app.post('/agregarArticulo', CrearArticulo); 

//CONSULTAR ARTICULOS PERECEDEROS *
app.get('/consultarArticulosPerecederos', ConsultarArticulosPerecederos);

//=====================
//===== INGRESOS ======
//=====================
app.post('/agregarIngresos', AgregarIngresos);

//Consultar ingresos
app.get('/consultarIngresos', ConsultarIngresos);

//Consultar detalle ingresos
app.post('/consultarDetalleIngresos', ConsultarDetalleIngresos);

//Rechazar ingreso
app.post('/rechazarIngreso', RechazarIngreso);

//Actualizar cantidad de detalle ingreso
app.post('/actualizarCantidadDetalle', function(req, res){
    CambiarCantidadDetalleIngreso(req,res);
});

//Realizar ingreso - Se actualizan las cantidades
app.post('/realizarIngreso', function(req, res){
    RealizarIngreso(req,res);
});

//==========================
//===== REQUISICIONES ======
//==========================
app.post('/agregarRequisicion', AgregarRequisiciones);

app.get('/consultarRequisiciones', ConsultarRequisiciones);

app.get('/consultarRequisicionesDespacho', ConsultarTodasRequisiciones);

app.post('/consultarDetalleDespacho', ConsultarDetalleDespacho);

app.post('/consultarDetalleRequisiciones', ConsultarDetalleRequisiciones);

app.post('/agregarCantidadAprobada', CambiarCantidadDetalleRequisicion);

app.post('/aprobarRequisicion', AprobarRequisicion);

app.post('/realizarRequisicion', RealizarRequisicion);

app.post('/rechazarRequisicion', RechazarRequisicion);

//==========================
//===== ROLES ======
//==========================

app.post('/crearRol', AgregarRol);

app.get('/consultarRoles', ConsultarRoles);

//==========================
//===== REPORTES ======
//==========================

//Generar Reporte
app.post('/generarReporte', GenerarReporte);

//Reporte Despacho
app.post('/generarReporteDespacho', GenerarReporteRequisicion);

//Reporte Ingreso
app.post('/generarReporteIngreso', GenerarReporteIngreso);



