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

/*
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
*/

//Configuración de Rutas
var roles = '';
var empresas = '';

//Index
app.get('/', (request, response) => {
    //Obtener roles y empresas
    axios.all([
            //Obntener roles
            axios.get(`${request.protocol}://${request.get('host')}/roles`),

            //Obtener empresas
            axios.get(`${request.protocol}://${request.get('host')}/empresas`)
        ])
        .then((response) => {
            console.log(response[0].data)
            console.log(response[1].data)
            roles = response[0].data;
            empresas = response[1].data;
        })
        .catch((err) => {
            console.log(err)
        })
    response.render('index', {
        roles: roles,
        empresas: empresas
    });
});

//Dashboard
app.get('/dashboard', (request, response) => {
    if(request.user){
        axios.all([
            //Obntener roles
            axios.get(`${request.protocol}://${request.get('host')}/roles`),

            //Obtener empresas
            axios.get(`${request.protocol}://${request.get('host')}/empresas`),

            //Obtener usuarios
            axios.get(`${request.protocol}://${request.get('host')}/usuarios`)
        ])
        .then((response) => {
            roles = response[0].data;
            empresas = response[1].data;
            usuarios = response[2].data;
        })
        .catch((err) => {
            console.log(err)
        })
        response.render('dashboard', {
            roles: roles,
            empresas: empresas,
            usuarios: usuarios
        });
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
app.post('/registrar', db.createUser);
app.post('/login', db.usrLogin);
app.post('/empresas', db.createCorp);

//PUT
app.put('/usuarios', db.createUser);
app.put('/empresas', db.createCorp);

//DELETE
app.delete('/usuarios', db.deleteUser);
app.delete('/empresas', db.deleteCorp);



app.listen(port, () => {
    console.log(`Aplicación en el puerto ${port}`);
});