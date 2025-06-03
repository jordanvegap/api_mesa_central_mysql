const express = require('express');
const router = express.Router();
const authToken = require('../__utilitis/authToken');
const ControllerApi = require("./eq.controller");

router.get("/Get_Equipo", [authToken.verifyToken], ControllerApi.Get_Equipo);
router.post("/Insert_Equipo", [authToken.verifyToken], ControllerApi.Insert_Equipo);
router.post("/Update_Equipo", [authToken.verifyToken], ControllerApi.Update_Equipo);

router.get("/Get_ProdServicios", [authToken.verifyToken], ControllerApi.Get_ProdServicios);
router.get("/Get_Fotos", [authToken.verifyToken], ControllerApi.Get_Fotos);

router.get("/Get_ProdServiciosSPF", [authToken.verifyToken], ControllerApi.Get_ProdServiciosSPF);
router.get("/Get_DevengosSPF", [authToken.verifyToken], ControllerApi.Get_DevengosSPF);
router.post("/Update_SpDevengoSPF", [authToken.verifyToken], ControllerApi.Update_SpDevengoSPF);

//Inventarios
router.get("/Get_Sistema_Producto_Serv", [authToken.verifyToken], ControllerApi.Get_Sistema_Producto_Serv);
router.get("/Get_Inventario", [authToken.verifyToken], ControllerApi.Get_Inventario);

module.exports = router;
