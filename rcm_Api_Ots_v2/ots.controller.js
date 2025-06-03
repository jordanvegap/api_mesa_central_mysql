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

    return year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + (date)).slice(-2) + " "  +("0" + (hours)).slice(-2) +':'+ ("0" + (minutes)).slice(-2) +':'+ ("0" + (seconds)).slice(-2);
}

exports.Get_Orden_Trabajo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        query = `SELECT * FROM SAMT_ORDEN_TRABAJO 
        WHERE EMP_CSC_EMPRESA_HOST = ` + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST);
        
        if(req.query.TIC_FECHA_ALTA_INICIO && req.query.TIC_FECHA_ALTA_FIN){
            query += " AND convert(varchar, OTR_FECHA_ALTA_CORTA, 23) BETWEEN "+__Request_Pool.escape(req.query.TIC_FECHA_ALTA_INICIO)+" AND "+__Request_Pool.escape(req.query.TIC_FECHA_ALTA_FIN);
        }

        if (req.query.EMPLEADO_CSC_RESPONSABLE) {
            query += " AND IFNULL(EMPLEADO_CSC_RESPONSABLE,0) = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_RESPONSABLE);
        }

        if (req.query.EMPLEADO_CSC_SOLICITA) {
            query += " AND EMPLEADO_CSC_SOLICITA = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_SOLICITA);
        }

        if (req.query.OTR_CSCORDENTRABAJO ) {
            query += " AND OTR_CSCORDENTRABAJO = "+__Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO);
        }

        if (req.query.OTR_NEWID ) {
            query += " AND OTR_NEWID = "+__Request_Pool.escape(req.query.OTR_NEWID);
        }

        if (req.query.OTR_CERRADA) {
            query += " AND OTR_CERRADA = "+__Request_Pool.escape(req.query.OTR_CERRADA);
        }

        if(req.query.ESTATUS_ORDEN_CSC){
            query += " AND ESTATUS_ORDEN_CSC = "+__Request_Pool.escape(req.query.ESTATUS_ORDEN_CSC );
        }
        
        if(req.query.TIPO_PRIORIDAD_CSC){
            query += " AND TIPO_PRIORIDAD_CSC = "+__Request_Pool.escape(req.query.TIPO_PRIORIDAD_CSC );
        }
        
        if(req.query.TIPO_AREA_CSC_RESPONSABLE){
            query += " AND TIPO_AREA_CSC_RESPONSABLE = "+__Request_Pool.escape(req.query.TIPO_AREA_CSC_RESPONSABLE );
        }

        if(req.query.CAT_DEPTO_CSC_RESPONSABLE){
            query += " AND CAT_DEPTO_CSC_RESPONSABLE ="+__Request_Pool.escape(req.query.CAT_DEPTO_CSC_RESPONSABLE );
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

exports.Get_Vista_Orden_Trabajo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        query = `SELECT
        SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST
        ,SAMT_ORDEN_TRABAJO.EMPLEADO_CSC_SOLICITA
        ,SAMT_ORDEN_TRABAJO.OTR_CSCORDENTRABAJO
        ,SAMT_ORDEN_TRABAJO.OTR_NEWID
        ,SAMT_ORDEN_TRABAJO.REQ_CSCREQUISICION
        ,SAMT_REQUISICIONES.REQ_NOMBREAREA
        ,SAMT_ORDEN_TRABAJO.INM_CSCINMUEBLE
        ,SAMT_INMUEBLES.INM_CLVE_INMUEBLE
        ,SAMT_ORDEN_TRABAJO.SEG_CSC_SEGMENTACION_INM
        ,SAMT_ORDEN_TRABAJO.OTR_UBICACION
        ,SAMT_ORDEN_TRABAJO.ESTATUS_ORDEN_CSC
        ,SAMT_ESTATUS_ORDEN_TRABAJO.ESTATUS_ORDEN_IDIOMA1 AS ESTATUS_ORDEN
        ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE AS CAT_PROVEEDOR_INFRA
        ,SAMT_CAT_AUTORIZACION.CAT_OT_AUTORIZACION_IDIOMA1 AS CAT_OT_AUTORIZACION
        ,SAMT_CLIENTES.CLIENTE_NOMBRE AS CLIENTE
        ,SAMT_PROYECTOS.PM_NOMBRE AS CAMPANIA
        ,SAMT_CAM_SERVICIO.CAM_SERVICIO_NOMBRE AS SUBCAMPANIA
        ,SAMT_TIPO_PRIORIDAD_OT.TIPO_PRIORIDAD_IDIOMA1 AS TIPO_PRIORIDAD
        ,SAMT_TIPO_ORDEN_TRABAJO.TIPO_ORDEN_IDIOMA1 AS TIPO_ORDEN
        ,SAMT_TIPO_SUB_TIPO_OT.SUB_TIPO_OT_IDIOMA1 as SUB_TIPO
        ,SAMT_TIPO_ESPECIALIDAD_OT.TIPO_ESPECIALIDAD_OT_IDIOMA1 AS TIPO_ESPECIALIDAD_OT
        ,SAMT_TIPO_OT_TRAMITE.TIPO_OT_TRAMITE_IDIOMA1 AS TIPO_OT_TRAMITE
        ,SAMT_TIPO_CALIFICACION.TIPO_CALIFICACION_IDIOMA1 AS TIPO_CALIFICACION
        ,CONCAT(IFNULL(EMP_SOLICITA.EMPLEADO_NOMBREEMPLEADO,''), ' ', IFNULL(EMP_SOLICITA.EMPLEADO_NOMBREEMPLEADO_SEGUNDO,''), ' ', IFNULL(EMP_SOLICITA.EMPLEADO_APATERNOEMPLEADO,''), ' ', IFNULL(EMP_SOLICITA.EMPLEADO_AMATERNOEMPLEADO,'')) AS EMPLEADO_SOLICITA
        ,CONCAT(IFNULL(EMP_RESPONSABLE.EMPLEADO_NOMBREEMPLEADO,''), ' ', IFNULL(EMP_RESPONSABLE.EMPLEADO_NOMBREEMPLEADO_SEGUNDO,''), ' ', IFNULL(EMP_RESPONSABLE.EMPLEADO_APATERNOEMPLEADO,''), ' ', IFNULL(EMP_RESPONSABLE.EMPLEADO_AMATERNOEMPLEADO,'')) AS EMPLEADO_RESPONSABLE
        ,AREA_SOLICITA.TIPO_AREA_IDIOMA1 AS AREA_SOLICITA
        ,DEPARTAMENTO_SOLICITA.SAMT_TIPO_DEPARTAMENTO_IDIOMA1 AS DEPARTAMENTO_SOLICITA
        ,AREA_RESPONSABLE.TIPO_AREA_IDIOMA1 AS AREA_RESPONSABLE
        ,DEPARTAMENTO_RESPONSABLE.SAMT_TIPO_DEPARTAMENTO_IDIOMA1 AS DEPARTAMENTO_RESPONSABLE
        ,CONCAT(IFNULL(EMPLEADO_ALTA.EMPLEADO_NOMBREEMPLEADO,''), ' ', IFNULL(EMPLEADO_ALTA.EMPLEADO_NOMBREEMPLEADO_SEGUNDO,''), ' ', IFNULL(EMPLEADO_ALTA.EMPLEADO_APATERNOEMPLEADO,''), ' ', IFNULL(EMPLEADO_ALTA.EMPLEADO_AMATERNOEMPLEADO,'')) AS EMPLEADO_ALTA
        ,SAMT_MONEDAS.MDA_DESCRIPCION AS MDA_CVEMONEDA
        ,SAMT_EQUIPO.EQUIPAMIENTO_REFERENCIA AS EQUIPO_REFERENCIA
        ,SAMT_ORDEN_TRABAJO.OTR_COSTO
        ,SAMT_ORDEN_TRABAJO.OTR_DESCRIPCION
        ,SAMT_ORDEN_TRABAJO.OTR_SOLUCION
        ,SAMT_ORDEN_TRABAJO.OTR_CANCELACION
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_PROGRAMADA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_PROGRAMADA_CORTA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_PROMESA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_PROMESA_CORTA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_ESTATUS
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_ALTA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_ALTA_CORTA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_ALTA_HORA_COMPLETA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_DURACION_MIMUTOS
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_DURACION_HORAS
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_DURACION_DIAS
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_DURACION_ANIOS
        ,SAMT_ORDEN_TRABAJO.OTR_CERRADA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_CIERRE
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_CIERRE_CORTA
        ,SAMT_ORDEN_TRABAJO.OTR_FECHA_CIERRE_HORA_COMPLETA
        ,SAMT_ORDEN_TRABAJO.OTR_ESFUERZO_REQUERIDO
        ,SAMT_MONEDAS_TOTAL.MDA_DESCRIPCION AS MDA_CVEMONEDA_TOTAL
        ,SAMT_ORDEN_TRABAJO.OTR_COSTO_TOTAL
        ,SAMT_TIPO_CENTRO_COSTOS.SAMT_TIPO_CENTRO_IDIOMA1 AS CENTRO_COSTOS
        ,SAMT_ORDEN_TRABAJO.CANTIDAD_UM
        ,SAMT_UM_INTERNACIONALES.UME_IDIOMA1 AS UME_UM_INTERNACIONALES
        ,SAMT_UNIDADES_MEDIDAS.UME_IDIOMA1 AS UME_UNIDADES_MEDIDA
        ,CONCAT(IFNULL(AUDITORIA_EMPLEADO_ALTA.EMPLEADO_NOMBREEMPLEADO,''), ' ', IFNULL(AUDITORIA_EMPLEADO_ALTA.EMPLEADO_NOMBREEMPLEADO_SEGUNDO,''), ' ', IFNULL(AUDITORIA_EMPLEADO_ALTA.EMPLEADO_APATERNOEMPLEADO,''), ' ', IFNULL(AUDITORIA_EMPLEADO_ALTA.EMPLEADO_AMATERNOEMPLEADO,'')) AS AUDITORIA_EMPLEADO_ALTA
        ,CONCAT(IFNULL(AUDITORIA_EMPLEADO_MOD.EMPLEADO_NOMBREEMPLEADO,''), ' ', IFNULL(AUDITORIA_EMPLEADO_MOD.EMPLEADO_NOMBREEMPLEADO_SEGUNDO,''), ' ', IFNULL(AUDITORIA_EMPLEADO_MOD.EMPLEADO_APATERNOEMPLEADO,''), ' ', IFNULL(AUDITORIA_EMPLEADO_MOD.EMPLEADO_AMATERNOEMPLEADO,'')) AS AUDITORIA_EMPLEADO_MOD
        ,SAMT_ORDEN_TRABAJO.AUDITORIA_FEC_ALTA
        ,SAMT_ORDEN_TRABAJO.AUDITORIA_FEC_ULT_MOD
        ,Case 
            WHEN OTR_CERRADA=1 THEN 'Cerrado'
            When IFNULL(OTR_FECHA_PROMESA, UTC_TIMESTAMP()) < UTC_TIMESTAMP() Then 'Fuera de Tiempo'
            ELSE 'En Tiempo'
        End As DV,
        Case 
            WHEN OTR_CERRADA =1 THEN 0
            ELSE DATEDIFF(UTC_TIMESTAMP(), OTR_FECHA_ALTA)
        End As DH,
        Case 
            WHEN OTR_FECHA_PROMESA Is NULL THEN 0
            WHEN OTR_CERRADA=1 THEN 0 
            WHEN DATEDIFF(UTC_TIMESTAMP(),OTR_FECHA_PROMESA) < 0 Then 0
            ELSE DATEDIFF(UTC_TIMESTAMP(),OTR_FECHA_PROMESA)
        End As DR,
        Case 
            WHEN OTR_FECHA_PROMESA Is NULL THEN 0
            ELSE DATEDIFF(OTR_FECHA_PROMESA,OTR_FECHA_ALTA)
        End As DU,
        Case 
            WHEN OTR_FECHA_PROMESA < UTC_TIMESTAMP() Then 0
            WHEN OTR_CERRADA=1 THEN 0
            WHEN DATEDIFF(OTR_FECHA_PROMESA, UTC_TIMESTAMP()) < 0 Then 0
            ELSE DATEDIFF(OTR_FECHA_PROMESA, UTC_TIMESTAMP())
        End As DC,
        (SELECT COUNT(OTR_CSCORDENTRABAJO) AS CONTADOR 
            FROM SAMT_OT_AUTORIZACIONES
            WHERE SAMT_OT_AUTORIZACIONES.EMP_CSC_EMPRESA_HOST=` + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) + `
            AND IFNULL(SAMT_OT_AUTORIZACIONES.AUTORIZADO_ACTIVO,0) = 0
        AND SAMT_OT_AUTORIZACIONES.OTR_CSCORDENTRABAJO=SAMT_ORDEN_TRABAJO.OTR_CSCORDENTRABAJO
        AND SAMT_ORDEN_TRABAJO.OTR_CERRADA = 0) AS AUTH
        FROM SAMT_ORDEN_TRABAJO
        LEFT JOIN SAMT_REQUISICIONES
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_REQUISICIONES.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.REQ_CSCREQUISICION = SAMT_REQUISICIONES.REQ_CSCREQUISICION
        LEFT JOIN SAMT_INMUEBLES
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_INMUEBLES.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.INM_CSCINMUEBLE = SAMT_INMUEBLES.INM_CSCINMUEBLE
        LEFT JOIN SAMT_ESTATUS_ORDEN_TRABAJO
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_ESTATUS_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.ESTATUS_ORDEN_CSC = SAMT_ESTATUS_ORDEN_TRABAJO.ESTATUS_ORDEN_CSC
        LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_PROVEEDORES_INFRA.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CAT_PROVEEDOR_INFRA_CSC = SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC
        LEFT JOIN SAMT_CAT_AUTORIZACION
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_AUTORIZACION.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CAT_OT_AUTORIZACION_CSC = SAMT_CAT_AUTORIZACION.CAT_OT_AUTORIZACION_CSC
        LEFT JOIN SAMT_CLIENTES
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_CLIENTES.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CLIENTE_CSC = SAMT_CLIENTES.CLIENTE_CSC
        LEFT JOIN SAMT_PROYECTOS
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_PROYECTOS.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.PM_CSC_PROYECTO = SAMT_PROYECTOS.PM_CSC_PROYECTO
        LEFT JOIN SAMT_CAM_SERVICIO
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_CAM_SERVICIO.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CAM_CSC_SERVICIO = SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO
        LEFT JOIN SAMT_TIPO_PRIORIDAD_OT
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_PRIORIDAD_OT.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_PRIORIDAD_CSC = SAMT_TIPO_PRIORIDAD_OT.TIPO_PRIORIDAD_CSC
        LEFT JOIN SAMT_TIPO_ORDEN_TRABAJO
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_ORDEN_CSC = SAMT_TIPO_ORDEN_TRABAJO.TIPO_ORDEN_CSC
        LEFT JOIN SAMT_TIPO_SUB_TIPO_OT
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_SUB_TIPO_OT.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.SUB_TIPO_CSC = SAMT_TIPO_SUB_TIPO_OT.SUB_TIPO_CSC
        LEFT JOIN SAMT_TIPO_ESPECIALIDAD_OT
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_ESPECIALIDAD_OT.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_ESPECIALIDAD_OT_CSC = SAMT_TIPO_ESPECIALIDAD_OT.TIPO_ESPECIALIDAD_OT_CSC
        LEFT JOIN SAMT_TIPO_OT_TRAMITE 
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_OT_TRAMITE.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_OT_TRAMITE_CSC = SAMT_TIPO_OT_TRAMITE.TIPO_OT_TRAMITE_CSC
        LEFT JOIN SAMT_TIPO_CALIFICACION
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_CALIFICACION.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_CALIFICACION_CSC = SAMT_TIPO_CALIFICACION.TIPO_CALIFICACION_CSC
        LEFT JOIN SAMT_EMPLEADOS AS EMP_SOLICITA
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = EMP_SOLICITA.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.EMPLEADO_CSC_SOLICITA = EMP_SOLICITA.EMPLEADO_CSC_EMPLEADO
        LEFT JOIN SAMT_EMPLEADOS AS EMP_RESPONSABLE
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = EMP_RESPONSABLE.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.EMPLEADO_CSC_RESPONSABLE = EMP_RESPONSABLE.EMPLEADO_CSC_EMPLEADO
        LEFT JOIN SAMT_CAT_EMPLEADO_AREA AS AREA_SOLICITA
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = AREA_SOLICITA.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_AREA_CSC_SOLICITUD = AREA_SOLICITA.TIPO_AREA_CSC
        LEFT JOIN SAMT_CAT_EMPLEADO_DEPARTAMENTO AS DEPARTAMENTO_SOLICITA
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = DEPARTAMENTO_SOLICITA.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CAT_DEPTO_CSC_SOLICITUD = DEPARTAMENTO_SOLICITA.EMPLEADO_DEPARTAMENTO_CSC
        LEFT JOIN SAMT_CAT_EMPLEADO_AREA AS AREA_RESPONSABLE
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = AREA_RESPONSABLE.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.TIPO_AREA_CSC_SOLICITUD = AREA_RESPONSABLE.TIPO_AREA_CSC
        LEFT JOIN SAMT_CAT_EMPLEADO_DEPARTAMENTO AS DEPARTAMENTO_RESPONSABLE
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = DEPARTAMENTO_RESPONSABLE.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CAT_DEPTO_CSC_SOLICITUD = DEPARTAMENTO_RESPONSABLE.EMPLEADO_DEPARTAMENTO_CSC
        LEFT JOIN SAMT_EMPLEADOS AS EMPLEADO_ALTA
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = EMPLEADO_ALTA.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.EMPLEADO_CSC_ALTA = EMPLEADO_ALTA.EMPLEADO_CSC_EMPLEADO
        LEFT JOIN SAMT_MONEDAS
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_MONEDAS.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.MDA_CVEMONEDA = SAMT_MONEDAS.MDA_CVEMONEDA
        LEFT JOIN SAMT_EQUIPO
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.SAMT_CSCEQUIPAMIENTO = SAMT_EQUIPO.SAMT_CSCEQUIPAMIENTO
        LEFT JOIN SAMT_MONEDAS AS SAMT_MONEDAS_TOTAL
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_MONEDAS_TOTAL.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.MDA_CVEMONEDA = SAMT_MONEDAS_TOTAL.MDA_CVEMONEDA
        LEFT JOIN SAMT_TIPO_CENTRO_COSTOS
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_CENTRO_COSTOS.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.CLVE_CENTRO_COSTO = SAMT_TIPO_CENTRO_COSTOS.CLVE_CENTRO_COSTO
        LEFT JOIN SAMT_UNIDADES_MEDIDAS
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_UNIDADES_MEDIDAS.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.UME_CSC_UM_INTERNACIONALES = SAMT_UNIDADES_MEDIDAS.UME_CSC_UNIDADES_MEDIDA
        LEFT JOIN SAMT_UM_INTERNACIONALES
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = SAMT_UM_INTERNACIONALES.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.UME_CSC_UM_INTERNACIONALES = SAMT_UM_INTERNACIONALES.UME_CSC_UM_INTERNACIONALES
        LEFT JOIN SAMT_EMPLEADOS AS AUDITORIA_EMPLEADO_ALTA
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = AUDITORIA_EMPLEADO_ALTA.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.AUDITORIA_USU_ALTA = AUDITORIA_EMPLEADO_ALTA.EMPLEADO_CSC_EMPLEADO
        LEFT JOIN SAMT_EMPLEADOS AS AUDITORIA_EMPLEADO_MOD
        ON SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = AUDITORIA_EMPLEADO_MOD.EMP_CSC_EMPRESA_HOST
        AND SAMT_ORDEN_TRABAJO.AUDITORIA_USU_ULT_MOD = AUDITORIA_EMPLEADO_MOD.EMPLEADO_CSC_EMPLEADO
        WHERE SAMT_ORDEN_TRABAJO.EMP_CSC_EMPRESA_HOST = ` + __Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST);
        
        if(req.query.TIC_FECHA_ALTA_INICIO && req.query.TIC_FECHA_ALTA_FIN){
            query += " AND convert(varchar, SAMT_ORDEN_TRABAJO.OTR_FECHA_ALTA_CORTA, 23) BETWEEN "+__Request_Pool.escape(req.query.TIC_FECHA_ALTA_INICIO)+" AND "+__Request_Pool.escape(req.query.TIC_FECHA_ALTA_FIN);
        }

        if (req.query.EMPLEADO_CSC_RESPONSABLE) {
            query += " AND IFNULL(SAMT_ORDEN_TRABAJO.EMPLEADO_CSC_RESPONSABLE,0) = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_RESPONSABLE);
        }

        if (req.query.EMPLEADO_CSC_SOLICITA) {
            query += " AND SAMT_ORDEN_TRABAJO.EMPLEADO_CSC_SOLICITA = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_SOLICITA);
        }

        if (req.query.OTR_CSCORDENTRABAJO ) {
            query += " AND SAMT_ORDEN_TRABAJO.OTR_CSCORDENTRABAJO = "+__Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO);
        }

        if (req.query.OTR_NEWID ) {
            query += " AND SAMT_ORDEN_TRABAJO.OTR_NEWID = "+__Request_Pool.escape(req.query.OTR_NEWID);
        }

        if (req.query.OTR_CERRADA) {
            query += " AND SAMT_ORDEN_TRABAJO.OTR_CERRADA = "+__Request_Pool.escape(req.query.OTR_CERRADA);
        }

        if(req.query.ESTATUS_ORDEN_CSC){
            query += " AND SAMT_ORDEN_TRABAJO.ESTATUS_ORDEN_CSC = "+__Request_Pool.escape(req.query.ESTATUS_ORDEN_CSC );
        }
        
        if(req.query.TIPO_PRIORIDAD_CSC){
            query += " AND SAMT_ORDEN_TRABAJO.TIPO_PRIORIDAD_CSC = "+__Request_Pool.escape(req.query.TIPO_PRIORIDAD_CSC );
        }
        
        if(req.query.TIPO_AREA_CSC_RESPONSABLE){
            query += " AND SAMT_ORDEN_TRABAJO.TIPO_AREA_CSC_RESPONSABLE = "+__Request_Pool.escape(req.query.TIPO_AREA_CSC_RESPONSABLE );
        }

        if(req.query.CAT_DEPTO_CSC_RESPONSABLE){
            query += " AND SAMT_ORDEN_TRABAJO.CAT_DEPTO_CSC_RESPONSABLE ="+__Request_Pool.escape(req.query.CAT_DEPTO_CSC_RESPONSABLE );
        }

        switch(req.query.CLAVE_ITEM){
            case "OTVENC":
                query += " AND SAMT_ORDEN_TRABAJO.OTR_FECHA_PROMESA < NOW()";
            break;
            case "OTVENCHOY":
                query += " AND SAMT_ORDEN_TRABAJO.OTR_FECHA_PROGRAMADA_CORTA=DATE_FORMAT(NOW(), '%Y-%m-%d')";
            break;
            case "OTVENCP":
                query += " AND SAMT_ORDEN_TRABAJO.OTR_FECHA_PROMESA > NOW()";
            break;
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


exports.Insert_Orden_Trabajo = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
       
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
       
        var query = "INSERT INTO SAMT_ORDEN_TRABAJO SET ?";
       
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

exports.Update_Orden_Trabajo = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 

        var query = "UPDATE SAMT_ORDEN_TRABAJO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";

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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.affectedRows,JsonData: resultReturn.insertId};
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

