import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";
import { useAuth } from "../hooks/useAuth";
import { unwrapApiData, formatDateValue } from "../utils/apiData";
import avatarIcon from '../imagenes/iconoUsuario.png';
import logoImage from '../imagenes/logoPrincipal.png';
import "../styles/Dashboard.css";
import "../styles/MiPerfil.css";
import { useTheme } from '../hooks/useTheme';

const DEFAULT_SETTINGS = {
  tema: "claro",
  idioma: "es",
  notificaciones: {
    email: true,
    push: true,
    marketing: false,
    cursos: true,
    progreso: true,
  },
  privacidad: {
    perfilPublico: false,
    mostrarProgreso: true,
    mostrarCursos: false,
  },
  aprendizaje: {
    recordatoriosDiarios: true,
    horaRecordatorio: "09:00",
    metaSemanal: 5,
    dificultadPreferida: "intermedio",
    categoriasInteres: ["Desarrollo Web", "Data Science", "DevOps"],
  },
};

const normalizeSettings = (settings = {}) => ({
  ...DEFAULT_SETTINGS,
  ...settings,
  notificaciones: {
    ...DEFAULT_SETTINGS.notificaciones,
    ...(settings.notificaciones || {}),
  },
  privacidad: {
    ...DEFAULT_SETTINGS.privacidad,
    ...(settings.privacidad || {}),
  },
  aprendizaje: {
    ...DEFAULT_SETTINGS.aprendizaje,
    ...(settings.aprendizaje || {}),
    categoriasInteres: settings.aprendizaje?.categoriasInteres
      ? [...settings.aprendizaje.categoriasInteres]
      : [...DEFAULT_SETTINGS.aprendizaje.categoriasInteres],
  },
});

const createEmptyProfile = () => ({
  user_id: "",
  name: "",
  identification: "",
  email: "",
  phone: "",
  address: "",
  type_user: "",
  typeUser: "",
  avatar: null,
  configuraciones: normalizeSettings(),
  account_status: "",
  created_at: null,
  updated_at: null,
});

const normalizeProfile = (profile = {}) => {
  const normalized = {
    ...createEmptyProfile(),
    ...profile,
  };

  normalized.user_id = profile.user_id || profile.id || "";
  normalized.identification =
    profile.identification || profile.id || profile.user_id || "";
  normalized.id = normalized.identification;
  normalized.email = profile.email || "";
  normalized.name = profile.name || "";
  normalized.phone = profile.phone || "";
  normalized.address = profile.address || "";
  normalized.type_user = profile.type_user || profile.typeUser || "";
  normalized.typeUser = normalized.type_user;
  normalized.avatar = profile.avatar || null;
  normalized.configuraciones = normalizeSettings(profile.configuraciones);
  normalized.account_status = profile.account_status || profile.status || "";
  normalized.created_at = profile.created_at || profile.createdAt || null;
  normalized.updated_at = profile.updated_at || profile.updatedAt || null;

  return normalized;
};

const cachedUserProfile = apiServices.utils.getStoredUser();
const initialProfile = cachedUserProfile
  ? normalizeProfile(cachedUserProfile)
  : createEmptyProfile();

