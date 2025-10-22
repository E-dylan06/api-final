const db = require('./TipoEdad-dao');


function getTipoEdad() {
    return db.getTipoEdad();
};

module.exports = {
    getTipoEdad
};
