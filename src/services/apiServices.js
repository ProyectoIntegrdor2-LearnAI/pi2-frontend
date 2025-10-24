// src/services/apiServices.js

import { normalizeToken, buildAuthorizationValue } from '../utils/tokenUtils';
import { LAMBDA_ENDPOINTS, API_PATHS } from '../config/endpoints';
import { ensureArray } from '../utils/apiData';

const DEFAULT_AUTH_FALLBACK = 'https://avouruymc3.execute-api.us-east-2.amazonaws.com/Prod';
const PLACEHOLDER_MARKERS = ['your-', 'example.com'];

const sanitizeUrl = (maybeUrl) =>
  typeof maybeUrl === 'string' ? maybeUrl.trim().replace(/\/+$/, '') : '';

const isUsableUrl = (maybeUrl) => {
  if (!maybeUrl) return false;
  const sanitized = sanitizeUrl(maybeUrl);
  if (!sanitized) return false;
  return !PLACEHOLDER_MARKERS.some((marker) => sanitized.includes(marker));
};

const resolveServiceUrl = (fallback, ...candidates) => {
  for (const candidate of candidates) {
    if (isUsableUrl(candidate)) {
      return sanitizeUrl(candidate);
    }
  }
  return sanitizeUrl(fallback);
};

const AUTH_BASE_URL = resolveServiceUrl(
  DEFAULT_AUTH_FALLBACK,
  process.env.REACT_APP_AUTH_API_URL,
  process.env.REACT_APP_AUTH_LAMBDA_URL,
  process.env.REACT_APP_API_BASE_URL,
  LAMBDA_ENDPOINTS?.AUTH
);

const COURSES_BASE_URL = resolveServiceUrl(
  'https://bqzuf5lilg.execute-api.us-east-2.amazonaws.com/Prod',
  process.env.REACT_APP_COURSES_API_URL,
  process.env.REACT_APP_COURSES_LAMBDA_URL,
  process.env.REACT_APP_SEARCH_LAMBDA_URL,
  LAMBDA_ENDPOINTS?.COURSES
);

const SERVICE_BASE_URLS = {
  AUTH: AUTH_BASE_URL,
  USER: AUTH_BASE_URL,
  CHAT: resolveServiceUrl(
    'https://your-chat-lambda.execute-api.us-east-2.amazonaws.com/Prod',
    process.env.REACT_APP_CHAT_API_URL,
    process.env.REACT_APP_CHAT_LAMBDA_URL,
    LAMBDA_ENDPOINTS?.CHAT
  ),
  LEARNING_PATH: resolveServiceUrl(
    AUTH_BASE_URL,
    process.env.REACT_APP_LEARNING_PATH_API_URL,
    process.env.REACT_APP_LEARNING_PATH_LAMBDA_URL,
    LAMBDA_ENDPOINTS?.LEARNING_PATH
  ),
  COURSES: COURSES_BASE_URL,
  ANALYTICS: resolveServiceUrl(
    AUTH_BASE_URL,
    process.env.REACT_APP_ANALYTICS_API_URL,
    process.env.REACT_APP_ANALYTICS_LAMBDA_URL,
    LAMBDA_ENDPOINTS?.ANALYTICS
  ),
  SEARCH: resolveServiceUrl(
    COURSES_BASE_URL,
    process.env.REACT_APP_SEARCH_API_URL,
    process.env.REACT_APP_SEARCH_LAMBDA_URL,
    LAMBDA_ENDPOINTS?.SEARCH,
    LAMBDA_ENDPOINTS?.COURSES
  ),
};

const MOCK_API = process.env.REACT_APP_MOCK_API === 'true';

const isChatEndpointConfigured = (() => {
  const base = SERVICE_BASE_URLS.CHAT || '';
  if (!base) {
    return false;
  }
  return !PLACEHOLDER_MARKERS.some((marker) => base.includes(marker));
})();

