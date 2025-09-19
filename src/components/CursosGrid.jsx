import React from 'react';
import cursosData from '../data/cursos'; // Asegúrate de usar el archivo corregido

const CursosGrid = () => {
    return (
        <div className="cursos-grid">
            {cursosData.map((curso, index) => (
                <div key={index} className="curso-card">
                    {/* Badge de categoría */}
                    <div className="curso-badge">{curso.categoria}</div>

                    {/* Contenido del curso */}
                    <div className="curso-content">
                        <h3 className="curso-titulo">{curso.titulo}</h3>
                        <p className="curso-descripcion">{curso.descripcion}</p>

                        {/* Meta: nivel, duración y calificación */}
                        <div className="curso-meta">
                            <span className="curso-nivel">Nivel: {curso.nivel}</span>
                            <span className="curso-duracion">Duración: {curso.duracion}</span>
                            <span className="curso-calificacion">Calificación: {curso.calificacion} ⭐</span>
                        </div>

                        {/* Botón para ir al curso */}
                        <div className="curso-footer">
                            <a href={curso.url} target="_blank" rel="noopener noreferrer" className="btn-ver-curso">
                                Ver Curso
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CursosGrid;
