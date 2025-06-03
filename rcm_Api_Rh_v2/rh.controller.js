const dbConfig = require('../__utilitis/config.db.mysql');
const request = require('request');
const mysql = require('mysql2');
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

exports.GetEmpleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.TIPO_CONSULTA == "AVANZADO") {
            if (req.query.INFO == "ALLEMP") {
                query = `SELECT EMPLEADO_CSC_EMPLEADO,EMPLEADO_UNIQUE_ID,EMPLEADO_ID_EXTERNO,CONCAT(EMPLEADO_NOMBREEMPLEADO, ' ',EMPLEADO_APATERNOEMPLEADO, ' ',EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE
                ,CLIENTE_CSC,PM_CSC_PROYECTO,CAM_CSC_SERVICIO,REQ_CSCREQUISICION,CAT_DEPARTAMENTO_CSC,CAT_SUBPROCESO_EMP_CSC,ESTATUS_PROCESO_EMP_CSC,CAT_AREA_CSC,EMPLEADO_CSC_EMPLEADO_PADRE, EMPLEADO_EMAILLABORAL, EMPLEADO_TELEFONO1
                FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;
            } else {
                query = `SELECT EMP_CSC_EMPRESA_HOST,EMPLEADO_CSC_EMPLEADO,EMPLEADO_CSC_EMPLEADO_PADRE,EMPLEADO_ID_EXTERNO
                ,CAT_PROCESO_EMP_CSC,CAT_SUBPROCESO_EMP_CSC,CAT_CATEGORIA_PUESTO_CSC,CAT_PUESTO_CSCEMPLEADO,CAT_AREA_CSC,CAT_DEPARTAMENTO_CSC
                ,ESTATUS_PROCESO_EMP_CSC,TIPO_EMPLEADO_EMPLEADO_CSC,TIPO_UBICACION_LABORAL_CSC,TIPO_PERFIL_CSC,EMPLEADO_SITE_CSC
                ,EMPLEADO_APATERNOEMPLEADO,EMPLEADO_AMATERNOEMPLEADO,EMPLEADO_NOMBREEMPLEADO,EMPLEADO_NOMBREEMPLEADO_SEGUNDO,EMPLEADO_RFC
                ,EMPLEADO_CURP,EMPLEADO_IMSS,EMPLEADO_TELEFONO1,EMPLEADO_TELEFONO2,EMPLEADO_EXTENSION,EMPLEADO_CELULAR
                ,EMPLEADO_EMAILLABORAL,EMPLEADO_CONTACTO,EMPRESA_LABORAL_CSC,CLIENTE_CSC,PM_CSC_PROYECTO,CAM_CSC_SERVICIO,REQ_CSCREQUISICION
                ,CONCAT(EMPLEADO_NOMBREEMPLEADO,' ',EMPLEADO_APATERNOEMPLEADO,' ',EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE,EMPLEADO_UNIQUE_ID, AUDITORIA_FEC_ALTA, AUDITORIA_FEC_ULT_MOD, EMPLEADO_FECHA_NACIMIENTO, TIPO_SEXO_CSC  FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;
            }

            if (req.query.CAT_PROCESO_EMP_CSC) {
                query += " AND CAT_PROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC);
            }
            if (req.query.CAT_SUBPROCESO_EMP_CSC) {
                query += " AND CAT_SUBPROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC);
            }
            if (req.query.EMPLEADO_ID_EXTERNO) {
                query += " AND EMPLEADO_ID_EXTERNO = " + __Request_Pool.escape(req.query.EMPLEADO_ID_EXTERNO);
            }
            if (req.query.EMPLEADO_CSC_EMPLEADO_PADRE) {
                query += " AND EMPLEADO_CSC_EMPLEADO_PADRE = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO_PADRE);
            }
            if (req.query.EMPLEADO_CSC_EMPLEADO) {
                query += " AND EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
            }
            if (req.query.TIPO_EMPLEADO_EMPLEADO_CSC) {
                query += " AND TIPO_EMPLEADO_EMPLEADO_CSC =" + __Request_Pool.escape(req.query.TIPO_EMPLEADO_EMPLEADO_CSC);
            }
            if (req.query.REQ_CSCREQUISICION) {
                query += " AND REQ_CSCREQUISICION =" + __Request_Pool.escape(req.query.REQ_CSCREQUISICION);
            }
            if (req.query.CLIENTE_CSC) {
                query += " AND CLIENTE_CSC = " + __Request_Pool.escape(req.query.CLIENTE_CSC);
            }
            if (req.query.PM_CSC_PROYECTO) {
                query += " AND PM_CSC_PROYECTO = " + __Request_Pool.escape(req.query.PM_CSC_PROYECTO);
            }
            if (req.query.CAM_CSC_SERVICIO) {
                query += " AND CAM_CSC_SERVICIO = " + __Request_Pool.escape(req.query.CAM_CSC_SERVICIO);
            }
            if (req.query.ESTATUS_PROCESO_EMP_CSC) {
                query += " AND ESTATUS_PROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC);
            }
            if (req.query.CAT_AREA_CSC) {
                query += " AND CAT_AREA_CSC = " + __Request_Pool.escape(req.query.CAT_AREA_CSC);
            }
            if (req.query.CAT_DEPARTAMENTO_CSC) {
                query += " AND CAT_DEPARTAMENTO_CSC = " + __Request_Pool.escape(req.query.CAT_DEPARTAMENTO_CSC);
            }
        }
        else {
            query = `SELECT 
            SAMT_EMPLEADOS.*, 
            CONCAT(JEFE.EMPLEADO_NOMBREEMPLEADO, ' ', JEFE.EMPLEADO_APATERNOEMPLEADO, ' ', JEFE.EMPLEADO_AMATERNOEMPLEADO ) AS NOMBRE_JEFE_INMEDIATO  ,
            CONCAT(CAPACITADOR.EMPLEADO_NOMBREEMPLEADO, ' ', CAPACITADOR.EMPLEADO_APATERNOEMPLEADO, ' ', CAPACITADOR.EMPLEADO_AMATERNOEMPLEADO ) AS NOMBRE_EMPLEADO_CAPACITADOR  

            FROM SAMT_EMPLEADOS 
            LEFT JOIN SAMT_EMPLEADOS AS JEFE ON JEFE.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO_PADRE AND JEFE.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_EMPLEADOS AS CAPACITADOR ON CAPACITADOR.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CAPACITADOR_CSC AND CAPACITADOR.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            
            WHERE SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

            if (req.query.CAT_PROCESO_EMP_CSC) {
                query += " AND SAMT_EMPLEADOS.CAT_PROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC);
            }
            if (req.query.CAT_SUBPROCESO_EMP_CSC) {
                query += " AND SAMT_EMPLEADOS.CAT_SUBPROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC);
            }
            if (req.query.EMPLEADO_ID_EXTERNO) {
                query += " AND SAMT_EMPLEADOS.EMPLEADO_ID_EXTERNO = " + __Request_Pool.escape(req.query.EMPLEADO_ID_EXTERNO);
            }
            if (req.query.EMPLEADO_CSC_EMPLEADO_PADRE) {
                query += " AND SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO_PADRE = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO_PADRE);
            }
            if (req.query.EMPLEADO_CSC_EMPLEADO) {
                query += " AND SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
            }
            if (req.query.TIPO_EMPLEADO_EMPLEADO_CSC) {
                query += " AND SAMT_EMPLEADOS.TIPO_EMPLEADO_EMPLEADO_CSC =" + __Request_Pool.escape(req.query.TIPO_EMPLEADO_EMPLEADO_CSC);
            }
            if (req.query.REQ_CSCREQUISICION) {
                query += " AND SAMT_EMPLEADOS.REQ_CSCREQUISICION =" + __Request_Pool.escape(req.query.REQ_CSCREQUISICION);
            }
            if (req.query.CLIENTE_CSC) {
                query += " AND SAMT_EMPLEADOS.CLIENTE_CSC = " + __Request_Pool.escape(req.query.CLIENTE_CSC);
            }
            if (req.query.PM_CSC_PROYECTO) {
                query += " AND SAMT_EMPLEADOS.PM_CSC_PROYECTO = " + __Request_Pool.escape(req.query.PM_CSC_PROYECTO);
            }
            if (req.query.CAM_CSC_SERVICIO) {
                query += " AND SAMT_EMPLEADOS.CAM_CSC_SERVICIO = " + __Request_Pool.escape(req.query.CAM_CSC_SERVICIO);
            }
            if (req.query.ESTATUS_PROCESO_EMP_CSC) {
                query += " AND SAMT_EMPLEADOS.ESTATUS_PROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC);
            }
            if (req.query.EMPLEADO_UNIQUE_ID) {
                query += " AND SAMT_EMPLEADOS.EMPLEADO_UNIQUE_ID = " + __Request_Pool.escape(req.query.EMPLEADO_UNIQUE_ID);
            }
            if (req.query.CAT_AREA_CSC) {
                query += " AND SAMT_EMPLEADOS.CAT_AREA_CSC = " + __Request_Pool.escape(req.query.CAT_AREA_CSC);
            }
            if (req.query.CAT_DEPARTAMENTO_CSC) {
                query += " AND SAMT_EMPLEADOS.CAT_DEPARTAMENTO_CSC = " + __Request_Pool.escape(req.query.CAT_DEPARTAMENTO_CSC);
            }
            // if (req.query.TIPO_CONSULTA == "EMP_LABORA") {
            //     query = "SELECT * FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND CAM_CSC_SERVICIO IN ("+__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)+") AND ESTATUS_PROCESO_EMP_CSC IN ("+__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)+") AND  EMPRESA_LABORAL_CSC IN ("+__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)+");";
            // } 
            // else if(req.query.TIPO_CONSULTA == "ID_EXTERNO"){
            //     query = "SELECT * FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND ESTATUS_PROCESO_EMP_CSC IN ("+__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)+") AND EMPLEADO_ID_EXTERNO = "+__Request_Pool.escape(req.query.EMPLEADO_ID_EXTERNO); 
            // }
            // else if(req.query.TIPO_CONSULTA == "ID_INTERNO"){
            //     query = "SELECT * FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND ESTATUS_PROCESO_EMP_CSC IN ("+__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)+") AND EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO); 
            // }
        }
        query += ";--";
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

exports.UpdatePrenomina = async (req, res) => {
    try {
        var REFERENCE_CONNEXION = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var __Request_Pool = new sql.Request(REFERENCE_CONNEXION);

        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_UPDATE, __Request_Pool, "UPDATE");
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_WHERE, __Request_Pool, "WHERE");

        var query = "UPDATE SAMT_PF_PRENOMINA " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " OUTPUT INSERTED.* WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";
        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.rowsAffected0 === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Update', count: resultReturn.rowsAffected0, JsonData: resultReturn.recordset };
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

exports.Insert_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADOS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADOS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Usuario = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT NEWID,USU_CSC_USUARIO,EMPLEADO_CSC_EMPLEADO, USU_INDICAACTIVO, 
        USU_LOGIN,USU_CODESQUEMASEG,USU_FECHA_EXPIRA,USU_AUTENTIFICA_REMOTO,
        USU_ACCESO_SITEMA,USU_FECHA_EXPIRA_LOGIN
        FROM SAMT_USUARIO WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

        if (req.query.EMPLEADO_CSC_EMPLEADO) {
            query += " AND EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
        }
        if (req.query.USU_LOGIN) {
            query += " AND USU_LOGIN = " + __Request_Pool.escape(req.query.USU_LOGIN);
        }
        if (req.query.USU_INDICAACTIVO) {
            query += " AND USU_INDICAACTIVO = " + __Request_Pool.escape(req.query.USU_INDICAACTIVO);
        }
        query += ";--";
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

exports.Insert_Usuario = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_USUARIO SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Usuario = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_USUARIO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Insert_Mesa_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_CAM_MESA_EMPLEADOS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Rh_Menu_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.USU_CODESQUEMASEG == 1) {
            query = `SELECT EMP_CSC_EMPRESA_HOST,EMPLEADO_MNU_CSC_MENU,EMPLEADO_MNU_DESCRIPCION1
            ,EMPLEADO_MNU_ORDEN,EMPLEADO_MNU_IMAGEN_GRANDE_ACTIVO,EMPLEADO_MNU_ACTIVO
            ,EMPLEADO_MNU_WEB_NAMESPACE,EMPLEADO_MNU_ACTIVO_WEB FROM SAMT_EMPLEADOS_MENU_DLL 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_MNU_ACTIVO = 1;`;
        }
        else {
            query = `SELECT AUT_MNU.EMP_CSC_EMPRESA_HOST,AUT_MNU.EMPLEADO_CSC_EMPLEADO,AUT_MNU.EMPLEADO_MENU_CSC_MENU
            ,DLL.EMPLEADO_MNU_DESCRIPCION1,DLL.EMPLEADO_MNU_ORDEN,DLL.EMPLEADO_MNU_IMAGEN_GRANDE_ACTIVO
            ,DLL.EMPLEADO_MNU_ACTIVO
            ,DLL.EMPLEADO_MNU_WEB_NAMESPACE
            ,DLL.EMPLEADO_MNU_ACTIVO_WEB 
            FROM SAMT_EMPLEADOS_AUTORIZACION_MENU AS AUT_MNU 
            INNER JOIN SAMT_EMPLEADOS_MENU_DLL AS DLL ON DLL.EMPLEADO_MNU_CSC_MENU = AUT_MNU.EMPLEADO_MENU_CSC_MENU AND DLL.EMP_CSC_EMPRESA_HOST = AUT_MNU.EMP_CSC_EMPRESA_HOST 
            WHERE AUT_MNU.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND DLL.EMPLEADO_MNU_ACTIVO = 1 AND AUT_MNU.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)};`
        }
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

exports.Insert_Rh_Menu_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADOS_AUTORIZACION_MENU SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Del_Rh_Menu_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var d1 = __Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST);
        var d2 = __Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO);
        var d3 = __Request_Pool.escape(req.body.EMPLEADO_MENU_CSC_MENU);

        var query = "DELETE FROM SAMT_EMPLEADOS_AUTORIZACION_MENU WHERE EMP_CSC_EMPRESA_HOST = ? AND EMPLEADO_CSC_EMPLEADO = ? AND EMPLEADO_MENU_CSC_MENU = ?";
        __Request_Pool.query(query, [d1, d2, d3], function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Del_Mesa_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var d1 = __Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST);
        var d2 = __Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO);
        var d3 = __Request_Pool.escape(req.body.CAM_MESA_CSC);

        var query = "DELETE FROM SAMT_CAM_MESA_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ? AND EMPLEADO_CSC_EMPLEADO = ? AND CAM_MESA_CSC = ?";
        __Request_Pool.query(query, [d1, d2, d3], function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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



exports.Busca_Reclutado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = "";

        if (req.query.TIPO_CONSULTA == "UNIQUE_ID") {
            query = `SELECT * FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_UNIQUE_ID = ${__Request_Pool.escape(req.query.EMPLEADO_UNIQUE_ID)} ; `;
        }
        else if (req.query.TIPO_CONSULTA == "SOL_EMPLEADO") {
            query = `SELECT * FROM SAMT_EMPLEADO_SOLICITUD WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ;`;
        }
        else if (req.query.TIPO_CONSULTA == "RECLUTAMINIENTO") {

            query = `SELECT 
                EMP_CSC_EMPRESA_HOST
                ,EMPLEADO_CSC_EMPLEADO
                ,EMPLEADO_UNIQUE_ID
                ,EMPLEADO_NOMBREEMPLEADO
                ,EMPLEADO_APATERNOEMPLEADO
                ,EMPLEADO_AMATERNOEMPLEADO
                ,EMPLEADO_RFC
                ,EMPLEADO_FECHA_NACIMIENTO
                ,CAT_SUBPROCESO_EMP_CSC
                ,CAT_CATEGORIA_PUESTO_CSC
                ,CAT_PUESTO_CSCEMPLEADO
                ,ESTATUS_PROCESO_EMP_CSC
                ,TIPO_SEXO_CSC
                ,EMPLEADO_SITE_CSC
                ,REQ_CSCREQUISICION
                ,EMPLEADO_CELULAR
                ,EMPLEADO_TELEFONO1
                ,AUDITORIA_FEC_ALTA
                ,AUDITORIA_FEC_ULT_MOD
                ,AUDITORIA_USU_ALTA
                ,AUDITORIA_USU_ULT_MOD 
             FROM SAMT_EMPLEADOS 
             WHERE 
             EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND 
             CAT_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC)} AND 
             CAT_SUBPROCESO_EMP_CSC IN ( 
               SELECT CAT_SUBPROCESO_EMP_CSC 
               FROM SAMT_CAT_SUBPROCESO_EMPLEADOS 
               WHERE 
               CAT_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC)} AND 
               CAT_SUBPROCESO_EMP_CLAVE NOT IN ('BAJA') 
             )  `;

            if (req.query.TIPO_BUSQUEDA_RECLUTAMIENTO == "ID_INTERNO") {
                query += " AND EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
            }
            else if (req.query.TIPO_BUSQUEDA_RECLUTAMIENTO == "RANGO_FECHAS") {
                query += " AND AUDITORIA_FEC_ALTA BETWEEN " + __Request_Pool.escape(req.query.FECHA_REGISTRO_INICIO + " 00:00:00") + " AND " + __Request_Pool.escape(req.query.FECHA_REGISTRO_FIN + " 23:59:59");
            }
            else if (req.query.TIPO_BUSQUEDA_RECLUTAMIENTO == "NOMBRE_APELLIDO") {
                query += " AND EMPLEADO_NOMBREEMPLEADO LIKE " + __Request_Pool.escape("%" + req.query.EMPLEADO_NOMBREEMPLEADO + "%");
                query += " AND EMPLEADO_APATERNOEMPLEADO LIKE " + __Request_Pool.escape("%" + req.query.EMPLEADO_APATERNOEMPLEADO + "%");
            }
            else if (req.query.TIPO_BUSQUEDA_RECLUTAMIENTO == "RFC") {
                query += " AND EMPLEADO_RFC LIKE " + __Request_Pool.escape("%" + req.query.EMPLEADO_RFC + "%");
            }
            else if (req.query.TIPO_BUSQUEDA_RECLUTAMIENTO == "SUB_PROCESO") {
                query += " AND AUDITORIA_FEC_ALTA > DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH) " +
                    " AND CAT_SUBPROCESO_EMP_CSC = " + __Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC);
            }
            else if (req.query.TIPO_BUSQUEDA_RECLUTAMIENTO == "TELEFONO") {
                query += ` AND (  EMPLEADO_CELULAR = ${__Request_Pool.escape(req.query.EMPLEADO_TELEFONO)} 
                    OR EMPLEADO_TELEFONO1 = ${__Request_Pool.escape(req.query.EMPLEADO_TELEFONO)} 
                    OR EMPLEADO_TELEFONO2 = ${__Request_Pool.escape(req.query.EMPLEADO_TELEFONO)} 
                ) `;
            }
            else {
                query += " AND AUDITORIA_FEC_ALTA > DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH) ";
            }

            if (req.query.TIPO_EMPRESA_RECLUTA_CSC_IN){
                query += ` AND TIPO_EMPRESA_RECLUTA_CSC IN ( ${req.query.TIPO_EMPRESA_RECLUTA_CSC_IN} ) `;
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


exports.Valida_Reclutado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = "";

        if (req.query.TIPO_CONSULTA == "VALIDA_BAJA_MONTH") {

            query = `SELECT 
                EMPLEADO_CSC_EMPLEADO, 
                EMPLEADO_NOMBREEMPLEADO, 
                EMPLEADO_APATERNOEMPLEADO, 
                EMPLEADO_AMATERNOEMPLEADO, 
                EMPLEADO_FECH_BAJAEMPLEADO, 
                CAT_EMP_TREE_BAJA_CSC, 
                CAT_PUESTO_CSCEMPLEADO 
            FROM SAMT_EMPLEADOS 
            WHERE 
                EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND EMPLEADO_FECH_BAJAEMPLEADO > DATE_SUB(CURRENT_DATE(), INTERVAL ${__Request_Pool.escape(req.query.MESES_ATRAS * -1)} DAY)
                AND ( 
                        (
                            EMPLEADO_NOMBREEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_NOMBREEMPLEADO)} 
                            AND EMPLEADO_APATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_APATERNOEMPLEADO)} 
                            AND EMPLEADO_AMATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_AMATERNOEMPLEADO)} 
                        ) 
                    OR 
                    EMPLEADO_RFC LIKE ${__Request_Pool.escape("%" + req.query.EMPLEADO_RFC + "%")} 
                ) ` ;

        }
        else if (req.query.TIPO_CONSULTA == "VALIDA_NORECONTRATABLE") {
            query = `SELECT 
                EMPLEADO_CSC_EMPLEADO, 
                EMPLEADO_NOMBREEMPLEADO, 
                EMPLEADO_APATERNOEMPLEADO, 
                EMPLEADO_AMATERNOEMPLEADO, 
                EMPLEADO_FECH_BAJAEMPLEADO, 
                CAT_EMP_TREE_BAJA_CSC, 
                CAT_PUESTO_CSCEMPLEADO 
            FROM SAMT_EMPLEADOS 
            WHERE 
                EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND CAT_EMP_TREE_BAJA_CSC NOT IN ( 
                    SELECT 
                        EMP_TREE_BAJA_CSC 
                    FROM SAMT_EMP_TREE_BAJA  
                    WHERE 
                        EMP_TREE_ACTIVO = 1 
                        AND EMP_TREE_RECONTRATADO = 1 
                ) 
                AND 
                ( 
                    ( 
                        EMPLEADO_NOMBREEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_NOMBREEMPLEADO)} 
                        AND EMPLEADO_APATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_APATERNOEMPLEADO)} 
                        AND EMPLEADO_AMATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_AMATERNOEMPLEADO)} 
                    )
                    OR EMPLEADO_RFC LIKE ${__Request_Pool.escape("%" + req.query.EMPLEADO_RFC + "%")} 
                ); ` ;
        }
        else if (req.query.TIPO_CONSULTA == "VALIDA_PUESTO_EMPLEADO") {

            query = `SELECT 
                EMPLEADO_CSC_EMPLEADO, 
                EMPLEADO_NOMBREEMPLEADO, 
                EMPLEADO_APATERNOEMPLEADO, 
                EMPLEADO_AMATERNOEMPLEADO, 
                EMPLEADO_FECH_BAJAEMPLEADO, 
                CAT_EMP_TREE_BAJA_CSC, 
                CAT_PUESTO_CSCEMPLEADO 
            FROM SAMT_EMPLEADOS 
            WHERE 
                EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND CAT_PUESTO_CSCEMPLEADO =  ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)}
                AND CAT_EMP_TREE_BAJA_CSC IS NOT NULL AND 
                (
                    (
                        EMPLEADO_NOMBREEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_NOMBREEMPLEADO)} 
                        AND EMPLEADO_APATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_APATERNOEMPLEADO)} 
                        AND EMPLEADO_AMATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_AMATERNOEMPLEADO)} 
                    )
                    OR EMPLEADO_RFC LIKE ${__Request_Pool.escape("%" + req.query.EMPLEADO_RFC + "%")} 
                ) ` ;


        }
        else if (req.query.TIPO_CONSULTA == "VALIDA_ALTA_MONTH") {
            query = ` SELECT 
                EMPLEADO_CSC_EMPLEADO, 
                EMPLEADO_NOMBREEMPLEADO, 
                EMPLEADO_APATERNOEMPLEADO, 
                EMPLEADO_AMATERNOEMPLEADO, 
                EMPLEADO_FECH_BAJAEMPLEADO, 
                CAT_EMP_TREE_BAJA_CSC, 
                CAT_PUESTO_CSCEMPLEADO, 
                AUDITORIA_FEC_ALTA 
            FROM SAMT_EMPLEADOS 
            WHERE 
                EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND AUDITORIA_FEC_ALTA > DATE_SUB(CURRENT_DATE(), INTERVAL ${__Request_Pool.escape(req.query.MESES_ATRAS * -1)} DAY)  `;


            if (req.query.CAT_PROCESO_EMP_CSC) {
                query += ` AND CAT_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC)} `;
            }

            query += ` AND ( 
                (
                    EMPLEADO_NOMBREEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_NOMBREEMPLEADO)} 
                    AND EMPLEADO_APATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_APATERNOEMPLEADO)} 
                    AND EMPLEADO_AMATERNOEMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_AMATERNOEMPLEADO)} 
                ) 
                OR EMPLEADO_RFC LIKE  ${__Request_Pool.escape("%" + req.query.EMPLEADO_RFC + "%")} 
            ) ` ;
        }

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


exports.Get_Campania_Llega = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} ; `;

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



