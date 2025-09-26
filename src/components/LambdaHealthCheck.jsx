// src/components/LambdaHealthCheck.jsx
// Componente para verificar el estado de las Lambda functions

import React, { useState, useEffect } from 'react';
import lambdaService from '../services/lambdaService';
import './LambdaHealthCheck.css';

const LambdaHealthCheck = ({ onClose }) => {
  const [healthStatus, setHealthStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const results = await lambdaService.healthCheck();
      setHealthStatus(results);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error checking lambda health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.status) {
      case 'healthy': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.status) {
      case 'healthy': return '#4CAF50';
      case 'error': return '#f44336';
      default: return '#ff9800';
    }
  };

  const endpointInfo = lambdaService.getEndpointInfo();

  return (
    <div className="lambda-health-overlay">
      <div className="lambda-health-modal">
        <div className="lambda-health-header">
          <h3>🚀 Estado de Lambda Functions</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="lambda-health-content">
          <div className="config-info">
            <h4>📋 Configuración Actual</h4>
            <div className="config-item">
              <span className="label">Modo Mock:</span>
              <span className={`value ${endpointInfo.mockMode ? 'active' : ''}`}>
                {endpointInfo.mockMode ? '✅ Activado' : '❌ Desactivado'}
              </span>
            </div>
            <div className="config-item">
              <span className="label">Debug:</span>
              <span className={`value ${endpointInfo.debugMode ? 'active' : ''}`}>
                {endpointInfo.debugMode ? '✅ Activado' : '❌ Desactivado'}
              </span>
            </div>
            <div className="config-item">
              <span className="label">Entorno:</span>
              <span className="value">{endpointInfo.environment}</span>
            </div>
          </div>

          <div className="health-status">
            <div className="health-header">
              <h4>🏥 Estado de Servicios</h4>
              <button 
                className="refresh-btn" 
                onClick={checkHealth}
                disabled={loading}
              >
                {loading ? '⏳ Verificando...' : '🔄 Refrescar'}
              </button>
            </div>
            
            {lastCheck && (
              <div className="last-check">
                Última verificación: {lastCheck.toLocaleTimeString()}
              </div>
            )}

            <div className="services-grid">
              {Object.entries(healthStatus).map(([service, status]) => (
                <div key={service} className="service-card">
                  <div className="service-header">
                    <span className="service-icon">{getStatusIcon(status)}</span>
                    <span className="service-name">{service}</span>
                  </div>
                  <div 
                    className="service-status" 
                    style={{ color: getStatusColor(status) }}
                  >
                    {status.status === 'healthy' ? (
                      <>
                        <span>Saludable</span>
                        {status.responseTime && (
                          <small> ({status.responseTime})</small>
                        )}
                      </>
                    ) : (
                      <span>Error: {status.error}</span>
                    )}
                  </div>
                  <div className="service-url">
                    {endpointInfo.endpoints[service] || 'No configurado'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="endpoints-info">
            <h4>🔗 Endpoints Configurados</h4>
            <div className="endpoints-list">
              {Object.entries(endpointInfo.endpoints).map(([key, url]) => (
                <div key={key} className="endpoint-item">
                  <span className="endpoint-name">{key}:</span>
                  <span className="endpoint-url">{url}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="instructions">
            <h4>📝 Instrucciones</h4>
            <ul>
              <li>✅ Verde = Lambda funcionando correctamente</li>
              <li>❌ Rojo = Error en la conexión</li>
              <li>⏳ Amarillo = Verificando estado</li>
              <li>Configura las URLs en el archivo .env</li>
              <li>Habilita CORS en tus Lambda functions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LambdaHealthCheck;
