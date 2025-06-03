const express = require('express');
const router = express.Router();
const authToken = require('../__utilitis/authToken');
const ControllerApi = require("./rh.controller");

router.get("/GetEmpleado", [authToken.verifyToken], ControllerApi.GetEmpleado);
router.post("/UpdatePrenomina", [authToken.verifyToken], ControllerApi.UpdatePrenomina);
router.post("/Insert_Empleado", [authToken.verifyToken], ControllerApi.Insert_Empleado);
router.post("/Update_Empleado", [authToken.verifyToken], ControllerApi.Update_Empleado);
router.get("/Get_Usuario", [authToken.verifyToken], ControllerApi.Get_Usuario);
router.post("/Insert_Usuario", [authToken.verifyToken], ControllerApi.Insert_Usuario);
router.post("/Update_Usuario", [authToken.verifyToken], ControllerApi.Update_Usuario);
router.post("/Insert_Mesa_Empleado", [authToken.verifyToken], ControllerApi.Insert_Mesa_Empleado);
router.post("/Del_Mesa_Empleado", [authToken.verifyToken], ControllerApi.Del_Mesa_Empleado);
router.get("/Get_Rh_Menu_Empleado", [authToken.verifyToken], ControllerApi.Get_Rh_Menu_Empleado);
router.post("/Insert_Rh_Menu_Empleado", [authToken.verifyToken], ControllerApi.Insert_Rh_Menu_Empleado);
router.post("/Del_Rh_Menu_Empleado", [authToken.verifyToken], ControllerApi.Del_Rh_Menu_Empleado);
router.get("/Busca_Reclutado", [authToken.verifyToken], ControllerApi.Busca_Reclutado);
router.get("/Valida_Reclutado", [authToken.verifyToken], ControllerApi.Valida_Reclutado);
router.get("/Get_Campania_Llega", [authToken.verifyToken], ControllerApi.Get_Campania_Llega);
router.post("/Insert_Empleado_Solicitud", [authToken.verifyToken], ControllerApi.Insert_Empleado_Solicitud);
router.post("/Update_Empleado_Solicitud", [authToken.verifyToken], ControllerApi.Update_Empleado_Solicitud);
router.post("/Insert_Empleado_Proceso_Detalle", [authToken.verifyToken], ControllerApi.Insert_Empleado_Proceso_Detalle);
router.post("/Update_Empleado_Proceso_Detalle", [authToken.verifyToken], ControllerApi.Update_Empleado_Proceso_Detalle);
router.get("/Get_Empleado_Proceso_Detalle", [authToken.verifyToken], ControllerApi.Get_Empleado_Proceso_Detalle);
router.post("/Insert_Empleados_Financial", [authToken.verifyToken], ControllerApi.Insert_Empleados_Financial);
router.post("/Update_Empleados_Financial", [authToken.verifyToken], ControllerApi.Update_Empleados_Financial);
router.get("/Get_Empleados_Financial", [authToken.verifyToken], ControllerApi.Get_Empleados_Financial);
router.post("/Insert_Empleado_Hijo", [authToken.verifyToken], ControllerApi.Insert_Empleado_Hijo);
router.post("/Update_Empleado_Hijo", [authToken.verifyToken], ControllerApi.Update_Empleado_Hijo);
router.get("/Get_Empleado_Hijos", [authToken.verifyToken], ControllerApi.Get_Empleado_Hijos);
router.post("/Insert_Empleado_Referencia", [authToken.verifyToken], ControllerApi.Insert_Empleado_Referencia);
router.post("/Update_Empleado_Referencia", [authToken.verifyToken], ControllerApi.Update_Empleado_Referencia);
router.get("/Get_Empleado_Referencias_Por_Tipo", [authToken.verifyToken], ControllerApi.Get_Empleado_Referencias_Por_Tipo);
router.post("/Insert_Empleado_Experiencia_Laboral", [authToken.verifyToken], ControllerApi.Insert_Empleado_Experiencia_Laboral);
router.post("/Update_Empleado_Experiencia_Laboral", [authToken.verifyToken], ControllerApi.Update_Empleado_Experiencia_Laboral);
router.get("/Get_Empleado_Experiencia_Laboral", [authToken.verifyToken], ControllerApi.Get_Empleado_Experiencia_Laboral);
router.post("/Insert_Empleado_Grado_Estudios", [authToken.verifyToken], ControllerApi.Insert_Empleado_Grado_Estudios);
router.post("/Update_Empleado_Grado_Estudios", [authToken.verifyToken], ControllerApi.Update_Empleado_Grado_Estudios);
router.get("/Get_Empleado_Grado_Estudios", [authToken.verifyToken], ControllerApi.Get_Empleado_Grado_Estudios);
router.post("/Insert_Bitacora_RH_Reclutamiento", [authToken.verifyToken], ControllerApi.Insert_Bitacora_RH_Reclutamiento);
router.post("/Update_Bitacora_RH_Reclutamiento", [authToken.verifyToken], ControllerApi.Update_Bitacora_RH_Reclutamiento);
router.get("/Get_Bitacora_RH_Reclutamiento", [authToken.verifyToken], ControllerApi.Get_Bitacora_RH_Reclutamiento);
router.post("/UpdateFinalizaBitacoraDateProceso", [authToken.verifyToken], ControllerApi.UpdateFinalizaBitacoraDateProceso);
router.get("/GetGdByEmp", [authToken.verifyToken], ControllerApi.GetGdByEmp);
router.get("/Get_Config_Proceso_Empleados", [authToken.verifyToken], ControllerApi.Get_Config_Proceso_Empleados);
router.post("/Insert_Agenda_Empleado", [authToken.verifyToken], ControllerApi.Insert_Agenda_Empleado);
router.post("/Update_Agenda_Empleado", [authToken.verifyToken], ControllerApi.Update_Agenda_Empleado);
router.get("/Get_Agenda_Empleado", [authToken.verifyToken], ControllerApi.Get_Agenda_Empleado);
router.get("/Get_Especific_Empleados_ById", [authToken.verifyToken], ControllerApi.Get_Especific_Empleados_ById);
router.get("/GetPermisosFirma", [authToken.verifyToken], ControllerApi.GetPermisosFirma);
router.post("/Put_Firma_Movil", [authToken.verifyToken], ControllerApi.Put_Firma_Movil);
router.get("/GetEmplCargo", [authToken.verifyToken], ControllerApi.GetEmplCargo);
router.get("/Get_Dashboard_Reclutamiento", [authToken.verifyToken], ControllerApi.Get_Dashboard_Reclutamiento);
router.post("/DeleteEmpleadoReferencia", [authToken.verifyToken], ControllerApi.DeleteEmpleadoReferencia);
router.post("/DeleteEmpleadoExperienciaLaboral", [authToken.verifyToken], ControllerApi.DeleteEmpleadoExperienciaLaboral);
router.post("/DeleteGradoEstudios", [authToken.verifyToken], ControllerApi.DeleteGradoEstudios);
router.post("/Insert_Mesa_Empleado_Genera", [authToken.verifyToken], ControllerApi.Insert_Mesa_Empleado_Genera);
router.post("/Del_Mesa_Empleado_Genera", [authToken.verifyToken], ControllerApi.Del_Mesa_Empleado_Genera);
router.get("/Get_Dashboard_Ingresos_Reclutamiento", [authToken.verifyToken], ControllerApi.Get_Dashboard_Ingresos_Reclutamiento);
router.get("/Get_Dashboard_Reclutamiento_General", [authToken.verifyToken], ControllerApi.Get_Dashboard_Reclutamiento_General);

