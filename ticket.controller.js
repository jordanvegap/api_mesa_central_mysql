const dbConfig = require('../__utilitis/config.db.mysql');
const recordFunction = require('../__utilitis/record.function');

const {updateANAMTicketIdExterno, insertaTicketMesaCentral, insertaLogErrorProveedor} = require('./update_ticket_service/updateService');

//IMPORTANTE
// Importar API´s
/*COVECA 1 Y 2*/ const { realizarSolicitud,updateStatusCoveca1 } = require('./api_coveca/api_coveca');
/*SINI*/ const { reqServiceSINI, reqServiceSINIUpdate ,createAltaSini,createBajaSini,createCambioSini} = require('./api_sini/api_sini');
/*CREATIF*/ const { reqServiceCOSCD, calificaTicketCOSCD } = require('./api_creatif/api_creatif');
/*COSISI*/ const { reqServiceCOSISI, createAltaCosisi,createBajaCosisi,createCambioCosisi,createRequerimientoCosisi,reqServiceCOSISIUpdate } = require('./api_cosisi/api_cosisi');
/*ESPECTROSCOPIA*/ const { altaTicketEspectroscipia, updateTicketEspectroscopia} = require('./api_espectoscopia/api_espectroscipia');
/*ASTROPHYSICS*/ const { altaTicketAstrophysics, updateTicketAstrophysics} = require('./api_astropphysic/api_astropphysic');
/*SIADECON 1.1*/ const {altaTicketSiadeconii, updateTicketSiadeconii} = require('./api_siadeconii/api_siadeconii');
/*COSIP*/ const {altaTicketCosip, updateTicketCosip} = require('./api_cosip/api_cosip');

/*AS&E*/ const {altaTicketASSINCE, uptadeTicketASNICE, uploadFilesASNICE} = require('./api_assince/api_assince');
/*CoVeli*/ const {createIncidenciaCOVELI, updateTicketCOVELI} = require('./api_coveli/api_coveli');
/*COVIVI*/ const {createTicketCovivi, updateTicketCovivi} = require('./api_covivi/api_covivi');
/*UNINET COSCI*/ const {createTicketUninetCosci, updateTicketUninetCosci, uploadImagesTicketUninetCosci} = require('./api_uninet_cosci/api_uninet_cosci');
/*UNINET LAN Y WLAN*/ const {createTicketUninetLanWlan, updateTicketUninetWlan,uploadImagesTicketUninetWlan} = require('./api_uninet_lanwlan/api_uninet_lanwlan');
/*SOTIC*/ const { insertTicket_Sotic, calificaTicket_Sotic } = require('./api_sotic/api_sotic');
function removeCircularReferences(obj) {
    const seen = new WeakSet();
    function circularReplacer(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return; // Avoid circular reference
        }
        seen.add(value);
      }
      return value;
    }
    return JSON.stringify(obj, circularReplacer);
  }
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

