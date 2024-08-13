<div align="center">
  
  # Autenticación con Google OAuth2.0
  
   ![hero]

   Login con Google en Mithril.js y Node Express
   
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
npm install
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
npm start
```

## 📁 Estructura del proyecto

```plaintext
├── server.js            # Archivo principal del servidor
├── app.js               # Archivo principal del frontend
├── package.json         # Archivo de configuración de npm
├── .env                 # Variables de entorno (excluido en .gitignore)
├── README.md            # Documentación del proyecto
└── node_modules/        # Dependencias del proyecto
```

## 🚀 Funcionamiento

- **Autenticación del Usuario**: Cuando el usuario accede al endpoint `/auth/login`, se le redirige a la página de inicio de sesión de Google. Tras iniciar sesión, Google redirige al usuario de vuelta a la URL de callback especificada (`/oauth2callback`). El servidor maneja la respuesta de Google, crea una sesión para el usuario y almacena el token de acceso.

- **Redirección a la Página del Cliente**: Después del inicio de sesión, el servidor redirige al usuario de vuelta a la página del cliente. Allí, el cliente puede obtener la información del usuario desde el endpoint `/auth/status`.

- **Gestión de Sesión**: El servidor utiliza `express-session` para gestionar las sesiones de usuario. La sesión se almacena en una cookie en el navegador, que contiene credenciales del usuario, como el token de acceso y su duración. Esta información se utiliza para verificar la autorización del usuario en futuras peticiones.
  
- **Revocación de Token**: El endpoint `/auth/logout` revoca el token de acceso de Google y destruye la sesión del usuario. Esto asegura que el token ya no sea válido y el usuario quede desconectado.

 [hero]: https://www.google.es/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png
