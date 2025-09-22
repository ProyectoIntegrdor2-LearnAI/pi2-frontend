import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../imagenes/logoPrincipal.jpg"; // Asegúrate de tener la ruta correcta
import apiServices from "../services/apiServices";

const HeaderDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiServices.auth.logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        
        {/* Sección izquierda: Botón menú + Logo */}
        <div className="header-left">
          {/* Botón menú móvil */}
          <button
            className="menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          {/* Logo LearnIA */}
          <div className="logo-section">
            <img src={logoImage} alt="LearnIA Logo" className="logo-img" />
          </div>
        </div>

        {/* Navegación desktop */}
        <nav className="nav-links">
          <Link to="/perfil">Perfil</Link>
          <Link to="/visualizador-rutas">Mis Rutas</Link>
          <Link to="/mis-favoritos">Mis Favoritos</Link>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </nav>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
              Perfil
            </Link>
            <Link to="/visualizador-rutas" onClick={() => setIsMobileMenuOpen(false)}>
              Mis Rutas
            </Link>
            <Link to="/mis-favoritos" onClick={() => setIsMobileMenuOpen(false)}>
              Mis Favoritos
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="logout-btn"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderDashboard;