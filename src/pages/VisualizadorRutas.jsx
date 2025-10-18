import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRutasAprendizaje } from "../hooks/useRutasAprendizaje";
import "../styles/Dashboard.css";
import "../styles/VisualizadorRutas.css";

function VisualizadorRutas() {
  const {
    rutas,
    loading,
    error,
    agregarRuta,
    actualizarCurso,
    obtenerEstadisticas
  } = useRutasAprendizaje();

  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accionModal, setAccionModal] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Manejar ruta seleccionada cuando cambien las rutas
  useEffect(() => {
    if (rutas.length > 0 && !rutaSeleccionada) {
      setRutaSeleccionada(rutas[0]);
    }
  }, [rutas, rutaSeleccionada]);

  // Verificar si llegamos desde el chat con una nueva ruta
  useEffect(() => {
    if (location.state?.nuevaRuta) {
      const rutaCreada = agregarRuta(location.state.nuevaRuta);
      if (rutaCreada) {
        setRutaSeleccionada(rutaCreada);
      }
      
      // Limpiar el state de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location.state, agregarRuta]);

  const manejarAccionCurso = (curso, accion) => {
    setCursoSeleccionado(curso);
    setAccionModal(accion);
    setShowConfirmModal(true);
  };

  const confirmarAccion = () => {
    if (!cursoSeleccionado || !accionModal || !rutaSeleccionada) return;

    let nuevoEstado = cursoSeleccionado.estado;
    
    switch (accionModal) {
      case 'completar':
        nuevoEstado = 'completado';
        break;
      case 'omitir':
        nuevoEstado = 'omitido';
        break;
      case 'continuar':
        if (cursoSeleccionado.url) {
          window.open(cursoSeleccionado.url, '_blank');
        }
        nuevoEstado = 'en-progreso';
        break;
      case 'retomar':
        nuevoEstado = 'disponible';
        break;
      default:
        break;
    }

    const exito = actualizarCurso(rutaSeleccionada.id, cursoSeleccionado.id, nuevoEstado, accionModal);
    
    if (exito) {
      // Actualizar ruta seleccionada
      const rutaActualizada = rutas.find(r => r.id === rutaSeleccionada.id);
      if (rutaActualizada) {
        setRutaSeleccionada(rutaActualizada);
      }
    }
    
    setShowConfirmModal(false);
    setCursoSeleccionado(null);
    setAccionModal(null);
  };

  const cancelarAccion = () => {
    setShowConfirmModal(false);
    setCursoSeleccionado(null);
    setAccionModal(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completado': return '#28a745';
      case 'omitido': return '#ffc107';
      case 'en-progreso': return '#007bff';
      case 'disponible': return '#6a0dad';
      case 'bloqueado': return '#6c757d';
      case 'pendiente': return '#6a0dad';
      default: return '#6c757d';
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'completado': return '✅';
      case 'omitido': return '⏭️';
      case 'en-progreso': return '🔄';
      case 'disponible': return '▶️';
      case 'bloqueado': return '🔒';
      case 'pendiente': return '⏳';
      default: return '⏳';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'omitido': return 'Omitido';
      case 'en-progreso': return 'En Progreso';
      case 'disponible': return 'Disponible';
      case 'bloqueado': return 'Bloqueado';
      case 'pendiente': return 'Pendiente';
      default: return 'Pendiente';
    }
  };

  const puedeInteractuar = (estado) => {
    return estado === 'disponible' || estado === 'en-progreso' || estado === 'pendiente';
  };

  const puedeCompletar = (estado) => {
    // Permitir completar cualquier curso que no esté bloqueado o ya completado
    return estado !== 'bloqueado' && estado !== 'completado';
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus rutas de aprendizaje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="error-container">
          <h2>Error cargando las rutas</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Estado vacío - sin rutas
  if (rutas.length === 0) {
    return (
      <div className="dashboard-content">
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Mis Rutas de Aprendizaje</h1>
            <p>Comienza tu viaje de aprendizaje personalizado</p>
          </div>
        </section>

        <section className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">🗺️</div>
            <h2>Aún no tienes rutas de aprendizaje</h2>
            <p>Crea tu primera ruta personalizada con IA y comienza a aprender de manera estructurada</p>
            
            <div className="empty-state-actions">
              <button 
                className="btn-primary-large"
                onClick={() => navigate('/rutas')}
              >
                🚀 Crear Mi Primera Ruta
              </button>
              
              <button 
                className="btn-secondary-large"
                onClick={() => navigate('/dashboard')}
              >
                📊 Volver al Dashboard
              </button>
            </div>

            <div className="empty-state-tips">
              <h3>¿Cómo funciona?</h3>
              <div className="tips-grid">
                <div className="tip-item">
                  <div className="tip-icon">1️⃣</div>
                  <p>Describe lo que quieres aprender</p>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">2️⃣</div>
                  <p>La IA selecciona los mejores cursos</p>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">3️⃣</div>
                  <p>Sigue tu progreso paso a paso</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Welcome Section adaptada */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>Mis Rutas de Aprendizaje</h1>
          <p>Sigue tu progreso y continúa tu camino de aprendizaje personalizado</p>
        </div>
      </section>

      {/* Selector de rutas */}
      <section className="route-selector">
        <div className="route-tabs">
          {rutas.map((ruta) => (
            <button
              key={ruta.id}
              className={`route-tab ${rutaSeleccionada?.id === ruta.id ? 'active' : ''}`}
              onClick={() => setRutaSeleccionada(ruta)}
            >
              <div className="route-tab-content">
                <h4>{ruta.titulo}</h4>
                <div className="route-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${ruta.progreso}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{ruta.progreso}%</span>
                </div>
              </div>
            </button>
          ))}
          
          {/* Botón para crear nueva ruta */}
          <button
            className="route-tab add-route"
            onClick={() => navigate('/rutas')}
            title="Crear nueva ruta"
          >
            <div className="route-tab-content">
              <div className="add-route-icon">➕</div>
              <h4>Nueva Ruta</h4>
            </div>
          </button>
        </div>
      </section>

      {/* Detalle de la ruta seleccionada */}
      {rutaSeleccionada && (
        <section className="route-detail">
          <div className="route-header">
            <div className="route-info">
              <h2>{rutaSeleccionada.titulo}</h2>
              <p className="route-description">{rutaSeleccionada.descripcion}</p>
              
              <div className="route-meta">
                <div className="meta-item">
                  <span className="meta-label">Nivel:</span>
                  <span className="meta-value">{rutaSeleccionada.nivel}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Duración estimada:</span>
                  <span className="meta-value">{rutaSeleccionada.estimacion}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Fecha de inicio:</span>
                  <span className="meta-value">{rutaSeleccionada.fechaInicio}</span>
                </div>
              </div>

              {rutaSeleccionada.promptOriginal && (
                <div className="original-prompt">
                  <span className="prompt-label">💭 Tu objetivo:</span>
                  <span className="prompt-text">"{rutaSeleccionada.promptOriginal}"</span>
                </div>
              )}
            </div>
          </div>

          {/* Mapa de cursos */}
          <div className="learning-path-map">
            <h3>🗺️ Tu Ruta de Aprendizaje</h3>
            <div className="path-container">
              {rutaSeleccionada.cursos.map((curso, index) => (
                <div 
                  key={curso.id} 
                  className={`path-step ${curso.estado}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Línea conectora */}
                  {index < rutaSeleccionada.cursos.length - 1 && (
                    <div 
                      className="connector-line"
                      style={{
                        background: curso.estado === 'completado' || curso.estado === 'omitido'
                          ? 'linear-gradient(180deg, var(--success-color) 0%, var(--border-color) 100%)'
                          : 'var(--border-color)'
                      }}
                    />
                  )}
                  
                  {/* Nodo del curso */}
                  <div className="course-node">
                    <div 
                      className={`node-circle ${curso.estado} ${puedeInteractuar(curso.estado) ? '' : 'disabled'}`}
                      style={{ backgroundColor: getEstadoColor(curso.estado) }}
                      onClick={() => puedeInteractuar(curso.estado) && setCursoSeleccionado(curso)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          puedeInteractuar(curso.estado) && setCursoSeleccionado(curso);
                        }
                      }}
                    >
                      <span className="node-icon">{getEstadoIcono(curso.estado)}</span>
                      <span className="node-number">{curso.orden}</span>
                    </div>

                    {/* Info del curso */}
                    <div className="course-info-card">
                      <div className="course-header">
                        <h4>{curso.titulo}</h4>
                        <span className={`status-badge ${curso.estado}`}>
                          {getEstadoTexto(curso.estado)}
                        </span>
                      </div>
                      
                      {curso.descripcion && (
                        <p className="course-description">{curso.descripcion}</p>
                      )}
                      
                      <div className="course-meta-grid">
                        <div className="meta-item">
                          <span className="meta-icon">⏱️</span>
                          <span>{curso.duracion}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🎓</span>
                          <span>{curso.nivel}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🌐</span>
                          <span>{curso.plataforma}</span>
                        </div>
                      </div>

                      {/* Fechas especiales */}
                      {curso.completadoEn && (
                        <div className="completion-info">
                          <span className="completion-icon">🎉</span>
                          <span>Completado el {new Date(curso.completadoEn).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {curso.omitidoEn && (
                        <div className="skip-info">
                          <span className="skip-icon">⏭️</span>
                          <span>Omitido el {new Date(curso.omitidoEn).toLocaleDateString()}</span>
                        </div>
                      )}

                      {curso.retomadoEn && (
                        <div className="retake-info">
                          <span className="retake-icon">🔄</span>
                          <span>Retomado el {new Date(curso.retomadoEn).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Acciones del curso */}
                      {puedeInteractuar(curso.estado) && (
                        <div className="course-actions-duolingo">
                          <button 
                            className="action-btn primary"
                            onClick={() => manejarAccionCurso(curso, 'continuar')}
                          >
                            {curso.estado === 'disponible' ? '▶️ Comenzar' : '📖 Continuar'}
                          </button>
                          
                          <div className="secondary-actions">
                            {puedeCompletar(curso.estado) && (
                              <button 
                                className="action-btn success"
                                onClick={() => manejarAccionCurso(curso, 'completar')}
                                title="Marcar como completado"
                              >
                                ✅
                              </button>
                            )}
                            
                            <button 
                              className="action-btn warning"
                              onClick={() => manejarAccionCurso(curso, 'omitir')}
                              title="Omitir este curso"
                            >
                              ⏭️
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Mostrar acciones de completar/omitir incluso para cursos bloqueados con mensaje */}
                      {curso.estado === 'bloqueado' && (
                        <div className="blocked-actions">
                          <div className="blocked-message">
                            <span className="blocked-icon">🔒</span>
                            <span>Completa el curso anterior para desbloquear</span>
                          </div>
                          <div className="blocked-hint">
                            <small>💡 Tip: Puedes completar o omitir el curso anterior directamente</small>
                          </div>
                        </div>
                      )}
                      
                      {/* Para cursos completados, mostrar opción de revisar */}
                      {curso.estado === 'completado' && (
                        <div className="completed-actions">
                          {curso.url && (
                            <button 
                              className="action-btn secondary"
                              onClick={() => window.open(curso.url, '_blank')}
                            >
                              🔍 Revisar Curso
                            </button>
                          )}
                        </div>
                      )}

                      {/* Para cursos omitidos, mostrar opción de retomar */}
                      {curso.estado === 'omitido' && (
                        <div className="skipped-actions">
                          <button 
                            className="action-btn secondary"
                            onClick={() => manejarAccionCurso(curso, 'retomar')}
                          >
                            🔄 Retomar Curso
                          </button>
                          {curso.url && (
                            <button 
                              className="action-btn secondary"
                              onClick={() => window.open(curso.url, '_blank')}
                            >
                              🔍 Ver Curso
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas de la ruta */}
          <div className="route-stats">
            <h3>📊 Estadísticas de la Ruta</h3>
            <div className="stats-grid">
              <div className="stat-item completados">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'completado').length}
                </div>
                <div className="stat-label">Completados</div>
                <div className="stat-icon">✅</div>
              </div>
              
              <div className="stat-item omitidos">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'omitido').length}
                </div>
                <div className="stat-label">Omitidos</div>
                <div className="stat-icon">⏭️</div>
              </div>
              
              <div className="stat-item disponibles">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'disponible').length}
                </div>
                <div className="stat-label">Disponibles</div>
                <div className="stat-icon">▶️</div>
              </div>
              
              <div className="stat-item bloqueados">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'bloqueado').length}
                </div>
                <div className="stat-label">Bloqueados</div>
                <div className="stat-icon">🔒</div>
              </div>
            </div>
            
            {/* Progreso general */}
            <div className="progress-summary">
              <div className="progress-info">
                <h4>Progreso General</h4>
                <div className="progress-details">
                  <span>
                    {rutaSeleccionada.cursos.filter(c => c.estado === 'completado' || c.estado === 'omitido').length} 
                    de {rutaSeleccionada.cursos.length} cursos
                  </span>
                  <span className="progress-percentage">{rutaSeleccionada.progreso}%</span>
                </div>
              </div>
              
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large" 
                  style={{ width: `${rutaSeleccionada.progreso}%` }}
                />
              </div>
            </div>

            {/* Información adicional si es de origen chat */}
            {rutaSeleccionada.origenChat && (
              <div className="chat-origin-info">
                <div className="chat-badge">
                  <span className="chat-icon">🤖</span>
                  <span>Ruta generada por IA</span>
                </div>
                <p>Esta ruta fue creada automáticamente por nuestro asistente inteligente basado en tus preferencias de aprendizaje.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && cursoSeleccionado && (
        <div 
          className="modal-overlay" 
          onClick={cancelarAccion}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') cancelarAccion();
          }}
        >
          <div 
            className="confirmation-modal" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h3>
                {accionModal === 'completar' && '✅ Completar Curso'}
                {accionModal === 'omitir' && '⏭️ Omitir Curso'}
                {accionModal === 'continuar' && '📖 Continuar Curso'}
                {accionModal === 'retomar' && '🔄 Retomar Curso'}
              </h3>
              <button className="modal-close" onClick={cancelarAccion}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="course-summary">
                <h4>{cursoSeleccionado.titulo}</h4>
                <p>
                  {accionModal === 'completar' && 
                    '¿Estás seguro que has completado este curso? Esto desbloqueará el siguiente curso en la ruta.'
                  }
                  {accionModal === 'omitir' && 
                    '¿Deseas omitir este curso? Podrás volver a él más tarde, pero se desbloqueará el siguiente curso.'
                  }
                  {accionModal === 'continuar' && 
                    'Se abrirá el curso en una nueva pestaña. ¿Deseas continuar?'
                  }
                  {accionModal === 'retomar' && 
                    '¿Deseas retomar este curso? Cambiará su estado a disponible y podrás comenzarlo nuevamente.'
                  }
                </p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className={`modal-btn ${
                  accionModal === 'completar' ? 'success' : 
                  accionModal === 'omitir' ? 'warning' : 
                  accionModal === 'retomar' ? 'secondary' : 'primary'
                }`}
                onClick={confirmarAccion}
              >
                {accionModal === 'completar' && 'Sí, completar'}
                {accionModal === 'omitir' && 'Sí, omitir'}
                {accionModal === 'continuar' && 'Continuar'}
                {accionModal === 'retomar' && 'Sí, retomar'}
              </button>
              
              <button className="modal-btn secondary" onClick={cancelarAccion}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VisualizadorRutas() {
  const {
    rutas,
    loading,
    error,
    agregarRuta,
    actualizarCurso,
    obtenerEstadisticas
  } = useRutasAprendizaje();

  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accionModal, setAccionModal] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Manejar ruta seleccionada cuando cambien las rutas
  useEffect(() => {
    if (rutas.length > 0 && !rutaSeleccionada) {
      setRutaSeleccionada(rutas[0]);
    }
  }, [rutas, rutaSeleccionada]);

  // Verificar si llegamos desde el chat con una nueva ruta
  useEffect(() => {
    if (location.state?.nuevaRuta) {
      const rutaCreada = agregarRuta(location.state.nuevaRuta);
      if (rutaCreada) {
        setRutaSeleccionada(rutaCreada);
      }
      
      // Limpiar el state de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location.state, agregarRuta]);

  const manejarAccionCurso = (curso, accion) => {
    setCursoSeleccionado(curso);
    setAccionModal(accion);
    setShowConfirmModal(true);
  };

  const confirmarAccion = () => {
    if (!cursoSeleccionado || !accionModal || !rutaSeleccionada) return;

    let nuevoEstado = cursoSeleccionado.estado;
    
    switch (accionModal) {
      case 'completar':
        nuevoEstado = 'completado';
        break;
      case 'omitir':
        nuevoEstado = 'omitido';
        break;
      case 'continuar':
        if (cursoSeleccionado.url) {
          window.open(cursoSeleccionado.url, '_blank');
        }
        nuevoEstado = 'en-progreso';
        break;
      case 'retomar':
        nuevoEstado = 'disponible';
        break;
    }

    const exito = actualizarCurso(rutaSeleccionada.id, cursoSeleccionado.id, nuevoEstado, accionModal);
    
    if (exito) {
      // Actualizar ruta seleccionada
      const rutaActualizada = rutas.find(r => r.id === rutaSeleccionada.id);
      if (rutaActualizada) {
        setRutaSeleccionada(rutaActualizada);
      }
    }
    
    setShowConfirmModal(false);
    setCursoSeleccionado(null);
    setAccionModal(null);
  };

  const cancelarAccion = () => {
    setShowConfirmModal(false);
    setCursoSeleccionado(null);
    setAccionModal(null);
  };

  // Función temporal para debug - reinicializar datos
  const reinicializarDatos = () => {
    localStorage.removeItem('misRutasAprendizaje');
    window.location.reload();
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completado': return '#28a745';
      case 'omitido': return '#ffc107';
      case 'en-progreso': return '#007bff';
      case 'disponible': return '#6a0dad';
      case 'bloqueado': return '#6c757d';
      case 'pendiente': return '#6a0dad';
      default: return '#6c757d';
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'completado': return '✅';
      case 'omitido': return '⏭️';
      case 'en-progreso': return '🔄';
      case 'disponible': return '▶️';
      case 'bloqueado': return '🔒';
      case 'pendiente': return '⏳';
      default: return '⏳';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'omitido': return 'Omitido';
      case 'en-progreso': return 'En Progreso';
      case 'disponible': return 'Disponible';
      case 'bloqueado': return 'Bloqueado';
      case 'pendiente': return 'Pendiente';
      default: return 'Pendiente';
    }
  };

  const puedeInteractuar = (estado) => {
    return estado === 'disponible' || estado === 'en-progreso' || estado === 'pendiente';
  };

  const puedeCompletar = (estado) => {
    // Permitir completar cualquier curso que no esté bloqueado o ya completado
    return estado !== 'bloqueado' && estado !== 'completado';
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus rutas de aprendizaje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="error-container">
          <h2>Error cargando las rutas</h2>
          <p>{error}</p>
          <button onClick={initializeRutas} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Estado vacío - sin rutas
  if (rutas.length === 0) {
    return (
      <div className="dashboard-content">
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Mis Rutas de Aprendizaje</h1>
            <p>Comienza tu viaje de aprendizaje personalizado</p>
          </div>
        </section>

        <section className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">🗺️</div>
            <h2>Aún no tienes rutas de aprendizaje</h2>
            <p>Crea tu primera ruta personalizada con IA y comienza a aprender de manera estructurada</p>
            
            <div className="empty-state-actions">
              <button 
                className="btn-primary-large"
                onClick={() => navigate('/rutas')}
              >
                🚀 Crear Mi Primera Ruta
              </button>
              
              <button 
                className="btn-secondary-large"
                onClick={() => navigate('/dashboard')}
              >
                📊 Volver al Dashboard
              </button>
            </div>

            <div className="empty-state-tips">
              <h3>¿Cómo funciona?</h3>
              <div className="tips-grid">
                <div className="tip-item">
                  <div className="tip-icon">1️⃣</div>
                  <p>Describe lo que quieres aprender</p>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">2️⃣</div>
                  <p>La IA selecciona los mejores cursos</p>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">3️⃣</div>
                  <p>Sigue tu progreso paso a paso</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Welcome Section adaptada */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>Mis Rutas de Aprendizaje</h1>
          <p>Sigue tu progreso y continúa tu camino de aprendizaje personalizado</p>
        </div>
      </section>

      {/* Selector de rutas */}
      <section className="route-selector">
        <div className="route-tabs">
          {rutas.map((ruta) => (
            <button
              key={ruta.id}
              className={`route-tab ${rutaSeleccionada?.id === ruta.id ? 'active' : ''}`}
              onClick={() => setRutaSeleccionada(ruta)}
            >
              <div className="route-tab-content">
                <h4>{ruta.titulo}</h4>
                <div className="route-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${ruta.progreso}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{ruta.progreso}%</span>
                </div>
              </div>
            </button>
          ))}
          
          {/* Botón para crear nueva ruta */}
          <button
            className="route-tab add-route"
            onClick={() => navigate('/rutas')}
            title="Crear nueva ruta"
          >
            <div className="route-tab-content">
              <div className="add-route-icon">➕</div>
              <h4>Nueva Ruta</h4>
            </div>
          </button>
        </div>
      </section>

      {/* Detalle de la ruta seleccionada */}
      {rutaSeleccionada && (
        <section className="route-detail">
          <div className="route-header">
            <div className="route-info">
              <h2>{rutaSeleccionada.titulo}</h2>
              <p className="route-description">{rutaSeleccionada.descripcion}</p>
              
              <div className="route-meta">
                <div className="meta-item">
                  <span className="meta-label">Nivel:</span>
                  <span className="meta-value">{rutaSeleccionada.nivel}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Duración estimada:</span>
                  <span className="meta-value">{rutaSeleccionada.estimacion}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Progreso:</span>
                  <span className="meta-value">{rutaSeleccionada.progreso}%</span>
                </div>
              </div>
            </div>

            <div className="route-progress-circle">
              <div className="progress-circle-container">
                <svg className="progress-circle-svg" width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#007bff"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - rutaSeleccionada.progreso / 100)}`}
                    strokeLinecap="round"
                    className="progress-circle-stroke"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percent">{rutaSeleccionada.progreso}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa de Aprendizaje tipo Duolingo */}
          <div className="learning-path-map">
            <h3>🗺️ Camino de Aprendizaje</h3>
            <div className="path-container">
              {rutaSeleccionada.cursos.map((curso, index) => (
                <div key={curso.id} className={`path-step ${curso.estado}`}>
                  {/* Línea conectora */}
                  {index < rutaSeleccionada.cursos.length - 1 && (
                    <div 
                      className="connector-line" 
                      style={{ 
                        background: curso.estado === 'completado' || curso.estado === 'omitido'
                          ? 'linear-gradient(180deg, var(--success-color) 0%, var(--border-color) 100%)'
                          : 'var(--border-color)'
                      }}
                    />
                  )}
                  
                  {/* Nodo del curso */}
                  <div className="course-node">
                    <div 
                      className={`node-circle ${curso.estado} ${!puedeInteractuar(curso.estado) ? 'disabled' : ''}`}
                      style={{ backgroundColor: getEstadoColor(curso.estado) }}
                      onClick={() => puedeInteractuar(curso.estado) && setCursoSeleccionado(curso)}
                    >
                      <span className="node-icon">{getEstadoIcono(curso.estado)}</span>
                      <span className="node-number">{curso.orden}</span>
                    </div>

                    {/* Info del curso */}
                    <div className="course-info-card">
                      <div className="course-header">
                        <h4>{curso.titulo}</h4>
                        <span className={`status-badge ${curso.estado}`}>
                          {getEstadoTexto(curso.estado)}
                        </span>
                      </div>
                      
                      {curso.descripcion && (
                        <p className="course-description">{curso.descripcion}</p>
                      )}
                      
                      <div className="course-meta-grid">
                        <div className="meta-item">
                          <span className="meta-icon">⏱️</span>
                          <span>{curso.duracion}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🎓</span>
                          <span>{curso.nivel}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🌐</span>
                          <span>{curso.plataforma}</span>
                        </div>
                      </div>

                      {/* Fechas especiales */}
                      {curso.completadoEn && (
                        <div className="completion-info">
                          <span className="completion-icon">🎉</span>
                          <span>Completado el {new Date(curso.completadoEn).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {curso.omitidoEn && (
                        <div className="skip-info">
                          <span className="skip-icon">⏭️</span>
                          <span>Omitido el {new Date(curso.omitidoEn).toLocaleDateString()}</span>
                        </div>
                      )}

                      {curso.retomadoEn && (
                        <div className="retake-info">
                          <span className="retake-icon">🔄</span>
                          <span>Retomado el {new Date(curso.retomadoEn).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Acciones del curso */}
                      {puedeInteractuar(curso.estado) && (
                        <div className="course-actions-duolingo">
                          <button 
                            className="action-btn primary"
                            onClick={() => manejarAccionCurso(curso, 'continuar')}
                          >
                            {curso.estado === 'disponible' ? '▶️ Comenzar' : '📖 Continuar'}
                          </button>
                          
                          <div className="secondary-actions">
                            {puedeCompletar(curso.estado) && (
                              <button 
                                className="action-btn success"
                                onClick={() => manejarAccionCurso(curso, 'completar')}
                                title="Marcar como completado"
                              >
                                ✅
                              </button>
                            )}
                            
                            <button 
                              className="action-btn warning"
                              onClick={() => manejarAccionCurso(curso, 'omitir')}
                              title="Omitir este curso"
                            >
                              ⏭️
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Mostrar acciones de completar/omitir incluso para cursos bloqueados con mensaje */}
                      {curso.estado === 'bloqueado' && (
                        <div className="blocked-actions">
                          <div className="blocked-message">
                            <span className="blocked-icon">🔒</span>
                            <span>Completa el curso anterior para desbloquear</span>
                          </div>
                          <div className="blocked-hint">
                            <small>💡 Tip: Puedes completar o omitir el curso anterior directamente</small>
                          </div>
                        </div>
                      )}
                      
                      {/* Para cursos completados, mostrar opción de revisar */}
                      {curso.estado === 'completado' && (
                        <div className="completed-actions">
                          {curso.url && (
                            <button 
                              className="action-btn secondary"
                              onClick={() => window.open(curso.url, '_blank')}
                            >
                              🔍 Revisar Curso
                            </button>
                          )}
                        </div>
                      )}

                      {/* Para cursos omitidos, mostrar opción de retomar */}
                      {curso.estado === 'omitido' && (
                        <div className="skipped-actions">
                          <button 
                            className="action-btn secondary"
                            onClick={() => manejarAccionCurso(curso, 'retomar')}
                          >
                            🔄 Retomar Curso
                          </button>
                          {curso.url && (
                            <button 
                              className="action-btn secondary"
                              onClick={() => window.open(curso.url, '_blank')}
                            >
                              🔍 Ver Curso
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas de la ruta */}
          <div className="route-stats">
            <h3>📊 Estadísticas de la Ruta</h3>
            <div className="stats-grid">
              <div className="stat-item completados">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'completado').length}
                </div>
                <div className="stat-label">Completados</div>
                <div className="stat-icon">✅</div>
              </div>
              
              <div className="stat-item omitidos">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'omitido').length}
                </div>
                <div className="stat-label">Omitidos</div>
                <div className="stat-icon">⏭️</div>
              </div>
              
              <div className="stat-item disponibles">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'disponible').length}
                </div>
                <div className="stat-label">Disponibles</div>
                <div className="stat-icon">▶️</div>
              </div>
              
              <div className="stat-item bloqueados">
                <div className="stat-number">
                  {rutaSeleccionada.cursos.filter(c => c.estado === 'bloqueado').length}
                </div>
                <div className="stat-label">Bloqueados</div>
                <div className="stat-icon">🔒</div>
              </div>
            </div>
            
            {/* Progreso general */}
            <div className="progress-summary">
              <div className="progress-info">
                <h4>Progreso General</h4>
                <div className="progress-details">
                  <span>
                    {rutaSeleccionada.cursos.filter(c => c.estado === 'completado' || c.estado === 'omitido').length} 
                    de {rutaSeleccionada.cursos.length} cursos
                  </span>
                  <span className="progress-percentage">{rutaSeleccionada.progreso}%</span>
                </div>
              </div>
              
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large" 
                  style={{ width: `${rutaSeleccionada.progreso}%` }}
                />
              </div>
            </div>

            {/* Información adicional si es de origen chat */}
            {rutaSeleccionada.origenChat && (
              <div className="chat-origin-info">
                <div className="chat-badge">
                  <span className="chat-icon">🤖</span>
                  <span>Ruta generada por IA</span>
                </div>
                <p>Esta ruta fue creada automáticamente por nuestro asistente inteligente basado en tus preferencias de aprendizaje.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && cursoSeleccionado && (
        <div className="modal-overlay" onClick={cancelarAccion}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {accionModal === 'completar' && '✅ Completar Curso'}
                {accionModal === 'omitir' && '⏭️ Omitir Curso'}
                {accionModal === 'continuar' && '📖 Continuar Curso'}
                {accionModal === 'retomar' && '🔄 Retomar Curso'}
              </h3>
              <button className="modal-close" onClick={cancelarAccion}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="course-summary">
                <h4>{cursoSeleccionado.titulo}</h4>
                <p>
                  {accionModal === 'completar' && 
                    '¿Estás seguro que has completado este curso? Esto desbloqueará el siguiente curso en la ruta.'
                  }
                  {accionModal === 'omitir' && 
                    '¿Deseas omitir este curso? Podrás volver a él más tarde, pero se desbloqueará el siguiente curso.'
                  }
                  {accionModal === 'continuar' && 
                    'Se abrirá el curso en una nueva pestaña. ¿Deseas continuar?'
                  }
                  {accionModal === 'retomar' && 
                    '¿Deseas retomar este curso? Cambiará su estado a disponible y podrás comenzarlo nuevamente.'
                  }
                </p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className={`modal-btn ${
                  accionModal === 'completar' ? 'success' : 
                  accionModal === 'omitir' ? 'warning' : 
                  accionModal === 'retomar' ? 'secondary' : 'primary'
                }`}
                onClick={confirmarAccion}
              >
                {accionModal === 'completar' && 'Sí, completar'}
                {accionModal === 'omitir' && 'Sí, omitir'}
                {accionModal === 'continuar' && 'Continuar'}
                {accionModal === 'retomar' && 'Sí, retomar'}
              </button>
              
              <button className="modal-btn secondary" onClick={cancelarAccion}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualizadorRutas;
