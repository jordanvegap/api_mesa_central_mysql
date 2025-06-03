const express = require('express');
const router = express.Router();
const authToken = require('../__utilitis/authToken');
const ControllerApi = require('./tokenjwt.controller');

router.post("/generarToken", [authToken.verifyToken], ControllerApi.generarToken);

module.exports = router;