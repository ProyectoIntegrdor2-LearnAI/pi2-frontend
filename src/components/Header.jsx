import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../imagenes/logoPrincipal.jpg'; // Importar la imagen

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Cerrar submenu cuando se cierra el menu
        if (isMobileMenuOpen) {
            setIsAboutDropdownOpen(false);
        }
    };

    const openAuthModal = () => {
        setShowAuthModal(true);
        setIsMobileMenuOpen(false); // Cerrar menú al abrir modal
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
        setIsMobileMenuOpen(false);
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

                    {/* Botones de autenticación + hamburguesa */}
                    <div className="header-actions">
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

                        <button
                            className="hamburger-menu"
                            onClick={toggleMobileMenu}
                            aria-label="Abrir menú"
                        >
                            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                        </button>
                    </div>
                </div>

                {/* Menú hamburguesa (funciona en todas las resoluciones) */}
                <nav className={`hamburger-nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
                    <ul className="nav-links">
                        <li>
                            <Link to="/" className="nav-link" onClick={handleLinkClick}>
                                <span className="nav-icon">🏠</span>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/courses" className="nav-link" onClick={handleLinkClick}>
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
                                        transition: 'transform 0.2s ease-in-out',
                                        marginLeft: 'auto'
                                    }}
                                >
                                    <path d="M3 4.5L6 7.5L9 4.5"/>
                                </svg>
                            </button>
                            <div className="dropdown-menu">
                                <a href="#quienes-somos" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon">👥</span>
                                    ¿Quiénes Somos?
                                </a>
                                <a href="#como-funciona" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon">⚙️</span>
                                    ¿Cómo Funciona?
                                </a>
                                <a href="#tecnologia" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon">🚀</span>
                                    Tecnología
                                </a>
                                <a href="#mision-vision" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon">🎯</span>
                                    Misión y Visión
                                </a>
                            </div>
                        </li>
                        <li>
                            <Link to="/contacto" className="nav-link" onClick={handleLinkClick}>
                                <span className="nav-icon">📧</span>
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Overlay para cerrar menú */}
            {isMobileMenuOpen && (
                <div className="menu-overlay" onClick={toggleMobileMenu}></div>
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
                            <p>¡Bienvenido! Inicia sesión en nuestra plataforma de aprendizaje y disfruta de una experiencia personalizada.</p>
                            <div className="auth-buttons">
                                <button className="auth-btn primary">Iniciar Sesión</button>
                                <button className="auth-btn secondary">Registrarse</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;