import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'misRutasAprendizaje';

// Hook personalizado para gestionar las rutas de aprendizaje
export const useRutasAprendizaje = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar rutas del localStorage
  const cargarRutas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rutasGuardadas = localStorage.getItem(STORAGE_KEY);
      let rutasCargadas = rutasGuardadas ? JSON.parse(rutasGuardadas) : [];
      
      setRutas(rutasCargadas);
    } catch (error) {
      console.error('Error cargando rutas:', error);
      setError('Error cargando las rutas de aprendizaje');
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar rutas en localStorage
  const guardarRutas = useCallback((nuevasRutas) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasRutas));
      setRutas(nuevasRutas);
    } catch (error) {
      console.error('Error guardando rutas:', error);
      setError('Error guardando las rutas');
    }
  }, []);

  // Agregar una nueva ruta
  const agregarRuta = useCallback((nuevaRuta) => {
    try {
      const rutaFormateada = {
        id: Date.now(),
        titulo: nuevaRuta.titulo || "Ruta de Aprendizaje",
        descripcion: nuevaRuta.descripcion || "Ruta generada por el asistente IA",
        progreso: 0,
        fechaInicio: new Date().toISOString().split('T')[0],
        estimacion: nuevaRuta.estimacion || "Tiempo estimado",
        nivel: nuevaRuta.nivel || "Intermedio",
        origenChat: true,
        fechaCreacion: new Date().toISOString(),
        cursos: (nuevaRuta.cursos || []).map((curso, index) => ({
          id: Date.now() + index,
          titulo: curso.titulo || curso.nombre,
          descripcion: curso.descripcion,
          estado: index === 0 ? "disponible" : "bloqueado",
          orden: index + 1,
          duracion: curso.duracion || "Tiempo estimado",
          plataforma: curso.plataforma || "Plataforma Online",
          url: curso.url || curso.enlace,
          nivel: curso.nivel || "Intermedio",
          prerequisitos: curso.prerequisitos || [],
          fechaCreacion: new Date().toISOString()
        })).concat([{
          id: Date.now() + (nuevaRuta.cursos?.length || 0) + 1,
          titulo: "🎯 Meta Alcanzada",
          descripcion: "¡Felicidades! Has completado tu ruta de aprendizaje",
          estado: "meta",
          orden: (nuevaRuta.cursos?.length || 0) + 1,
          duracion: "Logro desbloqueado",
          plataforma: "Sistema",
          nivel: "Completado",
          fechaCreacion: new Date().toISOString(),
          esMeta: true
        }])
      };

      const rutasActualizadas = [...rutas, rutaFormateada];
      guardarRutas(rutasActualizadas);
      
      return rutaFormateada;
    } catch (error) {
      console.error('Error agregando ruta:', error);
      setError('Error agregando la ruta');
      return null;
    }
  }, [rutas, guardarRutas]);

  // Actualizar estado de un curso
  const actualizarCurso = useCallback((rutaId, cursoId, nuevoEstado, accion = null) => {
    try {
      const rutasActualizadas = rutas.map(ruta => {
        if (ruta.id === rutaId) {
          const cursosActualizados = ruta.cursos.map(curso => {
            if (curso.id === cursoId) {
              const cursoActualizado = { ...curso, estado: nuevoEstado };
              
              if (nuevoEstado === 'completado') {
                cursoActualizado.completadoEn = new Date().toISOString().split('T')[0];
                cursoActualizado.accion = 'completado';
                delete cursoActualizado.omitidoEn;
                delete cursoActualizado.iniciadoEn;
              } else if (nuevoEstado === 'omitido') {
                cursoActualizado.omitidoEn = new Date().toISOString().split('T')[0];
                cursoActualizado.accion = 'omitido';
                delete cursoActualizado.completadoEn;
                delete cursoActualizado.iniciadoEn;
              } else if (nuevoEstado === 'en-progreso') {
                cursoActualizado.iniciadoEn = new Date().toISOString().split('T')[0];
                cursoActualizado.accion = 'iniciado';
              } else if (nuevoEstado === 'disponible' && accion === 'retomar') {
                cursoActualizado.retomadoEn = new Date().toISOString().split('T')[0];
                cursoActualizado.accion = 'retomado';
                delete cursoActualizado.completadoEn;
                delete cursoActualizado.omitidoEn;
                delete cursoActualizado.iniciadoEn;
              }
              
              return cursoActualizado;
            }
            return curso;
          });

          // Desbloquear siguiente curso o la meta al completar/omitir
          if (nuevoEstado === 'completado' || nuevoEstado === 'omitido') {
            const indiceCursoActual = cursosActualizados.findIndex(c => c.id === cursoId);
            if (indiceCursoActual !== -1 && indiceCursoActual < cursosActualizados.length - 1) {
              const siguienteCurso = cursosActualizados[indiceCursoActual + 1];
              if (siguienteCurso.estado === 'bloqueado' || (siguienteCurso.esMeta && siguienteCurso.estado === 'meta')) {
                const nuevoEstadoSiguiente = siguienteCurso.esMeta ? 'meta-disponible' : 'disponible';
                cursosActualizados[indiceCursoActual + 1] = {
                  ...siguienteCurso,
                  estado: nuevoEstadoSiguiente,
                  desbloqueadoEn: new Date().toISOString().split('T')[0]
                };
              }
            }
          }

          // Recalcular progreso (sin contar la meta)
          const cursosRegulares = cursosActualizados.filter(c => !c.esMeta);
          const completados = cursosRegulares.filter(c => 
            c.estado === 'completado' || c.estado === 'omitido'
          ).length;
          const progreso = cursosRegulares.length > 0 ? Math.round((completados / cursosRegulares.length) * 100) : 0;

          return { 
            ...ruta, 
            cursos: cursosActualizados, 
            progreso,
            ultimaActualizacion: new Date().toISOString()
          };
        }
        return ruta;
      });

      guardarRutas(rutasActualizadas);
      return true;
    } catch (error) {
      console.error('Error actualizando curso:', error);
      setError('Error actualizando el curso');
      return false;
    }
  }, [rutas, guardarRutas]);

  // Eliminar una ruta
  const eliminarRuta = useCallback((rutaId) => {
    try {
      const rutasActualizadas = rutas.filter(ruta => ruta.id !== rutaId);
      guardarRutas(rutasActualizadas);
      return true;
    } catch (error) {
      console.error('Error eliminando ruta:', error);
      setError('Error eliminando la ruta');
      return false;
    }
  }, [rutas, guardarRutas]);

  // Obtener estadísticas de todas las rutas
  const obtenerEstadisticas = useCallback(() => {
    const stats = {
      totalRutas: rutas.length,
      rutasCompletadas: 0,
      rutasEnProgreso: 0,
      totalCursos: 0,
      cursosCompletados: 0,
      cursosOmitidos: 0,
      cursosEnProgreso: 0,
      cursosDisponibles: 0,
      cursosBloqueados: 0
    };

    rutas.forEach(ruta => {
      const cursosRegulares = ruta.cursos.filter(c => !c.esMeta);
      stats.totalCursos += cursosRegulares.length;
      
      if (ruta.progreso === 100) {
        stats.rutasCompletadas++;
      } else if (ruta.progreso > 0) {
        stats.rutasEnProgreso++;
      }

      ruta.cursos.forEach(curso => {
        if (curso.esMeta) return;
        
        switch (curso.estado) {
          case 'completado':
            stats.cursosCompletados++;
            break;
          case 'omitido':
            stats.cursosOmitidos++;
            break;
          case 'en-progreso':
            stats.cursosEnProgreso++;
            break;
          case 'disponible':
            stats.cursosDisponibles++;
            break;
          case 'bloqueado':
            stats.cursosBloqueados++;
            break;
        }
      });
    });

    return stats;
  }, [rutas]);

  // Obtener una ruta específica
  const obtenerRuta = useCallback((rutaId) => {
    return rutas.find(ruta => ruta.id === rutaId);
  }, [rutas]);

  // Cargar rutas al inicializar
  useEffect(() => {
    cargarRutas();
  }, [cargarRutas]);

  return {
    rutas,
    loading,
    error,
    cargarRutas,
    agregarRuta,
    actualizarCurso,
    eliminarRuta,
    obtenerEstadisticas,
    obtenerRuta,
    guardarRutas
  };
};

