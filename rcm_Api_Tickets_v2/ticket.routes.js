const express = require('express');
const router = express.Router();
const authToken = require('../__utilitis/authToken');
const ControllerApi = require("./ticket.controller");

const multer = require('multer');
const path = require('path');

// Configurar Multer para almacenar archivos temporalmente
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/Get_Tipificaciones_Mesa", [authToken.verifyToken], ControllerApi.Get_Tipificaciones_Mesa);

/** MESAS DE AYUDA GENERICAS */
router.get("/Get_Ticket_Servicio", [authToken.verifyToken], ControllerApi.Get_Ticket_Servicio);
router.post("/Insert_Ticket_Servicio", [authToken.verifyToken], ControllerApi.Insert_Ticket_Servicio);
router.post("/Update_Ticket_Servicio", [authToken.verifyToken], ControllerApi.Update_Ticket_Servicio);
router.get("/Get_Simple_Tipificaciones", [authToken.verifyToken], ControllerApi.Get_Simple_Tipificaciones);
router.get("/Get_Arbol_Servicios_Empleado", [authToken.verifyToken], ControllerApi.Get_Arbol_Servicios_Empleado);
router.get("/Get_Ensamble_Mesa_Ayuda", [authToken.verifyToken], ControllerApi.Get_Ensamble_Mesa_Ayuda);
router.post("/Insert_Bitacora_Ticket", [authToken.verifyToken], ControllerApi.Insert_Bitacora_Ticket);
router.get("/Get_Ticket_Bitacora", [authToken.verifyToken], ControllerApi.Get_Ticket_Bitacora);
router.post("/Insert_Ticket_Empleados", [authToken.verifyToken], ControllerApi.Insert_Ticket_Empleados);
router.get("/Get_Ticket_Empleados", [authToken.verifyToken], ControllerApi.Get_Ticket_Empleados);
router.get("/Get_Mesa_Empleado", [authToken.verifyToken], ControllerApi.Get_Mesa_Empleado);
router.get("/Get_Autoriza_Ticket", [authToken.verifyToken], ControllerApi.Get_Autoriza_Ticket);
router.post("/Insert_Autoriza_Ticket", [authToken.verifyToken], ControllerApi.Insert_Autoriza_Ticket);
router.get("/Get_Mesa_DataDefault", [authToken.verifyToken], ControllerApi.Get_Mesa_DataDefault);
router.post("/Update_Autoriza_Ticket", [authToken.verifyToken], ControllerApi.Update_Autoriza_Ticket);

router.post("/Insert_Ticket_Inventario", [authToken.verifyToken], ControllerApi.Insert_Ticket_Inventario);
router.get("/Get_Requisicion_Empleados_Inmuebles", [authToken.verifyToken], ControllerApi.Get_Requisicion_Empleados_Inmuebles);
/** MESAS DE AYUDA GENERICAS */

router.post("/Insert_Respuesta_Mensaje", [authToken.verifyToken], ControllerApi.Insert_Respuesta_Mensaje);
router.post("/Update_Respuesta_Mensaje", [authToken.verifyToken], ControllerApi.Update_Respuesta_Mensaje);
router.get("/Get_Respuesta_Mensaje", [authToken.verifyToken], ControllerApi.Get_Respuesta_Mensaje);
router.get("/Get_Resumen_Ticket", [authToken.verifyToken], ControllerApi.Get_Resumen_Ticket);

router.get("/Get_Ticket_Foto", [authToken.verifyToken], ControllerApi.Get_Ticket_Foto);
router.get("/Get_Ticket_Documentos", [authToken.verifyToken], ControllerApi.Get_Ticket_Documentos);

router.get("/Data_Dashboard_General", [authToken.verifyToken], ControllerApi.Data_Dashboard_General);

router.post("/Insert_Emp_Ticket", [authToken.verifyToken], ControllerApi.Insert_Emp_Ticket);
router.get("/Get_Emp_Ticket", [authToken.verifyToken], ControllerApi.Get_Emp_Ticket);

router.post("/Insert_Eq_Tkt", [authToken.verifyToken], ControllerApi.Insert_Eq_Tkt);
router.post("/Insert_msj_ticket_file", [authToken.verifyToken], ControllerApi.Insert_msj_ticket_file);

router.get("/Get_Respuesta_Mensaje_Files", [authToken.verifyToken], ControllerApi.Get_Respuesta_Mensaje_Files);
router.post("/Insert_Emp_Ticket_sp", [authToken.verifyToken], ControllerApi.Insert_Emp_Ticket_StoreProcedure);
router.post("/Delete_Empleado_Ticket", [authToken.verifyToken], ControllerApi.Delete_Empleado_Ticket);

router.get("/Get_Edificios", [authToken.verifyToken], ControllerApi.Get_Edificios);
router.post("/Insert_Edificio_Servicio", [authToken.verifyToken], ControllerApi.Insert_Edificio_Servicio);
router.get("/Get_Ticket_Part", [authToken.verifyToken], ControllerApi.Get_Ticket_Part);
router.get("/Get_Tipificaciones_By_Proy", [authToken.verifyToken], ControllerApi.Get_Tipificaciones_By_Proy);

router.post("/Insert_Equipo_Ticket", [authToken.verifyToken], ControllerApi.Insert_Equipo_Ticket);
router.get("/Get_Activos_TicketSg", [authToken.verifyToken], ControllerApi.Get_Activos_TicketSg);

router.post("/UpdateLogSla", [authToken.verifyToken], ControllerApi.UpdateLogSla);

router.post("/Insert_DataSiadecon", [authToken.verifyToken], ControllerApi.Insert_DataSiadecon);

router.get("/Get_Reporte_Ticket", [authToken.verifyToken], ControllerApi.Get_Reporte_Ticket);
router.get("/Get_Reporte_dgmeia", [authToken.verifyToken], ControllerApi.Get_Reporte_dgmeia);


router.post("/uploadImagesTicketUninetCosci", [authToken.verifyToken], ControllerApi.uploadImagesTicketUninetCosci);
router.post("/uploadImagesTicketUninetWlanEndPoint", [authToken.verifyToken], ControllerApi.uploadImagesTicketUninetWlanEndPoint);
router.post("/uploadFilesTicketAsNice", [authToken.verifyToken], ControllerApi.uploadFilesTicketAsNice);

router.get("/Get_Reporte_Bitacoras", [authToken.verifyToken], ControllerApi.Get_Reporte_Bitacoras);
//router.post("/uploadImagesToCOSIP", [authToken.verifyToken],upload.single('fileToUpload'), ControllerApi.uploadImagesToCOSIP);
router.post("/uploadImagesToCOSIP", [authToken.verifyToken],upload.array('fileToUpload'), ControllerApi.uploadImagesToCOSIP);
module.exports = router;
