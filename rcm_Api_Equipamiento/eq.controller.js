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

return year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + (date)).slice(-2) + " "  +("0" + (hours)).slice(-2) +':'+ ("0" + (minutes)).slice(-2) +':'+ ("0" + (seconds)).slice(-2);
}

exports.Get_Equipo = async (req, res) => {
try {
    let query = null;
    let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

    query = `SELECT * FROM SAMT_EQUIPO WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

    if (req.query.SAMT_CSCEQUIPAMIENTO) {
        query += " AND SAMT_CSCEQUIPAMIENTO = "+__Request_Pool.escape(req.query.SAMT_CSCEQUIPAMIENTO);
    }
    if (req.query.REQ_CSCREQUISICION) {
        query += " AND REQ_CSCREQUISICION = "+__Request_Pool.escape(req.query.REQ_CSCREQUISICION);
    }
    if (req.query.INM_CSCINMUEBLE) {
        query += " AND INM_CSCINMUEBLE = "+__Request_Pool.escape(req.query.INM_CSCINMUEBLE);
    }


    if (req.query.CSC_TIPO_SISTEMA_EQ) {
        query += " AND  CSC_TIPO_SISTEMA_EQ= "+__Request_Pool.escape(req.query.CSC_TIPO_SISTEMA_EQ);
    }
    if (req.query.CSC_TIPO_EQUIPO) {
        query += " AND  CSC_TIPO_EQUIPO = "+__Request_Pool.escape(req.query.CSC_TIPO_EQUIPO);
    }
    if (req.query.CSC_PROVEDOR_EQUIPO) {
        query += " AND CSC_PROVEDOR_EQUIPO = "+__Request_Pool.escape(req.query.CSC_PROVEDOR_EQUIPO);
    }
    if (req.query.TIPO_ESTADO_EQUIPO_CSC) {
        query += " AND  TIPO_ESTADO_EQUIPO_CSC = "+__Request_Pool.escape(req.query.TIPO_ESTADO_EQUIPO_CSC);
    }
    if (req.query.CAT_MARCA_PROD_CSC) {
        query += " AND CAT_MARCA_PROD_CSC = "+__Request_Pool.escape(req.query.CAT_MARCA_PROD_CSC);
    }
    if (req.query.EQUIPAMIENTO_MODELO) {
        query += " AND EQUIPAMIENTO_MODELO = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_MODELO);
    }
    if (req.query.EQUIPAMIENTO_CODBARRAS) {
        query += " AND EQUIPAMIENTO_CODBARRAS = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_CODBARRAS);
    }
    if (req.query.EQUIPAMIENTO_NO_SERIE) {
        query += " AND EQUIPAMIENTO_NO_SERIE = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_NO_SERIE);
    }
    if (req.query.EQUIPAMIENTO_NO_PARTE) {
        query += " AND EQUIPAMIENTO_NO_PARTE = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_NO_PARTE);
    }
    if (req.query.EQUIPAMIENTO_NO_INVENTARIO) {
        query += " AND EQUIPAMIENTO_NO_INVENTARIO = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_NO_INVENTARIO);
    }
    if (req.query.EQUIPAMIENTO_NEWID) {
        query += " AND EQUIPAMIENTO_NEWID = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_NEWID);
    }
    if (req.query.SAMT_CAT_GRUPO_SISTEMA_CSC) {
        query += " AND SAMT_CAT_GRUPO_SISTEMA_CSC = "+__Request_Pool.escape(req.query.SAMT_CAT_GRUPO_SISTEMA_CSC);
    }
    if (req.query.CAM_CSC_SERVICIO) {
        query += " AND CAM_CSC_SERVICIO = "+__Request_Pool.escape(req.query.CAM_CSC_SERVICIO);
    }
    if (req.query.EQUIPAMIENTO_AUX1S) {
        query += " AND LOWER(EQUIPAMIENTO_AUX1S) LIKE LOWER("+__Request_Pool.escape("%"+req.query.EQUIPAMIENTO_AUX1S+"%")+")";
    } 
    if (req.query.EQUIPAMIENTO_HOSTNAME) {
        query += " AND LOWER(EQUIPAMIENTO_HOSTNAME) LIKE LOWER("+__Request_Pool.escape("%"+req.query.EQUIPAMIENTO_HOSTNAME+"%")+")";
    } 
    if (req.query.EQUIPAMIENTO_CODIGO_VPN) {
        query += " AND EQUIPAMIENTO_CODIGO_VPN = "+__Request_Pool.escape(req.query.EQUIPAMIENTO_CODIGO_VPN);
    } 
    console.log(query);
    
    query += ";--";
    __Request_Pool.query(query,function(error, resultReturn, fields){
        if (error) {
            ResultData = {success: false,message: error.message};
            res.status(400);
            res.send(ResultData);
            console.log(ResultData);
            let DataErr = {
                Fecha: GetDate(),
                Detalle: error.originalError
            }
            console.log(DataErr);
        }
        else{
            if (resultReturn.length === 0) {
                ResultData = {success: false,message: 'No Data Get'};
                res.status(200);
                res.send(ResultData);
            } else {
                ResultData = {success: true,message: 'Success Data Get',count: resultReturn.length,JsonData: resultReturn};
                res.status(200);
                res.send(ResultData);
                
            }
        }
    });
    }
    catch (error) {
    ResultData = {success: false,message: error.message};
    res.status(500);
    res.send(ResultData);
    console.log(error);
    }
}

exports.Insert_Equipo = async (req,res) => {
try {
    let __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
    let __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
    let query = "INSERT INTO SAMT_EQUIPO SET ?";
    __Request_Pool.query(query, __RecorreDatos,function(error, resultReturn){
        if (error) {
            ResultData = {success: false,message: error.message};
            res.status(400);
            res.send(ResultData);
            console.log(ResultData);
            let DataErr = {
                Fecha: GetDate(),
                Detalle: error.originalError
            }
            console.log(DataErr);
        }
        else{
            if (resultReturn.affectedRows[0] === 0) {
                ResultData = {success: false,message: 'No Data Get'};
                res.status(200);
                res.send(ResultData);
                
            } else {
                ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId};
                res.status(200);
                res.send(ResultData);
                
            }
            
        }
    });
} catch (error) {
    ResultData = {success: false,message: error.message};
    res.status(500);
    res.send(ResultData);
    console.log(error);
}
};

exports.Update_Equipo = async (req,res) => {
    try {
        let __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        
        let query = "UPDATE SAMT_EQUIPO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";
        
        __Request_Pool.query(query, function(error, resultReturn){
            if (error) {
                ResultData = {success: false,message: error.message};
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error.originalError
                }
                console.log(DataErr);
            }
            else{
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.info,JsonData: resultReturn.changedRows};
                    res.status(200);
                    res.send(ResultData);
                    
                }
                
            }
        });

    } catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.Get_ProdServicios = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
    
        query = `SELECT * FROM SAMT_PRODUCTOS_SERVICIOS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;
    
        if (req.query.PRODC_SERV_CSC) {
            query += " AND PRODC_SERV_CSC = "+__Request_Pool.escape(req.query.PRODC_SERV_CSC);
        }
        if (req.query.TIPO_CLASE_CSC) {
            query += " AND TIPO_CLASE_CSC = "+__Request_Pool.escape(req.query.TIPO_CLASE_CSC);
        }
        if (req.query.PRODC_SERV_NOMBRE) {
            query += " AND PRODC_SERV_NOMBRE = "+__Request_Pool.escape(req.query.PRODC_SERV_NOMBRE);
        }
        if (req.query.PRODC_SERV_MODELO) {
            query += " AND  PRODC_SERV_MODELO= "+__Request_Pool.escape(req.query.PRODC_SERV_MODELO);
        }
        if (req.query.CAT_MARCA_CSC) {
            query += " AND  CAT_MARCA_CSC = "+__Request_Pool.escape(req.query.CAT_MARCA_CSC);
        }    
        query += ";--";
        __Request_Pool.query(query,function(error, resultReturn, fields){
            if (error) {
                ResultData = {success: false,message: error.message};
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error.originalError
                }
                console.log(DataErr);
            }
            else{
                if (resultReturn.length === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.length,JsonData: resultReturn};
                    res.status(200);
                    res.send(ResultData);
                    
                }
            }
        });
        }
        catch (error) {
            ResultData = {success: false,message: error.message};
            res.status(500);
            res.send(ResultData);
            console.log(error);
        }
}

