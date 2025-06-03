const dbConfig = require('../__utilitis/config.db.mysql');
const request = require('request');
var mysql = require('mysql2');
const recordFunction = require('../__utilitis/record.function');
function GetDate() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    return year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + (date)).slice(-2) + " " + ("0" + (hours)).slice(-2) + ':' + ("0" + (minutes)).slice(-2) + ':' + ("0" + (seconds)).slice(-2);
}
const jwt = require('jsonwebtoken');
const { sendMailNotification } = require('../mail/mail.controller');
exports.Get__Cat = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        var inputData = [
            req.query.Tbl,
            req.query.EMP_CSC_EMPRESA_HOST,
            req.query.NACTIVE
        ];

        query = "SELECT * FROM ?? WHERE EMP_CSC_EMPRESA_HOST = ? AND ?? = 1;";

        __Request_Pool.query(query, inputData, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get__Cat__Full = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = "SELECT * FROM ?? WHERE EMP_CSC_EMPRESA_HOST = ?;";

        var inputData = [
            req.query.Tbl,
            req.query.EMP_CSC_EMPRESA_HOST
        ];

        __Request_Pool.getConnection((err, connection) => {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.query(query, inputData, (err, resultReturn) => {
                if (err) {
                    ResultData = { success: false, message: err.message };
                    res.status(400);
                    res.send(ResultData);
                    console.log(ResultData);
                    let DataErr = {
                        Fecha: GetDate(),
                        Detalle: err
                    }
                    console.error(DataErr);
                    console.error(err.message);
                    return
                }

                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);
                }
                connection.release(function (error) {
                    if (error) {
                        console.error('Error al liberar la conexión:', error.message);
                    } else {
                        console.log('Conexión liberada correctamente.');
                    }
                });
            })
        })
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get__Cat__Wrh = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        var inputData = [
            req.query.Tbl,
            req.query.EMP_CSC_EMPRESA_HOST
        ];

        if (req.query.BYEMPRESA) {
            query = "SELECT * FROM ?? WHERE " + req.query.WHR + ";";
        } else {
            query = "SELECT * FROM ?? WHERE EMP_CSC_EMPRESA_HOST = ? AND " + req.query.WHR + ";";
        }



        __Request_Pool.query(query, inputData, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.GetInfoEmpresa = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT EMP_CSC_EMPRESA_HOST,TIPO_CSC_TIPO_EMPRESA_UNIVERSAL,EMP_CLV_EMPRESA,EMP_NOMBRE_CRTO,EMP_NOMBRE_COMPLETO,EMP_ACTIVA FROM SAMT_EMPRESA WHERE EMP_CLV_EMPRESA = ? AND EMP_ACTIVA=1;`

        __Request_Pool.query(query, [req.query.EMP_CLV_EMPRESA], function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}


exports.LoginSistema = async (req, res) => {
    try {
        let ret_psw = null;
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://cdn.dnasystem.io/fn/encode.php',
            body: "pswd=" + req.query.USU_PASSWORD
        }, function (err, response, body) {
            if (response.statusCode == 404) { result(response.statusCode, null); } else {
                let query = null;
                var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
                var inputData = [
                    req.query.USU_LOGIN,
                    body,
                    req.query.EMP_CSC_EMPRESA_HOST
                ];

                query = "SELECT EMP_CSC_EMPRESA_HOST,USU_CSC_USUARIO,EMPLEADO_CSC_EMPLEADO,USU_INDICAACTIVO,USU_CSCSYSUSER,USU_LOGIN,USU_CODESQUEMASEG,USU_FECHA_EXPIRA,USU_AUTENTIFICA_REMOTO,NEWID,USU_ACCESO_SITEMA,USU_FECHA_EXPIRA_LOGIN FROM SAMT_USUARIO WHERE USU_LOGIN = ? AND USU_PASSWORD= ? AND EMP_CSC_EMPRESA_HOST= ? AND USU_INDICAACTIVO = 1;";

                __Request_Pool.query(query, inputData, function (error, resultReturn, fields) {
                    if (error) {
                        ResultData = { success: false, message: error.message };
                        res.status(400);
                        res.send(ResultData);
                        console.log(ResultData);
                        let DataErr = {
                            Fecha: GetDate(),
                            Detalle: error
                        }
                        console.log(DataErr);
                    }
                    else {
                        if (resultReturn.length === 0) {
                            ResultData = { success: false, message: 'No Data Get' };
                            res.status(200);
                            res.send(ResultData);
                        } else {
                            // const usuario = {
                            //     claveEmpresa: req.query.EMP_CLV_EMPRESA,
                            //     typeCon: req.query.Type,
                            //     username: req.query.USU_LOGIN
                            // };
                            // const token = generarToken(usuario);
                            ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                            res.status(200);
                            res.send(ResultData);
                        }
                    }
                });

            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Info_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        var inputData = [
            req.query.EMPLEADO_CSC_EMPLEADO,
            req.query.EMP_CSC_EMPRESA_HOST
        ];

        query = "SELECT * FROM SAMT_EMPLEADOS WHERE EMPLEADO_CSC_EMPLEADO = ? AND EMP_CSC_EMPRESA_HOST = ?;";

        __Request_Pool.query(query, inputData, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Empleado_Servicios = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = "SELECT * FROM SAMT_CAM_SERVICIOS_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO) + ";";
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Empleado_Servicios_Full = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        if (req.query.USU_CODESQUEMASEG == 1) {
            query = "SELECT INFO_CLIENTE.CLIENTE_CSC,INFO_CLIENTE.CLIENTE_NOMBRE,INFO_PROY.PM_CSC_PROYECTO,INFO_PROY.PM_NOMBRE, INFO_CAMPA.CAM_CSC_SERVICIO ,INFO_CAMPA.CAM_SERVICIO_NOMBRE, INFO_CAMPA.TIPO_SERVICIO_CAM_CSC, INFO_CAMPA.CAM_TIPO_PERFIL, INFO_CAMPA.CAM_SERVICIO_CLAVE"
                + " FROM (SELECT SCM.EMP_CSC_EMPRESA_HOST, SCM.CAM_CSC_SERVICIO, SCM.CAM_SERVICIO_NOMBRE, SCM.CAM_ACTIVA, SCM.PM_CSC_PROYECTO, SCM.TIPO_SERVICIO_CAM_CSC, SCM.CAM_TIPO_PERFIL, SCM.CAM_SERVICIO_CLAVE FROM SAMT_CAM_SERVICIO SCM) INFO_CAMPA "
                + " JOIN(SELECT PROYECTO.EMP_CSC_EMPRESA_HOST, PROYECTO.PM_NOMBRE, PROYECTO.CLIENTE_CSC, PROYECTO.PM_CSC_PROYECTO FROM SAMT_PROYECTOS AS PROYECTO) INFO_PROY ON INFO_PROY.PM_CSC_PROYECTO = INFO_CAMPA.PM_CSC_PROYECTO AND INFO_PROY.EMP_CSC_EMPRESA_HOST = INFO_CAMPA.EMP_CSC_EMPRESA_HOST"
                + " JOIN(SELECT CLIENTE.EMP_CSC_EMPRESA_HOST, CLIENTE.CLIENTE_NOMBRE, CLIENTE.CLIENTE_CSC FROM SAMT_CLIENTES AS CLIENTE) INFO_CLIENTE ON INFO_CLIENTE.CLIENTE_CSC = INFO_PROY.CLIENTE_CSC AND INFO_CLIENTE.EMP_CSC_EMPRESA_HOST = INFO_PROY.EMP_CSC_EMPRESA_HOST"
                + " WHERE INFO_CAMPA.CAM_ACTIVA = 1 AND INFO_CAMPA.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY INFO_CLIENTE.CLIENTE_NOMBRE ASC, INFO_PROY.PM_NOMBRE ASC, INFO_CAMPA.CAM_SERVICIO_NOMBRE ASC;";
        } else if (req.query.USU_CODESQUEMASEG == 2) {
            2
            query = "SELECT INFO_CLIENTE.CLIENTE_CSC,INFO_CLIENTE.CLIENTE_NOMBRE,INFO_PROY.PM_CSC_PROYECTO,INFO_PROY.PM_NOMBRE,CAMPA_EMPLEADO.CAM_CSC_SERVICIO,INFO_CAMPA.CAM_SERVICIO_NOMBRE, INFO_CAMPA.TIPO_SERVICIO_CAM_CSC, INFO_CAMPA.CAM_TIPO_PERFIL, INFO_CAMPA.CAM_SERVICIO_CLAVE"
                + " FROM (SELECT CSEM.* FROM SAMT_CAM_SERVICIOS_EMPLEADOS AS CSEM) CAMPA_EMPLEADO"
                + " JOIN(SELECT SCM.EMP_CSC_EMPRESA_HOST, SCM.CAM_CSC_SERVICIO, SCM.CAM_SERVICIO_NOMBRE, SCM.CAM_ACTIVA, SCM.PM_CSC_PROYECTO, SCM.TIPO_SERVICIO_CAM_CSC, SCM.CAM_TIPO_PERFIL, SCM.CAM_SERVICIO_CLAVE FROM SAMT_CAM_SERVICIO SCM) INFO_CAMPA ON INFO_CAMPA.CAM_CSC_SERVICIO = CAMPA_EMPLEADO.CAM_CSC_SERVICIO AND INFO_CAMPA.EMP_CSC_EMPRESA_HOST = CAMPA_EMPLEADO.EMP_CSC_EMPRESA_HOST"
                + " JOIN(SELECT PROYECTO.EMP_CSC_EMPRESA_HOST, PROYECTO.PM_NOMBRE, PROYECTO.CLIENTE_CSC, PROYECTO.PM_CSC_PROYECTO FROM SAMT_PROYECTOS AS PROYECTO) INFO_PROY ON INFO_PROY.PM_CSC_PROYECTO = INFO_CAMPA.PM_CSC_PROYECTO AND INFO_PROY.EMP_CSC_EMPRESA_HOST = INFO_CAMPA.EMP_CSC_EMPRESA_HOST"
                + " JOIN(SELECT CLIENTE.EMP_CSC_EMPRESA_HOST, CLIENTE.CLIENTE_NOMBRE, CLIENTE.CLIENTE_CSC FROM SAMT_CLIENTES AS CLIENTE) INFO_CLIENTE ON INFO_CLIENTE.CLIENTE_CSC = INFO_PROY.CLIENTE_CSC AND INFO_CLIENTE.EMP_CSC_EMPRESA_HOST = INFO_PROY.EMP_CSC_EMPRESA_HOST"
                + " WHERE CAMPA_EMPLEADO.EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO) + " AND INFO_CAMPA.CAM_ACTIVA = 1 AND CAMPA_EMPLEADO.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY INFO_CLIENTE.CLIENTE_NOMBRE ASC, INFO_PROY.PM_NOMBRE ASC, INFO_CAMPA.CAM_SERVICIO_NOMBRE ASC;";
        } else if (req.query.USU_CODESQUEMASEG == 3) {
            2
            query = "SELECT INFO_CLIENTE.CLIENTE_CSC,INFO_CLIENTE.CLIENTE_NOMBRE,INFO_PROY.PM_CSC_PROYECTO,INFO_PROY.PM_NOMBRE,CAMPA_EMPLEADO.CAM_CSC_SERVICIO,INFO_CAMPA.CAM_SERVICIO_NOMBRE,INFO_CAMPA.TIPO_SERVICIO_CAM_CSC, INFO_CAMPA.CAM_TIPO_PERFIL, INFO_CAMPA.CAM_SERVICIO_CLAVE "
                + " FROM (SELECT CSEM.* FROM SAMT_CAM_SERVICIOS_EMPLEADOS AS CSEM) CAMPA_EMPLEADO"
                + " JOIN(SELECT SCM.EMP_CSC_EMPRESA_HOST, SCM.CAM_CSC_SERVICIO, SCM.CAM_SERVICIO_NOMBRE, SCM.CAM_ACTIVA, SCM.PM_CSC_PROYECTO, SCM.TIPO_SERVICIO_CAM_CSC, SCM.CAM_TIPO_PERFIL, SCM.CAM_SERVICIO_CLAVE FROM SAMT_CAM_SERVICIO SCM) INFO_CAMPA ON INFO_CAMPA.CAM_CSC_SERVICIO = CAMPA_EMPLEADO.CAM_CSC_SERVICIO AND INFO_CAMPA.EMP_CSC_EMPRESA_HOST = CAMPA_EMPLEADO.EMP_CSC_EMPRESA_HOST"
                + " JOIN(SELECT PROYECTO.EMP_CSC_EMPRESA_HOST, PROYECTO.PM_NOMBRE, PROYECTO.CLIENTE_CSC, PROYECTO.PM_CSC_PROYECTO FROM SAMT_PROYECTOS AS PROYECTO) INFO_PROY ON INFO_PROY.PM_CSC_PROYECTO = INFO_CAMPA.PM_CSC_PROYECTO AND INFO_PROY.EMP_CSC_EMPRESA_HOST = INFO_CAMPA.EMP_CSC_EMPRESA_HOST"
                + " JOIN(SELECT CLIENTE.EMP_CSC_EMPRESA_HOST, CLIENTE.CLIENTE_NOMBRE, CLIENTE.CLIENTE_CSC FROM SAMT_CLIENTES AS CLIENTE) INFO_CLIENTE ON INFO_CLIENTE.CLIENTE_CSC = INFO_PROY.CLIENTE_CSC AND INFO_CLIENTE.EMP_CSC_EMPRESA_HOST = INFO_PROY.EMP_CSC_EMPRESA_HOST"
                + " WHERE CAMPA_EMPLEADO.EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO) + " AND INFO_CAMPA.CAM_ACTIVA = 1 AND CAMPA_EMPLEADO.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY INFO_CLIENTE.CLIENTE_NOMBRE ASC, INFO_PROY.PM_NOMBRE ASC, INFO_CAMPA.CAM_SERVICIO_NOMBRE ASC;";
        } else if (req.query.USU_CODESQUEMASEG == 100) {
            query = "SELECT INFO_CLIENTE.CLIENTE_CSC,INFO_CLIENTE.CLIENTE_NOMBRE,INFO_PROY.PM_CSC_PROYECTO,INFO_PROY.PM_NOMBRE, INFO_CAMPA.CAM_CSC_SERVICIO ,INFO_CAMPA.CAM_SERVICIO_NOMBRE, INFO_CAMPA.TIPO_SERVICIO_CAM_CSC, INFO_CAMPA.CAM_TIPO_PERFIL, INFO_CAMPA.CAM_SERVICIO_CLAVE, INFO_CAMPA.CAM_SERVICIO_CLAVE"
                + " FROM (SELECT SCM.EMP_CSC_EMPRESA_HOST, SCM.CAM_CSC_SERVICIO, SCM.CAM_SERVICIO_NOMBRE, SCM.CAM_ACTIVA, SCM.PM_CSC_PROYECTO, SCM.TIPO_SERVICIO_CAM_CSC, SCM.CAM_TIPO_PERFIL, SCM.CAM_SERVICIO_CLAVE  FROM SAMT_CAM_SERVICIO SCM) INFO_CAMPA "
                + " JOIN(SELECT PROYECTO.EMP_CSC_EMPRESA_HOST, PROYECTO.PM_NOMBRE, PROYECTO.CLIENTE_CSC, PROYECTO.PM_CSC_PROYECTO FROM SAMT_PROYECTOS AS PROYECTO) INFO_PROY ON INFO_PROY.PM_CSC_PROYECTO = INFO_CAMPA.PM_CSC_PROYECTO AND INFO_PROY.EMP_CSC_EMPRESA_HOST = INFO_CAMPA.EMP_CSC_EMPRESA_HOST"
                + " JOIN(SELECT CLIENTE.EMP_CSC_EMPRESA_HOST, CLIENTE.CLIENTE_NOMBRE, CLIENTE.CLIENTE_CSC FROM SAMT_CLIENTES AS CLIENTE) INFO_CLIENTE ON INFO_CLIENTE.CLIENTE_CSC = INFO_PROY.CLIENTE_CSC AND INFO_CLIENTE.EMP_CSC_EMPRESA_HOST = INFO_PROY.EMP_CSC_EMPRESA_HOST"
                + " WHERE INFO_CAMPA.CAM_ACTIVA = 1 AND INFO_CAMPA.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY INFO_CLIENTE.CLIENTE_NOMBRE ASC, INFO_PROY.PM_NOMBRE ASC, INFO_CAMPA.CAM_SERVICIO_NOMBRE ASC;";
        }

        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Tipificaciones_Servicio = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.CAM_CSC_SERVICIO == 1) {
            query = "SELECT * FROM SAMT_CAM_SERVICIO_VIDEO_LLAMADA AS VDS_LLAMADA " +
                "INNER JOIN SAMT_CAM_TIPIFICACIONES AS TIPIFICACIONES ON TIPIFICACIONES.CAT_TIPO_TIPIFICA_CSC = VDS_LLAMADA.CAT_TIPO_TIPIFICA_CSC AND TIPIFICACIONES.EMP_CSC_EMPRESA_HOST = VDS_LLAMADA.EMP_CSC_EMPRESA_HOST " +
                "WHERE VDS_LLAMADA.CAM_CSC_SERVICIO = " + __Request_Pool.escape(req.query.CAM_CSC_SERVICIO) + " AND VDS_LLAMADA.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY TIPIFICACIONES.TIPIFICA_IDIOMA1 ASC;";
        } else {
            if (req.query.TIPO_SERVICIO == "CALL_INBUND") {
                query = "SELECT TIPIFICACIONES.* FROM SAMT_CAM_SERVICIO AS CAM_SERVICIO " +
                    " INNER JOIN SAMT_CAM_TIPIFICACIONES AS TIPIFICACIONES ON TIPIFICACIONES.SAMT_CAM_TIPO_TIPIFICA_CSC = CAM_SERVICIO.TIPIFICA_CSC AND TIPIFICACIONES.EMP_CSC_EMPRESA_HOST = CAM_SERVICIO.EMP_CSC_EMPRESA_HOST " +
                    " WHERE CAM_SERVICIO.CAM_CSC_SERVICIO = " + __Request_Pool.escape(req.query.CAM_CSC_SERVICIO) + " AND CAM_SERVICIO.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY TIPIFICACIONES.TIPIFICA_IDIOMA1 ASC;";
            } else {
                query = "SELECT * FROM SAMT_CAM_SERVICIO_VIDEO_LLAMADA AS VDS_LLAMADA " +
                    "INNER JOIN SAMT_CAM_TIPIFICACIONES AS TIPIFICACIONES ON TIPIFICACIONES.CAT_TIPO_TIPIFICA_CSC = VDS_LLAMADA.CAT_TIPO_TIPIFICA_CSC AND TIPIFICACIONES.EMP_CSC_EMPRESA_HOST = VDS_LLAMADA.EMP_CSC_EMPRESA_HOST " +
                    "WHERE VDS_LLAMADA.CAM_CSC_SERVICIO = " + __Request_Pool.escape(req.query.CAM_CSC_SERVICIO) + " AND VDS_LLAMADA.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " ORDER BY TIPIFICACIONES.TIPIFICA_IDIOMA1 ASC;";
            }
        }

        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Menu_Movil_Usuario = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.USU_CODESQUEMASEG == 1) {
            query = "SELECT MNU.MNU_CSC_MENU_PADRE" +
                ",MNU.MNU_CSC_MENU" +
                ",MNU.MNU_DESCRIPCION1" +
                ",MNU.MNU_IMAGEN_GRANDE_ACTIVO,MNU.MNU_IMAGEN_PEQUENIA_ACTIVO" +
                ",MNU.MNU_MOVIL_ACTIVO,MNU.MNU_MOVIL_ARCHIVO, MNU_MOVIL_NAMESPACE " +
                "FROM SAMT_MENU AS MNU " +
                "WHERE MNU.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND MNU.TIPO_MENU_CSC = 4 AND MNU.MNU_MOVIL_ACTIVO = 1 ORDER BY MNU.MNU_ORDEN ASC;";
        } else if (req.query.USU_CODESQUEMASEG == 2) {
            query = "SELECT MNU.MNU_CSC_MENU_PADRE" +
                ",MNU.MNU_CSC_MENU" +
                ",MNU.MNU_DESCRIPCION1" +
                ",MNU.MNU_IMAGEN_GRANDE_ACTIVO,MNU.MNU_IMAGEN_PEQUENIA_ACTIVO" +
                ",MNU.MNU_MOVIL_ACTIVO,MNU.MNU_MOVIL_ARCHIVO, MNU_MOVIL_NAMESPACE" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACONSULTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAALTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICABAJA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACAMBIO" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAAUTSTATUS " +
                "FROM SAMT_SEG_EMPRES_SUBMENU_INMUEBLE AS MNU_EMP " +
                "INNER JOIN SAMT_MENU AS MNU ON MNU.MNU_CSC_MENU = MNU_EMP.MNU_CSC_MENU " +
                "WHERE MNU_EMP.USU_CSC_USUARIO = " + __Request_Pool.escape(req.query.USU_CSC_USUARIO) + " AND MNU_EMP.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND MNU.TIPO_MENU_CSC = 4 AND MNU.MNU_MOVIL_ACTIVO = 1 ORDER BY MNU.MNU_ORDEN ASC";
        } else if (req.query.USU_CODESQUEMASEG == 3) {
            query = "SELECT MNU.MNU_CSC_MENU_PADRE" +
                ",MNU.MNU_CSC_MENU" +
                ",MNU.MNU_DESCRIPCION1" +
                ",MNU.MNU_IMAGEN_GRANDE_ACTIVO,MNU.MNU_IMAGEN_PEQUENIA_ACTIVO" +
                ",MNU.MNU_MOVIL_ACTIVO,MNU.MNU_MOVIL_ARCHIVO, MNU_MOVIL_NAMESPACE" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACONSULTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAALTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICABAJA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACAMBIO" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAAUTSTATUS " +
                "FROM SAMT_SEG_EMPRESA_SUB_MENU AS MNU_EMP " +
                "INNER JOIN SAMT_MENU AS MNU ON MNU.MNU_CSC_MENU = MNU_EMP.MNU_CSC_MENU " +
                "WHERE MNU_EMP.USU_CSC_USUARIO = " + __Request_Pool.escape(req.query.USU_CSC_USUARIO) + " AND MNU_EMP.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND MNU.TIPO_MENU_CSC = 4 AND MNU.MNU_MOVIL_ACTIVO = 1 ORDER BY MNU.MNU_ORDEN ASC";
        }

        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.GetMenuWebUsuario = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.USU_CODESQUEMASEG == 1) {
            query = "SELECT MNU.MNU_CSC_MENU_PADRE" +
                ",MNU.MNU_CSC_MENU" +
                ",MNU.MNU_DESCRIPCION1" +
                ",MNU.TIPO_MENU_CSC" +
                ",MNU.MNU_IMAGEN_GRANDE_ACTIVO,MNU.MNU_IMAGEN_PEQUENIA_ACTIVO" +
                ",MNU.MNU_ACTIVO_WEB,MNU.MNU_WEB_ARCHIVO, MNU.MNU_WEB_NAMESPACE " +
                "FROM SAMT_MENU AS MNU " +
                "WHERE MNU.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND MNU.MNU_ACTIVO_WEB = 1 ORDER BY MNU.MNU_ORDEN ASC;";
        } else if (req.query.USU_CODESQUEMASEG == 2) {
            query = "SELECT MNU.MNU_CSC_MENU_PADRE" +
                ",MNU.MNU_CSC_MENU" +
                ",MNU.MNU_DESCRIPCION1" +
                ",MNU.TIPO_MENU_CSC" +
                ",MNU.MNU_IMAGEN_GRANDE_ACTIVO,MNU.MNU_IMAGEN_PEQUENIA_ACTIVO" +
                ",MNU.MNU_ACTIVO_WEB,MNU.MNU_WEB_ARCHIVO, MNU.MNU_WEB_NAMESPACE" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACONSULTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAALTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICABAJA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACAMBIO" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAAUTSTATUS " +
                "FROM SAMT_SEG_EMPRES_SUBMENU_INMUEBLE AS MNU_EMP " +
                "INNER JOIN SAMT_MENU AS MNU ON MNU.MNU_CSC_MENU = MNU_EMP.MNU_CSC_MENU " +
                "WHERE MNU_EMP.USU_CSC_USUARIO = " + __Request_Pool.escape(req.query.USU_CSC_USUARIO) + " AND MNU_EMP.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND MNU.MNU_ACTIVO_WEB = 1 ORDER BY MNU.MNU_ORDEN ASC";
        } else if (req.query.USU_CODESQUEMASEG == 3) {
            query = "SELECT MNU.MNU_CSC_MENU_PADRE" +
                ",MNU.MNU_CSC_MENU" +
                ",MNU.MNU_DESCRIPCION1" +
                ",MNU.TIPO_MENU_CSC" +
                ",MNU.MNU_IMAGEN_GRANDE_ACTIVO,MNU.MNU_IMAGEN_PEQUENIA_ACTIVO" +
                ",MNU.MNU_ACTIVO_WEB,MNU.MNU_WEB_ARCHIVO, MNU.MNU_WEB_NAMESPACE" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACONSULTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAALTA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICABAJA" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICACAMBIO" +
                ",MNU_EMP.ESQ_SEG_MENU_INDICAAUTSTATUS " +
                "FROM SAMT_SEG_EMPRESA_SUB_MENU AS MNU_EMP " +
                "INNER JOIN SAMT_MENU AS MNU ON MNU.MNU_CSC_MENU = MNU_EMP.MNU_CSC_MENU " +
                "WHERE MNU_EMP.USU_CSC_USUARIO = " + __Request_Pool.escape(req.query.USU_CSC_USUARIO) + " AND MNU_EMP.EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND MNU.MNU_ACTIVO_WEB = 1 ORDER BY MNU.MNU_ORDEN ASC";
        } else if (req.query.USU_CODESQUEMASEG == "SEGMENU") {
            query = `SELECT EM_MNU.*, SAMT_MENU.MNU_DESCRIPCION1 FROM SAMT_SEG_EMPRESA_SUB_MENU  AS EM_MNU
            INNER JOIN SAMT_MENU ON SAMT_MENU.MNU_CSC_MENU = EM_MNU.MNU_CSC_MENU AND SAMT_MENU.EMP_CSC_EMPRESA_HOST = EM_MNU.EMP_CSC_EMPRESA_HOST
            WHERE EM_MNU.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EM_MNU.USU_CSC_USUARIO = ${__Request_Pool.escape(req.query.USU_CSC_USUARIO)};`;
        }

        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Put_Archivos_General = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var CURRENT_TIMESTAMP = mysql.raw('CURRENT_TIMESTAMP()');
        var DataInsert = {
            EMP_CSC_EMPRESA_HOST: req.body.EMP_CSC_EMPRESA_HOST,
            REQ_CSCREQUISICION: req.body.REQ_CSCREQUISICION,
            INM_CSCINMUEBLE: req.body.INM_CSCINMUEBLE,
            FOTO_CSC_EXTERNO: req.body.FOTO_CSC_EXTERNO,
            TIPO_ORIGEN_CSC: req.body.TIPO_ORIGEN_CSC,
            FOTO_IMAGEN_RUTA: req.body.FOTO_IMAGEN_RUTA,
            FOTO_IMAGEN_URL: req.body.FOTO_IMAGEN_URL,
            FOTO_FECHA_ALTA: req.body.FOTO_FECHA_ALTA,
            FOTO_NUMERO_FOTO: req.body.FOTO_NUMERO_FOTO,
            FOTO_DESCRIPCION: req.body.FOTO_DESCRIPCION,
            FOTO_ACTIVO: req.body.FOTO_ACTIVO,
            AUDITORIA_USU_ALTA: req.body.EMPLEADO_CSC_EMPLEADO,
            AUDITORIA_USU_ULT_MOD: req.body.EMPLEADO_CSC_EMPLEADO,
            AUDITORIA_FEC_ALTA: req.body.FOTO_FECHA_ALTA,
            AUDITORIA_FEC_ULT_MOD: req.body.FOTO_FECHA_ALTA
        }
        var query = "INSERT INTO SAMT_FOTO_GENERAL SET ?";

        __Request_Pool.query(query, DataInsert, function (error, resultReturn) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
                    res.status(200);
                    res.send(ResultData);

                }

            }
        });

    } catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};


exports.Get_Archivos_General = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = "SELECT * FROM SAMT_FOTO_GENERAL WHERE EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + " AND TIPO_ORIGEN_CSC = " + __Request_Pool.escape(req.query.TIPO_ORIGEN_CSC) + " AND FOTO_ACTIVO = 1 AND FOTO_CSC_EXTERNO=" + __Request_Pool.escape(req.query.FOTO_CSC_EXTERNO) + ";";

        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}


exports.Get_Tipificaciones_Mesa = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        var inputData = [
            req.query.EMP_CSC_EMPRESA_HOST,
            req.query.CAM_MESA_CSC
        ];

        query = "SELECT MS.EMP_CSC_EMPRESA_HOST,MS.CAM_MESA_CSC,MS.CAT_TIPO_TIPIFICA_CSC,CAM_MESA_IDIOMA1,TPOTIPI.CAT_TIPO_TIPIFICA_CSC,TIPIFICACION.* FROM SAMT_CAM_MESA_DE_AYUDA AS MS "
            + " INNER JOIN SAMT_CAT_TIPO_TIPIFICACIONES AS TPOTIPI ON TPOTIPI.CAT_TIPO_TIPIFICA_CSC = MS.CAT_TIPO_TIPIFICA_CSC AND TPOTIPI.EMP_CSC_EMPRESA_HOST = MS.EMP_CSC_EMPRESA_HOST "
            + " INNER JOIN SAMT_CAM_TIPIFICACIONES AS TIPIFICACION ON TIPIFICACION.CAT_TIPO_TIPIFICA_CSC =  MS.CAT_TIPO_TIPIFICA_CSC AND TIPIFICACION.EMP_CSC_EMPRESA_HOST  = MS.EMP_CSC_EMPRESA_HOST "
            + " WHERE MS.EMP_CSC_EMPRESA_HOST = ? AND MS.CAM_MESA_CSC = ? AND TIPIFICACION.TIPIFCA_ACTIVO = 1;";

        __Request_Pool.query(query, inputData, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}


exports.CodificaPsw = async (req, res) => {
    try {
        let ret_psw = null;
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://cdn.dnasystem.io/fn/encode.php',
            body: "pswd=" + req.query.USU_PASSWORD
        }, function (err, response, body) {
            if (response.statusCode == 404) {
                ResultData = { success: false, message: 'Error Codifica', count: 0, JsonData: null };
                res.status(200);
                res.send(ResultData);
            }
            else {
                ResultData = { success: true, message: 'Success Data Get', count: 1, JsonData: body };
                res.status(200);
                res.send(ResultData);
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}


exports.GetMnuSistema = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT * FROM SAMT_MENU AS MNU WHERE MNU.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

        if (req.query.MNU_ACTIVO_WEB) {
            query += " AND MNU.MNU_ACTIVO_WEB = " + __Request_Pool.escape(req.query.MNU_ACTIVO_WEB);
        }
        if (req.query.MNU_ACTIVO) {
            query += " AND MNU.MNU_ACTIVO = " + __Request_Pool.escape(req.query.MNU_ACTIVO);
        }
        if (req.query.MNU_MOVIL_ACTIVO) {
            query += " AND MNU.MNU_MOVIL_ACTIVO = " + __Request_Pool.escape(req.query.MNU_MOVIL_ACTIVO);
        }
        query += " ORDER BY MNU.MNU_ORDEN ASC;--";
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Insert_Mnu_Sis_Emp = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_SEG_EMPRESA_SUB_MENU SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
                    res.status(200);
                    res.send(ResultData);

                }

            }
        });
    } catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.Del_Mnu_Sis_Emp = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var d1 = __Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST);
        var d2 = __Request_Pool.escape(req.body.USU_CSC_USUARIO);
        var d3 = __Request_Pool.escape(req.body.MNU_CSC_MENU);

        var query = "DELETE FROM SAMT_SEG_EMPRESA_SUB_MENU WHERE EMP_CSC_EMPRESA_HOST = ? AND USU_CSC_USUARIO = ? AND MNU_CSC_MENU = ?";
        __Request_Pool.query(query, [d1, d2, d3], function (error, resultReturn) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
                    res.status(200);
                    res.send(ResultData);

                }

            }
        });
    } catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.Get_Paises_Adress = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT * FROM SAMT_PAISES;`;
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Estados_Adress = async (req, res) => {
    try {
        var query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT * FROM SAMT_ESTADOS`;
        if (req.query.PAI_CSCPAIS) {
            query += " WHERE PAI_CSCPAIS = " + __Request_Pool.escape(req.query.PAI_CSCPAIS);
        }
        query += " ORDER BY EDO_DESCESTADO ASC;";
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Municipios_Adress = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT * FROM SAMT_MUNICIPIOS`;
        if (req.query.EDO_CSCESTADO) {
            query += " WHERE EDO_CSCESTADO = " + __Request_Pool.escape(req.query.EDO_CSCESTADO);
        }
        query += " ORDER BY MPO_DESCMUNICIPIO ASC;--";
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_CP_Adress = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT * FROM XPV_DIRECCIONES`;
        if (req.query.SFP_SOLICITUD_CP) {
            query += " WHERE CP = " + __Request_Pool.escape(req.query.SFP_SOLICITUD_CP) + ";--";
        };
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_Colonias_Adress = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT * FROM SAMT_COLONIAS`;
        if (req.query.SFP_SOLICITUD_MUNICIPIO) {
            query += " WHERE MPO_CSCMUNICIPIO = " + __Request_Pool.escape(req.query.SFP_SOLICITUD_MUNICIPIO) + ";--";
        };
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}



exports.Get_Country_Code = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT country_code, country_name, PAI_CSCPAIS_DNA FROM COUNTRY WHERE country_activo = true ORDER BY country_name ASC;`;
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.Get_TimeZone_Country = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion('ADRESS', req.query.Type);
        query = `SELECT * FROM TIME_ZONE_COUNTRY;`;
        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}




exports.Get_Menu_Web_Dashboar = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT 
        MNU_CSC_MENU
        ,TIPO_MENU_CSC
        ,MNU_DESCRIPCION1
        ,MNU_DESCRIPCION2
        ,MNU_ACTIVO_WEB
        ,MNU_WEB_ARCHIVO
        ,MNU_WEB_NAMESPACE
        ,MNU_IMAGEN_GRANDE_ACTIVO

        FROM SAMT_MENU

        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND TIPO_MENU_CSC = ${__Request_Pool.escape(req.query.TIPO_MENU_CSC)}
        AND MNU_CVEMENU = ${__Request_Pool.escape(req.query.MNU_CVEMENU)} 
        
        ORDER BY MNU_ORDEN ASC, MNU_DESCRIPCION1 ASC `;



        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.getTreeCliProyCamp = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT SAMT_CLIENTES.CLIENTE_CSC
                ,SAMT_CLIENTES.CLIENTE_NOMBRE
                ,SAMT_PROYECTOS.PM_CSC_PROYECTO
                ,SAMT_PROYECTOS.PM_NOMBRE
                ,SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO
                ,SAMT_CAM_SERVICIO.CAM_SERVICIO_NOMBRE
                ,SAMT_CAM_SERVICIO.CAM_SERVICIO_CLAVE 
                FROM SAMT_CAM_SERVICIO
                INNER JOIN SAMT_PROYECTOS
                ON SAMT_CAM_SERVICIO.EMP_CSC_EMPRESA_HOST = SAMT_PROYECTOS.EMP_CSC_EMPRESA_HOST
                AND SAMT_CAM_SERVICIO.PM_CSC_PROYECTO = SAMT_PROYECTOS.PM_CSC_PROYECTO
                INNER JOIN SAMT_CLIENTES
                ON SAMT_PROYECTOS.EMP_CSC_EMPRESA_HOST = SAMT_CLIENTES.EMP_CSC_EMPRESA_HOST
                AND SAMT_PROYECTOS.CLIENTE_CSC = SAMT_CLIENTES.CLIENTE_CSC
                WHERE SAMT_CAM_SERVICIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND SAMT_CAM_SERVICIO.CAM_ACTIVA = 1 AND SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO IN ( SELECT CAM_CSC_SERVICIO  FROM SAMT_CAM_SERVICIOS_EMPLEADOS WHERE EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)});`

        __Request_Pool.query(query, function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error.originalError
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.reqChangePswd = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        let tokenTemp = "";
        query = `SELECT SAMT_USUARIO.EMPLEADO_CSC_EMPLEADO,SAMT_USUARIO.NEWID, SAMT_USUARIO.USU_CSC_USUARIO, SAMT_EMPLEADOS.EMPLEADO_EMAILLABORAL
