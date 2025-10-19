import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import { unwrapApiData, normalizeCourse, ensureArray } from "../utils/apiData";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.png';
import "../styles/Dashboard.css";
import { useRutasAprendizaje } from "../hooks/useRutasAprendizaje";

function Dashboard() {
  const FAVORITES_STORAGE_KEY = 'learnia_course_favorites';

  const readStoredFavorites = () => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    } catch {
      // noop
    }
    return new Set();
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [apiProgress, setApiProgress] = useState(null);
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
  const [courseCategories, setCourseCategories] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [favoriteCourseIds, setFavoriteCourseIds] = useState(() => readStoredFavorites());

  const {
    rutas,
    loading: rutasLoading,
    obtenerEstadisticas: obtenerEstadisticasRutas
  } = useRutasAprendizaje();

  const rutasStats = useMemo(() => obtenerEstadisticasRutas(), [obtenerEstadisticasRutas]);

  const rutasRecientes = useMemo(() => {
    if (!rutas.length) {
      return [];
    }

    return [...rutas]
      .sort((a, b) => {
        const bTime =
          new Date(b.ultimaActualizacion || b.fechaCreacion || 0).getTime() || 0;
        const aTime =
          new Date(a.ultimaActualizacion || a.fechaCreacion || 0).getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [rutas]);

  const promedioProgresoRutas = useMemo(() => {
    if (!rutas.length) {
      return 0;
    }
    const total = rutas.reduce((acc, ruta) => acc + (ruta.progreso || 0), 0);
    return Math.round(total / rutas.length);
  }, [rutas]);

  const localProgress = useMemo(() => {
    if (!rutas.length) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalHours: 0,
        latestLevel: null,
      };
    }

    let totalCourses = 0;
    let completedCourses = 0;
    let totalHours = 0;
    let latestLevel = rutasRecientes[0]?.nivel || rutas[0]?.nivel || null;
    let latestTimestamp = rutasRecientes[0]?.ultimaActualizacion
      ? Date.parse(rutasRecientes[0]?.ultimaActualizacion)
      : rutasRecientes[0]?.fechaCreacion
      ? Date.parse(rutasRecientes[0]?.fechaCreacion)
      : 0;

    rutas.forEach((ruta) => {
      const cursosRegulares = (ruta.cursos || []).filter((c) => !c.esMeta);
      totalCourses += cursosRegulares.length;

      completedCourses += cursosRegulares.filter((c) =>
        ['completado', 'omitido'].includes(c.estado)
      ).length;

      const horas = Number(
        ruta.horasEstimadas ??
        ruta.estimatedTotalHours ??
        ruta.estimacionHoras ??
        0
      );
      if (!Number.isNaN(horas)) {
        totalHours += horas;
      }

      const rutaTimestamp = ruta.ultimaActualizacion
        ? Date.parse(ruta.ultimaActualizacion)
        : ruta.fechaCreacion
        ? Date.parse(ruta.fechaCreacion)
        : 0;

      if (rutaTimestamp && rutaTimestamp > latestTimestamp) {
        latestTimestamp = rutaTimestamp;
        latestLevel = ruta.nivel || latestLevel;
      }
    });

    return {
      totalCourses,
      completedCourses,
      totalHours: Math.round(totalHours),
      latestLevel: latestLevel || 'Sin datos',
    };
  }, [rutas, rutasRecientes]);

  const combinedProgress = useMemo(() => {
    const api = apiProgress ?? {};
    const completedRemote = Number(api.completedCourses ?? api.completed_courses ?? 0);
    const totalRemote = Number(api.totalCourses ?? api.total_courses ?? 0);
    const hoursRemote = Number(api.totalHours ?? api.horasTotales ?? 0);
    const levelRemote = api.currentLevel && api.currentLevel !== 'Sin datos' ? api.currentLevel : null;

    return {
      completedCourses: Math.max(localProgress.completedCourses, completedRemote),
      totalCourses: Math.max(localProgress.totalCourses, totalRemote),
      totalHours: Math.max(localProgress.totalHours, hoursRemote),
      currentLevel: levelRemote || localProgress.latestLevel || 'Sin datos',
    };
  }, [apiProgress, localProgress]);

  
  const navigate = useNavigate();

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(Array.from(favoriteCourseIds))
      );
    } catch {
      // noop
    }
  }, [FAVORITES_STORAGE_KEY, favoriteCourseIds]);

  const initializeDashboard = async () => {
    setLoading(true);
    setError(null);

    const [dashboardResult, coursesResult, progressResult, categoriesResult] = await Promise.allSettled([
      loadDashboardData(),
      loadCourseCatalog(),
      loadUserProgress(),
      loadCourseCategories()
    ]);

    if (dashboardResult.status === 'rejected') {
      console.error('Error cargando datos del dashboard:', dashboardResult.reason);
      setError(
        dashboardResult.reason?.message ||
          'No fue posible cargar tu información personal'
      );
    }

    if (categoriesResult.status === 'rejected') {
      console.error('Error cargando categorías:', categoriesResult.reason);
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

      normalized.totalCourses = Math.max(normalized.totalCourses || 0, localProgress.totalCourses);
      normalized.completedCourses = Math.max(normalized.completedCourses || 0, localProgress.completedCourses);
      normalized.totalHours = Math.max(normalized.totalHours || 0, localProgress.totalHours);
      if (!normalized.currentLevel || normalized.currentLevel === 'Sin datos') {
        normalized.currentLevel = localProgress.latestLevel || 'En progreso';
      }

      setApiProgress(normalized);
      return normalized;
    } catch (error) {
      console.warn('Error cargando progreso:', error);
      setProgressError(
        error?.message || 'No fue posible obtener tu progreso todavía'
      );
      setApiProgress(null);
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

  const loadCourseCategories = async () => {
    try {
      const response = await apiServices.courses.getCategories();
      const categories = ensureArray(unwrapApiData(response));
      const normalized = categories
        .map((item) => ({
          name: item?.name || item?.categoria || item?._id || 'General',
          count: Number(item?.count || item?.total || 0),
        }))
        .filter((item) => item.name);
      setCourseCategories(normalized);
      return normalized;
    } catch (error) {
      console.warn('No fue posible cargar categorías:', error);
      setCourseCategories([]);
      return [];
    }
  };

  const toggleFavoriteCourse = async (courseId) => {
    try {
      const result = await apiServices.courses.toggleFavorite(courseId);
      setFavoriteCourseIds((prev) => {
        const next = new Set(prev);
        const favoriteId = String(result.courseId ?? courseId);
        if (result.isFavorite) {
          next.add(favoriteId);
        } else {
          next.delete(favoriteId);
        }
        return next;
      });
    } catch (error) {
      console.error('No se pudo actualizar el favorito:', error);
      setSearchError(error?.message || 'No se pudo actualizar el favorito');
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

  const performSearch = async (query, filters = {}) => {
    const normalizedTerm = (query || '').trim();

    if (!normalizedTerm) {
      clearSearchResults();
      return;
    }

    if (normalizedTerm.length < 3) {
      setSearchError('Escribe al menos 3 caracteres para buscar cursos');
      setSearchResults([]);
      setShowSearchResults(true);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const mappedFilters = {};
      if (filters.categoria) {
        mappedFilters.category = filters.categoria;
      }
      if (filters.nivel) {
        mappedFilters.level = filters.nivel;
      }
      if (filters.precio === 'gratis') {
        mappedFilters.max_price = 0;
      }

      const response = await apiServices.search.main({
        query: normalizedTerm,
        limit: 20,
        filters: mappedFilters,
      });

      const data = unwrapApiData(response);
      const normalized = ensureArray(data?.results ?? response?.results)
        .map(normalizeCourse)
        .filter(Boolean);

      handleSearchResults(normalized);
    } catch (error) {
      console.error('Error realizando búsqueda:', error);
      setSearchResults([]);
      setShowSearchResults(true);
      setSearchError(error?.message || 'No fue posible realizar la búsqueda');
    } finally {
      setSearchLoading(false);
    }
  };

  // Limpiar resultados de búsqueda
  const clearSearchResults = () => {
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchLoading(false);
    setSearchError(null);
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
                {courseCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                    {category.count ? ` (${category.count})` : ''}
                  </option>
                ))}
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
            {searchLoading && (
              <div className="card-placeholder">
                <div className="loading-spinner small"></div>
                <p>Buscando cursos...</p>
              </div>
            )}
            {searchError && !searchLoading && (
              <div className="card-placeholder">
                <p>{searchError}</p>
              </div>
            )}
            <div className="search-results-grid">
              {searchResults.map((course) => {
                const favoriteKey = String(course.id);
                const isFavorite = favoriteCourseIds.has(favoriteKey);
                return (
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
                        onClick={() => {
                          if (course.url) {
                            window.open(course.url, '_blank', 'noopener');
                          }
                        }}
                      >
                        Ver Curso
                      </button>
                      <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={() => toggleFavoriteCourse(course.id)}
                        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        {isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
            
            {searchResults.length === 0 && (
              !searchLoading && !searchError && (
                <div className="no-results">
                  <p>No se encontraron cursos que coincidan con tu búsqueda.</p>
                  <button onClick={clearSearchResults} className="try-again-btn">
                    Intentar nueva búsqueda
                  </button>
                </div>
              )
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
                <div className="progress-circle" style={{'--progress': combinedProgress.totalCourses > 0 ? (combinedProgress.completedCourses / combinedProgress.totalCourses) * 100 : 0}}>
                  <span className="progress-number">{combinedProgress.completedCourses}/{combinedProgress.totalCourses}</span>
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
                <span className="stat-number">{combinedProgress.totalHours}h</span>
                <p>Tiempo total</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-header">
                <div className="stat-icon">🎯</div>
                <h3>Nivel</h3>
              </div>
              <div className="stat-body">
                <span className="stat-level">{combinedProgress.currentLevel}</span>
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

        {/* Learning Paths Overview */}
        <section className="learning-paths-section">
          <div className="section-header">
            <div>
              <h2>Mis Rutas Generadas</h2>
              <p className="section-subtitle">
                Seguimiento en tiempo real de las rutas creadas con la IA
              </p>
            </div>
            <button 
              className="see-all-btn"
              onClick={() => handleNavigation('/visualizador-rutas')}
            >
              Ver todas
            </button>
          </div>

          {rutasLoading ? (
            <div className="card-placeholder">
              <div className="loading-spinner small"></div>
              <p>Cargando tus rutas personalizadas...</p>
            </div>
          ) : rutas.length === 0 ? (
            <div className="card-placeholder">
              <p>Aún no has generado una ruta de aprendizaje.</p>
              <button 
                className="action-card primary compact"
                type="button"
                onClick={() => handleNavigation('/rutas')}
              >
                <span className="action-icon">🗺️</span>
                <span>Crear mi primera ruta</span>
              </button>
            </div>
          ) : (
            <>
              <div className="learning-paths-summary">
                <div className="summary-item">
                  <span className="summary-label">Activas</span>
                  <strong>{rutasStats.rutasEnProgreso || 0}</strong>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Completadas</span>
                  <strong>{rutasStats.rutasCompletadas || 0}</strong>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Cursos totales</span>
                  <strong>{rutasStats.totalCursos || 0}</strong>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Avance global</span>
                  <strong>
                    {promedioProgresoRutas}%
                  </strong>
                </div>
              </div>

              <div className="learning-paths-grid">
                {rutasRecientes.map((ruta) => {
                  const cursosRegulares = (ruta.cursos || []).filter((c) => !c.esMeta);
                  const cursosCompletados = cursosRegulares.filter(
                    (c) => c.estado === 'completado'
                  ).length;
                  const siguienteCurso = cursosRegulares.find(
                    (c) => c.estado === 'disponible' || c.estado === 'en-progreso'
                  );
                  return (
                    <div key={ruta.id} className="learning-path-card">
                      <div className="path-card-header">
                        <h3>{ruta.titulo}</h3>
                        <span className="progress-chip">{ruta.progreso || 0}%</span>
                      </div>
                      <p className="path-description">
                        {ruta.descripcion && ruta.descripcion.length > 140
                          ? `${ruta.descripcion.slice(0, 140)}…`
                          : ruta.descripcion || 'Ruta generada por la IA LearnIA'}
                      </p>
                      <div className="path-meta">
                        <span>📚 {cursosCompletados}/{cursosRegulares.length} cursos completados</span>
                        <span>🕒 {ruta.estimacion || 'Estimación pendiente'}</span>
                      </div>
                      {siguienteCurso && (
                        <div className="path-next-course">
                          <span>Próximo curso:</span>
                          <strong>{siguienteCurso.titulo}</strong>
                        </div>
                      )}
                      <div className="path-actions">
                        <button
                          className="continue-btn"
                          type="button"
                          onClick={() =>
                            navigate('/visualizador-rutas', {
                              state: { rutaSeleccionadaId: ruta.id }
                            })
                          }
                        >
                          Gestionar ruta
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Recent Courses */}
        <section className="recent-courses">
          <div className="section-header">
            <h2>Continuar Aprendiendo</h2>
            <button 
              className="see-all-btn"
              onClick={() => handleNavigation('/catalogo')}
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
