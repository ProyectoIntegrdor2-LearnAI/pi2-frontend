import { useState, useEffect, useCallback, useRef } from 'react';
import apiServices from '../services/apiServices';
import { normalizeCourse, unwrapApiData, ensureArray } from '../utils/apiData';

const STORAGE_KEY = 'misRutasAprendizaje';

const readCache = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('No se pudo leer rutas en cache:', error);
    return [];
  }
};

const writeCache = (routes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch (error) {
    console.warn('No se pudo escribir rutas en cache:', error);
  }
};

const mapFrontendStatusToBackend = {
  'completado': 'completed',
  'omitido': 'skipped',
  'en-progreso': 'in_progress',
  'disponible': 'not_started',
  'bloqueado': 'not_started',
  'meta': 'completed',
  'meta-disponible': 'completed',
};

const createMetaCourse = (pathId, totalCursos, progreso) => ({
  id: `${pathId}-meta`,
  titulo: '🎯 Meta Alcanzada',
  descripcion: '¡Felicidades! Has completado tu ruta de aprendizaje',
  estado: progreso === 100 ? 'meta-disponible' : 'meta',
  orden: totalCursos + 1,
  duracion: 'Logro desbloqueado',
  plataforma: 'Sistema',
  nivel: 'Completado',
  esMeta: true,
  fechaCreacion: new Date().toISOString(),
});

const toFrontendEstimacion = (createdAt, targetDate) => {
  if (!createdAt || !targetDate) return 'Tiempo estimado';
  const created = new Date(createdAt);
  const target = new Date(targetDate);
  if (Number.isNaN(created.getTime()) || Number.isNaN(target.getTime())) {
    return 'Tiempo estimado';
  }
  const diffDays = Math.max(0, Math.round((target - created) / (1000 * 60 * 60 * 24)));
  const estimatedWeeks = Math.max(1, Math.ceil(diffDays / 7));
  return `${estimatedWeeks} semanas`;
};

const computeEstimatedWeeks = (createdAt, targetDate) => {
  const created = createdAt ? new Date(createdAt) : null;
  const target = targetDate ? new Date(targetDate) : null;
  if (!created || !target || Number.isNaN(created.valueOf()) || Number.isNaN(target.valueOf())) {
    return null;
  }
  const diffDays = Math.max(0, Math.round((target - created) / (1000 * 60 * 60 * 24)));
  return Math.max(1, Math.ceil(diffDays / 7));
};

const normalizeFrontendRoute = (ruta) => {
  const now = new Date().toISOString();
  const rutaId = ruta?.path_id || ruta?.id || `ruta-${Date.now()}`;
  const cursosFormateados = ensureArray(ruta?.cursos).map((curso, index) => {
    const courseBaseId =
      curso.id ||
      curso.course_id ||
      curso.courseId ||
      `${rutaId}-curso-${index}`;
    return {
      id: courseBaseId,
      titulo: curso.titulo || curso.nombre || `Curso ${index + 1}`,
      descripcion: curso.descripcion || '',
      estado: index === 0 ? 'disponible' : 'bloqueado',
      orden: typeof curso.order === 'number' ? curso.order : index + 1,
      duracion: curso.duracion || 'Tiempo estimado',
      plataforma: curso.plataforma || 'Plataforma Online',
      url: curso.url || curso.enlace || '',
      nivel: curso.nivel || 'Intermedio',
      lane: typeof curso.lane === 'number' ? curso.lane : 0,
      courseId: curso.course_id || curso.courseId || courseBaseId,
      course_id: curso.course_id || curso.courseId || courseBaseId,
      reason: curso.descripcion || curso.reason || '',
      prerequisitos: curso.prerequisitos || [],
      fechaCreacion: now,
    };
  });

  const progreso = ruta?.progreso ?? 0;
  const cursosConMeta = cursosFormateados.concat([
    createMetaCourse(rutaId, cursosFormateados.length, progreso),
  ]);

  const horasEstimadas = Number(
    ruta?.horasEstimadas ||
    ruta?.estimated_total_hours ||
    ruta?.estimatedTotalHours ||
    0,
  ) || 0;

  return {
    id: rutaId,
    pathId: rutaId,
    titulo: ruta?.titulo || ruta?.name || 'Ruta de Aprendizaje',
    descripcion: ruta?.descripcion || ruta?.description || 'Ruta generada por el asistente IA',
    progreso: Math.round(progreso),
    fechaInicio: (ruta?.fechaInicio || ruta?.created_at || now).split('T')[0],
    estimacion: ruta?.estimacion || 'Tiempo estimado',
    nivel: ruta?.nivel || 'En progreso',
    origenChat: Boolean(ruta?.origenChat),
    fechaCreacion: ruta?.fechaCreacion || ruta?.created_at || now,
    promptOriginal: ruta?.promptOriginal || ruta?.prompt || '',
    cursos: cursosConMeta,
    guardadoEnServidor: Boolean(ruta?.persisted ?? ruta?.guardado ?? true),
    persisted: Boolean(ruta?.persisted ?? ruta?.guardado ?? true),
    horasEstimadas,
    estimatedTotalHours: horasEstimadas,
  };
};

