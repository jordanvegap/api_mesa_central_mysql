const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi } = require('../../__utilitis/apiConsumer');
const Token_Provider = process.env.COSISI_TOKEN;
const url_Provider = process.env.COSISI_URL;

async function reqServiceCOSISI(data = null, stringsData = null, blobIamge = null) {
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
    objAlta.departamento_encargado = "Lógico";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;

    if (data.TIC_AUXS3) {
        objAlta.extension = data.TIC_AUXS3;    
    } else {
        objAlta.extension = '';
    } 
    
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
    if (blobIamge == null) {
        objAlta.attachment_name_1 = "";
        objAlta.attachment_data_1 = "";
        objAlta.attachment_size_1 = "";    
    } else {
        objAlta.attachment_name_1 = stringsData.AttachmenName;
        objAlta.attachment_data_1 = blobIamge;
        objAlta.attachment_size_1 = `${stringsData.AttachmenSize}`;
    }
    objAlta.incidencia = {
        //servicio: stringsData.servicioProvider,
        tag_equipo_inc: data.TAG_COMPONENTE
    }
    console.log(objAlta);
    const success = await consumirApi(`${url_Provider}.create_incidencia`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "COSISI");
    return success; // Retornar el resultado de la llamada
}

async function createAltaCosisi(data = null, stringsData = null, blobIamge = null) {

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
    objAlta.departamento_encargado = "Lógico";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    
    if (data.TIC_AUXS3) {
        objAlta.extension = data.TIC_AUXS3;    
    } else {
        objAlta.extension = '';
    } 
    
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
    if (blobIamge == null) {
        objAlta.attachment_name_1 = "";
        objAlta.attachment_data_1 = "";
        objAlta.attachment_size_1 = "";    
    } else {
        objAlta.attachment_name_1 = stringsData.AttachmenName;
        objAlta.attachment_data_1 = blobIamge;
        objAlta.attachment_size_1 = `${stringsData.AttachmenSize}`;
    }
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
    const success = await consumirApi(`${url_Provider}.create_alta`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "COSISI");
    return success; // Retornar el resultado de la llamada
}

async function createBajaCosisi(data = null, stringsData = null, blobIamge = null) {

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
    objAlta.departamento_encargado = "Lógico";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    if (data.TIC_AUXS3) {
        objAlta.extension = data.TIC_AUXS3;    
    } else {
        objAlta.extension = '';
    } 
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
    if (blobIamge == null) {
        objAlta.attachment_name_1 = "";
        objAlta.attachment_data_1 = "";
        objAlta.attachment_size_1 = "";    
    } else {
        objAlta.attachment_name_1 = stringsData.AttachmenName;
        objAlta.attachment_data_1 = blobIamge;
        objAlta.attachment_size_1 = `${stringsData.AttachmenSize}`;
    }
    objAlta.incidencia = {
        fecha_baja: stringsData.FechaAplicaString,
        tag_equipo_baja: `${stringsData.TAG_COMPONENTE}`,
        motivo_baja: stringsData.MotivoString,
    }
    const success = await consumirApi(`${url_Provider}.create_baja`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "COSISI");
    return success; // Retornar el resultado de la llamada
}

async function createCambioCosisi(data = null, stringsData = null, blobIamge = null) {

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
    objAlta.departamento_encargado = "Lógico";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    if (data.TIC_AUXS3) {
        objAlta.extension = data.TIC_AUXS3;    
    } else {
        objAlta.extension = '';
    } 
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
    if (blobIamge == null) {
        objAlta.attachment_name_1 = "";
        objAlta.attachment_data_1 = "";
        objAlta.attachment_size_1 = "";    
    } else {
        objAlta.attachment_name_1 = stringsData.AttachmenName;
        objAlta.attachment_data_1 = blobIamge;
        objAlta.attachment_size_1 = `${stringsData.AttachmenSize}`;
    }
    objAlta.incidencia = {
        fecha_cambio: stringsData.FechaAplicaString,
        modelo_cambio: stringsData.ModeloString,
        tag_equipo_cambio: `${stringsData.TAG_COMPONENTE}`,
        motivo_cambio: stringsData.MotivoString,
        num_serie_cambio: stringsData.NumeroSerieString,
        marca_cambio: stringsData.MarcaString
    }

    const success = await consumirApi(`${url_Provider}.create_cambio`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "COSISI");
    return success; // Retornar el resultado de la llamada
}

async function createRequerimientoCosisi(data = null, stringsData = null, blobIamge) {

    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    let nombreCompleto = data.TIC_SOLICITA;
    let nombresSeparados = nombreCompleto.split(" ");
    let [nombre, apellidoPaterno, apellidoMaterno] = nombresSeparados;

    objAlta.asunto = "Creación de requerimiento";
    objAlta.tipo_de_ticket = "Requerimiento de Servicio";
    objAlta.inmueble = stringsData.inmuebleProvider;
    objAlta.departamento_encargado = "Lógico";
    objAlta.vpn = data.TIC_CODIGO_VPN;
    objAlta.folio_ticket = data.TIC_NEWID;
    objAlta.nombre_solicitante = nombre;
    objAlta.apellido_paterno_solicitante = apellidoPaterno;
    objAlta.apellido_materno_solicitante = apellidoMaterno;
    if (data.TIC_AUXS3) {
        objAlta.extension = data.TIC_AUXS3;    
    } else {
        objAlta.extension = '';
    } 
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
    if (blobIamge == null) {
        objAlta.attachment_name_1 = "";
        objAlta.attachment_data_1 = "";
        objAlta.attachment_size_1 = "";    
    } else {
        objAlta.attachment_name_1 = stringsData.AttachmenName;
        objAlta.attachment_data_1 = blobIamge;
        objAlta.attachment_size_1 = `${stringsData.AttachmenSize}`;
    }
    objAlta.incidencia = {
        folio_orden_servicio: stringsData.CategoriaAlta,
        orden_servicio_attachment_name: stringsData.AttachmenName,
        orden_servicio_attachment_data: blobIamge,
        tag_equipo: `${stringsData.TAG_COMPONENTE}`,
        orden_servicio_attachment_size: `${stringsData.AttachmenSize}`,
    }

    const success = await consumirApi(`${url_Provider}.create_requerimiento_servicio`, 'POST', { Authorization: `${Token_Provider}` }, objAlta, "COSISI");
    return success; // Retornar el resultado de la llamada
}

async function reqServiceCOSISIUpdate(data = null, TIC_ID_EXTERNO_PROVEEDOR = null) {

    const objAlta = {}
    // Llenar las propiedades del objeto
    if (data.TIPO_CALIFICACION_CSC == 2) {
        objAlta.estado = "Cerrado";    
        objAlta.motivo_cambio = 'TICKET CALIFICADO';
    } else{
        objAlta.estado = "En curso";
        objAlta.motivo_cambio = data.TIC_CALIFICACION_COMENTARIO;
    }
    objAlta.folio_ticket = TIC_ID_EXTERNO_PROVEEDOR;
    //objAlta.estado = "Cerrado";
    console.log(objAlta);
    
    
    const success = await consumirApi(`${url_Provider}.update_status`, 'PUT', { Authorization: `${Token_Provider}` }, objAlta, "COSISI");
    return success; // Retornar el resultado de la llamada
}
// Exportar la función
module.exports = { reqServiceCOSISI, createAltaCosisi,createBajaCosisi,createCambioCosisi,createRequerimientoCosisi, reqServiceCOSISIUpdate};