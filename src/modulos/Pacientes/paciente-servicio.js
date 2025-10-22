const db = require('./paciente-dao');

function getAll(pagina) {
  return db.getAll(pagina);
}

function search(dni) {
  return db.search(dni);
}
/*function createPaciente(paciente) {
  return db.createPaciente(paciente)
}*/

module.exports = {
  getAll,
  search,
//  createPaciente
};
