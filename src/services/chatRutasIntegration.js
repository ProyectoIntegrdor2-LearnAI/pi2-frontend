/**
 * Ejemplo de integración entre Chat y Visualizador de Rutas
 * Este archivo muestra cómo el chat puede crear y enviar rutas al visualizador
 */

import { agregarRutaDesdeChat } from '../hooks/useRutasAprendizaje';

// Función que el chat puede llamar para crear una nueva ruta
export const crearRutaDesdeChat = (respuestaIA, promptUsuario) => {
  try {
    // Parsear la respuesta de la IA para extraer la información de la ruta
    const rutaData = parsearRespuestaIA(respuestaIA, promptUsuario);
    
    // Agregar la ruta al sistema
    const nuevaRuta = agregarRutaDesdeChat(rutaData);
    
    if (nuevaRuta) {
      console.log('Ruta creada exitosamente:', nuevaRuta);
      return {
        exito: true,
        ruta: nuevaRuta,
        mensaje: 'Ruta de aprendizaje creada. Puedes verla en "Mis Rutas"'
      };
    }
    
    return {
      exito: false,
      mensaje: 'Error creando la ruta de aprendizaje'
    };
    
  } catch (error) {
    console.error('Error en crearRutaDesdeChat:', error);
    return {
      exito: false,
      mensaje: 'Error procesando la ruta de aprendizaje'
    };
  }
};

// Función para parsear la respuesta de la IA
const parsearRespuestaIA = (respuesta, prompt) => {
  // Estructura esperada de la respuesta de la IA
  const rutaEjemplo = {
    titulo: extraerTitulo(respuesta) || "Ruta de Aprendizaje Personalizada",
    descripcion: extraerDescripcion(respuesta) || "Ruta creada basada en tus preferencias",
    nivel: extraerNivel(respuesta) || "Intermedio",
    estimacion: extraerEstimacion(respuesta) || "8-12 semanas",
    promptOriginal: prompt,
    cursos: extraerCursos(respuesta)
  };
  
  return rutaEjemplo;
};

// Funciones auxiliares para extraer información de la respuesta de la IA
const extraerTitulo = (respuesta) => {
  // Buscar patrones como "Ruta para...", "Aprende...", etc.
  const patrones = [
    /(?:ruta para|aprende|conviértete en|domina)\s+(.{1,80})/i,
    /(?:especialización en|curso de|programa de)\s+(.{1,80})/i
  ];
  
  for (const patron of patrones) {
    const match = respuesta.match(patron);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
};

const extraerDescripcion = (respuesta) => {
  // Buscar la descripción general de la ruta
  const patrones = [
    /(?:esta ruta|este programa|este curso).{1,200}/i,
    /(?:aprenderás|dominarás|te especializarás).{1,200}/i
  ];
  
  for (const patron of patrones) {
    const match = respuesta.match(patron);
    if (match) {
      return match[0].trim();
    }
  }
  
  return null;
};

const extraerNivel = (respuesta) => {
  const niveles = {
    'principiante': ['principiante', 'básico', 'beginner', 'inicial', 'novato'],
    'intermedio': ['intermedio', 'intermediate', 'medio'],
    'avanzado': ['avanzado', 'advanced', 'experto', 'profesional']
  };
  
  const respuestaLower = respuesta.toLowerCase();
  
  for (const [nivel, palabras] of Object.entries(niveles)) {
    if (palabras.some(palabra => respuestaLower.includes(palabra))) {
      return nivel.charAt(0).toUpperCase() + nivel.slice(1);
    }
  }
  
  return 'Intermedio';
};

const extraerEstimacion = (respuesta) => {
  // Buscar patrones de tiempo
  const patronesTiempo = [
    /(\d+)\s*(?:semanas?|weeks?)/i,
    /(\d+)\s*(?:meses?|months?)/i,
    /(\d+)\s*(?:días?|days?)/i
  ];
  
  for (const patron of patronesTiempo) {
    const match = respuesta.match(patron);
    if (match) {
      const numero = parseInt(match[1]);
      if (patron.source.includes('semana')) {
        return `${numero} semanas`;
      } else if (patron.source.includes('mes')) {
        return `${numero} meses`;
      } else if (patron.source.includes('día')) {
        return `${numero} días`;
      }
    }
  }
  
  return "8-12 semanas";
};

const extraerCursos = (respuesta) => {
  // Patrones para identificar cursos en la respuesta
  const cursos = [];
  
  // Buscar listas numeradas o con viñetas
  const patronesCurso = [
    /(?:\d+[.\-\)]|\*|\-|\•)\s*(.+?)(?:\n|$)/g,
    /(?:curso|módulo|unidad)\s*\d*:?\s*(.+?)(?:\n|$)/gi
  ];
  
  for (const patron of patronesCurso) {
    let match;
    while ((match = patron.exec(respuesta)) !== null) {
      const titulo = match[1].trim();
      if (titulo.length > 5 && titulo.length < 100) {
        const curso = parsearCurso(titulo);
        if (curso) {
          cursos.push(curso);
        }
      }
    }
  }
  
  // Si no se encontraron cursos con patrones, crear cursos ejemplo
  if (cursos.length === 0) {
    return crearCursosEjemplo(respuesta);
  }
  
  return cursos.slice(0, 8); // Limitar a 8 cursos máximo
};

