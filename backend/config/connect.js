require('dotenv').config();
const mysql = require('mysql');
const db = require('./db.js');

/*
const connection = mysql.createConnection(db.db);

connection.connect((err, conn) => {
    if (err) throw err;
    console.log('Conexión a la BD correcta');
});

module.exports = connection;
*/

let pool = mysql.createPool(db.db);

module.exports = pool;