exports.Insert_Empleado_Solicitud = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_SOLICITUD SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Solicitud = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_SOLICITUD " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Insert_Empleado_Proceso_Detalle = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADOS_PROCESO_DETALLE SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Proceso_Detalle = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADOS_PROCESO_DETALLE " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleado_Proceso_Detalle = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT PROCESO.*
        ,CONCAT(EMPRESPON.EMPLEADO_NOMBREEMPLEADO, ' ', EMPRESPON.EMPLEADO_APATERNOEMPLEADO, ' ', EMPRESPON.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE_EMPLEADO_RESPONSABLE
        ,CONCAT(EMPALTA.EMPLEADO_NOMBREEMPLEADO, ' ', EMPALTA.EMPLEADO_APATERNOEMPLEADO, ' ', EMPALTA.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE_EMPLEADO_ALTA

        FROM SAMT_EMPLEADOS_PROCESO_DETALLE AS PROCESO
        LEFT JOIN SAMT_EMPLEADOS AS EMPRESPON ON EMPRESPON.EMP_CSC_EMPRESA_HOST = PROCESO.EMP_CSC_EMPRESA_HOST AND EMPRESPON.EMPLEADO_CSC_EMPLEADO = PROCESO.RESPONSABLE_EMPLEADO_CSC
        LEFT JOIN SAMT_EMPLEADOS AS EMPALTA ON EMPALTA.EMP_CSC_EMPRESA_HOST = PROCESO.EMP_CSC_EMPRESA_HOST AND EMPALTA.EMPLEADO_CSC_EMPLEADO = PROCESO.AUDITORIA_USU_ALTA
        WHERE PROCESO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND PROCESO.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;

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

exports.Insert_Empleados_Financial = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADOS_FINANCIAL SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleados_Financial = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADOS_FINANCIAL " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleados_Financial = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_EMPLEADOS_FINANCIAL WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;

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


exports.Insert_Empleado_Hijo = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_HIJOS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Hijo = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_HIJOS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleado_Hijos = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_EMPLEADO_HIJOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;

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


exports.Insert_Empleado_Referencia = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_REFERENCIAS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Referencia = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_REFERENCIAS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleado_Referencias_Por_Tipo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT 
        REFERENCIAS.*  
        FROM   
        SAMT_EMPLEADO_REFERENCIAS AS REFERENCIAS 
        
        INNER JOIN SAMT_TIPO_EMPLEADO_REFERENCIA AS TIPO ON  
        REFERENCIAS.EMP_CSC_EMPRESA_HOST = TIPO.EMP_CSC_EMPRESA_HOST AND 
        REFERENCIAS.TIPO_EMPLEADO_REFERENCIA_CSC = TIPO.TIPO_EMPLEADO_REFERENCIA_CSC 
        
        WHERE 
        REFERENCIAS.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} AND 
        TIPO.TIPO_EMPLEADO_REFERENCIA_CLAVE = ${__Request_Pool.escape(req.query.TIPO_EMPLEADO_REFERENCIA_CLAVE)} AND 
        REFERENCIAS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `;

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



exports.Insert_Empleado_Experiencia_Laboral = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_EXPERIENCIA_LABORAL SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Experiencia_Laboral = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_EXPERIENCIA_LABORAL " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleado_Experiencia_Laboral = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_EMPLEADO_EXPERIENCIA_LABORAL WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;

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


exports.Insert_Empleado_Grado_Estudios = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_ESTUDIOS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Grado_Estudios = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_ESTUDIOS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleado_Grado_Estudios = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_EMPLEADO_ESTUDIOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;

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


exports.Insert_Bitacora_RH_Reclutamiento = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_RH_RECLUTAMIENTO SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Bitacora_RH_Reclutamiento = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_RH_RECLUTAMIENTO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Bitacora_RH_Reclutamiento = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_RH_RECLUTAMIENTO WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;

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

exports.UpdateFinalizaBitacoraDateProceso = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = ` UPDATE SAMT_EMPLEADOS_PROCESO_DETALLE 
        SET 
        PROCESO_FECHA_FIN = NOW(), 
        PROCESO_BAJA_EMPLEADO = ${__Request_Pool.escape(req.body.PROCESO_BAJA_EMPLEADO)} , 
        AUDITORIA_USU_ULT_MOD = ${__Request_Pool.escape(req.body.EMPLEADO_ALTA)}, 
        AUDITORIA_FEC_ULT_MOD = NOW() 
        WHERE 
        EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST)}
        AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO)}

        ORDER BY AUDITORIA_FEC_ALTA DESC 

        LIMIT 1 `;

        __Request_Pool.query(query, function (error, resultReturn) {
            console.log(resultReturn);
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.changedRows };
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

exports.GetGdByEmp = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT DISTINCT(ESTRC.GD_ESTRUCTURA_CSC) as id,ESTRC.*,ARCH.GD_ARCHIVO_CSC, ARCH.GD_ARCHIVO_UNIQUE, ARCH.GD_ARCHIVO_ENSERVIDOR, ARCH.GD_MIMETYPE_SISTEMA
        FROM SAMT_GD_ESTRUCTURA_WBS_EMPLEADOS AS ESTRC 
        LEFT JOIN SAMT_GD_ARCHIVOS ARCH ON ESTRC.EMP_CSC_EMPRESA_HOST =ARCH.EMP_CSC_EMPRESA_HOST AND ARCH.GD_ESTRUCTURA_CSC = ESTRC.GD_ESTRUCTURA_CSC AND ARCH.GD_ARCHIVO_ACTIVO = 1
        WHERE ESTRC.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} and ESTRC.EMPLEADO_CSC_EMPLEADO= ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} `;

        query += ";--";
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

exports.Get_Config_Proceso_Empleados = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_CONFIG_SUBPROCESO_EMPLEADOS WHERE CAT_SUBPROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC)} AND EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} ; `;

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

exports.Insert_Agenda_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_AGENDA_RECUTAMIENTO SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Agenda_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_AGENDA_RECUTAMIENTO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Agenda_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.TYPE_QUERY == "EMPLEADO") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} 
            AND ESTATUS_RECLUTAMIENTO_ACTIVO = 1 `;
        }
        else if (req.query.TYPE_QUERY == "FECHAS") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_FECH_AGENDA BETWEEN ${__Request_Pool.escape(req.query.FECHA_REGISTRO_INICIO)} AND ${__Request_Pool.escape(req.query.FECHA_REGISTRO_FIN)}  
            AND ESTATUS_RECLUTAMIENTO_ACTIVO = 1 `;
        }
        else if (req.query.TYPE_QUERY == "NOMBRE") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_NOMBRE_COMPLETO LIKE ${__Request_Pool.escape("%" + req.query.EMPLEADO_NOMBREEMPLEADO + "%")} 
            AND EMPLEADO_NOMBRE_COMPLETO LIKE ${__Request_Pool.escape("%" + req.query.EMPLEADO_APATERNOEMPLEADO + "%")}  
            AND ESTATUS_RECLUTAMIENTO_ACTIVO = 1  `;
        }
        else if (req.query.TYPE_QUERY == "RFC") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_RFC LIKE ${__Request_Pool.escape("%" + req.query.EMPLEADO_RFC + "%")}   
            AND ESTATUS_RECLUTAMIENTO_ACTIVO = 1  `;
        }
        else if (req.query.TYPE_QUERY == "EMPLEADO_RECLUTADOR") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_RECLUTADOR_CSC = ${__Request_Pool.escape(req.query.EMPLEADO_RECLUTADOR_CSC)}
            AND EMPLEADO_FECH_AGENDA > DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
            AND ESTATUS_RECLUTAMIENTO_ACTIVO = 1 `;
        }
        else if (req.query.TYPE_QUERY == "MISAGENDAS") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_FECH_AGENDA BETWEEN ${__Request_Pool.escape(req.query.FECHA_REGISTRO_INICIO)} AND ${__Request_Pool.escape(req.query.FECHA_REGISTRO_FIN)}  
            AND EMPLEADO_RECLUTADOR_CSC = ${__Request_Pool.escape(req.query.EMPLEADO_RECLUTADOR_CSC)} `;
        }
        else if (req.query.TYPE_QUERY == "MIS_AGENDAS_EMPLEADO_RECLUTADOR") {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND EMPLEADO_RECLUTADOR_CSC = ${__Request_Pool.escape(req.query.EMPLEADO_RECLUTADOR_CSC)}
            AND EMPLEADO_FECH_AGENDA BETWEEN ${__Request_Pool.escape(req.query.FECHA_REGISTRO_INICIO)} AND ${__Request_Pool.escape(req.query.FECHA_REGISTRO_FIN)}   `;
        }
        else {
            query = ` SELECT * FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO 
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADO_FECH_AGENDA > DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH) 
            AND ESTATUS_RECLUTAMIENTO_ACTIVO = 1 `;
        }
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


exports.Get_Especific_Empleados_ById = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` 
        SELECT 
            EMPLEADO_CSC_EMPLEADO, 
            CONCAT(EMPLEADO_NOMBREEMPLEADO, ' ', EMPLEADO_APATERNOEMPLEADO, ' ', EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE, 
            CONCAT(EMPLEADO_NOMBREEMPLEADO, ' ', EMPLEADO_APATERNOEMPLEADO, ' ', EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE_EMPLEADO
        FROM SAMT_EMPLEADOS
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND EMPLEADO_CSC_EMPLEADO IN (` + req.query.EMPLEADOS_LIST_ID + `); `;

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

exports.GetPermisosFirma = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = ` SELECT * FROM SAMT_EMPLEADO_HORARIO_APP WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;
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

exports.Put_Firma_Movil = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_PF_FIRMA_MOVIL SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.GetEmplCargo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = `SELECT EMPL.EMP_CSC_EMPRESA_HOST 
        ,EMPL.EMPLEADO_CSC_EMPLEADO 
        ,EMPL.EMPLEADO_ID_EXTERNO 
        ,CONCAT(EMPL.EMPLEADO_NOMBREEMPLEADO , ' ' ,EMPL.EMPLEADO_APATERNOEMPLEADO ,' ', EMPL.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE_EMPLEADO 
        ,EMPL.CAT_PUESTO_CSCEMPLEADO AS TIPO_PUESTO_CSCEMPLEADO 
        ,T_PUESTO.TIPO_PUESTO_IDIOMA1 
        ,EMPL.EMPLEADO_CURP 
        ,EMPL.EMPLEADO_IMSS 
        ,EMPL.EMPLEADO_RFC 
        ,EMPL.TIPO_SEXO_CSC     
        ,E_SEXO.TIPO_SEXO_IDIOMA1 
        ,EMPL.CLIENTE_CSC 
        ,P_CLIENTE.CLIENTE_NOMBRE 
        ,EMPL.PM_CSC_PROYECTO 
        ,P_PROYECTO.PM_NOMBRE 
        ,EMPL.CAM_CSC_SERVICIO 
        ,P_CAMPANIA.CAM_SERVICIO_NOMBRE 
        ,EMPL.EMPRESA_LABORAL_CSC 
        ,EMP_LABORA.EMPRESA_LABORAL_RAZONSOCIALNOMBRE 
        ,EMP_LABORA.EMPRESA_LABORAL_ESTADO 
        ,EMP_LABORA.EMPRESA_LABORAL_MUNICIPIO 
        ,EMP_LABORA.EMPRESA_LABORAL_COLONIA 
        ,EMP_LABORA.EMPRESA_LABORAL_CODIGOPOSTAL 
        ,EMP_LABORA.EMPRESA_LABORAL_LAT 
        ,EMP_LABORA.EMPRESA_LABORAL_LONG 
        ,EMP_LABORA.EMPRESA_LABORAL_DIRECCION
        ,EMP_LABORA.EMPRESA_LABORAL_TELEFONO
        ,EMPL.TIPO_FRECUENCIA_CSC
        ,(SELECT COUNT(*) AS FIRMADO 
        FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO 
        WHERE DATE_FORMAT(PROGRAMA_TRABAJO_FECHA, '%Y-%m-%d') = ${__Request_Pool.escape(req.query.FECHA_ACTUAL)}
        AND EMPLEADO_CSC_EMPLEADO = EMPL.EMPLEADO_CSC_EMPLEADO 
        AND PROGRAMA_FECHA_VIRTUAL_ENTRADA IS NOT NULL) AS CONTFIRMAS
        ,EMPL.EMPLEADO_TELEFONO1
        ,EMPL.EMPLEADO_CELULAR
         FROM SAMT_EMPLEADOS AS EMPL
         LEFT JOIN SAMT_EMPRESA_LABORAL AS EMP_LABORA
         ON EMP_LABORA.EMPRESA_LABORAL_CSC = EMPL.EMPRESA_LABORAL_CSC AND EMP_LABORA.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS T_PUESTO
         ON T_PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMPL.CAT_PUESTO_CSCEMPLEADO  AND T_PUESTO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         LEFT JOIN SAMT_CLIENTES AS P_CLIENTE
         ON P_CLIENTE.CLIENTE_CSC = EMPL.CLIENTE_CSC AND P_CLIENTE.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         LEFT JOIN SAMT_PROYECTOS AS P_PROYECTO
         ON P_PROYECTO.PM_CSC_PROYECTO = EMPL.PM_CSC_PROYECTO AND P_PROYECTO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         LEFT JOIN SAMT_CAM_SERVICIO AS P_CAMPANIA
         ON P_CAMPANIA.CAM_CSC_SERVICIO = EMPL.CAM_CSC_SERVICIO AND P_CAMPANIA.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         LEFT JOIN SAMT_CAT_ESTATUS_PROCESO_MPLEADOS AS PROCESOEMPLEADO
         ON PROCESOEMPLEADO.CAT_ESTATUS_PROCESO_EMP_CSC = EMPL.ESTATUS_PROCESO_EMP_CSC AND PROCESOEMPLEADO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         LEFT JOIN SAMT_TIPO_SEXO AS E_SEXO
         ON E_SEXO.TIPO_SEXO_CSC = EMPL.TIPO_SEXO_CSC AND E_SEXO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
         WHERE EMPL.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPL.EMPLEADO_CSC_EMPLEADO_PADRE = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO_PADRE)}
         AND PROCESOEMPLEADO.CAT_ESTATUS_PROCESO_EMP_CLAVE = ${__Request_Pool.escape(req.query.CAT_ESTATUS_PROCESO_EMP_CLAVE)}
         ORDER BY EMPL.EMPLEADO_NOMBREEMPLEADO ASC;`;
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


exports.Get_Dashboard_Reclutamiento = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = `SELECT  
        EMP_CSC_EMPRESA_HOST 
        ,EMPLEADO_CSC_EMPLEADO 
        ,EMPLEADO_CSC_EMPLEADO_PADRE 
        ,EMPLEADO_ID_EXTERNO 
        ,CAT_PROVEEDOR_CSC 
        ,CAT_PROCESO_EMP_CSC 
        ,CAT_SUBPROCESO_EMP_CSC 
        ,CAT_CATEGORIA_PUESTO_CSC 
        ,CAT_PUESTO_CSCEMPLEADO 
        ,CAT_AREA_CSC 
        ,CAT_DEPARTAMENTO_CSC 
        ,CAT_EMP_TREE_BAJA_CSC 
        ,CAT_CENTRO_COSTOS_CSC 
        ,ESTATUS_PROCESO_EMP_CSC 
        ,TIPO_EMPLEADO_EMPLEADO_CSC 
        ,TIPO_TURNO_CSCTURNO 
        ,TIPO_CONTRATO_CSCCONTRATO 
        ,TIPO_DOCUMENTO_CSC 
        ,TIPO_GRADO_ESTUDIO_CSC 
        ,TIPO_ESPECIALIDAD_ESCOLAR_CSC 
        ,TIPO_EMPLEADO_BAJA_CSC 
        ,TIPO_SEXO_CSC 
        ,TIPO_FRECUENCIA_CSC 
        ,TIPO_FUNCION_CSC 
        ,TIPO_ACTIVIDAD_EMPLEADO_CSC 
        ,TIPO_CALCULO_NOMINA_CSC 
        ,TIPO_EMPRESA_CSC 
        ,TIPO_EMPRESA_RECLUTA_CSC 
        ,TIPO_DEPTO_BC_CSC 
        ,TIPO_UBICACION_LABORAL_CSC 
        ,TIPO_PERFIL_CSC 
        ,TIPO_EMPLEADO_COMPARTIDO_CSC 
        ,TIPO_EMPLEADO_WS_CSC 
        ,TIPO_VACANTE_CSC 
        ,TIPO_CAMPANIA_SOLICITA 
        ,EMPLEADO_SITE_CSC 
        ,EMPLEADO_CVEEMPLEADO 
        ,EMPLEADO_FECHA_NACIMIENTO 
        ,EMPLEADO_FECH_RECLUTAMIENTO 
        ,EMPLEADO_FECH_FIRMACONTRATO 
        ,EMPLEADO_FECH_BAJAEMPLEADO 
        ,EMPLEADO_FECH_REINGRESO 
        ,EMPLEADO_FECH_INGRESOEMP 
        ,EMPLEADO_FECH_CAPACITACION 
        ,EMPLEADO_FECH_INICIAOPERACION 
        ,EMPLEADO_FECH_CAMBIO_PROCESO 
        ,EMPLEADO_CVEESTATUS 
        ,EMPLEADO_UNIQUE_ID 
        ,EMPLEADO_ESTADO_CIVIL_CSC 
        ,EMPLEADO_CAPACITADOR 
        ,EMPLEADO_ACEPTA_AVISO 
        ,EMPLEADO_DISCAPACITADO 
        ,EMPLEADO_ENROLADO_BIOMETRICO 
        ,EMPLEADO_CSC_EMPLEADO_ENROLADOR 
        ,EMPLEADO_HUELLA_FECHA_ALTA 
        ,EMPLEADO_HUELLA_FECHA_MODIFICA 
        ,EMPLEADO_ENTREVISTADOR_CSC 
        ,EMPLEADO_RECLUTADOR_CSC 
        ,EMPRESA_LABORAL_CSC 
        ,CLIENTE_CSC 
        ,PM_CSC_PROYECTO 
        ,CAM_CSC_SERVICIO 
        ,REQ_CSCREQUISICION 
        ,TIMESTAMPDIFF(YEAR,EMPLEADO_FECHA_NACIMIENTO,NOW()) AS EDAD 
        ,YEAR(EMPLEADO_FECH_INGRESOEMP) AS ANIO 
        ,MONTH(EMPLEADO_FECH_INGRESOEMP) AS MES 
        ,YEAR(EMPLEADO_FECH_BAJAEMPLEADO) AS ANIO_BAJA 
        ,MONTH(EMPLEADO_FECH_BAJAEMPLEADO) AS MES_BAJA 
        ,YEAR(EMPLEADO_FECH_INICIAOPERACION) AS ANIO_OPE
        ,MONTH(EMPLEADO_FECH_INICIAOPERACION) AS MES_OPE 
        ,(TIMESTAMPDIFF(DAY,EMPLEADO_FECH_INGRESOEMP,EMPLEADO_FECH_BAJAEMPLEADO) / 30 )  AS RANGO_MESES  
        
        FROM SAMT_EMPLEADOS 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `;

        if (req.query.TIPO_CONSULTA == "ACTIVOS") {


            query += ` AND ESTATUS_PROCESO_EMP_CSC = (SELECT CAT_ESTATUS_PROCESO_EMP_CSC FROM SAMT_CAT_ESTATUS_PROCESO_MPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND CAT_ESTATUS_PROCESO_EMP_CLAVE = 'ACT' )
             AND EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
             AND EMPRESA_LABORAL_CSC = ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)}
             AND EMPLEADO_CVEESTATUS = ${__Request_Pool.escape(req.query.EMPLEADO_CVEESTATUS)}`;

            if (req.query.ANIOS) {
                query += " AND EXTRACT(YEAR FROM EMPLEADO_FECH_INGRESOEMP) IN (" + __Request_Pool.escape(req.query.ANIOS) + ") ";
            }

            if (req.query.MES) {
                query += ` AND EXTRACT(MONTH FROM EMPLEADO_FECH_INGRESOEMP) = ${__Request_Pool.escape(req.query.MES)}`;
            }

            if (req.query.CLIENTE_CSC) {
                query += ` AND CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)}`;
            }

            if (req.query.PM_CSC_PROYECTO) {
                query += ` AND PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)}`;
            }

            if (req.query.CAM_CSC_SERVICIO) {
                query += ` AND CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
            }

            if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
                query += ` AND CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
            }

            if (req.query.CAT_PUESTO_CSCEMPLEADO) {
                query += ` AND CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
            }

            if (req.query.REQ_CSCREQUISICION) {
                query += ` AND REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
            }

        }
        else if (req.query.TIPO_CONSULTA == "BAJAS") {

            query += ` AND CAT_SUBPROCESO_EMP_CSC IN ( SELECT CAT_SUBPROCESO_EMP_CSC FROM SAMT_CAT_SUBPROCESO_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND  CAT_SUBPROCESO_EMP_CLAVE = 'BAJA' ) 
             AND EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL 
             AND EMPRESA_LABORAL_CSC= ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)} `;

            if (req.query.ANIOS) {
                query += ` AND EXTRACT(YEAR FROM EMPLEADO_FECH_BAJAEMPLEADO) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
            }

            if (req.query.MES) {
                query += ` AND EXTRACT(MONTH FROM EMPLEADO_FECH_BAJAEMPLEADO) = ${__Request_Pool.escape(req.query.MES)} `;
            }

            if (req.query.CLIENTE_CSC) {
                query += ` AND CLIENTE_CSC= ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
            }

            if (req.query.PM_CSC_PROYECTO) {
                query += ` AND PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)} `;
            }

            if (req.query.CAM_CSC_SERVICIO) {
                query += ` AND CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
            }

            if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
                query += ` AND CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
            }

            if (req.query.CAT_PUESTO_CSCEMPLEADO) {
                query += ` AND CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
            }

            if (req.query.REQ_CSCREQUISICION) {
                query += ` AND REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
            }

        }
        else if (req.query.TIPO_CONSULTA == "INGRESOS") {
            query += ` AND EMPLEADO_FECH_INGRESOEMP IS NOT NULL
             AND EMPLEADO_FECH_INICIAOPERACION IS NOT NULL
             AND EMPRESA_LABORAL_CSC = ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)}
             AND EMPLEADO_CVEESTATUS = ${__Request_Pool.escape(req.query.EMPLEADO_CVEESTATUS)}`;

            if (req.query.ANIOS) {
                query += " AND EXTRACT(YEAR FROM EMPLEADO_FECH_INICIAOPERACION) IN (" + req.query.ANIOS + ") ";
            }

            if (req.query.MES) {
                query += ` AND EXTRACT(MONTH FROM EMPLEADO_FECH_INICIAOPERACION) = ${__Request_Pool.escape(req.query.MES)} `;
            }


            if (req.query.CLIENTE_CSC) {
                query += ` AND CLIENTE_CSC= ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
            }

            if (req.query.PM_CSC_PROYECTO) {
                query += ` AND PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)} `;
            }

            if (req.query.CAM_CSC_SERVICIO) {
                query += ` AND CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
            }

            if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
                query += ` AND CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
            }

            if (req.query.CAT_PUESTO_CSCEMPLEADO) {
                query += ` AND CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
            }

            if (req.query.REQ_CSCREQUISICION) {
                query += ` AND REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
            }

        }


        query += ';--'


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


exports.DeleteEmpleadoReferencia = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = ` DELETE FROM SAMT_EMPLEADO_REFERENCIAS WHERE EMPLEADO_REFERENCIA_CSC = ${__Request_Pool.escape(req.body.EMPLEADO_REFERENCIA_CSC)}  `;

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
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


exports.DeleteEmpleadoExperienciaLaboral = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = ` DELETE FROM SAMT_EMPLEADO_EXPERIENCIA_LABORAL WHERE EMPLEADO_EXPERIENCIA_CSC = ${__Request_Pool.escape(req.body.EMPLEADO_EXPERIENCIA_CSC)}  `;

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
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


exports.DeleteGradoEstudios = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = ` DELETE FROM SAMT_EMPLEADO_ESTUDIOS WHERE EMPLEADO_ESTUDIO_CSC = ${__Request_Pool.escape(req.body.EMPLEADO_ESTUDIO_CSC)}  `;

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows[0], JsonData: resultReturn.insertId };
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

