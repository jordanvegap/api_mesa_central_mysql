const jwt = require('jsonwebtoken');
const configtoken = require('../__utilitis/configtoken');

const secretKey = configtoken.secretjwt; // Cambia esto por una clave segura en un entorno de producción

const verifyTokenJwtFun = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token no proporcionado jws' });

    jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // El token ha expirado, intenta renovarlo
                const newToken = jwt.sign({ username: decoded }, secretKey, { expiresIn: '1m' });
                res.setHeader('Authorization', `Bearer ${newToken}`);
                //return res.status(403).json({ message: 'Token expirado' });
            } else {
                // El token es inválido
                return res.status(403).json({ message: 'Token inválido' });
            }
        } else {
            // El token es válido, puedes acceder a la información del usuario decodificada en decoded
            req.user = decoded;
        }
        next();
    });
};

const generarToken = (usuario) => {
    //return jwt.sign({ usuario }, secretKey, { expiresIn: '24h' });
    return jwt.sign({ usuario }, secretKey, { expiresIn: '1m' });
}

module.exports = { verifyTokenJwtFun, generarToken };
