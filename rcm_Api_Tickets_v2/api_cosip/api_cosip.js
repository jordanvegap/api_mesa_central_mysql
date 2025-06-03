
const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi, consumirApiNoTokens, consumirApiCherwell, consumirApiUploadImagesCOSIP } = require('../../__utilitis/apiConsumer');
const fs = require('fs');
const path = require('path');
const currentDir = __dirname;
const filePath = path.join(currentDir, 'dataTokenProvider.Cosip.json');

const url_Provider = process.env.COSIP_URL;

// Función para guardar datos en el archivo JSON
const saveData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Función para leer datos del archivo JSON
const readData = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};

// Función para actualizar un dato específico
const updateData = (key, value) => {
    const data = readData() || {};
    data[key] = value;
    saveData(data);
};

async function altaTicketCosip(data = null,stringsData = null) {
    const currentData = readData();
    
    let resultLogout = await loginAsertive();
    if (resultLogout.isSuccessProvider == false) {
        return resultLogout;
    }
            
    const objAlta = JSON.stringify({
        "busObId": "6dd53665c0c24cab86870a21cf6434ae",
        "busObRecId": "",
        "busObPublicId": "",
        "fields": [
            {
            "dirty": true,
            "displayName": null,
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9453fbac30fc5dd03d9fbf4230a496e03ff2b34a2f",
            "name": "FolioIntegra",
            "value": "0" /*No de folio Mesa ANAM*/ 
            },
            {
            "dirty": true,
            "displayName": null,
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9455035d69c353d0629f644200b8102dcfa4d6680c",
            "name": "IntegraGuID",
            "value": data.TIC_NEWID /*No de folio Mesa ANAM*/ 
            },
            {
            "dirty": true,
            "displayName": null,
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9477ac5bfc78d78b03fdcb44279e03330bca301c83",
            "name": "NombreIntegracion",
            "value": "ANAM" /*Dato fijo*/ 
            },
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13", 
            "name": "Source", 
            "value": "WS ANAM" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:93734aaff77b19d1fcfd1d4b4aba1b0af895f25788", 
            "name": "CustomerDisplayName", 
            "value": "Aduana Mexico / SAT" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4", 
            "name": "Service", 
            "value": stringsData.tipi_1 /*Dato Servicio en base a catálogo de servicios.*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa", 
            "name": "Category", 
            "value": stringsData.tipi_2 /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46", 
            "name": "Subcategory", 
            "value": stringsData.tipi_3 /*Dato variable en base a catálogo de subcategorías*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:93e8ea93ff67fd95118255419690a50ef2d56f910c", 
            "name": "ShortDescription", 
            "value": data.TIC_DESCRIPCION.substring(0, 100) /*Dato variabl hasta 140 caractares.*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138"
            , 
            "name": "Description", 
            "value": data.TIC_DESCRIPCION /*Dato variabl hasta 32k.*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e4c93350bf5be446fb13d693b0bb7f219", 
            "name": "OwnedBy", 
            "value": "EN FILA" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c", 
            "name": "OwnedByTeam", 
            //"value": "COLLABORATION" /*Dato fijo*/ 
            "value": "NOC" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c", 
            "name": "Priority", 
            "value": "Media" /*Dato fijo en base al tipo de ticket*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7", 
            "name": "Impact", 
            "value": "Medio" /*Dato fijo en base al tipo de ticket*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822", 
            "name": "Urgency", 
            "value": "Media" /*Dato fijo en base al tipo de ticket*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:944b5793e10edb70a7ed0c4f309e7b44ed64d3a11e", 
            "name": "ContratoReq", 
            "value": "False" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:944ba4389624eb657f45784dd597178e5ab0f4e401", 
            "name": "ContratoReqJust", 
            "value": "Favor de asignar contrato. Ticket creado por WS" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365b1ed358b056256368f4c76beb828111504fb9e", 
            "name": "SLAID", 
            "value": "9492f71483f94bf77ea0684dafb7a171ea972344f3" /*Dato fijo*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:945616c0a8a2c17d3c6f6c422c97251c0bdd979e42", 
            "name": "ContactoPrincipal", 
            "value": data.TIC_SOLICITA /*Dato variable, hasta 150 caracteres.*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:945616cae6296456d1745e4b878dd8db44b40cd29b", 
            "name": "ContactoEmail", 
            "value": data.TIC_EMAIL_SOLICITANTE /*Dato variable hasta 255 caracteres.*/ 
            }, 
            { 
            "dirty": true, 
            "displayName": null, 
            "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:945616cde68d334d616fd94c1b820df683fbe00be6", 
            "name": "ContactoTel", 
            "value": data.TIC_TELEFONO_SOLICITANTE /*Dato variable hasta 15 caracteres.*/ 
            } 
        ]
        });
        
    const success = await consumirApi(`${url_Provider}/api/V1/savebusinessobject`, 'POST', { Authorization: `Bearer ${resultLogout.Detail.access_token}` }, objAlta, "COSIP");
    return success; // Retornar el resultado de la llamada
}