exports.Insert_Mesa_Empleado_Genera = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_CAM_MESA_EMPLEADOS_GENERA SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Del_Mesa_Empleado_Genera = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var d1 = __Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST);
        var d2 = __Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO);
        var d3 = __Request_Pool.escape(req.body.CAM_MESA_CSC);

        var query = "DELETE FROM SAMT_CAM_MESA_EMPLEADOS_GENERA WHERE EMP_CSC_EMPRESA_HOST = ? AND EMPLEADO_CSC_EMPLEADO = ? AND CAM_MESA_CSC = ?";
        __Request_Pool.query(query, [d1, d2, d3], function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Dashboard_Ingresos_Reclutamiento = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = `
        SELECT 
        EMPLEADOS.*
        ,SOLICITUD.*
        
        FROM SAMT_EMPLEADOS AS EMPLEADOS
        
        INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD ON
        EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
        AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
        
        WHERE
        EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `;
        if (req.query.ANIOS) {
            query += ` AND EXTRACT(YEAR FROM EMPLEADOS.AUDITORIA_FEC_ALTA) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
        }
        if (req.query.MES) {
            query += ` AND EXTRACT(MONTH FROM EMPLEADOS.AUDITORIA_FEC_ALTA) IN (${__Request_Pool.escape(req.query.MES)}) `;
        }
        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            query += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC = ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }
        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            query += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO = ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }
        if (req.query.EMPLEADO_SITE_CSC) {
            query += ` AND EMPLEADOS.EMPLEADO_SITE_CSC = ${__Request_Pool.escape(req.query.EMPLEADO_SITE_CSC)} `;
        }
        query += ';--'
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

exports.Get_Dashboard_Reclutamiento_General = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        let extraData = ``;
        let extraDataEntrevista = ``;

        if (req.query.ANIOS) {
            switch (req.query.TIPODASHBOARD) {
                case 'RECLUTAMIENTO_CONTEOS_GRAL':
                    extraData += ` AND EXTRACT(YEAR FROM CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                case 'RECLUTAMIENTO_CAPACITACION_DIA':
                    extraData += ` AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_CAPACITACION) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                case 'RECLUTAMIENTO_CAMPANIA_CAPA':
                    extraData += ` AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_CAPACITACION) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                case 'RECLUTAMIENTO_PISO_DIA':
                    extraData += ` AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                case 'RECLUTAMIENTO_CAMPANIA_PISO':
                    extraData += ` AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                case 'RECLUTAMIENTO_DESERTO_SELECCION':
                    extraData += ` AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                case 'RECLUTAMIENTO_DESERTO_CAPA':
                    extraData += ` AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
                    break;
                default:
                    extraData += ` AND EXTRACT(YEAR FROM CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) IN (${__Request_Pool.escape(req.query.ANIOS)}) `;
            }
        }

        if (req.query.MES) {
            switch (req.query.TIPODASHBOARD) {
                case 'RECLUTAMIENTO_CONTEOS_GRAL':
                    extraData += ` AND EXTRACT(MONTH FROM CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                case 'RECLUTAMIENTO_CAPACITACION_DIA':
                    extraData += ` AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_CAPACITACION) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                case 'RECLUTAMIENTO_CAMPANIA_CAPA':
                    extraData += ` AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_CAPACITACION) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                case 'RECLUTAMIENTO_PISO_DIA':
                    extraData += ` AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                case 'RECLUTAMIENTO_CAMPANIA_PISO':
                    extraData += ` AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                case 'RECLUTAMIENTO_DESERTO_SELECCION':
                    extraData += ` AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                case 'RECLUTAMIENTO_DESERTO_CAPA':
                    extraData += ` AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) IN (${__Request_Pool.escape(req.query.MES)}) `;
                    break;
                default:
                    extraData += ` AND EXTRACT(MONTH FROM CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) IN (${__Request_Pool.escape(req.query.MES)}) `;
            }
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC = ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO = ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.EMPLEADO_SITE_CSC) {
            extraData += ` AND EMPLEADOS.EMPLEADO_SITE_CSC = ${__Request_Pool.escape(req.query.EMPLEADO_SITE_CSC)} `;
            extraDataEntrevista += ` AND EMPLEADOS.EMPLEADO_SITE_CSC = ${__Request_Pool.escape(req.query.EMPLEADO_SITE_CSC)} `;
        }

        if (req.query.TIPO_EMPRESA_RECLUTA_CSC) {
            extraData += ` AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN (${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)}) `;
            extraDataEntrevista += ` AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN (${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)}) `;
        }




        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_SITE') {
            query = `SELECT
            SAMT_REQUISICIONES.REQ_NOMBREAREA AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_REQUISICIONES
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_REQUISICIONES.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_SITE_CSC = SAMT_REQUISICIONES.REQ_CSCREQUISICION
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_MEDIO') {
            query = `SELECT
            SAMT_TIPO_MEDIO_ENTERO.SAMT_TIPO_MEDIO_IDIOMA1 AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_TIPO_MEDIO_ENTERO
            ON SOLICITUD.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_MEDIO_ENTERO.EMP_CSC_EMPRESA_HOST
            AND SOLICITUD.SOLICITUD_TIPO_MEDIO_CSC = SAMT_TIPO_MEDIO_ENTERO.SAMT_TIPO_MEDIO_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            LIMIT 10`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_CAMPANIA_CAPA') {
            query = `SELECT
            SAMT_PROYECTOS.PM_NOMBRE AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_PROYECTOS
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_PROYECTOS.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.PM_CSC_PROYECTO = SAMT_PROYECTOS.PM_CSC_PROYECTO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            AND EMPLEADOS.EMPLEADO_FECH_CAPACITACION IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (2,4)
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_CAMPANIA_PISO') {
            query = `SELECT
            SAMT_PROYECTOS.PM_NOMBRE AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_PROYECTOS
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_PROYECTOS.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.PM_CSC_PROYECTO = SAMT_PROYECTOS.PM_CSC_PROYECTO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            AND EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (4)
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_INGRESOS_DIA') {
            query = `SELECT
            CONCAT(
            CASE MONTH(CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00'))
                    WHEN 1 THEN 'ENE'
                    WHEN 2 THEN 'FEB'
                    WHEN 3 THEN 'MAR'
                    WHEN 4 THEN 'ABR'
                    WHEN 5 THEN 'MAY'
                    WHEN 6 THEN 'JUN'
                    WHEN 7 THEN 'JUL'
                    WHEN 8 THEN 'AGO'
                    WHEN 9 THEN 'SEP'
                    WHEN 10 THEN 'OCT'
                    WHEN 11 THEN 'NOV'
                    WHEN 12 THEN 'DIC'
            END,'-'
            ,DAY(CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00'))
            ) AS DESCRIPCION
            ,DAY(CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) AS DIA
            ,MONTH(CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) AS MES
            ,RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.AUDITORIA_FEC_ALTA,'+00:00','-06:00')),2)  AS ANIO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            GROUP BY DESCRIPCION, DIA, MES, ANIO
            ORDER BY DIA ASC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_CAPACITACION_DIA') {
            query = `SELECT
            CONCAT(
            CASE MONTH(EMPLEADOS.EMPLEADO_FECH_CAPACITACION)
                    WHEN 1 THEN 'ENE'
                    WHEN 2 THEN 'FEB'
                    WHEN 3 THEN 'MAR'
                    WHEN 4 THEN 'ABR'
                    WHEN 5 THEN 'MAY'
                    WHEN 6 THEN 'JUN'
                    WHEN 7 THEN 'JUL'
                    WHEN 8 THEN 'AGO'
                    WHEN 9 THEN 'SEP'
                    WHEN 10 THEN 'OCT'
                    WHEN 11 THEN 'NOV'
                    WHEN 12 THEN 'DIC'
            END,'-'
            ,DAY(EMPLEADOS.EMPLEADO_FECH_CAPACITACION)
            ) AS DESCRIPCION
            ,DAY(EMPLEADOS.EMPLEADO_FECH_CAPACITACION) AS DIA
            ,MONTH(EMPLEADOS.EMPLEADO_FECH_CAPACITACION) AS MES
            ,RIGHT(YEAR(EMPLEADOS.EMPLEADO_FECH_CAPACITACION),2) AS ANIO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            AND EMPLEADOS.EMPLEADO_FECH_CAPACITACION IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (2,4)
            GROUP BY DESCRIPCION, DIA, MES, ANIO
            ORDER BY DIA ASC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_PISO_DIA') {
            query = `SELECT
            CONCAT(
            CASE MONTH(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION,'+00:00','-06:00'))
                    WHEN 1 THEN 'ENE'
                    WHEN 2 THEN 'FEB'
                    WHEN 3 THEN 'MAR'
                    WHEN 4 THEN 'ABR'
                    WHEN 5 THEN 'MAY'
                    WHEN 6 THEN 'JUN'
                    WHEN 7 THEN 'JUL'
                    WHEN 8 THEN 'AGO'
                    WHEN 9 THEN 'SEP'
                    WHEN 10 THEN 'OCT'
                    WHEN 11 THEN 'NOV'
                    WHEN 12 THEN 'DIC'
            END,'-'
            ,DAY(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION,'+00:00','-06:00'))
            ) AS DESCRIPCION
            ,DAY(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION,'+00:00','-06:00')) AS DIA
            ,MONTH(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION,'+00:00','-06:00')) AS MES
            ,RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION,'+00:00','-06:00')),2) AS ANIO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            AND EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (4)
            GROUP BY DESCRIPCION, DIA, MES, ANIO
            ORDER BY DIA ASC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_SUBPROCESOS') {
            query = `SELECT
            SAMT_CAT_SUBPROCESO_EMPLEADOS.CAT_SUBPROCESO_EMP_IDIOMA1 AS DESCRIPCION
            ,SAMT_CAT_SUBPROCESO_EMPLEADOS.CAT_SUBPROCESO_EMP_ORDEN AS ORDEN
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAT_SUBPROCESO_EMPLEADOS
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_CAT_SUBPROCESO_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.CAT_SUBPROCESO_EMP_CSC = SAMT_CAT_SUBPROCESO_EMPLEADOS.CAT_SUBPROCESO_EMP_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            GROUP BY DESCRIPCION,ORDEN
            ORDER BY ORDEN ASC;`
        }

        if (req.query.TIPODASHBOARD === 'ESTADO_NACIMIENTO') {
            query = `SELECT
            IFNULL(SAMT_ESTADOS.EDO_DESCESTADO,'SIN DATO') AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_ESTADOS
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_ESTADOS.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_LUGAR_NACIMIENTO_CSCESTADO = SAMT_ESTADOS.EDO_CSCESTADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            LIMIT 5;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_DESERTO_SELECCION') {
            query = `SELECT
            IFNULL(SAMT_EMP_TREE_BAJA.EMP_TREE_IDIOMA1,'SIN DATO') AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_EMP_TREE_BAJA
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_EMP_TREE_BAJA.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.CAT_EMP_TREE_BAJA_CSC  = SAMT_EMP_TREE_BAJA.EMP_TREE_BAJA_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            AND EMPLEADOS.CAT_SUBPROCESO_EMP_CSC = 7
            AND EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL
            GROUP BY DESCRIPCION
            ORDER BY DESCRIPCION ASC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_DESERTO_CAPA') {
            query = `SELECT
            IFNULL(SAMT_EMP_TREE_BAJA.EMP_TREE_IDIOMA1,'SIN DATO') AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_EMP_TREE_BAJA
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_EMP_TREE_BAJA.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.CAT_EMP_TREE_BAJA_CSC  = SAMT_EMP_TREE_BAJA.EMP_TREE_BAJA_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            ${extraData}
            AND EMPLEADOS.CAT_SUBPROCESO_EMP_CSC = 11
            AND EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL
            GROUP BY DESCRIPCION
            ORDER BY DESCRIPCION ASC;`
        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_CONTEOS') {
            query = `(SELECT 'Entrevista' AS DESCRIPCION, COUNT(DISTINCT EMPLEADOS_DETALLE.EMPLEADO_CSC_EMPLEADO) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS_PROCESO_DETALLE AS EMPLEADOS_DETALLE
            LEFT JOIN SAMT_EMPLEADOS AS EMPLEADOS
			ON EMPLEADOS_DETALLE.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
			AND EMPLEADOS_DETALLE.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS_DETALLE.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            AND EMPLEADOS_DETALLE.CAT_SUBPROCESO_EMP_CSC IN (SELECT CAT_SUBPROCESO_EMP_CSC 
            FROM SAMT_CAT_SUBPROCESO_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} 
            AND CAT_SUBPROCESO_EMP_CLAVE IN ('ENNTRE'))
            AND EXTRACT(YEAR FROM CONVERT_TZ(EMPLEADOS_DETALLE.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) IN ('${req.query.ANIOS}')  
            AND EXTRACT(MONTH FROM CONVERT_TZ(EMPLEADOS_DETALLE.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) IN ('${req.query.MES}')  
			${extraDataEntrevista}
            )
            UNION
            (
            SELECT 'Capacitacion' AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_CAPACITACION) IN ('${req.query.ANIOS}')  
            AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_CAPACITACION) IN ('${req.query.MES}')  
            AND EMPLEADOS.EMPLEADO_FECH_CAPACITACION IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (2,4)
            AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN (${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)}) 
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            )
            UNION
            (
            SELECT 'En Piso' AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN ('${req.query.ANIOS}')  
            AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN ('${req.query.MES}')  
            AND EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (4)
            AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN (${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)}) 
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            )
            UNION
            (
            SELECT 'Activos' AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN ('${req.query.ANIOS}')  
            AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_INICIAOPERACION) IN ('${req.query.MES}') 
            AND EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (4)
            AND EMPLEADOS.ESTATUS_PROCESO_EMP_CSC = 2
            AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN (${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)}) 
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            )
            UNION
            (
            SELECT '+ 15 Dias' AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
            AND EXTRACT(YEAR FROM EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO) IN ('${req.query.ANIOS}')  
            AND EXTRACT(MONTH FROM EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO) IN ('${req.query.MES}') 
            AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN (${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)}) 
            AND EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (2,4)
            AND CASE WHEN EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL THEN DATEDIFF(EMPLEADO_FECH_BAJAEMPLEADO, EMPLEADO_FECH_FIRMACONTRATO)
                    ELSE DATEDIFF(NOW(), EMPLEADO_FECH_FIRMACONTRATO) END >= 15
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            )`


        }

        if (req.query.TIPODASHBOARD === 'RECLUTAMIENTO_CONTEOS_GRAL') {
            query = `(SELECT 
                'REGISTROS_UNICOS' AS DESCRIPCION
                ,COUNT(DISTINCT AGENDA.EMPLEADO_CSC_EMPLEADO) AS TOTAL_EMP
                FROM SAMT_EMPLEADOS AS EMPLEADOS
                INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
                ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
                AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
                INNER JOIN SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
                ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = AGENDA.EMP_CSC_EMPRESA_HOST
                AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = AGENDA.EMPLEADO_CSC_EMPLEADO
                WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
                ${extraData}
                )
                UNION
                (SELECT 
                'TOTAL_CITAS' AS DESCRIPCION
                ,COUNT(*) AS TOTAL_EMP
                FROM SAMT_EMPLEADOS AS EMPLEADOS
                INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD 
                ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST
                AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = SOLICITUD.EMPLEADO_CSC_EMPLEADO
                INNER JOIN SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
                ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = AGENDA.EMP_CSC_EMPRESA_HOST
                AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO = AGENDA.EMPLEADO_CSC_EMPLEADO
                WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
                ${extraData}
                )`

        }

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





