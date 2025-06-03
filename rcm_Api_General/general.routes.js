const express = require('express');
const router = express.Router();
const authToken = require('../__utilitis/authToken');
const ControllerApi = require("./general.controller");

router.get("/Get_Cat", [authToken.verifyToken], ControllerApi.Get__Cat);
router.get("/Get_Cat_Full", [authToken.verifyToken], ControllerApi.Get__Cat__Full);
router.get("/Get_Cat_Whr", [authToken.verifyToken], ControllerApi.Get__Cat__Wrh);
router.get("/GetInfoEmpresa", [authToken.verifyToken], ControllerApi.GetInfoEmpresa);
router.get("/Login", [authToken.verifyToken], ControllerApi.LoginSistema);
router.get("/Get_Empleado", [authToken.verifyToken], ControllerApi.Get_Info_Empleado);
router.get("/Get_Empleado_Servicios", [authToken.verifyToken], ControllerApi.Get_Empleado_Servicios);
router.get("/Get_Empleado_Servicios_Full", [authToken.verifyToken], ControllerApi.Get_Empleado_Servicios_Full);
router.get("/Get_Tipificaciones_Servicio", [authToken.verifyToken], ControllerApi.Get_Tipificaciones_Servicio);
//router.get("/GetMnuMovil", [authToken.verifyToken], ControllerApi.Get_Menu_Movil_Usuario);
router.get("/GetMenuWebUsuario", [authToken.verifyToken], ControllerApi.GetMenuWebUsuario);
router.post("/Put_Archivos_General", [authToken.verifyToken], ControllerApi.Put_Archivos_General);
router.get("/Get_Archivos_General", [authToken.verifyToken], ControllerApi.Get_Archivos_General);
router.get("/CodificaPsw", [authToken.verifyToken], ControllerApi.CodificaPsw);

router.get("/GetMnuSistema", [authToken.verifyToken], ControllerApi.GetMnuSistema);
router.post("/Insert_Mnu_Sis_Emp", [authToken.verifyToken], ControllerApi.Insert_Mnu_Sis_Emp);
router.post("/Del_Mnu_Sis_Emp", [authToken.verifyToken], ControllerApi.Del_Mnu_Sis_Emp);

router.get("/Get_Paises_Adress", [authToken.verifyToken], ControllerApi.Get_Paises_Adress);
router.get("/Get_Estados_Adress", [authToken.verifyToken], ControllerApi.Get_Estados_Adress);
router.get("/Get_Municipios_Adress", [authToken.verifyToken], ControllerApi.Get_Municipios_Adress);
router.get("/Get_CP_Adress", [authToken.verifyToken], ControllerApi.Get_CP_Adress);
router.get("/Get_Colonias_Adress", [authToken.verifyToken], ControllerApi.Get_Colonias_Adress);

router.get("/Get_Country_Code", [authToken.verifyToken], ControllerApi.Get_Country_Code);
router.get("/Get_TimeZone_Country", [authToken.verifyToken], ControllerApi.Get_TimeZone_Country);

router.get("/Get_Menu_Web_Dashboar", [authToken.verifyToken], ControllerApi.Get_Menu_Web_Dashboar);
router.get("/getTreeCliProyCamp", [authToken.verifyToken], ControllerApi.getTreeCliProyCamp);

router.post("/reqChangePswd", [authToken.verifyToken], ControllerApi.reqChangePswd);
router.post("/updateChangePswd", [authToken.verifyToken], ControllerApi.updateChangePswd);

module.exports = router;