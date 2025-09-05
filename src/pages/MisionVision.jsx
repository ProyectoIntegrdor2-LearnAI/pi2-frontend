import React, { useState } from 'react';
import { Brain, Target, Users, Lightbulb, Globe, BookOpen, Send, TrendingUp, Award, Zap } from 'lucide-react';

const MisionVision = ({ onChatToggle }) => {
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: '¡Hola! ¿Te gustaría conocer más sobre nuestra misión y visión en LearnIA?',
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

        setTimeout(() => {
            const aiResponses = [
                "Nuestra misión es democratizar el acceso a rutas de aprendizaje personalizadas de calidad.",
                "Queremos ser la plataforma de referencia para la generación automática de rutas educativas.",
                "Transformamos la manera en que las personas acceden y consumen contenido educativo digital.",
                "Nuestros valores incluyen la democratización, innovación, calidad y personalización.",
                "¿Te interesa saber más sobre cómo aplicamos estos valores en nuestra tecnología?"
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

    return (
        <div className="home-page">
            {/* Overlay para cerrar chat en móvil */}
            {isMobileChatOpen && <div className="chat-overlay active" onClick={toggleMobileChat}></div>}
            
            {/* Chat de IA Fijo */}
            <div className={`fixed-ai-chat ${isChatMinimized ? 'minimized' : ''} ${isMobileChatOpen ? 'mobile-open' : ''}`}>
                <div className="chat-toggle" onClick={toggleChat}>
                    <div className="ai-avatar">IA</div>
                    {!isChatMinimized && (
                        <div className="chat-header-info">
                            <div className="chat-title">LearnIA Assistant</div>
                            <div className="chat-subtitle">Pregúntame sobre nuestra misión</div>
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
                                placeholder="Pregunta sobre nuestra misión..."
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

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container-full">
                    <div className="hero-content-centered">
                        <h1 className="hero-title">
                            Nuestra <span className="brand-highlight">Misión y Visión</span>
                        </h1>
                        <p className="hero-description">
                            Comprometidos con democratizar el acceso a la educación personalizada 
                            mediante inteligencia artificial y tecnologías innovadoras.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">2025</span>
                                <span className="stat-label">Año de Fundación</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">UPB</span>
                                <span className="stat-label">Universidad Origen</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">∞</span>
                                <span className="stat-label">Potencial Educativo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misión Section */}
            <section className="cursos-section">
                <div className="section-container">
                    <h2 className="section-title">Nuestra Misión</h2>
                    <p className="section-subtitle">
                        Democratizar el acceso a rutas de aprendizaje personalizadas y de calidad
                    </p>
                    
                    <div className="about-content-grid">
                        <div className="about-description">
                            <div className="description-card">
                                <h3>¿Qué Hacemos?</h3>
                                <p>
                                    <strong>Democratizamos el acceso</strong> a rutas de aprendizaje personalizadas 
                                    y de calidad mediante la automatización inteligente de la curación de contenido 
                                    educativo, proporcionando a los usuarios una plataforma unificada que 
                                    <strong>optimice su tiempo de aprendizaje</strong> y maximice su efectividad educativa.
                                </p>
                            </div>

                            <div className="description-card">
                                <h3>¿Cómo lo Hacemos?</h3>
                                <p>
                                    A través de <strong>tecnologías de IA avanzadas</strong>, procesamos y analizamos 
                                    contenido educativo de múltiples plataformas, creando experiencias de aprendizaje 
                                    <strong>personalizadas y coherentes</strong> que se adaptan a los objetivos, 
                                    nivel y preferencias de cada usuario.
                                </p>
                            </div>
                        </div>

                        <div className="about-features">
                            <div className="feature-highlights">
                                <div className="highlight-item">
                                    <Globe className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Democratización</h4>
                                        <p>Hacer accesible la educación personalizada a todas las personas</p>
                                    </div>
                                </div>

                                <div className="highlight-item">
                                    <Target className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Optimización</h4>
                                        <p>Maximizar la efectividad del tiempo dedicado al aprendizaje</p>
                                    </div>
                                </div>

                                <div className="highlight-item">
                                    <Brain className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Personalización</h4>
                                        <p>Adaptar el contenido a las necesidades específicas de cada usuario</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visión Section */}
            <section className="cursos-section" style={{backgroundColor: 'var(--background-secondary)'}}>
                <div className="section-container">
                    <h2 className="section-title">Nuestra Visión</h2>
                    <p className="section-subtitle">
                        Ser la plataforma de referencia para la generación automática de rutas de aprendizaje
                    </p>
                    
                    <div className="about-content-grid">
                        <div className="about-description">
                            <div className="description-card">
                                <h3>Visión 2030</h3>
                                <p>
                                    Ser <strong>la plataforma de referencia</strong> para la generación automática 
                                    de rutas de aprendizaje personalizadas, transformando la manera en que las 
                                    personas acceden y consumen contenido educativo digital a través de 
                                    <strong>inteligencia artificial y tecnologías cloud nativas</strong>.
                                </p>
                            </div>

                            <div className="description-card">
                                <h3>Impacto Global</h3>
                                <p>
                                    Aspiramos a <strong>transformar la educación digital</strong> a nivel global, 
                                    creando un ecosistema donde el aprendizaje sea más eficiente, accesible y 
                                    personalizado para millones de estudiantes en todo el mundo.
                                </p>
                            </div>
                        </div>

                        <div className="about-features">
                            <div className="feature-highlights">
                                <div className="highlight-item">
                                    <TrendingUp className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Liderazgo Tecnológico</h4>
                                        <p>Ser pioneros en IA aplicada a educación personalizada</p>
                                    </div>
                                </div>

                                <div className="highlight-item">
                                    <Globe className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Alcance Global</h4>
                                        <p>Impactar la educación digital a nivel mundial</p>
                                    </div>
                                </div>

                                <div className="highlight-item">
                                    <Lightbulb className="highlight-icon" />
                                    <div className="highlight-content">
                                        <h4>Transformación</h4>
                                        <p>Revolucionar la forma de consumir contenido educativo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores Section */}
            <section className="cursos-section">
                <div className="section-container">
                    <h2 className="section-title">Nuestros Valores</h2>
                    <p className="section-subtitle">
                        Los principios que guían nuestro trabajo y decisiones cada día
                    </p>
                    
                    <div className="valores-grid">
                        <div className="valor-card">
                            <Users className="valor-icon" />
                            <h3>Democratización</h3>
                            <p>Creemos que la educación personalizada debe estar al alcance de todos, sin barreras económicas o geográficas.</p>
                        </div>

                        <div className="valor-card">
                            <Brain className="valor-icon" />
                            <h3>Innovación</h3>
                            <p>Aplicamos las últimas tecnologías de IA para crear soluciones educativas que antes parecían imposibles.</p>
                        </div>

                        <div className="valor-card">
                            <Award className="valor-icon" />
                            <h3>Calidad</h3>
                            <p>Nos comprometemos con la excelencia en cada algoritmo, interfaz y experiencia que creamos.</p>
                        </div>

                        <div className="valor-card">
                            <Target className="valor-icon" />
                            <h3>Personalización</h3>
                            <p>Entendemos que cada persona aprende de manera única y adaptamos nuestros recursos en consecuencia.</p>
                        </div>

                        <div className="valor-card">
                            <BookOpen className="valor-icon" />
                            <h3>Transparencia</h3>
                            <p>Somos claros sobre cómo funcionan nuestros algoritmos y cómo procesamos la información educativa.</p>
                        </div>

                        <div className="valor-card">
                            <Zap className="valor-icon" />
                            <h3>Eficiencia</h3>
                            <p>Optimizamos cada proceso para maximizar el valor del tiempo que nuestros usuarios dedican al aprendizaje.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MisionVision;