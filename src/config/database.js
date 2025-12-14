import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
console.log("Las variables de entorno fueron cargadas", process.env.DB_HOST);

/*Configuración de mi conexión de db de AWS ccon MYSQL, lo llamo pool de conxiones */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/*usar promesas para async/await*/
const promisePool = pool.promise();

/* Verificar y error handling conexión */
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error trying to connect to db (╯°□°）╯︵ ┻━┻ ");
    return;
  }
  console.log("Connected to MySQL in AWS RDS (＾▽＾)／ ");
});

export default promisePool;
