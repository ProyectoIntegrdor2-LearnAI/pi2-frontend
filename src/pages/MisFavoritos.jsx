import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.png';
import { unwrapApiData, normalizeCourse } from "../utils/apiData";
import "../styles/Dashboard.css";
import "../styles/MisFavoritos.css";

function MisFavoritos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursosFavoritos, setCursosFavoritos] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [favoritesError, setFavoritesError] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [ordenarPor, setOrdenarPor] = useState("fechaAgregado");
  const [vistaGrid, setVistaGrid] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
    loadFavoritesCourses();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus cursos favoritos...</p>
        </div>
      </div>
    );
  }

  const loadFavoritesCourses = async () => {
    try {
      setLoading(true);
      setFavoritesError(null);

      const favoritesFromStorage = [];

      try {
        const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (Array.isArray(stored)) {
          stored.forEach((item) => {
            if (!item) return;
            if (typeof item === 'object') {
              const normalized = normalizeCourse(item) || {
                ...item,
                calificacion: Number(item.calificacion || 0),
              };
              favoritesFromStorage.push({
                ...normalized,
                ...item,
                fechaAgregado: item.fechaAgregado || new Date().toISOString(),
              });
            } else {
              favoritesFromStorage.push(String(item));
            }
          });
        }
      } catch (error) {
        console.warn('No se pudo leer favoritos locales:', error);
      }

      let favoritesFromBackend = [];
      const storedUser = apiServices.utils.getStoredUser();
      const userId = storedUser?.user_id || storedUser?.id || null;

      if (userId) {
        try {
          const response = await apiServices.user.getFavorites?.();
          const payload = unwrapApiData(response);
          const backendFavorites = Array.isArray(payload?.favorites || payload)
            ? payload.favorites || payload
            : [];

          favoritesFromBackend = backendFavorites
            .map((fav) => {
              const courseData = fav.course || fav;
              const normalized = normalizeCourse(courseData);
              if (!normalized) return null;
              const fechaAgregado = fav.fecha_agregado || fav.created_at || new Date().toISOString();
              return {
                ...normalized,
                fechaAgregado,
              };
            })
            .filter(Boolean);
        } catch (backendError) {
          console.warn('No se pudo obtener favoritos del backend:', backendError);
        }
      }

      const mergedMap = new Map();

      favoritesFromBackend.forEach((fav) => {
        const key = fav.id || fav.course_id || fav.courseId;
        if (!key) return;
        mergedMap.set(String(key), fav);
      });

      await Promise.all(
        favoritesFromStorage.map(async (fav) => {
          if (!fav) return;
          if (typeof fav === 'string') {
            const key = fav;
            if (!mergedMap.has(key)) {
              try {
                const response = await apiServices.courses.getCourseById(key);
                const data = unwrapApiData(response);
                const normalized = normalizeCourse(data);
                if (normalized) {
                  mergedMap.set(key, {
                    ...normalized,
                    fechaAgregado: new Date().toISOString(),
                  });
                }
              } catch (error) {
                console.warn(`No se pudo resolver curso favorito ${key}:`, error);
              }
            }
            return;
          }

          const key = fav.id || fav.course_id || fav.courseId;
          if (!key) return;
          mergedMap.set(String(key), fav);
        })
      );

      const favorites = Array.from(mergedMap.values());
      setCursosFavoritos(favorites);

      try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.warn('No se pudo sincronizar favoritos locales:', error);
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setFavoritesError(
        error?.message || 'No fue posible cargar tus cursos favoritos'
      );
      setCursosFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

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
    navigate(route);
  };

  const handleLogout = () => {
    apiServices.auth.logout();
    navigate('/');
  };

  // Obtener categorías únicas
  const categorias = [
    "Todas",
    ...Array.from(
      new Set(cursosFavoritos.map((curso) => curso.categoria).filter(Boolean))
    ),
  ];
  const niveles = [
    "Todos",
    ...Array.from(
      new Set(cursosFavoritos.map((curso) => curso.nivel).filter(Boolean))
    ),
  ];

  // Filtrar y ordenar cursos
  const cursosFiltrados = cursosFavoritos
    .filter(curso => {
      if (filtroCategoria !== "Todas" && curso.categoria !== filtroCategoria) return false;
      if (filtroNivel !== "Todos" && curso.nivel !== filtroNivel) return false;
      return true;
    })
    .sort((a, b) => {
      const priceValue = (value) => {
        const normalized = String(value || '').toLowerCase();
        if (normalized.includes('gratis')) {
          return 0;
        }
        const numeric = parseFloat(normalized.replace(/[^0-9.,]/g, '').replace(',', '.'));
        return Number.isNaN(numeric) ? 0 : numeric;
      };

      switch (ordenarPor) {
        case "fechaAgregado":
          return (
            new Date(b.fechaAgregado || b.updated_at || 0) -
            new Date(a.fechaAgregado || a.updated_at || 0)
          );
        case "titulo":
          return (a.titulo || '').localeCompare(b.titulo || '');
        case "rating":
          return Number(b.calificacion || 0) - Number(a.calificacion || 0);
        case "precio":
          return priceValue(a.precio) - priceValue(b.precio);
        default:
          return 0;
      }
    });

  const promedioCalificacion = cursosFavoritos.length
    ? (
        cursosFavoritos.reduce(
          (acc, curso) => acc + Number(curso.calificacion || 0),
          0
        ) / cursosFavoritos.length
      ).toFixed(1)
    : '0.0';

  const totalDuracion = cursosFavoritos.reduce((acc, curso) => {
    const match = String(curso.duracion || '').match(/\d+(\.\d+)?/);
    return acc + (match ? parseFloat(match[0]) : 0);
  }, 0);

  const removerDeFavoritos = (cursoId) => {
    setCursosFavoritos((prev) => prev.filter((curso) => curso.id !== cursoId));

    try {
      const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updated = Array.isArray(stored)
        ? stored.filter((item) =>
            typeof item === 'object' ? item.id !== cursoId : item !== cursoId
          )
        : [];
      localStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Error actualizando favoritos:', error);
    }
  };

  const irAlCurso = (url, cursoId) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      navigate(`/curso/${cursoId}`);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return 'No disponible';
    }

    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) {
      return 'No disponible';
    }

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <div className="user-info" onClick={toggleSidebar}>
              <img src={avatarIcon} alt="Usuario" className="sidebar-avatar" />
              {userProfile?.name && <span className="user-name">{userProfile.name}</span>}
            </div>
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
            <img src={avatarIcon} alt="Usuario" className="sidebar-avatar" />
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li onClick={() => handleNavigation('/dashboard')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Inicio</span>
              </li>
              <li onClick={() => handleNavigation('/visualizador-rutas')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Mis Cursos</span>
              </li>
              <li onClick={() => handleNavigation('/mis-favoritos')} className="nav-item active">
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

      {/* Overlay para cerrar sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Título de página */}
        <div className="page-header">
          <h1>Mis Cursos Favoritos</h1>
          <p className="page-description">Cursos que has guardado para estudiar más tarde</p>
        </div>

        {/* Controles y filtros */}
        <section className="controls-section">
          <div className="filters-row">
            <div className="filters-left">
              <select 
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="filter-select"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>

              <select 
                value={filtroNivel} 
                onChange={(e) => setFiltroNivel(e.target.value)}
                className="filter-select"
              >
                {niveles.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>

              <select 
                value={ordenarPor} 
                onChange={(e) => setOrdenarPor(e.target.value)}
                className="filter-select"
              >
                <option value="fechaAgregado">Agregado recientemente</option>
                <option value="titulo">Título (A-Z)</option>
                <option value="rating">Mejor calificación</option>
                <option value="precio">Precio (menor a mayor)</option>
              </select>
            </div>

            <div className="filters-right">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${vistaGrid ? 'active' : ''}`}
                  onClick={() => setVistaGrid(true)}
                >
                  ⊞
                </button>
                <button 
                  className={`view-btn ${!vistaGrid ? 'active' : ''}`}
                  onClick={() => setVistaGrid(false)}
                >
                  ☰
                </button>
              </div>
              <div className="results-count">
                {cursosFiltrados.length} curso{cursosFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </section>

        {/* Lista de cursos favoritos */}
        <section className="favoritos-section">
          {cursosFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">♥</div>
              <h3>{favoritesError ? 'No pudimos cargar tus favoritos' : 'No encontramos cursos para mostrar'}</h3>
              <p>
                {favoritesError
                  ? favoritesError
                  : 'Ve al inicio y usa el buscador para encontrar cursos que te interesen'}
              </p>
              <button 
                className="cta-button"
                onClick={() => handleNavigation('/dashboard')}
              >
                Ir al Buscador
              </button>
            </div>
          ) : (
            <div className={`cursos-grid ${vistaGrid ? 'grid-view' : 'list-view'}`}>
              {cursosFiltrados.map((curso) => (
                <div key={curso.id} className="curso-card">
                  <div className="curso-content">
                    <div className="curso-header">
                      <div className="plataforma-badge">{curso.plataforma || 'LearnIA'}</div>
                      <button 
                        className="favorite-btn active"
                        onClick={() => removerDeFavoritos(curso.id)}
                        title="Quitar de favoritos"
                      >
                        ♥
                      </button>
                    </div>

                    <h3 className="curso-titulo">{curso.titulo || 'Curso sin título'}</h3>
                    <p className="curso-instructor">Por {curso.instructor || 'Instructor por definir'}</p>
                    <p className="curso-descripcion">
                      {curso.descripcion
                        ? (curso.descripcion.length > 140
                            ? `${curso.descripcion.slice(0, 140)}...`
                            : curso.descripcion)
                        : 'Sin descripción disponible'}
                    </p>

                    <div className="curso-meta">
                      <div className="meta-item">
                        <span className="meta-icon">⭐</span>
                        <span>{Number(curso.calificacion || 0).toFixed(1)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">🕒</span>
                        <span>{curso.duracion || 'Duración no disponible'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📊</span>
                        <span>{curso.nivel || 'Nivel no definido'}</span>
                      </div>
                    </div>

                    <div className="curso-tags">
                      {(curso.tags && curso.tags.length ? curso.tags : [curso.categoria, curso.nivel].filter(Boolean))
                        .slice(0, 3)
                        .map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="curso-precio">
                      <span className="precio-actual">{curso.precio || 'Gratis'}</span>
                    </div>

                    <div className="curso-footer">
                      <div className="fecha-agregado">
                        Agregado: {formatearFecha(curso.fechaAgregado)}
                      </div>
                      <div className="curso-actions">
                        <button 
                          className="action-btn secondary"
                          onClick={() => removerDeFavoritos(curso.id)}
                        >
                          Quitar
                        </button>
                        <button 
                          className="action-btn primary"
                          onClick={() => irAlCurso(curso.url, curso.id)}
                        >
                          Ir al Curso
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Estadísticas de favoritos */}
        {cursosFavoritos.length > 0 && (
          <section className="stats-section">
            <div className="section-header">
              <h2>Estadísticas de Favoritos</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">♥</div>
                  <h3>Total Favoritos</h3>
                </div>
                <div className="stat-body">
                  <div className="stat-number">{cursosFavoritos.length}</div>
                  <p>Cursos guardados</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">📚</div>
                  <h3>Categorías</h3>
                </div>
                <div className="stat-body">
                  <div className="stat-number">{categorias.length - 1}</div>
                  <p>Diferentes áreas</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">⭐</div>
                  <h3>Rating Promedio</h3>
                </div>
                <div className="stat-body">
                  <div className="stat-number">{promedioCalificacion}</div>
                  <p>Calificación</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">🕒</div>
                  <h3>Tiempo Total</h3>
                </div>
                <div className="stat-body">
                  <div className="stat-number">{totalDuracion.toFixed(1)}h</div>
                  <p>De contenido</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default MisFavoritos;
