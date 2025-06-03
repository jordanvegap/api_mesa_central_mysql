
const { consumirApi, consumirApiNoTokens } = require('../../__utilitis/apiConsumer');
const rootDir = process.cwd();

require('dotenv').config({ path: `${rootDir}/.env` });
const url_Provider = process.env.SIADECONII_URL;
const fs = require('fs');
const path = './dataTokenProvider.Siadeconii.json';

// Función para guardar datos en el archivo JSON
const saveData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
};

// Función para leer datos del archivo JSON
const readData = () => {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8');
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

async function altaTicketSiadeconii(data = null,stringsData = null) {
    const currentData = readData();
    
    let resultLogin = await getTokenSiadeconii();
    
    if (resultLogin.statusCode == 403) {
        return resultLogin;
    } else {
        const objAlta = {}
        // Llenar las propiedades del objeto
        //objAlta.servicio = stringsData.tipi_2;
        objAlta.servicio = "SERVICIO RECURRENTE";
        objAlta.subservicio = stringsData.tipi_3;
        objAlta.descripcion_problema = data.TIC_DESCRIPCION;
        objAlta.folio_externo = data.TIC_NEWID;
    
        const success = await consumirApi(`${url_Provider}/tickets/api/alta/`, 'POST', { Authorization: `Bearer ${resultLogin.Detail.access}` }, objAlta, "SIADECONII");
        return success; // Retornar el resultado de la llamada
    }
}

async function updateTicketSiadeconii(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {
    let resultLogin = await getTokenSiadeconii();
    if (resultLogin.statusCode == 403) {
        return resultLogin;
    } else {
        const objAlta = {}
        objAlta.folio_externo = TIC_ID_EXTERNO_PROVEEDOR.TIC_NEWID
        objAlta.fue_calificado = "True"
        objAlta.calificacion = 7

        if (data.TIPO_CALIFICACION_CSC == 2) {
            objAlta.estatus = "Cerrado";    
            objAlta.comentario = "TICKET CALIFICADO";
        } else if (data.TIPO_CALIFICACION_CSC == 3) {
            objAlta.estatus = "En proceso";
            objAlta.comentario = data.TIC_CALIFICACION_COMENTARIO;    
        }
    
        const success = await consumirApi(`${url_Provider}/tickets/api/atender/`, 'POST', { Authorization: `Bearer ${resultLogin.Detail.access}` }, objAlta, "SIADECONII");    
        return success; // Retornar el resultado de la llamada
    }
}
/**
{
    "estatus": "En proceso",
    "comentario": "PRUEBA DE REAPERTURA"
}
 */
async function getTokenSiadeconii() {
    const objAlta = {}
    // Llenar las propiedades del objeto
    objAlta.username = process.env.SIADECONII_USERNAME;
    objAlta.password = process.env.SIADECONII_PASSWORD;

    const success = await consumirApiNoTokens(`${url_Provider}/api/obtener-token/`, 'POST', objAlta, "SIADECONII");  
      
    updateData('TokenAssertive', success.Detail.access);
    return success; // Retornar el resultado de la llamada
}

async function logOutAsertive(tokenActivo) {
    const objAlta = {}
    // Llenar las propiedades del objeto
    objAlta.email = process.env.SIADECONII_USERNAME;
    objAlta.pass = process.env.SIADECONII_PASSWORD;
    const currentData = readData();

    const success = await consumirApi(`${url_Provider}`, 'GET', { key: `${tokenActivo}` }, objAlta, "SIADECONIILogOut");    
    return success; // Retornar el resultado de la llamada
}
// Exportar la función
module.exports = { altaTicketSiadeconii, updateTicketSiadeconii};


