const db = require('./servicio-dao');

function getServices(){
    return db.getServices();
};
function getNameService(idServicio){
    return db.getNameService(idServicio);
}

module.exports={
    getServices,
    getNameService
};