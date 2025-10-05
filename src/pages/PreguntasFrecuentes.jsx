import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Brain, BookOpen, Shield, Zap, Users, Globe } from 'lucide-react';

const PreguntasFrecuentes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqData = [
        // Preguntas Generales
        {
            category: 'general',
            question: '¿Qué es LearnIA?',
            answer: 'LearnIA es una plataforma inteligente que utiliza inteligencia artificial y web scraping para generar rutas de aprendizaje personalizadas. Automatizamos la curación de contenido educativo de múltiples plataformas como Coursera, edX, Udemy y Khan Academy para crear experiencias de aprendizaje únicas adaptadas a tus objetivos y nivel.'
        },
        {
            category: 'general',
            question: '¿Cómo funciona la personalización de rutas?',
            answer: 'Nuestros algoritmos de machine learning analizan tus objetivos, nivel de conocimiento, preferencias de aprendizaje e historial para generar rutas personalizadas. Utilizamos procesamiento de lenguaje natural (NLP) para entender el contenido y similarity learning para identificar relaciones entre temas y crear secuencias óptimas de aprendizaje.'
        },
        {
            category: 'general',
            question: '¿Qué plataformas educativas están integradas?',
            answer: 'Actualmente procesamos contenido de más de 4 plataformas principales incluyendo Coursera, edX, Udemy y Khan Academy. Nuestro sistema de web scraping actualiza automáticamente la información cada 6 horas para mantener el catálogo actualizado con más de 10,000 recursos educativos.'
        },
        
        // Funcionalidades
        {
            category: 'funcionalidades',
            question: '¿Cómo puedo crear mi primera ruta de aprendizaje?',
            answer: 'Después de registrarte, usa nuestro chat de IA para describir tus objetivos de aprendizaje. Por ejemplo: "Quiero aprender desarrollo web" o "Necesito mejorar en análisis de datos". La IA procesará tu consulta y generará una ruta personalizada con recursos secuenciados según tus necesidades.'
        },
        {
            category: 'funcionalidades',
            question: '¿Puedo modificar las rutas generadas?',
            answer: 'Sí, puedes personalizar las rutas agregando o eliminando recursos, marcando contenido como completado, y ajustando la secuencia según tus preferencias. El sistema aprende de estos cambios para mejorar futuras recomendaciones.'
        },
        {
            category: 'funcionalidades',
            question: '¿Cómo funciona el seguimiento de progreso?',
            answer: 'Puedes marcar recursos como completados, ver tu avance en tiempo real con gráficos y estadísticas, acceder a tu historial de aprendizaje y recibir recomendaciones basadas en tu progreso. Todo se sincroniza automáticamente en tu perfil.'
        },
        
        // Técnicas
        {
            category: 'tecnicas',
            question: '¿Qué tecnologías de IA utilizan?',
            answer: 'Utilizamos procesamiento de lenguaje natural (NLP) para clasificación automática de contenido, machine learning para recomendaciones personalizadas, similarity learning para identificar relaciones entre temas, y embeddings semánticos para búsqueda inteligente. Todo desplegado en una arquitectura cloud nativa en AWS.'
        },
        {
            category: 'tecnicas',
            question: '¿Cómo aseguran la calidad del contenido?',
            answer: 'Nuestros algoritmos de IA clasifican automáticamente el contenido por calidad, relevancia y nivel de dificultad. Además, el sistema aprende continuamente de la interacción de usuarios y feedback para mejorar las recomendaciones y filtrar contenido de baja calidad.'
        },
        {
            category: 'tecnicas',
            question: '¿Con qué frecuencia se actualiza el contenido?',
            answer: 'Nuestro sistema de web scraping automatizado actualiza el catálogo cada 6 horas, asegurando que siempre tengas acceso al contenido más reciente de las plataformas integradas. Los nuevos recursos se procesan automáticamente con IA para clasificación y etiquetado.'
        },
        
        // Cuenta y Privacidad
        {
            category: 'cuenta',
            question: '¿Cómo me registro en LearnIA?',
            answer: 'El registro es simple: proporciona tu nombre, email y crea una contraseña segura. Después de verificar tu email, completa tu perfil con tus intereses y objetivos de aprendizaje para que la IA pueda generar mejores recomendaciones desde el primer día.'
        },
        {
            category: 'cuenta',
            question: '¿Qué datos recopilan y cómo los protegen?',
            answer: 'Recopilamos únicamente datos necesarios para personalizar tu experiencia: perfil básico, objetivos de aprendizaje, progreso y preferencias. Todos los datos están cifrados en tránsito y en reposo, cumplimos con estándares de seguridad estrictos y nunca compartimos información personal con terceros.'
        },
        {
            category: 'cuenta',
            question: '¿Puedo eliminar mi cuenta y datos?',
            answer: 'Sí, puedes eliminar tu cuenta en cualquier momento desde la configuración de perfil. Al hacerlo, todos tus datos personales serán eliminados permanentemente de nuestros sistemas dentro de 30 días, cumpliendo con regulaciones de privacidad.'
        },
        
        // Soporte
        {
            category: 'soporte',
            question: '¿Qué hago si encuentro un error en la plataforma?',
            answer: 'Reporta cualquier error a través del chat de IA, el formulario de contacto, o directamente a nuestro email de soporte. Incluye detalles sobre qué estabas haciendo cuando ocurrió el error y capturas de pantalla si es posible. Nuestro equipo responde en menos de 24 horas.'
        },
        {
            category: 'soporte',
            question: '¿Ofrecen soporte técnico?',
            answer: 'Sí, ofrecemos soporte técnico a través de múltiples canales: chat de IA 24/7 para preguntas básicas, formulario de contacto para consultas específicas, y email de soporte para problemas técnicos complejos. También tenemos documentación detallada y tutoriales.'
        },
        {
            category: 'soporte',
            question: '¿Planean agregar más plataformas educativas?',
            answer: 'Sí, estamos constantemente evaluando nuevas plataformas educativas para integrar. Nuestro roadmap incluye la expansión a más fuentes de contenido y la posible integración con LMS universitarios. Si tienes sugerencias de plataformas, contáctanos.'
        }
    ];

    const categories = [
        { id: 'all', name: 'Todas', icon: Globe },
        { id: 'general', name: 'General', icon: BookOpen },
        { id: 'funcionalidades', name: 'Funcionalidades', icon: Zap },
        { id: 'tecnicas', name: 'Técnicas', icon: Brain },
        { id: 'cuenta', name: 'Cuenta y Privacidad', icon: Shield },
        { id: 'soporte', name: 'Soporte', icon: Users }
    ];

    const filteredFAQs = faqData.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container-full">
                    <div className="hero-content-centered">
                        <h1 className="hero-title">
                            Preguntas <span className="brand-highlight">Frecuentes</span>
                        </h1>
                        <p className="hero-description">
                            Encuentra respuestas rápidas a las preguntas más comunes sobre LearnIA, 
                            nuestra tecnología de IA y cómo funciona la plataforma.
                        </p>
                        
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="cursos-section">
                <div className="section-container">
                    
                    {/* Lista de FAQs */}
                    <div className="faq-list">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq, index) => (
                                <div key={index} className={`faq-item ${openFAQ === index ? 'open' : ''}`}>
                                    <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                        <h3>{faq.question}</h3>
                                        {openFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                    {openFAQ === index && (
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <Brain size={48} color="var(--text-secondary)" />
                                <h3>No se encontraron resultados</h3>
                                <p>Intenta con otros términos de búsqueda o pregúntale directamente a nuestro asistente de IA.</p>
                            </div>
                        )}
                    </div>

                  
                </div>
            </section>
        </div>
    );
};

export default PreguntasFrecuentes;