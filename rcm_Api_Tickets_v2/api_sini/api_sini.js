const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi } = require('../../__utilitis/apiConsumer');
const Token_Provider = process.env.SINI_TOKEN;
const endPoint_url_Provider = process.env.SINI_URL;

/*
DATOS PRUEBAS
    const Token_Provider = "Token e45a3ac83db9b96:aa7ba95dae117a1";
    const endPoint_url_Provider = "https://mesadeayuda-sini.software-demo.com/api/method/erpnext.support.doctype.issue.api";
*/

/*
DATOS PRODUCTIVOS
    const Token_Provider = "Token 6e938dedc445254:7e8f31dd02b904a";
    const endPoint_url_Provider = "https://mesadeayuda.ltpglobal.mx/api/method/erpnext.support.doctype.issue.api";
*/


// Definición de la interfaz
/*
Objeto_Coveca {
        "asunto": "Crer inicidencia",
        "tipo_de_ticket": "Incidente",
        "inmueble": "Centro de procesamiento Electronico de datos",
        "departamento_encargado": "Ingeniero de campo", Dato fijo
        "vpn": "404",
        "folio_ticket": "E94D7414-FD21-4AFF-8191-2671F4E38E4D",
        "nombre_solicitante": "ANAM",
        "apellido_paterno_solicitante": "ANAM",
        "apellido_materno_solicitante": "ANAM ",
        "extension": "+52", Dsto Fijo
        "telefono_solicitante": "1234567890",
        "celular_solicitante": "",
        "correo_solicitante": "test@info.com",
        "no_empleado_solicitante": "1",
        "nombre_segundo_solicitante": "ANAM",
        "apellido_paterno_segundo_solicitante": "ANAM",
        "apellido_materno_segundo_solicitante": "ANAM",
        "extension_segundo_solicitante": "+52",
        "telefono_cliente_segundo_solicitante": "1234567890",
        "celular_segundo_solicitante": "",
        "correo_segundo_solicitante": "test2@info.com",
        "no_empleado_segundo_solicitante": "",
        "desc_falla": "TICKET DE PRUEBA PC Y MONITOR",
        "attachment_name_1": "",
        "attachment_data_1": "",
        "attachment_size_1": "",
        "incidencia": {
            "servicio": "PC y Monitor",
            "tag_equipo_inc": "200"
        }
    }
*/


async function reqServiceSINI(data = null, stringsData = null) {
    console.log(endPoint_url_Provider);
    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    objAlta.asunto = "Crear inicidencia";
    objAlta.tipo_de_ticket = "Incidente";
    objAlta.inmueble = stringsData.inmuebleProvider;
    objAlta.departamento_encargado = "Ingeniero de campo";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    objAlta.extension = "+52";
    objAlta.telefono_solicitante = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.celular_solicitante = "";
    objAlta.correo_solicitante = data.TIC_EMAIL_SOLICITANTE;
    objAlta.no_empleado_solicitante = "1";
    objAlta.nombre_segundo_solicitante = "";
    objAlta.apellido_paterno_segundo_solicitante = "";
    objAlta.apellido_materno_segundo_solicitante = "";
    objAlta.extension_segundo_solicitante = "+52";
    objAlta.telefono_cliente_segundo_solicitante = "";
    objAlta.celular_segundo_solicitante = "";
    objAlta.correo_segundo_solicitante = "";
    objAlta.no_empleado_segundo_solicitante = "";
    objAlta.desc_falla = data.TIC_DESCRIPCION;
    objAlta.attachment_name_1 = "";
    objAlta.attachment_data_1 = "";
    objAlta.attachment_size_1 = "";
    objAlta.incidencia = {
        servicio: stringsData.servicioProvider,
        tag_equipo_inc: data.TAG_COMPONENTE
    } 
    
    const success = await consumirApi(`${endPoint_url_Provider}.create_incidencia`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "SINI");
    
    
    return success; // Retornar el resultado de la llamada
}

async function createAltaSini(data = null, stringsData = null) {

    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    objAlta.asunto = "Creación de alta";
    objAlta.tipo_de_ticket = "Alta";
    objAlta.inmueble = stringsData.inmuebleProvider;
    objAlta.departamento_encargado = "Ingeniero de campo";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    objAlta.extension = "+52";
    objAlta.telefono_solicitante = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.celular_solicitante = "";
    objAlta.correo_solicitante = data.TIC_EMAIL_SOLICITANTE;
    objAlta.no_empleado_solicitante = "1";
    objAlta.nombre_segundo_solicitante = "";
    objAlta.apellido_paterno_segundo_solicitante = "";
    objAlta.apellido_materno_segundo_solicitante = "";
    objAlta.extension_segundo_solicitante = "+52";
    objAlta.telefono_cliente_segundo_solicitante = "";
    objAlta.celular_segundo_solicitante = "";
    objAlta.correo_segundo_solicitante = "";
    objAlta.no_empleado_segundo_solicitante = "";
    objAlta.desc_falla = data.TIC_DESCRIPCION;
    objAlta.attachment_name_1 = "";
    objAlta.attachment_data_1 = "";
    objAlta.attachment_size_1 = "";
    objAlta.incidencia = {
        fecha_alta: stringsData.FechaAplicaString,
        tag_alta: `${stringsData.TAG_COMPONENTE}`,
        motivo_alta: stringsData.MotivoString,
        marca_alta: stringsData.MarcaString,
        nombre_componente_alta: stringsData.NombreComponente,
        modelo_alta: stringsData.ModeloString,
        categoria_alta: stringsData.CategoriaAlta,
        no_serie_alta: stringsData.NumeroSerieString,
    }
    const success = await consumirApi(`${endPoint_url_Provider}.create_alta`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "SINI");
    return success; // Retornar el resultado de la llamada
}

