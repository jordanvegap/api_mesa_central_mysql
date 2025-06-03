
const jwt = require('jsonwebtoken');

function generateRandomRoomName(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function convertirAFechaUnix(fechaString) {
    // Convertir la cadena de fecha a un objeto Date
    const fecha = new Date(fechaString);

    // Obtener el tiempo en milisegundos desde el 1 de enero de 1970 (Unix Epoch)
    const timestamp = fecha.getTime() / 1000; // Dividir por 1000 para obtener segundos en lugar de milisegundos

    return timestamp;
}

exports.generarToken = async (req,res) => {
    const secret = 'Tjhgdyy388i4n499';

    const roomName = generateRandomRoomName(10);

    const ConferenceConfigModerador = {
        "moderator": true,
        "aud": "*",
        "iss": req.body.iss,
        "sub": req.body.sub,
        "room": roomName,
        "nbf": convertirAFechaUnix(req.body.nbf),
        "exp": convertirAFechaUnix(req.body.exp)
    }
      
    const ConferenceConfigInvitados = {
        "moderator": false,
        "aud": "*",
        "iss": req.body.iss,
        "sub": req.body.sub,
        "room": roomName,
        "nbf": convertirAFechaUnix(req.body.nbf),
        "exp": convertirAFechaUnix(req.body.exp)
    }

    const tokenModerator = jwt.sign(ConferenceConfigModerador, secret, { algorithm: 'HS256' });
    const tokenGuest = jwt.sign(ConferenceConfigInvitados, secret, { algorithm: 'HS256' });
    
    const resultConference = {
        urlModerator: `https://${req.body.sub}/${roomName}?jwt=${tokenModerator}`,
        urlGuest: `https://${req.body.sub}/${roomName}?jwt=${tokenGuest}`
    }
    res.send( resultConference );
}