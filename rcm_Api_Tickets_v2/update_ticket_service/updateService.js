const dbConfig = require('../../__utilitis/config.db.mysql');
const recordFunction = require('../../__utilitis/record.function');

async function updateANAMTicketIdExterno(idExterno, TIC_NEWID, clveEmpresa, TipoConexion) {

    try {
        var ResultData = null;
        const query = `UPDATE SAMT_TICKET_SERVICIO SET TIC_ID_EXTERNO_PROVEEDOR='${idExterno}' WHERE TIC_NEWID='${TIC_NEWID}';`;
        var __Request_Pool = dbConfig.Get_Db_conexion(clveEmpresa,TipoConexion); 

        __Request_Pool.query(query, function(error, resultReturn){
            if (error) {
                console.log(error);        
                ResultData = {success: false,message: error.message};
                return ResultData;
            } else{
                if (resultReturn.affectedRows[0] === 0) {
                    ResultData = {success: false,message: 'Ticket no actualizado'};
                    return ResultData;
                } else {
                    ResultData = {success: true,message: 'Ticket actualizado'};
                    return ResultData;
                }
            }
        });
    } catch (error) {
        ResultData = {success: false,message: error.message};
        return ResultData;
    }
    
}

async function insertaTicketMesaCentral(dataInsert,dataBody) {
    
    try {
        var ResultData = null;
        const query = `INSERT INTO SAMT_TICKET_SERVICIO SET ?;`;
        var __Request_Pool = dbConfig.Get_Db_conexion(dataBody.EMP_CLV_EMPRESA,dataBody.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(dataInsert,"INSERT")

        return new Promise((resolve, reject) => {
            __Request_Pool.query(query, __RecorreDatos, (error, resultReturn) => {
                if (error) {
                    console.error(error);
                    return reject({ success: false, message: error.message });
                } 

                if (resultReturn.affectedRows === 0) {
                    return reject({ success: false, message: 'Ticket no insertado en mesa central' });
                } 
                
                resolve({ success: true, message: 'Ticket insertado en mesa central', idTicketInsert: resultReturn.insertId});
            });
        });

    } catch (error) {
        ResultData = {success: false,message: error.message};
        return ResultData;
    }
    
}

async function insertaLogErrorProveedor(dataInsert,dataBody) {
    
    try {
        var ResultData = null;
        const query = `INSERT INTO SAMT_LOGS_API_ERROR SET ?;`;
        var __Request_Pool = dbConfig.Get_Db_conexion(dataBody.EMP_CLV_EMPRESA,dataBody.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(dataInsert,"INSERT")

        return new Promise((resolve, reject) => {
            __Request_Pool.query(query, __RecorreDatos, (error, resultReturn) => {
                if (error) {
                    console.error(error);
                    return reject({ success: false, message: error.message });
                } 

                if (resultReturn.affectedRows === 0) {
                    return reject({ success: false, message: 'Log no insertado' });
                } 
                
                resolve({ success: true, message: 'Log insertado', idTicketInsert: resultReturn.insertId});
            });
        });

    } catch (error) {
        ResultData = {success: false,message: error.message};
        return ResultData;
    }
    
}


// Exportar la función
module.exports = {updateANAMTicketIdExterno, insertaTicketMesaCentral, insertaLogErrorProveedor};



/*exports.Insert_Ticket_Servicio = async (req,res) => {
    try {
        var resultadoApiProvider = null;
        var __Request_Pool = dbConfig.Get_Db_conexion(req.body.EMP_CLV_EMPRESA,req.body.Type); 
        var __RecorreDatos =  recordFunction.Recorre_Record(req.body.DATA_INSERT,"INSERT")
        var query = "INSERT INTO SAMT_TICKET_SERVICIO SET ?";
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
                    console.log(req.body.DATA_INSERT.CAM_CSC_SERVICIO_SOLICITA);
                    switch (req.body.DATA_INSERT.CAM_CSC_SERVICIO_SOLICITA) {
                        
                        case 2: //COVECA 2
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
                        break;

                        case 5: //COSCD 2
                            (async () => {
                                resultadoApiProvider = await reqServiceCOSCD(req.body.DATA_INSERT);
                                if (resultadoApiProvider) {
                                    console.log(resultadoApiProvider.data);
                                } else {
                                    console.log(resultadoApiProvider);
                                }
                                ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                res.status(200);
                                res.send(ResultData);
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
                                    console.log(resultadoApiProvider.errorDetail.message.message);
                                    
                                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                } else{
                                    let resultProviderDataParse = resultadoApiProvider.Detail.message.folio_ticket;
                                    let bodyReqData = req.body.DATA_INSERT;
                                    let resUpdateTicetExterno = await updateANAMTicketIdExterno(resultProviderDataParse,bodyReqData.TIC_NEWID,req.body.EMP_CLV_EMPRESA,req.body.Type);
                                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider, resUpdateTikExterno: resUpdateTicetExterno };
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
                                ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                res.status(200);
                                res.send(ResultData);
                            })();
                        break;

                        case 3: //COSISI
                            (async () => {

                                console.log(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString);
                                
                                if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "INCIDENTE"){
                                    resultadoApiProvider = await reqServiceCOSISI(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                                } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "ALTA"){
                                    resultadoApiProvider = await createAltaCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                                } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "BAJA"){
                                    resultadoApiProvider = await createBajaCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                                } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "CAMBIO"){
                                    resultadoApiProvider = await createCambioCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                                } else if(req.body.DATA_STRINGS_PROVIDERS.TipoIncidenteString == "REQUERIMIENTO DE SERVICIO"){
                                    resultadoApiProvider = await createRequerimientoCosisi(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                                }
                                
                                
                                if (resultadoApiProvider) {
                                    console.log(resultadoApiProvider);
                                } else {
                                    console.log(resultadoApiProvider);
                                }

                                if (resultadoApiProvider.isSuccessProvider == false) {
                                    console.log(resultadoApiProvider.errorDetail.message.message);
                                    
                                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                } else{
                                    let resultProviderDataParse = resultadoApiProvider.Detail.message.folio_ticket;
                                    let bodyReqData = req.body.DATA_INSERT;
                                    let resUpdateTicetExterno = await updateANAMTicketIdExterno(resultProviderDataParse,bodyReqData.TIC_NEWID,req.body.EMP_CLV_EMPRESA,req.body.Type);
                                    ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider, resUpdateTikExterno: resUpdateTicetExterno };
                                }
                                
                                res.status(200);
                                res.send(ResultData);

                                // resultadoApiProvider = await reqServiceCOSISI(req.body.DATA_INSERT,req.body.DATA_STRINGS_PROVIDERS);
                                // if (resultadoApiProvider) {
                                //     console.log(resultadoApiProvider);
                                // } else {
                                //     console.log(resultadoApiProvider);
                                // }
                                // ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                                // res.status(200);
                                // res.send(ResultData);
                            })();
                        break;
                    
                        default:
                            ResultData = {success: true,message: 'Success Data Insert',count: resultReturn.affectedRows[0],JsonData: resultReturn.insertId, ResProvider: resultadoApiProvider};
                            res.status(200);
                            res.send(ResultData);
                        break;
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
};*/