exports.GetCatorcenaActual = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = ` SELECT * FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

        if (req.query.TIPO_CONSULTA == 'ACTUAL') {
            query += ` AND ${__Request_Pool.escape(req.query.FECHA_ACTUAL)} >= SAMT_CAL_CATORCENA_F1 AND ${__Request_Pool.escape(req.query.FECHA_ACTUAL)} <= SAMT_CAL_CATORCENA_F2`;
        }
        else if (req.query.TIPO_CONSULTA == 'MENSUAL') {
            query += ` AND SAMT_CAL_CATORCENA_ANIO = @SAMT_CAL_CATORCENA_ANIO AND SAMT_CAL_CATORCENA_MES = @SAMT_CAL_CATORCENA_MES`;
        }
        else if (req.query.TIPO_CONSULTA == 'ANUAL') {
            query += ` AND SAMT_CAL_CATORCENA_ANIO = @SAMT_CAL_CATORCENA_ANIO`;
        }
        else if (req.query.TIPO_CONSULTA == 'FECHA_FRECUENCIA') {
            query += ` AND Convert(Char(10), DATEADD(DAY,-1,@FECHA_BUSQEEDA), 126) >= SAMT_CAL_CATORCENA_F1 AND Convert(Char(10), DATEADD(DAY,-1,@FECHA_BUSQEEDA), 126) <= SAMT_CAL_CATORCENA_F2 AND TIPO_FRECUENCIA_CSC = @TIPO_FRECUENCIA_CSC`;
        }
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

exports.GetProgTrabajoEmpleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = `SELECT DATE_FORMAT(CCPTD.PROGRAMA_TRABAJO_FECHA, '%d-%m-%Y') as FechaFomato 
        ,DAYNAME(CCPTD.PROGRAMA_TRABAJO_FECHA) AS NOMBRE_DIA 
        ,DAY(CCPTD.PROGRAMA_TRABAJO_FECHA) AS DIA 
        ,TIME_FORMAT(CCPTD.PROGRAMA_FECHA_JORNADA_ENTRADA, '%H:%i')  AS HORAENTRADA 
        ,TIME_FORMAT(CCPTD.PROGRAMA_FECHA_JORNADA_SALIDA, '%H:%i') AS HORASALIDA 
        ,IFNULL(TIME_FORMAT(CCPTD.PROGRAMA_FECHA_VIRTUAL_ENTRADA, '%H:%i'), '00:00') AS HORAENTRADAREGISTRO 
        ,IFNULL(TIME_FORMAT(CCPTD.PROGRAMA_FECHA_VIRTUAL_SALIDA, '%H:%i'), '00:00') AS HORASALIDAREGISTRO 
        ,CCPTD.* 
        ,TPO_B_JORNADA.TIPO_BASADO_EN_JORNADA_IDIOMA1 
        ,SUBTPO_B_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA 
        ,SUBTPO_B_JORNADA.SUB_BASADO_EN_JORNADA_IDIOMA1 
        ,SUBTPO_B_JORNADA.SUB_BASADO_EN_JORNADA_CLAVE 
        ,VIRTUALt.ESTATUS_VIRTUAL_IDIOMA1 

        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_TRABAJO_FECHA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') as fecha_formato_timezone
        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_TRABAJO_FECHA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') as fecha_dianame_timezone
        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_TRABAJO_FECHA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%d') as fecha_dia_timezone

        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_FECHA_JORNADA_ENTRADA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%H:%i') as fecha_horaentrada_timezone
        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_FECHA_JORNADA_SALIDA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%H:%i') as fecha_horasalida_timezone
        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_FECHA_VIRTUAL_ENTRADA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%H:%i') as fecha_horaentradaregistro_timezone
        ,DATE_FORMAT(CONVERT_TZ(CCPTD.PROGRAMA_FECHA_VIRTUAL_SALIDA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%H:%i') as fecha_horasalidaregistro_timezone

        FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO AS CCPTD  
        LEFT JOIN SAMT_EMPLEADOS  
        ON CCPTD.EMP_CSC_EMPRESA_HOST=SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST AND CCPTD.EMPLEADO_CSC_EMPLEADO=SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO 
        LEFT JOIN SAMT_PF_TIPO_BASADO_EN_JORNADA AS TPO_B_JORNADA  
        ON TPO_B_JORNADA.TPF_CSC_TIPO_BASADO_EN_JORNADA = CCPTD.TPF_CSC_TIPO_BASADO_EN_JORNADA AND TPO_B_JORNADA.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
        LEFT JOIN SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA AS SUBTPO_B_JORNADA  
        ON SUBTPO_B_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA = CCPTD.TPF_CSC_SUB_BASADO_EN_JORNADA AND SUBTPO_B_JORNADA.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
        LEFT JOIN SAMT_PF_ESTATUS_VIRTUAL AS VIRTUALt  
        ON VIRTUALt.TPF_CSC_ESTATUS_VIRTUAL = CCPTD.TPF_CSC_ESTATUS_VIRTUAL AND VIRTUALt.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
        WHERE CCPTD.EMP_CSC_EMPRESA_HOST= ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND CCPTD.PROGRAMA_TRABAJO_FECHA>= ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_F1)}
        AND CCPTD.PROGRAMA_TRABAJO_FECHA<= ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_F2)}
        AND SAMT_EMPLEADOS.EMPLEADO_ID_EXTERNO=${__Request_Pool.escape(req.query.EMPLEADO_ID_EXTERNO)} ORDER BY CCPTD.PROGRAMA_TRABAJO_FECHA ASC;`;

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

exports.GetSupervisionEmpl = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        var extraDataWhere = "";

        if (req.query.CAT_PROCESO_EMP_CSC) {
            extraDataWhere += ` AND E.CAT_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC)}`
        }

        if (req.query.CAT_SUBPROCESO_EMP_CSC) {
            extraDataWhere += ` AND E.CAT_SUBPROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC)}`
        }

        if (req.query.ESTATUS_PROCESO_EMP_CSC) {
            extraDataWhere += ` AND E.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}`
        }


        query = `WITH RECURSIVE all_reports AS (
            SELECT
                E.EMP_CSC_EMPRESA_HOST as EMP_CSC_EMPRESA_HOST,
                E.EMPLEADO_CSC_EMPLEADO AS EMPLEADO_CSC_EMPLEADO,
                E.EMPLEADO_ID_EXTERNO,
                CONCAT(E.EMPLEADO_NOMBREEMPLEADO, ' ',E.EMPLEADO_APATERNOEMPLEADO, ' ',E.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE,
                E.EMPLEADO_CSC_EMPLEADO_PADRE,
                E.CAT_PROCESO_EMP_CSC,
                1 AS level
            FROM
                SAMT_EMPLEADOS AS E
            WHERE
                E.EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
                AND E.EMPLEADO_CSC_EMPLEADO_PADRE =  ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO_PADRE)} 
                ${extraDataWhere}
            UNION ALL
            SELECT
                E.EMP_CSC_EMPRESA_HOST as EMP_CSC_EMPRESA_HOST,
                E.EMPLEADO_CSC_EMPLEADO AS EMPLEADO_CSC_EMPLEADO,
                E.EMPLEADO_ID_EXTERNO,
                CONCAT(E.EMPLEADO_NOMBREEMPLEADO, ' ',E.EMPLEADO_APATERNOEMPLEADO, ' ',E.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE,
                E.EMPLEADO_CSC_EMPLEADO_PADRE,
                E.CAT_PROCESO_EMP_CSC,
                AR.level + 1
            FROM
                SAMT_EMPLEADOS AS E
                JOIN all_reports AS AR ON E.EMPLEADO_CSC_EMPLEADO_PADRE = AR.EMPLEADO_CSC_EMPLEADO AND AR.EMP_CSC_EMPRESA_HOST = E.EMP_CSC_EMPRESA_HOST
            WHERE
                E.EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
                ${extraDataWhere}
        )
        SELECT * FROM all_reports ORDER BY level,EMPLEADO_CSC_EMPLEADO;`;

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


exports.GetHeadCount_Resumen = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.TIPO_CONSULTA == 'RESUMEN_APP') {
            query = `SELECT
        SAMT_CLIENTES.CLIENTE_NOMBRE AS CLIENTE
        ,SAMT_PROYECTOS.PM_NOMBRE AS CAMPANIA
        ,SAMT_CAM_SERVICIO.CAM_SERVICIO_NOMBRE AS SUBCAMPANIA
        ,SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO
        ,COUNT(*) AS NO_PLAZAS
        ,(SELECT COUNT(*) FROM SAMT_HEADCOUNT_AUTORIZADO
            LEFT JOIN SAMT_ESTATUS_HEADCOUNT ON SAMT_HEADCOUNT_AUTORIZADO.TIPO_ESTATUS_HEADCOUNT_CSC = SAMT_ESTATUS_HEADCOUNT.ESTATUS_HEADCOUNT_CSC
            WHERE SAMT_ESTATUS_HEADCOUNT.ESTATUS_CLAVE='VAC' AND SAMT_HEADCOUNT_AUTORIZADO.CAM_CSC_SERVICIO = RESUMEN.CAM_CSC_SERVICIO) AS VACANTES
        ,(SELECT COUNT(*) FROM SAMT_HEADCOUNT_AUTORIZADO
            LEFT JOIN SAMT_ESTATUS_HEADCOUNT ON SAMT_HEADCOUNT_AUTORIZADO.TIPO_ESTATUS_HEADCOUNT_CSC = SAMT_ESTATUS_HEADCOUNT.ESTATUS_HEADCOUNT_CSC
            WHERE SAMT_ESTATUS_HEADCOUNT.ESTATUS_CLAVE='CUB' AND SAMT_HEADCOUNT_AUTORIZADO.CAM_CSC_SERVICIO = RESUMEN.CAM_CSC_SERVICIO) AS CONTRATADAS
        ,(SELECT COUNT(*) FROM SAMT_HEADCOUNT_AUTORIZADO
            LEFT JOIN SAMT_ESTATUS_HEADCOUNT ON SAMT_HEADCOUNT_AUTORIZADO.TIPO_ESTATUS_HEADCOUNT_CSC = SAMT_ESTATUS_HEADCOUNT.ESTATUS_HEADCOUNT_CSC
            WHERE SAMT_ESTATUS_HEADCOUNT.ESTATUS_CLAVE='PRO' AND SAMT_HEADCOUNT_AUTORIZADO.CAM_CSC_SERVICIO = RESUMEN.CAM_CSC_SERVICIO) AS CONGELADA
        ,(SELECT COUNT(*) FROM SAMT_HEADCOUNT_AUTORIZADO
            LEFT JOIN SAMT_ESTATUS_HEADCOUNT ON SAMT_HEADCOUNT_AUTORIZADO.TIPO_ESTATUS_HEADCOUNT_CSC = SAMT_ESTATUS_HEADCOUNT.ESTATUS_HEADCOUNT_CSC
            WHERE SAMT_ESTATUS_HEADCOUNT.ESTATUS_CLAVE='CAN' AND SAMT_HEADCOUNT_AUTORIZADO.CAM_CSC_SERVICIO = RESUMEN.CAM_CSC_SERVICIO) AS CANCELADA
        ,(SELECT COUNT(*) FROM SAMT_HEADCOUNT_AUTORIZADO
            LEFT JOIN SAMT_ESTATUS_HEADCOUNT ON SAMT_HEADCOUNT_AUTORIZADO.TIPO_ESTATUS_HEADCOUNT_CSC = SAMT_ESTATUS_HEADCOUNT.ESTATUS_HEADCOUNT_CSC
            WHERE SAMT_ESTATUS_HEADCOUNT.ESTATUS_CLAVE='VIR' AND SAMT_HEADCOUNT_AUTORIZADO.CAM_CSC_SERVICIO = RESUMEN.CAM_CSC_SERVICIO) AS VIRTUALD
        ,(SELECT COUNT(*) FROM SAMT_HEADCOUNT_AUTORIZADO 
            LEFT JOIN SAMT_ESTATUS_HEADCOUNT ON SAMT_HEADCOUNT_AUTORIZADO.TIPO_ESTATUS_HEADCOUNT_CSC = SAMT_ESTATUS_HEADCOUNT.ESTATUS_HEADCOUNT_CSC
            WHERE SAMT_ESTATUS_HEADCOUNT.ESTATUS_CLAVE='CUB' AND SAMT_HEADCOUNT_AUTORIZADO.CAM_CSC_SERVICIO = RESUMEN.CAM_CSC_SERVICIO) * 100 / COUNT(*) as POR_CUMPLIMIENTO
        
            FROM SAMT_HEADCOUNT_AUTORIZADO AS RESUMEN
            LEFT JOIN SAMT_CLIENTES ON RESUMEN.CLIENTE_CSC = SAMT_CLIENTES.CLIENTE_CSC
            LEFT JOIN SAMT_PROYECTOS ON RESUMEN.PM_CSC_PROYECTO = SAMT_PROYECTOS.PM_CSC_PROYECTO
            LEFT JOIN SAMT_CAM_SERVICIO ON RESUMEN.CAM_CSC_SERVICIO = SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO
            WHERE RESUMEN.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            GROUP BY  RESUMEN.CAM_CSC_SERVICIO ,SAMT_CLIENTES.CLIENTE_NOMBRE,SAMT_PROYECTOS.PM_NOMBRE,SAMT_CAM_SERVICIO.CAM_SERVICIO_NOMBRE,SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO ORDER BY SAMT_CLIENTES.CLIENTE_NOMBRE ASC;`;
        }

        else if (req.query.TIPO_CONSULTA == 'DATAGRID') {
            query = `SELECT HCA.EMP_CSC_EMPRESA_HOST, EST_HCA.ESTATUS_HC_IDIOMA1,SUBEST_HCA.SUBESTATUS_HC_IDIOMA1,CLI.CLIENTE_NOMBRE,CAMPA.PM_NOMBRE,SUB_CAMPA.CAM_SERVICIO_NOMBRE FROM SAMT_HEADCOUNT_AUTORIZADO AS HCA 
            INNER JOIN SAMT_CLIENTES AS CLI ON CLI.CLIENTE_CSC = HCA.CLIENTE_CSC AND CLI.EMP_CSC_EMPRESA_HOST = HCA.EMP_CSC_EMPRESA_HOST
            INNER JOIN SAMT_ESTATUS_HEADCOUNT AS EST_HCA ON EST_HCA.ESTATUS_HEADCOUNT_CSC = HCA.TIPO_ESTATUS_HEADCOUNT_CSC AND EST_HCA.EMP_CSC_EMPRESA_HOST = HCA.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_SUBESTATUS_HEADCOUNT AS SUBEST_HCA ON SUBEST_HCA.SUBESTATUS_HEADCOUNT_CSC = HCA.SUBESTATUS_HEADCOUNT_CSC AND SUBEST_HCA.EMP_CSC_EMPRESA_HOST = HCA.EMP_CSC_EMPRESA_HOST
            INNER JOIN SAMT_PROYECTOS AS CAMPA ON CAMPA.PM_CSC_PROYECTO = HCA.PM_CSC_PROYECTO AND CAMPA.EMP_CSC_EMPRESA_HOST = HCA.EMP_CSC_EMPRESA_HOST
            INNER JOIN SAMT_CAM_SERVICIO AS SUB_CAMPA ON SUB_CAMPA.CAM_CSC_SERVICIO = HCA.CAM_CSC_SERVICIO AND SUB_CAMPA.EMP_CSC_EMPRESA_HOST = HCA.EMP_CSC_EMPRESA_HOST
            WHERE HCA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ORDER BY CLI.CLIENTE_NOMBRE ASC, CAMPA.PM_NOMBRE ASC, SUB_CAMPA.CAM_SERVICIO_NOMBRE ASC;`
        }

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

exports.GetDataRh_Dashboard = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        var extraData = ``;

        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMP.CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
        }
        if (req.query.ANIOS) {
            if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
                extraData += " AND EXTRACT(YEAR FROM EMP.EMPLEADO_FECH_BAJAEMPLEADO) IN (" + __Request_Pool.escape(req.query.ANIOS) + ") ";
            } else {
                extraData += " AND EXTRACT(YEAR FROM EMP.EMPLEADO_FECH_FIRMACONTRATO) IN (" + __Request_Pool.escape(req.query.ANIOS) + ") ";
            }
        } else {
            if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')`
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)}, '%Y-%m-%d')`
            } else if (req.query.TIPODASHBOARD == 'EJE_CONTRATADOS') {
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')`
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)}, '%Y-%m-%d')`
            }

        }
        if (req.query.MES) {
            if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
                extraData += ` AND EXTRACT(MONTH FROM EMP.EMPLEADO_FECH_BAJAEMPLEADO) = ${__Request_Pool.escape(req.query.MES)}`;
            } else {
                extraData += ` AND EXTRACT(MONTH FROM EMP.EMPLEADO_FECH_FIRMACONTRATO) = ${__Request_Pool.escape(req.query.MES)}`;
            }

        }
        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMP.PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)}`;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMP.CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMP.CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMP.CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMP.REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
        }

        if (req.query.TIPODASHBOARD == 'EJE_CLIENTE') {
            query = `SELECT 
            IFNULL(CAT.CLIENTE_NOMBRE,'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CLIENTES AS CAT ON CAT.CLIENTE_CSC = EMP.CLIENTE_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_GENERO') {
            query = `SELECT 
            IFNULL(CAT.TIPO_SEXO_IDIOMA1,'SIN DATO') AS DESCRIPCION,
            IFNULL(CAT.TIPO_SEXO_CLAVE,'OTRO') AS CLAVE,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_SEXO AS CAT ON CAT.TIPO_SEXO_CSC = EMP.TIPO_SEXO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION,CLAVE ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_SITE') {
            query = `SELECT 
            IFNULL(CAT.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_REQUISICIONES AS CAT ON CAT.REQ_CSCREQUISICION = EMP.REQ_CSCREQUISICION AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_EDAD') {
            query = `SELECT
            CASE
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 0 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 17 THEN '0 a 17'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 18 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 28 THEN '18 a 28'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 29 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 39 THEN '29 a 39'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 40 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 50 THEN '40 a 50'
                ELSE 'Mayor a 51'
            END AS DESCRIPCION,
            CAT.TIPO_SEXO_IDIOMA1 AS TGEN,
            CAT.TIPO_SEXO_CLAVE AS CLAVE,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_SEXO AS CAT ON CAT.TIPO_SEXO_CSC = EMP.TIPO_SEXO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY TGEN,CLAVE,DESCRIPCION ORDER BY DESCRIPCION DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_CONTRATADOS') {
            query = `SELECT 
            MONTH(EMP.EMPLEADO_FECH_FIRMACONTRATO) as MES,
            YEAR(EMP.EMPLEADO_FECH_FIRMACONTRATO) as ANIO,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY ANIO,MES ORDER BY ANIO,MES ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
            query = `SELECT 
            MONTH(EMP.EMPLEADO_FECH_BAJAEMPLEADO) as MES,
            YEAR(EMP.EMPLEADO_FECH_BAJAEMPLEADO) as ANIO,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY ANIO,MES ORDER BY ANIO,MES ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PERFIL') {
            query = `SELECT 
            IFNULL(CAT.TIPO_EMPLEADO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_EMPLEADO AS CAT ON CAT.TIPO_EMPLEADO_CSCEMPLEADO = EMP.TIPO_EMPLEADO_EMPLEADO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_TPOCONTRATO') {
            query = `SELECT 
            IFNULL(CAT.TIPO_CONTRATO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_CONTRATO_EMPLEADOS AS CAT ON CAT.TIPO_CONTRATO_CSCCONTRATO = EMP.TIPO_CONTRATO_CSCCONTRATO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_TURNO') {
            query = `SELECT 
            IFNULL(CAT.TIPO_TURNO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_TURNO_EMPLEADOS AS CAT ON CAT.TIPO_TURNO_CSCTURNO = EMP.TIPO_TURNO_CSCTURNO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PUESTO') {
            query = `SELECT 
            IFNULL(CAT.CAT_CATEGORIA_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAT_CATEGORIA_PUESTO AS CAT ON CAT.CAT_CATEGORIA_PUESTO_CSC = EMP.CAT_CATEGORIA_PUESTO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PROCESO') {
            query = `SELECT 
            PR.CAT_PROCESO_EMP_IDIOMA1 AS DESCRIPCION
           ,COUNT(*) AS TOTAL_EMP FROM SAMT_EMPLEADOS AS EMP
           INNER JOIN SAMT_CAT_PROCESO_EMPLEADOS AS PR ON PR.CAT_PROCESO_EMP_CSC = EMP.CAT_PROCESO_EMP_CSC AND PR.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
           WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
           AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
           ${extraData}
           GROUP BY DESCRIPCION
           ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_AREA') {
            query = `SELECT 
            IFNULL(CAT.TIPO_AREA_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAT_EMPLEADO_AREA AS CAT ON CAT.TIPO_AREA_CSC = EMP.CAT_AREA_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_CAMPANIA') {
            query = `SELECT 
            IFNULL( CAT.PM_NOMBRE,'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_PROYECTOS AS CAT ON CAT.PM_CSC_PROYECTO = EMP.PM_CSC_PROYECTO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_SUBCAMPA') {
            query = `SELECT 
            IFNULL( CAT.CAM_SERVICIO_NOMBRE,'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAM_SERVICIO AS CAT ON CAT.CAM_CSC_SERVICIO = EMP.CAM_CSC_SERVICIO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

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

exports.GetDataRh_Dashboard_Concentra = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        let extraData = ``;

        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMP.CLIENTE_CSC IN (${req.query.CLIENTE_CSC}) `;
        }

        if (req.query.ANIOS) {
            if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
                extraData += " AND EXTRACT(YEAR FROM EMP.EMPLEADO_FECH_BAJAEMPLEADO) IN (" + req.query.ANIOS + ") ";
            } else {
                extraData += " AND EXTRACT(YEAR FROM EMP.EMPLEADO_FECH_FIRMACONTRATO) IN (" + req.query.ANIOS + ") ";
            }
        } else {
            if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')`
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)}, '%Y-%m-%d')`
            } else if (req.query.TIPODASHBOARD == 'EJE_CONTRATADOS') {
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')`
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)}, '%Y-%m-%d')`
            } else if (req.query.TIPODASHBOARD == 'EJE_MES_SITE') {
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')`
                extraData += ` AND DATE_FORMAT(EMP.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)}, '%Y-%m-%d')`
            } else {
                extraData += ``
            }
        }
        if (req.query.MES) {
            if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
                extraData += ` AND EXTRACT(MONTH FROM EMP.EMPLEADO_FECH_BAJAEMPLEADO) IN (${req.query.MES})`;
            } else {
                extraData += ` AND EXTRACT(MONTH FROM EMP.EMPLEADO_FECH_FIRMACONTRATO) IN (${req.query.MES})`;
            }

        }
      
        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMP.PM_CSC_PROYECTO IN (${req.query.PM_CSC_PROYECTO})`;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMP.CAM_CSC_SERVICIO IN (${req.query.CAM_CSC_SERVICIO}) `;
        }

        if (req.query.CAT_AREA_CSC) {
            extraData += ` AND EMP.CAT_AREA_CSC IN (${req.query.CAT_AREA_CSC}) `;
        }

        if (req.query.CAT_DEPARTAMENTO_CSC) {
            extraData += ` AND EMP.CAT_DEPARTAMENTO_CSC IN (${req.query.CAT_DEPARTAMENTO_CSC}) `;
        }

        if (req.query.PROCESO) {
            extraData += ` AND EMP.CAT_PROCESO_EMP_CSC IN (${req.query.PROCESO}) `;
        }

        if (req.query.PROCESO_FILTRO) {
            extraData += ` AND EMP.CAT_PROCESO_EMP_CSC IN (${req.query.PROCESO_FILTRO}) `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMP.CAT_CATEGORIA_PUESTO_CSC IN (${req.query.CAT_CATEGORIA_PUESTO_CSC})  `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMP.CAT_PUESTO_CSCEMPLEADO IN (${req.query.CAT_PUESTO_CSCEMPLEADO}) `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMP.REQ_CSCREQUISICION IN (${req.query.REQ_CSCREQUISICION})`;
        }

        if (req.query.TIPO_VISTA_CLAVE) {
            if (req.query.TIPO_VISTA_CLAVE == 'INFRA') {
                extraData += ` AND EMP.CAT_AREA_CSC IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                    WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')`;
            }

            if (req.query.TIPO_VISTA_CLAVE == 'OPE') {
                extraData += ` AND EMP.CAT_AREA_CSC NOT IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                        WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')
                        AND EMP.CAT_PUESTO_CSCEMPLEADO IN (SELECT TIPO_PUESTO_CSCEMPLEADO FROM SAMT_TIPO_PUESTO_EMPLEADO WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_PUESTO_CLAVE ='EVC')`;
            }

            if (req.query.TIPO_VISTA_CLAVE == 'ADMIN') {
                extraData += ` AND EMP.CAT_AREA_CSC NOT IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                        WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')
                        AND EMP.CAT_PUESTO_CSCEMPLEADO NOT IN (SELECT TIPO_PUESTO_CSCEMPLEADO FROM SAMT_TIPO_PUESTO_EMPLEADO WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_PUESTO_CLAVE ='EVC')`;
            }
        }

        if (req.query.TIPODASHBOARD == 'EJE_CLIENTE') {
            query = `SELECT 
            IFNULL(CAT.CLIENTE_NOMBRE,'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CLIENTES AS CAT ON CAT.CLIENTE_CSC = EMP.CLIENTE_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_GENERO') {
            query = `SELECT 
            IFNULL(CAT.TIPO_SEXO_IDIOMA1,'SIN DATO') AS DESCRIPCION,
            IFNULL(CAT.TIPO_SEXO_CLAVE,'OTRO') AS CLAVE,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_SEXO AS CAT ON CAT.TIPO_SEXO_CSC = EMP.TIPO_SEXO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION,CLAVE ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_SITE') {
            query = `SELECT 
            IFNULL(CAT.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_REQUISICIONES AS CAT ON CAT.REQ_CSCREQUISICION = EMP.REQ_CSCREQUISICION AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_EDAD') {
            query = `SELECT
            CASE
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 0 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 17 THEN '0 a 17'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 18 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 28 THEN '18 a 28'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 29 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 39 THEN '29 a 39'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 40 AND FLOOR(DATEDIFF(CURDATE(), EMP.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 50 THEN '40 a 50'
                ELSE 'Mayor a 51'
            END AS DESCRIPCION,
            CAT.TIPO_SEXO_IDIOMA1 AS TGEN,
            CAT.TIPO_SEXO_CLAVE AS CLAVE,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_SEXO AS CAT ON CAT.TIPO_SEXO_CSC = EMP.TIPO_SEXO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY TGEN,CLAVE,DESCRIPCION ORDER BY DESCRIPCION DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_CONTRATADOS') {
            query = `SELECT 
            MONTH(EMP.EMPLEADO_FECH_FIRMACONTRATO) as MES,
            RIGHT(YEAR(EMP.EMPLEADO_FECH_FIRMACONTRATO),2) as ANIO,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY ANIO,MES ORDER BY ANIO,MES ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES_POR_MOTIVO') {
            query = ` SELECT 
            COUNT(EMP.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVOPARENTPARENT.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(CONVERT_TZ(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','-06:00')), 2)
                ) AS MES_ANIO_BAJA
            ,MONTH(CONVERT_TZ(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','-06:00')) AS MES
            ,RIGHT(YEAR(CONVERT_TZ(EMP.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','-06:00')),2)  AS ANIO

            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMP.CAT_EMP_TREE_BAJA_CSC
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENT ON
            MOTIVOPARENT.EMP_CSC_EMPRESA_HOST = MOTIVO.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENT.EMP_TREE_BAJA_CSC = MOTIVO.EMP_TREE_BAJA_PARENT
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENTPARENT ON
            MOTIVOPARENTPARENT.EMP_CSC_EMPRESA_HOST = MOTIVOPARENT.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENTPARENT.EMP_TREE_BAJA_CSC = MOTIVOPARENT.EMP_TREE_BAJA_PARENT


            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.CAT_PROCESO_EMP_CSC IN (2,4)
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION,MES_ANIO_BAJA,MES,ANIO
            ORDER BY MES,ANIO ASC `;

        }

        if (req.query.TIPODASHBOARD == 'EJE_BAJAS') {
            query = `SELECT 
            MONTH(EMP.EMPLEADO_FECH_BAJAEMPLEADO) as MES,
            RIGHT(YEAR(EMP.EMPLEADO_FECH_BAJAEMPLEADO),2) as ANIO,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND CAT_SUBPROCESO_EMP_CSC IN ( 
                SELECT CAT_SUBPROCESO_EMP_CSC 
                FROM SAMT_CAT_SUBPROCESO_EMPLEADOS 
                WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND  CAT_SUBPROCESO_EMP_CLAVE = 'BAJA' 
            ) 
            AND CAT_PROCESO_EMP_CSC IN (SELECT CAT_PROCESO_EMP_CSC FROM SAMT_CAT_PROCESO_EMPLEADOS
            WHERE CAT_PROCESO_EMP_CLAVE IN ('ACTIVO','CAPA'))
            AND EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL 
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY ANIO,MES ORDER BY ANIO,MES ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PERFIL') {
            query = `SELECT 
            IFNULL(CAT.TIPO_EMPLEADO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_EMPLEADO AS CAT ON CAT.TIPO_EMPLEADO_CSCEMPLEADO = EMP.TIPO_EMPLEADO_EMPLEADO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC  = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_TPOCONTRATO') {
            query = `SELECT 
            IFNULL(CAT.TIPO_CONTRATO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_CONTRATO_EMPLEADOS AS CAT ON CAT.TIPO_CONTRATO_CSCCONTRATO = EMP.TIPO_CONTRATO_CSCCONTRATO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC  = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_TURNO') {
            query = `SELECT 
            IFNULL(CAT.TIPO_TURNO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_TURNO_EMPLEADOS AS CAT ON CAT.TIPO_TURNO_CSCTURNO = EMP.TIPO_TURNO_CSCTURNO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_CATEGORIA_PUESTO') {
            query = `SELECT 
            IFNULL(CAT.CAT_CATEGORIA_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAT_CATEGORIA_PUESTO AS CAT ON CAT.CAT_CATEGORIA_PUESTO_CSC = EMP.CAT_CATEGORIA_PUESTO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_TIPO_PUESTO') {
            query = `SELECT 
            IFNULL(PUESTO.TIPO_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS PUESTO 
            ON PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMP.CAT_PUESTO_CSCEMPLEADO 
            AND PUESTO.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PROCESO') {
            query = `SELECT 
            PR.CAT_PROCESO_EMP_IDIOMA1 AS DESCRIPCION
           ,COUNT(*) AS TOTAL_EMP FROM SAMT_EMPLEADOS AS EMP
           INNER JOIN SAMT_CAT_PROCESO_EMPLEADOS AS PR ON PR.CAT_PROCESO_EMP_CSC = EMP.CAT_PROCESO_EMP_CSC AND PR.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
           WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
           AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
           AND EMP.EMPRESA_LABORAL_CSC = 1
           ${extraData}
           GROUP BY DESCRIPCION
           ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PUESTO_EVC') {
            query = `SELECT CASE WHEN PU.TIPO_PUESTO_CSCEMPLEADO = 32 THEN 'EVC'
            ELSE 'ADMINISTRATIVOS' END AS DESCRIPCION
           ,COUNT(*) AS TOTAL_EMP 
           FROM SAMT_EMPLEADOS AS EMP
           INNER JOIN SAMT_TIPO_PUESTO_EMPLEADO AS PU
           ON EMP.CAT_PUESTO_CSCEMPLEADO = PU.TIPO_PUESTO_CSCEMPLEADO AND EMP.EMP_CSC_EMPRESA_HOST = PU.EMP_CSC_EMPRESA_HOST
           WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
           AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
           AND EMP.EMPRESA_LABORAL_CSC = 1
           ${extraData}
           GROUP BY DESCRIPCION
           ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_AREA') {
            query = `SELECT 
            IFNULL(CAT.TIPO_AREA_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAT_EMPLEADO_AREA AS CAT ON CAT.TIPO_AREA_CSC = EMP.CAT_AREA_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_AREA_SGA') {
            query = `SELECT 
            IFNULL(CAT.TIPO_AREA_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAT_EMPLEADO_AREA AS CAT ON CAT.TIPO_AREA_CSC = EMP.CAT_AREA_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.CAT_CENTRO_COSTOS_CSC = 5
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`; // 5= SG&A
        }

        if (req.query.TIPODASHBOARD == 'EJE_PERMANENCIA_ACTIVOS') {
            query = `SELECT 
            CASE
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) < 15 THEN '1. Menos de 15 días'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) < 30 THEN '2. Menos de 1 mes'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 30 AND 90 THEN '3. De 1 a 3 meses'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 90 AND 180 THEN '4. De 3 a 6 meses'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 180 AND 365 THEN '5. De 6 a 12 meses'
                ELSE '6. Más de 12 meses'
                END AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS  AS EMP
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY 
            CASE
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) < 15 THEN '1. Menos de 15 días'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) < 30 THEN '2. Menos de 1 mes'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 30 AND 90 THEN '3. De 1 a 3 meses'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 90 AND 180 THEN '4. De 3 a 6 meses'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 180 AND 365 THEN '5. De 6 a 12 meses'
                ELSE '6. Más de 12 meses'
            END
            ORDER BY DESCRIPCION ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_PERMANENCIA_ACTIVOS_CAPACITACION') {
            query = `SELECT 
            CASE
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) <= 4 THEN '1. De 1 a 4 días'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 5 AND 10 THEN '2. De 5 a 10 dias'
                ELSE '3. Más de 10 dias'
                END AS DESCRIPCION
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS  AS EMP
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY 
            CASE
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) <= 4 THEN '1. De 1 a 4 días'
                WHEN DATEDIFF(CONVERT_TZ(NOW(),'UTC','America/Mexico_City'), DATE(EMPLEADO_FECH_FIRMACONTRATO)) BETWEEN 5 AND 10 THEN '2. De 5 a 10 dias'
                ELSE '3. Más de 10 dias'
            END
            ORDER BY DESCRIPCION ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_MES_SITE') {
            query = `SELECT 
             COUNT(*) AS TOTAL_EMP, 
            IFNULL(CAT.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION,
            CONCAT(
                CASE MONTH(EMP.EMPLEADO_FECH_FIRMACONTRATO)
                    WHEN 1 THEN 'ENE'
                    WHEN 2 THEN 'FEB'
                    WHEN 3 THEN 'MAR'
                    WHEN 4 THEN 'ABR'
                    WHEN 5 THEN 'MAY'
                    WHEN 6 THEN 'JUN'
                    WHEN 7 THEN 'JUL'
                    WHEN 8 THEN 'AGO'
                    WHEN 9 THEN 'SEP'
                    WHEN 10 THEN 'OCT'
                    WHEN 11 THEN 'NOV'
                    WHEN 12 THEN 'DIC'
                END,
                '-',
                RIGHT(YEAR(EMP.EMPLEADO_FECH_FIRMACONTRATO),2)
            ) AS MES_ANIO_ALTA,
            MONTH(EMP.EMPLEADO_FECH_FIRMACONTRATO) as MES,
            YEAR(EMP.EMPLEADO_FECH_FIRMACONTRATO) as ANIO
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_REQUISICIONES AS CAT ON CAT.REQ_CSCREQUISICION = EMP.REQ_CSCREQUISICION AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY ANIO
            ,MES
            ,DESCRIPCION
            ,MES_ANIO_ALTA
            ORDER BY ANIO, MES ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_CAMPANIA') {
            query = `SELECT 
            IFNULL( CAT.PM_NOMBRE,'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_PROYECTOS AS CAT ON CAT.PM_CSC_PROYECTO = EMP.PM_CSC_PROYECTO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = 1
            AND EMP.ESTATUS_PROCESO_EMP_CSC = 2
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_SUBCAMPA') {
            query = `SELECT 
            IFNULL( CAT.CAM_SERVICIO_NOMBRE,'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_CAM_SERVICIO AS CAT ON CAT.CAM_CSC_SERVICIO = EMP.CAM_CSC_SERVICIO AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC =  ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND CAT.CAM_ACTIVA = 1
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'EJE_TIPO_CENTRO_COSTOS') {
            query = `SELECT 
            IFNULL(CAT.SAMT_TIPO_CENTRO_IDIOMA1, 'SIN DATO') AS DESCRIPCION,
            COUNT(*) AS TOTAL_EMP 
            FROM SAMT_EMPLEADOS AS EMP
            LEFT JOIN SAMT_TIPO_CENTRO_COSTOS AS CAT 
            ON CAT.SAMT_CSC_CENTRO_COSTOS = EMP.CAT_CENTRO_COSTOS_CSC 
            AND CAT.EMP_CSC_EMPRESA_HOST = EMP.EMP_CSC_EMPRESA_HOST
            WHERE EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}
            AND EMP.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            AND EMP.EMPRESA_LABORAL_CSC = 1
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

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


exports.GetAgendas_Dashboard = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        var extraData = ``;

        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMPLEADOS.CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
        }
        if (req.query.ANIOS) {
            extraData += ` AND YEAR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) = ${__Request_Pool.escape(req.query.ANIOS)}`;
        }
        if (req.query.MES) {
            extraData += ` AND MONTH(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) = ${__Request_Pool.escape(req.query.MES)}`;
        }
        if (req.query.DIA) {
            extraData += ` AND DAY(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) = ${__Request_Pool.escape(req.query.DIA)}`;
        }
        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMPLEADOS.PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)}`;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMPLEADOS.CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMPLEADOS.REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_HORA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) AS DESCRIPCION 
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00'))`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_SITE') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CAT.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_REQUISICIONES AS CAT ON CAT.REQ_CSCREQUISICION = EMPLEADOS.REQ_CSCREQUISICION AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_RECLUTADOR') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,RECLUTADOR.EMPLEADO_CSC_EMPLEADO AS IDINT
            ,CONCAT(RECLUTADOR.EMPLEADO_NOMBREEMPLEADO,' ',RECLUTADOR.EMPLEADO_APATERNOEMPLEADO, ' ', RECLUTADOR.EMPLEADO_AMATERNOEMPLEADO ) AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADOS AS RECLUTADOR ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = RECLUTADOR.EMP_CSC_EMPRESA_HOST AND EMPLEADOS.EMPLEADO_RECLUTADOR_CSC = RECLUTADOR.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,IDINT ORDER BY TOTAL_EMP DESC;`;
        }
        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_CAT_PUESTO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CAT.CAT_CATEGORIA_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAT_CATEGORIA_PUESTO AS CAT ON CAT.CAT_CATEGORIA_PUESTO_CSC = EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_CAMPANIA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( CAT.CAM_SERVICIO_NOMBRE,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAM_SERVICIO AS CAT ON CAT.CAM_CSC_SERVICIO = EMPLEADOS.TIPO_CAMPANIA_SOLICITA AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_PUESTO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( T_PUESTO.TIPO_PUESTO_IDIOMA1,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS T_PUESTO ON T_PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMPLEADOS.CAT_PUESTO_CSCEMPLEADO  AND T_PUESTO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_MEDIO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( MEDIO.SAMT_TIPO_MEDIO_IDIOMA1,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD ON SOLICITUD.EMP_CSC_EMPRESA_HOST = AGENDA.EMP_CSC_EMPRESA_HOST AND SOLICITUD.EMPLEADO_CSC_EMPLEADO = AGENDA.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_TIPO_MEDIO_ENTERO AS MEDIO ON  SOLICITUD.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST AND MEDIO.SAMT_TIPO_MEDIO_CSC = SOLICITUD.SOLICITUD_TIPO_MEDIO_CSC
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }


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

exports.GetAgendas_Dashboard_V2 = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        let extraData = ``;

        if (req.query.TIPO_CONSULTA) {
            if (req.query.TIPO_CONSULTA == 'DIA_HABIL') {
                if (req.query.CONSULTA_FECHA) {
                    if (req.query.CONSULTA_FECHA == 'RANGO_FECHA') {

                        if (req.query.FECHA_INICIO && req.query.FECHA_FIN) {
                            extraData += ` AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
                                           AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) <= ${__Request_Pool.escape(req.query.FECHA_FIN)}`;
                        } else {
                            extraData += ` AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) >= DATE(CONVERT_TZ(NOW(),'+00:00','-06:00'))
                                           AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) <=  DATE(CONVERT_TZ(NOW(),'+00:00','-06:00'))`;
                        }

                    } else {
                        extraData += ` AND DATE(CONVERT_TZ(AGENDA.EMPLEADO_FECH_AGENDA,'+00:00','-06:00')) >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
                                       AND DATE(CONVERT_TZ(AGENDA.EMPLEADO_FECH_AGENDA,'+00:00','-06:00')) <= ${__Request_Pool.escape(req.query.FECHA_FIN)}`;
                    }

                } else {
                    extraData += ` AND DATE(CONVERT_TZ(AGENDA.EMPLEADO_FECH_AGENDA,'+00:00','-06:00')) >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
                                   AND DATE(CONVERT_TZ(AGENDA.EMPLEADO_FECH_AGENDA,'+00:00','-06:00')) <= ${__Request_Pool.escape(req.query.FECHA_FIN)}`;
                }

            } else {
                if (req.query.FECHA_INICIO && req.query.FECHA_FIN) {
                    extraData += ` AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
                                   AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) <= ${__Request_Pool.escape(req.query.FECHA_FIN)}`;
                } else {
                    extraData += ` AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) >= DATE(CONVERT_TZ(NOW(),'+00:00','-06:00'))
                                   AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) <=  DATE(CONVERT_TZ(NOW(),'+00:00','-06:00'))`;

                }

            }


        } else {
            if (req.query.FECHA_INICIO && req.query.FECHA_FIN) {
                extraData += ` AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) >= ${__Request_Pool.escape(req.query.FECHA_INICIO)}
                               AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) <= ${__Request_Pool.escape(req.query.FECHA_FIN)}`;
            } else {
                extraData += ` AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) >= DATE(CONVERT_TZ(NOW(),'+00:00','-06:00'))
                               AND DATE(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) <=  DATE(CONVERT_TZ(NOW(),'+00:00','-06:00'))`;

            }
        }




        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMPLEADOS.CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
        }

        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMPLEADOS.PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)}`;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMPLEADOS.CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMPLEADOS.REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
        }

        if (req.query.EMPLEADO_CSC_EMPLEADO) {
            extraData += ` AND EMPLEADOS.REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} `;
        }

        if (req.query.TIPO_EMPRESA_RECLUTA_CSC) {
            extraData += ` AND EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC IN ( ${__Request_Pool.escape(req.query.TIPO_EMPRESA_RECLUTA_CSC)} )`;
        }


        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_HORA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) AS DESCRIPCION 
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00'))
            ORDER BY HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) ASC`;

        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_HORA_REAGENDA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) AS DESCRIPCION 
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            AND AGENDA.EMPLEADO_CSC_EMPLEADO IN (
                SELECT REAGENDAS.EMPLEADO_CSC_EMPLEADO FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS REAGENDAS
                WHERE REAGENDAS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                GROUP BY REAGENDAS.EMPLEADO_CSC_EMPLEADO 
                HAVING COUNT(REAGENDAS.EMPLEADO_CSC_EMPLEADO) > 1
                )
            GROUP BY HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00'))
            ORDER BY HOUR(CONVERT_TZ(AGENDA.AUDITORIA_FEC_ALTA,'+00:00','-06:00')) ASC`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_SITE') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CAT.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_REQUISICIONES AS CAT ON CAT.REQ_CSCREQUISICION = EMPLEADOS.REQ_CSCREQUISICION AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_RECLUTADOR') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,RECLUTADOR.EMPLEADO_CSC_EMPLEADO AS IDINT
            ,CONCAT(RECLUTADOR.EMPLEADO_APATERNOEMPLEADO, ' ', RECLUTADOR.EMPLEADO_AMATERNOEMPLEADO, ' ', RECLUTADOR.EMPLEADO_NOMBREEMPLEADO) AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADOS AS RECLUTADOR ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = RECLUTADOR.EMP_CSC_EMPRESA_HOST AND AGENDA.AUDITORIA_USU_ALTA = RECLUTADOR.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,IDINT ORDER BY TOTAL_EMP DESC;`;

        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_RECLUTADOR_REAGENDAS') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,RECLUTADOR.EMPLEADO_CSC_EMPLEADO AS IDINT
            ,CONCAT(RECLUTADOR.EMPLEADO_APATERNOEMPLEADO, ' ', RECLUTADOR.EMPLEADO_AMATERNOEMPLEADO, ' ', RECLUTADOR.EMPLEADO_NOMBREEMPLEADO) AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADOS AS RECLUTADOR ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = RECLUTADOR.EMP_CSC_EMPRESA_HOST AND AGENDA.AUDITORIA_USU_ALTA = RECLUTADOR.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            AND AGENDA.EMPLEADO_CSC_EMPLEADO IN (
                SELECT REAGENDAS.EMPLEADO_CSC_EMPLEADO FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS REAGENDAS
                WHERE REAGENDAS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                GROUP BY REAGENDAS.EMPLEADO_CSC_EMPLEADO 
                HAVING COUNT(REAGENDAS.EMPLEADO_CSC_EMPLEADO) > 1
                )
            GROUP BY DESCRIPCION,IDINT ORDER BY TOTAL_EMP DESC;`;

        }


        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_CAT_PUESTO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CAT.CAT_CATEGORIA_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAT_CATEGORIA_PUESTO AS CAT ON CAT.CAT_CATEGORIA_PUESTO_CSC = EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_CAMPANIA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( CAT.CAM_SERVICIO_NOMBRE,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAM_SERVICIO AS CAT ON CAT.CAM_CSC_SERVICIO = EMPLEADOS.TIPO_CAMPANIA_SOLICITA AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_PUESTO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( T_PUESTO.TIPO_PUESTO_IDIOMA1,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS T_PUESTO ON T_PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMPLEADOS.CAT_PUESTO_CSCEMPLEADO  AND T_PUESTO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_MEDIO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( MEDIO.SAMT_TIPO_MEDIO_IDIOMA1,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD ON SOLICITUD.EMP_CSC_EMPRESA_HOST = AGENDA.EMP_CSC_EMPRESA_HOST AND SOLICITUD.EMPLEADO_CSC_EMPLEADO = AGENDA.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_TIPO_MEDIO_ENTERO AS MEDIO ON  SOLICITUD.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST AND MEDIO.SAMT_TIPO_MEDIO_CSC = SOLICITUD.SOLICITUD_TIPO_MEDIO_CSC
            WHERE AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            AND AGENDA.EMPLEADO_CSC_EMPLEADO IN (
                SELECT REAGENDAS.EMPLEADO_CSC_EMPLEADO FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS REAGENDAS
                WHERE REAGENDAS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                GROUP BY REAGENDAS.EMPLEADO_CSC_EMPLEADO 
                HAVING COUNT(REAGENDAS.EMPLEADO_CSC_EMPLEADO) = 1 
                )
            GROUP BY DESCRIPCION 
            ORDER BY TOTAL_EMP DESC;`;
        }

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

exports.GetAgendas_Dashboard_Cita = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        var extraData = ``;

        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMPLEADOS.CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
        }

        if (req.query.FECHA_CONSULTA) {
            extraData += ` AND DATE_FORMAT(CONVERT_TZ(AGENDA.EMPLEADO_FECH_AGENDA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') = ${__Request_Pool.escape(req.query.FECHA_CONSULTA)}`
        }

        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMPLEADOS.PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)}`;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMPLEADOS.CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMPLEADOS.REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_HORA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,DATE_FORMAT(CONVERT_TZ(AGENDA.EMPLEADO_FECH_AGENDA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%H') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY DESCRIPCION ASC`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_SITE') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CAT.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON
            AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_REQUISICIONES AS CAT ON CAT.REQ_CSCREQUISICION = EMPLEADOS.REQ_CSCREQUISICION AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_RECLUTADOR') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,RECLUTADOR.EMPLEADO_CSC_EMPLEADO AS IDINT
            ,CONCAT(RECLUTADOR.EMPLEADO_NOMBREEMPLEADO,' ',RECLUTADOR.EMPLEADO_APATERNOEMPLEADO, ' ', RECLUTADOR.EMPLEADO_AMATERNOEMPLEADO ) AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADOS AS RECLUTADOR ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = RECLUTADOR.EMP_CSC_EMPRESA_HOST AND EMPLEADOS.EMPLEADO_RECLUTADOR_CSC = RECLUTADOR.EMPLEADO_CSC_EMPLEADO
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,IDINT ORDER BY TOTAL_EMP DESC;`;
        }
        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_CAT_PUESTO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CAT.CAT_CATEGORIA_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAT_CATEGORIA_PUESTO AS CAT ON CAT.CAT_CATEGORIA_PUESTO_CSC = EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_CAMPANIA') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( CAT.CAM_SERVICIO_NOMBRE,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_CAM_SERVICIO AS CAT ON CAT.CAM_CSC_SERVICIO = EMPLEADOS.TIPO_CAMPANIA_SOLICITA AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_PUESTO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( T_PUESTO.TIPO_PUESTO_IDIOMA1,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS T_PUESTO ON T_PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMPLEADOS.CAT_PUESTO_CSCEMPLEADO  AND T_PUESTO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'AGNDA_GENERADA_MEDIO') {
            query = `SELECT COUNT(AGENDA.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL( MEDIO.SAMT_TIPO_MEDIO_IDIOMA1,'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO AS AGENDA
            INNER JOIN SAMT_EMPLEADOS AS EMPLEADOS ON AGENDA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST AND AGENDA.EMPLEADO_CSC_EMPLEADO = EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_EMPLEADO_SOLICITUD AS SOLICITUD ON SOLICITUD.EMP_CSC_EMPRESA_HOST = AGENDA.EMP_CSC_EMPRESA_HOST AND SOLICITUD.EMPLEADO_CSC_EMPLEADO = AGENDA.EMPLEADO_CSC_EMPLEADO
            INNER JOIN SAMT_TIPO_MEDIO_ENTERO AS MEDIO ON  SOLICITUD.EMP_CSC_EMPRESA_HOST = SOLICITUD.EMP_CSC_EMPRESA_HOST AND MEDIO.SAMT_TIPO_MEDIO_CSC = SOLICITUD.SOLICITUD_TIPO_MEDIO_CSC
            WHERE  AGENDA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION ORDER BY TOTAL_EMP DESC;`;
        }

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

exports.GetDataRhRotacionBajas_Dashboard = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        var extraData = ``;

        if (req.query.TIPO_CONSULTA == "BAJAS") {
            extraData = `
            AND CAT_SUBPROCESO_EMP_CSC IN ( 
                SELECT CAT_SUBPROCESO_EMP_CSC 
                FROM SAMT_CAT_SUBPROCESO_EMPLEADOS 
                WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND  CAT_SUBPROCESO_EMP_CLAVE = 'BAJA' 
            ) 
            AND EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL 
            AND EMPRESA_LABORAL_CSC= ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)} `;

            if (req.query.ANIOS) {
                extraData += ` AND YEAR(EMPLEADO_FECH_BAJAEMPLEADO) = ${__Request_Pool.escape(req.query.ANIOS)}   `;
            }

            if (req.query.MES) {
                extraData += ` AND MONTH(EMPLEADO_FECH_BAJAEMPLEADO) = ${__Request_Pool.escape(req.query.MES)} `;
            }

        }
        else if (req.query.TIPO_CONSULTA == "INGRESOS") {
            extraData = `
            AND EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            -- AND EMPLEADO_FECH_INICIAOPERACION IS NOT NULL
            AND EMPRESA_LABORAL_CSC = ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)}`;

            if (req.query.ANIOS) {
                extraData += ` AND YEAR(EMPLEADO_FECH_FIRMACONTRATO) = ${__Request_Pool.escape(req.query.ANIOS)}   `;
            }

            if (req.query.MES) {
                extraData += ` AND MONTH(EMPLEADO_FECH_FIRMACONTRATO) = ${__Request_Pool.escape(req.query.MES)} `;
            }
        }


        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMPLEADOS.CLIENTE_CSC= ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
        }

        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMPLEADOS.PM_CSC_PROYECTO= ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)} `;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMPLEADOS.CAM_CSC_SERVICIO= ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC= ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO= ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMPLEADOS.REQ_CSCREQUISICION= ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
        }


        if (req.query.TIPODASHBOARD == 'BAJAS_POR_TIPO_PUESTO') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(PUESTOS.TIPO_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS PUESTOS ON
            PUESTOS.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND PUESTOS.TIPO_PUESTO_CSCEMPLEADO = EMPLEADOS.CAT_PUESTO_CSCEMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC `;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_CLIENTE') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CLIENTE.CLIENTE_NOMBRE, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_CLIENTES AS CLIENTE ON
            CLIENTE.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND CLIENTE.CLIENTE_CSC = EMPLEADOS.CLIENTE_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;


        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_MOTIVO_BAJA') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVO.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMPLEADOS.CAT_EMP_TREE_BAJA_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC `;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SEXO') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(SEXO.TIPO_SEXO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            ,IFNULL(SEXO.TIPO_SEXO_CLAVE,'OTRO') AS CLAVE
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_SEXO AS SEXO ON
            SEXO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SEXO.TIPO_SEXO_CSC = EMPLEADOS.TIPO_SEXO_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,CLAVE
            ORDER BY TOTAL_EMP DESC `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_TIPO_BAJA') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVOPARENTPARENT.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMPLEADOS.CAT_EMP_TREE_BAJA_CSC
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENT ON
            MOTIVOPARENT.EMP_CSC_EMPRESA_HOST = MOTIVO.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENT.EMP_TREE_BAJA_CSC = MOTIVO.EMP_TREE_BAJA_PARENT
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENTPARENT ON
            MOTIVOPARENTPARENT.EMP_CSC_EMPRESA_HOST = MOTIVOPARENT.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENTPARENT.EMP_TREE_BAJA_CSC = MOTIVOPARENT.EMP_TREE_BAJA_PARENT            
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES_POR_MOTIVO') {
            query = ` SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVOPARENTPARENT.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','-06:00')), 2)
                ) AS MES_ANIO_BAJA
            ,MONTH(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','-06:00')) AS MES
            ,RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','-06:00')),2)  AS ANIO

            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMPLEADOS.CAT_EMP_TREE_BAJA_CSC
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENT ON
            MOTIVOPARENT.EMP_CSC_EMPRESA_HOST = MOTIVO.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENT.EMP_TREE_BAJA_CSC = MOTIVO.EMP_TREE_BAJA_PARENT
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENTPARENT ON
            MOTIVOPARENTPARENT.EMP_CSC_EMPRESA_HOST = MOTIVOPARENT.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENTPARENT.EMP_TREE_BAJA_CSC = MOTIVOPARENT.EMP_TREE_BAJA_PARENT


            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES_ANIO_BAJA,MES,ANIO
            ORDER BY MES,ANIO ASC `;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_EDAD') {
            query = `SELECT
            CASE
                WHEN FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 18 AND FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 25 THEN '18 a 25'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 26 AND FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 39 THEN '26 a 35'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 36 THEN '36 o Mayor'
            END AS DESCRIPCION,
            CAT.TIPO_SEXO_IDIOMA1 AS TGEN,
            CAT.TIPO_SEXO_CLAVE AS CLAVE,
            COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_SEXO AS CAT ON
            CAT.TIPO_SEXO_CSC = EMPLEADOS.TIPO_SEXO_CSC
            AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.TIPO_SEXO_CSC IS NOT NULL
            ${extraData}
            GROUP BY TGEN,CLAVE,DESCRIPCION ORDER BY DESCRIPCION DESC;`;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO), 2)
                ) AS DESCRIPCION
            ,MONTH(EMPLEADO_FECH_BAJAEMPLEADO) AS MES
            ,RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO),2)  AS ANIO
            FROM SAMT_EMPLEADOS AS EMPLEADOS            
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES,ANIO
            ORDER BY ANIO,MES ASC;`;
        }
        else if (req.query.TIPODASHBOARD == 'CONTRATADOS_MENSUALES') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_FIRMACONTRATO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(EMPLEADO_FECH_FIRMACONTRATO), 2)
                ) AS DESCRIPCION
            ,MONTH(EMPLEADO_FECH_FIRMACONTRATO) AS MES
            ,RIGHT(YEAR(EMPLEADO_FECH_FIRMACONTRATO),2)  AS ANIO
            FROM SAMT_EMPLEADOS AS EMPLEADOS            
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES,ANIO
            ORDER BY ANIO,MES ASC;`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_PERFIL') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(PERFIL.TIPO_EMPLEADO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_EMPLEADO AS PERFIL ON
            PERFIL.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND PERFIL.TIPO_EMPLEADO_CSCEMPLEADO = EMPLEADOS.TIPO_EMPLEADO_EMPLEADO_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_ROTACION_MESES') {
            query = `SELECT
            CASE
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 37 THEN 'MAYOR A 36 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 25 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 36 THEN '25-36 MES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 13 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 24 THEN '13-24 MES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 10 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 12 THEN '10-12 MES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 6 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 9 THEN '6-9 MES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 4 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 5 THEN '4-5 MES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 2 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 3 THEN '2-3 MES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 1 THEN '0-1 MES'
            END AS DESCRIPCION
            ,COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE  EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.EMPLEADO_FECH_INGRESOEMP IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES_POR_RECLUTADORA') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(RECLUTADORA.TIPO_EMPRESA_RECLUTA_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO), 2)
                ) AS MES_ANIO_BAJA
            ,MONTH(EMPLEADO_FECH_BAJAEMPLEADO) AS MES
            ,RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO),2)  AS ANIO
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_EMPRESA_RECLUTA AS RECLUTADORA ON
            RECLUTADORA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND RECLUTADORA.TIPO_EMPRESA_RECLUTA_CSC = EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES_ANIO_BAJA,MES,ANIO
            ORDER BY MES,ANIO ASC `;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SITE') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(SITE.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_REQUISICIONES AS SITE ON
            SITE.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SITE.REQ_CSCREQUISICION = EMPLEADOS.REQ_CSCREQUISICION
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_PROYECTO') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,EMPLEADOS.PM_CSC_PROYECTO AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.PM_CSC_PROYECTO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SERVICIO') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,EMPLEADOS.CAM_CSC_SERVICIO AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.CAM_CSC_SERVICIO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }



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

exports.GetDataRhRotacionBajas_Dashboard_Concentra = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        let extraData = ``;
        let extraDataResumen = ``;
        let extraRegistros = ``;

        if (req.query.TIPO_CONSULTA == "BAJAS") {
            extraData = `
            AND EMPLEADOS.CAT_SUBPROCESO_EMP_CSC IN ( 
                SELECT CAT_SUBPROCESO_EMP_CSC 
                FROM SAMT_CAT_SUBPROCESO_EMPLEADOS 
                WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND  CAT_SUBPROCESO_EMP_CLAVE = 'BAJA' 
            ) 
            AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (SELECT CAT_PROCESO_EMP_CSC FROM SAMT_CAT_PROCESO_EMPLEADOS
            WHERE CAT_PROCESO_EMP_CLAVE IN ('ACTIVO', 'CAPA'))
            AND EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL 
            AND EMPLEADOS.EMPRESA_LABORAL_CSC= ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)} `;

            if (req.query.ANIOS) {
                extraData += ` AND YEAR(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) IN (${req.query.ANIOS})   `;
            }

            if (req.query.MES) {
                extraData += ` AND MONTH(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) IN (${req.query.MES}) `;
            }

        }
        else if (req.query.TIPO_CONSULTA == "INGRESOS") {
            extraData = `
            AND EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL
            -- AND EMPLEADO_FECH_INICIAOPERACION IS NOT NULL
            AND EMPRESA_LABORAL_CSC = ${__Request_Pool.escape(req.query.EMPRESA_LABORAL_CSC)}`;

            if (req.query.ANIOS) {
                extraData += ` AND YEAR(EMPLEADO_FECH_FIRMACONTRATO) IN (${req.query.ANIOS})  `;
            }

            if (req.query.MES) {
                extraData += ` AND MONTH(EMPLEADO_FECH_FIRMACONTRATO) IN (${req.query.MES}) `;
            }
        } else if (req.query.TIPO_CONSULTA == "RESUMEN") {
            if (req.query.ANIO_RESUMEN) {
                extraDataResumen += ` AND EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_ANIO IN (${req.query.ANIO_RESUMEN})  `;
            }

            if (req.query.MES_RESUMEN) {
                extraDataResumen += ` AND EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_MES IN (${req.query.MES_RESUMEN}) `;
            }

        }

        if (req.query.FECHA_CONSULTA) {
            extraData += ` AND DATE_FORMAT(EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')`
            extraData += ` AND DATE_FORMAT(EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(req.query.FECHA_CONSULTA)}, '%Y-%m-%d')`
        }


        if (req.query.CLIENTE_CSC) {
            extraData += ` AND EMPLEADOS.CLIENTE_CSC IN (${req.query.CLIENTE_CSC}) `;
        }


        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND EMPLEADOS.PM_CSC_PROYECTO IN (${req.query.PM_CSC_PROYECTO}) `;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND EMPLEADOS.CAM_CSC_SERVICIO IN (${req.query.CAM_CSC_SERVICIO}) `;
        }

        if (req.query.PROCESO) {
            extraData += ` AND EMPLEADOS.CAT_PROCESO_EMP_CSC IN (${req.query.PROCESO}) `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC IN (${req.query.CAT_CATEGORIA_PUESTO_CSC}) `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO IN (${req.query.CAT_PUESTO_CSCEMPLEADO}) `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND EMPLEADOS.REQ_CSCREQUISICION IN (${req.query.REQ_CSCREQUISICION}) `;
        }

        if (req.query.CAT_AREA_CSC) {
            extraData += ` AND EMPLEADOS.CAT_AREA_CSC IN (${req.query.CAT_AREA_CSC}) `;
        }

        if (req.query.CAT_AREA_CLAVE) {
            extraData += ` AND EMPLEADOS.CAT_AREA_CSC IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = '${req.query.CAT_AREA_CLAVE}')`;
        }

        if (req.query.CAT_DEPARTAMENTO_CSC) {
            extraData += ` AND EMPLEADOS.CAT_DEPARTAMENTO_CSC IN (${req.query.CAT_DEPARTAMENTO_CSC}) `;
        }

        if (req.query.TIPO_EMPLEADO_CLAVE) {
            extraData += ` AND EMPLEADOS.TIPO_EMPLEADO_EMPLEADO_CSC IN (SELECT TIPO_EMPLEADO_CSCEMPLEADO FROM SAMT_TIPO_EMPLEADO 
                            WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_EMPLEADO_CLAVE = '${req.query.TIPO_EMPLEADO_CLAVE}')`;
        }

        if (req.query.TIPO_VISTA_CLAVE) {
            if (req.query.TIPO_VISTA_CLAVE == 'INFRA') {
                extraData += ` AND EMPLEADOS.CAT_AREA_CSC IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                    WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')`;
            }

            if (req.query.TIPO_VISTA_CLAVE == 'OPE') {
                extraData += ` AND EMPLEADOS.CAT_AREA_CSC NOT IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                                WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')
                                AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO IN (SELECT TIPO_PUESTO_CSCEMPLEADO FROM SAMT_TIPO_PUESTO_EMPLEADO WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_PUESTO_CLAVE ='EVC')`;
            }

            if (req.query.TIPO_VISTA_CLAVE == 'ADMIN') {
                extraData += ` AND EMPLEADOS.CAT_AREA_CSC NOT IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                                WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')
                                AND EMPLEADOS.CAT_PUESTO_CSCEMPLEADO NOT IN (SELECT TIPO_PUESTO_CSCEMPLEADO FROM SAMT_TIPO_PUESTO_EMPLEADO WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_PUESTO_CLAVE ='EVC')`;
            }

        }

        if (req.query.NUMERO_REGISTROS) {
            extraRegistros += ` LIMIT  ${req.query.NUMERO_REGISTROS} `;
        }

        if (req.query.CLIENTE_CSC) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CLIENTE_CSC IN (${req.query.CLIENTE_CSC}) `;
        }

        if (req.query.PM_CSC_PROYECTO) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.PM_CSC_PROYECTO IN (${req.query.PM_CSC_PROYECTO}) `;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAM_CSC_SERVICIO IN (${req.query.CAM_CSC_SERVICIO}) `;
        }

        /*if (req.query.PROCESO){
            extraData += ` AND EMPLEADOS_RESUMEN.CAT_PROCESO_EMP_CSC IN (${req.query.PROCESO}) `;
        }*/

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_CATEGORIA_PUESTO_CSC IN (${req.query.CAT_CATEGORIA_PUESTO_CSC}) `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_PUESTO_CSCEMPLEADO IN (${req.query.CAT_PUESTO_CSCEMPLEADO}) `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.REQ_CSCREQUISICION IN (${req.query.REQ_CSCREQUISICION}) `;
        }

        if (req.query.CAT_AREA_CSC) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_AREA_CSC IN (${req.query.CAT_AREA_CSC}) `;
        }

        if (req.query.CAT_DEPARTAMENTO_CSC) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_DEPARTAMENTO_CSC IN (${req.query.CAT_DEPARTAMENTO_CSC}) `;
        }

        if (req.query.CAT_AREA_CLAVE) {
            extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_AREA_CSC IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = '${req.query.CAT_AREA_CLAVE}')`;
        }

        if (req.query.TIPO_VISTA_CLAVE) {
            if (req.query.TIPO_VISTA_CLAVE == 'INFRA') {
                extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_AREA_CSC IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                    WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')`;
            }

            if (req.query.TIPO_VISTA_CLAVE == 'OPE') {
                extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_AREA_CSC NOT IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                                            WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')
                                            AND EMPLEADOS_RESUMEN.CAT_PUESTO_CSCEMPLEADO IN (SELECT TIPO_PUESTO_CSCEMPLEADO FROM SAMT_TIPO_PUESTO_EMPLEADO WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_PUESTO_CLAVE ='EVC')`;
            }

            if (req.query.TIPO_VISTA_CLAVE == 'ADMIN') {
                extraDataResumen += ` AND EMPLEADOS_RESUMEN.CAT_AREA_CSC NOT IN (SELECT TIPO_AREA_CSC FROM SAMT_CAT_EMPLEADO_AREA 
                                            WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_AREA_CLAVE = 'INFRA')
                                            AND EMPLEADOS_RESUMEN.CAT_PUESTO_CSCEMPLEADO NOT IN (SELECT TIPO_PUESTO_CSCEMPLEADO FROM SAMT_TIPO_PUESTO_EMPLEADO WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND TIPO_PUESTO_CLAVE ='EVC')`;
            }
        }


        if (req.query.TIPODASHBOARD == 'BAJAS_POR_TIPO_PUESTO') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(PUESTOS.TIPO_PUESTO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS PUESTOS ON
            PUESTOS.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND PUESTOS.TIPO_PUESTO_CSCEMPLEADO = EMPLEADOS.CAT_PUESTO_CSCEMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC
            ${extraRegistros}; `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_CLIENTE') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(CLIENTE.CLIENTE_NOMBRE, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_CLIENTES AS CLIENTE ON
            CLIENTE.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND CLIENTE.CLIENTE_CSC = EMPLEADOS.CLIENTE_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_MOTIVO_BAJA') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVO.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMPLEADOS.CAT_EMP_TREE_BAJA_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC 
            ${extraRegistros};`;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SEXO') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(SEXO.TIPO_SEXO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            ,IFNULL(SEXO.TIPO_SEXO_CLAVE,'OTRO') AS CLAVE
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_SEXO AS SEXO ON
            SEXO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SEXO.TIPO_SEXO_CSC = EMPLEADOS.TIPO_SEXO_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,CLAVE
            ORDER BY TOTAL_EMP DESC `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_TIPO_BAJA') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVOPARENTPARENT.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMPLEADOS.CAT_EMP_TREE_BAJA_CSC
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENT ON
            MOTIVOPARENT.EMP_CSC_EMPRESA_HOST = MOTIVO.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENT.EMP_TREE_BAJA_CSC = MOTIVO.EMP_TREE_BAJA_PARENT
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENTPARENT ON
            MOTIVOPARENTPARENT.EMP_CSC_EMPRESA_HOST = MOTIVOPARENT.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENTPARENT.EMP_TREE_BAJA_CSC = MOTIVOPARENT.EMP_TREE_BAJA_PARENT            
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES_POR_SITE') {
            query = ` SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(SITE.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')), 2)
                ) AS MES_ANIO_BAJA
            ,MONTH(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')) AS MES
            ,RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')),2)  AS ANIO

            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_REQUISICIONES AS SITE 
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SITE.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.REQ_CSCREQUISICION = SITE.REQ_CSCREQUISICION
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES_ANIO_BAJA,MES,ANIO
            ORDER BY ANIO, MES ASC `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_DIA') {
            query = ` SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,CONCAT(
                CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                    WHEN 1 THEN 'ENE'
                    WHEN 2 THEN 'FEB'
                    WHEN 3 THEN 'MAR'
                    WHEN 4 THEN 'ABR'
                    WHEN 5 THEN 'MAY'
                    WHEN 6 THEN 'JUN'
                    WHEN 7 THEN 'JUL'
                    WHEN 8 THEN 'AGO'
                    WHEN 9 THEN 'SEP'
                    WHEN 10 THEN 'OCT'
                    WHEN 11 THEN 'NOV'
                    WHEN 12 THEN 'DIC'
                END,
                '-',
                DAY(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00'))
            ) AS DESCRIPCION
            ,MONTH(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')) AS MES
            ,DAY(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')) AS DIA
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,DIA,MES
            ORDER BY DIA, MES ASC `;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES_POR_MOTIVO') {
            query = ` SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(MOTIVOPARENTPARENT.EMP_TREE_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')), 2)
                ) AS MES_ANIO_BAJA
            ,MONTH(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')) AS MES
            ,RIGHT(YEAR(CONVERT_TZ(EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,'+00:00','+00:00')),2)  AS ANIO

            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVO ON
            MOTIVO.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND MOTIVO.EMP_TREE_BAJA_CSC = EMPLEADOS.CAT_EMP_TREE_BAJA_CSC
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENT ON
            MOTIVOPARENT.EMP_CSC_EMPRESA_HOST = MOTIVO.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENT.EMP_TREE_BAJA_CSC = MOTIVO.EMP_TREE_BAJA_PARENT
            LEFT JOIN SAMT_EMP_TREE_BAJA AS MOTIVOPARENTPARENT ON
            MOTIVOPARENTPARENT.EMP_CSC_EMPRESA_HOST = MOTIVOPARENT.EMP_CSC_EMPRESA_HOST
            AND MOTIVOPARENTPARENT.EMP_TREE_BAJA_CSC = MOTIVOPARENT.EMP_TREE_BAJA_PARENT


            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES_ANIO_BAJA,MES,ANIO
            ORDER BY MES,ANIO ASC `;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_EDAD') {
            query = `SELECT
            CASE
                WHEN FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 18 AND FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 25 THEN '18 a 25'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 26 AND FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) <= 39 THEN '26 a 35'
                WHEN FLOOR(DATEDIFF(CURDATE(), EMPLEADOS.EMPLEADO_FECHA_NACIMIENTO) / 365) >= 36 THEN '36 o Mayor'
            END AS DESCRIPCION,
            CAT.TIPO_SEXO_IDIOMA1 AS TGEN,
            CAT.TIPO_SEXO_CLAVE AS CLAVE,
            COUNT(*) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_SEXO AS CAT ON
            CAT.TIPO_SEXO_CSC = EMPLEADOS.TIPO_SEXO_CSC
            AND CAT.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.TIPO_SEXO_CSC IS NOT NULL
            ${extraData}
            GROUP BY TGEN,CLAVE,DESCRIPCION ORDER BY DESCRIPCION DESC;`;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO), 2)
                ) AS DESCRIPCION
            ,MONTH(EMPLEADO_FECH_BAJAEMPLEADO) AS MES
            ,RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO),4)  AS ANIO
            ,(SELECT ROUND(IFNULL(
                SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_BAJAS) /
                (SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_HCI) +
                SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_INGRESO) +
                SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_CAMBIOS)),0) * 100,1)
                FROM SAMT_HIST_EMPLEADOS_RESUMEN AS EMPLEADOS_RESUMEN
                WHERE EMPLEADOS_RESUMEN.EMP_CSC_EMPRESA_HOST= ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_ANIO = ANIO
                AND  EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_MES= MES
                ${extraDataResumen}
    
                ) AS ROTACION

            FROM SAMT_EMPLEADOS AS EMPLEADOS 
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES,ANIO
            ORDER BY ANIO,MES ASC;`;
        }
        else if (req.query.TIPODASHBOARD == 'CONTRATADOS_MENSUALES') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_FIRMACONTRATO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(EMPLEADO_FECH_FIRMACONTRATO), 2)
                ) AS DESCRIPCION
            ,MONTH(EMPLEADO_FECH_FIRMACONTRATO) AS MES
            ,RIGHT(YEAR(EMPLEADO_FECH_FIRMACONTRATO),2)  AS ANIO
            ,0 AS ROTACION
            FROM SAMT_EMPLEADOS AS EMPLEADOS            
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES,ANIO,ROTACION
            ORDER BY ANIO,MES ASC;`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_PERFIL') {
            query = `SELECT 
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(PERFIL.TIPO_EMPLEADO_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_EMPLEADO AS PERFIL ON
            PERFIL.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND PERFIL.TIPO_EMPLEADO_CSCEMPLEADO = EMPLEADOS.TIPO_EMPLEADO_EMPLEADO_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_ROTACION_MESES') {
            query = `SELECT
            CASE
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 37 THEN '8'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 25 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 36 THEN '7'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 13 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 24 THEN '6'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 10 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 12 THEN '5'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 6 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 9 THEN '4'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 4 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 5 THEN '3'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 2 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 3 THEN '2'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 1 THEN '1'
            END AS ORDEN,
            CASE
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 37 THEN 'MAS 36 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 25 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 36 THEN '25-36 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 13 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 24 THEN '13-24 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 10 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 12 THEN '10-12 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 6 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 9 THEN '6-9 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 4 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 5 THEN '4-5 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) >= 2 AND FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 3 THEN '2-3 MESES'
            WHEN FLOOR(TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) / 30) <= 1 THEN '0-1 MES'
            END AS DESCRIPCION
            ,COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE  EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.EMPLEADO_FECH_INGRESOEMP IS NOT NULL
            ${extraData}
            GROUP BY ORDEN, DESCRIPCION
            ORDER BY ORDEN DESC;`
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_ROTACION_DIAS_ANTIGUEDAD') {
            query = `SELECT
            CASE
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) > 60 THEN '5'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) >= 31 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 60 THEN '4'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) >= 15 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 30 THEN '3'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) >= 5 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 14 THEN '2'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 4 THEN '1'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 2 THEN '0'
            ELSE '6'
            END AS ORDEN,
            CASE
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) > 60 THEN 'mas 60'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) >= 31 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 60 THEN '31 a 60'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) >= 15 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 30 THEN '15 a 30'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) >= 5 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 14 THEN '5 a 14'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 4 AND TIMESTAMPDIFF(DAY,EMPLEADOS.EMPLEADO_FECH_INGRESOEMP,EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO) <= 4 THEN 'D4'
            WHEN EMPLEADOS.CAT_PROCESO_EMP_CSC = 2 THEN 'Capacitacion'
            ELSE 'SIN DATO'
            END AS DESCRIPCION
            ,COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE  EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.EMPLEADO_FECH_INGRESOEMP IS NOT NULL
            ${extraData}
            GROUP BY ORDEN, DESCRIPCION
            ORDER BY ORDEN DESC;`
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_MENSUALES_POR_RECLUTADORA') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(RECLUTADORA.TIPO_EMPRESA_RECLUTA_IDIOMA1, 'SIN DATO') AS DESCRIPCION
            , CONCAT(
                    CASE MONTH(EMPLEADO_FECH_BAJAEMPLEADO)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END,
                    '-',
                    RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO), 2)
                ) AS MES_ANIO_BAJA
            ,MONTH(EMPLEADO_FECH_BAJAEMPLEADO) AS MES
            ,RIGHT(YEAR(EMPLEADO_FECH_BAJAEMPLEADO),2)  AS ANIO
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_TIPO_EMPRESA_RECLUTA AS RECLUTADORA ON
            RECLUTADORA.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND RECLUTADORA.TIPO_EMPRESA_RECLUTA_CSC = EMPLEADOS.TIPO_EMPRESA_RECLUTA_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION,MES_ANIO_BAJA,MES,ANIO
            ORDER BY MES,ANIO ASC `;

        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SITE') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,IFNULL(SITE.REQ_NOMBREAREA, 'SIN DATO') AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_REQUISICIONES AS SITE ON
            SITE.EMP_CSC_EMPRESA_HOST = EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SITE.REQ_CSCREQUISICION = EMPLEADOS.REQ_CSCREQUISICION
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_PROYECTO') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,EMPLEADOS.PM_CSC_PROYECTO AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.PM_CSC_PROYECTO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SERVICIO') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,EMPLEADOS.CAM_CSC_SERVICIO AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.CAM_CSC_SERVICIO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_CAMPANIA') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,CAMPANIA.PM_NOMBRE AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_PROYECTOS AS CAMPANIA
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = CAMPANIA.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.PM_CSC_PROYECTO = CAMPANIA.PM_CSC_PROYECTO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.PM_CSC_PROYECTO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SUBCAMPANA') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,SAMT_CAM_SERVICIO.CAM_SERVICIO_NOMBRE AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_CAM_SERVICIO
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_CAM_SERVICIO.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.CAM_CSC_SERVICIO = SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.CAM_CSC_SERVICIO IS NOT NULL
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_SUPERVISOR') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,CONCAT(SUPERVISOR.EMPLEADO_APATERNOEMPLEADO, ' ',SUPERVISOR.EMPLEADO_AMATERNOEMPLEADO, ' ', SUPERVISOR.EMPLEADO_NOMBREEMPLEADO)  AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMPLEADOS AS SUPERVISOR
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SUPERVISOR.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO_PADRE = SUPERVISOR.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.EMPLEADO_CSC_EMPLEADO_PADRE IS NOT NULL
            AND SUPERVISOR.CAT_CATEGORIA_PUESTO_CSC IN (SELECT CAT_CATEGORIA_PUESTO_CSC FROM SAMT_CAT_CATEGORIA_PUESTO 
                WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND CAT_CATEGORIA_PUESTO_CLAVE = 'OPE')
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC 
            ${extraRegistros};`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_FORMADOR') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,CONCAT(SUPERVISOR.EMPLEADO_APATERNOEMPLEADO, ' ',SUPERVISOR.EMPLEADO_AMATERNOEMPLEADO, ' ', SUPERVISOR.EMPLEADO_NOMBREEMPLEADO)  AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_EMPLEADOS AS SUPERVISOR
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SUPERVISOR.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.EMPLEADO_CAPACITADOR_CSC = SUPERVISOR.EMPLEADO_CSC_EMPLEADO
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND EMPLEADOS.EMPLEADO_CAPACITADOR_CSC IS NOT NULL
            AND SUPERVISOR.CAT_CATEGORIA_PUESTO_CSC IN (SELECT CAT_CATEGORIA_PUESTO_CSC FROM SAMT_CAT_CATEGORIA_PUESTO 
                WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST} AND CAT_CATEGORIA_PUESTO_CLAVE = 'CAPA')
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC 
            ${extraRegistros};`;
        }
        else if (req.query.TIPODASHBOARD == 'BAJAS_POR_AREA') {
            query = `SELECT
            COUNT(EMPLEADOS.EMP_CSC_EMPRESA_HOST) AS TOTAL_EMP
            ,SAMT_CAT_EMPLEADO_DEPARTAMENTO.SAMT_TIPO_DEPARTAMENTO_IDIOMA1 AS DESCRIPCION
            FROM SAMT_EMPLEADOS AS EMPLEADOS
            LEFT JOIN SAMT_CAT_EMPLEADO_DEPARTAMENTO
            ON EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_CAT_EMPLEADO_DEPARTAMENTO.EMP_CSC_EMPRESA_HOST
            AND EMPLEADOS.CAT_DEPARTAMENTO_CSC = SAMT_CAT_EMPLEADO_DEPARTAMENTO.EMPLEADO_DEPARTAMENTO_CSC
            WHERE EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            ${extraData}
            GROUP BY DESCRIPCION
            ORDER BY TOTAL_EMP DESC 
            ${extraRegistros};`;
        }
        else if (req.query.TIPODASHBOARD == 'RESUMEN_MENSUAL') {
            query = `SELECT EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_ANIO AS ANIO
            ,EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_MES AS MES
            ,SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_HCI) AS HCI
            ,SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_INGRESO) AS INGRESOS
            ,SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_BAJAS) AS BAJAS
            ,SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_CAMBIOS) AS CAMBIOS
            ,SUM(EMPLEADOS_RESUMEN.EMPLEADOS_RESUMEN_TOTAL) AS ACTIVOS
            FROM SAMT_HIST_EMPLEADOS_RESUMEN AS EMPLEADOS_RESUMEN
            WHERE EMPLEADOS_RESUMEN.EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
             ${extraDataResumen}
             GROUP BY ANIO, MES;`;
        }

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

