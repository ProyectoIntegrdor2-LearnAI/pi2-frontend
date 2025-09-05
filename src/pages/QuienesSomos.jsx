import React, { useState } from 'react';
import { Brain, Users, Target, Send, ChevronUp } from 'lucide-react';

const QuienesSomos = ({ onChatToggle }) => {
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: '¡Hola! Soy LearnIA Assistant. ¿Te gustaría saber más sobre nuestra plataforma y tecnología de IA?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    const toggleChat = () => {
        const newMinimizedState = !isChatMinimized;
        setIsChatMinimized(newMinimizedState);

        if (onChatToggle) {
            onChatToggle(newMinimizedState);
        }

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

        // Simular respuesta de IA específica sobre LearnIA
        setTimeout(() => {
            const aiResponses = [
                "Nuestra IA utiliza procesamiento de lenguaje natural para crear rutas personalizadas basadas en tus objetivos de aprendizaje.",
                "Procesamos más de 10,000 recursos de plataformas como Coursera, edX, Udemy y Khan Academy para encontrar el mejor contenido para ti.",
                "El sistema aprende de tus preferencias y progreso para mejorar constantemente las recomendaciones.",
                "¿Te interesa alguna tecnología específica? Puedo ayudarte a encontrar la ruta de aprendizaje perfecta.",
                "Como proyecto de la UPB, aplicamos metodologías ágiles y las últimas tecnologías en IA para democratizar la educación."
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                content: randomResponse,
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

    return (
        <div className="home-page">
            {/* Overlay para cerrar chat en móvil */}
            {isMobileChatOpen && <div className="chat-overlay active" onClick={toggleMobileChat}></div>}
            
            {/* Chat de IA Fijo - Mismo que Home */}
            <div className={`fixed-ai-chat ${isChatMinimized ? 'minimized' : ''} ${isMobileChatOpen ? 'mobile-open' : ''}`}>
                <div className="chat-toggle" onClick={toggleChat}>
                    <div className="ai-avatar">IA</div>
                    {!isChatMinimized && (
                        <div className="chat-header-info">
                            <div className="chat-title">LearnIA Assistant</div>
                            <div className="chat-subtitle">Pregúntame sobre la plataforma</div>
                        </div>
                    )}
                    
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
                                placeholder="Pregunta sobre LearnIA..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="chat-input"
                            />
                            <button onClick={handleSendMessage} className="chat-send">
                                <Send size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Botón flotante para móvil */}
            <button className="mobile-chat-toggle" onClick={toggleMobileChat}>
                IA
            </button>

            {/* Hero Section - Acerca de LearnIA */}
            <section className="hero-section">
                <div className="hero-container-full">
                    <div className="hero-content-centered">
                        <h1 className="hero-title">
                            Acerca de <span className="brand-highlight">LearnIA</span>
                        </h1>
                        <p className="hero-description">
                            Una plataforma inteligente que utiliza inteligencia artificial y web scraping 
                            para generar rutas de aprendizaje personalizadas, automatizando la curación 
                            de contenido educativo de múltiples plataformas.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">4+</span>
                                <span className="stat-label">Plataformas Integradas</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Recursos Procesados</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">Actualización Automática</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Qué es LearnIA - Sección Principal */}
            <section className="cursos-section">
                <div className="section-container">
                    <h2 className="section-title">¿Qué es LearnIA?</h2>
                    <p className="section-subtitle">
                        Democratizamos el acceso a rutas de aprendizaje personalizadas mediante 
                        la automatización inteligente de la curación de contenido educativo
                    </p>
                    
                    <div className="about-content-grid">
                        <div className="about-description">
                            <div className="description-card">
                                <h3>Nuestra Plataforma</h3>
                                <p>
                                    LearnIA es una plataforma web inteligente que democratiza el acceso a rutas 
                                    de aprendizaje personalizadas. Mediante técnicas avanzadas de inteligencia 
                                    artificial y web scraping, procesamos contenido educativo de múltiples 
                                    plataformas para crear experiencias de aprendizaje únicas.
                                </p>
                            </div>

                            <div className="description-card">
                                <h3>Tecnología de IA</h3>
                                <p>
                                    Utilizamos <strong>procesamiento de lenguaje natural (NLP)</strong> y 
                                    <strong>machine learning</strong> para transformar datos educativos dispersos 
                                    en rutas coherentes. Nuestros algoritmos de <strong>similarity learning</strong> 
                                    analizan automáticamente el contenido e identifican relaciones entre temas.
                                </p>
                            </div>

                        </div>

                        <div className="about-features">
                            <div className="feature-highlights">
                                <div className="highlight-item">
                                    <Brain className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Clasificación Automática</h4>
                                        <p>NLP para categorizar contenido por temática y nivel de dificultad</p>
                                    </div>
                                </div>

                                <div className="highlight-item">
                                    <Target className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Recomendaciones Personalizadas</h4>
                                        <p>Algoritmos de ML que aprenden de preferencias y objetivos del usuario</p>
                                    </div>
                                </div>

                                <div className="highlight-item">
                                    <Users className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Análisis de Dependencias</h4>
                                        <p>Identificación automática de prerrequisitos y secuencias óptimas</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            
        </div>
    );
};

export default QuienesSomos;