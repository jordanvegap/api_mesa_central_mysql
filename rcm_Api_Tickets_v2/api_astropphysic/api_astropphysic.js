

const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi, consumirApiNoTokens, consumirApi_AmericanSince } = require('../../__utilitis/apiConsumer');
const url_Provider = process.env.ASTROPHYSICS_URL;
const fs = require('fs');
const path = './dataTokenProvider.AssertiveAstrophysic.json';

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

async function altaTicketAstrophysics(data = null,stringsData = null) {
    const currentData = readData();
    
    let resultLogout = await logOutAsertive(currentData.TokenAssertive);
    let resultCliente = await getClienteId(resultLogout.Detail);

    const objAlta = {}
    // Llenar las propiedades del objeto
    objAlta.id_cliente = resultCliente;
    objAlta.id_externo = data.TIC_NEWID;
    objAlta.detalle = data.TIC_DESCRIPCION;
    objAlta.tipo = stringsData.tipo_solicitud;
    objAlta.tipi_1 = stringsData.tipi_1;
    objAlta.tipi_2 = stringsData.tipi_2;
    objAlta.tipi_3 = stringsData.tipi_3;
    objAlta.prioridad = 1;
    objAlta.quien_reporta = data.TIC_SOLICITA;
    objAlta.informar = data.TIC_EMAIL_SOLICITANTE;
    objAlta.telefono = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.serie = data.TAG_COMPONENTE;
    const success = await consumirApi_AmericanSince(`${url_Provider}/nuevo`, 'POST', { key: `${resultLogout.Detail}` }, objAlta, "Astrophysics");
    console.log(success);
    return success; // Retornar el resultado de la llamada
}

async function updateTicketAstrophysics(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    const currentData = readData();
    let resultLogout = await logOutAsertive(currentData.TokenAssertive);
    console.log(resultLogout);
    
    const objAlta = {}
    // Llenar las propiedades del objeto
    if (data.TIPO_CALIFICACION_CSC == 2) {
        objAlta.estatus = "Cerrado";    
    } else{
        objAlta.estatus = "En proceso";
    }
    objAlta.comentario = data.TIC_CALIFICACION_COMENTARIO;
    
    const success = await consumirApi(`${url_Provider}/evento/${TIC_ID_EXTERNO_PROVEEDOR}`, 'POST', { key: `${resultLogout.Detail}` }, objAlta, "Astrophysics");
    return success; // Retornar el resultado de la llamada
}
async function loginAsertive() {
    const urlLoginAsertive = process.env.ASTROPHYSICS_URL_LOGIN_LOGOUT+'/login'
    const objAlta = {}
    // Llenar las propiedades del objeto
    objAlta.email = process.env.ASTROPHYSICS_USERNAME;
    objAlta.pass = process.env.ASTROPHYSICS_PASSWORD;

    const success = await consumirApiNoTokens(`${urlLoginAsertive}`, 'POST', objAlta, "AstrophysicsLogIn");    
    updateData('TokenAssertive', success.Detail);
    return success; // Retornar el resultado de la llamada
}

async function logOutAsertive(tokenActivo) {
    const urlLoginAsertive = process.env.ASTROPHYSICS_URL_LOGIN_LOGOUT+'/logout'
    const objAlta = {}
    // Llenar las propiedades del objeto
    objAlta.email = process.env.ASTROPHYSICS_USERNAME;
    objAlta.pass = process.env.ASTROPHYSICS_PASSWORD;
    const currentData = readData();

    let successLogout = await consumirApi(`${urlLoginAsertive}`, 'GET', { key: `${tokenActivo}` }, objAlta, "AstrophysicsLogOut");
    if (successLogout.statusCode == 401) {
        success = await loginAsertive();
    } else{
        success = await loginAsertive();
    }
    return success; // Retornar el resultado de la llamada
}

async function getClienteId(tokenActivo) {
    const objAlta = {}
    let successGetCliente = await consumirApi(`${url_Provider}/clientes`, 'GET', { key: `${tokenActivo}` }, objAlta, "AstrophysicsGetCliente");
    return successGetCliente.Detail.data[0].id; // Retornar el resultado de la llamada
}
module.exports = { altaTicketAstrophysics, updateTicketAstrophysics};