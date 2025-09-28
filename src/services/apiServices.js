// src/services/apiServices.js

// Configuración de URLs base
const API_BASE_URL =
  process.env.REACT_APP_AUTH_LAMBDA_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'https://avouruymc3.execute-api.us-east-2.amazonaws.com/Prod';
const CHAT_API_URL = process.env.REACT_APP_CHAT_API_URL || API_BASE_URL;
const LEARNING_PATH_API_URL =
  process.env.REACT_APP_LEARNING_PATH_API_URL || API_BASE_URL;
const MOCK_API = process.env.REACT_APP_MOCK_API === 'true';

const STORAGE_KEYS = ['token', 'authToken'];
const USER_STORAGE_KEY = 'learnia_user';

const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const persistToken = (token) => {
  if (!token || !isBrowser()) return;
  STORAGE_KEYS.forEach((key) => {
    try {
      window.localStorage.setItem(key, token);
    } catch {
      // noop
    }
  });
};

const persistUser = (user) => {
  if (!user || !isBrowser()) return;
  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // noop
  }
};

const clearStoredToken = () => {
  if (!isBrowser()) return;
  STORAGE_KEYS.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // noop
    }
  });
};

const clearStoredUser = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // noop
  }
};

const getStoredToken = () => {
  if (!isBrowser()) return null;
  for (const key of STORAGE_KEYS) {
    try {
      const value = window.localStorage.getItem(key);
      if (value) return value;
    } catch {
      return null;
    }
  }
  return null;
};

