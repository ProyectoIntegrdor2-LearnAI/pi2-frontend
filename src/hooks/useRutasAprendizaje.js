import { useState, useEffect, useCallback, useRef } from 'react';
import apiServices from '../services/apiServices';
import { normalizeCourse, unwrapApiData, ensureArray } from '../utils/apiData';

const STORAGE_KEY = 'misRutasAprendizaje';
// Always try server first, fallback to cache if fails
const ENABLE_SERVER_SYNC = true;

const readCache = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    console.log('Rutas cargadas del cache:', Array.isArray(parsed) ? parsed.length : 0);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('No se pudo leer rutas en cache:', error);
    return [];
  }
};

const writeCache = (routes) => {
  try {
    const serialized = JSON.stringify(routes);
    localStorage.setItem(STORAGE_KEY, serialized);
    console.log('Rutas guardadas en cache:', routes.length, 'rutas, tamaño:', serialized.length, 'bytes');
  } catch (error) {
    console.error('Error escribiendo rutas en cache:', {
      error: error.message,
      errorType: error.name,
      routesCount: routes.length,
      routeIds: routes.map(r => r.id || r.pathId).slice(0, 3),
    });
  }
};

const mapFrontendStatusToBackend = {
  'completado': 'completed',
  'omitido': 'skipped',
  'en-progreso': 'in_progress',
  'disponible': 'not_started',
  'bloqueado': 'not_started',
  'pendiente': 'skipped',
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

    const backendCourses = ensureArray(backendPath.courses);

    const COURSE_SNAPSHOT_BATCH = 5;
    const snapshots = [];
    for (let i = 0; i < backendCourses.length; i += COURSE_SNAPSHOT_BATCH) {
      const batch = backendCourses.slice(i, i + COURSE_SNAPSHOT_BATCH);
      // eslint-disable-next-line no-await-in-loop
      const batchSnapshots = await Promise.all(
        batch.map((course) => fetchCourseSnapshot(course.mongodb_course_id)),
      );
      snapshots.push(...batchSnapshots);
    }

    let firstAvailableAssigned = false;
    const courses = backendCourses.map((course, index) => {
      const snapshot = snapshots[index];
      let estado = 'disponible';
      const isSkipped = course.status === 'skipped';
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

      return {
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
        omitidoEn: isSkipped ? (course.updated_at || course.last_activity) : undefined,
        fechaCreacion: course.created_at || createdAt,
      };
    });

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
    console.log('cargarRutas: iniciando, ENABLE_SERVER_SYNC:', ENABLE_SERVER_SYNC);
    setLoading(true);
    setError(null);
    try {
      if (!ENABLE_SERVER_SYNC) {
        console.log('cargarRutas: server sync deshabilitado, usando cache');
        const cached = readCache();
        setRutas(cached);
        return;
      }
      
      console.log('cargarRutas: obteniendo rutas del servidor');
      const response = await apiServices.learningPath.list();
      console.log('cargarRutas: respuesta recibida', { status: response.status, ok: response.ok });
      
      const payload = unwrapApiData(response);
      console.log('cargarRutas: payload unwrapped', { tipo: typeof payload, tiene_learning_paths: !!payload?.learning_paths });
      
      const backendPaths = ensureArray(payload?.learning_paths ?? payload?.paths ?? payload);
      console.log('cargarRutas: rutas del servidor:', backendPaths.length);

      const PATH_NORMALIZATION_BATCH = 4;
      const normalized = [];
      for (let i = 0; i < backendPaths.length; i += PATH_NORMALIZATION_BATCH) {
        const batch = backendPaths.slice(i, i + PATH_NORMALIZATION_BATCH);
        // eslint-disable-next-line no-await-in-loop
        const batchResults = await Promise.all(
          batch.map((backendPath) => normalizeBackendPath(backendPath)),
        );
        normalized.push(...batchResults.filter(Boolean));
      }

      console.log('cargarRutas: rutas normalizadas:', normalized.length);

      // Merge con cache local
      const cached = readCache();
      const mergedMap = new Map();
      
      // Primero agregar rutas del servidor
      normalized.forEach(r => mergedMap.set(r.id, r));
      
      // Luego agregar rutas del cache que no estén en servidor (locales)
      cached.forEach(r => {
        if (!mergedMap.has(r.id)) {
          mergedMap.set(r.id, r);
        }
      });
      
      const merged = Array.from(mergedMap.values());
      console.log('cargarRutas: rutas merged finales:', merged.length);
      
      setRutas(merged);
      writeCache(merged);
    } catch (fetchError) {
      console.error('cargarRutas: Error cargando rutas desde API:', fetchError);
      setError('Error cargando las rutas de aprendizaje');
      const fallback = readCache();
      console.log('cargarRutas: usando fallback cache, rutas:', fallback.length);
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
    try {
      console.log('agregarRuta: Normalizando ruta nueva', {
        rutaId: rutaNueva?.path_id || rutaNueva?.id,
        tieneCursos: Boolean(rutaNueva?.cursos?.length),
        cursosCount: rutaNueva?.cursos?.length || 0,
      });
      const normalizada = normalizeFrontendRoute(rutaNueva);
      console.log('agregarRuta: Ruta normalizada', {
        id: normalizada.id,
        titulo: normalizada.titulo,
        cursosCount: normalizada.cursos?.length || 0,
      });
      setRutas((prev) => {
        const actualizado = [...prev, normalizada];
        console.log('agregarRuta: Guardando', actualizado.length, 'rutas al cache');
        writeCache(actualizado);
        return actualizado;
      });
      return normalizada;
    } catch (error) {
      console.error('Error en agregarRuta:', error);
      throw error;
    }
  }, []);

  const actualizarCurso = useCallback(async (rutaId, cursoId, nuevoEstado, accion = null) => {
    const backendStatus = mapFrontendStatusToBackend[nuevoEstado] || 'in_progress';
    try {
      if (!ENABLE_SERVER_SYNC) {
        throw new Error('SYNC_DISABLED');
      }
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
      if (updateError.message !== 'SYNC_DISABLED') {
        console.error('Error actualizando progreso en el backend:', updateError);
        setError('No fue posible actualizar el progreso');
      }
      let rutaActualizada = null;
      const fechaHoy = new Date().toISOString().split('T')[0];
      setRutas((prev) => {
        const actualizado = prev.map((ruta) => {
          if (ruta.id !== rutaId && ruta.pathId !== rutaId) {
            return ruta;
          }
          const cursosActualizados = [...ruta.cursos];
          const targetIndex = cursosActualizados.findIndex((curso) => (
            curso.id === `${ruta.pathId}-${cursoId}` ||
            curso.course_id === cursoId ||
            curso.courseId === cursoId ||
            curso.id === cursoId
          ));
          if (targetIndex !== -1) {
            const cursoActual = cursosActualizados[targetIndex];
            const cursoActualizado = { ...cursoActual, estado: nuevoEstado };
            if (nuevoEstado === 'completado') {
              cursoActualizado.completadoEn = fechaHoy;
            } else if (nuevoEstado === 'omitido' || nuevoEstado === 'pendiente') {
              cursoActualizado.omitidoEn = fechaHoy;
            }
            cursosActualizados[targetIndex] = cursoActualizado;

            // Desbloquear siguiente curso regular si aplica
            if (nuevoEstado === 'completado' || nuevoEstado === 'omitido' || nuevoEstado === 'pendiente') {
              for (let i = targetIndex + 1; i < cursosActualizados.length; i += 1) {
                const c = cursosActualizados[i];
                if (c && !c.esMeta) {
                  if (c.estado === 'bloqueado') {
                    cursosActualizados[i] = { ...c, estado: 'disponible' };
                  }
                  break;
                }
              }
            }
          }
          // Recalcular progreso localmente y estado de meta
          const regulares = cursosActualizados.filter((c) => !c.esMeta);
          const finalizados = regulares.filter((c) => (
            c.estado === 'completado' || c.estado === 'omitido' || c.estado === 'pendiente'
          )).length;
          const progresoLocal = regulares.length > 0
            ? Math.round((finalizados / regulares.length) * 100)
            : 0;

          const cursosConMetaActual = cursosActualizados.map((c) => {
            if (c.esMeta) {
              return { ...c, estado: progresoLocal >= 100 ? 'meta-disponible' : 'meta' };
            }
            return c;
          });

          rutaActualizada = {
            ...ruta,
            cursos: cursosConMetaActual,
            progreso: progresoLocal,
            ultimaActualizacion: new Date().toISOString(),
          };
          return rutaActualizada;
        });
        writeCache(actualizado);
        return actualizado;
      });
      return rutaActualizada;
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
          case 'pendiente':
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
  }, []);

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
