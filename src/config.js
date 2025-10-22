const app = require('./app');

// configuracion.js
require('dotenv').config();

module.exports = {
    app : {
        port:process.env.PORT,
        jwt_secret: process.env.JWT_SECRET
    },
    sql: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    }
};
