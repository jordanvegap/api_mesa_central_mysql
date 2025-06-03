const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi } = require('../../__utilitis/apiConsumer');
const Token_Provider = process.env.COVELI_TOKEN;
const url_Provider = process.env.COVELI_URL;

async function createIncidenciaCOVELI(data = null, stringsData = null) {
    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    objAlta.asunto = "Crear inicidencia";
    objAlta.id_provider = "CoVeLi";
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_contacto = data.TIC_SOLICITA;
    objAlta.correo_contacto = data.TIC_EMAIL_SOLICITANTE;
    objAlta.telefono_contacto = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.inmueble = stringsData.inmuebleProviderConcat;
    objAlta.identificador_componente = stringsData.identificador_componente;
    objAlta.categoria_incidencia = stringsData.tipi_2;
    objAlta.subcategoria_incidencia = stringsData.tipi_3;
    objAlta.descripcion = data.TIC_DESCRIPCION;

    console.log(objAlta);
    
    const success = await consumirApi(`${url_Provider}.create_incidencia`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "COVELI");
    return success; // Retornar el resultado de la llamada
}


async function updateTicketCOVELI(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    const objAlta = {}
    // Llenar las propiedades del objeto
    if (data.TIPO_CALIFICACION_CSC == 2) {
        objAlta.estado = "Cerrado";    
    } else{
        objAlta.estado = "En proceso";
    }
    
    objAlta.folio_ticket = TIC_ID_EXTERNO_PROVEEDOR;
    console.log(objAlta);
    
    const success = await consumirApi(`${url_Provider}.update_status`, 'PUT', { Authorization: `${Token_Provider}` }, objAlta, "COVELI");
    return success; // Retornar el resultado de la llamada
}
// Exportar la función
module.exports = { createIncidenciaCOVELI, updateTicketCOVELI};