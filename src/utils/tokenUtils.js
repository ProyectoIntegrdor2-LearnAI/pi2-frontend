// src/utils/tokenUtils.js
// Utilidades para formatear y validar tokens de autenticación

export const normalizeToken = (token) => {
  if (!token || typeof token !== 'string') return '';
  return token.replace(/^Bearer\s*/i, '').trim();
};

export const buildAuthorizationValue = (token) => {
  const normalized = normalizeToken(token);
  return normalized ? `Bearer ${normalized}` : '';
};

export const hasBearerPrefix = (token) => /^Bearer\s+/i.test(token || '');
