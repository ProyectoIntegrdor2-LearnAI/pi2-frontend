import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.jpg';
import "../styles/Dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userProgress, setUserProgress] = useState({
    completedCourses: 0,
    totalCourses: 0,
    consecutiveDays: 0,
    totalHours: 0,
    currentLevel: "Principiante"
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { text: "¡Hola! Soy LearnIA, tu asistente inteligente. ¿Qué te gustaría aprender hoy? Puedo ayudarte a encontrar la ruta perfecta.", isBot: true, timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileResponse, progressResponse] = await Promise.allSettled([
        loadUserProfile(),
        loadUserProgress()
      ]);

      if (profileResponse.status === 'rejected') {
        console.error('Error cargando perfil:', profileResponse.reason);
      }
      
      if (progressResponse.status === 'rejected') {
        console.error('Error cargando progreso:', progressResponse.reason);
      }

    } catch (error) {
      console.error('Error inicializando dashboard:', error);
      setError('Error cargando los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // RF-027: Ver perfil del usuario
  const loadUserProfile = async () => {
    try {
      const profile = await apiServices.user.getProfile();
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setUserProfile({
        name: "",
        email: ""
      });
      throw error;
    }
  };

  // RF-029: Ver progreso de ruta
  const loadUserProgress = async () => {
    try {
      const progress = await apiServices.user.getProgress();
      setUserProgress(progress);
      
      // Cargar cursos recientes
      const courses = await apiServices.courses.getAllCourses({ limit: 3 });
      setRecentCourses(courses.slice(0, 3));
      
      return progress;
    } catch (error) {
      console.error('Error cargando progreso:', error);
      setUserProgress({
        completedCourses: 8,
        totalCourses: 12,
        consecutiveDays: 15,
        totalHours: 127
      });
      
      // Datos de fallback para cursos recientes
      setRecentCourses([
        { 
          id: 1, 
          titulo: "React Fundamentos", 
          descripcion: "Aprende los conceptos básicos de React",
          duracion: "4 semanas",
          nivel: "Principiante",
          categoria: "Desarrollo Web",
          calificacion: 4.5,
          url: "https://example.com/react"
        },
        { 
          id: 2, 
          titulo: "JavaScript Avanzado", 
          descripcion: "Domina conceptos avanzados de JavaScript",
          duracion: "6 semanas",
          nivel: "Avanzado",
          categoria: "Programación",
          calificacion: 4.8,
          url: "https://example.com/js"
        },
        { 
          id: 3, 
          titulo: "Python para IA", 
          descripcion: "Introducción a Python para inteligencia artificial",
          duracion: "8 semanas",
          nivel: "Intermedio",
          categoria: "Inteligencia Artificial",
          calificacion: 4.7,
          url: "https://example.com/python"
        }
      ]);
      
      throw error;
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
    navigate(route);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // RF-019: Interfaz de chat con IA
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { 
      text: chatInput, 
      isBot: false, 
      timestamp: new Date() 
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const response = await apiServices.chat.sendMessage(chatInput, conversationId);
      
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      const botResponse = { 
        text: response.message, 
        isBot: true, 
        timestamp: new Date() 
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error en chat:', error);
      
      const errorResponse = { 
        text: "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.", 
        isBot: true, 
        timestamp: new Date(),
        isError: true
      };
      
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setChatLoading(false);
      setChatInput("");
    }
  };

  const handleLogout = () => {
    apiServices.auth.logout();
    navigate('/');
  };

  // RF-028: Marcar recurso como completado
  const markResourceCompleted = async (resourceId) => {
    try {
      await apiServices.user.markResourceCompleted(resourceId);
      await loadUserProgress();
    } catch (error) {
      console.error('Error marcando recurso como completado:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div className="error-container">
          <h2>Error cargando el dashboard</h2>
          <p>{error}</p>
          <button onClick={initializeDashboard} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
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

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="user-profile-sidebar">
            <img src={avatarIcon} alt="Avatar" className="sidebar-avatar" />
        
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li onClick={() => handleNavigation('/dashboard')} className="nav-item active">
                <span className="nav-icon"></span>
                <span>Inicio</span>
              </li>
              <li onClick={() => handleNavigation('/visualizador-rutas')} className="nav-item">
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

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Tu Dashboard de Aprendizaje</h1>
            <p>Continúa tu viaje de aprendizaje personalizado con IA </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card purple">
              <div className="stat-header">
                <div className="stat-icon">📈</div>
                <h3>Progreso</h3>
              </div>
              <div className="stat-body">
                <div className="progress-circle" style={{'--progress': userProgress.totalCourses > 0 ? (userProgress.completedCourses / userProgress.totalCourses) * 100 : 0}}>
                  <span className="progress-number">{userProgress.completedCourses}/{userProgress.totalCourses}</span>
                </div>
                <p>Cursos Completados</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-header">
                <div className="stat-icon">⏱️</div>
                <h3>Tiempo</h3>
              </div>
              <div className="stat-body">
                <span className="stat-number">{userProgress.totalHours}h</span>
                <p>Tiempo total</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-header">
                <div className="stat-icon">🎯</div>
                <h3>Nivel</h3>
              </div>
              <div className="stat-body">
                <span className="stat-level">{userProgress.currentLevel}</span>
                <p>Nivel actual</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Courses */}
        <section className="recent-courses">
          <div className="section-header">
            <h2>Continuar Aprendiendo</h2>
            <button 
              className="see-all-btn"
              onClick={() => handleNavigation('/mis-cursos')}
            >
              Ver todos
            </button>
          </div>
          <div className="courses-grid">
            {recentCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <h3>{course.titulo}</h3>
                  <p className="course-desc">{course.descripcion?.slice(0, 100)}...</p>
                  <ul className="course-meta">
                    <li><strong>Duración:</strong> {course.duracion}</li>
                    <li><strong>Nivel:</strong> {course.nivel}</li>
                    <li><strong>Categoría:</strong> {course.categoria}</li>
                    <li><strong>⭐ {course.calificacion}</strong></li>
                  </ul>
                  <div className="course-actions">
                    <button
                      className="continue-btn"
                      onClick={() => navigate(`/curso/${course.id}`)}
                    >
                      Continuar Curso
                    </button>
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        Ver en Plataforma
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button 
              className="action-card primary"
              onClick={() => handleNavigation('/catalogo')}
            >
              <div className="action-icon">🔍</div>
              <div className="action-content">
                <h3>Explorar Cursos</h3>
                <p>Encuentra nuevos cursos para aprender</p>
              </div>
            </button>
            
            <button 
              className="action-card secondary"
              onClick={() => handleNavigation('/rutas')}
            >
              <div className="action-icon">🗺️</div>
              <div className="action-content">
                <h3>Crear Ruta</h3>
                <p>Genera una ruta personalizada con IA</p>
              </div>
            </button>
            
            <button 
              className="action-card tertiary"
              onClick={() => handleNavigation('/mis-favoritos')}
            >
              <div className="action-icon">⭐</div>
              <div className="action-content">
                <h3>Mis Favoritos</h3>
                <p>Revisa tus cursos guardados</p>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Botón flotante del chat - Solo visible en móvil */}
      <button 
        className="chat-float-btn"
        onClick={toggleChat}
        aria-label="Abrir chat con IA"
      >
        <div className="chat-btn-content">
          <div className="ai-avatar">IA</div>
        </div>
      </button>

{/* Chatbot - Siempre visible en desktop, controlado en móvil */}
<div className={`chatbot-container ${chatOpen ? 'open' : 'mobile-hidden'}`}>
  <div className="chat-widget">
    <div className="chat-header">
      <div className="chat-header-content">
        <div className="ai-avatar-header">IA</div>
        <div className="chat-title">
          <strong>LearnIA Assistant</strong>
          <p>Pregúntame sobre cualquier tema</p>
        </div>
      </div>
      {/* Botón cerrar solo visible en móvil */}
      <button 
        className="chat-close-btn"
        onClick={toggleChat}
        aria-label="Cerrar chat"
      >
        ✕
      </button>
    </div>
    
    <div className="chat-body">
      {chatMessages.map((message, index) => (
        <div 
          key={index} 
          className={`chat-message ${message.isBot ? 'bot-message' : 'user-message'} ${message.isError ? 'error-message' : ''}`}
        >
          {message.isBot && (
            <div className="message-avatar">IA</div>
          )}
          <div className="message-content">{message.text}</div>
        </div>
      ))}
      {chatLoading && (
        <div className="chat-message bot-message loading-message">
          <div className="message-avatar">IA</div>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
    
    <div className="chat-footer">
      <input 
        type="text" 
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="¿Qué te gustaría aprender?" 
        maxLength={500}
        disabled={chatLoading}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatSubmit(e);
          }
        }}
      />
      <button 
        onClick={handleChatSubmit} 
        disabled={!chatInput.trim() || chatLoading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</div>
    </div>
  );
}

export default Dashboard;