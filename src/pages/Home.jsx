import React, { useState } from 'react';
import CursosGrid from '../components/CursosGrid';
import FiltrosBusqueda from '../components/FiltrosBusqueda';

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

    return (
        <div className="home-page">
            {/* Chat de IA Fijo */}
            <div className={`fixed-ai-chat ${isChatMinimized ? 'minimized' : ''}`}>
                <div className="chat-toggle" onClick={toggleChat}>
                    <div className="ai-avatar">IA</div>
                    {!isChatMinimized && (
                        <div className="chat-header-info">
                            <div className="chat-title">LearnIA Assistant</div>
                            <div className="chat-subtitle">Pregúntame sobre cualquier tema</div>
                        </div>
                    )}
                    <button className="minimize-btn">
                        {isChatMinimized ? '→' : '←'}
                    </button>
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

            {/* Call to Action Final */}
            <section className="final-cta-section">
                <div className="section-container">
                    <div className="cta-content">
                        <h2>¿Listo para personalizar tu aprendizaje?</h2>
                        <p>Únete a LearnIA y descubre cómo la inteligencia artificial puede acelerar tu crecimiento educativo</p>
                        <div className="cta-buttons">
                            <button className="cta-primary large">
                                Crear Cuenta Gratis
                            </button>
                            <button className="cta-secondary large">
                                Explorar sin Registro
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;