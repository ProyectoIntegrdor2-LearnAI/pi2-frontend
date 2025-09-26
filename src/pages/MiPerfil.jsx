import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.png';
import "../styles/Dashboard.css";
import "../styles/MiPerfil.css";

// Context para el tema (esto se implementaría globalmente)
const ThemeContext = React.createContext();

// Datos simulados del perfil del usuario
const perfilSimulado = {
  name: "Juan Carlos Pérez González",
  id: "1234567890", // Cédula
  address: "Calle 45 #23-67, Bucaramanga, Santander",
  email: "juan.perez@email.com",
  phone: "+57 300 123 4567",
  typeUser: "Estudiante", // Estudiante, Profesor, Administrador
  avatar: null,
  fechaRegistro: "2024-01-15",
  ultimoAcceso: "2024-02-20T14:30:00",
  configuraciones: {
    tema: "claro", // claro, oscuro, sistema
    idioma: "es", // es, en
    notificaciones: {
      email: true,
      push: true,
      marketing: false,
      cursos: true,
      progreso: true
    },
    privacidad: {
      perfilPublico: false,
      mostrarProgreso: true,
      mostrarCursos: false
    },
    aprendizaje: {
      recordatoriosDiarios: true,
      horaRecordatorio: "09:00",
      metaSemanal: 5, // horas por semana
      dificultadPreferida: "intermedio",
      categoriasInteres: ["Desarrollo Web", "Data Science", "DevOps"]
    }
  },
  estadisticas: {
    cursosCompletados: 12,
    horasEstudiadas: 156,
    rutasTerminadas: 3,
    certificadosObtenidos: 8,
    rachaActual: 15, // días consecutivos
    promedioCalificacion: 4.7
  }
};

