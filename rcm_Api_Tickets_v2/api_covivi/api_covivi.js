const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi } = require('../../__utilitis/apiConsumer');
const Token_Provider = process.env.COVIVI_TOKEN;
const url_Provider = process.env.COVIVI_URL;
const access_key = process.env.COVIVI_ACCESS_KEY;
const access_secret = process.env.COVIVI_ACCESS_SECRET;
const client_name = process.env.COVIVI_CLIENT_NAME;

async function createTicketCovivi(data = null, stringsData = null) {
    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    console.log(stringsData);
    
    objAlta.subject = `${stringsData.inmuebleProviderConcat} / ${stringsData.tipi_1} - ${stringsData.tipi_2} - ${stringsData.tipi_3}`;
    objAlta.description = data.TIC_DESCRIPCION;
    objAlta.newid = data.TIC_NEWID;
    objAlta.nombre_contacto = data.TIC_SOLICITA;
    objAlta.email = data.TIC_EMAIL_SOLICITANTE;
    objAlta.phone = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.tags = stringsData.identificador_componente;

    //objAlta.identificador_componente = stringsData.identificador_componente;
    //objAlta.categoria_incidencia = stringsData.tipi_2;
    //objAlta.subcategoria_incidencia = stringsData.tipi_3;
    //objAlta.descripcion = data.TIC_DESCRIPCION;

    console.log(objAlta);
    
    const success = await consumirApi(`${url_Provider}/api/create/ticket`, 'POST', { Authorization: `${Token_Provider}`, access_key: `${access_key}`, access_secret: `${access_secret}`, client_name: `${client_name}`  }, objAlta, "COVIVI");
    console.log(success);
    

    return success; // Retornar el resultado de la llamada
}


async function updateTicketCovivi(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    const objAlta = {}
    // Llenar las propiedades del objeto
    if (data.TIPO_CALIFICACION_CSC == 2) {
        objAlta.status = "EOGID005";    
    } else{
        objAlta.status = "EOGID001";
    }
    
    objAlta.id_ticket = TIC_ID_EXTERNO_PROVEEDOR;
    console.log(objAlta);
    
    const success = await consumirApi(`${url_Provider}/api/choice/status/ticket`, 'POST', { Authorization: `${Token_Provider}`, access_key: `${access_key}`, access_secret: `${access_secret}`, client_name: `${client_name}`  }, objAlta, "COVIVI");
    return success; // Retornar el resultado de la llamada
}
// Exportar la función
module.exports = { createTicketCovivi, updateTicketCovivi};