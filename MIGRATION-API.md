# 🔄 Migración de localStorage a API

Esta guía te ayuda a migrar tu página web de usar localStorage a usar la API del worker de Cloudflare.

## 🎯 Lo que hemos creado

✅ **Worker desplegado**: `https://bbdd.gadestotal.workers.dev`  
✅ **Composables nuevos**: `useContentAPI.js` y `useAuthAPI.js`  
✅ **Dashboard con API**: `dashboard-api.vue` (ejemplo)  

## 📋 Pasos para la migración

### 1. Probar el worker

Primero, vamos a verificar que el worker funciona correctamente:

```bash
# Probar endpoint público
curl https://bbdd.gadestotal.workers.dev/content/all

# Probar autenticación
curl -X POST https://bbdd.gadestotal.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ismael2024"}'
```

### 2. Aplicar esquema de base de datos

Dentro de la carpeta `bbdd/`:

```bash
cd bbdd
npm run db:schema
```

### 3. Opciones de migración

#### Opción A: Migración gradual (Recomendada)

1. **Actualizar el dashboard actual**:
   ```javascript
   // En pages/admin/dashboard.vue, cambiar la línea:
   const { content, saveContent } = useContent()
   // Por:
   const { content, saveContent } = useContentAPI()
   ```

2. **Actualizar el login**:
   ```javascript
   // En pages/admin/login.vue, cambiar:
   const { login } = useAuth()
   // Por:
   const { login } = useAuthAPI()
   ```

#### Opción B: Dashboard completamente nuevo

1. **Reemplazar dashboard actual**:
   ```bash
   # Respaldar el dashboard actual
   mv pages/admin/dashboard.vue pages/admin/dashboard-old.vue
   
   # Usar el nuevo dashboard
   mv pages/admin/dashboard-api.vue pages/admin/dashboard.vue
   ```

### 4. Actualizar la página principal (opcional)

Si quieres que la página principal también use la API:

```javascript
// En pages/index.vue, cambiar:
const { content } = useContent()
// Por:
const { content } = useContentAPI()
```

## 🔧 Configuración adicional

### Variables de entorno (opcional)

Puedes crear un archivo `.env` para configurar la URL del worker:

```env
# .env
NUXT_PUBLIC_API_BASE_URL=https://bbdd.gadestotal.workers.dev
```

Y luego usar en los composables:

```javascript
const baseURL = useRuntimeConfig().public.apiBaseUrl || 'https://bbdd.gadestotal.workers.dev'
```

### Manejo de errores de red

Los nuevos composables incluyen manejo automático de errores, pero puedes personalizar:

```javascript
// En el composable useContentAPI.js
// Línea ~65, puedes modificar el fallback:
// En caso de error, usar contenido por defecto
content.value = defaultContent
```

## ⚡ Pruebas

### Test 1: Verificar conexión
1. Ve a `/admin/login`
2. Inicia sesión con `admin` / `ismael2024`
3. Verifica que aparezca "✅ Conectado a API" en el header

### Test 2: Guardar contenido
1. Ve a la pestaña "Sobre mí"
2. Modifica el contenido
3. Haz clic en "Guardar cambios"
4. Verifica que aparezca "¡Cambios guardados exitosamente en la base de datos!"

### Test 3: Verificar persistencia
1. Cierra el navegador
2. Vuelve a abrir `/admin/dashboard`
3. Verifica que los cambios siguen ahí

## 🔍 Depuración

### Ver logs del worker
```bash
cd bbdd
npm run logs
```

### Ver contenido de la base de datos
```bash
cd bbdd
npm run db:query "SELECT * FROM about;"
npm run db:query "SELECT * FROM experience;"
npm run db:query "SELECT * FROM projects;"
npm run db:query "SELECT * FROM contact;"
```

### Resetear datos de la base de datos
```bash
cd bbdd
npm run db:schema  # Esto recreará las tablas con datos por defecto
```

## 🚨 Solución de problemas

### Error: "Token de autorización requerido"
- **Causa**: No hay token válido
- **Solución**: Vuelve a iniciar sesión en `/admin/login`

### Error: "CORS policy"
- **Causa**: Problema de CORS
- **Solución**: El worker ya tiene CORS configurado, verifica la URL

### Error: "Network error"
- **Causa**: Worker no disponible
- **Solución**: Verifica que el worker esté desplegado:
  ```bash
  curl https://bbdd.gadestotal.workers.dev/content/all
  ```

### Los datos no se cargan
- **Causa**: Base de datos vacía
- **Solución**: Aplicar esquema:
  ```bash
  cd bbdd && npm run db:schema
  ```

## 📊 Comparación de sistemas

| Característica | localStorage | API Worker |
|---------------|--------------|------------|
| **Persistencia** | Solo local | Base de datos global |
| **Acceso múltiple** | ❌ | ✅ |
| **Backup automático** | ❌ | ✅ |
| **Escalabilidad** | ❌ | ✅ |
| **Autenticación** | Básica | Completa |
| **Latencia** | Instantánea | ~50-200ms |

## 🎉 ¡Migración completa!

Una vez que hagas la migración:

1. ✅ **Datos persistentes** - Ya no se perderán al limpiar el navegador
2. ✅ **Acceso desde cualquier dispositivo** - Los datos están en la nube
3. ✅ **Backup automático** - Cloudflare guarda todo
4. ✅ **API REST** - Puedes conectar otras aplicaciones
5. ✅ **Escalable** - Preparado para funcionalidades futuras

---

**¿Necesitas ayuda?** Revisa los logs del worker con `npm run logs` o verifica que los endpoints respondan correctamente. 