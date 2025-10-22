
const sql = require('mssql');
const config = require('../config');


const dbconfig = {
  user: config.sql.user,
  password: config.sql.password,
  server: config.sql.server,
  database: config.sql.database,
  port: parseInt(config.sql.port,10),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
const poolPromise = new sql.ConnectionPool(dbconfig)
  .connect()
  .then(pool => {
    console.log('✅ Conexión a SQL Server exitosa');
    return pool
  })
  .catch(err => {
    console.error('❌ Error de conexión con SQL Server:', err);
    throw err
  });

module.exports = poolPromise;