async function updateTicketCosip(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    const currentData = readData();
    let resultLogout = await loginAsertive(currentData.TokenAssertive);
    const ConcatenadoBusIds = TIC_ID_EXTERNO_PROVEEDOR.split('|');
    let objAlta = {}
    // Llenar las propiedades del objeto
    if (data.TIPO_CALIFICACION_CSC == 2) {
        objAlta = JSON.stringify({ 
            "busObId": "6dd53665c0c24cab86870a21cf6434ae", /* DATO FIJO*/ 
            "busObRecId": ConcatenadoBusIds[1], /* busObRecId proporcionado en la creación del ticket*/ 
            "busObPublicId": ConcatenadoBusIds[0], /* busObPublicId proporcionado en la creación del ticket*/ 
            "fields": [ 
            { 
                "dirty": true, 
                "displayName": null, 
                "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d", 
                "name": "Status", 
                "value": "Cerrado" /*Dato Fijo*/ 
            }, 
            { 
                "dirty": true, 
                "displayName": null, 
                "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:1ee8a71d62a247dfb23f91320a6eb911",             
                "name": "CloseBy", 
                "value": "WSIntegraANAM" /*Dato fijo */ 
            },     
            { 
                "dirty": true, 
                "displayName": null, 
                "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:11b6961ee55048b9a7240f7e2d3a2f8d",             
                "name": "ClosedDateTime", 
                "value": GetDate()  /*Fecha Cierre */ 
            }
            ] 
        });    
    } else{
        objAlta = JSON.stringify({ 
            "busObId": "6dd53665c0c24cab86870a21cf6434ae", /* DATO FIJO*/ 
            "busObRecId": ConcatenadoBusIds[1], /* busObRecId proporcionado en la creación del ticket*/ 
            "busObPublicId": ConcatenadoBusIds[0], /* busObPublicId proporcionado en la creación del ticket*/ 
            "fields": [ 
            { 
                "dirty": true, 
                "displayName": null, 
                "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d", 
                "name": "Status", 
                "value": "Reabierto" /*Dato Fijo*/ 
            }, 
            { 
                "dirty": true, 
                "displayName": null, 
                "fieldId": "BO:6dd53665c0c24cab86870a21cf6434ae,FI:9456747ec0e8764afcbe9a4e429406d781d34fedc4",  
                "name": "ReopenCause", 
                "value": data.TIC_CALIFICACION_COMENTARIO /*Dato variable hasta 32k */ 
            } 
            ] 
        }); 
    }    
    const success = await consumirApi(`${url_Provider}/api/V1/savebusinessobject`, 'POST', { Authorization: `Bearer ${resultLogout.Detail.access_token}` }, objAlta, "COSIP");
    return success; // Retornar el resultado de la llamada
}

async function uploadImagesToCOSIP(data = null, imageBinary, fileInfo) {
    
    let attachmensData = data.aryImages[0];
    //console.log('====BynaruDataImage======');
    //console.log(imageBinary);
    console.log(fileInfo);
    const currentData = readData();
    let resultLogout = await loginAsertive(currentData.TokenAssertive);
    const ConcatenadoBusIds = data.TIC_ID_EXTERNO_PROVEEDOR.split('|');
    const success = await consumirApiUploadImagesCOSIP(`${url_Provider}/api/V1/uploadbusinessobjectattachment/filename/${fileInfo.originalname}/busobname/incident/publicid/${ConcatenadoBusIds[0]}/offset/0/totalsize/${fileInfo.size}`, 'POST', { Authorization: `Bearer ${resultLogout.Detail.access_token}` }, imageBinary, "COSIP");
    return success; // Retornar el resultado de la llamada
}

async function loginAsertive() {
    const objAlta = {}
    
    // Llenar las propiedades del objeto
    objAlta.grant_type = process.env.COSIP_grant_type;
    objAlta.client_id = process.env.COSIP_client_id; // Tu Client ID
    objAlta.client_secret = process.env.COSIP_client_secret; // Tu Client Secret
    objAlta.username = process.env.COSIP_username; // Nombre de usuario
    objAlta.password = process.env.COSIP_password; // Contraseña
    objAlta.scope = process.env.COSIP_scope; // Si hay algún scope que necesitas

    // Llenar las propiedades del objeto
    // objAlta.grant_type = 'password';
    // objAlta.client_id = 'e611cec0-fe0d-4232-844b-ce1bdd3ef41c'; // Tu Client ID
    // objAlta.client_secret = 'e611cec0-fe0d-4232-844b-ce1bdd3ef41c'; // Tu Client Secret
    // objAlta.username = 'Cherwell\\WSIntegraANAM'; // Nombre de usuario
    // objAlta.password = 'Ch34well.2024.$'; // Contraseña
    // objAlta.scope = ''; // Si hay algún scope que necesitas
    
    const success = await consumirApiCherwell(`${url_Provider}/token`, 'POST', objAlta, "COSIP");  

    if (success.isSuccessProvider == true) {
        updateData('TokenAssertive', success.Detail.access_token);    
    }
      
    return success; // Retornar el resultado de la llamada
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
    
    // Formatear la hora en formato de 12 horas
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora 0 debe convertirse en 12 (mediodía o medianoche)
    
    // Devolver la fecha en el formato "23/5/2025 6:25 PM"
    return ("0" + (date)).slice(-2) + "/" + ("0" + (month)).slice(-2) + "/" + year + " " + hours + ":" + ("0" + (minutes)).slice(-2) + " " + period;
}
/*function GetDate() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    //"23/5/2025 6:25 PM"
    return ("0" + (date)).slice(-2) + "/" + ("0" + (month)).slice(-2) + "/" + year  +    " "  +("0" + (hours)).slice(-2) +':'+ ("0" + (minutes)).slice(-2) +':'+ ("0" + (seconds)).slice(-2);
}*/
module.exports = { altaTicketCosip, updateTicketCosip, uploadImagesToCOSIP};

