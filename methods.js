const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');
const Pool = require('pg').Pool;
const crypto = require('crypto');
const models = require('./models');
const exphbs = require('express-handlebars');
const Op = models.Sequelize.Op;

//Modelos
const Roles = models.Roles;
const Empresas = models.Empresas;
const Usuarios = models.Usuarios;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api_test',
    password: 'Ikaros2009',
    port: 5432,
});


//Funcion para encriptar la contraseña
const getPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

//Generar Token de Inicio de Sesion
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

//Declaracion de endpoints

//Obtener Usuarios
const getUsers = (request, response) => {
    Usuarios.findAll()
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
}

//Obtener Roles
const getRoles = (request, response) => {
    Roles.findAll()
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
};

//Obtener Empresas
const getCorps = (request, response) => {
    Empresas.findAll()
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
}

//Obtener Usuario por ID
const getUserById = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    Usuarios.findByPk(id)
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
}

//Obtener Usuario por email
const getUserByEmail = (request, response) => {
    //Obtener email del evento de POST
    const email = parseInt(request.params.email);
    var condition = email ? {
        email: {
            [Op.like]: `%${email}`
        }
    } : null;

    Usuarios.findAll({
            where: condition
        })
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
}

//Obtener Rol por ID
const getRoleById = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    Roles.findByPk(id)
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
}

//Obtener Empresa por ID
const getCorpById = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    Empresas.findByPk(id)
        .then(data => {
            response.status(200).json(data)
        })
        .catch(err => {
            response.status(500)
            console.log(err)
        })
}

//Guardar Usuario
const createUser = (request, response) => {
    //Obtener datos del usuario a crear
    const {
        nombre,
        apellido,
        email,
        password,
        password_confirm,
        empresa,
        rol
    } = request.body;

    //Comprobar campos de contraseña
    if (password === password_confirm) {

        //Comprobar que el usuario existe
        var condition = email ? {
            email: {
                [Op.like]: `%${email}`
            }
        } : null;

        let existingU = '';
        try {
            Usuarios.findAll({
                    where: condition
                })
                .then(data => {
                    existingU = data;
                    if (existingU.length == 1) {
                        console.log(existingU)
                        return response.status(200).send('El Usuario ya Existe')
                    } else {
                        //Encriptar contraseña
                        const encryptedPass = getPassword(password);

                        //Guardar Usuario nuevo
                        const usuario = {
                            nombre: nombre,
                            apellido: apellido,
                            email: email,
                            password: encryptedPass,
                            rol_id: rol,
                            empresa_id: empresa,
                            ultima_vez: new Date()
                        }

                        Usuarios.create(usuario)
                            .then(data => {
                                console.log(data);
                                return response.status(200).send('Usuario Creado')
                            })
                            .catch(err => {
                                response.status(500)
                                console.log(err)
                            })
                    }
                })
                .catch(err => {
                    response.status(500)
                    console.log(err)
                })
        } catch (error) {
            console.log('Ocurrio un error')
        }
    }
}

//Login
const usrLogin = (request, response) => {
    //Obtener datos del request
    const {
        email,
        password
    } = request.body;

    const encryptedPass = getPassword(password);

    let existingU = '';
    try {
        Usuarios.findAll({
                where: {
                    email: email,
                    password: encryptedPass
                }
            })
            .then(data => {
                existingU = data;
                console.log(existingU.length)
                if (existingU.length >= 1) {
                    //console.log(existingU.length)
                    const authToken = generateAuthToken();

                    //Guardar galleta
                    response.cookie('AuthToken', authToken);

                    //Redirigir a vista protegida
                    return response.redirect('/dashboard');
                } else {
                    console.log('non')
                    return response.status(400).send('Compruebe Usuario/Contraseña e intente de nuevo')
                }
            })
            .catch(err => {
                response.status(500)
                console.log(err)
            })

        //console.log(existingU.length)

    } catch (error) {
        response.status(500).send('Ocurrio un Error')
    }



}

//Guardar Empresa
const createCorp = (request, response) => {
    //Obtener datos de la empresa a crear
    const {
        nombre_legal,
        nombre_comercial,
        rfc,
        telefono
    } = request.body;

    pool.query(
        'INSERT INTO empresas (nombre_legal, nombre_comercial, rfc, telefono) VALUES ($1, $2, $3, $4)',
        [nombre_legal, nombre_comercial, rfc, telefono],
        (error, results) => {

            if (error) {
                throw error
            }
            response.status(201).send(`Usuario: ${results.insertId} agregado con exito `);
        })
}

//Editar Usuario
const updateUser = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);
    const {
        nombre,
        apellido,
        email,
        password,
        empresa,
        rol
    } = request.body;

    pool.query(
        'UPDATE users SET nombre = $1, apellido = $2, email = $3, password = $4, empresa = $5, rol = $6',
        [nombre, apellido, email, password, empresa, rol],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Usuario: ${id} modificado`);
        }
    )
}

//Editar Empresa
const updateCorp = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);
    const {
        nombre_legal,
        nombre_comercial,
        rfc,
        telefono
    } = request.body;

    pool.query(
        'UPDATE empresas SET nombre_legal = $1, nombre_comercial = $2, rfc = $3, telefono = $4',
        [nombre_legal, nombre_comercial, rfc, telefono],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Usuario: ${id} modificado`);
        }
    )
}

//Eliminar Usuario 
const deleteUser = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    pool.query(
        'DELETE FROM users WHERE user_id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Usuario: ${id} eliminado`);
        }
    )
}

//Eliminar Empresa
const deleteCorp = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    pool.query(
        'DELETE FROM empresas WHERE empresa_id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Empresa: ${id} eliminado`);
        }
    )
}

//Exportar metodos para poder acceder a ellos
module.exports = {
    getUsers,
    getUserById,
    getRoles,
    getRoleById,
    getCorps,
    getCorpById,
    createUser,
    createCorp,
    updateUser,
    updateCorp,
    deleteUser,
    deleteCorp,
    usrLogin
}