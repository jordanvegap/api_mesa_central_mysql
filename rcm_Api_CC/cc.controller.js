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
exports.Get_Date = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT NOW()`;
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
exports.Get_IdPerido_PagoDefault = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT TIPO_FRECUENCIA_CSC FROM SAMT_TIPO_FRECUENCIA_PAGOS 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND TIPO_FRECUENCIA_DEFAULT=1`;
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
exports.Get_IdPerido_PagoEmpleados = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, EMPLEADO_CSC_EMPLEADO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && EMPLEADO_CSC_EMPLEADO;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT SAMT_EMPLEADOS.TIPO_FRECUENCIA_CSC AS ID_PERIODO_PAGO_EMP
        ,SAMT_TIPO_FRECUENCIA_PAGOS.TIPO_FRECUENCIA_IDIOMA1 AS DESCRIPCION_PERIODO_PAGO_EMP
        FROM SAMT_EMPLEADOS LEFT JOIN SAMT_TIPO_FRECUENCIA_PAGOS
        ON SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_FRECUENCIA_PAGOS.EMP_CSC_EMPRESA_HOST
        AND SAMT_EMPLEADOS.TIPO_FRECUENCIA_CSC = SAMT_TIPO_FRECUENCIA_PAGOS.TIPO_FRECUENCIA_CSC
        WHERE SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO =` + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
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
exports.Get_CatPeriodoPago = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, TIPO_FRECUENCIA_CSC } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && TIPO_FRECUENCIA_CSC;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT SAMT_CAL_CATORCENA_ANIO AS CAT_ANIO_CSC
        ,SAMT_CAL_CATORCENA_MES AS CAT_MES_CSC
        ,SAMT_CAL_CATORCENA_CSC 
        ,SAMT_CAL_CATORCENA_F1
        ,SAMT_CAL_CATORCENA_F2
        ,SAMT_CAL_CATORCENA_CIERRE
        FROM SAMT_PF_CALENDARIO_CATORCENAS
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND YEAR(CURRENT_TIMESTAMP()) = SAMT_CAL_CATORCENA_ANIO
        AND MONTH(CURRENT_TIMESTAMP()) = SAMT_CAL_CATORCENA_MES
        AND CURRENT_TIMESTAMP() BETWEEN SAMT_CAL_CATORCENA_F1 AND SAMT_CAL_CATORCENA_F2
        AND TIPO_FRECUENCIA_CSC = ` + __Request_Pool.escape(req.query.TIPO_FRECUENCIA_CSC);
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
exports.Get_Solicitudes_Operativas = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT * FROM SAMT_PF_SOLICITUDES_OPERATIVAS 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND PF_SOLICITUDES_OPERATIVAS_ACTIVO=1`
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
exports.Get_Permisos_Solicitudes = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, EMPLEADO_CSC_EMPLEADO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && EMPLEADO_CSC_EMPLEADO;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT SAMT_PF_CAT_SOLICITUDES.* FROM SAMT_PF_CAT_SOLICITUDES INNER JOIN SAMT_PF_SOLICITUDES_EMPLEADOS
        ON SAMT_PF_CAT_SOLICITUDES.EMP_CSC_EMPRESA_HOST=SAMT_PF_SOLICITUDES_EMPLEADOS.EMP_CSC_EMPRESA_HOST
        AND SAMT_PF_CAT_SOLICITUDES.SAMT_PF_CAT_SOLICITUDES_CSC=SAMT_PF_SOLICITUDES_EMPLEADOS.SAMT_PF_CAT_SOLICITUDES_CSC
        WHERE SAMT_PF_SOLICITUDES_EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND SAMT_PF_SOLICITUDES_EMPLEADOS.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `
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
exports.Get_Personal_Supervisor = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, EMPLEADO_CSC_EMPLEADO, ESTATUS_PROCESO_EMP_CSC, FECHA_INICIO, FECHA_FIN } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && EMPLEADO_CSC_EMPLEADO && ESTATUS_PROCESO_EMP_CSC && FECHA_INICIO && FECHA_FIN;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT EMP_CSC_EMPRESA_HOST
        ,TIPO_SEXO_CSC
        ,IFNULL(EMPLEADO_ENROLADO_BIOMETRICO,0) AS EMPLEADO_ENROLADO_BIOMETRICO
        ,EMPLEADO_CSC_EMPLEADO As ID 
        ,CONCAT(IFNULL(EMPLEADO_NOMBREEMPLEADO, ''), ' ', IFNULL(EMPLEADO_APATERNOEMPLEADO,''), ' ', IFNULL(EMPLEADO_AMATERNOEMPLEADO,'')) AS DESCRIPCION
        FROM SAMT_EMPLEADOS WHERE  EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
        AND EMPLEADO_CSC_EMPLEADO_PADRE = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)}
        OR (EMPLEADO_FECH_BAJAEMPLEADO >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
        AND  EMPLEADO_FECH_BAJAEMPLEADO <= ${__Request_Pool.escape(req.query.FECHA_FIN)}
        AND EMPLEADO_CSC_EMPLEADO_PADRE = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)})
        ORDER BY DESCRIPCION ASC`
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
exports.Get_Requisicion_Inmueble = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, USU_CSC_USUARIO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && USU_CSC_USUARIO;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT IFNULL(REQ_CSCREQUISICION, 0) AS REQ_CSCREQUISICION 
        FROM SAMT_SEG_EMPRES_SUBMENU_INMUEBLE 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND USU_CSC_USUARIO = ${__Request_Pool.escape(req.query.USU_CSC_USUARIO)}
        GROUP BY REQ_CSCREQUISICION`
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
exports.Get_Programa_Trabajo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, FECHA_INICIO, FECHA_FIN, EMPLEADO_CSC_EMPLEADO} = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && FECHA_INICIO && FECHA_FIN && EMPLEADO_CSC_EMPLEADO;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `SELECT
        SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA
        ,SAMT_PF_TIPO_BASADO_EN_JORNADA.TIPO_BASADO_EN_JORNADA_IDIOMA1 AS PROGRAMA_TRABAJO_ESTATUS
        ,SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA.SUB_BASADO_EN_JORNADA_IDIOMA1 AS PROGRAMA_TRABAJO_SUBESTATUS
        ,SAMT_PF_ESTATUS_VIRTUAL.ESTATUS_VIRTUAL_IDIOMA1 AS PROGRAMA_TRABAJO_ESTATUS_FINAL
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_JORNADA_ENTRADA
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_JORNADA_SALIDA
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_VIRTUAL_ENTRADA
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_VIRTUAL_SALIDA
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_BIOMETRICO_HORA_MIN
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_BIOMETRICO_HORA_MAX
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_SISTEMA_LOGIN
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_SISTEMA_LOGOUT
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_MANUAL_HORA_ENTRADA
        ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_FECHA_MANUAL_HORA_SALIDA
        FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO 
        LEFT JOIN SAMT_PF_TIPO_BASADO_EN_JORNADA
        ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_PF_TIPO_BASADO_EN_JORNADA.EMP_CSC_EMPRESA_HOST
        AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.TPF_CSC_TIPO_BASADO_EN_JORNADA = SAMT_PF_TIPO_BASADO_EN_JORNADA.TPF_CSC_TIPO_BASADO_EN_JORNADA
        
        LEFT JOIN SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA
        ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA.EMP_CSC_EMPRESA_HOST
        AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.TPF_CSC_SUB_BASADO_EN_JORNADA = SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA
        
        LEFT JOIN SAMT_PF_ESTATUS_VIRTUAL
        ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_PF_ESTATUS_VIRTUAL.EMP_CSC_EMPRESA_HOST
        AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.TPF_CSC_ESTATUS_VIRTUAL = SAMT_PF_ESTATUS_VIRTUAL.TPF_CSC_ESTATUS_VIRTUAL
        
        WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
        AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA <= ${__Request_Pool.escape(req.query.FECHA_FIN)}
        AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO = ` + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
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
