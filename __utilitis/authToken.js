const configtoken = require('../__utilitis/configtoken');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['access-token'];

        if (token) {
            let TokenLet = configtoken.MasterToken;
            if (token === TokenLet) {
            next();
            } else {
            result = {
                success: false,
                message: 'El token no es valido'
            };
            return  res.status(403).json(result);
            }
        } else {
            result = {
            success: false,
            message: 'No se ha proporcionado token.'
            };
            return  res.status(403).json(result);
        }

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}


    
    