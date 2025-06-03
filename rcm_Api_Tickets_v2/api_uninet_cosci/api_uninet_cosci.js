const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });
const xml2js = require('xml2js');
const { consumirApi_Soap } = require('../../__utilitis/apiConsumer');
const url_Provider = process.env.UNINET_COSCI_URL;
const username = process.env.UNINET_COSCI_USERNAME;
const password = process.env.UNINET_COSCI_PASSWORD;

async function createTicketUninetCosci(data = null, stringsData = null,DataImages = null) {
    let attachmensDataInstance = null;
    if (DataImages == null) {
        attachmensDataInstance == null
    } else {
        let attachmensData = DataImages;
    
        let dataJsonUpload = "";
        for(let i =0; i<attachmensData.length; i++) {
            let filetoBaseConvert = attachmensData[i];
            dataJsonUpload += `<com:attachment xmime:contentType="${filetoBaseConvert.AttachmenType}" action="add" name="${filetoBaseConvert.AttachmenName}" type="IMAGE" attachmentType="INLINE">${filetoBaseConvert.AttachmenBlob}</com:attachment>`;
        }        
        attachmensDataInstance = `<ns:attachments>${dataJsonUpload}</ns:attachments>`;
    }
    
    const xmlRequest = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://schemas.hp.com/SM/7" xmlns:com="http://schemas.hp.com/SM/7/Common" xmlns:xmime="http://www.w3.org/2005/05/xmlmime">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:CreateANAMWSRequest>
         <ns:model>
            <ns:keys/>
            <ns:instance>
               <ns:urgency>2</ns:urgency>
               <ns:impact>2</ns:impact>
               <ns:affected_service>${data.TIC_CODIGO_VPN}</ns:affected_service>
               <ns:external_system_ticket>${data.TIC_NEWID}</ns:external_system_ticket>
               <ns:id_system_ticket>${data.TIC_NEWID}</ns:id_system_ticket>
               <ns:ztechnical_cnt>${data.TIC_SOLICITA}</ns:ztechnical_cnt>
               <ns:ztechnical_phone>${data.TIC_TELEFONO_SOLICITANTE}</ns:ztechnical_phone>
               <ns:description>${data.TIC_DESCRIPCION}</ns:description>
               <ns:type_of_service>${stringsData.tipi_3}</ns:type_of_service>
               ${attachmensDataInstance}
            </ns:instance>
         </ns:model>
      </ns:CreateANAMWSRequest>
   </soapenv:Body>
</soapenv:Envelope>
`;

    const xmlResponse = await consumirApi_Soap(`${url_Provider}`, 'POST', {}, xmlRequest, "UNINET_COSCI",{username: username,password: password},'Create');
    
    const resultToMdi = await new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
        parser.parseString(xmlResponse.Detail, (err, result) => {
            let resultToMdi = {};
            if (err) {
                console.error('Error al parsear el XML:', err);
            } else {
                const statusSOAP = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['CreateANAMWSResponse'].status;
                
                if (statusSOAP == 'FAILURE') {
                    let returnCodeProvider = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['CreateANAMWSResponse'].returnCode;
                    let TypeErrorProvider = null;

                    if (returnCodeProvider != 19) {
                        TypeErrorProvider = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['CreateANAMWSResponse']['model']['instance']['message_oper']._;    
                    } else{
                        TypeErrorProvider = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['CreateANAMWSResponse'].message;
                    }
                    
                    
                    let TypeErrorProviderMessage = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['CreateANAMWSResponse'].message;
                    resultToMdi = {
                        statusCode: 400,
                        isSuccessProvider: false,
                        Detail: `${TypeErrorProviderMessage}: ${TypeErrorProvider}`,
                        providerName: 'UNINET_COSCI'
                    }
                } else if (statusSOAP == 'SUCCESS'){
                    
                    const idTicketParent = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['CreateANAMWSResponse']['model']['keys']['id_ticket_parent'];

                    resultToMdi = {
                        statusCode: 200,
                        isSuccessProvider: true,
                        Detail: {ticket_id: idTicketParent._},
                        providerName: 'UNINET_COSCI'
                    }
                }
    
                resolve(resultToMdi); // Resolver la promesa con el resultado
               
            }
        });
    })
    
    return resultToMdi;
}


async function updateTicketUninetCosci(data = null, TIC_ID_EXTERNO_PROVEEDOR = null, tic_newId= null) {
    let typeCalif = null;
    let typeTextCalif = null;
    
    if (data.TIPO_CALIFICACION_CSC == 2) {
        typeCalif = "CLOSED";    
        typeTextCalif = "Ticket cerrado";
    } else{
        typeCalif = "WORK IN PROGRESS";
        typeTextCalif = data.TIC_CALIFICACION_COMENTARIO;
    }

    const xmlRequest = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://schemas.hp.com/SM/7" xmlns:com="http://schemas.hp.com/SM/7/Common" xmlns:xmime="http://www.w3.org/2005/05/xmlmime">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:UpdateANAMWSRequest>
         <ns:model>
            <ns:keys>
                 <ns:id_ticket_parent>${TIC_ID_EXTERNO_PROVEEDOR}</ns:id_ticket_parent> 
            </ns:keys>
            <ns:instance>
               <ns:id_system_ticket>${tic_newId.TIC_NEWID}</ns:id_system_ticket>  
               <ns:status>${typeCalif}</ns:status>  
			<ns:notes>${typeTextCalif}</ns:notes>  
            </ns:instance>
         </ns:model>
      </ns:UpdateANAMWSRequest>
   </soapenv:Body>
</soapenv:Envelope>
`;
    
    const xmlResponse = await consumirApi_Soap(`${url_Provider}`, 'POST', {}, xmlRequest, "UNINET_COSCI",{username: username,password: password},'Update');
    console.log(xmlResponse);
    
    const resultToMdi = await new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
        parser.parseString(xmlResponse.Detail, (err, result) => {
            let resultToMdi = {};
            if (err) {
                console.error('Error al parsear el XML:', err);
            } else {
                const statusSOAP = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['UpdateANAMWSResponse'].status;
                if (statusSOAP == 'FAILURE') {
                    resultToMdi = {
                        statusCode: 400,
                        isSuccessProvider: false,
                        Detail: result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['UpdateANAMWSResponse'].message,
                        providerName: 'UNINET_COSCI'
                    }
                } else if (statusSOAP == 'SUCCESS'){
                    resultToMdi = {
                        statusCode: 200,
                        isSuccessProvider: true,
                        Detail: result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['UpdateANAMWSResponse'].message,
                        providerName: 'UNINET_COSCI'
                    }
                }
    
                resolve(resultToMdi); // Resolver la promesa con el resultado
               
            }
        });
    })
    return resultToMdi;
}

