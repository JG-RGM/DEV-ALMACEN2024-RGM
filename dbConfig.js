const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  database: 'RGM',
  user: 'root',
  password: 'rgm123456'
};

// const dbConfig = {
//     host: 'localhost',
//     port: 3306,
//     database: 'RGM',
//     user: 'root',
//     password: '123456'
//   };
  
  


const db = mysql.createPool(dbConfig);

module.exports = db;
