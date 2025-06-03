// apiConsumer.js
const axios = require('axios');
const timeOut = 15000;
/**
 * Función para consumir una API
 * @param {string} url - La URL de la API.
 * @param {string} method - El método HTTP ('GET' o 'POST').
 * @param {object} headers - Encabezados adicionales, incluyendo el Bearer token.
 * @param {object} data - Datos a enviar en caso de POST.
 * @returns {Promise<boolean>} - Retorna true si la solicitud fue exitosa, false en caso contrario.
 */

// Función para remover las referencias circulares de un objeto
function removeCircularReferences(obj) {
    const seen = new WeakSet();
    function circularReplacer(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return; // Evitar referencia circular
            }
            seen.add(value);
        }
        return value;
    }
    return JSON.stringify(obj, circularReplacer);
}

async function consumirApi(url, method, headers = {}, data = null, proveedorName = null) {
    try {

        console.log(`===Init Request===Init Date: ${GetDate()}==Provider: ${proveedorName}====`);
        console.log(url);
        console.log(data);
        const options = {
            method,
            url,
            headers: {
                ...headers,
                'Content-Type': 'application/json', // Ajusta según tu API
            },
            data,
            timeout: timeOut, // Tiempo de espera en milisegundos (30 segundos)
        };

        let resultDataSuccess = {}
        const response = await axios(options);        
        // Verificamos si la respuesta fue exitosa (código de estado 200 a 399)
        if (response.status >= 200 && response.status < 400) {
            resultDataSuccess.statusCode = response.status;
            resultDataSuccess.isSuccessProvider = true;
            resultDataSuccess.Detail = response.data;
            resultDataSuccess.providerName = proveedorName;
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataSuccess; // Devolvemos solo el cuerpo de la respuesta
        } else {
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return response; // Devolvemos la respuesta completa si el código es 400 o superior
        }
        // Verificamos si la respuesta fue exitosa
        //return response.status >= 200 && response.status < 300;
    } catch (error) {
        
        let resultDataError = {}
        if (error.code === 'ECONNABORTED') {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 408;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = `La solicitud excedió el tiempo de espera. Intente nuevamente o comuniquese con el proveedor: ${proveedorName}`;
            resultDataError.errorDetail.message = `La solicitud excedió el tiempo de espera. Intente nuevamente o comuniquese con el proveedor: ${proveedorName}`;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError; // Devuelves un error de timeout si ocurre
        } else {
            
            if (error.response) {
                // La respuesta del servidor incluye un error 400
                const { data, status } = error.response;
                
                resultDataError.dateError = new Date();
                resultDataError.statusCode = status;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = data;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else if (error.request) {
                
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.request;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else {
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.data;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            }
        }
        
    }
}

async function consumirApiNoTokens(url, method, data = null, proveedorName = null) {
    try {
        console.log(`===Init Request===Init Date: ${GetDate()}==Provider: ${proveedorName}====`);
        console.log(url);
        console.log(data);
        const options = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json', // Ajusta según tu API
            },
            data,
        };

        let resultDataSuccess = {}
        const response = await axios(options);        
        // Verificamos si la respuesta fue exitosa (código de estado 200 a 399)
        if (response.status >= 200 && response.status < 400) {
            
            resultDataSuccess.statusCode = response.status;
            resultDataSuccess.isSuccessProvider = true;
            resultDataSuccess.Detail = response.data;
            resultDataSuccess.providerName = proveedorName;
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataSuccess; // Devolvemos solo el cuerpo de la respuesta
        } else {
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return response; // Devolvemos la respuesta completa si el código es 400 o superior
        }
        // Verificamos si la respuesta fue exitosa
        //return response.status >= 200 && response.status < 300;
    } catch (error) {
        let resultDataError = {}
        if (error.response) {
            // La respuesta del servidor incluye un error 400
            const { data, status } = error.response;
            
            resultDataError.dateError = new Date();
            resultDataError.statusCode = status;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = data;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError;
        } else if (error.request) {
            
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 400;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = error.request;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError;
        } else {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 400;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = error.data;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError;
        }
    }
}

