const crypto = require('crypto');
const models = require('./models');
const Op = models.Sequelize.Op;

//Modelos
const Roles = models.Roles;
const Empresas = models.Empresas;
const Usuarios = models.Usuarios;

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
            response.status(500).send(err)
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
            response.status(500).send(err)
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
            response.status(500).send(err)
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
            response.status(500).send(err)
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
            response.status(500).send(err)
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
            response.status(500).send(err)
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
            response.status(500).send(err)
            console.log(err)
        })
}

//Guardar Usuario
const createUser = (request, response) => {
    //Obtener datos del usuario a crear
    if (Object.keys(request.query).length === 0) {
        var {
            nombre,
            apellido,
            email,
            password,
            password_confirm,
            empresa,
            rol
        } = request.body;
    } else {
        var {
            nombre,
            apellido,
            email,
            password,
            password_confirm,
            empresa,
            rol
        } = request.query;
    }

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
                                if (Object.keys(request.query).length === 0) {
                                    return response.redirect('/dashboard');
                                } else {
                                    return response.send(200);
                                }
                            })
                            .catch(err => {
                                response.status(500).send(err)
                                console.log(err)
                            })
                    }
                })
                .catch(err => {
                    response.status(500).send(err)
                    console.log(err)
                })
        } catch (error) {
            console.log('Ocurrio un error')
        }
    }
}

//Guardar Usuario
const register = (request, response) => {
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
                                console.log('registro creado')
                                return response.redirect('/')
                            })
                            .catch(err => {
                                response.status(500).send(err)
                                console.log(err)
                            })

                    }
                })
                .catch(err => {
                    response.status(500).send(err)
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
                if (existingU.length >= 1) {
                    const authToken = generateAuthToken();

                    //Guardar galleta
                    response.cookie('AuthToken', authToken);

                    //Redirigir a vista protegida
                    return response.redirect('/dashboard');
                } else {
                    return response.status(400).send('Compruebe Usuario/Contraseña e intente de nuevo')
                }
            })
            .catch(err => {
                response.status(500).send(err);
            })

        //console.log(existingU.length)

    } catch (error) {
        return response.status(500).send(error);
    }

}

//Guardar Empresa
const createCorp = (request, response) => {
    //Obtener datos del request
    if (Object.keys(request.query).length === 0) {
        var {
            nombre_legal,
            nombre_comercial,
            rfc,
            telefono
        } = request.body;
    } else {
        var {
            nombre_legal,
            nombre_comercial,
            rfc,
            telefono
        } = request.query;
    }
    //Comprobar que la empresa existe
    let existingCorp = '';
    try {
        Empresas.findAll({
                where: {
                    nombre_legal: nombre_legal,
                    rfc: rfc
                }
            })
            .then(data => {
                existingCorp = data;
                if (existingCorp.length >= 1) {
                    return response.send('La Empresa ya Existe')
                } else {
                    //Guardar instancia de empresa nueva
                    const newCorp = {
                        nombre_legal: nombre_legal,
                        nombre_comercial: nombre_comercial,
                        rfc: rfc,
                        telefono: telefono,
                        fecha_registro: new Date()
                    }

                    //Guardar nueva empresa
                    Empresas.create(newCorp)
                        .then(data => {
                            console.log('OK')
                            if (Object.keys(request.query).length === 0) {
                                return response.redirect('/dashboard');
                            } else {
                                return response.send(200);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                }
            })
    } catch (error) {
        return response.status(500).send(error);
    }
}

//Crear Rol
const createRole = (request, response) => {
    //Obtener datos del request
    if (Object.keys(request.query).length === 0) {
        var {
            role
        } = request.body;
    } else {
        var {
            role
        } = request.query;
    }
    //Comprobar que el rol existe
    let existingRole = '';
    try {
        Roles.findAll({
                where: {
                    rol: role
                }
            })
            .then(data => {
                existingRole = data;
                if (existingRole.length >= 1) {
                    return response.send('El Rol ya Existe')
                } else {
                    //Guardar instancia de nuevo rol
                    const newRole = {
                        rol: role
                    }

                    //Guardar nuevo rol
                    Roles.create(newRole)
                        .then(data => {
                            console.log('OK')
                            if (Object.keys(request.query).length === 0) {
                                return response.redirect('/dashboard');
                            } else {
                                return response.send(200);
                            }
                        })
                        .catch(err => {
                            response.status(500).send(err);
                        })
                }
            })
    } catch (error) {
        return response.status(500).send(error);
    }
}

//Editar Usuario
const updateUser = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    //Actualizar registro
    Usuarios.update(request.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                console.log('OK')
                return response.redirect('/dashboard')
            } else {
                return response.send(500)
            }
        })
        .catch(err => {
            response.status(500).send(err)
        })

}

//Editar Empresa
const updateCorp = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    //Actualizar registro
    Empresas.update(request.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                console.log('OK')
                return response.redirect('/dashboard')
            } else {
                return response.send(500)
            }
        })
        .catch(err => {
            response.status(500).send(err)
        })
}

//Editar Rol
const updateRole = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    //Actualizar registro
    Roles.update(request.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                console.log('OK')
                return response.redirect('/dashboard')
            } else {
                return response.send(500)
            }
        })
        .catch(err => {
            response.status(500).send(err)
        })
}

//Eliminar Usuario 
const deleteUser = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    //Borrar usuario
    Usuarios.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                console.log('OK')
                return response.redirect('/dashboard')
            } else {
                return response.send(500)
            }
        })
        .catch(err => {
            response.status(500).send(err)
        })
}

//Eliminar Empresa
const deleteCorp = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    //Borrar empresa
    Empresas.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                console.log('OK')
                return response.redirect('/dashboard')
            } else {
                return response.send(500)
            }
        })
        .catch(err => {
            response.status(500).send(err)
        })
}

//Borrar Rol
const deleteRole = (request, response) => {
    //Obtener ID del evento de POST
    const id = parseInt(request.params.id);

    //Borrar empresa
    Roles.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                console.log('OK')
                return response.redirect('/dashboard')
            } else {
                return response.send(500)
            }
        })
        .catch(err => {
            response.status(500).send(err)
        })
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
    usrLogin,
    register,
    createRole,
    deleteRole,
    updateRole
}