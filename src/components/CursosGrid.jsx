import React from 'react';
import cursosData from '../data/cursos';

const CursosGrid = () => {
    return (
        <div className="cursos-grid">
            {cursosData.map(curso => (
                <div key={curso.id} className="curso-card">
                    <div className="curso-image">
                        <img src={curso.imagen || '/api/placeholder/300/200'} alt={curso.titulo} />
                        <div className="curso-badge">{curso.categoria}</div>
                        {curso.nuevo && <div className="curso-nuevo">Nuevo</div>}
                    </div>

                    <div className="curso-content">
                        <h3 className="curso-titulo">{curso.titulo}</h3>
                        <p className="curso-descripcion">{curso.descripcion}</p>

                        <div className="curso-meta">
                            <div className="curso-instructor">
                                <img src={curso.instructor.avatar || '/api/placeholder/32/32'} alt={curso.instructor.nombre} />
                                <span>{curso.instructor.nombre}</span>
                            </div>
                            <div className="curso-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`star ${i < Math.floor(curso.rating) ? 'filled' : ''}`}
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8 1.314C8.234.976 8.766.976 9 1.314l1.902 2.732 3.204.295c.405.037.567.525.271.815L12.39 7.094l.76 3.111c.093.383-.334.684-.682.505L8 9.13 3.532 10.71c-.348.18-.775-.122-.682-.505l.76-3.111L1.623 5.156c-.296-.29-.134-.778.271-.815l3.204-.295L7 1.314z" fill="currentColor"/>
                                        </svg>
                                    ))}
                                </div>
                                <span className="rating-text">({curso.rating})</span>
                            </div>
                        </div>

                        <div className="curso-stats">
                            <div className="stat">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7.5 3.5a.5.5 0 0 1 1 0v3.793l2.146 2.147a.5.5 0 0 1-.708.708L7.5 7.707V3.5z" fill="currentColor"/>
                                </svg>
                                <span>{curso.duracion}</span>
                            </div>
                            <div className="stat">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor"/>
                                </svg>
                                <span>{curso.estudiantes} estudiantes</span>
                            </div>
                            <div className="stat">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3zm5 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM6 7a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 7zm0 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z" fill="currentColor"/>
                                </svg>
                                <span>{curso.lecciones} lecciones</span>
                            </div>
                        </div>

                        <div className="curso-footer">
                            <div className="curso-price">
                                {curso.precio === 0 ? (
                                    <span className="price-free">Gratis</span>
                                ) : (
                                    <>
                                        <span className="price-current">${curso.precio}</span>
                                        {curso.precioOriginal && (
                                            <span className="price-original">${curso.precioOriginal}</span>
                                        )}
                                    </>
                                )}
                            </div>
                            <button className="btn-enroll">
                                {curso.inscrito ? 'Continuar' : 'Inscribirse'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CursosGrid;