router.get("/GetCatorcenaActual", [authToken.verifyToken], ControllerApi.GetCatorcenaActual);
router.get("/GetProgTrabajoEmpleado", [authToken.verifyToken], ControllerApi.GetProgTrabajoEmpleado);
router.get("/GetSupervisionEmpl", [authToken.verifyToken], ControllerApi.GetSupervisionEmpl);
router.get("/GetHeadCount_Resumen", [authToken.verifyToken], ControllerApi.GetHeadCount_Resumen);
router.get("/GetDataRh_Dashboard", [authToken.verifyToken], ControllerApi.GetDataRh_Dashboard);

router.get("/GetDataRh_Dashboard_Concentra", [authToken.verifyToken], ControllerApi.GetDataRh_Dashboard_Concentra);


router.get("/GetAgendas_Dashboard", [authToken.verifyToken], ControllerApi.GetAgendas_Dashboard);
router.get("/GetAgendas_Dashboard_V2", [authToken.verifyToken], ControllerApi.GetAgendas_Dashboard_V2);
router.get("/GetAgendas_Dashboard_Cita", [authToken.verifyToken], ControllerApi.GetAgendas_Dashboard_Cita);

router.get("/GetDataRhRotacionBajas_Dashboard", [authToken.verifyToken], ControllerApi.GetDataRhRotacionBajas_Dashboard);
router.get("/GetDataRhRotacionBajas_Dashboard_Concentra", [authToken.verifyToken], ControllerApi.GetDataRhRotacionBajas_Dashboard_Concentra);