exports.Insert_Bitacora_Ot = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 

        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
              
        var query = "INSERT INTO SAMT_OT_BITACORA SET ?";
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
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.recordset};
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

exports.Get_Ot_Bitacora = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        

        query = "SELECT * FROM SAMT_OT_BITACORA WHERE EMP_CSC_EMPRESA_HOST="+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND OTR_CSCORDENTRABAJO = "+__Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO)+" ORDER BY AUDITORIA_FEC_ALTA DESC;";

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

exports.Insert_Inter_Ot_Ticket = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
       var query = "INSERT INTO SAMT_TICKET_ORDENES_DE_TRABAJO SET ?";

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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows ,JsonData: resultReturn.recordset};
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

exports.Get_Ot_Conteo_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
                

        query = "SELECT EMPLEADO.EMPLEADO_CSC_EMPLEADO,"+
            "(SELECT COUNT(OTS.OTR_CSCORDENTRABAJO) AS CONTEO "+
            "FROM SAMT_ORDEN_TRABAJO AS OTS "+
            "WHERE OTS.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST "+
            "AND OTS.OTR_CERRADA = "+__Request_Pool.escape(req.query.OTR_CERRADA)+
            "AND OTS.TIPO_AREA_CSC_RESPONSABLE = EMPLEADO.CAT_AREA_CSC "+
            "AND OTS.CAT_DEPTO_CSC_RESPONSABLE = EMPLEADO.CAT_DEPARTAMENTO_CSC "+
            "AND OTS.EMPLEADO_CSC_RESPONSABLE = EMPLEADO.EMPLEADO_CSC_EMPLEADO ) AS TOTAL_OTS "+
            "FROM SAMT_EMPLEADOS AS EMPLEADO "+
            
            "WHERE EMPLEADO.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+
            "AND EMPLEADO.CAT_PROCESO_EMP_CSC = "+__Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC )+
            "AND	EMPLEADO.CAT_SUBPROCESO_EMP_CSC = "+__Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC )+
            "AND EMPLEADO.CAT_AREA_CSC = "+__Request_Pool.escape(req.query.CAT_AREA_CSC )+
            "AND EMPLEADO.CAT_DEPARTAMENTO_CSC = "+__Request_Pool.escape(req.query.CAT_DEPARTAMENTO_CSC )+
            "ORDER BY TOTAL_OTS ASC limit 1;";

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

