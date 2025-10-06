import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Estado del tema con valor inicial desde localStorage o 'claro' por defecto
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem('theme') || 'claro';
      } catch {
        return 'claro';
      }
    }
    return 'claro';
  });

  // Función para aplicar el tema al DOM
  const applyThemeToDOM = (newTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;
      
      // Remover clases de tema anteriores del root y body
      root.classList.remove('dark-theme', 'light-theme');
      body.classList.remove('dark-theme', 'light-theme');
      root.removeAttribute('data-theme');
      
      // Aplicar nuevo tema al root y body
      if (newTheme === 'oscuro') {
        root.classList.add('dark-theme');
        body.classList.add('dark-theme');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.add('light-theme');
        body.classList.add('light-theme');
        root.setAttribute('data-theme', 'light');
      }
    }
  };

  // Función para cambiar el tema
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    
    // Guardar en localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.error('Error guardando tema en localStorage:', error);
      }
    }
    
    // Aplicar al DOM
    applyThemeToDOM(newTheme);
  };

  // Función para obtener el tema actual
  const getCurrentTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem('theme') || 'claro';
      } catch {
        return 'claro';
      }
    }
    return 'claro';
  };

  // Función para verificar si es tema oscuro
  const isDarkTheme = () => {
    return theme === 'oscuro';
  };

  // Función para alternar entre temas
  const toggleTheme = () => {
    const newTheme = theme === 'claro' ? 'oscuro' : 'claro';
    changeTheme(newTheme);
  };

  // Efecto para aplicar el tema al cargar el componente
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Efecto para cargar el tema desde localStorage al iniciar
  useEffect(() => {
    const savedTheme = getCurrentTheme();
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
      applyThemeToDOM(savedTheme);
    }
  }, []);

  return {
    theme,
    changeTheme,
    getCurrentTheme,
    isDarkTheme,
    toggleTheme
  };
};