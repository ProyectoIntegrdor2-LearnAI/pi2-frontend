import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import iconoUsuario from '../imagenes/iconoUsuario.png';

const MenuPerfil = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Aquí implementarías la lógica de cerrar sesión
        console.log('Cerrando sesión...');
        // Por ejemplo: clearAuthToken(), redirect to login, etc.
    };

    return (
        <div className="menu-perfil">
            <button
                className="perfil-button"
                onClick={toggleMenu}
                aria-label="Abrir menú de perfil"
            >
                <div className="avatar">
                    <img 
                        src={iconoUsuario} 
                        alt="Avatar de usuario"
                        className="avatar-image"
                    />
                </div>
                <span className="username">Usuario</span>
                <svg
                    className={`dropdown-arrow ${isMenuOpen ? 'arrow-up' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
            </button>

            {isMenuOpen && (
                <div className="perfil-dropdown">
                    <div className="dropdown-content">
                        <Link
                            to="/mi-perfil"
                            className="dropdown-item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" fill="currentColor"/>
                            </svg>
                            Mi Perfil
                        </Link>

                        <Link
                            to="/mis-cursos"
                            className="dropdown-item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16">
                                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" fill="currentColor"/>
                            </svg>
                            Explorar cursos
                        </Link>

                        <div className="dropdown-divider"></div>

                        <button
                            className="dropdown-item logout-button"
                            onClick={handleLogout}
                        >
                            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16">
                                <path d="M6 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V2zM7 2v12h6V2H7zm3.854 4.146a.5.5 0 0 1 0 .708L9.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8.5 8.207 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 .708-.708L8.5 7.793l1.646-1.647a.5.5 0 0 1 .708 0z" fill="currentColor"/>
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPerfil;