exports.Insert_Empleado_Test_Medico = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_TEST_MEDICO  SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Test_Medico = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_TEST_MEDICO  " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Empleado_Test_Medico = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = ` SELECT * FROM SAMT_EMPLEADO_TEST_MEDICO WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ; `;
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

exports.Get_Prenomina_Empleado_Vrt = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT * FROM SAMT_PF_PRENOMINA_APP WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} AND NOM_PERIODO = ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_CSC)};`;

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

exports.Update_PrenominaDinacEmpl = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE " + __Request_Pool.escape(req.query.UNIQUE.TB_UND) + " " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Prenomina_empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT * FROM ${__Request_Pool.escape(req.query.DATA_SETDATA)} WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND NOM_PERIODO = ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_CSC)};`;

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

exports.Insert_Imagen_Firma = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_PF_FIRMA_MOVIL_FOTOS  SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Get_Todo_Firmas_Dia = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = `SELECT FRM_MOVIL.FIRMA_MOVIL_NEWID
        ,FRM_MOVIL.FIRMA_MOVIL_FECHA
        ,DATE_FORMAT(CONVERT_TZ(FRM_MOVIL.FIRMA_MOVIL_FECHA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i') as fecha_formato_timezone
        ,FRM_MOVIL.FIRMA_MOVIL_LATITUD
        ,FRM_MOVIL.FIRMA_MOVIL_LONGITUD
        ,FRM_MOVIL.FIRMA_MOVIL_COMENTARIOS
        ,TPO_FIRMA.TIPO_FIRMA_MOVIL_IDIOMA1
        ,MOTIVO_FIRMA.TIPO_FIRMA_MOVIL_MOTIVO_IDIOMA1
        FROM SAMT_PF_FIRMA_MOVIL AS FRM_MOVIL 
        LEFT JOIN SAMT_PF_TIPO_FIRMA_MOVIL AS TPO_FIRMA ON TPO_FIRMA.SAMT_PF_TIPO_FIRMA_MOVIL_CSC = FRM_MOVIL.SAMT_PF_TIPO_FIRMA_MOVIL_CSC AND TPO_FIRMA.EMP_CSC_EMPRESA_HOST = FRM_MOVIL.EMP_CSC_EMPRESA_HOST
        LEFT JOIN SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO AS MOTIVO_FIRMA ON MOTIVO_FIRMA.SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC = FRM_MOVIL.SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC AND MOTIVO_FIRMA.EMP_CSC_EMPRESA_HOST = FRM_MOVIL.EMP_CSC_EMPRESA_HOST
        WHERE FRM_MOVIL.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND FRM_MOVIL.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} 
        AND DATE_FORMAT(CONVERT_TZ(FRM_MOVIL.FIRMA_MOVIL_FECHA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') = ${__Request_Pool.escape(req.query.FIRMA_FECHA)}`;
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