function MiPerfil() {
  const { theme, changeTheme } = useTheme();
  const { user: authUser, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [perfilData, setPerfilData] = useState(initialProfile);
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: initialProfile.name || "",
    email: initialProfile.email || "",
    identification: initialProfile.identification || initialProfile.id || "",
    phone: initialProfile.phone || "",
    address: initialProfile.address || "",
    avatar: initialProfile.avatar || null,
    typeUser: initialProfile.typeUser || initialProfile.type_user || "",
  }));
  const [configuraciones, setConfiguraciones] = useState(
    initialProfile.configuraciones || normalizeSettings()
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileError, setProfileError] = useState(null);

  const navigate = useNavigate();

  const accountSummary = useMemo(() => {
    const membershipDate = formatDateValue(perfilData.created_at);
    const lastUpdate = formatDateValue(perfilData.updated_at, { includeTime: true });
    const lastLogin = formatDateValue(dashboardInfo?.last_login, { includeTime: true });

    const summary = [
      {
        icon: '',
        label: 'Tipo de usuario',
        value: perfilData.type_user || 'Sin definir',
      },
      {
        icon: '',
        label: 'Estado de la cuenta',
        value: dashboardInfo?.account_status || perfilData.account_status || 'No disponible',
      },
      {
        icon: '',
        label: 'Miembro desde',
        value: membershipDate || 'No disponible',
      },
      {
        icon: '',
        label: 'Última actualización',
        value: lastUpdate || 'No disponible',
      },
    ];

    if (lastLogin) {
      summary.push({
        icon: '',
        label: 'Último acceso',
        value: lastLogin,
      });
    }

    return summary;
  }, [perfilData, dashboardInfo]);

  useEffect(() => {
    if (authLoading) return;
    if (authUser?.user_id) {
      loadUserProfile(authUser.user_id);
      return;
    }
    const cached = apiServices.utils.getStoredUser();
    if (cached?.user_id) {
      loadUserProfile(cached.user_id);
    }
  }, [authLoading, authUser?.user_id]);


  useEffect(() => {
    setTempConfiguraciones(prev => ({
      ...prev,
      tema: theme
    }));
  }, [theme]);

  const loadUserProfile = async (requestedUserId) => {
    const targetId = requestedUserId || authUser?.user_id || 'profile';

    try {
      setLoading(true);
      setProfileError(null);

      const [profileResponse, dashboardResponse] = await Promise.all([
        apiServices.user.getProfile(targetId),
        apiServices.dashboard.getDashboard(targetId).catch((dashboardError) => {
          console.warn('Error cargando información de dashboard:', dashboardError);
          return null;
        }),
      ]);

      const savedAvatar = getSavedAvatar();
      const normalizedProfile = normalizeProfile(profileResponse);

      setPerfilData({ ...normalizedProfile, avatar: savedAvatar });
      setFormData((prev) => ({
        ...prev,
        name: normalizedProfile.name || '',
        email: normalizedProfile.email || '',
        identification:
          normalizedProfile.identification ||
          normalizedProfile.id ||
          '',
        phone: normalizedProfile.phone || '',
        address: normalizedProfile.address || '',
        avatar: savedAvatar,
        typeUser: normalizedProfile.typeUser || normalizedProfile.type_user || '',
      }));

      setConfiguraciones(normalizeSettings(normalizedProfile.configuraciones));

      const dashboardData = unwrapApiData(dashboardResponse);
      setDashboardInfo(dashboardData?.dashboard_info || null);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setProfileError(error?.message || 'No fue posible cargar el perfil');

      const cachedUser = apiServices.utils.getStoredUser();
      if (cachedUser) {
        const savedAvatar = getSavedAvatar();
        const normalizedCached = normalizeProfile(cachedUser);
        setPerfilData({ ...normalizedCached, avatar: savedAvatar });
        setFormData((prev) => ({
          ...prev,
          name: normalizedCached.name || prev.name || '',
          email: normalizedCached.email || prev.email || '',
          identification:
            normalizedCached.identification ||
            normalizedCached.id ||
            prev.identification ||
            '',
          phone: normalizedCached.phone || prev.phone || '',
          address: normalizedCached.address || prev.address || '',
          avatar: savedAvatar,
          typeUser:
            normalizedCached.typeUser ||
            normalizedCached.type_user ||
            prev.typeUser ||
            '',
        }));
        setConfiguraciones(normalizeSettings(normalizedCached.configuraciones));
        setDashboardInfo(null);
      } else {
        setDashboardInfo(null);
      }
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
    if (!section) return;

    setTempConfiguraciones((prev) => {
      if (section === 'tema' || section === 'idioma') {
        return {
          ...prev,
          [section]: value,
        };
      }

      const previousSection = prev?.[section] || {};
      const nextSection =
        field === undefined
          ? value
          : {
            ...previousSection,
            [field]: value,
          };

      return {
        ...prev,
        [section]: nextSection,
      };
    });

    // NO aplicar el tema inmediatamente, solo guardarlo temporalmente
  };

  const getSavedAvatar = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return initialProfile.avatar || 'avatar1';
    }
    try {
      return window.localStorage.getItem('userAvatar') || initialProfile.avatar || 'avatar1';
    } catch {
      return initialProfile.avatar || 'avatar1';
    }
  };

  useEffect(() => {
    if (activeTab !== 'perfil') return;
    setFormData((prev) => ({
      ...prev,
      name: perfilData?.name || '',
      email: perfilData?.email || '',
      identification: perfilData?.identification || perfilData?.id || '',
      phone: perfilData?.phone || '',
      address: perfilData?.address || '',
      avatar: perfilData?.avatar || prev.avatar,
      typeUser: perfilData?.typeUser || perfilData?.type_user || '',
    }));
  }, [activeTab, perfilData]);

  // Estado temporal para configuraciones antes de guardar
  const [tempConfiguraciones, setTempConfiguraciones] = useState({
    ...normalizeSettings(),
    tema: theme
  });

  // Guardar cambios del perfil
  const saveProfile = async () => {
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };

      await apiServices.user.updateProfile('profile', payload);

      const storedUser = apiServices.utils.getStoredUser();
      const refreshedProfile = storedUser
        ? normalizeProfile(storedUser)
        : normalizeProfile({ ...perfilData, ...payload });

      setPerfilData((prev) => ({
        ...prev,
        ...refreshedProfile,
        avatar: formData.avatar || prev.avatar || getSavedAvatar(),
      }));

      setFormData((prev) => ({
        ...prev,
        name: refreshedProfile.name || payload.name || '',
        email: refreshedProfile.email || prev.email || '',
        identification:
          refreshedProfile.identification ||
          refreshedProfile.id ||
          prev.identification ||
          '',
        phone: refreshedProfile.phone || payload.phone || '',
        address: refreshedProfile.address || payload.address || '',
        typeUser:
          refreshedProfile.typeUser ||
          refreshedProfile.type_user ||
          prev.typeUser ||
          '',
      }));

      const dashboardResponse = await apiServices.dashboard
        .getDashboard('profile')
        .catch(() => null);
      const dashboardData = unwrapApiData(dashboardResponse);
      if (dashboardData?.dashboard_info) {
        setDashboardInfo(dashboardData.dashboard_info);
      }

      setEditMode(false);
    } catch (error) {
      console.error('Error guardando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuraciones
  const saveConfigs = async () => {
    try {
      setLoading(true);

      // Usar el hook para cambiar el tema globalmente
      if (tempConfiguraciones.tema) {
        changeTheme(tempConfiguraciones.tema);
        console.log('Tema guardado:', tempConfiguraciones.tema);
      }

      // Actualizar configuraciones locales
      setConfiguraciones(tempConfiguraciones);
      setPerfilData(prev => ({
        ...prev,
        configuraciones: tempConfiguraciones
      }));

      console.log('Configuraciones guardadas correctamente');
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
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
    if (
      typeof window !== 'undefined' &&
      window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")
    ) {
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
              <span className="user-name">{perfilData?.name || "Usuario"}</span>
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
          {profileError && (
            <div className="profile-error-message">
              {profileError}
            </div>
          )}
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
                        value={
                          formData.identification ||
                          perfilData.identification ||
                          perfilData.id ||
                          ''
                        }
                        onChange={(e) => handleInputChange('identification', e.target.value)}
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
                            checked={tempConfiguraciones.tema === "claro"}
                            onChange={(e) => handleConfigChange('tema', undefined, e.target.value)}
                          />
                          <span>Claro</span>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="tema"
                            value="oscuro"
                            checked={tempConfiguraciones.tema === "oscuro"}
                            onChange={(e) => handleConfigChange('tema', undefined, e.target.value)}
                          />
                          <span>Oscuro</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estadísticas */}
            {activeTab === "estadisticas" && (
              <div className="tab-panel">
                <div className="panel-header">
                  <h2>Resumen de Cuenta</h2>
                </div>

                <div className="stats-overview">
                  <div className="stats-grid">
                    {accountSummary.map((item) => (
                      <div key={item.label} className="stat-card">
                        <div className="stat-icon">{item.icon}</div>
                        <div className="stat-content">
                          <div className="stat-number">{item.value}</div>
                          <div className="stat-label">{item.label}</div>
                        </div>
                      </div>
                    ))}
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
