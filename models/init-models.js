var DataTypes = require("sequelize").DataTypes;
var _empresas = require("./empresas");
var _roles = require("./roles");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var empresas = _empresas(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  usuarios.belongsTo(empresas, { as: "empresa", foreignKey: "empresa_id"});
  empresas.hasMany(usuarios, { as: "usuarios", foreignKey: "empresa_id"});
  usuarios.belongsTo(roles, { as: "rol", foreignKey: "rol_id"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "rol_id"});

  return {
    empresas,
    roles,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
