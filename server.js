
const http = require('http'),
    express = require('express'),
    cors = require('cors'),
    app = express(),
    bodyParser = require("body-parser"),
    configSrv = require('./__utilitis/config.json'),
    serverPort = configSrv.PORT;
    const rootDir = process.cwd();
    require('dotenv').config({ path: `${rootDir}/.env` });

    app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // permitir peticiones sin origen (ejemplo: curl)
        if (origin.endsWith('.dnasystem.io') || origin.startsWith('https://') || origin.startsWith('http://')) {
        //if (origin.endsWith('.dnasystem.io') || origin.startsWith('https://')) {
            callback(null, true);
        } else {
            callback(new Error('Acceso denegado por CORS'));
        }
    },
    }));
    
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        if (req.method === 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    
        app.options('*', (req, res) => {
            res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
            res.send();
        });
    });
    app.use(bodyParser.urlencoded({limit: '100mb', extended: false }));
    app.use(bodyParser.json({limit: '100mb'}));
    app.get('/', function(req, res) {
        res.json({ message: "Acceso denegado" });
    });

    /** ROUTERS API */
    const Api_General = require("./rcm_Api_General/general.routes");
    const Api_Tickets = require("./rcm_Api_Tickets_v2/ticket.routes");
    const Api_RH = require("./rcm_Api_Rh_v2/rh.routes");
    const Api_OrdenTrabajo = require("./rcm_Api_Ots_v2/ots.routes");
    //const Api_CC = require("./rcm_Api_CC/cc.routes");
    const Api_Equipamiento = require("./rcm_Api_Equipamiento/eq.routes");
    const Api_Tokens_Sistema = require("./rcm_tokens/tokensjwt.routes");
    /** END ROUTERS API */

    /** EXTRA ROUTES */
    
    /** EXTRA ROUTES */

    /** ROUTERS API USE*/
        app.use('/api/Api_General', Api_General);
        app.use('/api/Api_Tickets_v2', Api_Tickets);
        app.use('/api/Api_Rh', Api_RH);
        app.use('/api/Api_Orden_Trabajo_v2',Api_OrdenTrabajo);
        //app.use('/api/Api_CC',Api_CC);
        app.use('/api/Equipamiento', Api_Equipamiento);
        app.use('/api/Tokens', Api_Tokens_Sistema);
    /** END ROUTERS API USE */

    /** EXTRA ROUTES APU USE */
    /** EXTRA ROUTES APU USE */

    app.listen(serverPort,()=>{
        console.log('server is running on port '+serverPort) 
        console.log(process.env.VERSION_SISTEMA);  // Verifica que las variables se cargaron correctamente

    });