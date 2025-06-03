const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi, consumirApi_AmericanSince } = require('../../__utilitis/apiConsumer');
const url_Provider = process.env.ASSINCE_URL;
const Token_Provider = process.env.ASSINCE_TOKEN;
async function altaTicketASSINCE(data = null, stringsData = null) {
    
    const objAlta = {}
    objAlta.idUsuario = 249;
    objAlta.idTicketIntegracion = data.TIC_NEWID;
    objAlta.tipoOperacion = stringsData.tipoOperacion;
    objAlta.idUsuario_cliente = "ANAM-MAA";
    objAlta.titulo = stringsData.TipoIncidenteString;
    objAlta.descripcion = data.TIC_DESCRIPCION;
    objAlta.solucion = '';
    objAlta.idImpacto = stringsData.idImpacto;
    objAlta.idUrgencia = stringsData.idUrgencia;
    objAlta.idPrioridad = stringsData.idPrioridad;
    objAlta.idCategoria = stringsData.tipi_3;
    objAlta.idUsuario_asignado = '';
    objAlta.idGrupoSoporte = '';
    objAlta.nombreProveedor = 'ANAM';
    objAlta.nombreCliente =  data.TIC_SOLICITA;
    objAlta.nombreContacto = data.TIC_SOLICITA;
    objAlta.rfcCliente = stringsData.RFCCLIENTE;
    objAlta.rfcContacto = stringsData.RFCCLIENTE;
    objAlta.locCliente = stringsData.UBICACION;
    objAlta.locContacto = data.TIC_EMAIL_SOLICITANTE;
    objAlta.idAgenteANAM = 249;
    objAlta.direccionANAM = stringsData.UBICACION;
    objAlta.idActivo = data.TAG_COMPONENTE;
    objAlta.noSerie = data.TAG_COMPONENTE;
    objAlta.idUbicacion = stringsData.UBICACION;
    objAlta.noReporte = ''
    //console.log(objAlta);
    
    const auth = 'Basic ' + Buffer.from(`${process.env.ASSINCE_USERNAME}:${ process.env.ASSINCE_PASSWORD}`).toString('base64');
    const success = await consumirApi_AmericanSince(`${url_Provider}/ticketns/api/v1/insertTicket`, 'POST', { "Authorization ": `${auth}` }, objAlta, "AS-SINCE");
    
    return success; // Retornar el resultado de la llamada
}
/**
 * { 
    "idTicketNS": "TNS00000684", 
    "idEstado": "STA00006" //Cerrado Incidente
    //"idEstado": "STA0012" //Cerrado Requerimiento
}
 */
async function uptadeTicketASNICE(data = null, TIC_ID_EXTERNO_PROVEEDOR = null, TIC_TIPO_CATEGORIA =null) {
    const auth = 'Basic ' + Buffer.from(`${process.env.ASSINCE_USERNAME}:${ process.env.ASSINCE_PASSWORD}`).toString('base64');
    const objUpdate = {}
    
    objUpdate.idTicketNS = TIC_ID_EXTERNO_PROVEEDOR;
    if (data.TIPO_CALIFICACION_CSC == 2) {

        if (TIC_TIPO_CATEGORIA == "C_IN") {
            objUpdate.idEstado = "STA0006";
        } else{
            objUpdate.idEstado = "STA0012";
        }

    } else if (data.TIPO_CALIFICACION_CSC == 1) {

        if (TIC_TIPO_CATEGORIA == "C_IN") {
            objUpdate.idEstado = "STA0001";
        } else{
            objUpdate.idEstado = "STA0007";
        }
    } else {
        if (TIC_TIPO_CATEGORIA == "C_IN") {
            objUpdate.idEstado = "STA0001";
        } else{
            objUpdate.idEstado = "STA0007";
        }
    }

    console.log(objUpdate);
    
    const success = await consumirApi_AmericanSince(`${url_Provider}/ticketns/api/v1/updateEstatusTicket`, 'POST', { "Authorization ": `${auth}` }, objUpdate, "AS-SINCE");
    return success; // Retornar el resultado de la llamada
}

async function updateNoTicketMSAtoASNICE(idMesaCentral,idAS) {
    const auth = 'Basic ' + Buffer.from(`${process.env.ASSINCE_USERNAME}:${ process.env.ASSINCE_PASSWORD}`).toString('base64');
    const objUpdate = {}

    objUpdate.idTicketSuper = idMesaCentral;
    console.log(objUpdate);
    const success = await consumirApi_AmericanSince(`${url_Provider}/ticketns/api/v1/updateidTicketAnam/${idAS}`, 'PUT', { "Authorization ": `${auth}` }, objUpdate, "AS-SINCE");
    return success; // Retornar el resultado de la llamada
}


async function uploadFilesASNICE(data = null) {
    const auth = 'Basic ' + Buffer.from(`${process.env.ASSINCE_USERNAME}:${ process.env.ASSINCE_PASSWORD}`).toString('base64');
    const objUpdate = {}
    objUpdate.idTicketNS = data.TIC_ID_EXTERNO_PROVEEDOR;
    objUpdate.idTicketIntegracion = data.TIC_NEWID;
    
    let DataImages = data.aryImages;

    if (DataImages == null) {
        
    } else {
        let attachmensData = DataImages;
    
        let dataJsonUpload = "";
        for(let i =0; i<attachmensData.length; i++) {
            let filetoBaseConvert = attachmensData[i];
            objUpdate.adjunto1=filetoBaseConvert.AttachmenBlob;
            objUpdate.nombreAdjunto1=filetoBaseConvert.AttachmenName;
            objUpdate.tamano1 = `${filetoBaseConvert.AttachmenSize}`;
            objUpdate.nota = `Datos adjuntos ${filetoBaseConvert.AttachmenName}`;
        }        
    }
    const success = await consumirApi_AmericanSince(`${url_Provider}/ticketns/api/v1/notasyAdjuntosTicket`, 'POST', { "Authorization ": `${auth}` }, objUpdate, "AS-SINCE");
    
    return success; // Retornar el resultado de la llamada
}

async function addNotesASNICE(data = null) {
    const auth = 'Basic ' + Buffer.from(`${process.env.ASSINCE_USERNAME}:${ process.env.ASSINCE_PASSWORD}`).toString('base64');
    const objUpdate = {}
    objUpdate.idTicketNS = data.FolioProveedor;
    objUpdate.idTicketIntegracion = data.TIC_NEWID;
    objUpdate.nota = data.DataDescripcion;
    const success = await consumirApi_AmericanSince(`${url_Provider}/ticketns/api/v1/notasyAdjuntosTicket`, 'POST', { "Authorization ": `${auth}` }, objUpdate, "AS-SINCE");
    
    return success; // Retornar el resultado de la llamada
}
// Exportar la función
module.exports = { altaTicketASSINCE,uptadeTicketASNICE,uploadFilesASNICE, updateNoTicketMSAtoASNICE, addNotesASNICE};