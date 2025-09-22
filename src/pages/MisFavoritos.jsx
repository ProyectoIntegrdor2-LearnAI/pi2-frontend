import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.jpg';
import "../styles/Dashboard.css";
import "../styles/MisFavoritos.css";

// Datos simulados de cursos favoritos
const cursosFavoritosSimulados = [
  {
    id: 1,
    titulo: "Complete React Developer Course 2024",
    descripcion: "Master React by building real projects. Includes Redux, React Router, Hooks, Context API and modern React development.",
    plataforma: "Udemy",
    instructor: "Andrew Mead",
    duracion: "39 hours",
    nivel: "Intermedio",
    rating: 4.7,
    estudiantes: "145,234",
    precio: "$89.99",
    precioOriginal: "$199.99",
    descuento: 55,
    imagen: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    url: "https://udemy.com/react-complete-course",
    categoria: "Desarrollo Web",
    tags: ["React", "JavaScript", "Frontend", "Redux"],
    fechaAgregado: "2024-02-15",
    ultimaActualizacion: "2024-01-20",
    idioma: "Inglés",
    certificado: true,
    accesoVitalicio: true,
    videoHoras: 39,
    articulos: 12,
    recursosDescargables: 8
  },
  {
    id: 2,
    titulo: "Machine Learning A-Z: AI, Python & R + ChatGPT Bonus",
    descripcion: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
    plataforma: "Udemy",
    instructor: "Kirill Eremenko",
    duracion: "44 hours",
    nivel: "Principiante",
    rating: 4.5,
    estudiantes: "256,789",
    precio: "$94.99",
    precioOriginal: "$199.99",
    descuento: 52,
    imagen: "https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg",
    url: "https://udemy.com/machine-learning-az",
    categoria: "Data Science",
    tags: ["Machine Learning", "Python", "AI", "Data Science"],
    fechaAgregado: "2024-02-10",
    ultimaActualizacion: "2024-01-15",
    idioma: "Inglés",
    certificado: true,
    accesoVitalicio: true,
    videoHoras: 44,
    articulos: 24,
    recursosDescargables: 15
  },
  {
    id: 3,
    titulo: "AWS Certified Solutions Architect Associate",
    descripcion: "Pass the AWS Certified Solutions Architect Associate exam! Complete AWS SAA-C03 course with practice tests.",
    plataforma: "Udemy",
    instructor: "Stephane Maarek",
    duracion: "27 hours",
    nivel: "Intermedio",
    rating: 4.8,
    estudiantes: "198,456",
    precio: "$79.99",
    precioOriginal: "$199.99",
    descuento: 60,
    imagen: "https://img-c.udemycdn.com/course/750x422/362070_b9a1_10.jpg",
    url: "https://udemy.com/aws-certified-solutions-architect",
    categoria: "Cloud Computing",
    tags: ["AWS", "Cloud", "Solutions Architect", "Certification"],
    fechaAgregado: "2024-02-05",
    ultimaActualizacion: "2024-01-25",
    idioma: "Inglés",
    certificado: true,
    accesoVitalicio: true,
    videoHoras: 27,
    articulos: 18,
    recursosDescargables: 10
  },
  {
    id: 4,
    titulo: "Python for Data Science and Machine Learning Bootcamp",
    descripcion: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow, and more!",
    plataforma: "Udemy",
    instructor: "Jose Portilla",
    duracion: "25 hours",
    nivel: "Intermedio",
    rating: 4.6,
    estudiantes: "432,123",
    precio: "$84.99",
    precioOriginal: "$199.99",
    descuento: 57,
    imagen: "https://img-c.udemycdn.com/course/750x422/903744_8eb2.jpg",
    url: "https://udemy.com/python-data-science-bootcamp",
    categoria: "Data Science",
    tags: ["Python", "Data Science", "Machine Learning", "Pandas"],
    fechaAgregado: "2024-01-28",
    ultimaActualizacion: "2024-01-10",
    idioma: "Inglés",
    certificado: true,
    accesoVitalicio: true,
    videoHoras: 25,
    articulos: 16,
    recursosDescargables: 12
  },
  {
    id: 5,
    titulo: "Docker & Kubernetes: The Complete Guide",
    descripcion: "Build, test, and deploy Docker applications with Kubernetes while learning production-style development workflows.",
    plataforma: "Udemy",
    instructor: "Stephen Grider",
    duracion: "21 hours",
    nivel: "Intermedio",
    rating: 4.7,
    estudiantes: "87,945",
    precio: "$89.99",
    precioOriginal: "$199.99",
    descuento: 55,
    imagen: "https://img-c.udemycdn.com/course/750x422/1793828_7cd9.jpg",
    url: "https://udemy.com/docker-kubernetes-complete-guide",
    categoria: "DevOps",
    tags: ["Docker", "Kubernetes", "DevOps", "Containers"],
    fechaAgregado: "2024-01-20",
    ultimaActualizacion: "2024-01-18",
    idioma: "Inglés",
    certificado: true,
    accesoVitalicio: true,
    videoHoras: 21,
    articulos: 8,
    recursosDescargables: 6
  },
  {
    id: 6,
    titulo: "Complete Node.js Developer Course",
    descripcion: "Learn Node.js by building real-world applications with Node, Express, MongoDB, Jest, and more!",
    plataforma: "Udemy",
    instructor: "Andrew Mead",
    duracion: "35 hours",
    nivel: "Intermedio",
    rating: 4.7,
    estudiantes: "178,234",
    precio: "$89.99",
    precioOriginal: "$199.99",
    descuento: 55,
    imagen: "https://img-c.udemycdn.com/course/750x422/922484_52a1_8.jpg",
    url: "https://udemy.com/complete-nodejs-developer-course",
    categoria: "Desarrollo Web",
    tags: ["Node.js", "Express", "MongoDB", "Backend"],
    fechaAgregado: "2024-01-15",
    ultimaActualizacion: "2024-01-12",
    idioma: "Inglés",
    certificado: true,
    accesoVitalicio: true,
    videoHoras: 35,
    articulos: 14,
    recursosDescargables: 10
  }
];

