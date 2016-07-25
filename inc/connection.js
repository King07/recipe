var mysql = require('mysql');

function Connection() {
    this.pool = null;

    this.init = function() {
        this.pool = mysql.createPool({
            connectionLimit: 100,
            host: 'us-cdbr-iron-east-04.cleardb.net',
            user: 'bf2b47dfc5e43e',
            password: '9b07c4a9',
            //database: 'recipe_api'
            database: 'heroku_fe926b47779cb32'
        });
    };

    this.acquire = function(callback) {
        this.pool.getConnection(function(err, connection) {
            callback(err, connection);
        });
    };
}

module.exports = new Connection();