router.post("/Insert_Empleado_Test_Medico", [authToken.verifyToken], ControllerApi.Insert_Empleado_Test_Medico);
router.post("/Update_Empleado_Test_Medico", [authToken.verifyToken], ControllerApi.Update_Empleado_Test_Medico);
router.get("/Get_Empleado_Test_Medico", [authToken.verifyToken], ControllerApi.Get_Empleado_Test_Medico);

router.get("/Get_Prenomina_Empleado_Vrt", [authToken.verifyToken], ControllerApi.Get_Prenomina_Empleado_Vrt);
router.post("/Update_PrenominaDinacEmpl", [authToken.verifyToken], ControllerApi.Update_PrenominaDinacEmpl);
router.get("/Get_Prenomina_empleado", [authToken.verifyToken], ControllerApi.Get_Prenomina_empleado);

router.post("/Insert_Imagen_Firma", [authToken.verifyToken], ControllerApi.Insert_Imagen_Firma);
router.get("/Get_Todo_Firmas_Dia", [authToken.verifyToken], ControllerApi.Get_Todo_Firmas_Dia);
router.get("/Get_Imagen_Firma_Dia", [authToken.verifyToken], ControllerApi.Get_Imagen_Firma_Dia);

//Reporte procesos e interacciones
router.get("/GetReporteEspecial", [authToken.verifyToken], ControllerApi.GetReporteEspecial);
router.get("/GetReporteBitacoras", [authToken.verifyToken], ControllerApi.GetReporteBitacoras);
router.get("/GetReporteAgendas", [authToken.verifyToken], ControllerApi.GetReporteAgendas);

router.get("/Get_Headcount_Autorizado_By_Empleado_Puesto", [authToken.verifyToken], ControllerApi.Get_Headcount_Autorizado_By_Empleado_Puesto);
router.post("/Update_Headcaunt_Autorizado", [authToken.verifyToken], ControllerApi.Update_Headcaunt_Autorizado);

//Reporte procesos e interacciones
router.get("/GetReporteEspecial", [authToken.verifyToken], ControllerApi.GetReporteEspecial);
router.get("/GetReporteBitacoras", [authToken.verifyToken], ControllerApi.GetReporteBitacoras);
router.get("/GetReporteAgendas", [authToken.verifyToken], ControllerApi.GetReporteAgendas);