// Función para que el chat pueda agregar rutas
export const agregarRutaDesdeChat = (rutaData) => {
  try {
    const rutasActuales = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const nuevaRuta = {
      id: Date.now(),
      titulo: rutaData.titulo || "Ruta de Aprendizaje",
      descripcion: rutaData.descripcion || "Ruta generada por el asistente IA",
      progreso: 0,
      fechaInicio: new Date().toISOString().split('T')[0],
      estimacion: rutaData.estimacion || "Tiempo estimado",
      nivel: rutaData.nivel || "Intermedio",
      origenChat: true,
      fechaCreacion: new Date().toISOString(),
      promptOriginal: rutaData.promptOriginal,
      cursos: (rutaData.cursos || []).map((curso, index) => ({
        id: Date.now() + index,
        titulo: curso.titulo || curso.nombre,
        descripcion: curso.descripcion,
        estado: index === 0 ? "disponible" : "bloqueado",
        orden: index + 1,
        duracion: curso.duracion || "Tiempo estimado",
        plataforma: curso.plataforma || "Plataforma Online",
        url: curso.url || curso.enlace,
        nivel: curso.nivel || "Intermedio",
        prerequisitos: curso.prerequisitos || [],
        fechaCreacion: new Date().toISOString()
      })).concat([{
        id: Date.now() + (rutaData.cursos?.length || 0) + 1,
        titulo: "🎯 Meta Alcanzada",
        descripcion: "¡Felicidades! Has completado tu ruta de aprendizaje",
        estado: "meta",
        orden: (rutaData.cursos?.length || 0) + 1,
        duracion: "Logro desbloqueado",
        plataforma: "Sistema",
        nivel: "Completado",
        fechaCreacion: new Date().toISOString(),
        esMeta: true
      }])
    };

    const rutasActualizadas = [...rutasActuales, nuevaRuta];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rutasActualizadas));
    
    return nuevaRuta;
  } catch (error) {
    console.error('Error agregando ruta desde chat:', error);
    return null;
  }
};

export default useRutasAprendizaje;
