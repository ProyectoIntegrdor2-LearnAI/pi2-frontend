// src/config/endpoints.js
// Configuración de endpoints para las lambdas de AWS

export const LAMBDA_ENDPOINTS = {
  // Lambda para autenticación y usuarios
  AUTH: process.env.REACT_APP_AUTH_LAMBDA_URL || 'https://avouruymc3.execute-api.us-east-2.amazonaws.com/Prod',
  
  // Lambda para chat con IA
  CHAT: process.env.REACT_APP_CHAT_LAMBDA_URL || 'https://your-chat-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para rutas de aprendizaje
  LEARNING_PATH: process.env.REACT_APP_LEARNING_PATH_LAMBDA_URL || 'https://yhjk0mfvgc.execute-api.us-east-2.amazonaws.com/Prod',
  
  // Lambda para cursos
  COURSES: process.env.REACT_APP_COURSES_LAMBDA_URL || 'https://your-courses-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para analíticas
  ANALYTICS: process.env.REACT_APP_ANALYTICS_LAMBDA_URL || 'https://your-analytics-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para búsqueda
  SEARCH: process.env.REACT_APP_SEARCH_LAMBDA_URL || 'https://463dscc3hl.execute-api.us-east-2.amazonaws.com'
};

export const API_PATHS = {
  // Rutas de autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Rutas de usuarios
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    PROFILE: (id = 'me') => (id === 'me' ? '/users/me' : `/users/${id}`),
    PROFILE_UPDATE: (id = 'me') => (id === 'me' ? '/users/me/profile' : `/users/${id}/profile`),
    DASHBOARD: (id = 'me') => (id === 'me' ? '/users/me/dashboard' : `/users/${id}/dashboard`),
    PROGRESS: (id = 'me') => (id === 'me' ? '/users/me/progress' : `/users/${id}/progress`)
  },
  
  // Rutas de chat
  CHAT: {
    SESSION: '/chat/session',
    SESSION_BY_ID: (id) => `/chat/session/${id}`,
    HISTORY: '/chat/history',
    DELETE_SESSION: (id) => `/chat/session/${id}`
  },
  
  // Rutas de aprendizaje
  LEARNING_PATH: {
    GENERATE: '/generate-learning-path',
    UPDATE: (id) => `/learning-path/${id}`,
    CLONE: (id) => `/learning-path/${id}/clone`,
    DELETE: (id) => `/learning-path/${id}`
  },
  
  // Rutas de cursos
  COURSES: {
    ALL: '/api/courses',
    TRENDING: '/api/courses/trending',
    CATEGORIES: '/api/courses/categories',
    DETAIL: (id) => `/api/courses/${id}`,
    FAVORITE: (id) => `/api/courses/${id}/favorite`
  },
  
  // Rutas de analíticas
  ANALYTICS: {
    POPULAR: '/analytics/popular-courses',
    ENGAGEMENT: '/analytics/user-engagement',
    STATS: '/analytics/stats'
  },
  
  // Búsqueda
  SEARCH: {
    MAIN: '/api/search',
    FILTERS: '/search/filters'
  }
};

// Helper para construir URLs completas
export const buildLambdaUrl = (lambdaType, path = '') => {
  const rawBaseUrl = LAMBDA_ENDPOINTS[lambdaType] || '';
  const baseUrl = typeof rawBaseUrl === 'string' ? rawBaseUrl.replace(/\/+$/, '') : '';
  const resolvedPath = typeof path === 'function' ? path() : path || '';

  if (!resolvedPath) {
    return baseUrl;
  }

  if (resolvedPath.startsWith('http')) {
    return resolvedPath;
  }

  const normalizedPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
  return `${baseUrl}${normalizedPath}`;
};

// Configuración de CORS para desarrollo
export const CORS_CONFIG = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
};

export default {
  LAMBDA_ENDPOINTS,
  API_PATHS,
  buildLambdaUrl,
  CORS_CONFIG
};
