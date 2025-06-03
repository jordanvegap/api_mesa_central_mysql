var mysql = require('mysql2');

const PRO_DNA_SYSTEM = mysql.createPool({
  connectionLimit:1000,
  host: "111.111.111.111",
  user: "userbd",
  password: "psw",
  database:"BD",
  dateStrings: true
});

const POOL_PRO_DNA_SYSTEM = PRO_DNA_SYSTEM.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully: PRO_DNA_SYSTEM');
  connection.release();
});

const PRU_DNA_SYSTEM = mysql.createPool({
  connectionLimit:1000,
  host: "111.111.111.111",
  user: "userbd",
  password: "psw",
  database:"BD",
  dateStrings: true
});

const POOL_PRU_DNA_SYSTEM = PRU_DNA_SYSTEM.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully: PRU_DNA_SYSTEM');
  connection.release();
});

function Get_Db_conexion(Host,Type) {
  var Host, Type, myObj;
    switch (Host) {
      case "": //CLAVE DE EMPRESA
        switch (Type) {
          case "Pro":
            return PRO_DNA_SYSTEM;
          break;
          case "Pru":
            return PRU_DNA_SYSTEM;
          break;
        }
      break;
    }
}

exports.Get_Db_conexion = Get_Db_conexion;