exports.Get_Fotos = async (req, res) => {
try {
    let query = null;
    let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
    query = `SELECT * FROM SAMT_EQUIPOS_FOTO WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EQUIPAMIENTO_NEWID = ${__Request_Pool.escape(req.query.EQUIPAMIENTO_NEWID)}`;
    query += ";--";
    __Request_Pool.query(query,function(error, resultReturn, fields){
        if (error) {
            ResultData = {success: false,message: error.message};
            res.status(400);
            res.send(ResultData);
            console.log(ResultData);
            let DataErr = {
                Fecha: GetDate(),
                Detalle: error.originalError
            }
            console.log(DataErr);
        }
        else{
            if (resultReturn.length === 0) {
                ResultData = {success: false,message: 'No Data Get'};
                res.status(200);
                res.send(ResultData);
            } else {
                ResultData = {success: true,message: 'Success Data Get',count: resultReturn.length,JsonData: resultReturn};
                res.status(200);
                res.send(ResultData);
                
            }
        }
    });
    }
    catch (error) {
    ResultData = {success: false,message: error.message};
    res.status(500);
    res.send(ResultData);
    console.log(error);
    }
}


exports.Get_ProdServiciosSPF = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
        query = `SELECT * FROM XPV_PROVEEDORES_PRECIOS WHERE PROVEEDOR_ACTIVO = 1`;

        if (req.query.ID_MUNICIPIO) {
            query += ` AND ID_DIRECCION_MUNICIPIO = ${__Request_Pool.escape(req.query.ID_MUNICIPIO)}`
        }
        if (req.query.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO) {
            query += ` AND ID_DIRECCION_ESTADOS = ${__Request_Pool.escape(req.query.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO)}`
        }
        if (req.query.PRODUCTOS_PROVEEDORES_DIRECCION_CP) {
            query += ` AND PRODUCTOS_PROVEEDORES_DIRECCION_CP = ${__Request_Pool.escape(req.query.PRODUCTOS_PROVEEDORES_DIRECCION_CP)}`
        }
        query += ";--";
        __Request_Pool.query(query,function(error, resultReturn, fields){
            if (error) {
                ResultData = {success: false,message: error.message};
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error.originalError
                }
                console.log(DataErr);
            }
            else{
                if (resultReturn.length === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.length,JsonData: resultReturn};
                    res.status(200);
                    res.send(ResultData);
                    
                }
            }
        });
        }
        catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
        }
}


