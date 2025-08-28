import React, { useState } from 'react';
import CursosGrid from '../components/CursosGrid';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import { ArrowRight, Brain, BookOpen, Users, Award, ChevronUp, Target, Zap, Globe } from 'lucide-react';

const Home = ({ onChatToggle }) => {
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: '¡Hola! Soy LearnIA, tu asistente inteligente. ¿Qué te gustaría aprender hoy? Puedo ayudarte a encontrar la ruta perfecta.',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    const toggleChat = () => {
        const newMinimizedState = !isChatMinimized;
        setIsChatMinimized(newMinimizedState);

        // Comunicar el cambio al componente padre
        if (onChatToggle) {
            onChatToggle(newMinimizedState);
        }

        // También enviar evento personalizado para máxima compatibilidad
        window.dispatchEvent(new CustomEvent('chatToggle', {
            detail: { minimized: newMinimizedState }
        }));
    };

    const toggleMobileChat = () => {
        setIsMobileChatOpen(!isMobileChatOpen);
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newUserMessage]);

        // Simular respuesta de IA
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                content: `Interesante pregunta sobre "${inputMessage}". Para darte una ruta personalizada, necesitarías crear una cuenta. ¿Te gustaría registrarte para acceder a recomendaciones personalizadas con IA?`,
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 1000);

        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleExploreWithoutRegister = () => {
        // Scroll al inicio de la página (o a la sección de cursos)
        scrollToTop();
    };

    const handleCreateAccount = () => {
        // Aquí iría la lógica de registro
        alert('Redirigiendo al registro...');
    };

    return (
        <div className="home-page">
            {/* Overlay para cerrar chat en móvil */}
            {isMobileChatOpen && <div className="chat-overlay active" onClick={toggleMobileChat}></div>}
            
            {/* Chat de IA Fijo */}
            <div className={`fixed-ai-chat ${isChatMinimized ? 'minimized' : ''} ${isMobileChatOpen ? 'mobile-open' : ''}`}>
                <div className="chat-toggle">
    <div className="ai-avatar">IA</div>
    <div className="chat-header-info">
        <div className="chat-title">LearnIA Assistant</div>
        <div className="chat-subtitle">Pregúntame sobre cualquier tema</div>
    </div>
</div>

                {!isChatMinimized && (
                    <>
                        <div className="chat-messages">
                            {chatMessages.map(message => (
                                <div key={message.id} className={`chat-message ${message.type}`}>
                                    {message.content}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                placeholder="¿Qué te gustaría aprender?"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="chat-input"
                            />
                            <button onClick={handleSendMessage} className="chat-send">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Botón flotante para móvil */}
            <button className="mobile-chat-toggle" onClick={toggleMobileChat}>
                IA
            </button>

            {/* Sección Hero/Introductoria - Sin chat */}
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
                        <div className="cta-buttons">
                            <button className="cta-primary">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.5 3.5a.5.5 0 0 1 1 0v3.793l2.146 2.147a.5.5 0 0 1-.708.708L7.5 7.707V3.5z"/>
                                </svg>
                                Comenzar Ahora
                            </button>
                            <button className="cta-secondary">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                                </svg>
                                Ver Demo
                            </button>
                        </div>
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

            {/* Call to Action Final - MEJORADO */}
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
                                    onClick={handleCreateAccount}
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

            {/* Footer Informativo - NUEVO */}
            <footer className="learnia-footer">
                <div className="section-container">
                    {/* Footer Principal */}
                    {/* Footer Principal */}
<div className="footer-main">
    {/* Sobre LearnIA - Mejorado */}
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

                        {/* Por qué elegir LearnIA */}
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

                       {/* Casos de uso */}
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


                        {/* Ventaja competitiva */}
    <div className="footer-section">
        <h4 className="footer-section-title">Nuestra Ventaja</h4>
        <div className="project-info">
            <p><strong>Automatización Total:</strong><br />Actualizaciones cada 6 horas sin intervención manual</p>
            <p><strong>IA Avanzada:</strong><br />Modelos de recomendación que evolucionan contigo</p>
            <p><strong>Multiplataforma:</strong><br />Lo mejor de Coursera, edX, Udemy y más en un lugar</p>
            <p><strong>Escalable:</strong><br />Arquitectura cloud nativa que crece contigo</p>
        </div>
    </div>
</div>

                    {/* Estadísticas del Proyecto - Cambiar títulos */}
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

                    {/* Footer Bottom */}
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            <p>© 2025 LearnIA - Proyecto Integrador II. Universidad Pontificia Bolivariana.</p>
                        </div>
                        <div className="footer-team">
                            <span className="team-label">Equipo de Desarrollo:</span>
                            <div className="team-members">
                                <span>Juan Andrés Contreras</span>
                                <span>•</span>
                                <span>Karen Lizarazo</span>
                                <span>•</span>
                                <span>Raúl Lozano</span>
                                <span>•</span>
                                <span>María Parra</span>
                                <span>•</span>
                                <span>Jerson Porras</span>
                            </div>
                        </div>
                    </div>

                    {/* Botón volver arriba */}
                    <button 
                        onClick={scrollToTop}
                        className="back-to-top"
                        aria-label="Volver arriba"
                    >
                        <ChevronUp className="back-to-top-icon" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Home;