async function createBajaSini(data = null, stringsData = null) {

    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    objAlta.asunto = "Creación de baja";
    objAlta.tipo_de_ticket = "Baja";
    objAlta.inmueble = stringsData.inmuebleProvider;
    objAlta.departamento_encargado = "Ingeniero de campo";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    objAlta.extension = "+52";
    objAlta.telefono_solicitante = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.celular_solicitante = "";
    objAlta.correo_solicitante = data.TIC_EMAIL_SOLICITANTE;
    objAlta.no_empleado_solicitante = "1";
    objAlta.nombre_segundo_solicitante = "";
    objAlta.apellido_paterno_segundo_solicitante = "";
    objAlta.apellido_materno_segundo_solicitante = "";
    objAlta.extension_segundo_solicitante = "+52";
    objAlta.telefono_cliente_segundo_solicitante = "";
    objAlta.celular_segundo_solicitante = "";
    objAlta.correo_segundo_solicitante = "";
    objAlta.no_empleado_segundo_solicitante = "";
    objAlta.desc_falla = data.TIC_DESCRIPCION;
    objAlta.attachment_name_1 = "";
    objAlta.attachment_data_1 = "";
    objAlta.attachment_size_1 = "";
    objAlta.incidencia = {
        fecha_baja: stringsData.FechaAplicaString,
        tag_baja: `${stringsData.TAG_COMPONENTE}`,
        motivo_baja: stringsData.MotivoString,
    }
    const success = await consumirApi(`${endPoint_url_Provider}.create_baja`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "SINI");
    return success; // Retornar el resultado de la llamada
}

async function createCambioSini(data = null, stringsData = null) {

    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    objAlta.asunto = "Creación de cambio";
    objAlta.tipo_de_ticket = "Cambio";
    objAlta.inmueble = stringsData.inmuebleProvider;
    objAlta.departamento_encargado = "Ingeniero de campo";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    objAlta.extension = "+52";
    objAlta.telefono_solicitante = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.celular_solicitante = "";
    objAlta.correo_solicitante = data.TIC_EMAIL_SOLICITANTE;
    objAlta.no_empleado_solicitante = "1";
    objAlta.nombre_segundo_solicitante = "";
    objAlta.apellido_paterno_segundo_solicitante = "";
    objAlta.apellido_materno_segundo_solicitante = "";
    objAlta.extension_segundo_solicitante = "+52";
    objAlta.telefono_cliente_segundo_solicitante = "";
    objAlta.celular_segundo_solicitante = "";
    objAlta.correo_segundo_solicitante = "";
    objAlta.no_empleado_segundo_solicitante = "";
    objAlta.desc_falla = data.TIC_DESCRIPCION;
    objAlta.attachment_name_1 = "";
    objAlta.attachment_data_1 = "";
    objAlta.attachment_size_1 = "";
    objAlta.incidencia = {
        fecha_cambio: stringsData.FechaAplicaString,
        modelo_cambio: stringsData.ModeloString,
        tag_equipo_cambio: `${stringsData.TAG_COMPONENTE}`,
        motivo_cambio: stringsData.MotivoString,
        num_serie_cambio: stringsData.NumeroSerieString,
        marca_cambio: stringsData.MarcaString
    }

    const success = await consumirApi(`${endPoint_url_Provider}.create_cambio`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "SINI");
    return success; // Retornar el resultado de la llamada
}

async function reqServiceSINIUpdate(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    const objAlta = {}

    objAlta.folio_ticket = TIC_ID_EXTERNO_PROVEEDOR;
    objAlta.estado = "Cerrado";
    objAlta.motivo_cambio = data.TIC_CALIFICACION_COMENTARIO;
    
    const success = await consumirApi(`${endPoint_url_Provider}.update_status`, 'PUT', { Authorization: `${Token_Provider}` }, objAlta, "SINI");
    return success; // Retornar el resultado de la llamada
}

// Exportar la función
module.exports = {reqServiceSINI, reqServiceSINIUpdate, createAltaSini, createBajaSini, createCambioSini};