exports.Get_Imagen_Firma_Dia = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = `SELECT * FROM SAMT_PF_FIRMA_MOVIL_FOTOS
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND FIRMA_MOVIL_NEWID = ${__Request_Pool.escape(req.query.FIRMA_MOVIL_NEWID)};`;
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


exports.GetReporteEspecial = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        const { EMP_CSC_EMPRESA_HOST, FECHA_ALTA } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && FECHA_ALTA;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }
        query = `call sp_reporte_especial(${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)},${__Request_Pool.escape(req.query.FECHA_ALTA)})`;
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

exports.GetReporteBitacoras = async (req, res) => {
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
        query = `call sp_reporte_bitacoras(${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)})`;
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

exports.GetReporteAgendas = async (req, res) => {
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
        query = `call sp_reporte_agendas(${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)})`;
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

exports.Get_Headcount_Autorizado_By_Empleado_Puesto = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = ` SELECT 
        HEADCOUNT.HCA_PUESTOS_CSC 
        ,CLIENTES.CLIENTE_NOMBRE
        ,CLIENTES.CLIENTE_RAZONSOCIALNOMBRE
        ,PROYECTOS.PM_NOMBRE
        ,SERVICIO.CAM_SERVICIO_NOMBRE
        ,CATPUESTO.CAT_CATEGORIA_PUESTO_IDIOMA1
        ,PUESTO.TIPO_PUESTO_IDIOMA1
        ,HEADCOUNT.HCA_PRESUPUESTO_MIN 
        ,HEADCOUNT.HCA_PRESUPUESTO_MAX 
        ,HEADCOUNT.HCA_PRESUPUESTO_CONTRATADO 
        
        FROM SAMT_HEADCOUNT_AUTORIZADO AS HEADCOUNT
        
        INNER JOIN SAMT_CLIENTES AS CLIENTES ON
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = CLIENTES.EMP_CSC_EMPRESA_HOST
        AND HEADCOUNT.CLIENTE_CSC = CLIENTES.CLIENTE_CSC
        
        INNER JOIN SAMT_PROYECTOS AS PROYECTOS ON
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = PROYECTOS.EMP_CSC_EMPRESA_HOST
        AND HEADCOUNT.PM_CSC_PROYECTO = PROYECTOS.PM_CSC_PROYECTO
        
        INNER JOIN SAMT_CAM_SERVICIO AS SERVICIO ON
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = SERVICIO.EMP_CSC_EMPRESA_HOST
        AND HEADCOUNT.CAM_CSC_SERVICIO = SERVICIO.CAM_CSC_SERVICIO
        
        INNER JOIN SAMT_CAT_CATEGORIA_PUESTO AS CATPUESTO ON
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = CATPUESTO.EMP_CSC_EMPRESA_HOST
        AND HEADCOUNT.CAT_CATEGORIA_PUESTO_CSC = CATPUESTO.CAT_CATEGORIA_PUESTO_CSC
        
        INNER JOIN SAMT_TIPO_PUESTO_EMPLEADO AS PUESTO ON
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = PUESTO.EMP_CSC_EMPRESA_HOST
        AND HEADCOUNT.TIPO_PUESTO_CSCEMPLEADO = PUESTO.TIPO_PUESTO_CSCEMPLEADO
        
        WHERE 
        HEADCOUNT.EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND HEADCOUNT.CLIENTE_CSC =  ${__Request_Pool.escape(req.query.CLIENTE_CSC)}
        AND HEADCOUNT.PM_CSC_PROYECTO =  ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)}
        AND HEADCOUNT.CAM_CSC_SERVICIO =  ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)}
        AND HEADCOUNT.HCA_REQ_CSCREQUISICION =  ${__Request_Pool.escape(req.query.HCA_REQ_CSCREQUISICION)}
        AND HEADCOUNT.CAT_CATEGORIA_PUESTO_CSC =  ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)}
        AND HEADCOUNT.TIPO_PUESTO_CSCEMPLEADO =  ${__Request_Pool.escape(req.query.TIPO_PUESTO_CSCEMPLEADO)}
        AND HEADCOUNT.TIPO_TURNO_CSCTURNO =  ${__Request_Pool.escape(req.query.TIPO_TURNO_CSCTURNO)}
        AND HEADCOUNT.TIPO_ESTATUS_HEADCOUNT_CSC =  ${__Request_Pool.escape(req.query.TIPO_ESTATUS_HEADCOUNT_CSC)}
        AND HEADCOUNT.HCA_PRESUPUESTO_CONTRATADO = ${__Request_Pool.escape(req.query.HCA_PRESUPUESTO_CONTRATADO)}
        AND HEADCOUNT.EMPLEADO_CSC_EMPLEADO IS NULL; ` ;
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
};

exports.Update_Headcaunt_Autorizado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_HEADCOUNT_AUTORIZADO  " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Numero_Nomina_Consecutivo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `call sp_obtener_nomina() ;`;
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
};

