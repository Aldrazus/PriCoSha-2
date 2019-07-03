var mysql = require('mysql');
var config = require('./config');
var util = require('util');


//  TODO: Put this in a config.
var pool = mysql.createPool(config.pool);

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

//  Pinging database
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }

    }

    if (connection) connection.release();

        return
})

//  Promisify query function for async stuff
pool.query = util.promisify(pool.query);

module.exports = pool;