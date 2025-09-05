import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import logoImageMini from "../imagenes/logoMini.jpg";
import apiServices from "../services/apiServices";

const HeaderDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiServices.auth.logout();
      navigate("/"); // Redirige al inicio al cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
       
        

        {/* Menú desktop */}
        <nav className="nav-links">
          <Link to="/perfil">Perfil</Link>
          <Link to="/mis-cursos">Mis Cursos</Link>
          <Link to="/mis-favoritos">Mis Favoritos</Link>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </nav>

        {/* Botón menú móvil */}
        <button
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
              Perfil
            </Link>
            <Link to="/mis-cursos" onClick={() => setIsMobileMenuOpen(false)}>
              Mis Cursos
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
