import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // AGREGADO: Import faltante
import apiServices from "../services/apiServices"; // AGREGADO: Import faltante
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.jpg';
import "../styles/Dashboard.css"; // AGREGADO: Import de estilos

// Datos simulados de rutas de aprendizaje
const rutasSimuladas = [
  {
    id: 1,
    titulo: "Desarrollador Full Stack con React y Node.js",
    descripcion: "Aprende desarrollo web completo desde frontend hasta backend",
    progreso: 45,
    fechaInicio: "2024-01-15",
    estimacion: "12 semanas",
    nivel: "Intermedio",
    cursos: [
      {
        id: 1,
        titulo: "HTML y CSS Fundamentos",
        estado: "completado",
        orden: 1,
        duracion: "2 semanas",
        plataforma: "Coursera",
        url: "https://coursera.org/html-css",
        completadoEn: "2024-01-29"
      },
      {
        id: 2,
        titulo: "JavaScript Moderno ES6+",
        estado: "completado",
        orden: 2,
        duracion: "3 semanas",
        plataforma: "Udemy",
        url: "https://udemy.com/javascript-es6",
        completadoEn: "2024-02-19"
      },
      {
        id: 3,
        titulo: "React.js Fundamentos",
        estado: "en-progreso",
        orden: 3,
        duracion: "2 semanas",
        plataforma: "edX",
        url: "https://edx.org/react-fundamentals",
        progresoCurso: 75
      },
      {
        id: 4,
        titulo: "APIs REST con Node.js",
        estado: "bloqueado",
        orden: 4,
        duracion: "2 semanas",
        plataforma: "Coursera",
        url: "https://coursera.org/nodejs-api"
      },
      {
        id: 5,
        titulo: "Base de Datos MongoDB",
        estado: "bloqueado",
        orden: 5,
        duracion: "2 semanas",
        plataforma: "Khan Academy",
        url: "https://khanacademy.org/mongodb"
      },
      {
        id: 6,
        titulo: "Proyecto Final: App Completa",
        estado: "bloqueado",
        orden: 6,
        duracion: "1 semana",
        plataforma: "Proyecto",
        url: null
      }
    ]
  },
  {
    id: 2,
    titulo: "Data Science con Python",
    descripcion: "Domina el análisis de datos y machine learning",
    progreso: 20,
    fechaInicio: "2024-02-01",
    estimacion: "16 semanas",
    nivel: "Avanzado",
    cursos: [
      {
        id: 7,
        titulo: "Python para Principiantes",
        estado: "completado",
        orden: 1,
        duracion: "3 semanas",
        plataforma: "Coursera",
        url: "https://coursera.org/python-basics",
        completadoEn: "2024-02-22"
      },
      {
        id: 8,
        titulo: "NumPy y Pandas",
        estado: "en-progreso",
        orden: 2,
        duracion: "2 semanas",
        plataforma: "edX",
        url: "https://edx.org/numpy-pandas",
        progresoCurso: 30
      },
      {
        id: 9,
        titulo: "Visualización con Matplotlib",
        estado: "bloqueado",
        orden: 3,
        duracion: "2 semanas",
        plataforma: "Udemy",
        url: "https://udemy.com/matplotlib"
      },
      {
        id: 10,
        titulo: "Machine Learning Basics",
        estado: "bloqueado",
        orden: 4,
        duracion: "4 semanas",
        plataforma: "Coursera",
        url: "https://coursera.org/ml-basics"
      }
    ]
  }
];

function VisualizadorRutas() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rutas, setRutas] = useState(rutasSimuladas);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: "", email: "" }); // AGREGADO: Estado del perfil

  
  // Estados para el panel del curso
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  const navigate = useNavigate(); // AGREGADO: Hook de navegación

  useEffect(() => {
    // Seleccionar automáticamente la primera ruta con progreso
    const rutaActiva = rutas.find(ruta => ruta.progreso > 0) || rutas[0];
    setRutaSeleccionada(rutaActiva);
    
    // AGREGADO: Cargar perfil del usuario
    loadUserProfile();
  }, []);

  // AGREGADO: Función para cargar perfil del usuario
  const loadUserProfile = async () => {
    try {
      const profile = await apiServices.user.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setUserProfile({
        name: "Usuario",
        email: "usuario@ejemplo.com"
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (route) => {
    closeSidebar();
    navigate(route); // CORREGIDO: Usar navigate en lugar de alert
  };



  const continuarCurso = (curso) => {
    if (curso.estado === "disponible" || curso.estado === "en-progreso") {
      if (curso.url) {
        window.open(curso.url, '_blank');
      }
    }
  };

  const iniciarRuta = (ruta) => {
    const rutaActualizada = {
      ...ruta,
      fechaInicio: new Date().toISOString().split('T')[0],
      progreso: 0,
      cursos: ruta.cursos.map((curso, index) => ({
        ...curso,
        estado: index === 0 ? "disponible" : "bloqueado"
      }))
    };

    setRutas(prevRutas => 
      prevRutas.map(r => r.id === ruta.id ? rutaActualizada : r)
    );
    setRutaSeleccionada(rutaActualizada);
  };

  // Funciones para el panel del curso
  const abrirPanelCurso = (curso) => {
    setCursoSeleccionado(curso);
    setPanelAbierto(true);
  };

  const cerrarPanel = () => {
    setPanelAbierto(false);
    setCursoSeleccionado(null);
  };

  const completarCurso = (curso) => {
    // Lógica para marcar curso como completado
    const rutaActualizada = {
      ...rutaSeleccionada,
      cursos: rutaSeleccionada.cursos.map(c => 
        c.id === curso.id 
          ? { ...c, estado: "completado", completadoEn: new Date().toISOString().split('T')[0] }
          : c
      )
    };

    // Activar siguiente curso
    const indiceCursoActual = rutaActualizada.cursos.findIndex(c => c.id === curso.id);
    if (indiceCursoActual < rutaActualizada.cursos.length - 1) {
      rutaActualizada.cursos[indiceCursoActual + 1].estado = "disponible";
    }

    // Actualizar progreso de la ruta
    const cursosCompletados = rutaActualizada.cursos.filter(c => c.estado === "completado").length;
    rutaActualizada.progreso = Math.round((cursosCompletados / rutaActualizada.cursos.length) * 100);

    setRutas(prevRutas => 
      prevRutas.map(r => r.id === rutaActualizada.id ? rutaActualizada : r)
    );
    setRutaSeleccionada(rutaActualizada);
    cerrarPanel();
  };

  const omitirCurso = (curso) => {
    // Lógica para omitir curso y activar el siguiente
    const rutaActualizada = {
      ...rutaSeleccionada,
      cursos: rutaSeleccionada.cursos.map(c => 
        c.id === curso.id 
          ? { ...c, estado: "omitido" }
          : c
      )
    };

    // Activar siguiente curso
    const indiceCursoActual = rutaActualizada.cursos.findIndex(c => c.id === curso.id);
    if (indiceCursoActual < rutaActualizada.cursos.length - 1) {
      rutaActualizada.cursos[indiceCursoActual + 1].estado = "disponible";
    }

    setRutas(prevRutas => 
      prevRutas.map(r => r.id === rutaActualizada.id ? rutaActualizada : r)
    );
    setRutaSeleccionada(rutaActualizada);
    cerrarPanel();
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "completado": return "✅";
      case "en-progreso": return "⏳";
      case "disponible": return "🚀";
      case "bloqueado": return "🔒";
      case "omitido": return "⏭️";
      default: return "📚";
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "completado": return "#28a745";
      case "en-progreso": return "#007bff";
      case "disponible": return "#6a0dad";
      case "bloqueado": return "#6c757d";
      case "omitido": return "#ffc107";
      default: return "#6c757d";
    }
  };

  // CORREGIDO: Función de logout usando apiServices
  const handleLogout = () => {
    apiServices.auth.logout();
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header corregido */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-logo">
            <img src={logoImage} alt="LearnIA Logo" className="logo-img" />
          </div>
          <div className="user-info" onClick={toggleSidebar}>
            <img src={avatarIcon} alt="Avatar" className="user-avatar" />
            {userProfile?.name && <span className="user-name">{userProfile.name}</span>}
          </div>
        </div>
      </header>

      {/* Sidebar corregido */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="user-profile-sidebar">
            <img src={avatarIcon} alt="Avatar" className="sidebar-avatar" />
            {userProfile?.name && <h3 className="sidebar-user-name">{userProfile.name}</h3>}
            {userProfile?.email && <p className="sidebar-user-email">{userProfile.email}</p>}
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li onClick={() => handleNavigation('/dashboard')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Inicio</span>
              </li>
              <li onClick={() => handleNavigation('/visualizador-rutas')} className="nav-item active">
                <span className="nav-icon"></span>
                <span>Mis Cursos</span>
              </li>
              <li onClick={() => handleNavigation('/catalogo')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Explorar Cursos</span>
              </li>
              <li onClick={() => handleNavigation('/mis-favoritos')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Favoritos</span>
              </li>
              <li onClick={() => handleNavigation('/mi-perfil')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Perfil</span>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="nav-icon"></span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para cerrar chat al hacer clic fuera */}
      {chatOpen && <div className="chat-overlay" onClick={toggleChat}></div>}

      {/* Overlay para cerrar sidebar al hacer clic fuera */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Main Content - Ajustado para dar espacio al chat */}
      <main className="dashboard-main">
        {/* Welcome Section adaptada */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Mis Rutas de Aprendizaje</h1>
            <p>Sigue tu progreso y continúa tu camino de aprendizaje personalizado</p>
          </div>
        </section>

        {/* Selector de rutas */}
        <section className="stats-section">
          <div className="section-header">
            <h2>Seleccionar Ruta</h2>
            <button className="see-all-btn" onClick={() => handleNavigation('/crear-ruta')}>
              + Crear Nueva Ruta
            </button>
          </div>
          <div className="stats-grid">
            {rutas.map((ruta) => (
              <div
                key={ruta.id}
                className={`stat-card ${rutaSeleccionada?.id === ruta.id ? 'active-route' : ''}`}
                onClick={() => setRutaSeleccionada(ruta)}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-header">
                  <div className="stat-icon">🎯</div>
                  <h3>{ruta.titulo}</h3>
                </div>
                <div className="stat-body">
                  <div className="progress-circle" style={{'--progress': ruta.progreso}}>
                    <span className="progress-number">{ruta.progreso}%</span>
                  </div>
                  <p>{ruta.nivel} • {ruta.estimacion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ruta seleccionada - Solo visualizador central */}
        {rutaSeleccionada && (
          <section className="ruta-visualizador">
            <div className="section-header">
              <h2>{rutaSeleccionada.titulo}</h2>
              {rutaSeleccionada.progreso === 0 && !rutaSeleccionada.fechaInicio && (
                <button 
                  className="see-all-btn"
                  onClick={() => iniciarRuta(rutaSeleccionada)}
                  style={{ background: '#28a745', color: 'white', border: 'none' }}
                >
                  Iniciar Ruta
                </button>
              )}
            </div>

            {/* Mapa de cursos centrado - Solo nodos */}
            <div className="course-map-container">
              <div className="course-path">
                {rutaSeleccionada.cursos.map((curso, index) => (
                  <div key={curso.id} className="course-step">
                    {/* Línea conectora */}
                    {index < rutaSeleccionada.cursos.length - 1 && (
                      <div className="path-connector"></div>
                    )}
                    
                    {/* Nodo del curso - Solo la burbuja */}
                    <div 
                      className={`course-bubble ${curso.estado}`}
                      onClick={() => abrirPanelCurso(curso)}
                      style={{ '--node-color': getEstadoColor(curso.estado) }}
                    >
                      <span className="course-icon">{getEstadoIcon(curso.estado)}</span>
                      {curso.estado === "en-progreso" && curso.progresoCurso && (
                        <div className="bubble-progress">
                          <div 
                            className="progress-ring"
                            style={{ 
                              background: `conic-gradient(${getEstadoColor(curso.estado)} ${curso.progresoCurso * 3.6}deg, rgba(255,255,255,0.3) 0deg)` 
                            }}
                          ></div>
                        </div>
                      )}
                      <div className="course-number">{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estadísticas de progreso */}
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-number">{rutaSeleccionada.cursos.filter(c => c.estado === "completado").length}</span>
                <span className="stat-label">Completados</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{rutaSeleccionada.cursos.filter(c => c.estado === "en-progreso").length}</span>
                <span className="stat-label">En Progreso</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{rutaSeleccionada.cursos.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </section>
        )}

        {/* Panel flotante del curso */}
        {panelAbierto && cursoSeleccionado && (
          <div className="panel-overlay" onClick={cerrarPanel}>
            <div className="course-panel" onClick={(e) => e.stopPropagation()}>
              <div className="panel-header">
                <h3>{cursoSeleccionado.titulo}</h3>
                <button className="panel-close" onClick={cerrarPanel}>✕</button>
              </div>
              
              <div className="panel-content">
                <div className="course-details">
                  <div className="detail-row">
                    <span className="label">Duración:</span>
                    <span className="value">{cursoSeleccionado.duracion}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Plataforma:</span>
                    <span className="value">{cursoSeleccionado.plataforma}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Estado:</span>
                    <span className="value status">{cursoSeleccionado.estado}</span>
                  </div>
                  {cursoSeleccionado.estado === "en-progreso" && cursoSeleccionado.progresoCurso && (
                    <div className="detail-row">
                      <span className="label">Progreso:</span>
                      <span className="value">{cursoSeleccionado.progresoCurso}%</span>
                    </div>
                  )}
                  {cursoSeleccionado.completadoEn && (
                    <div className="detail-row">
                      <span className="label">Completado:</span>
                      <span className="value">{new Date(cursoSeleccionado.completadoEn).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="panel-actions">
                  {cursoSeleccionado.url && (
                    <button 
                      className="action-btn primary"
                      onClick={() => window.open(cursoSeleccionado.url, '_blank')}
                    >
                      Ir al Curso
                    </button>
                  )}
                  
                  {(cursoSeleccionado.estado === "disponible" || cursoSeleccionado.estado === "en-progreso") && (
                    <>
                      <button 
                        className="action-btn success"
                        onClick={() => completarCurso(cursoSeleccionado)}
                      >
                        Marcar Completado
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => omitirCurso(cursoSeleccionado)}
                      >
                        Omitir Curso
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

  {/* ChatIA real (logueado) */}

    </div>
  );
}

export default VisualizadorRutas;