FROM SAMT_USUARIO
INNER JOIN SAMT_EMPLEADOS ON SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SAMT_USUARIO.EMPLEADO_CSC_EMPLEADO AND SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_USUARIO.EMP_CSC_EMPRESA_HOST 
WHERE SAMT_USUARIO.EMP_CSC_EMPRESA_HOST = ? AND SAMT_USUARIO.USU_INDICAACTIVO=1 AND SAMT_USUARIO.USU_LOGIN = ?;`

        __Request_Pool.query(query, [req.body.EMP_CSC_EMPRESA_HOST, req.body.USU_LOGIN], async function (error, resultReturn, fields) {
            if (error) {
                ResultData = { success: false, message: error.message };
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else {
                if (resultReturn.length === 0) {
                    ResultData = { success: true, message: 'Success Data Get' };
                    res.status(200);
                    res.send(ResultData);
                } else {

                    let tokenGeneration = '';
                    let urlSystem = 'https://mesacentral.anam.gob.mx/mdi/changePassword.html?idTokenSystem='
                    tokenTemp = jwt.sign(resultReturn[0], 'dqiudui874uib4bui4ruhu', { expiresIn: '1d' });
                    const html_content_send = `<p>Hola, por favor ingrese a la siguiente URL para continuar con el proceso de cambio de contraseña: </p> 
                    <a href="${urlSystem}${tokenTemp}" target="_blank">
                        CAMBIAR CONTRASEÑA
                    </a>

                    <p style='font-size: 12px;'>En caso de que el boton no haga alguna acción copia y pega el siguiente link en el navegador</p>
                    <p style='font-size: 14px;'>${urlSystem}${tokenTemp}</p>`
                    const emailSent = await sendMailNotification(resultReturn[0].EMPLEADO_EMAILLABORAL, 'Cambio de contraseña', html_content_send);

                    ResultData = { success: true, message: 'Success Data Get' };
                    res.status(200);
                    res.send(ResultData);

                }
            }
        });


    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
}

exports.updateChangePswd = async (req, res) => {
    try {
        const token = req.body.TokenSystem;
        if (!token) {
            return res.status(401).send('Token no proporcionado');
        }
        let __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        jwt.verify(token, 'dqiudui874uib4bui4ruhu', async (err, decoded) => {
            if (err) {

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: 'El token ha expirado. Por favor, inicie sesión nuevamente.',
                        internalCode: 'expInternal'
                    });
                }

                ResultData = { success: false, message: 'Ocurrió un error, contacte a su administrador, intente más tarde.', code: 100 };
                res.status(401);
                console.log(err);
                return res.send(ResultData);
            }
            else {

                let query = `
                    UPDATE SAMT_USUARIO 
                    SET USU_PASSWORD = ?
                    ,AUDITORIA_FEC_ULT_MOD = ?
                    ,AUDITORIA_USU_ULT_MOD = ?
                    WHERE NEWID = ? 
                    AND EMP_CSC_EMPRESA_HOST = ? 
                    AND USU_CSC_USUARIO = ? 
                    AND EMPLEADO_CSC_EMPLEADO = ?;
                `;
                let values = [
                    req.body.DATA_UPDATE.USU_PASSWORD,
                    req.body.DATA_UPDATE.AUDITORIA_FEC_ULT_MOD,
                    decoded.EMPLEADO_CSC_EMPLEADO,
                    decoded.NEWID,
                    req.body.EMP_CSC_EMPRESA_HOST,
                    decoded.USU_CSC_USUARIO,
                    decoded.EMPLEADO_CSC_EMPLEADO
                ];

                __Request_Pool.query(query, values, async function (error, resultReturn) {
                    if (error) {
                        ResultData = { success: false, message: error.message };
                        res.status(400);
                        res.send(ResultData);
                        console.log(ResultData);
                        let DataErr = {
                            Fecha: GetDate(),
                            Detalle: error.originalError,
                            Query: query
                        }
                        console.log(DataErr);
                    }
                    else {
                        if (resultReturn.affectedRows[0] === 0) {
                            ResultData = { success: false, message: 'No Data Get' };
                            res.status(200);
                            res.send(ResultData);

                        } else {

                            let tokenGeneration = '';
                            const html_content_send = `<p>Hola, recientemente se realizo un cambio de contraseña en su cuenta de la mesa central de ANAM </p> `
                            const emailSent = await sendMailNotification(decoded.EMPLEADO_EMAILLABORAL, 'Confirmación de cambio de contraseña', html_content_send);

                            ResultData = { success: true, message: 'Updated', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
                            res.status(200);
                            res.send(ResultData);
                        }

                    }
                });
            }



        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(400);
        res.send(ResultData);
        console.log(error);
    }
}