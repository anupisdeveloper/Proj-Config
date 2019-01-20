const mysql = require('mysql');

const mySqlConf = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'dinga',
    database: 'test'
};

const SQLConfig = {};


let pool = mysql.createPool({
    connectionLimit: 25,
    host: mySqlConf.host,
    user: mySqlConf.user,
    password: mySqlConf.password,
    database: mySqlConf.database,
    debug: false
});

/* For Fetching and deleting data from table
    For Fetching data
     SELECT * from tableName or SELECT * from tableName WHERE tableNameId = anything

     For Deleting data from table
     DELETE FROM tableName WHERE tableColumn = anything
* */
SQLConfig.executeQuery = function (query, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        else if (connection) {
            connection.query(query, function (err, rows, fields) {
                connection.release();
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            })
        }
        else {
            return callback(true, "No Connection");
        }
    });
};


/* Using post update query we can add new row or we can update existing row
*  For adding new row
*   INSERT INTO tableName SET ?" // provide json obj at place of placeholder (?)
*
*   For updating existing row
*   UPDATE tableName SET ? WHERE columnName=anything //  provide json obj at place of placeholder (?)
* */
SQLConfig.executePostQuery = function (query, data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        else if (connection) {
            connection.query(query, data, function (err, rows, fields) {
                connection.release();
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            })
        }
        else {
            return callback(true, "No Connection");
        }
    });
};

module.exports = SQLConfig;