exports.Insert_Asignacion_Folios = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_ASIGNACION_FOLIOS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Dashboard_Ausentismo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        const { EMP_CSC_EMPRESA_HOST, ANIOS, FECHA_ACTUAL } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && ANIOS && FECHA_ACTUAL;
        if (!isValid) {
            ResultData = { success: false, message: 'The request does not include all the necessary parameters' };
            res.status(200);
            res.send(ResultData);
            return;
        }

        var extraData = ``;

        if (req.query.ANIOS) {
            extraData += " AND YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) = " + __Request_Pool.escape(req.query.ANIOS);
        }

        if (req.query.MES) {
            extraData += " AND MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) = " + __Request_Pool.escape(req.query.MES);
        }

        if (req.query.CLIENTE_CSC) {
            extraData += ` AND SAMT_EMPLEADOS.CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} `;
        }

        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND SAMT_EMPLEADOS.PM_CSC_PROYECTO = ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)} `;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND SAMT_EMPLEADOS.CAM_CSC_SERVICIO = ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} `;
        }

        if (req.query.CAT_CATEGORIA_PUESTO_CSC) {
            extraData += ` AND SAMT_EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC = ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} `;
        }

        if (req.query.CAT_PUESTO_CSCEMPLEADO) {
            extraData += ` AND SAMT_EMPLEADOS.CAT_PUESTO_CSCEMPLEADO = ${__Request_Pool.escape(req.query.CAT_PUESTO_CSCEMPLEADO)} `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND SAMT_EMPLEADOS.REQ_CSCREQUISICION = ${__Request_Pool.escape(req.query.REQ_CSCREQUISICION)} `;
        }

        if (req.query.FECHA_ACTUAL) {
            extraData += " AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA < " + __Request_Pool.escape(req.query.FECHA_ACTUAL);
        }

        if (req.query.TIPODASHBOARD == 'SITE') {
            query = `SELECT
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,IFNULL(SAMT_REQUISICIONES.REQ_NOMBREAREA,'SIN DATO') AS DESCRIPCION
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA) AS TOTAL_FALTAS
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_ANTICIPADA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_OMISION + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_RECHAZO + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_JUSTIFICADA +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_SIN_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_CON_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_VACACIONES + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_INCAPACIDAD) AS TOTAL_AUSENTISMO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO
            LEFT JOIN SAMT_EMPLEADOS
            ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            
            LEFT JOIN SAMT_REQUISICIONES
            ON SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_REQUISICIONES.EMP_CSC_EMPRESA_HOST
            AND SAMT_EMPLEADOS.REQ_CSCREQUISICION = SAMT_REQUISICIONES.REQ_CSCREQUISICION
            
            WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.CLIENTE_CSC IS NOT NULL
            AND SAMT_EMPLEADOS.REQ_CSCREQUISICION IS NOT NULL
            AND SAMT_REQUISICIONES.TIPO_USO_DE_REQ_CSC IN ( 2 , 10 )
            AND SAMT_EMPLEADOS.EMPRESA_LABORAL_CSC IN ( 1  )
            ${extraData}
            GROUP BY SAMT_REQUISICIONES.REQ_NOMBREAREA,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ORDER BY SAMT_REQUISICIONES.REQ_NOMBREAREA DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'CLIENTE') {
            query = `SELECT
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,SAMT_CLIENTES.CLIENTE_NOMBRE AS DESCRIPCION
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA) AS TOTAL_FALTAS
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_ANTICIPADA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_OMISION + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_RECHAZO + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_JUSTIFICADA +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_SIN_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_CON_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_VACACIONES + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_INCAPACIDAD) AS TOTAL_AUSENTISMO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO
            LEFT JOIN SAMT_EMPLEADOS
            ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            
            LEFT JOIN SAMT_CLIENTES
            ON SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_CLIENTES.EMP_CSC_EMPRESA_HOST
            AND SAMT_EMPLEADOS.CLIENTE_CSC = SAMT_CLIENTES.CLIENTE_CSC
            
            WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.CLIENTE_CSC IS NOT NULL
            AND SAMT_EMPLEADOS.EMPRESA_LABORAL_CSC IN ( 1  )
            ${extraData}
            GROUP BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST,
            SAMT_CLIENTES.CLIENTE_NOMBRE
            ORDER BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST DESC;`;
        }

        if (req.query.TIPODASHBOARD == 'MES') {
            query = `SELECT
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) AS ANIO
            ,MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) AS NO_MES
            ,CASE MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
                    WHEN 1 THEN 'ENERO'
                    WHEN 2 THEN 'FEBRERO'
                    WHEN 3 THEN 'MARZO'
                    WHEN 4 THEN 'ABRIL'
                    WHEN 5 THEN 'MAYO'
                    WHEN 6 THEN 'JUNIO'
                    WHEN 7 THEN 'JULIO'
                    WHEN 8 THEN 'AGOSTO'
                    WHEN 9 THEN 'SEPTIEMBRE'
                    WHEN 10 THEN 'OCTUBRE'
                    WHEN 11 THEN 'NOVIEMBRE'
                    WHEN 12 THEN 'DICIEMBRE'
                END AS MES
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA) AS TOTAL_FALTAS
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_ANTICIPADA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_OMISION + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_RECHAZO + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_JUSTIFICADA +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_SIN_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_CON_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_VACACIONES + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_INCAPACIDAD) AS TOTAL_AUSENTISMO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO
            LEFT JOIN SAMT_EMPLEADOS
            ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.CLIENTE_CSC IS NOT NULL
            AND SAMT_EMPLEADOS.EMPRESA_LABORAL_CSC IN ( 1  )
            ${extraData}
            GROUP BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
            ,MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
            ,MES
            ORDER BY YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
            ,MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'SEXO') {
            query = `SELECT
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,IFNULL(SAMT_TIPO_SEXO.TIPO_SEXO_IDIOMA1, 'SIN DATO') AS SEXO
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA) AS TOTAL_FALTAS
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_ANTICIPADA + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_OMISION + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_RECHAZO + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FALTA_JUSTIFICADA +
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_SIN_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_CON_GOCE + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_VACACIONES + 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_INCAPACIDAD) AS TOTAL_AUSENTISMO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO
            INNER JOIN SAMT_EMPLEADOS
            ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            
            LEFT JOIN SAMT_TIPO_SEXO
            ON SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_SEXO.EMP_CSC_EMPRESA_HOST
            AND SAMT_EMPLEADOS.TIPO_SEXO_CSC = SAMT_TIPO_SEXO.TIPO_SEXO_CSC
            WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.CLIENTE_CSC IS NOT NULL
            AND SAMT_EMPLEADOS.EMPRESA_LABORAL_CSC IN ( 1  )
            ${extraData}
            GROUP BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,SAMT_TIPO_SEXO.TIPO_SEXO_IDIOMA1
            ORDER BY SAMT_TIPO_SEXO.TIPO_SEXO_IDIOMA1 ASC;`;
        }

        if (req.query.TIPODASHBOARD == 'SOLICITUDES') {
            query = `SELECT
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) AS ANIO
            ,MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) AS NO_MES
            ,CASE MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
                    WHEN 1 THEN 'ENERO'
                    WHEN 2 THEN 'FEBRERO'
                    WHEN 3 THEN 'MARZO'
                    WHEN 4 THEN 'ABRIL'
                    WHEN 5 THEN 'MAYO'
                    WHEN 6 THEN 'JUNIO'
                    WHEN 7 THEN 'JULIO'
                    WHEN 8 THEN 'AGOSTO'
                    WHEN 9 THEN 'SEPTIEMBRE'
                    WHEN 10 THEN 'OCTUBRE'
                    WHEN 11 THEN 'NOVIEMBRE'
                    WHEN 12 THEN 'DICIEMBRE'
                END AS MES
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_CON_GOCE) AS PCG
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_PERMISO_SIN_GOCE) AS PSG
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_VACACIONES) AS VACACIONES
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_INCAPACIDAD) AS INCAPACIDAD
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_RETARDO) AS RETARDO
            ,SUM(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_DIA_DESCANSO) AS DESCANSO
            ,COUNT(*) AS TOTAL_EMP
            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO
            INNER JOIN SAMT_EMPLEADOS
            ON SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO
            
            LEFT JOIN SAMT_TIPO_SEXO
            ON SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_SEXO.EMP_CSC_EMPRESA_HOST
            AND SAMT_EMPLEADOS.TIPO_SEXO_CSC = SAMT_TIPO_SEXO.TIPO_SEXO_CSC
            WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.CLIENTE_CSC IS NOT NULL
            AND SAMT_EMPLEADOS.EMPRESA_LABORAL_CSC IN ( 1  )
            ${extraData}
            GROUP BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
            ,MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
            ,MES
            ORDER BY YEAR(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA)
            ,MONTH(SAMT_PF_PROGRAMA_TRABAJO_DIARIO.PROGRAMA_TRABAJO_FECHA) ASC;`;
        }

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
};

exports.Get_Dash_Biometrico = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.TIPO_CONSULTA == "COMBO_CATORCENA") {
            query = ` SELECT * 
            FROM SAMT_PF_CALENDARIO_CATORCENAS
            WHERE EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND SAMT_CAL_CATORCENA_MES =  ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_MES)}
            AND SAMT_CAL_CATORCENA_ANIO =  ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_ANIO)}
            AND TIPO_FRECUENCIA_CSC = (SELECT TIPO_FRECUENCIA_CSC FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)}  ) `;
        }
        else if (req.query.TIPO_CONSULTA == "FORM_DETALLE_EMPLEADO") {
            query = ` SELECT 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,CONCAT(TIME_FORMAT( SEC_TO_TIME(SUM(PROGRAMA_TOTAL_TIEMPO_JORNADA) * 60),'%H:%i'),':00' ) AS HORA_JORNADA
            ,CASE WHEN (SUM(PROGRAMA_TOTAL_TIEMPO_VIRTUAL) - SUM(PROGRAMA_TOTAL_TIEMPO_PLANEADO)) * 60 < 0
            THEN  '00:00:00'ELSE  TIME_FORMAT( SEC_TO_TIME( (SUM(PROGRAMA_TOTAL_TIEMPO_VIRTUAL) - SUM(PROGRAMA_TOTAL_TIEMPO_PLANEADO)) * 60 ), '%H:%i:%s' ) 
            END AS HORA_EXTRA
            ,CASE WHEN Sum(PROGRAMA_TOTAL_TIEMPO_PLANEADO) = 0 THEN 0
            WHEN  (Sum(PROGRAMA_TOTAL_TIEMPO_VIRTUAL) * 100) / SUM(PROGRAMA_TOTAL_TIEMPO_PLANEADO) > 100
            THEN 100  ELSE
            (SUM(PROGRAMA_TOTAL_TIEMPO_VIRTUAL) * 100) / SUM(PROGRAMA_TOTAL_TIEMPO_PLANEADO)
            END AS CUMPLIMIENTO
            ,CONCAT( TIME_FORMAT( SEC_TO_TIME(SUM(PROGRAMA_TOTAL_TIEMPO_PLANEADO) * 60), '%H:%i' ) ,':00' ) AS HORA_PROGRAMADA
            ,CONCAT( TIME_FORMAT( SEC_TO_TIME(SUM(PROGRAMA_TOTAL_TIEMPO_VIRTUAL) * 60), '%H:%i' ) ,':00' ) AS HORA_LABORADA
            ,SUM(PROGRAMA_TRABAJO_LABORADO) As DIAS_LABORADOS
            ,SUM(PROGRAMA_TRABAJO_FALTA) As FALTAS
            ,SUM(PROGRAMA_TRABAJO_FALTA_ANTICIPADA) As FALTAS_ANTICIPADAS
            ,SUM(PROGRAMA_TRABAJO_FALTA_JUSTIFICADA) As FALTAS_JUSTIFICADAS
            ,SUM(PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR) As FALTAS_POR_JUSTIFICAR
            ,SUM(PROGRAMA_TRABAJO_FALTA_POR_OMISION) As FALTAS_POR_OMISION
            ,SUM(PROGRAMA_TRABAJO_FALTA_POR_RECHAZO) As FALTAS_POR_RECHAZO
            ,SUM(PROGRAMA_TRABAJO_RETARDO) As RETARDOS
            ,SUM(PROGRAMA_TRABAJO_INCAPACIDAD) As INCAPACIDADES
            ,SUM(PROGRAMA_TRABAJO_VACACIONES) As VACACIONES
            ,SUM(PROGRAMA_TOTAL_TIEMPO_VIRTUAL) as TIEMPO_VIRTUAL
            ,SUM(PROGRAMA_TOTAL_TIEMPO_PLANEADO) AS TIEMPO_PLANEADO
            ,SUM(PROGRAMA_TRABAJO_PERMISO_SIN_GOCE) As PERMISOS_SIN_GOCE
            ,SUM(PROGRAMA_TRABAJO_PERMISO_CON_GOCE) As PERMISOS_CON_GOCE
            ,SUM(PROGRAMA_TRABAJO_DIA_DESCANSO) As DIAS_DE_DESCANSO
            ,SUM(PROGRAMA_TRABAJO_FESTIVO_LABORADO) As DIAS_FESTIVOS
            ,SUM(PROGRAMA_TRABAJO_FESTIVO) as FESTIVO
            ,SUM(PROGRAMA_TRABAJO_DESCANSO_LABORADO) As DESCANSOS_LABORADOS
            ,SUM(PROGRAMA_TRABAJO_PRIMA_DOMINICAL) As PRIMA_DOMINICAL
            ,SUM(PROGRAMA_TRABAJO_PRIMA_DOM_LABORADO) As PRIMA_DOMINICAL_LABORADOS
            ,SUM(PROGRAMA_TRABAJO_BANCO_HORAS_ENTRADA) As BANCO_HORAS_ENTRADA
            ,SUM(PROGRAMA_TRABAJO_BANCO_HORAS_SALIDA) As BANCO_HORAS_SALIDA
            ,SUM(PROGRAMA_TRABAJO_HORAS_EXTRAS_SOLICITADAS) As PROGRAMA_TRABAJO_HORAS_EXTRAS_SOLICITADAS
            ,SUM(PROGRAMA_TRABAJO_HORAS_EXTRAS_APROBADAS) As PROGRAMA_TRABAJO_HORAS_EXTRAS_APROBADAS
            ,TIME_FORMAT( SEC_TO_TIME(SUM(PROGRAMA_TRABAJO_HORAS_EXTRAS_APROBADAS)), '%H:%i:%s') AS HORASEXTRAS_APROB
            ,TIME_FORMAT( SEC_TO_TIME(SUM(PROGRAMA_TRABAJO_HORAS_EXTRAS_SOLICITADAS)), '%H:%i:%s') AS HORASEXTRAS_SOL
            
            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO 
            
            INNER JOIN SAMT_EMPLEADOS ON 
            SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
            AND SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO= SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO

            WHERE SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST= ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} `;

            if (req.query.TIPO_QUERY == "CATORCENA_CSC") {
                query += `
                AND PROGRAMA_TRABAJO_FECHA >= (SELECT  SAMT_CAL_CATORCENA_F1 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE SAMT_CAL_CATORCENA_CSC = ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_CSC)}  )
                AND PROGRAMA_TRABAJO_FECHA <= (SELECT  SAMT_CAL_CATORCENA_F2 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE SAMT_CAL_CATORCENA_CSC = ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_CSC)}  ) `;
            }
            else if (req.query.TIPO_QUERY == "MENSUAL") {
                query += `
                AND MONTH(PROGRAMA_TRABAJO_FECHA) = ${__Request_Pool.escape(req.query.PROGRAMA_TRABAJO_FECHA_MES)}
                AND YEAR(PROGRAMA_TRABAJO_FECHA) = ${__Request_Pool.escape(req.query.PROGRAMA_TRABAJO_FECHA_ANIO)} `;
            }
            else {
                query += `
                AND PROGRAMA_TRABAJO_FECHA >= (SELECT  SAMT_CAL_CATORCENA_F1 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') >= SAMT_CAL_CATORCENA_F1 AND DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') <= SAMT_CAL_CATORCENA_F2 AND EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND TIPO_FRECUENCIA_CSC = (SELECT TIPO_FRECUENCIA_CSC FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)}  ))
                AND PROGRAMA_TRABAJO_FECHA <= (SELECT  SAMT_CAL_CATORCENA_F2 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') >= SAMT_CAL_CATORCENA_F1 AND DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') <= SAMT_CAL_CATORCENA_F2 AND EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND TIPO_FRECUENCIA_CSC = (SELECT TIPO_FRECUENCIA_CSC FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)}  ))  `;
            }

            query += `
            GROUP BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMP_CSC_EMPRESA_HOST
            ,SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO
            ,SAMT_EMPLEADOS.CAM_CSC_SERVICIO, SAMT_EMPLEADOS.EMPLEADO_ID_EXTERNO
            ,SAMT_EMPLEADOS.EMPLEADO_APATERNOEMPLEADO + ' ' + SAMT_EMPLEADOS.EMPLEADO_AMATERNOEMPLEADO + ' ' + SAMT_EMPLEADOS.EMPLEADO_NOMBREEMPLEADO
            ,SAMT_EMPLEADOS.CLIENTE_CSC
            ,SAMT_EMPLEADOS.PM_CSC_PROYECTO
            ,SAMT_EMPLEADOS.CAT_PUESTO_CSCEMPLEADO,SAMT_EMPLEADOS.EMPLEADO_FECH_INGRESOEMP
            ,SAMT_EMPLEADOS.EMPLEADO_DEPARTAMENTO_BCONN_CSC, SAMT_EMPLEADOS.REQ_CSCREQUISICION
            ,SAMT_EMPLEADOS.EMPLEADO_FECH_BAJAEMPLEADO,SAMT_EMPLEADOS.CAT_PROCESO_EMP_CSC
            ,SAMT_EMPLEADOS.EMPLEADO_SITE_CSC,SAMT_EMPLEADOS.CAT_PROVEEDOR_CSC
            ,SAMT_EMPLEADOS.TIPO_DEPTO_BC_CSC
            ,SAMT_EMPLEADOS.CAT_SUBPROCESO_EMP_CSC
            ,SAMT_EMPLEADOS.EMPLEADO_RFC
            ,SAMT_EMPLEADOS.EMPLEADO_CURP
            ,SAMT_EMPLEADOS.EMPLEADO_IMSS
            ,SAMT_EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO

            ORDER BY SAMT_PF_PROGRAMA_TRABAJO_DIARIO.EMPLEADO_CSC_EMPLEADO; ` ;

        }
        else {
            query = ` SELECT 
            ROW_NUMBER() OVER(ORDER BY PROGRAMA_TRABAJO_FECHA DESC) AS DATO
            ,DATE_FORMAT(CCPTD.PROGRAMA_TRABAJO_FECHA, '%d-%m-%Y') as FechaFomato
            ,DAYNAME(CCPTD.PROGRAMA_TRABAJO_FECHA) AS NOMBRE_DIA
            ,DAYOFWEEK(CCPTD.PROGRAMA_TRABAJO_FECHA) AS NUMERO_DIA_SEMANA
            ,DAY(CCPTD.PROGRAMA_TRABAJO_FECHA) AS DIA
            ,TIME_FORMAT(CCPTD.PROGRAMA_FECHA_JORNADA_ENTRADA, '%H:%i') AS HORAENTRADA
            ,TIME_FORMAT(CCPTD.PROGRAMA_FECHA_JORNADA_SALIDA, '%H:%i') AS HORASALIDA
            ,COALESCE(TIME_FORMAT(CCPTD.PROGRAMA_FECHA_VIRTUAL_ENTRADA, '%H:%i'), '00:00') AS HORAENTRADAREGISTRO
            ,COALESCE(TIME_FORMAT(CCPTD.PROGRAMA_FECHA_VIRTUAL_SALIDA, '%H:%i'), '00:00') AS HORASALIDAREGISTRO
            ,COALESCE(TIME_FORMAT(CCPTD.PROGRAMA_FECHA_SISTEMA_LOGIN, '%H:%i'), '00:00') AS HORALOGIN
            ,COALESCE(TIME_FORMAT(CCPTD.PROGRAMA_FECHA_SISTEMA_LOGOUT, '%H:%i'), '00:00') AS HORALOGOUT
            ,TPO_B_JORNADA.TIPO_BASADO_EN_JORNADA_CLAVE
            ,CCPTD.*
            ,TPO_B_JORNADA.TIPO_BASADO_EN_JORNADA_IDIOMA1
            ,SUBTPO_B_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA
            ,SUBTPO_B_JORNADA.SUB_BASADO_EN_JORNADA_IDIOMA1

            FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO AS CCPTD 
            LEFT JOIN SAMT_EMPLEADOS 
            ON CCPTD.EMP_CSC_EMPRESA_HOST=SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST AND CCPTD.EMPLEADO_CSC_EMPLEADO=SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO

            LEFT JOIN SAMT_PF_TIPO_BASADO_EN_JORNADA AS TPO_B_JORNADA 
            ON TPO_B_JORNADA.TPF_CSC_TIPO_BASADO_EN_JORNADA = CCPTD.TPF_CSC_TIPO_BASADO_EN_JORNADA AND TPO_B_JORNADA.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST

            LEFT JOIN SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA AS SUBTPO_B_JORNADA 
            ON SUBTPO_B_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA = CCPTD.TPF_CSC_ESTATUS_VIRTUAL AND SUBTPO_B_JORNADA.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST

            WHERE CCPTD.EMP_CSC_EMPRESA_HOST= ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
            AND SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} `;

            if (req.query.TIPO_QUERY == "CATORCENA_CSC") {
                query += `
                AND CCPTD.PROGRAMA_TRABAJO_FECHA >= (SELECT  SAMT_CAL_CATORCENA_F1 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE SAMT_CAL_CATORCENA_CSC = ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_CSC)}  )
                AND CCPTD.PROGRAMA_TRABAJO_FECHA <= (SELECT  SAMT_CAL_CATORCENA_F2 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE SAMT_CAL_CATORCENA_CSC = ${__Request_Pool.escape(req.query.SAMT_CAL_CATORCENA_CSC)}  ) `;
            }
            else if (req.query.TIPO_QUERY == "MENSUAL") {
                query += `
                AND MONTH(CCPTD.PROGRAMA_TRABAJO_FECHA) = ${__Request_Pool.escape(req.query.PROGRAMA_TRABAJO_FECHA_MES)}
                AND YEAR(CCPTD.PROGRAMA_TRABAJO_FECHA) = ${__Request_Pool.escape(req.query.PROGRAMA_TRABAJO_FECHA_ANIO)} `;
            }
            else {
                query += `
                AND CCPTD.PROGRAMA_TRABAJO_FECHA >= (SELECT  SAMT_CAL_CATORCENA_F1 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') >= SAMT_CAL_CATORCENA_F1 AND DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') <= SAMT_CAL_CATORCENA_F2 AND EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND TIPO_FRECUENCIA_CSC = (SELECT TIPO_FRECUENCIA_CSC FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)}  ))
                AND CCPTD.PROGRAMA_TRABAJO_FECHA <= (SELECT  SAMT_CAL_CATORCENA_F2 FROM SAMT_PF_CALENDARIO_CATORCENAS WHERE DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') >= SAMT_CAL_CATORCENA_F1 AND DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-%d') <= SAMT_CAL_CATORCENA_F2 AND EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND TIPO_FRECUENCIA_CSC = (SELECT TIPO_FRECUENCIA_CSC FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)}  ))  `;
            }

            query += `
            ORDER BY CCPTD.PROGRAMA_TRABAJO_FECHA ASC; ` ;


        }


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
};


exports.Get_Firma_Sistema_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT * FROM SAMT_FIRMA_SISTEMA WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

        if (req.query.EMPLEADO_CSC_EMPLEADO) {
            query += " AND EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
        }
        if (req.query.FIRMA_SESSION_ID) {
            query += " AND FIRMA_SESSION_ID = " + __Request_Pool.escape(req.query.FIRMA_SESSION_ID);
        }
        if (req.query.FIRMA_FIRMADO) {
            query += " AND FIRMA_FIRMADO = " + __Request_Pool.escape(req.query.FIRMA_FIRMADO);
        }
        query += ";--";
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

exports.Inserta_Firma_Sistema_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_FIRMA_SISTEMA  SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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
}

exports.Update_Firma_Sistema_Empleado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_FIRMA_SISTEMA  " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Get_Permisos_Reclutadoras = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        if (req.query.EMP_CSC_EMPRESA_HOST) {
            query += " AND EMP_CSC_EMPRESA_HOST = " + __Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
        }
        if (req.query.EMPLEADO_CSC_EMPLEADO) {
            query += " AND EMPLEADO_CSC_EMPLEADO = " + __Request_Pool.escape(req.query.FIRMA_SESSION_ID);
        }

        query = `SELECT 
        SAMT_TIPO_EMPRESA_RECLUTA.EMP_CSC_EMPRESA_HOST
        ,SAMT_TIPO_EMPRESA_RECLUTA.TIPO_EMPRESA_RECLUTA_CSC
        ,SAMT_TIPO_EMPRESA_RECLUTA.TIPO_EMPRESA_RECLUTA_IDIOMA1
        ,SAMT_TIPO_EMPRESA_RECLUTA.TIPO_EMPRESA_RECLUTA_DEFAULT
        ,SAMT_TIPO_EMPRESA_RECLUTA.TIPO_EMPRESA_RECLUTA_ACTIVO
        FROM SAMT_TIPO_EMPRESA_RECLUTA LEFT JOIN SAMT_EMPLEADO_CONFIG_CONTRATISTA
        ON SAMT_TIPO_EMPRESA_RECLUTA.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADO_CONFIG_CONTRATISTA.EMP_CSC_EMPRESA_HOST
        AND SAMT_TIPO_EMPRESA_RECLUTA.TIPO_EMPRESA_RECLUTA_CSC = SAMT_EMPLEADO_CONFIG_CONTRATISTA.TIPO_EMPRESA_RECLUTA_CSC
        WHERE SAMT_TIPO_EMPRESA_RECLUTA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND SAMT_EMPLEADO_CONFIG_CONTRATISTA.EMPLEADO_CSC_EMPLEADO =  ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)};`;

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


exports.Get_Campanias_Tree_Select = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND ID_ITEM IN ( ${req.query.CAM_CSC_SERVICIO_SELECT} )
        UNION ALL
        SELECT * FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND 
        ID_ITEM IN (
            SELECT ID_ITEM_PARENT FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND ID_ITEM IN ( ${req.query.CAM_CSC_SERVICIO_SELECT} )
        )
        UNION ALL
        SELECT * FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND 
        ID_ITEM IN (
            SELECT ID_ITEM_PARENT FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND ID_ITEM IN (
                SELECT ID_ITEM_PARENT FROM TreeCampa WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND ID_ITEM IN ( ${req.query.CAM_CSC_SERVICIO_SELECT} )
            )
        ) `;

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
};