router.get("/Get_Numero_Nomina_Consecutivo", [authToken.verifyToken], ControllerApi.Get_Numero_Nomina_Consecutivo);
router.post("/Insert_Asignacion_Folios", [authToken.verifyToken], ControllerApi.Insert_Asignacion_Folios);


//Dashboard Ausentismo
router.get("/Get_Dashboard_Ausentismo", [authToken.verifyToken], ControllerApi.Get_Dashboard_Ausentismo);


//Dashboard Ausentismo

router.get("/Get_Dash_Biometrico", [authToken.verifyToken], ControllerApi.Get_Dash_Biometrico);

router.get("/Get_Firma_Sistema_Empleado", [authToken.verifyToken], ControllerApi.Get_Firma_Sistema_Empleado);
router.post("/Update_Firma_Sistema_Empleado", [authToken.verifyToken], ControllerApi.Update_Firma_Sistema_Empleado);
router.post("/Inserta_Firma_Sistema_Empleado", [authToken.verifyToken], ControllerApi.Inserta_Firma_Sistema_Empleado);

router.get("/Get_Permisos_Reclutadoras", [authToken.verifyToken], ControllerApi.Get_Permisos_Reclutadoras);

router.get("/Get_Campanias_Tree_Select", [authToken.verifyToken], ControllerApi.Get_Campanias_Tree_Select);

router.get("/Get_Cam_Servicios_Empleado", [authToken.verifyToken], ControllerApi.Get_Cam_Servicios_Empleado);
router.post("/Insert_Cam_Servicio_Empleados", [authToken.verifyToken], ControllerApi.Insert_Cam_Servicio_Empleados);
router.post("/Delete_Cam_Servicio_Empleados", [authToken.verifyToken], ControllerApi.Delete_Cam_Servicio_Empleados);
router.post("/Update_Cam_Servicio_Empleados", [authToken.verifyToken], ControllerApi.Update_Cam_Servicio_Empleados);


router.get("/Get_Empleado_Horario_App", [authToken.verifyToken], ControllerApi.Get_Empleado_Horario_App);
router.post("/Insert_Empleado_Horario_App", [authToken.verifyToken], ControllerApi.Insert_Empleado_Horario_App);
router.post("/Update_Empleado_Horario_App", [authToken.verifyToken], ControllerApi.Update_Empleado_Horario_App);


router.get("/Get_Empleado_Jornada", [authToken.verifyToken], ControllerApi.Get_Empleado_Jornada);
router.post("/Insert_Empleado_Jornada", [authToken.verifyToken], ControllerApi.Insert_Empleado_Jornada);
router.post("/Update_Empleado_Jornada", [authToken.verifyToken], ControllerApi.Update_Empleado_Jornada);


router.get("/Get_Headcount_Autorizado_By_Clave_Estatus", [authToken.verifyToken], ControllerApi.Get_Headcount_Autorizado_By_Clave_Estatus);
router.post("/Delete_Headcaunt_Autorizado", [authToken.verifyToken], ControllerApi.Delete_Headcaunt_Autorizado);
router.post("/Insert_Headcount_Detalle", [authToken.verifyToken], ControllerApi.Insert_Headcount_Detalle);

router.post("/Insert_Empleado_Puestos_Anteriores", [authToken.verifyToken], ControllerApi.Insert_Empleado_Puestos_Anteriores);
router.get("/Get_Empleado_Puestos_Anteriores", [authToken.verifyToken], ControllerApi.Get_Empleado_Puestos_Anteriores);

router.post("/Insert_Empleado_Bitacora_Cliente", [authToken.verifyToken], ControllerApi.Insert_Empleado_Bitacora_Cliente);


router.post("/Update_Empleado_Path_Foto", [authToken.verifyToken], ControllerApi.Update_Empleado_Path_Foto);


router.get("/Get_Reporte_General_Empleados", [authToken.verifyToken], ControllerApi.Get_Reporte_General_Empleados);

module.exports = router;
