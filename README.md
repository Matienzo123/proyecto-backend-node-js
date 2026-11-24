# API REST - Gestión de productos

API REST desarrollada con Node.js y Express para gestionar productos almacenados en Firebase Firestore. La API permite consultar productos de forma pública y crear, actualizar o eliminar productos mediante autenticación JWT.

## Tecnologías

| Tecnología | Versión | Uso |
| --- | --- | --- |
| Node.js | 18 o superior recomendado | Entorno de ejecución |
| Express | ^5.3.0 | Servidor HTTP y enrutamiento |
| Firebase / Firestore | ^13.2.0 | Almacenamiento de productos |
| jsonwebtoken | ^9.0.3 | Creación y validación de tokens JWT |
| body-parser | ^2.4.0 | Lectura del cuerpo JSON de las solicitudes |
| cors | ^2.8.6 | Configuración de acceso entre orígenes |
| dotenv | ^18.0.10 | Carga de variables de entorno |
| nodemon | ^3.1.14 | Reinicio automático durante el desarrollo |

## Requisitos

- Node.js 18 o una versión posterior.
- npm.
- Un proyecto de Firebase con una base de datos Firestore.
- Una colección llamada `products` en Firestore.

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

## Configuración de Firebase y JWT

Creá un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
JWT_SECRET_KEY=
```

Los valores de Firebase se encuentran en **Configuración del proyecto > Tus aplicaciones** en la consola de Firebase. `JWT_SECRET_KEY` puede ser cualquier cadena larga y aleatoria que uses para firmar los tokens.

> No compartas ni subas el archivo `.env`. Este proyecto ya incluye `.env` en `.gitignore`.

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

El servidor se ejecuta en `http://localhost:3000`.

## Credenciales de prueba

La autenticación está implementada con un usuario fijo en el controlador de login:

```text
Email: admin@gmail.com
Contraseña: 123456
```

## Endpoints

### Ruta base

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Devuelve el texto `PROYECTO FINAL` |

### Autenticación

| Método | Ruta | Descripción | Protección |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Obtiene un token JWT | Pública |

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gmail.com\",\"password\":\"123456\"}"
```

Respuesta exitosa:

```json
{
  "token": "..."
}
```

Respuestas posibles:

- `200 OK`: credenciales válidas.
- `401 Unauthorized`: credenciales inválidas o faltantes.

### Productos

| Método | Ruta | Descripción | Protección |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Obtiene todos los productos | Pública |
| `GET` | `/api/products?category=X` | Filtra por el campo `categoria` | Pública |
| `GET` | `/api/products/:id` | Obtiene un producto por su ID | Pública |
| `POST` | `/api/products/create` | Crea un producto | JWT |
| `PUT` | `/api/products/:id` | Actualiza un producto | JWT |
| `DELETE` | `/api/products/:id` | Elimina un producto | JWT |

## Ejemplos de uso

El objeto creado en Firestore puede contener los campos que necesites. Por ejemplo:

```json
{
  "nombre": "Notebook",
  "precio": 850000,
  "categoria": "Tecnología",
  "stock": 10
}
```

### Obtener todos los productos

```bash
curl http://localhost:3000/api/products
```

### Filtrar por categoría

El valor enviado en `category` se compara con el campo `categoria` de los documentos:

```bash
curl "http://localhost:3000/api/products?category=Tecnología"
```

Cuando no hay coincidencias, la API responde `404` con `message: "¡Produto/s no encontrado/s!"`.

### Obtener un producto por ID

```bash
curl http://localhost:3000/api/products/ID_DEL_PRODUCTO
```

### Crear un producto

Primero obtené el token con `/auth/login` y enviarlo en el encabezado `Authorization`:

```bash
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d "{\"nombre\":\"Notebook\",\"precio\":850000,\"categoria\":\"Tecnología\",\"stock\":10}"
```

Respuesta exitosa (`201`):

```json
{
  "mensaje": "¡Producto creado con éxito!",
  "data": {
    "id": "ID_GENERADO_POR_FIRESTORE",
    "nombre": "Notebook",
    "precio": 850000,
    "categoria": "Tecnología",
    "stock": 10
  }
}
```

### Actualizar un producto

La actualización reemplaza únicamente los campos incluidos en el cuerpo:

```bash
curl -X PUT http://localhost:3000/api/products/ID_DEL_PRODUCTO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d "{\"precio\":790000,\"stock\":7}"
```

Respuesta exitosa (`200`):

```json
{
  "mensaje": "¡Producto actualizado correctamente!",
  "data": {
    "id": "ID_DEL_PRODUCTO",
    "precio": 790000,
    "stock": 7
  }
}
```

### Eliminar un producto

```bash
curl -X DELETE http://localhost:3000/api/products/ID_DEL_PRODUCTO \
  -H "Authorization: Bearer TU_TOKEN"
```

Respuesta exitosa (`200`):

```json
{
  "mensaje": "¡Producto eliminado correctamente!",
  "idEliminado": "ID_DEL_PRODUCTO"
}
```

## Autenticación JWT

Las rutas protegidas esperan este encabezado:

```text
Authorization: Bearer <token>
```

- El token expira después de `1 hora`.
- Si falta el token, el middleware responde `401 Unauthorized`.
- Si el token no es válido o expiró, responde `403 Forbidden`.
- Al expirar el token, repetí el login para obtener uno nuevo.

## Códigos de estado

| Código | Significado |
| --- | --- |
| `200` | Operación completada |
| `201` | Producto creado |
| `400` | Datos obligatorios faltantes o cuerpo vacío |
| `401` | Token ausente o credenciales inválidas |
| `403` | Token inválido o expirado |
| `404` | Producto o ruta no encontrada |
| `500` | Error interno o de conexión con Firebase |

Las respuestas de error son JSON y también pueden incluir un campo `error` con el detalle.

## Estructura del proyecto

```text
entrega-final/
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── src/
    ├── controllers/
    │   ├── auth.controller.js
    │   └── products.controllers.js
    ├── data/
    │   └── data.js
    ├── middlewares/
    │   └── authentication.js
    ├── models/
    │   └── products.models.js
    ├── routes/
    │   ├── auth.routes.js
    │   └── products.routes.js
    ├── services/
    │   └── products.services.js
    └── utils/
        └── token-generator.js
```

## Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Cliente
  -> index.js
  -> routes
  -> controllers
  -> services
  -> models
  -> Firebase Firestore
```

- **Routes:** declaran los endpoints y agregan el middleware JWT a las rutas protegidas.
- **Controllers:** reciben las solicitudes HTTP y construyen las respuestas.
- **Services:** coordinan la lógica entre controladores y modelos.
- **Models:** ejecutan las operaciones sobre la colección `products`.
- **Middlewares:** verifican la autenticación JWT.
- **Data:** configura e inicializa Firebase.

Los middlewares globales aplican CORS, interpretación JSON y logging. El middleware de autenticación se ejecuta únicamente en `POST /api/products/create`, `PUT /api/products/:id` y `DELETE /api/products/:id`.
