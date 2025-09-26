// src/services/lambdaService.js
// Servicio optimizado para manejar llamadas a AWS Lambda

import { buildLambdaUrl, CORS_CONFIG } from '../config/endpoints';

class LambdaService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async makeRequest(lambdaType, path, options = {}) {
    const url = buildLambdaUrl(lambdaType, path);
    const config = {
      method: 'GET',
      ...CORS_CONFIG,
      ...options,
      headers: {
        ...CORS_CONFIG.headers,
        ...options.headers
      }
    };

    // Agregar token si está disponible
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return this.executeWithRetry(url, config);
  }

  async executeWithRetry(url, config, attempt = 1) {
    try {
      const response = await fetch(url, config);
      
      // Manejar respuestas específicas de Lambda
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Lambda Request Failed (Attempt ${attempt}/${this.retryAttempts}):`, {
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Retry logic para errores de red
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * attempt);
        return this.executeWithRetry(url, config, attempt + 1);
      }

      throw error;
    }
  }

  async parseErrorResponse(response) {
    try {
      return await response.json();
    } catch {
      return { 
        message: `Request failed with status ${response.status}`,
        status: response.status 
      };
    }
  }

  shouldRetry(error) {
    // Retry para errores de red, timeout, o 5xx
    return (
      error.name === 'TypeError' || // Network errors
      error.message.includes('fetch') || // Fetch errors
      error.message.includes('500') || // Server errors
      error.message.includes('502') || // Bad Gateway
      error.message.includes('503') || // Service Unavailable
      error.message.includes('504')    // Gateway Timeout
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos específicos para cada tipo de Lambda
  
  // 🔐 Autenticación
  async authRequest(path, data, method = 'POST') {
    return this.makeRequest('AUTH', path, {
      method,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // 🤖 Chat
  async chatRequest(path, data, method = 'POST') {
    return this.makeRequest('CHAT', path, {
      method,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // 🗺️ Rutas de Aprendizaje
  async learningPathRequest(path, data, method = 'POST') {
    return this.makeRequest('LEARNING_PATH', path, {
      method,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // 📚 Cursos
  async coursesRequest(path, data, method = 'GET') {
    return this.makeRequest('COURSES', path, {
      method,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // 📊 Analíticas
  async analyticsRequest(path, data, method = 'GET') {
    return this.makeRequest('ANALYTICS', path, {
      method,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // 🔍 Búsqueda
  async searchRequest(path, data, method = 'POST') {
    return this.makeRequest('SEARCH', path, {
      method,
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // Health check para todas las lambdas
  async healthCheck() {
    const lambdas = ['AUTH', 'CHAT', 'LEARNING_PATH', 'COURSES', 'ANALYTICS', 'SEARCH'];
    const results = {};

    for (const lambda of lambdas) {
      try {
        const startTime = Date.now();
        await this.makeRequest(lambda, '/health', { method: 'GET' });
        const responseTime = Date.now() - startTime;
        
        results[lambda] = {
          status: 'healthy',
          responseTime: `${responseTime}ms`
        };
      } catch (error) {
        results[lambda] = {
          status: 'error',
          error: error.message
        };
      }
    }

    return results;
  }

  // Debug info
  getEndpointInfo() {
    const { LAMBDA_ENDPOINTS } = require('../config/endpoints');
    return {
      endpoints: LAMBDA_ENDPOINTS,
      mockMode: process.env.REACT_APP_MOCK_API === 'true',
      debugMode: process.env.REACT_APP_DEBUG === 'true',
      environment: process.env.NODE_ENV
    };
  }
}

// Singleton instance
const lambdaService = new LambdaService();

// Debug logging en desarrollo
if (process.env.REACT_APP_DEBUG === 'true') {
  console.log('🚀 Lambda Service Initialized:', lambdaService.getEndpointInfo());
}

export default lambdaService;
