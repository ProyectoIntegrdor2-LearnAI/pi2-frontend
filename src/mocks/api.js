// Mock API para LearnIA
// Simula endpoints con retraso de red usando setTimeout

// Datos de prueba
let stats = {
  completed: 8,
  total: 12,
  streak: 15,
  level: "Intermedio",
};

let courses = [
  {
    id: 1,
    title: "React Básico",
    description: "Aprende los fundamentos de React con ejemplos prácticos.",
    category: "Frontend",
    level: "Principiante",
    duration: "10h",
  },
  {
    id: 2,
    title: "Node.js Avanzado",
    description: "Construye APIs escalables y seguras con Node.js y Express.",
    category: "Backend",
    level: "Avanzado",
    duration: "14h",
  },
  {
    id: 3,
    title: "Bases de Datos SQL",
    description: "Aprende a diseñar y optimizar bases de datos relacionales.",
    category: "Data",
    level: "Intermedio",
    duration: "12h",
  },
];

let favorites = [];

let profile = {
  id: 1,
  name: "María García",
  email: "maria@example.com",
  avatar: "/imagenes/logo.jpg",
};

let chatHistory = [
  { role: "ai", content: "¡Hola! Soy tu asistente IA, ¿en qué te ayudo hoy?" },
];

// Función auxiliar para simular delay
const delay = (data, time = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(data), time));

export const mockApi = {
  getStats: () => delay(stats),
  getCourses: () => delay(courses),
  getFavorites: () => delay(favorites),
  addFavorite: (id) => {
    const course = courses.find((c) => c.id === id);
    if (course && !favorites.some((f) => f.id === id)) {
      favorites.push(course);
    }
    return delay(favorites);
  },
  getProfile: () => delay(profile),
  getChatHistory: () => delay(chatHistory),
  sendChat: (message) => {
    chatHistory.push({ role: "user", content: message });

    // Respuesta automática de la IA
    const reply = {
      role: "ai",
      content: `Gracias por tu mensaje: "${message}". Te recomiendo continuar con "React Avanzado" 🚀`,
    };

    chatHistory.push(reply);
    return delay(reply, 800);
  },
};
