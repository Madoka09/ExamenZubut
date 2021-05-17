'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('usuarios', [
      {
        nombre: "Juan Francisco",
        apellido: "Galvan",
        email: "juan@juan.com",
        password: "7NcYcNGWMxapfjrDQIyYNa2M8PPBvHA1J8MCZVNPda4=",
        rol_id: 1,
        empresa_id: 1,
        ultima_vez: new Date()
      },
      {
        nombre: "John",
        apellido: "Doe",
        email: "john@doe.com",
        password: "bKE9UspwyIPg8LsQHkJaiehiTeUdstI5JZOvaoQRgJA=",
        rol_id: 2,
        empresa_id: 1,
        ultima_vez: new Date()
      },
      {
        nombre: "Jane",
        apellido: "Doe",
        email: "jane@doe.com",
        password: "bKE9UspwyIPg8LsQHkJaiehiTeUdstI5JZOvaoQRgJA=",
        rol_id: 3,
        empresa_id: 2,
        ultima_vez: new Date()
      },
      {
        nombre: "Fulano",
        apellido: "De Tak",
        email: "fulano@detal.com",
        password: "bKE9UspwyIPg8LsQHkJaiehiTeUdstI5JZOvaoQRgJA=",
        rol_id: 4,
        empresa_id: 1,
        ultima_vez: new Date()
      },
      {
        nombre: "Jesus",
        apellido: "Cristo",
        email: "admin@admin.com",
        password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
        rol_id: 1,
        empresa_id: 2,
        ultima_vez: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('usuarios', null, {})
  }
};
