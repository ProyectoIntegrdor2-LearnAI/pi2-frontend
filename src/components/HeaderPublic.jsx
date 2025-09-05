import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../imagenes/logoPrincipal.jpg';
import logoImageMini from '../imagenes/logoMini.jpg';
import AuthModal from './AuthModal';

const HeaderPublic = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

    const toggleMobileMenu = () => {
        if (!isMobileMenuOpen && showAuthModal) {
            setShowAuthModal(false);
        }
        
        setIsMobileMenuOpen(!isMobileMenuOpen);
        
        if (isMobileMenuOpen) {
            setIsAboutDropdownOpen(false);
        }
    };

    const openLoginModal = () => {
        setAuthMode('login');
        setShowAuthModal(true);
        setIsMobileMenuOpen(false);
        setIsAboutDropdownOpen(false);
    };

    const openRegisterModal = () => {
        setAuthMode('register');
        setShowAuthModal(true);
        setIsMobileMenuOpen(false);
        setIsAboutDropdownOpen(false);
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

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        setIsAboutDropdownOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="logo-section">
                        <Link to="/" className="logo">
                            <img
                                src={logoImage}
                                alt="LearnIA Logo"
                                className="logo-icon"
                            />
                        </Link>
                    </div>

                    <div className="header-actions">
                        <button
                            className="auth-btn login-btn"
                            onClick={openLoginModal}
                        >
                            Iniciar Sesión
                        </button>

                        <button
                            className="auth-btn register-btn"
                            onClick={openRegisterModal}
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

                <nav className={`hamburger-nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
                    <ul className="nav-links">
                        <li>
                            <Link to="/" className="nav-link" onClick={handleLinkClick}>
                                <span className="nav-icon"></span>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/courses" className="nav-link" onClick={handleLinkClick}>
                                <span className="nav-icon"></span>
                                Cursos
                            </Link>
                        </li>
                        <li className={`dropdown ${isAboutDropdownOpen ? 'open' : ''}`}>
                            <button
                                className="dropdown-toggle"
                                onClick={handleDropdownClick}
                                aria-expanded={isAboutDropdownOpen}
                            >
                                <span className="nav-icon"></span>
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
                                <Link to="/quienes-somos" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon"></span>
                                    ¿Quiénes Somos?
                                </Link>
                                <Link to="/preguntas-frecuentes" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon"></span>
                                    ¿Preguntas Frecuentes?
                                </Link>
                                <Link to="/mision-vision" className="dropdown-item" onClick={handleLinkClick}>
                                    <span className="dropdown-icon"></span>
                                    Misión y Visión
                                </Link>
                            </div>
                        </li>
                        <li>
                            <Link to="/contacto" className="nav-link" onClick={handleLinkClick}>
                                <span className="nav-icon"></span>
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <AuthModal 
                showAuthModal={showAuthModal}
                closeAuthModal={closeAuthModal}
                logoImageMini={logoImageMini}
                initialTab={authMode}
            />
        </>
    );
};

export default HeaderPublic;