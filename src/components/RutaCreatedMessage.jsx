import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RutaCreatedMessage.css';

const RutaCreatedMessage = ({ ruta, onDismiss }) => {
  const navigate = useNavigate();

  const handleVerRuta = () => {
    navigate('/dashboard/rutas', {
      state: { rutaSeleccionada: ruta.id }
    });
    if (onDismiss) onDismiss();
  };

  return (
    <div className="ruta-created-message">
      <div className="message-header">
        <div className="success-icon">✅</div>
        <h3>¡Ruta de Aprendizaje Creada!</h3>
      </div>
      
      <div className="message-content">
        <div className="ruta-preview">
          <h4>{ruta.titulo}</h4>
          <p>{ruta.descripcion}</p>
          
          <div className="ruta-details">
            <div className="detail-item">
              <span className="icon">📚</span>
              <span>{ruta.cursos.length} cursos</span>
            </div>
            <div className="detail-item">
              <span className="icon">⏱️</span>
              <span>{ruta.estimacion}</span>
            </div>
            <div className="detail-item">
              <span className="icon">🎯</span>
              <span>{ruta.nivel}</span>
            </div>
          </div>
        </div>
        
        <div className="cursos-preview">
          <h5>Cursos incluidos:</h5>
          <ul>
            {ruta.cursos.slice(0, 3).map((curso, index) => (
              <li key={index}>
                <span className="curso-numero">{index + 1}</span>
                <span className="curso-titulo">{curso.titulo}</span>
              </li>
            ))}
            {ruta.cursos.length > 3 && (
              <li className="more-courses">
                +{ruta.cursos.length - 3} cursos más
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="message-actions">
        <button 
          className="btn-primary"
          onClick={handleVerRuta}
        >
          🗺️ Ver Ruta Completa
        </button>
        <button 
          className="btn-secondary"
          onClick={onDismiss}
        >
          Continuar Chat
        </button>
      </div>
    </div>
  );
};

export default RutaCreatedMessage;
