import React, { useState } from 'react';
import CursosGrid from '../components/CursosGrid';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import AuthModal from '../components/AuthModal'; // <-- Importamos el modal
import { ArrowRight, Brain, BookOpen, Users, Award, ChevronUp, Target, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = ({ onChatToggle }) => {
    // Estado para el modal de autenticación
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authInitialTab, setAuthInitialTab] = useState('login');
    const navigate = useNavigate();

    const handleComenzarAhora = () => {
        const event = new CustomEvent('openAuthModal', {
            detail: { tab: 'register' }
        });
        window.dispatchEvent(event);
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Función para abrir el modal de registro
    const handleCreateAccount = () => {
        setAuthInitialTab('register'); // Abrir en pestaña registro
        setShowAuthModal(true);
    };

    const handleExploreWithoutRegister = () => {
        scrollToTop();
    };

    return (
        <div className="home-page">
            {/* Modal de autenticación */}
            <AuthModal
                showAuthModal={showAuthModal}
                closeAuthModal={() => setShowAuthModal(false)}
                initialTab={authInitialTab}
            />


            {/* Chat de IA centralizado */}
            {/* ChatIA solo vista previa (no logueado) */}


            {/* Sección Hero/Introductoria */}
            <section className="hero-section">
                <div className="hero-container-full">
                    <div className="hero-content-centered">
                        <h1 className="hero-title">
                            Descubre el futuro del aprendizaje con <span className="brand-highlight">LearnIA</span>
                        </h1>
                        <p className="hero-description">
                            Plataforma inteligente que utiliza IA y web scraping para generar rutas de aprendizaje
                            personalizadas, automatizando la curación de contenido educativo de múltiples plataformas.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Recursos Educativos</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">4+</span>
                                <span className="stat-label">Plataformas Integradas</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Personalizado</span>
                            </div>
                        </div>
                        <button className="cta-primary" onClick={handleComenzarAhora}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.5 3.5a.5.5 0 0 1 1 0v3.793l2.146 2.147a.5.5 0 0 1-.708.708L7.5 7.707V3.5z" />
                            </svg>
                            Comenzar Ahora
                        </button>
                    </div>
                </div>
            </section>

            {/* Sección de Cursos */}
            <section className="cursos-section">
                <div className="section-container">
                    <h2 className="section-title">Explora Nuestro Catálogo</h2>
                    <p className="section-subtitle">
                        Más de 10,000 recursos educativos extraídos de plataformas como Coursera, edX, Udemy y Khan Academy
                    </p>
                    <FiltrosBusqueda />
                    <CursosGrid />
                </div>
            </section>

            {/* Call to Action Final */}
            <section className="final-cta-section">
                <div className="section-container">
                    <div className="cta-content-enhanced">
                        <div className="cta-main-content">
                            <h2 className="cta-enhanced-title">
                                ¿Listo para personalizar tu
                                <span className="text-gradient"> aprendizaje</span>?
                            </h2>
                            <p className="cta-enhanced-description">
                                Únete a LearnIA y descubre cómo la inteligencia artificial puede acelerar
                                tu crecimiento educativo con rutas de aprendizaje completamente personalizadas
                            </p>

                            {/* Features destacadas */}
                            <div className="cta-features-grid">
                                <div className="cta-feature-item">
                                    <Brain className="feature-icon brain-icon" />
                                    <span>IA Personalizada</span>
                                </div>
                                <div className="cta-feature-item">
                                    <Target className="feature-icon target-icon" />
                                    <span>Rutas Adaptativas</span>
                                </div>
                                <div className="cta-feature-item">
                                    <Zap className="feature-icon zap-icon" />
                                    <span>Aprendizaje Acelerado</span>
                                </div>
                            </div>

                            {/* Botones mejorados */}
                            <div className="cta-buttons-enhanced">
                                <button
                                    onClick={handleCreateAccount} // <-- Abrir modal registro
                                    className="cta-primary-enhanced"
                                >
                                    Crear Cuenta Gratis
                                    <ArrowRight className="button-icon" />
                                </button>
                                <button
                                    onClick={handleExploreWithoutRegister}
                                    className="cta-secondary-enhanced"
                                >
                                    Explorar sin Registro
                                    <ChevronUp className="button-icon button-icon-rotate" />
                                </button>
                            </div>

                            {/* Trust indicators */}
                            <div className="trust-indicators">
                                <span className="trust-item">✓ Sin compromiso</span>
                                <span className="trust-item">✓ Acceso inmediato</span>
                                <span className="trust-item">✓ 100% Gratuito</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Informativo */}
            <footer className="learnia-footer">
                <div className="section-container">
                    <div className="footer-main">
                        <div className="footer-section footer-about">
                            <h3 className="footer-brand">
                                Learn<span className="brand-accent">IA</span>
                            </h3>
                            <p className="footer-description">
                                <strong>"Learn" + "IA"</strong> = Aprender con Inteligencia Artificial.
                                Revolucionamos la educación digital combinando el poder del machine learning
                                con web scraping avanzado para crear la experiencia de aprendizaje más
                                personalizada del mercado. Tu ruta única hacia el conocimiento.
                            </p>
                            <div className="footer-team-info">
                                <Award className="team-icon" />
                                <span>Innovación educativa respaldada por tecnología de vanguardia</span>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-section-title">¿Por qué LearnIA?</h4>
                            <ul className="footer-list">
                                <li><Brain className="list-icon" />Algoritmos que aprenden de ti</li>
                                <li><Target className="list-icon" />Rutas 100% personalizadas</li>
                                <li><Zap className="list-icon" />Aprende 3x más rápido</li>
                                <li><Globe className="list-icon" />+10,000 recursos curados</li>
                                <li><Award className="list-icon" />Resultados garantizados</li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-section-title">Ideal para</h4>
                            <ul className="footer-list">
                                <li>Estudiantes universitarios</li>
                                <li>Profesionales en crecimiento</li>
                                <li>Emprendedores digitales</li>
                                <li>Desarrolladores autodidactas</li>
                                <li>Equipos de capacitación</li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-section-title">Nuestra Ventaja</h4>
                            <div className="project-info">
                                <p><strong>Automatización Total:</strong><br />Actualizaciones cada 6 horas sin intervención manual</p>
                                <p><strong>IA Avanzada:</strong><br />Modelos de recomendación que evolucionan contigo</p>
                                <p><strong>Multiplataforma:</strong><br />Lo mejor de Coursera, Platzi, Udemy y más en un lugar</p>
                                <p><strong>Escalable:</strong><br />Arquitectura cloud nativa que crece contigo</p>
                            </div>
                        </div>
                    </div>

                    <div className="footer-stats">
                        <div className="footer-stat">
                            <div className="stat-value green">10,000+</div>
                            <div className="stat-description">Recursos Disponibles</div>
                        </div>
                        <div className="footer-stat">
                            <div className="stat-value blue">4+</div>
                            <div className="stat-description">Plataformas Conectadas</div>
                        </div>
                        <div className="footer-stat">
                            <div className="stat-value purple">24/7</div>
                            <div className="stat-description">Disponibilidad Total</div>
                        </div>
                        <div className="footer-stat">
                            <div className="stat-value pink">∞</div>
                            <div className="stat-description">Posibilidades de Aprender</div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            <p>© 2025 LearnIA.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;