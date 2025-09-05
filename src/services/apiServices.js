// src/services/apiServices.js

// Aquí podrías importar axios si lo usas
// import axios from "axios";

const apiServices = {
  // 🔹 Servicio de autenticación
  auth: {
    login: async (credentials) => {
      // Ejemplo de login con fetch
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error("Error en login");
      const data = await response.json();

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);
      return data;
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
    getProfile: async () => {
      // Ejemplo de consulta al perfil
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo perfil");
      return response.json();
    },

    getProgress: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error obteniendo progreso");
      return response.json();
    },

    markResourceCompleted: async (resourceId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/resources/${resourceId}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error marcando recurso");
      return response.json();
    },
  },

  // 🔹 Servicios de cursos
  courses: {
    getAllCourses: async ({ limit = 10 }) => {
      const response = await fetch(`/api/courses?limit=${limit}`);
      if (!response.ok) throw new Error("Error obteniendo cursos");
      return response.json();
    },
  },

  // 🔹 Servicio de chat con IA
  chat: {
    sendMessage: async (message, conversationId) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, conversationId }),
      });
      if (!response.ok) throw new Error("Error en el chat");
      return response.json();
    },
  },
};

export default apiServices;
