import React from 'react';
import ChatIAPreview from './ChatIAPreview';
import ChatIAAuth from './ChatIAAuth';
import { useLocation } from 'react-router-dom';

// Rutas privadas: dashboard, mi-perfil, visualizador-rutas, mis-favoritos
const PRIVATE_ROUTES = [
  '/dashboard',
  '/mi-perfil',
  '/visualizador-rutas',
  '/mis-favoritos',
];

export default function FloatingChatSwitcher() {
  const location = useLocation();
  const isPrivate = PRIVATE_ROUTES.some(route => location.pathname.startsWith(route));
  // Solo renderiza el chat flotante correspondiente
  return isPrivate ? <ChatIAAuth /> : <ChatIAPreview />;
}
