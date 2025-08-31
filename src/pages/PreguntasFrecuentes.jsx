import React from 'react';
import { Users, Award, Target, Heart } from 'lucide-react';

const QuienesSomos = () => {
    return (
        <div className="quienes-somos-page">
            {/* Hero Section */}
            <section className="about-hero-section">
                <div className="section-container">
                    <div className="about-hero-content">
                        <h1 className="about-hero-title">
                            Conoce al equipo detrás de <span className="brand-highlight">LearnIA</span>
                        </h1>
                        <p className="about-hero-description">
                            Somos cinco estudiantes de Ingeniería de Sistemas de la Universidad Pontificia Bolivariana 
                            con una pasión compartida por la tecnología y la educación. Nuestro objetivo es revolucionar 
                            la forma en que las personas acceden al conocimiento.
                        </p>
                    </div>
                </div>
            </section>

            {/* Nuestra Historia */}
            <section className="our-story-section">
                <div className="section-container">
                    <h2 className="section-title">Nuestra Historia</h2>
                    <div className="story-content">
                        <div className="story-text">
                            <p>
                                LearnIA nació como nuestro Proyecto Integrador II en el semestre 2025-1. Lo que comenzó 
                                como un requisito académico se convirtió en una misión personal: democratizar el acceso 
                                a la educación de calidad.
                            </p>
                            <p>
                                Observamos que los estudiantes perdían tiempo navegando entre múltiples plataformas 
                                educativas sin una guía clara. Decidimos crear una solución inteligente que 
                                combina inteligencia artificial con web scraping para personalizar el aprendizaje.
                            </p>
                            <p>
                                Hoy, LearnIA procesa más de 10,000 recursos educativos de plataformas como Coursera, 
                                edX, Udemy y Khan Academy, generando rutas de aprendizaje únicas para cada usuario.
                            </p>
                        </div>
                        <div className="story-stats">
                            <div className="stat-card">
                                <div className="stat-number">5</div>
                                <div className="stat-label">Desarrolladores</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">10+</div>
                                <div className="stat-label">Semanas de Desarrollo</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">∞</div>
                                <div className="stat-label">Posibilidades</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nuestro Equipo */}
            <section className="team-section">
                <div className="section-container">
                    <h2 className="section-title">Nuestro Equipo</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-avatar">
                                <span>JC</span>
                            </div>
                            <h3>Juan Andrés Contreras</h3>
                            <p className="member-role">Full Stack Developer</p>
                            <p className="member-bio">
                                Especialista en desarrollo frontend y experiencia de usuario. 
                                Apasionado por crear interfaces intuitivas y funcionales.
                            </p>
                        </div>

                        <div className="team-member">
                            <div className="member-avatar">
                                <span>KL</span>
                            </div>
                            <h3>Karen Nicol Dayanna Lizarazo</h3>
                            <p className="member-role">Scrum Master & UX Designer</p>
                            <p className="member-bio">
                                Líder del equipo y especialista en metodologías ágiles. 
                                Garantiza que el proyecto avance según los objetivos establecidos.
                            </p>
                        </div>

                        <div className="team-member">
                            <div className="member-avatar">
                                <span>RL</span>
                            </div>
                            <h3>Raúl Ferney Lozano</h3>
                            <p className="member-role">Product Owner & Backend Developer</p>
                            <p className="member-bio">
                                Visionario del producto y arquitecto de sistemas. 
                                Define las funcionalidades clave y la infraestructura del proyecto.
                            </p>
                        </div>

                        <div className="team-member">
                            <div className="member-avatar">
                                <span>MP</span>
                            </div>
                            <h3>María Angelica Parra</h3>
                            <p className="member-role">AI/ML Engineer</p>
                            <p className="member-bio">
                                Especialista en inteligencia artificial y machine learning. 
                                Desarrolla los algoritmos que personalizan el aprendizaje.
                            </p>
                        </div>

                        <div className="team-member">
                            <div className="member-avatar">
                                <span>JP</span>
                            </div>
                            <h3>Jerson Arley Porras</h3>
                            <p className="member-role">DevOps & Data Engineer</p>
                            <p className="member-bio">
                                Experto en infraestructura cloud y procesamiento de datos. 
                                Mantiene la plataforma escalable y eficiente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nuestros Valores */}
            <section className="values-section">
                <div className="section-container">
                    <h2 className="section-title">Nuestros Valores</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <Users className="value-icon" />
                            <h3>Colaboración</h3>
                            <p>Creemos en el poder del trabajo en equipo y la sinergia de diferentes perspectivas para crear soluciones innovadoras.</p>
                        </div>

                        <div className="value-card">
                            <Award className="value-icon" />
                            <h3>Excelencia</h3>
                            <p>Nos esforzamos por entregar la mejor calidad en cada línea de código y cada funcionalidad que desarrollamos.</p>
                        </div>

                        <div className="value-card">
                            <Target className="value-icon" />
                            <h3>Innovación</h3>
                            <p>Buscamos constantemente nuevas formas de mejorar la educación mediante tecnologías emergentes.</p>
                        </div>

                        <div className="value-card">
                            <Heart className="value-icon" />
                            <h3>Impacto Social</h3>
                            <p>Nuestro objetivo es democratizar la educación y hacer que el aprendizaje de calidad sea accesible para todos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Universidad */}
            <section className="university-section">
                <div className="section-container">
                    <div className="university-content">
                        <div className="university-text">
                            <h2>Universidad Pontificia Bolivariana</h2>
                            <h3>Facultad de Ingeniería de Sistemas e Informática</h3>
                            <p>
                                Este proyecto es desarrollado como parte del Proyecto Integrador II del programa 
                                de Ingeniería de Sistemas e Informática de la UPB Seccional Bucaramanga.
                            </p>
                            <p>
                                Bajo la supervisión de la <strong>Ingeniera Danith Solórzano Escobar</strong>, 
                                hemos aplicado los conocimientos adquiridos durante nuestra carrera para crear 
                                una solución real que impacte positivamente en la educación.
                            </p>
                            <div className="project-details">
                                <div className="detail-item">
                                    <strong>Período:</strong> Julio - Septiembre 2025
                                </div>
                                <div className="detail-item">
                                    <strong>Metodología:</strong> Scrum con sprints de 2 semanas
                                </div>
                                <div className="detail-item">
                                    <strong>Tecnologías:</strong> React.js, FastAPI, AWS, MongoDB, IA/ML
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