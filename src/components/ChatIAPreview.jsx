import React, { useState } from 'react';
import '../styles/ChatIAPreview.css';

const ChatIAPreview = () => {
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: (
                <div className="chat-preview-access-msg">
                    <div className="chat-preview-icon"></div>
                    <div className="chat-preview-title">¡Hola! Soy LearnIA</div>
                    <div className="chat-preview-desc">Para acceder al chat completo, por favor inicia sesión o regístrate.</div>
                                <button className="chat-preview-btn" onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { tab: 'login' } }))}>
                                    Iniciar sesión / Registrarse
                                </button>
                </div>
            ),
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    // El chat inicia cerrado, solo se muestra la burbuja
    const [isChatOpen, setIsChatOpen] = useState(false);
    const openChat = () => setIsChatOpen(true);
    const closeChat = () => setIsChatOpen(false);

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
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                content: (
                    <div className="chat-preview-access-msg">
                        <div className="chat-preview-icon"></div>
                        <div className="chat-preview-title">Acceso restringido</div>
                        <div className="chat-preview-desc">Para respuestas personalizadas, inicia sesión o regístrate.</div>
                                    <button className="chat-preview-btn" onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { tab: 'login' } }))}>
                                        Iniciar sesión / Registrarse
                                    </button>
                    </div>
                ),
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 800);
        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {isChatOpen && (
                <div className="chat-float-overlay" onClick={closeChat}></div>
            )}
            {isChatOpen ? (
                <div className="fixed-ai-chat-float">
                    <div className="chat-header-bar">
                        <span className="chat-title">LearnIA Assistant</span>
                        <button className="chat-close-btn" onClick={closeChat} aria-label="Cerrar chat">×</button>
                    </div>
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
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="chat-bubble-float"
                    onClick={openChat}
                    aria-label="Abrir chat IA"
                >
                    <span className="ai-bubble-icon">IA</span>
                </button>
            )}
        </>
    );
};

export default ChatIAPreview;
