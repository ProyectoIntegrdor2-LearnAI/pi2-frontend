import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatIAPreview.css';
import apiServices from '../services/apiServices';
import { useRutasAprendizaje } from '../hooks/useRutasAprendizaje';
import RutaCreatedMessage from './RutaCreatedMessage';

const ChatIAAuth = () => {
    const navigate = useNavigate();
    const { agregarRuta } = useRutasAprendizaje();
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: '¡Hola! Soy LearnIA, tu asistente inteligente. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const openChat = () => setIsChatOpen(true);
    const closeChat = () => setIsChatOpen(false);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [showRutaCreated, setShowRutaCreated] = useState(false);
    const [rutaCreada, setRutaCreada] = useState(null);



    const detectarSolicitudRuta = (mensaje) => {
        const keywords = [
            'generar ruta',
            'crear ruta',
            'ruta de aprendizaje',
            'quiero aprender',
            'necesito aprender',
            'como aprendo',
            'enseñame',
            'curso de',
            'plan de estudio'
        ];
        const mensajeLower = mensaje.toLowerCase();
        return keywords.some(keyword => mensajeLower.includes(keyword));
    };

    const generarRutaConLambda = async (userQuery) => {
        try {
            const userId = apiServices.utils.getUserId();
            if (!userId) {
                throw new Error('No se encontró el usuario autenticado. Inicia sesión e inténtalo de nuevo.');
            }
            
            const requestData = {
                user_id: userId,
                user_query: userQuery,
                user_level: "intermediate",
                num_courses: 6,
                time_per_week: 12,
                response_format: "frontend" // Solicitar formato del frontend
            };

            const response = await apiServices.learningPath.generate(requestData);
            
            // La respuesta ya viene en formato frontend
            const nuevaRuta = agregarRuta({ ...response, origenChat: true });
            
            return nuevaRuta;
        } catch (error) {
            console.error('Error generando ruta:', error);
            throw error;
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        
        const newUserMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, newUserMessage]);
        setLoading(true);

        // Detectar si es una solicitud de ruta de aprendizaje
        const esSolicitudRuta = detectarSolicitudRuta(inputMessage);

        try {
            if (esSolicitudRuta) {
                // Generar ruta con la Lambda
                const aiResponse1 = {
                    id: Date.now() + 1,
                    type: 'ai',
                    content: '¡Perfecto! Estoy generando tu ruta de aprendizaje personalizada. Esto tomará unos segundos...',
                    timestamp: new Date()
                };
                setChatMessages(prev => [...prev, aiResponse1]);

                const ruta = await generarRutaConLambda(inputMessage);
                
                if (ruta) {
                    setRutaCreada(ruta);
                    const aiResponse2 = {
                        id: Date.now() + 2,
                        type: 'ai',
                        content: (
                            <RutaCreatedMessage 
                                ruta={ruta} 
                                onDismiss={() => setShowRutaCreated(false)}
                            />
                        ),
                        timestamp: new Date()
                    };
                    setChatMessages(prev => [...prev, aiResponse2]);
                } else {
                    throw new Error('No se pudo crear la ruta');
                }
            } else {
                // Flujo normal del chat
                const response = await apiServices.chat.sendMessage(inputMessage, conversationId);
                if (!conversationId && response.conversationId) {
                    setConversationId(response.conversationId);
                }
                const aiResponse = {
                    id: Date.now() + 1,
                    type: 'ai',
                    content: response.message || '¡Gracias por tu mensaje!',
                    timestamp: new Date()
                };
                setChatMessages(prev => [...prev, aiResponse]);
            }
        } catch (error) {
            console.error('Error:', error);
            setChatMessages(prev => [...prev, {
                id: Date.now() + 2,
                type: 'ai',
                content: 'Lo siento, hubo un error procesando tu mensaje. Intenta de nuevo.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
            setInputMessage('');
        }
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
                        {loading && (
                            <div className="chat-message ai">
                                <span className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            placeholder="¿Qué te gustaría aprender?"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="chat-input"
                            disabled={loading}
                        />
                        <button onClick={handleSendMessage} className="chat-send" disabled={loading}>
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

export default ChatIAAuth;