exports.Get_Linkeo_ticket_ot = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        
        if (req.query.MS == "MERCEDES") {
            query = "SELECT TK_OT.*, OT.ESTATUS_ORDEN_CSC, OT.TIPO_AREA_CSC_RESPONSABLE, OT.OTR_CERRADA, OT.EMPLEADO_CSC_RESPONSABLE, OT.CAT_DEPTO_CSC_RESPONSABLE,OT.OTR_NEWID FROM SAMT_MERCEDES_TICKET_ORDENES_DE_TRABAJO AS TK_OT "+
            "INNER JOIN SAMT_ORDEN_TRABAJO AS OT ON OT.OTR_CSCORDENTRABAJO = TK_OT.OTR_CSCORDENTRABAJO AND OT.EMP_CSC_EMPRESA_HOST = TK_OT.EMP_CSC_EMPRESA_HOST "+
            "WHERE TK_OT.TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET)+" order by TK_OT.AUDITORIA_FEC_ALTA DESC;";
        } else if (req.query.MS == "BASE") {
            query = "SELECT TK_OT.*, OT.ESTATUS_ORDEN_CSC, OT.TIPO_AREA_CSC_RESPONSABLE, OT.OTR_CERRADA, OT.EMPLEADO_CSC_RESPONSABLE, OT.CAT_DEPTO_CSC_RESPONSABLE,OT.OTR_NEWID FROM SAMT_TICKET_ORDENES_DE_TRABAJO AS TK_OT "+
            "INNER JOIN SAMT_ORDEN_TRABAJO AS OT ON OT.OTR_CSCORDENTRABAJO = TK_OT.OTR_CSCORDENTRABAJO AND OT.EMP_CSC_EMPRESA_HOST = TK_OT.EMP_CSC_EMPRESA_HOST "+
            "WHERE TK_OT.TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET)+" order by TK_OT.AUDITORIA_FEC_ALTA DESC;";
        } 
        
        __Request_Pool.query(query,function(error, resultReturn, fields){
            if (error) {
                ResultData = {success: false,message: error.message};
                res.status(400);
                res.send(ResultData);
                let DataErr = {
                    Fecha: GetDate(),
                    Detalle: error.message
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

exports.Get_Activos_Fijos_ot = async(req, res)=>{
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        const { EMP_CSC_EMPRESA_HOST, OT_EQUIPOS_ACTIVO, OTR_CSCORDENTRABAJO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && OT_EQUIPOS_ACTIVO && OTR_CSCORDENTRABAJO;
        if (!isValid) {
            ResultData = {success: false,message: 'The request does not include all the necessary parameters'};
            res.status(200);
            res.send(ResultData);
            return;
         }
 
        query = `SELECT
                SAMT_OT_EQUIPOS.OTR_CSCORDENTRABAJO
                ,SAMT_OT_EQUIPOS.SAMT_CSCEQUIPAMIENTO
                ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_DESCRIPCION
                ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_MODELO
                ,SAMT_TIPO_ESTATUS_EQUIPO.TIPO_ESTATUS_IDIOMA1 AS TIPO_ESTATUS_EQUIPO
                ,SAMT_TIPO_EQUIPO.TIPO_EQUIPO_IDIOMA1 AS TIPO_EQUIPO
                ,SAMT_EQUIPO.EQUIPAMIENTO_NO_SERIE
                ,SAMT_EQUIPO.EQUIPAMIENTO_CODBARRAS
                FROM SAMT_OT_EQUIPOS  INNER JOIN SAMT_EQUIPO
                ON SAMT_OT_EQUIPOS.EMP_CSC_EMPRESA_HOST = SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST
                AND SAMT_EQUIPO.SAMT_CSCEQUIPAMIENTO=SAMT_OT_EQUIPOS.SAMT_CSCEQUIPAMIENTO
                LEFT JOIN SAMT_PRODUCTOS_SERVICIOS
                ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS.EMP_CSC_EMPRESA_HOST
                AND SAMT_EQUIPO.PRODC_SERV_CSC= SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_CSC
                LEFT JOIN SAMT_TIPO_ESTATUS_EQUIPO
                ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_ESTATUS_EQUIPO.EMP_CSC_EMPRESA_HOST
                AND SAMT_EQUIPO.CSC_TIPO_ESTATUS_EQUIPO = SAMT_TIPO_ESTATUS_EQUIPO.CSC_TIPO_ESTATUS_EQUIPO
                LEFT JOIN SAMT_TIPO_EQUIPO
                ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_EQUIPO.EMP_CSC_EMPRESA_HOST
                AND SAMT_EQUIPO.CSC_TIPO_EQUIPO = SAMT_TIPO_EQUIPO.CSC_TIPO_EQUIPO
                WHERE SAMT_OT_EQUIPOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
                AND SAMT_OT_EQUIPOS.OTR_CSCORDENTRABAJO = ${__Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO)}
                AND SAMT_OT_EQUIPOS.OT_EQUIPOS_ACTIVO = ` + __Request_Pool.escape(req.query.OT_EQUIPOS_ACTIVO);
       

   
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

exports.Insert_Ot_Equipos = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_OT_EQUIPOS SET ?";
       
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

exports.Get_Buscar_Equipos = async(req,res)=>{
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        const { EMP_CSC_EMPRESA_HOST, NOMBRE_FILTRO,VALOR_BUSCAR } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && NOMBRE_FILTRO && VALOR_BUSCAR;
        if (!isValid) {
            ResultData = {success: false,message: 'The request does not include all the necessary parameters'};
            res.status(200);
            res.send(ResultData);
            return;
         }
 
         var _CampoFiltrar="";
        /*
        [No_Serie,
        Codigo_Barras,
        No_Inventario,
        No_Referencia]
        */
        if (req.query.NOMBRE_FILTRO === "No_Serie"){
            _CampoFiltrar="EQUIPAMIENTO_NO_SERIE";
        }else if (req.query.NOMBRE_FILTRO === "Codigo_Barras") {
            _CampoFiltrar="EQUIPAMIENTO_CODBARRAS";
        }else if (req.query.NOMBRE_FILTRO === "No_Inventario") {
            _CampoFiltrar="EQUIPAMIENTO_NO_INVENTARIO";
        }else if (req.query.NOMBRE_FILTRO === "No_Referencia") {
            _CampoFiltrar="EQUIPAMIENTO_REFERENCIA";
        } else {
            ResultData = {success: false,message: 'The name of the filter is not valid'};
            res.status(200);
            res.send(ResultData);
            return;
        }
        
        /*
        SAMT_EQUIPO.EQUIPAMIENTO_NO_SERIE like '%1234'  -- Filtro por No_Serie
        SAMT_EQUIPO.EQUIPAMIENTO_CODBARRAS like '%1234' -- Filtro Codigo_Barras
        SAMT_EQUIPO.EQUIPAMIENTO_NO_INVENTARIO like '%1234' -- Filtro por No_inventario
        SAMT_EQUIPO.EQUIPAMIENTO_REFERENCIA like '%1234' -- Filtro por No_Referencia
        */
        query = `SELECT 
        SAMT_EQUIPO.SAMT_CSCEQUIPAMIENTO
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_NOMBRE AS DESCRIPCION
        ,SAMT_EQUIPO.EQUIPAMIENTO_CODBARRAS AS CODIGO_BARRAS
        ,SAMT_INMUEBLES.INM_CLVE_INMUEBLE AS INMUEBLE
        ,SAMT_REQUISICIONES.REQ_NOMBREAREA AS REQUISICION
        ,SAMT_SEGMENTACION_INM.SEG_DESCRIPCION_CORTA_INM AS UBICACION
        ,SAMT_TIPO_ESTATUS_EQUIPO.TIPO_ESTATUS_IDIOMA1 AS ESTATUS
        ,SAMT_TIPO_EQUIPO.TIPO_EQUIPO_IDIOMA1 AS TIPO_ADQUISICION
        ,SAMT_TIPO_CENTRO_COSTOS.SAMT_TIPO_CENTRO_IDIOMA1 AS CENTRO_DE_COSTOS
        ,SAMT_TIPO_CLASE_PRODUCTO.TIPO_CLASE_IDIOMA1 AS CLASE
        ,SAMT_EQUIPO.EQUIPAMIENTO_MODELO AS MODELO
        ,SAMT_EQUIPO.EQUIPAMIENTO_INICIO_OPERACIO AS INICIO_DE_OPERACIONES
        ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE AS PROVEEDOR
        ,SAMT_UM_INTERNACIONALES.UME_IDIOMA1 AS UM
        ,SAMT_EQUIPO.EQUIPAMIENTO_NO_SERIE AS NO_SERIE
        ,SAMT_EQUIPO.EQUIPAMIENTO_NO_INVENTARIO AS NO_INVENTARIO
        ,SAMT_EQUIPO.EQUIPAMIENTO_NO_PARTE AS NO_PARTE
        ,SAMT_EQUIPO.EQUIPAMIENTO_COMENTARIOS AS COMENTARIOS
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_MODELO
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_DESCRIPCION
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_INDICA_DEPRECIABLE
        
        FROM SAMT_EQUIPO INNER JOIN SAMT_PRODUCTOS_SERVICIOS 
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS.EMP_CSC_EMPRESA_HOST 
        AND SAMT_EQUIPO.PRODC_SERV_CSC = SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_CSC
        
        LEFT JOIN SAMT_REQUISICIONES
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_REQUISICIONES.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.REQ_CSCREQUISICION = SAMT_REQUISICIONES.REQ_CSCREQUISICION
        
        LEFT JOIN SAMT_INMUEBLES
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_INMUEBLES.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.INM_CSCINMUEBLE = SAMT_INMUEBLES.INM_CSCINMUEBLE
        
        LEFT JOIN SAMT_TIPO_ESTATUS_EQUIPO
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_ESTATUS_EQUIPO.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CSC_TIPO_ESTATUS_EQUIPO = SAMT_TIPO_ESTATUS_EQUIPO.CSC_TIPO_ESTATUS_EQUIPO
        
        LEFT JOIN SAMT_TIPO_EQUIPO
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_EQUIPO.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CSC_TIPO_EQUIPO = SAMT_TIPO_EQUIPO.CSC_TIPO_EQUIPO
        
        LEFT JOIN SAMT_TIPO_CLASE_PRODUCTO
        ON SAMT_PRODUCTOS_SERVICIOS.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_CLASE_PRODUCTO.EMP_CSC_EMPRESA_HOST
        AND SAMT_PRODUCTOS_SERVICIOS.TIPO_CLASE_CSC = SAMT_TIPO_CLASE_PRODUCTO.TIPO_CLASE_PRODUC_CSC
        
        LEFT JOIN SAMT_UM_INTERNACIONALES
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_UM_INTERNACIONALES.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.UME_CSC_UM_INTERNACIONALES = SAMT_UM_INTERNACIONALES.UME_CSC_UM_INTERNACIONALES
        
        LEFT JOIN SAMT_TIPO_CENTRO_COSTOS
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_CENTRO_COSTOS.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CLVE_CENTRO_COSTO = SAMT_TIPO_CENTRO_COSTOS.CLVE_CENTRO_COSTO
        
        LEFT JOIN SAMT_SEGMENTACION_INM
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_SEGMENTACION_INM.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.SEG_CSC_SEGMENTACION_INM = SAMT_SEGMENTACION_INM.SEG_CSC_SEGMENTACION_INM
        
        LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_PROVEEDORES_INFRA.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CSC_PROVEDOR_EQUIPO = SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC
        
        where SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
        AND SAMT_EQUIPO.${_CampoFiltrar} like '%${req.query.VALOR_BUSCAR}' 
        AND SAMT_PRODUCTOS_SERVICIOS.TIPO_CLASE_CSC IN (
        SELECT TIPO_CLASE_PRODUC_CSC from SAMT_TIPO_CLASE_PRODUCTO where EMP_CSC_EMPRESA_HOST= 1 
        AND TIPO_CLASE_CLAVE='EQU')`;
  
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

exports.Inactivar_Ot_Equipos = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 

        var query = "UPDATE SAMT_OT_EQUIPOS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";

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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.affectedRows,JsonData: resultReturn.insertId};
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

exports.Get_Tareas_Ot = async(req, res)=>{
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        const { EMP_CSC_EMPRESA_HOST, OTR_CSCORDENTRABAJO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && OTR_CSCORDENTRABAJO;
        if (!isValid) {
            ResultData = {success: false,message: 'The request does not include all the necessary parameters'};
            res.status(200);
            res.send(ResultData);
            return;
         }
 
        query = `SELECT
                SAMT_OT_TAREAS.EMP_CSC_EMPRESA_HOST
                ,SAMT_OT_TAREAS.CAT_ESPECIALIDA_OT_CSC
                ,SAMT_OT_TAREAS.OTR_CSCORDENTRABAJO
                ,SAMT_OT_TAREAS.CAT_ESPECIALIDA_OT_CSC
                ,SAMT_CAT_OT_ESPECIALIDAD_TAREAS.CAT_ESPECIALIDA_OT_IDIOMA1 AS CAT_ESPECIALIDAD
                ,SAMT_OT_TAREAS.TAR_OT_TAREAS_NOMBRE
                ,SAMT_OT_TAREAS.TAR_OT_TAREAS_DESCRIPCION
                ,SAMT_OT_TAREAS.TAR_OT_TAREAS_DURACION
                ,SAMT_OT_TAREAS.TAR_OT_TAREAS_DURACION_UME
                ,SAMT_UNIDADES_MEDIDAS.UME_IDIOMA1 AS UNIDAD_MEDIDA
                ,SAMT_OT_TAREAS.TAR_OT_TAREA_EJECUTADA
                ,SAMT_OT_TAREAS.TAR_OT_COSTO
                ,SAMT_OT_TAREAS.MDA_CVEMONEDA
                ,SAMT_MONEDAS.MDA_DESCRIPCION
                ,SAMT_OT_TAREAS.ESTATUS_CSC
                ,SAMT_CAM_ESTATUS_TAREA.ESTATUS_IDIOMA1 AS ESTATUS_TAREA
                FROM SAMT_OT_TAREAS 
                LEFT JOIN SAMT_CAT_OT_ESPECIALIDAD_TAREAS
                ON SAMT_OT_TAREAS.EMP_CSC_EMPRESA_HOST =  SAMT_CAT_OT_ESPECIALIDAD_TAREAS.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_TAREAS.CAT_ESPECIALIDA_OT_CSC = SAMT_CAT_OT_ESPECIALIDAD_TAREAS.CAT_ESPECIALIDA_OT_CSC
                
                LEFT JOIN SAMT_UNIDADES_MEDIDAS
                ON SAMT_OT_TAREAS.EMP_CSC_EMPRESA_HOST = SAMT_UNIDADES_MEDIDAS.EMP_CSC_EMPRESA_HOST
                AND  SAMT_OT_TAREAS.TAR_OT_TAREAS_DURACION_UME = SAMT_UNIDADES_MEDIDAS.UME_CSC_UNIDADES_MEDIDA
                
                LEFT JOIN SAMT_MONEDAS
                ON SAMT_OT_TAREAS.EMP_CSC_EMPRESA_HOST = SAMT_MONEDAS.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_TAREAS.MDA_CVEMONEDA = SAMT_MONEDAS.MDA_CVEMONEDA
                
                LEFT JOIN SAMT_CAM_ESTATUS_TAREA
                ON SAMT_OT_TAREAS.EMP_CSC_EMPRESA_HOST = SAMT_CAM_ESTATUS_TAREA.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_TAREAS.ESTATUS_CSC = SAMT_CAM_ESTATUS_TAREA.ESTATUS_CSC
                
                WHERE SAMT_OT_TAREAS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
                and SAMT_OT_TAREAS.OTR_CSCORDENTRABAJO = ` + __Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO);
          
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

exports.Insert_Tareas_Ot = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
    
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
      
        var query = "INSERT INTO SAMT_OT_TAREAS SET ?";
       
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

exports.Update_Tareas_Ot = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 

        var query = "UPDATE SAMT_OT_TAREAS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";

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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.affectedRows,JsonData: resultReturn.insertId};
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


exports.Get_Autorizaciones_Ot = async(req, res)=>{
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        const { EMP_CSC_EMPRESA_HOST, OTR_CSCORDENTRABAJO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && OTR_CSCORDENTRABAJO;
        if (!isValid) {
            ResultData = {success: false,message: 'The request does not include all the necessary parameters'};
            res.status(200);
            res.send(ResultData);
            return;
         }
 
        query = `SELECT 
                SAMT_OT_AUTORIZACIONES.EMP_CSC_EMPRESA_HOST
                ,SAMT_OT_AUTORIZACIONES.AUTORIZACION_CSC
                ,SAMT_OT_AUTORIZACIONES.AUTORIZACION_NEWID
                ,SAMT_OT_AUTORIZACIONES.OTR_CSCORDENTRABAJO
                ,SAMT_OT_AUTORIZACIONES.CAT_OT_AUTORIZACION_CSC
                ,SAMT_CAT_AUTORIZACION.CAT_OT_AUTORIZACION_IDIOMA1 AS CAT_OT_AUTORIZACION
                ,SAMT_OT_AUTORIZACIONES.EMPLEADO_CSC_EMPLEADO
                ,CONCAT(IFNULL(SAMT_EMPLEADOS.EMPLEADO_NOMBREEMPLEADO,''), ' ' 
                ,IFNULL(SAMT_EMPLEADOS.EMPLEADO_APATERNOEMPLEADO,''), ' '
                ,IFNULL(SAMT_EMPLEADOS.EMPLEADO_AMATERNOEMPLEADO,'')) AS NOMBRE_EMPLEADO
                ,SAMT_OT_AUTORIZACIONES.SAMT_TIPO_RESPUESTA_AUTORIZA_CSC
                ,SAMT_TIPO_RESPUESTA_AUTORIZA.TIPO_RESPUESTA_AUTORIZA_IDIOMA1 AS TIPO_RESPUESTA_AUTORIZA
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_VIA_MAIL
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_VIA_TELEFONICA
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_VIA_SMS
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_VIA_MOVILE
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_VIA_WEB
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_VIA_DNA
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_ORDEN
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_COMENTARIOS
                ,SAMT_OT_AUTORIZACIONES.AUTORIZADO_ACTIVO
                ,SAMT_OT_AUTORIZACIONES.AUDITORIA_USU_ALTA
                ,SAMT_OT_AUTORIZACIONES.AUDITORIA_USU_ULT_MOD
                ,SAMT_OT_AUTORIZACIONES.AUDITORIA_FEC_ALTA
                ,SAMT_OT_AUTORIZACIONES.AUDITORIA_FEC_ULT_MOD
                
                FROM SAMT_OT_AUTORIZACIONES 
                LEFT JOIN SAMT_CAT_AUTORIZACION
                ON SAMT_OT_AUTORIZACIONES.EMP_CSC_EMPRESA_HOST = SAMT_CAT_AUTORIZACION.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_AUTORIZACIONES.CAT_OT_AUTORIZACION_CSC = SAMT_CAT_AUTORIZACION.CAT_OT_AUTORIZACION_CSC
                
                LEFT JOIN SAMT_EMPLEADOS
                ON SAMT_OT_AUTORIZACIONES.EMP_CSC_EMPRESA_HOST = SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_AUTORIZACIONES.EMPLEADO_CSC_EMPLEADO = SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO
                
                LEFT JOIN SAMT_TIPO_RESPUESTA_AUTORIZA
                ON SAMT_OT_AUTORIZACIONES.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_RESPUESTA_AUTORIZA.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_AUTORIZACIONES.SAMT_TIPO_RESPUESTA_AUTORIZA_CSC = SAMT_TIPO_RESPUESTA_AUTORIZA.SAMT_TIPO_RESPUESTA_AUTORIZA_CSC
                        
                WHERE SAMT_OT_AUTORIZACIONES.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
                AND SAMT_OT_AUTORIZACIONES.OTR_CSCORDENTRABAJO = ` + __Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO);
          
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

exports.Insert_Autorizaciones_Ot = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        
        var query = "INSERT INTO SAMT_OT_AUTORIZACIONES SET ?";
       
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

exports.Update_Autorizaciones_Ot = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 

        var query = "UPDATE SAMT_OT_AUTORIZACIONES " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";

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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.affectedRows,JsonData: resultReturn.insertId};
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


exports.Get_Insumos_Ot = async(req, res)=>{
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        const { EMP_CSC_EMPRESA_HOST, OTR_CSCORDENTRABAJO } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST && OTR_CSCORDENTRABAJO;
        if (!isValid) {
            ResultData = {success: false,message: 'The request does not include all the necessary parameters'};
            res.status(200);
            res.send(ResultData);
            return;
         }
 
        query = `SELECT
                SAMT_OT_INSUMOS.EMP_CSC_EMPRESA_HOST
                ,SAMT_OT_INSUMOS.OTR_CSCORDENTRABAJO
                ,SAMT_OT_INSUMOS.OT_CSC_INSUMOS
                ,SAMT_OT_INSUMOS.SAMT_CSCEQUIPAMIENTO
                ,SAMT_OT_INSUMOS.OT_INSUMOS_NOMBRE
                ,SAMT_OT_INSUMOS.OT_INSUMOS_CANTIDAD
                ,SAMT_OT_INSUMOS.OT_INSUMOS_DESCRIPCION
                ,SAMT_OT_INSUMOS.OT_INSUMOS_COSTO
                ,SAMT_OT_INSUMOS.PRODC_SERV_PRECIO_CSC
                ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_NOMBRE
                ,SAMT_OT_INSUMOS.AUDITORIA_USU_ALTA
                ,SAMT_OT_INSUMOS.AUDITORIA_USU_ULT_MOD
                ,SAMT_OT_INSUMOS.AUDITORIA_FEC_ALTA
                ,SAMT_OT_INSUMOS.AUDITORIA_FEC_ULT_MOD
                FROM SAMT_OT_INSUMOS 
                LEFT JOIN SAMT_PRODUCTOS_SERVICIOS_PRECIOS
                ON SAMT_OT_INSUMOS.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST
                AND SAMT_OT_INSUMOS.PRODC_SERV_PRECIO_CSC = SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODC_SERV_PRECIO_CSC
                
                LEFT JOIN SAMT_PRODUCTOS_SERVICIOS
                ON SAMT_PRODUCTOS_SERVICIOS_PRECIOS.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS.EMP_CSC_EMPRESA_HOST
                AND SAMT_PRODUCTOS_SERVICIOS_PRECIOS.PRODC_SERV_CSC = SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_CSC
                WHERE SAMT_OT_INSUMOS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
                AND SAMT_OT_INSUMOS.OTR_CSCORDENTRABAJO = ` + __Request_Pool.escape(req.query.OTR_CSCORDENTRABAJO);
          
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

exports.Get_Buscar_Insumos = async(req,res)=>{
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type);
        
        const { EMP_CSC_EMPRESA_HOST } = req.query;
        const isValid = EMP_CSC_EMPRESA_HOST;
        if (!isValid) {
            ResultData = {success: false,message: 'The request does not include all the necessary parameters'};
            res.status(200);
            res.send(ResultData);
            return;
         }
         query = `SELECT 
        SAMT_EQUIPO.SAMT_CSCEQUIPAMIENTO
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_NOMBRE AS DESCRIPCION
        ,SAMT_EQUIPO.EQUIPAMIENTO_CODBARRAS AS CODIGO_BARRAS
        ,SAMT_INMUEBLES.INM_CLVE_INMUEBLE AS INMUEBLE
        ,SAMT_REQUISICIONES.REQ_NOMBREAREA AS REQUISICION
        ,SAMT_SEGMENTACION_INM.SEG_DESCRIPCION_CORTA_INM AS UBICACION
        ,SAMT_TIPO_ESTATUS_EQUIPO.TIPO_ESTATUS_IDIOMA1 AS ESTATUS
        ,SAMT_TIPO_EQUIPO.TIPO_EQUIPO_IDIOMA1 AS TIPO_ADQUISICION
        ,SAMT_TIPO_CENTRO_COSTOS.SAMT_TIPO_CENTRO_IDIOMA1 AS CENTRO_DE_COSTOS
        ,SAMT_TIPO_CLASE_PRODUCTO.TIPO_CLASE_IDIOMA1 AS CLASE
        ,SAMT_EQUIPO.EQUIPAMIENTO_MODELO AS MODELO
        ,SAMT_EQUIPO.EQUIPAMIENTO_INICIO_OPERACIO AS INICIO_DE_OPERACIONES
        ,SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE AS PROVEEDOR
        ,SAMT_UM_INTERNACIONALES.UME_IDIOMA1 AS UM
        ,SAMT_EQUIPO.EQUIPAMIENTO_NO_SERIE AS NO_SERIE
        ,SAMT_EQUIPO.EQUIPAMIENTO_NO_INVENTARIO AS NO_INVENTARIO
        ,SAMT_EQUIPO.EQUIPAMIENTO_NO_PARTE AS NO_PARTE
        ,SAMT_EQUIPO.EQUIPAMIENTO_COMENTARIOS AS COMENTARIOS
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_MODELO
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_DESCRIPCION
        ,SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_INDICA_DEPRECIABLE
        
        FROM SAMT_EQUIPO INNER JOIN SAMT_PRODUCTOS_SERVICIOS 
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_PRODUCTOS_SERVICIOS.EMP_CSC_EMPRESA_HOST 
        AND SAMT_EQUIPO.PRODC_SERV_CSC = SAMT_PRODUCTOS_SERVICIOS.PRODC_SERV_CSC
        
        LEFT JOIN SAMT_REQUISICIONES
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_REQUISICIONES.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.REQ_CSCREQUISICION = SAMT_REQUISICIONES.REQ_CSCREQUISICION
        
        LEFT JOIN SAMT_INMUEBLES
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_INMUEBLES.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.INM_CSCINMUEBLE = SAMT_INMUEBLES.INM_CSCINMUEBLE
        
        LEFT JOIN SAMT_TIPO_ESTATUS_EQUIPO
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_ESTATUS_EQUIPO.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CSC_TIPO_ESTATUS_EQUIPO = SAMT_TIPO_ESTATUS_EQUIPO.CSC_TIPO_ESTATUS_EQUIPO
        
        LEFT JOIN SAMT_TIPO_EQUIPO
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_EQUIPO.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CSC_TIPO_EQUIPO = SAMT_TIPO_EQUIPO.CSC_TIPO_EQUIPO
        
        LEFT JOIN SAMT_TIPO_CLASE_PRODUCTO
        ON SAMT_PRODUCTOS_SERVICIOS.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_CLASE_PRODUCTO.EMP_CSC_EMPRESA_HOST
        AND SAMT_PRODUCTOS_SERVICIOS.TIPO_CLASE_CSC = SAMT_TIPO_CLASE_PRODUCTO.TIPO_CLASE_PRODUC_CSC
        
        LEFT JOIN SAMT_UM_INTERNACIONALES
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_UM_INTERNACIONALES.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.UME_CSC_UM_INTERNACIONALES = SAMT_UM_INTERNACIONALES.UME_CSC_UM_INTERNACIONALES
        
        LEFT JOIN SAMT_TIPO_CENTRO_COSTOS
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_TIPO_CENTRO_COSTOS.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CLVE_CENTRO_COSTO = SAMT_TIPO_CENTRO_COSTOS.CLVE_CENTRO_COSTO
        
        LEFT JOIN SAMT_SEGMENTACION_INM
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_SEGMENTACION_INM.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.SEG_CSC_SEGMENTACION_INM = SAMT_SEGMENTACION_INM.SEG_CSC_SEGMENTACION_INM
        
        LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA
        ON SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = SAMT_CAT_PROVEEDORES_INFRA.EMP_CSC_EMPRESA_HOST
        AND SAMT_EQUIPO.CSC_PROVEDOR_EQUIPO = SAMT_CAT_PROVEEDORES_INFRA.CAT_PROVEEDOR_INFRA_CSC
        
        where SAMT_EQUIPO.EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
        AND SAMT_PRODUCTOS_SERVICIOS.TIPO_CLASE_CSC IN (
        SELECT TIPO_CLASE_PRODUC_CSC from SAMT_TIPO_CLASE_PRODUCTO where EMP_CSC_EMPRESA_HOST = ${req.query.EMP_CSC_EMPRESA_HOST}
        AND  ( TIPO_CLASE_CLAVE='INS' or TIPO_CLASE_CLAVE='REF'))
        AND SAMT_EQUIPO.EQUIPAMIENTO_EXISTENCIA <> 0`;
  
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

exports.Insert_Insumos_Ot = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
       
        var query = "INSERT INTO SAMT_OT_INSUMOS SET ?";
       
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

exports.Update_Insumos_Ot = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 

        var query = "UPDATE SAMT_OT_INSUMOS " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";

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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.affectedRows,JsonData: resultReturn.insertId};
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

exports.Delete_Insumos_Ot = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var d1 = req.body.EMP_CSC_EMPRESA_HOST;
        var d2 = req.body.OTR_CSCORDENTRABAJO;
        var d3 = req.body.OT_CSC_INSUMOS;
        var query = "DELETE FROM SAMT_OT_INSUMOS WHERE EMP_CSC_EMPRESA_HOST = ? AND OTR_CSCORDENTRABAJO = ? AND OT_CSC_INSUMOS = ?";
             
        __Request_Pool.query(query, [d1,d2,d3],function(error, resultReturn){
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
                if (resultReturn.affectedRows === 0) {
                    ResultData = {success: false,message: 'No Data delete'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Delete',count: resultReturn.affectedRows,JsonData: resultReturn.insertId};
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

exports.Insert_Inventario_Salida = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_INVENTARIO_SALIDA SET ?";
       
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