async function uploadImagesTicketUninetCosci(DataImages) {
    let attachmensData = DataImages.aryImages;
    
    let dataJsonUpload = "";
    for(let i =0; i<attachmensData.length; i++) {
        let filetoBaseConvert = attachmensData[i];
        dataJsonUpload += `<com:attachment xmime:contentType="${filetoBaseConvert.AttachmenType}" action="add" name="${filetoBaseConvert.AttachmenName}" type="IMAGE" attachmentType="INLINE">${filetoBaseConvert.AttachmenBlob}</com:attachment>`;
        
    }
    
    let attachmensDataInstance = `<ns:attachments>${dataJsonUpload}</ns:attachments>`;
    
    const xmlRequest = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://schemas.hp.com/SM/7" xmlns:com="http://schemas.hp.com/SM/7/Common" xmlns:xmime="http://www.w3.org/2005/05/xmlmime">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:UpdateANAMWSRequest>
         <ns:model>
            <ns:keys>
                 <ns:id_ticket_parent>${DataImages.TIC_ID_EXTERNO_PROVEEDOR}</ns:id_ticket_parent> 
            </ns:keys>
            <ns:instance>
                <ns:id_system_ticket>${DataImages.TIC_NEWID}</ns:id_system_ticket>  
                ${attachmensDataInstance}
            </ns:instance>
         </ns:model>
      </ns:UpdateANAMWSRequest>
   </soapenv:Body>
</soapenv:Envelope>
`;
    const xmlResponse = await consumirApi_Soap(`${url_Provider}`, 'POST', {}, xmlRequest, "UNINET_COSCI",{username: username,password: password},'Update');
    
    const resultToMdi = await new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
        parser.parseString(xmlResponse.Detail, (err, result) => {
            let resultToMdi = {};
            if (err) {
                console.error('Error al parsear el XML:', err);
            } else {
                const statusSOAP = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['UpdateANAMWSResponse'].status;
                if (statusSOAP == 'FAILURE') {
                    resultToMdi = {
                        statusCode: 400,
                        isSuccessProvider: false,
                        Detail: result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['UpdateANAMWSResponse'].message,
                        providerName: 'UNINET_COSCI'
                    }
                } else if (statusSOAP == 'SUCCESS'){
                    resultToMdi = {
                        statusCode: 200,
                        isSuccessProvider: true,
                        Detail: result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['UpdateANAMWSResponse'].message,
                        providerName: 'UNINET_COSCI'
                    }
                }
    
                resolve(resultToMdi); // Resolver la promesa con el resultado
               
            }
        });
    })
    return resultToMdi;
}
// Exportar la función
module.exports = { createTicketUninetCosci, updateTicketUninetCosci, uploadImagesTicketUninetCosci};