exports.Get_Tipificaciones_Mesa = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT MS.EMP_CSC_EMPRESA_HOST,MS.CAM_MESA_CSC,MS.CAT_TIPO_TIPIFICA_CSC,CAM_MESA_IDIOMA1,TPOTIPI.CAT_TIPO_TIPIFICA_CSC,TIPIFICACION.* FROM SAMT_CAM_MESA_DE_AYUDA AS MS "
        +" INNER JOIN SAMT_CAT_TIPO_TIPIFICACIONES AS TPOTIPI ON TPOTIPI.CAT_TIPO_TIPIFICA_CSC = MS.CAT_TIPO_TIPIFICA_CSC AND TPOTIPI.EMP_CSC_EMPRESA_HOST = MS.EMP_CSC_EMPRESA_HOST "
        +" INNER JOIN SAMT_CAM_TIPIFICACIONES AS TIPIFICACION ON TIPIFICACION.CAT_TIPO_TIPIFICA_CSC =  MS.CAT_TIPO_TIPIFICA_CSC AND TIPIFICACION.EMP_CSC_EMPRESA_HOST  = MS.EMP_CSC_EMPRESA_HOST "
        +" WHERE MS.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND MS.CAM_MESA_CSC = "+__Request_Pool.escape(req.query.CAM_MESA_CSC);

        if (req.query.TIPIFICA_ACCESO_DIRECTO) {
            query += " AND TIPIFICACION.TIPIFICA_ACCESO_DIRECTO = "+__Request_Pool.escape(req.query.TIPIFICA_ACCESO_DIRECTO);
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

exports.Insert_Ticket_Servicio = async (req,res) => {
    try {
        var resultadoApiProvider = null;
        let ResultData = {};
        const dataInsertMS = { ...req.body.DATA_INSERT }; // Copia superficial
        const dataBodyToSend = {};
        dataBodyToSend.EMP_CLV_EMPRESA = req.body.EMP_CLV_EMPRESA;
        dataBodyToSend.EMP_CSC_EMPRESA_HOST = req.body.EMP_CSC_EMPRESA_HOST;
        dataBodyToSend.Type = req.body.Type;

        let dataInsertError = {
            EMP_CSC_EMPRESA_HOST: dataInsertMS.EMP_CSC_EMPRESA_HOST,
            EMPLEADO_CSC_EMPLEADO: dataInsertMS.AUDITORIA_USU_ALTA,
            API_ERROR_NOMBRE_EMPLEADO: dataInsertMS.TIC_ATIENDE,
            API_ERROR_NOMBRE_SERVICIO: dataInsertMS.CAM_CSC_SERVICIO_SOLICITA,
            API_ERROR_NOMBRE_PROVEEDOR: dataInsertMS.CAM_MESA_CSC,
            AUDITORIA_USU_ALTA: dataInsertMS.AUDITORIA_USU_ALTA,
            AUDITORIA_USU_ULT_MOD: dataInsertMS.AUDITORIA_USU_ALTA
        }
        console.log(req.body.DATA_INSERT.CAM_CSC_SERVICIO_SOLICITA);
        
        switch (req.body.DATA_INSERT.CAM_CSC_SERVICIO_SOLICITA) {
            
            /*case 2: //COVECA 2
                (async () => {
                    resultadoApiProvider = await realizarSolicitudRt4Sieca(req.body.DATA_INSERT);
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider.data);
                    } else {
                        console.log(resultadoApiProvider);
                    }
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                    res.status(200);
                    res.send(ResultData);
                })();
            break;*/

            case 4: //SIADECON 1.1
                (async () => {
                    resultadoApiProvider = await altaTicketSiadeconii(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider.data);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else {
                        let resultProviderDataParse = resultadoApiProvider.Detail.folio;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                    // ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                    // res.status(200);
                    // res.send(ResultData);
                })();
            break;

            case 5: //COSCD 2
                (async () => {
                    resultadoApiProvider = await reqServiceCOSCD(req.body.DATA_INSERT);
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider.data);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.JsonData;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 10: //COSIP
                (async () => {
                    resultadoApiProvider = await altaTicketCosip(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider.data);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else {
                        //busObPublicId: '314264',
                        //busObRecId: '94b32461a77931f6b158234b08ad37892f23211427'
                        let resultProviderDataParse = `${resultadoApiProvider.Detail.busObPublicId}|${resultadoApiProvider.Detail.busObRecId}` ;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                    // ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                    // res.status(200);
                    // res.send(ResultData);
                })();
            break;

            case 12: //SINI
                (async () => {
                    console.log(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString);
                    
                    if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "INCIDENTE"){
                        resultadoApiProvider = await reqServiceSINI(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "ALTA"){
                        resultadoApiProvider = await createAltaSini(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "BAJA"){
                        resultadoApiProvider = await createBajaSini(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "CAMBIO"){
                        resultadoApiProvider = await createCambioSini(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    }
                    
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.message.folio_ticket;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 24: //COVECA 1
                (async () => {
                    resultadoApiProvider = await realizarSolicitud(req.body.DATA_INSERT);
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider.data);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else {
                        let resultProviderDataParse = resultadoApiProvider.Detail.servicio;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                    // ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                    // res.status(200);
                    // res.send(ResultData);
                })();
            break;

            case 3: //COSISI
                (async () => {

                    console.log(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString);
                    
                    if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "INCIDENTE"){
                        resultadoApiProvider = await reqServiceCOSISI(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.DATA_IMAGE_ARCHIVO);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "ALTA"){
                        resultadoApiProvider = await createAltaCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.DATA_IMAGE_ARCHIVO);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "BAJA"){
                        resultadoApiProvider = await createBajaCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.DATA_IMAGE_ARCHIVO);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "CAMBIO"){
                        resultadoApiProvider = await createCambioCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.DATA_IMAGE_ARCHIVO);
                    } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "REQUERIMIENTO DE SERVICIO"){
                        resultadoApiProvider = await createRequerimientoCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.DATA_IMAGE_ARCHIVO);
                    }
                    
                    
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.message.folio_ticket;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }

                    res.status(200);
                    res.send(ResultData);
                })();
            break;
        
            case 36: //ESPECTROSCOPIA
                (async () => {
                    resultadoApiProvider = await altaTicketEspectroscipia(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.Ticket;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 19: //ASTROPHYSICS
                (async () => {
                    resultadoApiProvider = await altaTicketAstrophysics(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.Ticket;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 20: //AS&E AMERICAN SINCE
                (async () => {
                    resultadoApiProvider = await altaTicketASSINCE(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: removeCircularReferences(resultadoApiProvider)};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = removeCircularReferences(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.noTicket;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: removeCircularReferences(resultadoApiProvider)};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 25: //COVELI
                (async () => {
                    resultadoApiProvider = await createIncidenciaCOVELI(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.message.folio_ticket;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 6: //COVIVI
                (async () => {
                    resultadoApiProvider = await createTicketCovivi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.data.ticket_id;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 8: //UNINET COSCI
                (async () => {
                    resultadoApiProvider = await createTicketUninetCosci(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.DATA_IMAGE_ARCHIVO);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.ticket_id;
                        console.log(resultProviderDataParse);
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 11: //UNINET LAN Y WLAN
                (async () => {
                    resultadoApiProvider = await createTicketUninetLanWlan(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS,req.body.aryImages);
                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.ticket_id;
                        console.log(resultProviderDataParse);
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            case 38: //SOTIC
                (async () => {
                    resultadoApiProvider = await insertTicket_Sotic(req.body.DATA_INSERT);
                    if (resultadoApiProvider) {
                        console.log(resultadoApiProvider.data);
                    } else {
                        console.log(resultadoApiProvider);
                    }

                    if (resultadoApiProvider.isSuccessProvider == false) {
                        ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};    
                        dataInsertError.SAMT_HIST_API_GENERAL_RESPONSE = JSON.stringify(resultadoApiProvider);
                        let logInsertadoError = await insertaLogErrorProveedor(dataInsertError,dataBodyToSend);
                    } else{
                        let resultProviderDataParse = resultadoApiProvider.Detail.JsonData;
                        
                        dataInsertMS.TIC_ID_EXTERNO_PROVEEDOR = resultProviderDataParse;

                        let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                        
                        ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: resultadoApiProvider};
                    }
                    
                    res.status(200);
                    res.send(ResultData);
                })();
            break;

            default:
                let reqInsertaTicketMS = await insertaTicketMesaCentral(dataInsertMS,dataBodyToSend);
                ResultData = {success: true,message: `Exito`,count: 1,JsonData: reqInsertaTicketMS, ResProvider: null};
                res.status(200);
                res.send(ResultData);
            break;
        }

    } catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.Update_Ticket_Servicio = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        
        var query = "UPDATE SAMT_TICKET_SERVICIO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";
         
        __Request_Pool.query(query, function(error, resultReturn){
            if (error) {
                ResultData = {success: false,message: error.message};
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
            else{
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    if (req.body.DATA_UPDATE.TIC_CALIFICADO == 1) {
                        switch (req.body.DATA_WHERE.CAM_CSC_SERVICIO_SOLICITA) {
                            case 12: //SINI
                                (async () => {
                                    resultadoApiProvider = await reqServiceSINIUpdate(req.body.DATA_UPDATE, req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                            break;
                            case 3: //COSISI
                                (async () => {
                                    resultadoApiProvider = await reqServiceCOSISIUpdate(req.body.DATA_UPDATE, req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                            break;

                            case 36: //ESPECTROSCOPIA
                                (async () => {
                                    resultadoApiProvider = await updateTicketEspectroscopia(req.body.DATA_UPDATE, req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                            break;

                            case 19: //ASTROPHYSYCS
                                (async () => {
                                    resultadoApiProvider = await updateTicketAstrophysics(req.body.DATA_UPDATE, req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                            break;

                            case 5: //CENTRO DE DATOS
                                (async () => {
                                    resultadoApiProvider = await calificaTicketCOSCD(req.body, req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                            break;

                            case 10: //COSIP
                                (async () => {
                                    resultadoApiProvider = await updateTicketCosip(req.body.DATA_UPDATE, req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                            break;

                            case 24: 
                                (async () => {
                                    resultadoApiProvider = await updateStatusCoveca1(req.body.DATA_UPDATE,req.body.DATA_WHERE);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                                
                            break;
                            case 4: //SIADECON 1.1
                            (async () => {
                                resultadoApiProvider = await updateTicketSiadeconii(req.body.DATA_UPDATE,req.body.DATA_WHERE);
                                if (resultadoApiProvider) {
                                    console.log(resultadoApiProvider);
                                } else {
                                    console.log(resultadoApiProvider);
                                }
                                ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                res.status(200);
                                res.send(ResultData);
                            })();
                            break;
                            case 20: //AS&E AMERICAN SINCE
                            (async () => {
                                resultadoApiProvider = await uptadeTicketASNICE(req.body.DATA_UPDATE, req.body.TIC_ID_EXTERNO_PROVEEDOR,req.body.TIC_TIPO_CATEGORIA);
                                if (resultadoApiProvider) {
                                    console.log(resultadoApiProvider);
                                } else {
                                    console.log(resultadoApiProvider);
                                }
                                ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                res.status(200);
                                res.send(ResultData);
                            })();
                            break;
                            case 25:  //COVELI
                                (async () => {
                                    resultadoApiProvider = await updateTicketCOVELI(req.body.DATA_UPDATE,req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                                
                            break;

                            case 6:  //COVIVI
                                (async () => {
                                    resultadoApiProvider = await updateTicketCovivi(req.body.DATA_UPDATE,req.body.TIC_ID_EXTERNO_PROVEEDOR);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                                
                            break;

                            case 8:  //UNINET COCSI
                                (async () => {
                                    resultadoApiProvider = await updateTicketUninetCosci(req.body.DATA_UPDATE,req.body.TIC_ID_EXTERNO_PROVEEDOR, req.body.DATA_WHERE);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                                
                            break;

                            case 11:  //UNINET LAN WLAN
                                (async () => {
                                    resultadoApiProvider = await updateTicketUninetWlan(req.body.DATA_UPDATE,req.body.TIC_ID_EXTERNO_PROVEEDOR, req.body.DATA_WHERE);
                                    if (resultadoApiProvider) {
                                        console.log(resultadoApiProvider);
                                    } else {
                                        console.log(resultadoApiProvider);
                                    }

                                    ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                    res.status(200);
                                    res.send(ResultData);
                                })();
                                
                            break;

                            
                            
                            default:
                                ResultData = {success: true,message: 'Success Data Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: null};
                                res.status(200);
                                res.send(ResultData);
                            break;
                        }
                    } else{
                        ResultData = {success: true,message: 'Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId};
                        res.status(200);
                        res.send(ResultData);
                    }
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

exports.Get_Ticket_Servicio = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        if (req.query.TIPO_CONSULTA == "CUBOINFO") {
            query = `SELECT INFO_TICKET.TIC_CSCTICKET,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') as fecha_alta_timezone,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_PROMESA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') as fecha_promesa_timezone,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_SOLICITA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') as fecha_solicita_timezone,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_CIERRE,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') as fecha_cierre_timezone,

            CONCAT(INFO_EMPLEADO_ATN.EMPLEADO_NOMBREEMPLEADO ,' ',INFO_EMPLEADO_ATN.EMPLEADO_APATERNOEMPLEADO, ' ', INFO_EMPLEADO_ATN.EMPLEADO_AMATERNOEMPLEADO) AS ATIENDE,
            CONCAT(INFO_EMPLEADO_SOL.EMPLEADO_NOMBREEMPLEADO ,' ',INFO_EMPLEADO_SOL.EMPLEADO_APATERNOEMPLEADO, ' ', INFO_EMPLEADO_SOL.EMPLEADO_AMATERNOEMPLEADO) AS SOLICITA,
            MSA.CAM_MESA_IDIOMA1 AS MESA_DE_AYUDA,
            CLAS_TIPI.TIPIFICA_IDIOMA1 AS CLASE_TIPIFICA,
            TIPO_TIPI.TIPIFICA_IDIOMA1 AS TIPO_TIPIFICA,
            TIPI.TIPIFICA_IDIOMA1 AS TIPIFICACION,
            TPOTICKET.TIPO_TICKET_IDIOMA1 AS TIPO,
            REQUIS.REQ_NOMBREAREA
            FROM SAMT_TICKET_SERVICIO AS INFO_TICKET 
            LEFT JOIN SAMT_EMPLEADOS AS INFO_EMPLEADO_ATN ON INFO_EMPLEADO_ATN.EMPLEADO_CSC_EMPLEADO = INFO_TICKET.EMPLEADO_CSC_ATIENDE AND INFO_EMPLEADO_ATN.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_EMPLEADOS AS INFO_EMPLEADO_SOL ON INFO_EMPLEADO_SOL.EMPLEADO_CSC_EMPLEADO = INFO_TICKET.EMPLEADO_CSC_SOLICITA AND INFO_EMPLEADO_SOL.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_CAM_MESA_DE_AYUDA AS MSA ON MSA.CAM_MESA_CSC = INFO_TICKET.CAM_MESA_CSC AND MSA.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_CAM_TIPIFICACIONES AS CLAS_TIPI ON CLAS_TIPI.TIPIFICA_CSC = INFO_TICKET.TIPIFICA_CSC_PARENT_PARENT AND CLAS_TIPI.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_CAM_TIPIFICACIONES AS TIPO_TIPI ON TIPO_TIPI.TIPIFICA_CSC = INFO_TICKET.TIPIFICA_CSC_PARENT AND TIPO_TIPI.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_CAM_TIPIFICACIONES AS TIPI ON TIPI.TIPIFICA_CSC = INFO_TICKET.TIPIFICA_CSC AND TIPI.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_TIPO_TICKET AS TPOTICKET ON TPOTICKET.TIPO_TICKET_CSC = INFO_TICKET.TIPO_TICKET_CSC AND TPOTICKET.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_REQUISICIONES AS REQUIS ON REQUIS.REQ_CSCREQUISICION = INFO_TICKET.REQ_CSCREQUISICION AND REQUIS.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            WHERE INFO_TICKET.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;
        }
        else{
            query = `SELECT INFO_TICKET.*,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_alta_timezone,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_PROMESA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_promesa_timezone,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_SOLICITA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_solicita_timezone,
            DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_CIERRE,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_cierre_timezone,
            CONCAT(INFO_EMPLEADO_ATN.EMPLEADO_NOMBREEMPLEADO ,' ',INFO_EMPLEADO_ATN.EMPLEADO_APATERNOEMPLEADO, ' ', INFO_EMPLEADO_ATN.EMPLEADO_AMATERNOEMPLEADO) AS NOM_EMP_ATN,
            CONCAT(INFO_EMPLEADO_SOL.EMPLEADO_NOMBREEMPLEADO ,' ',INFO_EMPLEADO_SOL.EMPLEADO_APATERNOEMPLEADO, ' ', INFO_EMPLEADO_SOL.EMPLEADO_AMATERNOEMPLEADO) AS NOM_EMP_SOL,
            
            COALESCE(
            (
            SELECT  SUM(TIMESTAMPDIFF(SECOND, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND INFO_TICKET.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) AS total_pause_duration 
            FROM SAMT_TICKET_LOG_SLA tl 
            WHERE tl.ACTION_STATUS = 'resume' 
            AND tl.TIC_NEWID = INFO_TICKET.TIC_NEWID 
            GROUP BY tl.TIC_NEWID
            )
            ,0) as TIEMPO_EJECUCION,

            COALESCE(
            (
            SELECT  SUM(TIMESTAMPDIFF(SECOND, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND INFO_TICKET.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) AS total_pause_duration 
            FROM SAMT_TICKET_LOG_SLA tl 
            WHERE tl.ACTION_STATUS = 'pause' 
            AND tl.TIC_NEWID = INFO_TICKET.TIC_NEWID 
            GROUP BY tl.TIC_NEWID
            )
            ,0) as TIEMPO_PAUSADO
            
            FROM SAMT_TICKET_SERVICIO AS INFO_TICKET 
            LEFT JOIN SAMT_EMPLEADOS AS INFO_EMPLEADO_ATN ON INFO_EMPLEADO_ATN.EMPLEADO_CSC_EMPLEADO = INFO_TICKET.EMPLEADO_CSC_ATIENDE AND INFO_EMPLEADO_ATN.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            LEFT JOIN SAMT_EMPLEADOS AS INFO_EMPLEADO_SOL ON INFO_EMPLEADO_SOL.EMPLEADO_CSC_EMPLEADO = INFO_TICKET.EMPLEADO_CSC_SOLICITA AND INFO_EMPLEADO_SOL.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
            WHERE INFO_TICKET.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;
        }        
        if (req.query.TIC_CRM) {
            query += " AND INFO_TICKET.TIC_CRM = "+__Request_Pool.escape(req.query.TIC_CRM);
        }

        if (req.query.EMPLEADO_CSC_ATIENDE) {
            query += " AND INFO_TICKET.EMPLEADO_CSC_ATIENDE = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_ATIENDE);
        }

        if (req.query.EMPLEADO_CSC_SOLICITA) {
            query += " AND INFO_TICKET.EMPLEADO_CSC_SOLICITA = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_SOLICITA);
        }
        
        if (req.query.TIC_NEWID ) {
            query += " AND INFO_TICKET.TIC_NEWID = "+__Request_Pool.escape(req.query.TIC_NEWID);
        }

        if (req.query.TIC_CERRADO) {
            query += " AND INFO_TICKET.TIC_CERRADO = "+__Request_Pool.escape(req.query.TIC_CERRADO);
        }

        if (req.query.CAM_MESA_CSC) {
            query += " AND INFO_TICKET.CAM_MESA_CSC = "+__Request_Pool.escape(req.query.CAM_MESA_CSC);
        }
        if(req.query.TIC_FECHA_INICIAL && req.query.TIC_FECHA_FINAL){
            if (req.query.BYFC) {
                query += `AND DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_CIERRE,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') BETWEEN ${__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)} AND ${__Request_Pool.escape(req.query.TIC_FECHA_FINAL)}`; 
            } else {
                query += `AND DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') BETWEEN ${__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)} AND ${__Request_Pool.escape(req.query.TIC_FECHA_FINAL)}`; 
            }
        }
        if(req.query.ESTATUS_CSC){
            query += " AND INFO_TICKET.ESTATUS_TICKET_CSC = "+__Request_Pool.escape(req.query.ESTATUS_CSC);
        }
        if(req.query.SEVERIDAD_CSC){
            query += " AND INFO_TICKET.TIPO_SEVERIDAD_CSC = "+__Request_Pool.escape(req.query.SEVERIDAD_CSC);
        }
        if(req.query.PRIORIDAD_CSC){
            query += " AND INFO_TICKET.TIPO_PRIORIDAD_CSC = "+__Request_Pool.escape(req.query.PRIORIDAD_CSC);
        }
        if(req.query.CAM_MESA_CSC_IN){
            query += " AND INFO_TICKET.CAM_MESA_CSC IN ( " + req.query.CAM_MESA_CSC_IN + " ) " ;
        }
        if(req.query.TIC_CSCTICKET){
            query += " AND INFO_TICKET.TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET);
        }
        if(req.query.SFP_NUMERO_EXTERNO_DE_RESPONSABLE){
            query += " AND INFO_TICKET.SFP_NUMERO_EXTERNO_DE_RESPONSABLE = "+__Request_Pool.escape(req.query.SFP_NUMERO_EXTERNO_DE_RESPONSABLE);
        }
        if(req.query.CAM_CSC_SERVICIO_SOLICITA_IN){
            query += " AND INFO_TICKET.CAM_CSC_SERVICIO_SOLICITA IN ( " + req.query.CAM_CSC_SERVICIO_SOLICITA_IN + " ) " ;
        }
        if(req.query.TIC_REQ_AUTORIZACION){
            query += " AND INFO_TICKET.TIC_REQ_AUTORIZACION = "+__Request_Pool.escape(req.query.TIC_REQ_AUTORIZACION);
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

exports.Get_Simple_Tipificaciones = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
        
        query = "SELECT  "+
        "    TIPIFICA_CSC "+
        "    ,TIPIFICA_IDIOMA1  "+
        " FROM "+
        "    SAMT_CAM_TIPIFICACIONES"+
        " WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+";";
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

exports.Get_Arbol_Servicios_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO "+
        ",SAMT_CAM_SERVICIO.CAM_SERVICIO_NOMBRE "+
        " FROM "+
        " SAMT_CAM_SERVICIO INNER JOIN SAMT_CAM_MESA_EMPLEADOS ON "+
        " SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO = SAMT_CAM_MESA_EMPLEADOS.CAM_MESA_CSC"+
        " WHERE SAMT_CAM_SERVICIO.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND SAMT_CAM_MESA_EMPLEADOS.EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)+";--";

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


exports.Get_Ensamble_Mesa_Ayuda = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT * FROM SAMT_CAM_MESA_DE_AYUDA WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND CAM_MESA_CSC = "+__Request_Pool.escape(req.query.CAM_MESA_CSC)+" ";

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

exports.Insert_Bitacora_Ticket = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        
        var query = "INSERT INTO SAMT_TICKET_BITACORA SET ?";
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


exports.Get_Ticket_Bitacora = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT * FROM SAMT_TICKET_BITACORA WHERE EMP_CSC_EMPRESA_HOST="+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET)+" ORDER BY TIB_FECHAHORA DESC;";

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


exports.Insert_Ticket_Empleados = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT");
        var query = "INSERT INTO SAMT_TICKET_EMPLEADOS " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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


exports.Get_Ticket_Empleados = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = " SELECT *  FROM SAMT_TICKET_EMPLEADOS  WHERE [EMP_CSC_EMPRESA_HOST] = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND [TIC_NEWID] = @TIC_NEWID ;";

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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Get_Mesa_Empleado = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        if(req.query.TPO_USUARIO == "ADMIN"){
            if(req.query.ESPECIALIZADA){
                query = "SELECT MS_AYUDA.CAM_MESA_CSC, MS_AYUDA.CAM_MESA_IDIOMA1,MS_AYUDA.CAM_MESA_DLL, MS_AYUDA.CAM_MESA_NAMESPACE,MS_AYUDA.CAM_DLL_TIPO_ENSAMBLE, MS_AYUDA.CAM_MESA_IFRAMEWEB  FROM SAMT_CAM_MESA_DE_AYUDA AS MS_AYUDA "+
                "INNER JOIN SAMT_CAM_MESA_EMPLEADOS AS MS_EMP_ADMIN ON MS_EMP_ADMIN.CAM_MESA_CSC = MS_AYUDA.CAM_MESA_CSC AND MS_EMP_ADMIN.EMP_CSC_EMPRESA_HOST = MS_AYUDA.EMP_CSC_EMPRESA_HOST "+
                "WHERE MS_AYUDA.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND MS_EMP_ADMIN.EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)+" AND MS_AYUDA.CAM_MESA_CSC = "+__Request_Pool.escape(req.query.CAM_MESA_CSC)+" ORDER BY MS_AYUDA.CAM_MESA_IDIOMA1 ASC;";
            }
            else{
                query = "SELECT MS_AYUDA.CAM_MESA_CSC, MS_AYUDA.CAM_MESA_IDIOMA1,MS_AYUDA.CAM_MESA_DLL, MS_AYUDA.CAM_MESA_NAMESPACE,MS_AYUDA.CAM_DLL_TIPO_ENSAMBLE, MS_AYUDA.CAM_MESA_IFRAMEWEB  FROM SAMT_CAM_MESA_DE_AYUDA AS MS_AYUDA "+
                "INNER JOIN SAMT_CAM_MESA_EMPLEADOS AS MS_EMP_ADMIN ON MS_EMP_ADMIN.CAM_MESA_CSC = MS_AYUDA.CAM_MESA_CSC AND MS_EMP_ADMIN.EMP_CSC_EMPRESA_HOST = MS_AYUDA.EMP_CSC_EMPRESA_HOST "+
                "WHERE MS_AYUDA.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND MS_EMP_ADMIN.EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)+" ORDER BY MS_AYUDA.CAM_MESA_IDIOMA1 ASC;";
            }
            
        }
        else if(req.query.TPO_USUARIO == "GENERA"){
            if(req.query.ESPECIALIZADA){
                query = "SELECT MS_AYUDA.CAM_MESA_CSC, MS_AYUDA.CAM_MESA_IDIOMA1,MS_AYUDA.CAM_MESA_DLL, MS_AYUDA.CAM_MESA_NAMESPACE,MS_AYUDA.CAM_DLL_TIPO_ENSAMBLE, MS_AYUDA.CAM_MESA_IFRAMEWEB  FROM SAMT_CAM_MESA_DE_AYUDA AS MS_AYUDA "+
                "INNER JOIN SAMT_CAM_MESA_EMPLEADOS_GENERA AS MS_EMP_ADMIN ON MS_EMP_ADMIN.CAM_MESA_CSC = MS_AYUDA.CAM_MESA_CSC AND MS_EMP_ADMIN.EMP_CSC_EMPRESA_HOST = MS_AYUDA.EMP_CSC_EMPRESA_HOST "+
                "WHERE MS_AYUDA.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND MS_EMP_ADMIN.EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)+" AND MS_AYUDA.CAM_MESA_CSC = "+__Request_Pool.escape(req.query.CAM_MESA_CSC)+" ORDER BY MS_AYUDA.CAM_MESA_IDIOMA1 ASC;";
            } else{
                query = "SELECT MS_AYUDA.CAM_MESA_CSC, MS_AYUDA.CAM_MESA_IDIOMA1,MS_AYUDA.CAM_MESA_DLL, MS_AYUDA.CAM_MESA_NAMESPACE,MS_AYUDA.CAM_DLL_TIPO_ENSAMBLE, MS_AYUDA.CAM_MESA_IFRAMEWEB  FROM SAMT_CAM_MESA_DE_AYUDA AS MS_AYUDA "+
                "INNER JOIN SAMT_CAM_MESA_EMPLEADOS_GENERA AS MS_EMP_ADMIN ON MS_EMP_ADMIN.CAM_MESA_CSC = MS_AYUDA.CAM_MESA_CSC AND MS_EMP_ADMIN.EMP_CSC_EMPRESA_HOST = MS_AYUDA.EMP_CSC_EMPRESA_HOST "+
                "WHERE MS_AYUDA.EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND MS_EMP_ADMIN.EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)+" ORDER BY MS_AYUDA.CAM_MESA_IDIOMA1 ASC;";
            }
            
        } else if(req.query.TPO_USUARIO == "SUPER"){
            query = "SELECT * FROM SAMT_CAM_MESA_DE_AYUDA WHERE CAM_MESA_ACTIVO = 1 AND EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" ORDER BY CAM_MESA_IDIOMA1 ASC"
        } else if(req.query.TPO_USUARIO == "EMP_ADMIN_MESA"){
            query = `SELECT MSA_EMP.EMPLEADO_CSC_EMPLEADO, EMP.EMPLEADO_ID_EXTERNO,
            CONCAT(EMP.EMPLEADO_NOMBREEMPLEADO, ' ',EMP.EMPLEADO_APATERNOEMPLEADO, ' ',EMP.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE
            ,EMP.CAT_PROCESO_EMP_CSC
            ,EMP.CAT_PROCESO_EMP_CSC
            ,EMP.EMPLEADO_EMAILLABORAL
            ,EMP.SOLICITUD_EMPLEADO_EMAIL_PERSONAL
            ,EMP.EMPLEADO_CELULAR
            FROM SAMT_CAM_MESA_EMPLEADOS AS MSA_EMP
            INNER JOIN SAMT_EMPLEADOS AS EMP ON EMP.EMPLEADO_CSC_EMPLEADO = MSA_EMP.EMPLEADO_CSC_EMPLEADO AND EMP.EMP_CSC_EMPRESA_HOST = MSA_EMP.EMP_CSC_EMPRESA_HOST
            WHERE MSA_EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
            AND MSA_EMP.CAM_MESA_CSC = ${__Request_Pool.escape(req.query.CAM_MESA_CSC)} 
            AND EMP.CAT_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_PROCESO_EMP_CSC)} 
            AND EMP.CAT_SUBPROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.CAT_SUBPROCESO_EMP_CSC)} 
            AND EMP.ESTATUS_PROCESO_EMP_CSC = ${__Request_Pool.escape(req.query.ESTATUS_PROCESO_EMP_CSC)}`;

            if(req.query.NOMBRE_BUSQUEDA){
                query += ` AND CONCAT(EMP.EMPLEADO_NOMBREEMPLEADO, ' ',EMP.EMPLEADO_APATERNOEMPLEADO, ' ',EMP.EMPLEADO_AMATERNOEMPLEADO) LIKE '%${req.query.NOMBRE_BUSQUEDA}%'`
            }

        }
        
        else{
            ResultData = {success: false,message: "Falta definicion de datos consulte al admin del api"};
            res.status(400);
            res.send(ResultData);
            return
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

exports.Get_Autoriza_Ticket = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
        
        query = `SELECT TK_AUT.*
        ,CONCAT(EMP.EMPLEADO_NOMBREEMPLEADO, ' ',EMP.EMPLEADO_APATERNOEMPLEADO, ' ',EMP.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE
        ,CONCAT(EMP_SOL.EMPLEADO_NOMBREEMPLEADO, ' ',EMP_SOL.EMPLEADO_APATERNOEMPLEADO, ' ',EMP_SOL.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE_SOLICITANTE
        FROM SAMT_TICKET_AUTORIZACIONES AS TK_AUT 
        INNER JOIN SAMT_EMPLEADOS AS EMP ON EMP.EMPLEADO_CSC_EMPLEADO = TK_AUT.EMPLEADO_CSC_EMPLEADO AND EMP.EMP_CSC_EMPRESA_HOST = TK_AUT.EMP_CSC_EMPRESA_HOST
        INNER JOIN SAMT_EMPLEADOS AS EMP_SOL ON EMP_SOL.EMPLEADO_CSC_EMPLEADO = TK_AUT.AUDITORIA_USU_ALTA AND EMP_SOL.EMP_CSC_EMPRESA_HOST = TK_AUT.EMP_CSC_EMPRESA_HOST
        WHERE TK_AUT.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;

        if (req.query.AUTORIZACIONES_TIC_NEWID) {
            query += " AND TK_AUT.AUTORIZACIONES_TIC_NEWID = "+__Request_Pool.escape(req.query.AUTORIZACIONES_TIC_NEWID);
        }

        if (req.query.AUTORIZACIONES_NEWID) {
            query += " AND TK_AUT.AUTORIZACIONES_NEWID ="+__Request_Pool.escape(req.query.AUTORIZACIONES_NEWID);
        }

        if (req.query.EMPLEADO_CSC_EMPLEADO) {
            query += " AND TK_AUT.EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO);
        }

        if (req.query.AUTORIZADO_ACTIVO) {
            query += " AND TK_AUT.AUTORIZADO_ACTIVO = "+__Request_Pool.escape(req.query.AUTORIZADO_ACTIVO);
        }

        if(req.query.AUT_FECHA_INICIAL && req.query.AUT_FECHA_FINAL){
            query += " AND DATE(TK_AUT.AUDITORIA_FEC_ULT_MOD) BETWEEN "+__Request_Pool.escape(req.query.AUT_FECHA_INICIAL)+" AND "+__Request_Pool.escape(req.query.AUT_FECHA_FINAL);
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

/** MESA DE AYUDA MERCEDES-BENZ */
exports.Get_Mercedes_Ticket_Servicio = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT * FROM SAMT_MERCEDES_TICKET_SERVICIO WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+"";

        if(req.query.TIC_FECHA_ALTA_INICIO && req.query.TIC_FECHA_ALTA_FIN){
            query += " AND convert(varchar, AUDITORIA_FEC_ALTA, 23) BETWEEN @TIC_FECHA_ALTA_INICIO AND @TIC_FECHA_ALTA_FIN";
        }

        if (req.query.EMPLEADO_CSC_ATIENDE) {
            query += " AND EMPLEADO_CSC_ATIENDE = @EMPLEADO_CSC_ATIENDE"
        }

        if (req.query.EMPLEADO_CSC_SOLICITA) {
            query += " AND EMPLEADO_CSC_SOLICITA = @EMPLEADO_CSC_SOLICITA"
        }
        
        if (req.query.TIC_NEWID ) {
            query += " AND TIC_NEWID = @TIC_NEWID"
        }

        if (req.query.TIC_CERRADO) {
            query += " AND TIC_CERRADO = @TIC_CERRADO"
        }

        if (req.query.CAM_CSC_SERVICIO) {
            query += " AND CAM_CSC_SERVICIO = @CAM_CSC_SERVICIO"
        }
        if(req.query.CAM_CSC_SERVICIO_IN){
            query += " AND CAM_CSC_SERVICIO IN ( " + req.query.CAM_CSC_SERVICIO_IN + " ) " ;
        }
        if(req.query.TIC_FECHA_INICIAL && req.query.TIC_FECHA_FINAL){
            query += " AND TIC_FECHA_ALTA BETWEEN @TIC_FECHA_INICIAL AND @TIC_FECHA_FINAL " ;
        }
        if(req.query.ESTATUS_CSC){
            query += " AND ESTATUS_TICKET_CSC = @ESTATUS_TICKET_CSC " ;
        }
        if(req.query.SEVERIDAD_CSC){
            query += " AND TIPO_SEVERIDAD_CSC = @TIPO_SEVERIDAD_CSC " ;
        }
        if(req.query.PRIORIDAD_CSC){
            query += " AND TIPO_PRIORIDAD_CSC = @TIPO_PRIORIDAD_CSC " ;
        }
        if(req.query.TIC_CSCTICKET){
            query += " AND TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET);
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

exports.Insert_Mercedes_Ticket_Servicio = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT");
        var query = "INSERT INTO SAMT_MERCEDES_TICKET_SERVICIO " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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
exports.Update_Mercedes_Ticket_Servicio = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 

        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_UPDATE,__Request_Pool,"UPDATE");
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_WHERE,__Request_Pool,"WHERE");
        
        var query = "UPDATE SAMT_MERCEDES_TICKET_SERVICIO " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" OUTPUT INSERTED.* WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Insert_Mercedes_Bitacora_Ticket = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT");
        var query = "INSERT INTO SAMT_MERCEDES_TICKET_BITACORA " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Get_Mercedes_Ticket_Bitacora = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT * FROM SAMT_MERCEDES_TICKET_BITACORA WHERE EMP_CSC_EMPRESA_HOST="+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" AND TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET)+" ORDER BY TIB_FECHAHORA DESC;";

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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Insert_Mercedes_Autoriza_Ticket = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT");
        var query = "INSERT INTO SAMT_MERCEDES_TICKET_AUTORIZACIONES " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Get_Mercedes_Autoriza_Ticket = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
        
        query = "SELECT * FROM SAMT_MERCEDES_TICKET_AUTORIZACIONES WHERE EMP_CSC_EMPRESA_HOST="+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+"";

        if (req.query.AUTORIZACIONES_TIC_NEWID) {
            query += " AND AUTORIZACIONES_TIC_NEWID = "+__Request_Pool.escape(req.query.AUTORIZACIONES_TIC_NEWID);
        }

        if (req.query.AUTORIZACIONES_NEWID) {
            query += " AND AUTORIZACIONES_NEWID ="+__Request_Pool.escape(req.query.AUTORIZACIONES_NEWID);
        }

        if (req.query.EMPLEADO_CSC_EMPLEADO) {
            query += " AND EMPLEADO_CSC_EMPLEADO = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_EMPLEADO)+""
        }

        if (req.query.AUTORIZADO_ACTIVO) {
            query += " AND AUTORIZADO_ACTIVO = "+__Request_Pool.escape(req.query.AUTORIZADO_ACTIVO);
        }

        if(req.query.AUT_FECHA_INICIAL && req.query.AUT_FECHA_FINAL){
            query += " AND convert(varchar, AUDITORIA_FEC_ULT_MOD, 23) BETWEEN "+__Request_Pool.escape(req.query.AUT_FECHA_INICIAL)+" AND "+__Request_Pool.escape(req.query.AUT_FECHA_FINAL);
        }


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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Update_Mercedes_Autoriza_Ticket = async (req,res) => {
    try{
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_UPDATE,__Request_Pool,"UPDATE");
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_WHERE,__Request_Pool,"WHERE");
        
        var query = "UPDATE SAMT_MERCEDES_TICKET_AUTORIZACIONES " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" OUTPUT INSERTED.* WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Update',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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
/** MESA DE AYUDA MERCEDES-BENZ */

/** SEPARAR A API RH */
exports.Insert_Req_Personal = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT");
        var query = "INSERT INTO SAMT_REQUISICION_PERSONAL " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Get_Head_Count_Activo = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
        
        query = "select * from SAMT_HEADCOUNT_AUTORIZADO HCA inner join SAMT_ESTATUS_HEADCOUNT CAT on HCA.EMP_CSC_EMPRESA_HOST= CAT.EMP_CSC_EMPRESA_HOST"+
        " and HCA.TIPO_ESTATUS_HEADCOUNT_CSC = CAT.ESTATUS_HEADCOUNT_CSC"+
        " where HCA.CLIENTE_CSC= @CLIENTE_CSC and CAM_CSC_SERVICIO=@CAM_CSC_SERVICIO and HCA.EMP_CSC_EMPRESA_HOST= "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)+" and ESTATUS_CLAVE not in ('CAN','CUB');";
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Get',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Inserta_Intersec_Ticket_HeadCount = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT");
        var query = "INSERT INTO SAMT_REQUISICION_TICKET " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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

exports.Inserta_Head_Count_Activo = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.body.Type); 
        
        
        __Request_Pool = recordFunction.Recorre_Parameter(req.body.DATA_INSERT,__Request_Pool,"INSERT_OUTPUT");
        var query = "INSERT INTO SAMT_HEADCOUNT_AUTORIZADO " + recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT_OUTPUT") +" ; ";
         
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
                if (resultReturn.rowsAffected[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.rowsAffected[0],JsonData: resultReturn.recordset};
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
/** SEPARAR A API RH */


exports.Insert_Respuesta_Mensaje = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_MENSAJES SET ?";
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

exports.Update_Respuesta_Mensaje = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        
        var query = "UPDATE SAMT_TICKET_MENSAJES " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";
         
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

exports.Get_Respuesta_Mensaje = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT * FROM SAMT_TICKET_MENSAJES WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST);

        if(req.query.TIC_CSCTICKET){
            query += " AND TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET);
        }      
        query += " ORDER BY CSC_RESPUESTA DESC;--";
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

exports.Insert_Autoriza_Ticket = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_AUTORIZACIONES SET ?";
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

exports.Get_Mesa_DataDefault = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `SELECT CONFIG_MESA.*
        ,ESTATUS.ESTATUS_TICKET_CSC
        ,ESTATUS.ESTATUS_TICKET_IDIOMA1
        ,PRIORIDAD.TIPO_PRIORIDAD_CSC
        ,PRIORIDAD.TIPO_PRIORIDAD_IDIOMA1
        ,TIPO.TIPO_TICKET_CSC
        ,TIPO.TIPO_TICKET_IDIOMA1
        ,SERVICIO.SAMT_CAM_TIPO_SERVICIO_CSC
        ,SERVICIO.TIPO_SERVICIO_IDIOMA1
        FROM SAMT_CAM_MESA_DE_AYUDA AS CONFIG_MESA
        INNER JOIN SAMT_ESTATUS_TICKET AS ESTATUS ON ESTATUS.CAM_MESA_CSC = CONFIG_MESA.CAM_MESA_CSC AND ESTATUS.ESTATUS_TICKET_DEFAULT = 1
        INNER JOIN SAMT_TIPO_PRIORIDAD_TICKET AS PRIORIDAD ON PRIORIDAD.CAM_MESA_CSC = CONFIG_MESA.CAM_MESA_CSC AND PRIORIDAD.TIPO_PRIORIDAD_DEFAULT = 1
        INNER JOIN SAMT_TIPO_TICKET AS TIPO ON TIPO.CAM_MESA_CSC = CONFIG_MESA.CAM_MESA_CSC AND TIPO.TIPO_TICKET_DEFAULT = 1
        INNER JOIN SAMT_CAM_TIPO_SERVICIO AS SERVICIO ON SERVICIO.TIPO_SERVICIO_CLAVE = ${__Request_Pool.escape(req.query.TIPO_SERVICIO_CLAVE)}
        WHERE CONFIG_MESA.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND CONFIG_MESA.CAM_MESA_CSC = ${__Request_Pool.escape(req.query.CAM_MESA_CSC)};`
        
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


exports.Insert_Ticket_Inventario = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_INVENTARIO SET ?";
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


exports.Get_Resumen_Ticket = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 
        query = `SELECT INFO_TICKET.TIC_CSCTICKET
        ,INFO_TICKET.TIC_NEWID
        ,INFO_TICKET.CAM_MESA_CSC
        ,INFO_TICKET.REQ_CSCREQUISICION
        ,INFO_TICKET.INM_CSCINMUEBLE
        ,INFO_TICKET.TIPIFICA_CSC_PARENT_PARENT
        ,INFO_TICKET.TIPIFICA_CSC_PARENT
        ,INFO_TICKET.TIPIFICA_CSC
        ,INFO_TICKET.CLIENTE_CSC_SOLICITA
        ,INFO_TICKET.PM_CSC_PROYECTO_SOLICITA
        ,INFO_TICKET.CAM_CSC_SERVICIO_SOLICITA
        ,INFO_TICKET.TIC_FECHA_ALTA
        ,INFO_TICKET.TIC_CERRADO
        ,INFO_TICKET.TIC_FECHA_CIERRE
        ,INFO_TICKET.TIC_FECHA_PROMESA
        ,INFO_TICKET.TIC_FECHA_SOLICITA
        ,CONCAT(INFO_EMPLEADO_ATN.EMPLEADO_NOMBREEMPLEADO ,' ',INFO_EMPLEADO_ATN.EMPLEADO_APATERNOEMPLEADO, ' ', INFO_EMPLEADO_ATN.EMPLEADO_AMATERNOEMPLEADO) AS NOM_EMP_ATN
        ,CONCAT(INFO_EMPLEADO_SOL.EMPLEADO_NOMBREEMPLEADO ,' ',INFO_EMPLEADO_SOL.EMPLEADO_APATERNOEMPLEADO, ' ', INFO_EMPLEADO_SOL.EMPLEADO_AMATERNOEMPLEADO) AS NOM_EMP_SOL
        ,ESTATUS.ESTATUS_TICKET_IDIOMA1
        ,PRIORIDAD.TIPO_PRIORIDAD_IDIOMA1
        ,TIPO.TIPO_TICKET_IDIOMA1
        ,SERVICIO.TIPO_SERVICIO_IDIOMA1
        ,MESA.CAM_MESA_IDIOMA1
        ,INFO_TICKET.TIC_SOLICITA
        ,DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_alta_timezone
        ,DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_PROMESA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_promesa_timezone
        ,DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_SOLICITA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_solicita_timezone
        ,DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_CIERRE,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') as fecha_cierre_timezone
        FROM SAMT_TICKET_SERVICIO AS INFO_TICKET 
        LEFT JOIN SAMT_EMPLEADOS AS INFO_EMPLEADO_ATN ON INFO_EMPLEADO_ATN.EMPLEADO_CSC_EMPLEADO = INFO_TICKET.EMPLEADO_CSC_ATIENDE AND INFO_EMPLEADO_ATN.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
        LEFT JOIN SAMT_EMPLEADOS AS INFO_EMPLEADO_SOL ON INFO_EMPLEADO_SOL.EMPLEADO_CSC_EMPLEADO = INFO_TICKET.EMPLEADO_CSC_SOLICITA AND INFO_EMPLEADO_SOL.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
        INNER JOIN SAMT_ESTATUS_TICKET AS ESTATUS ON ESTATUS.ESTATUS_TICKET_CSC = INFO_TICKET.ESTATUS_TICKET_CSC AND ESTATUS.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
        INNER JOIN SAMT_TIPO_PRIORIDAD_TICKET AS PRIORIDAD ON PRIORIDAD.TIPO_PRIORIDAD_CSC = INFO_TICKET.TIPO_PRIORIDAD_CSC AND PRIORIDAD.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
        INNER JOIN SAMT_TIPO_TICKET AS TIPO ON TIPO.TIPO_TICKET_CSC = INFO_TICKET.TIPO_TICKET_CSC AND TIPO.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
        INNER JOIN SAMT_CAM_TIPO_SERVICIO AS SERVICIO ON SERVICIO.SAMT_CAM_TIPO_SERVICIO_CSC = INFO_TICKET.SAMT_CAM_TIPO_SERVICIO_CSC AND SERVICIO.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST
        INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MESA ON MESA.CAM_MESA_CSC = INFO_TICKET.CAM_MESA_CSC AND MESA.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST`;
        
        if (req.query.EQUIPAMIENTO_NEWID) {
            query += ` INNER JOIN SAMT_TICKET_INVENTARIO AS EQINV ON EQINV.TIC_NEWID = INFO_TICKET.TIC_NEWID AND EQINV.EMP_CSC_EMPRESA_HOST = INFO_TICKET.EMP_CSC_EMPRESA_HOST 
            WHERE INFO_TICKET.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} AND EQINV.EQUIPAMIENTO_NEWID = ${__Request_Pool.escape(req.query.EQUIPAMIENTO_NEWID)}`;
        } else{
            query += ` WHERE INFO_TICKET.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}`;
        }

        if (req.query.TIC_CRM) {
            query += " AND INFO_TICKET.TIC_CRM = "+__Request_Pool.escape(req.query.TIC_CRM);
        }

        if (req.query.EMPLEADO_CSC_ATIENDE) {
            query += " AND INFO_TICKET.EMPLEADO_CSC_ATIENDE = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_ATIENDE);
        }

        if (req.query.EMPLEADO_CSC_SOLICITA) {
            query += " AND INFO_TICKET.EMPLEADO_CSC_SOLICITA = "+__Request_Pool.escape(req.query.EMPLEADO_CSC_SOLICITA);
        }
        
        if (req.query.TIC_NEWID ) {
            query += " AND INFO_TICKET.TIC_NEWID = "+__Request_Pool.escape(req.query.TIC_NEWID);
        }

        if (req.query.TIC_CERRADO) {
            query += " AND INFO_TICKET.TIC_CERRADO = "+__Request_Pool.escape(req.query.TIC_CERRADO);
        }

        if (req.query.CAM_MESA_CSC) {
            query += " AND INFO_TICKET.CAM_MESA_CSC = "+__Request_Pool.escape(req.query.CAM_MESA_CSC);
        }

        if(req.query.TIC_FECHA_INICIAL && req.query.TIC_FECHA_FINAL){
            if (req.query.BYFC) {
                query += ` AND DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_CIERRE,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') BETWEEN ${__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)} AND ${__Request_Pool.escape(req.query.TIC_FECHA_FINAL)}`; 
            } else {
                query += ` AND DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d %H:%i:%s') BETWEEN ${__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)} AND ${__Request_Pool.escape(req.query.TIC_FECHA_FINAL)}`; 
            }
        }

        // if(req.query.TIC_FECHA_INICIAL && req.query.TIC_FECHA_FINAL){
        //     var vUTC = recordFunction.is_negative_number(req.query.UTC);
        //     if (req.query.BYFC) {
        //         if (vUTC == true) {
        //             query += " AND Date_format(DATE_SUB(INFO_TICKET.TIC_FECHA_CIERRE,INTERVAL "+Math.abs(req.query.UTC)+" HOUR),'%Y-%m-%d %H:%i:%s') BETWEEN "+__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)+" AND "+__Request_Pool.escape(req.query.TIC_FECHA_FINAL); 
        //         } else {
        //             query += " AND Date_format(DATE_ADD(INFO_TICKET.TIC_FECHA_CIERRE,INTERVAL "+Math.abs(req.query.UTC)+" HOUR),'%Y-%m-%d %H:%i:%s') BETWEEN "+__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)+" AND "+__Request_Pool.escape(req.query.TIC_FECHA_FINAL); 
        //         }  
        //     } else {
        //         if (vUTC == true) {
        //             query += " AND Date_format(DATE_SUB(INFO_TICKET.TIC_FECHA_ALTA,INTERVAL "+Math.abs(req.query.UTC)+" HOUR),'%Y-%m-%d %H:%i:%s') BETWEEN "+__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)+" AND "+__Request_Pool.escape(req.query.TIC_FECHA_FINAL); 
        //         } else {
        //             query += " AND Date_format(DATE_ADD(INFO_TICKET.TIC_FECHA_ALTA,INTERVAL "+Math.abs(req.query.UTC)+" HOUR),'%Y-%m-%d %H:%i:%s') BETWEEN "+__Request_Pool.escape(req.query.TIC_FECHA_INICIAL)+" AND "+__Request_Pool.escape(req.query.TIC_FECHA_FINAL);
        //         }  
        //     }
        // }
        if(req.query.ESTATUS_CSC){
            query += " AND INFO_TICKET.ESTATUS_TICKET_CSC = "+__Request_Pool.escape(req.query.ESTATUS_CSC);
        }
        if(req.query.SEVERIDAD_CSC){
            query += " AND INFO_TICKET.TIPO_SEVERIDAD_CSC = "+__Request_Pool.escape(req.query.SEVERIDAD_CSC);
        }
        if(req.query.PRIORIDAD_CSC){
            query += " AND INFO_TICKET.TIPO_PRIORIDAD_CSC = "+__Request_Pool.escape(req.query.PRIORIDAD_CSC);
        }
        if(req.query.CAM_MESA_CSC_IN){
            query += " AND INFO_TICKET.CAM_MESA_CSC IN ( " + req.query.CAM_MESA_CSC_IN + " ) " ;
        }
        if(req.query.TIC_CSCTICKET){
            query += " AND INFO_TICKET.TIC_CSCTICKET = "+__Request_Pool.escape(req.query.TIC_CSCTICKET);
        }   
        
        if(req.query.TIC_SIN_ASIGNAR){
            query += " AND INFO_TICKET.EMPLEADO_CSC_ATIENDE IS NULL ";
        }
        if(req.query.TIC_FECHA_ALTA_SOLA){
            query += ` AND DATE_FORMAT(CONVERT_TZ(INFO_TICKET.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') = ${__Request_Pool.escape(req.query.TIC_FECHA_ALTA_SOLA)} `; 
            //query += " AND INFO_TICKET.TIC_FECHA_ALTA_SOLA = "+__Request_Pool.escape(req.query.TIC_FECHA_ALTA_SOLA);
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

exports.Get_Ticket_Foto = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `SELECT * FROM SAMT_TICKET_FOTO WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND TICKET_ACTIVO = ${__Request_Pool.escape(req.query.TICKET_ACTIVO)}
        AND TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)};`
        
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

exports.Get_Ticket_Documentos = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `SELECT * FROM SAMT_TICKET_FILE WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND TICKET_FILE_ACTIVO = ${__Request_Pool.escape(req.query.TICKET_FILE_ACTIVO)}
        AND TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)};`
        
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

exports.Data_Dashboard_General = async (req, res) => {
    try {
        let query = null;
        let extraData = ``;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        const {EMP_CSC_EMPRESA_HOST,TIPODASHBOARD, FECHA_CONSULTA} = req.query;

        const _Rsp = recordFunction.hasUndefinedOrEmptyValue({EMP_CSC_EMPRESA_HOST,TIPODASHBOARD});
        
        if (_Rsp != false) {
            ResultData = {success: false,message: _Rsp};
            res.status(200);
            res.send(ResultData);
            return;
        } 

        if (req.query.ANIOS) {
            extraData += ` AND YEAR(TKS.TIC_FECHA_ALTA) IN (${req.query.ANIOS}) `;
        }

        if (req.query.MES) {
            extraData += ` AND MONTH(TKS.TIC_FECHA_ALTA) IN (${req.query.MES}) `;
        }

        if (req.query.CLIENTE_CSC) {
            extraData += ` AND TKS.CLIENTE_CSC_SOLICITA IN (${req.query.CLIENTE_CSC}) `;
        }

        if (req.query.PM_CSC_PROYECTO) {
            extraData += ` AND TKS.PM_CSC_PROYECTO_SOLICITA IN (${req.query.PM_CSC_PROYECTO}) `;
        }

        if (req.query.CAM_CSC_SERVICIO) {
            extraData += ` AND TKS.CAM_CSC_SERVICIO_SOLICITA IN (${req.query.CAM_CSC_SERVICIO}) `;
        }

        if (req.query.REQ_CSCREQUISICION) {
            extraData += ` AND TKS.REQ_CSCREQUISICION IN (${req.query.REQ_CSCREQUISICION}) `;
        }

        if(req.query.CAM_MESA_CSC_IN){
            extraData += " AND TKS.CAM_MESA_CSC IN ( " + req.query.CAM_MESA_CSC_IN + " ) " ;
        }

        if(req.query.EMPLEADO_CSC_ATIENDE){
            extraData += " AND TKS.EMPLEADO_CSC_ATIENDE = " + req.query.EMPLEADO_CSC_ATIENDE ;
        }

        if(req.query.EMPLEADO_CSC_SOLICITA){
            extraData += " AND TKS.EMPLEADO_CSC_SOLICITA = " + req.query.EMPLEADO_CSC_SOLICITA ;
        }

        
        
        if (TIPODASHBOARD == 'ANUAL') {
            query = `WITH RECURSIVE months AS (
           
            SELECT DATE_FORMAT(DATE_SUB(${__Request_Pool.escape(FECHA_CONSULTA)}, INTERVAL 11 MONTH), '%Y-%m-01') AS month_date
            UNION ALL
            SELECT DATE_ADD(month_date, INTERVAL 1 MONTH)
            FROM months
            WHERE month_date < DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-01')
            )
            SELECT
                YEAR(m.month_date) AS year,
                MONTH(m.month_date) AS mes,
                COALESCE(COUNT(TKS.TIC_FECHA_ALTA), 0) AS total_tickets
            FROM months m
            LEFT JOIN SAMT_TICKET_SERVICIO AS TKS
                ON YEAR(TKS.TIC_FECHA_ALTA) = YEAR(m.month_date)
                AND MONTH(TKS.TIC_FECHA_ALTA) = MONTH(m.month_date)
                AND TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND TKS.CAM_MESA_CSC IN (1)
                ${extraData}
            -- Eliminamos el filtro de fechas ya que los meses están garantizados por la tabla recursiva
            GROUP BY year, mes
            ORDER BY year ASC, mes ASC
            LIMIT 12;`
        }
        else if (TIPODASHBOARD == 'ANUAL_CERRADOS') {
            query = `WITH RECURSIVE months AS (
                SELECT DATE_FORMAT(DATE_SUB(${__Request_Pool.escape(FECHA_CONSULTA)}, INTERVAL 11 MONTH), '%Y-%m-01') AS month_date
                UNION ALL
                SELECT DATE_ADD(month_date, INTERVAL 1 MONTH)
                FROM months
                WHERE month_date < DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-01')
                )
                SELECT
                    YEAR(m.month_date) AS year,
                    MONTH(m.month_date) AS mes,
                    COALESCE(COUNT(TKS.TIC_FECHA_CIERRE), 0) AS total_tickets
                FROM months m
                LEFT JOIN SAMT_TICKET_SERVICIO AS TKS
                    ON YEAR(TKS.TIC_FECHA_CIERRE) = YEAR(m.month_date)
                    AND MONTH(TKS.TIC_FECHA_CIERRE) = MONTH(m.month_date)
                    AND TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                    AND TKS.CAM_MESA_CSC IN (1)
                    AND TIC_CERRADO = 1
                    ${extraData}
                GROUP BY year, mes
                ORDER BY year ASC, mes ASC
                LIMIT 12;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ABIERTOS') {
            query = `SELECT COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
            AND DATE_FORMAT(TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 0
            ${extraData};`
        } 
        else if (TIPODASHBOARD == 'ANUAL_MESA') {
            query = `SELECT MSA.CAM_MESA_IDIOMA1 AS MESA,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MSA ON MSA.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MSA.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY MESA
            ORDER BY total_tickets DESC;`

        } 
        else if (TIPODASHBOARD == 'ANUAL_MESA_CERRADOS') {
            query = `SELECT MSA.CAM_MESA_IDIOMA1 AS MESA,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MSA ON MSA.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MSA.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 1
            ${extraData}
            GROUP BY MESA
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_SITE') {
            query = `SELECT SITE.REQ_NOMBREAREA AS SITE,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_REQUISICIONES AS SITE ON SITE.REQ_CSCREQUISICION = TKS.REQ_CSCREQUISICION AND SITE.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY SITE
            ORDER BY total_tickets DESC;`

        } 
        else if (TIPODASHBOARD == 'ANUAL_SITE_CERRADOS') {
            query = `SELECT SITE.REQ_NOMBREAREA AS SITE,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_REQUISICIONES AS SITE ON SITE.REQ_CSCREQUISICION = TKS.REQ_CSCREQUISICION AND SITE.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 1
            ${extraData}
            GROUP BY SITE
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_CANAL') {
            query = `SELECT CANAL.TIPO_SERVICIO_IDIOMA1 AS NAME,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_TIPO_SERVICIO AS CANAL ON CANAL.SAMT_CAM_TIPO_SERVICIO_CSC = TKS.SAMT_CAM_TIPO_SERVICIO_CSC AND CANAL.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`

        } 
        else if (TIPODASHBOARD == 'ANUAL_CANAL_CERRADOS') {
            query = `SELECT CANAL.TIPO_SERVICIO_IDIOMA1 AS NAME,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_TIPO_SERVICIO AS CANAL ON CANAL.SAMT_CAM_TIPO_SERVICIO_CSC = TKS.SAMT_CAM_TIPO_SERVICIO_CSC AND CANAL.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 1
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_CLIENTE') {
            query = `SELECT TBL.CLIENTE_NOMBRE AS NAME,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CLIENTES AS TBL ON TBL.CLIENTE_CSC = TKS.CLIENTE_CSC_SOLICITA AND TBL.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_CLIENTE_CERRADOS') {
            query = `SELECT TBL.CLIENTE_NOMBRE AS NAME,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CLIENTES AS TBL ON TBL.CLIENTE_CSC = TKS.CLIENTE_CSC_SOLICITA AND TBL.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 1
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_SERVICIO') {
            query = `SELECT REPLACE(TBL.PM_NOMBRE,'MESA DE AYUDA ','') AS NAME
            ,COALESCE(COUNT(*), 0) AS total_tickets
            FROM SAMT_PROYECTOS AS TBL 
            LEFT JOIN SAMT_TICKET_SERVICIO AS TKS
            ON TBL.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            AND TBL.PM_CSC_PROYECTO = TKS.PM_CSC_PROYECTO_SOLICITA
            WHERE TBL.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`
        }  
        else if (TIPODASHBOARD == 'ANUAL_SERVICIO_CERRADOS') {
            query = `SELECT REPLACE(TBL.PM_NOMBRE,'MESA DE AYUDA ','') AS NAME
            ,COALESCE(COUNT(*), 0) AS total_tickets
            FROM SAMT_PROYECTOS AS TBL 
            LEFT JOIN SAMT_TICKET_SERVICIO AS TKS
            ON TBL.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            AND TBL.PM_CSC_PROYECTO = TKS.PM_CSC_PROYECTO_SOLICITA
            WHERE TBL.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 1
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_SUBCAPANIA') {
            query = `SELECT SERV.CAM_SERVICIO_NOMBRE AS NAME,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_SERVICIO AS SERV ON SERV.CAM_CSC_SERVICIO = TKS.CAM_CSC_SERVICIO_SOLICITA 
            AND SERV.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}  
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`

        } 
        else if (TIPODASHBOARD == 'ANUAL_SUBCAMPANIA_CERRADOS') {
            query = `SELECT SERV.CAM_SERVICIO_NOMBRE AS NAME,COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_SERVICIO AS SERV ON SERV.CAM_CSC_SERVICIO = TKS.CAM_CSC_SERVICIO_SOLICITA 
            AND SERV.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST  = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TKS.TIC_FECHA_CIERRE,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            AND TIC_CERRADO = 1
            ${extraData}
            GROUP BY NAME
            ORDER BY total_tickets DESC;`
        } 
        else if (TIPODASHBOARD == 'ANUAL_T_EJECUCION') {
            query = `SELECT 
            CASE
                WHEN TIC_TIEMPO_EJECUCION >= 0 AND TIC_TIEMPO_EJECUCION <= 900 THEN '0 a 15 minutos'
                WHEN TIC_TIEMPO_EJECUCION > 900 AND TIC_TIEMPO_EJECUCION <= 1800 THEN '15 a 30 minutos'
                WHEN TIC_TIEMPO_EJECUCION > 1800 AND TIC_TIEMPO_EJECUCION <= 3600 THEN '31 a 1 hora'
                WHEN TIC_TIEMPO_EJECUCION > 3600 AND TIC_TIEMPO_EJECUCION <= 18000 THEN '1 a 5 horas'
                WHEN TIC_TIEMPO_EJECUCION > 18000 AND TIC_TIEMPO_EJECUCION <= 54000 THEN '5 a 15 horas'
                WHEN TIC_TIEMPO_EJECUCION > 54000 AND TIC_TIEMPO_EJECUCION <= 86400 THEN '15 a 24 horas'
                WHEN TIC_TIEMPO_EJECUCION > 86400 AND TIC_TIEMPO_EJECUCION <= 172800 THEN '1 a 2 días'
                WHEN TIC_TIEMPO_EJECUCION > 172800 AND TIC_TIEMPO_EJECUCION <= 345600 THEN '2 a 4 días'
                WHEN TIC_TIEMPO_EJECUCION > 345600 AND TIC_TIEMPO_EJECUCION <= 518400 THEN '4 a 6 días'
                WHEN TIC_TIEMPO_EJECUCION > 518400 AND TIC_TIEMPO_EJECUCION <= 691200 THEN '6 a 8 días'
                WHEN TIC_TIEMPO_EJECUCION > 691200 AND TIC_TIEMPO_EJECUCION <= 864000 THEN '8 a 10 días'
                WHEN TIC_TIEMPO_EJECUCION > 864000 AND TIC_TIEMPO_EJECUCION <= 1036800 THEN '10 a 12 días'
                WHEN TIC_TIEMPO_EJECUCION > 1036800 AND TIC_TIEMPO_EJECUCION <= 1209600 THEN '12 a 14 días'
                ELSE 'Más de 14 días'
            END AS NAME,
            COUNT(*) AS total_tickets
        FROM
            SAMT_TICKET_SERVICIO AS TKS
        WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}
            AND DATE_FORMAT(TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
            AND DATE_FORMAT(TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
            ${extraData}
            GROUP BY NAME
        ORDER BY MAX(TIC_TIEMPO_EJECUCION);`

        } 
        else if (TIPODASHBOARD == 'ANUAL_T_EJECUCION_CERRADOS') {
            query = `SELECT
            CASE
                WHEN duration_seconds >= 0 AND duration_seconds <= 900 THEN '0 a 15 minutos'
                WHEN duration_seconds > 900 AND duration_seconds <= 1800 THEN '15 a 30 minutos'
                WHEN duration_seconds > 1800 AND duration_seconds <= 3600 THEN '31 a 1 hora'
                WHEN duration_seconds > 3600 AND duration_seconds <= 18000 THEN '1 a 5 horas'
                WHEN duration_seconds > 18000 AND duration_seconds <= 54000 THEN '5 a 15 horas'
                WHEN duration_seconds > 54000 AND duration_seconds <= 86400 THEN '15 a 24 horas'
                WHEN duration_seconds > 86400 AND duration_seconds <= 172800 THEN '1 a 2 días'
                WHEN duration_seconds > 172800 AND duration_seconds <= 345600 THEN '2 a 4 días'
                WHEN duration_seconds > 345600 AND duration_seconds <= 518400 THEN '4 a 6 días'
                WHEN duration_seconds > 518400 AND duration_seconds <= 691200 THEN '6 a 8 días'
                WHEN duration_seconds > 691200 AND duration_seconds <= 864000 THEN '8 a 10 días'
                WHEN duration_seconds > 864000 AND duration_seconds <= 1036800 THEN '10 a 12 días'
                WHEN duration_seconds > 1036800 AND duration_seconds <= 1209600 THEN '12 a 14 días'
                ELSE 'Más de 14 días'
            END AS NAME,
            COUNT(*) * -1 AS total_tickets
            FROM
            (SELECT TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, TIC_FECHA_CIERRE) AS duration_seconds
                FROM SAMT_TICKET_SERVICIO AS TKS where EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                ${extraData}
                AND DATE_FORMAT(TIC_FECHA_CIERRE,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TIC_FECHA_CIERRE,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                AND TIC_CERRADO = 1) AS ticket_durations
                GROUP BY NAME
            ORDER BY MAX(duration_seconds);`
        } 
        else if (TIPODASHBOARD == 'ANUAL_VENCIMIENTO_ABIERTAS') {
            query = `SELECT CASE
            WHEN TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, ${__Request_Pool.escape(FECHA_CONSULTA)}) > TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, TIC_FECHA_PROMESA) THEN 'Vencidas'
            ELSE 'En Tiempo'
            END AS VENCIMIENTO,
            COUNT(*) AS total_tickets
            FROM SAMT_TICKET_SERVICIO AS TKS where EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)}
            AND TIC_CERRADO = 0
            ${extraData}
            GROUP BY VENCIMIENTO;`
        }
        else if (TIPODASHBOARD == 'ANUAL_RANGO_VECIDAS') {
            query = `SELECT 
            CASE
                WHEN t_vencido >= 0 AND t_vencido <= 900 THEN '0 a 15 minutos'
                WHEN t_vencido > 900 AND t_vencido <= 1800 THEN '0 a 30 minutos'
                WHEN t_vencido > 1800 AND t_vencido <= 3600 THEN '31 a 1 hora'
                WHEN t_vencido > 3600 AND t_vencido <= 18000 THEN '1 a 5 horas'
                WHEN t_vencido > 18000 AND t_vencido <= 54000 THEN '5 a 15 horas'
                WHEN t_vencido > 54000 AND t_vencido <= 86400 THEN '15 a 24 horas'
                WHEN t_vencido > 86400 AND t_vencido <= 172800 THEN '1 a 2 días'
                ELSE 'Más de 2 días'
            END AS NAME,
                COUNT(*) AS total_tickets
            FROM
            (SELECT TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, ${__Request_Pool.escape(FECHA_CONSULTA)})  AS t_vencido
            FROM SAMT_TICKET_SERVICIO AS TKS WHERE EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TIC_CERRADO = 0
            ${extraData}
            AND TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, ${__Request_Pool.escape(FECHA_CONSULTA)}) > TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, TIC_FECHA_PROMESA) = 1) as tk_ve
            GROUP BY NAME;`
        }
        else if (TIPODASHBOARD == 'ANUAL_VECNIDAS_MESA') {
            query = `SELECT NMMESA AS NAME,COUNT(*) AS total_tickets
            FROM (SELECT MS.CAM_MESA_IDIOMA1 AS NMMESA,TIMESTAMPDIFF(SECOND, TKS.TIC_FECHA_ALTA, ${__Request_Pool.escape(FECHA_CONSULTA)})  AS t_vencido
            FROM SAMT_TICKET_SERVICIO AS TKS INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 0 
            ${extraData}
            AND TIMESTAMPDIFF(SECOND, TKS.TIC_FECHA_ALTA, ${__Request_Pool.escape(FECHA_CONSULTA)}) > TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, TIC_FECHA_PROMESA) = 1) as tk_ve GROUP BY NAME;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ABIERTOS_MESA') {
            query = `SELECT MS.CAM_MESA_IDIOMA1 AS NAME,COUNT(*) AS total_tickets FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 0 
            ${extraData}
            group by NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ABIERTOS_MESA_SIN_ASIGNAR') {
            query = `SELECT MS.CAM_MESA_IDIOMA1 AS NAME,COUNT(*) AS total_tickets FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 0 
            AND TKS.EMPLEADO_CSC_ATIENDE IS NULL 
            ${extraData}
            group by NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ABIERTOS_MESA_ASIGNADOS') {
            query = `SELECT MS.CAM_MESA_IDIOMA1 AS NAME,COUNT(*) AS total_tickets FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 0 
            AND TKS.EMPLEADO_CSC_ATIENDE IS NOT NULL 
            ${extraData}
            group by NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ABIERTOS_MESA_ASIGNADOS') {
            query = `SELECT MS.CAM_MESA_IDIOMA1 AS NAME,COUNT(*) AS total_tickets FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 0 
            AND TKS.EMPLEADO_CSC_ATIENDE IS NOT NULL 
            ${extraData}
            group by NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ABIERTOS_MESA_HOY') {
            query = `SELECT MS.CAM_MESA_IDIOMA1 AS NAME,COUNT(*) AS total_tickets FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 0 
            AND DATE_FORMAT(CONVERT_TZ(TKS.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') = ${__Request_Pool.escape(req.query.FECHA_CONSULTA)} 
            ${extraData}
            group by NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ABIERTOS_TODO_SSDIAS') {
            query = `SELECT MS.CAM_MESA_IDIOMA1 AS NAME,COUNT(*) AS total_tickets FROM SAMT_TICKET_SERVICIO AS TKS
            INNER JOIN SAMT_CAM_MESA_DE_AYUDA AS MS ON MS.CAM_MESA_CSC = TKS.CAM_MESA_CSC AND MS.EMP_CSC_EMPRESA_HOST = TKS.EMP_CSC_EMPRESA_HOST
            WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} AND TKS.TIC_CERRADO = 1
            AND DATE_FORMAT(CONVERT_TZ(TKS.TIC_FECHA_ALTA,'${req.query.TimeZoneServer}','${req.query.TimeZoneCliente}'),'%Y-%m-%d') >= ${__Request_Pool.escape(req.query.FECHA_CONSULTA)} 
            ${extraData}
            group by NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_SERVERIDAD') {
            query = `SELECT SAMT_TIPO_SEVERIDAD.TIPO_SEVERIDAD_TICKET_IDIOMA1 AS NAME
                ,COUNT(*) AS total_tickets
                FROM SAMT_TICKET_SERVICIO AS TKS
                LEFT JOIN SAMT_TIPO_SEVERIDAD
                ON  TKS.TIPO_SEVERIDAD_CSC = SAMT_TIPO_SEVERIDAD.TIPO_SEVERIDAD_CSC
                WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                ${extraData}
                GROUP BY NAME, SAMT_TIPO_SEVERIDAD.TIPO_SEVERIDAD_TICKET_ORDEN
                ORDER BY SAMT_TIPO_SEVERIDAD.TIPO_SEVERIDAD_TICKET_ORDEN ASC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_PRIORIDAD') {
            query = `SELECT TBL.TIPO_PRIORIDAD_REPORTE AS NAME
                ,COUNT(*) AS total_tickets
                FROM SAMT_TICKET_SERVICIO AS TKS
                LEFT JOIN SAMT_TIPO_PRIORIDAD_TICKET AS TBL
                ON  TKS.TIPO_PRIORIDAD_CSC = TBL.TIPO_PRIORIDAD_CSC
                WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                ${extraData}
                GROUP BY NAME
                ORDER BY NAME ASC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_ESTATUS') {
            query = `SELECT
                SAMT_ESTATUS_TICKET.ESTATUS_TICKET_REPORTE AS NAME
                ,COUNT(*) AS total_tickets
                FROM SAMT_TICKET_SERVICIO AS TKS
                LEFT JOIN SAMT_ESTATUS_TICKET
                ON TKS.ESTATUS_TICKET_CSC = SAMT_ESTATUS_TICKET.ESTATUS_TICKET_CSC
                WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                ${extraData}
                GROUP BY NAME
                ORDER BY total_tickets ASC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_TIPO_TICKET') {
            query = `SELECT TBL.TIPO_TICKET_REPORTE AS NAME
                ,COUNT(*) AS total_tickets
                FROM SAMT_TICKET_SERVICIO AS TKS
                LEFT JOIN SAMT_TIPO_TICKET AS TBL
                ON TKS.TIPO_TICKET_CSC = TBL.TIPO_TICKET_CSC
                WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                ${extraData}
                GROUP BY NAME
                ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'CUMPLIMIENTO_LSA') {
            query = `SELECT 
                        CASE 
                                WHEN TIC_TIEMPO_EJECUCION > TIMESTAMPDIFF(SECOND,TIC_FECHA_ALTA,IFNULL(TIC_FECHA_CIERRE,NOW())) AND TIC_CERRADO = 1 THEN 'Resuelto en Tiempo'
                                WHEN TIC_TIEMPO_EJECUCION < TIMESTAMPDIFF(SECOND,TIC_FECHA_ALTA,IFNULL(TIC_FECHA_CIERRE,NOW())) AND TIC_CERRADO = 1 THEN 'Resuelto fuera de SLA'
                                WHEN TIC_TIEMPO_EJECUCION > TIMESTAMPDIFF(SECOND,TIC_FECHA_ALTA,IFNULL(TIC_FECHA_CIERRE,NOW())) AND TIC_CERRADO = 0 THEN 'Vencido'
                                WHEN TIC_TIEMPO_EJECUCION < TIMESTAMPDIFF(SECOND,TIC_FECHA_ALTA,IFNULL(TIC_FECHA_CIERRE,NOW())) AND TIC_CERRADO = 0 THEN 'En Tiempo'
                                ELSE 'Sin Estatus' END AS NAME
                        ,COUNT(*) AS total_tickets
                    FROM SAMT_TICKET_SERVICIO AS TKS
                    WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                    AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                    AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                    ${extraData}
                    GROUP BY NAME ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'ANUAL_TIPIFICA') {
            query = `SELECT
                TIPI.TIPIFICA_IDIOMA1 AS NAME
                ,COUNT(*) AS total_tickets
                FROM SAMT_TICKET_SERVICIO AS TKS
                LEFT JOIN SAMT_CAM_TIPIFICACIONES AS TIPI
                ON TKS.EMP_CSC_EMPRESA_HOST = TIPI.EMP_CSC_EMPRESA_HOST
                AND TKS.TIPIFICA_CSC = TIPI.TIPIFICA_CSC
                WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                ${extraData}
                GROUP BY NAME
                ORDER BY total_tickets DESC;`
        }
        else if (TIPODASHBOARD == 'DURACION_HORAS') {
            query = `SELECT CASE WHEN 
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0) <= 360 THEN '1 A 6 HORAS'
            
                WHEN 
                
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0) > 360 AND
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0) <= 720
                THEN '6 A 12 HORAS'
            
                WHEN 
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0) > 720
                AND 
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0)  <= 1080
                THEN '12 A 18 HORAS'
                
                WHEN 
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0) > 1080
                AND 
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0)  <= 1440
                THEN '18 A 24 HORAS'
                
                WHEN 
                COALESCE((
                SELECT  SUM(TIMESTAMPDIFF(MINUTE, tl.LOG_FECHA_HORA, CASE WHEN tl.LOG_FECHA_HORA_FIN IS NULL AND TKS.TIC_FECHA_CIERRE IS NULL THEN NOW() ELSE tl.LOG_FECHA_HORA_FIN END)) 
                FROM SAMT_TICKET_LOG_SLA tl 
                WHERE tl.ACTION_STATUS = 'resume' 
                AND tl.TIC_NEWID = TKS.TIC_NEWID 
                GROUP BY tl.TIC_NEWID
                ),0) > 1440
                
                THEN 'MAS 24 HORAS'
                END AS NAME
                ,COUNT(*) AS total_tickets
                FROM SAMT_TICKET_SERVICIO AS TKS
                WHERE TKS.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(EMP_CSC_EMPRESA_HOST)} 
                AND TKS.TIC_CERRADO = 1 
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') >= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)} - INTERVAL 1 YEAR, '%Y-%m-01')
                AND DATE_FORMAT(TKS.TIC_FECHA_ALTA,'%Y-%m-%d') <= DATE_FORMAT(${__Request_Pool.escape(FECHA_CONSULTA)}, '%Y-%m-%d')
                ${extraData}
                GROUP BY NAME
                ORDER BY NAME ASC;`
                    
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

exports.Update_Autoriza_Ticket = async (req,res) => {

    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var query = "UPDATE SAMT_TICKET_AUTORIZACIONES " + recordFunction.Recorre_Record(req.body.DATA_UPDATE,"UPDATE") +" WHERE " + recordFunction.Recorre_Record(req.body.DATA_WHERE,"WHERE") +"; ";
        __Request_Pool.query(query, function(error, resultReturn){
            if (error) {
                ResultData = {success: false,message: error.message};
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

exports.Insert_Emp_Ticket = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_EMPLEADOS SET ?";
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

exports.Get_Emp_Ticket = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `select L_TK_EMP.*, EMPL.EMPLEADO_ID_EXTERNO, CONCAT(EMPL.EMPLEADO_NOMBREEMPLEADO, ' ',EMPL.EMPLEADO_APATERNOEMPLEADO, ' ',EMPL.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE from SAMT_TICKET_EMPLEADOS AS L_TK_EMP
        INNER JOIN SAMT_EMPLEADOS AS EMPL ON EMPL.EMPLEADO_CSC_EMPLEADO = L_TK_EMP.EMPLEADO_CSC_EMPLEADO AND EMPL.EMP_CSC_EMPRESA_HOST = L_TK_EMP.EMP_CSC_EMPRESA_HOST 
        WHERE L_TK_EMP.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)}
        AND L_TK_EMP.TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)};`
        
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

exports.Insert_Eq_Tkt = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "CALL InsertaRegistrosEquipamiento(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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

exports.Insert_msj_ticket_file = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_MENSAJE_FILE SET ?";
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

exports.Get_Respuesta_Mensaje_Files = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = "SELECT * FROM SAMT_TICKET_MENSAJE_FILE WHERE EMP_CSC_EMPRESA_HOST = "+__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST) +" AND TICKET_MENSAJE_NEWID = "+__Request_Pool.escape(req.query.TICKET_MENSAJE_NEWID);

        query += " ORDER BY TICKET_MENSAJE_NEWID DESC;--";
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
function cleanKey(key) {
    // Quitamos caracteres especiales y espacios con una expresión regular
    return key.replace(/[^\w]/g, '');
  }
exports.Insert_Emp_Ticket_StoreProcedure = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")

        const cleanedItem = {};
        for (const key in __RecorreDatos) {
            if (__RecorreDatos.hasOwnProperty(key)) {
            const cleanedKey = cleanKey(key);
            cleanedItem[cleanedKey] = __RecorreDatos[key];
            }
        }
        // Obtener el valor actual de la key "MarqueconunaXsiesunmando"
        let Valor_Sexo_HM = cleanedItem.SexoHM;

        // Verificar si el valor contiene la letra 'x'
        if (Valor_Sexo_HM == 1) {
            // Reemplazar el valor por 1 si la letra 'x' está presente
            cleanedItem.SexoHM = 'H';
        } else if (Valor_Sexo_HM == 2) {
            // Reemplazar el valor por 0 si está vacío
            cleanedItem.SexoHM = 'M';
        }
        
        var query = "CALL InsertaTicketEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        __Request_Pool.query(query, [cleanedItem.EMP_CSC_EMPRESA_HOST,
            cleanedItem.NoEmpleado,
            cleanedItem.Nombre,
            cleanedItem.Correo,
            cleanedItem.Telefono,
            cleanedItem.SexoHM,
            cleanedItem.TickNewid,
            cleanedItem.MarqueconunaXsiesunmando,
            cleanedItem.NoOficio,
            cleanedItem.RequierePermiso
        ],function(error, resultReturn){
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

exports.Delete_Empleado_Ticket = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type);
        var query = `DELETE FROM SAMT_TICKET_EMPLEADOS WHERE (EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.body.EMP_CSC_EMPRESA_HOST)}) and (TIC_NEWID = ${__Request_Pool.escape(req.body.TIC_NEWID)}) and (EMPLEADO_CSC_EMPLEADO = ${__Request_Pool.escape(req.body.EMPLEADO_CSC_EMPLEADO)});`

        
        __Request_Pool.query(query,function(error, resultReturn){
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

exports.Get_Edificios = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        if (req.query.TIPO_CONSULTA == 'CMBBOX') {
            query = `SELECT ID_EDIFICO, EDIFICIO_NOMBRE FROM SPF_EDIFICIOS;`;    
        }
        else if(req.query.TIPO_CONSULTA == 'VERIFICAEXITE'){
            query = `
            SELECT * FROM SPF_EDIFICIOS
            WHERE REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE(EDIFICIO_NOMBRE, ' ', '') , 'á', 'a' ), 'é', 'e' ), 'í', 'i' ), 'ó', 'o' ), 'ú', 'u' ), 'Á', 'A' ), 'É', 'E' ), 'Í', 'I' ), 'Ó', 'O' ), 'Ú', 'U' ), 'ñ', 'n' ), 'Ñ', 'N' ) = REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE( REPLACE(${__Request_Pool.escape(req.query.EDIFICIO_NOMBRE)},' ','') , 'á', 'a' ), 'é', 'e' ), 'í', 'i' ), 'ó', 'o' ), 'ú', 'u' ), 'Á', 'A' ), 'É', 'E' ), 'Í', 'I' ), 'Ó', 'O' ), 'Ú', 'U' ), 'ñ', 'n' ), 'Ñ', 'N' ) 
            AND EDIFICO_ESTDO = ${__Request_Pool.escape(req.query.EDIFICO_ESTDO)}
            AND EDIFICO_MUNICIPIO = ${__Request_Pool.escape(req.query.EDIFICO_MUNICIPIO)}
            AND EDIFICO_COLONIA = ${__Request_Pool.escape(req.query.EDIFICO_COLONIA)} `;
        }
        else {
            query = `SELECT EDIF.*
            ,SAMT_ESTADOS.EDO_DESCESTADO AS ESTADO_DESC
            ,SAMT_MUNICIPIOS.MPO_DESCMUNICIPIO AS MUNICIPIO_DESC
            ,SAMT_COLONIAS.COL_DESCCOLONIA AS COLONIA_DESC
            FROM SPF_EDIFICIOS AS EDIF
            LEFT JOIN dna_address.SAMT_ESTADOS
            ON EDIF.EDIFICO_ESTDO = SAMT_ESTADOS.EDO_CSCESTADO
            LEFT JOIN dna_address.SAMT_MUNICIPIOS
            ON EDIF.EDIFICO_MUNICIPIO = SAMT_MUNICIPIOS.MPO_CSCMUNICIPIO
            LEFT JOIN dna_address.SAMT_COLONIAS
            ON EDIF.EDIFICO_COLONIA = SAMT_COLONIAS.COL_CSCCOLONIA
            WHERE EDIF.EDIFICO_ESTDO = ${__Request_Pool.escape(req.query.EDO_DESCESTADO)} `;

            if(req.query.ID_EDIFICO){
                query += ` AND  EDIF.ID_EDIFICO = ${__Request_Pool.escape(req.query.ID_EDIFICO)} `;    
            }

            query += `ORDER BY EDIFICIO_NOMBRE ASC;`;    
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

exports.Insert_Edificio_Servicio = async (req, res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA, req.body.Type);
        var __RecorreDatos = recordFunction.Recorre_Record(req.body.DATA_INSERT, "INSERT")
        var query = "INSERT INTO SPF_EDIFICIOS  SET ?";
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

exports.Get_Ticket_Part = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `SELECT TK_PARTICIPANTE.TIC_NEWID, TK_PARTICIPANTE.EMPLEADO_CSC_EMPLEADO, TK_PARTICIPANTE.EMPLEADO_TELEFONO_NOTIFICA, TK_PARTICIPANTE.EMPLEADO_EMAIL_NOTIFICA, TK_PARTICIPANTE.TIPO_PARTICIPANTE_CSC,
        CONCAT(EMPLEADO.EMPLEADO_APATERNOEMPLEADO,' ',EMPLEADO.EMPLEADO_AMATERNOEMPLEADO,' ',EMPLEADO.EMPLEADO_NOMBREEMPLEADO) AS NOMBRE_EMPLEADO
        FROM SAMT_TICKET_PARTICIPANTES AS TK_PARTICIPANTE
        INNER JOIN SAMT_EMPLEADOS AS EMPLEADO ON EMPLEADO.EMPLEADO_CSC_EMPLEADO = TK_PARTICIPANTE.EMPLEADO_CSC_EMPLEADO AND EMPLEADO.EMP_CSC_EMPRESA_HOST = TK_PARTICIPANTE.EMP_CSC_EMPRESA_HOST 
        WHERE TK_PARTICIPANTE.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)} 
        AND TK_PARTICIPANTE.TIC_NEWID  = ${__Request_Pool.escape(req.query.TIC_NEWID )}  
        AND TK_PARTICIPANTE.TIPO_PARTICIPANTE_CSC IN (${req.query.TIPO_PARTICIPANTE_CSC_IN});`;    
        
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
};

exports.Get_Requisicion_Empleados_Inmuebles = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `SELECT REQ_CSCREQUISICION FROM SAMT_SEG_EMPRES_SUBMENU_INMUEBLE 
        WHERE EMP_CSC_EMPRESA_HOST= ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST )}  
        AND USU_CSC_USUARIO=${__Request_Pool.escape(req.query.USU_CSC_USUARIO )};`;    
       
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
};

exports.Get_Tipificaciones_By_Proy = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `SELECT * FROM SAMT_CAM_TIPIFICACIONES 
        WHERE CAT_TIPO_TIPIFICA_CSC =  ${__Request_Pool.escape(req.query.CAT_TIPO_TIPIFICA_CSC )}  
        AND EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST )}`;    

        if (req.query.TIPIFCA_ACTIVO) {
            query += ` AND TIPIFCA_ACTIVO = ${__Request_Pool.escape(req.query.TIPIFCA_ACTIVO)}`;
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
};

exports.Insert_Equipo_Ticket = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_EQUIPOS SET ?";
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


exports.Get_Activos_TicketSg = async (req, res) => {
    try {
        let query = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA,req.query.Type); 

        query = `
        
            SELECT ste.*
            ,samteq.REQ_CSCREQUISICION
            ,samteq.CSC_PROVEDOR_EQUIPO
            ,samteq.CSC_TIPO_EQUIPO
            ,samteq.EQUIPAMIENTO_MODELO
            ,samteq.EQUIPAMIENTO_CODBARRAS
            ,samteq.EQUIPAMIENTO_REFERENCIA
            ,samteq.EQUIPAMIENTO_NO_SERIE
            ,samteq.EQUIPAMIENTO_NO_PARTE
            ,samteq.EQUIPAMIENTO_NO_INVENTARIO
            FROM SAMT_TICKET_EQUIPOS as ste 
            INNER JOIN SAMT_EQUIPO as samteq ON samteq.EQUIPAMIENTO_NEWID = ste.EQUIPAMIENTO_NEWID and samteq.EMP_CSC_EMPRESA_HOST  = ste.EMP_CSC_EMPRESA_HOST 
            WHERE ste.TIC_NEWID = ${__Request_Pool.escape(req.query.TIC_NEWID)}
            AND ste.EMP_CSC_EMPRESA_HOST = ${__Request_Pool.escape(req.query.EMP_CSC_EMPRESA_HOST)};`
        
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

exports.UpdateLogSla = async (req,res) => {

    try {
        let __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        
        let query = `UPDATE SAMT_TICKET_LOG_SLA SET LOG_FECHA_HORA_FIN=CURRENT_TIMESTAMP WHERE TIC_NEWID='${req.body.TIC_NEWID}' AND LOG_FECHA_HORA_FIN IS NULL;`;
         
        __Request_Pool.query(query, function(error, resultReturn){
            if (error) {
                ResultData = {success: false,message: error.message};
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
            else{
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = {success: false,message: 'No Data Get'};
                    res.status(200);
                    res.send(ResultData);
                    
                } else {
                    ResultData = {success: true,message: 'Updated',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId};
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


exports.Insert_DataSiadecon = async (req,res) => {
    try {
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_DATOS_SIADECONSRV SET ?";
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

exports.Get_Reporte_Ticket = async (req, res) => {
    try {
        let query = null;
        let __Request_Pool = dbConfig.Get_Db_conexion(req.query.EMP_CLV_EMPRESA, req.query.Type);


        let fechaInicio = null;
        let fechaFin = null;
        let estatus = null;
        let severidad = null;
        let prioridad = null;


        if (req.query.TIC_FECHA_INICIAL === 'NULL') {
            fechaInicio = 'NULL';
        } else {
            fechaInicio = __Request_Pool.escape(req.query.TIC_FECHA_INICIAL);
        }

        if (req.query.TIC_FECHA_FINAL === 'NULL') {
            fechaFin = 'NULL';
        } else {
            fechaFin = __Request_Pool.escape(req.query.TIC_FECHA_FINAL);
        }

        if (req.query.ESTATUS_TICKET === 'NULL') {
            estatus = 'NULL';
        } else {
            estatus = __Request_Pool.escape(req.query.ESTATUS_TICKET);
        }

        if (req.query.TIPO_SEVERIDAD === 'NULL') {
            severidad = 'NULL';
        } else {
            severidad = __Request_Pool.escape(req.query.TIPO_SEVERIDAD);
        }

        if (req.query.TIPO_PRIORIDAD === 'NULL') {
            prioridad = 'NULL';
        } else {
            prioridad = __Request_Pool.escape(req.query.TIPO_PRIORIDAD);
        }


        query = `call sp_reporte_tickets(
            ${req.query.EMP_CSC_EMPRESA_HOST}
            ,${req.query.CAM_MESA_CSC}
            ,${req.query.TIC_CERRADO}
            ,${req.query.TIC_CSCTICKET}
            ,${estatus}
            ,${severidad}
            ,${prioridad}
            ,${fechaInicio}
            ,${fechaFin});`;


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
                    ResultData = { success: true, message: 'Success Data Get', count: resultReturn[0].length, JsonData: resultReturn[0] };
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


exports.uploadImagesTicketUninetCosci = async (req,res) => {
    try {
        var resultadoApiProvider = null;
        let ResultData = {};
        const dataInsertMS = { ...req.body }; // Copia superficial
        const dataBodyToSend = {};
        dataBodyToSend.EMP_CLV_EMPRESA = req.body.EMP_CLV_EMPRESA;
        dataBodyToSend.EMP_CSC_EMPRESA_HOST = req.body.EMP_CSC_EMPRESA_HOST;
        dataBodyToSend.Type = req.body.Type;

        (async () => {
            resultadoApiProvider = await uploadImagesTicketUninetCosci(req.body);
            if (resultadoApiProvider.isSuccessProvider == false) {
                ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
            } else{
                ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1, ResProvider: resultadoApiProvider};
            }
            res.status(200);
            res.send(ResultData);
        })();

    } catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.uploadImagesTicketUninetWlanEndPoint = async (req,res) => {
    try {
        var resultadoApiProvider = null;
        let ResultData = {};
        const dataInsertMS = { ...req.body }; // Copia superficial
        const dataBodyToSend = {};
        dataBodyToSend.EMP_CLV_EMPRESA = req.body.EMP_CLV_EMPRESA;
        dataBodyToSend.EMP_CSC_EMPRESA_HOST = req.body.EMP_CSC_EMPRESA_HOST;
        dataBodyToSend.Type = req.body.Type;

        (async () => {
            resultadoApiProvider = await uploadImagesTicketUninetWlan(req.body);
            if (resultadoApiProvider.isSuccessProvider == false) {
                ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
            } else{
                ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1, ResProvider: resultadoApiProvider};
            }
            res.status(200);
            res.send(ResultData);
        })();

    } catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};

exports.uploadFilesTicketAsNice = async (req,res) => {
    try {
        var resultadoApiProvider = null;
        let ResultData = {};
        const dataInsertMS = { ...req.body }; // Copia superficial
        const dataBodyToSend = {};
        dataBodyToSend.EMP_CLV_EMPRESA = req.body.EMP_CLV_EMPRESA;
        dataBodyToSend.EMP_CSC_EMPRESA_HOST = req.body.EMP_CSC_EMPRESA_HOST;
        dataBodyToSend.Type = req.body.Type;

        (async () => {
            resultadoApiProvider = await uploadFilesASNICE(req.body);
            if (resultadoApiProvider.isSuccessProvider == false) {
                ResultData = {success: false,message: `Comunicación con proveedor ${resultadoApiProvider.providerName} no exitosa: EstatusCode: ${resultadoApiProvider.statusCode}`,count: 0,JsonData: {}, ResProvider: resultadoApiProvider};
            } else{
                ResultData = {success: true,message: `Exito en consumo con proveedor`,count: 1, ResProvider: resultadoApiProvider};
            }
            res.status(200);
            res.send(ResultData);
        })();

    } catch (error) {
        ResultData = {success: false,message: error.message};
        res.status(500);
        res.send(ResultData);
        console.log(error);
    }
};
