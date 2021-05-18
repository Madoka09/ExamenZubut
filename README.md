# Examen para Full Stack Developer Zubut
#### Desarrollado con ExpressJS y UIKit

##### Pre Requisitos
- PostgreSQL
- Node.js

##### Setup Inicial
- Una vez configurado PostgreSQL porfavor, reemplaza las configuraciones en el archivo "config/config.json"

- Instalar las dependencias de node
> npm install 

- Crear la Base de Datos con el comando
> npm run db:create

- Crear y aplicar las Migraciones
> npx makemigration --name inicial -x

- Rellenar las bases de datos con los Seeds
> npm run db:seeds

- Correr el proyecto con el comando
> npm run start-nodemon

- La aplicación estará funcionando en 
> localhost:3000

- Para usar jest comentar el bloque de codigo 209-211
```javascript
app.listen(port, () => {
    console.log(`Aplicación en el puerto ${port}`);
});
```

- Para usar jest tambien descomentar la linea 214
```javascript
//module.exports = app
```

- Finalmente ejecutar las pruebas con
> npm test

- Acceder usando las credenciales
> email: admin@admin.com
> contraseña: password

