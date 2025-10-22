const db = require('./documento-dao');

function getDocumentos() {
    return db.getDocumentos();
};

module.exports = {
    getDocumentos
};