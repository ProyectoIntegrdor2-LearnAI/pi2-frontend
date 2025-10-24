import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiServices from '../services/apiServices';

const SearchResults = ({ results, isVisible }) => {
    const navigate = useNavigate();

    if (!isVisible) {
        return null;
    }

    const handleCourseClick = (course) => {
        if (course.url) {
            window.open(course.url, '_blank', 'noopener');
            return;
        }
        navigate(`/curso/${course.id}`);
    };

    return (
        <div className="search-results-container">
            <div className="search-results-grid">
                {results.map((curso) => (
                    <div key={curso.id} className="search-result-card">
                        <div className="course-image-container">
                            <img 
                                src={curso.imagen || 'https://via.placeholder.com/300x200?text=Curso'} 
                                alt={curso.titulo}
                                className="course-image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Curso';
                                }}
                            />
                            <div className="course-level-badge">
                                {curso.nivel || 'N/D'}
                            </div>
                        </div>
                        
                        <div className="course-content">
                            <div className="course-header">
                                <h3 className="course-title">{curso.titulo}</h3>
                                <div className="course-price">
                                    {String(curso.precio || '').toLowerCase().includes('gratis') ? (
                                        <span className="price-free">Gratis</span>
                                    ) : (
                                        <span className="price-paid">{curso.precio || 'Premium'}</span>
                                    )}
                                </div>
                            </div>
                            
                            <p className="course-description">
                                {curso.descripcion
                                    ? (curso.descripcion.length > 100
                                        ? `${curso.descripcion.substring(0, 100)}...`
                                        : curso.descripcion)
                                    : 'Sin descripción disponible'}
                            </p>
                            
                            <div className="course-meta">
                                <span className="course-instructor">👨‍🏫 {curso.instructor || 'Instructor no definido'}</span>
                                <span className="course-duration">⏱️ {curso.duracion || 'N/D'}</span>
                                <span className="course-rating">⭐ {Number(curso.calificacion || 0).toFixed(1)}</span>
                            </div>
                            
                            <div className="course-actions">
                                <button 
                                    className="course-action-button primary"
                                    onClick={() => handleCourseClick(curso)}
                                >
                                    Ver curso
                                </button>
                                <button 
                                    className="course-action-button secondary"
                                    onClick={() => {
                                        const storedUser = apiServices.utils.getStoredUser?.();
                                        const currentUserId = storedUser?.user_id || storedUser?.id || storedUser?.sub || null;
                                        const raw = localStorage.getItem('favorites');
                                        let favoritesPayload = {
                                            userId: currentUserId,
                                            favorites: [],
                                            updatedAt: new Date().toISOString(),
                                        };

                                        if (raw) {
                                            try {
                                                const parsed = JSON.parse(raw);
                                                if (parsed && typeof parsed === 'object' && Array.isArray(parsed.favorites)) {
                                                    if (!currentUserId || parsed.userId === currentUserId) {
                                                        favoritesPayload = parsed;
                                                    }
                                                } else if (Array.isArray(parsed)) {
                                                    favoritesPayload.favorites = parsed;
                                                }
                                            } catch (error) {
                                                console.warn('No se pudo leer favoritos locales:', error);
                                            }
                                        }

                                        const favorites = Array.isArray(favoritesPayload.favorites)
                                            ? favoritesPayload.favorites
                                            : [];
                                        const exists = favorites.some((fav) =>
                                            typeof fav === 'object' ? (fav.id || fav.course_id) === curso.id : fav === curso.id
                                        );

                                        if (exists) {
                                            alert('El curso ya está en favoritos');
                                            return;
                                        }

                                    const courseToSave = {
                                        id: curso.id,
                                        titulo: curso.titulo,
                                        descripcion: curso.descripcion,
                                        categoria: curso.categoria,
                                        nivel: curso.nivel,
                                        duracion: curso.duracion,
                                        instructor: curso.instructor,
                                        calificacion: curso.calificacion,
                                        precio: curso.precio,
                                        imagen: curso.imagen,
                                        url: curso.url,
                                        plataforma: curso.plataforma,
                                        fechaAgregado: new Date().toISOString(),
                                    };

                                        favorites.push(courseToSave);
                                        favoritesPayload = {
                                            userId: currentUserId,
                                            favorites,
                                            updatedAt: new Date().toISOString(),
                                        };
                                        localStorage.setItem('favorites', JSON.stringify(favoritesPayload));
                                        alert('Curso agregado a favoritos');
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
