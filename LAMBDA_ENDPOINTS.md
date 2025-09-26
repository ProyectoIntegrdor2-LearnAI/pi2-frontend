# Configuración de Endpoints para AWS Lambda

## 🚀 URLs de Lambda Functions

Este proyecto está configurado para conectarse con múltiples Lambda functions en AWS. Aquí están los endpoints que necesitas configurar:

### 📋 Variables de Entorno Requeridas

Copia el archivo `.env.example` a `.env` y actualiza las siguientes URLs con tus endpoints reales de AWS Lambda:

```bash
# URLs de Lambda Functions
REACT_APP_AUTH_LAMBDA_URL=https://your-auth-lambda.execute-api.REGION.amazonaws.com/STAGE
REACT_APP_CHAT_LAMBDA_URL=https://your-chat-lambda.execute-api.REGION.amazonaws.com/STAGE
REACT_APP_LEARNING_PATH_LAMBDA_URL=https://your-learning-path-lambda.execute-api.REGION.amazonaws.com/STAGE
REACT_APP_COURSES_LAMBDA_URL=https://your-courses-lambda.execute-api.REGION.amazonaws.com/STAGE
REACT_APP_ANALYTICS_LAMBDA_URL=https://your-analytics-lambda.execute-api.REGION.amazonaws.com/STAGE
REACT_APP_SEARCH_LAMBDA_URL=https://your-search-lambda.execute-api.REGION.amazonaws.com/STAGE
```

### 🔧 Cómo Obtener las URLs de Lambda

1. **Ve a AWS Console → Lambda**
2. **Selecciona tu función Lambda**
3. **Ve a Configuration → Triggers**
4. **Busca API Gateway**
5. **Copia la URL del endpoint**

### 📡 Endpoints por Servicio

#### 🔐 Autenticación (`AUTH_LAMBDA`)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Refrescar token
- `POST /auth/logout` - Cerrar sesión

#### 🤖 Chat con IA (`CHAT_LAMBDA`)
- `POST /chat/session` - Enviar mensaje
- `GET /chat/session/:id` - Obtener sesión
- `PUT /chat/session/:id` - Actualizar sesión
- `DELETE /chat/session/:id` - Eliminar sesión

#### 🗺️ Rutas de Aprendizaje (`LEARNING_PATH_LAMBDA`)
- `POST /learning-path/generate` - Generar ruta
- `PUT /learning-path/update` - Actualizar ruta
- `POST /learning-path/clone` - Clonar ruta
- `DELETE /learning-path/:id` - Eliminar ruta

#### 📚 Cursos (`COURSES_LAMBDA`)
- `GET /courses` - Obtener todos los cursos
- `GET /courses/trending` - Cursos populares
- `GET /courses/categories` - Categorías
- `POST /courses/favorites` - Agregar a favoritos

#### 📊 Analíticas (`ANALYTICS_LAMBDA`)
- `GET /analytics/popular-courses` - Cursos populares
- `GET /analytics/user-engagement` - Engagement de usuario
- `GET /analytics/stats` - Estadísticas generales

#### 🔍 Búsqueda (`SEARCH_LAMBDA`)
- `POST /search` - Búsqueda principal
- `GET /search/filters` - Filtros disponibles

### 🛠️ Configuración para Desarrollo

Para desarrollo local con mocks:
```bash
REACT_APP_MOCK_API=true
REACT_APP_DEBUG=true
```

Para producción con AWS Lambda:
```bash
REACT_APP_MOCK_API=false
REACT_APP_DEBUG=false
```

### 🌍 CORS Configuration

Asegúrate de que tus Lambda functions tengan CORS habilitado:

```javascript
// En tu Lambda function
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
```

### 🔑 Autenticación

Los endpoints que requieren autenticación esperan un header:
```
Authorization: Bearer <your-jwt-token>
```

El token se almacena automáticamente en `localStorage` después del login exitoso.

### 📝 Ejemplo de Configuración Completa

```bash
# .env
REACT_APP_AUTH_LAMBDA_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_CHAT_LAMBDA_URL=https://def456.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_LEARNING_PATH_LAMBDA_URL=https://ghi789.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_COURSES_LAMBDA_URL=https://jkl012.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_ANALYTICS_LAMBDA_URL=https://mno345.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_SEARCH_LAMBDA_URL=https://pqr678.execute-api.us-east-1.amazonaws.com/prod

REACT_APP_AWS_REGION=us-east-1
REACT_APP_STAGE=prod
REACT_APP_MOCK_API=false
REACT_APP_DEBUG=false
```

### ✅ Verificar Conexión

Para verificar que los endpoints están funcionando:

1. **Abre Developer Tools (F12)**
2. **Ve a la pestaña Network**
3. **Interactúa con la aplicación**
4. **Verifica que las llamadas HTTP se hagan a las URLs correctas**

### 🚨 Troubleshooting

**Problema**: Error CORS
**Solución**: Verifica que tu Lambda tenga headers CORS configurados

**Problema**: 403 Forbidden
**Solución**: Verifica que el token de autenticación sea válido

**Problema**: 404 Not Found
**Solución**: Verifica que las URLs de lambda sean correctas

**Problema**: Connection Refused
**Solución**: Verifica que la Lambda esté desplegada y active