exports.Get_DevengosSPF = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        if (req.query.TIPO_USUARIO == "SPF") {
            query = `
            SELECT DEVENGO.EQUIPAMIENTO_NEWID
            ,DEVENGO.EQUIPAMIENTO_FECHA_ADQUISICION
            ,DEVENGO.EQUIPAMIENTO_FECHA_ULTIMO_ESTATUS
            ,DEVENGO.EQUIPAMIENTO_COMENTARIO_ULTIMO_ESTATUS
            ,DEVENGO.EQUIPAMIENTO_PRECIO_VENTA AS EQUIPAMIENTO_PRECIO_COSTO
            ,DEVENGO.EQUIPAMIENTO_PRECIO_VENTA_IMPUESTO AS EQUIPAMIENTO_PRECIO_COSTO_IMPUESTO
            ,EST_DEV.CSC_TIPO_ESTATUS_EQUIPO
            ,EST_DEV.TIPO_ESTATUS_IDIOMA1
            ,EST_DEV.TIPO_ESTATUS_CLAVE
            ,PROD_SER.PRODC_SERV_CSC ID_PRODC_SERV
            ,PROD_SER.PRODC_SERV_NOMBRE
            ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC AS ID_PROVEEDOR
            ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_PAIS AS ID_DIRECCION_PAIS
            ,SAMT_PAISES.PAI_DESCPAIS AS DIRECCION_PAIS
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO AS ID_DIRECCION_ESTADO
            ,SAMT_ESTADOS.EDO_DESCESTADO AS DIRECCION_ESTADO
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_MUNICIPIO AS ID_DIRECCION_MUNICIPIO
            ,SAMT_MUNICIPIOS.MPO_DESCMUNICIPIO AS DIRECCION_MUNICIPIO
            FROM SAMT_EQUIPO AS DEVENGO 
            INNER JOIN SAMT_TIPO_ESTATUS_EQUIPO AS EST_DEV 
            ON EST_DEV.CSC_TIPO_ESTATUS_EQUIPO = DEVENGO.CSC_TIPO_ESTATUS_EQUIPO 
            AND EST_DEV.EMP_CSC_EMPRESA_HOST = DEVENGO.EMP_CSC_EMPRESA_HOST

            INNER JOIN SAMT_PRODUCTOS_SERVICIOS AS PROD_SER 
            ON PROD_SER.PRODC_SERV_CSC = DEVENGO.PRODC_SERV_CSC 
            AND PROD_SER.EMP_CSC_EMPRESA_HOST = DEVENGO.EMP_CSC_EMPRESA_HOST

            LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA
            ON DEVENGO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_PROVEEDORES_INFRA.EMP_CSC_EMPRESA_HOST
            AND DEVENGO.CSC_PROVEDOR_EQUIPO = SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC

            LEFT JOIN SAMT_PRODUCTOS_SERVICIOS_PRECIOS
            ON DEVENGO.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST
            AND DEVENGO.PRODC_SERV_PRECIO_COSTO_ID = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODC_SERV_PRECIO_CSC

            LEFT JOIN SAMT_PRODUCTOS_PROVEEDORES_DIRECCION
            ON SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.EMP_CSC_EMPRESA_HOST
            AND SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODUCTOS_PROVEEDORES_DIRECCION_CSC = SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_CSC
            LEFT JOIN dna_address.SAMT_PAISES
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_PAIS = SAMT_PAISES.PAI_CSCPAIS

            LEFT JOIN dna_address.SAMT_ESTADOS
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO = SAMT_ESTADOS.EDO_CSCESTADO

            LEFT JOIN dna_address.SAMT_MUNICIPIOS
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_MUNICIPIO = SAMT_MUNICIPIOS.MPO_CSCMUNICIPIO

            WHERE DEVENGO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND DEVENGO.TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)} 
            ORDER BY EQUIPAMIENTO_FECHA_ADQUISICION ASC;`;
        }  
        else if (req.query.TIPO_USUARIO == "PWA") {
            query = `SELECT DEVENGO.EQUIPAMIENTO_NEWID
            ,DEVENGO.EQUIPAMIENTO_FECHA_ADQUISICION
            ,DEVENGO.EQUIPAMIENTO_FECHA_ULTIMO_ESTATUS
            ,DEVENGO.EQUIPAMIENTO_COMENTARIO_ULTIMO_ESTATUS
            ,EST_DEV.CSC_TIPO_ESTATUS_EQUIPO
            ,EST_DEV.TIPO_ESTATUS_IDIOMA1
            ,EST_DEV.TIPO_ESTATUS_CLAVE
            ,PROD_SER.PRODC_SERV_CSC ID_PRODC_SERV
            ,PROD_SER.PRODC_SERV_NOMBRE
            ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC AS ID_PROVEEDOR
            ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_PAIS AS ID_DIRECCION_PAIS
            ,SAMT_PAISES.PAI_DESCPAIS AS DIRECCION_PAIS
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO AS ID_DIRECCION_ESTADO
            ,SAMT_ESTADOS.EDO_DESCESTADO AS DIRECCION_ESTADO
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_MUNICIPIO AS ID_DIRECCION_MUNICIPIO
            ,SAMT_MUNICIPIOS.MPO_DESCMUNICIPIO AS DIRECCION_MUNICIPIO
            ,DEVENGO.EQUIPAMIENTO_NUMERO_RESERVACION
            ,SAMT_CAT_SUBSISTEMA_PRODCT_SER.CAT_SUBSISTEMA_CODIGO AS CODIGO
            FROM SAMT_EQUIPO AS DEVENGO 
            INNER JOIN SAMT_TIPO_ESTATUS_EQUIPO AS EST_DEV 
            ON EST_DEV.CSC_TIPO_ESTATUS_EQUIPO = DEVENGO.CSC_TIPO_ESTATUS_EQUIPO 
            AND EST_DEV.EMP_CSC_EMPRESA_HOST = DEVENGO.EMP_CSC_EMPRESA_HOST

            INNER JOIN SAMT_PRODUCTOS_SERVICIOS AS PROD_SER 
            ON PROD_SER.PRODC_SERV_CSC = DEVENGO.PRODC_SERV_CSC 
            AND PROD_SER.EMP_CSC_EMPRESA_HOST = DEVENGO.EMP_CSC_EMPRESA_HOST

            LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA
            ON DEVENGO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_PROVEEDORES_INFRA.EMP_CSC_EMPRESA_HOST
            AND DEVENGO.CSC_PROVEDOR_EQUIPO = SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC

            LEFT JOIN SAMT_PRODUCTOS_SERVICIOS_PRECIOS
            ON DEVENGO.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST
            AND DEVENGO.PRODC_SERV_PRECIO_COSTO_ID = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODC_SERV_PRECIO_CSC

            LEFT JOIN SAMT_PRODUCTOS_PROVEEDORES_DIRECCION
            ON SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.EMP_CSC_EMPRESA_HOST
            AND SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODUCTOS_PROVEEDORES_DIRECCION_CSC = SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_CSC
            LEFT JOIN dna_address.SAMT_PAISES
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_PAIS = SAMT_PAISES.PAI_CSCPAIS

            LEFT JOIN dna_address.SAMT_ESTADOS
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO = SAMT_ESTADOS.EDO_CSCESTADO

            LEFT JOIN dna_address.SAMT_MUNICIPIOS
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_MUNICIPIO = SAMT_MUNICIPIOS.MPO_CSCMUNICIPIO
            
            JOIN SAMT_CAT_SUBSISTEMA_PRODCT_SER ON PROD_SER.EMP_CSC_EMPRESA_HOST = SAMT_CAT_SUBSISTEMA_PRODCT_SER.EMP_CSC_EMPRESA_HOST
            AND PROD_SER.CAT_SUP_SISTEMA_CSC = SAMT_CAT_SUBSISTEMA_PRODCT_SER.CAT_SUB_SISTEMA_CSC
            WHERE DEVENGO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND DEVENGO.TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)} 
            AND SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC <> 1
            ORDER BY EQUIPAMIENTO_FECHA_ADQUISICION ASC;`;
        }
        else {
            query = `SELECT DEVENGO.EQUIPAMIENTO_NEWID
            ,DEVENGO.EQUIPAMIENTO_FECHA_ADQUISICION
            ,DEVENGO.EQUIPAMIENTO_FECHA_ULTIMO_ESTATUS
            ,DEVENGO.EQUIPAMIENTO_COMENTARIO_ULTIMO_ESTATUS
            ,DEVENGO.EQUIPAMIENTO_PRECIO_COSTO
            ,DEVENGO.EQUIPAMIENTO_PRECIO_COSTO_IMPUESTO
            ,EST_DEV.CSC_TIPO_ESTATUS_EQUIPO
            ,EST_DEV.TIPO_ESTATUS_IDIOMA1
            ,EST_DEV.TIPO_ESTATUS_CLAVE
            ,PROD_SER.PRODC_SERV_CSC ID_PRODC_SERV
            ,PROD_SER.PRODC_SERV_NOMBRE
            ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC AS ID_PROVEEDOR
            ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE

            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_PAIS AS ID_DIRECCION_PAIS
            ,SAMT_PAISES.PAI_DESCPAIS AS DIRECCION_PAIS
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO AS ID_DIRECCION_ESTADO
            ,SAMT_ESTADOS.EDO_DESCESTADO AS DIRECCION_ESTADO
            ,SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_MUNICIPIO AS ID_DIRECCION_MUNICIPIO
            ,SAMT_MUNICIPIOS.MPO_DESCMUNICIPIO AS DIRECCION_MUNICIPIO
            ,DEVENGO.EQUIPO_INCIDENCIA_CSC
             
            FROM SAMT_EQUIPO AS DEVENGO 
            INNER JOIN SAMT_TIPO_ESTATUS_EQUIPO AS EST_DEV 
            ON EST_DEV.CSC_TIPO_ESTATUS_EQUIPO = DEVENGO.CSC_TIPO_ESTATUS_EQUIPO 
            AND EST_DEV.EMP_CSC_EMPRESA_HOST = DEVENGO.EMP_CSC_EMPRESA_HOST

            INNER JOIN SAMT_PRODUCTOS_SERVICIOS AS PROD_SER 
            ON PROD_SER.PRODC_SERV_CSC = DEVENGO.PRODC_SERV_CSC 
            AND PROD_SER.EMP_CSC_EMPRESA_HOST = DEVENGO.EMP_CSC_EMPRESA_HOST

            LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA
            ON DEVENGO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_PROVEEDORES_INFRA.EMP_CSC_EMPRESA_HOST
            AND DEVENGO.CSC_PROVEDOR_EQUIPO = SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC

            LEFT JOIN SAMT_PRODUCTOS_SERVICIOS_PRECIOS
            ON DEVENGO.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST
            AND DEVENGO.PRODC_SERV_PRECIO_COSTO_ID = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODC_SERV_PRECIO_CSC

            LEFT JOIN SAMT_PRODUCTOS_PROVEEDORES_DIRECCION
            ON SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.EMP_CSC_EMPRESA_HOST
            AND SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODUCTOS_PROVEEDORES_DIRECCION_CSC = SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_CSC
            LEFT JOIN dna_address.SAMT_PAISES
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_PAIS = SAMT_PAISES.PAI_CSCPAIS

            LEFT JOIN dna_address.SAMT_ESTADOS
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_ESTADO = SAMT_ESTADOS.EDO_CSCESTADO

            LEFT JOIN dna_address.SAMT_MUNICIPIOS
            ON SAMT_PRODUCTOS_PROVEEDORES_DIRECCION.PRODUCTOS_PROVEEDORES_DIRECCION_MUNICIPIO = SAMT_MUNICIPIOS.MPO_CSCMUNICIPIO

            WHERE DEVENGO.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND DEVENGO.TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)} 
            ORDER BY EQUIPAMIENTO_FECHA_ADQUISICION ASC;`
        }
        
        
        __Request_Pool.query(query,function(error, resultReturn, fields){
            if (error) {
                ResultData = {success: false,message: error.message};
                res.status(400);
                res.send(ResultData);
                console.log(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error.originalError
                }
                console.log(DataErr);
            }
            else{
                if (resultReturn.length === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.length,JsonData: resultReturn};
                    res.status(200);
                    res.send(ResultData);
                    
                }
            }
        });
        }
        catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
        }
}

