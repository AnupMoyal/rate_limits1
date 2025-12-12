import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"Anup@1568",
    database:"rate_limiter",
    waitForConnections:true,
    connectionLimit:10,
});
 export default pool;