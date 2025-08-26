import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../imagenes/logoPrincipal.jpg'; // Importar la imagen

const Header = () => {
    const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

    const toggleMainMenu = () => {
        setIsMainMenuOpen(!isMainMenuOpen);
        // Cerrar submenu cuando se cierra el menu principal
        if (isMainMenuOpen) {
            setIsAboutDropdownOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const toggleAboutDropdown = () => {
        setIsAboutDropdownOpen(!isAboutDropdownOpen);
    };

    const handleDropdownClick = (e) => {
        e.preventDefault();
        toggleAboutDropdown();
    };

    // Cerrar menú al hacer click en un enlace
    const handleLinkClick = () => {
        setIsMainMenuOpen(false);
        setIsAboutDropdownOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    {/* Logo y título */}
                    <div className="logo-section">
                        <Link to="/" className="logo">
                            <img
                                src={logoImage}
                                alt="LearnIA Logo"
                                className="logo-icon"
                            />
                        </Link>
                    </div>

                    {/* Navegación móvil tradicional */}
                    <nav className={`main-nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
                        <ul className="nav-links">
                            <li>
                                <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
                                    <span className="nav-icon">🏠</span>
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/courses" className="nav-link" onClick={toggleMobileMenu}>
                                    <span className="nav-icon">📚</span>
                                    Cursos
                                </Link>
                            </li>
                            <li className={`dropdown ${isAboutDropdownOpen ? 'open' : ''}`}>
                                <button
                                    className="dropdown-toggle"
                                    onClick={handleDropdownClick}
                                    aria-expanded={isAboutDropdownOpen}
                                >
                                    <span className="nav-icon">ℹ️</span>
                                    Acerca de
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="currentColor"
                                        style={{
                                            transform: isAboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease-in-out'
                                        }}
                                    >
                                        <path d="M3 4.5L6 7.5L9 4.5"/>
                                    </svg>
                                </button>
                                <div className="dropdown-menu">
                                    <a href="#quienes-somos" className="dropdown-item" onClick={toggleMobileMenu}>
                                        <span className="dropdown-icon">👥</span>
                                        ¿Quiénes Somos?
                                    </a>
                                    <a href="#como-funciona" className="dropdown-item" onClick={toggleMobileMenu}>
                                        <span className="dropdown-icon">⚙️</span>
                                        ¿Cómo Funciona?
                                    </a>
                                    <a href="#tecnologia" className="dropdown-item" onClick={toggleMobileMenu}>
                                        <span className="dropdown-icon">🚀</span>
                                        Tecnología
                                    </a>
                                    <a href="#mision-vision" className="dropdown-item" onClick={toggleMobileMenu}>
                                        <span className="dropdown-icon">🎯</span>
                                        Misión y Visión
                                    </a>
                                </div>
                            </li>
                            <li>
                                <Link to="/contacto" className="nav-link" onClick={toggleMobileMenu}>
                                    <span className="nav-icon">📧</span>
                                    Contacto
                                </Link>
                            </li>
                            <li className="mobile-auth-buttons">
                                <button
                                    className="auth-button-mobile login"
                                    onClick={() => { openAuthModal(); toggleMobileMenu(); }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                    </svg>
                                    Iniciar Sesión
                                </button>
                                <button
                                    className="auth-button-mobile register"
                                    onClick={() => { openAuthModal(); toggleMobileMenu(); }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                    </svg>
                                    Registrarse
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Sección derecha: Botones de autenticación + Menú */}
                    <div className="header-actions">
                        {/* Botones de autenticación */}
                        <button
                            className="auth-btn login-btn"
                            onClick={openAuthModal}
                        >
                            Iniciar Sesión
                        </button>

                        <button
                            className="auth-btn register-btn"
                            onClick={openAuthModal}
                        >
                            Registrarse
                        </button>

                        {/* Botón del menú principal */}
                        <button
                            className={`menu-btn ${isMainMenuOpen ? 'active' : ''}`}
                            onClick={toggleMainMenu}
                            aria-expanded={isMainMenuOpen}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                            </svg>
                            Menú
                        </button>

                        {/* Menú desplegable principal */}
                        <div className={`main-dropdown-menu ${isMainMenuOpen ? 'open' : ''}`}>
                            <nav className="main-nav-dropdown">
                                <ul className="nav-links-dropdown">
                                    <li>
                                        <Link to="/" className="nav-link-dropdown" onClick={handleLinkClick}>
                                            <span className="nav-icon">🏠</span>
                                            Inicio
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/courses" className="nav-link-dropdown" onClick={handleLinkClick}>
                                            <span className="nav-icon">📚</span>
                                            Cursos
                                        </Link>
                                    </li>
                                    <li className={`dropdown-nested ${isAboutDropdownOpen ? 'open' : ''}`}>
                                        <button
                                            className="dropdown-toggle-nested"
                                            onClick={handleDropdownClick}
                                            aria-expanded={isAboutDropdownOpen}
                                        >
                                            <span className="nav-icon">ℹ️</span>
                                            Acerca de
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 12 12"
                                                fill="currentColor"
                                                style={{
                                                    transform: isAboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.2s ease-in-out',
                                                    marginLeft: 'auto'
                                                }}
                                            >
                                                <path d="M3 4.5L6 7.5L9 4.5"/>
                                            </svg>
                                        </button>
                                        <div className="dropdown-submenu">
                                            <a href="#quienes-somos" className="dropdown-item-nested" onClick={handleLinkClick}>
                                                <span className="dropdown-icon">👥</span>
                                                ¿Quiénes Somos?
                                            </a>
                                            <a href="#como-funciona" className="dropdown-item-nested" onClick={handleLinkClick}>
                                                <span className="dropdown-icon">⚙️</span>
                                                ¿Cómo Funciona?
                                            </a>
                                            <a href="#tecnologia" className="dropdown-item-nested" onClick={handleLinkClick}>
                                                <span className="dropdown-icon">🚀</span>
                                                Tecnología
                                            </a>
                                            <a href="#mision-vision" className="dropdown-item-nested" onClick={handleLinkClick}>
                                                <span className="dropdown-icon">🎯</span>
                                                Misión y Visión
                                            </a>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/contacto" className="nav-link-dropdown" onClick={handleLinkClick}>
                                            <span className="nav-icon">📧</span>
                                            Contacto
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Botón hamburguesa para móvil */}
                        <button
                            className="hamburger-menu"
                            onClick={toggleMobileMenu}
                            aria-label="Abrir menú"
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Overlay para cerrar menú */}
            {isMainMenuOpen && (
                <div className="menu-overlay" onClick={toggleMainMenu}></div>
            )}

            {/* Modal de Autenticación */}
            {showAuthModal && (
                <div className="auth-modal-overlay" onClick={closeAuthModal}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="auth-modal-header">
                            <h2>Acceder a LearnIA</h2>
                            <button onClick={closeAuthModal} className="close-modal">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="auth-modal-content">
                            <p>Inicia sesión para acceder a rutas personalizadas de aprendizaje generadas por IA</p>
                            <div className="auth-buttons">
                                <button className="auth-btn primary">Iniciar Sesión</button>
                                <button className="auth-btn secondary">Registrarse</button>
                            </div>
                            <div className="auth-features">
                                <div className="feature-item">
                                    <span className="feature-icon">🤖</span>
                                    <span>Rutas personalizadas con IA</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">📊</span>
                                    <span>Seguimiento de progreso</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">🎯</span>
                                    <span>Recomendaciones inteligentes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;