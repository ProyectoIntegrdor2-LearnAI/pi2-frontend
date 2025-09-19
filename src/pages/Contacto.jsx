import React from 'react';
import { Send, Mail, MapPin, Phone, Clock, Brain, Github, Linkedin, Twitter, MessageSquare, Users, Building } from 'lucide-react';


const Contacto = () => {
    return (
        <div className="home-page">
            {/* ChatIA solo vista previa (no logueado) */}


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