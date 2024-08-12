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

Usa el fichero .env.example proporcionado para añadir las variables necesarias para el funcionamiento del proyecto.

 
```env
CLIENT_ID=tu-google-client-id
CLIENT_SECRET=tu-google-client-secret
REDIRECT_URL=http://localhost:3000/oauth2callback
PORT=3000
```
> [!NOTE]
> *CLIENT_ID* y *CLIENT_SECRET*: las credenciales de google
>
> *REDIRECT_URL* tiene que ser una URL de redireccionamiento autorizado en la consola de Google (incluyendo http:// o https://)
> 
> *PORT*: el puerto del servidor


### 4. Inicia el servidor

Para iniciar el servidor, usa el siguiente comando:

```bash
npm start
```

### 5. Inicia el cliente

Para iniciar el cliente, simplemente abre index.html, por ejemplo con LiveServer.

## 📁 Estructura del proyecto

```plaintext
├── server.js            # Archivo principal del servidor
├── package.json         # Archivo de configuración de npm
├── .env                 # Variables de entorno (excluido en .gitignore)
├── README.md            # Documentación del proyecto
└── node_modules/        # Dependencias del proyecto
```

## 🚀 Funcionamiento

- OAuth2 con Google: El servidor implementa el flujo de autenticación OAuth2 con Google.
  - Primero, desde el cliente se le redirige al endpoint /auth/login, que a su vez redirige a la página de inicio de sesión de Google, allí crea la sesión y el token para devolver hacia ***CALLBACK_URL*** la información una vez logueado.

    Se ha configurado que este callback vuelva a redirigr a la página del cliente, donde se mostrará su información desde el endpoint /auth/status.
    
- Gestión de Sesión: Utiliza express-session para manejar las sesiones de usuario.
  - Se guarda una sesión en forma de cookie en el navegador, que contiene credenciales del usuario, como el token y su duración, este más adelante se usa para verificar la autorización del usuario en las peticiones.
    
- Revocación de Token: El endpoint /auth/logout revoca el token de acceso de Google y destruye la sesión.
  - Una vez se cierre la sesión también se revocará el token JWT

 [hero]: https://www.google.es/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png