const getStoredUser = () => {
  if (!isBrowser()) return null;
  try {
    const value = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!value) return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// Helper para construir URLs completas
const buildUrl = (endpoint, baseUrl = API_BASE_URL) => {
  if (!endpoint) return baseUrl;
  if (endpoint.startsWith('http')) return endpoint;
  return `${baseUrl}${endpoint}`;
};

const buildHeaders = (headers = {}, includeAuth = false) => {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const finalHeaders = { ...defaultHeaders, ...headers };

  if (includeAuth) {
    const token = getStoredToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  return finalHeaders;
};

const handleResponse = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data ?? {};
};

const apiServices = {
  // 🔹 Servicio de autenticación
  auth: {
    login: async (credentials = {}) => {
      const response = await fetch(buildUrl('/auth/login'), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const payload = await handleResponse(response);
      const token = payload?.data?.token;
      const user = payload?.data?.user;

      persistToken(token);
      persistUser(user);

      return {
        ...payload,
        token,
        user,
        expiresIn: payload?.data?.expiresIn,
      };
    },

    register: async (userData = {}) => {
      const payloadToSend = {
        identification:
          userData.identification || userData.cedula || userData.id || '',
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        address: userData.address,
        type_user: userData.type_user || 'student',
      };

      Object.keys(payloadToSend).forEach((key) => {
        if (
          payloadToSend[key] === undefined ||
          payloadToSend[key] === null ||
          payloadToSend[key] === ''
        ) {
          delete payloadToSend[key];
        }
      });

      const response = await fetch(buildUrl('/auth/register'), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payloadToSend),
      });

      const payload = await handleResponse(response);
      const token = payload?.data?.token;
      const user = payload?.data?.user;

      persistToken(token);
      persistUser(user);

      return {
        ...payload,
        token,
        user,
      };
    },

    logout: async () => {
      const token = getStoredToken();
      let apiResult = null;

      if (token) {
        try {
          const response = await fetch(buildUrl('/auth/logout'), {
            method: 'POST',
            headers: buildHeaders({}, true),
          });
          apiResult = await handleResponse(response);
        } catch (error) {
          console.warn(
            'Error al cerrar sesión en el servicio de autenticación:',
            error?.message || error
          );
        }
      }

      clearStoredToken();
      clearStoredUser();
      if (isBrowser()) {
        try {
          window.sessionStorage.clear();
        } catch {
          // noop
        }
      }

      return apiResult ?? { success: true };
    },

    verifyToken: async () => {
      const token = getStoredToken();
      if (!token) {
        throw new Error('No hay token almacenado');
      }

      const response = await fetch(buildUrl('/users/profile'), {
        method: 'GET',
        headers: buildHeaders({}, true),
      });

      const payload = await handleResponse(response);
      const user = payload?.data?.user || payload?.user;

      if (!user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      persistUser(user);

      return user;
    },
  },

  // 🔹 Servicios de usuario
  user: {
    getProfile: async (userId = 'profile') => {
      const storedUser = getStoredUser();
      const resolvedUserId =
        userId === 'profile'
          ? storedUser?.user_id || storedUser?.id || 'profile'
          : userId;

      try {
        const response = await fetch(buildUrl(`/users/${resolvedUserId}`), {
          method: 'GET',
          headers: buildHeaders({}, true),
        });
        const payload = await handleResponse(response);
        const user = payload?.data?.user || payload;
        if (user) {
          persistUser(user);
          return user;
        }
        if (storedUser) return storedUser;
        return user;
      } catch (error) {
        if (storedUser) {
          return storedUser;
        }
        throw error;
      }
    },

    getCurrentProfile: async () => apiServices.user.getProfile('profile'),

    getProgress: async (userId = 'profile') => {
      const storedUser = getStoredUser();
      const resolvedUserId =
        userId === 'profile'
          ? storedUser?.user_id || storedUser?.id || 'profile'
          : userId;

      const response = await fetch(buildUrl(`/users/${resolvedUserId}/progress`), {
        method: 'GET',
        headers: buildHeaders({}, true),
      });
      return handleResponse(response);
    },

    markResourceCompleted: async (userIdOrResourceId, maybeResourceId) => {
      let userId = 'profile';
      let resourceId = maybeResourceId;

      if (maybeResourceId === undefined) {
        resourceId = userIdOrResourceId;
      } else if (userIdOrResourceId) {
        userId = userIdOrResourceId;
      }

      if (!resourceId) {
        throw new Error('resourceId es requerido');
      }

      const storedUser = getStoredUser();
      const resolvedUserId =
        userId === 'profile'
          ? storedUser?.user_id || storedUser?.id || 'profile'
          : userId;

      const response = await fetch(buildUrl(`/users/${resolvedUserId}/progress`), {
        method: 'POST',
        headers: buildHeaders({}, true),
        body: JSON.stringify({ resourceId }),
      });
      return handleResponse(response);
    },

    updateProfile: async (userId = 'profile', profileData = {}) => {
      const payload = {};
      ['name', 'phone', 'address'].forEach((field) => {
        if (
          profileData[field] !== undefined &&
          profileData[field] !== null &&
          profileData[field] !== ''
        ) {
          payload[field] = profileData[field];
        }
      });

      const storedUser = getStoredUser();
      const resolvedUserId =
        userId === 'profile'
          ? storedUser?.user_id || storedUser?.id || 'profile'
          : userId;

      const response = await fetch(buildUrl(`/users/${resolvedUserId}/profile`), {
        method: 'PUT',
        headers: buildHeaders({}, true),
        body: JSON.stringify(payload),
      });

      const result = await handleResponse(response);
      const updatedUser = result?.data?.user || result?.user;
      if (updatedUser) {
        persistUser(updatedUser);
      }
      return result;
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
      const response = await fetch(`/api/courses/${id}/favorite`, {
        method: 'POST',
        headers: buildHeaders({}, true),
      });
      if (!response.ok) throw new Error('Error agregando a favoritos');
      return response.json();
    },
  },
  // 🔹 Analíticas
  analytics: {
    getPopularCourses: async () => {
      const response = await fetch(`/api/analytics/popular-courses`);
      if (!response.ok) throw new Error('Error obteniendo cursos populares');
      return response.json();
    },
    getUserEngagement: async () => {
      const response = await fetch(`/api/analytics/user-engagement`, {
        headers: buildHeaders({}, true),
      });
      if (!response.ok) throw new Error('Error obteniendo engagement');
      return response.json();
    },
  },

  // 🔹 Estado del sistema
  health: {
    getStatus: async () => {
      const response = await fetch(buildUrl('/health'), {
        method: 'GET',
        headers: buildHeaders(),
      });
      return handleResponse(response);
    },
    getInfo: async () => {
      const response = await fetch(buildUrl('/info'), {
        method: 'GET',
        headers: buildHeaders(),
      });
      return handleResponse(response);
    },
  },

  // 🔹 Dashboard
  dashboard: {
    getDashboard: async (userId = 'profile') => {
      const storedUser = getStoredUser();
      const resolvedUserId =
        userId === 'profile'
          ? storedUser?.user_id || storedUser?.id || 'profile'
          : userId;

      const response = await fetch(buildUrl(`/users/${resolvedUserId}/dashboard`), {
        method: 'GET',
        headers: buildHeaders({}, true),
      });
      return handleResponse(response);
    },
    deleteDashboard: async (userId = 'profile') => {
      const storedUser = getStoredUser();
      const resolvedUserId =
        userId === 'profile'
          ? storedUser?.user_id || storedUser?.id || 'profile'
          : userId;

      const response = await fetch(buildUrl(`/users/${resolvedUserId}/dashboard`), {
        method: 'DELETE',
        headers: buildHeaders({}, true),
      });
      return handleResponse(response);
    },
  },

  // 🔹 Servicio de chat con IA
  chat: {
    sendMessage: async (message, sessionId) => {
      const response = await fetch(buildUrl("/api/chat/session", CHAT_API_URL), {
        method: 'POST',
        headers: buildHeaders({}, true),
        body: JSON.stringify({ message, sessionId }),
      });
      if (!response.ok) throw new Error('Error en el chat');
      return response.json();
    },

    getSession: async (id) => {
      const response = await fetch(buildUrl(`/api/chat/session/${id}`, CHAT_API_URL), {
        headers: buildHeaders({}, true),
      });
      if (!response.ok) throw new Error('Error obteniendo sesión de chat');
      return response.json();
    },
    updateSession: async (id, data) => {
      const response = await fetch(buildUrl(`/api/chat/session/${id}`, CHAT_API_URL), {
        method: 'PUT',
        headers: buildHeaders({}, true),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error actualizando sesión de chat');
      return response.json();
    },
    deleteSession: async (id) => {
      const response = await fetch(buildUrl(`/api/chat/session/${id}`, CHAT_API_URL), {
        method: 'DELETE',
        headers: buildHeaders({}, true),
      });
      if (!response.ok) throw new Error('Error eliminando sesión de chat');
      return response.json();
    },
  },
  // 🔹 Rutas de aprendizaje
  learningPath: {
    generate: async (data) => {
      const response = await fetch(
        buildUrl(`/api/generate-learning-path`, LEARNING_PATH_API_URL),
        {
          method: 'POST',
          headers: buildHeaders({}, true),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Error generando ruta de aprendizaje');
      return response.json();
    },
    update: async (pathId, data) => {
      const response = await fetch(
        buildUrl(`/api/learning-path/${pathId}`, LEARNING_PATH_API_URL),
        {
          method: 'PUT',
          headers: buildHeaders({}, true),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Error actualizando ruta de aprendizaje');
      return response.json();
    },
    clone: async (pathId) => {
      const response = await fetch(
        buildUrl(`/api/learning-path/${pathId}/clone`, LEARNING_PATH_API_URL),
        {
          method: 'POST',
          headers: buildHeaders({}, true),
        }
      );
      if (!response.ok) throw new Error('Error clonando ruta de aprendizaje');
      return response.json();
    },
  },

  // 🔹 Búsqueda principal
  search: {
    main: async (query) => {
      const response = await fetch(`/api/search`, {
        method: 'POST',
        headers: buildHeaders({}, true),
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error('Error en la búsqueda principal');
      return response.json();
    },
  },

  // Utilidades compartidas
  utils: {
    persistToken,
    clearStoredToken,
    getStoredToken,
    persistUser,
    getStoredUser,
    clearStoredUser,
    isMockMode: () => MOCK_API,
  },
};

export default apiServices;
