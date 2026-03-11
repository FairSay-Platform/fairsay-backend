const mysql = require("mysql2/promise");
require("dotenv").config();

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';


const dbConfig = isProduction
  ? {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
      queueLimit: 0,
      ssl: { rejectUnauthorized: false }, // needed for Railway
    }
  : {
      host: process.env.LOCAL_DB_HOST,
      port: process.env.LOCAL_DB_PORT || 3306,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      database: process.env.LOCAL_DB_NAME,
      waitForConnections: true,
      connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
      queueLimit: 0,
    };

const db = mysql.createPool(dbConfig);
console.log(`MySQL Pool Created - Environment: ${process.env.NODE_ENV || 'development'}`);  
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
//   queueLimit: 0,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// console.log("MySQL Pool Created");

module.exports = db;