async function consumirApiCherwell(url, method, data = null, proveedorName = null) {
    try {
        console.log(`===Init Request===Init Date: ${GetDate()}==Provider: ${proveedorName}====`);
        //console.log(url);
        //console.log(data);
        const options = {
            method,
            url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
            timeout: timeOut, // Tiempo de espera en milisegundos (30 segundos)
        };
       
        let resultDataSuccess = {}
        const response = await axios(options);        
        // Verificamos si la respuesta fue exitosa (código de estado 200 a 399)
        if (response.status >= 200 && response.status < 400) {
            
            resultDataSuccess.statusCode = response.status;
            resultDataSuccess.isSuccessProvider = true;
            resultDataSuccess.Detail = response.data;
            resultDataSuccess.providerName = proveedorName;
            //console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataSuccess; // Devolvemos solo el cuerpo de la respuesta
        } else {
            //console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return response; // Devolvemos la respuesta completa si el código es 400 o superior
        }
        // Verificamos si la respuesta fue exitosa
        //return response.status >= 200 && response.status < 300;
    } catch (error) {
        let resultDataError = {}
        if (error.code === 'ECONNABORTED') {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 408;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = `La solicitud excedió el tiempo de espera. Intente nuevamente o comuniquese con el proveedor: ${proveedorName}`;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError; // Devuelves un error de timeout si ocurre
        } else {
            if (error.response) {
                // La respuesta del servidor incluye un error 400
                const { data, status } = error.response;
                
                resultDataError.dateError = new Date();
                resultDataError.statusCode = status;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = data;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else if (error.request) {
                
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.request;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else {
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.data;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            }
        }
    }
}

async function consumirApi_Soap(url, method, headers = {}, data = null, proveedorName = null, AuthData = {}, SOAPAction = null) {
    try {
        console.log(`===Init Request===Init Date: ${GetDate()}==Provider: ${proveedorName}====`);
        console.log(url);
        console.log(data);
        const options = {
            method,
            url,
            data,
            headers: {
                'Content-Type': 'text/xml', // Ajusta según tu API
                'SOAPAction': SOAPAction,
            },
            auth: AuthData,
        };

        let resultDataSuccess = {}
        const response = await axios(options);        
        // Verificamos si la respuesta fue exitosa (código de estado 200 a 399)
        if (response.status >= 200 && response.status < 400) {
            
            resultDataSuccess.statusCode = response.status;
            resultDataSuccess.isSuccessProvider = true;
            resultDataSuccess.Detail = response.data;
            resultDataSuccess.providerName = proveedorName;
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataSuccess; // Devolvemos solo el cuerpo de la respuesta
        } else {
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return response; // Devolvemos la respuesta completa si el código es 400 o superior
        }
        // Verificamos si la respuesta fue exitosa
        //return response.status >= 200 && response.status < 300;
    } catch (error) {
        let resultDataError = {}

        if (error.response) {
            // La respuesta del servidor incluye un error 400
            const { data, status } = error.response;
            
            resultDataError.dateError = new Date();
            resultDataError.statusCode = status;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = data;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError;
        } else if (error.request) {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 400;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = error.request;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError;
        } else {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 400;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = error.data;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError;
        }
    }
}

async function consumirApi_AmericanSince(url, method, headers = {}, data = null, proveedorName = null) {
    try {
        console.log(`===Init Request===Init Date: ${GetDate()}==Provider: ${proveedorName}====`);
        console.log(url);
        console.log(data);
        const options = {
            method,
            url,
            headers: {
                ...headers,
                'Content-Type': 'application/json', // Ajusta según tu API
            },
            data,
            timeout: timeOut, // Tiempo de espera en milisegundos (30 segundos)
        };
        
        let resultDataSuccess = {};
        const response = await axios(options);        

        
        // Verificamos si la respuesta fue exitosa (código de estado 200 a 399)
        if (response.status >= 200 && response.status < 400) {
            
            resultDataSuccess.statusCode = response.status;
            resultDataSuccess.isSuccessProvider = true;

            // Remover referencias circulares de la respuesta antes de agregarla a `resultDataSuccess`
            try {
                resultDataSuccess.Detail = JSON.parse(removeCircularReferences(response.data));
            } catch (error) {
                resultDataSuccess.Detail = response.data; // En caso de error, se devuelve la respuesta original
            }
            
            resultDataSuccess.providerName = proveedorName;
            console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataSuccess; // Devolvemos solo el cuerpo de la respuesta
        } else {
            // Remover referencias circulares en el caso de un error 400+
            try {
                const sanitizedResponse = JSON.parse(removeCircularReferences(response));
                console.log(sanitizedResponse);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return sanitizedResponse;
            } catch (error) {
                console.log(response);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return response; // En caso de error, se devuelve la respuesta completa
            }
        }

    } catch (error) {
        let resultDataError = {};
        if (error.code === 'ECONNABORTED') {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 408;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = `La solicitud excedió el tiempo de espera. Intente nuevamente o comuniquese con el proveedor: ${proveedorName}`;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError; // Devuelves un error de timeout si ocurre
        } else {
            if (error.response) {
                // La respuesta del servidor incluye un error 400
                const { data, status } = error.response;
                
                resultDataError.dateError = new Date();
                resultDataError.statusCode = status;
                resultDataError.isSuccessProvider = false;

                // Remover referencias circulares de la respuesta de error
                try {
                    resultDataError.errorDetail = JSON.parse(removeCircularReferences(data));
                } catch (err) {
                    resultDataError.errorDetail = data; // En caso de error, se devuelve la respuesta original
                }

                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else if (error.request) {
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.request;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else {
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.message || error.data;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            }
        }
    }
}


async function consumirApiUploadImagesCOSIP(url, method, headers = {}, data = null, proveedorName = null) {
    try {
        console.log(`===Init Request===Init Date: ${GetDate()}==Provider: ${proveedorName}====`);
        console.log(url);
        //console.log(data);

        headers = {
            ...headers,
            'Content-Type': 'application/octet-stream',  // Cambiar a binary stream
        };

        //console.log(headers);
        

        const options = {
            method,
            url,
            headers,
            data,
            timeout: 30000,  // Tiempo de espera (30 segundos)
        };

        let resultDataSuccess = {};

        const response = await axios(options);

        // Verificamos si la respuesta fue exitosa (código de estado 200 a 399)
        if (response.status >= 200 && response.status < 400) {
            resultDataSuccess.statusCode = response.status;
            resultDataSuccess.isSuccessProvider = true;
            resultDataSuccess.Detail = response.data;
            resultDataSuccess.providerName = proveedorName;
            //console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataSuccess; // Devolvemos solo el cuerpo de la respuesta
        } else {
            //console.log(response);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return response; // Devolvemos la respuesta completa si el código es 400 o superior
        }

    } catch (error) {
        let resultDataError = {};
        if (error.code === 'ECONNABORTED') {
            resultDataError.dateError = new Date();
            resultDataError.statusCode = 408;
            resultDataError.isSuccessProvider = false;
            resultDataError.errorDetail = `La solicitud excedió el tiempo de espera. Intente nuevamente o comuniquese con el proveedor: ${proveedorName}`;
            resultDataError.providerName = proveedorName;
            console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
            console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
            return resultDataError; // Devuelves un error de timeout si ocurre
        } else {
            if (error.response) {
                const { data, status } = error.response;
                resultDataError.dateError = new Date();
                resultDataError.statusCode = status;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = data;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else if (error.request) {
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.request;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            } else {
                resultDataError.dateError = new Date();
                resultDataError.statusCode = 400;
                resultDataError.isSuccessProvider = false;
                resultDataError.errorDetail = error.message;
                resultDataError.providerName = proveedorName;
                console.log(`Response Error: ${JSON.stringify(resultDataError)}`);
                console.log(`===End Request===End Date: ${GetDate()}==Provider: ${proveedorName}====`);
                return resultDataError;
            }
        }
    }
}

function GetDate() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    return year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + (date)).slice(-2) + " "  +("0" + (hours)).slice(-2) +':'+ ("0" + (minutes)).slice(-2) +':'+ ("0" + (seconds)).slice(-2);
}
// Exportar la función
module.exports = { consumirApi, consumirApiNoTokens, consumirApiCherwell, consumirApi_Soap, consumirApi_AmericanSince, consumirApiUploadImagesCOSIP};
