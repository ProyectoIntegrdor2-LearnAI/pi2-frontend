// src/components/AuthModal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from "../imagenes/logoPrincipal.png";
import apiServices from '../services/apiServices';

const AuthModal = ({ showAuthModal, closeAuthModal, initialTab = 'login' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        cedula: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        setFormData({
            cedula: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
            selectedAvatar: 'avatar1'
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (activeTab === 'register') {
            if (formData.password !== formData.confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            if (!formData.acceptTerms) {
                alert('Debes aceptar términos y condiciones para crear la cuenta.');
                return;
            }
        }

        try {
            let data;
            if (activeTab === 'login') {
                data = await apiServices.auth.login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                data = await apiServices.auth.register({
                    cedula: formData.cedula,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            }

            if (data && data.token) {
                try { 
                    localStorage.setItem('token', data.token);
                } catch (e) { }
            }

            if (activeTab === 'register') {
                setActiveTab('login');
                alert('Cuenta creada con éxito. Por favor inicia sesión.');
            } else {
                if (closeAuthModal) closeAuthModal();
                navigate('/dashboard');
            }
            return;
        } catch (apiErr) {
            console.error('Error en API de autenticación:', apiErr);
            const apiMessage = apiErr?.data?.message || apiErr?.message || 'Error de conexión con el servidor.';

            if (activeTab === 'login') {
                alert(apiMessage === 'Unauthorized' ? 'Credenciales incorrectas.' : apiMessage);
            } else {
                alert(apiMessage);
            }
        }
    };

    if (!showAuthModal) return null;

    return (
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
            <div className="auth-modal-improved" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="auth-modal-header-improved">
                    <div className="auth-logo-container">
                        <img
                            src={logoImage}
                            alt="LearnIA Logo"
                            className="auth-modal-logo"
                        />
                        <div className="auth-brand-text">
                            <h2 className="auth-brand-name"></h2>
                            <p className="auth-brand-tagline">
                                Tu asistente inteligente de aprendizaje
                            </p>
                        </div>
                    </div>
                    <button onClick={closeAuthModal} className="close-modal-improved">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Formulario */}
                <div className="auth-modal-content-improved">
                    <div className="auth-welcome-text">
                        <h3>{activeTab === 'login' ? '¡Bienvenido de vuelta!' : '¡Únete a LearnIA!'}</h3>
                        <p>{activeTab === 'login'
                            ? 'Accede a tu cuenta y continúa tu viaje de aprendizaje personalizado con IA.'
                            : 'Crea tu cuenta y descubre rutas de aprendizaje personalizadas con inteligencia artificial.'
                        }</p>
                    </div>

                    <div className="auth-form-improved">
                        {activeTab === 'register' && (
                            <>
                                <div className="form-group-improved">
                                    <label htmlFor="cedula">Cédula</label>
                                    <input
                                        type="text"
                                        id="cedula"
                                        name="cedula"
                                        value={formData.cedula}
                                        onChange={handleInputChange}
                                        placeholder="Tu número de cédula"
                                    />
                                </div>

                                <div className="form-group-improved">
                                    <label htmlFor="name">Nombre completo</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group-improved">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="form-group-improved">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Tu contraseña segura"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {activeTab === 'register' && (
                            <div className="form-group-improved">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <div className="input-with-icon">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Repite tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'register' && (
                            <div className="checkbox-group-improved">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                    />
                                    <span className="checkmark"></span>
                                    Acepto los <a href="#" className="terms-link">términos y condiciones</a> y la <a href="#" className="terms-link">política de privacidad</a>
                                </label>
                            </div>
                        )}

                        <button className="auth-submit-btn" onClick={handleSubmit}>
                            <span>{activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                        </button>

                        {activeTab === 'login' && (
                            <div className="auth-footer-options">
                                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
