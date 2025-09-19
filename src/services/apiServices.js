// src/services/apiServices.js
const apiServices = {
  // 🔹 Servicio de autenticación
  auth: {
    login: async (credentials) => {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error("Error en login");
      const data = await response.json();
      return data;
    },

    register: async (userData) => {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Error en registro");
      return response.json();
    },

    logout: () => {
      // Eliminar datos de sesión (aquí podrías avisar al backend también si lo requiere)
      localStorage.removeItem("token");
      sessionStorage.clear();
      console.log("Sesión cerrada correctamente 🚪");
    },
  },

  // 🔹 Servicios de usuario
  user: {
    getProfile: async (userId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo perfil");
      return response.json();
    },

    getProgress: async (userId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${userId}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo progreso");
      return response.json();
    },

    markResourceCompleted: async (userId, resourceId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${userId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resourceId }),
      });
      if (!response.ok) throw new Error("Error marcando recurso");
      return response.json();
    },
  },

  // 🔹 Servicios de cursos
  courses: {
    getAllCourses: async ({ limit = 10 }) => {
      const response = await fetch(`/api/courses/trending?limit=${limit}`);
      if (!response.ok) throw new Error("Error obteniendo cursos");
      return response.json();
    },

    getCourseById: async (id) => {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error("Error obteniendo detalle del curso");
      return response.json();
    },

    getCategories: async () => {
      const response = await fetch(`/api/courses/categories`);
      if (!response.ok) throw new Error("Error obteniendo categorías");
      return response.json();
    },

    addFavorite: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/courses/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error agregando a favoritos");
      return response.json();
    },
  },
  // 🔹 Analíticas
  analytics: {
    getPopularCourses: async () => {
      const response = await fetch(`/api/analytics/popular-courses`);
      if (!response.ok) throw new Error("Error obteniendo cursos populares");
      return response.json();
    },
    getUserEngagement: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/analytics/user-engagement`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo engagement");
      return response.json();
    },
  },

  // 🔹 Estado del sistema
  health: {
    getStatus: async () => {
      const response = await fetch(`/api/health`);
      if (!response.ok) throw new Error("Error obteniendo estado del sistema");
      return response.json();
    },
  },

  // 🔹 Dashboard
  dashboard: {
    getDashboard: async (userId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${userId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo dashboard");
      return response.json();
    },
    deleteDashboard: async (userId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${userId}/dashboard`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error eliminando dashboard");
      return response.json();
    },
  },

  // 🔹 Servicio de chat con IA
  chat: {
    sendMessage: async (message, sessionId) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, sessionId }),
      });
      if (!response.ok) throw new Error("Error en el chat");
      return response.json();
    },

    getSession: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/session/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo sesión de chat");
      return response.json();
    },
    updateSession: async (id, data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/session/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error actualizando sesión de chat");
      return response.json();
    },
    deleteSession: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/session/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error eliminando sesión de chat");
      return response.json();
    },
  },
  // 🔹 Rutas de aprendizaje
  learningPath: {
    generate: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/generate-learning-path`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error generando ruta de aprendizaje");
      return response.json();
    },
    update: async (pathId, data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/learning-path/${pathId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error actualizando ruta de aprendizaje");
      return response.json();
    },
    clone: async (pathId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/learning-path/${pathId}/clone`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error clonando ruta de aprendizaje");
      return response.json();
    },
  },

  // 🔹 Búsqueda principal
  search: {
    main: async (query) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error("Error en la búsqueda principal");
      return response.json();
    },
  },
};

export default apiServices;
