const rootDir = process.cwd();
require('dotenv').config({ path: `${rootDir}/.env` });

const { consumirApi } = require('../../__utilitis/apiConsumer');
const Token_Provider_Coveca2 = process.env.COVECA_DOS_TOKEN
const url_Provider_Coveca2 = process.env.COVECA_DOS_URL;

async function inserta_Coveca_2(data = null) {
    const objAlta = {}
    let fechaAltaOriginal = data.TIC_FECHA_ALTA;
    let fechaAltaProvider = fechaAltaOriginal.replace(' ', 'T');
    // Llenar las propiedades del objeto
    objAlta.no_caso = data.TIC_NEWID;
    objAlta.f_alta = fechaAltaProvider;
    objAlta.cod_vpn = data.TIC_CODIGO_VPN;
    objAlta.usuario_servicio = data.TIC_SOLICITA;
    objAlta.usuario_noempleado = "0089";
    objAlta.usuario_correo = data.TIC_EMAIL_SOLICITANTE;
    objAlta.usuario_telefeono = data.TIC_TELEFONO_SOLICITANTE;
    objAlta.extension = "";
    objAlta.usuario_movil = "";
    objAlta.hostname = data.TAG_COMPONENTE;
    objAlta.comentarios = data.TIC_DESCRIPCION;

    if (data.TIPO_TICKET_CSC == 15) {//Requerimiento
        objAlta.tipo_servicio = "230610125247";
    } else if(data.TIPO_TICKET_CSC == 16){ //Incidente
        objAlta.tipo_servicio = "230610125220";

    }
    objAlta.cod_equipo = data.TIC_JSON_EXTRA_PARAMS
    const success = await consumirApi(url_Provider_Coveca2, 'POST', { Authorization: `Bearer ${Token_Provider_Coveca2}` }, objAlta, "COVECA 2");
    return success; // Retornar el resultado de la llamada
}

async function update_status_Coveca_2(data = null, dataWhere=null) {

    const objAlta = {}
    // Llenar las propiedades del objeto
    if (data.TIPO_CALIFICACION_CSC == 2) {
        objAlta.estatus = 5;    
    } else{
        objAlta.estatus = 7;
    }
    objAlta.comentarios = data.TIC_CALIFICACION_COMENTARIO;
    objAlta.no_caso = dataWhere.TIC_NEWID;

    const success = await consumirApi(`${url_Provider}/UpdateSrv`, 'PUT', { Authorization: `Bearer ${Token_Provider_Coveca2}` }, objAlta, "COVECA 2");
    return success; // Retornar el resultado de la llamada
}

// Exportar la función
module.exports = { inserta_Coveca_2, update_status_Coveca_2};