const ensureChatConfigured = () => {
  if (!isChatEndpointConfigured) {
    const error = new Error('CHAT_API_NOT_CONFIGURED');
    error.code = 'CHAT_API_NOT_CONFIGURED';
    throw error;
  }
};

const STORAGE_KEYS = ['token', 'authToken'];
const USER_STORAGE_KEY = 'learnia_user';

const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') return null;
  const candidateId =
    user.user_id ||
    user.id ||
    user.uuid ||
    user.userId ||
    user.user_uuid ||
    null;

  if (!candidateId) {
    return { ...user };
  }

  return {
    ...user,
    user_id: candidateId,
    id: user.id || candidateId,
  };
};

const persistToken = (token) => {
  if (!isBrowser()) return;
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) return;
  STORAGE_KEYS.forEach((key) => {
    try {
      window.localStorage.setItem(key, normalizedToken);
    } catch {
      // noop
    }
  });
};

const persistUser = (user) => {
  if (!isBrowser()) return;
  const normalizedUser = normalizeUser(user);
  if (!normalizedUser) return;
  try {
    window.localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(normalizedUser)
    );
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
      if (value) {
        const normalized = normalizeToken(value);
        if (normalized) return normalized;
      }
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
    const parsed = JSON.parse(value);
    return normalizeUser(parsed);
  } catch {
    return null;
  }
};

// ——————————————————————————————————————————
// Learning Path Cache Helpers
// ——————————————————————————————————————————

const LEARNING_PATH_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutos

// structuredClone fallback for older browsers
const cloneDeep = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch (error) {
      // fallback below
    }
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return value;
  }
};

const learningPathCacheState = {
  list: null,
  listFetchedAt: 0,
  listPromise: null,
  listPromiseMarker: null,
  byId: new Map(),
};

const nowTs = () => Date.now();

const resetLearningPathCachePromise = (promiseRef) => {
  if (learningPathCacheState.listPromise === promiseRef) {
    learningPathCacheState.listPromise = null;
  }
};

const clearLearningPathCache = () => {
  learningPathCacheState.list = null;
  learningPathCacheState.listFetchedAt = 0;
  learningPathCacheState.listPromise = null;
  learningPathCacheState.listPromiseMarker = null;
  learningPathCacheState.byId.clear();
};

const invalidateLearningPathListCache = () => {
  learningPathCacheState.list = null;
  learningPathCacheState.listFetchedAt = 0;
  learningPathCacheState.listPromise = null;
  learningPathCacheState.listPromiseMarker = null;
};

const invalidateLearningPathResponse = (pathId) => {
  if (!pathId) return;
  learningPathCacheState.byId.delete(String(pathId));
};

const isCacheEntryFresh = (timestamp) =>
  Boolean(timestamp) && nowTs() - timestamp <= LEARNING_PATH_CACHE_TTL_MS;

const getCachedLearningPathList = () => {
  if (!learningPathCacheState.list) {
    return null;
  }
  if (!isCacheEntryFresh(learningPathCacheState.listFetchedAt)) {
    invalidateLearningPathListCache();
    return null;
  }
  return cloneDeep(learningPathCacheState.list);
};

const cacheLearningPathList = (payload) => {
  learningPathCacheState.list = cloneDeep(payload);
  learningPathCacheState.listFetchedAt = nowTs();
};

const extractLearningPathFromPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  if (payload.learning_path && typeof payload.learning_path === 'object') {
    return payload.learning_path;
  }
  if (payload.path && typeof payload.path === 'object') {
    return payload.path;
  }
  if (payload.data && typeof payload.data === 'object') {
    return extractLearningPathFromPayload(payload.data);
  }
  if (payload.path_id || payload.pathId || payload.id) {
    return payload;
  }
  return null;
};