exports.Get_Cam_Servicios_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_CAM_SERVICIOS_EMPLEADOS 
        WHERE EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `;
    
        if(req.query.SERVICIOS_EMP_UNIQUE != undefined){
            query += ` AND SERVICIOS_EMP_UNIQUE = ${__Request_Pool.escape(req.query.SERVICIOS_EMP_UNIQUE)} ` ;
        }

        if(req.query.EMPLEADO_CSC_EMPLEADO != undefined){
            query += ` AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ` ;
        }

        if(req.query.CAM_CSC_SERVICIO != undefined){
            query += ` AND CAM_CSC_SERVICIO = ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} ` ;
        }

        if(req.query.SERVICIO_ACTIVO != undefined){
            query += ` AND SERVICIO_ACTIVO = ${__Request_Pool.escape(req.query.SERVICIO_ACTIVO)} ` ;
        }

        query += ` ; ` ;

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
};


exports.Insert_Cam_Servicio_Empleados = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_CAM_SERVICIOS_EMPLEADOS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Delete_Cam_Servicio_Empleados = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = `DELETE FROM SAMT_CAM_SERVICIOS_EMPLEADOS 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST)} 
        AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO)} 
        AND CAM_CSC_SERVICIO = ${__Request_Pool.escape(req.body.CAM_CSC_SERVICIO)}
        AND SERVICIOS_EMP_UNIQUE = ${__Request_Pool.escape(req.body.SERVICIOS_EMP_UNIQUE)} `;

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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



exports.Update_Cam_Servicio_Empleados = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_CAM_SERVICIOS_EMPLEADOS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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



exports.Get_Empleado_Horario_App = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_EMPLEADO_HORARIO_APP 
        WHERE EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `;
    
        if(req.query.EMPLEADO_CSC_EMPLEADO  != undefined){
            query += ` AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO )} ` ;
        }

        if(req.query.EMPLEADO_DIA_ACTIVO != undefined){
            query += ` AND EMPLEADO_DIA_ACTIVO = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_ACTIVO)} ` ;
        }

        if(req.query.EMPLEADO_DIA_DOMINGO != undefined){
            query += ` AND EMPLEADO_DIA_DOMINGO = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_DOMINGO)} ` ;
        }

        if(req.query.EMPLEADO_DIA_LUNES != undefined){
            query += ` AND EMPLEADO_DIA_LUNES = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_LUNES)} ` ;
        }

        if(req.query.EMPLEADO_DIA_MARTES != undefined){
            query += ` AND EMPLEADO_DIA_MARTES = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_MARTES)} ` ;
        }
        
        if(req.query.EMPLEADO_DIA_MIERCOLES != undefined){
            query += ` AND EMPLEADO_DIA_MIERCOLES = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_MIERCOLES)} ` ;
        }

        if(req.query.EMPLEADO_DIA_JUEVES != undefined){
            query += ` AND EMPLEADO_DIA_JUEVES = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_JUEVES)} ` ;
        }

        if(req.query.EMPLEADO_DIA_VIERNES != undefined){
            query += ` AND EMPLEADO_DIA_VIERNES = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_VIERNES)} ` ;
        }

        if(req.query.EMPLEADO_DIA_SABADO != undefined){
            query += ` AND EMPLEADO_DIA_SABADO = ${__Request_Pool.escape(req.query.EMPLEADO_DIA_SABADO)} ` ;
        }

        query += ` ; ` ;

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
};


exports.Insert_Empleado_Horario_App = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_HORARIO_APP SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Update_Empleado_Horario_App = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_HORARIO_APP " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Get_Empleado_Jornada = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = ` SELECT * FROM SAMT_EMPLEADO_JORNADAS 
        WHERE EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} `;
    
        if(req.query.EMPLEADO_CSC_EMPLEADO  != undefined){
            query += ` AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO )} ` ;
        }

        if(req.query.CAT_JORNADAS_CSC  != undefined){
            query += ` AND CAT_JORNADAS_CSC = ${__Request_Pool.escape(req.query.CAT_JORNADAS_CSC )} ` ;
        }

        query += ` ; ` ;

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
};

exports.Insert_Empleado_Jornada = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_JORNADAS SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Update_Empleado_Jornada = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = "UPDATE SAMT_EMPLEADO_JORNADAS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE, "UPDATE") + " WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE, "WHERE") + "; ";

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Get_Headcount_Autorizado_By_Clave_Estatus = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = ` SELECT 
        HEADCOUNT.*
        
        FROM SAMT_HEADCOUNT_AUTORIZADO AS HEADCOUNT
        
        INNER JOIN SAMT_ESTATUS_HEADCOUNT AS HESTATUS ON
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = HESTATUS.EMP_CSC_EMPRESA_HOST
        AND HEADCOUNT.TIPO_ESTATUS_HEADCOUNT_CSC = HESTATUS.ESTATUS_HEADCOUNT_CSC 
        
        WHERE 
        HEADCOUNT.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND HEADCOUNT.EMPLEADO_CSC_EMPLEADO IS NULL
        AND HESTATUS.ESTATUS_CLAVE = ${__Request_Pool.escape(req.query.ESTATUS_CLAVE)} ` ;

        if(req.query.CLIENTE_CSC){
            query += ` AND HEADCOUNT.CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} ` ;
        }

        if(req.query.PM_CSC_PROYECTO){
            query += ` AND HEADCOUNT.PM_CSC_PROYECTO = ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)} ` ;
        }

        if(req.query.CAM_CSC_SERVICIO){
            query += ` AND HEADCOUNT.CAM_CSC_SERVICIO = ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} ` ;
        }

        if(req.query.HCA_REQ_CSCREQUISICION){
            query += ` AND HEADCOUNT.HCA_REQ_CSCREQUISICION = ${__Request_Pool.escape(req.query.HCA_REQ_CSCREQUISICION)} ` ;
        }

        if(req.query.CAT_CATEGORIA_PUESTO_CSC){
            query += ` AND HEADCOUNT.CAT_CATEGORIA_PUESTO_CSC = ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} ` ;
        }

        if(req.query.TIPO_PUESTO_CSCEMPLEADO){
            query += ` AND HEADCOUNT.TIPO_PUESTO_CSCEMPLEADO = ${__Request_Pool.escape(req.query.TIPO_PUESTO_CSCEMPLEADO)} ` ;
        }

        if(req.query.TIPO_TURNO_CSCTURNO){
            query += ` AND HEADCOUNT.TIPO_TURNO_CSCTURNO = ${__Request_Pool.escape(req.query.TIPO_TURNO_CSCTURNO)} ` ;
        }

        if(req.query.TIPO_ESTATUS_HEADCOUNT_CSC){
            query += ` AND HEADCOUNT.TIPO_ESTATUS_HEADCOUNT_CSC = ${__Request_Pool.escape(req.query.TIPO_ESTATUS_HEADCOUNT_CSC)} ` ;
        }

        if(req.query.HCA_PRESUPUESTO_CONTRATADO){
            query += ` AND HEADCOUNT.HCA_PRESUPUESTO_CONTRATADO = ${__Request_Pool.escape(req.query.HCA_PRESUPUESTO_CONTRATADO)} ` ;
        }

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
};


exports.Delete_Headcaunt_Autorizado = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = `DELETE FROM SAMT_HEADCOUNT_AUTORIZADO 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST)} 
        AND HCA_PUESTOS_CSC = ${__Request_Pool.escape(req.body.HCA_PUESTOS_CSC)} `;

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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

exports.Insert_Headcount_Detalle = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_HEADCOUNT_DETALLE SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Insert_Empleado_Puestos_Anteriores = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADOS_PUESTOS_ANTERIORES SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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


exports.Get_Empleado_Puestos_Anteriores = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
        query = ` SELECT * FROM SAMT_EMPLEADOS_PUESTOS_ANTERIORES         
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)} ` ;

        if(req.query.CLIENTE_CSC){
            query += ` AND CLIENTE_CSC = ${__Request_Pool.escape(req.query.CLIENTE_CSC)} ` ;
        }

        if(req.query.PM_CSC_PROYECTO){
            query += ` AND PM_CSC_PROYECTO = ${__Request_Pool.escape(req.query.PM_CSC_PROYECTO)} ` ;
        }

        if(req.query.CAM_CSC_SERVICIO){
            query += ` AND CAM_CSC_SERVICIO = ${__Request_Pool.escape(req.query.CAM_CSC_SERVICIO)} ` ;
        }

        if(req.query.CAT_CATEGORIA_PUESTO_CSC){
            query += ` AND CAT_CATEGORIA_PUESTO_CSC = ${__Request_Pool.escape(req.query.CAT_CATEGORIA_PUESTO_CSC)} ` ;
        }

        if(req.query.TIPO_PUESTO_CSCEMPLEADO){
            query += ` AND TIPO_PUESTO_CSCEMPLEADO = ${__Request_Pool.escape(req.query.TIPO_PUESTO_CSCEMPLEADO)} ` ;
        }

        query += ` ORDER BY PUESTOS_ANT_CSC DESC`; 

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
};



exports.Insert_Empleado_Bitacora_Cliente = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SAMT_EMPLEADO_BITACORA_CLIENTE SET ?";
        __Request_Pool.query(query, __RecorreDatos, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Get' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Insert', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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



exports.Update_Empleado_Path_Foto = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);

        var query = `UPDATE SAMT_EMPLEADOS 
        SET EMPLEADO_PATHFOTO = ${req.body.EMPLEADO_PATHFOTO} 
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST)} 
        AND EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO)} 
        AND EMPLEADO_UNIQUE_ID = ${__Request_Pool.escape(req.body.EMPLEADO_UNIQUE_ID)} `;

        __Request_Pool.query(query, function (error, resultReturn) {
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = { success: false, message: 'No Data Delete' };
                    res.status(200);
                    res.send(ResultData);

                } else {
                    ResultData = { success: true, message: 'Success Data Delete', count: resultReturn.affectedRows, JsonData: resultReturn.insertId };
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



Get_Campos_Empleados = async (req) =>{
    return new Promise( (resolve,reject)=>{
        try {
            let query = null;
            var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
    
            query = ` SELECT 
                COLUMN_NAME 
            FROM information_schema.COLUMNS  
            WHERE table_name='SAMT_EMPLEADOS' AND TABLE_SCHEMA = DATABASE()  ORDER BY ordinal_position ASC ;`;
    
            __Request_Pool.query(query, function (error, resultReturn, fields) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(resultReturn);
                }
            });
        }
        catch (error) {
            reject(error)
        }
    })
    .catch(function(e){
        return new Promise( (resolve,reject)=>{
            reject(e);
        });
    });
}


exports.Get_Reporte_General_Empleados = async (req, res) => {
    try{
        Get_Campos_Empleados(req).then(function(columnas){
            var Count_Indice = 0;
            var STRING_CAMPOS_SELECT = "";
            columnas.map(function(item){
                if(item.COLUMN_NAME === "EMPLEADO_HUELLA_DIGITAL" || item.COLUMN_NAME === "EMPLEADO_HUELLA_DIGITAL_10" || item.COLUMN_NAME === "EMPLEADO_PATHFOTO"){
                    //LAS IGNORAMOS
                }
                else{
                    if(Count_Indice == 0){
                        STRING_CAMPOS_SELECT += `SAMT_EMPLEADOS.${item.COLUMN_NAME}`;
                    }
                    else{
                        STRING_CAMPOS_SELECT += ` 
                        , SAMT_EMPLEADOS.${item.COLUMN_NAME}`;
                    }
                    Count_Indice ++;
                }
            });

            let query = null;
            var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);
            query = `
            SELECT 
            
            ${STRING_CAMPOS_SELECT}

            ,CONCAT(SAMT_EMPLEADOS.EMPLEADO_APATERNOEMPLEADO,' ',SAMT_EMPLEADOS.EMPLEADO_AMATERNOEMPLEADO,' ',SAMT_EMPLEADOS.EMPLEADO_NOMBREEMPLEADO) AS NOMBRE_EMPLEADO
            ,CASE 
            WHEN EMPLEADO_FECH_BAJAEMPLEADO IS NOT NULL THEN DATEDIFF(EMPLEADO_FECH_BAJAEMPLEADO, EMPLEADO_FECH_INGRESOEMP)
            ELSE DATEDIFF(NOW(),EMPLEADO_FECH_INGRESOEMP) 
            END AS PERIODO_INGRESO

            ,CASE 
            WHEN EMPLEADO_FECH_FIRMACONTRATO IS NULL THEN 0 
            WHEN EMPLEADO_FECH_BAJAEMPLEADO IS NULL THEN  DATEDIFF(EMPLEADO_FECH_BAJAEMPLEADO,EMPLEADO_FECH_FIRMACONTRATO)
            WHEN EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL THEN DATEDIFF(NOW(),EMPLEADO_FECH_FIRMACONTRATO) 
            ELSE 0 
            END AS PERIODO_CONTRATO

            ,NIVEL1.EMP_TREE_BAJA_PARENT AS CAUSABAJA
            ,NIVEL2.EMP_TREE_BAJA_PARENT  AS TIPOBAJA
            ,SAMT_CAT_JORNADAS_EMPLEADOS.CAT_JORNADA_IDIOMA1 AS CAT_JORNADA_DESCRIPCION
            ,SAMT_CAT_JORNADAS_EMPLEADOS.CAT_DECRIPCION_REPORTE1
            ,SAMT_CAT_JORNADAS_EMPLEADOS.CAT_DECRIPCION_REPORTE2

            ,(SELECT EDO_DESCESTADO FROM SAMT_ESTADOS WHERE EMP_CSC_EMPRESA_HOST =  SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND EDO_CSCESTADO = SAMT_EMPLEADOS.EMPLEADO_DIRECCION_EDO_CSCESTADO) AS ESTADO_DESCRIPCION

            ,(SELECT DATE(MAX(EMPLEADO_FECH_AGENDA)) FROM SAMT_EMPLEADO_AGENDA_RECUTAMIENTO WHERE EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO) AS FECHA_CITA

            ,CASE 
            WHEN EMPLEADO_FECH_INICIAOPERACION IS NULL THEN 0
            WHEN EMPLEADO_FECH_CAPACITACION IS NULL THEN 0
            ELSE DATEDIFF(EMPLEADO_FECH_INICIAOPERACION,EMPLEADO_FECH_CAPACITACION) +1 
            END AS DURACION_CAPACITACION

            ,CASE 
            WHEN EMPLEADO_FECH_INICIAOPERACION IS NULL THEN 0
            WHEN EMPLEADO_FECH_BAJAEMPLEADO IS NULL THEN DATEDIFF(NOW(),EMPLEADO_FECH_INICIAOPERACION)
            ELSE DATEDIFF(EMPLEADO_FECH_BAJAEMPLEADO,EMPLEADO_FECH_INICIAOPERACION) 
            END AS DURACION_OPERACION

            ,(SELECT GD_ESTRUCTURA_AVANCE 
            FROM SAMT_GD_ESTRUCTURA_WBS_EMPLEADOS AS GD 
            WHERE GD.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST AND 
            GD.EMPLEADO_CSC_EMPLEADO =  SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO AND 
            GD_ESTRUCTURA_PADRE IS NULL LIMIT 1) AS GD_ESTRUCTURA_AVANCE

            ,(SELECT CONCAT(JEFE.EMPLEADO_APATERNOEMPLEADO,' ',JEFE.EMPLEADO_AMATERNOEMPLEADO,' ',JEFE.EMPLEADO_NOMBREEMPLEADO) 
            FROM SAMT_EMPLEADOS AS JEFE WHERE JEFE.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
            AND JEFE.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO_PADRE) AS NOMBRE_JEFE_INMEDIATO 

            ,(SELECT EMPLEADO_ID_EXTERNO
            FROM SAMT_EMPLEADOS AS JEFENOM WHERE JEFENOM.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
            AND JEFENOM.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO_PADRE) AS NOMINA_JEFE_DIRECTO 

            ,(SELECT CONCAT(CAPACITADOR.EMPLEADO_APATERNOEMPLEADO,' ',CAPACITADOR.EMPLEADO_AMATERNOEMPLEADO,' ',CAPACITADOR.EMPLEADO_NOMBREEMPLEADO) 
            FROM SAMT_EMPLEADOS AS CAPACITADOR WHERE CAPACITADOR.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
            AND CAPACITADOR.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CAPACITADOR_CSC) AS NOMBRE_CAPACITADOR

            ,(SELECT CONCAT(ENTREVISTADOR.EMPLEADO_APATERNOEMPLEADO,' ',ENTREVISTADOR.EMPLEADO_AMATERNOEMPLEADO,' ',ENTREVISTADOR.EMPLEADO_NOMBREEMPLEADO) 
            FROM SAMT_EMPLEADOS AS ENTREVISTADOR WHERE ENTREVISTADOR.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
            AND ENTREVISTADOR.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_ENTREVISTADOR_CSC) AS NOMBRE_ENTREVISTADOR

            ,(SELECT CONCAT(RECLUTADOR.EMPLEADO_APATERNOEMPLEADO,' ',RECLUTADOR.EMPLEADO_AMATERNOEMPLEADO,' ',RECLUTADOR.EMPLEADO_NOMBREEMPLEADO) 
            FROM SAMT_EMPLEADOS AS RECLUTADOR WHERE RECLUTADOR.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
            AND RECLUTADOR.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_RECLUTADOR_CSC) AS NOMBRE_RECLUTADOR

            FROM SAMT_EMPLEADOS 

            LEFT JOIN SAMT_EMPLEADO_JORNADAS ON 
            SAMT_EMPLEADO_JORNADAS.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
            AND SAMT_EMPLEADO_JORNADAS.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO

            LEFT JOIN SAMT_CAT_JORNADAS_EMPLEADOS ON 
            SAMT_CAT_JORNADAS_EMPLEADOS.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADO_JORNADAS.EMP_CSC_EMPRESA_HOST
            AND SAMT_CAT_JORNADAS_EMPLEADOS.CAT_JORNADAS_CSC = SAMT_EMPLEADO_JORNADAS.CAT_JORNADAS_CSC

            LEFT JOIN (
                    SELECT 
                    EMP_CSC_EMPRESA_HOST
                    ,EMP_TREE_BAJA_CSC
                    ,EMP_TREE_BAJA_PARENT 
                    FROM SAMT_EMP_TREE_BAJA 
                    WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} ) AS NIVEL1 ON 
                    NIVEL1.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST 
                    AND NIVEL1.EMP_TREE_BAJA_CSC = SAMT_EMPLEADOS.CAT_EMP_TREE_BAJA_CSC 
                    
            LEFT JOIN (SELECT 
                    EMP_CSC_EMPRESA_HOST
                    ,EMP_TREE_BAJA_CSC
                    ,EMP_TREE_BAJA_PARENT 
                    FROM SAMT_EMP_TREE_BAJA 
                    WHERE EMP_CSC_EMPRESA_HOST =  ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  ) AS NIVEL2 ON 
                    NIVEL2.EMP_CSC_EMPRESA_HOST= NIVEL1.EMP_CSC_EMPRESA_HOST 
                    AND NIVEL2.EMP_TREE_BAJA_CSC = NIVEL1.EMP_TREE_BAJA_PARENT
            
            WHERE 
                SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}  `;

                
            if(req.query.EMPRESA_LABORAL_CSC){
                query += ` AND SAMT_EMPLEADOS.EMPRESA_LABORAL_CSC IN (${req.query.EMPRESA_LABORAL_CSC}) `;
            }

            if(req.query.TIPO_QUERY == "CONTRATADOS"){
                if(req.query.CAT_ESTATUS_PROCESO_EMP_CSC){
                    query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.ESTATUS_PROCESO_EMP_CSC IN (${req.query.CAT_ESTATUS_PROCESO_EMP_CSC}) AND SAMT_EMPLEADOS.EMPLEADO_FECH_FIRMACONTRATO IS NOT NULL `;
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "ESTATUS"){
                if(req.query.CAT_ESTATUS_PROCESO_EMP_CSC){
                    query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.ESTATUS_PROCESO_EMP_CSC IN (${req.query.CAT_ESTATUS_PROCESO_EMP_CSC}) `;
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "PROCESO"){
                if(req.query.CAT_PROCESO_EMP_CSC || req.query.CAT_SUBPROCESO_EMP_CSC){

                    if(req.query.CAT_PROCESO_EMP_CSC && req.query.CAT_SUBPROCESO_EMP_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND (  SAMT_EMPLEADOS.CAT_PROCESO_EMP_CSC IN (${req.query.CAT_PROCESO_EMP_CSC}) OR SAMT_EMPLEADOS.CAT_SUBPROCESO_EMP_CSC IN (${req.query.CAT_SUBPROCESO_EMP_CSC})  ) `;
                    }
                    else if(req.query.CAT_PROCESO_EMP_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.CAT_PROCESO_EMP_CSC IN (${req.query.CAT_PROCESO_EMP_CSC}) `;
                    }
                    else if(req.query.CAT_SUBPROCESO_EMP_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.CAT_SUBPROCESO_EMP_CSC IN (${req.query.CAT_SUBPROCESO_EMP_CSC}) `;
                    }
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "AREA"){
                if(req.query.TIPO_AREA_CSC || req.query.EMPLEADO_DEPARTAMENTO_CSC){
                    if(req.query.TIPO_AREA_CSC && req.query.EMPLEADO_DEPARTAMENTO_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND ( SAMT_EMPLEADOS.CAT_AREA_CSC IN (${req.query.TIPO_AREA_CSC})  OR  SAMT_EMPLEADOS.CAT_DEPARTAMENTO_CSC IN (${req.query.EMPLEADO_DEPARTAMENTO_CSC})  )`;
                    }
                    else if(req.query.TIPO_AREA_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.CAT_AREA_CSC IN (${req.query.TIPO_AREA_CSC}) `;
                    }
                    else if(req.query.EMPLEADO_DEPARTAMENTO_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.CAT_DEPARTAMENTO_CSC IN (${req.query.EMPLEADO_DEPARTAMENTO_CSC}) `;
                    }
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "PUESTO"){
                if(req.query.CAT_CATEGORIA_PUESTO_CSC || req.query.TIPO_PUESTO_CSCEMPLEADO){

                    if(req.query.CAT_CATEGORIA_PUESTO_CSC && req.query.TIPO_PUESTO_CSCEMPLEADO){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND  ( SAMT_EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC IN (${req.query.CAT_CATEGORIA_PUESTO_CSC})  OR  SAMT_EMPLEADOS.CAT_PUESTO_CSCEMPLEADO IN (${req.query.TIPO_PUESTO_CSCEMPLEADO})  )`;
                    }
                    else if(req.query.CAT_CATEGORIA_PUESTO_CSC){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.CAT_CATEGORIA_PUESTO_CSC IN (${req.query.CAT_CATEGORIA_PUESTO_CSC}) `;
                    }
                    else if(req.query.TIPO_PUESTO_CSCEMPLEADO){
                        query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.CAT_PUESTO_CSCEMPLEADO IN (${req.query.TIPO_PUESTO_CSCEMPLEADO}) `;
                    }
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "ULABORAL"){
                if(req.query.TIPO_UBICACION_LABORAL_CSC){
                    query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1  AND SAMT_EMPLEADOS.TIPO_UBICACION_LABORAL_CSC IN (${req.query.TIPO_UBICACION_LABORAL_CSC}) `;
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "REQUISICION"){
                if(req.query.REQ_CSCREQUISICION){
                    query += ` AND SAMT_EMPLEADOS.EMPLEADO_CVEESTATUS = 1 AND SAMT_EMPLEADOS.REQ_CSCREQUISICION IN (${req.query.REQ_CSCREQUISICION}) `;
                }
                else{
                    query = "--";
                }
            }
            else if(req.query.TIPO_QUERY == "CLIENTE_PROYECTO_CAMPANIA"){

                var ARRAY_FRAGMENT_QUERY = new Array();
                if(req.query.CLIENTE_CSC || req.query.PM_CSC_PROYECTO || req.query.CAM_CSC_SERVICIO){
                    
                    if(req.query.CLIENTE_CSC){
                        ARRAY_FRAGMENT_QUERY.push(` SAMT_EMPLEADOS.CLIENTE_CSC IN (${req.query.CLIENTE_CSC}) `)
                    }
                    if(req.query.PM_CSC_PROYECTO){
                        ARRAY_FRAGMENT_QUERY.push(` SAMT_EMPLEADOS.PM_CSC_PROYECTO IN (${req.query.PM_CSC_PROYECTO}) `)
                    }
                    if(req.query.CAM_CSC_SERVICIO){
                        ARRAY_FRAGMENT_QUERY.push(` SAMT_EMPLEADOS.CAM_CSC_SERVICIO IN (${req.query.CAM_CSC_SERVICIO}) `)
                    }

                    query += ` 
                    AND SAMT_EMPLEADOS.ESTATUS_PROCESO_EMP_CSC IN (${req.query.CAT_ESTATUS_PROCESO_EMP_CSC})
                    AND  (  ${ARRAY_FRAGMENT_QUERY.join(' OR ')} ) `;

                }
                else{
                    query = "--";
                }
            }
            else{
                query = "--";
            }
            query += ";";

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
        })
        .catch(function(errorcolums){
            ResultData = { success: false, message: errorcolums.message };
            res.status(500);
            res.send(ResultData);
            console.log(errorcolums);
        });
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};