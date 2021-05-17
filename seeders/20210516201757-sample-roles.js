'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('roles', [
      {
        rol: "admin"
      },
      {
        rol: "manager"
      },
      {
        rol: "accounting"
      },
      {
        rol: "employee"
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('roles', null, {})
  }
};
