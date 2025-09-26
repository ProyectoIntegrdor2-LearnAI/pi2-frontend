# 🚀 Configuración de Endpoints AWS Lambda

## ✅ Resumen Rápido

Este proyecto tiene **todos los endpoints configurados** para conectarse con AWS Lambda, pero por seguridad está en **modo mock** por defecto.

## 🔧 Cómo Activar las Lambda Functions

### 1. Copia el archivo de configuración
```bash
cp .env.example .env
```

### 2. Edita el archivo `.env` con tus URLs reales
```bash
# Cambia estas URLs por las de tus Lambda functions reales
REACT_APP_AUTH_LAMBDA_URL=https://tu-auth-lambda.execute-api.region.amazonaws.com/stage
REACT_APP_CHAT_LAMBDA_URL=https://tu-chat-lambda.execute-api.region.amazonaws.com/stage
# ... etc
```

### 3. Desactiva el modo mock
```bash
# En .env
REACT_APP_MOCK_API=false
```

### 4. Reinicia la aplicación
```bash
npm start
```

## 🎯 Endpoints Configurados

| Servicio | Endpoints Disponibles | Estado |
|----------|----------------------|--------|
| 🔐 **Autenticación** | `/auth/login`, `/auth/register`, `/auth/refresh` | ✅ Listo |
| 🤖 **Chat IA** | `/chat/session`, `/chat/history` | ✅ Listo |
| 🗺️ **Rutas Aprendizaje** | `/learning-path/generate`, `/learning-path/update` | ✅ Listo |
| 📚 **Cursos** | `/courses`, `/courses/trending`, `/courses/categories` | ✅ Listo |
| 📊 **Analíticas** | `/analytics/popular-courses`, `/analytics/engagement` | ✅ Listo |
| 🔍 **Búsqueda** | `/search`, `/search/filters` | ✅ Listo |

## 🔒 Seguridad

- ✅ El archivo `.env` está en `.gitignore` (no se sube al repo)
- ✅ Solo `.env.example` se incluye como template
- ✅ Todas las llamadas incluyen autenticación JWT
- ✅ CORS configurado para desarrollo y producción

## 🧪 Modos de Operación

### Modo Mock (Por defecto)
```bash
REACT_APP_MOCK_API=true
```
- Usa datos simulados locales
- Perfecto para desarrollo sin backend
- No requiere configuración de AWS

### Modo Producción
```bash
REACT_APP_MOCK_API=false
```
- Se conecta directamente a tus Lambda functions
- Requiere URLs válidas en `.env`
- Autenticación real con JWT

## 📝 Obtener URLs de Lambda

1. **AWS Console** → **Lambda**
2. **Selecciona tu función**
3. **Configuration** → **Triggers**
4. **API Gateway** → **Copiar URL**

Ejemplo de URL:
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

## 🚨 Importante

- **NUNCA subas el archivo `.env` al repositorio**
- **Siempre usa `.env.example` como template**
- **Las URLs de Lambda son sensibles** - manéjalas con cuidado

## ✨ Todo Está Listo

El código ya está **100% preparado** para AWS Lambda. Solo necesitas:

1. ✅ Tus URLs de Lambda
2. ✅ Cambiar `REACT_APP_MOCK_API=false`
3. ✅ ¡Listo para producción!

---

**Estado actual:** ✅ Configurado y funcionando en modo mock
**Para producción:** Solo configurar URLs de Lambda en `.env`
