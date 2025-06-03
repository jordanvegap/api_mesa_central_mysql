const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi } = require('../../__utilitis/apiConsumer');
const Token_Provider = process.env.CENTRO_DATOS_TOKEN;
const url_Provider = process.env.CENTRO_DATOS_URL;

async function reqServiceCOSCD(data = null, stringsData = null) {
    
    const objAlta = {}
    delete data['EMPLEADO_CSC_ATIENDE'];
    delete data['TIPO_PRIORIDAD_CSC'];
    delete data['TIPO_SEVERIDAD_CSC'];
    delete data['TIPO_TICKET_CSC'];
    data.ESTATUS_TICKET_CSC = 1;
    data.ESTATUS_TICKET_CSC = 1;
    data.CLIENTE_CSC_SOLICITA = 1;
    data.CAM_CSC_SERVICIO_SOLICITA = 1;
    data.PM_CSC_PROYECTO_SOLICITA = 1;
    data.SAMT_TICKET_TIPO_COMPONENTE_CSC = 1;
    data.SAMT_CAM_TIPO_SERVICIO_CSC = 1;

    objAlta.EMP_CLV_EMPRESA = "CREATIF";
    objAlta.EMP_CSC_EMPRESA_HOST = 1;
    objAlta.Type = "Pro";
    objAlta.TimeZoneCliente = "America/Mexico_City";
    objAlta.TimeZoneServer = "Etc/GMT";
    objAlta.DATA_INSERT = data;
    objAlta.TIPO_CALIFICACION_CSC = 1;
    
    const success = await consumirApi(`${url_Provider}/Insert_Ticket_Servicio`, 'POST', { "access-token": `${Token_Provider}` }, objAlta, "COSCD 2");
    return success; // Retornar el resultado de la llamada
}

async function calificaTicketCOSCD(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    
    const objUpdate = {}

    objUpdate.EMP_CLV_EMPRESA = "CREATIF";
    objUpdate.EMP_CSC_EMPRESA_HOST = 1;
    objUpdate.Type = "Pro";
    objUpdate.TimeZoneCliente = "America/Mexico_City";
    objUpdate.TimeZoneServer = "Etc/GMT";
    objUpdate.DATA_UPDATE = data.DATA_UPDATE;
    objUpdate.DATA_WHERE = {
        TIC_CSCTICKET: TIC_ID_EXTERNO_PROVEEDOR,
        TIC_NEWID: data.DATA_WHERE.TIC_NEWID
    };

    const success = await consumirApi(`${url_Provider}/Update_Ticket_Servicio`, 'POST', { "access-token": `${Token_Provider}` }, objUpdate, "COSCD 2");
    return success; // Retornar el resultado de la llamada
}


// Exportar la función
module.exports = { reqServiceCOSCD,calificaTicketCOSCD};