# Examen para Full Stack Developer Zubut
#### Desarrollado con ExpressJS y UIKit

##### Requisitos
- Sequelize
- PostgreSQL
- Node.js

##### Setup Inicial
- Instalar las dependencias de node
> npm install 

- Configurar la conexion a la Base de Datos en "config/config.json"

- Crear la Base de Datos con el comando
> npx run db:create

- Crear y aplicar las Migraciones
> npx makemigration --name inicial -x

- Rellenar las bases de datos con los Seeds
> npm run db:seeds

- Acceder usando las credenciales
> email: admin@admin.com
> contraseña: password

