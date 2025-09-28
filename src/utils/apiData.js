// src/utils/apiData.js
// Utilidades para normalizar respuestas de la API y dar formato a datos

const isNonEmpty = (value) =>
  value !== undefined && value !== null && value !== '';

const pickFirst = (...values) => values.find(isNonEmpty);

export const unwrapApiData = (payload) => {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload;
  if (isNonEmpty(payload.data)) return payload.data;
  if (isNonEmpty(payload.result)) return payload.result;
  return payload;
};

export const normalizeCourse = (course) => {
  if (!course || typeof course !== 'object') {
    return null;
  }

  const id = pickFirst(
    course.id,
    course.course_id,
    course.courseId,
    course.uuid,
    course.slug
  );

  if (!id) {
    return null;
  }

  const rawTitle = pickFirst(
    course.titulo,
    course.title,
    course.name,
    course.nombre
  );

  const rawDescription = pickFirst(
    course.descripcion,
    course.description,
    course.resumen,
    course.summary
  );

  const rawCategory = pickFirst(course.categoria, course.category, course.area);
  const rawLevel = pickFirst(course.nivel, course.level);
  const rawDuration = pickFirst(course.duracion, course.duration);
  const rawInstructor = pickFirst(
    course.instructor,
    course.author,
    course.profesor,
    course.owner
  );
  const rawPrice = pickFirst(course.precio, course.price);
  const rawPlatform = pickFirst(course.plataforma, course.platform);
  const rawRating = pickFirst(course.calificacion, course.rating, course.score);

  return {
    id,
    titulo: rawTitle || 'Curso sin título',
    descripcion: rawDescription || '',
    categoria: rawCategory || '',
    nivel: rawLevel || 'Sin nivel',
    duracion: rawDuration || '',
    instructor: rawInstructor || 'Instructor por definir',
    calificacion: Number(rawRating) || 0,
    precio: rawPrice || 'gratis',
    imagen: pickFirst(
      course.imagen,
      course.image,
      course.thumbnail,
      course.coverImage
    ) || null,
    url: pickFirst(course.url, course.link, course.enlace, course.landing_page) || '',
    plataforma: rawPlatform || 'LearnIA',
    raw: course,
  };
};

export const formatDateValue = (value, { includeTime = false } = {}) => {
  if (!isNonEmpty(value)) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const options = includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' };

  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

export const ensureArray = (maybeArray) => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  if (!isNonEmpty(maybeArray)) {
    return [];
  }
  return [maybeArray];
};

