'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('empresas', [
      {
        nombre_legal: "Sony Group Corporation",
        nombre_comercial: "Sony Group Corporation",
        rfc: "SME941001UQ3",
        telefono: "(55) 3067-1000",
        fecha_registro: new Date()
      },
      {
        nombre_legal: "Konami Holdings Corporation",
        nombre_comercial: "Konami",
        rfc: "GAM980617JE7",
        telefono: "(03) 6867-0573",
        fecha_registro: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('empresas', null, {})
  }
};