const cacheLearningPathResponse = (payload) => {
  const learningPath = extractLearningPathFromPayload(payload);
  const pathId =
    learningPath?.path_id ||
    learningPath?.pathId ||
    learningPath?.id ||
    payload?.path_id ||
    payload?.pathId ||
    payload?.id;

  if (!pathId) {
    return;
  }

  learningPathCacheState.byId.set(String(pathId), {
    payload: cloneDeep(payload),
    fetchedAt: nowTs(),
  });
};

const getCachedLearningPathResponse = (pathId) => {
  if (!pathId) {
    return null;
  }
  const entry = learningPathCacheState.byId.get(String(pathId));
  if (!entry) {
    return null;
  }
  if (!isCacheEntryFresh(entry.fetchedAt)) {
    invalidateLearningPathResponse(pathId);
    return null;
  }
  return cloneDeep(entry.payload);
};

const resolveTargetUserId = (userId) => {
  if (!userId || userId === 'profile' || userId === 'me') {
    return 'me';
  }
  return userId;
};

// Helper para construir URLs completas
const buildUrl = (endpoint = '', serviceKey = 'AUTH') => {
  if (endpoint && endpoint.startsWith('http')) return endpoint;

  const baseUrl = sanitizeUrl(SERVICE_BASE_URLS[serviceKey] || AUTH_BASE_URL);
  if (!endpoint) {
    return baseUrl;
  }

  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedPath}`;
};

const buildHeaders = (headers = {}, includeAuth = false) => {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const finalHeaders = { ...defaultHeaders, ...headers };

  if (includeAuth) {
    const token = getStoredToken();
    const authorization = buildAuthorizationValue(token);
    if (authorization) {
      finalHeaders.Authorization = authorization;
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

const executeFavoriteRequest = async (id, action) => {
  const storedUser = getStoredUser();
  const userId = storedUser?.user_id || storedUser?.id || storedUser?.sub || null;
  const extraHeaders = {};
  if (userId) {
    extraHeaders['X-User-Id'] = userId;
  }

  const body =
    action && typeof action === 'string'
      ? JSON.stringify({ action })
      : JSON.stringify({});

  const response = await fetch(buildUrl(API_PATHS.COURSES.FAVORITE(id), 'COURSES'), {
    method: 'POST',
    headers: buildHeaders(extraHeaders, true),
    body,
  });

  const payload = await handleResponse(response);
  return {
    courseId: payload?.course_id ?? id,
    isFavorite: Boolean(payload?.is_favorite ?? payload?.favorite ?? payload?.isFavorite),
    course:
      (payload?.course && normalizeCourse(payload.course)) ||
      (payload?.course_id ? { id: payload.course_id, course_id: payload.course_id } : null),
  };
};

const apiServices = {
  // 🔹 Servicio de autenticación
  auth: {
    login: async (credentials = {}) => {
      const response = await fetch(buildUrl(API_PATHS.AUTH.LOGIN), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const payload = await handleResponse(response);
      const rawToken = payload?.data?.token;
      const normalizedToken = normalizeToken(rawToken);
      const user = normalizeUser(payload?.data?.user);

      persistToken(rawToken);
      persistUser(user);

      return {
        ...payload,
        token: normalizedToken,
        rawToken,
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

      const response = await fetch(buildUrl(API_PATHS.AUTH.REGISTER), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payloadToSend),
      });

      const payload = await handleResponse(response);
      const rawToken = payload?.data?.token;
      const normalizedToken = normalizeToken(rawToken);
      const user = normalizeUser(payload?.data?.user);

      persistToken(rawToken);
      persistUser(user);

      return {
        ...payload,
        token: normalizedToken,
        rawToken,
        user,
      };
    },

    logout: async () => {
      const token = getStoredToken();
      let apiResult = null;

      if (token) {
        try {
          const response = await fetch(buildUrl(API_PATHS.AUTH.LOGOUT), {
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
      clearLearningPathCache();

      return apiResult ?? { success: true };
    },

    verifyToken: async () => {
      const token = getStoredToken();
      if (!token) {
        throw new Error('No hay token almacenado');
      }

      const response = await fetch(buildUrl(API_PATHS.USERS.PROFILE(), 'USER'), {
        method: 'GET',
        headers: buildHeaders({}, true),
      });

      const payload = await handleResponse(response);
      const user = normalizeUser(payload?.data?.user || payload?.user);

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
      const targetUserId = resolveTargetUserId(userId);
      const path = API_PATHS.USERS.PROFILE(targetUserId);

      try {
        const response = await fetch(buildUrl(path, 'USER'), {
          method: 'GET',
          headers: buildHeaders({}, true),
        });
        const payload = await handleResponse(response);
        const user = normalizeUser(payload?.data?.user || payload);
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

    getFavorites: async () => {
      const storedUser = getStoredUser();
      const userId = storedUser?.user_id || storedUser?.id || storedUser?.sub || null;
      const extraHeaders = {};
      if (userId) {
        extraHeaders['X-User-Id'] = userId;
      }
      const response = await fetch(buildUrl('/api/courses/favorites', 'COURSES'), {
        method: 'GET',
        headers: buildHeaders(extraHeaders, true),
      });
      return handleResponse(response);
    },

    getCurrentProfile: async () => apiServices.user.getProfile('profile'),

    getProgress: async (userId = 'profile') => {
      const targetUserId = resolveTargetUserId(userId);
      const path = API_PATHS.USERS.PROGRESS(targetUserId);

      const response = await fetch(buildUrl(path, 'USER'), {
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

      const targetUserId = resolveTargetUserId(userId);
      const path = API_PATHS.USERS.PROGRESS(targetUserId);

      const response = await fetch(buildUrl(path, 'USER'), {
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

      const targetUserId = resolveTargetUserId(userId);
      const path = API_PATHS.USERS.PROFILE_UPDATE(targetUserId);

      const response = await fetch(buildUrl(path, 'USER'), {
        method: 'PUT',
        headers: buildHeaders({}, true),
        body: JSON.stringify(payload),
      });

      const result = await handleResponse(response);
      const updatedUser = normalizeUser(result?.data?.user || result?.user);
      if (updatedUser) {
        persistUser(updatedUser);
      }
      return result;
    },
  },

  // 🔹 Servicios de cursos
  courses: {
    getAllCourses: async ({ limit = 10 } = {}) => {
      const url = new URL(buildUrl(API_PATHS.COURSES.TRENDING, 'COURSES'));
      if (limit !== undefined && limit !== null) {
        url.searchParams.set('limit', String(limit));
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: buildHeaders(),
      });
      const payload = await handleResponse(response);
      return ensureArray(payload?.courses ?? payload);
    },

    getCourseById: async (id) => {
      const response = await fetch(buildUrl(API_PATHS.COURSES.DETAIL(id), 'COURSES'), {
        method: 'GET',
        headers: buildHeaders(),
      });
      const payload = await handleResponse(response);
      return payload?.course ?? payload;
    },

    getCategories: async () => {
      const response = await fetch(buildUrl(API_PATHS.COURSES.CATEGORIES, 'COURSES'), {
        method: 'GET',
        headers: buildHeaders(),
      });
      const payload = await handleResponse(response);
      return ensureArray(payload?.categories ?? payload);
    },

    toggleFavorite: executeFavoriteRequest,
    addFavorite: (id) => executeFavoriteRequest(id, 'add'),
  },
  // 🔹 Analíticas
  analytics: {
    getPopularCourses: async () => {
      const response = await fetch(buildUrl(API_PATHS.ANALYTICS.POPULAR, 'ANALYTICS'), {
        method: 'GET',
        headers: buildHeaders(),
      });
      if (!response.ok) throw new Error('Error obteniendo cursos populares');
      return response.json();
    },
    getUserEngagement: async () => {
      const response = await fetch(buildUrl(API_PATHS.ANALYTICS.ENGAGEMENT, 'ANALYTICS'), {
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
      const targetUserId = resolveTargetUserId(userId);
      const path = API_PATHS.USERS.DASHBOARD(targetUserId);

      const response = await fetch(buildUrl(path, 'USER'), {
        method: 'GET',
        headers: buildHeaders({}, true),
      });
      return handleResponse(response);
    },
    deleteDashboard: async (userId = 'profile') => {
      const targetUserId = resolveTargetUserId(userId);
      const path = API_PATHS.USERS.DASHBOARD(targetUserId);

      const response = await fetch(buildUrl(path, 'USER'), {
        method: 'DELETE',
        headers: buildHeaders({}, true),
      });
      return handleResponse(response);
    },
  },

  // 🔹 Servicio de chat con IA
  chat: {
    sendMessage: async (message, sessionId, learningPathId) => {
      ensureChatConfigured();
      const storedUser = getStoredUser();
      const userId = storedUser?.user_id || storedUser?.id || null;
      const payload = {
        message,
        session_id: sessionId || undefined,
        learning_path_id: learningPathId,
        user_id: userId || undefined,
      };
      const extraHeaders = {};
      if (userId) {
        extraHeaders['X-User-Id'] = userId;
      }
      const response = await fetch(buildUrl(API_PATHS.CHAT.MESSAGE, 'CHAT'), {
        method: 'POST',
        headers: buildHeaders(extraHeaders, true),
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    },

    getHistory: async (sessionId) => {
      ensureChatConfigured();
      const storedUser = getStoredUser();
      const userId = storedUser?.user_id || storedUser?.id || null;
      const extraHeaders = {};
      if (userId) {
        extraHeaders['X-User-Id'] = userId;
      }
      const response = await fetch(
        buildUrl(API_PATHS.CHAT.HISTORY(sessionId), 'CHAT'),
        {
          method: 'GET',
          headers: buildHeaders(extraHeaders, true),
        }
      );
      return handleResponse(response);
    },

    listSessions: async (learningPathId) => {
      ensureChatConfigured();
      const storedUser = getStoredUser();
      const userId = storedUser?.user_id || storedUser?.id || null;
      const extraHeaders = {};
      if (userId) {
        extraHeaders['X-User-Id'] = userId;
      }
      const url = new URL(buildUrl(API_PATHS.CHAT.SESSIONS, 'CHAT'));
      if (learningPathId) {
        url.searchParams.set('learning_path_id', learningPathId);
      }
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: buildHeaders(extraHeaders, true),
      });
      return handleResponse(response);
    },

    deleteSession: async (sessionId) => {
      ensureChatConfigured();
      const storedUser = getStoredUser();
      const userId = storedUser?.user_id || storedUser?.id || null;
      const extraHeaders = {};
      if (userId) {
        extraHeaders['X-User-Id'] = userId;
      }
      const response = await fetch(
        buildUrl(API_PATHS.CHAT.SESSION(sessionId), 'CHAT'),
        {
          method: 'DELETE',
          headers: buildHeaders(extraHeaders, true),
        }
      );
      return handleResponse(response);
    },
  },
  // 🔹 Rutas de aprendizaje
  learningPath: {
    generate: async (data) => {
      const response = await fetch(
        buildUrl(API_PATHS.LEARNING_PATH.GENERATE, 'LEARNING_PATH'),
        {
          method: 'POST',
          headers: buildHeaders({}, true),
          body: JSON.stringify(data),
        }
      );
      const payload = await handleResponse(response);
      cacheLearningPathResponse(payload);
      invalidateLearningPathListCache();
      return payload;
    },
    list: async ({ forceRefresh = false } = {}) => {
      if (forceRefresh) {
        invalidateLearningPathListCache();
      } else {
        const cached = getCachedLearningPathList();
        if (cached) {
          return cached;
        }
        if (learningPathCacheState.listPromise) {
          return learningPathCacheState.listPromise;
        }
      }

      const requestMarker = Symbol('learningPathList');
      learningPathCacheState.listPromiseMarker = requestMarker;

      const requestPromise = (async () => {
        const response = await fetch(
          buildUrl(API_PATHS.LEARNING_PATH.LIST, 'USER'),
          {
            method: 'GET',
            headers: buildHeaders({}, true),
          }
        );
        const payload = await handleResponse(response);
        if (learningPathCacheState.listPromiseMarker === requestMarker) {
          cacheLearningPathList(payload);
        }
        return payload;
      })();

      learningPathCacheState.listPromise = requestPromise;
      requestPromise.finally(() => {
        resetLearningPathCachePromise(requestPromise);
        if (learningPathCacheState.listPromiseMarker === requestMarker) {
          learningPathCacheState.listPromiseMarker = null;
        }
      });

      return requestPromise;
    },
    get: async (pathId, { forceRefresh = false } = {}) => {
      if (!pathId) {
        throw new Error('pathId es requerido');
      }

      if (forceRefresh) {
        invalidateLearningPathResponse(pathId);
      } else {
        const cached = getCachedLearningPathResponse(pathId);
        if (cached) {
          return cached;
        }
      }

      const response = await fetch(
        buildUrl(API_PATHS.LEARNING_PATH.DETAIL(pathId), 'USER'),
        {
          method: 'GET',
          headers: buildHeaders({}, true),
        }
      );
      const payload = await handleResponse(response);
      cacheLearningPathResponse(payload);
      return payload;
    },
    update: async (pathId, data) => {
      invalidateLearningPathResponse(pathId);
      const response = await fetch(
        buildUrl(API_PATHS.LEARNING_PATH.UPDATE(pathId), 'LEARNING_PATH'),
        {
          method: 'PUT',
          headers: buildHeaders({}, true),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Error actualizando ruta de aprendizaje');
      const payload = await response.json();
      cacheLearningPathResponse(payload);
      invalidateLearningPathListCache();
      return payload;
    },
    updateCourse: async (pathId, courseId, data) => {
      invalidateLearningPathResponse(pathId);
      const response = await fetch(
        buildUrl(API_PATHS.LEARNING_PATH.COURSE_PROGRESS(pathId, courseId), 'USER'),
        {
          method: 'PATCH',
          headers: buildHeaders({}, true),
          body: JSON.stringify(data ?? {}),
        }
      );
      const payload = await handleResponse(response);
      cacheLearningPathResponse(payload);
      invalidateLearningPathListCache();
      return payload;
    },
    clone: async (pathId) => {
      const response = await fetch(
        buildUrl(API_PATHS.LEARNING_PATH.CLONE(pathId), 'LEARNING_PATH'),
        {
          method: 'POST',
          headers: buildHeaders({}, true),
        }
      );
      if (!response.ok) throw new Error('Error clonando ruta de aprendizaje');
      const payload = await response.json();
      cacheLearningPathResponse(payload);
      invalidateLearningPathListCache();
      return payload;
    },
  },

  // 🔹 Búsqueda principal
  search: {
    main: async ({ query = '', limit = 12, filters = {} } = {}) => {
      const response = await fetch(buildUrl(API_PATHS.SEARCH.MAIN, 'SEARCH'), {
        method: 'POST',
        headers: buildHeaders({}, true),
        body: JSON.stringify({ query, limit, filters }),
      });
      const payload = await handleResponse(response);
      const results = ensureArray(payload?.results ?? payload?.courses ?? payload);
      return {
        ...payload,
        results,
      };
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
    getUserId: () => {
      const user = getStoredUser();
      return user?.user_id || user?.id || null;
    },
    isMockMode: () => MOCK_API,
  },
};

export default apiServices;
