import dotenv from 'dotenv';
import mysql from 'mysql2';

// Cargamos variables de entorno
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // ¡Asegúrate de que esta línea esté!
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// IMPORTANTE: Exportamos la versión de promesas
const db = pool.promise();
export default db;