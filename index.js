//Configuración inicial
const db = require('./methods')
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

//Configurar directorio publico
app.use(express.static(__dirname + '/public'));

//Proteger vistas con cookie
app.use((request, response, next) => {
    // Get auth token from the cookies
    const authToken = request.cookies['AuthToken'];

    console.log(authToken)
    // Inject the user to the request
    request.user = authToken;

    next();
});

//Configuracion del engine de renderizado
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');


//Configuración de Rutas
//Index
app.get('/', (request, response) => {
    //Obtener roles y empresas
    axios.all([
            //Obntener roles
            axios.get(`${request.protocol}://${request.get('host')}/roles`),

            //Obtener empresas
            axios.get(`${request.protocol}://${request.get('host')}/empresas`)
        ])
        .then((res) => {
            roles = res[0].data;
            empresas = res[1].data;

            //Dibujar template
            response.render('index', {
                roles: roles,
                empresas: empresas
            });
        })
        .catch((err) => {
            console.log(err)
        })
});

//Dashboard
app.get('/dashboard', (request, response) => {
    if (request.user) {
        axios.all([
                //Obntener roles
                axios.get(`${request.protocol}://${request.get('host')}/roles`),

                //Obtener empresas
                axios.get(`${request.protocol}://${request.get('host')}/empresas`),

                //Obtener usuarios
                axios.get(`${request.protocol}://${request.get('host')}/usuarios`)
            ])
            .then((res) => {
                roles = res[0].data;
                empresas = res[1].data;
                usuarios = res[2].data;

                //Dibujar templaate
                response.render('dashboard', {
                    roles: roles,
                    empresas: empresas,
                    usuarios: usuarios
                });
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        response.render('index')
    }
})

//Editar Empresa
app.post('/editar-empresa/', (request, response) => {
    //Obtener ID de la empresa
    const {
        corpId
    } = request.body

    if (request.user) {
        const id = parseInt(request.params.id);
        axios.get(`${request.protocol}://${request.get('host')}/empresas/${corpId}`)
            .then((res) => {
                //Dibujar template
                response.render('editCorps', {
                    empresa: res.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        response.render('index')
    }
})

//Editar Usuario
app.post('/editar-usuario/', (request, response) => {
    //Obtener ID de la empresa
    const {
        userId
    } = request.body

    if (request.user) {
        const id = parseInt(request.params.id);
        axios.get(`${request.protocol}://${request.get('host')}/usuarios/${userId}`)
            .then((res) => {
                //Dibujar template
                response.render('editUser', {
                    usuario: res.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        response.render('index')
    }
})

//Editar Rol
app.post('/editar-rol/', (request, response) => {
    //Obtener ID de la empresa
    const {
        roleId
    } = request.body

    if (request.user) {
        const id = parseInt(request.params.id);
        axios.get(`${request.protocol}://${request.get('host')}/roles/${roleId}`)
            .then((res) => {
                //Dibujar template
                response.render('editRole', {
                    rol: res.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        response.render('index')
    }
})


//GET
app.get('/usuarios', db.getUsers);
app.get('/usuarios/:id', db.getUserById);
app.get('/empresas', db.getCorps);
app.get('/empresas/:id', db.getCorpById);
app.get('/roles', db.getRoles);
app.get('/roles/:id', db.getRoleById);

//POST
app.post('/registrar', db.register);
app.post('/login', db.usrLogin);

//Crear
app.post('/crear-empresa', db.createCorp);
app.post('/crear-usuario', db.createUser);
app.post('/crear-rol', db.createRole);

//Borrar
app.post('/borrar-empresa/:id', db.deleteCorp);
app.post('/borrar-usuario/:id', db.deleteUser);
app.post('/borrar-rol/:id', db.deleteRole);

//Editar
app.post('/actualizar-empresa/:id', db.updateCorp);
app.post('/actualizar-usuario/:id', db.updateUser);
app.post('/actualizar-rol/:id', db.updateRole);

//Para usos en pruebas
//PUT
app.put('/crear-usuario', db.createUser);
app.put('/crear-empresa', db.createCorp);
app.put('/crear-rol', db.createRole);

//DELETE
app.delete('/borrar-empresa/:id', db.deleteCorp);
app.delete('/borrar-usuario/:id', db.deleteUser);
app.delete('/borrar-rol/:id', db.deleteRole);



app.listen(port, () => {
    console.log(`Aplicación en el puerto ${port}`);
});