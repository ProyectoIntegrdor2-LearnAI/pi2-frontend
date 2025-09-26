import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../imagenes/logoPrincipal.png";
import avatarIcon from "../imagenes/iconoUsuario.png";
import apiServices from "../services/apiServices";

const HeaderDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        email: ""
      });
    }
  };

  const toggleSidebar = () => {
    console.log('Toggle sidebar, estado actual:', sidebarOpen); // Debug
    setSidebarOpen(prevState => {
      console.log('Cambiando sidebar de', prevState, 'a', !prevState);
      return !prevState;
    });
  };

  const closeSidebar = () => {
    console.log('Cerrando sidebar');
    setSidebarOpen(false);
  };

  const handleOverlayClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeSidebar();
  };

  const handleNavigation = (route, event) => {
    console.log('Navegando a:', route); // Debug
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    closeSidebar();
    navigate(route);
  };

  const handleLogout = () => {
    apiServices.auth.logout();
    navigate('/');
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <>
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
              <li 
                onClick={(e) => handleNavigation('/dashboard', e)} 
                className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
              >
                <span className="nav-icon"></span>
                <span>Inicio</span>
              </li>
              <li 
                onClick={(e) => handleNavigation('/visualizador-rutas', e)} 
                className={`nav-item ${isActiveRoute('/visualizador-rutas') ? 'active' : ''}`}
              >
                <span className="nav-icon"></span>
                <span>Mis Cursos</span>
              </li>
              <li 
                onClick={(e) => handleNavigation('/mis-favoritos', e)} 
                className={`nav-item ${isActiveRoute('/mis-favoritos') ? 'active' : ''}`}
              >
                <span className="nav-icon"></span>
                <span>Favoritos</span>
              </li>
              <li 
                onClick={(e) => handleNavigation('/mi-perfil', e)} 
                className={`nav-item ${isActiveRoute('/mi-perfil') ? 'active' : ''}`}
              >
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
      {sidebarOpen && <div className="sidebar-overlay" onClick={handleOverlayClick}></div>}
    </>
  );
};

export default HeaderDashboard;