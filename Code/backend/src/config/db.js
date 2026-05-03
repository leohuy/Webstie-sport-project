import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Kiểm tra kết nối
db.getConnection((err, connection) => {
    if (err) {
        console.error("loi:", err);
    } else {
        console.log("ket noi MySQL thanh cong");
        connection.release();
    }
});

export default db;