const parsearCurso = (textoCurso) => {
  // Extraer información del curso del texto
  const curso = {
    titulo: extraerTituloCurso(textoCurso),
    descripcion: extraerDescripcionCurso(textoCurso),
    duracion: extraerDuracionCurso(textoCurso) || "2-3 semanas",
    nivel: extraerNivelCurso(textoCurso) || "Intermedio",
    plataforma: extraerPlataformaCurso(textoCurso) || "Plataforma Online",
    url: extraerURLCurso(textoCurso)
  };
  
  return curso;
};

const extraerTituloCurso = (texto) => {
  // Limpiar el texto para obtener solo el título
  return texto
    .replace(/^\d+[.\-\)]\s*/, '') // Quitar numeración
    .replace(/^[\*\-\•]\s*/, '') // Quitar viñetas
    .replace(/\([^)]*\)/, '') // Quitar contenido entre paréntesis
    .replace(/-.*$/, '') // Quitar descripciones después de guión
    .trim();
};

const extraerDescripcionCurso = (texto) => {
  // Buscar descripciones después de guiones o en paréntesis
  const descripcionMatch = texto.match(/[-:](.+)$/) || texto.match(/\(([^)]+)\)/);
  return descripcionMatch ? descripcionMatch[1].trim() : null;
};

const extraerDuracionCurso = (texto) => {
  const match = texto.match(/(\d+)\s*(?:semana|hora|día)s?/i);
  return match ? `${match[1]} ${match[0].includes('semana') ? 'semanas' : 'horas'}` : null;
};

const extraerNivelCurso = (texto) => {
  return extraerNivel(texto);
};

const extraerPlataformaCurso = (texto) => {
  const plataformas = {
    'Coursera': ['coursera'],
    'Udemy': ['udemy'],
    'edX': ['edx'],
    'Khan Academy': ['khan'],
    'Codecademy': ['codecademy'],
    'Pluralsight': ['pluralsight'],
    'LinkedIn Learning': ['linkedin'],
    'Udacity': ['udacity']
  };
  
  const textoLower = texto.toLowerCase();
  
  for (const [plataforma, palabras] of Object.entries(plataformas)) {
    if (palabras.some(palabra => textoLower.includes(palabra))) {
      return plataforma;
    }
  }
  
  return "Plataforma Online";
};

const extraerURLCurso = (texto) => {
  const urlMatch = texto.match(/(https?:\/\/[^\s]+)/);
  return urlMatch ? urlMatch[1] : null;
};

