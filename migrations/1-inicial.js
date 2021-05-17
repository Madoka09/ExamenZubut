'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "empresas", deps: []
 * createTable "roles", deps: []
 * createTable "usuarios", deps: [roles, empresas]
 *
 **/

var info = {
    "revision": 1,
    "name": "inicial",
    "created": "2021-05-17T04:53:31.471Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "empresas",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "allowNull": false,
                        "autoIncrement": true
                    },
                    "nombre_legal": {
                        "type": Sequelize.STRING(50),
                        "field": "nombre_legal",
                        "allowNull": false
                    },
                    "nombre_comercial": {
                        "type": Sequelize.STRING(65),
                        "field": "nombre_comercial",
                        "allowNull": false
                    },
                    "rfc": {
                        "type": Sequelize.STRING(13),
                        "field": "rfc",
                        "allowNull": false
                    },
                    "telefono": {
                        "type": Sequelize.STRING(20),
                        "field": "telefono",
                        "allowNull": false
                    },
                    "fecha_registro": {
                        "type": Sequelize.DATEONLY,
                        "field": "fecha_registro",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "roles",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "allowNull": false,
                        "autoIncrement": true
                    },
                    "rol": {
                        "type": Sequelize.STRING(25),
                        "field": "rol",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "usuarios",
                {
                    "id": {
                        "type": Sequelize.INTEGER,
                        "field": "id",
                        "primaryKey": true,
                        "allowNull": false,
                        "autoIncrement": true
                    },
                    "nombre": {
                        "type": Sequelize.STRING(60),
                        "field": "nombre",
                        "allowNull": false
                    },
                    "apellido": {
                        "type": Sequelize.STRING(80),
                        "field": "apellido",
                        "allowNull": false
                    },
                    "email": {
                        "type": Sequelize.STRING(80),
                        "field": "email",
                        "allowNull": false
                    },
                    "password": {
                        "type": Sequelize.STRING(100),
                        "field": "password",
                        "allowNull": false
                    },
                    "rol_id": {
                        "type": Sequelize.INTEGER,
                        "field": "rol_id",
                        "references": {
                            "model": "roles",
                            "key": "id"
                        },
                        "allowNull": false
                    },
                    "empresa_id": {
                        "type": Sequelize.INTEGER,
                        "field": "empresa_id",
                        "references": {
                            "model": "empresas",
                            "key": "id"
                        },
                        "allowNull": false
                    },
                    "ultima_vez": {
                        "type": Sequelize.DATEONLY,
                        "field": "ultima_vez",
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["empresas", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["roles", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["usuarios", {
                transaction: transaction
            }]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
