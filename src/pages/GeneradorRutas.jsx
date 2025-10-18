import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiServices from '../services/apiServices';
import '../styles/GeneradorRutas.css';

function GeneradorRutas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    query: '',
    nivel: 'intermediate',
    horasPorSemana: 10,
    numeroCursos: 5
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = apiServices.utils.getUserId();
      
      if (!userId) {
        throw new Error('No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.');
      }

      const payload = {
        user_id: userId,
        user_query: formData.query,
        user_level: formData.nivel,
        time_per_week: parseInt(formData.horasPorSemana),
        num_courses: parseInt(formData.numeroCursos),
        response_format: 'frontend'
      };

      console.log('Generando ruta con payload:', payload);

      const response = await apiServices.learningPath.generate(payload);
      
      if (response && response.titulo) {
        // Navegar al visualizador de rutas con la ruta generada
        navigate('/visualizador-rutas', { 
          state: { 
            nuevaRuta: response,
            mensaje: 'Ruta generada exitosamente'
          } 
        });
      } else {
        throw new Error('La respuesta no tiene el formato esperado');
      }

    } catch (err) {
      console.error('Error generando ruta:', err);
      setError(err.message || 'No se pudo generar la ruta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generador-rutas-container">
      <div className="generador-rutas-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/dashboard')}
        >
          ← Volver al Dashboard
        </button>
        <h1>Generador de Rutas de Aprendizaje</h1>
        <p className="subtitle">Crea una ruta personalizada con Inteligencia Artificial</p>
      </div>

      <div className="generador-rutas-content">
        <form onSubmit={handleSubmit} className="ruta-form">
          <div className="form-group">
            <label htmlFor="query">
              ¿Qué quieres aprender? *
            </label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleInputChange}
              placeholder="Ejemplo: Quiero aprender desarrollo web full stack con React y Node.js"
              rows="4"
              required
              minLength="10"
              maxLength="500"
            />
            <small className="help-text">
              Describe lo que quieres aprender (10-500 caracteres)
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nivel">
                Tu nivel actual
              </label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleInputChange}
                required
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="horasPorSemana">
                Horas por semana
              </label>
              <input
                type="number"
                id="horasPorSemana"
                name="horasPorSemana"
                value={formData.horasPorSemana}
                onChange={handleInputChange}
                min="1"
                max="40"
                required
              />
              <small className="help-text">Entre 1 y 40 horas</small>
            </div>

            <div className="form-group">
              <label htmlFor="numeroCursos">
                Número de cursos
              </label>
              <input
                type="number"
                id="numeroCursos"
                name="numeroCursos"
                value={formData.numeroCursos}
                onChange={handleInputChange}
                min="3"
                max="15"
                required
              />
              <small className="help-text">Entre 3 y 15 cursos</small>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Generando ruta...' : 'Generar Ruta con IA'}
            </button>
          </div>
        </form>

        <div className="info-panel">
          <h3>Cómo funciona</h3>
          <ol>
            <li>Describe lo que quieres aprender de manera clara</li>
            <li>Selecciona tu nivel actual de conocimiento</li>
            <li>Indica cuántas horas puedes dedicar por semana</li>
            <li>Elige cuántos cursos quieres en tu ruta</li>
            <li>La IA generará una ruta personalizada para ti</li>
          </ol>

          <div className="tips">
            <h4>Consejos</h4>
            <ul>
              <li>Sé específico en tu descripción</li>
              <li>Menciona tecnologías o herramientas que te interesan</li>
              <li>Indica si tienes algún objetivo específico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneradorRutas;