// Hook personalizado para gestionar las rutas de aprendizaje
export const useRutasAprendizaje = () => {
  const courseCacheRef = useRef(new Map());

  const [rutas, setRutas] = useState(() => readCache());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseSnapshot = useCallback(async (courseId) => {
    if (!courseId) {
      return null;
    }
    const cache = courseCacheRef.current;
    if (cache.has(courseId)) {
      return cache.get(courseId);
    }
    try {
      const response = await apiServices.courses.getCourseById(courseId);
      const data = unwrapApiData(response);
      const normalized = normalizeCourse(data);
      cache.set(courseId, normalized);
      return normalized;
    } catch (fetchError) {
      console.warn(`No se pudo obtener detalles del curso ${courseId}:`, fetchError);
      cache.set(courseId, null);
      return null;
    }
  }, []);

  const normalizeBackendPath = useCallback(async (backendPath) => {
    const createdAt = backendPath.created_at || backendPath.updated_at || new Date().toISOString();
    const estimatedWeeks = computeEstimatedWeeks(createdAt, backendPath.target_completion_date);
    const totalHours = backendPath.target_hours_per_week && estimatedWeeks
      ? backendPath.target_hours_per_week * estimatedWeeks
      : 0;

    let firstAvailableAssigned = false;
    const courses = [];
    for (let index = 0; index < backendPath.courses.length; index += 1) {
      const course = backendPath.courses[index];
      const snapshot = await fetchCourseSnapshot(course.mongodb_course_id);
      let estado = 'disponible';
      switch (course.status) {
        case 'completed':
          estado = 'completado';
          break;
        case 'skipped':
          estado = 'omitido';
          break;
        case 'in_progress':
          estado = 'en-progreso';
          firstAvailableAssigned = true;
          break;
        case 'not_started':
        default: {
          if (!firstAvailableAssigned) {
            estado = 'disponible';
            firstAvailableAssigned = true;
          } else {
            estado = 'bloqueado';
          }
          break;
        }
      }

      courses.push({
        id: `${backendPath.path_id}-${course.mongodb_course_id}`,
        titulo: snapshot?.titulo || `Curso ${index + 1}`,
        descripcion: snapshot?.descripcion || '',
        estado,
        orden: course.sequence_order ?? index + 1,
        duracion: snapshot?.duracion || 'Tiempo estimado',
        plataforma: snapshot?.plataforma || 'Plataforma Online',
        url: snapshot?.url || '',
        nivel: snapshot?.nivel || 'Intermedio',
        lane: 0,
        courseId: course.mongodb_course_id,
        course_id: course.mongodb_course_id,
        reason: snapshot?.raw?.reason || '',
        prerequisitos: snapshot?.raw?.prerequisitos || [],
        progreso: Number(course.progress_percentage ?? 0),
        timeInvestedMinutes: course.time_invested_minutes ?? 0,
        startedAt: course.started_at,
        completedAt: course.completed_at,
        fechaCreacion: course.created_at || createdAt,
      });
    }

    const progreso = Math.round(Number(backendPath.progress_percentage ?? 0));
    const cursosConMeta = courses.concat([
      createMetaCourse(backendPath.path_id, courses.length, progreso),
    ]);

    return {
      id: backendPath.path_id,
      pathId: backendPath.path_id,
      titulo: backendPath.name || 'Ruta de Aprendizaje',
      descripcion: backendPath.description || '',
      progreso,
      fechaInicio: new Date(createdAt).toISOString().split('T')[0],
      estimacion: estimatedWeeks ? `${estimatedWeeks} semanas` : toFrontendEstimacion(createdAt, backendPath.target_completion_date),
      nivel: backendPath.status === 'completed' ? 'Completado' : 'En progreso',
      origenChat: false,
      fechaCreacion: createdAt,
      promptOriginal: backendPath.metadata?.prompt || '',
      cursos: cursosConMeta,
      guardadoEnServidor: true,
      persisted: true,
      horasEstimadas: totalHours,
      estimatedTotalHours: totalHours,
      ultimaActualizacion: backendPath.updated_at,
    };
  }, [fetchCourseSnapshot]);

  const cargarRutas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiServices.learningPath.list();
      const payload = unwrapApiData(response);
      const backendPaths = ensureArray(payload?.learning_paths ?? payload?.paths ?? payload);

      const normalized = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const backendPath of backendPaths) {
        // eslint-disable-next-line no-await-in-loop
        const formatted = await normalizeBackendPath(backendPath);
        normalized.push(formatted);
      }

      setRutas(normalized);
      writeCache(normalized);
    } catch (fetchError) {
      console.error('Error cargando rutas desde API:', fetchError);
      setError('Error cargando las rutas de aprendizaje');
      const fallback = readCache();
      setRutas(fallback);
    } finally {
      setLoading(false);
    }
  }, [normalizeBackendPath]);

  const guardarRutas = useCallback((nuevasRutas) => {
    setRutas(nuevasRutas);
    writeCache(nuevasRutas);
  }, []);

  const agregarRuta = useCallback((rutaNueva) => {
    const normalizada = normalizeFrontendRoute(rutaNueva);
    setRutas((prev) => {
      const actualizado = [...prev, normalizada];
      writeCache(actualizado);
      return actualizado;
    });
    return normalizada;
  }, []);

  const actualizarCurso = useCallback(async (rutaId, cursoId, nuevoEstado, accion = null) => {
    const backendStatus = mapFrontendStatusToBackend[nuevoEstado] || 'in_progress';
    try {
      const response = await apiServices.learningPath.updateCourse(rutaId, cursoId, {
        status: backendStatus,
        action: accion,
      });
      const payload = unwrapApiData(response);
      const backendPath = payload?.learning_path || payload?.path;
      if (!backendPath) {
        throw new Error('Respuesta inesperada del servidor');
      }
      const rutaNormalizada = await normalizeBackendPath(backendPath);
      setRutas((prev) => {
        const otras = prev.filter((ruta) => ruta.pathId !== rutaId && ruta.id !== rutaId);
        const actualizado = [...otras, rutaNormalizada].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
        writeCache(actualizado);
        return actualizado;
      });
      return rutaNormalizada;
    } catch (updateError) {
      console.error('Error actualizando progreso en el backend:', updateError);
      setError('No fue posible actualizar el progreso');
      return null;
    }
  }, [normalizeBackendPath]);

  const eliminarRuta = useCallback((rutaId) => {
    setRutas((prev) => {
      const actualizado = prev.filter((ruta) => ruta.id !== rutaId && ruta.pathId !== rutaId);
      writeCache(actualizado);
      return actualizado;
    });
    // TODO: implementar eliminación en backend cuando exista endpoint
    return true;
  }, []);

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
      cursosBloqueados: 0,
    };

    rutas.forEach((ruta) => {
      const cursosRegulares = ruta.cursos.filter((c) => !c.esMeta);
      stats.totalCursos += cursosRegulares.length;

      if (ruta.progreso >= 100) {
        stats.rutasCompletadas += 1;
      } else if (ruta.progreso > 0) {
        stats.rutasEnProgreso += 1;
      }

      cursosRegulares.forEach((curso) => {
        switch (curso.estado) {
          case 'completado':
            stats.cursosCompletados += 1;
            break;
          case 'omitido':
            stats.cursosOmitidos += 1;
            break;
          case 'en-progreso':
            stats.cursosEnProgreso += 1;
            break;
          case 'disponible':
            stats.cursosDisponibles += 1;
            break;
          case 'bloqueado':
            stats.cursosBloqueados += 1;
            break;
          default:
            break;
        }
      });
    });

    return stats;
  }, [rutas]);

  const obtenerRuta = useCallback((rutaId) => rutas.find(
    (ruta) => ruta.id === rutaId || ruta.pathId === rutaId,
  ), [rutas]);

  useEffect(() => {
    cargarRutas();
  }, [cargarRutas]);

  useEffect(() => {
    writeCache(rutas);
  }, [rutas]);

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
    guardarRutas,
  };
};

export const agregarRutaDesdeChat = (rutaData) => {
  const rutaNormalizada = normalizeFrontendRoute(rutaData);
  const cache = readCache();
  cache.push(rutaNormalizada);
  writeCache(cache);
  return rutaNormalizada;
};