function MisFavoritos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursosFavoritos, setCursosFavoritos] = useState(cursosFavoritosSimulados);
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [ordenarPor, setOrdenarPor] = useState("fechaAgregado");
  const [vistaGrid, setVistaGrid] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

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
  const categorias = ["Todas", ...new Set(cursosFavoritos.map(curso => curso.categoria))];
  const niveles = ["Todos", ...new Set(cursosFavoritos.map(curso => curso.nivel))];

  // Filtrar y ordenar cursos
  const cursosFiltrados = cursosFavoritos
    .filter(curso => {
      if (filtroCategoria !== "Todas" && curso.categoria !== filtroCategoria) return false;
      if (filtroNivel !== "Todos" && curso.nivel !== filtroNivel) return false;
      return true;
    })
    .sort((a, b) => {
      switch (ordenarPor) {
        case "fechaAgregado":
          return new Date(b.fechaAgregado) - new Date(a.fechaAgregado);
        case "titulo":
          return a.titulo.localeCompare(b.titulo);
        case "rating":
          return b.rating - a.rating;
        case "precio":
          return parseFloat(a.precio.replace('$', '')) - parseFloat(b.precio.replace('$', ''));
        default:
          return 0;
      }
    });

  const removerDeFavoritos = (cursoId) => {
    setCursosFavoritos(prev => prev.filter(curso => curso.id !== cursoId));
  };

  const irAlCurso = (url) => {
    window.open(url, '_blank');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
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
              <img src={avatarIcon} alt="Avatar" className="user-avatar" />
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
            <img src={avatarIcon} alt="Avatar" className="sidebar-avatar" />
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
              <li onClick={() => handleNavigation('/catalogo')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Explorar Cursos</span>
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
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Mis Favoritos</h1>
            <p>Cursos que has guardado para estudiar más tarde</p>
          </div>
        </section>

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
              <h3>No tienes cursos favoritos</h3>
              <p>Explora nuestro catálogo y guarda los cursos que te interesen</p>
              <button 
                className="cta-button"
                onClick={() => handleNavigation('/catalogo')}
              >
                Explorar Cursos
              </button>
            </div>
          ) : (
            <div className={`cursos-grid ${vistaGrid ? 'grid-view' : 'list-view'}`}>
              {cursosFiltrados.map((curso) => (
                <div key={curso.id} className="curso-card">
                  <div className="curso-imagen">
                    <img src={curso.imagen} alt={curso.titulo} />
                    <div className="curso-overlay">
                      <button 
                        className="preview-btn"
                        onClick={() => irAlCurso(curso.url)}
                      >
                        Ver Curso
                      </button>
                    </div>
                  </div>
                  
                  <div className="curso-content">
                    <div className="curso-header">
                      <div className="plataforma-badge">{curso.plataforma}</div>
                      <button 
                        className="favorite-btn active"
                        onClick={() => removerDeFavoritos(curso.id)}
                        title="Quitar de favoritos"
                      >
                        ♥
                      </button>
                    </div>

                    <h3 className="curso-titulo">{curso.titulo}</h3>
                    <p className="curso-instructor">Por {curso.instructor}</p>
                    <p className="curso-descripcion">{curso.descripcion}</p>

                    <div className="curso-meta">
                      <div className="meta-item">
                        <span className="meta-icon">⭐</span>
                        <span>{curso.rating} ({curso.estudiantes})</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">🕒</span>
                        <span>{curso.duracion}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📊</span>
                        <span>{curso.nivel}</span>
                      </div>
                    </div>

                    <div className="curso-tags">
                      {curso.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="curso-precio">
                      <span className="precio-actual">{curso.precio}</span>
                      <span className="precio-original">{curso.precioOriginal}</span>
                      <span className="descuento">-{curso.descuento}%</span>
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
                          onClick={() => irAlCurso(curso.url)}
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
                  <div className="stat-number">
                    {(cursosFavoritos.reduce((acc, curso) => acc + curso.rating, 0) / cursosFavoritos.length).toFixed(1)}
                  </div>
                  <p>Calificación</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon">🕒</div>
                  <h3>Tiempo Total</h3>
                </div>
                <div className="stat-body">
                  <div className="stat-number">
                    {cursosFavoritos.reduce((acc, curso) => acc + parseInt(curso.duracion), 0)}h
                  </div>
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