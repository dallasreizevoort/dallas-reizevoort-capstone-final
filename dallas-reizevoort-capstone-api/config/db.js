import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


//sql db connection

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  pool
    .getConnection()
    .then((connection) => {
      console.log("Connected to database");
      connection.release();
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });


export default pool;