const crearCursosEjemplo = (respuesta) => {
  // Crear cursos ejemplo basados en el tema de la respuesta
  const tema = detectarTema(respuesta);
  
  const cursosPlantilla = {
    'desarrollo web': [
      { titulo: "HTML y CSS Fundamentals", descripcion: "Bases del desarrollo web" },
      { titulo: "JavaScript Moderno", descripcion: "Programación interactiva" },
      { titulo: "React.js", descripcion: "Framework de componentes" },
      { titulo: "Node.js y Backend", descripcion: "Desarrollo del servidor" }
    ],
    'data science': [
      { titulo: "Python para Data Science", descripcion: "Programación para análisis" },
      { titulo: "Estadística y Probabilidad", descripcion: "Fundamentos matemáticos" },
      { titulo: "Machine Learning", descripcion: "Aprendizaje automático" },
      { titulo: "Visualización de Datos", descripcion: "Presentación de resultados" }
    ],
    'marketing digital': [
      { titulo: "Fundamentos de Marketing Digital", descripcion: "Conceptos básicos" },
      { titulo: "SEO y SEM", descripcion: "Posicionamiento en buscadores" },
      { titulo: "Social Media Marketing", descripcion: "Redes sociales" },
      { titulo: "Analytics y Métricas", descripcion: "Medición de resultados" }
    ]
  };
  
  const cursosBase = cursosPlantilla[tema] || cursosPlantilla['desarrollo web'];
  
  return cursosBase.map((curso, index) => ({
    ...curso,
    duracion: "2-3 semanas",
    nivel: index === 0 ? "Básico" : "Intermedio",
    plataforma: "Plataforma Online"
  }));
};

const detectarTema = (respuesta) => {
  const temas = {
    'desarrollo web': ['web', 'html', 'css', 'javascript', 'react', 'vue', 'angular', 'frontend', 'backend'],
    'data science': ['datos', 'data', 'python', 'estadística', 'machine learning', 'análisis'],
    'marketing digital': ['marketing', 'seo', 'sem', 'social media', 'publicidad', 'digital']
  };
  
  const respuestaLower = respuesta.toLowerCase();
  
  for (const [tema, palabras] of Object.entries(temas)) {
    if (palabras.some(palabra => respuestaLower.includes(palabra))) {
      return tema;
    }
  }
  
  return 'desarrollo web'; // Tema por defecto
};

// Función para navegar directamente a la sección de rutas con una nueva ruta
export const navegarConNuevaRuta = (navigate, rutaData) => {
  navigate('/dashboard/rutas', {
    state: {
      nuevaRuta: rutaData
    }
  });
};

// Ejemplos de uso para el chat
export const ejemplosIntegracion = {
  // Ejemplo 1: Respuesta básica del chat
  ejemplo1: () => {
    const respuestaIA = `
      Te sugiero esta ruta para convertirte en Desarrollador Frontend:
      
      1. HTML y CSS Fundamentos - Aprende las bases del desarrollo web
      2. JavaScript Moderno ES6+ - Domina la programación interactiva  
      3. React.js - Construye aplicaciones con componentes
      4. Git y Control de Versiones - Maneja tu código eficientemente
      5. Deployment y Hosting - Publica tus proyectos
      
      Esta ruta te tomará aproximadamente 10 semanas y es perfecta para nivel intermedio.
    `;
    
    const prompt = "Quiero aprender desarrollo frontend";
    
    return crearRutaDesdeChat(respuestaIA, prompt);
  },
  
  // Ejemplo 2: Con URLs específicas
  ejemplo2: () => {
    const respuestaIA = `
      Ruta de Data Science con Python:
      
      1. Python Básico (https://codecademy.com/python) - 3 semanas
      2. NumPy y Pandas (https://datacamp.com/pandas) - 2 semanas  
      3. Visualización con Matplotlib (https://udemy.com/matplotlib) - 2 semanas
      4. Machine Learning Básico (https://coursera.org/ml) - 4 semanas
      
      Nivel: Intermedio, Duración: 12 semanas
    `;
    
    const prompt = "Crear ruta de data science";
    
    return crearRutaDesdeChat(respuestaIA, prompt);
  }
};

export default {
  crearRutaDesdeChat,
  navegarConNuevaRuta,
  ejemplosIntegracion
};
