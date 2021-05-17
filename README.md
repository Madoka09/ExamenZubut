# Examen para Full Stack Developer Zubut
#### Desarrollado con ExpressJS y UIKit

##### Pre Requisitos
- PostgreSQL
- Node.js

##### Setup Inicial
- Una vez configurado PostgreSQL porfavor, reemplaza las configuraciones en el archivo "config/config.json"

- Inicializar Sequelize
> npx sequelize-cli init

- Instalar las dependencias de node
> npm install 

- Crear la Base de Datos con el comando
> npx run db:create

- Crear y aplicar las Migraciones
> npx makemigration --name inicial -x

- Rellenar las bases de datos con los Seeds
> npm run db:seeds

- Acceder usando las credenciales
> email: admin@admin.com
> contraseña: password

