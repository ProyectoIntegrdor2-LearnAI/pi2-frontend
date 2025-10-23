import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRutasAprendizaje } from "../hooks/useRutasAprendizaje";
import "../styles/Dashboard.css";
import "../styles/VisualizadorRutas.css";

const ACTIVE_LEARNING_PATH_STORAGE_KEY = 'learnia_active_learning_path_id';
const isBrowser = typeof window !== 'undefined';

function VisualizadorRutas() {
  const {
    rutas,
    loading,
    error,
    agregarRuta,
    actualizarCurso
  } = useRutasAprendizaje();

  const navigate = useNavigate();
  const location = useLocation();
  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState(null);
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accionModal, setAccionModal] = useState(null);
  const [mensajeRuta, setMensajeRuta] = useState(location.state?.mensaje ?? null);
  const [mensajeEsAdvertencia, setMensajeEsAdvertencia] = useState(Boolean(location.state?.rutaNoPersistida));
  const nuevaRuta = location.state?.nuevaRuta;
  const rutaSeleccionadaDesdeEstado = location.state?.rutaSeleccionadaId;

  useEffect(() => {
    if (!mensajeRuta) {
      return;
    }
    const timer = setTimeout(() => {
      setMensajeRuta(null);
      setMensajeEsAdvertencia(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [mensajeRuta]);

  const rutaSeleccionada = useMemo(() => {
    if (!rutas.length) {
      return null;
    }
    if (!rutaSeleccionadaId) {
      return rutas[0];
    }
    return rutas.find((ruta) => ruta.id === rutaSeleccionadaId) || rutas[0];
  }, [rutas, rutaSeleccionadaId]);

  const cursoSeleccionado = useMemo(() => {
    if (!rutaSeleccionada || !rutaSeleccionada.cursos?.length) {
      return null;
    }
    if (!cursoSeleccionadoId) {
      return rutaSeleccionada.cursos[0];
    }
    return (
      rutaSeleccionada.cursos.find((curso) => curso.id === cursoSeleccionadoId) ||
      rutaSeleccionada.cursos[0]
    );
  }, [rutaSeleccionada, cursoSeleccionadoId]);

  // Garantizar selección inicial cuando cambian las rutas disponibles
  useEffect(() => {
    if (!rutas.length) {
      setRutaSeleccionadaId(null);
      setCursoSeleccionadoId(null);
      return;
    }

    if (!rutaSeleccionadaId || !rutas.some((ruta) => ruta.id === rutaSeleccionadaId)) {
      setRutaSeleccionadaId(rutas[0].id);
    }
  }, [rutas, rutaSeleccionadaId]);

  // Ajustar curso seleccionado si la ruta activa cambia
  useEffect(() => {
    if (!rutaSeleccionada?.cursos?.length) {
      setCursoSeleccionadoId(null);
      return;
    }

    if (
      !cursoSeleccionadoId ||
      !rutaSeleccionada.cursos.some((curso) => curso.id === cursoSeleccionadoId)
    ) {
      setCursoSeleccionadoId(rutaSeleccionada.cursos[0].id);
    }
  }, [rutaSeleccionada, cursoSeleccionadoId]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    try {
      if (rutaSeleccionada?.id) {
        window.sessionStorage.setItem(ACTIVE_LEARNING_PATH_STORAGE_KEY, rutaSeleccionada.id);
      } else {
        window.sessionStorage.removeItem(ACTIVE_LEARNING_PATH_STORAGE_KEY);
      }
    } catch (storageError) {
      console.warn('No se pudo sincronizar la ruta activa en sessionStorage:', storageError);
    }
  }, [rutaSeleccionada]);

  // Verificar si llegamos desde el chat con una nueva ruta
  useEffect(() => {
    console.log('VisualizadorRutas useEffect: Evaluando nuevaRuta', {
      tieneNuevaRuta: !!nuevaRuta,
      nuevaRutaInfo: nuevaRuta ? {
        rutaId: nuevaRuta?.path_id || nuevaRuta?.id,
        titulo: nuevaRuta?.titulo,
        cursosCount: nuevaRuta?.cursos?.length || 0,
      } : null,
    });

    if (!nuevaRuta) {
      console.log('VisualizadorRutas useEffect: No hay nuevaRuta, retornando');
      return;
    }

    console.log('VisualizadorRutas: Nueva ruta recibida en state', {
      rutaId: nuevaRuta?.path_id || nuevaRuta?.id,
      titulo: nuevaRuta?.titulo,
      cursosCount: nuevaRuta?.cursos?.length || 0,
    });

    const mensajeEntrante = location.state?.mensaje;
    const esAdvertencia = Boolean(location.state?.rutaNoPersistida);

    console.log('VisualizadorRutas: Llamando agregarRuta', {
      agregarRutaFunctionExists: typeof agregarRuta === 'function',
    });

    const rutaCreada = agregarRuta(nuevaRuta);
    console.log('VisualizadorRutas: Ruta agregada y guardada', {
      id: rutaCreada?.id,
      titulo: rutaCreada?.titulo,
      cursosCount: rutaCreada?.cursos?.length,
    });
    if (rutaCreada) {
      setRutaSeleccionadaId(rutaCreada.id);
      if (rutaCreada.cursos?.length) {
        setCursoSeleccionadoId(rutaCreada.cursos[0].id);
      }
      if (mensajeEntrante) {
        setMensajeRuta(mensajeEntrante);
        setMensajeEsAdvertencia(esAdvertencia);
      }
    }

    navigate('/visualizador-rutas', { replace: true, state: {} });
  }, [nuevaRuta, agregarRuta, navigate]);

  useEffect(() => {
    if (!rutaSeleccionadaDesdeEstado) {
      return;
    }

    setRutaSeleccionadaId(rutaSeleccionadaDesdeEstado);
    navigate('/visualizador-rutas', { replace: true, state: {} });
  }, [rutaSeleccionadaDesdeEstado, navigate]);

  const manejarAccionCurso = (curso, accion) => {
    setCursoSeleccionadoId(curso.id);
    setAccionModal(accion);
    setShowConfirmModal(true);
  };

  const confirmarAccion = async () => {
    if (!cursoSeleccionado || !accionModal || !rutaSeleccionada) return;

    let nuevoEstado = cursoSeleccionado.estado;
    
    switch (accionModal) {
      case 'completar':
        nuevoEstado = 'completado';
        break;
      case 'omitir':
        // Para UX: omitir deja el curso como pendiente, pero permite avanzar
        nuevoEstado = 'pendiente';
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

    try {
      const rutaActualizada = await actualizarCurso(
        rutaSeleccionada.id,
        cursoSeleccionado.courseId || cursoSeleccionado.course_id || cursoSeleccionado.id,
        nuevoEstado,
        accionModal
      );

      if (rutaActualizada) {
        const cursoActualizado = rutaActualizada.cursos.find((c) => c.id === cursoSeleccionado.id);

        if (accionModal === 'completar' || accionModal === 'omitir') {
          const siguienteDisponible = rutaActualizada.cursos.find(
            (c) =>
              !c.esMeta &&
              (c.estado === 'disponible' || c.estado === 'en-progreso') &&
              c.id !== cursoSeleccionado.id
          );
          if (siguienteDisponible) {
            setCursoSeleccionadoId(siguienteDisponible.id);
          } else if (cursoActualizado) {
            setCursoSeleccionadoId(cursoActualizado.id);
          }
        } else if (cursoActualizado) {
          setCursoSeleccionadoId(cursoActualizado.id);
        }
      }
    } catch (error) {
      console.error('Error al confirmar acción:', error);
    }
    
    setShowConfirmModal(false);
    setAccionModal(null);
  };

  const cancelarAccion = () => {
    setShowConfirmModal(false);
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
      case 'meta-disponible': return '#28a745';
      case 'meta': return '#6a0dad';
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
      case 'meta-disponible': return '🏆';
      case 'meta': return '⏳';
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
      case 'meta-disponible': return 'Completado';
      case 'meta': return 'Pendiente';
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

      {mensajeRuta && (
        <div
          className={`route-alert ${mensajeEsAdvertencia ? 'warning' : 'success'}`}
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            background: mensajeEsAdvertencia ? '#fff3cd' : '#e6f4ea',
            color: mensajeEsAdvertencia ? '#856404' : '#205522',
            border: `1px solid ${mensajeEsAdvertencia ? '#ffeeba' : '#b7dfc2'}`
          }}
        >
          {mensajeRuta}
        </div>
      )}

      {/* Selector de rutas */}
      <section className="route-selector">
        <div className="route-tabs">
          {rutas.map((ruta) => (
            <button
              key={ruta.id}
              className={`route-tab ${rutaSeleccionada?.id === ruta.id ? 'active' : ''}`}
                onClick={() => setRutaSeleccionadaId(ruta.id)}
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
                    onClick={() => {
                      if (puedeInteractuar(curso.estado)) {
                        setCursoSeleccionadoId(curso.id);
                      }
                    }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (puedeInteractuar(curso.estado)) {
                            setCursoSeleccionadoId(curso.id);
                          }
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

export default VisualizadorRutas;
