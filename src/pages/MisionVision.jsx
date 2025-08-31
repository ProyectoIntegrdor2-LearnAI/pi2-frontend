import React from 'react';
import { Target, Eye, Heart, Users, Globe, Award, Lightbulb, Rocket } from 'lucide-react';

const MisionVision = () => {
    return (
        <div className="mision-vision-page">
            {/* Hero Section */}
            <section className="mv-hero-section">
                <div className="section-container">
                    <h1 className="section-title">Nuestra Misión y Visión</h1>
                    <p className="section-subtitle">
                        Los principios y objetivos que guían cada decisión en LearnIA 
                        hacia un futuro donde la educación personalizada sea accesible para todos
                    </p>
                </div>
            </section>

            {/* Misión */}
            <section className="mission-section">
                <div className="section-container">
                    <div className="mission-content">
                        <div className="mission-icon-container">
                            <Target className="mission-icon" />
                        </div>
                        <div className="mission-text">
                            <h2>Nuestra Misión</h2>
                            <p className="mission-statement">
                                Democratizar el acceso a rutas de aprendizaje personalizadas y de calidad 
                                mediante la automatización inteligente de la curación de contenido educativo, 
                                proporcionando a los usuarios una plataforma unificada que optimice su tiempo 
                                de aprendizaje y maximice su efectividad educativa.
                            </p>
                            
                            <div className="mission-pillars">
                                <div className="pillar">
                                    <Users className="pillar-icon" />
                                    <h3>Accesibilidad Universal</h3>
                                    <p>Hacer que la educación personalizada esté disponible para cualquier persona, independientemente de su ubicación o recursos económicos.</p>
                                </div>
                                
                                <div className="pillar">
                                    <Lightbulb className="pillar-icon" />
                                    <h3>Innovación Educativa</h3>
                                    <p>Utilizar las tecnologías más avanzadas de IA para revolucionar la forma en que las personas aprenden y crecen.</p>
                                </div>
                                
                                <div className="pillar">
                                    <Heart className="pillar-icon" />
                                    <h3>Impacto Positivo</h3>
                                    <p>Contribuir al desarrollo personal y profesional de individuos, creando un efecto multiplicador en sus comunidades.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visión */}
            <section className="vision-section">
                <div className="section-container">
                    <div className="vision-content">
                        <div className="vision-text">
                            <h2>Nuestra Visión</h2>
                            <p className="vision-statement">
                                Ser la plataforma de referencia mundial para la generación automática de rutas 
                                de aprendizaje personalizadas, transformando la manera en que las personas acceden 
                                y consumen contenido educativo digital a través de inteligencia artificial y 
                                tecnologías cloud nativas.
                            </p>
                            
                            <div className="vision-goals">
                                <div className="goal">
                                    <Globe className="goal-icon" />
                                    <h3>Alcance Global</h3>
                                    <p>Convertir a LearnIA en la plataforma educativa IA líder mundial, sirviendo a millones de usuarios en todos los continentes.</p>
                                </div>
                                
                                <div className="goal">
                                    <Rocket className="goal-icon" />
                                    <h3>Innovación Continua</h3>
                                    <p>Mantenernos a la vanguardia tecnológica, incorporando las últimas innovaciones en IA, ML y educación digital.</p>
                                </div>
                                
                                <div className="goal">
                                    <Award className="goal-icon" />
                                    <h3>Estándar de Excelencia</h3>
                                    <p>Establecer nuevos estándares de calidad en personalización educativa y experiencia de usuario.</p>
                                </div>
                            </div>
                        </div>
                        <div className="vision-icon-container">
                            <Eye className="vision-icon" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="values-section">
                <div className="section-container">
                    <h2 className="section-title">Nuestros Valores Fundamentales</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <Users className="value-icon" />
                            <h3>Usuario Primero</h3>
                            <p>
                                Cada decisión de producto se toma pensando en el beneficio y la experiencia 
                                del usuario. Sus necesidades y feedback guían nuestro desarrollo.
                            </p>
                        </div>

                        <div className="value-card">
                            <Lightbulb className="value-icon" />
                            <h3>Innovación Responsable</h3>
                            <p>
                                Adoptamos tecnologías emergentes de manera ética y responsable, 
                                considerando siempre el impacto a largo plazo en la sociedad.
                            </p>
                        </div>

                        <div className="value-card">
                            <Award className="value-icon" />
                            <h3>Excelencia Técnica</h3>
                            <p>
                                Nos comprometemos con los más altos estándares de calidad en código, 
                                arquitectura, seguridad y rendimiento del sistema.
                            </p>
                        </div>

                        <div className="value-card">
                            <Heart className="value-icon" />
                            <h3>Transparencia</h3>
                            <p>
                                Operamos con total transparencia sobre cómo funciona nuestra IA, 
                                qué datos utilizamos y cómo protegemos la privacidad.
                            </p>
                        </div>

                        <div className="value-card">
                            <Globe className="value-icon" />
                            <h3>Inclusividad</h3>
                            <p>
                                Diseñamos para la diversidad, asegurando que LearnIA sea accesible 
                                y útil para personas de diferentes culturas, capacidades y contextos.
                            </p>
                        </div>

                        <div className="value-card">
                            <Rocket className="value-icon" />
                            <h3>Mejora Continua</h3>
                            <p>
                                Nunca nos conformamos. Iteramos constantemente basándonos en datos, 
                                feedback y nuevas oportunidades de mejora.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impacto Esperado */}
            <section className="impact-section">
                <div className="section-container">
                    <h2 className="section-title">Impacto Esperado</h2>
                    <div className="impact-content">
                        <div className="impact-stats">
                            <div className="impact-stat">
                                <div className="stat-number">1M+</div>
                                <div className="stat-label">Usuarios activos objetivo para 2027</div>
                            </div>
                            <div className="impact-stat">
                                <div className="stat-number">50%</div>
                                <div className="stat-label">Reducción en tiempo de búsqueda de cursos</div>
                            </div>
                            <div className="impact-stat">
                                <div className="stat-number">3x</div>
                                <div className="stat-label">Mejora en tasas de completación de cursos</div>
                            </div>
                            <div className="impact-stat">
                                <div className="stat-number">100K+</div>
                                <div className="stat-label">Recursos educativos procesados objetivo</div>
                            </div>
                        </div>
                        
                        <div className="impact-description">
                            <h3>Transformando Vidas a Través del Aprendizaje</h3>
                            <p>
                                Nuestro objetivo va más allá de la tecnología. Queremos crear un impacto 
                                real en la vida de las personas, ayudándolas a:
                            </p>
                            <ul className="impact-list">
                                <li>Desarrollar nuevas habilidades de manera más eficiente</li>
                                <li>Ahorrar tiempo y energía en la búsqueda de contenido educativo</li>
                                <li>Acceder a educación de calidad independientemente de su ubicación</li>
                                <li>Encontrar rutas de aprendizaje adaptadas a sus objetivos únicos</li>
                                <li>Mantenerse actualizados en un mundo en constante cambio</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section className="roadmap-section">
                <div className="section-container">
                    <h2 className="section-title">Hoja de Ruta hacia Nuestra Visión</h2>
                    <div className="roadmap-timeline">
                        <div className="timeline-item">
                            <div className="timeline-year">2025</div>
                            <div className="timeline-content">
                                <h3>Fundación Sólida</h3>
                                <p>Lanzamiento de LearnIA v1.0 con funcionalidades core y validación del modelo de negocio</p>
                                <ul>
                                    <li>Procesamiento de 10K+ recursos</li>
                                    <li>IA de recomendaciones básica</li>
                                    <li>Primeros 1,000 usuarios</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2026</div>
                            <div className="timeline-content">
                                <h3>Expansión y Mejora</h3>
                                <p>Escalamiento del sistema y mejoras basadas en feedback de usuarios</p>
                                <ul>
                                    <li>10+ plataformas integradas</li>
                                    <li>IA conversacional avanzada</li>
                                    <li>App móvil nativa</li>
                                    <li>100K usuarios activos</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2027</div>
                            <div className="timeline-content">
                                <h3>Liderazgo Global</h3>
                                <p>Posicionamiento como plataforma líder en educación personalizada con IA</p>
                                <ul>
                                    <li>1M+ usuarios globales</li>
                                    <li>Análisis predictivo avanzado</li>
                                    <li>Partnerships estratégicos</li>
                                    <li>Expansión internacional</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2028+</div>
                            <div className="timeline-content">
                                <h3>Innovación Disruptiva</h3>
                                <p>Nuevas tecnologías y formatos de aprendizaje que redefinan la educación digital</p>
                                <ul>
                                    <li>Realidad aumentada/virtual</li>
                                    <li>IA generativa personalizada</li>
                                    <li>Ecosistema educativo completo</li>
                                    <li>Impacto social medible</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compromiso */}
            <section className="commitment-section">
                <div className="section-container">
                    <div className="commitment-content">
                        <h2>Nuestro Compromiso</h2>
                        <p className="commitment-text">
                            Como equipo de LearnIA, nos comprometemos a mantener estos principios 
                            en cada línea de código, cada decisión de producto y cada interacción 
                            con nuestros usuarios. Nuestra misión no es solo tecnológica, sino profundamente humana: 
                            empoderar a las personas para que alcancen su máximo potencial a través del aprendizaje.
                        </p>
                        <div className="commitment-signature">
                            <p><strong>Equipo LearnIA</strong></p>
                            <p>Universidad Pontificia Bolivariana - Bucaramanga</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MisionVision;