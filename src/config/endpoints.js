// src/config/endpoints.js
// Configuración de endpoints para las lambdas de AWS

export const LAMBDA_ENDPOINTS = {
  // Lambda para autenticación y usuarios
  AUTH: process.env.REACT_APP_AUTH_LAMBDA_URL || 'https://your-auth-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para chat con IA
  CHAT: process.env.REACT_APP_CHAT_LAMBDA_URL || 'https://your-chat-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para rutas de aprendizaje
  LEARNING_PATH: process.env.REACT_APP_LEARNING_PATH_LAMBDA_URL || 'https://your-learning-path-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para cursos
  COURSES: process.env.REACT_APP_COURSES_LAMBDA_URL || 'https://your-courses-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para analíticas
  ANALYTICS: process.env.REACT_APP_ANALYTICS_LAMBDA_URL || 'https://your-analytics-lambda.execute-api.region.amazonaws.com/prod',
  
  // Lambda para búsqueda
  SEARCH: process.env.REACT_APP_SEARCH_LAMBDA_URL || 'https://your-search-lambda.execute-api.region.amazonaws.com/prod'
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
    PROFILE: '/users/profile',
    PROGRESS: '/users/progress',
    DASHBOARD: '/users/dashboard'
  },
  
  // Rutas de chat
  CHAT: {
    SESSION: '/chat/session',
    HISTORY: '/chat/history',
    DELETE_SESSION: '/chat/session/:id'
  },
  
  // Rutas de aprendizaje
  LEARNING_PATH: {
    GENERATE: '/learning-path/generate',
    UPDATE: '/learning-path/update',
    CLONE: '/learning-path/clone',
    DELETE: '/learning-path/:id'
  },
  
  // Rutas de cursos
  COURSES: {
    ALL: '/courses',
    TRENDING: '/courses/trending',
    CATEGORIES: '/courses/categories',
    FAVORITES: '/courses/favorites'
  },
  
  // Rutas de analíticas
  ANALYTICS: {
    POPULAR: '/analytics/popular-courses',
    ENGAGEMENT: '/analytics/user-engagement',
    STATS: '/analytics/stats'
  },
  
  // Búsqueda
  SEARCH: {
    MAIN: '/search',
    FILTERS: '/search/filters'
  }
};

// Helper para construir URLs completas
export const buildLambdaUrl = (lambdaType, path) => {
  const baseUrl = LAMBDA_ENDPOINTS[lambdaType];
  return `${baseUrl}${path}`;
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