function MiPerfil() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [perfilData, setPerfilData] = useState(perfilSimulado);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [configuraciones, setConfiguraciones] = useState(perfilSimulado.configuraciones);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
    // Aplicar tema al cargar
    applyTheme(configuraciones.tema);
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // const profile = await apiServices.user.getProfile();
      // setPerfilData(profile);
      // setFormData(profile);
      const savedAvatar = localStorage.getItem('userAvatar') || 'avatar1';
      setFormData({...perfilData, avatar: savedAvatar});
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      setLoading(false);
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

  // Manejar cambios en formularios
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (section, field, value) => {
    setConfiguraciones(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Aplicar tema inmediatamente
    if (section === 'tema' || (section === undefined && field === 'tema')) {
      applyTheme(value);
    }
  };

  // Aplicar tema a la página
  const applyTheme = (tema) => {
    const root = document.documentElement;
    
    if (tema === 'oscuro') {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (tema === 'sistema') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      document.body.classList.toggle('dark-theme', prefersDark);
      document.body.classList.toggle('light-theme', !prefersDark);
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // Guardar preferencia
    localStorage.setItem('theme-preference', tema);
    
    // Aplicar el tema a toda la aplicación inmediatamente
    updateAllComponents(tema);
  };

  // Función para actualizar todos los componentes con el nuevo tema
  const updateAllComponents = (tema) => {
    // Aplicar clases CSS globalmente
    const dashboardElements = document.querySelectorAll('.dashboard-wrapper, .dashboard-main, .dashboard-header, .sidebar');
    dashboardElements.forEach(element => {
      if (tema === 'oscuro') {
        element.classList.add('dark-mode');
        element.classList.remove('light-mode');
      } else {
        element.classList.add('light-mode');
        element.classList.remove('dark-mode');
      }
    });

    // Forzar re-render de las variables CSS
    const event = new CustomEvent('themeChange', { 
      detail: { theme: tema } 
    });
    window.dispatchEvent(event);
  };

  // Guardar cambios del perfil
  const saveProfile = async () => {
    try {
      setLoading(true);
      // await apiServices.user.updateProfile(formData);
      setPerfilData({ ...perfilData, ...formData });
      setEditMode(false);
      // Mostrar notificación de éxito
    } catch (error) {
      console.error('Error guardando perfil:', error);
      // Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuraciones
  const saveConfigs = async () => {
    try {
      setLoading(true);
      // await apiServices.user.updateConfigurations(configuraciones);
      setPerfilData(prev => ({
        ...prev,
        configuraciones
      }));
      // Mostrar notificación de éxito
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
      // Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      // await apiServices.user.changePassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      // Mostrar notificación de éxito
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      // Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cuenta
  const deleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        // await apiServices.user.deleteAccount();
        navigate('/');
      } catch (error) {
        console.error('Error eliminando cuenta:', error);
      }
    }
  };

  const tabs = [
    { id: "perfil", label: "Información Personal", icon: "" },
    { id: "configuracion", label: "Configuración", icon: "" },
    { id: "estadisticas", label: "Estadísticas", icon: "" }
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <div className="user-info" onClick={toggleSidebar}>
              <img src={avatarIcon} alt="Avatar" className="user-avatar" />
              <span className="user-name">{perfilData?.nombre || "Usuario"}</span>
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
              <li onClick={() => handleNavigation('/mis-favoritos')} className="nav-item">
                <span className="nav-icon"></span>
                <span>Favoritos</span>
              </li>
              <li onClick={() => handleNavigation('/mi-perfil')} className="nav-item active">
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
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y configuraciones</p>
          </div>
        </section>

        {/* Profile Container */}
        <div className="profile-container">
          {/* Tabs Navigation */}
          <div className="profile-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Información Personal */}
            {activeTab === "perfil" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Información Personal</h2>
                  <button 
                    className={`edit-btn ${editMode ? 'save' : 'edit'}`}
                    onClick={editMode ? saveProfile : () => setEditMode(true)}
                    disabled={loading}
                  >
                    {editMode ? 'Guardar' : 'Editar'}
                  </button>
                </div>

                <div className="profile-form">
                  {/* Avatar Section */}
                  <div className="avatar-section">
                    <div className="avatar-container">
                      <img 
                        src={avatarIcon} 
                        alt="Avatar" 
                        className="profile-avatar"
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.name || perfilData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Cédula</label>
                      <input
                        type="text"
                        value={formData.id || perfilData.id}
                        onChange={(e) => handleInputChange('id', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={formData.email || perfilData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={formData.phone || perfilData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Dirección</label>
                      <input
                        type="text"
                        value={formData.address || perfilData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tipo de Usuario</label>
                      <select
                        value={formData.typeUser || perfilData.typeUser}
                        onChange={(e) => handleInputChange('typeUser', e.target.value)}
                        disabled={!editMode}
                        className="form-input"
                      >
                        <option value="Estudiante">Estudiante</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="security-section">
                    <h3>Seguridad</h3>
                    <div className="security-actions">
                      <button 
                        className="security-btn"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        Cambiar Contraseña
                      </button>
                      <button 
                        className="security-btn danger"
                        onClick={deleteAccount}
                      >
                        Eliminar Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Configuración */}
            {activeTab === "configuracion" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Configuración General</h2>
                  <button 
                    className="save-btn"
                    onClick={saveConfigs}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </button>
                </div>

                <div className="config-sections">
                  {/* Tema */}
                  <div className="config-section">
                    <h3>Apariencia</h3>
                    <div className="config-item">
                      <label>Tema</label>
                      <div className="theme-options">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="tema"
                            value="claro"
                            checked={configuraciones.tema === "claro"}
                            onChange={(e) => handleConfigChange('tema', undefined, e.target.value)}
                          />
                          <span>Claro</span>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="tema"
                            value="oscuro"
                            checked={configuraciones.tema === "oscuro"}
                            onChange={(e) => handleConfigChange('tema', undefined, e.target.value)}
                          />
                          <span>Oscuro</span>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="tema"
                            value="sistema"
                            checked={configuraciones.tema === "sistema"}
                            onChange={(e) => handleConfigChange('tema', undefined, e.target.value)}
                          />
                          <span>Sistema</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Idioma */}
                  <div className="config-section">
                    <h3>Idioma</h3>
                    <div className="config-item">
                      <label>Idioma de la interfaz</label>
                      <select
                        value={configuraciones.idioma}
                        onChange={(e) => handleConfigChange('idioma', undefined, e.target.value)}
                        className="form-input"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notificaciones */}
            {activeTab === "notificaciones" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Configuración de Notificaciones</h2>
                  <button 
                    className="save-btn"
                    onClick={saveConfigs}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </button>
                </div>

                <div className="config-sections">
                  <div className="config-section">
                    <h3>Métodos de Notificación</h3>
                    
                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Notificaciones por Email</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.email}
                          onChange={(e) => handleConfigChange('notificaciones', 'email', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Recibe actualizaciones importantes por correo electrónico</p>
                    </div>

                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Notificaciones Push</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.push}
                          onChange={(e) => handleConfigChange('notificaciones', 'push', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Recibe notificaciones en tiempo real en tu navegador</p>
                    </div>
                  </div>

                  <div className="config-section">
                    <h3>Tipos de Notificación</h3>
                    
                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Progreso de Cursos</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.progreso}
                          onChange={(e) => handleConfigChange('notificaciones', 'progreso', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Actualizaciones sobre tu progreso de aprendizaje</p>
                    </div>

                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Nuevos Cursos</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.cursos}
                          onChange={(e) => handleConfigChange('notificaciones', 'cursos', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Notificaciones sobre nuevos cursos relevantes</p>
                    </div>

                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Marketing y Promociones</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.marketing}
                          onChange={(e) => handleConfigChange('notificaciones', 'marketing', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Ofertas especiales y contenido promocional</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacidad */}
            {activeTab === "privacidad" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Configuración de Privacidad</h2>
                  <button 
                    className="save-btn"
                    onClick={saveConfigs}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </button>
                </div>

                <div className="config-sections">
                  <div className="config-section">
                    <h3>Visibilidad del Perfil</h3>
                    
                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Perfil Público</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.perfilPublico}
                          onChange={(e) => handleConfigChange('privacidad', 'perfilPublico', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Permite que otros usuarios vean tu perfil básico</p>
                    </div>

                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Mostrar Progreso</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.mostrarProgreso}
                          onChange={(e) => handleConfigChange('privacidad', 'mostrarProgreso', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Permite que otros vean tu progreso de aprendizaje</p>
                    </div>

                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Mostrar Cursos</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.mostrarCursos}
                          onChange={(e) => handleConfigChange('privacidad', 'mostrarCursos', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Permite que otros vean los cursos que estás tomando</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferencias de Aprendizaje */}
            {activeTab === "aprendizaje" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Preferencias de Aprendizaje</h2>
                  <button 
                    className="save-btn"
                    onClick={saveConfigs}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </button>
                </div>

                <div className="config-sections">
                  <div className="config-section">
                    <h3>Recordatorios</h3>
                    
                    <div className="config-item">
                      <div className="toggle-item">
                        <label>Recordatorios Diarios</label>
                        <input
                          type="checkbox"
                          checked={configuraciones.aprendizaje.recordatoriosDiarios}
                          onChange={(e) => handleConfigChange('aprendizaje', 'recordatoriosDiarios', e.target.checked)}
                          className="toggle-switch"
                        />
                      </div>
                      <p className="config-description">Recibe recordatorios para estudiar</p>
                    </div>

                    <div className="config-item">
                      <label>Hora de Recordatorio</label>
                      <input
                        type="time"
                        value={configuraciones.aprendizaje.horaRecordatorio}
                        onChange={(e) => handleConfigChange('aprendizaje', 'horaRecordatorio', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="config-section">
                    <h3>Objetivos</h3>
                    
                    <div className="config-item">
                      <label>Meta Semanal (horas)</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={configuraciones.aprendizaje.metaSemanal}
                        onChange={(e) => handleConfigChange('aprendizaje', 'metaSemanal', parseInt(e.target.value))}
                        className="form-input"
                      />
                    </div>

                    <div className="config-item">
                      <label>Nivel de Dificultad Preferido</label>
                      <select
                        value={configuraciones.aprendizaje.dificultadPreferida}
                        onChange={(e) => handleConfigChange('aprendizaje', 'dificultadPreferida', e.target.value)}
                        className="form-input"
                      >
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                      </select>
                    </div>
                  </div>

                  <div className="config-section">
                    <h3>Categorías de Interés</h3>
                    <div className="categories-grid">
                      {["Desarrollo Web", "Data Science", "DevOps", "Diseño", "Marketing", "Business"].map(categoria => (
                        <label key={categoria} className="category-option">
                          <input
                            type="checkbox"
                            checked={configuraciones.aprendizaje.categoriasInteres.includes(categoria)}
                            onChange={(e) => {
                              const categorias = configuraciones.aprendizaje.categoriasInteres;
                              if (e.target.checked) {
                                handleConfigChange('aprendizaje', 'categoriasInteres', [...categorias, categoria]);
                              } else {
                                handleConfigChange('aprendizaje', 'categoriasInteres', categorias.filter(c => c !== categoria));
                              }
                            }}
                          />
                          <span>{categoria}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estadísticas */}
            {activeTab === "estadisticas" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Mis Estadísticas</h2>
                </div>

                <div className="stats-overview">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">🎓</div>
                      <div className="stat-content">
                        <div className="stat-number">{perfilData.estadisticas.cursosCompletados}</div>
                        <div className="stat-label">Cursos Completados</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⏱️</div>
                      <div className="stat-content">
                        <div className="stat-number">{perfilData.estadisticas.horasEstudiadas}h</div>
                        <div className="stat-label">Horas de Estudio</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🏆</div>
                      <div className="stat-content">
                        <div className="stat-number">{perfilData.estadisticas.certificadosObtenidos}</div>
                        <div className="stat-label">Certificados</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🔥</div>
                      <div className="stat-content">
                        <div className="stat-number">{perfilData.estadisticas.rachaActual}</div>
                        <div className="stat-label">Días Consecutivos</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📈</div>
                      <div className="stat-content">
                        <div className="stat-number">{perfilData.estadisticas.rutasTerminadas}</div>
                        <div className="stat-label">Rutas Terminadas</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-content">
                        <div className="stat-number">{perfilData.estadisticas.promedioCalificacion}</div>
                        <div className="stat-label">Calificación Promedio</div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="additional-info">
                    <div className="info-card">
                      <h3>Información de Cuenta</h3>
                      <div className="info-item">
                        <span className="info-label">Miembro desde:</span>
                        <span className="info-value">
                          {new Date(perfilData.fechaRegistro).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Último acceso:</span>
                        <span className="info-value">
                          {new Date(perfilData.ultimoAcceso).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal para cambio de contraseña */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cambiar Contraseña</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowPasswordModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Contraseña Actual</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="form-input"
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="form-input"
                    placeholder="Ingresa tu nueva contraseña"
                  />
                </div>

                <div className="form-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="form-input"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary"
                  onClick={changePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MiPerfil;