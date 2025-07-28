# Worker de Base de Datos para la Página Web de Ismael

Este worker de Cloudflare Workers proporciona una API REST completa para gestionar el contenido de la página web de Ismael, incluyendo autenticación y persistencia en base de datos D1.

## 🚀 Configuración Inicial

### 1. Configurar la Base de Datos D1

```bash
# Crear la base de datos D1
wrangler d1 create my-db-name

# Aplicar el esquema
wrangler d1 execute my-db-name --file=./schema.sql
```

### 2. Actualizar wrangler.jsonc

Asegúrate de que el `database_id` en `wrangler.jsonc` coincida con el ID generado por el comando anterior.

### 3. Desplegar el Worker

```bash
# Desarrollo local
npm run dev

# Desplegar a producción
npm run deploy
```

## 📋 API Endpoints

### Autenticación

#### POST `/auth/login`
Autentica un usuario administrador.

**Request:**
```json
{
  "username": "admin",
  "password": "ismael2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "YWRtaW46aXNtYWVsMjAyNA=="
}
```

### Endpoints Públicos (Solo GET)

#### GET `/content/all`
Obtiene todo el contenido de la página web.

#### GET `/content/about`
Obtiene la información "Sobre mí".

#### GET `/content/experience`
Obtiene la experiencia profesional.

#### GET `/content/projects`
Obtiene los proyectos destacados.

#### GET `/content/contact`
Obtiene la información de contacto.

### Endpoints de Administración (Requieren Autenticación)

Todos los endpoints de administración requieren el header:
```
Authorization: Bearer <token>
```

#### Sobre mí
- **PUT** `/admin/about` - Actualizar información personal

#### Experiencia Profesional
- **GET** `/admin/experience` - Obtener experiencias
- **POST** `/admin/experience` - Crear nueva experiencia
- **PUT** `/admin/experience/bulk` - Actualizar todas las experiencias
- **PUT** `/admin/experience/{id}` - Actualizar experiencia específica
- **DELETE** `/admin/experience/{id}` - Eliminar experiencia específica

#### Proyectos
- **GET** `/admin/projects` - Obtener proyectos
- **POST** `/admin/projects` - Crear nuevo proyecto
- **PUT** `/admin/projects/bulk` - Actualizar todos los proyectos
- **PUT** `/admin/projects/{id}` - Actualizar proyecto específico
- **DELETE** `/admin/projects/{id}` - Eliminar proyecto específico

#### Contacto
- **PUT** `/admin/contact` - Actualizar información de contacto

## 🛠️ Ejemplos de Uso

### Actualizar "Sobre mí"
```bash
curl -X PUT https://tu-worker.tu-subdominio.workers.dev/admin/about \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sobre mí",
    "content": "Nueva descripción profesional..."
  }'
```

### Crear nueva experiencia
```bash
curl -X POST https://tu-worker.tu-subdominio.workers.dev/admin/experience \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Ingeniero Senior",
    "company": "Nueva Empresa S.A.",
    "period": "2024 - Presente",
    "description": "Descripción del nuevo puesto..."
  }'
```

### Actualizar todas las experiencias
```bash
curl -X PUT https://tu-worker.tu-subdominio.workers.dev/admin/experience/bulk \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "position": "Ingeniero Senior",
        "company": "Empresa 1",
        "period": "2023 - Presente",
        "description": "Descripción..."
      },
      {
        "position": "Ingeniero Junior",
        "company": "Empresa 2",
        "period": "2020 - 2023",
        "description": "Descripción..."
      }
    ]
  }'
```

## 🔒 Seguridad

- Todas las rutas de administración requieren autenticación
- Las credenciales por defecto son:
  - **Usuario:** `admin`
  - **Contraseña:** `ismael2024`
- El token de autenticación se genera usando Base64 simple (para producción, considera usar JWT)

## 🗃️ Estructura de la Base de Datos

### Tabla `about`
- `id` - Clave primaria
- `title` - Título de la sección
- `content` - Contenido descriptivo
- `updated_at` - Fecha de última actualización

### Tabla `experience`
- `id` - Clave primaria
- `position` - Cargo/posición
- `company` - Empresa
- `period` - Período de trabajo
- `description` - Descripción del puesto
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

### Tabla `projects`
- `id` - Clave primaria
- `title` - Título del proyecto
- `description` - Descripción del proyecto
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

### Tabla `contact`
- `id` - Clave primaria
- `title` - Título de la sección de contacto
- `description` - Descripción
- `email` - Dirección de correo
- `button_text` - Texto del botón de contacto
- `updated_at` - Fecha de última actualización

### Tabla `admin_users`
- `id` - Clave primaria
- `username` - Nombre de usuario
- `password_hash` - Hash de la contraseña
- `created_at` - Fecha de creación

## 🚨 Comandos Útiles

```bash
# Ver logs del worker
wrangler tail

# Ejecutar consultas en la base de datos
wrangler d1 execute my-db-name --command="SELECT * FROM about;"

# Hacer backup de la base de datos
wrangler d1 export my-db-name --output=backup.sql

# Importar datos a la base de datos
wrangler d1 execute my-db-name --file=backup.sql
```

## 🔄 Integración con el Frontend

Para integrar este worker con tu frontend Nuxt.js, puedes crear un nuevo composable que use la API en lugar de localStorage:

```javascript
// composables/useContentAPI.js
export const useContentAPI = () => {
  const baseURL = 'https://tu-worker.tu-subdominio.workers.dev'
  
  const getContent = async () => {
    const response = await fetch(`${baseURL}/content/all`)
    return await response.json()
  }
  
  const saveContent = async (section, data, token) => {
    const response = await fetch(`${baseURL}/admin/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
  
  return { getContent, saveContent }
}
``` 