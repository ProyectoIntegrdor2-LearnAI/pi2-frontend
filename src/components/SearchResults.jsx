import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, isVisible }) => {
    const navigate = useNavigate();

    if (!isVisible || results.length === 0) {
        return null;
    }

    const handleCourseClick = (courseId) => {
        navigate(`/curso/${courseId}`);
    };

    return (
        <div className="search-results-container">
            <div className="search-results-grid">
                {results.map((curso) => (
                    <div key={curso.id} className="search-result-card">
                        <div className="course-image-container">
                            <img 
                                src={curso.imagen} 
                                alt={curso.titulo}
                                className="course-image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Curso';
                                }}
                            />
                            <div className="course-level-badge">
                                {curso.nivel}
                            </div>
                        </div>
                        
                        <div className="course-content">
                            <div className="course-header">
                                <h3 className="course-title">{curso.titulo}</h3>
                                <div className="course-price">
                                    {curso.precio === 'gratis' ? (
                                        <span className="price-free">Gratis</span>
                                    ) : (
                                        <span className="price-paid">Premium</span>
                                    )}
                                </div>
                            </div>
                            
                            <p className="course-description">
                                {curso.descripcion.length > 100 
                                    ? `${curso.descripcion.substring(0, 100)}...`
                                    : curso.descripcion
                                }
                            </p>
                            
                            <div className="course-meta">
                                <span className="course-instructor">👨‍🏫 {curso.instructor}</span>
                                <span className="course-duration">⏱️ {curso.duracion}</span>
                                <span className="course-rating">⭐ {curso.calificacion}</span>
                            </div>
                            
                            <div className="course-actions">
                                <button 
                                    className="course-action-button primary"
                                    onClick={() => handleCourseClick(curso.id)}
                                >
                                    Ver Curso
                                </button>
                                <button 
                                    className="course-action-button secondary"
                                    onClick={() => {
                                        // Agregar a favoritos
                                        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                                        if (!favorites.includes(curso.id)) {
                                            favorites.push(curso.id);
                                            localStorage.setItem('favorites', JSON.stringify(favorites));
                                            alert('Curso agregado a favoritos');
                                        } else {
                                            alert('El curso ya está en favoritos');
                                        }
                                    }}
                                >
                                    ❤️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
