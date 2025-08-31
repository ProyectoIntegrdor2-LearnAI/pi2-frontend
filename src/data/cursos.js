const cursosData = [
    {
        id: 1,
        titulo: "Introducción a Machine Learning",
        descripcion: "Aprende los fundamentos del aprendizaje automático con Python y scikit-learn.",
        categoria: "IA",
        nivel: "principiante",
        precio: 0,
        precioOriginal: null,
        rating: 4.8,
        duracion: "8 semanas",
        estudiantes: 2340,
        lecciones: 42,
        instructor: {
            nombre: "Dr. María González",
            avatar: "/api/placeholder/32/32"
        },
        imagen: "/api/placeholder/300/200",
        nuevo: true,
        inscrito: false
    },
    {
        id: 2,
        titulo: "Desarrollo Web Full Stack",
        descripcion: "Domina HTML, CSS, JavaScript, React y Node.js en un curso completo.",
        categoria: "Web",
        nivel: "intermedio",
        precio: 199,
        precioOriginal: 299,
        rating: 4.9,
        duracion: "12 semanas",
        estudiantes: 1890,
        lecciones: 68,
        instructor: {
            nombre: "Carlos Rodríguez",
            avatar: "/api/placeholder/32/32"
        },
        imagen: "/api/placeholder/300/200",
        nuevo: false,
        inscrito: true
    },
    {
        id: 3,
        titulo: "Python para Data Science",
        descripcion: "Analiza datos con pandas, numpy y matplotlib. Incluye proyectos reales.",
        categoria: "Datos",
        nivel: "intermedio",
        precio: 149,
        precioOriginal: null,
        rating: 4.7,
        duracion: "10 semanas",
        estudiantes: 3200,
        lecciones: 55,
        instructor: {
            nombre: "Ana López",
            avatar: "/api/placeholder/32/32"
        },
        imagen: "/api/placeholder/300/200",
        nuevo: false,
        inscrito: false
    },
    {
        id: 4,
        titulo: "Diseño UX/UI con Figma",
        descripcion: "Crea interfaces atractivas y funcionales siguiendo principios de diseño moderno.",
        categoria: "Diseño",
        nivel: "principiante",
        precio: 0,
        precioOriginal: null,
        rating: 4.6,
        duracion: "6 semanas",
        estudiantes: 1560,
        lecciones: 38,
        instructor: {
            nombre: "Sofia Martín",
            avatar: "/api/placeholder/32/32"
        },
        imagen: "/api/placeholder/300/200",
        nuevo: false,
        inscrito: false
    },
    {
        id: 5,
        titulo: "Desarrollo de Apps con React Native",
        descripcion: "Construye aplicaciones móviles para iOS y Android con una sola base de código.",
        categoria: "Móvil",
        nivel: "avanzado",
        precio: 249,
        precioOriginal: 349,
        rating: 4.8,
        duracion: "14 semanas",
        estudiantes: 890,
        lecciones: 76,
        instructor: {
            nombre: "Roberto Silva",
            avatar: "/api/placeholder/32/32"
        },
        imagen: "/api/placeholder/300/200",
        nuevo: true,
        inscrito: false
    },
    {
        id: 6,
        titulo: "Deep Learning con TensorFlow",
        descripcion: "Redes neuronales profundas, CNN, RNN y transformers para resolver problemas complejos.",
        categoria: "IA",
        nivel: "avanzado",
        precio: 299,
        precioOriginal: null,
        rating: 4.9,
        duracion: "16 semanas",
        estudiantes: 1200,
        lecciones: 89,
        instructor: {
            nombre: "Dr. Fernando Torres",
            avatar: "/api/placeholder/32/32"
        },
        imagen: "/api/placeholder/300/200",
        nuevo: false,
        inscrito: true
    }
];

export default cursosData;