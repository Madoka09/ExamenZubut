const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Empresas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_legal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nombre_comercial: {
      type: DataTypes.STRING(65),
      allowNull: false
    },
    rfc: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'empresas',
    schema: 'public',
    timestamps: false,
  });
};
