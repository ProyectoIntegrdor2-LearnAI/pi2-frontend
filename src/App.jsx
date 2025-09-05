import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Headers
import HeaderPublic from "./components/HeaderPublic";
import HeaderDashboard from "./components/HeaderDashboard";

// Páginas públicas
import Home from "./pages/Home";
import QuienesSomos from "./pages/QuienesSomos";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import MisionVision from "./pages/MisionVision";
import Contacto from "./pages/Contacto";

// Páginas privadas (usuario logueado)
import Dashboard from "./pages/Dashboard";
import MiPerfil from "./pages/MiPerfil";
import MisCursos from "./pages/MisCursos";
import MisFavoritos from "./pages/MisFavoritos";

// Estilos
import "./styles/App.css";
import "./styles/components.css";
import "./styles/AuthModal.css";
import "./styles/Dashboard.css";

function AppContent() {
  const location = useLocation();

  // Detectar si está en dashboard o páginas privadas
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/mi-perfil") ||
    location.pathname.startsWith("/mis-cursos") ||
    location.pathname.startsWith("/mis-favoritos");

  return (
    <div className="App">
      {/* Header dinámico */}
      {isDashboardRoute ? <HeaderDashboard /> : <HeaderPublic />}

      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
          <Route path="/mision-vision" element={<MisionVision />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas privadas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/mis-cursos" element={<MisCursos />} />
          <Route path="/mis-favoritos" element={<MisFavoritos />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
//     login,
//     register,
//     logout,
//   }; 