import React, { useState } from 'react';
import { Send, Mail, MapPin, Phone, Clock, Brain, Github, Linkedin, Twitter, MessageSquare, Users, Building } from 'lucide-react';

const Contacto = ({ onChatToggle }) => {
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: '¡Hola! ¿Necesitas información de contacto? Puedo ayudarte con los datos del equipo y la universidad.',
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
                "Para contacto directo, puedes escribirnos a learnia.upb@gmail.com o llamar al +57 300 123 4567",
                "Nuestro equipo está ubicado en la Universidad Pontificia Bolivariana en Bucaramanga, Colombia.",
                "También puedes contactarnos a través de nuestras redes sociales o el correo institucional.",
                "Para consultas académicas, puedes comunicarte directamente con la Ing. Danith Solórzano Escobar.",
                "¿Hay algo específico en lo que pueda ayudarte sobre nuestros datos de contacto?"
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
                            <div className="chat-subtitle">Información de contacto</div>
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
                                placeholder="Pregunta sobre contacto..."
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
                            <span className="brand-highlight">Contáctanos</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="cursos-section">
                <div className="section-container">
                    <h2 className="section-title">Información de Contacto</h2>
                    <p className="section-subtitle">
                        Múltiples formas de conectar con nuestro equipo de desarrollo
                    </p>

                    <div className="contact-info-grid">
                        {/* Información Principal */}
                        <div className="contact-info-card">
                            <div className="contact-methods">
                                <div className="contact-method">
                                    <div className="method-icon">
                                        <Mail size={24} />
                                    </div>
                                    <div className="method-info">
                                        <h3>Email Principal</h3>
                                        <p>learnIA@gmail.com</p>
                                        <span>Consultas generales y soporte</span>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">
                                        <Phone size={24} />
                                    </div>
                                    <div className="method-info">
                                        <h3>Teléfonos</h3>
                                        <p>+57 300 123 4567</p>
                                        <span>Soporte técnico y consultas</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Redes Sociales y Enlaces */}
                        <div className="contact-side-info">
                            <div className="social-section">
                                <h3>Redes Sociales</h3>
                                <p>Síguenos en nuestras redes oficiales</p>
                                <div className="social-links">
                                    <a href="#" className="social-link">
                                        <Github size={20} />
                                        <span>GitHub</span>
                                    </a>
                                    <a href="#" className="social-link">
                                        <Linkedin size={20} />
                                        <span>LinkedIn</span>
                                    </a>
                                    <a href="#" className="social-link">
                                        <Twitter size={20} />
                                        <span>Twitter</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    );
};

export default Contacto;