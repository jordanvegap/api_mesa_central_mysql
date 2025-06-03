var mysql = require('mysql2');
function Recorre_Record(JsonObject,TypeRecord) {
    var CURRENT_TIMESTAMP = mysql.raw('CURRENT_TIMESTAMP()');
    var StringReturn = "";
    var IsPrimero = true;
    if(TypeRecord === "UPDATE"){

        StringReturn += " SET ";

        Object.entries(JsonObject).forEach(([key, value]) => {

            if(value == "GETDATE()"){
                if(IsPrimero){
                    StringReturn += key + " = CURRENT_TIMESTAMP()";
                    IsPrimero = false;
                }
                else{
                    StringReturn += ","+key + " = CURRENT_TIMESTAMP()";
                }
            }
            else if(value == "NEWID()"){
                if(IsPrimero){
                    StringReturn += key + " = NEWID()";
                    IsPrimero = false;
                }
                else{
                    StringReturn += ","+key + " = NEWID()";
                }
            }
            else{
                if(IsPrimero){
                    StringReturn += key + " = " + TypeData(value);
                    IsPrimero = false;
                }
                else{
                    StringReturn += ","+key + " = " + TypeData(value);
                }
            }
            
        });

        return StringReturn;
    }
    else if(TypeRecord === "INSERT_OUTPUT"){
        var StringParameter = "";
        var StringCampos = "";

        Object.entries(JsonObject).forEach(([key, value]) => {

            if(value == "GETDATE()"){
                if(IsPrimero){
                    StringCampos += key ;
                    StringParameter += " GETDATE() " ;
                    IsPrimero = false;
                }
                else{
                    StringCampos += ","+key ;
                    StringParameter += " ,GETDATE() " ;
                }
            }
            else if(value == "NEWID()"){
                if(IsPrimero){
                    StringCampos += key ;
                    StringParameter += " NEWID() " ;
                    IsPrimero = false;
                }
                else{
                    StringCampos += ","+key ;
                    StringParameter += " ,NEWID() " ;
                }
            }
            else{
                if(IsPrimero){
                    StringCampos += key ;
                    StringParameter += " @INSERT_OUTPUT_" + key + " " ;
                    IsPrimero = false;
                }
                else{
                    StringCampos += ","+key ;
                    StringParameter += " ,@INSERT_OUTPUT_" + key + " " ;
                }
            }
            
        });

        StringReturn += " ( "+StringCampos+" )  OUTPUT INSERTED.* VALUES ( "+StringParameter+" )  ";
        
    }
    else if(TypeRecord === "INSERT"){
        var StringParameter = "";
        var StringCampos = "";
        var DataInsert = {};
        var finalResult = null;
        Object.entries(JsonObject).forEach(([key, value]) => {
            DataInsert[key] = value;
            if(value == "GETDATE()"){
                DataInsert[key] = CURRENT_TIMESTAMP;
            }
            finalResult = Object.assign(DataInsert);
        });
        return finalResult;
    }
    else if(TypeRecord === "WHERE"){
        
        Object.entries(JsonObject).forEach(([key, value]) => {
            if(IsPrimero){
                StringReturn += key + " = " + TypeData(value);
                IsPrimero = false;
            }
            else{
                StringReturn += " AND " + key + " = " + TypeData(value);
            }
        });

        return StringReturn;
    }
}

// function TypeData(Data){
//     if(Data == null){
//         return null;
//     }
//     else{
//         if(isNaN(Data)){
//             return "'"+Data+"'";
//         }
//         else{
//             let numeroComoTexto = Data.toString();
//             if (numeroComoTexto.charAt(0) === "0") {
//                 return `'${Data}'`
//             }
//             else {
//                 return Data
//             }
//         }
//     }
    
// }

function TypeData(Data){
    if(Data == null){
        return null;
    }
    else if(typeof Data == "boolean"){
        return Data;
    }
    else if( ( ""+Data).trim() == ""){
        return `'${Data}'`
    }
    else if(isNaN(Data)){
            return "'"+Data+"'";
    }
    else{
        let numeroComoTexto = Data.toString();
        if (numeroComoTexto.charAt(0) === "0") {
            return `'${Data}'`
        }
        else {
            return Data;
        }
    } 
}

function Recorre_Parameter(JsonObject,ObjectQuery,TypeRecord) {

    Object.entries(JsonObject).forEach(([key, value]) => {
        ObjectQuery.input(TypeRecord+"_"+key, sql.VarChar(sql.MAX), value );
    });

    return ObjectQuery;
}

function is_negative_number(number=0){
    if (Math.sign(number) === -1) {
        return true;
    }
    return false;
}

function hasUndefinedOrEmptyValue(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) {
          return `${key} está undefined.`;
        }
      }
      return false;
  }

exports.Recorre_Record = Recorre_Record;
exports.Recorre_Parameter = Recorre_Parameter;
exports.is_negative_number = is_negative_number;
exports.hasUndefinedOrEmptyValue = hasUndefinedOrEmptyValue;