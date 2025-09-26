import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.png';
import "../styles/Dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    categoria: '',
    nivel: '',
    precio: '',
    duracion: ''
  });

  
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

  const handleLogout = async () => {
    try {
      await apiServices.auth.logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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

  // Manejar resultados de búsqueda
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Función de búsqueda local (preparada para endpoints)
  const performSearch = async (searchTerm, filters = {}) => {
    try {
      // TODO: Reemplazar con llamada real al endpoint
      // const response = await fetch('/api/courses/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ searchTerm, filters })
      // });
      // const results = await response.json();
      
      // Por ahora, simulamos búsqueda local
      const mockCourses = [
        {
          id: 1,
          titulo: "React Fundamentos",
          descripcion: "Aprende los conceptos básicos de React y construye aplicaciones web modernas",
          duracion: "4 semanas",
          nivel: "Principiante",
          categoria: "Desarrollo Web",
          calificacion: 4.5,
          instructor: "Ana López",
          precio: "Gratis",
          imagen: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop"
        },
        {
          id: 2,
          titulo: "JavaScript Avanzado",
          descripcion: "Domina conceptos avanzados de JavaScript como closures, promises y async/await",
          duracion: "6 semanas",
          nivel: "Avanzado",
          categoria: "Programación",
          calificacion: 4.8,
          instructor: "Carlos Rodríguez",
          precio: "$49",
          imagen: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop"
        },
        {
          id: 3,
          titulo: "Python para IA",
          descripcion: "Introducción a Python para inteligencia artificial y machine learning",
          duracion: "8 semanas",
          nivel: "Intermedio",
          categoria: "Inteligencia Artificial",
          calificacion: 4.7,
          instructor: "María García",
          precio: "$79",
          imagen: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop"
        },
        {
          id: 4,
          titulo: "Diseño UX/UI",
          descripcion: "Aprende a diseñar interfaces de usuario intuitivas y atractivas",
          duracion: "5 semanas",
          nivel: "Principiante",
          categoria: "Diseño",
          calificacion: 4.6,
          instructor: "Laura Martínez",
          precio: "Gratis",
          imagen: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
        },
        {
          id: 5,
          titulo: "Node.js Backend",
          descripcion: "Desarrollo de aplicaciones backend con Node.js y Express",
          duracion: "7 semanas",
          nivel: "Intermedio",
          categoria: "Desarrollo Web",
          calificacion: 4.4,
          instructor: "Diego Fernández",
          precio: "$65",
          imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop"
        }
      ];

      // Filtrar resultados basado en el término de búsqueda
      let filteredResults = mockCourses;
      
      if (searchTerm) {
        filteredResults = filteredResults.filter(course =>
          course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtros adicionales
      if (filters.categoria && filters.categoria !== '') {
        filteredResults = filteredResults.filter(course =>
          course.categoria.toLowerCase() === filters.categoria.toLowerCase()
        );
      }

      if (filters.nivel && filters.nivel !== '') {
        filteredResults = filteredResults.filter(course =>
          course.nivel.toLowerCase() === filters.nivel.toLowerCase()
        );
      }

      if (filters.precio && filters.precio !== '') {
        if (filters.precio === 'gratis') {
          filteredResults = filteredResults.filter(course =>
            course.precio.toLowerCase() === 'gratis'
          );
        } else if (filters.precio === 'pago') {
          filteredResults = filteredResults.filter(course =>
            course.precio.toLowerCase() !== 'gratis'
          );
        }
      }

      handleSearchResults(filteredResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      handleSearchResults([]);
    }
  };

  // Limpiar resultados de búsqueda
  const clearSearchResults = () => {
    setSearchResults([]);
    setShowSearchResults(false);
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
        <div className="header-container">
          
          {/* Sección izquierda: Avatar/Menú + Logo */}
          <div className="header-left">
            {/* Avatar del usuario que actúa como botón de menú */}
            <div className="user-info" onClick={toggleSidebar}>
              <img src={avatarIcon} alt="Avatar" className="user-avatar" />
              {userProfile?.name && <span className="user-name">{userProfile.name}</span>}
            </div>

            {/* Logo LearnIA */}
            <div className="logo-section">
              <img src={logoImage} alt="LearnIA Logo" className="logo-img" />
            </div>
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

        {/* Buscador con filtros */}
        <section className="search-section">
          <h2>Encuentra tu próximo curso</h2>
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar cursos, categorías o instructores..."
                className="search-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    performSearch(e.target.value, searchFilters);
                  }
                }}
              />
              <button
                className="search-btn"
                onClick={(e) => {
                  const searchInput = e.target.parentNode.querySelector('.search-input');
                  performSearch(searchInput.value, searchFilters);
                }}
              >
                🔍 Buscar
              </button>
            </div>
            
            <div className="filters-container">
              <select
                value={searchFilters.categoria}
                onChange={(e) => setSearchFilters({...searchFilters, categoria: e.target.value})}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Programación">Programación</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Diseño">Diseño</option>
              </select>

              <select
                value={searchFilters.nivel}
                onChange={(e) => setSearchFilters({...searchFilters, nivel: e.target.value})}
                className="filter-select"
              >
                <option value="">Todos los niveles</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>

              <select
                value={searchFilters.precio}
                onChange={(e) => setSearchFilters({...searchFilters, precio: e.target.value})}
                className="filter-select"
              >
                <option value="">Todos los precios</option>
                <option value="gratis">Gratis</option>
                <option value="pago">De pago</option>
              </select>

              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchFilters({categoria: '', nivel: '', precio: '', duracion: ''});
                  clearSearchResults();
                }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </section>

        {/* Resultados de búsqueda */}
        {showSearchResults && (
          <section className="search-results-section">
            <div className="section-header">
              <h2>Resultados de búsqueda ({searchResults.length})</h2>
              <button 
                className="close-search-btn"
                onClick={clearSearchResults}
              >
                ✕ Cerrar resultados
              </button>
            </div>
            <div className="search-results-grid">
              {searchResults.map((course) => (
                <div key={course.id} className="course-card search-result-card">
                  <div className="course-image">
                    <img src={course.imagen} alt={course.titulo} />
                    <div className="course-price">{course.precio}</div>
                    <div className="course-level">{course.nivel}</div>
                  </div>
                  <div className="course-info">
                    <h3>{course.titulo}</h3>
                    <p className="course-desc">{course.descripcion}</p>
                    <div className="course-meta">
                      <span><strong>👨‍🏫</strong> {course.instructor}</span>
                      <span><strong>📚</strong> {course.categoria}</span>
                      <span><strong>⏱️</strong> {course.duracion}</span>
                      <span><strong>⭐</strong> {course.calificacion}</span>
                    </div>
                    <div className="course-actions">
                      <button
                        className="enroll-btn"
                        onClick={() => console.log(`Inscribirse en: ${course.titulo}`)}
                      >
                        Ver Curso
                      </button>
                      <button
                        className="favorite-btn"
                        onClick={() => console.log(`Agregar a favoritos: ${course.titulo}`)}
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {searchResults.length === 0 && (
              <div className="no-results">
                <p>No se encontraron cursos que coincidan con tu búsqueda.</p>
                <button onClick={clearSearchResults} className="try-again-btn">
                  Intentar nueva búsqueda
                </button>
              </div>
            )}
          </section>
        )}

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

  {/* ChatIA real (logueado) */}

    </div>
  );
}

export default Dashboard;