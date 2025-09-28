import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import { unwrapApiData, normalizeCourse } from "../utils/apiData";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.png';
import "../styles/Dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [userProgress, setUserProgress] = useState({
    completedCourses: 0,
    totalCourses: 0,
    consecutiveDays: 0,
    totalHours: 0,
    currentLevel: "Principiante"
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    categoria: '',
    nivel: '',
    precio: '',
    duracion: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [coursesError, setCoursesError] = useState(null);
  const [progressError, setProgressError] = useState(null);

  
  const navigate = useNavigate();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setLoading(true);
    setError(null);

    const [dashboardResult, coursesResult, progressResult] = await Promise.allSettled([
      loadDashboardData(),
      loadCourseCatalog(),
      loadUserProgress()
    ]);

    if (dashboardResult.status === 'rejected') {
      console.error('Error cargando datos del dashboard:', dashboardResult.reason);
      setError(
        dashboardResult.reason?.message ||
          'No fue posible cargar tu información personal'
      );
    }

    if (coursesResult.status === 'rejected') {
      console.error('Error cargando cursos:', coursesResult.reason);
      setCoursesError(
        coursesResult.reason?.message ||
          'No fue posible cargar los cursos recomendados'
      );
    }

    if (progressResult.status === 'rejected') {
      console.error('Error cargando progreso:', progressResult.reason);
      setProgressError(
        progressResult.reason?.message ||
          'No fue posible obtener tu progreso'
      );
    }

    setLoading(false);
  };

  // Información general de usuario y dashboard
  const loadDashboardData = async () => {
    try {
      const response = await apiServices.dashboard.getDashboard();
      const data = unwrapApiData(response);

      const userData = data?.user || data?.usuario;
      if (userData) {
        setUserProfile(userData);
      } else {
        const cachedUser = apiServices.utils.getStoredUser();
        if (cachedUser) {
          setUserProfile(cachedUser);
        }
      }

      setDashboardInfo(data?.dashboard_info || null);
      return data;
    } catch (error) {
      const cachedUser = apiServices.utils.getStoredUser();
      if (cachedUser) {
        setUserProfile(cachedUser);
      }
      setDashboardInfo(null);
      throw error;
    }
  };

  // Progreso del usuario (si está disponible en la API)
  const loadUserProgress = async () => {
    try {
      setProgressError(null);
      const response = await apiServices.user.getProgress();
      const data = unwrapApiData(response);

      const rawProgress =
        data?.progress ||
        data?.progreso ||
        data?.data?.progress ||
        data;

      const normalized = {
        completedCourses: Number(
          rawProgress?.completedCourses ?? rawProgress?.completed_courses ?? 0
        ),
        totalCourses: Number(
          rawProgress?.totalCourses ?? rawProgress?.total_courses ?? 0
        ),
        consecutiveDays: Number(
          rawProgress?.consecutiveDays ??
            rawProgress?.diasConsecutivos ??
            rawProgress?.streak ??
            0
        ),
        totalHours: Number(
          rawProgress?.totalHours ?? rawProgress?.horasTotales ?? 0
        ),
        currentLevel:
          rawProgress?.level ||
          rawProgress?.nivel ||
          'En progreso',
      };

      setUserProgress((prev) => ({
        ...prev,
        ...normalized,
      }));

      return normalized;
    } catch (error) {
      console.warn('Error cargando progreso:', error);
      setProgressError(
        error?.message || 'No fue posible obtener tu progreso todavía'
      );
      setUserProgress((prev) => ({
        ...prev,
        completedCourses: 0,
        totalCourses: 0,
        consecutiveDays: 0,
        totalHours: 0,
        currentLevel: prev?.currentLevel || 'Sin datos',
      }));
      return null;
    }
  };

  const loadCourseCatalog = async () => {
    try {
      setCoursesError(null);
      const response = await apiServices.courses.getAllCourses({ limit: 12 });
      const data = unwrapApiData(response);

      const rawCourses = Array.isArray(data?.courses)
        ? data.courses
        : Array.isArray(data)
          ? data
          : [];

      const normalized = rawCourses
        .map(normalizeCourse)
        .filter(Boolean);

      setAvailableCourses(normalized);
      setRecentCourses(normalized.slice(0, 3));
      return normalized;
    } catch (error) {
      console.warn('Error cargando cursos:', error);
      setCoursesError(
        error?.message || 'No fue posible cargar los cursos recomendados'
      );
      setAvailableCourses([]);
      setRecentCourses([]);
      return null;
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
    setShowSearchResults(true);
  };

  const performSearch = (searchTerm, filters = {}) => {
    const normalizedTerm = (searchTerm || '').trim().toLowerCase();
    let filteredResults = [...availableCourses];

    if (normalizedTerm) {
      filteredResults = filteredResults.filter((course) =>
        [
          course.titulo,
          course.descripcion,
          course.categoria,
          course.instructor,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedTerm))
      );
    }

    if (filters.categoria) {
      const category = filters.categoria.toLowerCase();
      filteredResults = filteredResults.filter(
        (course) => course.categoria?.toLowerCase() === category
      );
    }

    if (filters.nivel) {
      const level = filters.nivel.toLowerCase();
      filteredResults = filteredResults.filter(
        (course) => course.nivel?.toLowerCase() === level
      );
    }

    if (filters.precio) {
      filteredResults = filteredResults.filter((course) => {
        const price = (course.precio || '').toString().toLowerCase();
        if (filters.precio === 'gratis') {
          return price.includes('gratis') || price === '0' || price === '$0';
        }
        if (filters.precio === 'pago') {
          return price && !price.includes('gratis');
        }
        return true;
      });
    }

    handleSearchResults(filteredResults);
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
                value={searchTerm}
                placeholder="Buscar cursos, categorías o instructores..."
                className="search-input"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (showSearchResults) {
                    performSearch(value, searchFilters);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    performSearch(e.target.value, searchFilters);
                  }
                }}
              />
              <button
                className="search-btn"
                onClick={(e) => {
                  performSearch(searchTerm, searchFilters);
                }}
              >
                🔍 Buscar
              </button>
            </div>
            
            <div className="filters-container">
              <select
                value={searchFilters.categoria}
                onChange={(e) => {
                  const nextFilters = { ...searchFilters, categoria: e.target.value };
                  setSearchFilters(nextFilters);
                  if (searchTerm || showSearchResults) {
                    performSearch(searchTerm, nextFilters);
                  }
                }}
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
                onChange={(e) => {
                  const nextFilters = { ...searchFilters, nivel: e.target.value };
                  setSearchFilters(nextFilters);
                  if (searchTerm || showSearchResults) {
                    performSearch(searchTerm, nextFilters);
                  }
                }}
                className="filter-select"
              >
                <option value="">Todos los niveles</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>

              <select
                value={searchFilters.precio}
                onChange={(e) => {
                  const nextFilters = { ...searchFilters, precio: e.target.value };
                  setSearchFilters(nextFilters);
                  if (searchTerm || showSearchResults) {
                    performSearch(searchTerm, nextFilters);
                  }
                }}
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
                  setSearchTerm('');
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

        {progressError && (
          <div className="empty-state">
            {progressError}
          </div>
        )}

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
            {recentCourses.length === 0 ? (
              <div className="empty-state">
                {coursesError || 'Aún no tenemos cursos recomendados para ti.'}
              </div>
            ) : (
              recentCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-info">
                    <h3>{course.titulo}</h3>
                    <p className="course-desc">
                      {course.descripcion
                        ? `${course.descripcion.slice(0, 100)}${course.descripcion.length > 100 ? '…' : ''}`
                        : 'Sin descripción disponible'}
                    </p>
                    <ul className="course-meta">
                      <li><strong>Duración:</strong> {course.duracion || 'N/D'}</li>
                      <li><strong>Nivel:</strong> {course.nivel || 'N/D'}</li>
                      <li><strong>Categoría:</strong> {course.categoria || 'N/D'}</li>
                      <li><strong>⭐ {Number(course.calificacion || 0).toFixed(1)}</strong></li>
                    </ul>
                    <div className="course-actions">
                      {course.url ? (
                        <button
                          className="continue-btn"
                          onClick={() => window.open(course.url, '_blank', 'noopener')}
                        >
                          Ver Curso
                        </button>
                      ) : (
                        <button
                          className="continue-btn"
                          onClick={() => navigate(`/curso/${course.id}`)}
                        >
                          Ver detalles
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
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
