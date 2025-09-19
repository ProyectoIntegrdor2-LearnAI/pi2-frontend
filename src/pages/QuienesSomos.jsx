
import React from 'react';
import { Brain, Users, Target, ChevronUp } from 'lucide-react';

const QuienesSomos = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="home-page">

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