<div align="center">
  
  # Autenticación con Google OAuth2.0
  
   ![hero]

   Login con Google en Mithril.js y PHP
   
</div>

## 🛠️ Configuración del proyecto

### 1. Clonar el repositorio

Primero, clona el repositorio en tu máquina local:

```bash
git clone https://github.com/ElliotLuque/google-oauth2.0.git
cd google-oauth2.0
```

### 2. Instalar dependencias


Instala todas las dependencias del proyecto usando npm:

```bash
composer install
```

### 3. Configura variables de entorno

> [!IMPORTANT]
> Desde la consola de Google deberás habilitar la API de **People** y crear unas credenciales de autorización para usar en este proyecto. Más información: [Google OAuth Web Server](https://developers.google.com/identity/protocols/oauth2/web-server?hl=es-419)

Usa el fichero .env.example proporcionado para crear un archivo .env y añadir las variables necesarias para el funcionamiento del proyecto.

 
```env
CLIENT_ID=tu-google-client-id
CLIENT_SECRET=tu-google-client-secret
CLIENT_URL=http://localhost:5555
CALLBACK_URL=http://localhost:3000/oauth2callback
```
> [!NOTE]
> *CLIENT_ID* y *CLIENT_SECRET*: las credenciales de google
>
> *CLIENT_URL*: la url del cliente frontend a donde redireccionará después de iniciar sesión
>
> *CALLBACK_URL* tiene que ser una URL de redireccionamiento autorizado en la consola de Google (incluyendo http:// o https://)
> 


### 4. Inicia el servidor

Para iniciar el servidor, usa el siguiente comando:

```bash
php -S localhost:3000
```

### 5. Inicia el cliente

Para iniciar el cliente, simplemente abre index.html, por ejemplo con LiveServer.

## 📁 Estructura del proyecto

```plaintext
├── index.php           # Archivo principal del servidor
├── app.js               # Archivo principal del frontend
├── composer.json        # Archivo de configuración de Composer
├── .env                 # Variables de entorno (excluido en .gitignore)
├── README.md            # Documentación del proyecto
└── vendor/              # Dependencias del proyecto
```

## 🚀 Funcionamiento

- **Autenticación del Usuario**: Cuando el usuario accede al endpoint `/auth/login`, se le redirige a la página de inicio de sesión de Google. Tras iniciar sesión, Google redirige al usuario de vuelta a la URL de callback especificada, donde el servidor crea una sesión y guarda el token de acceso recibido.

- **Redirección a la Página del Cliente**: Después del inicio de sesión, el servidor redirige al usuario a la página del cliente. Allí, el cliente puede obtener la información del usuario mediante el endpoint `/auth/status`.
    
- **Gestión de Sesión**: PHP maneja las sesiones utilizando cookies. Una vez que el usuario está autenticado, el servidor almacena el token de acceso en la sesión del usuario. Esta sesión se mantiene en una cookie en el navegador, que se utiliza para verificar la autorización del usuario en futuras peticiones.
    
- **Revocación de Token**: El endpoint `/auth/logout` se encarga de revocar el token de acceso de Google y destruir la sesión del usuario. Esto asegura que el token ya no sea válido y el usuario quede desconectado.

![loginflow]

[hero]: https://www.google.es/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png
[loginflow]: https://github.com/user-attachments/assets/93ba44f0-0568-4e3f-a795-3759e83af7e6