exports.Update_SpDevengoSPF = async (req,res) => {
    try {
        let __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        let __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        let query = "CALL sp_UpdateRegistrosEquipamiento(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        __Request_Pool.execute(query, [
            __RecorreDatos.IdEmpresa,
            __RecorreDatos.FechaInicio,
            __RecorreDatos.FechaFin,
            __RecorreDatos.NoSolicitud,
            __RecorreDatos.TotalSolicitudes,
            __RecorreDatos.IdProdServicio,
            __RecorreDatos.IdProveedor,
            __RecorreDatos.IdCosto,
            __RecorreDatos.Costo,
            __RecorreDatos.Impuesto,
            __RecorreDatos.Iva,
            __RecorreDatos.CostoTraslado,
            __RecorreDatos.CostoOtros,
            __RecorreDatos.TicketNewId,
            __RecorreDatos.NumeroReservacion,
            __RecorreDatos.FormaPago,
            __RecorreDatos.PlazoCreditoMeses,
            __RecorreDatos.CodigoProducto
        ],function(error, resultReturn){
            if (error) {
                ResultData = {success: false,message: error.message};
                res.status(400);
                res.send(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error
                }
                console.log(DataErr);
            }
            else{
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows,JsonData: resultReturn.serverStatus};
                    res.status(200);
                    res.send(ResultData);
                    
                }
                
            }
        });

    } catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

//Invetarios
exports.Get_Sistema_Producto_Serv = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `SELECT * FROM SAMT_CAT_SISTEMA_PRODCT_SER WHERE EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}`;

        if (req.query.CAT_SISTEMAS_CLAVE) {
            query += ` AND CAT_SISTEMAS_CLAVE IN (${req.query.CAT_SISTEMAS_CLAVE})`;
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
    }
    catch (error) {
        ResultData = { success: false, message: error.message };
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.Get_Inventario = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);

        query = `call sp_reporte_inventario(
            ${req.query.EMP_CSC_EMPRESA_HOST}
            ,${req.query.CAT_SISTEMA_CSC}
            ,${req.query.CAT_SUB_SISTEMA_CSC}
            ,${req.query.PRODC_SERV_CSC}
            ,${req.query.TIPO_ESTATUS_EQUIPO}
            ,${req.query.REQ_CSCREQUISICION});`;
          
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
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn.length, JsonData: resultReturn[0] };
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

